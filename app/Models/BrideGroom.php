<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrideGroom extends Model
{
    protected $fillable = [
        'invitation_id',
        'order_number',
        'full_name',
        'nickname',
        'father_name',
        'mother_name',
        'gender',
        'photo',
        'bio',
        'instagram',
        'tiktok',
        'twitter',
        'facebook',
        'child_order',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
