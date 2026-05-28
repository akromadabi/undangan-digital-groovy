<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Payment;
use App\Models\ResellerPlanPrice;
use App\Models\ResellerSetting;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SuperAdminResellerController extends Controller
{
    public function index(Request $request)
    {
        $resellers = User::where('role', 'admin')
            ->with('resellerSettings')
            ->withCount('resellerUsers')
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20);

        return Inertia::render('SuperAdmin/Resellers/Index', [
            'resellers' => $resellers,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);
        return Inertia::render('SuperAdmin/Resellers/Create', [
            'plans' => SubscriptionPlan::orderBy('sort_order')->get(),
            'centralHost' => $centralHost ?: 'undangan.com',
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => [
                'required',
                'email',
                \Illuminate\Validation\Rule::unique('users', 'email')->where(function ($query) {
                    $query->where('role', 'admin');
                })
            ],
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'brand_name' => 'nullable|string|max:100',
            'subdomain' => 'nullable|string|max:50|unique:reseller_settings,subdomain|alpha_dash',
            'custom_domain' => 'nullable|string|max:255|unique:reseller_settings,custom_domain',
        ]);

        $reseller = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'admin',
            'is_active' => true,
            'onboarding_step' => 6, // Skip onboarding for resellers
            'email_verified_at' => now(),
        ]);

        // Create reseller settings
        ResellerSetting::create([
            'user_id' => $reseller->id,
            'brand_name' => $request->brand_name ?? $request->name,
            'subdomain' => $request->subdomain ?? Str::slug($request->name),
            'custom_domain' => $request->custom_domain,
            'is_active' => true,
        ]);

        return redirect()->route('super-admin.resellers.show', $reseller)->with('success', 'Reseller berhasil dibuat.');
    }

    public function show(User $reseller)
    {
        abort_if($reseller->role !== 'admin', 404);

        $reseller->load(['resellerSettings', 'resellerPlanPrices.plan']);

        $users = User::where('reseller_id', $reseller->id)
            ->with('activeSubscription.plan')
            ->latest()
            ->paginate(20);

        $stats = [
            'total_users' => User::where('reseller_id', $reseller->id)->count(),
            'active_invitations' => Invitation::whereHas('user', fn($q) => $q->where('reseller_id', $reseller->id))
                ->where('is_active', true)->count(),
            'total_revenue' => Payment::whereHas('user', fn($q) => $q->where('reseller_id', $reseller->id))
                ->where('status', 'paid')->sum('amount'),
        ];

        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);

        return Inertia::render('SuperAdmin/Resellers/Show', [
            'reseller' => $reseller,
            'users' => $users,
            'stats' => $stats,
            'plans' => SubscriptionPlan::orderBy('sort_order')->get(),
            'centralHost' => $centralHost ?: 'undangan.com',
        ]);
    }

    public function edit(User $reseller)
    {
        abort_if($reseller->role !== 'admin', 404);
        $reseller->load(['resellerSettings', 'resellerPlanPrices.plan']);

        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);

        return Inertia::render('SuperAdmin/Resellers/Edit', [
            'reseller' => $reseller,
            'plans' => SubscriptionPlan::orderBy('sort_order')->get(),
            'centralHost' => $centralHost ?: 'undangan.com',
        ]);
    }

    public function update(Request $request, User $reseller)
    {
        abort_if($reseller->role !== 'admin', 404);

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => [
                'required',
                'email',
                \Illuminate\Validation\Rule::unique('users', 'email')->ignore($reseller->id)->where(function ($query) {
                    $query->where('role', 'admin');
                })
            ],
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'brand_name' => 'nullable|string|max:100',
            'subdomain' => 'nullable|string|max:50|alpha_dash|unique:reseller_settings,subdomain,' . $reseller->resellerSettings?->id,
            'custom_domain' => 'nullable|string|max:255|unique:reseller_settings,custom_domain,' . $reseller->resellerSettings?->id,
        ]);

        $reseller->update($request->only(['name', 'email', 'phone', 'is_active']));

        $reseller->resellerSettings()->updateOrCreate(
            ['user_id' => $reseller->id],
            [
                'brand_name' => $request->brand_name,
                'subdomain' => $request->subdomain,
                'custom_domain' => $request->custom_domain,
                'is_active' => $reseller->is_active, // Sync is_active status to reseller settings
            ]
        );

        return redirect()->route('super-admin.resellers.show', $reseller)->with('success', 'Reseller berhasil diperbarui.');
    }

    public function destroy(User $reseller)
    {
        abort_if($reseller->role !== 'admin', 404);

        // Reassign users to no reseller
        User::where('reseller_id', $reseller->id)->update(['reseller_id' => null]);

        $reseller->delete();

        return redirect()->route('super-admin.resellers.index')->with('success', 'Reseller berhasil dihapus.');
    }

    public function resetPassword(Request $request, User $reseller)
    {
        abort_if($reseller->role !== 'admin', 404);

        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $reseller->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password reseller berhasil direset.');
    }

    /**
     * Update harga plan per reseller
     */
    public function updatePrices(Request $request, User $reseller)
    {
        abort_if($reseller->role !== 'admin', 404);

        $request->validate([
            'prices' => 'required|array',
            'prices.*.plan_id' => 'required|exists:subscription_plans,id',
            'prices.*.reseller_price' => 'required|numeric|min:0',
        ]);

        foreach ($request->prices as $priceData) {
            ResellerPlanPrice::updateOrCreate(
                [
                    'reseller_id' => $reseller->id,
                    'plan_id' => $priceData['plan_id'],
                ],
                [
                    'reseller_price' => $priceData['reseller_price'],
                ]
            );
        }

        return back()->with('success', 'Harga reseller berhasil diperbarui.');
    }

    /**
     * Toggle status aktif/nonaktif reseller
     */
    public function toggleStatus(User $reseller)
    {
        abort_if($reseller->role !== 'admin', 404);

        $newStatus = !$reseller->is_active;

        $reseller->update(['is_active' => $newStatus]);
        $reseller->resellerSettings()->update(['is_active' => $newStatus]);

        $statusStr = $newStatus ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Reseller {$reseller->name} berhasil {$statusStr}.");
    }
}
