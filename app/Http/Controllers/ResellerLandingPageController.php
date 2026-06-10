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

        // Get plans with reseller pricing and feature access
        $plans = SubscriptionPlan::with('featureAccess.feature')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $resellerPrices = ResellerPlanPrice::where('reseller_id', $reseller->id)
            ->pluck('reseller_price', 'plan_id');

        $plansData = $plans->map(function ($plan) use ($resellerPrices) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'price' => isset($resellerPrices[$plan->id])
                    ? (float)$resellerPrices[$plan->id]
                    : (float)$plan->price,
                'duration_days' => $plan->duration_days,
                'max_guests' => $plan->max_guests,
                'max_galleries' => $plan->max_galleries,
                'description' => $plan->description,
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
            ];
        });

        // Get all global features for dynamic feature comparison
        $features = \App\Models\Feature::orderBy('category')->orderBy('name')->get();

        // Get themes for gallery
        $themes = \App\Models\Theme::where('is_active', true)
            ->select('id', 'name', 'slug', 'thumbnail', 'preview_images', 'preview_template', 'preview_bg_style', 'category', 'is_premium', 'base_likes', 'real_likes', 'preview_url')
            ->latest()
            ->take(8)
            ->get();
        $themes = \App\Models\Theme::applyResellerCustomizations($themes, $reseller->id);
        $themes = $themes->map(function ($theme) use ($subdomain) {
            $theme->preview_url = route('reseller.demo.theme', ['subdomain' => $subdomain, 'slug' => $theme->slug]);
            return $theme;
        });

        // Get greeting cards for gallery
        $greetingCards = \App\Models\GreetingCardTemplate::where('is_active', true)
            ->select('id', 'name', 'slug', 'thumbnail', 'preview_images', 'preview_template', 'preview_bg_style', 'type', 'base_likes', 'sort_order')
            ->orderBy('sort_order')
            ->get();
        $greetingCards = \App\Models\GreetingCardTemplate::applyResellerCustomizations($greetingCards, $reseller->id);
 
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
 
        $theme = $setting->getLandingTheme();
        $view = 'ResellerLanding';
        
        $themeComponents = [
            'galaxy'       => 'Galaxy',
            'luxury'       => 'Luxury',
            'bloom'        => 'Bloom',
            'forest'       => 'Forest',
            'modern-split' => 'ModernSplit',
        ];

        if (array_key_exists($theme, $themeComponents)) {
            $view = 'Reseller/Templates/' . $themeComponents[$theme];
        }

        return Inertia::render($view, [
            'reseller' => [
                'brand_name' => $setting->brand_name ?: $reseller->name,
                'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                'ref' => $subdomain,
                'reseller_url' => $resellerUrl,
                'template' => $setting->getLandingTheme(),
                'site_title' => $setting->site_title,
                'site_motto' => $setting->site_motto,
                'footer_whatsapp' => $setting->footer_whatsapp,
                'footer_phone' => $setting->footer_phone,
                'footer_email' => $setting->footer_email,
                'footer_instagram' => $setting->footer_instagram,
                'footer_tiktok' => $setting->footer_tiktok,
                'footer_address' => $setting->footer_address,
                'footer_description' => $setting->footer_description,
                'social_links' => $setting->social_links ?: [],
                'loading_style' => $setting->landing_page_config['loading_style'] ?? 'pulse',
            ],
            'plans' => $plansData,
            'features' => $features,
            'themes' => $themes,
            'greetingCards' => $greetingCards,
            'greetingCardTypeOptions' => \App\Models\GreetingCardTemplate::$typeOptions,
            'sections' => $setting->getOrderedSections(),
            'heroImage' => $setting->landing_page_hero_image ? '/storage/' . $setting->landing_page_hero_image : null,
        ]);
    }
 
    /**
     * Show all themes with reseller context.
     * URL: /r/{subdomain}/themes
     */
    public function themes(string $subdomain, string $defaultTab = 'undangan')
    {
        $setting = ResellerSetting::where('subdomain', $subdomain)
            ->where('is_active', true)
            ->first();
 
        if (!$setting) {
            abort(404, 'Reseller tidak ditemukan.');
        }
 
        $reseller = $setting->reseller;
 
        $themes = \App\Models\Theme::where('is_active', true)
            ->select('id', 'name', 'slug', 'thumbnail', 'preview_images', 'preview_template', 'preview_bg_style', 'category', 'is_premium', 'base_likes', 'real_likes', 'preview_url')
            ->orderBy('sort_order')
            ->get();
        $themes = \App\Models\Theme::applyResellerCustomizations($themes, $reseller->id);
        $themes = $themes->map(function ($theme) use ($subdomain) {
            $theme->preview_url = route('reseller.demo.theme', ['subdomain' => $subdomain, 'slug' => $theme->slug]);
            return $theme;
        });

        // Query greeting card templates with reseller customizations
        $greetingCards = \App\Models\GreetingCardTemplate::where('is_active', true)
            ->withCount('greetingCards')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        $greetingCards = \App\Models\GreetingCardTemplate::applyResellerCustomizations($greetingCards, $reseller->id);
 
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
                'social_links' => $setting->social_links ?: [],
                'loading_style' => $setting->landing_page_config['loading_style'] ?? 'pulse',
            ],
            'sections' => $setting->getOrderedSections(),
            'themes' => $themes,
            'greetingCards' => $greetingCards,
            'greetingCardTypeOptions' => \App\Models\GreetingCardTemplate::$typeOptions,
            'defaultTab' => $defaultTab,
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
                'social_links' => $setting->social_links ?: [],
                'loading_style' => $setting->landing_page_config['loading_style'] ?? 'pulse',
            ],
            'sections' => $setting->getOrderedSections(),
        ]);
    }
}
