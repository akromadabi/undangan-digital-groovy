<?php
 
 namespace Database\Seeders;
 
 use App\Models\Theme;
 use App\Models\ThemeSection;
 use Illuminate\Database\Seeder;
 
 class JawaKlasikThemeSeeder extends Seeder
 {
     public function run(): void
     {
         $theme = Theme::updateOrCreate(
             ['slug' => 'jawa-klasik'],
             [
                 'name' => 'Jawa Klasik',
                 'thumbnail' => '/themes/jawa-klasik/asset/the-weding-1024x788.png',
                 'preview_url' => '/themes/jawa-klasik/asset/the-weding-1024x788.png',
                 'category' => 'Premium',
                 'color_scheme' => [
                     'primary' => '#C5A85C',
                     'secondary' => '#4E3629',
                     'bg' => '#FAF6EE',
                     'text' => '#36251C',
                     'accent' => '#C5A85C',
                 ],
                 'font_config' => [
                     'heading' => 'Playfair Display',
                     'body' => 'Poppins',
                     'script' => 'Great Vibes',
                 ],
                 'css_file' => 'jawa-klasik/style.css',
                 'supports_scroll' => true,
                 'supports_slide' => true,
                 'supports_tab' => false,
                 'is_premium' => true,
                 'is_active' => true,
                 'sort_order' => 12,
                 
                 // Default data seeded automatically when choosing the theme
                 'default_data' => [
                     'invitation' => [
                         'opening_title' => 'The Wedding Of',
                         'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
                         'opening_ayat' => 'Dan di antara ayat-ayat-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu merasa nyaman kepadanya, dan dijadikan-Nya di antaramu mawadah dan rahmah. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
                         'opening_ayat_translation' => 'Dan di antara ayat-ayat-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu merasa nyaman kepadanya, dan dijadikan-Nya di antaramu mawadah dan rahmah. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
                         'opening_ayat_source' => 'Ar-Rum: 21',
                         'closing_title' => 'Wassalamu\'alaikum Warahmatullahi Wabarakatuh',
                         'closing_text' => 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa dan restu.',
                         'turut_mengundang_text' => '',
                         'religion' => 'islam',
                         'music_url' => '',
                         'music_autoplay' => true,
                         'cover_title' => 'Nining & Munzir',
                         'cover_subtitle' => 'Sabtu, 31 Januari 2026',
                         'countdown_target_date' => '2026-01-31 08:00:00',
                         'save_the_date_enabled' => true,
                         'particle_type' => 'gold-dust',
                         'gallery_mode' => 'grid',
                         'enable_rsvp' => true,
                         'enable_wishes' => true,
                     ],
 
                     'bride_grooms' => [
                         [
                             'order_number' => 1,
                             'full_name' => 'Nineng Nadila A.Md.Kes',
                             'nickname' => 'Nining',
                             'father_name' => 'Sahari (Alm.)',
                             'mother_name' => 'Syech Ariyani',
                             'gender' => 'wanita',
                             'photo' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.24.48-1-768x1151.jpeg',
                             'bio' => '',
                             'instagram' => 'niningnabilaaa',
                             'child_order' => 'Pertama',
                         ],
                         [
                             'order_number' => 2,
                             'full_name' => 'Bripda Gusti Munzir Muntasyir',
                             'nickname' => 'Munzir',
                             'father_name' => 'Gusti Irwansyah (Alm.)',
                             'mother_name' => 'Fatmawati',
                             'gender' => 'pria',
                             'photo' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.49.09-768x1151.jpeg',
                             'bio' => '',
                             'instagram' => 'gustimunzirm',
                             'child_order' => 'Bungsu',
                         ],
                     ],
 
                     'love_stories' => [
                         [
                             'title' => 'Perkenalan',
                             'description' => 'Pertemuan pertama kami berawal dari lingkungan kerja yang sama, di mana keselarasan visi membawa kami untuk saling mengenal lebih dalam.',
                             'sort_order' => 0,
                         ],
                         [
                             'title' => 'Khitbah',
                             'description' => 'Dengan kemantapan hati dan restu dari kedua keluarga besar, kami melangsungkan prosesi lamaran suci untuk mengikat komitmen pernikahan.',
                             'sort_order' => 1,
                         ],
                         [
                             'title' => 'Pernikahan',
                             'description' => 'Di hari yang bersejarah ini, kami berjanji di hadapan Allah SWT untuk saling mengasihi, melindungi, dan melangkah bersama menuju surga-Nya.',
                             'sort_order' => 2,
                         ],
                     ],
 
                     'events' => [
                         [
                             'event_type' => 'akad',
                             'event_name' => 'Akad Nikah',
                             'event_date' => '2026-01-31',
                             'start_time' => '08:00',
                             'end_time' => '10:00',
                             'timezone' => 'WIB',
                             'venue_name' => 'Kediaman Mempelai Wanita',
                             'venue_address' => 'Jl. Kebon Agung No. 24, Mlati, Sleman, D.I. Yogyakarta',
                             'gmaps_link' => 'https://maps.google.com/',
                             'sort_order' => 0,
                             'is_primary' => true,
                         ],
                         [
                             'event_type' => 'resepsi',
                             'event_name' => 'Resepsi Pernikahan',
                             'event_date' => '2026-01-31',
                             'start_time' => '11:00',
                             'end_time' => '14:00',
                             'timezone' => 'WIB',
                             'venue_name' => 'Kediaman Mempelai Wanita',
                             'venue_address' => 'Jl. Kebon Agung No. 24, Mlati, Sleman, D.I. Yogyakarta',
                             'gmaps_link' => 'https://maps.google.com/',
                             'sort_order' => 1,
                             'is_primary' => false,
                         ],
                     ],
 
                     'galleries' => [
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.24.48-1-768x1151.jpeg', 'caption' => '', 'sort_order' => 0],
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.24.48-2-683x1024.jpeg', 'caption' => '', 'sort_order' => 1],
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.24.48-768x1151.jpeg', 'caption' => '', 'sort_order' => 2],
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.49.09-1-768x1151.jpeg', 'caption' => '', 'sort_order' => 3],
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.49.09-2-768x1151.jpeg', 'caption' => '', 'sort_order' => 4],
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.49.09-768x1151.jpeg', 'caption' => '', 'sort_order' => 5],
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.49.10-768x1151.jpeg', 'caption' => '', 'sort_order' => 6],
                         ['image_url' => '/themes/jawa-klasik/asset/WhatsApp-Image-2026-01-10-at-11.49.11-1-768x1151.jpeg', 'caption' => '', 'sort_order' => 7],
                     ],
 
                     'bank_accounts' => [
                         [
                             'bank_name' => 'BCA',
                             'account_name' => 'Nineng Nadila',
                             'account_number' => '0123456789',
                             'sort_order' => 0,
                         ],
                         [
                             'bank_name' => 'BNI',
                             'account_name' => 'Gusti Munzir Muntasyir',
                             'account_number' => '9876543210',
                             'sort_order' => 1,
                         ],
                     ],
 
                     'guests' => [
                         ['name' => 'Ahmad Fadhil', 'phone' => '081111111111', 'group_name' => 'Keluarga'],
                         ['name' => 'Siti Aisyah', 'phone' => '081222222222', 'group_name' => 'Keluarga'],
                     ],
 
                     'wishes' => [
                         ['sender_name' => 'Ahmad Fadhil', 'message' => 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fi khoir. Selamat berbahagia Nining & Munzir!'],
                         ['sender_name' => 'Siti Aisyah', 'message' => 'Selamat menempuh hidup baru! Senang melihat perpaduan adat Jawa klasik yang kental di undangan ini.'],
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
