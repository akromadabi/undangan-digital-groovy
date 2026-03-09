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
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::where('role', 'user')->count(),
                'active_invitations' => Invitation::where('is_active', true)->count(),
                'total_revenue' => Payment::where('status', 'paid')->sum('amount'),
                'pending_payments' => Payment::where('status', 'pending')->count(),
            ],
            'recentUsers' => User::where('role', 'user')->latest()->take(10)->get(['id', 'name', 'email', 'created_at']),
            'recentPayments' => Payment::with('user:id,name', 'plan:id,name')
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }
}
