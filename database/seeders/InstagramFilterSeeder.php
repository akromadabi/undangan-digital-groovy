<?php

namespace Database\Seeders;

use App\Models\InstagramFilter;
use Illuminate\Database\Seeder;

class InstagramFilterSeeder extends Seeder
{
    public function run(): void
    {
        $filters = [
            [
                'name' => 'Rustic Gold Floral',
                'slug' => 'rustic-gold-floral',
                'filter_url' => 'https://www.instagram.com/ar/667798835492160/',
                'thumbnail' => '/images/demo/korea-3.jpg',
                'preview_image' => '/images/demo/korea-3.jpg',
                'is_active' => true,
                'sort_order' => 1,
                'description' => 'Bingkai dedaunan kering bertema pedesaan dengan nuansa warna emas hangat yang manis dan elegan.',
            ],
            [
                'name' => 'Classic Retro Polaroid',
                'slug' => 'classic-retro-polaroid',
                'filter_url' => 'https://www.instagram.com/ar/779836482910245/',
                'thumbnail' => '/images/demo/korea-8.jpg',
                'preview_image' => '/images/demo/korea-8.jpg',
                'is_active' => true,
                'sort_order' => 2,
                'description' => 'Bingkai foto polaroid instan retro minimalis dengan efek grain artistik dan romantis.',
            ],
            [
                'name' => 'Sweet Rose Gold Glow',
                'slug' => 'sweet-rose-gold-glow',
                'filter_url' => 'https://www.instagram.com/ar/889364918237465/',
                'thumbnail' => '/images/demo/korea-11-768x512.jpg',
                'preview_image' => '/images/demo/korea-11-768x512.jpg',
                'is_active' => true,
                'sort_order' => 3,
                'description' => 'Preset warna merah muda lembut (rose gold) dengan bokeh berkabut yang membuat foto terlihat sinematik.',
            ],
        ];

        foreach ($filters as $f) {
            InstagramFilter::updateOrCreate(['slug' => $f['slug']], $f);
        }

        $this->command->info('3 default Instagram filters seeded successfully.');
    }
}
