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
        return redirect()->route('wizard.link');
    }

    public function completeVerification(Request $request)
    {
        return redirect()->route('wizard.link');
    }

    // Step 2: Link
    public function link(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;

        return Inertia::render('Wizard/Link', [
            'step' => 1,
            'currentSlug' => $invitation?->slug,
            'defaultType' => $invitation?->type ?? $request->query('type') ?? $request->query('category') ?? 'wedding',
        ]);
    }

    public function checkLink(Request $request)
    {
        $request->validate(['slug' => 'required|string|min:3|max:50']);

        $slug = Str::slug($request->slug);
        $user = $request->user();

        // Kecualikan invitation milik user sendiri agar tidak dianggap "sudah dipakai"
        // ketika user kembali ke step ini setelah sebelumnya sudah menyimpan slug
        $exists = Invitation::where('slug', $slug)
            ->when($user, fn($q) => $q->where('user_id', '!=', $user->id))
            ->exists();

        return response()->json([
            'slug' => $slug,
            'available' => !$exists,
        ]);
    }

    public function saveLink(Request $request)
    {
        $request->validate([
            'slug' => 'required|string|min:3|max:50',
            'type' => 'required|string|in:wedding,birthday,graduation,aqiqah,circumcision,anniversary,general',
        ]);

        $user = $request->user();
        $slug = Str::slug($request->slug);
        $type = $request->type;

        // Check availability again
        $exists = Invitation::where('slug', $slug)
            ->where('user_id', '!=', $user->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['slug' => 'Link sudah dipakai. Silakan pilih link lain.']);
        }

        // Determine default opening text based on chosen type
        $defaultOpeningTexts = [
            'wedding' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.",
            'birthday' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara syukuran ulang tahun.",
            'graduation' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara syukuran kelulusan/wisuda.",
            'aqiqah' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara syukuran aqiqah putra-putri kami.",
            'circumcision' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara syukuran khitanan putra kami.",
            'anniversary' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara syukuran hari jadi / anniversary.",
            'general' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara syukuran kami.",
        ];

        $openingText = $defaultOpeningTexts[$type] ?? $defaultOpeningTexts['general'];

        $invitation = $user->invitation;
        if ($invitation) {
            $invitation->update([
                'slug' => $slug,
                'type' => $type,
            ]);
        } else {
            Invitation::create([
                'user_id' => $user->id,
                'slug' => $slug,
                'type' => $type,
                'opening_title' => 'Bismillahirrahmanirrahim',
                'opening_text' => $openingText,
                'opening_ayat' => 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
                'closing_text' => "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
            ]);
        }

        if ($user->onboarding_step < 3) {
            $user->update(['onboarding_step' => 3]);
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
            'step' => 2,
            'brideGrooms' => $brideGrooms,
            'eventType' => $invitation ? $invitation->type : 'wedding',
        ]);
    }

    public function saveProfile(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;
        $type = $invitation->type ?? 'wedding';
        $size = in_array($type, ['wedding', 'anniversary']) ? 2 : 1;

        $request->validate([
            'bride_grooms' => "required|array|size:{$size}",
            'bride_grooms.*.full_name' => 'required|string|max:150',
            'bride_grooms.*.nickname' => 'nullable|string|max:50',
            'bride_grooms.*.father_name' => 'nullable|string|max:150',
            'bride_grooms.*.mother_name' => 'nullable|string|max:150',
            'bride_grooms.*.child_order' => 'nullable|string|max:50',
            'bride_grooms.*.gender' => 'required|in:pria,wanita',
            'bride_grooms.*.bio' => 'nullable|string',
            'bride_grooms.*.instagram' => 'nullable|string|max:100',
            'bride_grooms.*.tiktok' => 'nullable|string|max:100',
            'bride_grooms.*.twitter' => 'nullable|string|max:100',
            'bride_grooms.*.facebook' => 'nullable|string|max:100',
        ]);

        // Delete extra records
        $invitation->brideGrooms()->where('order_number', '>', $size)->delete();

        foreach ($request->bride_grooms as $index => $data) {
            BrideGroom::updateOrCreate(
                ['invitation_id' => $invitation->id, 'order_number' => $index + 1],
                $data
            );
        }

        if ($user->onboarding_step < 4) {
            $user->update(['onboarding_step' => 4]);
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
            'step' => 3,
            'events' => $events,
            'eventType' => $invitation ? $invitation->type : 'wedding',
        ]);
    }

    public function saveEvents(Request $request)
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
            'events.*.show_dress_code' => 'sometimes|boolean',
            'events.*.dress_code_text' => 'nullable|string|max:1000',
            'events.*.dress_code_colors' => 'nullable|array',
        ]);

        $user = $request->user();
        $invitation = $user->invitation;

        // Remove existing events and re-create
        $invitation->events()->delete();

        // Check if any event is marked as primary
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

        if ($user->onboarding_step < 5) {
            $user->update(['onboarding_step' => 5]);
        }

        return redirect()->route('wizard.template');
    }

    // Step 5: Template
    public function template(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;
        
        $themes = Theme::active()
            ->where(function ($query) use ($invitation) {
                if ($invitation && $invitation->type) {
                    $query->where('type', $invitation->type)
                          ->orWhere('type', 'general')
                          ->orWhere('type', 'like', '%"' . $invitation->type . '"%')
                          ->orWhere('type', 'like', '%"general"%');
                }
            })
            ->orderBy('sort_order')
            ->get();

        $themes = Theme::applyResellerCustomizations($themes, $user->reseller_id);

        return Inertia::render('Wizard/Template', [
            'step' => 4,
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

        // Security check: Verify if the user's plan is allowed to use this theme
        if (!$user->isSuperAdmin() && !$user->isAdmin()) {
            if ($theme->allowed_plans && count($theme->allowed_plans) > 0) {
                $userPlan = $user->currentPlan();
                if (!$userPlan || !in_array($userPlan->id, $theme->allowed_plans)) {
                    return back()->withErrors(['theme_id' => 'Tema ini terkunci oleh Paket Anda.']);
                }
            }
        }

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
        if (!$invitation->activeSubscription) {
            // Check if the user has an active direct subscription (invitation_id = null)
            $directSub = Subscription::where('user_id', $user->id)
                ->whereNull('invitation_id')
                ->where('status', 'active')
                ->latest()
                ->first();

            if ($directSub) {
                // Link the user's direct subscription to this new invitation!
                $directSub->update(['invitation_id' => $invitation->id]);
            } else {
                $freePlan = SubscriptionPlan::where('slug', 'free')->first();
                if ($freePlan) {
                    Subscription::create([
                        'user_id' => $user->id,
                        'plan_id' => $freePlan->id,
                        'invitation_id' => $invitation->id,
                        'status' => 'active',
                        'starts_at' => now(),
                        'expires_at' => null,
                    ]);
                }
            }
        }

        $user->update(['onboarding_step' => 6]);

        return redirect()->route('dashboard')
            ->with('success', 'Selamat! Undangan digital Anda berhasil dibuat.')
            ->with('show_welcome_modal', true);
    }
}
