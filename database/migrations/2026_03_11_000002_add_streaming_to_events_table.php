<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('streaming_platform', 50)->nullable()->after('is_primary');
            $table->string('streaming_url', 500)->nullable()->after('streaming_platform');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['streaming_platform', 'streaming_url']);
        });
    }
};
