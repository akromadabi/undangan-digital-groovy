<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create or Update Theme
        $themeId = DB::table('themes')->insertGetId([
            'slug' => 'youtube',
            'name' => 'YouTube Red',
            'thumbnail' => '/themes/modern-black/thumbnail.jpg', // Default placeholder
            'category' => 'modern',
            'color_scheme' => json_encode([
                'primary' => '#FF0000',
                'secondary' => '#0F0F0F',
                'bg' => '#0F0F0F',
                'text' => '#FFFFFF',
                'accent' => '#FF0000',
            ]),
            'font_config' => json_encode([
                'heading' => 'Roboto',
                'body' => 'Roboto',
                'script' => 'Great Vibes',
            ]),
            'css_file' => 'youtube/style.css',
            'supports_scroll' => true,
            'supports_slide' => false,
            'supports_tab' => false,
            'is_premium' => true,
            'is_active' => true,
            'sort_order' => 12,
            'type' => json_encode(['wedding', 'birthday', 'graduation', 'aqiqah', 'circumcision', 'anniversary', 'general']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Register Theme Sections
        $sections = [
            ['key' => 'cover', 'name' => 'Cover', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Opening', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Mempelai', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Save The Date', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Kisah Cinta / Milestones', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Acara', 'order' => 6, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Galeri', 'order' => 7, 'removable' => true],
            ['key' => 'livestream', 'name' => 'Siaran Langsung', 'order' => 8, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP / Comments Form', 'order' => 9, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Ucapan / Comments List', 'order' => 10, 'removable' => true],
            ['key' => 'bank', 'name' => 'Amplop / Super Chat', 'order' => 11, 'removable' => true],
            ['key' => 'closing', 'name' => 'Penutup / End Screen', 'order' => 12, 'removable' => false],
        ];

        foreach ($sections as $s) {
            DB::table('theme_sections')->insert([
                'theme_id' => $themeId,
                'section_key' => $s['key'],
                'section_name' => $s['name'],
                'component_name' => ucfirst($s['key']) . 'Section',
                'default_order' => $s['order'],
                'is_removable' => $s['removable'],
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        $theme = DB::table('themes')->where('slug', 'youtube')->first();
        if ($theme) {
            DB::table('theme_sections')->where('theme_id', $theme->id)->delete();
            DB::table('themes')->where('id', $theme->id)->delete();
        }
    }
};
