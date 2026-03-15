<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $themeId = DB::table('themes')->insertGetId([
            'name' => 'Spesial 02',
            'slug' => 'spesial-02',
            'thumbnail' => '/themes/spesial-02/bouquet.png',
            'category' => 'special',
            'color_scheme' => json_encode([
                'primary' => '#A68168',
                'secondary' => '#C4A882',
                'bg' => '#FDF5F0',
                'text' => '#5C4A3A',
                'accent' => '#8B6F5A',
            ]),
            'font_config' => json_encode([
                'heading' => "'Cormorant Garamond', serif",
                'body' => "'Work Sans', sans-serif",
                'script' => "'Great Vibes', cursive",
            ]),
            'supports_scroll' => true,
            'supports_slide' => true,
            'supports_tab' => true,
            'is_premium' => true,
            'is_active' => true,
            'sort_order' => 8,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $sections = [
            ['section_key' => 'cover', 'section_name' => 'Cover', 'component_name' => 'CoverSection', 'default_order' => 1, 'is_removable' => false],
            ['section_key' => 'opening', 'section_name' => 'Opening', 'component_name' => 'OpeningSection', 'default_order' => 2, 'is_removable' => true],
            ['section_key' => 'bride_groom', 'section_name' => 'Mempelai', 'component_name' => 'BrideGroomSection', 'default_order' => 3, 'is_removable' => true],
            ['section_key' => 'event', 'section_name' => 'Acara', 'component_name' => 'EventSection', 'default_order' => 4, 'is_removable' => true],
            ['section_key' => 'countdown', 'section_name' => 'Save The Date', 'component_name' => 'CountdownSection', 'default_order' => 5, 'is_removable' => true],
            ['section_key' => 'love_story', 'section_name' => 'Kisah Cinta', 'component_name' => 'LoveStorySection', 'default_order' => 6, 'is_removable' => true],
            ['section_key' => 'gallery', 'section_name' => 'Galeri', 'component_name' => 'GallerySection', 'default_order' => 7, 'is_removable' => true],
            ['section_key' => 'bank', 'section_name' => 'Amplop Digital', 'component_name' => 'BankSection', 'default_order' => 8, 'is_removable' => true],
            ['section_key' => 'rsvp', 'section_name' => 'RSVP', 'component_name' => 'RsvpSection', 'default_order' => 9, 'is_removable' => true],
            ['section_key' => 'wishes', 'section_name' => 'Ucapan', 'component_name' => 'WishesSection', 'default_order' => 10, 'is_removable' => true],
            ['section_key' => 'closing', 'section_name' => 'Penutup', 'component_name' => 'ClosingSection', 'default_order' => 11, 'is_removable' => true],
        ];

        foreach ($sections as $s) {
            DB::table('theme_sections')->insert(array_merge($s, [
                'theme_id' => $themeId,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        $theme = DB::table('themes')->where('slug', 'spesial-02')->first();
        if ($theme) {
            DB::table('theme_sections')->where('theme_id', $theme->id)->delete();
            DB::table('themes')->where('id', $theme->id)->delete();
        }
    }
};
