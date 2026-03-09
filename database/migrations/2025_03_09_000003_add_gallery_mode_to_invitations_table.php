<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->string('gallery_mode', 20)->default('grid')->after('hide_photos')->comment('grid, carousel, slide');
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn('gallery_mode');
        });
    }
};
