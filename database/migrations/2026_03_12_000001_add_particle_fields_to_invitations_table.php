<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->string('particle_type')->nullable()->after('show_side_menu');
            $table->unsignedInteger('particle_count')->default(30)->after('particle_type');
            $table->string('particle_speed', 20)->default('normal')->after('particle_count');
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['particle_type', 'particle_count', 'particle_speed']);
        });
    }
};
