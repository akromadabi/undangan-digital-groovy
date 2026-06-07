<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->longText('bio_link_config')->nullable()->after('landing_page_hero_image');
        });
    }

    public function down(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn('bio_link_config');
        });
    }
};
