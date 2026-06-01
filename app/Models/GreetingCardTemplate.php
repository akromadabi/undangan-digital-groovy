<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GreetingCardTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'preview_images',
        'preview_template',
        'preview_bg_style',
        'type',
        'description',
        'features',
        'bg_gradient',
        'icon',
        'sort_order',
        'base_likes',
        'price',
        'is_active',
    ];

    protected $casts = [
        'type'            => 'array',
        'features'        => 'array',
        'preview_images'  => 'array',
        'is_active'       => 'boolean',
        'base_likes'      => 'integer',
        'price'           => 'float',
    ];

    // Tipe kartu yang tersedia
    public static array $typeOptions = [
        'anniversary' => 'Anniversary',
        'birthday'    => 'Ulang Tahun',
        'graduation'  => 'Wisuda',
        'wedding'     => 'Pernikahan',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function greetingCards()
    {
        return $this->hasMany(GreetingCard::class, 'template', 'slug');
    }

    /**
     * Get thumbnail URL (handle storage path vs full URL).
     */
    public function getThumbnailUrlAttribute(): string
    {
        if (!$this->thumbnail) return '';
        if (str_starts_with($this->thumbnail, 'http') || str_starts_with($this->thumbnail, '/')) {
            return $this->thumbnail;
        }
        return '/storage/' . $this->thumbnail;
    }

    /**
     * Get the human-readable type labels for this template.
     */
    public function getTypeLabelAttribute(): string
    {
        if (!$this->type) return '';
        $labels = array_map(fn($t) => self::$typeOptions[$t] ?? $t, $this->type);
        return implode(', ', $labels);
    }

    /**
     * Apply reseller customizations to greeting card templates.
     */
    public static function applyResellerCustomizations($greetingCards, $resellerId)
    {
        if (!$resellerId) {
            return $greetingCards;
        }

        $customSettings = \App\Models\ResellerGreetingCardSetting::where('reseller_id', $resellerId)
            ->get()
            ->keyBy('greeting_card_template_id');

        foreach ($greetingCards as $card) {
            if (isset($customSettings[$card->id])) {
                $custom = $customSettings[$card->id];
                
                if ($custom->preview_template && $custom->preview_template !== 'default') {
                    $card->preview_template = $custom->preview_template;
                }
                if ($custom->preview_bg_style && $custom->preview_bg_style !== 'default') {
                    $card->preview_bg_style = $custom->preview_bg_style;
                }
                if ($custom->preview_images) {
                    $card->preview_images = is_string($custom->preview_images) 
                        ? json_decode($custom->preview_images, true) 
                        : $custom->preview_images;
                }
                if ($custom->thumbnail) {
                    $card->thumbnail = $custom->thumbnail;
                }
            }
        }

        return $greetingCards;
    }
}
