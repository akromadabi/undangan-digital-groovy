<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerWallet extends Model
{
    protected $fillable = ['reseller_id', 'balance'];

    protected function casts(): array
    {
        return [
            'balance' => 'decimal:2',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    public function transactions()
    {
        return $this->hasMany(ResellerWalletTransaction::class, 'reseller_id', 'reseller_id');
    }

    /**
     * Credit profit to wallet after a payment is confirmed.
     */
    public static function creditProfit(int $resellerId, int $paymentId, float $profit, string $description = null): void
    {
        if ($profit <= 0) return;

        $wallet = self::firstOrCreate(['reseller_id' => $resellerId], ['balance' => 0]);
        $wallet->increment('balance', $profit);

        ResellerWalletTransaction::create([
            'reseller_id' => $resellerId,
            'payment_id' => $paymentId,
            'type' => 'credit',
            'amount' => $profit,
            'description' => $description ?? 'Profit dari pembayaran',
            'balance_after' => $wallet->fresh()->balance,
        ]);
    }
}
