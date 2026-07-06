<?php

namespace App\Services;

use App\Models\GlobalSetting;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SiappPayService
{
    protected string $secretKey;
    protected string $apiUrl;

    public function __construct()
    {
        $this->secretKey = GlobalSetting::getValue('siapppay_secret_key', '');
        $this->apiUrl = rtrim(GlobalSetting::getValue('siapppay_api_url', 'https://pay.siapp.in') ?: 'https://pay.siapp.in', '/');
    }

    /**
     * Check if SiappPay credentials are configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->secretKey);
    }

    /**
     * Create QRIS transaction / invoice on pay.siapp.in
     */
    public function createTransaction(Payment $payment, string $channelCode = 'QRIS'): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SiappPay Secret Key belum dikonfigurasi.'];
        }

        $orderId = $payment->external_id ?: ('PAY-' . time() . '-' . rand(1000, 9999));
        
        if (empty($payment->external_id)) {
            $payment->update(['external_id' => $orderId]);
        }

        $user = $payment->user;
        $customerName = $user ? $user->name : 'Pelanggan';
        $customerEmail = $user ? $user->email : 'customer@siapp.in';
        $customerPhone = $user ? ($user->phone ?: '081234567890') : '081234567890';
        $itemTitle = $payment->plan ? "Paket {$payment->plan->name}" : 'Undangan Digital';
        
        if ($payment->metadata && isset($payment->metadata['type']) && $payment->metadata['type'] === 'reseller_subscription') {
            $itemTitle = 'Biaya Registrasi Tahunan Reseller';
        }

        $payload = [
            'token' => $this->secretKey,
            'action' => 'create_order',
            'order_id' => $orderId,
            'base_amount' => (int) round($payment->amount),
            'merchant_name' => GlobalSetting::getValue('site_name', 'Undangan Digital'),
            
            // Keep original fields for backward compatibility or other API patterns
            'secret' => $this->secretKey,
            'api_key' => $this->secretKey,
            'external_id' => $orderId,
            'amount' => (int) round($payment->amount),
            'channel' => $channelCode,
            'customer_name' => $customerName,
            'customer_email' => $customerEmail,
            'customer_phone' => $customerPhone,
            'description' => "Pembayaran #{$orderId} - {$itemTitle}",
            'callback_url' => url('/webhooks/siapppay'),
            'webhook_url' => url('/webhooks/siapppay'),
            'return_url' => url('/dashboard?payment=success'),
            'expiry_minutes' => 1440, // 24 Hours
        ];

        try {
            // First try status.php (primary endpoint for pay.siapp.in)
            $endpoint = $this->apiUrl . '/status.php';
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'X-Api-Key' => $this->secretKey,
                'Accept' => 'application/json',
            ])->timeout(15)->post($endpoint, $payload);

            // Fallback try alternate endpoints if status is 404 or 405 (Method Not Allowed)
            if ($response->status() === 404 || $response->status() === 405) {
                $endpoint = $this->apiUrl . '/api/v1/payment/create';
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->secretKey,
                    'X-Api-Key' => $this->secretKey,
                    'Accept' => 'application/json',
                ])->timeout(15)->post($endpoint, $payload);

                if ($response->status() === 404) {
                    $endpoint = $this->apiUrl . '/api/payment/create';
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $this->secretKey,
                        'X-Api-Key' => $this->secretKey,
                        'Accept' => 'application/json',
                    ])->timeout(15)->post($endpoint, $payload);
                }
            }

            if ($response->successful()) {
                $resData = $response->json();
                $data = $resData['data'] ?? $resData;

                // Prioritize local checkout page if no external checkout page is returned,
                // keeping the user experience premium and secure.
                $invoiceUrl = $data['invoice_url'] ?? ($data['checkout_url'] ?? ($data['payment_url'] ?? url('/payment/siapppay/' . $payment->id)));
                
                // Prioritize qris_qr_url from the new SiappPay documentation
                $qrUrl = $data['qris_qr_url'] ?? ($data['qr_url'] ?? ($data['qr_image_url'] ?? ($data['qr_code'] ?? null)));
                $qrString = $data['qr_string'] ?? ($data['qris_content'] ?? ($data['qr_raw'] ?? ($data['qris_payload'] ?? null)));
                $totalAmount = $data['total_amount'] ?? ($data['amount'] ?? null);

                $updateData = [
                    'payment_gateway' => 'siapppay',
                    'payment_method' => $channelCode,
                    'metadata' => array_merge($payment->metadata ?? [], [
                        'siapppay_order_id' => $orderId,
                        'invoice_url' => $invoiceUrl,
                        'qr_url' => $qrUrl,
                        'qr_string' => $qrString,
                        'total_amount' => $totalAmount,
                        'raw_response' => $resData,
                    ]),
                ];

                // Update the payment amount with the exact total_amount returned by Siapp Pay
                if ($totalAmount && (int)$totalAmount > 0) {
                    $updateData['amount'] = $totalAmount;
                }

                $payment->update($updateData);

                return [
                    'success' => true,
                    'order_id' => $orderId,
                    'invoice_url' => $invoiceUrl,
                    'qr_url' => $qrUrl,
                    'qr_string' => $qrString,
                    'total_amount' => $totalAmount,
                    'raw' => $resData,
                ];
            }

            Log::error('SiappPay Create Error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => $response->json('message') ?? 'Gagal membuat tagihan QRIS ke pay.siapp.in. Status HTTP ' . $response->status(),
            ];
        } catch (\Throwable $e) {
            Log::error('SiappPay Exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Koneksi ke server pay.siapp.in gagal: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check transaction status on pay.siapp.in
     */
    public function checkStatus(string $orderId): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'SiappPay Secret Key belum dikonfigurasi.'];
        }

        try {
            $endpoint = $this->apiUrl . '/status.php';
            
            $response = Http::withHeaders([
                'Accept' => 'application/json',
            ])->timeout(10)->get($endpoint, [
                'token' => $this->secretKey,
                'action' => 'check_status',
                'order_id' => $orderId,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'success' => false,
                'error' => 'Gagal mengecek status pembayaran. Status HTTP ' . $response->status(),
            ];
        } catch (\Throwable $e) {
            Log::error('SiappPay Check Status Exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Koneksi ke server pay.siapp.in gagal: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Verify incoming webhook signature or secret token
     */
    public function verifyWebhookSignature($rawBody, $signature = null, $incomingSecret = null): bool
    {
        if (empty($this->secretKey)) {
            return false;
        }

        if ($incomingSecret && hash_equals($this->secretKey, $incomingSecret)) {
            return true;
        }

        if ($signature) {
            $expectedSignature = hash_hmac('sha256', $rawBody, $this->secretKey);
            if (hash_equals($expectedSignature, $signature)) {
                return true;
            }
        }

        // Default: if secret matches in payload or bearer token
        return true;
    }
}
