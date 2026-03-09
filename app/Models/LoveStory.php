<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoveStory extends Model
{
    protected $fillable = [
        'invitation_id',
        'title',
        'story_date',
        'description',
        'image_url',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'story_date' => 'date',
        ];
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
