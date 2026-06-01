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
        Schema::table('payments', function (Blueprint $table) {
            // Drop foreign key on plan_id
            $table->dropForeign(['plan_id']);
            // Change plan_id to nullable
            $table->unsignedBigInteger('plan_id')->nullable()->change();
            // Re-add foreign key on plan_id
            $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('cascade');

            // Add greeting_card_id
            $table->foreignId('greeting_card_id')->nullable()->constrained('greeting_cards')->onDelete('cascade')->after('plan_id');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            // Drop foreign key on plan_id
            $table->dropForeign(['plan_id']);
            // Change plan_id to nullable
            $table->unsignedBigInteger('plan_id')->nullable()->change();
            // Re-add foreign key on plan_id
            $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('cascade');

            // Add greeting_card_id
            $table->foreignId('greeting_card_id')->nullable()->constrained('greeting_cards')->onDelete('cascade')->after('plan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['greeting_card_id']);
            $table->dropColumn('greeting_card_id');

            $table->dropForeign(['plan_id']);
            $table->unsignedBigInteger('plan_id')->nullable(false)->change();
            $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('cascade');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['greeting_card_id']);
            $table->dropColumn('greeting_card_id');

            $table->dropForeign(['plan_id']);
            $table->unsignedBigInteger('plan_id')->nullable(false)->change();
            $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('cascade');
        });
    }
};
