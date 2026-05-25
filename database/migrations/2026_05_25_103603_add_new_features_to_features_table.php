<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\Feature;
use App\Models\SubscriptionPlan;
use App\Models\PlanFeatureAccess;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $newFeatures = [
            ['name' => 'Partikel', 'slug' => 'partikel', 'category' => 'settings', 'icon' => 'MdOutlineSparkles'],
            ['name' => 'Tampilkan Foto', 'slug' => 'show_photos', 'category' => 'settings', 'icon' => 'MdImage'],
            ['name' => 'Efek Animasi', 'slug' => 'animasi', 'category' => 'settings', 'icon' => 'MdAutoAwesome'],
            ['name' => 'Tombol Auto Scroll', 'slug' => 'auto_scroll', 'category' => 'settings', 'icon' => 'MdMouse'],
            ['name' => 'Layar Sapa (Live Tamu)', 'slug' => 'layar_sapa', 'category' => 'settings', 'icon' => 'MdTv'],
        ];

        $insertedFeatures = [];
        foreach ($newFeatures as $f) {
            $feature = Feature::where('slug', $f['slug'])->first();
            if (!$feature) {
                $feature = Feature::create($f);
            }
            $insertedFeatures[$f['slug']] = $feature;
        }

        $plans = SubscriptionPlan::all();
        foreach ($plans as $plan) {
            foreach ($insertedFeatures as $slug => $feature) {
                $isEnabled = false;
                if (in_array($plan->slug, ['gold', 'platinum'])) {
                    $isEnabled = true;
                } elseif ($plan->slug === 'silver') {
                    $isEnabled = ($slug !== 'layar_sapa');
                } elseif ($plan->slug === 'free') {
                    $isEnabled = ($slug === 'show_photos');
                }

                PlanFeatureAccess::updateOrCreate(
                    ['plan_id' => $plan->id, 'feature_id' => $feature->id],
                    ['is_enabled' => $isEnabled]
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $slugs = ['partikel', 'show_photos', 'animasi', 'auto_scroll', 'layar_sapa'];
        Feature::whereIn('slug', $slugs)->delete();
    }
};
