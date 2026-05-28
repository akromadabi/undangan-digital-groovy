<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ResellerSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ResellerRegisterController extends Controller
{
    /**
     * Display the reseller registration view.
     */
    public function create(): Response
    {
        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);
        return Inertia::render('Auth/ResellerRegister', [
            'centralHost' => $centralHost ?: 'undangan.com',
        ]);
    }

    /**
     * Handle an incoming reseller registration request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            'brand_name' => 'required|string|max:100',
            'subdomain' => 'required|string|max:50|unique:reseller_settings,subdomain|alpha_dash',
        ], [
            'subdomain.unique' => 'Subdomain ini sudah digunakan.',
            'subdomain.alpha_dash' => 'Subdomain hanya boleh berisi huruf, angka, tanda hubung (-), dan garis bawah (_).',
            'email.unique' => 'Email ini sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal terdiri dari 6 karakter.',
        ]);

        // Create reseller user with role='admin' but is_active=false (requires superadmin approval)
        $reseller = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'admin',
            'is_active' => false, // Pendding activation
            'onboarding_step' => 6, // Resellers skip client onboarding
            'email_verified_at' => now(),
        ]);

        // Create reseller settings with is_active=false (subdomain will not resolve until active)
        ResellerSetting::create([
            'user_id' => $reseller->id,
            'brand_name' => $request->brand_name,
            'subdomain' => strtolower($request->subdomain),
            'is_active' => false,
        ]);

        return redirect()->route('register.reseller.success');
    }

    /**
     * Display the successful registration landing page.
     */
    public function success(): Response
    {
        $adminWhatsapp = \App\Models\GlobalSetting::getValue('footer_whatsapp') ?: \App\Models\GlobalSetting::getValue('mpwav9_sender_number') ?: '6283132211830';
        $adminEmail = \App\Models\GlobalSetting::getValue('footer_email') ?: 'admin@groovy.com';

        return Inertia::render('Auth/ResellerRegisterSuccess', [
            'adminWhatsapp' => $adminWhatsapp,
            'adminEmail' => $adminEmail,
        ]);
    }
}
