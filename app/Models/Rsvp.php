<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class Rsvp extends Model
{
    use LogsActivity;

    protected $fillable = [
        'guest_id',
        'invitation_id',
        'attendance',
        'number_of_guests',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
