<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ResellerSetting;
use App\Models\User;

$settings = ResellerSetting::all();
foreach ($settings as $setting) {
    echo "Reseller: " . $setting->reseller->name . " (User ID: " . $setting->user_id . ")\n";
    echo "  Demo User ID: " . ($setting->demo_user_id ?: 'none') . "\n";
    if ($setting->demo_user_id) {
        $du = User::find($setting->demo_user_id);
        if ($du) {
            echo "  Demo User Name: " . $du->name . " (Email: " . $du->email . ")\n";
            $plan = $du->currentPlan();
            echo "  Demo User Plan: " . ($plan ? $plan->name : 'none') . "\n";
            $sub = $du->activeSubscription;
            echo "  Demo User Subscription Status: " . ($sub ? $sub->status : 'none') . "\n";
        } else {
            echo "  Demo User with ID {$setting->demo_user_id} NOT found in users table!\n";
        }
    }
}
