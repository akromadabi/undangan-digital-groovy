<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class ChineseTraditionalThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'chinese-traditional'],
            [
                'name' => 'Chinese Traditional',
                'thumbnail' => '/themes/chinese-traditional/thumbnail.png',
                'preview_url' => '/themes/chinese-traditional/preview.png',
                'category' => 'Premium',
                'type' => ['wedding', 'birthday', 'general', 'anniversary'],
                'color_scheme' => [
                    'primary' => '#b30000', // Imperial Red
                    'secondary' => '#111111', // Deep Ebony Charcoal
                    'bg' => '#fffaf0', // Floral Silk Cream
                    'text' => '#2b1414', // Maroon Black
                    'accent' => '#d4af37', // Chinese Gold
                ],
                'font_config' => [
                    'heading' => 'Cinzel',
                    'body' => 'Montserrat',
                    'script' => 'Alex Brush',
                ],
                'css_file' => 'chinese-traditional/style.css',
                'supports_scroll' => true,
                'supports_slide' => false,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 37,
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'The Wedding of',
                        'opening_text' => "Dengan memohon rahmat Tuhan dan restu leluhur, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan bersatunya cinta kasih putra-putri kami.",
                        'opening_ayat' => 'Dua insan bersatu bagaikan naga dan burung feniks, terbang beriringan mengarungi cakrawala kehidupan dalam kesetiaan abadi.',
                        'opening_ayat_translation' => '',
                        'opening_ayat_source' => 'Pepatah Harmoni Tionghoa Klasik',
                        'closing_title' => 'Terima Kasih',
                        'closing_text' => 'Merupakan kebahagiaan dan kehormatan besar bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu bagi kedua mempelai.',
                        'turut_mengundang_text' => '',
                        'religion' => 'general',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Zhao & Lin',
                        'cover_subtitle' => 'THE WEDDING CELEBRATION',
                        'countdown_target_date' => '2026-12-18 18:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'gold-glitter',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Zhao Wei',
                            'nickname' => 'Zhao',
                            'father_name' => 'Richard Zhao',
                            'mother_name' => 'Meilan Wang',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Putra berbakti yang melangkah maju dalam komitmen suci perkawinan.',
                            'instagram' => 'zhao_wei',
                            'child_order' => '1',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Lin Xiaoting',
                            'nickname' => 'Lin',
                            'father_name' => 'Albert Lin',
                            'mother_name' => 'Fiona Chen',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Putri santun yang bersiap mengarungi bahtera keluarga baru yang harmonis.',
                            'instagram' => 'lin_xiaoting',
                            'child_order' => 'tunggal',
                        ]
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Pertemuan Pertama (相遇)',
                            'story_date' => '2023-05-12',
                            'description' => 'Takdir mempertemukan kami di sebuah perayaan lentera musim semi, mengawali percakapan hangat yang menumbuhkan rasa kagum satu sama lain.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Komitmen Bersama (訂婚)',
                            'story_date' => '2025-08-08',
                            'description' => 'Di hadapan kedua keluarga besar, kami melangsungkan prosesi tunangan pertukaran hantaran (Sangjit) sebagai simbol keseriusan melangkah ke jenjang pernikahan.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'utama',
                            'event_name' => 'Prosesi Tea Pai (敬茶)',
                            'event_date' => '2026-12-18',
                            'start_time' => '10:00',
                            'end_time' => '12:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Golden Palace Imperial Hall',
                            'venue_address' => 'Jl. Sudirman No. 88, Jakarta Pusat',
                            'gmaps_link' => 'https://maps.google.com',
                            'is_primary' => true,
                            'sort_order' => 0,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi Pernikahan (喜宴)',
                            'event_date' => '2026-12-18',
                            'start_time' => '18:00',
                            'end_time' => '21:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Golden Palace Grand Ballroom',
                            'venue_address' => 'Jl. Sudirman No. 88, Jakarta Pusat',
                            'gmaps_link' => 'https://maps.google.com',
                            'is_primary' => false,
                            'sort_order' => 1,
                        ],
                    ],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_number' => '8880192839',
                            'account_name' => 'Richard Zhao',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Mandiri',
                            'account_number' => '1230009876543',
                            'account_name' => 'Albert Lin',
                            'sort_order' => 1,
                        ],
                    ],
                ]
            ]
        );

        // Sections configuration using proper table schema
        $sections = [
            ['key' => 'cover', 'name' => 'Cover', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Opening', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Mempelai / Profil', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Save The Date', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Perjalanan Kisah', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Acara', 'order' => 6, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Galeri', 'order' => 7, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP', 'order' => 8, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Ucapan', 'order' => 9, 'removable' => true],
            ['key' => 'bank', 'name' => 'Kado Digital / Amplop', 'order' => 10, 'removable' => true],
            ['key' => 'closing', 'name' => 'Penutup', 'order' => 11, 'removable' => false],
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
