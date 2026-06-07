<?php

namespace App\Http\Controllers;

use App\Models\ResellerSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResellerBioLinkController extends Controller
{
    private function getSettings()
    {
        $user = auth()->user();
        return ResellerSetting::firstOrCreate(
            ['user_id' => $user->id],
            ['brand_name' => $user->name, 'is_active' => true]
        );
    }

    /**
     * Show the bio link editor for the current reseller admin.
     * URL: /admin/bio
     */
    public function edit()
    {
        $settings = $this->getSettings();

        return Inertia::render('Admin/BioLinkEditor', [
            'settings'       => $settings,
            'bioConfig'      => $settings->getBioLinkConfig(),
            'defaultConfig'  => ResellerSetting::defaultBioLinkConfig(),
        ]);
    }

    /**
     * Save the bio link configuration.
     * POST /admin/bio
     */
    public function update(Request $request)
    {
        $request->validate([
            'template'       => 'nullable|string|max:50',
            'title'          => 'nullable|string|max:150',
            'description'    => 'nullable|string|max:500',
            'buttons'        => 'nullable|array',
            'social'         => 'nullable|array',
            'sections'       => 'nullable|array',
        ]);

        $settings = $this->getSettings();

        $existing = $settings->bio_link_config ?? [];

        // Merge top-level keys
        foreach (['template', 'title', 'description'] as $key) {
            if ($request->has($key)) {
                $existing[$key] = $request->$key;
            }
        }

        if ($request->has('buttons')) {
            $existing['buttons'] = $request->buttons;
        }

        if ($request->has('social')) {
            $existing['social'] = $request->social;
        }

        if ($request->has('sections')) {
            $existing['sections'] = $request->sections;
        }

        $settings->bio_link_config = $existing;
        $settings->save();

        return response()->json(['success' => true, 'message' => 'Bio link berhasil disimpan.']);
    }

    /**
     * Upload avatar or background image.
     * POST /admin/bio/upload
     */
    public function uploadAsset(Request $request)
    {
        $request->validate([
            'type'  => 'required|in:avatar,bg_image',
            'file'  => 'required|image|mimes:png,jpg,jpeg,webp|max:3072',
        ]);

        $settings = $this->getSettings();
        $type     = $request->type;

        $existing = $settings->bio_link_config ?? [];

        // Delete old file if exists
        if (!empty($existing[$type])) {
            $oldPath = str_replace('/storage/', '', $existing[$type]);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $file     = $request->file('file');
        \App\Helpers\ImageCompressor::compress($file);
        $ext      = $file->guessExtension() ?: 'jpg';
        $filename = 'bio-' . $type . '-' . time() . '-' . rand(100, 999) . '.' . $ext;
        $path     = $file->storeAs('reseller/bio', $filename, 'public');

        $existing[$type]        = '/storage/' . $path;
        $settings->bio_link_config = $existing;
        $settings->save();

        return response()->json(['success' => true, 'url' => '/storage/' . $path]);
    }

    /**
     * Remove avatar or background image.
     * DELETE /admin/bio/upload
     */
    public function removeAsset(Request $request)
    {
        $request->validate([
            'type' => 'required|in:avatar,bg_image',
        ]);

        $settings = $this->getSettings();
        $type     = $request->type;
        $existing = $settings->bio_link_config ?? [];

        if (!empty($existing[$type])) {
            $oldPath = str_replace('/storage/', '', $existing[$type]);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $existing[$type] = null;
        }

        $settings->bio_link_config = $existing;
        $settings->save();

        return response()->json(['success' => true]);
    }

    /**
     * Public bio link page.
     * URL: /r/{subdomain}/bio  OR  /bio (via subdomain resolution)
     */
    public function show(string $subdomain)
    {
        $setting = ResellerSetting::where('subdomain', $subdomain)
            ->where('is_active', true)
            ->first();

        if (!$setting) {
            abort(404, 'Reseller tidak ditemukan.');
        }

        $reseller = $setting->reseller;
        $bio      = $setting->getBioLinkConfig();

        // Fallback avatar to brand logo
        if (empty($bio['avatar']) && $setting->brand_logo) {
            $bio['avatar'] = '/storage/' . $setting->brand_logo;
        }

        // Fallback title to brand name
        if (empty($bio['title'])) {
            $bio['title'] = $setting->brand_name ?: $reseller->name;
        }

        // Build reseller URL for buttons (if they use # link, replace with landing page)
        $appUrl  = config('app.url');
        $parsed  = parse_url($appUrl);
        $scheme  = $parsed['scheme'] ?? 'http';
        $host    = $parsed['host'] ?? 'undangan-digital.test';
        $port    = isset($parsed['port']) ? ':' . $parsed['port'] : '';

        if ($setting->custom_domain) {
            $resellerUrl = $scheme . '://' . $setting->custom_domain . $port;
        } else {
            $resellerUrl = $scheme . '://' . $subdomain . '.' . $host . $port;
        }

        return Inertia::render('Reseller/BioLink', [
            'bio'          => $bio,
            'brandName'    => $setting->brand_name ?: $reseller->name,
            'brandLogo'    => $setting->brand_logo ? '/storage/' . $setting->brand_logo : null,
            'resellerUrl'  => $resellerUrl,
            'ref'          => $subdomain,
        ]);
    }
}
