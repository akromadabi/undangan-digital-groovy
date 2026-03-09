<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LiveTamuController extends Controller
{
    public function index(Request $request)
    {
        $invitation = $request->user()->invitation;

        return Inertia::render('Dashboard/LiveTamu', [
            'invitation' => $invitation?->only(['id', 'slug', 'live_delay', 'live_counter', 'live_template']),
            'liveUrl' => $invitation ? url("/live/{$invitation->slug}") : null,
        ]);
    }

    public function saveSettings(Request $request)
    {
        $request->validate([
            'live_delay' => 'required|integer|min:1|max:30',
            'live_counter' => 'required|boolean',
            'live_template' => 'required|in:elegant,celebration',
        ]);

        $invitation = $request->user()->invitation;
        $invitation->update($request->only(['live_delay', 'live_counter', 'live_template']));

        return back()->with('success', 'Pengaturan Live Tamu berhasil disimpan.');
    }

    /**
     * Polling endpoint for user's own invitation
     */
    public function data(Request $request)
    {
        $invitation = $request->user()->invitation;
        if (!$invitation) {
            return response()->json(['guests' => [], 'stats' => ['checked_in' => 0, 'total' => 0]]);
        }

        $guests = Guest::where('invitation_id', $invitation->id)
            ->where('checked_in', true)
            ->orderByDesc('checked_in_at')
            ->get(['id', 'name', 'group_name', 'checked_in_at']);

        return response()->json([
            'guests' => $guests,
            'stats' => [
                'checked_in' => $guests->count(),
                'total' => Guest::where('invitation_id', $invitation->id)->count(),
            ],
        ]);
    }

    /**
     * Public fullscreen live tamu page (no auth required)
     */
    public function fullscreen($slug)
    {
        $invitation = \App\Models\Invitation::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('LiveTamu/Fullscreen', [
            'invitation' => $invitation->only(['id', 'slug', 'live_delay', 'live_counter', 'live_template']),
            'colors' => $invitation->theme?->color_scheme ?? ['primary' => '#B76E79', 'secondary' => '#D4A373', 'bg' => '#FFF9F5', 'text' => '#2D2D2D'],
        ]);
    }

    /**
     * Public data endpoint for fullscreen page
     */
    public function publicData($slug)
    {
        $invitation = \App\Models\Invitation::where('slug', $slug)->firstOrFail();

        $guests = Guest::where('invitation_id', $invitation->id)
            ->where('checked_in', true)
            ->orderByDesc('checked_in_at')
            ->get(['id', 'name', 'group_name', 'checked_in_at']);

        return response()->json([
            'guests' => $guests,
            'stats' => [
                'checked_in' => $guests->count(),
                'total' => Guest::where('invitation_id', $invitation->id)->count(),
            ],
        ]);
    }
}
