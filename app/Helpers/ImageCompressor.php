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
    public static function compress($file)
    {
        $filePath = $file instanceof UploadedFile ? $file->getRealPath() : $file;

        if (!$filePath || !file_exists($filePath)) {
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

        // 2. Resize image if dimensions are too large (max 1200px)
        $maxDim = 1200;
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
                    imagepng($image, $filePath, 9); // Compression level 9 (max compression, lossless)
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
}
