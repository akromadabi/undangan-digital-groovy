<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class ArunaThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'aruna'],
            [
                'name' => 'Aruna',
                'thumbnail' => '/themes/aruna/thumbnail.png',
                'preview_url' => '/themes/aruna/preview.png',
                'category' => 'Premium',
                'color_scheme' => [
                    'primary' => '#c5a880',
                    'secondary' => '#847d4a',
                    'bg' => '#0c0c0c',
                    'text' => '#ffffff',
                    'accent' => '#cdbb83',
                ],
                'font_config' => [
                    'heading' => 'Playfair Display',
                    'body' => 'Poppins',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'aruna/style.css',
                'supports_scroll' => true,
                'supports_slide' => false,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 11,
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'The Wedding Of',
                        'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
                        'opening_ayat' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                        'opening_ayat_translation' => 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
                        'opening_ayat_source' => 'Adz-Dzariyat: 49',
                        'closing_title' => 'THANK YOU',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'islam',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Ila & Fachrul',
                        'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.',
                        'countdown_target_date' => '2026-12-20 08:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'gold-dust',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Aruna Adhita',
                            'nickname' => 'Ila',
                            'father_name' => 'Bapak Nama_Bapak',
                            'mother_name' => 'Ibu Nama_Ibu',
                            'gender' => 'wanita',
                            'photo' => '',
                            'bio' => '',
                            'instagram' => 'USERNAME',
                            'child_order' => 'Kedua',
                        ],
                        [
                            'order_number' => 2,
                            'full_name' => 'Fachrul Rozi',
                            'nickname' => 'Fachrul',
                            'father_name' => 'Bapak Nama_Bapak',
                            'mother_name' => 'Ibu Nama_Ibu',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => '',
                            'instagram' => 'USERNAME',
                            'child_order' => 'Kedua',
                        ],
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Chapter One: Awal Bertemu',
                            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Chapter Two: Menjalin Hubungan',
                            'description' => 'Facilisis sed odio morbi quis commodo odio. Condimentum mattis pellentesque id nibh tortor id aliquet. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula.',
                            'sort_order' => 1,
                        ],
                        [
                            'title' => 'Chapter Three: Bertunangan',
                            'description' => 'Magna fermentum iaculis eu non. Pretium lectus quam id leo. Arcu vitae elementum curabitur vitae nunc sed.',
                            'sort_order' => 2,
                        ],
                        [
                            'title' => 'Chapter Four: Hari Pernikahan',
                            'description' => 'Augue lacus viverra vitae congue eu consequat. Eget nunc scelerisque viverra mauris in aliquam sem fringilla.',
                            'sort_order' => 3,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'akad',
                            'event_name' => 'Akad Nikah',
                            'event_date' => '2026-12-20',
                            'start_time' => '08:00',
                            'end_time' => '10:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Vue Palace Hotel',
                            'venue_address' => 'Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung',
                            'gmaps_link' => 'https://maps.app.goo.gl/',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ],
                        [
                            'event_type' => 'resepsi',
                            'event_name' => 'Resepsi',
                            'event_date' => '2026-12-20',
                            'start_time' => '11:00',
                            'end_time' => '13:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Vue Palace Hotel',
                            'venue_address' => 'Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung',
                            'gmaps_link' => 'https://maps.app.goo.gl/',
                            'sort_order' => 1,
                            'is_primary' => false,
                        ],
                    ],
                    'galleries' => [
                        ['image_url' => 'https://picsum.photos/seed/aruna1/800/1200', 'caption' => '', 'sort_order' => 0],
                        ['image_url' => 'https://picsum.photos/seed/aruna2/800/800', 'caption' => '', 'sort_order' => 1],
                        ['image_url' => 'https://picsum.photos/seed/aruna3/800/800', 'caption' => '', 'sort_order' => 2],
                    ],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'Nama Penerima',
                            'account_number' => '0123456789',
                            'sort_order' => 0,
                        ],
                        [
                            'bank_name' => 'GOPAY',
                            'account_name' => 'Nama Penerima',
                            'account_number' => '0123456789',
                            'sort_order' => 1,
                        ],
                    ],
                    'guests' => [
                        ['name' => 'Ahmad Fadhil', 'phone' => '081111111111', 'group_name' => 'Keluarga'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Ahmad Fadhil', 'message' => 'Selamat menempuh hidup baru Ila & Fachrul! Semoga sakinah mawaddah wa rahmah. ✨'],
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
