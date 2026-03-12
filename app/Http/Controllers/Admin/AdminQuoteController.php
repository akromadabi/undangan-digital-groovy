<?php

namespace App\Http\Controllers\Admin;

use App\Models\QuoteTemplate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminQuoteController extends Controller
{
    public function index()
    {
        $quotes = QuoteTemplate::orderBy('religion')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Quotes', [
            'quotes' => $quotes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'religion' => 'required|in:islam,kristen,hindu,buddha,umum',
            'title' => 'required|string|max:200',
            'ayat' => 'required|string',
            'translation' => 'nullable|string',
            'source' => 'nullable|string|max:200',
        ]);

        $maxSort = QuoteTemplate::where('religion', $request->religion)->max('sort_order') ?? 0;

        QuoteTemplate::create([
            'religion' => $request->religion,
            'title' => $request->title,
            'ayat' => $request->ayat,
            'translation' => $request->translation,
            'source' => $request->source,
            'sort_order' => $maxSort + 1,
            'is_active' => true,
        ]);

        return back()->with('success', 'Template kutipan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'religion' => 'required|in:islam,kristen,hindu,buddha,umum',
            'title' => 'required|string|max:200',
            'ayat' => 'required|string',
            'translation' => 'nullable|string',
            'source' => 'nullable|string|max:200',
            'is_active' => 'boolean',
        ]);

        $quote = QuoteTemplate::findOrFail($id);
        $quote->update($request->only(['religion', 'title', 'ayat', 'translation', 'source', 'is_active']));

        return back()->with('success', 'Template kutipan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        QuoteTemplate::findOrFail($id)->delete();
        return back()->with('success', 'Template kutipan berhasil dihapus.');
    }
}
