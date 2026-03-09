<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\SubscriptionPlan;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Show pricing / upgrade page.
     */
    public function pricing()
    {
        $plans = SubscriptionPlan::with('featureAccess.feature')
            ->orderBy('sort_order')
            ->get();
        $user = auth()->user();
        $currentPlan = $user->activeSubscription?->plan;
        $features = \App\Models\Feature::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Dashboard/Pricing', [
            'plans' => $plans,
            'currentPlan' => $currentPlan,
            'features' => $features,
        ]);
    }

    /**
     * Create payment and redirect to Xendit invoice.
     */
    public function checkout(Request $request)
    {
        $request->validate(['plan_id' => 'required|exists:subscription_plans,id']);

        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $user = auth()->user();

        if ($plan->price <= 0) {
            return back()->with('error', 'Paket ini gratis, tidak perlu pembayaran.');
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

        // Create payment record
        $payment = Payment::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'amount' => $plan->price,
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
}
