<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $template = [
            'name'             => 'Dreamy Balloons',
            'slug'             => 'balloonpop',
            'type'             => json_encode(['anniversary', 'wedding', 'birthday', 'graduation']),
            'description'      => 'Kartu ucapan interaktif bertema langit pastel impian — balon helium melayang dengan gerakan gelombang sinus alami, efek meletus interaktif (pop) berpartikel konfeti/hati, letusan balon foto khusus yang membuka frame polaroid kenangan, disintesis audio pop Web Audio API, serta fitur interaktif untuk menerbangkan balon harapan kustom.',
            'features'         => json_encode(['Floating Balloons', 'Balloon Pop Sound', 'Polaroid Photos', 'Custom Wish Launcher']),
            'bg_gradient'      => 'from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]',
            'icon'             => '🎈',
            'sort_order'       => 10,
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
        DB::table('greeting_card_templates')->where('slug', 'balloonpop')->delete();
    }
};
