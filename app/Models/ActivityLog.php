<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    public $timestamps = true;
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'role',
        'activity_type',
        'category',
        'description',
        'subject_type',
        'subject_id',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
