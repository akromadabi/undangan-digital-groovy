<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class RetroVinylThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'retro-vinyl'],
            [
                'name' => 'Retro Vinyl & Cassette',
                'thumbnail' => '/themes/retro-vinyl/thumbnail.png',
                'preview_url' => '/themes/retro-vinyl/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#d95d39',  // Terracotta Orange
                    'secondary' => '#f1a153',// Warm Yellow
                    'bg' => '#f4ebe1',       // Vintage Cream
                    'text' => '#2e2528',     // Charcoal
                    'accent' => '#0e3b43',   // Petrol Teal
                ],
                'font_config' => [
                    'heading' => 'Fraunces',
                    'body' => 'Plus Jakarta Sans',
                    'script' => 'Caveat',
                ],
                'css_file' => 'retro-vinyl/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 18,
                // Default data for previewing the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Now Playing: Side A - The Wedding',
                        'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk turut hadir dan memberikan doa restu di hari bahagia pernikahan kami.",
                        'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_source' => 'Ar-Rum: 21',
                        'closing_title' => 'Outro: Forever in Harmony',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu di hari bahagia kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Fahmi & Intan',
                        'cover_subtitle' => 'The Retro Record Album of Fahmi & Intan',
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
                            'full_name' => 'Fahmi Hidayat',
                            'nickname' => 'Fahmi',
                            'father_name' => 'H. Gandi',
                            'mother_name' => 'Hj. Nurjanah',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Featured Artist - Side A - Groom',
                            'instagram' => 'fahmi_hidayat',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Intan Mutiara',
                            'nickname' => 'Intan',
                            'father_name' => 'H. Gandi',
                            'mother_name' => 'Hj. Nurjanah',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Featured Artist - Side B - Bride',
                            'instagram' => 'intan_mutiara',
                            'child_order' => 'Ketiga',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Track 1: Awal Melodi (Intro)',
                            'story_date' => '2023-11-20',
                            'description' => 'Diperkenalkan oleh sahabat dekat di salah satu gigs musik vintage di Bandung. Obrolan hangat mengenai piringan hitam koleksi klasik menjadi harmoni awal perjalanan kami.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Track 2: Refrain (Komitmen)',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah melewati berbagai melodi kehidupan bersama, kami sepakat untuk merekam lembaran baru dan menyelaraskan langkah dalam komitmen ikatan suci pernikahan.',
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
                            'venue_name' => 'Masjid Agung Al-Ittihad',
                            'venue_address' => 'Jl. Raya Ciputat No. 15, Tangerang Selatan, Banten',
                            'gmaps_link' => 'https://maps.google.com',
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
                            'venue_name' => 'Gedung Serbaguna Harmony',
                            'venue_address' => 'Jl. Raya Ciputat No. 20, Tangerang Selatan, Banten',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Fahmi Hidayat',
                            'account_number' => '1370012345678',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank BCA',
                            'account_name' => 'Intan Mutiara',
                            'account_number' => '8020123456',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Ahmad Saputra', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Ahmad Saputra', 'message' => 'Selamat menempuh hidup baru Fahmi & Intan! Semoga pernikahan ini menjadi alunan nada terindah yang selalu harmoni sepanjang masa.'],
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
