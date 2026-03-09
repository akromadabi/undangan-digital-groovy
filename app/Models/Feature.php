<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'icon',
    ];

    public function plans()
    {
        return $this->belongsToMany(SubscriptionPlan::class, 'plan_feature_access', 'feature_id', 'plan_id')
            ->withPivot('is_enabled')
            ->withTimestamps();
    }
}
