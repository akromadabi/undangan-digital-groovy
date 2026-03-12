<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\ResellerPlanPrice;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Inertia\Inertia;

class ResellerRevenueController extends Controller
{
    public function index()
    {
        $reseller = auth()->user();
        $userIds = User::where('reseller_id', $reseller->id)->pluck('id');

        // All paid payments from this reseller's users
        $payments = Payment::whereIn('user_id', $userIds)
            ->where('status', 'paid')
            ->with('user:id,name,email', 'plan:id,name,price')
            ->latest()
            ->get();

        // Reseller's custom prices keyed by plan_id
        $resellerPrices = ResellerPlanPrice::where('reseller_id', $reseller->id)
            ->pluck('reseller_price', 'plan_id');

        // Calculate revenue and profit
        $totalRevenue = 0;
        $totalProfit = 0;
        $transactions = [];

        foreach ($payments as $payment) {
            $basePrice = $payment->plan ? $payment->plan->price : 0;
            $resellerPrice = isset($resellerPrices[$payment->plan_id])
                ? (float)$resellerPrices[$payment->plan_id]
                : (float)$payment->amount;

            $profit = $resellerPrice - (float)$basePrice;
            $totalRevenue += $resellerPrice;
            $totalProfit += max($profit, 0);

            $transactions[] = [
                'id' => $payment->id,
                'user_name' => $payment->user->name ?? '-',
                'user_email' => $payment->user->email ?? '-',
                'plan_name' => $payment->plan->name ?? '-',
                'amount' => (float)$payment->amount,
                'base_price' => (float)$basePrice,
                'reseller_price' => $resellerPrice,
                'profit' => max($profit, 0),
                'paid_at' => $payment->paid_at?->format('d M Y'),
                'created_at' => $payment->created_at->format('d M Y'),
            ];
        }

        // Monthly stats (last 6 months)
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthPayments = $payments->filter(function ($p) use ($date) {
                return $p->paid_at && $p->paid_at->month === $date->month && $p->paid_at->year === $date->year;
            });

            $monthRevenue = 0;
            $monthProfit = 0;
            foreach ($monthPayments as $mp) {
                $bp = $mp->plan ? (float)$mp->plan->price : 0;
                $rp = isset($resellerPrices[$mp->plan_id]) ? (float)$resellerPrices[$mp->plan_id] : (float)$mp->amount;
                $monthRevenue += $rp;
                $monthProfit += max($rp - $bp, 0);
            }

            $monthlyStats[] = [
                'month' => $date->format('M Y'),
                'revenue' => $monthRevenue,
                'profit' => $monthProfit,
                'count' => $monthPayments->count(),
            ];
        }

        return Inertia::render('Admin/Pendapatan', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
                'total_transactions' => count($transactions),
                'total_users' => $userIds->count(),
            ],
            'transactions' => $transactions,
            'monthlyStats' => $monthlyStats,
        ]);
    }
}
