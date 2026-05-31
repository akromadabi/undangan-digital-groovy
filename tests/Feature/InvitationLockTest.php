<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvitationLockTest extends TestCase
{
    use RefreshDatabase;

    public function test_invitation_is_not_locked_before_event_date(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $invitation = Invitation::create([
            'user_id' => $user->id,
            'slug' => 'test-wedding-slug',
            'opening_title' => 'The Wedding Of',
        ]);

        Event::create([
            'invitation_id' => $invitation->id,
            'event_type' => 'resepsi',
            'event_name' => 'Resepsi',
            'event_date' => now()->addDays(2)->toDateString(),
            'start_time' => '09:00',
            'timezone' => 'WIB',
            'is_primary' => true,
        ]);

        $this->assertFalse($invitation->fresh()->isLocked());
    }

    public function test_invitation_is_locked_after_event_date_plus_three_days(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $invitation = Invitation::create([
            'user_id' => $user->id,
            'slug' => 'test-wedding-slug',
            'opening_title' => 'The Wedding Of',
        ]);

        Event::create([
            'invitation_id' => $invitation->id,
            'event_type' => 'resepsi',
            'event_name' => 'Resepsi',
            'event_date' => now()->subDays(4)->toDateString(),
            'start_time' => '09:00',
            'timezone' => 'WIB',
            'is_primary' => true,
        ]);

        $this->assertTrue($invitation->fresh()->isLocked());
    }
}
