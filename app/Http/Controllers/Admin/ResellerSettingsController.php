<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResellerSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResellerSettingsController extends Controller
{
    /**
     * Get or create ResellerSetting for the current reseller.
     */
    private function getSettings()
    {
        $user = auth()->user();
        return ResellerSetting::firstOrCreate(
            ['user_id' => $user->id],
            ['brand_name' => $user->name, 'is_active' => true]
        );
    }

    // ═══ Branding ═══

    public function branding()
    {
        $settings = $this->getSettings();
        $settings->load('demoUser');

        return Inertia::render('Admin/Branding', [
            'settings' => $settings,
        ]);
    }

    public function updateBranding(Request $request)
    {
        $request->validate([
            'brand_name' => 'required|string|max:100',
            'brand_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
            'site_title' => 'nullable|string|max:255',
            'site_motto' => 'nullable|string|max:1000',
            'bank_name' => 'nullable|string|max:100',
            'bank_account' => 'nullable|string|max:50',
            'bank_holder' => 'nullable|string|max:150',
            'footer_whatsapp' => 'nullable|string|max:30',
            'footer_phone' => 'nullable|string|max:30',
            'footer_email' => 'nullable|email|max:100',
            'footer_instagram' => 'nullable|string|max:100',
            'footer_tiktok' => 'nullable|string|max:100',
            'footer_address' => 'nullable|string|max:1000',
            'footer_description' => 'nullable|string|max:1000',
        ]);

        $settings = $this->getSettings();
        $settings->brand_name = $request->brand_name;
        $settings->site_title = $request->site_title;
        $settings->site_motto = $request->site_motto;
        $settings->bank_name = $request->bank_name;
        $settings->bank_account = $request->bank_account;
        $settings->bank_holder = $request->bank_holder;
        $settings->footer_whatsapp = $request->footer_whatsapp;
        $settings->footer_phone = $request->footer_phone;
        $settings->footer_email = $request->footer_email;
        $settings->footer_instagram = $request->footer_instagram;
        $settings->footer_tiktok = $request->footer_tiktok;
        $settings->footer_address = $request->footer_address;
        $settings->footer_description = $request->footer_description;

        if ($request->hasFile('brand_logo')) {
            // Delete old logo
            if ($settings->brand_logo && Storage::disk('public')->exists($settings->brand_logo)) {
                Storage::disk('public')->delete($settings->brand_logo);
            }
            
            $file = $request->file('brand_logo');
            \App\Helpers\ImageCompressor::compress($file);
            
            $ext = $file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'jpg';
            if ($ext === 'jpeg') { $ext = 'jpg'; }
            $filename = 'logo-reseller-' . time() . '-' . rand(100, 999) . '.' . $ext;
            $settings->brand_logo = $file->storeAs('reseller/logos', $filename, 'public');
        }

        if ($request->has('remove_logo') && $request->remove_logo) {
            if ($settings->brand_logo && Storage::disk('public')->exists($settings->brand_logo)) {
                Storage::disk('public')->delete($settings->brand_logo);
            }
            $settings->brand_logo = null;
        }

        $settings->save();

        return back()->with('success', 'Branding dan kontak berhasil disimpan.');
    }

    // ═══ Landing Page ═══

    public function landingPage()
    {
        // Available templates — for now hardcoded, later super admin can manage
        $templates = [
            ['id' => 'default', 'name' => 'Default', 'description' => 'Template standar dengan layout modern'],
            ['id' => 'elegant', 'name' => 'Elegant', 'description' => 'Template elegan dengan warna gelap'],
            ['id' => 'minimal', 'name' => 'Minimal', 'description' => 'Template minimalis dan bersih'],
            ['id' => 'colorful', 'name' => 'Colorful', 'description' => 'Template penuh warna dan ceria'],
        ];

        return Inertia::render('Admin/LandingPage', [
            'settings' => $this->getSettings(),
            'templates' => $templates,
        ]);
    }

    public function updateLandingPage(Request $request)
    {
        $request->validate([
            'landing_page_template' => 'required|string|max:50',
        ]);

        $settings = $this->getSettings();
        $settings->landing_page_template = $request->landing_page_template;
        $settings->save();

        return back()->with('success', 'Landing page template berhasil disimpan.');
    }

    // ═══ Domain ═══

    public function domain()
    {
        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);
        return Inertia::render('Admin/Domain', [
            'settings' => $this->getSettings(),
            'centralHost' => $centralHost ?: 'undangan.com',
        ]);
    }

    public function updateDomain(Request $request)
    {
        $request->validate([
            'subdomain' => 'nullable|string|max:50|alpha_dash|unique:reseller_settings,subdomain,' . $this->getSettings()->id,
            'custom_domain' => 'nullable|string|max:255|unique:reseller_settings,custom_domain,' . $this->getSettings()->id,
        ]);

        $settings = $this->getSettings();
        $settings->subdomain = $request->subdomain;
        $settings->custom_domain = $request->custom_domain;
        $settings->save();

        return back()->with('success', 'Pengaturan domain berhasil disimpan.');
    }
}
