<?php

namespace App\Services;

use App\Models\GlobalSetting;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MidtransService
{
    protected string $clientKey;
    protected string $serverKey;
    protected string $mode;
    protected string $baseUrl;

    public function __construct()
    {
        $this->clientKey = GlobalSetting::getValue('midtrans_client_key', '');
        $this->serverKey = GlobalSetting::getValue('midtrans_server_key', '');
        $this->mode = GlobalSetting::getValue('midtrans_mode', 'sandbox');
        $this->baseUrl = $this->mode === 'production'
            ? 'https://app.midtrans.com/snap/v1'
            : 'https://app.sandbox.midtrans.com/snap/v1';
    }

    /**
     * Check if Midtrans is properly configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->serverKey);
    }

    /**
     * Create a Snap transaction/invoice.
     */
    public function createInvoice(Payment $payment, array $options = []): array
    {
        $externalId = 'INV-' . Str::upper(Str::random(8)) . '-' . $payment->id;
        $successUrl = url(GlobalSetting::getValue('midtrans_success_url', '/dashboard?payment=success'));
        $failureUrl = url(GlobalSetting::getValue('midtrans_failure_url', '/dashboard?payment=failed'));

        $description = 'Upgrade ke paket ' . ($payment->plan->name ?? 'Premium');
        $itemName = 'Paket ' . ($payment->plan->name ?? 'Premium');

        if ($payment->greeting_card_id) {
            $card = $payment->greetingCard;
            $cardName = $card ? $card->title : 'Kartu Ucapan';
            $description = 'Aktivasi ' . $cardName;
            $itemName = 'Aktivasi ' . $cardName;
        }

        $payload = [
            'transaction_details' => [
                'order_id' => $externalId,
                'gross_amount' => (int) $payment->amount,
            ],
            'item_details' => [
                [
                    'id' => $payment->plan_id ? 'PLAN-' . $payment->plan_id : 'CARD-' . $payment->greeting_card_id,
                    'price' => (int) $payment->amount,
                    'quantity' => 1,
                    'name' => Str::limit($itemName, 50),
                ]
            ],
            'customer_details' => [
                'first_name' => $payment->user->name,
                'email' => $payment->user->email,
                'phone' => $payment->user->phone ?? '',
            ],
            'callbacks' => [
                'finish' => $successUrl,
                'unfinish' => $failureUrl,
                'error' => $failureUrl,
            ]
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->withBasicAuth($this->serverKey, '')
              ->post($this->baseUrl . '/transactions', $payload);

            if ($response->successful()) {
                $data = $response->json();

                // Update payment record
                $payment->update([
                    'external_id' => $externalId,
                    'gateway_order_id' => $data['token'],
                    'gateway_transaction_id' => $data['token'],
                    'payment_gateway' => 'midtrans',
                    'metadata' => [
                        'invoice_url' => $data['redirect_url'],
                        'token' => $data['token'],
                    ],
                ]);

                return [
                    'success' => true,
                    'invoice_url' => $data['redirect_url'],
                    'token' => $data['token'],
                    'external_id' => $externalId,
                ];
            }

            Log::error('Midtrans Snap Error', ['status' => $response->status(), 'body' => $response->body()]);
            return ['success' => false, 'error' => 'Gagal membuat invoice Midtrans: ' . $response->body()];
        } catch (\Exception $e) {
            Log::error('Midtrans Exception', ['message' => $e->getMessage()]);
            return ['success' => false, 'error' => 'Terjadi kesalahan: ' . $e->getMessage()];
        }
    }

    /**
     * Handle webhook notification from Midtrans.
     */
    public function handleNotification(array $payload): bool
    {
        $orderId = $payload['order_id'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;

        if (!$orderId || !$statusCode || !$grossAmount || !$signatureKey) {
            Log::warning('Midtrans Webhook: missing required fields', $payload);
            return false;
        }

        // Verify signature
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $this->serverKey);

        if ($signatureKey !== $expectedSignature) {
            Log::warning('Midtrans Webhook: signature mismatch', [
                'received' => $signatureKey,
                'expected' => $expectedSignature,
                'payload' => $payload
            ]);
            return false;
        }

        $payment = Payment::where('external_id', $orderId)->first();

        if (!$payment) {
            Log::warning('Midtrans Webhook: payment not found', ['order_id' => $orderId]);
            return false;
        }

        // Check if transaction is successful
        $isPaid = false;
        if ($transactionStatus === 'settlement') {
            $isPaid = true;
        } elseif ($transactionStatus === 'capture') {
            $fraud = $payload['fraud_status'] ?? 'accept';
            if ($fraud === 'accept') {
                $isPaid = true;
            }
        }

        if ($isPaid) {
            $payment->update([
                'status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $payload['payment_type'] ?? 'midtrans',
                'metadata' => array_merge($payment->metadata ?? [], [
                    'midtrans_status' => $transactionStatus,
                    'midtrans_response' => $payload,
                ]),
            ]);

            if ($payment->greeting_card_id) {
                // Aktifkan kartu ucapan
                $payment->greetingCard()->update(['is_active' => true]);

                Subscription::create([
                    'user_id' => $payment->user_id,
                    'greeting_card_id' => $payment->greeting_card_id,
                    'plan_id' => $payment->plan_id,
                    'payment_id' => $payment->id,
                    'starts_at' => now(),
                    'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                    'status' => 'active',
                ]);
            } else {
                // Activate subscription
                Subscription::create([
                    'user_id' => $payment->user_id,
                    'plan_id' => $payment->plan_id,
                    'invitation_id' => $payment->invitation_id,
                    'payment_id' => $payment->id,
                    'starts_at' => now(),
                    'expires_at' => $payment->plan ? now()->addDays($payment->plan->duration_days) : null,
                    'status' => 'active',
                ]);
            }

            // Credit reseller wallet if user belongs to a reseller and it is a plan payment
            $user = $payment->user;
            if ($user && $user->reseller_id && $payment->plan_id) {
                $basePrice = (float)$payment->plan->price;
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

            Log::info('Midtrans Webhook: payment successful', ['payment_id' => $payment->id]);
            return true;
        }

        if (in_array($transactionStatus, ['deny', 'cancel', 'expire'])) {
            $payment->update(['status' => 'failed']);
            Log::info('Midtrans Webhook: payment failed/expired', ['payment_id' => $payment->id, 'status' => $transactionStatus]);
            return true;
        }

        if ($transactionStatus === 'pending') {
            $payment->update(['status' => 'pending']);
            Log::info('Midtrans Webhook: payment pending', ['payment_id' => $payment->id]);
            return true;
        }

        return false;
    }
}
