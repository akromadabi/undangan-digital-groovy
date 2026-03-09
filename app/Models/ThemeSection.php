<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeSection extends Model
{
    protected $fillable = [
        'theme_id',
        'section_key',
        'section_name',
        'component_name',
        'default_order',
        'is_removable',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'is_removable' => 'boolean',
            'is_default' => 'boolean',
        ];
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }
}
