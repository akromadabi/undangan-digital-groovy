<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiPromoQueue extends Model
{
    protected $fillable = [
        'type',
        'reference_key',
        'caption',
        'image_path',
        'scheduled_at',
        'status',
        'posted_at',
        'platforms',
        'post_links',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'platforms' => 'array',
            'post_links' => 'array',
            'scheduled_at' => 'datetime',
            'posted_at' => 'datetime',
        ];
    }
}
