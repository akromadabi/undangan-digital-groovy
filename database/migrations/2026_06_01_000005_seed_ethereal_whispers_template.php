<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $template = [
            'name'             => 'Ethereal Whispers',
            'slug'             => 'etherealwhispers',
            'type'             => json_encode(['anniversary', 'wedding', 'birthday']),
            'description'      => 'Kartu ucapan cinta premium yang memadukan keindahan gerbang bunga melengkung, segel lilin 3D interaktif yang bisa dipecahkan, tulisan kaligrafi mengalir, dan guguran kelopak bunga sakura yang romantis.',
            'features'         => json_encode(['Wax Seal 3D', 'Archway Gallery', 'Falling Petals', 'Harp Soundscape']),
            'bg_gradient'      => 'from-[#fdf8f5] via-[#faebf0] to-[#f5dae2]',
            'icon'             => '🌸',
            'sort_order'       => 9,
            'is_active'        => true,
            'preview_template' => 'full-mockup',
            'preview_images'   => json_encode([]),
            'preview_bg_style' => 'light',
            'created_at'       => now(),
            'updated_at'       => now(),
        ];

        DB::table('greeting_card_templates')->insert($template);
    }

    public function down(): void
    {
        DB::table('greeting_card_templates')->where('slug', 'etherealwhispers')->delete();
    }
};
