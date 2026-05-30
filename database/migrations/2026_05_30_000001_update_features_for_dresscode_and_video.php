<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Feature;
use App\Models\SubscriptionPlan;
use App\Models\PlanFeatureAccess;

return new class extends Migration {
    public function up(): void
    {
        // 1. Delete redundant "jumlah_tamu" feature
        $jumlahTamu = Feature::where('slug', 'jumlah_tamu')->first();
        if ($jumlahTamu) {
            PlanFeatureAccess::where('feature_id', $jumlahTamu->id)->delete();
            $jumlahTamu->delete();
        }

        // 2. Add dresscode feature
        $dresscodeData = [
            'name' => 'Dresscode',
            'slug' => 'dresscode',
            'category' => 'content',
            'icon' => 'MdCheckroom',
            'description' => 'Fitur anjuran pakaian/dresscode untuk para tamu undangan',
        ];
        $dresscode = Feature::updateOrCreate(['slug' => $dresscodeData['slug']], $dresscodeData);

        // 3. Add video wedding feature
        $videoWeddingData = [
            'name' => 'Video Wedding',
            'slug' => 'video_wedding',
            'category' => 'content',
            'icon' => 'MdPlayCircleOutline',
            'description' => 'Fitur untuk menambahkan video pernikahan/galeri video',
        ];
        $videoWedding = Feature::updateOrCreate(['slug' => $videoWeddingData['slug']], $videoWeddingData);

        // 4. Enable dresscode and video_wedding for all packages
        $plans = SubscriptionPlan::all();
        foreach ($plans as $plan) {
            PlanFeatureAccess::updateOrCreate(
                ['plan_id' => $plan->id, 'feature_id' => $dresscode->id],
                ['is_enabled' => true]
            );

            PlanFeatureAccess::updateOrCreate(
                ['plan_id' => $plan->id, 'feature_id' => $videoWedding->id],
                ['is_enabled' => true]
            );
        }
    }

    public function down(): void
    {
        // Reverse dresscode
        $dresscode = Feature::where('slug', 'dresscode')->first();
        if ($dresscode) {
            PlanFeatureAccess::where('feature_id', $dresscode->id)->delete();
            $dresscode->delete();
        }

        // Reverse video wedding
        $videoWedding = Feature::where('slug', 'video_wedding')->first();
        if ($videoWedding) {
            PlanFeatureAccess::where('feature_id', $videoWedding->id)->delete();
            $videoWedding->delete();
        }
    }
};
