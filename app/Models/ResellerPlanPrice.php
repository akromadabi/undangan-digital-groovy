<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerPlanPrice extends Model
{
    protected $fillable = [
        'reseller_id',
        'plan_id',
        'reseller_price',
    ];

    protected function casts(): array
    {
        return [
            'reseller_price' => 'decimal:2',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }
}
