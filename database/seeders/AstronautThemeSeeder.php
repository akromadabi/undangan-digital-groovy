<?php
 
namespace Database\Seeders;
 
use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;
 
class AstronautThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'astronaut'],
            [
                'name' => 'Space Odyssey',
                'thumbnail' => '/themes/astronaut/thumbnail.png',
                'preview_url' => '/themes/astronaut/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#FF7A00',    // Cheerful Solar Orange
                    'secondary' => '#00A3FF',  // Bright Sky Blue / Cyan
                    'bg' => '#F0F4FF',         // Light Cheerful Sky
                    'text' => '#1F2251',       // Deep Space Navy Text
                    'accent' => '#D946EF',     // Vibrant Nebula Pink
                ],
                'font_config' => [
                    'heading' => 'Fredoka',
                    'body' => 'Quicksand',
                    'script' => 'Fredoka',
                ],
                'css_file' => 'astronaut/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => true,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 27,
                'type' => ['wedding', 'birthday', 'graduation', 'aqiqah', 'circumcision', 'anniversary', 'general'],
                'allowed_plans' => null,
                // Default data configured for Children Birthday (Fadli's Space Mission)
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Welcome Space Cadet!',
                        'opening_text' => 'Misi peluncuran pesta ulang tahun si kecil yang berani telah dimulai! Kami mengundang seluruh kru penjelajah bintang untuk berkumpul di pusat komando.',
                        'opening_ayat' => 'Explore the universe of joy, laughter, and starry dreams!',
                        'opening_ayat_translation' => '',
                        'opening_ayat_source' => '',
                        'closing_title' => 'THANK YOU FOR LAUNCHING MEMORIES!',
                        'closing_text' => 'Kehadiran serta doa restu dari para kru penjelajah angkasa adalah bintang terindah di langit kami. Sampai jumpa di galaksi berikutnya!',
                        'turut_mengundang_text' => '',
                        'religion' => 'universal',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => "Fadli's Space Mission",
                        'cover_subtitle' => "Fadli's 5th Galactic Birthday",
                        'countdown_target_date' => '2026-12-15 15:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'none',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Fadli Al-Fatih',
                            'nickname' => 'Fadli',
                            'father_name' => 'Irwan Prasetya',
                            'mother_name' => 'Siti Rahma',
                            'gender' => 'pria',
                            'photo' => '',
                            'birth_date' => '2021-12-15',
                            'bio' => 'Astronot cilik kami yang pemberani, suka memandang bintang, menggambar roket, dan ingin terbang ke bulan! Fadli siap menyambut teman-teman di markas roketnya!',
                            'instagram' => 'fadli.spaceboy',
                            'child_order' => 'Pertama',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'First Launch (Age 0)',
                            'story_date' => '2021-12-15',
                            'description' => 'Komandan kecil Fadli mendarat di bumi, membawa cahaya sehangat matahari bagi keluarga kami.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Crawling Rover (Age 1)',
                            'story_date' => '2022-12-15',
                            'description' => 'Mulai menjelajah ruangan dengan merangkak secepat rover Mars dan melafalkan kata pertamanya!',
                            'sort_order' => 1,
                        ],
                        [
                            'title' => 'Space Cadet Academy (Age 4)',
                            'story_date' => '2025-12-15',
                            'description' => 'Fadli masuk sekolah PAUD/TK. Belajar bersosialisasi, menggambar planet, dan selalu antusias bernyanyi lagu Bintang Kecil.',
                            'sort_order' => 2,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'pesta',
                            'event_name' => 'Galactic Party',
                            'event_date' => '2026-12-15',
                            'start_time' => '15:00',
                            'end_time' => '18:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Space Station Command Center',
                            'venue_address' => 'Jl. Galaksi Ceria Raya No. 45, Kebon Jeruk, Jakarta Barat',
                            'gmaps_link' => 'https://maps.google.com/?q=Space+Station+Command+Center',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                    ],
                    'galleries' => [],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'Bank BCA',
                            'account_name' => 'Irwan Prasetya (Ayah Fadli)',
                            'account_number' => '1234567890',
                            'sort_order' => 0,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Tamu Kehormatan', 'phone' => '081234567890', 'group_name' => 'Teman'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Om Dika', 'message' => 'Selamat ulang tahun Fadli astronot cilik hebat! Semoga panjang umur, sehat selalu, jadi anak yang pintar dan berbakti kepada orang tua! Siap meluncur ke angkasa! 🚀⭐👩‍🚀'],
                    ],
                ],
            ]
        );
 
        $sections = [
            ['key' => 'cover', 'name' => 'Cover Orbit', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Galactic Welcome', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Space Cadet Profile', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Launch Countdown', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Space Milestones', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Space Mission Event', 'order' => 6, 'removable' => true],
            ['key' => 'livestream', 'name' => 'Virtual Stream', 'order' => 7, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Cosmic Gallery', 'order' => 8, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'Crew Attendance (RSVP)', 'order' => 9, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Transmission Wishes', 'order' => 10, 'removable' => true],
            ['key' => 'bank', 'name' => 'Fuel Recharge (Gift)', 'order' => 11, 'removable' => true],
            ['key' => 'closing', 'name' => 'Mission Completed', 'order' => 12, 'removable' => false],
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
 
        // Sync with existing invitations using this theme (if any)
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
