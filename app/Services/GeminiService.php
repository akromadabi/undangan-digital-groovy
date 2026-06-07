<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    /**
     * Generate copywriting using Gemini API.
     *
     * @param string $prompt Prompt instruction for the AI
     * @param string|null $fallback Default text if API call fails or is unconfigured
     * @return string
     */
    public static function generate(string $prompt, ?string $fallback = null): string
    {
        $apiKey = config('services.gemini.key');

        if (empty($apiKey)) {
            Log::warning("AI Promo: Gemini API Key not configured. Using fallback text.");
            return $fallback ?? self::getDefaultFallback();
        }

        try {
            Log::info("AI Promo: Requesting copywriting from Gemini API...");
            
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

            $response = Http::timeout(30)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 800,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

                if (!empty($text)) {
                    // Clean up markdown markers if Gemini wraps the response in quotes or code blocks
                    $text = trim($text);
                    $text = preg_replace('/^["\']|["\']$/', '', $text); // Remove surrounding quotes
                    return $text;
                }
            }

            Log::error("AI Promo: Gemini API returned unsuccessful status: " . $response->status() . " or invalid structure: " . $response->body());
        } catch (\Exception $e) {
            Log::error("AI Promo: Failed to connect to Gemini API: " . $e->getMessage());
        }

        return $fallback ?? self::getDefaultFallback();
    }

    /**
     * Create fallback copy for specific theme types or features in case of API failure.
     */
    public static function getFallbackFor(string $type, string $key, string $name): string
    {
        if ($type === 'template') {
            switch ($key) {
                case 'netflix':
                    return "🔥 Pengen undangan nikah anti-mainstream? Cobain Tema Netflix Premium! 🎬🍿\n\nDesainnya 100% mirip beranda streaming favoritmu! Kisah cinta kalian bisa ditulis jadi deretan Episode seru lho. Lengkap dengan lagu autoplay dan navigasi modern.\n\nBikin undangan unikmu sekarang di TrueLove Invitation! ✨\n👉 Link: {demo_url}\n\n#undanganonline #undangannetflix #undanganpernikahan #undanganviral #undanganunik";
                case 'spotify':
                    return "🎵 Cinta kalian adalah playlist terindah! Bikin undangan nikah dengan Tema Spotify Web Player 🎧🎶\n\nUndangan digital unik dengan layout Spotify asli. Lagu favorit kalian diputar otomatis lengkap dengan lirik lagu yang sinkron! Tamu undangan pasti langsung terkesan.\n\nYuk, bagikan playlist bahagiamu di TrueLove Invitation!\n👉 Link: {demo_url}\n\n#undanganspotify #undanganpernikahandigital #undanganmusik #undanganunik #weddinginvitation";
                case 'shopee':
                    return "🧡 Ada paket cinta yang siap dikirim! Undang temanmu pakai Tema Shopee Checkout 🛒📦\n\nDesain kreatif dengan tema belanja online oranye yang viral. Ada chat admin simulasi pernikahan dan status pengiriman cinta yang romantis.\n\nDaftar dan buat undangan unikmu sekarang di TrueLove Invitation!\n👉 Link: {demo_url}\n\n#undanganshopee #undanganonline #undanganlucu #undanganunik #pernikahanviral";
                case 'tiktok':
                    return "📱 Swipe ke atas untuk melihat momen bahagia kami! Undangan Digital Tema TikTok Player 🎥✨\n\nLayout video scroll vertikal layaknya feed TikTok. Doa restu dari teman-teman langsung tampil sebagai komentar live di layar!\n\nBuat undangan TikTok-mu sekarang!\n👉 Link: {demo_url}\n\n#undangantiktok #undanganonline #undanganvideo #weddingtiktok #undanganunik";
                case 'chatgpt':
                    return "🤖 Tanya Bot ChatGPT tentang pernikahan kami? Unik banget! Cobain Tema ChatGPT AI Chat 💬🧠\n\nUndangan bertema AI chat interaktif. Tamu undangan bisa melihat bot mengetik otomatis dan menjawab detail info tanggal & lokasi nikah.\n\nYuk buat undangan futuristikmu!\n👉 Link: {demo_url}\n\n#undanganchatgpt #undangandigital #undanganai #undanganunik #teknologipernikahan";
                default:
                    return "💖 Cari undangan pernikahan digital yang estetik dan kekinian? Kenalkan tema baru kami: $name! ✨\n\nDesain responsive, musik autoplay, galeri foto premium, dan RSVP terintegrasi. Bikin pernikahanmu lebih berkesan bersama TrueLove Invitation.\n\nBuat undangan pertamamu gratis!\n👉 Link: {demo_url}\n\n#undanganpernikahan #undanganonline #weddinginvitation #undanganpremium";
            }
        }

        if ($type === 'feature') {
            switch ($key) {
                case 'countdown':
                    return "⏳ Mau konversi penjualan website undanganmu melesat? Gunakan fitur Evergreen Countdown Timer! 📈🔥\n\nFitur psikologis kelangkaan (urgency) yang otomatis reset per pengunjung browser. Sangat cocok bagi reseller untuk memicu promo pendaftaran cepat!\n\nAktifkan di Landing Page reseller Anda sekarang.\n👉 Link: {site_url}\n\n#fiturundangan #resellerundangan #bisnisundangan #countdownpromo";
                case 'qr':
                    return "🎫 Katakan selamat tinggal pada antrean tamu yang panjang! Gunakan Fitur Check-in Tamu dengan QR Code! 📲✨\n\nTamu cukup menunjukkan kode QR di undangan digital mereka, penerima tamu tinggal scan, dan status kehadiran langsung tercatat di database secara real-time!\n\nLebih praktis, modern, dan aman.\n👉 Link: {site_url}\n\n#undanganqrcode #checkintamu #weddingqrcode #undanganpernikahan #teknologipernikahan";
                case 'editor':
                    return "🎨 Edit undangan digital semudah sekali klik dengan Smart Editor UI & Live Simulator! 💻📱\n\nCukup klik bagian struktur halaman di sebelah kiri, layar simulator HP di kanan akan otomatis bergulir (auto-scroll) dan berkedip jingga menunjukkan fokus area. Mengedit jadi super cepat tanpa bingung!\n\nCoba gratis sekarang!\n👉 Link: {site_url}\n\n#editorundangan #desainundangan #undanganonline #resellerundangan";
                default:
                    return "🚀 Nikmati kemudahan membuat undangan digital premium dengan fitur-fitur canggih kami: $name! 🌟\n\nRSVP terintegrasi, dresscode warna visual, navigasi swipe vertikal/horizontal, dan kontrol lagu equalizer dinamis.\n\nBergabung sekarang bersama TrueLove Invitation!\n👉 Link: {site_url}\n\n#undangandigital #fiturundangan #undanganonline #weddingplatform";
            }
        }

        return self::getDefaultFallback();
    }

    /**
     * General fallback copy if everything else is missing.
     */
    private static function getDefaultFallback(): string
    {
        return "✨ Buat momen pernikahanmu menjadi lebih berkesan dengan undangan digital premium! 💌💖\n\nTrueLove Invitation menyediakan puluhan pilihan tema unik (mulai dari klasik elegant hingga tema viral sosial media seperti Netflix/Spotify), musik autoplay, navigasi swipe mulus, dan peta Google Maps terintegrasi.\n\nBikin undangan nikahmu sekarang, cepat, mudah, dan hemat!\n👉 Link: {site_url}\n\n#undanganpernikahan #undanganonline #weddinginvitation #undanganelegan #undanganpernikahandigital";
    }
}
