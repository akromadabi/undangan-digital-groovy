<?php
 
namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class SageMinimalistThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'sage-minimalist'],
            [
                'name' => 'Sage Minimalist',
                'thumbnail' => '/themes/sage-minimalist/thumbnail.png',
                'preview_url' => '/themes/sage-minimalist/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#a3b899',
                    'secondary' => '#3d3730',
                    'bg' => '#f5efe6',
                    'text' => '#3d3730',
                    'accent' => '#c9b097',
                ],
                'font_config' => [
                    'heading' => 'Playfair Display',
                    'body' => 'Nunito',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'sage-minimalist/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 35,
                // Default data for the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'The Wedding of',
                        'opening_text' => "Assalamu'alaiikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami di bawah naungan berkah-Nya.\n\nKami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu di hari bahagia kami.",
                        'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
                        'opening_ayat_source' => 'QS. Ar-Rum Ayat 21',
                        'closing_title' => 'Thank You',
                        'closing_text' => 'Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih. Semoga Allah SWT membalas kebaikan kalian.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Anis & Fadli',
                        'cover_subtitle' => 'The Wedding of',
                        'countdown_target_date' => '2026-06-15 08:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'flower-falling',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Fadli Rahman',
                            'nickname' => 'Fadli',
                            'father_name' => 'H. Rahman',
                            'mother_name' => 'Hj. Aminah',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Putra kedua yang siap mengarungi petualangan hidup baru.',
                            'instagram' => 'fadli_rahman',
                            'child_order' => 'Kedua',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Anis Hidayanti',
                            'nickname' => 'Anis',
                            'father_name' => 'H. Hidayat',
                            'mother_name' => 'Hj. Fatimah',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Putri pertama yang siap mendampingi dengan ketulusan dan cinta.',
                            'instagram' => 'anis_hidayanti',
                            'child_order' => 'Pertama',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Pertemuan Pertama',
                            'story_date' => '2024-05-12',
                            'description' => 'Kami pertama kali dipertemukan dalam sebuah acara keluarga. Obrolan hangat mengenai visi hidup menjadi awal mula perjalanan kisah cinta kami.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Mengikat Janji',
                            'story_date' => '2025-10-10',
                            'description' => 'Setelah melewati berbagai perjalanan indah bersama, kami sepakat untuk melangkah ke pelaminan, mengikrarkan janji suci pernikahan di hadapan keluarga dan sahabat.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Akad Nikah',
                            'event_date' => '2026-06-15',
                            'start_time' => '08:00',
                            'end_time' => '10:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Masjid Raya Al-Muhajirin',
                            'venue_address' => 'Jl. Kebon Sirih No. 1, Jakarta Pusat',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi Pernikahan',
                            'event_date' => '2026-06-15',
                            'start_time' => '11:00',
                            'end_time' => '14:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gedung Serbaguna Harmoni',
                            'venue_address' => 'Jl. Kebon Sirih No. 5, Jakarta Pusat',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [
                        ['image_url' => 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', 'caption' => '', 'sort_order' => 0],
                        ['image_url' => 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop', 'caption' => '', 'sort_order' => 1],
                    ],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'Anis Hidayanti',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Fadli Rahman',
                            'account_number' => '0987654321',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Tamu Kehormatan', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Tamu Kehormatan', 'message' => 'Selamat menempuh hidup baru Fadli & Anis! Semoga cinta kasih selalu menyertai pernikahan kalian.'],
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
            ['key' => 'bank', 'name' => 'Kado Digital', 'order' => 11, 'removable' => true],
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
