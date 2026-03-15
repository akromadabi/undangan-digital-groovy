<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResellerPlanPrice;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResellerPricingController extends Controller
{
    public function index()
    {
        $reseller = auth()->user();

        $plans = SubscriptionPlan::orderBy('sort_order')->get(['id', 'name', 'slug', 'price']);

        $resellerPrices = ResellerPlanPrice::where('reseller_id', $reseller->id)
            ->pluck('reseller_price', 'plan_id');

        // Merge plan data with reseller prices
        $planPricing = $plans->map(fn($plan) => [
            'id' => $plan->id,
            'name' => $plan->name,
            'slug' => $plan->slug,
            'base_price' => (float) $plan->price,
            'reseller_price' => isset($resellerPrices[$plan->id])
                ? (float) $resellerPrices[$plan->id]
                : (float) $plan->price,
        ]);

        return Inertia::render('Admin/Pricing', [
            'planPricing' => $planPricing,
        ]);
    }

    public function update(Request $request)
    {
        $reseller = auth()->user();

        $request->validate([
            'prices' => 'required|array',
            'prices.*.plan_id' => 'required|exists:subscription_plans,id',
            'prices.*.reseller_price' => 'required|numeric|min:0',
        ]);

        foreach ($request->prices as $priceData) {
            // Ensure reseller_price >= base_price
            $plan = SubscriptionPlan::find($priceData['plan_id']);
            if ($plan && $priceData['reseller_price'] < $plan->price) {
                return back()->withErrors([
                    'prices' => "Harga jual untuk paket {$plan->name} tidak boleh lebih rendah dari harga dasar (Rp " . number_format($plan->price, 0, ',', '.') . ").",
                ]);
            }

            ResellerPlanPrice::updateOrCreate(
                [
                    'reseller_id' => $reseller->id,
                    'plan_id' => $priceData['plan_id'],
                ],
                [
                    'reseller_price' => $priceData['reseller_price'],
                ]
            );
        }

        return back()->with('success', 'Harga paket berhasil diperbarui.');
    }
}
