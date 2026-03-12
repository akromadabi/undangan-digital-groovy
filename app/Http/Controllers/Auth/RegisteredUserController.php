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

        // Check for reseller referral via ?ref=subdomain
        if ($request->has('ref')) {
            $setting = ResellerSetting::where('subdomain', $request->ref)
                ->where('is_active', true)
                ->first();

            if ($setting) {
                $reseller = $setting->reseller;
                $resellerData = [
                    'id' => $reseller->id,
                    'brand_name' => $setting->brand_name ?: $reseller->name,
                    'brand_logo' => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
                    'ref' => $request->ref,
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
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'phone' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'ref' => 'nullable|string',
        ]);

        // Resolve reseller_id from ref code
        $resellerId = null;
        if ($request->ref) {
            $setting = ResellerSetting::where('subdomain', $request->ref)
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
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('verification.otp.show');
    }
}
