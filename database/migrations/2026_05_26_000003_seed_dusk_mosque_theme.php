<?php
 
 use Illuminate\Database\Migrations\Migration;
 use Illuminate\Support\Facades\Artisan;
 use Illuminate\Support\Facades\DB;
 
 return new class extends Migration {
     public function up(): void
     {
         try {
             Artisan::call('db:seed', ['--class' => 'DuskMosqueThemeSeeder', '--force' => true]);
         } catch (\Exception $e) {
             \Log::error("Failed seeding Dusk Mosque theme: " . $e->getMessage());
         }
     }
 
     public function down(): void
     {
         // Optional: Clean up the theme if rolled back
         DB::table('themes')->where('slug', 'dusk-mosque')->delete();
     }
 };
