<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Invitation;

$inv = Invitation::where('slug', 'preview-cvuylp')->first();
if ($inv) {
    echo "Invitation ID: {$inv->id} | Slug: {$inv->slug} | Type: {$inv->type}\n";
    foreach ($inv->brideGrooms as $bg) {
        echo "  BrideGroom: Name: {$bg->full_name} | Nickname: {$bg->nickname} | Gender: {$bg->gender} | Photo: {$bg->photo}\n";
    }
} else {
    echo "Invitation not found\n";
}
