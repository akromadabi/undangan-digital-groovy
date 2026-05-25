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
            ->select('id', 'name', 'slug', 'thumbnail', 'category', 'is_premium', 'base_likes', 'real_likes', 'preview_url')
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($theme) {
                $theme->preview_url = route('demo.theme', ['slug' => $theme->slug]);
                return $theme;
            });
 
        $appUrl = config('app.url');
        $parsed = parse_url($appUrl);
        $scheme = $parsed['scheme'] ?? 'http';
        $host = $parsed['host'] ?? 'undangan-digital.test';
        $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
 
        if ($setting->custom_domain) {
            $resellerUrl = $scheme . '://' . $setting->custom_domain . $port;
        } else {
            $resellerUrl = $scheme . '://' . $subdomain . '.' . $host . $port;
        }
 
        return Inertia::render('ResellerLanding', [
            'reseller' => [
                'brand_name' => $setting->brand_name ?: $reseller->name,
                'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                'ref' => $subdomain,
                'reseller_url' => $resellerUrl,
                'template' => $setting->landing_page_template ?: 'default',
                'site_title' => $setting->site_title,
                'site_motto' => $setting->site_motto,
                'footer_whatsapp' => $setting->footer_whatsapp,
                'footer_phone' => $setting->footer_phone,
                'footer_email' => $setting->footer_email,
                'footer_instagram' => $setting->footer_instagram,
                'footer_tiktok' => $setting->footer_tiktok,
                'footer_address' => $setting->footer_address,
                'footer_description' => $setting->footer_description,
            ],
            'plans' => $plansData,
            'themes' => $themes,
        ]);
    }
 
    /**
     * Show all themes with reseller context.
     * URL: /r/{subdomain}/themes
     */
    public function themes(string $subdomain)
    {
        $setting = ResellerSetting::where('subdomain', $subdomain)
            ->where('is_active', true)
            ->first();
 
        if (!$setting) {
            abort(404, 'Reseller tidak ditemukan.');
        }
 
        $reseller = $setting->reseller;
 
        $themes = \App\Models\Theme::where('is_active', true)
            ->select('id', 'name', 'slug', 'thumbnail', 'category', 'is_premium', 'base_likes', 'real_likes', 'preview_url')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($theme) {
                $theme->preview_url = route('demo.theme', ['slug' => $theme->slug]);
                return $theme;
            });
 
        $appUrl = config('app.url');
        $parsed = parse_url($appUrl);
        $scheme = $parsed['scheme'] ?? 'http';
        $host = $parsed['host'] ?? 'undangan-digital.test';
        $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';
 
        if ($setting->custom_domain) {
            $resellerUrl = $scheme . '://' . $setting->custom_domain . $port;
        } else {
            $resellerUrl = $scheme . '://' . $subdomain . '.' . $host . $port;
        }
 
        return Inertia::render('ResellerThemes', [
            'reseller' => [
                'brand_name' => $setting->brand_name ?: $reseller->name,
                'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                'ref' => $subdomain,
                'reseller_url' => $resellerUrl,
                'template' => $setting->landing_page_template ?: 'default',
                'site_title' => $setting->site_title,
                'site_motto' => $setting->site_motto,
                'footer_whatsapp' => $setting->footer_whatsapp,
                'footer_phone' => $setting->footer_phone,
                'footer_email' => $setting->footer_email,
                'footer_instagram' => $setting->footer_instagram,
                'footer_tiktok' => $setting->footer_tiktok,
                'footer_address' => $setting->footer_address,
                'footer_description' => $setting->footer_description,
            ],
            'themes' => $themes,
        ]);
    }

    /**
     * Show the reseller's FAQ/Tutorial page.
     * URL: /r/{subdomain}/faq
     */
    public function faq(string $subdomain)
    {
        $setting = ResellerSetting::where('subdomain', $subdomain)
            ->where('is_active', true)
            ->first();

        if (!$setting) {
            abort(404, 'Reseller tidak ditemukan.');
        }

        $reseller = $setting->reseller;

        $appUrl = config('app.url');
        $parsed = parse_url($appUrl);
        $scheme = $parsed['scheme'] ?? 'http';
        $host = $parsed['host'] ?? 'undangan-digital.test';
        $port = isset($parsed['port']) ? ':' . $parsed['port'] : '';

        if ($setting->custom_domain) {
            $resellerUrl = $scheme . '://' . $setting->custom_domain . $port;
        } else {
            $resellerUrl = $scheme . '://' . $subdomain . '.' . $host . $port;
        }

        return Inertia::render('ResellerFaq', [
            'reseller' => [
                'brand_name' => $setting->brand_name ?: $reseller->name,
                'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                'ref' => $subdomain,
                'reseller_url' => $resellerUrl,
                'template' => $setting->landing_page_template ?: 'default',
                'site_title' => $setting->site_title,
                'site_motto' => $setting->site_motto,
                'footer_whatsapp' => $setting->footer_whatsapp,
                'footer_phone' => $setting->footer_phone,
                'footer_email' => $setting->footer_email,
                'footer_instagram' => $setting->footer_instagram,
                'footer_tiktok' => $setting->footer_tiktok,
                'footer_address' => $setting->footer_address,
                'footer_description' => $setting->footer_description,
            ],
        ]);
    }
}
