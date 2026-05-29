<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class ChatgptThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'chatgpt'],
            [
                'name' => 'ViteGPT AI',
                'thumbnail' => '/themes/chatgpt/thumbnail.png',
                'preview_url' => '/themes/chatgpt/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#10A37F', // OpenAI Mint Green
                    'secondary' => '#2F2F2F', // Balon Chat Background
                    'bg' => '#212121', // Main Background
                    'text' => '#ECECF1', // ChatGPT Text White
                    'accent' => '#ABAEB0',
                ],
                'font_config' => [
                    'heading' => 'Plus Jakarta Sans',
                    'body' => 'Plus Jakarta Sans',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'chatgpt/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 19,
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
                        'cover_title' => 'randi & mira',
                        'cover_subtitle' => 'Created a love prompt • ChatGPT 4o',
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
                            'full_name' => 'Randi Setiawan',
                            'nickname' => 'Randi',
                            'father_name' => 'Bapak Bambang Setiawan',
                            'mother_name' => 'Ibu Endang Suryani',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'A technology enthusiast who found his absolute match in code and life.',
                            'instagram' => 'randi.setiawan',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Amira Lestari',
                            'nickname' => 'Mira',
                            'father_name' => 'Bapak Joko Lestari',
                            'mother_name' => 'Ibu Wahyuningsih',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'A creative designer who colors life with warmth, love, and laughter.',
                            'instagram' => 'amira.lestari',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Prompt 1: Initial Hook',
                            'story_date' => '2023-05-15',
                            'description' => 'Pertama kali dipertemukan oleh hobi yang sama di sebuah seminar teknologi kreatif di Bandung. Obrolan hangat berjam-jam tentang masa depan menjadi pemicu awal kisah kami.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Prompt 2: System Validation',
                            'story_date' => '2024-05-15',
                            'description' => 'Setelah melewati setahun perjalanan penuh canda dan keselarasan ide, kami sepakat untuk menaikkan tingkat komitmen kami ke jenjang yang lebih serius dan kekal.',
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
                            'venue_name' => 'Masjid Raya Al-Jabbar',
                            'venue_address' => 'Jl. Cimincrang No. 14, Gedebage, Bandung',
                            'gmaps_link' => 'https://maps.google.com/?q=Masjid+Raya+Al+Jabbar',
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
                            'venue_name' => 'Gedung Bale Rame Sabilulungan',
                            'venue_address' => 'Jl. Al-Fathu, Soreang, Bandung',
                            'gmaps_link' => 'https://maps.google.com/?q=Gedung+Bale+Rame+Sabilulungan',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'Bank BCA',
                            'account_name' => 'Randi Setiawan',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Amira Lestari',
                            'account_number' => '0987654321',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Mazen Al-Ghani', 'phone' => '08123456789', 'group_name' => 'Rekan'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Mazen Al-Ghani', 'message' => 'Selamat menempuh babak baru Randi & Mira! Semoga hidup kalian selalu dipenuhi dengan kebahagiaan dan barokah.'],
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
