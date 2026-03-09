<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'preview_url',
        'category',
        'color_scheme',
        'font_config',
        'css_file',
        'supports_scroll',
        'supports_slide',
        'supports_tab',
        'is_premium',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'color_scheme' => 'array',
            'font_config' => 'array',
            'supports_scroll' => 'boolean',
            'supports_slide' => 'boolean',
            'supports_tab' => 'boolean',
            'is_premium' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function sections()
    {
        return $this->hasMany(ThemeSection::class)->orderBy('default_order');
    }

    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }
}
