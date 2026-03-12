<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isReseller = $user->isReseller();

        // Reseller only sees their own users; super_admin sees all
        $userQuery = User::where('role', 'user');
        if ($isReseller) {
            $userQuery->where('reseller_id', $user->id);
        }

        $invitationQuery = Invitation::where('is_active', true);
        $paymentQuery = Payment::query();
        if ($isReseller) {
            $userIds = User::where('reseller_id', $user->id)->pluck('id');
            $invitationQuery->whereIn('user_id', $userIds);
            $paymentQuery->whereIn('user_id', $userIds);
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => (clone $userQuery)->count(),
                'active_invitations' => (clone $invitationQuery)->count(),
                'total_revenue' => (clone $paymentQuery)->where('status', 'paid')->sum('amount'),
                'pending_payments' => (clone $paymentQuery)->where('status', 'pending')->count(),
            ],
            'recentUsers' => (clone $userQuery)->latest()->take(10)->get(['id', 'name', 'email', 'created_at']),
            'recentPayments' => (clone $paymentQuery)->with('user:id,name', 'plan:id,name')
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }
}
