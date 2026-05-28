<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminThemeController extends Controller
{
    public function index()
    {
        $themes = Theme::withCount('invitations')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Themes/Index', ['themes' => $themes]);
    }

    public function create()
    {
        $plans = \App\Models\SubscriptionPlan::orderBy('sort_order')->get(['id', 'name', 'slug']);
        return Inertia::render('Admin/Themes/Form', ['plans' => $plans]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:themes',
            'thumbnail' => 'required|string|max:500',
            'preview_images' => 'nullable|array',
            'preview_template' => 'nullable|string|max:50',
            'preview_bg_style' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'type' => 'required|array',
            'type.*' => 'string|in:wedding,birthday,graduation,aqiqah,circumcision,anniversary,general',
            'color_scheme' => 'nullable|array',
            'font_config' => 'nullable|array',
            'is_premium' => 'boolean',
            'allowed_plans' => 'nullable|array',
            'is_active' => 'boolean',
            'supports_scroll' => 'boolean',
            'supports_slide' => 'boolean',
            'supports_tab' => 'boolean',
            'base_likes' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer',
        ]);

        Theme::create($validated);
        return redirect()->back()->with('success', 'Tema berhasil ditambahkan.');
    }

    public function edit(Theme $theme)
    {
        $plans = \App\Models\SubscriptionPlan::orderBy('sort_order')->get(['id', 'name', 'slug']);
        return Inertia::render('Admin/Themes/Form', [
            'theme' => $theme->load('sections'),
            'plans' => $plans
        ]);
    }

    public function update(Request $request, Theme $theme)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'thumbnail' => 'required|string|max:500',
            'preview_images' => 'nullable|array',
            'preview_template' => 'nullable|string|max:50',
            'preview_bg_style' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'type' => 'required|array',
            'type.*' => 'string|in:wedding,birthday,graduation,aqiqah,circumcision,anniversary,general',
            'color_scheme' => 'nullable|array',
            'font_config' => 'nullable|array',
            'is_premium' => 'boolean',
            'allowed_plans' => 'nullable|array',
            'is_active' => 'boolean',
            'supports_scroll' => 'boolean',
            'supports_slide' => 'boolean',
            'supports_tab' => 'boolean',
            'base_likes' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer',
        ]);

        $theme->update($validated);
        return redirect()->back()->with('success', 'Tema berhasil diupdate.');
    }

    public function toggleActive(Theme $theme)
    {
        $theme->update(['is_active' => !$theme->is_active]);
        return redirect()->back()->with('success', 'Status aktif tema berhasil diubah.');
    }

    public function destroy(Theme $theme)
    {
        $theme->delete();
        return redirect()->back()->with('success', 'Tema berhasil dihapus.');
    }
}
