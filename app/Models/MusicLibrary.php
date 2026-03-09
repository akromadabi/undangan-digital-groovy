<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MusicLibrary extends Model
{
    protected $table = 'music_library';

    protected $fillable = [
        'title',
        'artist',
        'category',
        'url',
        'source_type',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
