<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        $autoLoginUsers = [];

        // Only show auto-login in non-production
        if (app()->environment('local', 'staging', 'testing')) {
            $autoLoginUsers = \App\Models\User::select('name', 'email', 'role')
                ->with(['activeSubscription.plan:id,name,slug'])
                ->orderByRaw("CASE role WHEN 'super_admin' THEN 1 WHEN 'admin' THEN 2 WHEN 'user' THEN 3 ELSE 4 END")
                ->limit(5)
                ->get()
                ->map(fn($u) => [
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'plan' => $u->activeSubscription?->plan?->name,
                ]);
        }

        // Detect reseller branding from subdomain / custom domain
        $resellerData = null;
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        if ($resellerSetting) {
            $reseller = $resellerSetting->reseller;
            $resellerData = [
                'brand_name' => $resellerSetting->brand_name ?: $reseller->name,
                'brand_logo' => $resellerSetting->brand_logo ? '/storage/' . $resellerSetting->brand_logo : null,
                'subdomain'  => $resellerSetting->subdomain,
            ];
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'autoLoginUsers' => $autoLoginUsers,
            'reseller' => $resellerData,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Role-based redirect after login
        $user = Auth::user();

        if ($user->role === 'super_admin') {
            return redirect()->intended('/super-admin');
        }

        if ($user->role === 'admin') {
            return redirect()->intended('/admin');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
