<?php
 
namespace Database\Seeders;
 
use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;
 
class PolaroidNewspaperThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'polaroid-newspaper'],
            [
                'name' => 'Polaroid Newspaper',
                'thumbnail' => '/themes/polaroid-newspaper/thumbnail.png',
                'preview_url' => '/themes/polaroid-newspaper/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#222222',
                    'secondary' => '#555555',
                    'bg' => '#f4f0ea',
                    'text' => '#111111',
                    'accent' => '#777777',
                ],
                'font_config' => [
                    'heading' => 'Playfair Display',
                    'body' => 'Outfit',
                    'script' => 'Special Elite',
                ],
                'css_file' => 'polaroid-newspaper/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 30,
                // Default data for the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'The Wedding of',
                        'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami di bawah naungan berkah-Nya.",
                        'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_translation' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                        'opening_ayat_source' => 'Ar-Rum: 21',
                        'closing_title' => 'THANK YOU',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir dan memberikan doa restu di hari bahagia kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Intan & Fahmi',
                        'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri acara perayaan kami.',
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
                            'father_name' => 'Bapak Gandi',
                            'mother_name' => 'Ibu Nurjanah',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Putra pertama yang siap membangun bahtera rumah tangga.',
                            'instagram' => 'fahmi_hidayat',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Intan Mutiara',
                            'nickname' => 'Intan',
                            'father_name' => 'Bapak Gandi',
                            'mother_name' => 'Ibu Nurjanah',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => 'Putri ketiga dari Bapak Gandi dan Ibu Nurjanah.',
                            'instagram' => 'intan_mutiara',
                            'child_order' => 'Ketiga',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Awal Bertemu',
                            'story_date' => '2023-11-20',
                            'description' => 'Kami diperkenalkan oleh seorang sahabat di Yogyakarta pada akhir tahun 2023. Sejak pertemuan pertama itu, kami merasa memiliki kecocokan visi hidup yang sama.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Komitmen Bersama',
                            'story_date' => '2024-11-20',
                            'description' => 'Setelah satu tahun menjalin komunikasi yang intens, kami sepakat untuk melangkah ke jenjang yang lebih serius dengan memohon restu kedua orang tua.',
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
                            'venue_name' => 'Gedung Sasono Mulyo',
                            'venue_address' => 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
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
                            'account_name' => 'Intan Mutiara',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'Bank Mandiri',
                            'account_name' => 'Fahmi Hidayat',
                            'account_number' => '0987654321',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Tamu Kehormatan', 'phone' => '081122334455', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Tamu Kehormatan', 'message' => 'Selamat menempuh hidup baru Fahmi & Intan! Semoga sakinah mawaddah wa rahmah selalu.'],
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
