<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use App\Helpers\MusicHelper;

class AdminMusicController extends Controller
{
    public function index()
    {
        $tracks = MusicLibrary::orderBy('sort_order')->orderByDesc('created_at')->get();
        $categories = Cache::get('music_categories', []);

        // Query daftar musik kustom unik yang digunakan oleh user yang belum masuk ke Koleksi Resmi
        $customSongs = \App\Models\Invitation::whereNotNull('music_url')
            ->whereNotIn('music_url', MusicLibrary::pluck('url'))
            ->select('music_url', \DB::raw('count(*) as use_count'), \DB::raw('MAX(title) as invitation_title'))
            ->groupBy('music_url')
            ->get();

        return Inertia::render('Admin/Music', [
            'tracks' => $tracks,
            'categories' => $categories,
            'customSongs' => $customSongs,
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

        $url = $request->input('url');
        $isYouTube = false;

        if ($url) {
            try {
                $localPath = MusicHelper::convertYoutubeToMp3($url);
                if ($localPath) {
                    $url = $localPath;
                    $isYouTube = true;
                }
            } catch (\Exception $e) {
                return back()->withErrors(['url' => $e->getMessage()]);
            }
        }

        MusicLibrary::create([
            'title' => $request->input('title'),
            'artist' => $request->input('artist'),
            'category' => $request->input('category'),
            'url' => $url,
            'source_type' => $request->input('source_type'),
        ]);

        return back()->with('success', $isYouTube ? 'Lagu dari YouTube berhasil dikonversi ke MP3 dan ditambahkan ke Koleksi!' : 'Musik berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'nullable|string|max:255',
            'category' => 'required|string|max:50',
            'url' => 'required|string|max:500',
        ]);

        $url = $request->input('url');
        $track = MusicLibrary::findOrFail($id);
        $isYouTube = false;

        if ($url && $url !== $track->url) {
            try {
                $localPath = MusicHelper::convertYoutubeToMp3($url);
                if ($localPath) {
                    $url = $localPath;
                    $isYouTube = true;
                }
            } catch (\Exception $e) {
                return back()->withErrors(['url' => $e->getMessage()]);
            }
        }

        $track->update([
            'title' => $request->input('title'),
            'artist' => $request->input('artist'),
            'category' => $request->input('category'),
            'url' => $url,
        ]);

        return back()->with('success', $isYouTube ? 'Lagu dari YouTube berhasil dikonversi ke MP3 dan diperbarui!' : 'Musik berhasil diperbarui.');
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

    public function claimUserMusic(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'nullable|string|max:255',
            'category' => 'required|string|max:50',
            'url' => 'required|string|max:500',
        ]);

        $url = $request->input('url');

        // Tambahkan lagu kustom ini ke Koleksi Platform resmi
        MusicLibrary::create([
            'title' => $request->input('title'),
            'artist' => $request->input('artist'),
            'category' => $request->input('category'),
            'url' => $url,
            'source_type' => str_contains($url, 'youtube_') ? 'url' : 'upload',
            'is_active' => true
        ]);

        return back()->with('success', 'Musik kustom user berhasil ditarik dan dimasukkan ke Koleksi Resmi!');
    }

    public function convertYoutube(Request $request)
    {
        $request->validate([
            'url' => 'required|string|max:500',
        ]);

        try {
            $metadata = null;
            $localPath = MusicHelper::convertYoutubeToMp3($request->input('url'), $metadata);
            if (!$localPath) {
                return response()->json([
                    'success' => false,
                    'message' => 'Format link YouTube tidak valid.'
                ], 422);
            }

            $size = @filesize(storage_path('app/public/' . str_replace('/storage/', '', $localPath)));
            $sizeFormatted = $size ? round($size / 1024 / 1024, 1) . ' MB' : null;

            return response()->json([
                'success' => true,
                'url' => $localPath,
                'title' => $metadata['title'] ?? '',
                'artist' => $metadata['artist'] ?? '',
                'size' => $sizeFormatted,
                'message' => 'YouTube berhasil dikonversi ke MP3.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function cropMusic(Request $request)
    {
        $request->validate([
            'url' => 'required|string|max:500',
            'start' => 'required|numeric|min:0',
            'end' => 'required|numeric|gt:start',
        ]);

        try {
            $newUrl = MusicHelper::cropAndCompressMp3(
                $request->input('url'),
                $request->input('start'),
                $request->input('end')
            );

            return response()->json([
                'success' => true,
                'url' => $newUrl,
                'message' => 'Musik berhasil dipotong!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function compressMusic(Request $request)
    {
        $request->validate([
            'url' => 'required|string|max:500',
        ]);

        try {
            $stats = null;
            $newUrl = MusicHelper::compressMp3($request->input('url'), $stats);

            return response()->json([
                'success' => true,
                'url' => $newUrl,
                'stats' => $stats,
                'message' => 'Metadata dibersihkan! Ukuran berkas dikompres.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
