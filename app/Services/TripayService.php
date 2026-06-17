<?php

namespace App\Services;

use App\Models\GlobalSetting;
use App\Models\Payment;
use App\Models\ResellerSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TripayService
{
    protected string $apiKey;
    protected string $privateKey;
    protected string $merchantCode;
    protected string $mode;
    protected string $baseUrl;

    public function __construct(?ResellerSetting $resellerSetting = null)
    {
        if ($resellerSetting && $resellerSetting->payment_mode === 'reseller_gateway' && $resellerSetting->reseller_gateway_type === 'tripay') {
            $settings = $resellerSetting->reseller_tripay_settings ?? [];
            $this->apiKey = $settings['api_key'] ?? '';
            $this->privateKey = $settings['private_key'] ?? '';
            $this->merchantCode = $settings['merchant_code'] ?? '';
            $this->mode = $settings['mode'] ?? 'sandbox';
        } else {
            // Fallback to global setting (super admin keys if configured)
            $this->apiKey = GlobalSetting::getValue('tripay_api_key', '');
            $this->privateKey = GlobalSetting::getValue('tripay_private_key', '');
            $this->merchantCode = GlobalSetting::getValue('tripay_merchant_code', '');
            $this->mode = GlobalSetting::getValue('tripay_mode', 'sandbox');
        }

        $this->baseUrl = $this->mode === 'production'
            ? 'https://tripay.co.id/api'
            : 'https://tripay.co.id/api-sandbox';
    }

    /**
     * Check if TriPay is properly configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey) && !empty($this->privateKey) && !empty($this->merchantCode);
    }

    /**
     * Get active payment channels.
     */
    public function getPaymentChannels(): array
    {
        if (!$this->isConfigured()) {
            return [];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/merchant/payment-channel');

            if ($response->successful()) {
                $resData = $response->json();
                return $resData['data'] ?? [];
            }

            Log::error('Tripay Payment Channels Error', ['status' => $response->status(), 'body' => $response->body()]);
            return [];
        } catch (\Exception $e) {
            Log::error('Tripay Payment Channels Exception', ['message' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Create a closed payment transaction.
     */
    public function createTransaction(Payment $payment, string $methodCode): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Kredensial TriPay belum dikonfigurasi.'];
        }

        $externalId = 'INV-' . strtoupper(\Illuminate\Support\Str::random(8)) . '-' . $payment->id;
        $amount = (int) $payment->amount;

        // Generate signature: merchant_code + merchant_ref + amount
        $signature = hash_hmac('sha256', $this->merchantCode . $externalId . $amount, $this->privateKey);

        $description = 'Upgrade ke paket ' . ($payment->plan->name ?? 'Premium');
        $itemName = 'Paket ' . ($payment->plan->name ?? 'Premium');

        if ($payment->greeting_card_id) {
            $card = $payment->greetingCard;
            $cardName = $card ? $card->title : 'Kartu Ucapan';
            $description = 'Aktivasi ' . $cardName;
            $itemName = 'Aktivasi ' . $cardName;
        }

        // Reseller or standard domain redirect url
        $successUrl = url('/dashboard?payment=success');
        $failureUrl = url('/dashboard?payment=failed');

        $payload = [
            'method' => $methodCode,
            'merchant_ref' => $externalId,
            'amount' => $amount,
            'customer_name' => $payment->user->name,
            'customer_email' => $payment->user->email ?? 'customer@undangan.com',
            'customer_phone' => $payment->user->phone ?? '',
            'order_items' => [
                [
                    'sku' => $payment->plan_id ? 'PLAN-' . $payment->plan_id : 'CARD-' . $payment->greeting_card_id,
                    'name' => substr($itemName, 0, 50),
                    'price' => $amount,
                    'quantity' => 1,
                ]
            ],
            'callback_url' => route('webhook.tripay'),
            'return_url' => $successUrl,
            'expired_time' => time() + (24 * 3600), // 24 hours
            'signature' => $signature,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transaction/create', $payload);

            if ($response->successful()) {
                $resData = $response->json();
                $data = $resData['data'] ?? [];

                if (empty($data['checkout_url'])) {
                    return ['success' => false, 'error' => 'API TriPay tidak mengembalikan URL pembayaran.'];
                }

                // Update payment record
                $payment->update([
                    'external_id' => $externalId,
                    'gateway_order_id' => $data['reference'] ?? '',
                    'gateway_transaction_id' => $data['reference'] ?? '',
                    'payment_gateway' => 'tripay',
                    'payment_method' => $methodCode,
                    'metadata' => [
                        'invoice_url' => $data['checkout_url'],
                        'reference' => $data['reference'] ?? '',
                        'payment_name' => $data['payment_name'] ?? '',
                        'qr_url' => $data['qr_url'] ?? null,
                        'instructions' => $data['instructions'] ?? [],
                    ],
                ]);

                return [
                    'success' => true,
                    'invoice_url' => $data['checkout_url'],
                    'reference' => $data['reference'] ?? '',
                    'external_id' => $externalId,
                ];
            }

            Log::error('Tripay Transaction Create Error', ['status' => $response->status(), 'body' => $response->body()]);
            $errorBody = $response->json();
            return ['success' => false, 'error' => $errorBody['message'] ?? 'Gagal membuat invoice TriPay: ' . $response->body()];
        } catch (\Exception $e) {
            Log::error('Tripay Transaction Create Exception', ['message' => $e->getMessage()]);
            return ['success' => false, 'error' => 'Terjadi kesalahan: ' . $e->getMessage()];
        }
    }

    /**
     * Verify callback signature.
     */
    public function verifyWebhookSignature(string $rawBody, string $signatureHeader): bool
    {
        $localSignature = hash_hmac('sha256', $rawBody, $this->privateKey);
        return hash_equals($localSignature, $signatureHeader);
    }
}
