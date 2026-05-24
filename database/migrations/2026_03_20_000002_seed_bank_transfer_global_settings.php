<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $settings = [
            ['setting_key' => 'bank_name',           'setting_value' => 'BCA',            'category' => 'payment'],
            ['setting_key' => 'bank_account_number', 'setting_value' => '1234567890',     'category' => 'payment'],
            ['setting_key' => 'bank_account_name',   'setting_value' => 'Nama Pemilik',   'category' => 'payment'],
        ];

        foreach ($settings as $s) {
            DB::table('global_settings')->insertOrIgnore([
                'setting_key'   => $s['setting_key'],
                'setting_value' => $s['setting_value'],
                'category'      => $s['category'],
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('global_settings')->whereIn('setting_key', ['bank_name', 'bank_account_number', 'bank_account_name'])->delete();
    }
};
