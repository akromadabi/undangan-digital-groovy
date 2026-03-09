<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->unsignedTinyInteger('live_delay')->default(3)->after('gallery_mode')->comment('seconds delay for name display');
            $table->boolean('live_counter')->default(true)->after('live_delay');
            $table->string('live_template', 20)->default('elegant')->after('live_counter')->comment('elegant, celebration');
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['live_delay', 'live_counter', 'live_template']);
        });
    }
};
