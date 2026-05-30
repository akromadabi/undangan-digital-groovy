<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Feature;
use App\Models\SubscriptionPlan;
use App\Models\PlanFeatureAccess;

return new class extends Migration {
    public function up(): void
    {
        $music = Feature::where('slug', 'music')->first();
        if ($music) {
            $plans = SubscriptionPlan::all();
            foreach ($plans as $plan) {
                PlanFeatureAccess::updateOrCreate(
                    ['plan_id' => $plan->id, 'feature_id' => $music->id],
                    ['is_enabled' => true]
                );
            }
        }
    }

    public function down(): void
    {
        // Reverting defaults to database seed settings if needed
    }
};
