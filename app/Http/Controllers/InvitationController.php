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
                'user.reseller.resellerSettings',
            ])
            ->firstOrFail();

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
        if ($invitation->theme && in_array($invitation->theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'aruna', 'luxury-04', 'wayang', 'shopee', 'manchester-united'])) {
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
        
        $defaultData = $theme->default_data ?? [];
        
        $invitation = new Invitation();
        $invitation->id = 0;
        $invitation->theme_id = $theme->id;
        $invitation->title = $defaultData['invitation']['cover_title'] ?? $theme->name;
        $invitation->slug = $slug;
        $invitation->opening_title = $defaultData['invitation']['opening_title'] ?? 'The Wedding Of';
        $invitation->opening_text = $defaultData['invitation']['opening_text'] ?? '';
        $invitation->opening_ayat = $defaultData['invitation']['opening_ayat'] ?? '';
        $invitation->opening_ayat_translation = $defaultData['invitation']['opening_ayat_translation'] ?? '';
        $invitation->opening_ayat_source = $defaultData['invitation']['opening_ayat_source'] ?? '';
        $invitation->closing_title = $defaultData['invitation']['closing_title'] ?? 'THANK YOU';
        $invitation->closing_text = $defaultData['invitation']['closing_text'] ?? '';
        $invitation->cover_title = $defaultData['invitation']['cover_title'] ?? 'Bimo & Raras';
        $invitation->cover_subtitle = $defaultData['invitation']['cover_subtitle'] ?? '';
        $invitation->countdown_target_date = $defaultData['invitation']['countdown_target_date'] ?? now()->addDays(30)->toDateTimeString();
        $invitation->music_url = $defaultData['invitation']['music_url'] ?? '';
        $invitation->music_autoplay = $defaultData['invitation']['music_autoplay'] ?? true;
        $invitation->enable_rsvp = $defaultData['invitation']['enable_rsvp'] ?? true;
        $invitation->enable_wishes = $defaultData['invitation']['enable_wishes'] ?? true;
        $invitation->show_countdown = true;
        $invitation->show_animations = true;
        $invitation->save_the_date_enabled = true;
        $invitation->particle_type = $defaultData['invitation']['particle_type'] ?? 'gold-dust';
        
        $invitation->setRelation('theme', $theme);

        $brideGrooms = collect($defaultData['bride_grooms'] ?? [])->map(fn($bg) => new \App\Models\BrideGroom($bg));
        $events = collect($defaultData['events'] ?? [])->map(fn($ev) => new \App\Models\Event($ev));
        $loveStories = collect($defaultData['love_stories'] ?? [])->map(fn($ls) => new \App\Models\LoveStory($ls));
        $galleries = collect($defaultData['galleries'] ?? [])->map(fn($gl) => new \App\Models\Gallery($gl));
        $bankAccounts = collect($defaultData['bank_accounts'] ?? [])->map(fn($bk) => new \App\Models\BankAccount($bk));
        $wishes = collect($defaultData['wishes'] ?? [])->map(fn($ws) => new Wish($ws));

        $sections = $theme->sections()->orderBy('default_order')->get()->map(function($ts) {
            return new \App\Models\InvitationSection([
                'section_key' => $ts->section_key,
                'section_name' => $ts->section_name,
                'sort_order' => $ts->default_order,
                'is_visible' => true
            ]);
        });

        $page = 'Invitation/Show';
        if (in_array($theme->slug, ['utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'aruna', 'luxury-04', 'wayang', 'shopee', 'manchester-united'])) {
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
