<?php

namespace App\Http\Controllers;

use App\Models\ResellerSetting;
use App\Models\SubscriptionPlan;
use App\Models\ResellerPlanPrice;
use Inertia\Inertia;

class ResellerLandingPageController extends Controller
{
    /**
     * Show the reseller's landing/registration page.
     * URL: /r/{subdomain}
     */
    public function show(string $subdomain)
    {
        $setting = ResellerSetting::where('subdomain', $subdomain)
            ->where('is_active', true)
            ->first();

        if (!$setting) {
            abort(404, 'Reseller tidak ditemukan.');
        }

        $reseller = $setting->reseller;

        // Get plans with reseller pricing
        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $resellerPrices = ResellerPlanPrice::where('reseller_id', $reseller->id)
            ->pluck('reseller_price', 'plan_id');

        $plansData = $plans->map(function ($plan) use ($resellerPrices) {
            return [
                'name' => $plan->name,
                'slug' => $plan->slug,
                'price' => isset($resellerPrices[$plan->id])
                    ? (float)$resellerPrices[$plan->id]
                    : (float)$plan->price,
                'duration_days' => $plan->duration_days,
                'max_guests' => $plan->max_guests,
                'max_galleries' => $plan->max_galleries,
                'description' => $plan->description,
            ];
        });

        // Get themes for gallery
        $themes = \App\Models\Theme::where('is_active', true)
            ->select('id', 'name', 'thumbnail', 'category', 'is_premium')
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('ResellerLanding', [
            'reseller' => [
                'brand_name' => $setting->brand_name ?: $reseller->name,
                'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                'ref' => $subdomain,
                'template' => $setting->landing_page_template ?: 'default',
            ],
            'plans' => $plansData,
            'themes' => $themes,
        ]);
    }
}
