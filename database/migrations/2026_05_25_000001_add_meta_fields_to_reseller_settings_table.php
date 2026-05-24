<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->string('site_title', 255)->nullable()->after('brand_logo');
            $table->text('site_motto')->nullable()->after('site_title');
        });
    }

    public function down(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn(['site_title', 'site_motto']);
        });
    }
};
