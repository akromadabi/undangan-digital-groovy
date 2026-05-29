<?php

use Illuminate\Database\Migrations\Migration;
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
        $newFeature = [
            'name' => 'Album Video',
            'slug' => 'video_album',
            'category' => 'settings',
            'icon' => 'MdVideoLibrary',
            'description' => 'Akses ke fitur tempel link video YouTube/Google Drive di galeri'
        ];

        $feature = Feature::where('slug', $newFeature['slug'])->first();
        if (!$feature) {
            $feature = Feature::create($newFeature);
        }

        $plans = SubscriptionPlan::all();
        foreach ($plans as $plan) {
            // Enable for Silver, Gold, Platinum, disable for Free by default
            $isEnabled = in_array($plan->slug, ['silver', 'gold', 'platinum']);

            PlanFeatureAccess::updateOrCreate(
                ['plan_id' => $plan->id, 'feature_id' => $feature->id],
                ['is_enabled' => $isEnabled]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $feature = Feature::where('slug', 'video_album')->first();
        if ($feature) {
            PlanFeatureAccess::where('feature_id', $feature->id)->delete();
            $feature->delete();
        }
    }
};
