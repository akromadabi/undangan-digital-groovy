<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanFeatureAccess extends Model
{
    protected $table = 'plan_feature_access';

    protected $fillable = [
        'plan_id',
        'feature_id',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
        ];
    }

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function feature()
    {
        return $this->belongsTo(Feature::class);
    }
}
