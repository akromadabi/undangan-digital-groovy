<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArNftController extends Controller
{
    /**
     * Check status: apakah NFT descriptor sudah ada untuk slug ini
     */
    public function status(Request $request)
    {
        $invitation = $this->getInvitation($request);
        if (!$invitation) return response()->json(['ready' => false, 'error' => 'Undangan tidak ditemukan.'], 404);

        $slug = $invitation->slug;
        $ready = Storage::disk('public')->exists("ar-nft/{$slug}/qr.fset")
            && Storage::disk('public')->exists("ar-nft/{$slug}/qr.fset3")
            && Storage::disk('public')->exists("ar-nft/{$slug}/qr.iset");

        return response()->json([
            'ready'  => $ready,
            'slug'   => $slug,
            'paths'  => $ready ? [
                'fset'  => asset("storage/ar-nft/{$slug}/qr.fset"),
                'fset3' => asset("storage/ar-nft/{$slug}/qr.fset3"),
                'iset'  => asset("storage/ar-nft/{$slug}/qr.iset"),
            ] : null,
        ]);
    }

    /**
     * Upload 3 file descriptor NFT dari browser (hasil generate client-side)
     */
    public function store(Request $request)
    {
        $invitation = $this->getInvitation($request);
        if (!$invitation) return response()->json(['success' => false, 'error' => 'Undangan tidak ditemukan.'], 404);

        $request->validate([
            'fset'  => 'required',
            'fset3' => 'required',
            'iset'  => 'required',
        ]);

        $slug = $invitation->slug;
        $dir  = "ar-nft/{$slug}";
        Storage::disk('public')->makeDirectory($dir);

        // Decode base64 binary dan simpan
        $this->saveBase64($request->input('fset'),  "public/{$dir}/qr.fset");
        $this->saveBase64($request->input('fset3'), "public/{$dir}/qr.fset3");
        $this->saveBase64($request->input('iset'),  "public/{$dir}/qr.iset");

        return response()->json(['success' => true, 'slug' => $slug]);
    }

    /**
     * Hapus NFT descriptor (reset ke Hiro)
     */
    public function destroy(Request $request)
    {
        $invitation = $this->getInvitation($request);
        if (!$invitation) return response()->json(['success' => false], 404);

        $slug = $invitation->slug;
        Storage::disk('public')->deleteDirectory("ar-nft/{$slug}");

        return response()->json(['success' => true]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function getInvitation(Request $request): ?Invitation
    {
        return Invitation::where('user_id', auth()->id())
            ->where('is_active', true)
            ->first();
    }

    private function saveBase64(string $base64Data, string $storagePath): void
    {
        // Strip data URI prefix jika ada
        if (str_contains($base64Data, ',')) {
            $base64Data = explode(',', $base64Data, 2)[1];
        }
        $binaryData = base64_decode($base64Data);
        Storage::put($storagePath, $binaryData);
    }
}
