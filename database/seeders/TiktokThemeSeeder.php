<?php
 
namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class TiktokThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'tiktok'],
            [
                'name' => 'ViteTok FYP',
                'thumbnail' => '/themes/tiktok/thumbnail.png',
                'preview_url' => '/themes/tiktok/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#FE2C55',    // TikTok Red/Pink
                    'secondary' => '#25F4EE',  // TikTok Cyan
                    'bg' => '#010101',         // TikTok Pitch Black
                    'text' => '#FFFFFF',       // TikTok White
                    'accent' => '#161823',     // TikTok Dark Surface
                ],
                'font_config' => [
                    'heading' => 'Plus Jakarta Sans',
                    'body' => 'Plus Jakarta Sans',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'tiktok/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 18,
                // Default data for previewing the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Assalamu\'alaikum Wr. Wb.',
                        'opening_text' => "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk merayakan hari bahagia pernikahan kami.",
                        'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_source' => 'Ar-Rum: 21',
                        'closing_title' => 'Terima Kasih',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu di hari bahagia kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Bimo & Raras',
                        'cover_subtitle' => '#BimoRarasWedding #PernikahanViral',
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
                            'bio' => 'featured artist - groom',
                            'instagram' => 'bimo.wicaksono',
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
                            'bio' => 'featured artist - bride',
                            'instagram' => 'raras.sekar',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'First Sight: FYP Pertemuan',
                            'story_date' => '2023-11-20',
                            'description' => 'Diperkenalkan oleh sahabat dekat di salah satu gigs musik di Yogyakarta. Percakapan santai tentang lagu favorit menjadi awal harmoni baru bagi kami berdua.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Duet: Komitmen Bersama',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah melewati berbagai melodi kehidupan bersama, kami sepakat untuk menulis lirik masa depan bersama dalam ikatan janji suci pernikahan.',
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
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Bimo Wicaksono',
                            'account_number' => '1370012345678',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank BCA',
                            'account_name' => 'Raras Sekar Ayu',
                            'account_number' => '8020123456',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Ahmad Saputra', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Ahmad Saputra', 'message' => 'Selamat berbahagia Bimo & Raras! Semoga menjadi lagu terindah dalam hidup kalian, sakinah mawaddah wa rahmah selamanya!'],
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
