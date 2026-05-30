<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class SpidermanThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'spiderman'],
            [
                'name' => 'Spidey Adventure',
                'thumbnail' => '/themes/spiderman/thumbnail.png',
                'preview_url' => '/themes/spiderman/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#E60012',    // Spiderman Red
                    'secondary' => '#0B1B3D',  // Spiderman Dark Blue
                    'bg' => '#060D1E',         // Dark Night Blue
                    'text' => '#FFFFFF',       // Text White
                    'accent' => '#00BFFF',     // Neon Blue Web Accent
                ],
                'font_config' => [
                    'heading' => 'Bangers',
                    'body' => 'Plus Jakarta Sans',
                    'script' => 'Bangers',
                ],
                'css_file' => 'spiderman/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 25,
                // Default data for previewing the theme (configured for Ulang Tahun / Birthday)
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Ready for an Adventure?',
                        'opening_text' => "Dengan penuh rasa syukur dan gembira, kami mengundang teman-teman sekalian untuk hadir merayakan pesta ulang tahun putra kami yang tercinta.",
                        'opening_ayat' => "Ayo bantu pahlawan kecil kita merayakan hari spesialnya!",
                        'opening_ayat_translation' => '',
                        'opening_ayat_source' => '',
                        'closing_title' => 'THANK YOU FOR SWINGING BY!',
                        'closing_text' => 'Kehadiran serta doa restu dari teman-teman dan keluarga adalah kado terindah bagi kami. Sampai jumpa di lokasi pesta!',
                        'turut_mengundang_text' => '',
                        'religion' => 'universal',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => "Spidey's Birthday Bash",
                        'cover_subtitle' => "Peter's 5th Birthday Celebration",
                        'countdown_target_date' => '2026-12-25 10:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'none',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Peter Parker',
                            'nickname' => 'Peter',
                            'father_name' => 'Richard Parker',
                            'mother_name' => 'Mary Parker',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Friendly Neighborhood Birthday Kid! Pahlawan cilik yang aktif, cerdas, dan suka memanjat.',
                            'instagram' => 'spidey.birthday',
                            'child_order' => 'Pertama',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Lahir ke Dunia (Age 0)',
                            'story_date' => '2021-12-25',
                            'description' => 'Pahlawan kecil kami Peter Parker lahir ke dunia membawa kebahagiaan besar dan mewarnai hari-hari kami dengan canda tawa.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Langkah Pertama (Age 1)',
                            'story_date' => '2022-12-25',
                            'description' => 'Mulai belajar berjalan dan merayap ke sana kemari. Peter tumbuh menjadi anak yang lincah seperti Spidey kecil!',
                            'sort_order' => 1,
                        ],
                        [
                            'title' => 'Mulai Berpetualang (Age 4)',
                            'story_date' => '2025-12-25',
                            'description' => 'Peter mulai masuk sekolah TK, memiliki banyak teman baru, dan gemar berkreasi serta selalu ingin menolong temannya.',
                            'sort_order' => 2,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'pesta',
                            'event_name' => 'Birthday Party',
                            'event_date' => '2026-12-25',
                            'start_time' => '10:00',
                            'end_time' => '13:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Daily Bugle Hall',
                            'venue_address' => 'Jl. Jaring Laba-Laba No. 88, Jakarta Barat',
                            'gmaps_link' => 'https://maps.google.com/?q=Daily+Bugle+Hall',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'Bank BCA',
                            'account_name' => 'Mary Parker (Ibu Peter)',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Ned Leeds', 'phone' => '081122334455', 'group_name' => 'Teman'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Ned Leeds', 'message' => 'Selamat ulang tahun Peter! Semoga makin kuat, pintar, berbakti kepada orang tua, dan terus jadi pahlawan kebanggaan keluarga! BAM! 🕸️🔴🔵'],
                    ],
                ],
            ]
        );

        $sections = [
            ['key' => 'cover', 'name' => 'Cover Bash', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Welcome Comic', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Birthday Kid', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Spidey Countdown', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Milestones', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Party Details', 'order' => 6, 'removable' => true],
            ['key' => 'livestream', 'name' => 'Live Streaming', 'order' => 7, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Adventure Gallery', 'order' => 8, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP / Attendance', 'order' => 9, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Guestbook Wishes', 'order' => 10, 'removable' => true],
            ['key' => 'bank', 'name' => 'Digital Gift Box', 'order' => 11, 'removable' => true],
            ['key' => 'closing', 'name' => 'Closing Credits', 'order' => 12, 'removable' => false],
        ];

        foreach ($sections as $s) {
            ThemeSection::updateOrCreate(
                ['theme_id' => $theme->id, 'section_key' => $s['key']],
                [
                    'section_name' => $s['name'],
                    'component_name' => ucfirst($s['key']) . 'Section',
                    'default_order' => $s['order'],
                    'is_removable' => $s['removable'],
                    'is_default' => true,
                ]
            );
        }

        // Ensure all existing invitations using this theme have these sections
        $invitations = \App\Models\Invitation::where('theme_id', $theme->id)->get();
        foreach ($invitations as $invitation) {
            foreach ($theme->sections as $ts) {
                $invitation->sections()->firstOrCreate(
                    ['section_key' => $ts->section_key],
                    [
                        'section_name' => $ts->section_name,
                        'sort_order' => $ts->default_order,
                        'is_visible' => $ts->is_default,
                    ]
                );
            }
        }
    }
}
