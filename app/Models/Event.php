<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class Event extends Model
{
    use LogsActivity;

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
        'is_primary',
        'streaming_platform',
        'streaming_url',
        'streamings',
        'show_dress_code',
        'dress_code_text',
        'dress_code_colors',
    ];
    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'is_primary' => 'boolean',
            'streamings' => 'array',
            'show_dress_code' => 'boolean',
            'dress_code_colors' => 'array',
        ];
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
