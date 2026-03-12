<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reseller_plan_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reseller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained('subscription_plans')->cascadeOnDelete();
            $table->decimal('reseller_price', 12, 2)->comment('Harga jual reseller ke user');
            $table->timestamps();

            $table->unique(['reseller_id', 'plan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reseller_plan_prices');
    }
};
