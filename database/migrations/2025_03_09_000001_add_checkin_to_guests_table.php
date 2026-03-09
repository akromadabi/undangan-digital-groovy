<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->boolean('checked_in')->default(false)->after('opened_at');
            $table->timestamp('checked_in_at')->nullable()->after('checked_in');
        });
    }

    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->dropColumn(['checked_in', 'checked_in_at']);
        });
    }
};
