<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach (App\Models\User::all() as $user) {
    $plan = $user->currentPlan();
    echo "User: " . $user->name . " (ID: " . $user->id . ", Role: " . $user->role . ", Email: " . $user->email . ")\n";
    if ($plan) {
        echo "  Plan: " . $plan->name . " (Slug: " . $plan->slug . ")\n";
        $sub = $user->activeSubscription;
        echo "  Subscription Status: " . ($sub ? $sub->status : 'none') . "\n";
    } else {
        echo "  Plan: none\n";
    }
}
