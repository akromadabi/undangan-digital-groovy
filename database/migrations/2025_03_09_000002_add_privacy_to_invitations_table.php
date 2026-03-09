<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->boolean('is_private')->default(false)->after('is_active')->comment('Tidak muncul di Google/landing');
            $table->boolean('enable_qr')->default(true)->after('is_private')->comment('Tombol QR aktif di undangan');
            $table->boolean('hide_photos')->default(false)->after('enable_qr')->comment('Mode tanpa foto');
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['is_private', 'enable_qr', 'hide_photos']);
        });
    }
};
