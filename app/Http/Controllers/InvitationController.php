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
        $invitation = Invitation::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'theme',
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

        if ($isExpired) {
            return Inertia::render('Invitation/Expired', [
                'brand_name' => $brandName,
                'brand_url' => $brandUrl,
                'title' => $invitation->title,
            ]);
        }

        // Increment views_count and unique_views_count
        $invitation->increment('views_count');
        $sessionKey = 'viewed_invitation_' . $invitation->id;
        if (!session()->has($sessionKey)) {
            $invitation->increment('unique_views_count');
            session()->put($sessionKey, true);
        }

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
        if ($owner) {
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
                ];
                $featureSlug = $map[$section->section_key] ?? null;
                if ($featureSlug) {
                    return $owner->hasFeatureAccess($featureSlug);
                }
                return true;
            })->values();

            $invitation->setRelation('sections', $filteredSections);
        }

        // THEME ADDED BY BHAKTIAJI ILHAM
        $page = 'Invitation/Show';
        if ($invitation->theme && in_array($invitation->theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'luxury-04', 'wayang', 'shopee', 'spotify', 'instagram', 'tiktok', 'chatgpt', 'manchester-united', 'moroccan', 'youtube', 'spesial-02', 'spesial-03'])) {
            $page = 'Invitation/' . $invitation->theme->slug . '/DynamicIndex';
        }

        return Inertia::render($page, [
            'invitation' => $invitation,
            'sections' => $invitation->sections,
            'brideGrooms' => $invitation->brideGrooms,
            'events' => $invitation->events,
            'galleries' => $invitation->galleries,
            'loveStories' => $invitation->loveStories,
            'bankAccounts' => $invitation->bankAccounts,
            'guest' => $guest,
            'wishes' => $wishes,
            'show_free_badge' => $showFreeBadge,
            'trial_expires_at' => $trialExpiresAt,
            'brand_name' => $brandName,
            'brand_url' => $brandUrl,
        ]);

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

    public function demo(Request $request, string $slug)
    {
        $theme = \App\Models\Theme::where('slug', $slug)->firstOrFail();
        
        // ── CUSTOM DEMO FROM RESELLER DEMO USER ──
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        $customDemoInvitation = null;
        if ($resellerSetting && $resellerSetting->demo_user_id) {
            $customDemoInvitation = Invitation::where('user_id', $resellerSetting->demo_user_id)
                ->with(['brideGrooms', 'events', 'galleries', 'loveStories', 'bankAccounts', 'sections', 'user'])
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

            $brideGrooms = $customDemoInvitation->brideGrooms;
            $events = $customDemoInvitation->events;
            $galleries = $customDemoInvitation->galleries;
            $loveStories = $customDemoInvitation->loveStories;
            $bankAccounts = $customDemoInvitation->bankAccounts;
            $wishes = $customDemoInvitation->wishes()->latest()->take(50)->get();

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
            if (in_array($theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'luxury-04', 'wayang', 'shopee', 'spotify', 'instagram', 'tiktok', 'chatgpt', 'manchester-united', 'moroccan', 'youtube', 'spesial-02', 'spesial-03'])) {
                $page = 'Invitation/' . $theme->slug . '/DynamicIndex';
            }

            return Inertia::render($page, [
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
            ]);
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
            $model->photo = $model->gender === 'wanita' ? '/images/demo/korea-3.jpg' : '/images/demo/korea-8.jpg';
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
            ]
        ];
        $events = collect($eventsData)->map(fn($ev) => new \App\Models\Event($ev));

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
        if (in_array($theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'luxury-04', 'wayang', 'shopee', 'spotify', 'instagram', 'tiktok', 'chatgpt', 'manchester-united', 'moroccan', 'youtube', 'spesial-02', 'spesial-03'])) {
            $page = 'Invitation/' . $theme->slug . '/DynamicIndex';
        }

        return Inertia::render($page, [
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
        ]);
    }
}
