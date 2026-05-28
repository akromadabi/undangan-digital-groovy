<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class ShopeeThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'shopee'],
            [
                'name' => 'Shopee Checkout',
                'thumbnail' => '/themes/shopee/thumbnail.webp',
                'preview_url' => '/themes/shopee/preview.webp',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#EE4D2D',
                    'secondary' => '#F15822',
                    'bg' => '#F5F5F5',
                    'text' => '#222222',
                    'accent' => '#FF5722',
                ],
                'font_config' => [
                    'heading' => 'Poppins',
                    'body' => 'Poppins',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'shopee/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 16,
                // Default data for the theme
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
                        'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.',
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
                            'bio' => '',
                            'instagram' => 'USERNAME',
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
                            'bio' => '',
                            'instagram' => 'USERNAME',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Awal Bertemu',
                            'story_date' => '2023-11-20',
                            'description' => 'Kami diperkenalkan oleh seorang sahabat di Yogyakarta pada akhir tahun 2023. Sejak pertemuan pertama itu, kami merasa memiliki kecocokan visi hidup yang sama.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Komitmen Bersama',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah satu tahun menjalin komunikasi yang intens, kami sepakat untuk melangkah ke jenjang yang lebih serius dengan memohon restu kedua orang tua.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Akad Nikah',
                            'event_date' => '2026-12-25',
                            'start_time' => '08:00',
                            'end_time' => '10:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gedung Kesenian Jogja',
                            'venue_address' => 'Jl. Panembahan Senopati No. 2, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi Pernikahan',
                            'event_date' => '2026-12-25',
                            'start_time' => '11:00',
                            'end_time' => '14:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gedung Kesenian Jogja',
                            'venue_address' => 'Jl. Panembahan Senopati No. 2, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com/?q=Gedung+Kesenian+Yogyakarta',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'SeaBank',
                            'account_name' => 'Bimo Wicaksono',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'Raras Sekar Ayu',
                            'account_number' => '0987654321',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Ahmad Saputra', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Ahmad Saputra', 'message' => 'Selamat menempuh hidup baru Bimo & Raras! Semoga sakinah mawaddah wa rahmah selalu.'],
                    ],
                ],
            ]
        );

        $sections = [
            ['key' => 'cover', 'name' => 'Cover', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Opening', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Mempelai', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Save The Date', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Kisah Cinta', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Acara', 'order' => 6, 'removable' => true],
            ['key' => 'livestream', 'name' => 'Live Streaming', 'order' => 7, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Galeri', 'order' => 8, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP', 'order' => 9, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Ucapan', 'order' => 10, 'removable' => true],
            ['key' => 'bank', 'name' => 'Amplop Digital', 'order' => 11, 'removable' => true],
            ['key' => 'closing', 'name' => 'Penutup', 'order' => 12, 'removable' => false],
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
