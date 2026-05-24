<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->text('footer_description')->nullable()->after('is_active');
            $table->string('footer_phone', 30)->nullable()->after('footer_description');
            $table->string('footer_email', 100)->nullable()->after('footer_phone');
            $table->string('footer_whatsapp', 30)->nullable()->after('footer_email');
            $table->string('footer_instagram', 100)->nullable()->after('footer_whatsapp');
            $table->string('footer_tiktok', 100)->nullable()->after('footer_instagram');
            $table->text('footer_address')->nullable()->after('footer_tiktok');
        });
    }

    public function down(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn([
                'footer_description',
                'footer_phone',
                'footer_email',
                'footer_whatsapp',
                'footer_instagram',
                'footer_tiktok',
                'footer_address',
            ]);
        });
    }
};
