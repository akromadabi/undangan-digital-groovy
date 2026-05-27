<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GlobalSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSettingController extends Controller
{
    public function index()
    {
        $settings = GlobalSetting::all()->groupBy('category');
        return Inertia::render('Admin/Settings/Index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        // Save all settings submitted
        foreach ($request->settings as $item) {
            GlobalSetting::updateOrCreate(
                ['setting_key' => $item['key']],
                ['setting_value' => $item['value']]
            );
        }

        // Automatically synchronize meta_title with site_name
        $siteName = GlobalSetting::where('setting_key', 'site_name')->value('setting_value');
        if ($siteName) {
            GlobalSetting::updateOrCreate(
                ['setting_key' => 'meta_title'],
                [
                    'setting_value' => $siteName,
                    'setting_type' => 'string',
                    'category' => 'seo'
                ]
            );
        }

        // Automatically synchronize meta_description with site_tagline
        $siteTagline = GlobalSetting::where('setting_key', 'site_tagline')->value('setting_value');
        if ($siteTagline) {
            GlobalSetting::updateOrCreate(
                ['setting_key' => 'meta_description'],
                [
                    'setting_value' => $siteTagline,
                    'setting_type' => 'string',
                    'category' => 'seo'
                ]
            );
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
