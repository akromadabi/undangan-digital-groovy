<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Theme;

return new class extends Migration
{
    public function up(): void
    {
        Theme::create([
            'name' => 'Elegant 01',
            'slug' => 'elegant-01',
            'category' => 'elegant',
            'is_active' => true,
            'is_premium' => false,
            'thumbnail' => '/themes/elegant_01/thumbnail.webp',
            'color_scheme' => [
                'primary' => '#1D1D1B',
                'secondary' => '#7CA16C',
                'bg' => '#FAF9F6',
                'text' => '#1D1D1B',
                'accent' => '#7CA16C'
            ],
            'font_config' => [
                'heading' => "'Playfair Display', serif",
                'body' => "'Inter', sans-serif"
            ]
        ]);
    }

    public function down(): void
    {
        Theme::where('slug', 'elegant-01')->delete();
    }
};
