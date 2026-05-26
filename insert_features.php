<?php
// Script to insert 4 new features: animasi, qr_code, jumlah_tamu, layar_sapa

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->boot();

use App\Models\Feature;

$newFeatures = [
    ['name' => 'Animasi',     'slug' => 'animasi',       'category' => 'display', 'description' => 'Akses ke pengaturan animasi dan transisi tema'],
    ['name' => 'QR Code',     'slug' => 'qr_code',       'category' => 'feature', 'description' => 'Fitur QR code untuk tamu undangan'],
    ['name' => 'Jumlah Tamu', 'slug' => 'jumlah_tamu',   'category' => 'feature', 'description' => 'Kontrol batas maksimum jumlah tamu undangan'],
    ['name' => 'Layar Sapa',  'slug' => 'layar_sapa',    'category' => 'display', 'description' => 'Layar sambutan sebelum masuk ke undangan'],
];

foreach ($newFeatures as $f) {
    $feature = Feature::firstOrCreate(['slug' => $f['slug']], $f);
    echo ($feature->wasRecentlyCreated ? '[CREATED]' : '[EXISTS]') . " → {$f['name']} ({$f['slug']})\n";
}

echo "\nAll done! Total features: " . Feature::count() . "\n";
