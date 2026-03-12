<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->string('menu_position', 10)->default('none')->after('layout_mode');
        });

        // Convert existing show_side_menu values
        DB::table('invitations')->where('show_side_menu', true)->update(['menu_position' => 'left']);
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn('menu_position');
        });
    }
};
