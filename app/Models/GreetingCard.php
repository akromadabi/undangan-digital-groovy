<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GreetingCard extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'template',
        'type',
        'recipient_name',
        'sender_name',
        'photo_url',
        'photos',
        'messages',
        'custom_url',
        'is_active',
    ];

    protected $casts = [
        'messages' => 'array',
        'photos' => 'array',
        'is_active' => 'boolean',
    ];

    // Type labels
    public static array $types = [
        'anniversary' => 'Aniversari',
        'birthday'    => 'Ulang Tahun',
        'graduation'  => 'Wisuda',
        'wedding'     => 'Pernikahan',
    ];

    // Template labels
    public static array $templates = [
        'stillwithyou'     => 'Still With You',
        'giftforanita'     => 'Love Code Storybook',
        'cosmicdrift'      => 'Cosmic Drift',
        'etherealwhispers' => 'Ethereal Whispers',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a unique random slug for the card share URL.
     */
    public static function generateUniqueSlug(): string
    {
        do {
            $slug = Str::random(10);
        } while (self::where('custom_url', $slug)->exists());

        return $slug;
    }

    /**
     * Get the public share URL for this card.
     */
    public function getShareUrl(): string
    {
        return url('/card/' . $this->custom_url);
    }

    /**
     * Get the type label (human-readable).
     */
    public function getTypeLabelAttribute(): string
    {
        return self::$types[$this->type] ?? $this->type;
    }

    /**
     * Get the template label (human-readable).
     */
    public function getTemplateLabelAttribute(): string
    {
        return self::$templates[$this->template] ?? $this->template;
    }
}
