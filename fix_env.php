<?php
// Script to automatically correct spelling typo of siap.in -> siapp.in in .env

$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $content = file_get_contents($envPath);
    $modified = false;

    // Check and replace u.siap.in -> u.siapp.in
    if (str_contains($content, 'u.siap.in') && !str_contains($content, 'u.siapp.in')) {
        $content = str_replace('u.siap.in', 'u.siapp.in', $content);
        $modified = true;
    }
    
    // Check and replace siap.in -> siapp.in
    if (str_contains($content, 'siap.in') && !str_contains($content, 'siapp.in')) {
        $content = str_replace('siap.in', 'siapp.in', $content);
        $modified = true;
    }

    if ($modified) {
        file_put_contents($envPath, $content);
        echo "✅ [AUTO-FIX] Berhasil memperbaiki domain di .env (siap.in -> siapp.in)\n";
    } else {
        echo "ℹ️ [AUTO-FIX] Konfigurasi domain di .env sudah benar.\n";
    }
} else {
    echo "⚠️ [AUTO-FIX] File .env tidak ditemukan.\n";
}
