<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminGreetingCardPlanController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::where('type', 'greeting_card')
            ->withCount('subscriptions')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('SuperAdmin/GreetingCardPlans/Index', [
            'plans' => $plans,
        ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/GreetingCardPlans/Form', [
            'plan' => null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'            => 'required|string|max:50',
            'slug'            => 'required|string|max:50|unique:subscription_plans',
            'price'           => 'required|numeric|min:0',
            'suggested_price' => 'nullable|numeric|min:0',
            'duration_days'   => 'required|integer|min:0',
            'max_galleries'   => 'required|integer|min:1',
            'description'     => 'nullable|string|max:500',
            'sort_order'      => 'required|integer',
        ]);

        SubscriptionPlan::create(array_merge($request->only([
            'name',
            'slug',
            'price',
            'suggested_price',
            'duration_days',
            'max_galleries',
            'description',
            'sort_order',
        ]), [
            'type'       => 'greeting_card',
            'max_guests' => 0, // Not applicable for greeting cards
            'is_active'  => true,
        ]));

        return redirect()->route('super-admin.greeting-card-plans.index')
            ->with('success', 'Paket kartu ucapan berhasil dibuat.');
    }

    public function edit($id)
    {
        $plan = SubscriptionPlan::where('type', 'greeting_card')->findOrFail($id);

        return Inertia::render('SuperAdmin/GreetingCardPlans/Form', [
            'plan' => $plan,
        ]);
    }

    public function update(Request $request, $id)
    {
        $plan = SubscriptionPlan::where('type', 'greeting_card')->findOrFail($id);

        $request->validate([
            'name'            => 'required|string|max:50',
            'price'           => 'required|numeric|min:0',
            'suggested_price' => 'nullable|numeric|min:0',
            'duration_days'   => 'required|integer|min:0',
            'max_galleries'   => 'required|integer|min:1',
            'description'     => 'nullable|string|max:500',
            'sort_order'      => 'required|integer',
        ]);

        $plan->update($request->only([
            'name',
            'price',
            'suggested_price',
            'duration_days',
            'max_galleries',
            'description',
            'sort_order',
        ]));

        return redirect()->route('super-admin.greeting-card-plans.index')
            ->with('success', 'Paket kartu ucapan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $plan = SubscriptionPlan::where('type', 'greeting_card')->findOrFail($id);
        $plan->delete();

        return redirect()->route('super-admin.greeting-card-plans.index')
            ->with('success', 'Paket kartu ucapan berhasil dihapus.');
    }
}
