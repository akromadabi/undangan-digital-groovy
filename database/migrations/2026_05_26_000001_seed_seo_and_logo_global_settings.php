<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\GlobalSetting;

return new class extends Migration {
    public function up(): void
    {
        $keys = [
            [
                'key' => 'site_logo',
                'type' => 'string',
                'category' => 'general',
                'description' => 'Logo utama website',
                'value' => ''
            ],
            [
                'key' => 'site_favicon',
                'type' => 'string',
                'category' => 'general',
                'description' => 'Favicon website',
                'value' => ''
            ],
            [
                'key' => 'meta_title',
                'type' => 'string',
                'category' => 'seo',
                'description' => 'Meta Title Default',
                'value' => 'Undangan Digital Premium'
            ],
            [
                'key' => 'meta_description',
                'type' => 'string',
                'category' => 'seo',
                'description' => 'Meta Description Default',
                'value' => 'Buat undangan digital premium yang indah, interaktif, dan mudah dibagikan.'
            ],
        ];

        foreach ($keys as $item) {
            GlobalSetting::firstOrCreate(
                ['setting_key' => $item['key']],
                [
                    'setting_value' => $item['value'],
                    'setting_type' => $item['type'],
                    'category' => $item['category'],
                    'description' => $item['description'],
                ]
            );
        }
    }

    public function down(): void
    {
        $keys = [
            'site_logo',
            'site_favicon',
            'meta_title',
            'meta_description',
        ];
        
        GlobalSetting::whereIn('setting_key', $keys)->delete();
    }
};
