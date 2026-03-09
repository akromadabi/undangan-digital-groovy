<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = [
        'invitation_id',
        'image_url',
        'caption',
        'sort_order',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
