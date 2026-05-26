<?php
 
 namespace Database\Seeders;
 
 use App\Models\Theme;
 use App\Models\ThemeSection;
 use Illuminate\Database\Seeder;
 
 class DuskMosqueThemeSeeder extends Seeder
 {
     public function run(): void
     {
         $theme = Theme::updateOrCreate(
             ['slug' => 'dusk-mosque'],
             [
                 'name' => 'Dusk Mosque',
                 'thumbnail' => '/themes/dusk-mosque/asset/gallery-1.webp',
                 'preview_url' => '/themes/dusk-mosque/asset/gallery-1.webp',
                 'category' => 'Premium',
                 'color_scheme' => [
                     'primary' => '#735B3F',
                     'secondary' => '#FAF3EA',
                     'bg' => '#2A1F17',
                     'text' => '#FAF3EA',
                     'accent' => '#735B3F',
                 ],
                 'font_config' => [
                     'heading' => 'Playfair Display',
                     'body' => 'Cabin',
                     'script' => 'Great Vibes',
                 ],
                 'css_file' => 'dusk-mosque/style.css',
                 'supports_scroll' => true,
                 'supports_slide' => true,
                 'supports_tab' => false,
                 'is_premium' => true,
                 'is_active' => true,
                 'sort_order' => 11,
                 
                 // Default data seeded automatically when choosing the theme
                 'default_data' => [
                     'invitation' => [
                         'opening_title' => 'The Wedding Of',
                         'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
                         'opening_ayat' => 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
                         'opening_ayat_translation' => 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
                         'opening_ayat_source' => 'QS. Ar-Rum: 21',
                         'closing_title' => 'Wassalamu\'alaikum Warahmatullahi Wabarakatuh',
                         'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa dan restu.',
                         'turut_mengundang_text' => '',
                         'religion' => 'islam',
                         'music_url' => '',
                         'music_autoplay' => true,
                         'cover_title' => 'Rizki & Aisyah',
                         'cover_subtitle' => 'Minggu, 20 Juni 2027',
                         'countdown_target_date' => '2027-06-20 08:00:00',
                         'save_the_date_enabled' => true,
                         'particle_type' => 'gold-dust',
                         'gallery_mode' => 'grid',
                         'enable_rsvp' => true,
                         'enable_wishes' => true,
                     ],
 
                     'bride_grooms' => [
                         [
                             'order_number' => 1,
                             'full_name' => 'Aisyah Khairunnisa',
                             'nickname' => 'Aisyah',
                             'father_name' => 'Ahmad Fauzi',
                             'mother_name' => 'Aminah Latifah',
                             'gender' => 'wanita',
                             'photo' => '/themes/dusk-mosque/asset/couple.webp',
                             'bio' => '',
                             'instagram' => 'aisyah.kn',
                             'child_order' => 'Kedua',
                         ],
                         [
                             'order_number' => 2,
                             'full_name' => 'Muhammad Rizki Pratama',
                             'nickname' => 'Rizki',
                             'father_name' => 'Hidayat Pratama',
                             'mother_name' => 'Siti Maryam',
                             'gender' => 'pria',
                             'photo' => '/themes/dusk-mosque/asset/couple.webp',
                             'bio' => '',
                             'instagram' => 'rizki.pratama',
                             'child_order' => 'Pertama',
                         ],
                     ],
 
                     'love_stories' => [
                         [
                             'title' => 'Awal Bertemu',
                             'description' => 'Berkenalan lewat halaqah kampus, dari salam yang singkat menjadi obrolan tentang masa depan yang panjang.',
                             'sort_order' => 0,
                         ],
                         [
                             'title' => 'Ta\'aruf',
                             'description' => 'Dengan niat baik dan restu keluarga, kami melangkah ke proses ta\'aruf yang membawa hati kami lebih dekat.',
                             'sort_order' => 1,
                         ],
                         [
                             'title' => 'Khitbah',
                             'description' => 'Di hadapan kedua keluarga, Rizki datang dengan niat tulus dan mengikat janji untuk melamar Aisyah.',
                             'sort_order' => 2,
                         ],
                         [
                             'title' => 'Hari Akad',
                             'description' => 'Dan di sinilah kami sekarang, di ambang janji suci yang akan menyatukan kami dalam ridho-Nya.',
                             'sort_order' => 3,
                         ],
                     ],
 
                     'events' => [
                         [
                             'event_type' => 'akad',
                             'event_name' => 'Akad Nikah',
                             'event_date' => '2027-06-20',
                             'start_time' => '08:00',
                             'end_time' => '10:00',
                             'timezone' => 'WIB',
                             'venue_name' => 'Masjid Istiqlal Jakarta',
                             'venue_address' => 'Jl. Taman Wijaya Kusuma, Pasar Baru, Jakarta Pusat 10710',
                             'gmaps_link' => 'https://maps.google.com/?q=Masjid+Istiqlal+Jakarta',
                             'sort_order' => 0,
                             'is_primary' => true,
                         ],
                         [
                             'event_type' => 'resepsi',
                             'event_name' => 'Resepsi',
                             'event_date' => '2027-06-20',
                             'start_time' => '11:00',
                             'end_time' => '14:00',
                             'timezone' => 'WIB',
                             'venue_name' => 'Masjid Istiqlal Jakarta',
                             'venue_address' => 'Jl. Taman Wijaya Kusuma, Pasar Baru, Jakarta Pusat 10710',
                             'gmaps_link' => 'https://maps.google.com/?q=Masjid+Istiqlal+Jakarta',
                             'sort_order' => 1,
                             'is_primary' => false,
                         ],
                     ],
 
                     'galleries' => [
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-1.webp', 'caption' => '', 'sort_order' => 0],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-2.webp', 'caption' => '', 'sort_order' => 1],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-3.webp', 'caption' => '', 'sort_order' => 2],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-4.webp', 'caption' => '', 'sort_order' => 3],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-6.webp', 'caption' => '', 'sort_order' => 4],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-7.webp', 'caption' => '', 'sort_order' => 5],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-8.webp', 'caption' => '', 'sort_order' => 6],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-9.webp', 'caption' => '', 'sort_order' => 7],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-10.webp', 'caption' => '', 'sort_order' => 8],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-11.webp', 'caption' => '', 'sort_order' => 9],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-12.webp', 'caption' => '', 'sort_order' => 10],
                         ['image_url' => '/themes/dusk-mosque/asset/gallery-13.webp', 'caption' => '', 'sort_order' => 11],
                     ],
 
                     'bank_accounts' => [
                         [
                             'bank_name' => 'BCA',
                             'account_name' => 'Sinta Dewi Paramitha',
                             'account_number' => '0123456789',
                             'sort_order' => 0,
                         ],
                         [
                             'bank_name' => 'GOPAY',
                             'account_name' => 'Arya Wicaksana',
                             'account_number' => '081234567890',
                             'sort_order' => 1,
                         ],
                     ],
 
                     'guests' => [
                         ['name' => 'Ahmad Fadhil', 'phone' => '081111111111', 'group_name' => 'Keluarga'],
                         ['name' => 'Siti Aisyah', 'phone' => '081222222222', 'group_name' => 'Keluarga'],
                     ],
 
                     'wishes' => [
                         ['sender_name' => 'Ahmad Fadhil', 'message' => 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fi khoir. Semoga sakinah mawaddah wa rahmah ya Aisyah & Rizki!'],
                         ['sender_name' => 'Siti Aisyah', 'message' => 'Selamat berbahagia untuk kedua mempelai! Sangat menyukai tema Dusk Mosque yang indah ini.'],
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
