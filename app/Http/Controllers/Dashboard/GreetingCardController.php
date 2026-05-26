<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\GreetingCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GreetingCardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $cards = GreetingCard::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn ($card) => [
                'id'             => $card->id,
                'title'          => $card->title,
                'template'       => $card->template,
                'template_label' => $card->template_label,
                'type'           => $card->type,
                'type_label'     => $card->type_label,
                'recipient_name' => $card->recipient_name,
                'sender_name'    => $card->sender_name,
                'photo_url'      => $card->photo_url,
                'custom_url'     => $card->custom_url,
                'share_url'      => $card->getShareUrl(),
                'is_active'      => $card->is_active,
                'created_at'     => $card->created_at->format('d M Y'),
            ]);

        return Inertia::render('Dashboard/GreetingCard/Index', [
            'cards' => $cards,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/GreetingCard/Form', [
            'card'      => null,
            'types'     => GreetingCard::$types,
            'templates' => GreetingCard::$templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'nullable|string|max:100',
            'template'       => 'required|in:stillwithyou,giftforanita',
            'type'           => 'required|in:anniversary,birthday,graduation,wedding',
            'recipient_name' => 'required|string|max:100',
            'sender_name'    => 'required|string|max:100',
            'photo_url'      => 'nullable|string|max:500',
            'photos'         => 'nullable|array',
            'photos.*'       => 'nullable|string|max:500',
            'messages'       => 'nullable|array',
            'messages.*'     => 'nullable|string|max:500',
        ]);

        $card = GreetingCard::create([
            ...$validated,
            'user_id'    => $request->user()->id,
            'title'      => $validated['title'] ?: 'Kartu Ucapan',
            'messages'   => array_values(array_filter($validated['messages'] ?? [])),
            'photos'     => array_values(array_filter($validated['photos'] ?? [])),
            'custom_url' => GreetingCard::generateUniqueSlug(),
        ]);

        return redirect()->route('greeting-card.index')
            ->with('success', 'Kartu ucapan berhasil dibuat! 🎉');
    }

    public function edit(Request $request, $id)
    {
        $user = $request->user();
        $card = GreetingCard::where('user_id', $user->id)->findOrFail($id);

        return Inertia::render('Dashboard/GreetingCard/Form', [
            'card'      => [
                'id'             => $card->id,
                'title'          => $card->title,
                'template'       => $card->template,
                'type'           => $card->type,
                'recipient_name' => $card->recipient_name,
                'sender_name'    => $card->sender_name,
                'photo_url'      => $card->photo_url,
                'photos'         => $card->photos ?? ($card->photo_url ? [$card->photo_url] : []),
                'messages'       => $card->messages ?? [],
                'custom_url'     => $card->custom_url,
                'share_url'      => $card->getShareUrl(),
            ],
            'types'     => GreetingCard::$types,
            'templates' => GreetingCard::$templates,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $card = GreetingCard::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'title'          => 'nullable|string|max:100',
            'template'       => 'required|in:stillwithyou,giftforanita',
            'type'           => 'required|in:anniversary,birthday,graduation,wedding',
            'recipient_name' => 'required|string|max:100',
            'sender_name'    => 'required|string|max:100',
            'photo_url'      => 'nullable|string|max:500',
            'photos'         => 'nullable|array',
            'photos.*'       => 'nullable|string|max:500',
            'messages'       => 'nullable|array',
            'messages.*'     => 'nullable|string|max:500',
        ]);

        $card->update([
            ...$validated,
            'title'    => $validated['title'] ?: 'Kartu Ucapan',
            'messages' => array_values(array_filter($validated['messages'] ?? [])),
            'photos'   => array_values(array_filter($validated['photos'] ?? [])),
        ]);

        return redirect()->route('greeting-card.index')
            ->with('success', 'Kartu ucapan berhasil diperbarui! ✨');
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $card = GreetingCard::where('user_id', $user->id)->findOrFail($id);
        $card->delete();

        return back()->with('success', 'Kartu ucapan dihapus.');
    }

    /**
     * Public preview — no auth required.
     */
    public function preview($slug)
    {
        $card = GreetingCard::where('custom_url', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('GreetingCardPreview', [
            'card' => [
                'id'             => $card->id,
                'title'          => $card->title,
                'template'       => $card->template,
                'type'           => $card->type,
                'type_label'     => $card->type_label,
                'recipient_name' => $card->recipient_name,
                'sender_name'    => $card->sender_name,
                'photo_url'      => $card->photo_url,
                'photos'         => $card->photos ?? ($card->photo_url ? [$card->photo_url] : []),
                'messages'       => $card->messages ?? [],
            ],
        ]);
    }
}
