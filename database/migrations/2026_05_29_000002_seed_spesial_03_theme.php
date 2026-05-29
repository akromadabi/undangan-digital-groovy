<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // 1. Prepare default mockup data for automatic seeding when user picks this theme
        $defaultData = [
            'invitation' => [
                'opening_title' => 'The Wedding Of',
                'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
                'opening_ayat' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                'opening_ayat_translation' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                'opening_ayat_source' => 'Adz-Dzariyat: 49',
                'closing_title' => 'TERIMA KASIH',
                'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.',
                'turut_mengundang_text' => '',
                'religion' => 'islam',
                'music_url' => '/audio/backsound.mp3',
                'music_autoplay' => true,
                'cover_title' => 'Habib & Adiba',
                'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.',
                'countdown_target_date' => '2026-12-20 08:00:00',
                'save_the_date_enabled' => true,
                'particle_type' => 'gold-dust',
                'gallery_mode' => 'grid',
                'enable_rsvp' => true,
                'enable_wishes' => true,
            ],
            'bride_grooms' => [
                [
                    'order_number' => 1,
                    'full_name' => 'Habib Yulianto',
                    'nickname' => 'Habib',
                    'father_name' => 'Anas',
                    'mother_name' => 'Kholifah',
                    'gender' => 'pria',
                    'photo' => '/themes/spesial-03/pria.jpg',
                    'bio' => '',
                    'instagram' => 'habib_y',
                    'child_order' => 'Pertama',
                ],
                [
                    'order_number' => 2,
                    'full_name' => 'Adiba Putri Syakila',
                    'nickname' => 'Adiba',
                    'father_name' => 'M. Dawam',
                    'mother_name' => 'Dewi Sudarwati',
                    'gender' => 'wanita',
                    'photo' => '/themes/spesial-03/wanita.jpg',
                    'bio' => '',
                    'instagram' => 'adibaps',
                    'child_order' => 'Pertama',
                ],
            ],
            'love_stories' => [
                [
                    'title' => 'Pertama Bertemu',
                    'description' => 'Kami dipertemukan di bangku perkuliahan pada tahun 2020. Berawal dari tugas kelompok, komunikasi kami terus berlanjut.',
                    'sort_order' => 0,
                ],
                [
                    'title' => 'Menjalin Komitmen',
                    'description' => 'Setelah dua tahun saling mengenal, kami memutuskan untuk menjalin hubungan yang lebih serius dan berkomitmen.',
                    'sort_order' => 1,
                ],
                [
                    'title' => 'Hari Pertunangan',
                    'description' => 'Pada tanggal 12 Juni 2025, di hadapan keluarga besar kami masing-masing, kami secara resmi melangsungkan acara lamaran.',
                    'sort_order' => 2,
                ],
            ],
            'events' => [
                [
                    'event_type' => 'akad',
                    'event_name' => 'Akad Nikah',
                    'event_date' => '2026-12-20',
                    'start_time' => '08:00',
                    'end_time' => '10:00',
                    'timezone' => 'WIB',
                    'venue_name' => 'Mesjid Raya Terracotta',
                    'venue_address' => 'Jl. Clay Terracotta No. 42, Kota Indah',
                    'gmaps_link' => 'https://maps.google.com',
                    'sort_order' => 0,
                    'is_primary' => true,
                ],
                [
                    'event_type' => 'resepsi',
                    'event_name' => 'Resepsi Pernikahan',
                    'event_date' => '2026-12-20',
                    'start_time' => '11:00',
                    'end_time' => '14:00',
                    'timezone' => 'WIB',
                    'venue_name' => 'Grand Terracotta Ballroom',
                    'venue_address' => 'Jl. Pampas Boulevard No. 100, Kota Indah',
                    'gmaps_link' => 'https://maps.google.com',
                    'sort_order' => 1,
                    'is_primary' => false,
                ],
            ],
            'galleries' => [
                ['image_url' => '/themes/spesial-03/mini-gallery.jpg', 'caption' => 'Prewedding Moment 1', 'sort_order' => 0],
                ['image_url' => '/themes/spesial-03/pria.jpg', 'caption' => 'Prewedding Moment 2', 'sort_order' => 1],
                ['image_url' => '/themes/spesial-03/wanita.jpg', 'caption' => 'Prewedding Moment 3', 'sort_order' => 2],
                ['image_url' => '/themes/spesial-03/mini-awal.jpg', 'caption' => 'Prewedding Moment 4', 'sort_order' => 3],
            ],
            'bank_accounts' => [
                [
                    'bank_name' => 'BCA',
                    'account_name' => 'Habib Yulianto',
                    'account_number' => '8293029302',
                    'sort_order' => 0,
                ],
                [
                    'bank_name' => 'DANA',
                    'account_name' => 'Adiba Putri Syakila',
                    'account_number' => '081234567890',
                    'sort_order' => 1,
                ],
            ],
            'guests' => [
                ['name' => 'Budi Santoso', 'phone' => '08123456789', 'group_name' => 'Sahabat'],
                ['name' => 'Siti Aminah', 'phone' => '08765432109', 'group_name' => 'Keluarga'],
            ],
            'wishes' => [
                ['sender_name' => 'Anisa Rahma', 'message' => 'Selamat menempuh hidup baru yaa! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. 💖🥰'],
                ['sender_name' => 'Budi Santoso', 'message' => 'Mantap bro! Selamat menempuh ibadah terpanjang. Semoga lancar sampai hari H dan diberkahi selalu rumah tangganya! 🤝🔥'],
            ],
        ];

        // 2. Clear pre-existing slug if any to prevent duplication
        $existing = DB::table('themes')->where('slug', 'spesial-03')->first();
        if ($existing) {
            DB::table('theme_sections')->where('theme_id', $existing->id)->delete();
            DB::table('themes')->where('id', $existing->id)->delete();
        }

        // 3. Insert Theme
        $themeId = DB::table('themes')->insertGetId([
            'name' => 'Spesial 03 (Classic Navy & Gold)',
            'slug' => 'spesial-03',
            'thumbnail' => '/themes/spesial-03/mini-awal.jpg',
            'category' => 'Premium',
            'color_scheme' => json_encode([
                'primary' => '#2e3f54',
                'secondary' => '#4a5a74',
                'bg' => '#ffffff',
                'text' => '#40506b',
                'accent' => '#d7ac64',
            ]),
            'font_config' => json_encode([
                'heading' => "'Cinzel', serif",
                'body' => "'Montserrat', sans-serif",
                'script' => "'Great Vibes', cursive",
            ]),
            'supports_scroll' => true,
            'supports_slide' => true,
            'supports_tab' => true,
            'is_premium' => true,
            'is_active' => true,
            'sort_order' => 9,
            'type' => json_encode(['wedding', 'general']),
            'allowed_plans' => null,
            'default_data' => json_encode($defaultData),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Register Theme Sections
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
        $theme = DB::table('themes')->where('slug', 'spesial-03')->first();
        if ($theme) {
            DB::table('theme_sections')->where('theme_id', $theme->id)->delete();
            DB::table('themes')->where('id', $theme->id)->delete();
        }
    }
};
