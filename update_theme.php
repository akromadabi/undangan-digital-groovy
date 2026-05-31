<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$invitation = \App\Models\Invitation::where('slug', 'mira-randi')->first();
$theme = \App\Models\Theme::where('slug', 'room-jogja')->first();

if($invitation && $theme) {
    $invitation->theme_id = $theme->id;
    $invitation->save();
    echo "Updated to Room Jogja\n";
} else {
    echo "Not found\n";
}
