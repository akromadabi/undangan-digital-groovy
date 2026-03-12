<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerWalletTransaction extends Model
{
    protected $fillable = [
        'reseller_id',
        'payment_id',
        'type',
        'amount',
        'description',
        'balance_after',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
