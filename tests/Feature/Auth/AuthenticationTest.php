<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_super_admin_cannot_authenticate_under_reseller_domain(): void
    {
        $superAdmin = User::factory()->create([
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        $resellerUser = User::factory()->create([
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

        // Access via reseller custom domain
        $response = $this->post('http://reseller.test/login', [
            'email' => $superAdmin->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_super_admin_can_access_super_admin_routes_under_reseller_domain(): void
    {
        $superAdmin = User::factory()->create([
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        $resellerUser = User::factory()->create([
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

        // Attempt to access super-admin dashboard with Host reseller.test
        $response = $this->actingAs($superAdmin)
            ->get('http://reseller.test/super-admin');

        $response->assertStatus(200);
    }
}
