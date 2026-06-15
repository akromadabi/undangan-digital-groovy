<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class AdatBatakThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'adat-batak'],
            [
                'name' => 'Adat Batak',
                'thumbnail' => '/themes/adat-batak/thumbnail.webp',
                'preview_url' => '/themes/adat-batak/preview.webp',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#8F1E1E', // Deep Crimson Red
                    'secondary' => '#D4AF37', // Rich Batak Gold
                    'bg' => '#FCFBF9', // Clean Linen / Ivory
                    'text' => '#151515', // Velvet Charcoal
                    'accent' => '#B91C1C', // Bright Crimson Accent
                ],
                'font_config' => [
                    'heading' => 'Cinzel',
                    'body' => 'Montserrat',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'adat-batak/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 22,
                // Default data for the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Horas',
                        'opening_text' => "Horas Talu, Horas Nabolon!\n\nMenjunjung tinggi tali pergaulan, adat, dan rasa hormat yang mendalam, kami bermaksud menyelenggarakan Ibadah Pemberkatan Pernikahan (Pamasu-masuan) serta Upacara Adat Pernikahan (Ulaon Unjuk) putra-putri kami.",
                        'opening_ayat' => 'Maka sekarang, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.',
                        'opening_ayat_translation' => 'Maka sekarang, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.',
                        'opening_ayat_source' => 'Matius 19:6',
                        'closing_title' => 'MAULIATE',
                        'closing_text' => "Mauliate godang (Terima kasih banyak) atas kehadiran serta untaian doa restu Bapak/Ibu/Saudara/i sekalian.\n\nHoras! Horas! Horas!",
                        'turut_mengundang_text' => '',
                        'religion' => 'kristen',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Togu & Santi',
                        'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri Pemberkatan Pernikahan & Ulaon Unjuk kami.',
                        'countdown_target_date' => '2026-10-24 09:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'gold-dust',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Togu Johannes Hutapea, S.T.',
                            'nickname' => 'Togu',
                            'father_name' => 'Baringin Hutapea',
                            'mother_name' => 'Pinta Simanjuntak',
                            'gender' => 'pria',
                            'photo' => '/themes/adat-batak/demo/groom.jpg',
                            'bio' => '',
                            'instagram' => 'USERNAME',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Santi Romauli Boru Situmorang, S.E.',
                            'nickname' => 'Santi',
                            'father_name' => 'St. Mangatur Situmorang',
                            'mother_name' => 'Rosanna Sinaga',
                            'gender' => 'wanita',
                            'photo' => '/themes/adat-batak/demo/bride.jpg',
                            'bio' => '',
                            'instagram' => 'USERNAME',
                            'child_order' => 'Bungsu',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Parjumpahan (Pertemuan)',
                            'story_date' => '2023-05-12',
                            'description' => 'Awal mula kisah kami terjalin ketika dipertemukan dalam ibadah pemuda gereja di Jakarta. Komunikasi kami berlanjut hingga menemukan visi pelayanan yang sejalan.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Marhusip (Persetujuan Pernikahan)',
                            'story_date' => '2025-06-15',
                            'description' => 'Setelah dua tahun memantapkan langkah, perwakilan keluarga kami berkumpul melakukan musyawarah adat Marhusip untuk menyepakati tanggal dan bentuk pesta adat.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Ibadah Pemberkatan (Pamasu-masuan)',
                            'event_date' => '2026-10-24',
                            'start_time' => '09:00',
                            'end_time' => '11:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gereja HKBP Sudirman Jakarta',
                            'venue_address' => 'Jl. Jend. Sudirman No. 10, Karet Tengsin, Jakarta Pusat',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Adat Pernikahan & Resepsi (Ulaon Unjuk)',
                            'event_date' => '2026-10-24',
                            'start_time' => '12:00',
                            'end_time' => '17:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gedung Pertemuan Mulia Raja',
                            'venue_address' => 'Jl. Kebon Nanas No. 2, Cipinang, Jakarta Timur',
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
                            'account_name' => 'Togu Johannes Hutapea',
                            'account_number' => '7894561230',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Mandiri',
                            'account_name' => 'Santi Romauli Situmorang',
                            'account_number' => '1357924680',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Amang Raja Simanjuntak', 'phone' => '08123456789', 'group_name' => 'Keluarga'],
                        ['name' => 'Inang Siregar', 'phone' => '08987654321', 'group_name' => 'Teman'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Amang Raja Simanjuntak', 'message' => 'Selamat Pamasu-masuan Togu & Santi! Semoga menjadi keluarga yang takut akan Tuhan, diberkati bagai pohon di tepi aliran air.'],
                        ['sender_name' => 'Inang Siregar', 'message' => 'Horas! Selamat berbahagia dan langgeng melayani bersama sampai selamanya.'],
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
