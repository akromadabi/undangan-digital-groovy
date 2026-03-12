<?php

namespace App\Http\Controllers;

use App\Models\BrideGroom;
use App\Models\Event;
use App\Models\Invitation;
use App\Models\InvitationSection;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WizardController extends Controller
{
    // Step 1: Verification
    public function verification(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Wizard/Verification', [
            'step' => 1,
            'isVerified' => $user->hasVerifiedEmail(),
        ]);
    }

    public function completeVerification(Request $request)
    {
        $user = $request->user();

        if ($user->onboarding_step < 1) {
            $user->update(['onboarding_step' => 1]);
        }

        return redirect()->route('wizard.link');
    }

    // Step 2: Link
    public function link(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;

        return Inertia::render('Wizard/Link', [
            'step' => 2,
            'currentSlug' => $invitation?->slug,
        ]);
    }

    public function checkLink(Request $request)
    {
        $request->validate(['slug' => 'required|string|min:3|max:50']);

        $slug = Str::slug($request->slug);
        $exists = Invitation::where('slug', $slug)->exists();

        return response()->json([
            'slug' => $slug,
            'available' => !$exists,
        ]);
    }

    public function saveLink(Request $request)
    {
        $request->validate(['slug' => 'required|string|min:3|max:50']);

        $user = $request->user();
        $slug = Str::slug($request->slug);

        // Check availability again
        $exists = Invitation::where('slug', $slug)
            ->where('user_id', '!=', $user->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['slug' => 'Link sudah dipakai. Silakan pilih link lain.']);
        }

        $invitation = $user->invitation;
        if ($invitation) {
            $invitation->update(['slug' => $slug]);
        } else {
            Invitation::create([
                'user_id' => $user->id,
                'slug' => $slug,
                'opening_title' => 'Bismillahirrahmanirrahim',
                'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.",
                'opening_ayat' => 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
                'closing_text' => "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
            ]);
        }

        if ($user->onboarding_step < 2) {
            $user->update(['onboarding_step' => 2]);
        }

        return redirect()->route('wizard.profile');
    }

    // Step 3: Profile (Bride & Groom)
    public function profile(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;
        $brideGrooms = $invitation ? $invitation->brideGrooms : [];

        return Inertia::render('Wizard/Profile', [
            'step' => 3,
            'brideGrooms' => $brideGrooms,
        ]);
    }

    public function saveProfile(Request $request)
    {
        $request->validate([
            'bride_grooms' => 'required|array|size:2',
            'bride_grooms.*.full_name' => 'required|string|max:150',
            'bride_grooms.*.nickname' => 'nullable|string|max:50',
            'bride_grooms.*.father_name' => 'nullable|string|max:150',
            'bride_grooms.*.mother_name' => 'nullable|string|max:150',
            'bride_grooms.*.gender' => 'required|in:pria,wanita',
            'bride_grooms.*.bio' => 'nullable|string',
            'bride_grooms.*.instagram' => 'nullable|string|max:100',
            'bride_grooms.*.tiktok' => 'nullable|string|max:100',
            'bride_grooms.*.twitter' => 'nullable|string|max:100',
            'bride_grooms.*.facebook' => 'nullable|string|max:100',
        ]);

        $user = $request->user();
        $invitation = $user->invitation;

        foreach ($request->bride_grooms as $index => $data) {
            BrideGroom::updateOrCreate(
                ['invitation_id' => $invitation->id, 'order_number' => $index + 1],
                $data
            );
        }

        if ($user->onboarding_step < 3) {
            $user->update(['onboarding_step' => 3]);
        }

        return redirect()->route('wizard.events');
    }

    // Step 4: Events
    public function events(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;
        $events = $invitation ? $invitation->events : [];

        return Inertia::render('Wizard/Events', [
            'step' => 4,
            'events' => $events,
        ]);
    }

    public function saveEvents(Request $request)
    {
        $request->validate([
            'events' => 'required|array|min:1',
            'events.*.event_type' => 'required|string|max:50',
            'events.*.event_name' => 'required|string|max:100',
            'events.*.event_date' => 'required|date',
            'events.*.start_time' => 'required',
            'events.*.end_time' => 'nullable',
            'events.*.timezone' => 'required|in:WIB,WITA,WIT',
            'events.*.venue_name' => 'nullable|string|max:200',
            'events.*.venue_address' => 'nullable|string',
            'events.*.gmaps_link' => 'nullable|url|max:500',
            'events.*.is_primary' => 'nullable|boolean',
            'events.*.streaming_platform' => 'nullable|string|max:50',
            'events.*.streaming_url' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $invitation = $user->invitation;

        // Remove existing events and re-create
        $invitation->events()->delete();

        // Check if any event is marked as primary
        $hasPrimary = collect($request->events)->contains(fn($e) => !empty($e['is_primary']));

        foreach ($request->events as $index => $data) {
            Event::create(array_merge($data, [
                'invitation_id' => $invitation->id,
                'sort_order' => $index,
                // If no event is explicitly marked primary, default first event as primary
                'is_primary' => !empty($data['is_primary']) || (!$hasPrimary && $index === 0),
            ]));
        }

        if ($user->onboarding_step < 4) {
            $user->update(['onboarding_step' => 4]);
        }

        return redirect()->route('wizard.template');
    }

    // Step 5: Template
    public function template(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;
        $themes = Theme::active()->orderBy('sort_order')->get();

        return Inertia::render('Wizard/Template', [
            'step' => 5,
            'themes' => $themes,
            'selectedThemeId' => $invitation?->theme_id,
        ]);
    }

    public function saveTemplate(Request $request)
    {
        $request->validate(['theme_id' => 'required|exists:themes,id']);

        $user = $request->user();
        $invitation = $user->invitation;
        $theme = Theme::findOrFail($request->theme_id);

        $invitation->update(['theme_id' => $theme->id]);

        // Initialize default sections from theme
        $invitation->sections()->delete();
        foreach ($theme->sections as $ts) {
            InvitationSection::create([
                'invitation_id' => $invitation->id,
                'section_key' => $ts->section_key,
                'section_name' => $ts->section_name,
                'sort_order' => $ts->default_order,
                'is_visible' => $ts->is_default,
            ]);
        }

        // Assign Free plan if no subscription
        if (!$user->activeSubscription) {
            $freePlan = SubscriptionPlan::where('slug', 'free')->first();
            if ($freePlan) {
                Subscription::create([
                    'user_id' => $user->id,
                    'plan_id' => $freePlan->id,
                    'status' => 'active',
                    'starts_at' => now(),
                    'expires_at' => null,
                ]);
            }
        }

        $user->update(['onboarding_step' => 6]);

        return redirect()->route('dashboard')->with('success', 'Selamat! Undangan digital Anda berhasil dibuat.');
    }
}
