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
        if ($request->has('redirect')) {
            session(['url.intended' => $request->query('redirect')]);
        }

        $autoLoginUsers = [];

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
