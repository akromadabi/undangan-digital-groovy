<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gift extends Model
{
    protected $fillable = [
        'invitation_id',
        'guest_id',
        'sender_name',
        'gift_type',
        'amount',
        'item_name',
        'message',
        'confirmed',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'confirmed' => 'boolean',
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
