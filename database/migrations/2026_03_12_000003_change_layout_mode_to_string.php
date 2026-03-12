<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Change enum to string to support new layout modes
        DB::statement("ALTER TABLE invitations MODIFY layout_mode VARCHAR(20) NOT NULL DEFAULT 'scroll'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE invitations MODIFY layout_mode ENUM('scroll','slide','tab') NOT NULL DEFAULT 'scroll'");
    }
};
