<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\GlobalSetting;

return new class extends Migration
{
    public function up(): void
    {
        // Ambil data bank lama
        $bankName = GlobalSetting::getValue('bank_name', '');
        $bankNum = GlobalSetting::getValue('bank_account_number', '');
        $bankAccName = GlobalSetting::getValue('bank_account_name', '');

        $initialAccounts = [];
        if (!empty($bankName) && !empty($bankNum) && $bankNum !== '-') {
            $initialAccounts[] = [
                'bank_name' => (string)$bankName,
                'account_number' => (string)$bankNum,
                'account_name' => (string)$bankAccName,
            ];
        }

        // Set pengaturan baru `bank_accounts` dengan bentuk JSON array dan kategori `bank_transfer`
        GlobalSetting::setValue('bank_accounts', json_encode($initialAccounts), 'json', 'bank_transfer');

        // Hapus pengaturan lama agar tidak double
        GlobalSetting::whereIn('setting_key', ['bank_name', 'bank_account_number', 'bank_account_name'])->delete();
    }

    public function down(): void
    {
        $accounts = GlobalSetting::getValue('bank_accounts', []);
        
        if (is_string($accounts)) {
            $accounts = json_decode($accounts, true);
        }

        if (is_array($accounts) && count($accounts) > 0) {
            $first = $accounts[0];
            GlobalSetting::setValue('bank_name', $first['bank_name'] ?? 'BCA', 'string', 'payment');
            GlobalSetting::setValue('bank_account_number', $first['account_number'] ?? '-', 'string', 'payment');
            GlobalSetting::setValue('bank_account_name', $first['account_name'] ?? '-', 'string', 'payment');
        } else {
            GlobalSetting::setValue('bank_name', 'BCA', 'string', 'payment');
            GlobalSetting::setValue('bank_account_number', '-', 'string', 'payment');
            GlobalSetting::setValue('bank_account_name', '-', 'string', 'payment');
        }

        GlobalSetting::where('setting_key', 'bank_accounts')->delete();
    }
};
