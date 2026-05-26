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
            // Run external seeders
            try {
                Artisan::call('db:seed', ['--class' => 'UtaryThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'QuoteTemplateSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'NetflixThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'Luxury01ThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'Luxury02ThemeSeeder', '--force' => true]);
                Artisan::call('db:seed', ['--class' => 'Luxury03ThemeSeeder', '--force' => true]);
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
