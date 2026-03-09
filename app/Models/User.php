<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'role',
        'is_active',
        'onboarding_step',
        'locale',
        'otp_code',
        'otp_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // ── Relationships ──

    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    public function invitation()
    {
        return $this->hasOne(Invitation::class)->latestOfMany();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->latestOfMany();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // ── Helpers ──

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function currentPlan()
    {
        return $this->activeSubscription?->plan;
    }

    public function hasFeatureAccess(string $featureSlug): bool
    {
        $plan = $this->currentPlan();
        if (!$plan)
            return false;

        return $plan->featureAccess()
            ->whereHas('feature', fn($q) => $q->where('slug', $featureSlug))
            ->where('is_enabled', true)
            ->exists();
    }

    public function onboardingComplete(): bool
    {
        return $this->onboarding_step >= 6;
    }
}
