<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'invitation_id',
        'event_type',
        'event_name',
        'event_date',
        'start_time',
        'end_time',
        'timezone',
        'venue_name',
        'venue_address',
        'gmaps_link',
        'gmaps_embed',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
