<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Models\ThemeBuilderDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeBuilderController extends Controller
{
    public function edit(Theme $theme)
    {
        // Load the document
        $builderDocument = ThemeBuilderDocument::where('theme_id', $theme->id)->first();
        
        return Inertia::render('Admin/Themes/Builder', [
            'theme' => $theme,
            'builderDocument' => $builderDocument ? $builderDocument->document : null,
            'documentVersion' => $builderDocument ? $builderDocument->version : '1.0.0',
        ]);
    }

    public function save(Request $request, Theme $theme)
    {
        $validated = $request->validate([
            'document' => 'required|array',
            'version' => 'nullable|string',
        ]);

        $builderDocument = ThemeBuilderDocument::updateOrCreate(
            ['theme_id' => $theme->id],
            [
                'document' => $validated['document'],
                'version' => $request->input('version', '1.0.0'),
                'created_by' => auth()->id(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Desain tema berhasil disimpan.',
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
            'type' => 'wedding-theme-builder-template',
            'version' => $builderDocument->version,
            'theme_name' => $theme->name,
            'theme_slug' => $theme->slug,
            'document' => $builderDocument->document,
        ], JSON_PRETTY_PRINT);

        return response($json, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'theme_id' => 'required|exists:themes,id',
            'file' => 'required|file|mimes:json,txt',
        ]);

        $fileContent = file_get_contents($request->file('file')->getRealPath());
        $data = json_decode($fileContent, true);

        if (!$data || !isset($data['type']) || $data['type'] !== 'wedding-theme-builder-template' || !isset($data['document'])) {
            return redirect()->back()->with('error', 'Format file JSON tidak valid untuk template builder.');
        }

        $themeId = $request->input('theme_id');

        ThemeBuilderDocument::updateOrCreate(
            ['theme_id' => $themeId],
            [
                'document' => $data['document'],
                'version' => $data['version'] ?? '1.0.0',
                'created_by' => auth()->id(),
            ]
        );

        return redirect()->back()->with('success', 'Template builder berhasil di-import.');
    }
}
