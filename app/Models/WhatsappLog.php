<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappLog extends Model
{
    protected $fillable = [
        'invitation_id',
        'guest_id',
        'phone',
        'message',
        'status',
        'response',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'response' => 'array',
            'sent_at' => 'datetime',
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
