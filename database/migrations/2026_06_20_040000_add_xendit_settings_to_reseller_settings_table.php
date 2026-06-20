<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add reseller_xendit_settings column to reseller_settings table
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->json('reseller_xendit_settings')->nullable()->after('reseller_tripay_settings');
        });

        // 2. Seed default values for Xendit global settings
        $settings = [
            ['setting_key' => 'xendit_mode', 'setting_value' => 'sandbox', 'category' => 'payment', 'description' => 'Mode Xendit: sandbox / production', 'setting_type' => 'string'],
            ['setting_key' => 'xendit_secret_key', 'setting_value' => '', 'category' => 'payment', 'description' => 'Xendit Secret API Key', 'setting_type' => 'string'],
            ['setting_key' => 'xendit_webhook_token', 'setting_value' => '', 'category' => 'payment', 'description' => 'Xendit Callback / Webhook Verification Token', 'setting_type' => 'string'],
            ['setting_key' => 'xendit_success_url', 'setting_value' => '/dashboard?payment=success', 'category' => 'payment', 'description' => 'Redirect URL setelah Xendit bayar sukses', 'setting_type' => 'string'],
            ['setting_key' => 'xendit_failure_url', 'setting_value' => '/dashboard?payment=failed', 'category' => 'payment', 'description' => 'Redirect URL setelah Xendit bayar gagal', 'setting_type' => 'string'],
        ];

        foreach ($settings as $s) {
            DB::table('global_settings')->insertOrIgnore([
                'setting_key'   => $s['setting_key'],
                'setting_value' => $s['setting_value'],
                'category'      => $s['category'],
                'description'   => $s['description'],
                'setting_type'  => $s['setting_type'],
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }
    }

    public function down(): void
    {
        // 1. Remove reseller_xendit_settings column
        Schema::table('reseller_settings', function (Blueprint $table) {
            $table->dropColumn('reseller_xendit_settings');
        });

        // 2. Delete global settings
        DB::table('global_settings')->whereIn('setting_key', [
            'xendit_mode',
            'xendit_secret_key',
            'xendit_webhook_token',
            'xendit_success_url',
            'xendit_failure_url'
        ])->delete();
    }
};
