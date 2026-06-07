<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AiPromoQueue;
use App\Models\Theme;
use App\Models\Feature;
use App\Services\GeminiService;
use App\Services\ScreenshotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class SuperAdminAiPromoController extends Controller
{
    /**
     * Display the AI Promo queue dashboard page.
     */
    public function index()
    {
        $queues = AiPromoQueue::orderBy('scheduled_at', 'desc')->paginate(15);
        
        $themes = Theme::active()->get(['id', 'name', 'slug', 'thumbnail']);
        $features = Feature::all(['id', 'name', 'slug']);

        return Inertia::render('SuperAdmin/AiPromo', [
            'queues' => $queues,
            'themes' => $themes,
            'features' => $features,
            'apiToken' => env('AI_PROMO_SECRET_TOKEN', 'ai_promo_secret_token_123456'),
        ]);
    }

    /**
     * Generate new scheduled posts using AI.
     */
    public function generate(Request $request)
    {
        $request->validate([
            'count' => 'required|integer|min:1|max:14',
            'platforms' => 'required|array|min:1',
            'start_date' => 'nullable|date',
        ]);

        // Prevent timeout during loop containing API calls
        set_time_limit(240);

        $count = $request->count;
        $platforms = $request->platforms;
        
        // Find the last scheduled date to continue scheduling sequentially
        $lastScheduled = AiPromoQueue::orderBy('scheduled_at', 'desc')->first();
        $startDate = $request->start_date 
            ? Carbon::parse($request->start_date) 
            : ($lastScheduled ? Carbon::parse($lastScheduled->scheduled_at)->addDay() : Carbon::tomorrow());
            
        // Set time of posting to 09:00 AM by default
        $startDate->setTime(9, 0, 0);

        $themes = Theme::active()->get();
        $features = Feature::all();

        $generatedCount = 0;

        for ($i = 0; $i < $count; $i++) {
            $scheduledDate = $startDate->copy()->addDays($i);

            // Determine promotional category
            // 60% chance: Template (Theme)
            // 30% chance: Feature
            // 10% chance: Reseller Program
            $rand = rand(1, 100);
            
            $type = 'general';
            $key = 'general';
            $title = 'TrueLove Invitation';
            $demoUrl = url('/');

            if ($rand <= 60 && $themes->isNotEmpty()) {
                $theme = $themes->random();
                $type = 'template';
                $key = $theme->slug;
                $title = $theme->name;
                $demoUrl = route('demo.theme', ['slug' => $theme->slug]);
            } elseif ($rand <= 90 && $features->isNotEmpty()) {
                $feature = $features->random();
                $type = 'feature';
                $key = $feature->slug;
                $title = $feature->name;
                // Features are presented on the home landing page
                $demoUrl = url('/');
            } else {
                $type = 'reseller';
                $key = 'reseller';
                $title = 'Reseller Program';
                $demoUrl = url('/reseller');
            }

            // Create prompt for AI
            $prompt = $this->craftPrompt($type, $key, $title);
            
            // Get fallback copywriting in case AI key is missing or fails
            $fallbackCopy = GeminiService::getFallbackFor($type, $key, $title);

            // Generate copywriting
            $caption = GeminiService::generate($prompt, $fallbackCopy);

            // Prepare screenshot path
            $imageFilename = 'ai_promo/' . $key . '_' . time() . '_' . $i . '.jpg';
            
            // Capture screenshot
            Log::info("AI Promo: Capturing screenshot for topic: $key, URL: $demoUrl");
            $imagePath = ScreenshotService::capture($demoUrl, $imageFilename, [
                'delay' => 4500 // Let animations play out
            ]);

            // Save to database
            AiPromoQueue::create([
                'type' => $type,
                'reference_key' => $key,
                'caption' => $caption,
                'image_path' => $imagePath,
                'scheduled_at' => $scheduledDate,
                'status' => 'pending',
                'platforms' => $platforms,
            ]);

            $generatedCount++;
        }

        return redirect()->back()->with('success', "Berhasil membuat $generatedCount postingan promosi AI baru di antrean!");
    }

    /**
     * Update an existing queue item.
     */
    public function update(Request $request, AiPromoQueue $queue)
    {
        $request->validate([
            'caption' => 'required|string',
            'scheduled_at' => 'required|date',
            'platforms' => 'required|array',
            'status' => 'required|string|in:pending,posting,posted,failed',
        ]);

        $queue->update([
            'caption' => $request->caption,
            'scheduled_at' => Carbon::parse($request->scheduled_at),
            'platforms' => $request->platforms,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Postingan promosi berhasil diperbarui!');
    }

    /**
     * Delete an item from the queue.
     */
    public function destroy(AiPromoQueue $queue)
    {
        // Delete image file from storage
        if ($queue->image_path && Storage::disk('public')->exists($queue->image_path)) {
            Storage::disk('public')->delete($queue->image_path);
        }

        $queue->delete();

        return redirect()->back()->with('success', 'Postingan promosi berhasil dihapus dari antrean!');
    }

    /**
     * API: Fetch the next scheduled post (used by n8n).
     */
    public function apiGetNext(Request $request)
    {
        $this->authorizeApi($request);

        // Find next pending post scheduled for now or in the past
        $post = AiPromoQueue::where('status', 'pending')
            ->where('scheduled_at', '<=', Carbon::now())
            ->orderBy('scheduled_at', 'asc')
            ->first();

        if (!$post) {
            return response()->json([
                'status' => 'idle',
                'message' => 'No pending posts scheduled for execution at this time.'
            ]);
        }

        // Mark as posting to avoid double trigger
        $post->update(['status' => 'posting']);

        $demoUrl = $post->type === 'template' 
            ? route('demo.theme', ['slug' => $post->reference_key]) 
            : ($post->type === 'reseller' ? url('/reseller') : url('/'));

        return response()->json([
            'status' => 'success',
            'post' => [
                'id' => $post->id,
                'type' => $post->type,
                'reference_key' => $post->reference_key,
                'caption' => $post->caption,
                'platforms' => $post->platforms,
                'image_url' => $post->image_path ? asset('storage/' . $post->image_path) : null,
                'demo_url' => $demoUrl,
                'scheduled_at' => $post->scheduled_at->toDateTimeString(),
            ]
        ]);
    }

    /**
     * API: Mark post as successfully published.
     */
    public function apiMarkSuccess(Request $request, $id)
    {
        $this->authorizeApi($request);

        $post = AiPromoQueue::findOrFail($id);
        
        $post->update([
            'status' => 'posted',
            'posted_at' => Carbon::now(),
            'post_links' => $request->input('post_links', []),
            'error_message' => null
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Post status updated to posted.'
        ]);
    }

    /**
     * API: Mark post as failed to publish.
     */
    public function apiMarkFailed(Request $request, $id)
    {
        $this->authorizeApi($request);

        $post = AiPromoQueue::findOrFail($id);
        
        $post->update([
            'status' => 'failed',
            'error_message' => $request->input('error', 'Unknown social media API error.')
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Post status updated to failed.'
        ]);
    }

    /**
     * Secure API endpoint with simple token auth.
     */
    private function authorizeApi(Request $request)
    {
        $token = $request->header('X-Promo-Token') ?? $request->query('token');
        $expectedToken = env('AI_PROMO_SECRET_TOKEN', 'ai_promo_secret_token_123456');

        if (empty($token) || $token !== $expectedToken) {
            abort(401, 'Unauthorized: Invalid or missing API token.');
        }
    }

    /**
     * Craft copywriting instruction prompt for Gemini.
     */
    private function craftPrompt(string $type, string $key, string $title): string
    {
        $basePrompt = "Tulis caption promosi media sosial yang seru, kreatif, interaktif, dan persuasif untuk website platform pembuatan undangan digital bernama 'TrueLove Invitation'. Gunakan bahasa Indonesia kasual yang kekinian (bahasa gaul anak muda/Gen Z/Millennial), tambahkan emoji yang relevan, buat hook yang sangat menarik di baris pertama, dan sertakan tagar (hashtags) populer.\n\n";

        if ($type === 'template') {
            $basePrompt .= "TOPIK: Promosi Desain Tema Undangan Baru bernama '$title' ($key).\n";
            $basePrompt .= "DETAIL TEMA:\n";
            if ($key === 'netflix') {
                $basePrompt .= "- Desainnya dibuat 100% mirip antarmuka beranda streaming film Netflix.\n- Cerita perjalanan cinta pasangan dikemas unik sebagai daftar 'Episodes'.\n- Ada musik autoplay dengan equalizer dinamis.\n- Sangat viral dan disukai pasangan berjiwa kreatif/muda.\n";
            } elseif ($key === 'spotify') {
                $basePrompt .= "- Meniru pemutar musik Spotify web player asli secara interaktif.\n- Kisah cinta mempelai dikemas sebagai trek lagu dalam playlist.\n- Dilengkapi fitur lirik lagu yang sinkron dengan lagu yang berputar.\n";
            } elseif ($key === 'shopee') {
                $basePrompt .= "- Desain unik layaknya halaman checkout belanja online Shopee.\n- Kolom info RSVP dibungkus sebagai 'simulasi chat admin seller' yang lucu.\n- Sangat kreatif dan memancing gelak tawa tamu.\n";
            } elseif ($key === 'tiktok') {
                $basePrompt .= "- Desain menyerupai pemutar video vertikal TikTok.\n- Mengutamakan background video prewedding.\n- Kolom doa ucapan tamu tampil sebagai komentar live di layar.\n";
            } elseif ($key === 'chatgpt') {
                $basePrompt .= "- Desain antarmuka chat cerdas robot AI ChatGPT.\n- Tamu bisa melihat bot mengetik otomatis untuk menjawab tanggal, tempat, dan peta Maps.\n- Sangat futuristik dan berteknologi tinggi.\n";
            } else {
                $basePrompt .= "- Tema premium dengan desain responsif, musik latar belakang otomatis, galeri prewedding, dan rincian kado rekening digital.\n";
            }
            $basePrompt .= "\nINSTRUKSI KHUSUS:\n";
            $basePrompt .= "- Wajib sertakan placeholder string '{demo_url}' di dalam caption sebagai lokasi penempatan link demo undangan.\n";
        } elseif ($type === 'feature') {
            $basePrompt .= "TOPIK: Promosi Fitur Unggulan bernama '$title' ($key) yang ada di platform kami.\n";
            $basePrompt .= "DETAIL FITUR:\n";
            if ($key === 'countdown') {
                $basePrompt .= "- Fitur Evergreen Countdown Timer (Hitung Mundur Promo).\n- Waktu reset otomatis per user sehingga memicu psikologi kelangkaan (FOMO) agar pembeli segera order sebelum promo habis.\n";
            } elseif ($key === 'qr') {
                $basePrompt .= "- Fitur QR Code Presensi / Scan Check-in Tamu.\n- Tamu cukup scan kode QR di undangan di lokasi acara untuk konfirmasi kehadiran secara instan dan aman.\n";
            } elseif ($key === 'editor') {
                $basePrompt .= "- Smart Editor UI & Live Simulator Auto-Scroll.\n- Admin/reseller cukup klik baris menu di kiri, layar preview HP di kanan langsung bergeser otomatis dan memancarkan outline jingga pada area fokus.\n";
            } else {
                $basePrompt .= "- Fitur canggih kami yang mempermudah calon pengantin membuat undangan digital premium sendiri dalam 5 menit.\n";
            }
            $basePrompt .= "\nINSTRUKSI KHUSUS:\n";
            $basePrompt .= "- Wajib sertakan placeholder string '{site_url}' di dalam caption sebagai lokasi penempatan link utama website.\n";
        } else {
            $basePrompt .= "TOPIK: Peluang Usaha sampingan menjadi Reseller Undangan Digital.\n";
            $basePrompt .= "DETAIL PROMO:\n";
            $basePrompt .= "- Modal kecil, untung hingga 100% langsung masuk ke rekening reseller sendiri.\n- Dapat Dashboard Landing Page Reseller yang bisa dikustomisasi warna dan fiturnya secara visual.\n- Disediakan katalog tema premium lengkap (termasuk tema viral Netflix/Spotify).\n";
            $basePrompt .= "\nINSTRUKSI KHUSUS:\n";
            $basePrompt .= "- Wajib sertakan placeholder string '{site_url}' di dalam caption sebagai lokasi penempatan link pendaftaran reseller.\n";
        }

        $basePrompt .= "\nPENTING: Jangan tambahkan kata pengantar seperti 'Berikut adalah caption...', langsung tulis caption promosi dari baris pertama. Batasi panjang teks maksimal 200-300 kata saja.";

        return $basePrompt;
    }
}
