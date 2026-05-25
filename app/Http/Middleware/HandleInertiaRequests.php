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
                $plan = $user->currentPlan();
                if ($plan) {
                    $featureAccess = $plan->featureAccess()
                        ->with('feature')
                        ->get()
                        ->mapWithKeys(fn($pfa) => [$pfa->feature->slug => $pfa->is_enabled])
                        ->toArray();
                }
            }
        }

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
                ] : null,
                'impersonator' => session()->has('impersonator_id') ? [
                    'id' => session('impersonator_id'),
                    'role' => session('impersonator_role'),
                    'name' => \App\Models\User::find(session('impersonator_id'))?->name,
                ] : null,
            ],
            'subscription' => $user ? (
                (!$user->isAdmin() && !$user->isSuperAdmin()) ? [
                    'plan' => $user->currentPlan()?->only(['name', 'slug', 'max_guests', 'max_galleries']),
                    'status' => $user->activeSubscription?->status,
                    'expires_at' => $user->activeSubscription?->expires_at?->toISOString(),
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
            'appName' => config('app.name'),
            'adminRoutePrefix' => str_starts_with($request->path(), 'super-admin') ? '/super-admin' : '/admin',
            'resellerSubdomain' => $user && $user->role === 'admin' ? optional($user->resellerSettings)->subdomain : null,
            'resellerCustomDomain' => $user && $user->role === 'admin' ? optional($user->resellerSettings)->custom_domain : null,
            'appUrl' => config('app.url'),
            'urlMismatch' => (str_contains($request->getHost(), 'siapp.in') && str_contains(config('app.url'), 'siap.in') && !str_contains(config('app.url'), 'siapp.in')),
            'locale' => app()->getLocale(),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
        ];
    }
}
