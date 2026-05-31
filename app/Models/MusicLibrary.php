<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class MusicLibrary extends Model
{
    use LogsActivity;

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
