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
            $table->foreignId('three_d_scene_id')->nullable()->after('is_active')->constrained('three_d_scenes')->nullOnDelete();
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->foreignId('three_d_scene_id')->nullable()->after('theme_id')->constrained('three_d_scenes')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropForeign(['three_d_scene_id']);
            $table->dropColumn('three_d_scene_id');
        });

        Schema::table('themes', function (Blueprint $table) {
            $table->dropForeign(['three_d_scene_id']);
            $table->dropColumn('three_d_scene_id');
        });
    }
};
