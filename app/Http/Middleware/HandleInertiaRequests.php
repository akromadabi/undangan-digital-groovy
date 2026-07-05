<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $featureAccess = [];

        if ($user) {
            if ($user->isAdmin() || $user->isSuperAdmin()) {
                // Admin and Super Admin have full access to all features
                $featureAccess = \App\Models\Feature::pluck('slug')
                    ->mapWithKeys(fn($slug) => [$slug => true])
                    ->toArray();
            } else {
                $invitation = $user->invitation;
                $activeSub = $invitation ? $invitation->activeSubscription : null;
                $plan = $activeSub ? $activeSub->plan : $user->currentPlan();
                if ($plan) {
                    $featureAccess = $plan->featureAccess()
                        ->with('feature')
                        ->get()
                        ->mapWithKeys(fn($pfa) => [$pfa->feature->slug => $pfa->is_enabled])
                        ->toArray();
                }
                
                // Ensure basic features are always true in shared features prop
                $basicFeatures = ['opening', 'cover', 'event', 'bride_groom', 'bride_groom_detail', 'closing', 'music', 'dresscode', 'video_wedding'];
                foreach ($basicFeatures as $bf) {
                    $featureAccess[$bf] = true;
                }
            }
        }

        // Resolve active reseller settings
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        
        if (!$resellerSetting && $user) {
            if ($user->role === 'admin') {
                $resellerSetting = $user->resellerSettings;
            } elseif ($user->role === 'user' && $user->reseller) {
                $resellerSetting = $user->reseller->resellerSettings;
            }
        }

        $path = $request->path();
        $pathParts = explode('/', $path);

        if (!$resellerSetting && count($pathParts) >= 2 && $pathParts[0] === 'r') {
            $subdomain = $pathParts[1];
            $resellerSetting = \App\Models\ResellerSetting::where('subdomain', $subdomain)->where('is_active', true)->first();
        }

        if (!$resellerSetting && count($pathParts) >= 2 && $pathParts[0] === 'u') {
            $slug = $pathParts[1];
            $invitation = \App\Models\Invitation::where('slug', $slug)->where('is_active', true)->first();
            if ($invitation && $invitation->user) {
                $owner = $invitation->user;
                if ($owner->role === 'admin') {
                    $resellerSetting = $owner->resellerSettings;
                } elseif ($owner->reseller) {
                    $resellerSetting = $owner->reseller->resellerSettings;
                }
            }
        }
        $globalSiteName = \App\Models\GlobalSetting::where('setting_key', 'site_name')->value('setting_value');
        $globalSiteLogo = \App\Models\GlobalSetting::where('setting_key', 'site_logo')->value('setting_value');

        $appName = $resellerSetting && $resellerSetting->brand_name 
            ? $resellerSetting->brand_name 
            : ($globalSiteName ?: (config('app.name') === 'Laravel' ? 'Undangan Digital' : config('app.name', 'Undangan Digital')));

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'onboarding_step' => $user->onboarding_step,
                    'locale' => $user->locale,
                    'avatar' => $user->avatar,
                    'invitation_slug' => $user->invitation?->slug,
                    'invitation_type' => $user->invitation?->type ?: 'wedding',
                    'invitation_locked' => $user->invitation ? $user->invitation->isLocked() : false,
                ] : null,
                'impersonator' => session()->has('impersonator_id') ? [
                    'id' => session('impersonator_id'),
                    'role' => session('impersonator_role'),
                    'name' => \App\Models\User::find(session('impersonator_id'))?->name,
                ] : null,
            ],
            'subscription' => $user ? (
                (!$user->isAdmin() && !$user->isSuperAdmin()) ? [
                    'plan' => ($user->invitation ? ($user->invitation->activeSubscription ? $user->invitation->activeSubscription->plan : null) : $user->currentPlan())?->only(['id', 'name', 'slug', 'max_guests', 'max_galleries']),
                    'status' => $user->invitation ? ($user->invitation->activeSubscription?->status) : ($user->activeSubscription?->status),
                    'expires_at' => $user->invitation ? ($user->invitation->activeSubscription?->expires_at?->toISOString()) : ($user->activeSubscription?->expires_at?->toISOString()),
                ] : [
                    'plan' => [
                        'name' => $user->isSuperAdmin() ? 'Super Admin' : 'Administrator',
                        'slug' => 'premium',
                        'max_guests' => 99999,
                        'max_galleries' => 99999,
                    ],
                    'status' => 'active',
                    'expires_at' => null,
                ]
            ) : null,
            'features' => $featureAccess,
            'appName' => $appName,
            'brandLogo' => $resellerSetting 
                ? ($resellerSetting->brand_logo ? '/storage/' . $resellerSetting->brand_logo : null)
                : ($globalSiteLogo ? '/storage/' . $globalSiteLogo : null),
            'adminRoutePrefix' => str_starts_with($request->path(), 'super-admin') ? '/super-admin' : '/admin',
            'resellerSubdomain' => $user && $user->role === 'admin' ? optional($user->resellerSettings)->subdomain : null,
            'resellerCustomDomain' => $user && $user->role === 'admin' ? optional($user->resellerSettings)->custom_domain : null,
            'appUrl' => config('app.url'),
            'urlMismatch' => (str_contains($request->getHost(), 'siapp.in') && str_contains(config('app.url'), 'siap.in') && !str_contains(config('app.url'), 'siapp.in')),
            'locale' => app()->getLocale(),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'show_welcome_modal' => fn() => $request->session()->get('show_welcome_modal'),
            ],
        ];
    }
}
