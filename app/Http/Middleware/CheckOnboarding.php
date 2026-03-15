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

        // Admin & Super Admin bypass onboarding
        if ($user->isAdmin() || $user->isSuperAdmin()) {
            return $next($request);
        }

        // If onboarding not complete, redirect to wizard
        if (!$user->onboardingComplete()) {
            $steps = [
                1 => 'wizard.verification',
                2 => 'wizard.link',
                3 => 'wizard.profile',
                4 => 'wizard.events',
                5 => 'wizard.template',
            ];

            $step = max(1, $user->onboarding_step);
            $routeName = $steps[$step] ?? 'wizard.verification';

            if (!$request->routeIs('wizard.*')) {
                return redirect()->route($routeName);
            }
        }

        return $next($request);
    }
}
