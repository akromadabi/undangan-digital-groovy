<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wish extends Model
{
    protected $fillable = [
        'invitation_id',
        'guest_id',
        'sender_name',
        'message',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
        ];
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
