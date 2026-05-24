<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\GlobalSetting;

return new class extends Migration {
    public function up(): void
    {
        $footerKeys = [
            ['footer_description', 'string', 'Deskripsi footer website'],
            ['footer_phone', 'string', 'Nomor telepon'],
            ['footer_email', 'string', 'Alamat email'],
            ['footer_whatsapp', 'string', 'Nomor WhatsApp (Cth: 62812...)'],
            ['footer_instagram', 'string', 'Username Instagram (Cth: @username)'],
            ['footer_tiktok', 'string', 'Username TikTok (Cth: @username)'],
            ['footer_address', 'string', 'Alamat lengkap perusahaan'],
        ];

        foreach ($footerKeys as $item) {
            GlobalSetting::firstOrCreate(
                ['setting_key' => $item[0]],
                [
                    'setting_value' => '',
                    'setting_type' => $item[1],
                    'category' => 'Footer',
                    'description' => $item[2],
                ]
            );
        }
    }

    public function down(): void
    {
        $keys = [
            'footer_description',
            'footer_phone',
            'footer_email',
            'footer_whatsapp',
            'footer_instagram',
            'footer_tiktok',
            'footer_address',
        ];
        
        GlobalSetting::whereIn('setting_key', $keys)->delete();
    }
};
