<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            // This will work on SQLite and other DBs to change enum to string properly
            $table->string('layout_mode', 20)->default('scroll')->change();
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            // We don't go back to enum in SQLite easily, but we can leave it as string
            $table->string('layout_mode', 20)->default('scroll')->change();
        });
    }
};
