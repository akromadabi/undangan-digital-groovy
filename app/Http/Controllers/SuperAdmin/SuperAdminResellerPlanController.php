<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\GlobalSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminResellerPlanController extends Controller
{
    /**
     * Display the Reseller Package Settings page.
     */
    public function index()
    {
        $annualFee = (float) GlobalSetting::getValue('reseller_annual_fee', 150000);
        $registrationEnabled = GlobalSetting::getValue('reseller_registration_enabled', '1');
        $rawBenefits = GlobalSetting::getValue('reseller_registration_benefits', null);
        $durationDays = (int) GlobalSetting::getValue('reseller_duration_days', 365);

        $defaultBenefits = [
            'White-label Brand & Subdomain sendiri',
            'Sistem Manajemen Client & Undangan Lengkap',
            'Keuntungan Penjualan Masuk ke Dompet Reseller',
            'Dukungan QRIS & Transfer Bank',
            'Akses ke Seluruh Katalog Tema Undangan'
        ];

        $benefits = $rawBenefits ? json_decode($rawBenefits, true) : $defaultBenefits;
        if (!is_array($benefits)) {
            $benefits = $defaultBenefits;
        }

        return Inertia::render('SuperAdmin/Resellers/ResellerPlans', [
            'annualFee' => $annualFee,
            'registrationEnabled' => $registrationEnabled === '1',
            'benefits' => $benefits,
            'durationDays' => $durationDays,
        ]);
    }

    /**
     * Update Reseller Package Settings.
     */
    public function update(Request $request)
    {
        $request->validate([
            'annual_fee' => 'required|numeric|min:0',
            'registration_enabled' => 'required|boolean',
            'duration_days' => 'required|integer|min:1',
            'benefits' => 'nullable|array',
            'benefits.*' => 'nullable|string|max:255',
        ]);

        $benefits = array_values(array_filter($request->benefits ?? [], fn($b) => !empty(trim($b))));

        GlobalSetting::setValue('reseller_annual_fee', $request->annual_fee, 'number', 'reseller');
        GlobalSetting::setValue('reseller_registration_enabled', $request->registration_enabled ? '1' : '0', 'boolean', 'reseller');
        GlobalSetting::setValue('reseller_duration_days', $request->duration_days, 'number', 'reseller');
        GlobalSetting::setValue('reseller_registration_benefits', json_encode($benefits), 'json', 'reseller');

        return back()->with('success', 'Pengaturan Paket Reseller berhasil disimpan.');
    }
}
