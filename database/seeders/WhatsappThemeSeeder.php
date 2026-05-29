<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class WhatsappThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'whatsapp'],
            [
                'name' => 'WhatsApp Wedding',
                'thumbnail' => '/themes/whatsapp/thumbnail.webp',
                'preview_url' => '/themes/whatsapp/preview.webp',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#075E54', // Green WA
                    'secondary' => '#128C7E', // Secondary Green
                    'bg' => '#E5DDD5', // Chat background beige
                    'text' => '#111B21', // Dark text
                    'accent' => '#DCF8C6', // Light green bubble
                ],
                'font_config' => [
                    'heading' => 'Plus Jakarta Sans',
                    'body' => 'Plus Jakarta Sans',
                    'script' => 'Playfair Display',
                ],
                'css_file' => 'whatsapp/style.css',
                'supports_scroll' => true,
                'supports_slide' => false,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 22,
                // Default data for previewing the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Assalamu\'alaikum Wr. Wb.',
                        'opening_text' => 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
                        'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
                        'opening_ayat_source' => 'Ar-Rum: 21',
                        'closing_title' => 'TERIMA KASIH',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia pernikahan kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Bimo & Raras',
                        'cover_subtitle' => 'Kamu memiliki pesan belum dibaca 💬',
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
                            'father_name' => 'Bapak Joko Wicaksono',
                            'mother_name' => 'Ibu Endang Sri Lestari',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Ready to embark on this beautiful lifelong message trail.',
                            'instagram' => 'bimo',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Raras Sekar Ayu',
                            'nickname' => 'Raras',
                            'father_name' => 'Bapak Bambang Sunarto',
                            'mother_name' => 'Ibu Wahyu Ningsih',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Answering "Yes" to the best invitation ever received.',
                            'instagram' => 'raras',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Chat Pertama 💬',
                            'story_date' => '2023-11-20',
                            'description' => 'Berawal dari pesan singkat salah kirim yang berujung obrolan panjang setiap hari. Siapa sangka dari notifikasi berlanjut ke pelaminan.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Status Berubah 💍',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah melewati beribu-ribu chat dan telepon malam, kami sepakat untuk menulis babak baru bersama di kehidupan nyata.',
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
                            'venue_name' => 'Masjid Raya Al-Akbar',
                            'venue_address' => 'Jl. Masjid Agung Timur No. 1, Surabaya',
                            'gmaps_link' => 'https://maps.google.com/?q=Masjid+Raya+Al-Akbar+Surabaya',
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
                            'venue_name' => 'Gedung Juang',
                            'venue_address' => 'Jl. Pemuda No. 10, Surabaya',
                            'gmaps_link' => 'https://maps.google.com/?q=Gedung+Juang+Surabaya',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'Bimo Wicaksono',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Mandiri',
                            'account_name' => 'Raras Sekar Ayu',
                            'account_number' => '0987654321',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Tamu Kehormatan', 'phone' => '08123456789', 'group_name' => 'Rekan'],
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
