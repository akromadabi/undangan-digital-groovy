<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class MusicHelper
{
    /**
     * Convert a YouTube URL to an MP3 file, download it, and store it locally.
     *
     * @param string $youtubeUrl
     * @return string|null The local storage path or null if not a YouTube URL
     * @throws \Exception
     */
    public static function convertYoutubeToMp3($youtubeUrl)
    {
        if (empty($youtubeUrl)) {
            return null;
        }

        // Extract video ID to verify it's a valid youtube URL
        $regExp = '/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/';
        if (!preg_match($regExp, $youtubeUrl, $matches)) {
            return null;
        }
        
        $videoId = $matches[2];
        if (strlen($videoId) !== 11) {
            return null;
        }
        
        // 🌟 SOLUSI OPTIMASI PENYIMPANAN (DEDUPLIKASI OTOMATIS):
        // Cek jika lagu YouTube ini sudah pernah dikonversi sebelumnya oleh siapa pun di platform.
        // Jika sudah ada, langsung gunakan file tersebut demi menghemat 100% penyimpanan & kuota server!
        $fileName = 'youtube_' . $videoId . '.mp3';
        $storagePath = 'music/' . $fileName;
        
        if (Storage::disk('public')->exists($storagePath)) {
            return '/storage/' . $storagePath;
        }
        
        // List of Cobalt API endpoints for robustness (Cobalt v10 Community Instances)
        $instances = [
            'https://apicobalt.mgytr.top/',
            'https://dog.kittycat.boo/',
            'https://fox.kittycat.boo/',
            'https://cobaltapi.kittycat.boo/',
            'https://cobaltapi.squair.xyz/',
        ];

        $audioUrl = null;
        $errorMessage = "Gagal mengekstrak audio dari YouTube. Pastikan link video valid, tidak privat, dan coba lagi.";

        foreach ($instances as $instance) {
            try {
                // Cobalt v10 Payload
                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])->timeout(15)->post($instance, [
                    'url' => $youtubeUrl,
                    'downloadMode' => 'audio',
                    'audioFormat' => 'mp3',
                    'filenameStyle' => 'basic'
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['url'])) {
                        $audioUrl = $data['url'];
                        break;
                    } elseif (isset($data['error']['code'])) {
                        $errorMessage = "Cobalt Error: " . $data['error']['code'];
                    } elseif (isset($data['text'])) {
                        $errorMessage = $data['text'];
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Cobalt instance {$instance} failed: " . $e->getMessage());
            }
        }

        if (!$audioUrl) {
            throw new \Exception($errorMessage);
        }

        // Fetch the file from the audio URL using Http or file_get_contents
        $fileContents = null;
        try {
            $fileResponse = Http::timeout(60)->get($audioUrl);
            if ($fileResponse->successful()) {
                $fileContents = $fileResponse->body();
            }
        } catch (\Exception $e) {
            Log::warning("Http get failed for audio download, trying file_get_contents: " . $e->getMessage());
        }

        if (!$fileContents) {
            try {
                $fileContents = file_get_contents($audioUrl);
            } catch (\Exception $e) {
                Log::error("file_get_contents failed for audio download: " . $e->getMessage());
            }
        }

        if (!$fileContents) {
            throw new \Exception("Gagal mengunduh berkas audio dari server konverter.");
        }

        // Save to public storage
        Storage::disk('public')->put($storagePath, $fileContents);

        return '/storage/' . $storagePath;
    }
}
