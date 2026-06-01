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
                'name'        => 'Ocean Breeze',
                'slug'        => 'oceanbreeze',
                'type'        => json_encode(['birthday', 'graduation', 'anniversary']),
                'description' => 'Kartu ucapan bertema laut dengan efek gelombang, partikel pasir, dan suasana pantai yang menenangkan.',
                'features'    => json_encode(['Wave Effect', 'Ocean Particles', 'Ambient Audio']),
                'bg_gradient' => 'from-[#0a2a4a] via-[#0e4d6d] to-[#051b2c]',
                'icon'        => '🌊',
                'sort_order'  => 3,
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
            [
                'name'        => 'Retro Arcade',
                'slug'        => 'retroarcade',
                'type'        => json_encode(['birthday', 'graduation']),
                'description' => 'Kartu ucapan retro bertema arcade 8-bit dengan efek pixel art, chiptune music, dan animasi game klasik.',
                'features'    => json_encode(['Pixel Art', 'Chiptune', '8-bit Animation']),
                'bg_gradient' => 'from-[#0f0f23] via-[#1a1a3e] to-[#070710]',
                'icon'        => '🕹️',
                'sort_order'  => 5,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Cyberpunk Decryptor',
                'slug'        => 'cyberpunk',
                'type'        => json_encode(['birthday', 'graduation', 'anniversary']),
                'description' => 'Kartu ucapan futuristik bertema cyberpunk dengan efek glitch, matrix code, dan neon hologram.',
                'features'    => json_encode(['Glitch Effect', 'Neon Hologram', 'Matrix Code']),
                'bg_gradient' => 'from-[#0d0014] via-[#1a0028] to-[#060008]',
                'icon'        => '💻',
                'sort_order'  => 6,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Bioluminescent Deep Dive',
                'slug'        => 'bioluminescent',
                'type'        => json_encode(['birthday', 'anniversary', 'wedding']),
                'description' => 'Kartu ucapan bertema bioluminescent laut dalam dengan efek cahaya organik, ubur-ubur berpendar, dan musik ambient bawah laut.',
                'features'    => json_encode(['Bioluminescence', 'Jellyfish', 'Deep Ocean Audio']),
                'bg_gradient' => 'from-[#001428] via-[#002040] to-[#000a14]',
                'icon'        => '🦑',
                'sort_order'  => 7,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Mystic Forest & Lantern Wishes',
                'slug'        => 'mysticforest',
                'type'        => json_encode(['birthday', 'anniversary', 'graduation', 'wedding']),
                'description' => 'Kartu ucapan magis bertema hutan mistis dengan lentera terbang, cahaya kunang-kunang, dan musik alam malam yang magis.',
                'features'    => json_encode(['Floating Lanterns', 'Fireflies', 'Forest Ambience']),
                'bg_gradient' => 'from-[#0a1a0a] via-[#132213] to-[#040d04]',
                'icon'        => '🏮',
                'sort_order'  => 8,
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
