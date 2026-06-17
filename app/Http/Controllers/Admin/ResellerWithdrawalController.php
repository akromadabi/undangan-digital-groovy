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

        // Get actual reseller wallet balance
        $wallet = \App\Models\ResellerWallet::firstOrCreate(['reseller_id' => $reseller->id], ['balance' => 0]);

        // Calculate total profit from wallet transactions (credits excluding refunds/credit reversals)
        $totalProfit = \App\Models\ResellerWalletTransaction::where('reseller_id', $reseller->id)
            ->where('type', 'credit')
            ->where('description', 'NOT LIKE', '%Pengembalian%')
            ->sum('amount');

        // Calculate withdrawn amount (approved + transferred)
        $totalWithdrawn = Withdrawal::where('reseller_id', $reseller->id)
            ->whereIn('status', ['approved', 'transferred'])
            ->sum('amount');

        // Pending withdrawals
        $pendingWithdrawals = Withdrawal::where('reseller_id', $reseller->id)
            ->where('status', 'pending')
            ->sum('amount');

        // Available balance is the current wallet balance since pending is already debited immediately
        $availableBalance = (float)$wallet->balance;

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

        // Wallet transactions (mutasi)
        $walletTransactions = \App\Models\ResellerWalletTransaction::where('reseller_id', $reseller->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'type' => $t->type,
                'amount' => (float)$t->amount,
                'description' => $t->description,
                'balance_after' => (float)$t->balance_after,
                'created_at' => $t->created_at->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Pencairan', [
            'balance' => [
                'total_profit' => (float)$totalProfit,
                'total_withdrawn' => (float)$totalWithdrawn,
                'pending' => (float)$pendingWithdrawals,
                'available' => $availableBalance,
            ],
            'withdrawals' => $withdrawals,
            'walletTransactions' => $walletTransactions,
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
        $wallet = \App\Models\ResellerWallet::firstOrCreate(['reseller_id' => $reseller->id], ['balance' => 0]);
        $available = (float)$wallet->balance;

        if ($request->amount > $available) {
            return back()->withErrors(['amount' => 'Jumlah pencairan melebihi saldo tersedia (Rp ' . number_format($available, 0, ',', '.') . ').']);
        }

        $withdrawal = Withdrawal::create([
            'reseller_id' => $reseller->id,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        // Debit from wallet immediately to block balance
        \App\Models\ResellerWallet::debitCost(
            $reseller->id,
            null,
            $request->amount,
            "Penarikan dana #{$withdrawal->id} (Pending)"
        );

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
