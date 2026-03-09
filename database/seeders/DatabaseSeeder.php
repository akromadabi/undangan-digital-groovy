<?php

namespace Database\Seeders;

use App\Models\Feature;
use App\Models\GlobalSetting;
use App\Models\PlanFeatureAccess;
use App\Models\SubscriptionPlan;
use App\Models\Theme;
use App\Models\ThemeSection;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ═══════════════════════════════════════
        // 1. ADMIN USER
        // ═══════════════════════════════════════
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@groovy.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'onboarding_step' => 6,
            'email_verified_at' => now(),
        ]);

        // ═══════════════════════════════════════
        // 2. SUBSCRIPTION PLANS
        // ═══════════════════════════════════════
        $free = SubscriptionPlan::create([
            'name' => 'Free',
            'slug' => 'free',
            'description' => 'Paket gratis dengan fitur terbatas',
            'price' => 0,
            'duration_days' => 0,
            'max_guests' => 50,
            'max_galleries' => 3,
            'sort_order' => 1,
        ]);

        $silver = SubscriptionPlan::create([
            'name' => 'Silver',
            'slug' => 'silver',
            'description' => 'Paket dasar untuk undangan digital',
            'price' => 49000,
            'duration_days' => 90,
            'max_guests' => 200,
            'max_galleries' => 10,
            'sort_order' => 2,
        ]);

        $gold = SubscriptionPlan::create([
            'name' => 'Gold',
            'slug' => 'gold',
            'description' => 'Paket lengkap dengan semua fitur',
            'price' => 99000,
            'duration_days' => 180,
            'max_guests' => 500,
            'max_galleries' => 25,
            'sort_order' => 3,
        ]);

        $platinum = SubscriptionPlan::create([
            'name' => 'Platinum',
            'slug' => 'platinum',
            'description' => 'Paket premium tanpa batas',
            'price' => 199000,
            'duration_days' => 365,
            'max_guests' => 9999,
            'max_galleries' => 50,
            'sort_order' => 4,
        ]);

        // ═══════════════════════════════════════
        // 3. FEATURES (Lockable)
        // ═══════════════════════════════════════
        $features = [
            // Content features
            ['name' => 'Opening', 'slug' => 'opening', 'category' => 'content', 'icon' => 'MdOutlineWavingHand'],
            ['name' => 'Mempelai', 'slug' => 'bride_groom', 'category' => 'content', 'icon' => 'MdPeople'],
            ['name' => 'Acara', 'slug' => 'event', 'category' => 'content', 'icon' => 'MdEvent'],
            ['name' => 'Galeri', 'slug' => 'gallery', 'category' => 'content', 'icon' => 'MdPhotoLibrary'],
            ['name' => 'Kisah Cinta', 'slug' => 'love_story', 'category' => 'content', 'icon' => 'MdFavorite'],
            ['name' => 'Bank / E-Wallet', 'slug' => 'bank', 'category' => 'content', 'icon' => 'MdAccountBalance'],
            ['name' => 'Penutup', 'slug' => 'closing', 'category' => 'content', 'icon' => 'MdFlag'],
            ['name' => 'Guestbook', 'slug' => 'guestbook', 'category' => 'content', 'icon' => 'MdMenuBook'],
            ['name' => 'Save The Date', 'slug' => 'save_the_date', 'category' => 'content', 'icon' => 'MdCalendarToday'],
            ['name' => 'Turut Mengundang', 'slug' => 'turut_mengundang', 'category' => 'content', 'icon' => 'MdGroups'],
            ['name' => 'BrideGroom Detail', 'slug' => 'bride_groom_detail', 'category' => 'content', 'icon' => 'MdPersonPin'],

            // Settings features
            ['name' => 'Cover', 'slug' => 'cover', 'category' => 'settings', 'icon' => 'MdImage'],
            ['name' => 'Tamu', 'slug' => 'guest', 'category' => 'settings', 'icon' => 'MdPersonAdd'],
            ['name' => 'RSVP', 'slug' => 'rsvp', 'category' => 'settings', 'icon' => 'MdFactCheck'],
            ['name' => 'Musik', 'slug' => 'music', 'category' => 'settings', 'icon' => 'MdMusicNote'],
            ['name' => 'Hadiah', 'slug' => 'gift', 'category' => 'settings', 'icon' => 'MdCardGiftcard'],
            ['name' => 'Kirim WhatsApp', 'slug' => 'whatsapp', 'category' => 'settings', 'icon' => 'MdWhatsapp'],
            ['name' => 'Template', 'slug' => 'template', 'category' => 'settings', 'icon' => 'MdPalette'],
        ];

        $featureModels = [];
        foreach ($features as $f) {
            $featureModels[$f['slug']] = Feature::create($f);
        }

        // ═══════════════════════════════════════
        // 4. PLAN-FEATURE ACCESS
        // ═══════════════════════════════════════

        // Free plan: basic features only
        $freeEnabled = ['opening', 'bride_groom', 'event', 'gallery', 'closing', 'guestbook', 'cover', 'guest', 'rsvp', 'template'];
        $freeLocked = ['love_story', 'bank', 'save_the_date', 'turut_mengundang', 'bride_groom_detail', 'music', 'gift', 'whatsapp'];

        foreach ($featureModels as $slug => $feature) {
            PlanFeatureAccess::create([
                'plan_id' => $free->id,
                'feature_id' => $feature->id,
                'is_enabled' => in_array($slug, $freeEnabled),
            ]);
        }

        // Silver plan: most features unlocked
        $silverLocked = ['gift', 'bride_groom_detail'];
        foreach ($featureModels as $slug => $feature) {
            PlanFeatureAccess::create([
                'plan_id' => $silver->id,
                'feature_id' => $feature->id,
                'is_enabled' => !in_array($slug, $silverLocked),
            ]);
        }

        // Gold & Platinum: all features enabled
        foreach ([$gold, $platinum] as $plan) {
            foreach ($featureModels as $feature) {
                PlanFeatureAccess::create([
                    'plan_id' => $plan->id,
                    'feature_id' => $feature->id,
                    'is_enabled' => true,
                ]);
            }
        }

        // ═══════════════════════════════════════
        // 5. DEFAULT THEMES
        // ═══════════════════════════════════════
        $defaultTheme = Theme::create([
            'name' => 'Elegant Rose',
            'slug' => 'elegant-rose',
            'thumbnail' => '/themes/elegant-rose/thumbnail.jpg',
            'category' => 'floral',
            'color_scheme' => [
                'primary' => '#B76E79',
                'secondary' => '#F5E6E0',
                'accent' => '#C49A6C',
                'bg' => '#FFF9F5',
                'text' => '#2D2D2D',
            ],
            'font_config' => [
                'heading' => 'Playfair Display',
                'body' => 'Inter',
                'script' => 'Great Vibes',
            ],
            'is_premium' => false,
            'sort_order' => 1,
        ]);

        $theme2 = Theme::create([
            'name' => 'Garden Navy',
            'slug' => 'garden-navy',
            'thumbnail' => '/themes/garden-navy/thumbnail.jpg',
            'category' => 'elegant',
            'color_scheme' => [
                'primary' => '#1B3A5C',
                'secondary' => '#E8D5B7',
                'accent' => '#C8A951',
                'bg' => '#0D1B2A',
                'text' => '#F0E6D3',
            ],
            'font_config' => [
                'heading' => 'Cormorant Garamond',
                'body' => 'Lato',
                'script' => 'Dancing Script',
            ],
            'is_premium' => false,
            'sort_order' => 2,
        ]);

        $theme3 = Theme::create([
            'name' => 'Modern Black',
            'slug' => 'modern-black',
            'thumbnail' => '/themes/modern-black/thumbnail.jpg',
            'category' => 'modern',
            'color_scheme' => [
                'primary' => '#FFD700',
                'secondary' => '#1A1A1A',
                'accent' => '#FFFFFF',
                'bg' => '#000000',
                'text' => '#FFFFFF',
            ],
            'font_config' => [
                'heading' => 'Montserrat',
                'body' => 'Poppins',
                'script' => 'Sacramento',
            ],
            'is_premium' => true,
            'sort_order' => 3,
        ]);

        $theme4 = Theme::create([
            'name' => 'Islamic Green',
            'slug' => 'islamic-green',
            'thumbnail' => '/themes/islamic-green/thumbnail.jpg',
            'category' => 'islamic',
            'color_scheme' => [
                'primary' => '#2D6A4F',
                'secondary' => '#D8F3DC',
                'accent' => '#C8A951',
                'bg' => '#F0FFF4',
                'text' => '#1B4332',
            ],
            'font_config' => [
                'heading' => 'Amiri',
                'body' => 'Inter',
                'script' => 'Arizonia',
            ],
            'is_premium' => false,
            'sort_order' => 4,
        ]);

        $theme5 = Theme::create([
            'name' => 'Adat Jawa',
            'slug' => 'adat-jawa',
            'thumbnail' => '/themes/adat-jawa/the-wedding.png',
            'category' => 'islamic',
            'color_scheme' => [
                'primary' => '#C5963B',
                'secondary' => '#8B6914',
                'bg' => '#FFF9F0',
                'text' => '#2D2D2D',
                'accent' => '#DAA520',
            ],
            'font_config' => [
                'heading' => 'Cinzel',
                'body' => 'Poppins',
                'script' => 'Great Vibes',
            ],
            'is_premium' => true,
            'sort_order' => 5,
        ]);

        // Default sections for each theme
        $defaultSections = [
            ['section_key' => 'cover', 'section_name' => 'Cover', 'component_name' => 'CoverSection', 'default_order' => 1, 'is_removable' => false],
            ['section_key' => 'opening', 'section_name' => 'Opening', 'component_name' => 'OpeningSection', 'default_order' => 2, 'is_removable' => true],
            ['section_key' => 'bride_groom', 'section_name' => 'Mempelai', 'component_name' => 'BrideGroomSection', 'default_order' => 3, 'is_removable' => true],
            ['section_key' => 'event', 'section_name' => 'Acara', 'component_name' => 'EventSection', 'default_order' => 4, 'is_removable' => true],
            ['section_key' => 'countdown', 'section_name' => 'Save The Date', 'component_name' => 'CountdownSection', 'default_order' => 5, 'is_removable' => true],
            ['section_key' => 'gallery', 'section_name' => 'Galeri', 'component_name' => 'GallerySection', 'default_order' => 6, 'is_removable' => true],
            ['section_key' => 'love_story', 'section_name' => 'Kisah Cinta', 'component_name' => 'LoveStorySection', 'default_order' => 7, 'is_removable' => true],
            ['section_key' => 'bank', 'section_name' => 'Amplop Digital', 'component_name' => 'BankSection', 'default_order' => 8, 'is_removable' => true],
            ['section_key' => 'rsvp', 'section_name' => 'RSVP', 'component_name' => 'RsvpSection', 'default_order' => 9, 'is_removable' => true],
            ['section_key' => 'wishes', 'section_name' => 'Ucapan', 'component_name' => 'WishesSection', 'default_order' => 10, 'is_removable' => true],
            ['section_key' => 'closing', 'section_name' => 'Penutup', 'component_name' => 'ClosingSection', 'default_order' => 11, 'is_removable' => true],
        ];

        foreach ([$defaultTheme, $theme2, $theme3, $theme4, $theme5] as $theme) {
            foreach ($defaultSections as $section) {
                ThemeSection::create(array_merge($section, ['theme_id' => $theme->id]));
            }
        }

        // ═══════════════════════════════════════
        // 6. GLOBAL SETTINGS
        // ═══════════════════════════════════════
        $settings = [
            // General
            ['setting_key' => 'site_name', 'setting_value' => 'Undangan Digital Groovy', 'setting_type' => 'string', 'category' => 'general', 'description' => 'Nama situs'],
            ['setting_key' => 'site_domain', 'setting_value' => 'groovy.com', 'setting_type' => 'string', 'category' => 'general', 'description' => 'Domain utama'],
            ['setting_key' => 'site_tagline', 'setting_value' => 'Buat Undangan Digital Premium dalam Hitungan Menit', 'setting_type' => 'string', 'category' => 'general', 'description' => 'Tagline situs'],
            ['setting_key' => 'default_locale', 'setting_value' => 'id', 'setting_type' => 'string', 'category' => 'general', 'description' => 'Bahasa default (id/en)'],

            // Xendit Payment
            ['setting_key' => 'xendit_mode', 'setting_value' => 'sandbox', 'setting_type' => 'string', 'category' => 'payment', 'description' => 'Mode: sandbox / production'],
            ['setting_key' => 'xendit_secret_key', 'setting_value' => '', 'setting_type' => 'string', 'category' => 'payment', 'description' => 'Xendit Secret API Key'],
            ['setting_key' => 'xendit_webhook_token', 'setting_value' => '', 'setting_type' => 'string', 'category' => 'payment', 'description' => 'Xendit Webhook Verification Token'],
            ['setting_key' => 'xendit_success_url', 'setting_value' => '/dashboard?payment=success', 'setting_type' => 'string', 'category' => 'payment', 'description' => 'Redirect URL setelah bayar sukses'],
            ['setting_key' => 'xendit_failure_url', 'setting_value' => '/dashboard?payment=failed', 'setting_type' => 'string', 'category' => 'payment', 'description' => 'Redirect URL setelah bayar gagal'],

            // MP WA V9
            ['setting_key' => 'mpwav9_api_url', 'setting_value' => '', 'setting_type' => 'string', 'category' => 'whatsapp', 'description' => 'URL API MP WA V9 (contoh: https://api.mpwav9.com)'],
            ['setting_key' => 'mpwav9_api_token', 'setting_value' => '', 'setting_type' => 'string', 'category' => 'whatsapp', 'description' => 'Token API MP WA V9'],
            ['setting_key' => 'mpwav9_device_id', 'setting_value' => '', 'setting_type' => 'string', 'category' => 'whatsapp', 'description' => 'Device ID MP WA V9'],
            ['setting_key' => 'mpwav9_sender_number', 'setting_value' => '', 'setting_type' => 'string', 'category' => 'whatsapp', 'description' => 'Nomor pengirim WA'],
        ];

        foreach ($settings as $s) {
            GlobalSetting::create($s);
        }

        // ═══════════════════════════════════════
        // 7. DUMMY USER — Gold (Complete Invitation)
        // ═══════════════════════════════════════
        $userGold = User::create([
            'name' => 'Mira Rahayu',
            'email' => 'mira@test.com',
            'password' => Hash::make('password'),
            'phone' => '081234567890',
            'role' => 'user',
            'is_active' => true,
            'onboarding_step' => 6,
            'email_verified_at' => now(),
        ]);

        // Gold subscription
        $goldPayment = \App\Models\Payment::create([
            'user_id' => $userGold->id,
            'plan_id' => $gold->id,
            'amount' => $gold->price,
            'payment_gateway' => 'xendit',
            'status' => 'paid',
            'paid_at' => now()->subDays(5),
        ]);

        \App\Models\Subscription::create([
            'user_id' => $userGold->id,
            'plan_id' => $gold->id,
            'payment_id' => $goldPayment->id,
            'starts_at' => now()->subDays(5),
            'expires_at' => now()->addDays(175),
            'status' => 'active',
        ]);

        // Invitation
        $invitation = \App\Models\Invitation::create([
            'user_id' => $userGold->id,
            'theme_id' => $defaultTheme->id,
            'slug' => 'mira-randi',
            'title' => 'Pernikahan Mira & Randi',
            'layout_mode' => 'scroll',
            'is_active' => true,
            'opening_title' => 'Bismillahirrahmanirrahim',
            'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.",
            'opening_ayat' => 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
            'closing_title' => 'Terima Kasih',
            'closing_text' => "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
            'cover_title' => 'The Wedding Of',
            'cover_subtitle' => 'Mira & Randi',
            'music_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'music_autoplay' => true,
        ]);

        // Bride & Groom
        \App\Models\BrideGroom::create([
            'invitation_id' => $invitation->id,
            'full_name' => 'Mira Rahayu Putri',
            'nickname' => 'Mira',
            'order_number' => 1,
            'gender' => 'wanita',
            'father_name' => 'H. Ahmad Rahayu',
            'mother_name' => 'Hj. Siti Aminah',
            'child_order' => 'Kedua',
            'bio' => 'Sarjana Psikologi dari Universitas Indonesia. Pecinta kucing dan kopi.',
            'instagram' => '@mirarahayup',
        ]);

        \App\Models\BrideGroom::create([
            'invitation_id' => $invitation->id,
            'full_name' => 'Randi Pratama Wijaya',
            'nickname' => 'Randi',
            'order_number' => 2,
            'gender' => 'pria',
            'father_name' => 'Ir. Budi Wijaya',
            'mother_name' => 'Dr. Ratna Dewi',
            'child_order' => 'Pertama',
            'bio' => 'Software Engineer. Suka bermain gitar dan traveling.',
            'instagram' => '@randipw',
        ]);

        // Events
        $weddingDate = now()->addDays(30);
        \App\Models\Event::create([
            'invitation_id' => $invitation->id,
            'event_type' => 'akad',
            'event_name' => 'Akad Nikah',
            'event_date' => $weddingDate->format('Y-m-d'),
            'start_time' => '08:00',
            'end_time' => '10:00',
            'timezone' => 'WIB',
            'venue_name' => 'Masjid Agung Al-Azhar',
            'venue_address' => 'Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan 12110',
            'gmaps_link' => 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta',
        ]);

        \App\Models\Event::create([
            'invitation_id' => $invitation->id,
            'event_type' => 'resepsi',
            'event_name' => 'Resepsi',
            'event_date' => $weddingDate->format('Y-m-d'),
            'start_time' => '11:00',
            'end_time' => '14:00',
            'timezone' => 'WIB',
            'venue_name' => 'Balai Kartini',
            'venue_address' => 'Jl. Gatot Subroto Kav. 37, Jakarta Selatan 12950',
            'gmaps_link' => 'https://maps.google.com/?q=Balai+Kartini+Jakarta',
        ]);

        // Gallery (placeholder URLs)
        foreach ([
            ['url' => 'https://picsum.photos/seed/wedding1/800/1200', 'caption' => 'Pre-wedding di Bromo'],
            ['url' => 'https://picsum.photos/seed/wedding2/800/800', 'caption' => 'Sunset moment'],
            ['url' => 'https://picsum.photos/seed/wedding3/800/800', 'caption' => 'Together forever'],
        ] as $i => $photo) {
            \App\Models\Gallery::create([
                'invitation_id' => $invitation->id,
                'image_url' => $photo['url'],
                'caption' => $photo['caption'],
                'sort_order' => $i + 1,
            ]);
        }

        // Love Story
        foreach ([
            ['title' => 'Pertama Bertemu', 'date' => now()->subYears(3)->format('Y-m-d'), 'desc' => 'Kami pertama kali bertemu di acara reuni kampus. Saat itu mata kami bertemu dan semuanya terasa berbeda.'],
            ['title' => 'Mulai Berpacaran', 'date' => now()->subYears(2)->subMonths(6)->format('Y-m-d'), 'desc' => 'Setelah sering ngobrol dan jalan berdua, akhirnya Randi memberanikan diri untuk menyatakan perasaannya.'],
            ['title' => 'Lamaran', 'date' => now()->subMonths(3)->format('Y-m-d'), 'desc' => 'Di sebuah restoran rooftop dengan pemandangan kota Jakarta, Randi berlutut dan berkata "Maukah kamu menikah denganku?"'],
        ] as $i => $story) {
            \App\Models\LoveStory::create([
                'invitation_id' => $invitation->id,
                'title' => $story['title'],
                'story_date' => $story['date'],
                'description' => $story['desc'],
                'sort_order' => $i + 1,
            ]);
        }

        // Bank Accounts
        \App\Models\BankAccount::create([
            'invitation_id' => $invitation->id,
            'bank_name' => 'BCA',
            'account_name' => 'Mira Rahayu Putri',
            'account_number' => '0123456789',
        ]);

        \App\Models\BankAccount::create([
            'invitation_id' => $invitation->id,
            'bank_name' => 'GoPay',
            'account_name' => 'Randi Pratama',
            'account_number' => '081234567890',
        ]);

        // Guests
        $guestsData = [
            ['name' => 'Ahmad Fadhil', 'phone' => '081111111111', 'group' => 'Keluarga'],
            ['name' => 'Siti Aisyah', 'phone' => '081222222222', 'group' => 'Keluarga'],
            ['name' => 'Budi Hartono', 'phone' => '081333333333', 'group' => 'Kantor'],
            ['name' => 'Dewi Sartika', 'phone' => '081444444444', 'group' => 'Kantor'],
            ['name' => 'Eko Prasetyo', 'phone' => '081555555555', 'group' => 'Teman'],
            ['name' => 'Fitri Handayani', 'phone' => '081666666666', 'group' => 'Teman'],
            ['name' => 'Gunawan', 'phone' => '081777777777', 'group' => 'Teman'],
            ['name' => 'Hesti Utami', 'phone' => '081888888888', 'group' => 'Teman'],
            ['name' => 'Irfan Maulana', 'phone' => '081999999999', 'group' => 'Kampus'],
            ['name' => 'Joko Widodo', 'phone' => '', 'group' => 'Tetangga'],
        ];

        $guestModels = [];
        foreach ($guestsData as $g) {
            $guestModels[] = \App\Models\Guest::create([
                'invitation_id' => $invitation->id,
                'name' => $g['name'],
                'phone' => $g['phone'],
                'group_name' => $g['group'],
                'max_pax' => 2,
                'slug' => \Illuminate\Support\Str::slug($g['name']),
            ]);
        }

        // Mark some guests as opened + WA sent
        $guestModels[0]->update(['is_opened' => true, 'opened_at' => now()->subDays(2), 'wa_sent' => true, 'wa_sent_at' => now()->subDays(3)]);
        $guestModels[1]->update(['is_opened' => true, 'opened_at' => now()->subDay(), 'wa_sent' => true, 'wa_sent_at' => now()->subDays(2)]);
        $guestModels[2]->update(['wa_sent' => true, 'wa_sent_at' => now()->subDay()]);

        // Wishes
        foreach ([
            ['guest' => 0, 'name' => 'Ahmad Fadhil', 'msg' => 'Barakallahu lakuma wa baraka alaikuma. Semoga menjadi keluarga sakinah mawaddah wa rahmah! 🤲'],
            ['guest' => 1, 'name' => 'Siti Aisyah', 'msg' => 'Selamat menempuh hidup baru! Semoga bahagia selalu ya Mira & Randi 💕'],
            ['guest' => 4, 'name' => 'Eko Prasetyo', 'msg' => 'Bro Randi, akhirnya nyusul juga! 😆 Happy wedding bro, semoga langgeng!'],
            ['guest' => 5, 'name' => 'Fitri Handayani', 'msg' => 'Miraaaa! Akhirnya! 🥺🎉 Semoga pernikahan kalian penuh keberkahan. Love you!'],
            ['guest' => null, 'name' => 'Tamu Tidak Dikenal', 'msg' => 'Selamat menikah! Semoga bahagia 🎊'],
        ] as $w) {
            \App\Models\Wish::create([
                'invitation_id' => $invitation->id,
                'guest_id' => $w['guest'] !== null ? $guestModels[$w['guest']]->id : null,
                'sender_name' => $w['name'],
                'message' => $w['msg'],
            ]);
        }

        // RSVPs
        \App\Models\Rsvp::create(['invitation_id' => $invitation->id, 'guest_id' => $guestModels[0]->id, 'attendance' => 'hadir', 'number_of_guests' => 2]);
        \App\Models\Rsvp::create(['invitation_id' => $invitation->id, 'guest_id' => $guestModels[1]->id, 'attendance' => 'hadir', 'number_of_guests' => 1]);
        \App\Models\Rsvp::create(['invitation_id' => $invitation->id, 'guest_id' => $guestModels[4]->id, 'attendance' => 'belum_pasti', 'number_of_guests' => 1]);

        // Invitation Sections
        foreach ($defaultSections as $section) {
            \App\Models\InvitationSection::create([
                'invitation_id' => $invitation->id,
                'section_key' => $section['section_key'],
                'section_name' => $section['section_name'],
                'sort_order' => $section['default_order'],
                'is_visible' => true,
            ]);
        }

        // ═══════════════════════════════════════
        // 8. DUMMY USER — Free (Basic)
        // ═══════════════════════════════════════
        $userFree = User::create([
            'name' => 'Andi Setiawan',
            'email' => 'andi@test.com',
            'password' => Hash::make('password'),
            'phone' => '089876543210',
            'role' => 'user',
            'is_active' => true,
            'onboarding_step' => 6,
            'email_verified_at' => now(),
        ]);

        $invitationFree = \App\Models\Invitation::create([
            'user_id' => $userFree->id,
            'theme_id' => $theme4->id,
            'slug' => 'andi-sari',
            'title' => 'Pernikahan Andi & Sari',
            'layout_mode' => 'scroll',
            'is_active' => true,
            'opening_title' => 'Bismillah',
            'opening_text' => 'Dengan memohon ridho Allah SWT, kami mengundang Anda.',
            'closing_title' => 'Terima Kasih',
            'closing_text' => 'Terima kasih atas doa dan kehadirannya.',
            'cover_title' => 'The Wedding Of',
            'cover_subtitle' => 'Andi & Sari',
        ]);

        \App\Models\BrideGroom::create([
            'invitation_id' => $invitationFree->id,
            'full_name' => 'Sari Puspita',
            'nickname' => 'Sari',
            'order_number' => 1,
            'gender' => 'wanita',
            'father_name' => 'Pak Hendra',
            'mother_name' => 'Bu Yanti',
        ]);

        \App\Models\BrideGroom::create([
            'invitation_id' => $invitationFree->id,
            'full_name' => 'Andi Setiawan',
            'nickname' => 'Andi',
            'order_number' => 2,
            'gender' => 'pria',
            'father_name' => 'Pak Dedi',
            'mother_name' => 'Bu Rina',
        ]);

        foreach ($defaultSections as $section) {
            \App\Models\InvitationSection::create([
                'invitation_id' => $invitationFree->id,
                'section_key' => $section['section_key'],
                'section_name' => $section['section_name'],
                'sort_order' => $section['default_order'],
                'is_visible' => true,
            ]);
        }
    }
}
