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
        return Inertia::render('Admin/Themes/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:themes',
            'thumbnail' => 'required|string|max:500',
            'category' => 'nullable|string|max:50',
            'color_scheme' => 'nullable|array',
            'font_config' => 'nullable|array',
            'is_premium' => 'boolean',
        ]);

        Theme::create($request->all());
        return redirect()->route('admin.themes.index')->with('success', 'Tema berhasil ditambahkan.');
    }

    public function edit(Theme $theme)
    {
        return Inertia::render('Admin/Themes/Form', ['theme' => $theme->load('sections')]);
    }

    public function update(Request $request, Theme $theme)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'category' => 'nullable|string|max:50',
            'color_scheme' => 'nullable|array',
            'font_config' => 'nullable|array',
        ]);

        $theme->update($request->all());
        return redirect()->route('admin.themes.index')->with('success', 'Tema berhasil diupdate.');
    }

    public function destroy(Theme $theme)
    {
        $theme->delete();
        return redirect()->route('admin.themes.index')->with('success', 'Tema berhasil dihapus.');
    }
}
