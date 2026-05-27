<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->integer('cover_position_x')->default(50)->nullable()->after('cover_image');
            $table->integer('cover_position_y')->default(50)->nullable()->after('cover_position_x');
            $table->decimal('cover_zoom', 8, 2)->default(1.0)->nullable()->after('cover_position_y');
            
            $table->integer('opening_position_x')->default(50)->nullable()->after('opening_image');
            $table->integer('opening_position_y')->default(50)->nullable()->after('opening_position_x');
            $table->decimal('opening_zoom', 8, 2)->default(1.0)->nullable()->after('opening_position_y');
        });

        Schema::table('bride_grooms', function (Blueprint $table) {
            $table->integer('photo_position_x')->default(50)->nullable()->after('photo');
            $table->integer('photo_position_y')->default(50)->nullable()->after('photo_position_x');
            $table->decimal('photo_zoom', 8, 2)->default(1.0)->nullable()->after('photo_position_y');
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn([
                'cover_position_x',
                'cover_position_y',
                'cover_zoom',
                'opening_position_x',
                'opening_position_y',
                'opening_zoom',
            ]);
        });

        Schema::table('bride_grooms', function (Blueprint $table) {
            $table->dropColumn([
                'photo_position_x',
                'photo_position_y',
                'photo_zoom',
            ]);
        });
    }
};
