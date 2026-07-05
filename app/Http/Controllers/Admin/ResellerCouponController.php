<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ResellerCouponController extends Controller
{
    public function index()
    {
        $reseller = auth()->user();
        
        $coupons = Coupon::where('reseller_id', $reseller->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
        ]);
    }

    public function store(Request $request)
    {
        $reseller = auth()->user();

        // Standardize coupon code to uppercase before validation
        if ($request->has('code')) {
            $request->merge(['code' => strtoupper(trim($request->code))]);
        }

        $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('coupons')->where(fn ($query) => $query->where('reseller_id', $reseller->id)),
            ],
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0',
            'min_purchase' => 'required|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'required|boolean',
        ]);

        Coupon::create([
            'reseller_id' => $reseller->id,
            'code' => $request->code,
            'discount_type' => $request->discount_type,
            'discount_value' => $request->discount_value,
            'min_purchase' => $request->min_purchase,
            'max_discount' => $request->max_discount,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'usage_limit' => $request->usage_limit,
            'is_active' => $request->is_active,
        ]);

        return back()->with('success', 'Kupon berhasil dibuat.');
    }

    public function update(Request $request, Coupon $coupon)
    {
        if ($coupon->reseller_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        // Standardize coupon code to uppercase before validation
        if ($request->has('code')) {
            $request->merge(['code' => strtoupper(trim($request->code))]);
        }

        $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('coupons')
                    ->where(fn ($query) => $query->where('reseller_id', auth()->id()))
                    ->ignore($coupon->id),
            ],
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0',
            'min_purchase' => 'required|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'required|boolean',
        ]);

        $coupon->update([
            'code' => $request->code,
            'discount_type' => $request->discount_type,
            'discount_value' => $request->discount_value,
            'min_purchase' => $request->min_purchase,
            'max_discount' => $request->max_discount,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'usage_limit' => $request->usage_limit,
            'is_active' => $request->is_active,
        ]);

        return back()->with('success', 'Kupon berhasil diperbarui.');
    }

    public function destroy(Coupon $coupon)
    {
        if ($coupon->reseller_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        $coupon->delete();

        return back()->with('success', 'Kupon berhasil dihapus.');
    }

    public function toggleActive(Coupon $coupon)
    {
        if ($coupon->reseller_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        $coupon->update([
            'is_active' => !$coupon->is_active,
        ]);

        return back()->with('success', 'Status kupon berhasil diperbarui.');
    }
}
