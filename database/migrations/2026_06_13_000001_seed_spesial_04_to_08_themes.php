<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $defaultData = [
            'invitation' => [
                'opening_title' => 'The Wedding Of',
                'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
                'opening_ayat' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                'opening_ayat_translation' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                'opening_ayat_source' => 'Adz-Dzariyat: 49',
                'closing_title' => 'Terima Kasih',
                'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.',
                'turut_mengundang_text' => '',
                'religion' => 'islam',
                'music_url' => '/audio/backsound.mp3',
                'music_autoplay' => true,
                'cover_title' => 'Dika & Putri',
                'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.',
                'countdown_target_date' => '2026-12-25 08:00:00',
                'save_the_date_enabled' => true,
                'particle_type' => 'gold-dust',
                'gallery_mode' => 'grid',
                'enable_rsvp' => true,
                'enable_wishes' => true,
            ],
            'bride_grooms' => [
                [
                    'order_number' => 1,
                    'full_name' => 'Dika Hermawan',
                    'nickname' => 'Dika',
                    'father_name' => 'Bpk. Hermawan',
                    'mother_name' => 'Ibu Hermawan',
                    'gender' => 'pria',
                    'photo' => '',
                    'bio' => '',
                    'instagram' => 'dika_hermawan',
                    'child_order' => 'Pertama',
                ],
                [
                    'order_number' => 2,
                    'full_name' => 'Putri Lestari',
                    'nickname' => 'Putri',
                    'father_name' => 'Bpk. Lestari',
                    'mother_name' => 'Ibu Lestari',
                    'gender' => 'wanita',
                    'photo' => '',
                    'bio' => '',
                    'instagram' => 'putri_lestari',
                    'child_order' => 'Kedua',
                ],
            ],
            'love_stories' => [
                [
                    'title' => 'Awal Bertemu',
                    'story_date' => '2024-01-01',
                    'description' => 'Kami pertama kali dipertemukan di sebuah acara perkumpulan teman. Sejak saat itu, kami mulai berkomunikasi secara intens.',
                    'sort_order' => 0,
                ],
            ],
            'events' => [
                [
                    'event_type' => 'akad',
                    'event_name' => 'Akad Nikah',
                    'event_date' => '2026-12-25',
                    'start_time' => '09:00',
                    'end_time' => '10:00',
                    'timezone' => 'WIB',
                    'venue_name' => 'Masjid Raya Al-Barkah',
                    'venue_address' => 'Jl. Veteran No. 1, Kota Bekasi',
                    'gmaps_link' => 'https://maps.google.com',
                    'sort_order' => 0,
                    'is_primary' => true,
                ],
                [
                    'event_type' => 'resepsi',
                    'event_name' => 'Resepsi Pernikahan',
                    'event_date' => '2026-12-25',
                    'start_time' => '11:00',
                    'end_time' => '13:00',
                    'timezone' => 'WIB',
                    'venue_name' => 'Grand Ballroom Convention Hall',
                    'venue_address' => 'Jl. Jenderal Sudirman No. 20, Kota Bekasi',
                    'gmaps_link' => 'https://maps.google.com',
                    'sort_order' => 1,
                    'is_primary' => false,
                ],
            ],
            'galleries' => [],
            'bank_accounts' => [
                [
                    'bank_name' => 'BCA',
                    'account_name' => 'Dika Hermawan',
                    'account_number' => '1234567890',
                    'sort_order' => 0,
                ],
            ],
            'guests' => [
                ['name' => 'Tamu Kehormatan', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
            ],
        ];

        $themesToSeed = [
            [
                'name' => 'Spesial 04 (Terracotta Elegance)',
                'slug' => 'spesial-04',
                'thumbnail' => '/themes/spesial-04/thumbnail.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#c26e5f',
                    'secondary' => '#f9d9cc',
                    'bg' => '#fbf2ee',
                    'text' => '#40302d',
                    'accent' => '#c26e5f',
                ],
                'font_config' => [
                    'heading' => "'Niconne', cursive",
                    'body' => "'Montserrat', sans-serif",
                    'script' => "'Niconne', cursive",
                ],
                'sort_order' => 44,
            ],
            [
                'name' => 'Spesial 05 (Monte Carlo Sage)',
                'slug' => 'spesial-05',
                'thumbnail' => '/themes/spesial-05/thumbnail.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#484729',
                    'secondary' => '#cbc46d',
                    'bg' => '#fbfbf7',
                    'text' => '#484729',
                    'accent' => '#dfad6b',
                ],
                'font_config' => [
                    'heading' => "'MonteCarlo', cursive",
                    'body' => "'Montserrat', sans-serif",
                    'script' => "'Amita', cursive",
                ],
                'sort_order' => 45,
            ],
            [
                'name' => 'Spesial 06 (Caramel Modernist)',
                'slug' => 'spesial-06',
                'thumbnail' => '/themes/spesial-06/thumbnail.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#282828',
                    'secondary' => '#838181',
                    'bg' => '#f5f5f5',
                    'text' => '#4b4a4a',
                    'accent' => '#52483c',
                ],
                'font_config' => [
                    'heading' => "'Caramel', cursive",
                    'body' => "'Montserrat', sans-serif",
                    'script' => "'Caramel', cursive",
                ],
                'sort_order' => 46,
            ],
            [
                'name' => 'Spesial 07 (Sage Green & Gold)',
                'slug' => 'spesial-07',
                'thumbnail' => '/themes/spesial-07/thumbnail.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#3E4E48',
                    'secondary' => '#5B844A',
                    'bg' => '#F4F6F5',
                    'text' => '#333d39',
                    'accent' => '#E4DB1F',
                ],
                'font_config' => [
                    'heading' => "'Caramel', cursive",
                    'body' => "'Montserrat', sans-serif",
                    'script' => "'Kaushan Script', cursive",
                ],
                'sort_order' => 47,
            ],
            [
                'name' => 'Spesial 08 (Warm Alabaster & Gold)',
                'slug' => 'spesial-08',
                'thumbnail' => '/themes/spesial-08/thumbnail.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#8F8477',
                    'secondary' => '#AB956A',
                    'bg' => '#F5EBE0',
                    'text' => '#363636',
                    'accent' => '#DDC8B1',
                ],
                'font_config' => [
                    'heading' => "'Caramel', cursive",
                    'body' => "'Montserrat', sans-serif",
                    'script' => "'Elsie Swash Caps', serif",
                ],
                'sort_order' => 48,
            ],
        ];

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
            ['key' => 'bank', 'name' => 'Amplop / Kado Digital', 'order' => 11, 'removable' => true],
            ['key' => 'closing', 'name' => 'Penutup', 'order' => 12, 'removable' => false],
        ];

        foreach ($themesToSeed as $t) {
            // Delete if existing to avoid conflicts
            $existing = DB::table('themes')->where('slug', $t['slug'])->first();
            if ($existing) {
                DB::table('theme_sections')->where('theme_id', $existing->id)->delete();
                DB::table('themes')->where('id', $existing->id)->delete();
            }

            // Insert Theme
            $themeId = DB::table('themes')->insertGetId([
                'name' => $t['name'],
                'slug' => $t['slug'],
                'thumbnail' => $t['thumbnail'],
                'category' => $t['category'],
                'color_scheme' => json_encode($t['color_scheme']),
                'font_config' => json_encode($t['font_config']),
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => $t['sort_order'],
                'type' => json_encode(['wedding', 'general']),
                'allowed_plans' => null,
                'default_data' => json_encode($defaultData),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insert Theme Sections
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
    }

    public function down(): void
    {
        $slugs = ['spesial-04', 'spesial-05', 'spesial-06', 'spesial-07', 'spesial-08'];
        $themes = DB::table('themes')->whereIn('slug', $slugs)->get();
        foreach ($themes as $t) {
            DB::table('theme_sections')->where('theme_id', $t->id)->delete();
            DB::table('themes')->where('id', $t->id)->delete();
        }
    }
};
