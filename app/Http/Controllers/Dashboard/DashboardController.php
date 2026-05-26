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

        $subscription = $user->activeSubscription;
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

        return Inertia::render('Dashboard/Index', [
            'invitation' => $invitation,
            'stats' => $stats,
            'features' => $features,
            'dashboardSubscription' => $dashboardSubscription,
            'latestWishes' => $invitation?->wishes()->latest()->take(5)->get() ?? [],
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
}
