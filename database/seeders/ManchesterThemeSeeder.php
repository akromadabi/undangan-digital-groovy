<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class ManchesterThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'manchester-united'],
            [
                'name' => 'Manchester United Football Theme',
                'thumbnail' => '/themes/manchester-united/thumbnail.jpg',
                'preview_url' => '/themes/manchester-united/preview.jpg',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#DA291C', // Manchester United Red
                    'secondary' => '#0A0A0A', // Black
                    'accent' => '#FBE122', // Yellow/Gold
                    'bg' => '#080808', // Stadium Dark
                    'text' => '#FFFFFF', // White
                ],
                'font_config' => [
                    'heading' => 'Jura',
                    'body' => 'Poppins',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'manchester-united/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 17,
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'THE KICK-OFF',
                        'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menyaksikan Kick-off babak baru kehidupan kami di lapangan suci ikatan pernikahan.",
                        'opening_ayat' => 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
                        'opening_ayat_source' => 'Ar-Rum: 21',
                        'closing_title' => 'FULL-TIME',
                        'closing_text' => 'Merupakan kehormatan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian di hari bahagia (Match Day) kami. Glory Glory Manchester United!',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'MATCH DAY: THE WEDDING',
                        'cover_subtitle' => 'Official invitation to the match of our lifetime',
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
                            'full_name' => 'Fletcher Rashford',
                            'nickname' => 'Fletcher',
                            'father_name' => 'Sir Alex Rashford',
                            'mother_name' => 'Cathy Rashford',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Striker utama di hati sang mempelai wanita.',
                            'instagram' => 'fletcher',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Beckham Ferdinand',
                            'nickname' => 'Beckham',
                            'father_name' => 'Sir David Ferdinand',
                            'mother_name' => 'Victoria Ferdinand',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Gelandang kreatif penyeimbang irama kehidupan rumah tangga.',
                            'instagram' => 'beckham',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'First Half (Pertemuan Pertama)',
                            'story_date' => '2023-11-20',
                            'description' => 'Pertama kali bertemu di stadion Theatre of Dreams Yogyakarta. Pandangan pertama yang berujung gol kemenangan.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Extra Time (Membangun Komitmen)',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah melewati masa perpanjangan waktu obrolan dan komitmen mendalam, kami memutuskan untuk mengakhiri pertandingan persahabatan dan masuk ke liga utama rumah tangga.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'First Half: Akad Nikah',
                            'event_date' => '2026-12-25',
                            'start_time' => '08:00',
                            'end_time' => '10:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Old Trafford Yogyakarta (KUA)',
                            'venue_address' => 'Jl. Stadion No. 17, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com/?q=Stadion',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Second Half: Resepsi Pernikahan',
                            'event_date' => '2026-12-25',
                            'start_time' => '11:00',
                            'end_time' => '14:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Stadion Utama Resepsi',
                            'venue_address' => 'Jl. Stadion No. 17, Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com/?q=Stadion',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'MU FC Bank',
                            'account_name' => 'Fletcher',
                            'account_number' => '1878070820',
                            'sort_order' => 0,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Cantona Scholes', 'phone' => '08123456789', 'group_name' => 'VVIP'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Cantona Scholes', 'message' => 'Glory Glory Fletcher & Beckham! Semoga pernikahan kalian kokoh seperti pertahanan MU era Sir Alex Ferguson!'],
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
            ['key' => 'gallery', 'name' => 'Galeri', 'order' => 7, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP', 'order' => 8, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Ucapan', 'order' => 9, 'removable' => true],
            ['key' => 'bank', 'name' => 'Amplop Digital', 'order' => 10, 'removable' => true],
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
