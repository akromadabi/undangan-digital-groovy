<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->boolean('show_photos')->default(true)->after('is_active');
            $table->boolean('show_animations')->default(true)->after('show_photos');
            $table->boolean('show_guest_name')->default(true)->after('show_animations');
            $table->boolean('show_countdown')->default(true)->after('show_guest_name');
            $table->boolean('show_qr_code')->default(true)->after('show_countdown');
            $table->boolean('enable_rsvp')->default(true)->after('show_qr_code');
            $table->boolean('enable_wishes')->default(true)->after('enable_rsvp');
            $table->string('language', 10)->default('id')->after('enable_wishes');
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn([
                'show_photos',
                'show_animations',
                'show_guest_name',
                'show_countdown',
                'show_qr_code',
                'enable_rsvp',
                'enable_wishes',
                'language',
            ]);
        });
    }
};
