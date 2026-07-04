<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\GlobalSetting;
use App\Models\Payment;
use App\Models\ResellerSetting;
use App\Models\User;
use App\Services\SiappPayService;
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
        $annualFee = (float) GlobalSetting::getValue('reseller_annual_fee', 150000);
        $rawBenefits = GlobalSetting::getValue('reseller_registration_benefits', null);
        $registrationEnabled = GlobalSetting::getValue('reseller_registration_enabled', '1') === '1';

        $defaultBenefits = [
            'White-label Brand & Subdomain sendiri',
            'Sistem Manajemen Client & Undangan Lengkap',
            'Keuntungan Penjualan Masuk ke Dompet Reseller',
            'Dukungan QRIS & Transfer Bank',
            'Akses ke Seluruh Katalog Tema Undangan'
        ];

        $benefits = $rawBenefits ? json_decode($rawBenefits, true) : $defaultBenefits;

        return Inertia::render('Auth/ResellerRegister', [
            'centralHost' => $centralHost ?: 'undangan.com',
            'annualFee' => $annualFee,
            'benefits' => $benefits,
            'registrationEnabled' => $registrationEnabled,
        ]);
    }

    /**
     * Handle an incoming reseller registration request.
     */
    public function store(Request $request)
    {
        $registrationEnabled = GlobalSetting::getValue('reseller_registration_enabled', '1') === '1';
        if (!$registrationEnabled) {
            return back()->with('error', 'Pendaftaran reseller baru saat ini sedang ditutup.');
        }

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

        $annualFee = (float) GlobalSetting::getValue('reseller_annual_fee', 150000);
        $durationDays = (int) GlobalSetting::getValue('reseller_duration_days', 365);

        // Create reseller user with role='admin' but is_active=false (pending payment)
        $reseller = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'admin',
            'is_active' => $annualFee <= 0, // Automatically active if free
            'onboarding_step' => 6,
            'email_verified_at' => now(),
        ]);

        // Create reseller settings with is_active matching user
        ResellerSetting::create([
            'user_id' => $reseller->id,
            'brand_name' => $request->brand_name,
            'subdomain' => strtolower($request->subdomain),
            'is_active' => $annualFee <= 0,
        ]);

        if ($annualFee <= 0) {
            return redirect()->route('register.reseller.success');
        }

        // Create Payment for annual subscription
        $payment = Payment::create([
            'user_id' => $reseller->id,
            'amount' => $annualFee,
            'status' => 'pending',
            'payment_gateway' => 'siapppay',
            'payment_method' => 'QRIS',
            'metadata' => [
                'type' => 'reseller_subscription',
                'duration_days' => $durationDays,
            ],
        ]);

        // Generate QRIS via SiappPay Service
        $siappPay = new SiappPayService();
        if ($siappPay->isConfigured()) {
            $siappPay->createTransaction($payment, 'QRIS');
        }

        // Send WA notification to Super Admin about new reseller registration
        try {
            $waService = new \App\Services\WhatsAppService();
            $waService->notifySuperAdminNewReseller($reseller, $annualFee);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('WA Notify New Reseller Error: ' . $e->getMessage());
        }

        return redirect()->route('register.reseller.payment', $payment->id);
    }

    /**
     * Show QRIS payment page for reseller registration.
     */
    public function showPayment(Payment $payment)
    {
        $payment->load('user');

        if ($payment->status === 'paid') {
            return redirect()->route('register.reseller.success');
        }

        $annualFee = $payment->amount;

        return Inertia::render('Auth/ResellerRegisterPayment', [
            'payment' => $payment,
            'annualFee' => $annualFee,
        ]);
    }

    /**
     * Check payment status endpoint for polling in payment page.
     */
    public function checkPaymentStatus(Payment $payment)
    {
        return response()->json([
            'status' => $payment->status,
            'is_paid' => $payment->status === 'paid',
        ]);
    }

    /**
     * Display the successful registration landing page.
     */
    public function success(): Response
    {
        $adminWhatsapp = GlobalSetting::getValue('footer_whatsapp') ?: GlobalSetting::getValue('mpwav9_sender_number') ?: '6283132211830';
        $adminEmail = GlobalSetting::getValue('footer_email') ?: 'admin@groovy.com';

        return Inertia::render('Auth/ResellerRegisterSuccess', [
            'adminWhatsapp' => $adminWhatsapp,
            'adminEmail' => $adminEmail,
        ]);
    }
}
