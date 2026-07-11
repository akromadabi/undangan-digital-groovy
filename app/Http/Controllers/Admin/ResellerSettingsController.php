<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResellerSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResellerSettingsController extends Controller
{
    /**
     * Get or create ResellerSetting for the current reseller.
     */
    private function getSettings()
    {
        $user = auth()->user();
        return ResellerSetting::firstOrCreate(
            ['user_id' => $user->id],
            ['brand_name' => $user->name, 'is_active' => true]
        );
    }

    // ═══ Branding ═══

    public function branding()
    {
        $settings = $this->getSettings();
        $settings->load('demoUser');
        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);

        return Inertia::render('Admin/Branding', [
            'settings' => $settings,
            'centralHost' => $centralHost ?: 'undangan.com',
        ]);
    }

    public function updateBranding(Request $request)
    {
        $request->validate([
            'brand_name' => 'required|string|max:100',
            'brand_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
            'site_title' => 'nullable|string|max:255',
            'site_motto' => 'nullable|string|max:1000',
            'footer_whatsapp' => 'nullable|string|max:30',
            'footer_phone' => 'nullable|string|max:30',
            'footer_email' => 'nullable|email|max:100',
            'footer_instagram' => 'nullable|string|max:100',
            'footer_tiktok' => 'nullable|string|max:100',
            'footer_address' => 'nullable|string|max:1000',
            'footer_description' => 'nullable|string|max:1000',
            'bank_accounts' => 'nullable|array',
            'social_links' => 'nullable|array',
            'subdomain' => 'nullable|string|max:50|alpha_dash|unique:reseller_settings,subdomain,' . $this->getSettings()->id,
            'custom_domain' => 'nullable|string|max:255|unique:reseller_settings,custom_domain,' . $this->getSettings()->id,
            'hide_demo_plan_selector' => 'nullable|boolean',
            'payment_mode' => 'nullable|string|in:admin,reseller_gateway,manual',
            'reseller_gateway_type' => 'nullable|string|in:midtrans,tripay,xendit',
            'reseller_midtrans_settings' => 'nullable|array',
            'reseller_tripay_settings' => 'nullable|array',
            'reseller_xendit_settings' => 'nullable|array',
        ]);

        $settings = $this->getSettings();
        $settings->brand_name = $request->brand_name;
        $settings->site_title = $request->site_title;
        $settings->site_motto = $request->site_motto;
        $settings->footer_whatsapp = $request->footer_whatsapp;
        $settings->footer_phone = $request->footer_phone;
        $settings->footer_email = $request->footer_email;
        $settings->footer_instagram = $request->footer_instagram;
        $settings->footer_tiktok = $request->footer_tiktok;
        $settings->footer_address = $request->footer_address;
        $settings->footer_description = $request->footer_description;
        $settings->subdomain = $request->subdomain;
        $settings->custom_domain = $request->custom_domain;
        $settings->hide_demo_plan_selector = $request->boolean('hide_demo_plan_selector');
        $settings->payment_mode = $request->payment_mode ?? 'admin';
        $settings->reseller_gateway_type = $request->reseller_gateway_type;
        $settings->reseller_midtrans_settings = $request->reseller_midtrans_settings;
        $settings->reseller_tripay_settings = $request->reseller_tripay_settings;
        $settings->reseller_xendit_settings = $request->reseller_xendit_settings;
        
        // Save multiple bank accounts and auto-sync primary to legacy columns
        $settings->bank_accounts = $request->bank_accounts;
        if (!empty($request->bank_accounts) && is_array($request->bank_accounts)) {
            $first = $request->bank_accounts[0];
            $settings->bank_name = $first['bank_name'] ?? null;
            $settings->bank_account = $first['account_number'] ?? null;
            $settings->bank_holder = $first['account_name'] ?? null;
        } else {
            // Keep existing single values if multiple accounts are completely empty, 
            // or assign null if user deleted them
            $settings->bank_name = null;
            $settings->bank_account = null;
            $settings->bank_holder = null;
        }

        // Save multiple social links and sync primary to legacy columns
        $settings->social_links = $request->social_links;
        if (is_array($request->social_links)) {
            $instagramVal = null;
            $tiktokVal = null;
            $whatsappVal = null;
            $emailVal = null;
            $phoneVal = null;

            foreach ($request->social_links as $link) {
                $platform = strtolower($link['platform'] ?? '');
                $value = $link['value'] ?? null;

                if ($platform === 'instagram' && !$instagramVal) {
                    $instagramVal = $value;
                } elseif ($platform === 'tiktok' && !$tiktokVal) {
                    $tiktokVal = $value;
                } elseif ($platform === 'whatsapp' && !$whatsappVal) {
                    $whatsappVal = $value;
                } elseif ($platform === 'email' && !$emailVal) {
                    $emailVal = $value;
                } elseif ($platform === 'phone' && !$phoneVal) {
                    $phoneVal = $value;
                }
            }

            if ($instagramVal) { $settings->footer_instagram = $instagramVal; }
            if ($tiktokVal) { $settings->footer_tiktok = $tiktokVal; }
            if ($whatsappVal) { $settings->footer_whatsapp = $whatsappVal; }
            if ($emailVal) { $settings->footer_email = $emailVal; }
            if ($phoneVal) { $settings->footer_phone = $phoneVal; }
        }

        if ($request->hasFile('brand_logo')) {
            // Delete old logo
            if ($settings->brand_logo && Storage::disk('public')->exists($settings->brand_logo)) {
                Storage::disk('public')->delete($settings->brand_logo);
            }
            
            $file = $request->file('brand_logo');
            \App\Helpers\ImageCompressor::compress($file);
            
            $ext = $file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'jpg';
            if ($ext === 'jpeg') { $ext = 'jpg'; }
            $filename = 'logo-reseller-' . time() . '-' . rand(100, 999) . '.' . $ext;
            $settings->brand_logo = $file->storeAs('reseller/logos', $filename, 'public');
        }

        if ($request->has('remove_logo') && $request->remove_logo) {
            if ($settings->brand_logo && Storage::disk('public')->exists($settings->brand_logo)) {
                Storage::disk('public')->delete($settings->brand_logo);
            }
            $settings->brand_logo = null;
        }

        $settings->save();

        return back()->with('success', 'Branding, kontak dan domain berhasil disimpan.');
    }

    // ═══ Landing Page ═══

    public function landingPage()
    {
        $settings = $this->getSettings();

        return Inertia::render('Admin/LandingPage', [
            'settings'        => $settings,
            'themes'          => [], // Deprecated: single template (ModernSplit) with palette
            'defaultSections' => \App\Models\ResellerSetting::defaultSections(),
            'savedSections'   => $settings->getOrderedSections(),
            'currentTheme'    => 'modern-split', // always modern-split
            'currentPalette'  => $settings->landing_page_config['palette'] ?? 'crimson',
            'heroImage'       => $settings->landing_page_hero_image
                                    ? '/storage/' . $settings->landing_page_hero_image
                                    : null,
            'features'        => \App\Models\Feature::orderBy('category')->orderBy('name')->get(),
        ]);
    }

    /**
     * Preview action for reseller's landing page (subdomain-independent).
     */
    public function landingPagePreview()
    {
        $settings = $this->getSettings();
        $reseller = $settings->reseller;

        // Get plans with reseller pricing and feature access
        $plans = \App\Models\SubscriptionPlan::with('featureAccess.feature')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $resellerPrices = \App\Models\ResellerPlanPrice::where('reseller_id', $reseller->id)
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
            ->select('id', 'name', 'slug', 'thumbnail', 'preview_images', 'preview_template', 'preview_bg_style', 'category', 'type', 'is_premium', 'base_likes', 'real_likes', 'preview_url')
            ->latest()
            ->take(8)
            ->get();
        $themes = \App\Models\Theme::applyResellerCustomizations($themes, $reseller->id);
        $themes = $themes->map(function ($theme) {
            $theme->preview_url = route('demo.theme', ['slug' => $theme->slug]);
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

        if ($settings->custom_domain) {
            $resellerUrl = $scheme . '://' . $settings->custom_domain . $port;
        } else {
            $resellerUrl = $scheme . '://' . ($settings->subdomain ?: 'reseller') . '.' . $host . $port;
        }

        $theme = 'modern-split';
        $view = 'Reseller/Templates/ModernSplit';
        $palette = request('palette') ?: ($settings->landing_page_config['palette'] ?? 'crimson');

        return Inertia::render($view, [
            'reseller' => [
                'brand_name' => $settings->brand_name ?: $reseller->name,
                'brand_logo' => $settings->brand_logo ? '/storage/' . $settings->brand_logo : null,
                'ref' => $settings->subdomain ?: 'reseller',
                'reseller_url' => $resellerUrl,
                'template' => 'modern-split',
                'site_title' => $settings->site_title,
                'site_motto' => $settings->site_motto,
                'footer_whatsapp' => $settings->footer_whatsapp,
                'footer_phone' => $settings->footer_phone,
                'footer_email' => $settings->footer_email,
                'footer_instagram' => $settings->footer_instagram,
                'footer_tiktok' => $settings->footer_tiktok,
                'footer_address' => $settings->footer_address,
                'footer_description' => $settings->footer_description,
                'social_links' => $settings->social_links ?: [],
                'loading_style' => $settings->landing_page_config['loading_style'] ?? 'pulse',
            ],
            'palette' => $palette,
            'plans' => $plansData,
            'features' => $features,
            'themes' => $themes,
            'greetingCards' => $greetingCards,
            'greetingCardTypeOptions' => \App\Models\GreetingCardTemplate::$typeOptions,
            'sections' => $settings->getOrderedSections(),
            'heroImage' => $settings->landing_page_hero_image ? '/storage/' . $settings->landing_page_hero_image : null,
        ]);
    }

    public function updateLandingPage(Request $request)
    {
        $request->validate([
            'landing_page_template' => 'required|string|max:50',
        ]);

        $settings = $this->getSettings();
        $settings->landing_page_template = $request->landing_page_template;
        // Also sync into config
        $config = $settings->landing_page_config ?? [];
        $config['theme'] = $request->landing_page_template;
        $settings->landing_page_config = $config;
        $settings->save();

        return back()->with('success', 'Template berhasil disimpan.');
    }

    /**
     * Save full landing page builder config (sections + theme).
     */
    public function updateLandingPageConfig(Request $request)
    {
        $request->validate([
            'theme'    => 'nullable|string|max:50',
            'palette'  => 'nullable|string|max:50',
            'sections' => 'nullable|array',
            'loading_style' => 'nullable|string|max:50',
        ]);

        $settings = $this->getSettings();
        $existing = $settings->landing_page_config ?? [];

        // Always keep modern-split
        $existing['theme'] = 'modern-split';
        $settings->landing_page_template = 'modern-split';

        if ($request->has('palette')) {
            $existing['palette'] = $request->palette;
        }
        if ($request->has('sections')) {
            $existing['sections'] = $request->sections;
        }
        if ($request->has('loading_style')) {
            $existing['loading_style'] = $request->loading_style;
        }
        $settings->landing_page_config = $existing;
        $settings->save();

        return response()->json(['success' => true, 'message' => 'Konfigurasi landing page berhasil disimpan.']);
    }

    /**
     * Upload hero background image.
     */
    public function uploadHeroImage(Request $request)
    {
        $request->validate([
            'hero_image' => 'required|image|mimes:png,jpg,jpeg,webp|max:4096',
        ]);

        $settings = $this->getSettings();
        $section  = $request->input('section', 'hero');

        $file = $request->file('hero_image');
        $ext      = $file->guessExtension() ?: 'jpg';
        $filename = 'hero-' . time() . '-' . rand(100, 999) . '.' . $ext;
        $path     = $file->storeAs('reseller/hero', $filename, 'public');

        // Compress image in-place on stored path
        \App\Helpers\ImageCompressor::compress(Storage::disk('public')->path($path));

        $config = $settings->landing_page_config ?? [];
        $sections = collect($config['sections'] ?? \App\Models\ResellerSetting::defaultSections());

        if ($section === 'main_banner') {
            $sections = $sections->map(function ($s) use ($path) {
                if ($s['key'] === 'main_banner') {
                    $s['config']['banner_image'] = '/storage/' . $path;
                }
                return $s;
            });
        } else {
            $settings->landing_page_hero_image = $path;
            $sections = $sections->map(function ($s) use ($path) {
                if ($s['key'] === 'hero') {
                    $s['config']['hero_image'] = '/storage/' . $path;
                }
                return $s;
            });
        }

        $config['sections'] = $sections->values()->toArray();
        $settings->landing_page_config = $config;
        $settings->save();

        return response()->json(['success' => true, 'url' => '/storage/' . $path]);
    }

    /**
     * Remove hero background image.
     */
    public function removeHeroImage(Request $request)
    {
        $settings = $this->getSettings();
        $section  = $request->input('section', 'hero');

        $config = $settings->landing_page_config ?? [];
        $sections = collect($config['sections'] ?? []);

        if ($section === 'main_banner') {
            $sections = $sections->map(function ($s) {
                if ($s['key'] === 'main_banner') {
                    $s['config']['banner_image'] = null;
                }
                return $s;
            });
        } else {
            if ($settings->landing_page_hero_image && Storage::disk('public')->exists($settings->landing_page_hero_image)) {
                Storage::disk('public')->delete($settings->landing_page_hero_image);
            }
            $settings->landing_page_hero_image = null;
            $sections = $sections->map(function ($s) {
                if ($s['key'] === 'hero') {
                    $s['config']['hero_image'] = null;
                }
                return $s;
            });
        }

        $config['sections'] = $sections->values()->toArray();
        $settings->landing_page_config = $config;
        $settings->save();

        return response()->json(['success' => true]);
    }

    // ═══ Domain ═══

    public function domain()
    {
        return redirect()->route('admin.branding');
    }

    public function updateDomain(Request $request)
    {
        $request->validate([
            'subdomain' => 'nullable|string|max:50|alpha_dash|unique:reseller_settings,subdomain,' . $this->getSettings()->id,
            'custom_domain' => 'nullable|string|max:255|unique:reseller_settings,custom_domain,' . $this->getSettings()->id,
        ]);

        $settings = $this->getSettings();
        $settings->subdomain = $request->subdomain;
        $settings->custom_domain = $request->custom_domain;
        $settings->save();

        return back()->with('success', 'Pengaturan domain berhasil disimpan.');
    }
}
