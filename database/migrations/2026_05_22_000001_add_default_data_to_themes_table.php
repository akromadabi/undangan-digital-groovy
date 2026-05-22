<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// THEME ADDED BY BHAKTIAJI ILHAM
return new class extends Migration {
    public function up(): void
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->json('default_data')->nullable()->after('font_config')
                ->comment('Default seed data for invitation when theme is selected (bride_grooms, events, galleries, love_stories, bank_accounts, opening, music, etc.)');
        });
    }

    public function down(): void
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->dropColumn('default_data');
        });
    }
};
