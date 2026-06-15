<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['setting_key' => 'midtrans_mode', 'setting_value' => 'sandbox', 'category' => 'payment', 'description' => 'Mode: sandbox / production', 'setting_type' => 'string'],
            ['setting_key' => 'midtrans_client_key', 'setting_value' => '', 'category' => 'payment', 'description' => 'Midtrans Client API Key', 'setting_type' => 'string'],
            ['setting_key' => 'midtrans_server_key', 'setting_value' => '', 'category' => 'payment', 'description' => 'Midtrans Server API Key', 'setting_type' => 'string'],
            ['setting_key' => 'midtrans_success_url', 'setting_value' => '/dashboard?payment=success', 'category' => 'payment', 'description' => 'Redirect URL setelah bayar sukses', 'setting_type' => 'string'],
            ['setting_key' => 'midtrans_failure_url', 'setting_value' => '/dashboard?payment=failed', 'category' => 'payment', 'description' => 'Redirect URL setelah bayar gagal', 'setting_type' => 'string'],
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
        DB::table('global_settings')->whereIn('setting_key', [
            'midtrans_mode',
            'midtrans_client_key',
            'midtrans_server_key',
            'midtrans_success_url',
            'midtrans_failure_url'
        ])->delete();
    }
};
