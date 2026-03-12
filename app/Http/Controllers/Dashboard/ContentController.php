<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\BrideGroom;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\LoveStory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentController extends Controller
{
    private function getUserInvitation(Request $request)
    {
        return $request->user()->invitation;
    }

    // Teks & Sambutan (merged Opening + Penutup)
    public function teksSambutan(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        $religion = $invitation->religion ?? 'islam';
        $quoteTemplates = \App\Models\QuoteTemplate::active()
            ->orderBy('religion')
            ->orderBy('sort_order')
            ->get(['id', 'religion', 'title', 'ayat', 'translation', 'source']);

        return Inertia::render('Dashboard/Content/TeksSambutan', [
            'invitation' => $invitation?->only([
                'opening_title',
                'opening_text',
                'opening_ayat',
                'opening_ayat_translation',
                'opening_ayat_source',
                'closing_title',
                'closing_text',
                'turut_mengundang_text',
                'religion',
            ]),
            'quoteTemplates' => $quoteTemplates,
        ]);
    }

    public function saveOpening(Request $request)
    {
        $request->validate([
            'opening_title' => 'nullable|string|max:200',
            'opening_text' => 'nullable|string',
            'opening_ayat' => 'nullable|string',
            'opening_ayat_translation' => 'nullable|string',
            'opening_ayat_source' => 'nullable|string|max:200',
            'religion' => 'nullable|in:islam,kristen,hindu,buddha,umum',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->update($request->only(['opening_title', 'opening_text', 'opening_ayat', 'opening_ayat_translation', 'opening_ayat_source', 'religion']));

        return back()->with('success', 'Opening berhasil disimpan.');
    }

    // Mempelai
    public function mempelai(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        return Inertia::render('Dashboard/Content/Mempelai', [
            'brideGrooms' => $invitation?->brideGrooms ?? [],
        ]);
    }

    public function saveMempelai(Request $request)
    {
        $request->validate([
            'bride_grooms' => 'required|array|size:2',
            'bride_grooms.*.full_name' => 'required|string|max:150',
            'bride_grooms.*.nickname' => 'nullable|string|max:50',
            'bride_grooms.*.father_name' => 'nullable|string|max:150',
            'bride_grooms.*.mother_name' => 'nullable|string|max:150',
            'bride_grooms.*.gender' => 'required|in:pria,wanita',
            'bride_grooms.*.photo' => 'nullable|string|max:500',
            'bride_grooms.*.bio' => 'nullable|string',
            'bride_grooms.*.instagram' => 'nullable|string|max:100',
            'bride_grooms.*.tiktok' => 'nullable|string|max:100',
            'bride_grooms.*.twitter' => 'nullable|string|max:100',
            'bride_grooms.*.facebook' => 'nullable|string|max:100',
            'bride_grooms.*.child_order' => 'nullable|string|max:50',
        ]);

        $invitation = $this->getUserInvitation($request);

        foreach ($request->bride_grooms as $index => $data) {
            BrideGroom::updateOrCreate(
                ['invitation_id' => $invitation->id, 'order_number' => $index + 1],
                $data
            );
        }

        return back()->with('success', 'Data mempelai berhasil disimpan.');
    }

    // Acara
    public function acara(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        return Inertia::render('Dashboard/Content/Acara', [
            'events' => $invitation?->events ?? [],
        ]);
    }

    public function saveAcara(Request $request)
    {
        $request->validate([
            'events' => 'required|array|min:1',
            'events.*.event_type' => 'required|string',
            'events.*.event_name' => 'required|string|max:100',
            'events.*.event_date' => 'required|date',
            'events.*.start_time' => 'required',
            'events.*.end_time' => 'nullable',
            'events.*.timezone' => 'required|in:WIB,WITA,WIT',
            'events.*.venue_name' => 'nullable|string|max:200',
            'events.*.venue_address' => 'nullable|string',
            'events.*.gmaps_link' => 'nullable|string|max:500',
            'events.*.is_primary' => 'nullable|boolean',
            'events.*.streaming_platform' => 'nullable|string|max:50',
            'events.*.streaming_url' => 'nullable|string|max:500',
            'events.*.streamings' => 'nullable|array',
            'events.*.streamings.*.platform' => 'required_with:events.*.streamings|string|max:50',
            'events.*.streamings.*.url' => 'required_with:events.*.streamings|string|max:500',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->events()->delete();

        $hasPrimary = collect($request->events)->contains(fn($e) => !empty($e['is_primary']));

        foreach ($request->events as $index => $data) {
            // Filter out empty streamings
            $streamings = collect($data['streamings'] ?? [])->filter(fn($s) => !empty($s['platform']) && !empty($s['url']))->values()->toArray();

            Event::create(array_merge($data, [
                'invitation_id' => $invitation->id,
                'sort_order' => $index,
                'is_primary' => !empty($data['is_primary']) || (!$hasPrimary && $index === 0),
                'streamings' => !empty($streamings) ? $streamings : null,
                // Keep backward compat: first streaming goes to old fields
                'streaming_platform' => $streamings[0]['platform'] ?? ($data['streaming_platform'] ?? null),
                'streaming_url' => $streamings[0]['url'] ?? ($data['streaming_url'] ?? null),
            ]));
        }

        return back()->with('success', 'Data acara berhasil disimpan.');
    }

    // Galeri
    public function galeri(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        return Inertia::render('Dashboard/Content/Galeri', [
            'galleries' => $invitation?->galleries ?? [],
            'maxGalleries' => $request->user()->currentPlan()?->max_galleries ?? 3,
            'galleryMode' => $invitation?->gallery_mode ?? 'grid',
        ]);
    }

    public function saveGalleryMode(Request $request)
    {
        $request->validate([
            'gallery_mode' => 'required|in:grid,carousel,slide',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->update(['gallery_mode' => $request->gallery_mode]);

        return back()->with('success', 'Mode galeri berhasil disimpan.');
    }

    public function saveGaleri(Request $request)
    {
        $request->validate([
            'image_url' => 'required|string|max:500',
            'caption' => 'nullable|string|max:200',
        ]);

        $invitation = $this->getUserInvitation($request);
        $maxGalleries = $request->user()->currentPlan()?->max_galleries ?? 3;

        if ($invitation->galleries()->count() >= $maxGalleries) {
            return back()->withErrors(['image_url' => 'Jumlah foto sudah mencapai batas maksimal paket Anda.']);
        }

        Gallery::create([
            'invitation_id' => $invitation->id,
            'image_url' => $request->image_url,
            'caption' => $request->caption,
            'sort_order' => $invitation->galleries()->count(),
        ]);

        return back()->with('success', 'Foto berhasil ditambahkan.');
    }

    public function deleteGaleri(Request $request, $id)
    {
        $invitation = $this->getUserInvitation($request);
        $invitation->galleries()->where('id', $id)->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }

    // Kisah Cinta
    public function kisah(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        return Inertia::render('Dashboard/Content/Kisah', [
            'stories' => $invitation?->loveStories ?? [],
        ]);
    }

    public function saveKisah(Request $request)
    {
        $request->validate([
            'stories' => 'required|array',
            'stories.*.title' => 'required|string|max:200',
            'stories.*.story_date' => 'nullable|date',
            'stories.*.description' => 'nullable|string',
            'stories.*.image_url' => 'nullable|string|max:500',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->loveStories()->delete();

        foreach ($request->stories as $index => $data) {
            LoveStory::create(array_merge($data, [
                'invitation_id' => $invitation->id,
                'sort_order' => $index,
            ]));
        }

        return back()->with('success', 'Kisah cinta berhasil disimpan.');
    }

    // Bank / E-Wallet
    public function bank(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        return Inertia::render('Dashboard/Content/Bank', [
            'bankAccounts' => $invitation?->bankAccounts ?? [],
        ]);
    }

    public function saveBank(Request $request)
    {
        $request->validate([
            'accounts' => 'required|array',
            'accounts.*.bank_name' => 'required|string|max:100',
            'accounts.*.account_name' => 'required|string|max:150',
            'accounts.*.account_number' => 'required|string|max:50',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->bankAccounts()->delete();

        foreach ($request->accounts as $index => $data) {
            BankAccount::create(array_merge($data, [
                'invitation_id' => $invitation->id,
                'sort_order' => $index,
            ]));
        }

        return back()->with('success', 'Data bank berhasil disimpan.');
    }

    // Penutup save handler (used by TeksSambutan penutup tab)
    public function savePenutup(Request $request)
    {
        $request->validate([
            'closing_title' => 'nullable|string|max:200',
            'closing_text' => 'nullable|string',
            'turut_mengundang_text' => 'nullable|string',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->update($request->only(['closing_title', 'closing_text', 'turut_mengundang_text']));

        return back()->with('success', 'Penutup berhasil disimpan.');
    }

    // Guestbook
    public function guestbook(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        $wishes = $invitation?->wishes()->with('guest')->latest()->paginate(20) ?? [];

        return Inertia::render('Dashboard/Content/Guestbook', [
            'wishes' => $wishes,
        ]);
    }
}
