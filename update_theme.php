<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$invitation = \App\Models\Invitation::where('slug', 'mira-randi')->first();
$theme = \App\Models\Theme::where('name', 'like', '%netflix%')->first();

if($invitation && $theme) {
    $invitation->theme_id = $theme->id;
    $invitation->save();
    echo "Updated to Netflix\n";
} else {
    echo "Not found\n";
}
