<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
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
        'cover_title',
        'cover_subtitle',
        'layout_mode',
        'music_url',
        'music_autoplay',
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
    ];

    protected function casts(): array
    {
        return [
            'music_autoplay' => 'boolean',
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
        ];
    }

    // ── Relationships ──

    public function user()
    {
        return $this->belongsTo(User::class);
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
