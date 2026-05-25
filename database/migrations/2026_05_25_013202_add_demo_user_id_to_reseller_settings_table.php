<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->foreignId('demo_user_id')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropForeign(['demo_user_id']);
            $table->dropColumn('demo_user_id');
        });
    }
};
