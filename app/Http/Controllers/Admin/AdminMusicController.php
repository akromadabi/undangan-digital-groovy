<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AdminMusicController extends Controller
{
    public function index()
    {
        $tracks = MusicLibrary::orderBy('sort_order')->orderByDesc('created_at')->get();
        $categories = Cache::get('music_categories', []);

        return Inertia::render('Admin/Music', [
            'tracks' => $tracks,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'nullable|string|max:255',
            'category' => 'required|string|max:50',
            'url' => 'required|string|max:500',
            'source_type' => 'required|in:url,upload',
        ]);

        MusicLibrary::create($request->only(['title', 'artist', 'category', 'url', 'source_type']));

        return back()->with('success', 'Musik berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'nullable|string|max:255',
            'category' => 'required|string|max:50',
            'url' => 'required|string|max:500',
        ]);

        $track = MusicLibrary::findOrFail($id);
        $track->update($request->only(['title', 'artist', 'category', 'url']));

        return back()->with('success', 'Musik berhasil diperbarui.');
    }

    public function destroy($id)
    {
        MusicLibrary::findOrFail($id)->delete();
        return back()->with('success', 'Musik berhasil dihapus.');
    }

    public function toggleActive($id)
    {
        $track = MusicLibrary::findOrFail($id);
        $track->update(['is_active' => !$track->is_active]);
        return back()->with('success', 'Status musik diperbarui.');
    }

    public function saveCategories(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.value' => 'required|string|max:50',
            'categories.*.label' => 'required|string|max:100',
            'categories.*.emoji' => 'required|string|max:10',
        ]);

        Cache::forever('music_categories', $request->categories);

        return back()->with('success', 'Kategori berhasil disimpan.');
    }
}
