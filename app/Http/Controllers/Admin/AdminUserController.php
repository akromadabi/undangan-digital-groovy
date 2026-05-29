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
            ->with(['invitations.activeSubscription.plan', 'reseller.resellerSettings']);

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
            'siteUrl' => url('/'),
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
            'activeSubscription.plan'
        ]);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'plans' => SubscriptionPlan::orderBy('sort_order')->get(),
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
        $user->update($request->only(['name', 'email', 'phone', 'is_active']));

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
}
