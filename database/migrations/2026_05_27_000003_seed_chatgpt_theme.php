<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $slug = 'chatgpt';
        $exists = DB::table('themes')->where('slug', $slug)->exists();
        if (!$exists) {
            try {
                Artisan::call('db:seed', ['--class' => 'ChatgptThemeSeeder', '--force' => true]);
            } catch (\Exception $e) {
                \Log::error("Failed seeding theme {$slug} with seeder ChatgptThemeSeeder: " . $e->getMessage());
            }
        }
    }

    public function down(): void
    {
        // Optional: remove theme on rollback
        DB::table('themes')->where('slug', 'chatgpt')->delete();
    }
};
