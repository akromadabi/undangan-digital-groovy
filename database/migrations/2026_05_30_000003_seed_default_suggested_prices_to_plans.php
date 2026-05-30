<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\SubscriptionPlan;

return new class extends Migration {
    public function up(): void
    {
        $suggestedPrices = [
            'silver' => 99000,
            'gold' => 199000,
            'platinum' => 299000,
        ];

        foreach ($suggestedPrices as $slug => $price) {
            $plan = SubscriptionPlan::where('slug', $slug)->first();
            if ($plan) {
                $plan->update(['suggested_price' => $price]);
            }
        }
    }

    public function down(): void
    {
        SubscriptionPlan::whereIn('slug', ['silver', 'gold', 'platinum'])->update(['suggested_price' => null]);
    }
};
