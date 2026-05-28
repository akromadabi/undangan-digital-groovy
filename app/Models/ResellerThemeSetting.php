<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerThemeSetting extends Model
{
    protected $fillable = [
        'reseller_id',
        'theme_id',
        'preview_template',
        'preview_bg_style',
        'preview_images',
        'thumbnail',
    ];

    protected function casts(): array
    {
        return [
            'preview_images' => 'array',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class, 'theme_id');
    }
}
