<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstagramFilter extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'filter_url',
        'thumbnail',
        'preview_image',
        'is_active',
        'sort_order',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
