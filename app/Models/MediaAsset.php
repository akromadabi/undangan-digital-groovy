<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    protected $fillable = [
        'invitation_id',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
