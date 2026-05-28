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

        $plans = SubscriptionPlan::with('featureAccess.feature')
            ->orderBy('sort_order')
            ->get();

        $resellerPrices = ResellerPlanPrice::where('reseller_id', $reseller->id)
            ->pluck('reseller_price', 'plan_id');

        // Merge plan data with reseller prices and feature details
        $planPricing = $plans->map(fn($plan) => [
            'id' => $plan->id,
            'name' => $plan->name,
            'slug' => $plan->slug,
            'base_price' => (float) $plan->price,
            'suggested_price' => $plan->suggested_price !== null ? (float) $plan->suggested_price : null,
            'reseller_price' => isset($resellerPrices[$plan->id])
                ? (float) $resellerPrices[$plan->id]
                : (float) $plan->price,
            'duration_days' => $plan->duration_days,
            'max_guests' => $plan->max_guests,
            'max_galleries' => $plan->max_galleries,
            'feature_access' => $plan->featureAccess->map(function ($fa) {
                return [
                    'feature_id' => $fa->feature_id,
                    'is_enabled' => (bool)$fa->is_enabled,
                    'feature' => $fa->feature ? [
                        'id' => $fa->feature->id,
                        'name' => $fa->feature->name,
                        'slug' => $fa->feature->slug,
                        'category' => $fa->feature->category,
                    ] : null,
                ];
            })->toArray(),
        ]);

        // Fetch global features for comparison details
        $features = \App\Models\Feature::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/Pricing', [
            'planPricing' => $planPricing,
            'features' => $features,
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
