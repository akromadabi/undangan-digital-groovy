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

        if ($user && !$user->isAdmin()) {
            $plan = $user->currentPlan();
            if ($plan) {
                $featureAccess = $plan->featureAccess()
                    ->with('feature')
                    ->get()
                    ->mapWithKeys(fn($pfa) => [$pfa->feature->slug => $pfa->is_enabled])
                    ->toArray();
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
            ],
            'subscription' => $user && !$user->isAdmin() ? [
                'plan' => $user->currentPlan()?->only(['name', 'slug', 'max_guests', 'max_galleries']),
                'status' => $user->activeSubscription?->status,
                'expires_at' => $user->activeSubscription?->expires_at?->toISOString(),
            ] : null,
            'features' => $featureAccess,
            'appName' => config('app.name'),
            'adminRoutePrefix' => str_starts_with($request->path(), 'super-admin') ? '/super-admin' : '/admin',
            'resellerSubdomain' => $user && $user->role === 'admin' ? optional($user->resellerSettings)->subdomain : null,
            'locale' => app()->getLocale(),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
        ];
    }
}
