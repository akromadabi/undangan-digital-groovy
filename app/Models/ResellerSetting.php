<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerSetting extends Model
{
    protected $fillable = [
        'user_id',
        'brand_name',
        'brand_logo',
        'subdomain',
        'custom_domain',
        'landing_page_template',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
