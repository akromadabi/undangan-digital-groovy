<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'invitation_id',
        'bank_name',
        'account_name',
        'account_number',
        'bank_logo',
        'sort_order',
    ];

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }
}
