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
        ]);

        $card = GreetingCard::create([
            ...$validated,
            'user_id'    => $request->user()->id,
            'title'      => $validated['title'] ?: 'Kartu Ucapan',
            'messages'   => array_values(array_filter($validated['messages'] ?? [])),
            'photos'     => array_values(array_filter($validated['photos'] ?? [])),
            'custom_url' => GreetingCard::generateUniqueSlug(),
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
        ]);

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

        // 3. Create TrueColor Canvas (1200x630)
        $w = 1200;
        $h = 630;
        $im = imagecreatetruecolor($w, $h);

        // Enable alpha blending
        imagealphablending($im, true);
        imagesavealpha($im, true);

        // 4. Color & Gradient Definitions matching the card template or type
        $type = $card->type; // 'anniversary' | 'wedding' | 'birthday' | 'graduation'
        $template = $card->template;
        
        if ($template === 'retroarcade') {
            // Dark Neon Retro Arcade theme
            $bgStart = ['r' => 15, 'g' => 7, 'b' => 38]; // Deep purple
            $bgEnd   = ['r' => 4, 'g' => 2, 'b' => 13];  // Near black
            $themeColorHex = 'a855f7'; // violet-500
            $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f3ae.png'; // 🎮 Game controller
            $textColorRGB = ['r' => 168, 'g' => 85, 'b' => 247]; // Neon Purple
        } elseif ($template === 'cyberpunk') {
            // Dark Cyberpunk theme
            $bgStart = ['r' => 3, 'g' => 7, 'b' => 18]; // Slate-950
            $bgEnd   = ['r' => 15, 'g' => 23, 'b' => 42];  // Slate-900
            $themeColorHex = 'ec4899'; // pink-500
            $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f50c.png'; // 🔌 Plug/Chip
            $textColorRGB = ['r' => 236, 'g' => 72, 'b' => 153]; // Hot Pink
        } elseif ($template === 'bioluminescent') {
            // Dark Ocean Teal theme
            $bgStart = ['r' => 2, 'g' => 21, 'b' => 38]; // Deep blue-teal
            $bgEnd   = ['r' => 3, 'g' => 48, 'b' => 67];  // Under water blue-teal
            $themeColorHex = '06b6d4'; // cyan-500
            $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1fab8.png'; // 🪼 Jellyfish
            $textColorRGB = ['r' => 34, 'g' => 211, 'b' => 238]; // Cyan
        } elseif ($template === 'mysticforest') {
            // Dark Forest Green theme
            $bgStart = ['r' => 6, 'g' => 19, 'b' => 11]; // Dark pine green
            $bgEnd   = ['r' => 2, 'g' => 7, 'b' => 4];  // Very dark green
            $themeColorHex = 'a3e635'; // lime-400
            $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f332.png'; // 🌲 Pine tree
            $textColorRGB = ['r' => 163, 'g' => 230, 'b' => 53]; // Lime
        } elseif ($type === 'anniversary' || $type === 'wedding') {
            // Pastel Pink/Rose theme
            $bgStart = ['r' => 255, 'g' => 241, 'b' => 242]; // #FFF1F2
            $bgEnd   = ['r' => 255, 'g' => 255, 'b' => 255]; // #FFFFFF
            $themeColorHex = 'db2777'; // pink-600
            $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2764.png'; // ❤️
            $textColorRGB = ['r' => 76, 'g' => 17, 'b' => 37]; // burgundy
        } elseif ($type === 'birthday') {
            // Orange/Yellow/Gold theme
            $bgStart = ['r' => 254, 'g' => 243, 'b' => 199]; // #FEF3C7
            $bgEnd   = ['r' => 255, 'g' => 255, 'b' => 255]; // #FFFFFF
            $themeColorHex = 'd97706'; // amber-600
            $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f382.png'; // 🎂
            $textColorRGB = ['r' => 120, 'g' => 53, 'b' => 4]; // deep brown
        } else {
            // Graduation: Classy Teal theme
            $bgStart = ['r' => 204, 'g' => 251, 'b' => 241]; // #CCFBF1
            $bgEnd   = ['r' => 255, 'g' => 255, 'b' => 255]; // #FFFFFF
            $themeColorHex = '0d9488'; // teal-600
            $qrCenterIcon = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f393.png'; // 🎓
            $textColorRGB = ['r' => 17, 'g' => 94, 'b' => 89]; // deep teal
        }

        // Draw Vertical Gradient Background
        for ($y = 0; $y < $h; $y++) {
            $factor = $y / $h;
            $r = (int)($bgStart['r'] + ($bgEnd['r'] - $bgStart['r']) * $factor);
            $g = (int)($bgStart['g'] + ($bgEnd['g'] - $bgStart['g']) * $factor);
            $b = (int)($bgStart['b'] + ($bgEnd['b'] - $bgStart['b']) * $factor);
            $col = imagecolorallocate($im, $r, $g, $b);
            imageline($im, 0, $y, $w, $y, $col);
        }

        // 5. Draw Left Card Box (Glass-morphism / Dark arcade box effect)
        if ($template === 'retroarcade') {
            $containerBg = imagecolorallocate($im, 26, 17, 54); // dark violet container
            $shadow = imagecolorallocatealpha($im, 0, 0, 0, 120);
            $borderColor = imagecolorallocate($im, 168, 85, 247); // neon purple border
            $bodyColor = imagecolorallocate($im, 229, 231, 235); // light grey
            $accentColor = imagecolorallocate($im, 34, 211, 238); // neon cyan accent
        } elseif ($template === 'cyberpunk') {
            $containerBg = imagecolorallocate($im, 15, 23, 42); // dark slate container
            $shadow = imagecolorallocatealpha($im, 0, 0, 0, 120);
            $borderColor = imagecolorallocate($im, 34, 211, 238); // neon cyan border
            $bodyColor = imagecolorallocate($im, 241, 245, 249); // slate-100
            $accentColor = imagecolorallocate($im, 236, 72, 153); // neon pink accent
        } elseif ($template === 'bioluminescent') {
            $containerBg = imagecolorallocate($im, 5, 34, 56); // ocean dark blue
            $shadow = imagecolorallocatealpha($im, 0, 0, 0, 110);
            $borderColor = imagecolorallocate($im, 6, 182, 212); // cyan border
            $bodyColor = imagecolorallocate($im, 204, 251, 241); // light teal text
            $accentColor = imagecolorallocate($im, 45, 212, 191); // teal-400 accent
        } elseif ($template === 'mysticforest') {
            $containerBg = imagecolorallocate($im, 13, 28, 16); // dark forest container
            $shadow = imagecolorallocatealpha($im, 0, 0, 0, 120);
            $borderColor = imagecolorallocate($im, 163, 230, 53); // lime border
            $bodyColor = imagecolorallocate($im, 217, 249, 157); // light lime text
            $accentColor = imagecolorallocate($im, 253, 224, 71); // yellow accent
        } else {
            $containerBg = imagecolorallocate($im, 255, 255, 255); // white
            $shadow = imagecolorallocatealpha($im, 50, 32, 23, 115); // soft drop shadow
            $borderColor = imagecolorallocate($im, 229, 231, 235); // light grey
            $bodyColor = imagecolorallocate($im, 55, 65, 81); // slate-700
            $accentColor = imagecolorallocate($im, 229, 101, 75); // accent coral
        }
        
        // Shadow offset box
        imagefilledrectangle($im, 84, 84, 654, 554, $shadow);
        // Clean container
        imagefilledrectangle($im, 80, 80, 650, 550, $containerBg);

        // Draw elegant thin border inside box
        imagerectangle($im, 80, 80, 650, 550, $borderColor);

        // Allocating colors for typography
        $titleColor = imagecolorallocate($im, $textColorRGB['r'], $textColorRGB['g'], $textColorRGB['b']);

        // Left Card Typography rendering using premium Google Fonts
        if ($outfitFont !== 'arial' && file_exists($outfitFont)) {
            imagettftext($im, 12, 0, 120, 150, $accentColor, $outfitFont, "KARTU UCAPAN DIGITAL SPESIAL");
            imagettftext($im, 18, 0, 120, 240, $bodyColor, $outfitFont, "Spesial Untuk Kamu,");
            imagettftext($im, 28, 0, 120, 300, $titleColor, $outfitFont, $card->recipient_name);
            imagettftext($im, 14, 0, 120, 420, $bodyColor, $outfitFont, "Dari Pengirim: " . $card->sender_name);
            imagettftext($im, 10, 0, 120, 500, imagecolorallocate($im, 156, 163, 175), $outfitFont, "Pindai kode QR di sebelah kanan untuk membuka!");
        } else {
            // standard font fallback
            imagestring($im, 5, 120, 130, "KARTU UCAPAN DIGITAL SPESIAL", $accentColor);
            imagestring($im, 5, 120, 210, "Spesial Untuk Kamu,", $bodyColor);
            imagestring($im, 5, 120, 260, $card->recipient_name, $titleColor);
            imagestring($im, 5, 120, 380, "Dari Pengirim: " . $card->sender_name, $bodyColor);
        }

        if ($dancingFont !== 'arial' && file_exists($dancingFont)) {
            // Cursive title text
            imagettftext($im, 38, 0, 120, 200, $titleColor, $dancingFont, $card->title);
        } else {
            imagestring($im, 5, 120, 170, $card->title, $titleColor);
        }

        // 6. Draw Right Thematic Shape and Embed Custom QR Code
        $cx = 900;
        $cy = 315;
        $qrSize = 280;
        
        $shapeCol = imagecolorallocate($im, (int)($textColorRGB['r'] * 1.2), (int)($textColorRGB['g'] * 1.2), (int)($textColorRGB['b'] * 1.2));

        if ($template === 'retroarcade') {
            // Draw a Giant pixelated Space Invader style shape behind QR
            // Draw invader body:
            // central block
            imagefilledrectangle($im, $cx - 160, $cy - 120, $cx + 160, $cy + 120, $shapeCol);
            // ears/antennae
            imagefilledrectangle($im, $cx - 120, $cy - 180, $cx - 80, $cy - 120, $shapeCol);
            imagefilledrectangle($im, $cx + 80, $cy - 180, $cx + 120, $cy - 120, $shapeCol);
            // legs
            imagefilledrectangle($im, $cx - 160, $cy + 120, $cx - 100, $cy + 180, $shapeCol);
            imagefilledrectangle($im, $cx + 100, $cy + 120, $cx + 160, $cy + 180, $shapeCol);
            // arms
            imagefilledrectangle($im, $cx - 200, $cy - 60, $cx - 160, $cy + 60, $shapeCol);
            imagefilledrectangle($im, $cx + 160, $cy - 60, $cx + 200, $cy + 60, $shapeCol);
        } elseif ($template === 'cyberpunk') {
            // Draw a futuristic CPU chip shape behind the QR code
            // draw main outer chip box
            imagefilledrectangle($im, $cx - 170, $cy - 170, $cx + 170, $cy + 170, $shapeCol);
            
            // Draw CPU pins (horizontal and vertical lines around it)
            $pinCol = imagecolorallocate($im, 34, 211, 238); // cyan pins
            for ($offset = -120; $offset <= 120; $offset += 40) {
                // Top pins
                imagefilledrectangle($im, $cx + $offset - 5, $cy - 185, $cx + $offset + 5, $cy - 170, $pinCol);
                // Bottom pins
                imagefilledrectangle($im, $cx + $offset - 5, $cy + 170, $cx + $offset + 5, $cy + 185, $pinCol);
                // Left pins
                imagefilledrectangle($im, $cx - 185, $cy + $offset - 5, $cx - 170, $cy + $offset + 5, $pinCol);
                // Right pins
                imagefilledrectangle($im, $cx + 170, $cy + $offset - 5, $cx + 185, $cy + $offset + 5, $pinCol);
            }
        } elseif ($template === 'bioluminescent') {
            // Draw a Giant circular Submarine Viewport shape behind QR
            // Draw Viewport bezel:
            imagefilledellipse($im, $cx, $cy, 450, 450, $shapeCol);
            
            // Draw little Viewport rivets/screws (8 small dots around)
            $rivetCol = imagecolorallocate($im, 6, 182, 212); // bright cyan rivets
            for ($angle = 0; $angle < 360; $angle += 45) {
                $rx = $cx + (int)(210 * cos(deg2rad($angle)));
                $ry = $cy + (int)(210 * sin(deg2rad($angle)));
                imagefilledellipse($im, $rx, $ry, 16, 16, $rivetCol);
            }
        } elseif ($template === 'mysticforest') {
            // Draw a diamond board with glowing circles representing fireflies
            $points = [
                $cx, $cy - 180,
                $cx + 180, $cy,
                $cx, $cy + 180,
                $cx - 180, $cy
            ];
            imagefilledpolygon($im, $points, $shapeCol);
            
            // Draw fireflies (4 small yellow-green dots)
            $flyCol = imagecolorallocate($im, 217, 249, 157);
            imagefilledellipse($im, $cx - 130, $cy - 100, 16, 16, $flyCol);
            imagefilledellipse($im, $cx + 130, $cy - 100, 16, 16, $flyCol);
            imagefilledellipse($im, $cx - 130, $cy + 100, 16, 16, $flyCol);
            imagefilledellipse($im, $cx + 130, $cy + 100, 16, 16, $flyCol);
        } elseif ($type === 'anniversary' || $type === 'wedding') {
            // Draw Giant solid Pink/Red Heart frame
            $size = 460;
            $r = $size / 4;
            imagefilledellipse($im, $cx - $r, $cy - $r/2, $r * 2.2, $r * 2.2, $shapeCol);
            imagefilledellipse($im, $cx + $r, $cy - $r/2, $r * 2.2, $r * 2.2, $shapeCol);
            $points = [
                $cx - $r * 2, $cy - $r/2,
                $cx + $r * 2, $cy - $r/2,
                $cx, $cy + $size * 0.58
            ];
            imagefilledpolygon($im, $points, $shapeCol);
        } elseif ($type === 'birthday') {
            // Draw Giant Birthday Cake outline frame behind the QR
            // bottom tier
            imagefilledrectangle($im, $cx - 180, $cy + 30, $cx + 180, $cy + 150, $shapeCol);
            // middle tier
            imagefilledrectangle($im, $cx - 140, $cy - 60, $cx + 140, $cy + 30, $shapeCol);
            // top tier
            imagefilledrectangle($im, $cx - 90, $cy - 140, $cx + 90, $cy - 60, $shapeCol);
            // candles
            imagefilledrectangle($im, $cx - 50, $cy - 170, $cx - 40, $cy - 140, $shapeCol);
            imagefilledrectangle($im, $cx, $cy - 170, $cx + 10, $cy - 140, $shapeCol);
            imagefilledrectangle($im, $cx + 50, $cy - 170, $cx + 60, $cy - 140, $shapeCol);
            // flames
            $flameCol = imagecolorallocate($im, 245, 158, 11);
            imagefilledellipse($im, $cx - 45, $cy - 180, 12, 18, $flameCol);
            imagefilledellipse($im, $cx + 5, $cy - 180, 12, 18, $flameCol);
            imagefilledellipse($im, $cx + 55, $cy - 180, 12, 18, $flameCol);
        } else {
            // Graduation: Draw Giant Classy Graduation Cap frame
            // Rhombus top cap board
            $points = [
                $cx, $cy - 190,
                $cx + 180, $cy - 130,
                $cx, $cy - 70,
                $cx - 180, $cy - 130
            ];
            imagefilledpolygon($im, $points, $shapeCol);
            // Skull cap
            imagefilledrectangle($im, $cx - 90, $cy - 70, $cx + 90, $cy + 10, $shapeCol);
            imagefilledellipse($im, $cx, $cy + 10, 180, 45, $shapeCol);
            // tassel line
            imageline($im, $cx, $cy - 130, $cx - 190, $cy - 60, imagecolorallocate($im, 245, 158, 11));
            imagefilledellipse($im, $cx - 190, $cy - 60, 15, 20, imagecolorallocate($im, 245, 158, 11));
        }

        // Draw white border base for the QR Code inside the shape to maximize readability
        $qrBg = imagecolorallocate($im, 255, 255, 255);
        imagefilledrectangle($im, $cx - $qrSize/2 - 10, $cy - $qrSize/2 - 10, $cx + $qrSize/2 + 10, $cy + $qrSize/2 + 10, $qrBg);

        // Fetch custom-styled QuickChart QR Code
        $cardUrl = route('greeting-card.preview', $card->custom_url);
        $qrApiUrl = "https://quickchart.io/qr?text=" . urlencode($cardUrl) . "&size=" . $qrSize . "&dark=" . $themeColorHex . "&margin=1&centerImageUrl=" . urlencode($qrCenterIcon);
        
        try {
            $qrData = file_get_contents($qrApiUrl);
            if ($qrData) {
                $qrIm = imagecreatefromstring($qrData);
                if ($qrIm) {
                    imagecopyresampled($im, $qrIm, $cx - $qrSize/2, $cy - $qrSize/2, 0, 0, $qrSize, $qrSize, imagesx($qrIm), imagesy($qrIm));
                    imagedestroy($qrIm);
                }
            }
        } catch (\Exception $e) {
            // In case of any loading failure, fall back to draw a simple scannable box
            $boxCol = imagecolorallocate($im, 100, 100, 100);
            imagerectangle($im, $cx - $qrSize/2, $cy - $qrSize/2, $cx + $qrSize/2, $cy + $qrSize/2, $boxCol);
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
