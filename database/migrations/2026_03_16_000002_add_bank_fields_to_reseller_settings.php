<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->string('bank_name', 100)->nullable()->after('is_active');
            $table->string('bank_account', 50)->nullable()->after('bank_name');
            $table->string('bank_holder', 100)->nullable()->after('bank_account');
        });
    }

    public function down(): void
    {
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'bank_account', 'bank_holder']);
        });
    }
};
