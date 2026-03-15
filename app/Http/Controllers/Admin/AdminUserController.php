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

        $query = User::where('role', 'user')
            ->with('activeSubscription.plan');

        // Reseller only sees their own users
        if ($user->isReseller()) {
            $query->where('reseller_id', $user->id);
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

    public function show(User $user)
    {
        $user->load(['invitation.brideGrooms', 'invitation.events', 'invitation.guests', 'invitation.wishes', 'invitation.rsvps', 'invitation.galleries', 'activeSubscription.plan', 'payments.plan']);

        $stats = null;
        if ($user->invitation) {
            $stats = [
                'total_guests' => $user->invitation->guests->count(),
                'rsvp_hadir' => $user->invitation->rsvps->where('attendance', 'hadir')->count(),
                'rsvp_tidak' => $user->invitation->rsvps->where('attendance', 'tidak_hadir')->count(),
                'total_wishes' => $user->invitation->wishes->count(),
                'total_photos' => $user->invitation->galleries->count(),
                'guests_opened' => $user->invitation->guests->where('is_opened', true)->count(),
                'wa_sent' => $user->invitation->guests->where('wa_sent', true)->count(),
            ];
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'stats' => $stats,
            'siteUrl' => url('/'),
        ]);
    }

    public function edit(User $user)
    {
        $user->load(['invitation.brideGrooms', 'invitation.events', 'activeSubscription.plan']);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'plans' => SubscriptionPlan::orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            // Invitation fields
            'invitation.slug' => 'nullable|string|max:100',
            'invitation.title' => 'nullable|string|max:255',
            'invitation.is_active' => 'nullable|boolean',
            'invitation.opening_title' => 'nullable|string|max:255',
            'invitation.opening_text' => 'nullable|string',
            'invitation.closing_title' => 'nullable|string|max:255',
            'invitation.closing_text' => 'nullable|string',
            'invitation.cover_title' => 'nullable|string|max:255',
            'invitation.cover_subtitle' => 'nullable|string|max:255',
        ]);

        // Update user
        $user->update($request->only(['name', 'email', 'phone', 'is_active']));

        // Update invitation
        if ($request->has('invitation') && $user->invitation) {
            $user->invitation->update($request->input('invitation'));
        }

        return redirect()->back()->with('success', 'User berhasil diupdate.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password berhasil direset.');
    }

    public function changePlan(Request $request, User $user)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $sub = $user->activeSubscription;
        if ($sub) {
            $sub->update([
                'plan_id' => $request->plan_id,
                'status' => 'active',
            ]);
        } else {
            Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $request->plan_id,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => now()->addYear(),
            ]);
        }

        return back()->with('success', 'Paket user berhasil diubah.');
    }

    public function extendSubscription(Request $request, User $user)
    {
        $request->validate([
            'expires_at' => 'required|date|after:today',
        ]);

        $sub = $user->activeSubscription;
        if ($sub) {
            $sub->update(['expires_at' => $request->expires_at]);
        } else {
            // Create a free subscription with the date
            $freePlan = SubscriptionPlan::orderBy('sort_order')->first();
            Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $freePlan->id,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => $request->expires_at,
            ]);
        }

        return back()->with('success', 'Masa aktif berhasil diperpanjang.');
    }
}
