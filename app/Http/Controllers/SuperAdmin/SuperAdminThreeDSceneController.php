<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ThreeDScene;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SuperAdminThreeDSceneController extends Controller
{
    public function index()
    {
        $scenes = ThreeDScene::orderBy('id', 'desc')->get();
        return Inertia::render('SuperAdmin/ThreeDScenes/Index', [
            'scenes' => $scenes,
        ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/ThreeDScenes/Editor', [
            'scene' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|alpha_dash|unique:three_d_scenes,slug',
            'config' => 'nullable|array',
            'thumbnail' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        ThreeDScene::create($validated);

        return redirect()->route('super-admin.three-d-scenes.index')
            ->with('success', 'Scene 3D berhasil dibuat! 🎨');
    }

    public function edit(ThreeDScene $threeDScene)
    {
        return Inertia::render('SuperAdmin/ThreeDScenes/Editor', [
            'scene' => $threeDScene,
        ]);
    }

    public function update(Request $request, ThreeDScene $threeDScene)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|alpha_dash|unique:three_d_scenes,slug,' . $threeDScene->id,
            'config' => 'nullable|array',
            'thumbnail' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $threeDScene->update($validated);

        return redirect()->route('super-admin.three-d-scenes.index')
            ->with('success', 'Scene 3D berhasil diperbarui! ✨');
    }

    public function destroy(ThreeDScene $threeDScene)
    {
        $threeDScene->delete();
        return back()->with('success', 'Scene 3D berhasil dihapus.');
    }

    public function toggleActive(ThreeDScene $threeDScene)
    {
        $threeDScene->update(['is_active' => !$threeDScene->is_active]);
        return back()->with('success', $threeDScene->is_active ? 'Scene diaktifkan.' : 'Scene dinonaktifkan.');
    }

    public function uploadAsset(Request $request)
    {
        $request->validate([
            'file' => 'nullable|file|image|mimes:png,jpg,jpeg,webp|max:5120',
            'base64' => 'nullable|string',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('three_d_scenes/assets', 'public');
            return response()->json([
                'success' => true,
                'url' => '/storage/' . $path,
            ]);
        } elseif ($request->filled('base64')) {
            $base64Data = $request->input('base64');
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
                $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                $type = strtolower($type[1]);

                if (!in_array($type, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                    return response()->json(['success' => false, 'message' => 'Format file tidak didukung.'], 400);
                }

                $base64Data = base64_decode($base64Data);
                if ($base64Data === false) {
                    return response()->json(['success' => false, 'message' => 'Gagal mendekode Base64.'], 400);
                }

                $fileName = uniqid() . '.' . $type;
                $path = 'three_d_scenes/assets/' . $fileName;
                Storage::disk('public')->put($path, $base64Data);

                return response()->json([
                    'success' => true,
                    'url' => '/storage/' . $path,
                ]);
            }
        }

        return response()->json(['success' => false, 'message' => 'Aset gambar tidak valid.'], 400);
    }
}
