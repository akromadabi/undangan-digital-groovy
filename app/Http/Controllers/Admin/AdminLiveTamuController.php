<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLiveTamuController extends Controller
{
    public function index()
    {
        $invitations = Invitation::where('is_active', true)
            ->with('user:id,name')
            ->get(['id', 'slug', 'user_id']);

        return Inertia::render('Admin/LiveTamu', [
            'invitations' => $invitations,
        ]);
    }

    /**
     * Polling endpoint — return recent check-ins for a given invitation
     */
    public function data(Request $request)
    {
        $invitationId = $request->query('invitation_id');

        if (!$invitationId) {
            // Return all recent checkins across all invitations
            $guests = Guest::where('checked_in', true)
                ->with('invitation:id,slug')
                ->orderByDesc('checked_in_at')
                ->take(50)
                ->get(['id', 'invitation_id', 'name', 'group_name', 'checked_in_at']);
        } else {
            $guests = Guest::where('invitation_id', $invitationId)
                ->where('checked_in', true)
                ->orderByDesc('checked_in_at')
                ->get(['id', 'name', 'group_name', 'checked_in_at', 'max_pax']);
        }

        $totalCheckedIn = $invitationId
            ? Guest::where('invitation_id', $invitationId)->where('checked_in', true)->count()
            : Guest::where('checked_in', true)->count();

        $totalGuests = $invitationId
            ? Guest::where('invitation_id', $invitationId)->count()
            : Guest::count();

        return response()->json([
            'guests' => $guests,
            'stats' => [
                'checked_in' => $totalCheckedIn,
                'total' => $totalGuests,
            ],
        ]);
    }
}
