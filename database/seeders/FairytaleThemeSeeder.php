<?php
 
namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class FairytaleThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'fairytale'],
            [
                'name' => 'Fairytale',
                'thumbnail' => '/themes/fairytale/thumbnail.png',
                'preview_url' => '/themes/fairytale/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#6c527b',
                    'secondary' => '#8b7156',
                    'bg' => '#ebdffa',
                    'text' => '#4a3e4d',
                    'accent' => '#c07a97',
                ],
                'font_config' => [
                    'heading' => 'Cinzel',
                    'body' => 'Lora',
                    'script' => 'Monsieur La Doulaise',
                ],
                'css_file' => 'fairytale/style.css',
                'supports_scroll' => false,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 30,
                // Default data for the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Welcome to our Day',
                        'opening_text' => "Dengan memohon rahmat Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan perayaan pernikahan kami di bawah naungan kasih-Nya.\n\nKehadiran dan doa restu Bapak/Ibu/Saudara/i sangat berharga bagi lembaran baru kehidupan kami.",
                        'opening_ayat' => 'Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.',
                        'opening_ayat_translation' => 'Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.',
                        'opening_ayat_source' => 'Kolose 3:14',
                        'closing_title' => 'THANK YOU',
                        'closing_text' => 'Merupakan kebahagiaan yang tak ternilai bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari istimewa kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'kristen',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Alice & David',
                        'cover_subtitle' => 'We invite you to celebrate our fairytale wedding day.',
                        'countdown_target_date' => '2026-12-25 08:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'butterfly',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'David Christian',
                            'nickname' => 'David',
                            'father_name' => 'Bapak Johnson',
                            'mother_name' => 'Ibu Maria',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Putra pertama yang siap mengarungi petualangan hidup baru.',
                            'instagram' => 'david_c',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Alice Margaretha',
                            'nickname' => 'Alice',
                            'father_name' => 'Bapak Robert',
                            'mother_name' => 'Ibu Helena',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Putri kedua yang siap mendampingi dengan ketulusan dan cinta.',
                            'instagram' => 'alice_m',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Pertemuan Pertama',
                            'story_date' => '2023-05-12',
                            'description' => 'Kami pertama kali dipertemukan secara tidak sengaja di sebuah perpustakaan kota yang hangat. Obrolan singkat mengenai buku favorit menjadi awal mula dari kisah kami.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Mengikat Janji',
                            'story_date' => '2024-10-10',
                            'description' => 'Setelah melewati berbagai perjalanan indah bersama, kami sepakat untuk melangkah ke pelaminan, mengikrarkan janji suci pernikahan di hadapan keluarga dan sahabat.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'pemberkatan',
                            'event_name' => 'Pemberkatan Nikah',
                            'event_date' => '2026-12-25',
                            'start_time' => '09:00',
                            'end_time' => '11:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gereja Katedral Santo Petrus',
                            'venue_address' => 'Jl. Katedral No. 1, Jakarta Pusat',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi Pernikahan',
                            'event_date' => '2026-12-25',
                            'start_time' => '12:00',
                            'end_time' => '15:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Grand Ballroom Fairytale Hotel',
                            'venue_address' => 'Jl. Sudirman Kav 21, Jakarta Selatan',
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
                            'account_name' => 'Alice Margaretha',
                            'account_number' => '9876543210',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'David Christian',
                            'account_number' => '0123456789',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Tamu Kehormatan', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Tamu Kehormatan', 'message' => 'Selamat menempuh hidup baru David & Alice! Semoga cinta kasih selalu menyertai pernikahan kalian.'],
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
