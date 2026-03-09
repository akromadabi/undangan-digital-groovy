<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained('subscription_plans');
            $table->decimal('amount', 12, 2);
            $table->string('payment_method', 50)->nullable()->comment('bank_transfer, ewallet, qris');
            $table->string('payment_gateway', 50)->nullable()->default('xendit');
            $table->string('gateway_order_id', 100)->nullable();
            $table->string('gateway_transaction_id', 100)->nullable();
            $table->string('external_id', 100)->nullable();
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded', 'expired'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->json('metadata')->nullable()->comment('data tambahan dari gateway');
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
