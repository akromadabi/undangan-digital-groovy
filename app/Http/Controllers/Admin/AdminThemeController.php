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
        return Inertia::render('Admin/Themes/Index', [
            'themes' => $themes,
            'availableCategories' => $this->getAvailableCategories()
        ]);
    }

    public function create()
    {
        $plans = \App\Models\SubscriptionPlan::where('type', 'invitation')->orderBy('sort_order')->get(['id', 'name', 'slug']);
        return Inertia::render('Admin/Themes/Form', [
            'plans' => $plans,
            'categories' => $this->getAvailableCategories(),
            'categoryCounts' => $this->getCategoryCounts()
        ]);
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
        $plans = \App\Models\SubscriptionPlan::where('type', 'invitation')->orderBy('sort_order')->get(['id', 'name', 'slug']);
        return Inertia::render('Admin/Themes/Form', [
            'theme' => $theme->load('sections'),
            'plans' => $plans,
            'categories' => $this->getAvailableCategories(),
            'categoryCounts' => $this->getCategoryCounts()
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

    public function storeCategory(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:50',
        ]);

        $newCat = ucwords(strtolower(trim($request->category)));

        if ($newCat === '') {
            return redirect()->back()->withErrors(['category' => 'Nama kategori tidak boleh kosong.']);
        }

        $manuallyAdded = \App\Models\GlobalSetting::getValue('theme_categories', []);
        if (!is_array($manuallyAdded)) {
            $manuallyAdded = [];
        }

        $allCats = $this->getAvailableCategories();
        $allCatsLower = array_map('strtolower', $allCats);

        if (in_array(strtolower($newCat), $allCatsLower)) {
            return redirect()->back()->with('success', "Kategori '{$newCat}' sudah ada di dalam daftar.");
        }

        $manuallyAdded[] = $newCat;
        $manuallyAdded = array_unique(array_map(function($cat) {
            return ucwords(strtolower(trim($cat)));
        }, $manuallyAdded));

        \App\Models\GlobalSetting::setValue('theme_categories', array_values($manuallyAdded), 'json');

        return redirect()->back()->with('success', "Kategori '{$newCat}' berhasil ditambahkan.");
    }

    public function updateCategory(Request $request)
    {
        $request->validate([
            'old_category' => 'required|string|max:50',
            'new_category' => 'required|string|max:50',
        ]);

        $old = ucwords(strtolower(trim($request->old_category)));
        $new = ucwords(strtolower(trim($request->new_category)));

        $affected = Theme::whereRaw('LOWER(TRIM(category)) = ?', [strtolower($old)])
            ->update(['category' => $new]);

        $manuallyAdded = \App\Models\GlobalSetting::getValue('theme_categories', []);
        if (is_array($manuallyAdded)) {
            $updatedManual = [];
            $found = false;
            foreach ($manuallyAdded as $cat) {
                if (strtolower(trim($cat)) === strtolower($old)) {
                    $updatedManual[] = $new;
                    $found = true;
                } else {
                    $updatedManual[] = ucwords(strtolower(trim($cat)));
                }
            }
            if ($found) {
                $updatedManual = array_unique($updatedManual);
                \App\Models\GlobalSetting::setValue('theme_categories', array_values($updatedManual), 'json');
            }
        }

        return redirect()->back()->with('success', "Kategori '{$old}' berhasil diubah menjadi '{$new}' pada {$affected} tema.");
    }

    public function deleteCategory(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:50',
        ]);

        $cat = ucwords(strtolower(trim($request->category)));

        $affected = Theme::whereRaw('LOWER(TRIM(category)) = ?', [strtolower($cat)])
            ->update(['category' => 'Elegant']);

        $manuallyAdded = \App\Models\GlobalSetting::getValue('theme_categories', []);
        if (is_array($manuallyAdded)) {
            $updatedManual = [];
            foreach ($manuallyAdded as $item) {
                if (strtolower(trim($item)) !== strtolower($cat)) {
                    $updatedManual[] = ucwords(strtolower(trim($item)));
                }
            }
            \App\Models\GlobalSetting::setValue('theme_categories', array_values($updatedManual), 'json');
        }

        return redirect()->back()->with('success', "Kategori '{$cat}' berhasil dihapus. {$affected} tema telah dialihkan ke kategori 'Elegant'.");
    }

    private function getAvailableCategories()
    {
        $defaultCategories = [
            'Premium',
            'Elegant',
            'Modern',
            'Floral',
            'Islamic',
            'Rustic',
            'Minimalist',
            'Playful',
            'Anime'
        ];

        $manuallyAdded = \App\Models\GlobalSetting::getValue('theme_categories', []);
        if (!is_array($manuallyAdded)) {
            $manuallyAdded = [];
        }

        $usedCategories = \App\Models\Theme::distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->pluck('category')
            ->toArray();

        $merged = array_merge($defaultCategories, $manuallyAdded, $usedCategories);

        $normalized = [];
        foreach ($merged as $cat) {
            $cat = trim($cat);
            if ($cat === '') {
                continue;
            }
            
            $titleCased = ucwords(strtolower($cat));
            if (!in_array($titleCased, $normalized)) {
                $normalized[] = $titleCased;
            }
        }

        sort($normalized);

        return $normalized;
    }

    private function getCategoryCounts()
    {
        $counts = \App\Models\Theme::selectRaw('category, count(*) as count')
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        $normalized = [];
        foreach ($counts as $cat => $count) {
            $normalized[ucwords(strtolower(trim($cat)))] = $count;
        }

        return $normalized;
    }
}
