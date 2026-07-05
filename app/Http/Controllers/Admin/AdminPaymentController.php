<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    /**
     * All transactions — monitoring page.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Payment::with(['user', 'plan'])
            ->orderByDesc('created_at');

        if ($user->isReseller()) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('reseller_id', $user->id);
            });
        }

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by method
        if ($request->method && $request->method !== 'all') {
            $query->where('payment_gateway', $request->method);
        }

        // Search user name / email
        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $payments = $query->paginate(20)->withQueryString();

        if ($user->isReseller()) {
            $pendingCount = Payment::where('status', 'waiting_review')
                ->whereHas('user', function ($q) use ($user) {
                    $q->where('reseller_id', $user->id);
                })
                ->count();
        } else {
            $pendingCount = Payment::where('status', 'waiting_review')->count();
        }

        return Inertia::render('Admin/Transactions/Index', [
            'payments'     => $payments,
            'pendingCount' => $pendingCount,
            'filters'      => $request->only(['status', 'method', 'search']),
        ]);
    }

    /**
     * Show a single transaction detail (for manual review).
     */
    public function show(Payment $payment)
    {
        $user = auth()->user();
        if ($user->isReseller() && $payment->user->reseller_id !== $user->id) {
            abort(403, 'Akses ditolak. Transaksi ini bukan milik pelanggan Anda.');
        }

        $payment->load(['user', 'plan', 'subscription']);

        return Inertia::render('Admin/Transactions/Detail', [
            'payment' => $payment,
        ]);
    }

    /**
     * Approve a manual payment → activate subscription.
     */
    public function approve(Request $request, Payment $payment)
    {
        $user = auth()->user();
        if ($user->isReseller()) {
            abort(403, 'Akses ditolak. Reseller tidak dapat menyetujui transaksi secara langsung. Silakan bayar harga modal.');
        }

        if (!in_array($payment->status, ['waiting_review', 'pending_manual'])) {
            return back()->with('error', 'Pembayaran tidak dalam status yang dapat disetujui.');
        }

        // Mark payment as paid
        $payment->update([
            'status'      => 'paid',
            'paid_at'     => now(),
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'admin_notes' => $request->notes ?? null,
        ]);

        // Create subscription or activate greeting card
        if ($payment->greeting_card_id) {
            $payment->greetingCard()->update(['is_active' => true]);

            Subscription::create([
                'user_id'          => $payment->user_id,
                'greeting_card_id' => $payment->greeting_card_id,
                'plan_id'          => $payment->plan_id,
                'payment_id'       => $payment->id,
                'starts_at'        => now(),
                'expires_at'       => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                'status'           => 'active',
            ]);
        } else {
            Subscription::create([
                'user_id'       => $payment->user_id,
                'plan_id'       => $payment->plan_id,
                'invitation_id' => $payment->invitation_id,
                'payment_id'    => $payment->id,
                'starts_at'     => now(),
                'expires_at'    => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                'status'        => 'active',
            ]);
        }

        // Credit profit / debit cost based on settings
        $client = $payment->user;
        if ($client && $client->reseller_id && $payment->plan_id) {
            $resellerSetting = \App\Models\ResellerSetting::where('user_id', $client->reseller_id)->first();
            $paymentMode = $resellerSetting ? $resellerSetting->payment_mode : 'admin';
            $basePrice = (float)$payment->plan->price;

            if ($paymentMode === 'manual' || $paymentMode === 'reseller_gateway') {
                \App\Models\ResellerWallet::debitCost(
                    $client->reseller_id,
                    $payment->id,
                    $basePrice,
                    "Biaya modal paket {$payment->plan->name} - Pelanggan {$client->name} (Disetujui Admin)"
                );
            } else {
                $paidAmount = (float)$payment->amount;
                $profit = $paidAmount - $basePrice;

                if ($profit > 0) {
                    \App\Models\ResellerWallet::creditProfit(
                        $client->reseller_id,
                        $payment->id,
                        $profit,
                        "Profit dari {$client->name} - Paket {$payment->plan->name} (Disetujui Admin)"
                    );
                }
            }
        }

        // Trigger WA automatic notifications
        try {
            $waService = new \App\Services\WhatsAppService();
            $waService->triggerPaymentNotifications($payment, $profit ?? 0);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Approve Payment Notify Error: ' . $e->getMessage());
        }

        return back()->with('success', "Pembayaran disetujui.");
    }

    /**
     * Approve manual payment by reseller using wallet balance to pay base cost.
     */
    public function approveViaWallet(Payment $payment)
    {
        $user = auth()->user();
        if (!$user->isReseller() || $payment->user->reseller_id !== $user->id) {
            abort(403, 'Akses ditolak.');
        }

        if (!in_array($payment->status, ['waiting_review', 'pending_manual'])) {
            return back()->with('error', 'Pembayaran tidak dalam status yang dapat diaktifkan.');
        }

        $basePrice = $payment->plan ? (float)$payment->plan->price : 0;
        
        // Check wallet balance
        $wallet = \App\Models\ResellerWallet::firstOrCreate(['reseller_id' => $user->id], ['balance' => 0]);
        if ($wallet->balance < $basePrice) {
            return back()->with('error', 'Saldo dompet Anda tidak cukup untuk membayar biaya modal (Rp ' . number_format($basePrice, 0, ',', '.') . '). Silakan lakukan pembayaran online.');
        }

        // Deduct wallet balance
        \App\Models\ResellerWallet::debitCost(
            $user->id,
            $payment->id,
            $basePrice,
            "Aktivasi manual pelanggan {$payment->user->name} - Paket {$payment->plan->name}"
        );

        // Mark customer payment as paid
        $payment->update([
            'status'      => 'paid',
            'paid_at'     => now(),
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'admin_notes' => 'Diaktifkan oleh reseller menggunakan Saldo Dompet.',
        ]);

        // Activate customer subscription
        if ($payment->greeting_card_id) {
            $payment->greetingCard()->update(['is_active' => true]);

            Subscription::create([
                'user_id'          => $payment->user_id,
                'greeting_card_id' => $payment->greeting_card_id,
                'plan_id'          => $payment->plan_id,
                'payment_id'       => $payment->id,
                'starts_at'        => now(),
                'expires_at'       => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                'status'           => 'active',
            ]);
        } else {
            Subscription::create([
                'user_id'       => $payment->user_id,
                'plan_id'       => $payment->plan_id,
                'invitation_id' => $payment->invitation_id,
                'payment_id'    => $payment->id,
                'starts_at'     => now(),
                'expires_at'    => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                'status'        => 'active',
            ]);
        }

        return back()->with('success', 'Undangan pelanggan berhasil diaktifkan dengan memotong Saldo Dompet.');
    }

    /**
     * Approve manual payment by reseller paying base cost online.
     */
    public function approveViaOnline(Payment $payment)
    {
        $user = auth()->user();
        if (!$user->isReseller() || $payment->user->reseller_id !== $user->id) {
            abort(403, 'Akses ditolak.');
        }

        if (!in_array($payment->status, ['waiting_review', 'pending_manual'])) {
            return back()->with('error', 'Pembayaran tidak dalam status yang dapat diaktifkan.');
        }

        $basePrice = $payment->plan ? (float)$payment->plan->price : 0;

        if ($basePrice <= 0) {
            // Modal gratis, langsung aktifkan
            $payment->update([
                'status'      => 'paid',
                'paid_at'     => now(),
                'reviewed_by' => $user->id,
                'reviewed_at' => now(),
                'admin_notes' => 'Diaktifkan gratis (modal Rp 0).',
            ]);
            
            if ($payment->greeting_card_id) {
                $payment->greetingCard()->update(['is_active' => true]);
                Subscription::create([
                    'user_id'          => $payment->user_id,
                    'greeting_card_id' => $payment->greeting_card_id,
                    'plan_id'          => $payment->plan_id,
                    'payment_id'       => $payment->id,
                    'starts_at'        => now(),
                    'expires_at'       => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                    'status'           => 'active',
                ]);
            } else {
                Subscription::create([
                    'user_id'       => $payment->user_id,
                    'plan_id'       => $payment->plan_id,
                    'invitation_id' => $payment->invitation_id,
                    'payment_id'    => $payment->id,
                    'starts_at'     => now(),
                    'expires_at'    => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                    'status'        => 'active',
                ]);
            }
            return back()->with('success', 'Langganan pelanggan berhasil diaktifkan.');
        }

        // Create temporary reseller payment of amount = base price to admin
        $modalPayment = Payment::create([
            'user_id' => $user->id,
            'plan_id' => $payment->plan_id,
            'invitation_id' => $payment->invitation_id,
            'greeting_card_id' => $payment->greeting_card_id,
            'parent_payment_id' => $payment->id,
            'amount' => $basePrice,
            'status' => 'pending',
        ]);

        $siappPay = new \App\Services\SiappPayService();
        if ($siappPay->isConfigured()) {
            $result = $siappPay->createTransaction($modalPayment, 'QRIS');
            if ($result['success']) {
                return Inertia::location($result['invoice_url']);
            }
        }

        $midtrans = new \App\Services\MidtransService();
        if ($midtrans->isConfigured()) {
            $result = $midtrans->createInvoice($modalPayment);
            if ($result['success']) {
                return Inertia::location($result['invoice_url']);
            }
        }

        $modalPayment->delete();
        return back()->with('error', 'Gerbang pembayaran online platform (pay.siapp.in / Midtrans) belum dikonfigurasi.');
    }

    /**
     * Reject a manual payment.
     */
    public function reject(Request $request, Payment $payment)
    {
        $user = auth()->user();
        if ($user->isReseller() && $payment->user->reseller_id !== $user->id) {
            abort(403, 'Akses ditolak.');
        }

        $request->validate(['notes' => 'required|string|max:500']);

        if (!in_array($payment->status, ['waiting_review', 'pending_manual'])) {
            return back()->with('error', 'Pembayaran tidak dalam status yang dapat ditolak.');
        }

        $payment->update([
            'status'      => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'admin_notes' => $request->notes,
        ]);

        return back()->with('success', 'Pembayaran telah ditolak.');
    }
}
