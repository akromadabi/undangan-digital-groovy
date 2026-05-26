<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $seeders = [
            'shopee' => 'ShopeeThemeSeeder',
            'wayang' => 'WayangThemeSeeder',
            'utary' => 'UtaryThemeSeeder',
            'netflix' => 'NetflixThemeSeeder',
            'luxury-01' => 'Luxury01ThemeSeeder',
            'luxury-02' => 'Luxury02ThemeSeeder',
            'luxury-03' => 'Luxury03ThemeSeeder',
            'luxury-04' => 'Luxury04ThemeSeeder',
        ];

        foreach ($seeders as $slug => $seederClass) {
            $exists = DB::table('themes')->where('slug', $slug)->exists();
            if (!$exists) {
                try {
                    Artisan::call('db:seed', ['--class' => $seederClass, '--force' => true]);
                } catch (\Exception $e) {
                    \Log::error("Failed seeding theme {$slug} with seeder {$seederClass}: " . $e->getMessage());
                }
            }
        }
    }

    public function down(): void
    {
        // No rollback
    }
};
