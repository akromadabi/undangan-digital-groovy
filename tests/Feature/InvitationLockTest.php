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
        $invitation = new Invitation([
            'user_id' => $user->id,
            'slug' => 'test-wedding-slug',
            'opening_title' => 'The Wedding Of',
        ]);
        $invitation->created_at = now()->subDays(5);
        $invitation->save();

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

    public function test_invitation_cannot_be_accessed_on_another_reseller_domain(): void
    {
        $resellerA = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $resellerB = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $resellerSettingA = \App\Models\ResellerSetting::create([
            'user_id' => $resellerA->id,
            'brand_name' => 'Reseller A',
            'subdomain' => 'reseller-a',
            'is_active' => true,
        ]);

        $resellerSettingB = \App\Models\ResellerSetting::create([
            'user_id' => $resellerB->id,
            'brand_name' => 'Reseller B',
            'subdomain' => 'reseller-b',
            'is_active' => true,
        ]);

        $clientUser = User::factory()->create([
            'role' => 'user',
            'reseller_id' => $resellerA->id,
        ]);

        $invitation = Invitation::create([
            'user_id' => $clientUser->id,
            'slug' => 'test-invitation-slug',
            'title' => 'Test Invitation',
            'is_active' => true,
        ]);

        // Access via correct reseller (Reseller A) - should be 200 OK
        $response = $this->get('http://reseller-a.undangan-digital.test/u/test-invitation-slug');
        $response->assertStatus(200);

        // Access via wrong reseller (Reseller B) - should be 404 Not Found
        $response = $this->get('http://reseller-b.undangan-digital.test/u/test-invitation-slug');
        $response->assertStatus(404);
    }
}
