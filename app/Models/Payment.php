<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'invitation_id',
        'amount',
        'payment_method',
        'payment_gateway',
        'gateway_order_id',
        'gateway_transaction_id',
        'external_id',
        'status',
        'paid_at',
        'metadata',
        'proof_image',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }
}
