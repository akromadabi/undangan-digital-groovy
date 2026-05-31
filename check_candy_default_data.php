<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Theme;

$theme = Theme::where('slug', 'candy-land')->first();
if ($theme) {
    echo "Theme ID: {$theme->id} | Slug: {$theme->slug} | Name: {$theme->name}\n";
    echo "Default Data:\n";
    print_r($theme->default_data);
} else {
    echo "Theme not found\n";
}
