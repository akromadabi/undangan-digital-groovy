<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class ImageCompressor
{
    /**
     * Compress an image in-place (overwriting the original temporary or stored file).
     *
     * @param string|UploadedFile $file The file path or UploadedFile object.
     * @return bool True if compression was attempted and succeeded, false otherwise.
     */
    public static function compress($file, $maxDim = 1600)
    {
        $filePath = $file instanceof UploadedFile ? $file->getRealPath() : $file;

        if (!$filePath || !file_exists($filePath)) {
            return false;
        }

        // Fail-safe: if GD extension is not loaded or functions do not exist, bypass compression
        if (!extension_loaded('gd') || !function_exists('imagecreatefromstring')) {
            Log::warning('GD extension is not loaded or imagecreatefromstring function is missing. Bypassing image compression.');
            return false;
        }

        // Get image info
        $imageInfo = @getimagesize($filePath);
        if (!$imageInfo) {
            return false; // Not an image or not readable by GD
        }

        $mime = $imageInfo['mime'];
        $width = $imageInfo[0];
        $height = $imageInfo[1];

        // Allowed image MIME types for compression
        $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($mime, $allowedMimes)) {
            return false;
        }

        // 1. Read image from file
        try {
            $imageContent = file_get_contents($filePath);
            $image = @imagecreatefromstring($imageContent);
            if (!$image) {
                return false;
            }
        } catch (\Exception $e) {
            Log::error('ImageCompressor failed to load image: ' . $e->getMessage());
            return false;
        }

        // 2. Resize image if dimensions are too large (optimal high resolution limit)
        if ($width > $maxDim || $height > $maxDim) {
            $ratio = $width / $height;
            if ($ratio > 1) {
                $newWidth = $maxDim;
                $newHeight = round($maxDim / $ratio);
            } else {
                $newHeight = $maxDim;
                $newWidth = round($maxDim * $ratio);
            }

            $resizedImage = imagecreatetruecolor($newWidth, $newHeight);

            // Handle transparency for PNG, WebP, and GIF
            if ($mime === 'image/png' || $mime === 'image/webp' || $mime === 'image/gif') {
                imagealphablending($resizedImage, false);
                imagesavealpha($resizedImage, true);
                $transparentColor = imagecolorallocatealpha($resizedImage, 0, 0, 0, 127);
                imagefill($resizedImage, 0, 0, $transparentColor);
            }

            imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resizedImage;
        }

        // 3. Save compressed image in-place (overwriting the original path)
        try {
            switch ($mime) {
                case 'image/jpeg':
                case 'image/jpg':
                    imagejpeg($image, $filePath, 75); // 75% quality is excellent for balancing size and quality
                    break;
                case 'image/png':
                    // If the PNG has no transparency, convert it to JPEG to save ~95% of space!
                    if (!self::hasTransparency($image)) {
                        imagejpeg($image, $filePath, 75);
                    } else {
                        // If it has transparency, save it as WebP at 75% quality
                        // WebP has extremely compact compression for alpha-channels
                        if (function_exists('imagewebp')) {
                            imagewebp($image, $filePath, 75);
                        } else {
                            // Fallback to truecolor-to-palette to reduce zlib block sizes
                            if (imageistruecolor($image)) {
                                imagetruecolortopalette($image, false, 256);
                            }
                            imagepng($image, $filePath, 9);
                        }
                    }
                    break;
                case 'image/webp':
                    imagewebp($image, $filePath, 75); // 75% quality for WebP
                    break;
                case 'image/gif':
                    imagegif($image, $filePath);
                    break;
            }
            imagedestroy($image);
            return true;
        } catch (\Exception $e) {
            Log::error('ImageCompressor failed to save image: ' . $e->getMessage());
            if (isset($image) && is_resource($image)) {
                imagedestroy($image);
            }
            return false;
        }
    }

    /**
     * Fast check if a truecolor GD image has any transparent/semi-transparent pixels.
     * Samples every 4th pixel for speed.
     *
     * @param resource $image GD image resource.
     * @return bool True if there are transparent/semi-transparent pixels, false otherwise.
     */
    private static function hasTransparency($image)
    {
        if (!imageistruecolor($image)) {
            return imagecolortransparent($image) >= 0;
        }

        $width = imagesx($image);
        $height = imagesy($image);

        for ($y = 0; $y < $height; $y += 4) {
            for ($x = 0; $x < $width; $x += 4) {
                $rgba = imagecolorat($image, $x, $y);
                $alpha = ($rgba >> 24) & 0x7F;
                if ($alpha > 0) {
                    return true; // Found transparent pixel
                }
            }
        }

        return false;
    }
}
