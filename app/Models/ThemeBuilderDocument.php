<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeBuilderDocument extends Model
{
    protected $fillable = [
        'theme_id',
        'version',
        'document',
        'is_published',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'document' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
