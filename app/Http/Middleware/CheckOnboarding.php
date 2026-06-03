<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckOnboarding
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Admin, Super Admin & Editor bypass onboarding
        if ($user->isAdmin() || $user->isSuperAdmin() || $user->isEditor()) {
            return $next($request);
        }

        // If onboarding not complete, redirect to wizard
        if (!$user->onboardingComplete()) {
            $steps = [
                2 => 'wizard.link',
                3 => 'wizard.profile',
                4 => 'wizard.events',
                5 => 'wizard.template',
            ];

            $step = max(2, $user->onboarding_step);
            $routeName = $steps[$step] ?? 'wizard.link';

            if (!$request->routeIs('wizard.*')) {
                return redirect()->route($routeName);
            }
        }

        return $next($request);
    }
}
