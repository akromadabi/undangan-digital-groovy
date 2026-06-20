<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Rsvp;
use App\Models\Wish;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function show(Request $request, string $slug)
    {
        $isDemo = str_starts_with($slug, 'demo-');

        $invitation = Invitation::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'theme.threeDScene',
                'threeDScene',
                'brideGrooms',
                'events',
                'galleries',
                'loveStories',
                'bankAccounts',
                'sections' => fn($q) => $q->where('is_visible', true)->orderBy('sort_order'),
                'user.resellerSettings',
                'user.reseller.resellerSettings',
            ])
            ->firstOrFail();

        // Resolve reseller or central brand details
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        $brandName = $resellerSetting ? $resellerSetting->brand_name : config('app.name', 'Undangan Digital');
        $brandUrl = '#';
        if ($resellerSetting) {
            if ($resellerSetting->custom_domain) {
                $brandUrl = 'https://' . $resellerSetting->custom_domain;
            } else {
                $centralDomain = parse_url(config('app.url'), PHP_URL_HOST);
                $brandUrl = 'https://' . $resellerSetting->subdomain . '.' . $centralDomain;
            }
        } else {
            $brandUrl = config('app.url');
        }

        // Determine if we should show the free invitation badge or if it has expired
        $showFreeBadge = false;
        $isExpired = false;
        $trialExpiresAt = 0;
        $owner = $invitation->user;

        if ($owner && !$owner->isSuperAdmin() && !$owner->isAdmin()) {
            if (!$owner->is_active) {
                $isExpired = true;
            } else {
                $subscription = $invitation->activeSubscription;
                if ($subscription) {
                    if ($subscription->plan && $subscription->plan->slug === 'free') {
                        $startsAt = $subscription->starts_at;
                        if ($startsAt) {
                            if ($startsAt->lt(now()->subDays(5))) {
                                $isExpired = true;
                            } elseif ($startsAt->lt(now()->subDays(2))) {
                                $showFreeBadge = true;
                                $trialExpiresAt = $startsAt->copy()->addDays(5)->timestamp * 1000;
                            }
                        } else {
                            $isExpired = true; // Legacy fallback
                        }
                    } else {
                        // For non-free subscriptions, check if expires_at is in the past
                        if ($subscription->expires_at && $subscription->expires_at->isPast()) {
                            $isExpired = true;
                        }
                    }
                } else {
                    // Fallback to invitation creation date if no active subscription exists
                    $createdAt = $invitation->created_at;
                    if ($createdAt) {
                        if ($createdAt->lt(now()->subDays(5))) {
                            $isExpired = true;
                        } elseif ($createdAt->lt(now()->subDays(2))) {
                            $showFreeBadge = true;
                            $trialExpiresAt = $createdAt->copy()->addDays(5)->timestamp * 1000;
                        }
                    }
                }
            }
        }

        if ($isExpired && !$isDemo) {
            // Deactivate the user when their invitation has expired (so they cannot access the dashboard)
            if ($owner && $owner->is_active && !$owner->isSuperAdmin() && !$owner->isAdmin()) {
                $owner->update(['is_active' => false]);
            }

            if ($invitation->theme && $invitation->theme->slug) {
                return redirect()->route('demo.theme', ['slug' => $invitation->theme->slug]);
            }
            return redirect()->route('login');
        }

        // Increment views_count and unique_views_count
        $invitation->increment('views_count');
        $sessionKey = 'viewed_invitation_' . $invitation->id;
        if (!session()->has($sessionKey)) {
            $invitation->increment('unique_views_count');
            session()->put($sessionKey, true);
        }

        // Log the view in invitation_views_logs for daily/monthly statistics
        \DB::table('invitation_views_logs')->insert([
            'invitation_id' => $invitation->id,
            'created_at' => now(),
        ]);

        $guestSlug = $request->query('to');
        $guest = null;

        if ($guestSlug) {
            $guest = Guest::where('invitation_id', $invitation->id)
                ->where('slug', $guestSlug)
                ->first();
        }

        $wishes = $invitation->wishes()
            ->where('is_visible', true)
            ->latest()
            ->take(50)
            ->get();

        // Keamanan: Validasi otorisasi Paket berlangganan untuk live template & section
        $owner = $invitation->user;
        if ($owner && !$isDemo) {
            if (!$owner->hasFeatureAccess('qr_code')) {
                $invitation->enable_qr = false;
                $invitation->show_qr_code = false;
            }
            if (!$owner->hasFeatureAccess('rsvp')) {
                $invitation->enable_rsvp = false;
            }
            if (!$owner->hasFeatureAccess('guestbook')) {
                $invitation->enable_wishes = false;
                $wishes = collect();
            }
            if (!$owner->hasFeatureAccess('music')) {
                $invitation->music_autoplay = false;
                $invitation->music_url = null;
            }
            if (!$owner->hasFeatureAccess('animasi')) {
                $invitation->show_animations = false;
            }
            if (!$owner->hasFeatureAccess('save_the_date')) {
                $invitation->show_countdown = false;
            }
            if (!$owner->hasFeatureAccess('template')) {
                $invitation->enable_auto_scroll = false;
                $invitation->particle_type = 'none';
                $invitation->menu_position = 'none';
            }

            // Filter sections dynamically based on package feature access
            $filteredSections = $invitation->sections->filter(function ($section) use ($owner) {
                $map = [
                    'cover' => 'cover',
                    'opening' => 'opening',
                    'closing' => 'closing',
                    'mempelai' => 'bride_groom',
                    'countdown' => 'save_the_date',
                    'love_story' => 'love_story',
                    'event' => 'event',
                    'gallery' => 'gallery',
                    'rsvp' => 'rsvp',
                    'wishes' => 'guestbook',
                    'bank' => 'bank',
                    'livestream' => 'event',
                    'instagram_filter' => 'instagram_filter',
                ];
                $featureSlug = $map[$section->section_key] ?? null;
                if ($featureSlug) {
                    return $owner->hasFeatureAccess($featureSlug);
                }
                return true;
            })->values();

            $invitation->setRelation('sections', $filteredSections);
        }

        $subscriptionPlans = null;
        if ($isDemo) {
            $resellerPrices = [];
            if ($resellerSetting) {
                $resellerPrices = \App\Models\ResellerPlanPrice::where('reseller_id', $resellerSetting->user_id)
                    ->pluck('reseller_price', 'plan_id')
                    ->toArray();
            }

            $subscriptionPlans = \App\Models\SubscriptionPlan::with(['features' => function($query) {
                $query->wherePivot('is_enabled', true);
            }])->where('type', 'invitation')->orderBy('sort_order')->get()->map(function($plan) use ($resellerSetting, $resellerPrices) {
                if ($resellerSetting) {
                    $price = isset($resellerPrices[$plan->id])
                        ? (float)$resellerPrices[$plan->id]
                        : 2.0 * (float)$plan->price;
                } else {
                    $price = 2.0 * (float)$plan->price;
                }

                return [
                    'id' => $plan->id,
                    'slug' => $plan->slug,
                    'name' => $plan->name,
                    'description' => $plan->description,
                    'price' => $price,
                    'duration_days' => $plan->duration_days,
                    'max_guests' => $plan->max_guests,
                    'max_galleries' => $plan->max_galleries,
                    'features' => $plan->features->pluck('slug')->toArray(),
                    'feature_details' => $plan->features->map(function($f) {
                        return [
                            'name' => $f->name,
                            'slug' => $f->slug,
                            'description' => $f->description,
                            'icon' => $f->icon,
                        ];
                    })->toArray()
                ];
            });
        }

        // THEME ADDED BY BHAKTIAJI ILHAM
        $page = 'Invitation/Show';
        if ($invitation->theme && in_array($invitation->theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'luxury-04', 'wayang', 'shopee', 'spotify', 'instagram', 'tiktok', 'chatgpt', 'manchester-united', 'moroccan', 'youtube', 'spesial-02', 'spesial-02-copy', 'spesial-03', 'spesial-04', 'spesial-05', 'spesial-06', 'spesial-07', 'spesial-08', 'whatsapp', 'spiderman', 'candy-land', 'room-jogja', 'adat-jawa', 'adat-minang', 'adat-sunda', 'adat-bali', 'adat-batak', 'adat-betawi', 'handwriting', 'polaroid-scrapbook', 'polaroid-newspaper', 'fairytale', 'chelsea', 'astronaut', 'sage-minimalist', 'terracotta-minimalist', 'retro-vinyl'])) {
            if ($isDemo) {
                $page = 'Invitation/DemoWrapper';
            } else {
                $page = 'Invitation/' . $invitation->theme->slug . '/DynamicIndex';
            }
        }

        // Resolve WhatsApp Support Link for the active theme badge
        $whatsappNumber = $resellerSetting && $resellerSetting->footer_whatsapp 
            ? $resellerSetting->footer_whatsapp 
            : (\App\Models\GlobalSetting::getValue('whatsapp_support') ?: '6281234567890');
        $whatsappNumberClean = preg_replace('/[^0-9]/', '', $whatsappNumber);
        $whatsappLink = "https://wa.me/" . $whatsappNumberClean . "?text=" . urlencode("Halo Admin, saya ingin menanyakan tentang aktivasi/upgrade undangan digital saya.");

        $props = [
            'invitation' => $invitation,
            'sections' => $invitation->sections,
            'brideGrooms' => $invitation->brideGrooms,
            'events' => $invitation->events,
            'galleries' => $invitation->galleries,
            'loveStories' => $invitation->loveStories,
            'bankAccounts' => $invitation->bankAccounts,
            'guest' => $guest ?: ($isDemo ? new Guest(['name' => 'Tamu Kehormatan', 'slug' => 'tamu']) : null),
            'wishes' => $wishes,
            'show_free_badge' => $showFreeBadge,
            'trial_expires_at' => $trialExpiresAt,
            'brand_name' => $brandName,
            'brand_url' => $brandUrl,
            'admin_whatsapp_url' => $whatsappLink,
            'isDemo' => $isDemo,
            'subscriptionPlans' => $subscriptionPlans,
            'hideDemoPlanSelector' => $resellerSetting ? (bool)$resellerSetting->hide_demo_plan_selector : false,
        ];

        if ($page === 'Invitation/DemoWrapper') {
            $props['themeSlug'] = $invitation->theme->slug;
            $props['allowedPlans'] = $invitation->theme->allowed_plans;
        }

        return Inertia::render($page, $props);

    }

    /**
     * QR Code Checkin — auto RSVP hadir
     */
    public function checkin(Request $request, string $slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        $guestSlug = $request->query('to');

        if (!$guestSlug) {
            return response()->json(['success' => false, 'message' => 'Kode tamu tidak ditemukan.'], 400);
        }

        $guest = Guest::where('invitation_id', $invitation->id)
            ->where('slug', $guestSlug)
            ->first();

        if (!$guest) {
            return response()->json(['success' => false, 'message' => 'Tamu tidak ditemukan.'], 404);
        }

        // Mark as checked in
        $guest->update([
            'checked_in' => true,
            'checked_in_at' => now(),
            'is_opened' => true,
            'opened_at' => $guest->opened_at ?? now(),
        ]);

        // Auto RSVP hadir
        Rsvp::updateOrCreate(
            [
                'invitation_id' => $invitation->id,
                'guest_id' => $guest->id,
            ],
            [
                'attendance' => 'hadir',
                'number_of_guests' => $guest->max_pax ?? 1,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Selamat datang, ' . $guest->name . '!',
            'guest' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'checked_in_at' => now()->toDateTimeString(),
            ],
        ]);
    }

    public function submitRsvp(Request $request, string $slug)
    {
        $request->validate([
            'guest_id' => 'nullable|integer',
            'attendance' => 'required|in:hadir,tidak_hadir,belum_pasti',
            'number_of_guests' => 'nullable|integer|min:1|max:10',
            'sender_name' => 'required_without:guest_id|string|max:150',
        ]);

        $invitation = Invitation::where('slug', $slug)->firstOrFail();

        Rsvp::updateOrCreate(
            [
                'invitation_id' => $invitation->id,
                'guest_id' => $request->guest_id,
            ],
            [
                'attendance' => $request->attendance,
                'number_of_guests' => $request->number_of_guests ?? 1,
            ]
        );

        return back()->with('success', 'Konfirmasi kehadiran berhasil disimpan.');
    }

    public function submitWish(Request $request, string $slug)
    {
        $request->validate([
            'sender_name' => 'required|string|max:150',
            'message' => 'required|string|max:500',
            'guest_id' => 'nullable|integer',
        ]);

        $invitation = Invitation::where('slug', $slug)->firstOrFail();

        Wish::create([
            'invitation_id' => $invitation->id,
            'guest_id' => $request->guest_id,
            'sender_name' => $request->sender_name,
            'message' => $request->message,
        ]);

        return back()->with('success', 'Ucapan berhasil dikirim.');
    }

    public function markOpened(Request $request, string $slug)
    {
        $request->validate(['guest_id' => 'required|integer']);

        Guest::where('id', $request->guest_id)->update([
            'is_opened' => true,
            'opened_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Demo page accessed via path-based reseller URL: /r/{subdomain}/demo/{slug}
     * Delegates to demo() with the subdomain resolved from route parameter.
     */
    public function demoBySubdomain(Request $request, string $subdomain, string $slug)
    {
        return $this->demo($request, $subdomain, $slug);
    }

    public function demo(Request $request, string $param1, string $param2 = null)

    {
        if ($param2 !== null) {
            $subdomain = $param1;
            $slug = $param2;
        } else {
            $subdomain = null;
            $slug = $param1;
        }

        $theme = \App\Models\Theme::where('slug', $slug)->firstOrFail();

        // Resolve reseller settings
        if ($subdomain) {
            $resellerSetting = \App\Models\ResellerSetting::where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();
        } else {
            $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        }

        $resellerPrices = [];
        if ($resellerSetting) {
            $resellerPrices = \App\Models\ResellerPlanPrice::where('reseller_id', $resellerSetting->user_id)
                ->pluck('reseller_price', 'plan_id')
                ->toArray();
        }

        $subscriptionPlans = \App\Models\SubscriptionPlan::with(['features' => function($query) {
            $query->wherePivot('is_enabled', true);
        }])->where('type', 'invitation')->orderBy('sort_order')->get()->map(function($plan) use ($resellerSetting, $resellerPrices) {
            if ($resellerSetting) {
                // If reseller demo, display custom retail price, fallback to 2x base price if not customized
                $price = isset($resellerPrices[$plan->id])
                    ? (float)$resellerPrices[$plan->id]
                    : 2.0 * (float)$plan->price;
            } else {
                // If super admin demo, double the price
                $price = 2.0 * (float)$plan->price;
            }

            return [
                'id' => $plan->id,
                'slug' => $plan->slug,
                'name' => $plan->name,
                'description' => $plan->description,
                'price' => $price,
                'duration_days' => $plan->duration_days,
                'max_guests' => $plan->max_guests,
                'max_galleries' => $plan->max_galleries,
                'features' => $plan->features->pluck('slug')->toArray(),
                'feature_details' => $plan->features->map(function($f) {
                    return [
                        'name' => $f->name,
                        'slug' => $f->slug,
                        'description' => $f->description,
                        'icon' => $f->icon,
                    ];
                })->toArray()
            ];
        });
        
        // ── CUSTOM DEMO FROM RESELLER DEMO USER ──
        $customDemoInvitation = null;

        // Jika user adalah client yang login dan sudah punya undangan, pakai datanya secara dinamis
        $clientUser = auth()->user();
        if ($clientUser && $clientUser->role === 'user' && $clientUser->invitation) {
            $customDemoInvitation = $clientUser->invitation()
                ->with(['theme.threeDScene', 'threeDScene', 'brideGrooms', 'events', 'galleries', 'loveStories', 'bankAccounts', 'sections', 'user'])
                ->first();
        }

        if (!$customDemoInvitation && $resellerSetting && $resellerSetting->demo_user_id) {
            $customDemoInvitation = Invitation::where('user_id', $resellerSetting->demo_user_id)
                ->with(['theme.threeDScene', 'threeDScene', 'brideGrooms', 'events', 'galleries', 'loveStories', 'bankAccounts', 'sections', 'user'])
                ->first();
        }

        // Fallback: Jika reseller belum mengatur demo sendiri, cari demo dari Super Admin atau client langsung di domain utama dengan tema yang sama
        if (!$customDemoInvitation) {
            $customDemoInvitation = Invitation::whereHas('user', function($q) {
                    $q->whereNull('reseller_id');
                })
                ->where('theme_id', $theme->id)
                ->with(['theme.threeDScene', 'threeDScene', 'brideGrooms', 'events', 'galleries', 'loveStories', 'bankAccounts', 'sections', 'user'])
                ->first();
        }


        if ($customDemoInvitation) {
            // We use the reseller's custom demo invitation data!
            $invitation = clone $customDemoInvitation;
            $invitation->id = 0; // treat as mock in memory
            $invitation->theme_id = $theme->id;
            $invitation->slug = $slug;
            $invitation->setRelation('theme', $theme);

            // Force full features active for preview
            $invitation->enable_rsvp = true;
            $invitation->enable_wishes = true;
            $invitation->show_countdown = true;
            $invitation->show_animations = true;
            $invitation->save_the_date_enabled = true;
            $invitation->enable_auto_scroll = true;
            $invitation->show_qr_code = true;
            $invitation->enable_qr = true;
            $invitation->menu_position = 'bottom';

            $brideGrooms = $customDemoInvitation->brideGrooms;
            $events = $customDemoInvitation->events;

            // Make sure all events have dress code and streaming populated for the demo!
            if ($events->count() === 0) {
                $events = collect([
                    [
                        'event_type' => 'akad',
                        'event_name' => 'Akad Nikah',
                        'event_date' => now()->addDays(30)->toDateString(),
                        'start_time' => '08:00',
                        'end_time' => '10:00',
                        'timezone' => 'WIB',
                        'venue_name' => 'Masjid Agung',
                        'venue_address' => 'Jl. Khatib Sulaiman, Padang',
                        'gmaps_link' => 'https://maps.google.com',
                        'sort_order' => 0,
                        'is_primary' => true,
                        'streaming_platform' => 'YouTube',
                        'streaming_url' => 'https://youtube.com/live/example-wedding',
                        'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/example-wedding']],
                        'show_dress_code' => true,
                        'dress_code_text' => 'Para tamu disarankan mengenakan pakaian batik modern / pakaian rapi bernuansa pastel.',
                        'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#40302d', '#d4a373', '#e9edc9', '#fefae0']]]
                    ]
                ])->map(fn($ev) => new \App\Models\Event($ev));
            } else {
                foreach ($events as $event) {
                    $event->show_dress_code = true;
                    if (empty($event->dress_code_text)) {
                        $event->dress_code_text = 'Para tamu disarankan mengenakan pakaian batik modern / pakaian rapi bernuansa pastel.';
                    }
                    if (empty($event->dress_code_colors) || !is_array($event->dress_code_colors)) {
                        $themeColors = $theme->color_scheme;
                        $palette = [
                            $themeColors['primary'] ?? '#d4a373',
                            $themeColors['secondary'] ?? '#e9edc9',
                            $themeColors['bg'] ?? '#fefae0',
                            $themeColors['accent'] ?? '#40302d'
                        ];
                        $event->dress_code_colors = [
                            [
                                'label' => 'Dress Code',
                                'colors' => $palette
                            ]
                        ];
                    }
                    if (empty($event->streaming_url)) {
                        $event->streaming_platform = 'YouTube';
                        $event->streaming_url = 'https://youtube.com/live/example-wedding';
                    }
                    if (empty($event->streamings) || !is_array($event->streamings)) {
                        $event->streamings = [
                            ['platform' => 'YouTube', 'url' => $event->streaming_url ?? 'https://youtube.com/live/example-wedding']
                        ];
                    }
                }
            }

            $galleries = $customDemoInvitation->galleries;
            if ($galleries->count() === 0) {
                $galleries = collect([
                    ['image_url' => '/images/demo/korea-7-768x512.jpg', 'caption' => 'Kisah Bahagia', 'sort_order' => 0],
                    ['image_url' => '/images/demo/korea-11-768x512.jpg', 'caption' => 'Prewedding Day', 'sort_order' => 1],
                    ['image_url' => '/images/demo/korea-12-768x512.jpg', 'caption' => 'Momen Bersama', 'sort_order' => 2],
                    ['image_url' => '/images/demo/korea-4-768x528.jpg', 'caption' => 'Dua Hati', 'sort_order' => 3],
                ])->map(fn($gl) => new \App\Models\Gallery($gl));
            }

            $loveStories = $customDemoInvitation->loveStories;
            if ($loveStories->count() === 0) {
                $loveStories = collect([
                    [
                        'title' => 'Awal Bertemu',
                        'story_date' => '2023-11-20',
                        'description' => 'Pertama kali dipertemukan oleh takdir di Yogyakarta. Awal kisah indah yang membawa kami ke arah yang sama.',
                        'sort_order' => 0,
                    ],
                    [
                        'title' => 'Membangun Komitmen',
                        'story_date' => '2024-11-20',
                        'description' => 'Setelah melewati berbagai perjalanan obrolan dan komitmen mendalam, kami memutuskan untuk mengakhiri masa pencarian.',
                        'sort_order' => 1,
                    ]
                ])->map(fn($ls) => new \App\Models\LoveStory($ls));
            }

            $bankAccounts = $customDemoInvitation->bankAccounts;
            if ($bankAccounts->count() === 0) {
                $bankAccounts = collect([
                    [
                        'bank_name' => 'BCA',
                        'account_name' => 'Randi Wijaya',
                        'account_number' => '1234567890',
                        'sort_order' => 0,
                    ],
                    [
                        'bank_name' => 'Mandiri',
                        'account_name' => 'Mira Rahayu',
                        'account_number' => '0987654321',
                        'sort_order' => 1,
                    ]
                ])->map(fn($bk) => new \App\Models\BankAccount($bk));
            }

            $wishes = $customDemoInvitation->wishes()->latest()->take(50)->get();
            if ($wishes->count() === 0) {
                $wishes = collect([
                    ['sender_name' => 'Ahmad Saputra', 'message' => 'Selamat menempuh hidup baru! Semoga sakinah mawaddah wa rahmah selalu.'],
                    ['sender_name' => 'Siti Aminah', 'message' => 'Selamat berbahagia ya! Berkah dunia akhirat untuk kedua mempelai.'],
                ])->map(fn($ws) => new Wish($ws));
            }

            // Setup sections from theme if custom invitation has no sections yet
            $sections = $customDemoInvitation->sections->count() > 0 ? $customDemoInvitation->sections : $theme->sections()->orderBy('default_order')->get()->map(function($ts) {
                return new \App\Models\InvitationSection([
                    'section_key' => $ts->section_key,
                    'section_name' => $ts->section_name,
                    'sort_order' => $ts->default_order,
                    'is_visible' => true
                ]);
            });

            $user = $customDemoInvitation->user;
            if ($user) {
                $user->load(['resellerSettings', 'reseller.resellerSettings']);
                $invitation->setRelation('user', $user);
            }

            $page = 'Invitation/Show';
            $props = [
                'invitation' => $invitation,
                'sections' => $sections,
                'brideGrooms' => $brideGrooms,
                'events' => $events,
                'galleries' => $galleries,
                'loveStories' => $loveStories,
                'bankAccounts' => $bankAccounts,
                'guest' => new Guest(['name' => 'Tamu Kehormatan', 'slug' => 'tamu']),
                'wishes' => $wishes,
                'isDemo' => true,
                'subscriptionPlans' => $subscriptionPlans,
                'hideDemoPlanSelector' => $resellerSetting ? (bool)$resellerSetting->hide_demo_plan_selector : false,
            ];

            if (in_array($theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'luxury-04', 'wayang', 'shopee', 'spotify', 'instagram', 'tiktok', 'chatgpt', 'manchester-united', 'moroccan', 'youtube', 'spesial-02', 'spesial-02-copy', 'spesial-03', 'spesial-04', 'spesial-05', 'spesial-06', 'spesial-07', 'spesial-08', 'whatsapp', 'spiderman', 'candy-land', 'room-jogja', 'adat-jawa', 'adat-minang', 'adat-sunda', 'adat-bali', 'adat-batak', 'adat-betawi', 'handwriting', 'polaroid-scrapbook', 'polaroid-newspaper', 'fairytale', 'chelsea', 'astronaut', 'sage-minimalist', 'terracotta-minimalist', 'retro-vinyl'])) {
                $page = 'Invitation/DemoWrapper';
                $props['themeSlug'] = $theme->slug;
                $props['allowedPlans'] = $theme->allowed_plans;
            }

            return Inertia::render($page, $props);
        }

        $defaultData = $theme->default_data ?? [];
        
        $invitation = new Invitation();
        $invitation->id = 0;
        $invitation->theme_id = $theme->id;
        $invitation->title = $defaultData['invitation']['cover_title'] ?? $theme->name;
        $invitation->slug = $slug;
        $invitation->opening_title = $defaultData['invitation']['opening_title'] ?? 'The Wedding Of';
        $invitation->opening_text = $defaultData['invitation']['opening_text'] ?? "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.";
        $invitation->opening_ayat = $defaultData['invitation']['opening_ayat'] ?? 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).';
        $invitation->opening_ayat_translation = $defaultData['invitation']['opening_ayat_translation'] ?? 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).';
        $invitation->opening_ayat_source = $defaultData['invitation']['opening_ayat_source'] ?? 'Adz-Dzariyat: 49';
        $invitation->closing_title = $defaultData['invitation']['closing_title'] ?? 'THANK YOU';
        $invitation->closing_text = $defaultData['invitation']['closing_text'] ?? 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.';
        $invitation->cover_title = $defaultData['invitation']['cover_title'] ?? 'Bimo & Raras';
        $invitation->cover_subtitle = $defaultData['invitation']['cover_subtitle'] ?? 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.';
        $invitation->countdown_target_date = $defaultData['invitation']['countdown_target_date'] ?? now()->addDays(30)->toDateTimeString();
        $invitation->music_url = $defaultData['invitation']['music_url'] ?? '/audio/backsound.mp3';
        $invitation->music_autoplay = true;
        
        // Full features fallback data
        $invitation->video_url = $defaultData['invitation']['video_url'] ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        $invitation->show_dresscode = true;
        $invitation->dresscode_text = 'Para tamu disarankan mengenakan pakaian formal atau semi-formal dengan palet warna berikut.';
        $invitation->dresscode_colors = '#40302d,#d4a373,#e9edc9,#fefae0';
        
        $user = auth()->user() ?: \App\Models\User::where('role', 'reseller')->first();
        if ($user) {
            $user->load(['resellerSettings', 'reseller.resellerSettings']);
            $invitation->setRelation('user', $user);
        }
        
        // Force full features active
        $invitation->enable_rsvp = true;
        $invitation->enable_wishes = true;
        $invitation->show_countdown = true;
        $invitation->show_animations = true;
        $invitation->save_the_date_enabled = true;
        $invitation->enable_auto_scroll = true;
        $invitation->show_qr_code = true;
        $invitation->enable_qr = true;
        $invitation->menu_position = 'bottom';
        $invitation->particle_type = $defaultData['invitation']['particle_type'] ?? 'gold-dust';
        
        // Override cover image with korea demo photo
        $invitation->cover_image = '/images/demo/korea-11-768x512.jpg';
        
        $invitation->setRelation('theme', $theme);

        // Map and override brideGrooms photos
        $brideGroomsData = $defaultData['bride_grooms'] ?? [
            [
                'order_number' => 1,
                'full_name' => 'Bimo Wicaksono',
                'nickname' => 'Bimo',
                'father_name' => 'H. Joko Wicaksono',
                'mother_name' => 'Hj. Endang Sri Lestari',
                'gender' => 'pria',
                'bio' => 'Putra pertama yang siap membangun bahtera rumah tangga.',
                'instagram' => 'bimo',
                'child_order' => 'Pertama',
            ],
            [
                'order_number' => 2,
                'full_name' => 'Raras Sekar Ayu',
                'nickname' => 'Raras',
                'father_name' => 'H. Bambang Sunarto',
                'mother_name' => 'Hj. Wahyu Ningsih',
                'gender' => 'wanita',
                'bio' => 'Putri kedua yang siap mendampingi dengan ketulusan hati.',
                'instagram' => 'raras',
                'child_order' => 'Kedua',
            ]
        ];

        $brideGrooms = collect($brideGroomsData)->map(function ($bg) {
            $model = new \App\Models\BrideGroom($bg);
            $model->photo = $bg['photo'] ?? ($model->gender === 'wanita' ? '/images/demo/korea-3.jpg' : '/images/demo/korea-8.jpg');
            return $model;
        });

        // Map events
        $eventsData = $defaultData['events'] ?? [
            [
                'event_type' => 'akad',
                'event_name' => 'Akad Nikah',
                'event_date' => now()->addDays(30)->toDateString(),
                'start_time' => '08:00',
                'end_time' => '10:00',
                'timezone' => 'WIB',
                'venue_name' => 'Gedung Kesenian Jogja',
                'venue_address' => 'Jl. Panembahan Senopati No. 2, Yogyakarta',
                'gmaps_link' => 'https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta',
                'sort_order' => 0,
                'is_primary' => true,
                'streaming_url' => 'https://youtube.com/live/example-wedding',
                'streaming_platform' => 'YouTube',
                'show_dress_code' => true,
                'dress_code_text' => 'Mohon mengenakan pakaian formal dengan palet warna hangat sesuai tema pernikahan kami.',
                'dress_code_colors' => [
                    [
                        'label' => 'Aesthetic Warm Palette',
                        'colors' => ['#40302d', '#d4a373', '#e9edc9', '#fefae0']
                    ]
                ],
            ],
            [
                'event_type' => 'resepsi',
                'event_name' => 'Resepsi Pernikahan',
                'event_date' => now()->addDays(30)->toDateString(),
                'start_time' => '11:00',
                'end_time' => '14:00',
                'timezone' => 'WIB',
                'venue_name' => 'Gedung Kesenian Jogja',
                'venue_address' => 'Jl. Panembahan Senopati No. 2, Yogyakarta',
                'gmaps_link' => 'https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta',
                'sort_order' => 1,
                'is_primary' => false,
                'show_dress_code' => true,
                'dress_code_text' => 'Mohon mengenakan pakaian formal dengan palet warna hangat sesuai tema pernikahan kami.',
                'dress_code_colors' => [
                    [
                        'label' => 'Aesthetic Warm Palette',
                        'colors' => ['#40302d', '#d4a373', '#e9edc9', '#fefae0']
                    ]
                ],
            ]
        ];
        
        $events = collect($eventsData)->map(function($ev) use ($theme) {
            $event = new \App\Models\Event($ev);
            $event->show_dress_code = true;
            if (empty($event->dress_code_text)) {
                $event->dress_code_text = 'Para tamu disarankan mengenakan pakaian batik modern / pakaian rapi bernuansa pastel.';
            }
            if (empty($event->dress_code_colors) || !is_array($event->dress_code_colors)) {
                $themeColors = $theme->color_scheme;
                $palette = [
                    $themeColors['primary'] ?? '#d4a373',
                    $themeColors['secondary'] ?? '#e9edc9',
                    $themeColors['bg'] ?? '#fefae0',
                    $themeColors['accent'] ?? '#40302d'
                ];
                $event->dress_code_colors = [
                    [
                        'label' => 'Dress Code',
                        'colors' => $palette
                    ]
                ];
            }
            if (empty($event->streaming_url)) {
                $event->streaming_platform = 'YouTube';
                $event->streaming_url = 'https://youtube.com/live/example-wedding';
            }
            if (empty($event->streamings) || !is_array($event->streamings)) {
                $event->streamings = [
                    ['platform' => 'YouTube', 'url' => $event->streaming_url ?? 'https://youtube.com/live/example-wedding']
                ];
            }
            return $event;
        });

        // Map love stories
        $loveStoriesData = $defaultData['love_stories'] ?? [
            [
                'title' => 'Awal Bertemu',
                'story_date' => '2023-11-20',
                'description' => 'Pertama kali dipertemukan oleh takdir di Yogyakarta. Awal kisah indah yang membawa kami ke arah yang sama.',
                'sort_order' => 0,
            ],
            [
                'title' => 'Membangun Komitmen',
                'story_date' => '2024-11-20',
                'description' => 'Setelah melewati berbagai perjalanan obrolan dan komitmen mendalam, kami memutuskan untuk mengakhiri masa pencarian.',
                'sort_order' => 1,
            ]
        ];
        $loveStories = collect($loveStoriesData)->map(fn($ls) => new \App\Models\LoveStory($ls));

        // Map galleries with the requested demo photos
        $galleries = collect([
            ['image_url' => '/images/demo/korea-7-768x512.jpg', 'caption' => 'Kisah Bahagia', 'sort_order' => 0],
            ['image_url' => '/images/demo/korea-11-768x512.jpg', 'caption' => 'Prewedding Day', 'sort_order' => 1],
            ['image_url' => '/images/demo/korea-12-768x512.jpg', 'caption' => 'Momen Bersama', 'sort_order' => 2],
            ['image_url' => '/images/demo/korea-4-768x528.jpg', 'caption' => 'Dua Hati', 'sort_order' => 3],
        ])->map(fn($gl) => new \App\Models\Gallery($gl));

        // Map bank accounts
        $bankAccountsData = $defaultData['bank_accounts'] ?? [
            [
                'bank_name' => 'BCA',
                'account_name' => 'Bimo Wicaksono',
                'account_number' => '1234567890',
                'sort_order' => 0,
            ],
            [
                'bank_name' => 'Mandiri',
                'account_name' => 'Raras Sekar Ayu',
                'account_number' => '0987654321',
                'sort_order' => 1,
            ]
        ];
        $bankAccounts = collect($bankAccountsData)->map(fn($bk) => new \App\Models\BankAccount($bk));

        // Map wishes
        $wishesData = $defaultData['wishes'] ?? [
            ['sender_name' => 'Ahmad Saputra', 'message' => 'Selamat menempuh hidup baru! Semoga sakinah mawaddah wa rahmah selalu.'],
            ['sender_name' => 'Siti Aminah', 'message' => 'Selamat berbahagia ya! Berkah dunia akhirat untuk kedua mempelai.'],
        ];
        $wishes = collect($wishesData)->map(fn($ws) => new Wish($ws));

        $sections = $theme->sections()->orderBy('default_order')->get()->map(function($ts) {
            return new \App\Models\InvitationSection([
                'section_key' => $ts->section_key,
                'section_name' => $ts->section_name,
                'sort_order' => $ts->default_order,
                'is_visible' => true
            ]);
        });

        $page = 'Invitation/Show';
        $props = [
            'invitation' => $invitation,
            'sections' => $sections,
            'brideGrooms' => $brideGrooms,
            'events' => $events,
            'galleries' => $galleries,
            'loveStories' => $loveStories,
            'bankAccounts' => $bankAccounts,
            'guest' => new Guest(['name' => 'Tamu Kehormatan', 'slug' => 'tamu']),
            'wishes' => $wishes,
            'isDemo' => true,
            'subscriptionPlans' => $subscriptionPlans,
            'hideDemoPlanSelector' => $resellerSetting ? (bool)$resellerSetting->hide_demo_plan_selector : false,
        ];

        if (in_array($theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'luxury-04', 'wayang', 'shopee', 'spotify', 'instagram', 'tiktok', 'chatgpt', 'manchester-united', 'moroccan', 'youtube', 'spesial-02', 'spesial-02-copy', 'spesial-03', 'spesial-04', 'spesial-05', 'spesial-06', 'spesial-07', 'spesial-08', 'whatsapp', 'spiderman', 'candy-land', 'room-jogja', 'adat-jawa', 'adat-minang', 'adat-sunda', 'adat-bali', 'adat-batak', 'adat-betawi', 'handwriting', 'polaroid-scrapbook', 'polaroid-newspaper', 'fairytale', 'chelsea', 'astronaut', 'sage-minimalist', 'terracotta-minimalist', 'retro-vinyl'])) {
            $page = 'Invitation/DemoWrapper';
            $props['themeSlug'] = $theme->slug;
            $props['allowedPlans'] = $theme->allowed_plans;
        }

        return Inertia::render($page, $props);
    }

    public function showAr(Request $request, string $slug)
    {
        $invitation = Invitation::where('slug', $slug)
            ->where('is_active', true)
            ->with(['brideGrooms'])
            ->firstOrFail();

        $groom = $invitation->brideGrooms->where('gender', 'pria')->first();
        $bride = $invitation->brideGrooms->where('gender', 'wanita')->first();

        $groomNickname = $groom ? $groom->nickname : 'Groom';
        $brideNickname = $bride ? $bride->nickname : 'Bride';

        $weddingDate = $invitation->countdown_target_date 
            ? $invitation->countdown_target_date->format('d M Y') 
            : '';

        $photoUrl = $invitation->cover_image;
        if ($photoUrl) {
            $coverImages = explode(',', $photoUrl);
            $photoUrl = trim($coverImages[0]);
        }
        if ($photoUrl && !str_starts_with($photoUrl, 'http') && !str_starts_with($photoUrl, '/')) {
            $photoUrl = asset('storage/' . $photoUrl);
        } elseif ($photoUrl && str_starts_with($photoUrl, '/')) {
            $photoUrl = asset($photoUrl);
        } else {
            $photoUrl = asset('images/wedding_hero.png');
        }

        $musicUrl = $invitation->music_url ?: asset('audio/backsound.mp3');
        if ($musicUrl && !str_starts_with($musicUrl, 'http') && !str_starts_with($musicUrl, '/')) {
            $musicUrl = asset('storage/' . $musicUrl);
        } elseif ($musicUrl && str_starts_with($musicUrl, '/')) {
            $musicUrl = asset($musicUrl);
        }

        // ── NFT Marker status ──────────────────────────────────────
        $nftDir   = "ar-nft/{$slug}";
        $hasNft   = \Illuminate\Support\Facades\Storage::disk('public')->exists("{$nftDir}/qr.fset")
                 && \Illuminate\Support\Facades\Storage::disk('public')->exists("{$nftDir}/qr.fset3")
                 && \Illuminate\Support\Facades\Storage::disk('public')->exists("{$nftDir}/qr.iset");

        $nftBasePath = $hasNft ? asset("storage/{$nftDir}/qr") : null;

        return view('ar', [
            'invitation'     => $invitation,
            'groomNickname'  => $groomNickname,
            'brideNickname'  => $brideNickname,
            'weddingDate'    => $weddingDate,
            'photoUrl'       => $photoUrl,
            'musicUrl'       => $musicUrl,
            'hasNft'         => $hasNft,
            'nftBasePath'    => $nftBasePath,
        ]);
    }
}
