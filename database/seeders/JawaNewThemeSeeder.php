<?php
 
namespace Database\Seeders;
 
use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;
 
class JawaNewThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'jawa-new'],
            [
                'name' => 'Jawa New',
                'thumbnail' => '/themes/jawa-new/asset/the-weding-1024x788.png',
                'preview_url' => '/themes/jawa-new/asset/the-weding-1024x788.png',
                'category' => 'premium',
                'color_scheme' => [
                    'primary' => '#C5A85C',
                    'secondary' => '#4E3629',
                    'bg' => '#1A0F0A',
                    'text' => '#F7F2E8',
                    'accent' => '#C5A85C',
                ],
                'font_config' => [
                    'heading' => 'Cinzel Decorative',
                    'body' => 'Poppins',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'jawa-new/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 14,
                
                // Default data seeded automatically when choosing the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'The Wedding Of',
                        'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan adat Jawa kami.",
                        'opening_ayat' => 'Dan di antara ayat-ayat-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu merasa nyaman kepadanya, dan dijadikan-Nya di antaramu mawadah dan rahmah. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
                        'opening_ayat_translation' => 'Dan di antara ayat-ayat-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu merasa nyaman kepadanya, dan dijadikan-Nya di antaramu mawadah dan rahmah. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
                        'opening_ayat_source' => 'Ar-Rum: 21',
                        'closing_title' => 'Wassalamu\'alaikum Warahmatullahi Wabarakatuh',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa dan restu kepada kedua mempelai.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '',
                        'music_autoplay' => true,
                        'cover_title' => 'Rian & Sekar',
                        'cover_subtitle' => 'Minggu, 18 Oktober 2026',
                        'countdown_target_date' => '2026-10-18 09:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'gold-dust',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
 
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Sekar Ayu Kinasih, S.Pd',
                            'nickname' => 'Sekar',
                            'father_name' => 'KRT. H. Hadiningrat',
                            'mother_name' => 'Hj. Roro Sulastri',
                            'gender' => 'wanita',
                            'photo' => '/themes/jawa-new/asset/01-10.png',
                            'bio' => 'Putri pertama yang tulus, berbakti, dan penuh kasih sayang.',
                            'instagram' => 'sekarayu_kinasih',
                            'child_order' => 'Pertama',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Rian Wijaya, S.T',
                            'nickname' => 'Rian',
                            'father_name' => 'Bambang Widjanarko',
                            'mother_name' => 'Dewi Puspitasari',
                            'gender' => 'pria',
                            'photo' => '/themes/jawa-new/asset/02-10.png',
                            'bio' => 'Putra bungsu yang mandiri, tangguh, dan bertanggung jawab.',
                            'instagram' => 'rian_wijaya',
                            'child_order' => 'Bungsu',
                        ],
                    ],
 
                    'love_stories' => [
                        [
                            'title' => 'Pertemuan Pertama',
                            'description' => 'Pertemuan pertama kami berawal dari ketidaksengajaan di Yogyakarta, di mana keselarasan pandangan dan visi hidup menuntun kami untuk melangkah bersama.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Lamaran (Khitbah)',
                            'description' => 'Setelah masa perkenalan yang sarat restu kedua belah pihak keluarga, komitmen suci diikat melalui prosesi khitbah lamaran adat Jawa yang khidmat.',
                            'sort_order' => 1,
                        ],
                        [
                            'title' => 'Menuju Pelaminan',
                            'description' => 'Hari bahagia yang dinanti, awal langkah kami membangun bahtera rumah tangga sakinah, mawaddah, warahmah dalam lindungan-Nya.',
                            'sort_order' => 2,
                        ],
                    ],
 
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Akad Nikah',
                            'event_date' => '2026-10-18',
                            'start_time' => '09:00',
                            'end_time' => '11:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gedung Ndalem Wironegaran',
                            'venue_address' => 'Jl. Mayjend Sutoyo No. 9, Mantrijeron, Kota Yogyakarta, D.I. Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com/',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi Pernikahan',
                            'event_date' => '2026-10-18',
                            'start_time' => '12:00',
                            'end_time' => '15:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Gedung Ndalem Wironegaran',
                            'venue_address' => 'Jl. Mayjend Sutoyo No. 9, Mantrijeron, Kota Yogyakarta, D.I. Yogyakarta',
                            'gmaps_link' => 'https://maps.google.com/',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
 
                    'galleries' => [
                        ['image_url' => '/themes/jawa-new/asset/01-10.png', 'caption' => 'Sekar Ayu Kinasih', 'sort_order' => 0],
                        ['image_url' => '/themes/jawa-new/asset/02-10.png', 'caption' => 'Rian Wijaya', 'sort_order' => 1],
                        ['image_url' => '/themes/jawa-new/asset/the-weding-1024x788.png', 'caption' => 'Bahagia Bersama', 'sort_order' => 2],
                    ],
 
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'Sekar Ayu Kinasih',
                            'account_number' => '8460123456',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'BNI',
                            'account_name' => 'Rian Wijaya',
                            'account_number' => '0987654321',
                            'sort_order' => 1,
                        ],
                    ],
 
                    'guests' => [
                        ['name' => 'Ahmad Fadhil', 'phone' => '081111111111', 'group_name' => 'Keluarga'],
                        ['name' => 'Siti Aisyah', 'phone' => '081222222222', 'group_name' => 'Keluarga'],
                    ],
 
                    'wishes' => [
                        ['sender_name' => 'Ahmad Fadhil', 'message' => 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fi khoir. Selamat menempuh hidup baru Rian & Sekar!'],
                        ['sender_name' => 'Siti Aisyah', 'message' => 'Selamat atas pernikahannya! Desain Jawa New ini luar biasa cantik, sangat kental nuansa kraton Yogyakarta modern.'],
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
 
        // Update existing invitations using this theme if any
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
