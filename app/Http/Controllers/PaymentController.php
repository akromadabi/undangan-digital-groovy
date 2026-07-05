<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\ResellerPlanPrice;
use App\Models\SubscriptionPlan;
use App\Models\Coupon;
use App\Services\MidtransService;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Show pricing / upgrade page.
     * Uses reseller custom prices if user belongs to a reseller.
     */
    public function pricing()
    {
        $plans = SubscriptionPlan::with('featureAccess.feature')
            ->where('type', 'invitation')
            ->orderBy('sort_order')
            ->get();
        $user = auth()->user();
        $currentPlan = $user->activeSubscription?->plan;
        $features = \App\Models\Feature::orderBy('category')->orderBy('name')->get();

        // If user belongs to a reseller, overlay custom prices
        $resellerPrices = [];
        if ($user->reseller_id) {
            $resellerPrices = ResellerPlanPrice::where('reseller_id', $user->reseller_id)
                ->get()
                ->keyBy('plan_id');
        }

        // Override plan prices with reseller prices for display
        $plansData = $plans->map(function ($plan) use ($resellerPrices, $user) {
            $planArray = $plan->toArray();
            if ($user->reseller_id && isset($resellerPrices[$plan->id])) {
                $rp = $resellerPrices[$plan->id];
                $planArray['display_price'] = (float)$rp->reseller_price;
                $planArray['original_price'] = $rp->normal_price !== null ? (float)$rp->normal_price : null;
            } else {
                $planArray['display_price'] = (float)$plan->price;
                $planArray['original_price'] = null;
            }
            return $planArray;
        });

        $paymentGatewayType = 'admin';
        $tripayChannels = [];

        if ($user->reseller_id) {
            $resellerSetting = \App\Models\ResellerSetting::where('user_id', $user->reseller_id)->first();
            if ($resellerSetting) {
                $paymentGatewayType = $resellerSetting->payment_mode;
                if ($paymentGatewayType === 'reseller_gateway' && $resellerSetting->reseller_gateway_type === 'tripay') {
                    $tripay = new \App\Services\TripayService($resellerSetting);
                    $tripayChannels = cache()->remember('reseller_tripay_channels_' . $user->reseller_id, 300, function () use ($tripay) {
                        return $tripay->getPaymentChannels();
                    });
                }
            }
        }

        return Inertia::render('Dashboard/Pricing', [
            'plans' => $plansData,
            'currentPlan' => $currentPlan,
            'features' => $features,
            'paymentGatewayType' => $paymentGatewayType,
            'tripayChannels' => $tripayChannels,
        ]);
    }

    /**
     * Create payment and redirect to invoice.
     * Uses reseller custom price if applicable.
     */
    /**
     * Show Checkout Page with package and payment method selection.
     */
    public function showCheckout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'greeting_card_id' => 'nullable|exists:greeting_cards,id',
            'invitation_id' => 'nullable|exists:invitations,id',
        ]);

        $user = auth()->user();
        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        
        $price = (float)$plan->price;
        $originalPrice = (float)$plan->price;
        $hasResellerPrice = false;

        if ($user->reseller_id) {
            $resellerPrice = ResellerPlanPrice::where('reseller_id', $user->reseller_id)
                ->where('plan_id', $plan->id)
                ->first();
            if ($resellerPrice) {
                $price = (float)$resellerPrice->reseller_price;
                $hasResellerPrice = true;
            }
        }

        $paymentGatewayType = 'admin';
        $tripayChannels = [];
        $bankAccounts = [];
        $resellerSetting = null;

        if ($user->reseller_id) {
            $resellerSetting = \App\Models\ResellerSetting::where('user_id', $user->reseller_id)->first();
            if ($resellerSetting) {
                $paymentGatewayType = $resellerSetting->payment_mode;
                if ($paymentGatewayType === 'reseller_gateway' && $resellerSetting->reseller_gateway_type === 'tripay') {
                    $tripay = new \App\Services\TripayService($resellerSetting);
                    $tripayChannels = cache()->remember('reseller_tripay_channels_' . $user->reseller_id, 300, function () use ($tripay) {
                        return $tripay->getPaymentChannels();
                    });
                }
                
                // Load reseller manual bank accounts if reseller uses manual payment
                if ($paymentGatewayType === 'manual') {
                    if (!empty($resellerSetting->bank_accounts) && is_array($resellerSetting->bank_accounts)) {
                        $bankAccounts = $resellerSetting->bank_accounts;
                    } elseif ($resellerSetting->bank_name) {
                        $bankAccounts[] = [
                            'bank_name' => $resellerSetting->bank_name,
                            'account_number' => $resellerSetting->bank_account,
                            'account_name' => $resellerSetting->bank_holder,
                        ];
                    }
                }
            }
        }

        if (empty($bankAccounts) && $paymentGatewayType === 'manual') {
            // Fallback to admin bank accounts
            $globalBankAccounts = \App\Models\GlobalSetting::getValue('bank_accounts', []);
            if (!empty($globalBankAccounts) && is_array($globalBankAccounts)) {
                $bankAccounts = $globalBankAccounts;
            }
        }

        // Context details
        $invitation = null;
        if ($request->invitation_id) {
            $invitation = \App\Models\Invitation::find($request->invitation_id);
        } elseif (!$request->greeting_card_id) {
            $activeId = session('active_invitation_id');
            if ($activeId) {
                $invitation = \App\Models\Invitation::find($activeId);
            }
        }

        $greetingCard = null;
        if ($request->greeting_card_id) {
            $greetingCard = \App\Models\GreetingCard::find($request->greeting_card_id);
        }

        return Inertia::render('Dashboard/Checkout', [
            'plan' => $plan,
            'price' => $price,
            'originalPrice' => $originalPrice,
            'hasResellerPrice' => $hasResellerPrice,
            'paymentGatewayType' => $paymentGatewayType,
            'tripayChannels' => $tripayChannels,
            'bankAccounts' => $bankAccounts,
            'invitation' => $invitation,
            'greetingCard' => $greetingCard,
            'resellerSetting' => $resellerSetting ? [
                'brand_name' => $resellerSetting->brand_name,
                'footer_whatsapp' => $resellerSetting->footer_whatsapp,
            ] : null,
        ]);
    }

    /**
     * Validate coupon code for checkout.
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'plan_id' => 'required|exists:subscription_plans,id',
            'greeting_card_id' => 'nullable|exists:greeting_cards,id',
        ]);

        $user = auth()->user();
        if (!$user->reseller_id) {
            return response()->json([
                'valid' => false,
                'message' => 'Kupon hanya dapat digunakan untuk pembelian melalui reseller.',
            ]);
        }

        $plan = SubscriptionPlan::findOrFail($request->plan_id);

        // Get checkout price
        $price = (float)$plan->price;
        $resellerPrice = ResellerPlanPrice::where('reseller_id', $user->reseller_id)
            ->where('plan_id', $plan->id)
            ->first();
        if ($resellerPrice) {
            $price = (float)$resellerPrice->reseller_price;
        }

        $code = strtoupper(trim($request->code));
        $coupon = Coupon::where('reseller_id', $user->reseller_id)
            ->where('code', $code)
            ->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Kode kupon tidak valid.',
            ]);
        }

        if (!$coupon->isValidFor($price)) {
            if (!$coupon->is_active) {
                $msg = 'Kupon sedang tidak aktif.';
            } elseif ($coupon->starts_at && now()->lt($coupon->starts_at)) {
                $msg = 'Kupon belum dimulai.';
            } elseif ($coupon->expires_at && now()->gt($coupon->expires_at)) {
                $msg = 'Kupon sudah kedaluwarsa.';
            } elseif ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
                $msg = 'Kuota penggunaan kupon sudah habis.';
            } elseif ($price < $coupon->min_purchase) {
                $msg = 'Minimal pembelian tidak terpenuhi (Min. Rp ' . number_format($coupon->min_purchase, 0, ',', '.') . ').';
            } else {
                $msg = 'Kupon tidak dapat digunakan.';
            }

            return response()->json([
                'valid' => false,
                'message' => $msg,
            ]);
        }

        $discount = $coupon->calculateDiscount($price);
        $finalAmount = max($price - $discount, 0);

        return response()->json([
            'valid' => true,
            'coupon_id' => $coupon->id,
            'code' => $coupon->code,
            'discount_amount' => $discount,
            'final_amount' => $finalAmount,
            'message' => 'Kupon berhasil diterapkan!',
        ]);
    }

    /**
     * Create payment and redirect to invoice.
     * Uses reseller custom price and coupon if applicable.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'greeting_card_id' => 'nullable|exists:greeting_cards,id',
            'invitation_id' => 'nullable|exists:invitations,id',
            'payment_method_code' => 'nullable|string',
            'coupon_code' => 'nullable|string',
        ]);

        $user = auth()->user();
        $greetingCardId = $request->input('greeting_card_id');
        
        $resellerSetting = null;
        if ($user->reseller_id) {
            $resellerSetting = \App\Models\ResellerSetting::where('user_id', $user->reseller_id)->first();
        }

        // Validate and load coupon if provided
        $coupon = null;
        $discount = 0;
        if ($request->coupon_code) {
            if (!$user->reseller_id) {
                return back()->with('error', 'Kupon hanya dapat digunakan pada reseller.');
            }
            $code = strtoupper(trim($request->coupon_code));
            $coupon = Coupon::where('reseller_id', $user->reseller_id)
                ->where('code', $code)
                ->first();
            if (!$coupon) {
                return back()->with('error', 'Kode kupon tidak valid.');
            }
        }

        // ── KARTU UCAPAN CHECKOUT ──
        if ($greetingCardId) {
            $card = \App\Models\GreetingCard::findOrFail($greetingCardId);
            if ($card->user_id !== $user->id) {
                abort(403, 'Akses ditolak.');
            }

            $plan = \App\Models\SubscriptionPlan::where('type', 'greeting_card')->findOrFail($request->plan_id);

            // Cek kecocokan template dengan allowed_plans dari paket
            $template = \App\Models\GreetingCardTemplate::where('slug', $card->template)->first();
            if ($template && $template->allowed_plans) {
                $allowed = is_array($template->allowed_plans) ? $template->allowed_plans : json_decode($template->allowed_plans, true);
                if (!in_array($plan->slug, $allowed)) {
                    return back()->with('error', "Tema {$template->name} tidak didukung oleh paket {$plan->name}.");
                }
            }

            // Tentukan harga paket (reseller kustom atau base price)
            $price = (float)$plan->price;
            if ($user->reseller_id) {
                $resellerPrice = \App\Models\ResellerPlanPrice::where('reseller_id', $user->reseller_id)
                    ->where('plan_id', $plan->id)
                    ->first();
                if ($resellerPrice) {
                    $price = (float)$resellerPrice->reseller_price;
                }
            }

            // Apply coupon discount if any
            if ($coupon) {
                if (!$coupon->isValidFor($price)) {
                    return back()->with('error', 'Kupon tidak dapat digunakan.');
                }
                $discount = $coupon->calculateDiscount($price);
                $price = max($price - $discount, 0);
            }

            if ($price <= 0) {
                // Gratis atau diskon 100% - langsung aktifkan!
                $card->update(['is_active' => true]);
                
                \App\Models\Subscription::create([
                    'user_id' => $user->id,
                    'greeting_card_id' => $card->id,
                    'plan_id' => $plan->id,
                    'starts_at' => now(),
                    'expires_at' => $plan->duration_days > 0 ? now()->addDays($plan->duration_days) : null,
                    'status' => 'active',
                ]);

                if ($coupon) {
                    $coupon->increment('used_count');
                    
                    // Create dummy paid payment record
                    Payment::create([
                        'user_id' => $user->id,
                        'greeting_card_id' => $card->id,
                        'plan_id' => $plan->id,
                        'amount' => 0,
                        'discount_amount' => $discount,
                        'coupon_id' => $coupon->id,
                        'payment_method' => 'coupon',
                        'payment_gateway' => 'manual',
                        'status' => 'paid',
                        'paid_at' => now(),
                    ]);
                }

                return redirect()->route('greeting-card.index')->with('success', 'Kartu ucapan berhasil diaktifkan! 🎉');
            }

            // Transfer Bank Manual (untuk user reseller yang mengaktifkan opsi manual)
            if ($user->reseller_id && $resellerSetting && $resellerSetting->payment_mode === 'manual') {
                $existingPendingManual = Payment::where('user_id', $user->id)
                    ->where('greeting_card_id', $card->id)
                    ->where('plan_id', $plan->id)
                    ->whereIn('status', ['pending_manual', 'waiting_review'])
                    ->where('payment_gateway', 'manual')
                    ->where('created_at', '>', now()->subHours(24))
                    ->first();

                if ($existingPendingManual) {
                    return redirect()->route('payment.manual.show', $existingPendingManual->id);
                }

                $payment = Payment::create([
                    'user_id' => $user->id,
                    'greeting_card_id' => $card->id,
                    'plan_id' => $plan->id,
                    'amount' => $price,
                    'discount_amount' => $discount,
                    'coupon_id' => $coupon ? $coupon->id : null,
                    'payment_method' => 'transfer',
                    'payment_gateway' => 'manual',
                    'status' => 'pending_manual',
                ]);

                if ($coupon) {
                    $coupon->increment('used_count');
                }

                return redirect()->route('payment.manual.show', $payment->id);
            }

            // Online checkout via Admin gateway atau Reseller gateway
            $existingPending = Payment::where('user_id', $user->id)
                ->where('greeting_card_id', $card->id)
                ->where('plan_id', $plan->id)
                ->where('status', 'pending')
                ->where('created_at', '>', now()->subHours(24))
                ->first();

            if ($existingPending && !empty($existingPending->metadata['invoice_url'])) {
                return Inertia::location($existingPending->metadata['invoice_url']);
            }

            $payment = Payment::create([
                'user_id' => $user->id,
                'greeting_card_id' => $card->id,
                'plan_id' => $plan->id,
                'amount' => $price,
                'discount_amount' => $discount,
                'coupon_id' => $coupon ? $coupon->id : null,
                'status' => 'pending',
            ]);

            if ($coupon) {
                $coupon->increment('used_count');
            }

            $result = $this->processOnlineCheckout($payment, $resellerSetting, $request->payment_method_code);

            if ($result['success']) {
                return Inertia::location($result['invoice_url']);
            }

            $payment->delete();
            return back()->with('error', $result['error'] ?? 'Gagal membuat tagihan online.');
        }

        // ── UNDANGAN PLAN CHECKOUT ──
        $invitationId = $request->input('invitation_id') ?: session('active_invitation_id');
        if (!$invitationId) {
            return back()->with('error', 'Undangan tidak ditemukan untuk pemesanan ini.');
        }

        $plan = SubscriptionPlan::findOrFail($request->plan_id);

        // Determine actual price: reseller price or base price
        $price = (float)$plan->price;
        if ($user->reseller_id) {
            $resellerPrice = ResellerPlanPrice::where('reseller_id', $user->reseller_id)
                ->where('plan_id', $plan->id)
                ->first();
            if ($resellerPrice) {
                $price = (float)$resellerPrice->reseller_price;
            }
        }

        // Apply coupon discount if any
        if ($coupon) {
            if (!$coupon->isValidFor($price)) {
                return back()->with('error', 'Kupon tidak dapat digunakan.');
            }
            $discount = $coupon->calculateDiscount($price);
            $price = max($price - $discount, 0);
        }

        if ($price <= 0) {
            // Gratis atau diskon 100% - langsung aktifkan!
            $sub = \App\Models\Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'invitation_id' => $invitationId,
                'starts_at' => now(),
                'expires_at' => $plan->duration_days > 0 ? now()->addDays($plan->duration_days) : null,
                'status' => 'active',
            ]);

            $payment = Payment::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'invitation_id' => $invitationId,
                'amount' => 0,
                'discount_amount' => $discount,
                'coupon_id' => $coupon->id,
                'payment_method' => 'coupon',
                'payment_gateway' => 'manual',
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $sub->update(['payment_id' => $payment->id]);

            if ($coupon) {
                $coupon->increment('used_count');
            }

            // Debit cost if reseller is on reseller gateway mode
            if ($user->reseller_id) {
                $paymentMode = $resellerSetting ? $resellerSetting->payment_mode : 'admin';
                $basePrice = (float)$plan->price;

                if ($paymentMode === 'reseller_gateway') {
                    \App\Models\ResellerWallet::debitCost(
                        $user->reseller_id,
                        $payment->id,
                        $basePrice,
                        "Biaya modal paket {$plan->name} - Pelanggan {$user->name} (Diskon Kupon 100%)"
                    );
                }
            }

            return redirect()->route('dashboard')->with('success', 'Paket undangan berhasil diaktifkan! 🎉');
        }

        // Intercept reseller checkout for manual bank transfer
        if ($user->reseller_id && $resellerSetting && $resellerSetting->payment_mode === 'manual') {
            $existingPendingManual = Payment::where('user_id', $user->id)
                ->where('plan_id', $plan->id)
                ->where('invitation_id', $invitationId)
                ->whereIn('status', ['pending_manual', 'waiting_review'])
                ->where('payment_gateway', 'manual')
                ->where('created_at', '>', now()->subHours(24))
                ->first();

            if ($existingPendingManual) {
                return redirect()->route('payment.manual.show', $existingPendingManual->id);
            }

            $payment = Payment::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'invitation_id' => $invitationId,
                'amount' => $price,
                'discount_amount' => $discount,
                'coupon_id' => $coupon ? $coupon->id : null,
                'payment_method' => 'transfer',
                'payment_gateway' => 'manual',
                'status' => 'pending_manual',
            ]);

            if ($coupon) {
                $coupon->increment('used_count');
            }

            return redirect()->route('payment.manual.show', $payment->id);
        }

        // Check for existing pending payment
        $existingPending = Payment::where('user_id', $user->id)
            ->where('plan_id', $plan->id)
            ->where('invitation_id', $invitationId)
            ->where('status', 'pending')
            ->where('created_at', '>', now()->subHours(24))
            ->first();

        if ($existingPending && !empty($existingPending->metadata['invoice_url'])) {
            return Inertia::location($existingPending->metadata['invoice_url']);
        }

        // Create payment record
        $payment = Payment::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'invitation_id' => $invitationId,
            'amount' => $price,
            'discount_amount' => $discount,
            'coupon_id' => $coupon ? $coupon->id : null,
            'status' => 'pending',
        ]);

        if ($coupon) {
            $coupon->increment('used_count');
        }

        $result = $this->processOnlineCheckout($payment, $resellerSetting, $request->payment_method_code);

        if ($result['success']) {
            return Inertia::location($result['invoice_url']);
        }

        $payment->delete();
        return back()->with('error', $result['error'] ?? 'Gagal membuat tagihan online.');
    }

    /**
     * Helper to process online gateway invoice creation.
     */
    private function processOnlineCheckout(Payment $payment, $resellerSetting, $methodCode = null)
    {
        $gatewayType = 'siapppay';

        if ($resellerSetting && $resellerSetting->payment_mode === 'reseller_gateway') {
            $gatewayType = $resellerSetting->reseller_gateway_type;
        } else {
            $gatewayType = \App\Models\GlobalSetting::getValue('active_payment_gateway', 'siapppay');
        }

        if ($gatewayType === 'siapppay') {
            $siappPay = new \App\Services\SiappPayService();
            if (!$siappPay->isConfigured()) {
                return ['success' => false, 'error' => 'SiappPay (pay.siapp.in) Secret Key belum dikonfigurasi di Pengaturan Super Admin.'];
            }
            return $siappPay->createTransaction($payment, $methodCode ?: 'QRIS');
        } elseif ($gatewayType === 'tripay') {
            $tripay = new \App\Services\TripayService($resellerSetting);
            if (!$tripay->isConfigured()) {
                return ['success' => false, 'error' => 'API TriPay belum dikonfigurasi oleh reseller.'];
            }
            $channelCode = $methodCode ?: 'QRIS';
            return $tripay->createTransaction($payment, $channelCode);
        } elseif ($gatewayType === 'xendit') {
            $xendit = new XenditService($resellerSetting);
            if (!$xendit->isConfigured()) {
                return ['success' => false, 'error' => 'Kredensial Xendit belum dikonfigurasi.'];
            }
            return $xendit->createInvoice($payment);
        } else {
            // Midtrans snap invoice
            $midtrans = new MidtransService($resellerSetting);
            if (!$midtrans->isConfigured()) {
                return ['success' => false, 'error' => 'Midtrans belum dikonfigurasi. Hubungi admin.'];
            }
            return $midtrans->createInvoice($payment);
        }
    }

    /**
     * Payment history page.
     */
    public function history()
    {
        $payments = Payment::where('user_id', auth()->id())
            ->with('plan')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Dashboard/PaymentHistory', [
            'payments' => $payments,
        ]);
    }

    /**
     * Handle Midtrans webhook.
     */
    public function webhook(Request $request)
    {
        $midtrans = new MidtransService();
        $payload = $request->all();

        $success = $midtrans->handleNotification($payload);

        if ($success) {
            return response()->json(['status' => 'ok']);
        }

        return response()->json(['status' => 'failed'], 400);
    }

    /**
     * Show manual payment bank details and proof upload form.
     */
    public function showManualPayment(Payment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        if ($payment->payment_gateway !== 'manual') {
            return redirect()->route('payment.pricing');
        }

        $payment->load('plan');

        $resellerSetting = \App\Models\ResellerSetting::where('user_id', $payment->user->reseller_id)->first();

        $bankAccounts = [];
        if ($resellerSetting) {
            if (!empty($resellerSetting->bank_accounts) && is_array($resellerSetting->bank_accounts)) {
                foreach ($resellerSetting->bank_accounts as $acc) {
                    $bankAccounts[] = [
                        'bank_name' => $acc['bank_name'] ?? '',
                        'account_number' => $acc['account_number'] ?? '',
                        'account_name' => $acc['account_name'] ?? '',
                    ];
                }
            } elseif ($resellerSetting->bank_name) {
                $bankAccounts[] = [
                    'bank_name' => $resellerSetting->bank_name,
                    'account_number' => $resellerSetting->bank_account,
                    'account_name' => $resellerSetting->bank_holder,
                ];
            }
        } else {
            // Fallback ke rekening bank milik Super Admin (Global Setting)
            $globalBankAccounts = \App\Models\GlobalSetting::getValue('bank_accounts', []);
            if (!empty($globalBankAccounts) && is_array($globalBankAccounts)) {
                foreach ($globalBankAccounts as $acc) {
                    $bankAccounts[] = [
                        'bank_name' => $acc['bank_name'] ?? '',
                        'account_number' => $acc['account_number'] ?? '',
                        'account_name' => $acc['account_name'] ?? '',
                    ];
                }
            }
        }

        $resellerContact = null;
        if ($resellerSetting) {
            $resellerContact = [
                'brand_name' => $resellerSetting->brand_name,
                'whatsapp' => $resellerSetting->footer_whatsapp,
                'phone' => $resellerSetting->footer_phone,
                'email' => $resellerSetting->footer_email,
            ];
        }

        return Inertia::render('Dashboard/ManualPayment', [
            'payment' => $payment,
            'bankAccounts' => $bankAccounts,
            'resellerContact' => $resellerContact,
        ]);
    }

    /**
     * Handle manual payment proof image upload.
     */
    public function uploadProof(Request $request, Payment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        $request->validate([
            'proof' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('proof')) {
            $file = $request->file('proof');

            \App\Helpers\ImageCompressor::compress($file);

            $ext = $file->guessExtension() ?: $file->getClientOriginalExtension() ?: 'jpg';
            if ($ext === 'jpeg') { $ext = 'jpg'; }
            $filename = 'bukti-bayar-' . time() . '-' . rand(100, 999) . '.' . $ext;
            $path = $file->storeAs('payment/proofs', $filename, 'public');

            $payment->update([
                'proof_image' => $path,
                'status' => 'waiting_review',
            ]);

            return back()->with('success', 'Bukti transfer berhasil diunggah. Menunggu verifikasi admin.');
        }

        return back()->with('error', 'Gagal mengunggah bukti transfer.');
    }

    /**
     * Cancel manual payment.
     */
    public function cancelPayment(Payment $payment)
    {
        if ($payment->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        if ($payment->status === 'paid') {
            return back()->with('error', 'Pembayaran yang sudah lunas tidak dapat dibatalkan.');
        }

        $payment->update(['status' => 'cancelled']);

        return redirect()->route('payment.pricing')->with('success', 'Pembayaran dibatalkan.');
    }

    /**
     * Handle TriPay Webhook
     */
    public function tripayWebhook(Request $request)
    {
        $signature = $request->header('X-Callback-Signature') ?: $request->header('Callback-Signature');
        $rawJson = $request->getContent();

        if (!$signature) {
            \Illuminate\Support\Facades\Log::warning('Tripay Webhook: missing signature header');
            return response()->json(['status' => 'failed', 'message' => 'No signature header'], 400);
        }

        $payload = json_decode($rawJson, true);
        if (!$payload) {
            \Illuminate\Support\Facades\Log::warning('Tripay Webhook: invalid JSON body');
            return response()->json(['status' => 'failed', 'message' => 'Invalid JSON body'], 400);
        }

        $orderId = $payload['merchant_ref'] ?? null;
        if (!$orderId) {
            \Illuminate\Support\Facades\Log::warning('Tripay Webhook: missing merchant_ref');
            return response()->json(['status' => 'failed', 'message' => 'Missing merchant_ref'], 400);
        }

        $payment = Payment::where('external_id', $orderId)->first();
        if (!$payment) {
            \Illuminate\Support\Facades\Log::warning('Tripay Webhook: payment not found', ['order_id' => $orderId]);
            return response()->json(['status' => 'failed', 'message' => 'Payment not found'], 400);
        }

        // Load correct credentials for signature verification
        $user = $payment->user;
        $resellerSetting = null;
        if ($user && $user->reseller_id) {
            $resellerSetting = \App\Models\ResellerSetting::where('user_id', $user->reseller_id)->first();
        }

        $tripay = new \App\Services\TripayService($resellerSetting);
        if (!$tripay->verifyWebhookSignature($rawJson, $signature)) {
            \Illuminate\Support\Facades\Log::warning('Tripay Webhook: signature mismatch', ['merchant_ref' => $orderId]);
            return response()->json(['status' => 'failed', 'message' => 'Invalid signature'], 400);
        }

        $status = strtoupper($payload['status'] ?? 'UNPAID');

        if ($status === 'PAID') {
            if ($payment->status !== 'paid') {
                $payment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'tripay_status' => $status,
                        'tripay_response' => $payload,
                    ]),
                ]);

                // check if it's a reseller modal payment
                if ($payment->parent_payment_id) {
                    $parent = $payment->parentPayment;
                    if ($parent && $parent->status !== 'paid') {
                        $parent->update([
                            'status' => 'paid',
                            'paid_at' => now(),
                            'payment_method' => $payment->payment_method ?: 'tripay',
                            'reviewed_by' => $payment->user_id, // reseller user id
                            'reviewed_at' => now(),
                            'admin_notes' => 'Pembayaran modal lunas via gateway online TriPay.',
                        ]);

                        // Activate subscription for the customer
                        if ($parent->greeting_card_id) {
                            $parent->greetingCard()->update(['is_active' => true]);
                            \App\Models\Subscription::create([
                                'user_id' => $parent->user_id,
                                'greeting_card_id' => $parent->greeting_card_id,
                                'plan_id' => $parent->plan_id,
                                'payment_id' => $parent->id,
                                'starts_at' => now(),
                                'expires_at' => $parent->plan ? now()->addDays($parent->plan->duration_days) : null,
                                'status' => 'active',
                            ]);
                        } else {
                            \App\Models\Subscription::create([
                                'user_id' => $parent->user_id,
                                'plan_id' => $parent->plan_id,
                                'invitation_id' => $parent->invitation_id,
                                'payment_id' => $parent->id,
                                'starts_at' => now(),
                                'expires_at' => $parent->plan ? now()->addDays($parent->plan->duration_days) : null,
                                'status' => 'active',
                            ]);
                        }
                    }
                    \Illuminate\Support\Facades\Log::info('Tripay Webhook: reseller modal payment successful', ['payment_id' => $payment->id]);
                    return response()->json(['success' => true]);
                }

                // Activate subscription for direct payment
                if ($payment->greeting_card_id) {
                    $payment->greetingCard()->update(['is_active' => true]);
                    \App\Models\Subscription::create([
                        'user_id' => $payment->user_id,
                        'greeting_card_id' => $payment->greeting_card_id,
                        'plan_id' => $payment->plan_id,
                        'payment_id' => $payment->id,
                        'starts_at' => now(),
                        'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                        'status' => 'active',
                    ]);
                } else {
                    \App\Models\Subscription::create([
                        'user_id' => $payment->user_id,
                        'plan_id' => $payment->plan_id,
                        'invitation_id' => $payment->invitation_id,
                        'payment_id' => $payment->id,
                        'starts_at' => now(),
                        'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                        'status' => 'active',
                    ]);
                }

                // Credit reseller wallet or debit cost
                if ($user && $user->reseller_id && $payment->plan_id) {
                    $paymentMode = $resellerSetting ? $resellerSetting->payment_mode : 'admin';
                    $basePrice = (float)$payment->plan->price;

                    if ($paymentMode === 'reseller_gateway') {
                        // Debit cost
                        \App\Models\ResellerWallet::debitCost(
                            $user->reseller_id,
                            $payment->id,
                            $basePrice,
                            "Biaya modal paket {$payment->plan->name} - Pelanggan {$user->name}"
                        );
                    } else {
                        // Credit profit
                        $paidAmount = (float)$payment->amount;
                        $profit = $paidAmount - $basePrice;

                        if ($profit > 0) {
                            \App\Models\ResellerWallet::creditProfit(
                                $user->reseller_id,
                                $payment->id,
                                $profit,
                                "Profit dari {$user->name} - Paket {$payment->plan->name}"
                            );
                        }
                    }
                }
            }
        } elseif (in_array($status, ['FAILED', 'EXPIRED'])) {
            $payment->update(['status' => 'failed']);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Handle Xendit Webhook
     */
    public function xenditWebhook(Request $request)
    {
        $callbackToken = $request->header('x-callback-token') ?: $request->header('X-Callback-Token');
        $payload = $request->all();

        $orderId = $payload['external_id'] ?? null;
        if (!$orderId) {
            \Illuminate\Support\Facades\Log::warning('Xendit Webhook: missing external_id');
            return response()->json(['status' => 'failed', 'message' => 'Missing external_id'], 400);
        }

        $payment = Payment::where('external_id', $orderId)->first();
        if (!$payment) {
            \Illuminate\Support\Facades\Log::warning('Xendit Webhook: payment not found', ['external_id' => $orderId]);
            return response()->json(['status' => 'failed', 'message' => 'Payment not found'], 400);
        }

        // Load correct credentials for signature verification
        $user = $payment->user;
        $resellerSetting = null;
        if ($user && $user->reseller_id) {
            $resellerSetting = \App\Models\ResellerSetting::where('user_id', $user->reseller_id)->first();
        }

        $xendit = new XenditService($resellerSetting);
        if (!$xendit->verifyWebhookSignature($callbackToken)) {
            \Illuminate\Support\Facades\Log::warning('Xendit Webhook: callback token mismatch', ['external_id' => $orderId]);
            return response()->json(['status' => 'failed', 'message' => 'Invalid callback token'], 400);
        }

        $status = strtoupper($payload['status'] ?? 'PENDING');

        if ($status === 'PAID') {
            if ($payment->status !== 'paid') {
                $payment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'payment_method' => $payload['payment_method'] ?? ($payload['payment_channel'] ?? 'xendit'),
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'xendit_status' => $status,
                        'xendit_response' => $payload,
                    ]),
                ]);

                // check if it's a reseller modal payment
                if ($payment->parent_payment_id) {
                    $parent = $payment->parentPayment;
                    if ($parent && $parent->status !== 'paid') {
                        $parent->update([
                            'status' => 'paid',
                            'paid_at' => now(),
                            'payment_method' => $payment->payment_method ?: 'xendit',
                            'reviewed_by' => $payment->user_id, // reseller user id
                            'reviewed_at' => now(),
                            'admin_notes' => 'Pembayaran modal lunas via gateway online Xendit.',
                        ]);

                        // Activate subscription for the customer
                        if ($parent->greeting_card_id) {
                            $parent->greetingCard()->update(['is_active' => true]);
                            \App\Models\Subscription::create([
                                'user_id' => $parent->user_id,
                                'greeting_card_id' => $parent->greeting_card_id,
                                'plan_id' => $parent->plan_id,
                                'payment_id' => $parent->id,
                                'starts_at' => now(),
                                'expires_at' => $parent->plan ? now()->addDays($parent->plan->duration_days) : null,
                                'status' => 'active',
                            ]);
                        } else {
                            \App\Models\Subscription::create([
                                'user_id' => $parent->user_id,
                                'plan_id' => $parent->plan_id,
                                'invitation_id' => $parent->invitation_id,
                                'payment_id' => $parent->id,
                                'starts_at' => now(),
                                'expires_at' => $parent->plan ? now()->addDays($parent->plan->duration_days) : null,
                                'status' => 'active',
                            ]);
                        }
                    }
                    \Illuminate\Support\Facades\Log::info('Xendit Webhook: reseller modal payment successful', ['payment_id' => $payment->id]);
                    return response()->json(['success' => true]);
                }

                // Activate subscription for direct payment
                if ($payment->greeting_card_id) {
                    $payment->greetingCard()->update(['is_active' => true]);
                    \App\Models\Subscription::create([
                        'user_id' => $payment->user_id,
                        'greeting_card_id' => $payment->greeting_card_id,
                        'plan_id' => $payment->plan_id,
                        'payment_id' => $payment->id,
                        'starts_at' => now(),
                        'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                        'status' => 'active',
                    ]);
                } else {
                    \App\Models\Subscription::create([
                        'user_id' => $payment->user_id,
                        'plan_id' => $payment->plan_id,
                        'invitation_id' => $payment->invitation_id,
                        'payment_id' => $payment->id,
                        'starts_at' => now(),
                        'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                        'status' => 'active',
                    ]);
                }

                // Credit reseller wallet or debit cost
                if ($user && $user->reseller_id && $payment->plan_id) {
                    $paymentMode = $resellerSetting ? $resellerSetting->payment_mode : 'admin';
                    $basePrice = (float)$payment->plan->price;

                    if ($paymentMode === 'reseller_gateway') {
                        // Debit cost
                        \App\Models\ResellerWallet::debitCost(
                            $user->reseller_id,
                            $payment->id,
                            $basePrice,
                            "Biaya modal paket {$payment->plan->name} - Pelanggan {$user->name}"
                        );
                    } else {
                        // Credit profit
                        $paidAmount = (float)$payment->amount;
                        $profit = $paidAmount - $basePrice;

                        if ($profit > 0) {
                            \App\Models\ResellerWallet::creditProfit(
                                $user->reseller_id,
                                $payment->id,
                                $profit,
                                "Profit dari {$user->name} - Paket {$payment->plan->name}"
                            );
                        }
                    }
                }
            }
        } elseif (in_array($status, ['FAILED', 'EXPIRED'])) {
            $payment->update(['status' => 'failed']);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Handle SiappPay (pay.siapp.in) Webhook Callback
     */
    public function siapppayWebhook(Request $request)
    {
        $rawJson = $request->getContent();
        $payload = json_decode($rawJson, true) ?: $request->all();

        $orderId = $payload['order_id'] ?? ($payload['merchant_ref'] ?? ($payload['external_id'] ?? null));
        if (!$orderId) {
            \Illuminate\Support\Facades\Log::warning('SiappPay Webhook: missing order_id');
            return response()->json(['status' => 'failed', 'message' => 'Missing order_id'], 400);
        }

        $payment = Payment::where('external_id', $orderId)->orWhere('id', $orderId)->first();
        if (!$payment) {
            \Illuminate\Support\Facades\Log::warning('SiappPay Webhook: payment not found', ['order_id' => $orderId]);
            return response()->json(['status' => 'failed', 'message' => 'Payment not found'], 400);
        }

        $siappPay = new \App\Services\SiappPayService();
        $signature = $request->header('X-Callback-Signature') ?: $request->header('Callback-Signature');
        $incomingSecret = $request->header('X-Secret-Key') ?: ($payload['secret'] ?? null);

        if (!$siappPay->verifyWebhookSignature($rawJson, $signature, $incomingSecret)) {
            \Illuminate\Support\Facades\Log::warning('SiappPay Webhook: invalid signature or secret', ['order_id' => $orderId]);
            return response()->json(['status' => 'failed', 'message' => 'Invalid signature or secret'], 400);
        }

        $status = strtoupper($payload['status'] ?? 'UNPAID');

        if (in_array($status, ['PAID', 'SUCCESS', 'COMPLETED', 'SETTLEMENT'])) {
            if ($payment->status !== 'paid') {
                $payment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'siapppay_status' => $status,
                        'siapppay_response' => $payload,
                    ]),
                ]);

                // 1. Reseller Subscription Registration Payment
                if ($payment->metadata && isset($payment->metadata['type']) && $payment->metadata['type'] === 'reseller_subscription') {
                    $user = $payment->user;
                    if ($user) {
                        $durationDays = (int) ($payment->metadata['duration_days'] ?? 365);
                        $user->update([
                            'is_active' => true,
                            'reseller_expires_at' => now()->addDays($durationDays),
                        ]);
                        \App\Models\ResellerSetting::where('user_id', $user->id)->update([
                            'is_active' => true,
                        ]);
                    }
                    \Illuminate\Support\Facades\Log::info('SiappPay Webhook: reseller subscription payment completed', ['payment_id' => $payment->id]);
                    return response()->json(['success' => true]);
                }

                // 2. Reseller Modal Payment (parent_payment_id)
                if ($payment->parent_payment_id) {
                    $parent = $payment->parentPayment;
                    if ($parent && $parent->status !== 'paid') {
                        $parent->update([
                            'status' => 'paid',
                            'paid_at' => now(),
                            'payment_method' => $payment->payment_method ?: 'siapppay',
                            'reviewed_by' => $payment->user_id,
                            'reviewed_at' => now(),
                            'admin_notes' => 'Pembayaran modal lunas via gateway online QRIS pay.siapp.in.',
                        ]);

                        // Activate subscription for customer
                        if ($parent->greeting_card_id) {
                            $parent->greetingCard()->update(['is_active' => true]);
                            \App\Models\Subscription::create([
                                'user_id' => $parent->user_id,
                                'greeting_card_id' => $parent->greeting_card_id,
                                'plan_id' => $parent->plan_id,
                                'payment_id' => $parent->id,
                                'starts_at' => now(),
                                'expires_at' => $parent->plan ? now()->addDays($parent->plan->duration_days) : null,
                                'status' => 'active',
                            ]);
                        } else {
                            \App\Models\Subscription::create([
                                'user_id' => $parent->user_id,
                                'plan_id' => $parent->plan_id,
                                'invitation_id' => $parent->invitation_id,
                                'payment_id' => $parent->id,
                                'starts_at' => now(),
                                'expires_at' => $parent->plan ? now()->addDays($parent->plan->duration_days) : null,
                                'status' => 'active',
                            ]);
                        }
                    }
                    \Illuminate\Support\Facades\Log::info('SiappPay Webhook: reseller modal payment successful', ['payment_id' => $payment->id]);
                    return response()->json(['success' => true]);
                }

                // 3. Direct Customer Payment (Invitation / Greeting Card)
                if ($payment->greeting_card_id) {
                    $payment->greetingCard()->update(['is_active' => true]);
                    \App\Models\Subscription::create([
                        'user_id' => $payment->user_id,
                        'greeting_card_id' => $payment->greeting_card_id,
                        'plan_id' => $payment->plan_id,
                        'payment_id' => $payment->id,
                        'starts_at' => now(),
                        'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                        'status' => 'active',
                    ]);
                } elseif ($payment->invitation_id || $payment->plan_id) {
                    \App\Models\Subscription::create([
                        'user_id' => $payment->user_id,
                        'plan_id' => $payment->plan_id,
                        'invitation_id' => $payment->invitation_id,
                        'payment_id' => $payment->id,
                        'starts_at' => now(),
                        'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                        'status' => 'active',
                    ]);
                }

                // Credit profit to reseller wallet if client belongs to a reseller
                $user = $payment->user;
                if ($user && $user->reseller_id && $payment->plan_id) {
                    $resellerSetting = \App\Models\ResellerSetting::where('user_id', $user->reseller_id)->first();
                    $paymentMode = $resellerSetting ? $resellerSetting->payment_mode : 'admin';
                    $basePrice = (float) $payment->plan->price;

                    if ($paymentMode === 'reseller_gateway') {
                        \App\Models\ResellerWallet::debitCost(
                            $user->reseller_id,
                            $payment->id,
                            $basePrice,
                            "Biaya modal paket {$payment->plan->name} - Pelanggan {$user->name}"
                        );
                    } else {
                        $paidAmount = (float) $payment->amount;
                        $profit = $paidAmount - $basePrice;

                        if ($profit > 0) {
                            \App\Models\ResellerWallet::creditProfit(
                                $user->reseller_id,
                                $payment->id,
                                $profit,
                                "Profit dari {$user->name} - Paket {$payment->plan->name}"
                            );
                        }
                    }
                }

                // Trigger WA automatic notifications for Super Admin, Reseller, and Client
                try {
                    $waService = new \App\Services\WhatsAppService();
                    $waService->triggerPaymentNotifications($payment, $profit ?? 0);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('WA Payment Notify Error: ' . $e->getMessage());
                }
            }
        } elseif (in_array($status, ['FAILED', 'EXPIRED', 'CANCELLED'])) {
            $payment->update(['status' => 'failed']);
        }

        return response()->json(['success' => true]);
    }
}
