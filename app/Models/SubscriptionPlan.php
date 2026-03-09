<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'duration_days',
        'max_guests',
        'max_galleries',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function featureAccess()
    {
        return $this->hasMany(PlanFeatureAccess::class, 'plan_id');
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }

    public function features()
    {
        return $this->belongsToMany(Feature::class, 'plan_feature_access', 'plan_id', 'feature_id')
            ->withPivot('is_enabled')
            ->withTimestamps();
    }
}
