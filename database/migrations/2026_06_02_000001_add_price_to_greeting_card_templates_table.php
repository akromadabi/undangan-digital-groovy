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
        Schema::table('greeting_card_templates', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->default(49000.00)->after('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('greeting_card_templates', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
