<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ScreenshotService
{
    /**
     * Capture a screenshot of a given URL and save it to public storage.
     *
     * @param string $url The target URL to capture
     * @param string $filename The output filename (e.g. 'ai_promo/netflix.jpg')
     * @param array $options Custom parameters (width, height, delay)
     * @return string|null The relative path in public storage if successful, or null on failure
     */
    public static function capture(string $url, string $filename, array $options = []): ?string
    {
        $width = $options['width'] ?? 375;
        $height = $options['height'] ?? 812;
        $delay = $options['delay'] ?? 4000; // Let animations finish

        // Ensure target directory exists in public disk
        $directory = dirname($filename);
        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }

        try {
            // Check if we should use local Puppeteer (if installed and configured)
            if (config('services.screenshot.driver') === 'puppeteer') {
                return self::captureWithPuppeteer($url, $filename, $width, $height, $delay);
            }

            // Default: Use Microlink free API (zero-install, works out of the box)
            $apiUrl = "https://api.microlink.io/?" . http_build_query([
                'url' => $url,
                'screenshot' => 'true',
                'embed' => 'screenshot.url',
                'viewport.width' => $width,
                'viewport.height' => $height,
                'viewport.isMobile' => 'true',
                'viewport.hasTouch' => 'true',
                'waitFor' => $delay,
            ]);

            Log::info("AI Promo: Capturing screenshot via Microlink for $url");
            
            $response = Http::timeout(45)->get($apiUrl);

            if ($response->successful() && strlen($response->body()) > 1000) {
                Storage::disk('public')->put($filename, $response->body());
                Log::info("AI Promo: Screenshot saved to storage/$filename");
                return $filename;
            }

            Log::error("AI Promo: Microlink API returned unsuccessful status or empty body: " . $response->status());
        } catch (\Exception $e) {
            Log::error("AI Promo: Failed to capture screenshot: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Fallback capture using local Puppeteer via Node.js script.
     */
    private static function captureWithPuppeteer(string $url, string $filename, int $width, int $height, int $delay): ?string
    {
        $outputPath = storage_path('app/public/' . $filename);
        $scriptPath = base_path('resources/js/screenshot_worker.cjs');

        if (!file_exists($scriptPath)) {
            Log::error("AI Promo: Puppeteer script not found at $scriptPath");
            return null;
        }

        // Run local Node script
        $escapedUrl = escapeshellarg($url);
        $escapedOutput = escapeshellarg($outputPath);
        $command = "node $scriptPath $escapedUrl $escapedOutput $width $height $delay 2>&1";

        Log::info("AI Promo: Running local Puppeteer: $command");
        exec($command, $output, $returnVar);

        if ($returnVar === 0 && file_exists($outputPath)) {
            return $filename;
        }

        Log::error("AI Promo: Puppeteer script failed with code $returnVar. Output: " . implode("\n", $output));
        return null;
    }
}
