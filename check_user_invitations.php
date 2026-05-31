<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Invitation;

$user = User::find(1);
echo "User: {$user->name} | Email: {$user->email}\n";
echo "Invitations:\n";
foreach ($user->invitations as $inv) {
    echo "  ID: {$inv->id} | Slug: {$inv->slug} | Title: {$inv->title} | Type: {$inv->type} | Theme: " . ($inv->theme ? $inv->theme->slug : 'none') . "\n";
}
