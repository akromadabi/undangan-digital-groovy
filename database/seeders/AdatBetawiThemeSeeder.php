<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class AdatBetawiThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'adat-betawi'],
            [
                'name' => 'Adat Betawi',
                'thumbnail' => '/themes/adat-betawi/thumbnail.webp',
                'preview_url' => '/themes/adat-betawi/preview.webp',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#1E8449', // Royal Betawi Green
                    'secondary' => '#F1C40F', // Betawi Yellow Gold
                    'bg' => '#FCFBF9', // Linen Cream
                    'text' => '#151515', // Dark Charcoal
                    'accent' => '#E74C3C', // Festive Red
                ],
                'font_config' => [
                    'heading' => 'Cinzel',
                    'body' => 'Montserrat',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'adat-betawi/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 25,
                // Default data for the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => "Assalamu'alaikum",
                        'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nMenjunjung tinggi tali silaturahim serta adat resam Betawi yang elok, kami bermaksud menyelenggarakan Akad Nikah serta Resepsi Pernikahan putra-putri kami.\n\nMerupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i sekalian berkenan hadir memberikan doa restu.",
                        'opening_ayat' => 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
                        'opening_ayat_source' => 'QS. Ar-Rum: 21',
                        'closing_title' => 'TERIMA KASIH',
                        'closing_text' => "Terima kasih banyak atas perhatian dan untaian doa restu Bapak/Ibu/Saudara/i sekalian.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Rian & Maimunah',
                        'cover_subtitle' => 'Undangan Pernikahan Adat Betawi',
                        'countdown_target_date' => '2026-11-15 08:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'gold-dust',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Rian Hidayat, S.Kom.',
                            'nickname' => 'Rian',
                            'father_name' => 'H. Hidayat',
                            'mother_name' => 'Hj. Aminah',
                            'gender' => 'pria',
                            'photo' => '/themes/adat-betawi/demo/groom.jpg',
                            'bio' => 'Putra pertama yang siap membina biduk rumah tangga penuh berkah.',
                            'instagram' => 'rian.hidayat',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Maimunah, S.E.',
                            'nickname' => 'Maimunah',
                            'father_name' => 'H. Mansur',
                            'mother_name' => 'Hj. Fatimah',
                            'gender' => 'wanita',
                            'photo' => '/themes/adat-betawi/demo/bride.jpg',
                            'bio' => 'Putri kedua yang siap melangkah mendampingi suami tercinta.',
                            'instagram' => 'maimunah.mn',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Tepang (Pertemuan)',
                            'story_date' => '2024-03-10',
                            'description' => 'Awal mula kisah kami terjalin ketika dipertemukan dalam festival kebudayaan Betawi di Setu Babakan Jakarta Selatan. Sejak itu, kami merasa memiliki kesamaan visi hidup.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Lamaran (Serah-serahan)',
                            'story_date' => '2025-05-15',
                            'description' => 'Setelah memantapkan niat suci, perwakilan keluarga besar kami bersilaturahim dalam acara lamaran adat Betawi (serah-serahan) untuk menyepakati hari bahagia.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Akad Nikah',
                            'event_date' => '2026-11-15',
                            'start_time' => '08:00',
                            'end_time' => '10:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Masjid Ramlie Musofa',
                            'venue_address' => 'Jl. Danau Sunter Selatan No.1, Sunter Agung, Jakarta Utara',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 0,
                            'is_primary' => true,
                            'show_dress_code' => true,
                            'dress_code_text' => 'Pakaian Formal / Kebaya / Jas',
                            'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#1E8449', '#F1C40F', '#FCFBF9']]],
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi Pernikahan',
                            'event_date' => '2026-11-15',
                            'start_time' => '11:00',
                            'end_time' => '14:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Balai Samudera',
                            'venue_address' => 'Jl. Boulevard Bar. Raya No.1, Kelapa Gading, Jakarta Utara',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 1,
                            'is_primary' => false,
                            'show_dress_code' => true,
                            'dress_code_text' => 'Batik / Pakaian Pesta Betawi / Jas',
                            'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#1E8449', '#F1C40F', '#FCFBF9']]],
                        ],
                    ],
                    'galleries' => [
                        ['image_url' => '/images/demo/korea-7-768x512.jpg', 'caption' => '', 'sort_order' => 0],
                        ['image_url' => '/images/demo/korea-11-768x512.jpg', 'caption' => '', 'sort_order' => 1],
                    ],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'Rian Hidayat',
                            'account_number' => '1122334455',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Mandiri',
                            'account_name' => 'Maimunah',
                            'account_number' => '5544332211',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Bang Jampang', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                        ['name' => 'Mpok Minah', 'phone' => '082233445566', 'group_name' => 'Teman'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Bang Jampang', 'message' => 'Selamat menempuh hidup baru Rian & Maimunah! Semoga sakinah, mawaddah, warahmah.'],
                        ['sender_name' => 'Mpok Minah', 'message' => 'Selamat ya mpok! Semoga rumah tangganya selalu dilimpahi keberkahan.'],
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
