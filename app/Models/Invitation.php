<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\LogsActivity;

class Invitation extends Model
{
    use LogsActivity;

    protected $fillable = [
        'user_id',
        'theme_id',
        'slug',
        'title',
        'opening_title',
        'opening_text',
        'opening_ayat',
        'opening_ayat_translation',
        'opening_ayat_source',
        'closing_title',
        'closing_text',
        'cover_image',
        'cover_position_x',
        'cover_position_y',
        'cover_zoom',
        'opening_image',
        'opening_position_x',
        'opening_position_y',
        'opening_zoom',
        'cover_title',
        'cover_subtitle',
        'layout_mode',
        'music_url',
        'music_autoplay',
        'enable_auto_scroll',
        'save_the_date_enabled',
        'countdown_target_date',
        'turut_mengundang_text',
        'is_published',
        'is_active',
        'is_private',
        'enable_qr',
        'hide_photos',
        'gallery_mode',
        'live_delay',
        'live_counter',
        'live_template',
        'show_photos',
        'show_animations',
        'show_guest_name',
        'show_countdown',
        'show_qr_code',
        'enable_rsvp',
        'enable_wishes',
        'language',
        'religion',
        'particle_type',
        'particle_count',
        'particle_speed',
        'menu_position',
        'custom_domain',
        'type',
        'ar_style',
        'video_url',
        'video_playback',
        'cover_video_url',
        'opening_video_url',
        'video_list',
    ];

    protected function casts(): array
    {
        return [
            'music_autoplay' => 'boolean',
            'enable_auto_scroll' => 'boolean',
            'save_the_date_enabled' => 'boolean',
            'countdown_target_date' => 'datetime',
            'is_published' => 'boolean',
            'is_active' => 'boolean',
            'is_private' => 'boolean',
            'enable_qr' => 'boolean',
            'hide_photos' => 'boolean',
            'live_counter' => 'boolean',
            'show_photos' => 'boolean',
            'show_animations' => 'boolean',
            'show_guest_name' => 'boolean',
            'show_countdown' => 'boolean',
            'show_qr_code' => 'boolean',
            'enable_rsvp' => 'boolean',
            'enable_wishes' => 'boolean',
            'video_list' => 'array',
        ];
    }

    // ── Relationships ──

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class, 'invitation_id')
            ->where('status', 'active')
            ->latestOfMany();
    }

    public function hasFeatureAccess(string $featureSlug): bool
    {
        $owner = $this->user;
        if (!$owner) {
            return false;
        }

        if ($owner->isSuperAdmin() || $owner->isAdmin()) {
            return true;
        }

        // Basic features are always accessible
        $basicFeatures = ['opening', 'cover', 'event', 'bride_groom', 'bride_groom_detail', 'closing', 'music', 'dresscode', 'video_wedding'];
        if (in_array($featureSlug, $basicFeatures)) {
            return true;
        }

        $subscription = $this->activeSubscription;
        if (!$subscription) {
            return false;
        }

        $plan = $subscription->plan;
        if (!$plan) {
            return false;
        }

        // Special rule: Free plan has full features for the first 5 days before expiration
        if ($plan->slug === 'free') {
            if ($subscription->starts_at && $subscription->starts_at->gt(now()->subDays(5))) {
                return true; // Full features active during trial
            }
        }

        return $plan->featureAccess()
            ->whereHas('feature', fn($q) => $q->where('slug', $featureSlug))
            ->where('is_enabled', true)
            ->exists();
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function sections()
    {
        return $this->hasMany(InvitationSection::class)->orderBy('sort_order');
    }

    public function brideGrooms()
    {
        return $this->hasMany(BrideGroom::class)->orderBy('order_number');
    }

    public function events()
    {
        return $this->hasMany(Event::class)->orderBy('sort_order');
    }

    public function galleries()
    {
        return $this->hasMany(Gallery::class)->orderBy('sort_order');
    }

    public function loveStories()
    {
        return $this->hasMany(LoveStory::class)->orderBy('sort_order');
    }

    public function bankAccounts()
    {
        return $this->hasMany(BankAccount::class)->orderBy('sort_order');
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function rsvps()
    {
        return $this->hasMany(Rsvp::class);
    }

    public function wishes()
    {
        return $this->hasMany(Wish::class);
    }

    public function gifts()
    {
        return $this->hasMany(Gift::class);
    }

    public function whatsappLogs()
    {
        return $this->hasMany(WhatsappLog::class);
    }

    public function mediaAssets()
    {
        return $this->hasMany(MediaAsset::class);
    }

    // ── Helpers ──

    public function getUrl(?string $guestSlug = null): string
    {
        $url = config('app.url') . '/u/' . $this->slug;
        if ($guestSlug) {
            $url .= '?to=' . $guestSlug;
        }
        return $url;
    }

    public function visibleSections()
    {
        return $this->sections()->where('is_visible', true)->orderBy('sort_order');
    }
}
