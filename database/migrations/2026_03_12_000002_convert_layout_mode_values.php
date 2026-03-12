<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Rename 'slide' to 'slide-h', 'tab' to 'scroll'
        DB::table('invitations')->where('layout_mode', 'slide')->update(['layout_mode' => 'slide-h']);
        DB::table('invitations')->where('layout_mode', 'tab')->update(['layout_mode' => 'scroll']);
    }

    public function down(): void
    {
        DB::table('invitations')->where('layout_mode', 'slide-h')->update(['layout_mode' => 'slide']);
    }
};
