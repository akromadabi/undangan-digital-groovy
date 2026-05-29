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
        Schema::table('invitations', function (Blueprint $table) {
            $table->string('cover_video_url', 500)->nullable()->after('video_playback');
            $table->string('opening_video_url', 500)->nullable()->after('cover_video_url');
            $table->text('video_list')->nullable()->after('opening_video_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['cover_video_url', 'opening_video_url', 'video_list']);
        });
    }
};
