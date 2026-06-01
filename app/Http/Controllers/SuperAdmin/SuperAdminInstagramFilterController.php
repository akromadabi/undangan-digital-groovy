<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\InstagramFilter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminInstagramFilterController extends Controller
{
    public function index()
    {
        $filters = InstagramFilter::orderBy('sort_order')->orderBy('id')->get();
        return Inertia::render('SuperAdmin/InstagramFilters/Index', [
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/InstagramFilters/Form', [
            'filter' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|alpha_dash|unique:instagram_filters,slug',
            'filter_url' => 'required|url|max:500',
            'thumbnail' => 'nullable|string|max:500',
            'preview_image' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);

        InstagramFilter::create($validated);

        return redirect()->route('super-admin.instagram-filters.index')
            ->with('success', 'Filter Instagram berhasil ditambahkan ke katalog! 📸');
    }

    public function edit(InstagramFilter $instagramFilter)
    {
        return Inertia::render('SuperAdmin/InstagramFilters/Form', [
            'filter' => $instagramFilter,
        ]);
    }

    public function update(Request $request, InstagramFilter $instagramFilter)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|alpha_dash|unique:instagram_filters,slug,' . $instagramFilter->id,
            'filter_url' => 'required|url|max:500',
            'thumbnail' => 'nullable|string|max:500',
            'preview_image' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
            'description' => 'nullable|string',
        ]);

        $instagramFilter->update($validated);

        return redirect()->route('super-admin.instagram-filters.index')
            ->with('success', 'Filter Instagram berhasil diperbarui! ✨');
    }

    public function destroy(InstagramFilter $instagramFilter)
    {
        $instagramFilter->delete();
        return back()->with('success', 'Filter Instagram berhasil dihapus dari katalog.');
    }

    public function toggleActive(InstagramFilter $instagramFilter)
    {
        $instagramFilter->update(['is_active' => !$instagramFilter->is_active]);
        return back()->with('success', $instagramFilter->is_active ? 'Filter diaktifkan.' : 'Filter dinonaktifkan.');
    }
}
