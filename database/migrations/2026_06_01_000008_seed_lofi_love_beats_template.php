<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $template = [
            'name'             => 'Lofi Love Beats',
            'slug'             => 'lofilove',
            'type'             => json_encode(['anniversary', 'wedding', 'birthday', 'graduation']),
            'description'      => 'Kartu ucapan aesthetic bertema Lofi Café & Vinyl Player. Menghadirkan turntable vinyl interaktif, tonearm yang dapat digeser untuk memutar lagu, visualisasi rintik hujan pada kaca, neon ambient light yang berganti warna (Sunset, Midnight, Cozy), serta pesan dengan animasi mesin ketik (typewriter) yang sangat romantis.',
            'features'         => json_encode(['Interactive Vinyl', 'Ambient Lighting', 'Raindrop Effect', 'Typewriter Message']),
            'bg_gradient'      => 'from-[#1b1517] via-[#352528] to-[#1b1517]',
            'icon'             => '📻',
            'sort_order'       => 15,
            'is_active'        => true,
            'preview_template' => 'full-mockup',
            'preview_images'   => json_encode([]),
            'preview_bg_style' => 'dark',
            'created_at'       => now(),
            'updated_at'       => now(),
        ];

        DB::table('greeting_card_templates')->insert($template);
    }

    public function down(): void
    {
        DB::table('greeting_card_templates')->where('slug', 'lofilove')->delete();
    }
};
