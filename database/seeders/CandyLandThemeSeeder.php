<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class CandyLandThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'candy-land'],
            [
                'name' => 'Candy Land',
                'thumbnail' => '/themes/candy-land/thumbnail.png',
                'preview_url' => '/themes/candy-land/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#FF4B72',    // Sweet Pink
                    'secondary' => '#FFC107',  // Candy Gold
                    'bg' => '#FFF3F6',         // Pastel Rose Cream
                    'text' => '#4A1525',       // Deep Plum Text
                    'accent' => '#00D2FC',     // Bright Bubblegum Cyan
                ],
                'font_config' => [
                    'heading' => 'Fredoka',
                    'body' => 'Quicksand',
                    'script' => 'Fredoka',
                ],
                'css_file' => 'candy-land/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 26,
                'type' => ['wedding', 'birthday', 'graduation', 'aqiqah', 'circumcision', 'anniversary', 'general'],
                'allowed_plans' => null,
                // Default data for previewing the theme (configured for Ulang Tahun / Birthday)
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Welcome to Candy Land!',
                        'opening_text' => "Hari yang penuh warna dan kegembiraan telah tiba! Kami mengundang teman-teman semua untuk bergabung dalam petualangan manis pesta ulang tahun putri kecil kami.",
                        'opening_ayat' => "Let's gather for a sweet celebration of life and laughter!",
                        'opening_ayat_translation' => '',
                        'opening_ayat_source' => '',
                        'closing_title' => 'THANK YOU FOR SHARING SWEET MEMORIES!',
                        'closing_text' => 'Kehadiran serta doa restu yang manis dari kalian adalah hadiah terindah. Sampai jumpa di istana permen kami!',
                        'turut_mengundang_text' => '',
                        'religion' => 'universal',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => "Rara's Candy Party",
                        'cover_subtitle' => "Rara's 5th Sweet Birthday Bash",
                        'countdown_target_date' => '2026-10-15 11:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'none',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Clarissa Rarasati',
                            'nickname' => 'Rara',
                            'father_name' => 'Ir. Hermawan',
                            'mother_name' => 'dr. Anita Lestari',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Putri kecil kami yang ceria, suka menari, dan sangat menyukai es krim stroberi. Rara sudah tidak sabar merayakan hari spesialnya bersama teman-teman!',
                            'instagram' => 'rara.sweetbirthday',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Kehadiran Si Kecil (Age 0)',
                            'story_date' => '2021-10-15',
                            'description' => 'Tangisan manis Rara pertama kali terdengar, melengkapi keluarga kami dengan kebahagiaan seindah permen gula.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Langkah & Kata Pertama (Age 1)',
                            'story_date' => '2022-10-15',
                            'description' => 'Mulai belajar melangkah kecil dan memanggil ayah ibu. Setiap celotehnya membawa kehangatan manis di rumah.',
                            'sort_order' => 1,
                        ],
                        [
                            'title' => 'Dunia Baru TK Kecil (Age 4)',
                            'story_date' => '2025-10-15',
                            'description' => 'Rara mulai sekolah TK. Ia tumbuh menjadi anak yang penuh percaya diri, gemar berteman, dan selalu ceria menyanyi.',
                            'sort_order' => 2,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'pesta',
                            'event_name' => 'Sweet Party',
                            'event_date' => '2026-10-15',
                            'start_time' => '11:00',
                            'end_time' => '14:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Sweet Castle Ballroom',
                            'venue_address' => 'Jl. Pelangi Ceria No. 12, Grogol, Jakarta Barat',
                            'gmaps_link' => 'https://maps.google.com/?q=Sweet+Castle+Ballroom',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Anita Lestari (Ibu Rara)',
                            'account_number' => '9876543210',
                            'sort_order' => 0,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Tamu Kehormatan', 'phone' => '081234567890', 'group_name' => 'Teman'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Tante Sarah', 'message' => 'Barakallah fii umrik Rara sayang! Semoga tumbuh menjadi anak yang saleha, pintar, berbakti kepada kedua orang tua, dan sehat ceria selalu! Muach! 🍬🍭🧁'],
                    ],
                ],
            ]
        );

        $sections = [
            ['key' => 'cover', 'name' => 'Cover Bash', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Welcome Comic', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Birthday Kid', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Candy Countdown', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Milestones', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Party Details', 'order' => 6, 'removable' => true],
            ['key' => 'livestream', 'name' => 'Live Streaming', 'order' => 7, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Sweet Gallery', 'order' => 8, 'removable' => true],
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
