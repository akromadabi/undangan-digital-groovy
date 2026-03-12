<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\InvitationSection;
use App\Models\Theme;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeSettingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;
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
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Undangan belum dibuat'], 404);
            }
            return back()->with('error', 'Undangan belum dibuat.');
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
        $theme = Theme::findOrFail($request->theme_id);

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

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'theme' => $theme,
                'sections' => $invitation->sections()->orderBy('sort_order')->get(),
            ]);
        }

        return back()->with('success', 'Tema berhasil diubah.');
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
