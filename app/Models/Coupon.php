<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Coupon extends Model
{
    use LogsActivity;

    protected $fillable = [
        'reseller_id',
        'code',
        'discount_type',
        'discount_value',
        'min_purchase',
        'max_discount',
        'starts_at',
        'expires_at',
        'is_active',
        'usage_limit',
        'used_count',
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'min_purchase' => 'decimal:2',
            'max_discount' => 'decimal:2',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
            'usage_limit' => 'integer',
            'used_count' => 'integer',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Check if coupon is valid for a given amount and date.
     */
    public function isValidFor($amount): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();
        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->expires_at && $now->gt($this->expires_at)) {
            return false;
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }

        if ($amount < $this->min_purchase) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount.
     */
    public function calculateDiscount($amount): float
    {
        if ($this->discount_type === 'percentage') {
            $discount = $amount * ($this->discount_value / 100);
            if ($this->max_discount !== null && $discount > $this->max_discount) {
                return (float)$this->max_discount;
            }
            return (float)$discount;
        }

        // Fixed discount
        return (float) min($this->discount_value, $amount);
    }
}
