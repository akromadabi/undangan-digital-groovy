<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Feature;

$user = User::where('name', 'like', '%HELLO%')
    ->orWhere('name', 'like', '%MEDIA%')
    ->first();

if (!$user) {
    echo "User HELLO MEDIA not found!\n";
    exit;
}

echo "User: {$user->name} (ID: {$user->id}, Role: {$user->role}, Email: {$user->email})\n";
$plan = $user->currentPlan();
if ($plan) {
    echo "Plan: {$plan->name} (ID: {$plan->id}, Slug: {$plan->slug})\n";
    
    // Dump PlanFeatureAccess
    echo "\nPlan Feature Access entries:\n";
    foreach ($plan->featureAccess()->with('feature')->get() as $pfa) {
        echo "  - {$pfa->feature->name} (slug: {$pfa->feature->slug}) is_enabled: " . ($pfa->is_enabled ? "YES" : "NO") . "\n";
    }
} else {
    echo "Plan: none\n";
}
