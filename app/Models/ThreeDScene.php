<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThreeDScene extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'config',
        'thumbnail',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];
}
