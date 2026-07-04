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
    public function create(Request $request)
    {
        if ($request->has('redirect')) {
            session(['url.intended' => $request->query('redirect')]);
        }

        $resellerData = null;
        $ref = $request->ref;

        // Auto-resolve reseller from domain if not provided in request query
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
                $reseller = $setting->reseller;
                if ($reseller) {
                    $resellerData = [
                        'id' => $reseller->id,
                        'brand_name' => $setting->brand_name ?: $reseller->name,
                        'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                        'ref' => $ref,
                    ];
                }
            }
        }

        if (!$resellerData) {
            return redirect('/')->with('error', 'Pendaftaran tidak dapat dilakukan melalui domain utama. Silakan mendaftar melalui website reseller kami.');
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

        if (!$resellerId) {
            return redirect('/')->with('error', 'Pendaftaran tidak dapat dilakukan melalui domain utama. Silakan mendaftar melalui website reseller kami.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'nullable', 'string', 'lowercase', 'email', 'max:255',
                \Illuminate\Validation\Rule::unique('users')->where(function ($query) use ($resellerId) {
                    return $query->where('reseller_id', $resellerId);
                })
            ],
            'phone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'ref' => 'nullable|string',
        ]);

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

        // Send WA notifications for new user registration
        try {
            $waService = new \App\Services\WhatsAppService();
            $resellerUser = User::find($resellerId);
            
            // 1. Notify Super Admin
            $waService->notifySuperAdminNewUser($user, $resellerUser);

            // 2. Notify Reseller (if registered under reseller)
            if ($resellerUser) {
                $waService->notifyResellerNewUser($resellerUser, $user);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Notify New User Error: ' . $e->getMessage());
        }

        Auth::login($user);

        return redirect()->intended(route('wizard.link'));
    }
}

