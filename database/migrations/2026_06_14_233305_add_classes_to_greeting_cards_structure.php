<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambah kolom type ke subscription_plans
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->string('type')->default('invitation')->after('slug');
        });

        // 2. Tambah kolom allowed_plans ke greeting_card_templates
        Schema::table('greeting_card_templates', function (Blueprint $table) {
            $table->json('allowed_plans')->nullable()->after('price');
        });

        // 3. Seed paket kartu ucapan bawaan
        DB::table('subscription_plans')->insert([
            [
                'name' => 'Basic Card',
                'slug' => 'card_basic',
                'type' => 'greeting_card',
                'description' => 'Paket dasar kartu ucapan untuk momen spesial.',
                'price' => 19000.00,
                'suggested_price' => 19000.00,
                'duration_days' => 365,
                'max_guests' => 0,
                'max_galleries' => 1,
                'is_active' => true,
                'sort_order' => 5, // Diletakkan setelah paket undangan (1-4)
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Premium Card',
                'slug' => 'card_premium',
                'type' => 'greeting_card',
                'description' => 'Paket premium dengan akses ke semua tema interaktif & 3D, musik latar, serta foto galeri tanpa batas.',
                'price' => 49000.00,
                'suggested_price' => 49000.00,
                'duration_days' => 365,
                'max_guests' => 0,
                'max_galleries' => 10,
                'is_active' => true,
                'sort_order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 4. Update allowed_plans pada template kartu ucapan yang sudah ada
        DB::table('greeting_card_templates')
            ->whereIn('slug', ['stillwithyou', 'giftforanita'])
            ->update(['allowed_plans' => json_encode(['card_basic', 'card_premium'])]);

        DB::table('greeting_card_templates')
            ->whereIn('slug', ['cosmicdrift', 'etherealwhispers', 'balloonpop', 'lofilove'])
            ->update(['allowed_plans' => json_encode(['card_premium'])]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Hapus seed paket kartu ucapan
        DB::table('subscription_plans')->whereIn('slug', ['card_basic', 'card_premium'])->delete();

        // Hapus kolom
        Schema::table('greeting_card_templates', function (Blueprint $table) {
            $table->dropColumn('allowed_plans');
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
