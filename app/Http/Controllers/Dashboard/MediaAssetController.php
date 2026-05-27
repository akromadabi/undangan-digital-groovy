<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Models\BrideGroom;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaAssetController extends Controller
{
    private function getUserInvitation(Request $request)
    {
        return $request->user()->invitation;
    }

    public function index(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $assets = $invitation->mediaAssets()->latest()->get();

        return response()->json([
            'success' => true,
            'assets' => $assets,
        ]);
    }

    public function upload(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $request->validate([
            'file' => 'required|image|max:10240', // Maksimum 10MB
        ]);

        try {
            $file = $request->file('file');
            
            // Kompresi otomatis untuk efisiensi penyimpanan
            \App\Helpers\ImageCompressor::compress($file);

            $ext = $file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'jpg';
            if ($ext === 'jpeg') {
                $ext = 'jpg';
            }

            $time = time();
            $rand = rand(100, 999);
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $cleanName = Str::slug($originalName);
            $filename = "album-{$cleanName}-{$time}-{$rand}.{$ext}";

            // Simpan ke disk public di bawah folder uploads/media-library
            $path = $file->storeAs('uploads/media-library', $filename, 'public');

            // Simpan rekam data di database
            $asset = MediaAsset::create([
                'invitation_id' => $invitation->id,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => Storage::disk('public')->size($path),
                'mime_type' => $file->getClientMimeType(),
            ]);

            // Auto-gallery fallback for backwards compatibility
            $url = '/storage/' . $path;
            $maxGalleries = $request->user()->currentPlan()?->max_galleries ?? 3;
            $currentCount = $invitation->galleries()->count();
            if ($currentCount < $maxGalleries) {
                Gallery::create([
                    'invitation_id' => $invitation->id,
                    'image_url' => $url,
                    'caption' => null,
                    'sort_order' => $currentCount,
                ]);
            }

            return response()->json([
                'success' => true,
                'asset' => $asset,
                'url' => '/storage/' . $path,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $invitation = $this->getUserInvitation($request);
        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $asset = $invitation->mediaAssets()->where('id', $id)->first();
        if (!$asset) {
            return response()->json(['error' => 'Berkas media tidak ditemukan atau tidak diizinkan'], 404);
        }

        try {
            // Hapus file fisik dari penyimpanan server
            if (Storage::disk('public')->exists($asset->file_path)) {
                Storage::disk('public')->delete($asset->file_path);
            }

            $url = '/storage/' . $asset->file_path;

            // Clear cover / opening references
            if ($invitation->cover_image) {
                $coverImages = array_filter(explode(',', $invitation->cover_image));
                if (in_array($url, $coverImages)) {
                    $coverImages = array_diff($coverImages, [$url]);
                    $invitation->cover_image = !empty($coverImages) ? implode(',', $coverImages) : null;
                    $invitation->save();
                }
            }
            if ($invitation->opening_image) {
                $openingImages = array_filter(explode(',', $invitation->opening_image));
                if (in_array($url, $openingImages)) {
                    $openingImages = array_diff($openingImages, [$url]);
                    $invitation->opening_image = !empty($openingImages) ? implode(',', $openingImages) : null;
                    $invitation->save();
                }
            }

            // Clear groom / bride references
            $invitation->brideGrooms()->where('photo', $url)->update([
                'photo' => null,
                'photo_position_x' => 50,
                'photo_position_y' => 50,
                'photo_zoom' => 1.0
            ]);

            // Clear from gallery prewedding
            $invitation->galleries()->where('image_url', $url)->delete();

            // Hapus data dari database
            $asset->delete();

            return response()->json([
                'success' => true,
                'message' => 'Berkas media berhasil dihapus dan dibersihkan dari penggunaan',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function toggleUsage(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $request->validate([
            'asset_id' => 'required|exists:media_assets,id',
            'target' => 'required|in:cover,opening,groom,bride,gallery',
            'active' => 'required|boolean',
        ]);

        $asset = $invitation->mediaAssets()->where('id', $request->asset_id)->first();
        if (!$asset) {
            return response()->json(['error' => 'Berkas media tidak ditemukan'], 404);
        }

        $url = '/storage/' . $asset->file_path;
        $target = $request->target;
        $active = $request->active;

        if ($target === 'cover' || $target === 'opening') {
            $field = $target === 'cover' ? 'cover_image' : 'opening_image';
            $currentImages = array_filter(explode(',', $invitation->$field));
            
            if ($active) {
                if (!in_array($url, $currentImages)) {
                    $currentImages[] = $url;
                }
            } else {
                $currentImages = array_diff($currentImages, [$url]);
            }
            
            $invitation->$field = !empty($currentImages) ? implode(',', $currentImages) : null;
            
            if ($active) {
                if (count($currentImages) <= 1) {
                    $invitation->{$target . '_position_x'} = 50;
                    $invitation->{$target . '_position_y'} = 50;
                    $invitation->{$target . '_zoom'} = 1.0;
                }
            }
            $invitation->save();
        } elseif ($target === 'groom') {
            $groom = $invitation->brideGrooms()->where('gender', 'pria')->first();
            if ($groom) {
                $groom->photo = $active ? $url : null;
                if ($active) {
                    $groom->photo_position_x = 50;
                    $groom->photo_position_y = 50;
                    $groom->photo_zoom = 1.0;
                }
                $groom->save();
            } else {
                return response()->json(['error' => 'Data mempelai pria belum dibuat'], 400);
            }
        } elseif ($target === 'bride') {
            $bride = $invitation->brideGrooms()->where('gender', 'wanita')->first();
            if ($bride) {
                $bride->photo = $active ? $url : null;
                if ($active) {
                    $bride->photo_position_x = 50;
                    $bride->photo_position_y = 50;
                    $bride->photo_zoom = 1.0;
                }
                $bride->save();
            } else {
                return response()->json(['error' => 'Data mempelai wanita belum dibuat'], 400);
            }
        } elseif ($target === 'gallery') {
            if ($active) {
                $maxGalleries = $request->user()->currentPlan()?->max_galleries ?? 3;
                $currentCount = $invitation->galleries()->count();
                if ($currentCount >= $maxGalleries) {
                    return response()->json(['error' => "Jumlah foto galeri sudah mencapai batas maksimal ({$maxGalleries}) paket Anda."], 400);
                }

                $exists = $invitation->galleries()->where('image_url', $url)->exists();
                if (!$exists) {
                    Gallery::create([
                        'invitation_id' => $invitation->id,
                        'image_url' => $url,
                        'caption' => null,
                        'sort_order' => $currentCount,
                    ]);
                }
            } else {
                $invitation->galleries()->where('image_url', $url)->delete();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Status penggunaan berhasil diperbarui',
            'invitation' => $invitation->only([
                'cover_image', 'cover_position_x', 'cover_position_y', 'cover_zoom',
                'opening_image', 'opening_position_x', 'opening_position_y', 'opening_zoom'
            ]),
            'brideGrooms' => $invitation->brideGrooms()->get(),
            'galleries' => $invitation->galleries()->get(),
        ]);
    }

    public function savePosition(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $request->validate([
            'target' => 'required|in:cover,opening,groom,bride',
            'position_x' => 'required|integer|min:0|max:100',
            'position_y' => 'required|integer|min:0|max:100',
            'zoom' => 'required|numeric|min:1.0|max:5.0',
        ]);

        $target = $request->target;
        $x = $request->position_x;
        $y = $request->position_y;
        $zoom = $request->zoom;

        if ($target === 'cover') {
            $invitation->cover_position_x = $x;
            $invitation->cover_position_y = $y;
            $invitation->cover_zoom = $zoom;
            $invitation->save();
        } elseif ($target === 'opening') {
            $invitation->opening_position_x = $x;
            $invitation->opening_position_y = $y;
            $invitation->opening_zoom = $zoom;
            $invitation->save();
        } elseif ($target === 'groom') {
            $groom = $invitation->brideGrooms()->where('gender', 'pria')->first();
            if ($groom) {
                $groom->photo_position_x = $x;
                $groom->photo_position_y = $y;
                $groom->photo_zoom = $zoom;
                $groom->save();
            } else {
                return response()->json(['error' => 'Data mempelai pria belum dibuat'], 400);
            }
        } elseif ($target === 'bride') {
            $bride = $invitation->brideGrooms()->where('gender', 'wanita')->first();
            if ($bride) {
                $bride->photo_position_x = $x;
                $bride->photo_position_y = $y;
                $bride->photo_zoom = $zoom;
                $bride->save();
            } else {
                return response()->json(['error' => 'Data mempelai wanita belum dibuat'], 400);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Posisi dan zoom berhasil disimpan',
            'invitation' => $invitation->only([
                'cover_image', 'cover_position_x', 'cover_position_y', 'cover_zoom',
                'opening_image', 'opening_position_x', 'opening_position_y', 'opening_zoom'
            ]),
            'brideGrooms' => $invitation->brideGrooms()->get(),
        ]);
    }

    public function syncGallery(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        if (!$invitation) {
            return response()->json(['error' => 'Undangan tidak ditemukan'], 404);
        }

        $request->validate([
            'asset_ids' => 'present|array',
            'asset_ids.*' => 'exists:media_assets,id',
        ]);

        $maxGalleries = $request->user()->currentPlan()?->max_galleries ?? 3;
        $assetIds = $request->asset_ids;

        if (count($assetIds) > $maxGalleries) {
            return response()->json(['error' => "Jumlah foto terpilih (" . count($assetIds) . ") melebihi kuota galeri Anda ({$maxGalleries})."], 400);
        }

        // Get the paths for selected asset IDs
        $assets = $invitation->mediaAssets()->whereIn('id', $assetIds)->get();
        $urls = $assets->map(function($asset) {
            return '/storage/' . $asset->file_path;
        })->toArray();

        // 1. Delete gallery items that are NOT in the selected URLs
        $invitation->galleries()->whereNotIn('image_url', $urls)->delete();

        // 2. Insert new gallery items
        $currentUrls = $invitation->galleries()->pluck('image_url')->toArray();
        $sortOrder = 0;
        foreach ($urls as $url) {
            if (!in_array($url, $currentUrls)) {
                \App\Models\Gallery::create([
                    'invitation_id' => $invitation->id,
                    'image_url' => $url,
                    'caption' => null,
                    'sort_order' => $sortOrder++,
                ]);
            } else {
                $invitation->galleries()->where('image_url', $url)->update(['sort_order' => $sortOrder++]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Galeri prewedding berhasil diperbarui masal',
            'galleries' => $invitation->galleries()->get(),
        ]);
    }
}
