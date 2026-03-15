<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\ResellerPlanPrice;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResellerWithdrawalController extends Controller
{
    public function index()
    {
        $reseller = auth()->user();
        $settings = $reseller->resellerSettings;

        // Calculate total profit from actual payments
        $userIds = User::where('reseller_id', $reseller->id)->pluck('id');
        $payments = Payment::whereIn('user_id', $userIds)
            ->where('status', 'paid')
            ->with('plan:id,name,price')
            ->get();

        $totalProfit = 0;
        foreach ($payments as $payment) {
            $basePrice = $payment->plan ? (float)$payment->plan->price : 0;
            $actualPaid = (float)$payment->amount;
            $totalProfit += max($actualPaid - $basePrice, 0);
        }

        // Calculate withdrawn amount (approved + transferred)
        $totalWithdrawn = Withdrawal::where('reseller_id', $reseller->id)
            ->whereIn('status', ['approved', 'transferred'])
            ->sum('amount');

        // Pending withdrawals
        $pendingWithdrawals = Withdrawal::where('reseller_id', $reseller->id)
            ->where('status', 'pending')
            ->sum('amount');

        $availableBalance = max($totalProfit - (float)$totalWithdrawn - (float)$pendingWithdrawals, 0);

        // Withdrawal history
        $withdrawals = Withdrawal::where('reseller_id', $reseller->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($w) => [
                'id' => $w->id,
                'amount' => (float)$w->amount,
                'status' => $w->status,
                'admin_notes' => $w->admin_notes,
                'transferred_at' => $w->transferred_at?->format('d M Y H:i'),
                'created_at' => $w->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Pencairan', [
            'balance' => [
                'total_profit' => $totalProfit,
                'total_withdrawn' => (float)$totalWithdrawn,
                'pending' => (float)$pendingWithdrawals,
                'available' => $availableBalance,
            ],
            'withdrawals' => $withdrawals,
            'bankInfo' => [
                'bank_name' => $settings->bank_name ?? '',
                'bank_account' => $settings->bank_account ?? '',
                'bank_holder' => $settings->bank_holder ?? '',
            ],
        ]);
    }

    public function requestWithdrawal(Request $request)
    {
        $reseller = auth()->user();

        $request->validate([
            'amount' => 'required|numeric|min:10000',
        ]);

        // Check bank info is set
        $settings = $reseller->resellerSettings;
        if (!$settings || !$settings->bank_name || !$settings->bank_account || !$settings->bank_holder) {
            return back()->withErrors(['amount' => 'Silakan lengkapi info rekening bank terlebih dahulu.']);
        }

        // Check if there's a pending withdrawal
        $hasPending = Withdrawal::where('reseller_id', $reseller->id)
            ->where('status', 'pending')
            ->exists();
        if ($hasPending) {
            return back()->withErrors(['amount' => 'Masih ada permohonan pencairan yang sedang diproses. Harap tunggu hingga selesai.']);
        }

        // Calculate available balance
        $userIds = User::where('reseller_id', $reseller->id)->pluck('id');
        $payments = Payment::whereIn('user_id', $userIds)->where('status', 'paid')->with('plan:id,price')->get();

        $totalProfit = 0;
        foreach ($payments as $p) {
            $base = $p->plan ? (float)$p->plan->price : 0;
            $totalProfit += max((float)$p->amount - $base, 0);
        }

        $totalWithdrawn = Withdrawal::where('reseller_id', $reseller->id)
            ->whereIn('status', ['approved', 'transferred'])
            ->sum('amount');
        $pendingAmount = Withdrawal::where('reseller_id', $reseller->id)
            ->where('status', 'pending')
            ->sum('amount');

        $available = max($totalProfit - (float)$totalWithdrawn - (float)$pendingAmount, 0);

        if ($request->amount > $available) {
            return back()->withErrors(['amount' => 'Jumlah pencairan melebihi saldo tersedia (Rp ' . number_format($available, 0, ',', '.') . ').']);
        }

        Withdrawal::create([
            'reseller_id' => $reseller->id,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Permohonan pencairan berhasil diajukan.');
    }

    public function updateBank(Request $request)
    {
        $request->validate([
            'bank_name' => 'required|string|max:100',
            'bank_account' => 'required|string|max:50',
            'bank_holder' => 'required|string|max:100',
        ]);

        $reseller = auth()->user();
        $reseller->resellerSettings()->updateOrCreate(
            ['user_id' => $reseller->id],
            $request->only(['bank_name', 'bank_account', 'bank_holder'])
        );

        return back()->with('success', 'Info rekening berhasil disimpan.');
    }
}
