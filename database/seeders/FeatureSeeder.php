<?php

namespace Database\Seeders;

use App\Models\Feature;
use Illuminate\Database\Seeder;

class FeatureSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            ['name' => 'Animasi',     'slug' => 'animasi',       'category' => 'settings', 'description' => 'Akses ke pengaturan animasi dan transisi tema'],
            ['name' => 'QR Code',     'slug' => 'qr_code',       'category' => 'other',    'description' => 'Fitur QR code untuk tamu undangan'],
            ['name' => 'Layar Sapa',  'slug' => 'layar_sapa',    'category' => 'settings', 'description' => 'Layar sambutan sebelum masuk ke undangan'],
        ];

        foreach ($features as $f) {
            Feature::firstOrCreate(['slug' => $f['slug']], $f);
        }

        $this->command->info('4 new features inserted successfully.');
    }
}
