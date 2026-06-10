<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $resellerUser = \App\Models\User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $resellerSetting = \App\Models\ResellerSetting::create([
            'user_id' => $resellerUser->id,
            'brand_name' => 'Test Brand',
            'subdomain' => 'testbrand',
            'custom_domain' => 'reseller.test',
            'is_active' => true,
        ]);

        $response = $this->get('http://reseller.test/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $resellerUser = \App\Models\User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $resellerSetting = \App\Models\ResellerSetting::create([
            'user_id' => $resellerUser->id,
            'brand_name' => 'Test Brand',
            'subdomain' => 'testbrand',
            'custom_domain' => 'reseller.test',
            'is_active' => true,
        ]);

        $response = $this->post('http://reseller.test/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '08123456789',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('wizard.link'));
    }
}
