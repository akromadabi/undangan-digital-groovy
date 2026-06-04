<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'user', 'editor') DEFAULT 'user'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            // Revert by converting any existing editors to user first to avoid mysql errors
            DB::table('users')->where('role', 'editor')->update(['role' => 'user']);
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'user') DEFAULT 'user'");
        }
    }
};
