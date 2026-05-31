<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class BankAccount extends Model
{
    use LogsActivity;

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
