<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Seed 8 template kartu ucapan yang sudah ada
        $templates = [
            [
                'name'        => 'Still With You',
                'slug'        => 'stillwithyou',
                'type'        => json_encode(['anniversary', 'wedding']),
                'description' => 'Kartu ucapan interaktif bertema romantis dengan simulasi kembang api HSL, audio synthesizer, ucapan mengapung 3D, dan pendeteksi orientasi ponsel.',
                'features'    => json_encode(['HSL Fireworks', 'Browser Synth', 'Interactive', '3D Float']),
                'bg_gradient' => 'from-[#0d0915] via-[#1b102b] to-[#09090b]',
                'icon'        => '🎆',
                'sort_order'  => 1,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Love Code Storybook',
                'slug'        => 'giftforanita',
                'type'        => json_encode(['birthday', 'anniversary', 'wedding']),
                'description' => 'Kartu ucapan mewah dengan konsep 3D Memory Book yang dapat dibalik interaktif, Letter Matrix Rain, gelembung cinta, dan Typewriter romantis.',
                'features'    => json_encode(['3D Book Flip', 'Matrix Rain', 'Typewriter', 'Love Bubbles']),
                'bg_gradient' => 'from-[#1e050d] via-[#4c1125] to-[#07060a]',
                'icon'        => '🎁',
                'sort_order'  => 2,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Cosmic Drift',
                'slug'        => 'cosmicdrift',
                'type'        => json_encode(['birthday', 'graduation', 'anniversary']),
                'description' => 'Kartu ucapan premium bertema luar angkasa — nebula parallax, konstelasi bintang, pesan cinta mengambang, roket peluncuran, dan soundscape deep space.',
                'features'    => json_encode(['Nebula Parallax', 'Constellation', 'Rocket Launch', 'Space Audio']),
                'bg_gradient' => 'from-[#020817] via-[#0a1628] to-[#050b1a]',
                'icon'        => '🌌',
                'sort_order'  => 4,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ];

        DB::table('greeting_card_templates')->insert($templates);
    }

    public function down(): void
    {
        DB::table('greeting_card_templates')->truncate();
    }
};
