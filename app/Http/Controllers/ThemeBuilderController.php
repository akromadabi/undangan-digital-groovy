<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Models\ThemeBuilderDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ThemeBuilderController extends Controller
{
    public function index()
    {
        $themes = Theme::with(['user'])->withCount(['invitations', 'builderDocument'])->orderBy('sort_order')->get();
        $users = \App\Models\User::where('role', 'user')->orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Themes/BuilderList', [
            'themes' => $themes,
            'users' => $users
        ]);
    }

    public function edit(Theme $theme)
    {
        // Load the document
        $builderDocument = ThemeBuilderDocument::where('theme_id', $theme->id)->first();

        return Inertia::render('Admin/Themes/Builder', [
            'theme'           => $theme,
            'builderDocument' => $builderDocument ? $builderDocument->document : null,
            'documentVersion' => $builderDocument ? $builderDocument->version : '1.0.0',
        ]);
    }

    public function save(Request $request, Theme $theme)
    {
        $validated = $request->validate([
            'document' => 'required|array',
            'version'  => 'nullable|string',
        ]);

        $builderDocument = ThemeBuilderDocument::updateOrCreate(
            ['theme_id' => $theme->id],
            [
                'document'   => $validated['document'],
                'version'    => $request->input('version', '1.0.0'),
                'created_by' => auth()->id(),
            ]
        );

        return response()->json([
            'success'  => true,
            'message'  => 'Desain tema berhasil disimpan.',
            'document' => $builderDocument->document,
        ]);
    }

    public function export(Theme $theme)
    {
        $builderDocument = ThemeBuilderDocument::where('theme_id', $theme->id)->first();

        if (!$builderDocument || !$builderDocument->document) {
            return redirect()->back()->with('error', 'Dokumen builder tidak ditemukan untuk tema ini.');
        }

        $filename = 'theme-template-' . $theme->slug . '-' . date('Y-m-d') . '.json';
        $json = json_encode([
            'type'       => 'wedding-theme-builder-template',
            'version'    => $builderDocument->version,
            'theme_name' => $theme->name,
            'theme_slug' => $theme->slug,
            'document'   => $builderDocument->document,
        ], JSON_PRETTY_PRINT);

        return response($json, 200, [
            'Content-Type'        => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'theme_id' => 'required|exists:themes,id',
            'file'     => 'required|file|mimes:json,txt',
        ]);

        $fileContent = file_get_contents($request->file('file')->getRealPath());
        $data = json_decode($fileContent, true);

        // Auto-wrap raw template if it contains 'content' at root (e.g. Elementor JSON or raw theme JSON)
        if ($data && isset($data['content']) && (!isset($data['type']) || $data['type'] !== 'wedding-theme-builder-template')) {
            $data = [
                'type'     => 'wedding-theme-builder-template',
                'version'  => $data['version'] ?? '1.0.0',
                'document' => $data,
            ];
        }

        if (!$data || !isset($data['type']) || $data['type'] !== 'wedding-theme-builder-template' || !isset($data['document'])) {
            return redirect()->back()->with('error', 'Format file JSON tidak valid untuk template builder.');
        }

        ThemeBuilderDocument::updateOrCreate(
            ['theme_id' => $request->input('theme_id')],
            [
                'document'   => $data['document'],
                'version'    => $data['version'] ?? '1.0.0',
                'created_by' => auth()->id(),
            ]
        );

        return redirect()->back()->with('success', 'Template builder berhasil di-import.');
    }

    /**
     * Create a brand-new draft theme for building from scratch.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'               => 'required|string|max:100',
            'category'           => 'nullable|string|max:50',
            'copy_from_theme_id' => 'nullable|exists:themes,id',
        ]);

        if ($request->filled('copy_from_theme_id')) {
            $hasDoc = ThemeBuilderDocument::where('theme_id', $request->copy_from_theme_id)->exists();
            if (!$hasDoc) {
                return redirect()->back()->withErrors([
                    'copy_from_theme_id' => 'Tema sumber terpilih tidak memiliki layout builder JSON dan tidak bisa disalin.'
                ]);
            }
        }

        $slug = Str::slug($validated['name']) . '-' . substr(uniqid(), -5);

        $sourceTheme = null;
        if ($request->filled('copy_from_theme_id')) {
            $sourceTheme = Theme::with('sections')->find($request->copy_from_theme_id);
        }

        if ($sourceTheme) {
            $theme = Theme::create([
                'name'             => $validated['name'],
                'slug'             => $slug,
                'category'         => $validated['category'] ?? $sourceTheme->category ?? 'Builder',
                'type'             => $sourceTheme->type,
                'thumbnail'        => $sourceTheme->thumbnail,
                'preview_images'   => $sourceTheme->preview_images,
                'preview_template' => $sourceTheme->preview_template,
                'preview_bg_style' => $sourceTheme->preview_bg_style,
                'preview_url'      => $sourceTheme->preview_url,
                'color_scheme'     => $sourceTheme->color_scheme,
                'font_config'      => $sourceTheme->font_config,
                'default_data'     => $sourceTheme->default_data,
                'css_file'         => $sourceTheme->css_file,
                'supports_scroll'  => $sourceTheme->supports_scroll,
                'supports_slide'   => $sourceTheme->supports_slide,
                'supports_tab'     => $sourceTheme->supports_tab,
                'is_premium'       => $sourceTheme->is_premium,
                'allowed_plans'    => $sourceTheme->allowed_plans,
                'is_active'        => false,
                'sort_order'       => (Theme::max('sort_order') ?? 0) + 1,
            ]);

            // Duplicate ThemeBuilderDocument if exists
            $sourceDoc = ThemeBuilderDocument::where('theme_id', $sourceTheme->id)->first();
            if ($sourceDoc) {
                ThemeBuilderDocument::create([
                    'theme_id'   => $theme->id,
                    'document'   => $sourceDoc->document,
                    'version'    => $sourceDoc->version,
                    'created_by' => auth()->id(),
                ]);
            }

            // Duplicate ThemeSection list
            foreach ($sourceTheme->sections as $sec) {
                \App\Models\ThemeSection::create([
                    'theme_id'       => $theme->id,
                    'section_key'    => $sec->section_key,
                    'section_name'   => $sec->section_name,
                    'component_name' => $sec->component_name,
                    'default_order'  => $sec->default_order,
                    'is_removable'   => $sec->is_removable,
                    'is_default'     => $sec->is_default,
                ]);
            }
        } else {
            $theme = Theme::create([
                'name'       => $validated['name'],
                'slug'       => $slug,
                'category'   => $validated['category'] ?? 'Builder',
                'type'       => ['wedding'],
                'thumbnail'  => '',
                'is_active'  => false,
                'sort_order' => (Theme::max('sort_order') ?? 0) + 1,
            ]);
        }

        return redirect()->route('super-admin.theme-builder.edit', $theme->id)
            ->with('success', 'Tema baru "' . $theme->name . '" berhasil dibuat. Silakan mulai mendesain!');
    }

    /**
     * Delete a draft theme (only if it has no linked invitations).
     */
    public function destroy(Theme $theme)
    {
        if ($theme->invitations()->count() > 0) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus tema yang sudah dipakai oleh undangan.');
        }

        ThemeBuilderDocument::where('theme_id', $theme->id)->delete();
        $theme->delete();

        return redirect()->route('super-admin.theme-builder.index')
            ->with('success', 'Tema "' . $theme->name . '" berhasil dihapus.');
    }
}
