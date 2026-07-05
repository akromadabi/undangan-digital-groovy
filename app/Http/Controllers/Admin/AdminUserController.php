<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = User::with(['invitations.activeSubscription.plan', 'invitations.wishes', 'greetingCards', 'reseller.resellerSettings']);

        if ($user->isSuperAdmin()) {
            $query->whereIn('role', ['user', 'editor']);
        } else {
            // Reseller only sees their own client users
            $query->where('role', 'user')->where('reseller_id', $user->id);
        }

        $users = $query
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:user,editor',
            'is_active' => 'boolean',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => $request->is_active ?? true,
            'onboarding_step' => $request->role === 'editor' ? 6 : 2,
        ]);

        return redirect()->route('super-admin.users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function show(User $user)
    {
        // Reseller can only view their own users
        if (!auth()->user()->isSuperAdmin()) {
            if ($user->reseller_id !== auth()->id()) {
                abort(403, 'Unauthorized action.');
            }
        }

        $user->load([
            'invitations.brideGrooms',
            'invitations.events',
            'invitations.guests',
            'invitations.wishes',
            'invitations.rsvps',
            'invitations.galleries',
            'activeSubscription.plan',
            'payments.plan',
            'reseller.resellerSettings'
        ]);

        $invitationsData = [];
        foreach ($user->invitations as $invitation) {
            $invitationsData[] = [
                'invitation' => $invitation,
                'stats' => [
                    'total_guests' => $invitation->guests->count(),
                    'rsvp_hadir' => $invitation->rsvps->where('attendance', 'hadir')->count(),
                    'rsvp_tidak' => $invitation->rsvps->where('attendance', 'tidak_hadir')->count(),
                    'total_wishes' => $invitation->wishes->count(),
                    'total_photos' => $invitation->galleries->count(),
                    'guests_opened' => $invitation->guests->where('is_opened', true)->count(),
                    'wa_sent' => $invitation->guests->where('wa_sent', true)->count(),
                ]
            ];
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'invitationsData' => $invitationsData,
            'siteUrl' => $user->getBrandBaseUrl(),
        ]);
    }

    public function edit(User $user)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $user->load([
            'invitations.brideGrooms',
            'invitations.events',
            'invitations.activeSubscription.plan',
            'activeSubscription.plan',
            'greetingCards'
        ]);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'plans' => SubscriptionPlan::where('type', 'invitation')->orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'role' => 'required|string|in:user,editor',
            // Multiple invitations validation
            'invitations' => 'nullable|array',
            'invitations.*.id' => 'required|exists:invitations,id',
            'invitations.*.slug' => 'nullable|string|max:100',
            'invitations.*.title' => 'nullable|string|max:255',
            'invitations.*.is_active' => 'nullable|boolean',
            'invitations.*.opening_title' => 'nullable|string|max:255',
            'invitations.*.opening_text' => 'nullable|string',
            'invitations.*.closing_title' => 'nullable|string|max:255',
            'invitations.*.closing_text' => 'nullable|string',
            'invitations.*.cover_title' => 'nullable|string|max:255',
            'invitations.*.cover_subtitle' => 'nullable|string|max:255',
        ]);

        // Update user
        $user->update($request->only(['name', 'email', 'phone', 'is_active', 'role']));

        // Update invitations
        if ($request->has('invitations')) {
            foreach ($request->input('invitations') as $invData) {
                $inv = $user->invitations()->find($invData['id']);
                if ($inv) {
                    $inv->update($invData);
                }
            }
        }

        return redirect()->back()->with('success', 'User berhasil diupdate.');
    }

    public function destroy(User $user)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $user->delete();
        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword(Request $request, User $user)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password berhasil direset.');
    }

    public function changePlan(Request $request, User $user)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'invitation_id' => 'nullable|exists:invitations,id',
        ]);

        $invitation = $request->invitation_id 
            ? $user->invitations()->find($request->invitation_id) 
            : $user->invitation;

        $sub = $invitation ? $invitation->activeSubscription : null;
        if ($sub) {
            $sub->update([
                'plan_id' => $request->plan_id,
                'status' => 'active',
            ]);
        } else {
            Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $request->plan_id,
                'invitation_id' => $invitation?->id,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => now()->addYear(),
            ]);
        }

        return back()->with('success', 'Paket user berhasil diubah.');
    }

    public function extendSubscription(Request $request, User $user)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'expires_at' => 'required|date|after:today',
            'invitation_id' => 'nullable|exists:invitations,id',
        ]);

        $invitation = $request->invitation_id 
            ? $user->invitations()->find($request->invitation_id) 
            : $user->invitation;
        
        $sub = $invitation ? $invitation->activeSubscription : null;
        if ($sub) {
            $updateData = ['expires_at' => $request->expires_at];
            if ($sub->plan && $sub->plan->slug === 'free') {
                $updateData['starts_at'] = now();
            }
            $sub->update($updateData);
        } else {
            // Create a free subscription with the date
            $freePlan = SubscriptionPlan::where('slug', 'free')->first() ?: SubscriptionPlan::orderBy('sort_order')->first();
            Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $freePlan->id,
                'invitation_id' => $invitation?->id,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => $request->expires_at,
            ]);
        }

        return back()->with('success', 'Masa aktif berhasil diperpanjang.');
    }

    public function toggleGreetingCard(Request $request, \App\Models\GreetingCard $greetingCard)
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $greetingCard->update([
            'is_active' => !$greetingCard->is_active
        ]);

        return back()->with('success', 'Status kartu ucapan berhasil diubah! 🎉');
    }

    public function debugActivate(User $user)
    {
        if (!app()->environment('local')) {
            abort(403, 'Akses dibatasi hanya untuk lingkungan local.');
        }

        $invitation = $user->invitations()->first();
        if (!$invitation) {
            return back()->with('error', 'User tidak memiliki undangan untuk diaktifkan.');
        }

        $plan = \App\Models\SubscriptionPlan::where('slug', 'platinum')->first() 
             ?: \App\Models\SubscriptionPlan::where('type', 'invitation')->first();

        if (!$plan) {
            return back()->with('error', 'Paket Platinum / Premium tidak ditemukan.');
        }

        // Determine price
        $price = (float)$plan->price;
        if ($user->reseller_id) {
            $resellerPrice = \App\Models\ResellerPlanPrice::where('reseller_id', $user->reseller_id)
                ->where('plan_id', $plan->id)
                ->first();
            if ($resellerPrice) {
                $price = (float)$resellerPrice->reseller_price;
            }
        }

        // Create a mock paid payment
        $payment = \App\Models\Payment::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'invitation_id' => $invitation->id,
            'amount' => $price,
            'discount_amount' => 0,
            'payment_method' => 'debug_direct',
            'payment_gateway' => 'manual',
            'status' => 'paid',
            'paid_at' => now(),
            'admin_notes' => 'Diaktifkan instan via User List Debug Tool.',
        ]);

        // Create subscription
        \App\Models\Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'invitation_id' => $invitation->id,
            'payment_id' => $payment->id,
            'starts_at' => now(),
            'expires_at' => $plan->duration_days > 0 ? now()->addDays($plan->duration_days) : null,
            'status' => 'active',
        ]);

        // Debit cost / credit profit if client belongs to a reseller
        if ($user->reseller_id) {
            $resellerSetting = \App\Models\ResellerSetting::where('user_id', $user->reseller_id)->first();
            $paymentMode = $resellerSetting ? $resellerSetting->payment_mode : 'admin';
            $basePrice = (float)$plan->price;

            if ($paymentMode === 'manual' || $paymentMode === 'reseller_gateway') {
                \App\Models\ResellerWallet::debitCost(
                    $user->reseller_id,
                    $payment->id,
                    $basePrice,
                    "Biaya modal paket {$plan->name} - Pelanggan {$user->name} (Direct Debug)"
                );
            } else {
                $profit = $price - $basePrice;
                if ($profit > 0) {
                    \App\Models\ResellerWallet::creditProfit(
                        $user->reseller_id,
                        $payment->id,
                        $profit,
                        "Profit dari {$user->name} - Paket {$plan->name} (Direct Debug)"
                    );
                }
            }
        }

        return back()->with('success', "✅ [Debug Mode] Undangan {$user->name} berhasil diaktifkan dengan Paket {$plan->name} secara instan!");
    }

    public function debugDeactivate(User $user)
    {
        if (!app()->environment('local')) {
            abort(403, 'Akses dibatasi hanya untuk lingkungan local.');
        }

        // Delete active subscriptions
        $user->invitations->each(function ($invitation) {
            $invitation->activeSubscription()->delete();
        });
        
        // Delete payments
        \App\Models\Payment::where('user_id', $user->id)->delete();

        return back()->with('success', "✅ [Debug Mode] Undangan {$user->name} berhasil dikembalikan ke Paket Free.");
    }
}
