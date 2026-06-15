<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class AdatBaliThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'adat-bali'],
            [
                'name' => 'Adat Bali',
                'thumbnail' => '/themes/adat-bali/thumbnail.webp',
                'preview_url' => '/themes/adat-bali/preview.webp',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#5C1E4E', // Royal Balinese Purple
                    'secondary' => '#E6A11E', // Brilliant Balinese Gold
                    'bg' => '#FAF5EB', // Warm Sand / Champagne Background
                    'text' => '#2D1B28', // Dark Purple-Charcoal Text
                    'accent' => '#A62639', // Balinese Coral/Crimson Accent
                ],
                'font_config' => [
                    'heading' => 'Cinzel',
                    'body' => 'Montserrat',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'adat-bali/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 20,
                // Default data for the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Om Swastyastu',
                        'opening_text' => "Om Swastyastu\n\nAtas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.",
                        'opening_ayat' => 'Kala pertama kali jiwa bertemu, di situlah takdir berjalan. Pernikahan adalah ikatan suci lahir batin untuk menempuh kehidupan berdasarkan Dharma.',
                        'opening_ayat_translation' => 'Kala pertama kali jiwa bertemu, di situlah takdir berjalan. Pernikahan adalah ikatan suci lahir batin untuk menempuh kehidupan berdasarkan Dharma.',
                        'opening_ayat_source' => 'Sloka Yadnya',
                        'closing_title' => 'MATUR SUKSMA',
                        'closing_text' => "Matur suksma atas perhatian dan doa restu Bapak/Ibu/Saudara/i sekalian.\n\nOm Shanti Shanti Shanti Om",
                        'turut_mengundang_text' => '',
                        'religion' => 'hindu',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Ketut & Wayan',
                        'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri Upacara Pawiwahan kami.',
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
                            'full_name' => 'I Ketut Bagus Satria, S.T.',
                            'nickname' => 'Ketut',
                            'father_name' => 'I Made Satria',
                            'mother_name' => 'Ni Nyoman Triani',
                            'gender' => 'pria',
                            'photo' => '/themes/adat-bali/demo/groom.jpg',
                            'bio' => '',
                            'instagram' => 'USERNAME',
                            'child_order' => 'Keempat',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Ni Wayan Cantika Sari, S.E.',
                            'nickname' => 'Wayan',
                            'father_name' => 'I Gede Putu Sari',
                            'mother_name' => 'Ni Ketut Ningsih',
                            'gender' => 'wanita',
                            'photo' => '/themes/adat-bali/demo/bride.jpg',
                            'bio' => '',
                            'instagram' => 'USERNAME',
                            'child_order' => 'Pertama',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Tepang (Pertemuan)',
                            'story_date' => '2023-11-20',
                            'description' => 'Kami diperkenalkan oleh seorang sahabat di Denpasar pada akhir tahun 2023. Sejak pertemuan pertama itu, kami merasa memiliki kecocokan visi hidup yang sama.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Ngidih (Pinangan)',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah satu tahun menjalin komunikasi yang baik, keluarga besar kami melangsungkan upacara adat Ngidih untuk meminang sang gadis.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Upacara Pawiwahan',
                            'event_date' => '2026-12-25',
                            'start_time' => '08:00',
                            'end_time' => '11:00',
                            'timezone' => 'WITA',
                            'venue_name' => 'Pura Penataran Agung Lempuyang',
                            'venue_address' => 'Jl. Ketut Bebandem, Karangasem, Bali',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Walimatul Urus (Resepsi)',
                            'event_date' => '2026-12-25',
                            'start_time' => '12:00',
                            'end_time' => '15:00',
                            'timezone' => 'WITA',
                            'venue_name' => 'Taman Dedari Ubud',
                            'venue_address' => 'Jl. Raya Kedewatan, Ubud, Gianyar, Bali',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [
                        ['image_url' => '/images/demo/korea-7-768x512.jpg', 'caption' => '', 'sort_order' => 0],
                        ['image_url' => '/images/demo/korea-11-768x512.jpg', 'caption' => '', 'sort_order' => 1],
                    ],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'I Ketut Bagus Satria',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank BNI',
                            'account_name' => 'Ni Wayan Cantika Sari',
                            'account_number' => '0987654321',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'I Gede Putu', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                        ['name' => 'Ni Luh Ketut', 'phone' => '082233445566', 'group_name' => 'Teman'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'I Gede Putu', 'message' => 'Selamat menempuh hidup baru Ketut & Wayan! Semoga langgeng lan bagia salaminya.'],
                        ['sender_name' => 'Ni Luh Ketut', 'message' => 'Rahajeng pawiwahan Ketut lan Wayan, dumogi langgeng ngantos riwekasan.'],
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
