<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->string('payment_mode', 20)->default('admin')->after('is_active');
            $table->string('reseller_gateway_type', 20)->nullable()->after('payment_mode');
            $table->json('reseller_midtrans_settings')->nullable()->after('reseller_gateway_type');
            $table->json('reseller_tripay_settings')->nullable()->after('reseller_midtrans_settings');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('parent_payment_id')->nullable()->after('greeting_card_id')->constrained('payments')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['parent_payment_id']);
            $table->dropColumn(['parent_payment_id']);
        });

        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn([
                'payment_mode',
                'reseller_gateway_type',
                'reseller_midtrans_settings',
                'reseller_tripay_settings'
            ]);
        });
    }
};
