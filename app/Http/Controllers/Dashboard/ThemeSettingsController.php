<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\BrideGroom;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\Guest;
use App\Models\InvitationSection;
use App\Models\LoveStory;
use App\Models\Theme;
use App\Models\Wish;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ThemeSettingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;

        // bug fixed by Bhaktiaji Ilham
        // auto-create default invitation for Admin/Superadmin if missing
        if (!$invitation && ($user->isSuperAdmin() || $user->isAdmin())) {
            $invitation = \App\Models\Invitation::create([
                'user_id' => $user->id,
                'slug' => 'preview-' . \Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(6)),
                'opening_title' => 'The Wedding Of',
                'opening_text' => "Assalamu'alaikum...",
                'theme_id' => \App\Models\Theme::active()->first()?->id ?? 1,
            ]);
            
            // Initialize default sections
            if ($invitation->theme) {
                foreach ($invitation->theme->sections as $ts) {
                    \App\Models\InvitationSection::create([
                        'invitation_id' => $invitation->id,
                        'section_key' => $ts->section_key,
                        'section_name' => $ts->section_name,
                        'sort_order' => $ts->default_order,
                        'is_visible' => $ts->is_default,
                    ]);
                }
            }
        }

        $themes = Theme::active()->orderBy('sort_order')->get();

        return Inertia::render('Dashboard/ThemeSettings', [
            'invitation' => $invitation ? [
                'id' => $invitation->id,
                'theme_id' => $invitation->theme_id,
                'layout_mode' => $invitation->layout_mode,
                'show_side_menu' => $invitation->show_side_menu,
                'slug' => $invitation->slug,
                'cover_image' => $invitation->cover_image,
                'cover_title' => $invitation->cover_title,
                'cover_subtitle' => $invitation->cover_subtitle,
                'is_private' => $invitation->is_private,
                'enable_qr' => $invitation->enable_qr,
                'hide_photos' => $invitation->hide_photos,
                'particle_type' => $invitation->particle_type,
                'particle_count' => $invitation->particle_count ?? 30,
                'particle_speed' => $invitation->particle_speed ?? 'normal',
                'menu_position' => $invitation->menu_position ?? 'none',
            ] : null,
            'currentTheme' => $invitation?->theme,
            'themes' => $themes,
            'sections' => $invitation?->sections()->orderBy('sort_order')->get() ?? [],
            'previewData' => $this->getPreviewData($invitation),
        ]);
    }

    public function updateLayout(Request $request)
    {
        $request->validate([
            'layout_mode' => 'sometimes|required|in:scroll,slide-h,slide-v',
            'menu_position' => 'sometimes|required|in:none,bottom,left,right',
            'particle_type' => 'sometimes|nullable|string|max:20',
            'particle_count' => 'sometimes|integer|min:5|max:100',
            'particle_speed' => 'sometimes|in:slow,normal,fast',
        ]);

        $invitation = $request->user()->invitation;

        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $data = $request->only(['layout_mode', 'menu_position', 'particle_type', 'particle_count', 'particle_speed']);
        $invitation->update($data);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'layout_mode' => $invitation->layout_mode, 'menu_position' => $invitation->menu_position]);
        }

        return back()->with('success', 'Layout berhasil diubah.');
    }

    public function changeTheme(Request $request)
    {
        $request->validate([
            'theme_id' => 'required|exists:themes,id',
        ]);

        $invitation = $request->user()->invitation;
        
        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $theme = Theme::findOrFail($request->theme_id);

        // THEME ADDED BY BHAKTIAJI ILHAM
        $invitation->update(['theme_id' => $theme->id]);

        // Re-initialize sections from new theme while preserving visibility
        $existingSections = $invitation->sections()->pluck('is_visible', 'section_key')->toArray();
        $invitation->sections()->delete();

        foreach ($theme->sections as $ts) {
            InvitationSection::create([
                'invitation_id' => $invitation->id,
                'section_key' => $ts->section_key,
                'section_name' => $ts->section_name,
                'sort_order' => $ts->default_order,
                'is_visible' => $existingSections[$ts->section_key] ?? $ts->is_default,
            ]);
        }

        // ── THEME ADDED BY BHAKTIAJI ILHAM ──
        // Auto-seed default data from theme's default_data JSON
        // This populates all menu content (mempelai, events, gallery, love story, bank, opening, music)
        // so the user only needs to replace demo data with their own
        if ($theme->default_data) {
            $this->seedDefaultData($invitation, $theme->default_data);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'theme' => $theme,
                'sections' => $invitation->sections()->orderBy('sort_order')->get(),
                'seeded' => !empty($theme->default_data),
            ]);
        }

        return back()->with('success', 'Tema berhasil diubah dan data default telah dimuat.');
    }

    public function updateSections(Request $request)
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|integer',
            'sections.*.sort_order' => 'required|integer',
            'sections.*.is_visible' => 'required|boolean',
        ]);

        $invitation = $request->user()->invitation;

        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        foreach ($request->sections as $sectionData) {
            InvitationSection::where('id', $sectionData['id'])
                ->where('invitation_id', $invitation->id)
                ->update([
                    'sort_order' => $sectionData['sort_order'],
                    'is_visible' => $sectionData['is_visible'],
                ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'sections' => $invitation->sections()->orderBy('sort_order')->get(),
            ]);
        }

        return back()->with('success', 'Pengaturan section berhasil disimpan.');
    }

    /**
     * THEME ADDED BY BHAKTIAJI ILHAM
     * Seed default data dari theme ke invitation saat user memilih theme.
     * Data yang di-seed: invitation fields, mempelai, kisah cinta, acara, galeri, dan amplop digital.
     */
    private function seedDefaultData($invitation, array $defaultData): void
    {
        try {
            // ── 1) Update invitation fields (opening, closing, music, cover, dll) ──
            if (!empty($defaultData['invitation'])) {
                $invitationFields = $defaultData['invitation'];
                $allowedFields = [
                    'opening_title', 'opening_text', 'opening_ayat', 'opening_ayat_translation',
                    'opening_ayat_source', 'closing_title', 'closing_text', 'turut_mengundang_text',
                    'religion', 'music_url', 'music_autoplay', 'cover_title', 'cover_subtitle',
                    'countdown_target_date', 'save_the_date_enabled', 'particle_type',
                    'gallery_mode', 'enable_rsvp', 'enable_wishes', 'show_countdown',
                    'show_qr_code', 'show_guest_name',
                ];

                $fieldsToUpdate = array_intersect_key($invitationFields, array_flip($allowedFields));
                if (!empty($fieldsToUpdate)) {
                    $invitation->update($fieldsToUpdate);
                }
            }

            // ── 2) Seed Mempelai (Bride & Groom) ──
            if (!empty($defaultData['bride_grooms'])) {
                // Hapus data mempelai lama, ganti dengan default theme
                $invitation->brideGrooms()->delete();
                foreach ($defaultData['bride_grooms'] as $bg) {
                    BrideGroom::create(array_merge($bg, [
                        'invitation_id' => $invitation->id,
                    ]));
                }
            }

            // ── 3) Seed Kisah Cinta (Love Stories) ──
            if (!empty($defaultData['love_stories'])) {
                $invitation->loveStories()->delete();
                foreach ($defaultData['love_stories'] as $story) {
                    LoveStory::create(array_merge($story, [
                        'invitation_id' => $invitation->id,
                    ]));
                }
            }

            // ── 4) Seed Acara (Events) ──
            if (!empty($defaultData['events'])) {
                $invitation->events()->delete();
                foreach ($defaultData['events'] as $event) {
                    Event::create(array_merge($event, [
                        'invitation_id' => $invitation->id,
                    ]));
                }
            }

            // ── 5) Seed Galeri (Galleries) ──
            if (!empty($defaultData['galleries'])) {
                $invitation->galleries()->delete();
                foreach ($defaultData['galleries'] as $gallery) {
                    Gallery::create(array_merge($gallery, [
                        'invitation_id' => $invitation->id,
                    ]));
                }
            }

            // ── 6) Seed Amplop Digital (Bank Accounts) ──
            if (!empty($defaultData['bank_accounts'])) {
                $invitation->bankAccounts()->delete();
                foreach ($defaultData['bank_accounts'] as $bank) {
                    BankAccount::create(array_merge($bank, [
                        'invitation_id' => $invitation->id,
                    ]));
                }
            }

            // ── 7) Seed Tamu (Guests) ──
            if (!empty($defaultData['guests'])) {
                $invitation->guests()->delete();
                foreach ($defaultData['guests'] as $guest) {
                    Guest::create(array_merge($guest, [
                        'invitation_id' => $invitation->id,
                    ]));
                }
            }

            // ── 8) Seed Ucapan (Wishes) ──
            if (!empty($defaultData['wishes'])) {
                $invitation->wishes()->delete();
                foreach ($defaultData['wishes'] as $wish) {
                    Wish::create(array_merge($wish, [
                        'invitation_id' => $invitation->id,
                    ]));
                }
            }

            Log::info('Theme default data seeded for invitation #' . $invitation->id);
        } catch (\Exception $e) {
            Log::error('Failed to seed theme default data: ' . $e->getMessage());
        }
    }

    private function getPreviewData($invitation)
    {
        if (!$invitation)
            return null;

        return [
            'invitation' => $invitation->load(['theme', 'brideGrooms', 'events', 'galleries', 'loveStories', 'bankAccounts']),
            'sections' => $invitation->visibleSections()->get(),
        ];
    }
}
