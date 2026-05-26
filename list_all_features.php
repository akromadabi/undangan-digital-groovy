<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Feature;
use App\Models\Plan;

echo "--- FEATURES IN DATABASE ---\n";
foreach (Feature::all() as $f) {
    echo "ID: {$f->id}, Name: {$f->name}, Slug: {$f->slug}\n";
}

echo "\n--- PLANS IN DATABASE ---\n";
foreach (Plan::all() as $p) {
    echo "ID: {$p->id}, Name: {$p->name}, Slug: {$p->slug}\n";
}
