<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$host = 'undangan-digital.test'; // matching the domain in first turn
$resellerSetting = \App\Helpers\DomainHelper::resolveReseller($host);

if ($resellerSetting) {
    echo "Reseller Setting Found! Brand Name: {$resellerSetting->brand_name} | Demo User ID: {$resellerSetting->demo_user_id}\n";
    if ($resellerSetting->demo_user_id) {
        $customDemo = \App\Models\Invitation::where('user_id', $resellerSetting->demo_user_id)->first();
        if ($customDemo) {
            echo "Custom Demo Invitation Found! ID: {$customDemo->id} | Slug: {$customDemo->slug} | Title: {$customDemo->title} | Type: {$customDemo->type}\n";
            foreach ($customDemo->brideGrooms as $bg) {
                echo "  BrideGroom: Name: {$bg->full_name} | Gender: {$bg->gender} | Photo: {$bg->photo}\n";
            }
        } else {
            echo "No custom demo invitation for this demo user ID\n";
        }
    }
} else {
    echo "No reseller settings found for host: {$host}\n";
}
