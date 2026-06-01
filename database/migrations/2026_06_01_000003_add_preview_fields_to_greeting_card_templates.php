<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('greeting_card_templates', function (Blueprint $table) {
            if (!\Schema::hasColumn('greeting_card_templates', 'base_likes')) {
                $table->unsignedInteger('base_likes')->default(0)->after('sort_order');
            }
            if (!\Schema::hasColumn('greeting_card_templates', 'preview_template')) {
                $table->string('preview_template')->default('full-mockup')->after('sort_order');
            }
            if (!\Schema::hasColumn('greeting_card_templates', 'preview_bg_style')) {
                $table->string('preview_bg_style')->default('gradient-indigo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('greeting_card_templates', function (Blueprint $table) {
            $table->dropColumnIfExists('base_likes');
            $table->dropColumnIfExists('preview_template');
            $table->dropColumnIfExists('preview_bg_style');
        });
    }
};
