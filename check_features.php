<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach (App\Models\SubscriptionPlan::all() as $p) {
    echo $p->name . " (" . $p->slug . "):\n";
    foreach ($p->featureAccess as $fa) {
        if ($fa->feature) {
            echo "  - " . $fa->feature->slug . ": " . ($fa->is_enabled ? "ENABLED" : "LOCKED") . "\n";
        }
    }
    echo "\n";
}
