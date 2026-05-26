<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach (App\Models\ResellerSetting::all() as $s) {
    $user = App\Models\User::find($s->user_id);
    $demo = App\Models\User::find($s->demo_user_id);
    echo "Reseller User: " . ($user ? $user->name : 'N/A') . " (User ID: " . $s->user_id . ")\n";
    echo "  Subdomain: " . $s->subdomain . "\n";
    echo "  Demo User: " . ($demo ? $demo->name . " (Plan: " . ($demo->currentPlan() ? $demo->currentPlan()->name : 'none') . ")" : 'none') . " (Demo ID: " . $s->demo_user_id . ")\n\n";
}
