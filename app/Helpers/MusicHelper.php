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
     * @param array|null $metadata Reference to return parsed title/artist
     * @return string|null The local storage path or null if not a YouTube URL
     * @throws \Exception
     */
    public static function convertYoutubeToMp3($youtubeUrl, &$metadata = null)
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
            // Coba ambil metadata dari library atau invitation yang sudah ada
            $existing = \App\Models\MusicLibrary::where('url', '/storage/' . $storagePath)->first();
            if (!$existing) {
                $existing = \App\Models\Invitation::where('music_url', '/storage/' . $storagePath)
                    ->select('title')
                    ->first();
            }
            if ($existing) {
                $metadata = [
                    'title' => $existing->title ?? $existing->invitation_title ?? '',
                    'artist' => $existing->artist ?? ''
                ];
            }
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

                        // Extract filename and parse title / artist
                        if (isset($data['filename'])) {
                            $filename = $data['filename'];
                            // Strip extension
                            $filename = preg_replace('/\.[^.]+$/', '', $filename);

                            // Clean up channel name suffix or cover brackets from title/artist
                            $parts = explode(' - ', $filename);
                            if (count($parts) >= 2) {
                                $title = trim($parts[0]);
                                $artist = trim($parts[1]);

                                // Remove common parenthesis info from artist (e.g. cover details)
                                $artist = trim(preg_replace('/\s*\(.*?\)\s*/', '', $artist));
                                $artist = trim(preg_replace('/\s*\[.*?\]\s*/', '', $artist));

                                $metadata = [
                                    'title' => $title,
                                    'artist' => $artist
                                ];
                            } else {
                                $metadata = [
                                    'title' => trim($parts[0]),
                                    'artist' => ''
                                ];
                            }
                        }
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

    /**
     * Trim and compress (strip tags) an MP3 file.
     *
     * @param string $url
     * @param float $start
     * @param float $end
     * @return string New cropped URL
     * @throws \Exception
     */
    public static function cropAndCompressMp3($url, $start, $end)
    {
        $relativePath = str_replace('/storage/', '', $url);
        $fullPath = storage_path('app/public/' . $relativePath);

        if (!file_exists($fullPath)) {
            throw new \Exception("Berkas musik asli tidak ditemukan.");
        }

        if ($start < 0 || $end <= $start) {
            throw new \Exception("Waktu potong tidak valid.");
        }

        $duration = $end - $start;

        // Perform trimming and tag stripping using falahati/php-mp3
        $mpeg = \falahati\PHPMP3\MpegAudio::fromFile($fullPath);
        $mpeg->trim($start, $duration);
        $mpeg->stripTags();

        // Generate trimmed filename
        $pathInfo = pathinfo($fullPath);
        // Remove existing trimmed suffix if editing an already trimmed file
        $cleanName = preg_replace('/_trimmed_[0-9]+_[0-9]+$/', '', $pathInfo['filename']);
        $newFilename = $cleanName . '_trimmed_' . intval($start) . '_' . intval($end) . '.' . $pathInfo['extension'];
        $newLocalPath = $pathInfo['dirname'] . '/' . $newFilename;

        $mpeg->saveFile($newLocalPath);

        $newRelativePath = str_replace(storage_path('app/public/'), '', $newLocalPath);
        return '/storage/' . str_replace('\\', '/', $newRelativePath);
    }

    /**
     * Compress MP3 by stripping tags using raw binary slicing (extremely fast).
     *
     * @param string $url
     * @param array $stats Output statistics
     * @return string Same URL
     * @throws \Exception
     */
    public static function compressMp3($url, &$stats = null)
    {
        $relativePath = str_replace('/storage/', '', $url);
        $fullPath = storage_path('app/public/' . $relativePath);

        if (!file_exists($fullPath)) {
            throw new \Exception("Berkas musik tidak ditemukan.");
        }

        $sizeBefore = filesize($fullPath);

        // Run raw metadata/ID3 tag stripping
        self::stripId3TagsRaw($fullPath);

        clearstatcache();
        $sizeAfter = filesize($fullPath);

        $stats = [
            'before' => $sizeBefore,
            'after' => $sizeAfter,
            'savings_pct' => $sizeBefore > 0 ? round((($sizeBefore - $sizeAfter) / $sizeBefore) * 100, 1) : 0
        ];

        return $url;
    }

    /**
     * Strip ID3 tags from an MP3 file using raw binary slicing.
     * Takes milliseconds and is 1000x faster than full frame parsing.
     *
     * @param string $filePath
     * @return bool
     */
    private static function stripId3TagsRaw($filePath)
    {
        if (!file_exists($filePath) || filesize($filePath) < 128) {
            return false;
        }

        $handle = fopen($filePath, 'rb');
        if (!$handle) {
            return false;
        }

        // Read first 10 bytes (ID3v2 header)
        $header = fread($handle, 10);
        $startOffset = 0;

        if (strlen($header) === 10 && substr($header, 0, 3) === 'ID3') {
            $flags = ord($header[5]);
            $byte6 = ord($header[6]);
            $byte7 = ord($header[7]);
            $byte8 = ord($header[8]);
            $byte9 = ord($header[9]);

            // Decode synchsafe integer tag size (4 bytes, 7 bits per byte)
            $tagSize = (($byte6 & 0x7F) << 21) |
                       (($byte7 & 0x7F) << 14) |
                       (($byte8 & 0x7F) << 7)  |
                       ($byte9 & 0x7F);

            // Total tag size including the 10-byte header itself
            $startOffset = 10 + $tagSize;
        }

        // Check for ID3v1 tag at the end of the file (last 128 bytes)
        $fileSize = filesize($filePath);
        $endOffset = $fileSize;

        fseek($handle, -128, SEEK_END);
        $footer = fread($handle, 3);
        if ($footer === 'TAG') {
            $endOffset = $fileSize - 128;
        }

        fclose($handle);

        // If no ID3 tags exist at start or end, return true immediately (already clean)
        if ($startOffset === 0 && $endOffset === $fileSize) {
            return true;
        }

        // Calculate size of audio data chunk
        $length = $endOffset - $startOffset;
        if ($length <= 0) {
            return false;
        }

        // Stream raw audio frames to temp file
        $sourceHandle = fopen($filePath, 'rb');
        fseek($sourceHandle, $startOffset);

        $tempPath = $filePath . '.tmp';
        $destHandle = fopen($tempPath, 'wb');
        
        if (!$destHandle) {
            fclose($sourceHandle);
            return false;
        }

        $bytesRemaining = $length;
        while ($bytesRemaining > 0 && !feof($sourceHandle)) {
            $chunkSize = min(65536, $bytesRemaining);
            $buffer = fread($sourceHandle, $chunkSize);
            fwrite($destHandle, $buffer);
            $bytesRemaining -= strlen($buffer);
        }

        fclose($sourceHandle);
        fclose($destHandle);

        // Overwrite original file
        @unlink($filePath);
        @rename($tempPath, $filePath);

        return true;
    }
}
