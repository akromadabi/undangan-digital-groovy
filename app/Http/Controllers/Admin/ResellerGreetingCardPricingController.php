<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResellerPlanPrice;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResellerGreetingCardPricingController extends Controller
{
    public function index()
    {
        $reseller = auth()->user();

        // Get greeting card plans
        $plans = SubscriptionPlan::where('type', 'greeting_card')
            ->orderBy('sort_order')
            ->get();

        $resellerPrices = ResellerPlanPrice::where('reseller_id', $reseller->id)
            ->pluck('reseller_price', 'plan_id');

        // Merge base price and reseller price
        $planPricing = $plans->map(fn($plan) => [
            'id'              => $plan->id,
            'name'            => $plan->name,
            'slug'            => $plan->slug,
            'description'     => $plan->description,
            'base_price'      => (float) $plan->price,
            'suggested_price' => $plan->suggested_price !== null ? (float) $plan->suggested_price : null,
            'reseller_price'  => isset($resellerPrices[$plan->id])
                ? (float) $resellerPrices[$plan->id]
                : (float) $plan->price,
            'duration_days'   => $plan->duration_days,
            'max_galleries'   => $plan->max_galleries,
        ]);

        return Inertia::render('Admin/ResellerGreetingCardPricing', [
            'planPricing' => $planPricing,
        ]);
    }

    public function update(Request $request)
    {
        $reseller = auth()->user();

        $request->validate([
            'prices'                  => 'required|array',
            'prices.*.plan_id'        => 'required|exists:subscription_plans,id',
            'prices.*.reseller_price' => 'required|numeric|min:0',
        ]);

        foreach ($request->prices as $priceData) {
            $plan = SubscriptionPlan::where('type', 'greeting_card')->find($priceData['plan_id']);
            
            if ($plan && $priceData['reseller_price'] < $plan->price) {
                return back()->withErrors([
                    'prices' => "Harga jual untuk paket {$plan->name} tidak boleh lebih rendah dari harga dasar (Rp " . number_format($plan->price, 0, ',', '.') . ").",
                ]);
            }

            ResellerPlanPrice::updateOrCreate(
                [
                    'reseller_id' => $reseller->id,
                    'plan_id'     => $priceData['plan_id'],
                ],
                [
                    'reseller_price' => $priceData['reseller_price'],
                ]
            );
        }

        return back()->with('success', 'Harga paket kartu ucapan berhasil diperbarui.');
    }
}
