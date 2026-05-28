<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->json('preview_images')->nullable()->after('thumbnail');
            $table->string('preview_template', 50)->default('full-mockup')->after('preview_images');
            $table->string('preview_bg_style', 50)->default('gradient-indigo')->after('preview_template');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->dropColumn(['preview_images', 'preview_template', 'preview_bg_style']);
        });
    }
};
