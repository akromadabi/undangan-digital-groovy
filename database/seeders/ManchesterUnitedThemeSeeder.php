<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class ManchesterUnitedThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'manchester-united'],
            [
                'name' => 'UnitedInVite',
                'thumbnail' => '/themes/manchester-united/thumbnail.png',
                'preview_url' => '/themes/manchester-united/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#DA020E',    // MU Red
                    'secondary' => '#FFE500',  // MU Gold
                    'bg' => '#0F0F0F',         // MU Dark Charcoal
                    'text' => '#FFFFFF',       // MU Text White
                    'accent' => '#222222',     // MU Dark Surface Panel
                ],
                'font_config' => [
                    'heading' => 'Montserrat',
                    'body' => 'Plus Jakarta Sans',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'manchester-united/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 19,
                // Default data for previewing the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'The Wedding Match',
                        'opening_text' => "Dengan memohon rahmat Allah SWT dan restu keluarga besar, kami mengundang Anda untuk menyaksikan kick-off janji suci pernikahan kami.",
                        'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_source' => 'Ar-Rum: 21',
                        'closing_title' => 'Full Time',
                        'closing_text' => 'Terima kasih atas kehadiran dan doa restu Anda di pertandingan bersejarah dalam hidup kami. Glory Glory Bimo & Raras!',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Bimo & Raras',
                        'cover_subtitle' => 'Kick-off of Our Love Journey • Old Trafford Stadium',
                        'countdown_target_date' => '2026-12-25 08:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'none',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Bimo Wicaksono',
                            'nickname' => 'Bimo',
                            'father_name' => 'H. Joko Wicaksono',
                            'mother_name' => 'Hj. Endang Sri Lestari',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Forward Player #09 - Groom',
                            'instagram' => 'bimo.wicaksono',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Raras Sekar Ayu',
                            'nickname' => 'Raras',
                            'father_name' => 'H. Bambang Sunarto',
                            'mother_name' => 'Hj. Wahyu Ningsih',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Midfielder Playmaker #10 - Bride',
                            'instagram' => 'raras.sekar',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Kick-Off: Pertemuan Pertama',
                            'story_date' => '2023-11-20',
                            'description' => 'Dipertemukan secara tidak sengaja di tribun penonton. Kesamaan minat dan obrolan seru seputar klub kebanggaan menjadi awal rasa nyaman.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Extra Time: Komitmen Bersama',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah melewati berbagai fase perjalanan hidup, kami sepakat untuk berpasangan secara resmi sebagai rekan setim seumur hidup.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Leg 1: Akad Nikah',
                            'event_date' => '2026-12-25',
                            'start_time' => '08:00',
                            'end_time' => '10:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Masjid Raya Baiturrahman',
                            'venue_address' => 'Jl. Pemuda No. 1, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Leg 2: Resepsi Pernikahan',
                            'event_date' => '2026-12-25',
                            'start_time' => '11:00',
                            'end_time' => '14:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Old Trafford Grand Hall',
                            'venue_address' => 'Jl. Pemuda No. 2, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Bimo Wicaksono',
                            'account_number' => '1370012345678',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank BCA',
                            'account_name' => 'Raras Sekar Ayu',
                            'account_number' => '8020123456',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Ahmad Saputra', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Ahmad Saputra', 'message' => 'Glory Glory Bimo & Raras! Selamat atas transfer terindah musim ini, semoga menjadi keluarga sakinah mawaddah wa rahmah! 🔴👹⚽'],
                    ],
                ],
            ]
        );

        $sections = [
            ['key' => 'cover', 'name' => 'Cover Ticket', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Scoreboard Opening', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Player Lineup', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Jumbotron Kick-off', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Match Timeline', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Match Fixtures', 'order' => 6, 'removable' => true],
            ['key' => 'livestream', 'name' => 'Broadcasting', 'order' => 7, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Match Gallery', 'order' => 8, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'Supporters Attendance', 'order' => 9, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Supporters Wishes', 'order' => 10, 'removable' => true],
            ['key' => 'bank', 'name' => 'Transfer Window Funds', 'order' => 11, 'removable' => true],
            ['key' => 'closing', 'name' => 'Trophy Presentation', 'order' => 12, 'removable' => false],
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
