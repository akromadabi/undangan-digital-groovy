<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Models\PlanFeatureAccess;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPlanController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::withCount('subscriptions')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Plans/Index', ['plans' => $plans]);
    }

    public function create()
    {
        return Inertia::render('Admin/Plans/Form', [
            'features' => Feature::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'slug' => 'required|string|max:50|unique:subscription_plans',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:0',
            'max_guests' => 'required|integer|min:1',
            'max_galleries' => 'required|integer|min:1',
            'features' => 'nullable|array',
        ]);

        $plan = SubscriptionPlan::create($request->only([
            'name',
            'slug',
            'description',
            'price',
            'duration_days',
            'max_guests',
            'max_galleries',
            'sort_order',
        ]));

        if ($request->features) {
            foreach ($request->features as $featureId => $enabled) {
                PlanFeatureAccess::create([
                    'plan_id' => $plan->id,
                    'feature_id' => $featureId,
                    'is_enabled' => (bool) $enabled,
                ]);
            }
        }

        return redirect()->route('admin.plans.index')->with('success', 'Paket berhasil dibuat.');
    }

    public function edit(SubscriptionPlan $plan)
    {
        return Inertia::render('Admin/Plans/Form', [
            'plan' => $plan->load('featureAccess.feature'),
            'features' => Feature::all(),
        ]);
    }

    public function update(Request $request, SubscriptionPlan $plan)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:0',
            'max_guests' => 'required|integer|min:1',
            'max_galleries' => 'required|integer|min:1',
            'features' => 'nullable|array',
        ]);

        $plan->update($request->only([
            'name',
            'description',
            'price',
            'duration_days',
            'max_guests',
            'max_galleries',
            'sort_order',
        ]));

        if ($request->features) {
            foreach ($request->features as $featureId => $enabled) {
                PlanFeatureAccess::updateOrCreate(
                    ['plan_id' => $plan->id, 'feature_id' => $featureId],
                    ['is_enabled' => (bool) $enabled]
                );
            }
        }

        return redirect()->route('admin.plans.index')->with('success', 'Paket berhasil diupdate.');
    }

    public function destroy(SubscriptionPlan $plan)
    {
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', 'Paket berhasil dihapus.');
    }
}
