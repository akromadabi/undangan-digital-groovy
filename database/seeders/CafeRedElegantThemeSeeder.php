<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;

class CafeRedElegantThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'cafe-red-elegant'],
            [
                'name' => 'Cafe Red Elegant',
                'thumbnail' => '/themes/cafe-red-elegant/thumbnail.png',
                'preview_url' => '/themes/cafe-red-elegant/preview.png',
                'category' => 'Premium',
                'type' => ['birthday', 'general', 'wedding', 'anniversary'],
                'color_scheme' => [
                    'primary' => '#800020', // Burgundy
                    'secondary' => '#1f1a1b', // Matte dark charcoal/burgundy
                    'bg' => '#fbf7f4', // Off-white/cream
                    'text' => '#2b1c1e', // Elegant dark red-black
                    'accent' => '#d4af37', // Gold
                ],
                'font_config' => [
                    'heading' => 'Cinzel',
                    'body' => 'Montserrat',
                    'script' => 'Alex Brush',
                ],
                'css_file' => 'cafe-red-elegant/style.css',
                'supports_scroll' => true,
                'supports_slide' => false,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 36,
                // Default data for the theme
                'default_data' => [
                    'invitation' => [
                        'opening_title' => 'Celebration of Anniversary',
                        'opening_text' => "Dengan penuh rasa syukur dan bahagia, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara perayaan ulang tahun kafe kami.",
                        'opening_ayat' => 'Perjalanan panjang penuh dedikasi dan kebersamaan. Terima kasih atas dukungan dan kepercayaan yang diberikan kepada kami hingga hari ini.',
                        'opening_ayat_translation' => '',
                        'opening_ayat_source' => 'Gebyar HUT Tapian Nauli Cafe',
                        'closing_title' => 'Terima Kasih',
                        'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu dan merayakan bersama kami.',
                        'turut_mengundang_text' => '',
                        'religion' => 'general',
                        'music_url' => '/audio/backsound.mp3',
                        'music_autoplay' => true,
                        'cover_title' => 'Tapian Nauli Cafe',
                        'cover_subtitle' => 'HUT KE-29 TAPIAN NAULI CAFE',
                        'countdown_target_date' => '2026-10-15 18:00:00',
                        'save_the_date_enabled' => true,
                        'particle_type' => 'gold-glitter',
                        'gallery_mode' => 'grid',
                        'enable_rsvp' => true,
                        'enable_wishes' => true,
                    ],
                    'bride_grooms' => [
                        [
                            'order_number' => 1,
                            'full_name' => 'Gebyar HUT ke-29 Tapian Nauli Cafe',
                            'nickname' => 'Tapian Nauli Cafe',
                            'father_name' => '',
                            'mother_name' => '',
                            'gender' => 'pria',
                            'photo' => '',
                            'bio' => 'Sebuah ruang hangat untuk berkumpul, berdiskusi, dan merayakan kebersamaan sejak tahun 1997.',
                            'instagram' => 'tapian_nauli_cafe',
                            'child_order' => '',
                        ]
                    ],
                    'love_stories' => [
                        [
                            'title' => 'Awal Didirikan',
                            'story_date' => '1997-10-15',
                            'description' => 'Didirikan pertama kali dengan konsep sederhana, mengedepankan cita rasa kopi nusantara yang otentik serta kenyamanan berkumpul keluarga.',
                            'sort_order' => 0,
                        ],
                        [
                            'title' => 'Transformasi & Wajah Baru',
                            'story_date' => '2015-08-20',
                            'description' => 'Merambah ke konsep modern industrial tanpa menghilangkan esensi keakraban tradisional yang menjadi ciri khas kami.',
                            'sort_order' => 1,
                        ],
                    ],
                    'events' => [
                        [
                            'event_type' => 'utama',
                            'event_name' => 'Malam Puncak Syukuran',
                            'event_date' => '2026-10-15',
                            'start_time' => '18:00',
                            'end_time' => '22:00',
                            'timezone' => 'WIB',
                            'venue_name' => 'Tapian Nauli Cafe Hall',
                            'venue_address' => 'Jl. Sisingamangaraja No. 45, Kota Medan',
                            'gmaps_link' => 'https://maps.google.com',
                            'sort_order' => 0,
                            'is_primary' => true,
                        ]
                    ],
                    'galleries' => [
                        ['image_url' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop', 'caption' => 'Suasana Cafe', 'sort_order' => 0],
                        ['image_url' => 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&h=400&fit=crop', 'caption' => 'Kebersamaan', 'sort_order' => 1],
                    ],
                    'bank_accounts' => [
                        [
                            'bank_name' => 'BCA',
                            'account_name' => 'Tapian Nauli Cafe',
                            'account_number' => '876543210',
                            'sort_order' => 0,
                        ]
                    ],
                    'guests' => [
                        ['name' => 'Pelanggan Setia', 'phone' => '08123456789', 'group_name' => 'VIP'],
                    ],
                    'wishes' => [
                        ['sender_name' => 'Pelanggan Setia', 'message' => 'Selamat hari jadi Tapian Nauli Cafe yang ke-29! Sukses selalu dan tetap menjadi tempat favorit kami berkumpul!'],
                    ],
                ],
            ]
        );

        $sections = [
            ['key' => 'cover', 'name' => 'Cover', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Opening', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Mempelai / Profil', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Save The Date', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Perjalanan Kisah', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Acara', 'order' => 6, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Galeri', 'order' => 7, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP', 'order' => 8, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Ucapan', 'order' => 9, 'removable' => true],
            ['key' => 'bank', 'name' => 'Kado Digital / Amplop', 'order' => 10, 'removable' => true],
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
