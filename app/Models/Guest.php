<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Guest extends Model
{
    protected $fillable = [
        'invitation_id',
        'name',
        'slug',
        'phone',
        'email',
        'group_name',
        'max_pax',
        'wa_sent',
        'wa_sent_at',
        'is_opened',
        'opened_at',
        'checked_in',
        'checked_in_at',
    ];

    protected function casts(): array
    {
        return [
            'wa_sent' => 'boolean',
            'wa_sent_at' => 'datetime',
            'is_opened' => 'boolean',
            'opened_at' => 'datetime',
            'checked_in' => 'boolean',
            'checked_in_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Guest $guest) {
            if (empty($guest->slug)) {
                $guest->slug = self::generateUniqueSlug($guest->invitation_id);
            }
        });
    }

    /**
     * Generate random 5-char alphanumeric slug, unique per invitation.
     */
    public static function generateUniqueSlug(int $invitationId): string
    {
        do {
            // 5 chars: mix of lowercase letters and digits
            $slug = strtolower(Str::random(5));
        } while (self::where('invitation_id', $invitationId)->where('slug', $slug)->exists());

        return $slug;
    }

    public function invitation()
    {
        return $this->belongsTo(Invitation::class);
    }

    public function rsvp()
    {
        return $this->hasOne(Rsvp::class);
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

    public function getInvitationUrl(): string
    {
        return $this->invitation->getUrl($this->slug);
    }
}
