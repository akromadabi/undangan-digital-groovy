<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Feature;
use App\Models\Plan;

$users = User::all();

foreach ($users as $user) {
    echo "========================================\n";
    echo "User: " . $user->name . " (ID: " . $user->id . ", Role: " . $user->role . ", Email: " . $user->email . ")\n";
    $plan = $user->currentPlan();
    if ($plan) {
        echo "  Plan: " . $plan->name . " (ID: " . $plan->id . ", Slug: " . $plan->slug . ")\n";
        
        $features = Feature::all();
        echo "  Feature Access from hasFeatureAccess():\n";
        foreach ($features as $feature) {
            $hasAccess = $user->hasFeatureAccess($feature->slug);
            echo "    - " . $feature->name . " (" . $feature->slug . "): " . ($hasAccess ? "YES" : "NO") . "\n";
        }
        
        echo "\n  Plan's feature access table entries:\n";
        $pfas = $plan->featureAccess()->with('feature')->get();
        foreach ($pfas as $pfa) {
            echo "    - " . $pfa->feature->name . " (" . $pfa->feature->slug . "): Enabled: " . ($pfa->is_enabled ? "YES" : "NO") . "\n";
        }
    } else {
        echo "  Plan: none\n";
    }
}
