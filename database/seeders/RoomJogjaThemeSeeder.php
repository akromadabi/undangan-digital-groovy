<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class RoomJogjaThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'room-jogja'],
            [
                'name' => 'Room Jogja',
                'thumbnail' => '/themes/room-jogja/room-bg.png',
                'preview_url' => '/themes/room-jogja/room-bg.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#c9a227',    // Gold
                    'secondary' => '#f5e6c8',  // Cream
                    'bg' => '#1a1108',         // Dark Brown
                    'text' => '#3d2b10',       // Dark text
                    'accent' => '#e8c547',     // Bright Gold
                ],
                'font_config' => [
                    'heading' => 'Cinzel',
                    'body' => 'Cormorant Garamond',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'room-jogja/style.css',
                'supports_scroll' => false,
                'supports_slide' => false,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 27,
                'type' => ['wedding'],
                'allowed_plans' => null,
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'The Wedding Of',
                        'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
                        'opening_ayat' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                        'opening_ayat_translation' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                        'opening_ayat_source' => 'Adz-Dzariyat: 49',
                        'closing_title' => 'THANK YOU',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Bimo & Raras',
                        'cover_subtitle' => 'The Wedding Of Bimo & Raras',
                        'countdown_target_date' => '2026-12-15 08:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'none',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                        'show_countdown' => true,
                        'show_qr_code' => true,
                        'enable_qr' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Bimo Wicaksono',
                            'nickname' => 'Bimo',
                            'father_name' => 'H. Bambang Wicaksono',
                            'mother_name' => 'Hj. Siti Aminah',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Putra pertama dari keluarga besar H. Bambang Wicaksono',
                            'instagram' => 'bimowicaksono',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Raras Ayuningtyas',
                            'nickname' => 'Raras',
                            'father_name' => 'H. Joko Susilo',
                            'mother_name' => 'Hj. Rahayu Ningsih',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Putri kedua dari keluarga besar H. Joko Susilo',
                            'instagram' => 'rarasayuningtyas',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Pertama Bertemu',
                            'story_date' => '2023-01-01',
                            'description' => 'Awal mula pertemuan kami yang penuh dengan keindahan dan keceriaan.',
                            'sort_order' => 1,
                        ],
                        [
                            'title' => 'Komitmen Bersama',
                            'story_date' => '2024-05-20',
                            'description' => 'Kami memutuskan untuk berkomitmen melangkah bersama ke jenjang pernikahan.',
                            'sort_order' => 2,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Akad Nikah',
                            'event_date' => '2026-12-15',
                            'start_time' => '08:00',
                            'end_time' => '10:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Yogyakarta Hall Room',
                            'venue_address' => 'Jl. Malioboro No. 45, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 1,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi Nikah',
                            'event_date' => '2026-12-15',
                            'start_time' => '11:00',
                            'end_time' => '14:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Yogyakarta Hall Room',
                            'venue_address' => 'Jl. Malioboro No. 45, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 2,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Bimo Wicaksono',
                            'account_number' => '1234567890',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Tamu Kehormatan', 'phone' => '081234567890', 'group_name' => 'Umum'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Sahabat Bimo', 'message' => 'Selamat menempuh hidup baru! Semoga sakinah mawaddah wa rahmah.'],
                    ],
                ],
            ]
        );

        $sections = [
            ['key' => 'cover', 'name' => 'Cover', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Welcome Quote', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'About Us', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Countdown', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Love Story', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Date & Venue', 'order' => 6, 'removable' => true],
            ['key' => 'livestream', 'name' => 'Live Streaming', 'order' => 7, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Gallery', 'order' => 8, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP / Attendance', 'order' => 9, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Wishes', 'order' => 10, 'removable' => true],
            ['key' => 'bank', 'name' => 'Gift / Account', 'order' => 11, 'removable' => true],
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
