<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerGreetingCardSetting extends Model
{
    protected $fillable = [
        'reseller_id',
        'greeting_card_template_id',
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

    public function greetingCardTemplate()
    {
        return $this->belongsTo(GreetingCardTemplate::class, 'greeting_card_template_id');
    }
}
