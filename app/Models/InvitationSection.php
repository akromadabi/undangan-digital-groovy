<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvitationSection extends Model
{
    protected $fillable = [
        'invitation_id',
        'section_key',
        'section_name',
        'sort_order',
        'is_visible',
        'custom_config',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'custom_config' => 'array',
        ];
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
