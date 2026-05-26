<?php
 
 use Illuminate\Database\Migrations\Migration;
 use Illuminate\Support\Facades\Artisan;
 use Illuminate\Support\Facades\DB;
 
 return new class extends Migration {
     public function up(): void
     {
         try {
             Artisan::call('db:seed', ['--class' => 'JawaKlasikThemeSeeder', '--force' => true]);
         } catch (\Exception $e) {
             \Log::error("Failed seeding Jawa Klasik theme: " . $e->getMessage());
         }
     }
 
     public function down(): void
     {
         DB::table('themes')->where('slug', 'jawa-klasik')->delete();
     }
 };
