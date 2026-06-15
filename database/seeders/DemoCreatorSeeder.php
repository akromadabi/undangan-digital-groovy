<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Theme;
use App\Models\Invitation;
use App\Models\BrideGroom;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\LoveStory;
use App\Models\BankAccount;
use App\Models\Guest;
use App\Models\Wish;
use App\Models\Rsvp;
use App\Models\InvitationSection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoCreatorSeeder extends Seeder
{
    public function run(): void
    {
        // ═══════════════════════════════════════
        // 1. ENSURE ALL COMPATIBLE THEMES HAVE CORRECT ALL-TYPES SUPPORT
        // ═══════════════════════════════════════
        $allTypes = ['wedding', 'birthday', 'graduation', 'aqiqah', 'circumcision', 'anniversary', 'general'];
        
        Theme::query()->update(['type' => json_encode($allTypes)]);
        
        // Find exact target themes
        $candyLandTheme = Theme::where('slug', 'candy-land')->first();
        $spotifyTheme = Theme::where('slug', 'spotify')->first();
        $netflixTheme = Theme::where('slug', 'netflix')->first();

        // Fallbacks in case themes aren't fully seeded yet
        if (!$candyLandTheme) $candyLandTheme = Theme::first();
        if (!$spotifyTheme) $spotifyTheme = Theme::first();
        if (!$netflixTheme) $netflixTheme = Theme::first();

        // Users to populate (Super Admin, Reseller, and standard demo users)
        $userIds = [1, 2, 3, 4];

        // ═══════════════════════════════════════
        // 2. DEFINE THE EXTREMELY DETAILED DEMO DATA
        // ═══════════════════════════════════════
        $demos = [
            [
                'slug' => 'demo-ultah',
                'type' => 'birthday',
                'title' => "Rara's Candy Party - Clarissa's 5th Sweet Birthday Bash",
                'theme' => $candyLandTheme,
                'invitation_data' => [
                    'cover_title' => "Rara's Candy Party",
                    'cover_subtitle' => "Clarissa's 5th Sweet Birthday Bash",
                    'opening_title' => "Welcome to Candy Land!",
                    'opening_text' => "Hari yang penuh warna, tawa, dan manisnya keceriaan telah tiba! Kami mengundang seluruh teman-teman dan keluarga terkasih untuk bergabung dalam petualangan menyenangkan di pesta ulang tahun ke-5 putri kecil kami tercinta, Clarissa.",
                    'opening_ayat' => "Mari berkumpul untuk merayakan tumbuh kembang, tawa ceria, dan momen manis penuh berkat!",
                    'opening_ayat_translation' => '',
                    'opening_ayat_source' => '',
                    'closing_title' => "Thank You for Swinging By!",
                    'closing_text' => "Kehadiran serta doa restu yang tulus dari seluruh teman-teman dan keluarga adalah kado termanis bagi hidup Rara. Sampai jumpa di istana permen kami yang penuh tawa!",
                    'video_url' => 'https://www.youtube.com/watch?v=kYJv8Z5QW5g',
                    'video_playback' => 'both',
                    'music_url' => '/audio/backsound.mp3',
                    'music_autoplay' => true,
                    'countdown_target_date' => now()->addDays(30)->format('Y-m-d H:i:s'),
                    'save_the_date_enabled' => true,
                    'enable_rsvp' => true,
                    'enable_wishes' => true,
                    'enable_qr' => true,
                    'show_countdown' => true,
                    'show_animations' => true,
                    'show_photos' => true,
                    'particle_type' => 'hearts',
                    'cover_image' => '/images/demo/korea-11-768x512.jpg',
                    'opening_image' => '/images/demo/korea-3.jpg',
                    'is_active' => true,
                    'is_published' => true,
                ],
                'bride_grooms' => [
                    [
                        'order_number' => 1,
                        'full_name' => 'Clarissa Rarasati',
                        'nickname' => 'Rara',
                        'gender' => 'wanita',
                        'father_name' => 'Ir. Hermawan Pratama',
                        'mother_name' => 'dr. Anita Lestari',
                        'child_order' => 'Putri Kedua',
                        'bio' => 'Putri kecil kami yang selalu ceria, menyukai es krim stroberi, gemar menari balon, dan rajin menggambar pelangi. Rara sudah tidak sabar untuk berbagi keceriaan bersama teman-teman semua!',
                        'instagram' => 'clarissa.rarasati',
                        'photo' => '/images/demo/korea-3.jpg',
                    ]
                ],
                'events' => [
                    [
                        'event_type' => 'pesta',
                        'event_name' => 'Candy Land Fun Party',
                        'event_date' => now()->addDays(30)->format('Y-m-d'),
                        'start_time' => '11:00',
                        'end_time' => '14:00',
                        'timezone' => 'WIB',
                        'venue_name' => 'Sweet Castle Ballroom',
                        'venue_address' => 'Gedung Pelangi Indah Lt. 2, Jl. Pelangi Ceria No. 12, Grogol, Jakarta Barat',
                        'gmaps_link' => 'https://maps.google.com/?q=Sweet+Castle+Ballroom+Jakarta',
                        'is_primary' => true,
                        'sort_order' => 1,
                        'show_dress_code' => true,
                        'dress_code_text' => 'Colorful & Playful / Pakaian Ceria Nyaman',
                        'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#FF4B72', '#FFC107', '#00D2FC', '#4CAF50']]],
                        'streaming_platform' => 'YouTube',
                        'streaming_url' => 'https://youtube.com/live/demo',
                        'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/demo']],
                    ]
                ],
                'galleries' => [
                    ['image_url' => '/images/demo/korea-11-768x512.jpg', 'caption' => 'Rara dan Boneka Kesayangan', 'sort_order' => 1],
                    ['image_url' => '/images/demo/korea-3.jpg', 'caption' => 'Senyum Manis Pelangi', 'sort_order' => 2],
                    ['image_url' => '/images/demo/korea-7-768x512.jpg', 'caption' => 'Bermain Ceria di Taman', 'sort_order' => 3],
                    ['image_url' => '/images/demo/korea-4-768x528.jpg', 'caption' => 'Pose Cantik Si Kecil', 'sort_order' => 4],
                ],
                'love_stories' => [
                    [
                        'title' => 'Kehadiran Si Kecil (Age 0)',
                        'story_date' => '2021-10-15',
                        'description' => 'Tangisan pertama Rara yang merdu terdengar di dunia, membawa kebahagiaan yang melimpah dan melengkapi harmoni keluarga kecil kami.',
                        'sort_order' => 1,
                    ],
                    [
                        'title' => 'Langkah & Celoteh Ceria (Age 1)',
                        'story_date' => '2022-12-05',
                        'description' => 'Mulai belajar melangkah kecil dan memanggil "Ayah" dan "Ibu". Setiap celoteh imutnya membawa kehangatan tiada tara di dalam rumah.',
                        'sort_order' => 2,
                    ],
                    [
                        'title' => 'Petualangan TK Ceria (Age 4)',
                        'story_date' => '2025-07-10',
                        'description' => 'Rara pertama kali masuk sekolah TK. Ia tumbuh menjadi anak yang sangat pemberani, gemar berbagi permen, dan pandai bernyanyi di depan kelas.',
                        'sort_order' => 3,
                    ],
                ],
                'bank_accounts' => [
                    ['bank_name' => 'Bank Mandiri', 'account_number' => '9876543210', 'account_name' => 'Anita Lestari (Ibu Rara)', 'sort_order' => 1],
                    ['bank_name' => 'Bank BCA', 'account_number' => '1234567890', 'account_name' => 'Hermawan Pratama (Ayah Rara)', 'sort_order' => 2],
                ],
                'guests' => [
                    ['name' => 'Budi Utomo', 'phone' => '081234567890', 'group_name' => 'Teman TK Rara', 'slug' => 'budi-utomo', 'max_pax' => 2],
                    ['name' => 'Tante Sarah', 'phone' => '081222222222', 'group_name' => 'Keluarga Besar', 'slug' => 'tante-sarah', 'max_pax' => 1],
                ],
                'wishes' => [
                    ['sender_name' => 'Tante Sarah', 'message' => 'Barakallah fii umrik Rara sayang! Semoga tumbuh menjadi anak yang cerdas, salihah, berbakti kepada kedua orang tua, sehat ceria, dan selalu dipenuhi kebahagiaan ya! Amin! 🍬🍭🧁'],
                    ['sender_name' => 'Budi Utomo', 'message' => 'Happy birthday Rara teman baikku! Semoga panjang umur, sehat selalu, makin pintar, dan besok pesta kita makan kue permen yang banyak ya! 🥳🎈'],
                ]
            ],
            [
                'slug' => 'demo-anniversary',
                'type' => 'anniversary',
                'title' => "Randy & Clarissa's 5th Love Album - Spotivite Neon Experience",
                'theme' => $spotifyTheme,
                'invitation_data' => [
                    'cover_title' => "Randy & Clarissa",
                    'cover_subtitle' => "The 5th Wedding Anniversary Album",
                    'opening_title' => "Track 01: Syukuran 5 Tahun Pernikahan",
                    'opening_text' => "Dengan penuh rasa syukur atas kebaikan Tuhan yang telah menuntun setiap melodi perjalanan rumah tangga kami selama 5 tahun ini, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan simfoni cinta kami.",
                    'opening_ayat' => "Cinta bukanlah sekadar melihat satu sama lain, melainkan melangkah bersama ke arah melodi yang sama.",
                    'opening_ayat_translation' => '',
                    'opening_ayat_source' => '',
                    'closing_title' => "End of Album - Thank You",
                    'closing_text' => "Kehadiran dan untaian doa restu dari Bapak/Bapak/Saudara/i sekalian adalah berkah dan catatan melodi terindah bagi hidup kami. Semoga kasih senantiasa membimbing kita semua.",
                    'video_url' => 'https://www.youtube.com/watch?v=F3zWvS6rZcE',
                    'video_playback' => 'both',
                    'music_url' => '/audio/backsound.mp3',
                    'music_autoplay' => true,
                    'countdown_target_date' => now()->addDays(15)->format('Y-m-d H:i:s'),
                    'save_the_date_enabled' => true,
                    'enable_rsvp' => true,
                    'enable_wishes' => true,
                    'enable_qr' => true,
                    'show_countdown' => true,
                    'show_animations' => true,
                    'show_photos' => true,
                    'particle_type' => 'gold-dust',
                    'cover_image' => '/images/demo/korea-12-768x512.jpg',
                    'opening_image' => '/images/demo/korea-7-768x512.jpg',
                    'is_active' => true,
                    'is_published' => true,
                ],
                'bride_grooms' => [
                    [
                        'order_number' => 1,
                        'full_name' => 'Randy Wijaya',
                        'nickname' => 'Randy',
                        'gender' => 'pria',
                        'father_name' => 'H. Gunawan Wijaya',
                        'mother_name' => 'Hj. Ratna Wijaya',
                        'bio' => 'Featured Artist - Seorang arsitek pencinta melodi gitar, traveling, dan sosok suami penyayang yang selalu bersyukur atas kehadiran Clarissa dalam setiap rancangan hidupnya.',
                        'instagram' => 'randy.wijaya',
                        'photo' => '/images/demo/korea-8.jpg',
                    ],
                    [
                        'order_number' => 2,
                        'full_name' => 'Clarissa Putri',
                        'nickname' => 'Clarissa',
                        'gender' => 'wanita',
                        'father_name' => 'Ir. Hermawan',
                        'mother_name' => 'Dra. Sulastri',
                        'bio' => 'Featured Artist - Desainer interior kreatif pencinta tanaman hias, memiliki hobi memasak, dan sosok istri yang menjadi harmoni pelengkap hidup Randy.',
                        'instagram' => 'clarissa.putri',
                        'photo' => '/images/demo/korea-3.jpg',
                    ]
                ],
                'events' => [
                    [
                        'event_type' => 'syukuran',
                        'event_name' => 'Syukuran Hari Jadi & Intimate Dinner',
                        'event_date' => now()->addDays(15)->format('Y-m-d'),
                        'start_time' => '18:30',
                        'end_time' => '21:30',
                        'timezone' => 'WIB',
                        'venue_name' => 'Grand Sky Restaurant',
                        'venue_address' => 'Hotel Horizon Lt. 15, Jl. Jend. Sudirman Kav. 12, Menteng, Jakarta Pusat',
                        'gmaps_link' => 'https://maps.google.com/?q=Grand+Sky+Restaurant+Jakarta',
                        'is_primary' => true,
                        'sort_order' => 1,
                        'show_dress_code' => true,
                        'dress_code_text' => 'Semi Formal / Pastel & Earth Tone Theme',
                        'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#C2A590', '#EAE3D2', '#A6B1E1', '#DCD6F7']]],
                        'streaming_platform' => 'YouTube',
                        'streaming_url' => 'https://youtube.com/live/demo',
                        'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/demo']],
                    ]
                ],
                'galleries' => [
                    ['image_url' => '/images/demo/korea-12-768x512.jpg', 'caption' => 'The Beautiful Harmony', 'sort_order' => 1],
                    ['image_url' => '/images/demo/korea-7-768x512.jpg', 'caption' => 'Strolling Hand in Hand', 'sort_order' => 2],
                    ['image_url' => '/images/demo/korea-11-768x512.jpg', 'caption' => 'Moments of Pure Joy', 'sort_order' => 3],
                    ['image_url' => '/images/demo/korea-4-768x528.jpg', 'caption' => 'Warm Hearts, Endless Love', 'sort_order' => 4],
                ],
                'love_stories' => [
                    [
                        'title' => 'Intro: The Acoustic Meetup (2018)',
                        'story_date' => '2018-02-14',
                        'description' => 'Dipertemukan takdir dalam sebuah pameran seni dan konser akustik. Perbincangan hangat tentang melodi gitar dan tata ruang menjadi awal terciptanya melodi indah bagi kami berdua.',
                        'sort_order' => 1,
                    ],
                    [
                        'title' => 'Chorus: The Sacred Vow (2021)',
                        'story_date' => '2021-05-30',
                        'description' => 'Di hadapan keluarga dan saksi suci, kami mengikat janji suci pernikahan. Menyatukan dua impian menjadi satu irama langkah kehidupan yang penuh berkah.',
                        'sort_order' => 2,
                    ],
                    [
                        'title' => 'Outro: The Golden Symphony (2026)',
                        'story_date' => '2026-05-30',
                        'description' => 'Lima tahun telah kami lalui bersama dengan nada suka maupun duka. Cinta kami tumbuh semakin matang, beresonansi dalam sebuah melodi kesetiaan dan rasa syukur yang abadi.',
                        'sort_order' => 3,
                    ],
                ],
                'bank_accounts' => [
                    ['bank_name' => 'Bank BCA', 'account_number' => '1122334455', 'account_name' => 'Randy Wijaya', 'sort_order' => 1],
                    ['bank_name' => 'Bank Mandiri', 'account_number' => '5544332211', 'account_name' => 'Clarissa Putri', 'sort_order' => 2],
                ],
                'guests' => [
                    ['name' => 'Denny Siregar', 'phone' => '081223344556', 'group_name' => 'Sahabat Dekat', 'slug' => 'denny-siregar', 'max_pax' => 2],
                    ['name' => 'Sarah Amalia', 'phone' => '081298765432', 'group_name' => 'Rekan Kerja', 'slug' => 'sarah-amalia', 'max_pax' => 1],
                ],
                'wishes' => [
                    ['sender_name' => 'Denny Siregar', 'message' => 'Happy 5th Anniversary Randy & Clarissa! Pasangan terfavorit sepanjang masa. Iringan musik cinta kalian sangat luar biasa indah. Semoga langgeng terus sampai kakek nenek dan selalu dipenuhi kebahagiaan! 🥂💖'],
                    ['sender_name' => 'Sarah Amalia', 'message' => 'Selamat hari pernikahan ke-5 Clarissa & Randy! Nggak terasa waktu cepat sekali berlalu. Semoga kalian selalu diberikan kesehatan, kelancaran rezeki, makin kompak, dan segera diberikan momongan lucu! Amin. ✨'],
                ]
            ],
            [
                'slug' => 'demo-wisuda',
                'type' => 'graduation',
                'title' => "Budi Santoso's Graduation Tour - Blockbuster Wedflix Premium",
                'theme' => $netflixTheme,
                'invitation_data' => [
                    'cover_title' => "Graduation Celebration",
                    'cover_subtitle' => "Budi Santoso, S.Kom.",
                    'opening_title' => "Now Streaming: Syukuran Wisuda",
                    'opening_text' => "Dengan memohon doa restu dan limpahan rahmat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menyaksikan siaran kebahagiaan syukuran kelulusan dan wisuda putra kami tercinta, Budi Santoso.",
                    'opening_ayat' => "Pendidikan adalah senjata paling mematikan di dunia, karena dengan itu Anda bisa mengubah dunia.",
                    'opening_ayat_translation' => '',
                    'opening_ayat_source' => 'Nelson Mandela',
                    'closing_title' => "End of Season - Thank You",
                    'closing_text' => "Kehadiran serta doa restu yang tulus dari Bapak/Ibu/Saudara/i sekalian adalah penyemangat utama bagi Budi untuk berkarya lebih hebat di musim-musim kehidupan mendatang. Terima kasih!",
                    'video_url' => 'https://www.youtube.com/watch?v=2K4VbU2p5fI',
                    'video_playback' => 'both',
                    'music_url' => '/audio/backsound.mp3',
                    'music_autoplay' => true,
                    'countdown_target_date' => now()->addDays(20)->format('Y-m-d H:i:s'),
                    'save_the_date_enabled' => true,
                    'enable_rsvp' => true,
                    'enable_wishes' => true,
                    'enable_qr' => true,
                    'show_countdown' => true,
                    'show_animations' => true,
                    'show_photos' => true,
                    'particle_type' => 'none',
                    'cover_image' => '/images/demo/korea-8.jpg',
                    'opening_image' => '/images/demo/korea-8.jpg',
                    'is_active' => true,
                    'is_published' => true,
                ],
                'bride_grooms' => [
                    [
                        'order_number' => 1,
                        'full_name' => 'Budi Santoso, S.Kom.',
                        'nickname' => 'Budi',
                        'gender' => 'pria',
                        'father_name' => 'Drs. H. Mulyono',
                        'mother_name' => 'Hj. Aminah',
                        'child_order' => 'Putra Pertama',
                        'bio' => 'Lulusan Terbaik Fakultas Ilmu Komputer Universitas Indonesia. Seorang software engineer yang bersemangat mengembangkan model kecerdasan buatan (AI), menyukai pemecahan masalah algoritma, serta gemar bermain catur.',
                        'instagram' => 'budi_santoso',
                        'photo' => '/images/demo/korea-8.jpg',
                    ]
                ],
                'events' => [
                    [
                        'event_type' => 'syukuran',
                        'event_name' => 'Acara Syukuran Kelulusan & Makan Siang',
                        'event_date' => now()->addDays(20)->format('Y-m-d'),
                        'start_time' => '11:00',
                        'end_time' => '14:00',
                        'timezone' => 'WIB',
                        'venue_name' => 'Heritage Resto Hall',
                        'venue_address' => 'Jl. Diponegoro No. 8, Menteng, Jakarta Pusat',
                        'gmaps_link' => 'https://maps.google.com/?q=Heritage+Resto+Jakarta',
                        'is_primary' => true,
                        'sort_order' => 1,
                        'show_dress_code' => true,
                        'dress_code_text' => 'Batik Modern / Busana Nasional Rapi',
                        'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#8B5A2B', '#CD853F', '#DEB887', '#F5F5DC']]],
                        'streaming_platform' => 'YouTube',
                        'streaming_url' => 'https://youtube.com/live/demo',
                        'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/demo']],
                    ]
                ],
                'galleries' => [
                    ['image_url' => '/images/demo/korea-8.jpg', 'caption' => 'The Proud Graduate', 'sort_order' => 1],
                    ['image_url' => '/images/demo/korea-11-768x512.jpg', 'caption' => 'With Companions of Journey', 'sort_order' => 2],
                    ['image_url' => '/images/demo/korea-12-768x512.jpg', 'caption' => 'Family Support System', 'sort_order' => 3],
                    ['image_url' => '/images/demo/korea-7-768x512.jpg', 'caption' => 'Stepping Into the Future', 'sort_order' => 4],
                ],
                'love_stories' => [
                    [
                        'title' => 'Season 1: Entering the Fasilkom (2022)',
                        'story_date' => '2022-09-01',
                        'description' => 'Langkah pertama Budi melintasi gerbang kampus Ilmu Komputer Universitas Indonesia. Sebuah awal perjuangan panjang yang penuh tantangan, begadang, dan baris-baris kode pemrograman.',
                        'sort_order' => 1,
                    ],
                    [
                        'title' => 'Season 2: The Final AI Defense (2026)',
                        'story_date' => '2026-04-15',
                        'description' => 'Berhasil mempertahankan skripsi tentang pengembangan model visi komputer (Computer Vision) berbasis Deep Learning di hadapan para dosen penguji. Momen luar biasa yang tak terlupakan!',
                        'sort_order' => 2,
                    ],
                    [
                        'title' => 'Season 3: The Graduation Victory (2026)',
                        'story_date' => '2026-05-30',
                        'description' => 'Hari wisuda agung! Budi resmi dilantik sebagai Sarjana Komputer (S.Kom) dengan predikat Cum Laude. Siap memulai petualangan baru di industri teknologi global.',
                        'sort_order' => 3,
                    ],
                ],
                'bank_accounts' => [
                    ['bank_name' => 'Bank BCA', 'account_number' => '9988776655', 'account_name' => 'Budi Santoso', 'sort_order' => 1],
                    ['bank_name' => 'GoPay', 'account_number' => '089876543210', 'account_name' => 'Budi Santoso', 'sort_order' => 2],
                ],
                'guests' => [
                    ['name' => 'Prof. Joko', 'phone' => '081111111111', 'group_name' => 'Akademisi / Dosen', 'slug' => 'prof-joko', 'max_pax' => 1],
                    ['name' => 'Agus Pratama', 'phone' => '081222222222', 'group_name' => 'Teman Kuliah', 'slug' => 'agus-pratama', 'max_pax' => 1],
                ],
                'wishes' => [
                    ['sender_name' => 'Prof. Joko', 'message' => 'Selamat atas kelulusannya Budi Santoso, S.Kom.! Kamu adalah salah satu mahasiswa terbaik dan berdedikasi tinggi yang pernah saya bimbing. Semoga ilmu AI-mu berkah, bermanfaat untuk masyarakat luas, dan sukses di karir global! 🎓'],
                    ['sender_name' => 'Agus Pratama', 'message' => 'Selamat mas bro Bud! Akhirnya penderitaan begadang ngerjain bug codingan kelar juga 😂 Sukses di dunia kerja ya bro, semoga cepet jadi senior engineer di Silicon Valley! 🚀'],
                ]
            ]
        ];

        // ═══════════════════════════════════════
        // 3. EXECUTE RE-CREATION PROCESS
        // ═══════════════════════════════════════
        foreach ($demos as $demo) {
            $slug = $demo['slug'];
            $theme = $demo['theme'];
            
            foreach ($userIds as $userId) {
                // If it's for user 1, keep the plain slug. For other users, append user ID to slug to avoid duplicate key error.
                $userSlug = ($userId === 1) ? $slug : "{$slug}-u{$userId}";
                
                // Clear any existing record
                $existing = Invitation::where('slug', $userSlug)->first();
                if ($existing) {
                    $existing->brideGrooms()->delete();
                    $existing->events()->delete();
                    $existing->galleries()->delete();
                    $existing->loveStories()->delete();
                    $existing->bankAccounts()->delete();
                    $existing->guests()->delete();
                    $existing->wishes()->delete();
                    $existing->rsvps()->delete();
                    $existing->sections()->delete();
                    $existing->delete();
                }
                
                // Verify user exists before seeding
                $userModel = User::find($userId);
                if (!$userModel) {
                    continue;
                }

                // Create Invitation
                $invitation = Invitation::create(array_merge($demo['invitation_data'], [
                    'user_id' => $userId,
                    'theme_id' => $theme->id,
                    'slug' => $userSlug,
                    'title' => $demo['title'],
                    'type' => $demo['type'],
                ]));

                // Populate InvitationSections from Theme
                foreach ($theme->sections as $ts) {
                    InvitationSection::create([
                        'invitation_id' => $invitation->id,
                        'section_key' => $ts->section_key,
                        'section_name' => $ts->section_name,
                        'sort_order' => $ts->default_order,
                        'is_visible' => $ts->is_default,
                    ]);
                }

                // Populate BrideGrooms
                foreach ($demo['bride_grooms'] as $bg) {
                    BrideGroom::create(array_merge($bg, [
                        'invitation_id' => $invitation->id,
                    ]));
                }

                // Populate Events
                foreach ($demo['events'] as $ev) {
                    Event::create(array_merge($ev, [
                        'invitation_id' => $invitation->id,
                    ]));
                }

                // Populate Galleries
                foreach ($demo['galleries'] as $gl) {
                    Gallery::create(array_merge($gl, [
                        'invitation_id' => $invitation->id,
                    ]));
                }

                // Populate LoveStories
                foreach ($demo['love_stories'] as $ls) {
                    LoveStory::create(array_merge($ls, [
                        'invitation_id' => $invitation->id,
                    ]));
                }

                // Populate BankAccounts
                foreach ($demo['bank_accounts'] as $ba) {
                    BankAccount::create(array_merge($ba, [
                        'invitation_id' => $invitation->id,
                    ]));
                }

                // Populate Guests
                $guestModels = [];
                foreach ($demo['guests'] as $g) {
                    $guestModels[$g['slug']] = Guest::create(array_merge($g, [
                        'invitation_id' => $invitation->id,
                    ]));
                }

                // Populate Wishes
                foreach ($demo['wishes'] as $w) {
                    Wish::create(array_merge($w, [
                        'invitation_id' => $invitation->id,
                        'is_visible' => true,
                    ]));
                }

                // Populate RSVP Simulation
                if ($demo['type'] === 'birthday') {
                    if (isset($guestModels['budi-utomo'])) {
                        Rsvp::create([
                            'invitation_id' => $invitation->id,
                            'guest_id' => $guestModels['budi-utomo']->id,
                            'attendance' => 'hadir',
                            'number_of_guests' => 2,
                        ]);
                    }
                } elseif ($demo['type'] === 'anniversary') {
                    if (isset($guestModels['denny-siregar'])) {
                        Rsvp::create([
                            'invitation_id' => $invitation->id,
                            'guest_id' => $guestModels['denny-siregar']->id,
                            'attendance' => 'hadir',
                            'number_of_guests' => 2,
                        ]);
                    }
                } elseif ($demo['type'] === 'graduation') {
                    if (isset($guestModels['agus-pratama'])) {
                        Rsvp::create([
                            'invitation_id' => $invitation->id,
                            'guest_id' => $guestModels['agus-pratama']->id,
                            'attendance' => 'hadir',
                            'number_of_guests' => 1,
                        ]);
                    }
                }
            }
        }
    }
}
