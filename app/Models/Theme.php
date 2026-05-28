<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'preview_images',
        'preview_template',
        'preview_bg_style',
        'preview_url',
        'category',
        'type',
        'color_scheme',
        'font_config',
        'default_data',
        'css_file',
        'supports_scroll',
        'supports_slide',
        'supports_tab',
        'is_premium',
        'allowed_plans',
        'is_active',
        'sort_order',
        'base_likes',
        'real_likes',
    ];

    protected function casts(): array
    {
        return [
            'preview_images' => 'array',
            'type' => 'array',
            'color_scheme' => 'array',
            'font_config' => 'array',
            'default_data' => 'array',
            'supports_scroll' => 'boolean',
            'supports_slide' => 'boolean',
            'supports_tab' => 'boolean',
            'is_premium' => 'boolean',
            'allowed_plans' => 'array',
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

    public static function applyResellerCustomizations($themes, $resellerId)
    {
        if (!$resellerId) {
            return $themes;
        }

        $customSettings = \App\Models\ResellerThemeSetting::where('reseller_id', $resellerId)
            ->get()
            ->keyBy('theme_id');

        foreach ($themes as $theme) {
            if (isset($customSettings[$theme->id])) {
                $custom = $customSettings[$theme->id];
                
                if ($custom->preview_template && $custom->preview_template !== 'default') {
                    $theme->preview_template = $custom->preview_template;
                }
                if ($custom->preview_bg_style && $custom->preview_bg_style !== 'default') {
                    $theme->preview_bg_style = $custom->preview_bg_style;
                }
                if ($custom->preview_images) {
                    $theme->preview_images = is_string($custom->preview_images) 
                        ? json_decode($custom->preview_images, true) 
                        : $custom->preview_images;
                }
                if ($custom->thumbnail) {
                    $theme->thumbnail = $custom->thumbnail;
                }
            }
        }

        return $themes;
    }
}
