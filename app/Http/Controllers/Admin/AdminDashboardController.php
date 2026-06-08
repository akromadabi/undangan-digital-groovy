<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isReseller = $user->isReseller();

        // Reseller only sees their own users; super_admin sees all
        $userQuery = User::where('role', 'user');
        if ($isReseller) {
            $userQuery->where('reseller_id', $user->id);
        }

        $invitationQuery = Invitation::where('is_active', true);
        $paymentQuery = Payment::query();
        $invitationStatsQuery = Invitation::query();
        
        if ($isReseller) {
            $userIds = User::where('reseller_id', $user->id)->pluck('id');
            $invitationQuery->whereIn('user_id', $userIds);
            $paymentQuery->whereIn('user_id', $userIds);
            $invitationStatsQuery->whereIn('user_id', $userIds);
        }

        $totalViews = (clone $invitationStatsQuery)->sum('views_count');
        $uniqueViews = (clone $invitationStatsQuery)->sum('unique_views_count');

        $setting = \App\Models\ResellerSetting::firstOrCreate(
            ['user_id' => $user->id],
            ['brand_name' => $user->name, 'is_active' => true]
        );

        $checklist = [
            [
                'key' => 'brand',
                'title' => 'Identitas Brand',
                'desc' => 'Atur logo, nama brand, dan subdomain website Anda.',
                'href' => '/admin/branding?tab=brand',
                'is_completed' => !empty($setting->brand_logo) && !empty($setting->subdomain),
            ],
            [
                'key' => 'payment',
                'title' => 'Rekening Pembayaran',
                'desc' => 'Tambahkan rekening bank untuk menerima pembayaran klien.',
                'href' => '/admin/branding?tab=payment',
                'is_completed' => !empty($setting->bank_accounts) || !empty($setting->bank_account),
            ],
            [
                'key' => 'social',
                'title' => 'Kontak & Sosmed',
                'desc' => 'Lengkapi kontak WhatsApp, email, dan akun sosmed Anda.',
                'href' => '/admin/branding?tab=social',
                'is_completed' => !empty($setting->footer_whatsapp) || !empty($setting->footer_email) || !empty($setting->social_links),
            ],
            [
                'key' => 'pricing',
                'title' => 'Harga Jual Paket',
                'desc' => 'Tentukan harga paket undangan untuk klien Anda.',
                'href' => '/admin/pricing',
                'is_completed' => \App\Models\ResellerPlanPrice::where('reseller_id', $user->id)->exists() || $setting->greeting_card_price !== null,
            ],
            [
                'key' => 'landing_page',
                'title' => 'Landing Page',
                'desc' => 'Atur tampilan halaman utama dan tema warna brand Anda.',
                'href' => '/admin/landing-page',
                'is_completed' => !empty($setting->landing_page_hero_image) || (!empty($setting->landing_page_config) && isset($setting->landing_page_config['sections'])),
            ],
            [
                'key' => 'bio_link',
                'title' => 'Bio Link Brand',
                'desc' => 'Buat halaman bio link sosial media untuk profil Anda.',
                'href' => '/admin/bio',
                'is_completed' => !empty($setting->bio_link_config),
            ],
            [
                'key' => 'demo',
                'title' => 'Undangan Demo',
                'desc' => 'Aktifkan contoh undangan aktif sebagai preview tema.',
                'href' => '/admin/branding?tab=demo',
                'is_completed' => !empty($setting->demo_user_id),
            ],
        ];

        $completedCount = collect($checklist)->where('is_completed', true)->count();
        $totalCount = count($checklist);
        $percentage = round(($completedCount / $totalCount) * 100);

        $onboarding = [
            'checklist' => $checklist,
            'stats' => [
                'completed_count' => $completedCount,
                'total_count' => $totalCount,
                'percentage' => $percentage,
            ]
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => (clone $userQuery)->count(),
                'active_invitations' => (clone $invitationQuery)->count(),
                'total_revenue' => (clone $paymentQuery)->where('status', 'paid')->sum('amount'),
                'pending_payments' => (clone $paymentQuery)->where('status', 'pending')->count(),
                'total_views' => $totalViews,
                'unique_views' => $uniqueViews,
            ],
            'recentUsers' => (clone $userQuery)->latest()->take(10)->get(['id', 'name', 'email', 'created_at']),
            'recentPayments' => (clone $paymentQuery)->with('user:id,name', 'plan:id,name')
                ->latest()
                ->take(10)
                ->get(),
            'onboarding' => $onboarding,
        ]);
    }

    public function themes()
    {
        $user = auth()->user();
        $themes = \App\Models\Theme::withCount('invitations')->where('is_active', true)->orderBy('sort_order')->get();
        
        $customSettings = \App\Models\ResellerThemeSetting::where('reseller_id', $user->id)
            ->get()
            ->keyBy('theme_id');

        $themesData = $themes->map(function ($theme) use ($customSettings) {
            $custom = $customSettings->get($theme->id);
            return [
                'id' => $theme->id,
                'name' => $theme->name,
                'slug' => $theme->slug,
                'thumbnail' => $theme->thumbnail,
                'preview_images' => $theme->preview_images ?: [],
                'preview_template' => $theme->preview_template,
                'preview_bg_style' => $theme->preview_bg_style,
                'category' => $theme->category,
                'type' => is_array($theme->type) ? $theme->type : ($theme->type ? [$theme->type] : []),
                'is_premium' => $theme->is_premium,
                'base_likes' => $theme->base_likes,
                'real_likes' => $theme->real_likes,
                'invitations_count' => $theme->invitations_count,
                'custom_setting' => $custom ? [
                    'preview_template' => $custom->preview_template ?: 'default',
                    'preview_bg_style' => $custom->preview_bg_style ?: 'default',
                    'preview_images' => $custom->preview_images ?: [],
                    'thumbnail' => $custom->thumbnail ?: '',
                ] : null
            ];
        });

        return Inertia::render('Admin/ThemesCatalog', [
            'themes' => $themesData
        ]);
    }

    public function updateThemeCustomPreview(\Illuminate\Http\Request $request, \App\Models\Theme $theme)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'preview_template' => 'nullable|string',
            'preview_bg_style' => 'nullable|string',
            'preview_images' => 'nullable|array',
            'thumbnail' => 'nullable|string',
        ]);

        \App\Models\ResellerThemeSetting::updateOrCreate(
            [
                'reseller_id' => $user->id,
                'theme_id' => $theme->id,
            ],
            [
                'preview_template' => $validated['preview_template'] ?? null,
                'preview_bg_style' => $validated['preview_bg_style'] ?? null,
                'preview_images' => $validated['preview_images'] ?? null,
                'thumbnail' => $validated['thumbnail'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Preview tema berhasil diperbarui!');
    }

    public function greetingCardCatalog()
    {
        $user = auth()->user();

        $templates = \App\Models\GreetingCardTemplate::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $customSettings = \App\Models\ResellerGreetingCardSetting::where('reseller_id', $user->id)
            ->get()
            ->keyBy('greeting_card_template_id');

        $templatesData = $templates->map(function ($tpl) use ($customSettings) {
            $custom = $customSettings->get($tpl->id);
            return [
                'id'               => $tpl->id,
                'name'             => $tpl->name,
                'slug'             => $tpl->slug,
                'thumbnail'        => $tpl->thumbnail,
                'preview_images'   => $tpl->preview_images ?: [],
                'preview_template' => $tpl->preview_template,
                'preview_bg_style' => $tpl->preview_bg_style,
                'type'             => is_array($tpl->type) ? $tpl->type : ($tpl->type ? [$tpl->type] : []),
                'features'         => $tpl->features ?: [],
                'base_likes'       => $tpl->base_likes,
                'custom_setting'   => $custom ? [
                    'preview_template' => $custom->preview_template ?: 'default',
                    'preview_bg_style' => $custom->preview_bg_style ?: 'default',
                    'preview_images'   => $custom->preview_images ?: [],
                    'thumbnail'        => $custom->thumbnail ?: '',
                ] : null,
            ];
        });

        return Inertia::render('Admin/GreetingCardCatalog', [
            'templates'   => $templatesData,
            'typeOptions' => \App\Models\GreetingCardTemplate::$typeOptions,
        ]);
    }

    public function updateGreetingCardCustomPreview(\Illuminate\Http\Request $request, \App\Models\GreetingCardTemplate $greetingCardTemplate)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'preview_template' => 'nullable|string',
            'preview_bg_style' => 'nullable|string',
            'preview_images'   => 'nullable|array',
            'thumbnail'        => 'nullable|string',
        ]);

        \App\Models\ResellerGreetingCardSetting::updateOrCreate(
            [
                'reseller_id'               => $user->id,
                'greeting_card_template_id' => $greetingCardTemplate->id,
            ],
            [
                'preview_template' => $validated['preview_template'] ?? null,
                'preview_bg_style' => $validated['preview_bg_style'] ?? null,
                'preview_images'   => $validated['preview_images'] ?? null,
                'thumbnail'        => $validated['thumbnail'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Preview kartu berhasil diperbarui!');
    }

    public function faq()
    {
        return Inertia::render('Admin/Faq');
    }
}
