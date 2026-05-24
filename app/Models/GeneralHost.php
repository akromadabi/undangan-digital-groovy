<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneralHost extends Model
{
    protected $fillable = [
        'invitation_id',
        'name',
        'description',
        'photo',
        'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
