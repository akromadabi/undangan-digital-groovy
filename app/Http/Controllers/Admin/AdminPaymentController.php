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
        if ($user->isReseller() && $payment->user->reseller_id !== $user->id) {
            abort(403, 'Akses ditolak.');
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

        // Create subscription
        Subscription::create([
            'user_id'       => $payment->user_id,
            'plan_id'       => $payment->plan_id,
            'invitation_id' => $payment->invitation_id,
            'payment_id'    => $payment->id,
            'starts_at'     => now(),
            'expires_at'    => now()->addDays($payment->plan->duration_days),
            'status'        => 'active',
        ]);

        return back()->with('success', "Pembayaran disetujui. Langganan {$payment->user->name} telah diaktifkan.");
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
