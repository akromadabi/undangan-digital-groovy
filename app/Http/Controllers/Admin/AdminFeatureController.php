<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminFeatureController extends Controller
{
    public function index()
    {
        $features = Feature::all();
        return Inertia::render('Admin/Features/Index', ['features' => $features]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:features',
            'category' => 'required|in:content,settings,other',
            'icon' => 'nullable|string|max:50',
        ]);

        Feature::create($request->only(['name', 'slug', 'category', 'description', 'icon']));
        return redirect()->route('admin.features.index')->with('success', 'Fitur berhasil ditambahkan.');
    }

    public function update(Request $request, Feature $feature)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'category' => 'required|in:content,settings,other',
        ]);

        $feature->update($request->only(['name', 'category', 'description', 'icon']));
        return redirect()->route('admin.features.index')->with('success', 'Fitur berhasil diupdate.');
    }

    public function destroy(Feature $feature)
    {
        $feature->delete();
        return redirect()->route('admin.features.index')->with('success', 'Fitur berhasil dihapus.');
    }
}
