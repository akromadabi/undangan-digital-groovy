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
            $table->boolean('hide_demo_plan_selector')->default(false)->after('greeting_card_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn('hide_demo_plan_selector');
        });
    }
};
