<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\GreetingCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GreetingCardController extends Controller
{
    public function index(Request $request)
    {
        return redirect()->route('dashboard.invitations', ['tab' => 'cards']);
    }

    public function create()
    {
        return Inertia::render('Dashboard/GreetingCard/Form', [
            'card'      => null,
            'types'     => GreetingCard::$types,
            'templates' => GreetingCard::$templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'nullable|string|max:100',
            'template'       => 'required|in:stillwithyou,giftforanita,oceanbreeze,cosmicdrift,retroarcade,cyberpunk,bioluminescent,mysticforest',
            'type'           => 'required|in:anniversary,birthday,graduation,wedding',
            'recipient_name' => 'required|string|max:100',
            'sender_name'    => 'required|string|max:100',
            'photo_url'      => 'nullable|string|max:500',
            'photos'         => 'nullable|array',
            'photos.*'       => 'nullable|string|max:500',
            'messages'       => 'nullable|array',
            'messages.*'     => 'nullable|string|max:500',
            'custom_url'     => 'nullable|string|max:100|alpha_dash|unique:greeting_cards,custom_url',
        ]);

        $card = GreetingCard::create([
            ...$validated,
            'user_id'    => $request->user()->id,
            'title'      => $validated['title'] ?: 'Kartu Ucapan',
            'messages'   => array_values(array_filter($validated['messages'] ?? [])),
            'photos'     => array_values(array_filter($validated['photos'] ?? [])),
            'custom_url' => ($validated['custom_url'] ?? null) ?: GreetingCard::generateUniqueSlug(),
        ]);

        return redirect()->route('greeting-card.index')
            ->with('success', 'Kartu ucapan berhasil dibuat! 🎉');
    }

    public function edit(Request $request, $id)
    {
        $user = $request->user();
        $card = GreetingCard::where('user_id', $user->id)->findOrFail($id);

        return Inertia::render('Dashboard/GreetingCard/Form', [
            'card'      => [
                'id'             => $card->id,
                'title'          => $card->title,
                'template'       => $card->template,
                'type'           => $card->type,
                'recipient_name' => $card->recipient_name,
                'sender_name'    => $card->sender_name,
                'photo_url'      => $card->photo_url,
                'photos'         => $card->photos ?? ($card->photo_url ? [$card->photo_url] : []),
                'messages'       => $card->messages ?? [],
                'custom_url'     => $card->custom_url,
                'share_url'      => $card->getShareUrl(),
            ],
            'types'     => GreetingCard::$types,
            'templates' => GreetingCard::$templates,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $card = GreetingCard::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'title'          => 'nullable|string|max:100',
            'template'       => 'required|in:stillwithyou,giftforanita,oceanbreeze,cosmicdrift,retroarcade,cyberpunk,bioluminescent,mysticforest',
            'type'           => 'required|in:anniversary,birthday,graduation,wedding',
            'recipient_name' => 'required|string|max:100',
            'sender_name'    => 'required|string|max:100',
            'photo_url'      => 'nullable|string|max:500',
            'photos'         => 'nullable|array',
            'photos.*'       => 'nullable|string|max:500',
            'messages'       => 'nullable|array',
            'messages.*'     => 'nullable|string|max:500',
            'custom_url'     => 'required|string|max:100|alpha_dash|unique:greeting_cards,custom_url,' . $id,
        ]);

        // Delete old cached OG image to force regeneration with updated details/slug
        $oldCachePath = storage_path('app/public/og-images/' . $card->custom_url . '.png');
        if (file_exists($oldCachePath)) {
            @unlink($oldCachePath);
        }

        $card->update([
            ...$validated,
            'title'    => $validated['title'] ?: 'Kartu Ucapan',
            'messages' => array_values(array_filter($validated['messages'] ?? [])),
            'photos'   => array_values(array_filter($validated['photos'] ?? [])),
        ]);

        return redirect()->route('greeting-card.index')
            ->with('success', 'Kartu ucapan berhasil diperbarui! ✨');
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $card = GreetingCard::where('user_id', $user->id)->findOrFail($id);
        $card->delete();

        return back()->with('success', 'Kartu ucapan dihapus.');
    }

    /**
     * Public preview — no auth required.
     */
    public function preview($slug)
    {
        $card = GreetingCard::where('custom_url', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('GreetingCardPreview', [
            'card' => [
                'id'             => $card->id,
                'title'          => $card->title,
                'custom_url'     => $card->custom_url,
                'template'       => $card->template,
                'type'           => $card->type,
                'type_label'     => $card->type_label,
                'recipient_name' => $card->recipient_name,
                'sender_name'    => $card->sender_name,
                'photo_url'      => $card->photo_url,
                'photos'         => $card->photos ?? ($card->photo_url ? [$card->photo_url] : []),
                'messages'       => $card->messages ?? [],
                'og_image_url'   => route('greeting-card.og-image', $card->custom_url),
            ],
        ]);
    }

    /**
     * Generate dynamic scannable thematic QR code OG Image
     */
    public function ogImage($slug)
    {
        $card = GreetingCard::where('custom_url', $slug)->firstOrFail();

        // 1. Image Cache Directory Setup
        $cacheDir = storage_path('app/public/og-images');
        if (!file_exists($cacheDir)) {
            mkdir($cacheDir, 0755, true);
        }
        $cachePath = $cacheDir . '/' . $slug . '.png';

        // Serve cached version if it exists
        if (file_exists($cachePath)) {
            return response()->file($cachePath, [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        // 2. Load TrueType Fonts from Google CDN to local storage to guarantee cross-platform premium antialiased typography
        $outfitFont = storage_path('fonts/Outfit-Bold.ttf');
        $dancingFont = storage_path('fonts/DancingScript-Bold.ttf');

        if (!file_exists(dirname($outfitFont))) {
            mkdir(dirname($outfitFont), 0755, true);
        }

        if (!file_exists($outfitFont)) {
            try {
                file_put_contents($outfitFont, file_get_contents('https://github.com/google/fonts/raw/main/ofl/outfit/static/Outfit-Bold.ttf'));
            } catch (\Exception $e) {
                // fallback to default Arial or system path in case of network issue
                $outfitFont = 'arial'; 
            }
        }
        if (!file_exists($dancingFont)) {
            try {
                file_put_contents($dancingFont, file_get_contents('https://github.com/google/fonts/raw/main/ofl/dancingscript/static/DancingScript-Bold.ttf'));
            } catch (\Exception $e) {
                $dancingFont = 'arial';
            }
        }

        // 3. Setup canvas using our generated premium black template image if available
        $templatePath = public_path('images/og_card_template.png');
        if (file_exists($templatePath)) {
            $im = imagecreatefrompng($templatePath);
            // Ensure alpha blending is enabled
            imagealphablending($im, true);
            imagesavealpha($im, true);
        } else {
            // Fallback to blank TrueColor Canvas (1200x630) if template not found
            $w = 1200;
            $h = 630;
            $im = imagecreatetruecolor($w, $h);
            imagealphablending($im, true);
            imagesavealpha($im, true);
            $bg = imagecolorallocate($im, 10, 10, 10);
            imagefill($im, 0, 0, $bg);
        }

        // Center position for the premium heart QR layout on the card
        $cx = 600;
        $cy = 315;
        $qrSize = 340;

        // Draw a premium soft-edged background glow or base heart shape in the center of the card
        $size = 460;
        $r = $size / 4;
        $heartColor = imagecolorallocate($im, 76, 17, 37); // Beautiful rich deep burgundy backdrop heart matching reference
        imagefilledellipse($im, $cx - $r, $cy - $r/2, $r * 2.2, $r * 2.2, $heartColor);
        imagefilledellipse($im, $cx + $r, $cy - $r/2, $r * 2.2, $r * 2.2, $heartColor);
        $points = [
            $cx - $r * 2, $cy - $r/2,
            $cx + $r * 2, $cy - $r/2,
            $cx, $cy + $size * 0.58
        ];
        imagefilledpolygon($im, $points, $heartColor);

        // Fetch a high-contrast transparent bright red QR Code from QuickChart
        $cardUrl = route('greeting-card.preview', $card->custom_url);
        $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2764.png'; // ❤️ Heart center icon
        
        // Generate bright red QR code modules on a transparent background
        $qrApiUrl = "https://quickchart.io/qr?text=" . urlencode($cardUrl) . "&size=" . $qrSize . "&dark=e11d48&light=00000000&margin=1&centerImageUrl=" . urlencode($qrCenterIcon);
        
        try {
            $response = \Illuminate\Support\Facades\Http::withoutVerifying()->timeout(8)->get($qrApiUrl);
            if ($response->successful()) {
                $qrData = $response->body();
                $qrIm = imagecreatefromstring($qrData);
                if ($qrIm) {
                    $qw = imagesx($qrIm);
                    $qh = imagesy($qrIm);
                    
                    // Create mask image canvas of the same size
                    $mask = imagecreatetruecolor($qw, $qh);
                    $maskBlack = imagecolorallocate($mask, 0, 0, 0);
                    $maskWhite = imagecolorallocate($mask, 255, 255, 255);
                    imagefill($mask, 0, 0, $maskBlack);
                    
                    // Draw a white heart on the mask canvas
                    $mcx = $qw / 2;
                    $mcy = $qh / 2;
                    $msize = $qw * 0.95;
                    $mr = $msize / 4;
                    
                    imagefilledellipse($mask, $mcx - $mr, $mcy - $mr/2, $mr * 2.25, $mr * 2.25, $maskWhite);
                    imagefilledellipse($mask, $mcx + $mr, $mcy - $mr/2, $mr * 2.25, $mr * 2.25, $maskWhite);
                    $mpoints = [
                        $mcx - $mr * 2, $mcy - $mr/2,
                        $mcx + $mr * 2, $mcy - $mr/2,
                        $mcx, $mcy + $msize * 0.55
                    ];
                    imagefilledpolygon($mask, $mpoints, $maskWhite);
                    
                    // Create final heart-masked QR image with full alpha transparency support
                    $maskedQr = imagecreatetruecolor($qw, $qh);
                    imagealphablending($maskedQr, false);
                    imagesavealpha($maskedQr, true);
                    
                    // Finder pattern safeguard radius (approx 24% of dimensions)
                    $finderLimit = $qw * 0.24;
                    
                    // Loop through every pixel to apply the mask while preserving corner finder patterns
                    for ($x = 0; $x < $qw; $x++) {
                        for ($y = 0; $y < $qh; $y++) {
                            // Check if pixel is inside the three corner finder zones
                            $isFinder = false;
                            
                            // Top-Left Finder Zone
                            if ($x < $finderLimit && $y < $finderLimit) {
                                $isFinder = true;
                            }
                            // Top-Right Finder Zone
                            if ($x > ($qw - $finderLimit) && $y < $finderLimit) {
                                $isFinder = true;
                            }
                            // Bottom-Left Finder Zone
                            if ($x < $finderLimit && $y > ($qh - $finderLimit)) {
                                $isFinder = true;
                            }
                            
                            // Mask check
                            $maskCol = imagecolorat($mask, $x, $y);
                            $maskVal = ($maskCol >> 16) & 0xFF;
                            
                            if ($isFinder || $maskVal >= 128) {
                                // Keep the original scannable QR pixel
                                $srcCol = imagecolorat($qrIm, $x, $y);
                                imagesetpixel($maskedQr, $x, $y, $srcCol);
                            } else {
                                // Cut off and make transparent outside the heart
                                imagesetpixel($maskedQr, $x, $y, imagecolorallocatealpha($maskedQr, 0, 0, 0, 127));
                            }
                        }
                    }
                    
                    // Enable alpha blending on the main canvas to overlay the transparent masked QR beautifully
                    imagealphablending($im, true);
                    imagecopyresampled($im, $maskedQr, $cx - $qrSize/2, $cy - $qrSize/2, 0, 0, $qrSize, $qrSize, $qw, $qh);
                    
                    // Destroy temp images
                    imagedestroy($qrIm);
                    imagedestroy($mask);
                    imagedestroy($maskedQr);
                }
            }
        } catch (\Exception $e) {
            // Draw a basic high contrast square QR fallback on deep background if API fails
            $qrFallbackApi = "https://quickchart.io/qr?text=" . urlencode($cardUrl) . "&size=" . $qrSize . "&dark=ffffff&light=000000";
            try {
                $responseFallback = \Illuminate\Support\Facades\Http::withoutVerifying()->timeout(5)->get($qrFallbackApi);
                if ($responseFallback->successful()) {
                    $qrFallbackData = $responseFallback->body();
                    $fbIm = imagecreatefromstring($qrFallbackData);
                    if ($fbIm) {
                        imagecopyresampled($im, $fbIm, $cx - $qrSize/2, $cy - $qrSize/2, 0, 0, $qrSize, $qrSize, imagesx($fbIm), imagesy($fbIm));
                        imagedestroy($fbIm);
                    }
                }
            } catch (\Exception $ex) {}
        }
 
        // Save generated image to cache and output it
        imagepng($im, $cachePath);
        imagedestroy($im);
 
        return response()->file($cachePath, [
            'Content-Type' => 'image/png',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
