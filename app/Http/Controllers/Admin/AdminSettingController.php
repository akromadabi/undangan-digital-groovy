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

        foreach ($request->settings as $item) {
            GlobalSetting::where('setting_key', $item['key'])
                ->update(['setting_value' => $item['value']]);
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
