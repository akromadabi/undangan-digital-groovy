<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ResellerSetting;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        $resellerData = null;
        $ref = $request->ref;

        // Auto-resolve reseller from domain if not provided in request query
        if (!$ref) {
            $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
            if ($resellerSetting) {
                $ref = $resellerSetting->subdomain;
            }
        }

        // Check for reseller referral via ?ref=subdomain or dynamic domain resolution
        if ($ref) {
            $setting = ResellerSetting::where('subdomain', $ref)
                ->where('is_active', true)
                ->first();

            if ($setting) {
                $reseller = $setting->reseller;
                $resellerData = [
                    'id' => $reseller->id,
                    'brand_name' => $setting->brand_name ?: $reseller->name,
                    'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                    'ref' => $ref,
                ];
            }
        }

        return Inertia::render('Auth/Register', [
            'reseller' => $resellerData,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|lowercase|email|max:255|unique:' . User::class,
            'phone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'ref' => 'nullable|string',
        ]);

        // Resolve reseller_id from ref code or current host
        $resellerId = null;
        $ref = $request->ref;

        if (!$ref) {
            $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
            if ($resellerSetting) {
                $ref = $resellerSetting->subdomain;
            }
        }

        if ($ref) {
            $setting = ResellerSetting::where('subdomain', $ref)
                ->where('is_active', true)
                ->first();
            if ($setting) {
                $resellerId = $setting->user_id;
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'reseller_id' => $resellerId,
            'onboarding_step' => 2,
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('wizard.link');
    }
}
