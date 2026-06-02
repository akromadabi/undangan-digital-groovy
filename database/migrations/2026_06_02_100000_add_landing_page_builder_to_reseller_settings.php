<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->text('landing_page_config')->nullable()->after('landing_page_template');
            $table->string('landing_page_hero_image')->nullable()->after('landing_page_config');
        });
    }

    public function down(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn(['landing_page_config', 'landing_page_hero_image']);
        });
    }
};
