<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Rsvp;
use App\Models\Wish;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function show(Request $request, string $slug)
    {
        $invitation = Invitation::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'theme',
                'brideGrooms',
                'events',
                'galleries',
                'loveStories',
                'bankAccounts',
                'sections' => fn($q) => $q->where('is_visible', true)->orderBy('sort_order'),
            ])
            ->firstOrFail();

        $guestSlug = $request->query('to');
        $guest = null;

        if ($guestSlug) {
            $guest = Guest::where('invitation_id', $invitation->id)
                ->where('slug', $guestSlug)
                ->first();
        }

        $wishes = $invitation->wishes()
            ->where('is_visible', true)
            ->latest()
            ->take(50)
            ->get();

        return Inertia::render('Invitation/Show', [
            'invitation' => $invitation,
            'sections' => $invitation->sections,
            'brideGrooms' => $invitation->brideGrooms,
            'events' => $invitation->events,
            'galleries' => $invitation->galleries,
            'loveStories' => $invitation->loveStories,
            'bankAccounts' => $invitation->bankAccounts,
            'guest' => $guest,
            'wishes' => $wishes,
        ]);
    }

    /**
     * QR Code Checkin — auto RSVP hadir
     */
    public function checkin(Request $request, string $slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        $guestSlug = $request->query('to');

        if (!$guestSlug) {
            return response()->json(['success' => false, 'message' => 'Kode tamu tidak ditemukan.'], 400);
        }

        $guest = Guest::where('invitation_id', $invitation->id)
            ->where('slug', $guestSlug)
            ->first();

        if (!$guest) {
            return response()->json(['success' => false, 'message' => 'Tamu tidak ditemukan.'], 404);
        }

        // Mark as checked in
        $guest->update([
            'checked_in' => true,
            'checked_in_at' => now(),
            'is_opened' => true,
            'opened_at' => $guest->opened_at ?? now(),
        ]);

        // Auto RSVP hadir
        Rsvp::updateOrCreate(
            [
                'invitation_id' => $invitation->id,
                'guest_id' => $guest->id,
            ],
            [
                'attendance' => 'hadir',
                'number_of_guests' => $guest->max_pax ?? 1,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Selamat datang, ' . $guest->name . '!',
            'guest' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'checked_in_at' => now()->toDateTimeString(),
            ],
        ]);
    }

    public function submitRsvp(Request $request, string $slug)
    {
        $request->validate([
            'guest_id' => 'nullable|integer',
            'attendance' => 'required|in:hadir,tidak_hadir,belum_pasti',
            'number_of_guests' => 'nullable|integer|min:1|max:10',
            'sender_name' => 'required_without:guest_id|string|max:150',
        ]);

        $invitation = Invitation::where('slug', $slug)->firstOrFail();

        Rsvp::updateOrCreate(
            [
                'invitation_id' => $invitation->id,
                'guest_id' => $request->guest_id,
            ],
            [
                'attendance' => $request->attendance,
                'number_of_guests' => $request->number_of_guests ?? 1,
            ]
        );

        return back()->with('success', 'Konfirmasi kehadiran berhasil disimpan.');
    }

    public function submitWish(Request $request, string $slug)
    {
        $request->validate([
            'sender_name' => 'required|string|max:150',
            'message' => 'required|string|max:500',
            'guest_id' => 'nullable|integer',
        ]);

        $invitation = Invitation::where('slug', $slug)->firstOrFail();

        Wish::create([
            'invitation_id' => $invitation->id,
            'guest_id' => $request->guest_id,
            'sender_name' => $request->sender_name,
            'message' => $request->message,
        ]);

        return back()->with('success', 'Ucapan berhasil dikirim.');
    }

    public function markOpened(Request $request, string $slug)
    {
        $request->validate(['guest_id' => 'required|integer']);

        Guest::where('id', $request->guest_id)->update([
            'is_opened' => true,
            'opened_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }
}
