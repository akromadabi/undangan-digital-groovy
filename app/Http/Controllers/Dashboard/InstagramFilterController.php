<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\InstagramFilter;
use App\Models\InvitationSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstagramFilterController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $invitation = $user->invitation;

        if (!$invitation) {
            return redirect()->route('dashboard')->with('error', 'Silakan buat undangan terlebih dahulu.');
        }

        $filters = InstagramFilter::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        // Cari seksi instagram_filter milik undangan user ini
        $activeSection = $invitation->sections()
            ->where('section_key', 'instagram_filter')
            ->first();

        $currentFilterId = null;
        $customFilterUrl = null;
        $isCustomUsed = false;

        if ($activeSection && $activeSection->is_visible) {
            $currentFilterId = $activeSection->custom_config['filter_id'] ?? null;
            // Jika ada filter_url tapi tidak ada filter_id, berarti user menggunakan link kustom
            if (!$currentFilterId && !empty($activeSection->custom_config['filter_url'])) {
                $customFilterUrl = $activeSection->custom_config['filter_url'];
                $isCustomUsed = true;
            }
        }

        // Ambil nama mempelai secara dinamis untuk preview katalog
        $brideGrooms = $invitation->brideGrooms;
        $groom = $brideGrooms->where('gender', 'pria')->first();
        $bride = $brideGrooms->where('gender', 'wanita')->first();
        $coupleNames = [
            'groom' => $groom ? ($groom->nickname ?: $groom->full_name) : 'Groom',
            'bride' => $bride ? ($bride->nickname ?: $bride->full_name) : 'Bride',
        ];

        return Inertia::render('Dashboard/Settings/InstagramFilter', [
            'filters' => $filters,
            'currentFilterId' => $currentFilterId,
            'customFilterUrl' => $customFilterUrl,
            'isCustomUsed' => $isCustomUsed,
            'coupleNames' => $coupleNames,
            'isFilterApplied' => $activeSection ? (bool) $activeSection->is_visible : false,
        ]);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'filter_id' => 'nullable|integer',
            'custom_filter_url' => 'nullable|url|max:500',
            'apply' => 'required|boolean',
            'use_custom' => 'required|boolean',
        ]);

        $user = $request->user();
        $invitation = $user->invitation;

        if (!$invitation) {
            return back()->with('error', 'Undangan tidak ditemukan.');
        }

        // Cari atau buat section instagram_filter
        $section = $invitation->sections()
            ->firstOrCreate(
                ['section_key' => 'instagram_filter'],
                [
                    'section_name' => 'Instagram Filter',
                    'sort_order' => 8, // Urutan default sebelum Wishes/RSVP
                    'is_visible' => false,
                ]
            );

        if ($request->apply) {
            // Skenario 1: Menggunakan Link Kustom Inputan User
            if ($request->use_custom) {
                if (empty($request->custom_filter_url)) {
                    return back()->withErrors(['custom_filter_url' => 'Tautan filter kustom wajib diisi jika Anda memilih opsi kustom.']);
                }

                $section->update([
                    'is_visible' => true,
                    'custom_config' => [
                        'filter_id' => null,
                        'filter_url' => $request->custom_filter_url,
                        'preview_image' => null,
                        'name' => 'Custom Instagram Filter',
                        'hashtag' => str_replace(' ', '', $invitation->title ?: 'OurWedding'),
                        'instagram_username' => $user->name,
                    ],
                ]);

                return back()->with('success', 'Filter Instagram kustom berhasil diterapkan ke undangan Anda! 📸');
            } 
            
            // Skenario 2: Menggunakan Katalog Generik
            if ($request->filter_id) {
                $filter = InstagramFilter::findOrFail($request->filter_id);
                
                $section->update([
                    'is_visible' => true,
                    'custom_config' => [
                        'filter_id' => $filter->id,
                        'filter_url' => $filter->filter_url,
                        'preview_image' => $filter->preview_image ?: $filter->thumbnail,
                        'name' => $filter->name,
                        'hashtag' => str_replace(' ', '', $invitation->title ?: 'OurWedding'),
                        'instagram_username' => $user->name,
                    ],
                ]);

                return back()->with('success', 'Filter Instagram katalog berhasil diterapkan ke undangan Anda! 📸');
            }

            return back()->with('error', 'Mohon pilih filter atau masukkan tautan filter kustom.');
        } else {
            // Nonaktifkan filter
            $section->update(['is_visible' => false]);
            return back()->with('success', 'Filter Instagram berhasil dinonaktifkan dari undangan Anda.');
        }
    }
}
