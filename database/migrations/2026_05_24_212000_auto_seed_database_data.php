<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use App\Models\Theme;
use App\Models\ThemeSection;
use App\Models\SubscriptionPlan;
use App\Models\Feature;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Seed Plans if empty
        if (DB::table('subscription_plans')->count() === 0) {
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
        }

        // 2. Seed Features if empty
        if (DB::table('features')->count() === 0) {
            $features = [
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
                ['name' => 'Cover', 'slug' => 'cover', 'category' => 'settings', 'icon' => 'MdImage'],
                ['name' => 'Tamu', 'slug' => 'guest', 'category' => 'settings', 'icon' => 'MdPersonAdd'],
                ['name' => 'RSVP', 'slug' => 'rsvp', 'category' => 'settings', 'icon' => 'MdFactCheck'],
                ['name' => 'Musik', 'slug' => 'music', 'category' => 'settings', 'icon' => 'MdMusicNote'],
                ['name' => 'Hadiah', 'slug' => 'gift', 'category' => 'settings', 'icon' => 'MdCardGiftcard'],
                ['name' => 'Kirim WhatsApp', 'slug' => 'whatsapp', 'category' => 'settings', 'icon' => 'MdWhatsapp'],
                ['name' => 'Template', 'slug' => 'template', 'category' => 'settings', 'icon' => 'MdPalette'],
            ];

            foreach ($features as $f) {
                Feature::create($f);
            }
        }

        // 3. Seed Themes if empty
        if (DB::table('themes')->count() === 0) {
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

            $defaultSections = [
                ['section_key' => 'cover', 'section_name' => 'Cover', 'component_name' => 'CoverSection', 'default_order' => 1, 'is_removable' => false],
                ['section_key' => 'opening', 'section_name' => 'Opening', 'component_name' => 'OpeningSection', 'default_order' => 2, 'is_removable' => true],
                ['section_key' => 'bride_groom', 'section_name' => 'Mempelai', 'component_name' => 'BrideGroomSection', 'default_order' => 3, 'is_removable' => true],
                ['section_key' => 'countdown', 'section_name' => 'Save The Date', 'component_name' => 'CountdownSection', 'default_order' => 4, 'is_removable' => true],
                ['section_key' => 'love_story', 'section_name' => 'Kisah Cinta', 'component_name' => 'LoveStorySection', 'default_order' => 5, 'is_removable' => true],
                ['section_key' => 'event', 'section_name' => 'Acara', 'component_name' => 'EventSection', 'default_order' => 6, 'is_removable' => true],
                ['section_key' => 'gallery', 'section_name' => 'Galeri', 'component_name' => 'GallerySection', 'default_order' => 7, 'is_removable' => true],
                ['section_key' => 'rsvp', 'section_name' => 'RSVP', 'component_name' => 'RsvpSection', 'default_order' => 8, 'is_removable' => true],
                ['section_key' => 'wishes', 'section_name' => 'Ucapan', 'component_name' => 'WishesSection', 'default_order' => 9, 'is_removable' => true],
                ['section_key' => 'bank', 'section_name' => 'Amplop Digital', 'component_name' => 'BankSection', 'default_order' => 10, 'is_removable' => true],
                ['section_key' => 'closing', 'section_name' => 'Penutup', 'component_name' => 'ClosingSection', 'default_order' => 11, 'is_removable' => true],
            ];

            foreach ($defaultSections as $section) {
                ThemeSection::create(array_merge($section, ['theme_id' => $theme5->id]));
            }

            // Run external seeders
            try {
                Artisan::call('db:seed', ['--class' => 'UtaryThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'QuoteTemplateSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'NetflixThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'Luxury01ThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'Luxury02ThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'Luxury03ThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'ArunaThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'Luxury04ThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'WayangThemeSeeder', '--force' => true]);
            } catch (\Exception $e) {
                // Silently ignore if some seeders fail (e.g. classes not compiled yet)
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
