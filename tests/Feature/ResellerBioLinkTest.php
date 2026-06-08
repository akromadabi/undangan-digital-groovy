<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ResellerSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResellerBioLinkTest extends TestCase
{
    use RefreshDatabase;

    private function createResellerUser(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    public function test_reseller_can_access_bio_link_editor(): void
    {
        $reseller = $this->createResellerUser();

        $response = $this->actingAs($reseller)->get(route('admin.bio'));

        $response->assertStatus(200);
    }

    public function test_reseller_can_save_bio_link_config_with_custom_urls(): void
    {
        $reseller = $this->createResellerUser();

        // Ensure setting exists
        $setting = ResellerSetting::firstOrCreate(
            ['user_id' => $reseller->id],
            ['brand_name' => $reseller->name, 'is_active' => true, 'subdomain' => 'test-subdomain']
        );

        $payload = [
            'template' => 'cyberpunk',
            'title' => 'Custom Reseller Brand',
            'description' => 'A custom brand bio link',
            'sections' => [
                ['id' => 'header', 'type' => 'header', 'active' => true, 'order' => 0, 'variant' => 'centered'],
                ['id' => 'buttons', 'type' => 'buttons', 'active' => true, 'order' => 1, 'variant' => 'default'],
            ],
            'buttons' => [
                [
                    'id' => 'btn-1',
                    'label' => 'Website Utama',
                    'url' => 'https://external-site.com/promo',
                    'icon' => 'globe',
                    'active' => true,
                    'animation' => 'bounce'
                ],
                [
                    'id' => 'btn-2',
                    'label' => 'Daftar Sekarang',
                    'url' => '/register',
                    'icon' => 'link',
                    'active' => true,
                    'animation' => 'glow'
                ]
            ],
            'social' => [
                'whatsapp' => '628123456789',
                'instagram' => 'mybrand'
            ]
        ];

        $response = $this->actingAs($reseller)->post(route('admin.bio.update'), $payload);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Verify it was saved in database
        $setting->refresh();
        $savedConfig = $setting->bio_link_config;

        $this->assertEquals('cyberpunk', $savedConfig['template']);
        $this->assertEquals('Custom Reseller Brand', $savedConfig['title']);
        $this->assertEquals('A custom brand bio link', $savedConfig['description']);
        
        $this->assertCount(2, $savedConfig['buttons']);
        $this->assertEquals('https://external-site.com/promo', $savedConfig['buttons'][0]['url']);
        $this->assertEquals('Website Utama', $savedConfig['buttons'][0]['label']);
        $this->assertEquals('globe', $savedConfig['buttons'][0]['icon']);
        
        $this->assertEquals('/register', $savedConfig['buttons'][1]['url']);

        // Verify default config merging works correctly
        $mergedConfig = $setting->getBioLinkConfig();
        $this->assertEquals('https://external-site.com/promo', $mergedConfig['buttons'][0]['url']);
        $this->assertEquals('628123456789', $mergedConfig['social']['whatsapp']);
        // Verify default social fields not sent in payload are still present
        $this->assertArrayHasKey('tiktok', $mergedConfig['social']);
    }
}
