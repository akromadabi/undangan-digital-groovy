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
        Schema::table('reseller_plan_prices', function (Blueprint $table) {
            $table->decimal('normal_price', 10, 2)->nullable()->after('reseller_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reseller_plan_prices', function (Blueprint $table) {
            $table->dropColumn('normal_price');
        });
    }
};
