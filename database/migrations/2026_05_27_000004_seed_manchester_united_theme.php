<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $slug = 'manchester-united';
        $exists = DB::table('themes')->where('slug', $slug)->exists();
        if (!$exists) {
            try {
                Artisan::call('db:seed', ['--class' => 'ManchesterUnitedThemeSeeder', '--force' => true]);
            } catch (\Exception $e) {
                \Log::error("Failed seeding theme {$slug} with seeder ManchesterUnitedThemeSeeder: " . $e->getMessage());
            }
        }
    }

    public function down(): void
    {
        DB::table('themes')->where('slug', 'manchester-united')->delete();
    }
};
