<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;

        $stats = [];
        if ($invitation) {
            $stats = [
                'total_guests' => $invitation->guests()->count(),
                'rsvp_hadir' => $invitation->rsvps()->where('attendance', 'hadir')->count(),
                'rsvp_tidak' => $invitation->rsvps()->where('attendance', 'tidak_hadir')->count(),
                'total_wishes' => $invitation->wishes()->count(),
                'total_opened' => $invitation->guests()->where('is_opened', true)->count(),
            ];
        }

        // Get all features with lock status for dashboard grid
        $features = Feature::all()->map(function ($feature) use ($user) {
            return [
                'id' => $feature->id,
                'name' => $feature->name,
                'slug' => $feature->slug,
                'category' => $feature->category,
                'icon' => $feature->icon,
                'is_locked' => !$user->hasFeatureAccess($feature->slug),
            ];
        });

        $subscription = $invitation ? $invitation->activeSubscription : $user->activeSubscription;
        $dashboardSubscription = null;
        if ($subscription) {
            $dashboardSubscription = [
                'plan_name' => $subscription->plan->name,
                'plan_slug' => $subscription->plan->slug,
                'status' => $subscription->status,
                'expires_at' => $subscription->expires_at?->format('d M Y'),
            ];
        } elseif ($user->isAdmin() || $user->isSuperAdmin()) {
            $dashboardSubscription = [
                'plan_name' => $user->isSuperAdmin() ? 'Super Admin' : 'Administrator',
                'plan_slug' => 'premium',
                'status' => 'active',
                'expires_at' => null,
            ];
        }

        // Resolve WhatsApp Support Link
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        if (!$resellerSetting && $user && $user->reseller) {
            $resellerSetting = $user->reseller->resellerSettings;
        }

        $whatsappNumber = $resellerSetting && $resellerSetting->footer_whatsapp 
            ? $resellerSetting->footer_whatsapp 
            : (\App\Models\GlobalSetting::where('setting_key', 'whatsapp_support')->value('setting_value') ?: '6281234567890');
        
        $whatsappLink = "https://wa.me/" . preg_replace('/[^0-9]/', '', $whatsappNumber) . "?text=" . urlencode("Halo Admin, saya ingin menanyakan tentang aktivasi/upgrade undangan digital saya.");

        return Inertia::render('Dashboard/Index', [
            'invitation' => $invitation,
            'stats' => $stats,
            'features' => $features,
            'dashboardSubscription' => $dashboardSubscription,
            'latestWishes' => $invitation?->wishes()->latest()->take(5)->get() ?? [],
            'whatsappLink' => $whatsappLink,
        ]);
    }

    public function tutorial()
    {
        return Inertia::render('Dashboard/Tutorial');
    }

    public function upload(Request $request)
    {
        // Override PHP limits for audio/large files
        @ini_set('upload_max_filesize', '20M');
        @ini_set('post_max_size', '25M');
        @ini_set('max_execution_time', '120');

        $request->validate([
            'file' => 'required|file|max:20480',
            'folder' => 'nullable|string',
        ]);

        try {
            $folder = $request->input('folder', 'uploads');
            
            $file = $request->file('file');
            \App\Helpers\ImageCompressor::compress($file);
            
            $ext = $file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'jpg';
            if ($ext === 'jpeg') {
                $ext = 'jpg';
            }

            $time = time();
            $rand = rand(100, 999);
            
            if ($folder === 'themes') {
                $themeSlug = $request->input('theme_slug') ?: $request->input('slug') ?: $request->input('theme_name') ?: '';
                $themePart = $themeSlug ? '-' . \Illuminate\Support\Str::slug($themeSlug) : '';
                $filename = "preview-tema{$themePart}-{$time}-{$rand}.{$ext}";
            } elseif (in_array($folder, ['bride_grooms', 'avatars', 'mempelai', 'couples'])) {
                $gender = $request->input('gender') ?: '';
                $genderPart = $gender ? '-' . \Illuminate\Support\Str::slug($gender) : '';
                $filename = "foto-mempelai{$genderPart}-{$time}-{$rand}.{$ext}";
            } elseif (in_array($folder, ['galleries', 'gallery'])) {
                $filename = "galeri-undangan-{$time}-{$rand}.{$ext}";
            } elseif (in_array($folder, ['covers', 'backgrounds', 'cover'])) {
                $filename = "cover-undangan-{$time}-{$rand}.{$ext}";
            } elseif (in_array($folder, ['reseller', 'logos', 'reseller/logos'])) {
                $filename = "logo-reseller-{$time}-{$rand}.{$ext}";
            } else {
                $cleanFolder = str_replace('/', '-', $folder);
                $filename = "undangan-{$cleanFolder}-{$time}-{$rand}.{$ext}";
            }

            $path = $file->storeAs($folder, $filename, 'public');

            return response()->json([
                'url' => '/storage/' . $path,
                'path' => $path,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function list(Request $request)
    {
        $user = $request->user();
        $invitations = $user->invitations()->with(['theme', 'activeSubscription.plan'])->get();

        $greetingCards = \App\Models\GreetingCard::where('user_id', $user->id)
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

        return Inertia::render('Dashboard/InvitationsList', [
            'invitations' => $invitations,
            'greetingCards' => $greetingCards,
            'activeInvitationId' => session('active_invitation_id'),
            'initialTab' => $request->query('tab', 'invitations'),
        ]);
    }

    public function select(Request $request, \App\Models\Invitation $invitation)
    {
        if ($invitation->user_id !== $request->user()->id) {
            abort(403);
        }

        session()->put('active_invitation_id', $invitation->id);

        return redirect()->route('dashboard')->with('success', "Berhasil beralih ke undangan: {$invitation->title}");
    }

    public function create(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:wedding,birthday,graduation,aqiqah,circumcision,anniversary',
            'title' => 'required|string|max:100',
        ]);

        $user = $request->user();
        
        $type = $request->input('type');
        $title = $request->input('title');
        
        $openingText = "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara tersebut.";
        if ($type === 'wedding') {
            $openingText = "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.";
        } elseif ($type === 'birthday') {
            $openingText = "Halo teman-teman, datang ya ke acara ulang tahunku!";
        } elseif ($type === 'graduation') {
            $openingText = "Dengan memohon doa restu, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri syukuran wisuda kami.";
        }

        $invitation = $user->invitations()->create([
            'slug' => 'temp-slug-' . time() . '-' . rand(10, 99),
            'title' => $title,
            'type' => $type,
            'opening_title' => 'Bismillahirrahmanirrahim',
            'opening_text' => $openingText,
            'closing_text' => "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
            'is_active' => true,
        ]);

        session()->put('active_invitation_id', $invitation->id);

        // Reset onboarding step to step 2 for this new invitation
        $user->update(['onboarding_step' => 2]);

        return redirect()->route('wizard.link');
    }
}
