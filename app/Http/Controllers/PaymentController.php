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
}
