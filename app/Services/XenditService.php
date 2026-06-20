<?php

namespace App\Services;

use App\Models\GlobalSetting;
use App\Models\Payment;
use App\Models\ResellerSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class XenditService
{
    protected string $secretKey;
    protected string $webhookToken;
    protected string $successUrl;
    protected string $failureUrl;
    protected string $mode;
    protected string $baseUrl;

    public function __construct(?ResellerSetting $resellerSetting = null)
    {
        if ($resellerSetting && $resellerSetting->payment_mode === 'reseller_gateway' && $resellerSetting->reseller_gateway_type === 'xendit') {
            $settings = $resellerSetting->reseller_xendit_settings ?? [];
            $this->secretKey = $settings['secret_key'] ?? '';
            $this->webhookToken = $settings['webhook_token'] ?? '';
            $this->mode = $settings['mode'] ?? 'sandbox';
            $this->successUrl = url('/dashboard?payment=success');
            $this->failureUrl = url('/dashboard?payment=failed');
        } else {
            // Global credentials
            $this->secretKey = GlobalSetting::getValue('xendit_secret_key', '');
            $this->webhookToken = GlobalSetting::getValue('xendit_webhook_token', '');
            $this->mode = GlobalSetting::getValue('xendit_mode', 'sandbox');
            $this->successUrl = url(GlobalSetting::getValue('xendit_success_url', '/dashboard?payment=success'));
            $this->failureUrl = url(GlobalSetting::getValue('xendit_failure_url', '/dashboard?payment=failed'));
        }

        $this->baseUrl = 'https://api.xendit.co/v2/invoices';
    }

    /**
     * Check if Xendit is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->secretKey);
    }

    /**
     * Create an invoice/transaction on Xendit.
     */
    public function createInvoice(Payment $payment): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Kredensial Xendit belum dikonfigurasi.'];
        }

        $externalId = 'INV-' . Str::upper(Str::random(8)) . '-' . $payment->id;
        $amount = (int) $payment->amount;

        $description = 'Upgrade ke paket ' . ($payment->plan->name ?? 'Premium');
        $itemName = 'Paket ' . ($payment->plan->name ?? 'Premium');

        if ($payment->greeting_card_id) {
            $card = $payment->greetingCard;
            $cardName = $card ? $card->title : 'Kartu Ucapan';
            $description = 'Aktivasi ' . $cardName;
            $itemName = 'Aktivasi ' . $cardName;
        }

        $payload = [
            'external_id' => $externalId,
            'amount' => $amount,
            'payer_email' => $payment->user->email ?? 'customer@undangan.com',
            'description' => $description,
            'success_redirect_url' => $this->successUrl,
            'failure_redirect_url' => $this->failureUrl,
            'currency' => 'IDR',
            'customer' => [
                'given_names' => $payment->user->name,
                'email' => $payment->user->email ?? 'customer@undangan.com',
                'mobile_number' => $payment->user->phone ?? '',
            ],
            'items' => [
                [
                    'name' => Str::limit($itemName, 50),
                    'quantity' => 1,
                    'price' => $amount,
                ]
            ]
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->withBasicAuth($this->secretKey, '')
              ->post($this->baseUrl, $payload);

            if ($response->successful()) {
                $data = $response->json();

                if (empty($data['invoice_url'])) {
                    return ['success' => false, 'error' => 'API Xendit tidak mengembalikan URL pembayaran.'];
                }

                // Update payment record
                $payment->update([
                    'external_id' => $externalId,
                    'gateway_order_id' => $data['id'],
                    'gateway_transaction_id' => $data['id'],
                    'payment_gateway' => 'xendit',
                    'metadata' => [
                        'invoice_url' => $data['invoice_url'],
                        'invoice_id' => $data['id'],
                        'external_id' => $externalId,
                    ],
                ]);

                return [
                    'success' => true,
                    'invoice_url' => $data['invoice_url'],
                    'invoice_id' => $data['id'],
                    'external_id' => $externalId,
                ];
            }

            Log::error('Xendit Create Invoice Error', ['status' => $response->status(), 'body' => $response->body()]);
            $errorData = $response->json();
            return ['success' => false, 'error' => $errorData['message'] ?? 'Gagal membuat invoice Xendit.'];
        } catch (\Exception $e) {
            Log::error('Xendit Create Invoice Exception', ['message' => $e->getMessage()]);
            return ['success' => false, 'error' => 'Terjadi kesalahan Xendit: ' . $e->getMessage()];
        }
    }

    /**
     * Verify incoming webhook verification token.
     */
    public function verifyWebhookSignature(?string $callbackTokenHeader): bool
    {
        if (empty($this->webhookToken)) {
            // If no token is set in our DB, we skip verification
            return true;
        }

        return $callbackTokenHeader === $this->webhookToken;
    }
}
