<?php
 
 use Illuminate\Database\Migrations\Migration;
 use Illuminate\Support\Facades\Artisan;
 use Illuminate\Support\Facades\DB;
 
 return new class extends Migration {
     public function up(): void
     {
         try {
             Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\Jawa2ThemeSeeder', '--force' => true]);
         } catch (\Exception $e) {
             \Illuminate\Support\Facades\Log::error("Jawa 2 Seeder failed: " . $e->getMessage());
         }
     }
 
     public function down(): void
     {
         DB::table('themes')->where('slug', 'jawa-2')->delete();
     }
 };
