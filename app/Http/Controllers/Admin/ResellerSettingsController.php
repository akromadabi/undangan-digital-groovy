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
        return Inertia::render('Admin/Branding', [
            'settings' => $this->getSettings(),
        ]);
    }

    public function updateBranding(Request $request)
    {
        $request->validate([
            'brand_name' => 'required|string|max:100',
            'brand_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        $settings = $this->getSettings();
        $settings->brand_name = $request->brand_name;

        if ($request->hasFile('brand_logo')) {
            // Delete old logo
            if ($settings->brand_logo && Storage::disk('public')->exists($settings->brand_logo)) {
                Storage::disk('public')->delete($settings->brand_logo);
            }
            $settings->brand_logo = $request->file('brand_logo')->store('reseller/logos', 'public');
        }

        if ($request->has('remove_logo') && $request->remove_logo) {
            if ($settings->brand_logo && Storage::disk('public')->exists($settings->brand_logo)) {
                Storage::disk('public')->delete($settings->brand_logo);
            }
            $settings->brand_logo = null;
        }

        $settings->save();

        return back()->with('success', 'Branding berhasil disimpan.');
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
        return Inertia::render('Admin/Domain', [
            'settings' => $this->getSettings(),
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
