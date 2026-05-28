<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerSetting extends Model
{
    protected $fillable = [
        'user_id',
        'demo_user_id',
        'brand_name',
        'brand_logo',
        'site_title',
        'site_motto',
        'subdomain',
        'custom_domain',
        'landing_page_template',
        'is_active',
        'bank_name',
        'bank_account',
        'bank_holder',
        'footer_phone',
        'footer_email',
        'footer_whatsapp',
        'footer_instagram',
        'footer_tiktok',
        'footer_address',
        'footer_description',
        'bank_accounts',
        'social_links',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'bank_accounts' => 'array',
            'social_links' => 'array',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function demoUser()
    {
        return $this->belongsTo(User::class, 'demo_user_id');
    }
}
