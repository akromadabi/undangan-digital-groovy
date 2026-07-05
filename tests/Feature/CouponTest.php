<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Payment;
use App\Models\ResellerSetting;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Invitation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    protected User $reseller;
    protected User $customer;
    protected SubscriptionPlan $plan;
    protected Invitation $invitation;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Reseller (role admin)
        $this->reseller = User::factory()->create([
            'role' => 'admin',
        ]);

        // Create Reseller Setting
        ResellerSetting::create([
            'user_id' => $this->reseller->id,
            'subdomain' => 'testreseller',
            'brand_name' => 'Test Reseller Brand',
            'is_active' => true,
            'payment_mode' => 'manual', // use manual payment for easy verification
        ]);

        // Create Customer linked to Reseller
        $this->customer = User::factory()->create([
            'role' => 'user',
            'reseller_id' => $this->reseller->id,
            'onboarding_step' => 6,
        ]);

        // Create Subscription Plan
        $this->plan = SubscriptionPlan::create([
            'name' => 'Premium Plan',
            'slug' => 'premium',
            'price' => 100000.00,
            'duration_days' => 30,
            'type' => 'invitation',
        ]);

        // Create Invitation for customer
        $this->invitation = Invitation::create([
            'user_id' => $this->customer->id,
            'title' => 'My Wedding Invitation',
            'slug' => 'my-wedding',
        ]);
    }

    /** @test */
    public function reseller_can_create_a_coupon()
    {
        $response = $this->actingAs($this->reseller)
            ->post('/admin/coupons', [
                'code' => 'promo50',
                'discount_type' => 'percentage',
                'discount_value' => 50,
                'min_purchase' => 0,
                'is_active' => true,
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('coupons', [
            'reseller_id' => $this->reseller->id,
            'code' => 'PROMO50', // code gets converted to uppercase
            'discount_type' => 'percentage',
            'discount_value' => 50,
        ]);
    }

    /** @test */
    public function customer_can_validate_valid_coupon()
    {
        $coupon = Coupon::create([
            'reseller_id' => $this->reseller->id,
            'code' => 'DISKON10',
            'discount_type' => 'fixed',
            'discount_value' => 10000,
            'min_purchase' => 50000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->customer)
            ->post('/checkout/validate-coupon', [
                'code' => 'diskon10', // test case insensitivity
                'plan_id' => $this->plan->id,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'valid' => true,
            'discount_amount' => 10000,
            'final_amount' => 90000,
        ]);
    }

    /** @test */
    public function customer_cannot_validate_invalid_coupon()
    {
        // 1. Expired coupon
        $coupon = Coupon::create([
            'reseller_id' => $this->reseller->id,
            'code' => 'EXPIRED',
            'discount_type' => 'fixed',
            'discount_value' => 10000,
            'expires_at' => now()->subDay(),
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->customer)
            ->post('/checkout/validate-coupon', [
                'code' => 'EXPIRED',
                'plan_id' => $this->plan->id,
            ]);

        $response->assertJson([
            'valid' => false,
            'message' => 'Kupon sudah kedaluwarsa.',
        ]);
    }

    /** @test */
    public function customer_checkout_applies_coupon_discount()
    {
        $coupon = Coupon::create([
            'reseller_id' => $this->reseller->id,
            'code' => 'PROMO20',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'is_active' => true,
        ]);

        // Proceed to checkout
        $response = $this->actingAs($this->customer)
            ->post('/checkout', [
                'plan_id' => $this->plan->id,
                'invitation_id' => $this->invitation->id,
                'coupon_code' => 'PROMO20',
            ]);

        // Should redirect to payment manual review page (since reseller setting has payment mode = manual)
        $response->assertRedirect();

        // Total price is 100,000. 20% discount is 20,000. Final is 80,000.
        $this->assertDatabaseHas('payments', [
            'user_id' => $this->customer->id,
            'plan_id' => $this->plan->id,
            'coupon_id' => $coupon->id,
            'discount_amount' => 20000.00,
            'amount' => 80000.00,
            'status' => 'pending_manual',
        ]);

        $this->assertEquals(1, $coupon->fresh()->used_count);
    }

    /** @test */
    public function coupon_gives_100_percent_discount_activates_instantly()
    {
        $coupon = Coupon::create([
            'reseller_id' => $this->reseller->id,
            'code' => 'FREE100',
            'discount_type' => 'percentage',
            'discount_value' => 100,
            'is_active' => true,
        ]);

        // Proceed to checkout
        $response = $this->actingAs($this->customer)
            ->post('/checkout', [
                'plan_id' => $this->plan->id,
                'invitation_id' => $this->invitation->id,
                'coupon_code' => 'FREE100',
            ]);

        // Should redirect to dashboard with success (since paid instantly)
        $response->assertRedirect(route('dashboard'));

        // Payment should be marked as paid
        $this->assertDatabaseHas('payments', [
            'user_id' => $this->customer->id,
            'plan_id' => $this->plan->id,
            'coupon_id' => $coupon->id,
            'discount_amount' => 100000.00,
            'amount' => 0.00,
            'status' => 'paid',
        ]);

        // Subscription should be active
        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $this->customer->id,
            'plan_id' => $this->plan->id,
            'invitation_id' => $this->invitation->id,
            'status' => 'active',
        ]);

        $this->assertEquals(1, $coupon->fresh()->used_count);
    }
}
