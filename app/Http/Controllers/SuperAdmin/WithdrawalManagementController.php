<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WithdrawalManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Withdrawal::with(['reseller:id,name,email', 'reseller.resellerSettings:id,user_id,bank_name,bank_account,bank_holder'])
            ->orderByDesc('created_at');

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $withdrawals = $query->paginate(20)->through(fn($w) => [
            'id' => $w->id,
            'reseller_name' => $w->reseller->name ?? '-',
            'reseller_email' => $w->reseller->email ?? '-',
            'bank_name' => $w->reseller->resellerSettings->bank_name ?? '-',
            'bank_account' => $w->reseller->resellerSettings->bank_account ?? '-',
            'bank_holder' => $w->reseller->resellerSettings->bank_holder ?? '-',
            'amount' => (float)$w->amount,
            'status' => $w->status,
            'admin_notes' => $w->admin_notes,
            'transferred_at' => $w->transferred_at?->format('d M Y H:i'),
            'created_at' => $w->created_at->format('d M Y H:i'),
        ]);

        // Stats
        $stats = [
            'pending_count' => Withdrawal::where('status', 'pending')->count(),
            'pending_amount' => (float)Withdrawal::where('status', 'pending')->sum('amount'),
            'transferred_count' => Withdrawal::where('status', 'transferred')->count(),
            'transferred_amount' => (float)Withdrawal::where('status', 'transferred')->sum('amount'),
        ];

        return Inertia::render('SuperAdmin/Withdrawals', [
            'withdrawals' => $withdrawals,
            'stats' => $stats,
            'filters' => $request->only('status'),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $withdrawal = Withdrawal::findOrFail($id);

        $request->validate([
            'status' => 'required|in:approved,rejected,transferred',
            'admin_notes' => 'nullable|string|max:500',
        ]);

        $data = [
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ];

        if ($request->status === 'transferred') {
            $data['transferred_at'] = now();
        }

        $withdrawal->update($data);

        $statusLabel = match($request->status) {
            'approved' => 'disetujui',
            'rejected' => 'ditolak',
            'transferred' => 'ditandai sudah ditransfer',
            default => 'diperbarui',
        };

        return back()->with('success', "Pencairan berhasil {$statusLabel}.");
    }
}
