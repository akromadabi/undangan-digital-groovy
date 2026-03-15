<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    protected $fillable = [
        'reseller_id',
        'amount',
        'status',
        'admin_notes',
        'transferred_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transferred_at' => 'datetime',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }
}
