<?php
 
namespace Database\Seeders;
 
use App\Models\Theme;
use App\Models\ThemeSection;
use Illuminate\Database\Seeder;
 
class Luxury04ThemeSeeder extends Seeder
{
    public function run(): void
    {
        $theme = Theme::updateOrCreate(
            ['slug' => 'luxury-04'],
            [
                'name' => 'Luxury 4',
                'thumbnail' => '/themes/modern-black/thumbnail.jpg', // Placeholder thumbnail
                'category' => 'premium',
                'color_scheme' => [
                    'primary' => '#4a0e17', // Burgundy
                    'secondary' => '#f5eff1', // Pearl Cream
                    'accent' => '#faf8f9', // Pearl White
                    'bg' => '#f5eff1', // Pearl Cream
                    'text' => '#3a2a2d', // Dark brown/burgundy text
                ],
                'font_config' => [
                    'heading' => 'Jura',
                    'body' => 'Poppins',
                    'script' => 'Great Vibes',
                ],
                'css_file' => 'luxury-04/style.css',
                'supports_scroll' => true,
                'supports_slide' => true,
                'supports_tab' => false,
                'is_premium' => true,
                'is_active' => true,
                'sort_order' => 14,
            ]
        );
 
        $sections = [
            ['key' => 'cover', 'name' => 'Cover', 'order' => 1, 'removable' => false],
            ['key' => 'opening', 'name' => 'Opening', 'order' => 2, 'removable' => true],
            ['key' => 'bride_groom', 'name' => 'Mempelai', 'order' => 3, 'removable' => true],
            ['key' => 'countdown', 'name' => 'Save The Date', 'order' => 4, 'removable' => true],
            ['key' => 'love_story', 'name' => 'Kisah Cinta', 'order' => 5, 'removable' => true],
            ['key' => 'event', 'name' => 'Acara', 'order' => 6, 'removable' => true],
            ['key' => 'gallery', 'name' => 'Galeri', 'order' => 7, 'removable' => true],
            ['key' => 'rsvp', 'name' => 'RSVP', 'order' => 8, 'removable' => true],
            ['key' => 'wishes', 'name' => 'Ucapan', 'order' => 9, 'removable' => true],
            ['key' => 'bank', 'name' => 'Amplop Digital', 'order' => 10, 'removable' => true],
            ['key' => 'closing', 'name' => 'Penutup', 'order' => 11, 'removable' => false],
        ];
 
        foreach ($sections as $s) {
            ThemeSection::updateOrCreate(
                ['theme_id' => $theme->id, 'section_key' => $s['key']],
                [
                    'section_name' => $s['name'],
                    'component_name' => ucfirst($s['key']) . 'Section',
                    'default_order' => $s['order'],
                    'is_removable' => $s['removable'],
                    'is_default' => true,
                ]
            );
        }
 
        // Ensure all existing invitations using this theme have these sections
        $invitations = \App\Models\Invitation::where('theme_id', $theme->id)->get();
        foreach ($invitations as $invitation) {
            foreach ($theme->sections as $ts) {
                $invitation->sections()->firstOrCreate(
                    ['section_key' => $ts->section_key],
                    [
                        'section_name' => $ts->section_name,
                        'sort_order' => $ts->default_order,
                        'is_visible' => $ts->is_default,
                    ]
                );
            }
        }
    }
}
