<?php

namespace Database\Seeders;

use App\Models\ThreeDScene;
use Illuminate\Database\Seeder;

class ThreeDSceneSeeder extends Seeder
{
    public function run(): void
    {
        $config = [
            'backgroundGradient' => 'midnight',
            'particleType' => 'gold_dust',
            'keyframePauseDuration' => 2.5,
            'layers' => [
                [
                    'id' => 'layer_sampul',
                    'name' => 'Sampul (Z = 0)',
                    'visible' => true,
                    'position' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'scale' => ['x' => 1, 'y' => 1],
                    'contents' => [
                        [
                            'id' => 'content_sampul_flower_left',
                            'name' => 'Bunga Kiri',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/flower-left.webp',
                            'visible' => true,
                            'position' => ['x' => -3.8, 'y' => 1.6, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.6, 'y' => 0.6]
                        ],
                        [
                            'id' => 'content_sampul_flower_right',
                            'name' => 'Bunga Kanan',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/flower-right.webp',
                            'visible' => true,
                            'position' => ['x' => 3.8, 'y' => 1.6, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.6, 'y' => 0.6]
                        ],
                        [
                            'id' => 'content_sampul_divider',
                            'name' => 'Pembatas Pattern',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/divider-pattern.webp',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 0.5, 'z' => -0.2],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.5, 'y' => 0.5]
                        ],
                        [
                            'id' => 'content_sampul_title',
                            'name' => 'Judul Sampul',
                            'type' => 'text',
                            'text' => 'THE WEDDING OF',
                            'fontFamily' => 'Montserrat',
                            'fontSize' => 24,
                            'color' => '#E5654B',
                            'fontWeight' => 'bold',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 1.2, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ],
                        [
                            'id' => 'content_sampul_names',
                            'name' => 'Nama Pengantin',
                            'type' => 'text',
                            'text' => 'Yusuf & Utari',
                            'fontFamily' => 'Great Vibes',
                            'fontSize' => 64,
                            'color' => '#ffffff',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -0.2, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.2, 'y' => 1.2]
                        ],
                        [
                            'id' => 'content_sampul_subtitle',
                            'name' => 'Nama Tamu',
                            'type' => 'text',
                            'text' => 'Dear {{guest_name}}',
                            'fontFamily' => 'Playfair Display',
                            'fontSize' => 32,
                            'color' => '#ffffff',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'italic',
                            'dataBinding' => 'guest_name',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -1.2, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ]
                    ]
                ],
                [
                    'id' => 'layer_opening',
                    'name' => 'Opening (Z = -5)',
                    'visible' => true,
                    'position' => ['x' => 0, 'y' => 0, 'z' => -5],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'scale' => ['x' => 1, 'y' => 1],
                    'contents' => [
                        [
                            'id' => 'content_opening_frame_top',
                            'name' => 'Bingkai Atas',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/event-frame-top.webp',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 2.0, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.6, 'y' => 0.6]
                        ],
                        [
                            'id' => 'content_opening_frame_bottom',
                            'name' => 'Bingkai Bawah',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/event-frame-bottom.webp',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -2.0, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.6, 'y' => 0.6]
                        ],
                        [
                            'id' => 'content_opening_bismillah',
                            'name' => 'Salam Pembuka',
                            'type' => 'text',
                            'text' => 'Walimatul Ursy',
                            'fontFamily' => 'Great Vibes',
                            'fontSize' => 54,
                            'color' => '#E5654B',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 0.8, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ],
                        [
                            'id' => 'content_opening_text',
                            'name' => 'Teks Pembuka',
                            'type' => 'text',
                            'text' => 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri pernikahan kami.',
                            'fontFamily' => 'Montserrat',
                            'fontSize' => 20,
                            'color' => '#ffffff',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -0.4, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ]
                    ]
                ],
                [
                    'id' => 'layer_mempelai',
                    'name' => 'Mempelai (Z = -10)',
                    'visible' => true,
                    'position' => ['x' => 0, 'y' => 0, 'z' => -10],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'scale' => ['x' => 1, 'y' => 1],
                    'contents' => [
                        [
                            'id' => 'content_mempelai_photo',
                            'name' => 'Foto Pasangan',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/couple-photo.webp',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 0.8, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.5, 'y' => 0.5]
                        ],
                        [
                            'id' => 'content_mempelai_frame',
                            'name' => 'Bingkai Profil',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/frame-profile.webp',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 0.8, 'z' => 0.2],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.52, 'y' => 0.52]
                        ],
                        [
                            'id' => 'content_mempelai_names',
                            'name' => 'Nama Pengantin',
                            'type' => 'text',
                            'text' => '{{groom_nickname}} & {{bride_nickname}}',
                            'fontFamily' => 'Great Vibes',
                            'fontSize' => 54,
                            'color' => '#E5654B',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -0.8, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.1, 'y' => 1.1]
                        ],
                        [
                            'id' => 'content_mempelai_sub',
                            'name' => 'Teks Pengantar',
                            'type' => 'text',
                            'text' => 'Kami yang berbahagia',
                            'fontFamily' => 'Montserrat',
                            'fontSize' => 18,
                            'color' => '#ffffff',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'italic',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -1.3, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ]
                    ]
                ],
                [
                    'id' => 'layer_acara',
                    'name' => 'Acara (Z = -15)',
                    'visible' => true,
                    'position' => ['x' => 0, 'y' => 0, 'z' => -15],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'scale' => ['x' => 1, 'y' => 1],
                    'contents' => [
                        [
                            'id' => 'content_acara_divider',
                            'name' => 'Pattern Acara',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/divider-pattern.webp',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 1.8, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.4, 'y' => 0.4]
                        ],
                        [
                            'id' => 'content_acara_title',
                            'name' => 'Nama Acara',
                            'type' => 'text',
                            'text' => '{{event_name}}',
                            'fontFamily' => 'Montserrat',
                            'fontSize' => 32,
                            'color' => '#E5654B',
                            'fontWeight' => 'bold',
                            'fontStyle' => 'normal',
                            'dataBinding' => 'event_name',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 1.0, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ],
                        [
                            'id' => 'content_acara_datetime',
                            'name' => 'Tanggal & Waktu',
                            'type' => 'text',
                            'text' => '{{event_date}} - {{event_time}}',
                            'fontFamily' => 'Montserrat',
                            'fontSize' => 24,
                            'color' => '#ffffff',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 0.1, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ],
                        [
                            'id' => 'content_acara_venue',
                            'name' => 'Tempat Acara',
                            'type' => 'text',
                            'text' => 'Tempat: {{venue_name}}',
                            'fontFamily' => 'Montserrat',
                            'fontSize' => 20,
                            'color' => '#ffffff',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => 'venue_name',
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -0.8, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ]
                    ]
                ],
                [
                    'id' => 'layer_closing',
                    'name' => 'Closing (Z = -20)',
                    'visible' => true,
                    'position' => ['x' => 0, 'y' => 0, 'z' => -20],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'scale' => ['x' => 1, 'y' => 1],
                    'contents' => [
                        [
                            'id' => 'content_closing_ornament_left',
                            'name' => 'Ornamen Kiri',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/ornament-left.webp',
                            'visible' => true,
                            'position' => ['x' => -3.5, 'y' => 0, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.5, 'y' => 0.5]
                        ],
                        [
                            'id' => 'content_closing_ornament_right',
                            'name' => 'Ornamen Kanan',
                            'type' => 'upload',
                            'url' => '/themes/utary/asset/ornament-right.webp',
                            'visible' => true,
                            'position' => ['x' => 3.5, 'y' => 0, 'z' => 0.1],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 0.5, 'y' => 0.5]
                        ],
                        [
                            'id' => 'content_closing_text',
                            'name' => 'Teks Penutup',
                            'type' => 'text',
                            'text' => 'Terima Kasih atas Doa Restu Anda',
                            'fontFamily' => 'Great Vibes',
                            'fontSize' => 48,
                            'color' => '#E5654B',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => 0.2, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ],
                        [
                            'id' => 'content_closing_sub',
                            'name' => 'Teks Hormat Kami',
                            'type' => 'text',
                            'text' => 'Merupakan suatu kehormatan & kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.',
                            'fontFamily' => 'Montserrat',
                            'fontSize' => 16,
                            'color' => '#ffffff',
                            'fontWeight' => 'normal',
                            'fontStyle' => 'normal',
                            'dataBinding' => null,
                            'visible' => true,
                            'position' => ['x' => 0, 'y' => -0.6, 'z' => 0],
                            'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                            'scale' => ['x' => 1.0, 'y' => 1.0]
                        ]
                    ]
                ]
            ],
            'keyframes' => [
                [
                    'id' => 'kf_1',
                    'time' => 0,
                    'position' => ['x' => 0, 'y' => 0, 'z' => 8],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'fov' => 75,
                    'target' => ['x' => 0, 'y' => 0, 'z' => 0]
                ],
                [
                    'id' => 'kf_2',
                    'time' => 0.25,
                    'position' => ['x' => 0, 'y' => 0, 'z' => 3],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'fov' => 75,
                    'target' => ['x' => 0, 'y' => 0, 'z' => -5]
                ],
                [
                    'id' => 'kf_3',
                    'time' => 0.5,
                    'position' => ['x' => 0, 'y' => 0, 'z' => -2],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'fov' => 75,
                    'target' => ['x' => 0, 'y' => 0, 'z' => -10]
                ],
                [
                    'id' => 'kf_4',
                    'time' => 0.75,
                    'position' => ['x' => 0, 'y' => 0, 'z' => -7],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'fov' => 75,
                    'target' => ['x' => 0, 'y' => 0, 'z' => -15]
                ],
                [
                    'id' => 'kf_5',
                    'time' => 1.0,
                    'position' => ['x' => 0, 'y' => 0, 'z' => -12],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'fov' => 75,
                    'target' => ['x' => 0, 'y' => 0, 'z' => -20]
                ]
            ]
        ];

        ThreeDScene::updateOrCreate(
            ['slug' => 'emerald-grace-3d-theme'],
            [
                'name' => 'Emerald Grace Premium 3D',
                'slug' => 'emerald-grace-3d-theme',
                'config' => $config,
                'thumbnail' => '/themes/utary/thumbnail.webp',
                'is_active' => true
            ]
        );
    }
}
