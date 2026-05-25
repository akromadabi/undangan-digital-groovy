<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\ResellerPlanPrice;
use App\Models\SubscriptionPlan;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Show pricing / upgrade page.
     * Uses reseller custom prices if user belongs to a reseller.
     */
    public function pricing()
    {
        $plans = SubscriptionPlan::with('featureAccess.feature')
            ->orderBy('sort_order')
            ->get();
        $user = auth()->user();
        $currentPlan = $user->activeSubscription?->plan;
        $features = \App\Models\Feature::orderBy('category')->orderBy('name')->get();

        // If user belongs to a reseller, overlay custom prices
        $resellerPrices = [];
        if ($user->reseller_id) {
            $resellerPrices = ResellerPlanPrice::where('reseller_id', $user->reseller_id)
                ->pluck('reseller_price', 'plan_id')
                ->toArray();
        }

        // Override plan prices with reseller prices for display
        $plansData = $plans->map(function ($plan) use ($resellerPrices) {
            $planArray = $plan->toArray();
            if (isset($resellerPrices[$plan->id])) {
                $planArray['display_price'] = (float)$resellerPrices[$plan->id];
                $planArray['original_price'] = (float)$plan->price;
            } else {
                $planArray['display_price'] = (float)$plan->price;
            }
            return $planArray;
        });

        return Inertia::render('Dashboard/Pricing', [
            'plans' => $plansData,
            'currentPlan' => $currentPlan,
            'features' => $features,
        ]);
    }

    /**
     * Create payment and redirect to Xendit invoice.
     * Uses reseller custom price if applicable.
     */
    public function checkout(Request $request)
    {
        $request->validate(['plan_id' => 'required|exists:subscription_plans,id']);

        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $user = auth()->user();

        // Determine actual price: reseller price or base price
        $price = (float)$plan->price;
        if ($user->reseller_id) {
            $resellerPrice = ResellerPlanPrice::where('reseller_id', $user->reseller_id)
                ->where('plan_id', $plan->id)
                ->first();
            if ($resellerPrice) {
                $price = (float)$resellerPrice->reseller_price;
            }
        }

        if ($price <= 0) {
            return back()->with('error', 'Paket ini gratis, tidak perlu pembayaran.');
        }

        // Intercept reseller checkout for manual bank transfer
        if ($user->reseller_id) {
            $existingPendingManual = Payment::where('user_id', $user->id)
                ->where('plan_id', $plan->id)
                ->whereIn('status', ['pending_manual', 'waiting_review'])
                ->where('payment_gateway', 'manual')
                ->where('created_at', '>', now()->subHours(24))
                ->first();

            if ($existingPendingManual) {
                return redirect()->route('payment.manual.show', $existingPendingManual->id);
            }

            $payment = Payment::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'amount' => $price,
                'payment_method' => 'transfer',
                'payment_gateway' => 'manual',
                'status' => 'pending_manual',
            ]);

            return redirect()->route('payment.manual.show', $payment->id);
        }

        // Check for existing pending payment
        $existingPending = Payment::where('user_id', $user->id)
            ->where('plan_id', $plan->id)
            ->where('status', 'pending')
            ->where('created_at', '>', now()->subHours(24))
            ->first();

        if ($existingPending && !empty($existingPending->metadata['invoice_url'])) {
            return Inertia::location($existingPending->metadata['invoice_url']);
        }

        // Create payment record with reseller price
        $payment = Payment::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'amount' => $price,
            'payment_gateway' => 'xendit',
            'status' => 'pending',
        ]);

        $xendit = new XenditService();

        if (!$xendit->isConfigured()) {
            $payment->delete();
            return back()->with('error', 'Payment gateway belum dikonfigurasi. Hubungi admin.');
        }

        $result = $xendit->createInvoice($payment);

        if ($result['success']) {
            return Inertia::location($result['invoice_url']);
        }

        $payment->update(['status' => 'failed']);
        return back()->with('error', $result['error'] ?? 'Gagal membuat pembayaran.');
    }

    /**
     * Payment history page.
     */
    public function history()
    {
        $payments = Payment::where('user_id', auth()->id())
            ->with('plan')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Dashboard/PaymentHistory', [
            'payments' => $payments,
        ]);
    }

    /**
     * Handle Xendit webhook.
     */
    public function webhook(Request $request)
    {
        $xendit = new XenditService();

        // Verify webhook token
        $callbackToken = $request->header('x-callback-token');
        if ($callbackToken && !$xendit->verifyWebhookToken($callbackToken)) {
            return response()->json(['error' => 'Invalid token'], 403);
        }

        $payload = $request->all();
        $xendit->handleWebhook($payload);

        return response()->json(['status' => 'ok']);
    }

    /**
     * Show manual payment bank details and proof upload form.
     */
    public function showManualPayment(Payment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        if ($payment->payment_gateway !== 'manual') {
            return redirect()->route('payment.pricing');
        }

        $payment->load('plan');

        $resellerSetting = \App\Models\ResellerSetting::where('user_id', $payment->user->reseller_id)->first();
        
        $bankAccounts = [];
        if ($resellerSetting && $resellerSetting->bank_name) {
            $bankAccounts[] = [
                'bank_name' => $resellerSetting->bank_name,
                'account_number' => $resellerSetting->bank_account,
                'account_name' => $resellerSetting->bank_holder,
            ];
        }

        $resellerContact = null;
        if ($resellerSetting) {
            $resellerContact = [
                'brand_name' => $resellerSetting->brand_name,
                'whatsapp' => $resellerSetting->footer_whatsapp,
                'phone' => $resellerSetting->footer_phone,
                'email' => $resellerSetting->footer_email,
            ];
        }

        return Inertia::render('Dashboard/ManualPayment', [
            'payment' => $payment,
            'bankAccounts' => $bankAccounts,
            'resellerContact' => $resellerContact,
        ]);
    }

    /**
     * Handle manual payment proof image upload.
     */
    public function uploadProof(Request $request, Payment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        $request->validate([
            'proof' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('proof')) {
            $file = $request->file('proof');

            \App\Helpers\ImageCompressor::compress($file);

            $path = $file->store('payment/proofs', 'public');

            $payment->update([
                'proof_image' => $path,
                'status' => 'waiting_review',
            ]);

            return back()->with('success', 'Bukti transfer berhasil diunggah. Menunggu verifikasi admin.');
        }

        return back()->with('error', 'Gagal mengunggah bukti transfer.');
    }

    /**
     * Cancel manual payment.
     */
    public function cancelPayment(Payment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        if ($payment->status === 'paid') {
            return back()->with('error', 'Pembayaran yang sudah lunas tidak dapat dibatalkan.');
        }

        $payment->update(['status' => 'cancelled']);

        return redirect()->route('payment.pricing')->with('success', 'Pembayaran dibatalkan.');
    }
}
