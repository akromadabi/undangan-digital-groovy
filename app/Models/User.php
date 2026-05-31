<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Traits\LogsActivity;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, LogsActivity;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'role',
        'reseller_id',
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

    public function getInvitationAttribute()
    {
        try {
            $invitationId = session('active_invitation_id');
            if ($invitationId) {
                $invitation = $this->invitations()->find($invitationId);
                if ($invitation) {
                    return $invitation;
                }
            }
        } catch (\Exception $e) {
            // Fallback for CLI/Queue where session is not available
        }

        $invitation = $this->invitations()->latest('id')->first();
        if ($invitation) {
            try {
                session()->put('active_invitation_id', $invitation->id);
            } catch (\Exception $e) {
            }
        }
        return $invitation;
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

    public function getActiveSubscriptionAttribute()
    {
        $invitation = $this->invitation;
        if ($invitation) {
            $sub = $invitation->relationLoaded('activeSubscription') 
                ? $invitation->activeSubscription 
                : $invitation->activeSubscription()->first();
            if ($sub) {
                return $sub;
            }
        }

        if ($this->relationLoaded('activeSubscription')) {
            return $this->getRelationValue('activeSubscription');
        }

        return $this->activeSubscription()->first();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /** Reseller yang menaungi user ini */
    public function reseller()
    {
        return $this->belongsTo(User::class, 'reseller_id');
    }

    /** User-user di bawah reseller ini */
    public function resellerUsers()
    {
        return $this->hasMany(User::class, 'reseller_id');
    }

    /** Setting branding reseller */
    public function resellerSettings()
    {
        return $this->hasOne(ResellerSetting::class, 'user_id');
    }

    /** Harga kustom per plan untuk reseller */
    public function resellerPlanPrices()
    {
        return $this->hasMany(ResellerPlanPrice::class, 'reseller_id');
    }

    // ── Helpers ──

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /** Admin = reseller saja (strict separation) */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /** Alias: apakah user ini adalah reseller */
    public function isReseller(): bool
    {
        return $this->role === 'admin';
    }

    public function currentPlan()
    {
        return $this->activeSubscription?->plan;
    }

    public function hasFeatureAccess(string $featureSlug): bool
    {
        if ($this->isSuperAdmin() || $this->isAdmin()) {
            return true;
        }

        // Intercept: Free plan has full features during the 5 days trial period
        $subscription = $this->activeSubscription;
        if ($subscription && $subscription->plan && $subscription->plan->slug === 'free') {
            if ($subscription->starts_at && $subscription->starts_at->gt(now()->subDays(5))) {
                return true;
            }
        }

        $invitation = $this->invitation;
        if ($invitation) {
            return $invitation->hasFeatureAccess($featureSlug);
        }

        // Basic features are always active for any plan
        $basicFeatures = ['opening', 'cover', 'event', 'bride_groom', 'bride_groom_detail', 'closing', 'music', 'dresscode', 'video_wedding'];
        if (in_array($featureSlug, $basicFeatures)) {
            return true;
        }

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
