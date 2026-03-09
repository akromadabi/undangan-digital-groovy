<?php

namespace App\Services;

use App\Models\GlobalSetting;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class XenditService
{
    protected string $secretKey;
    protected string $mode;
    protected string $baseUrl;

    public function __construct()
    {
        $this->secretKey = GlobalSetting::getValue('xendit_secret_key', '');
        $this->mode = GlobalSetting::getValue('xendit_mode', 'sandbox');
        $this->baseUrl = $this->mode === 'production'
            ? 'https://api.xendit.co'
            : 'https://api.xendit.co'; // Xendit uses same URL, sandbox via API key type
    }

    /**
     * Check if Xendit is properly configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->secretKey);
    }

    /**
     * Create an invoice for subscription payment.
     */
    public function createInvoice(Payment $payment, array $options = []): array
    {
        $externalId = 'INV-' . Str::upper(Str::random(8)) . '-' . $payment->id;
        $successUrl = url(GlobalSetting::getValue('xendit_success_url', '/dashboard?payment=success'));
        $failureUrl = url(GlobalSetting::getValue('xendit_failure_url', '/dashboard?payment=failed'));

        $payload = [
            'external_id' => $externalId,
            'amount' => (int) $payment->amount,
            'payer_email' => $payment->user->email,
            'description' => 'Upgrade ke paket ' . ($payment->plan->name ?? 'Premium'),
            'invoice_duration' => 86400, // 24 hours
            'success_redirect_url' => $successUrl,
            'failure_redirect_url' => $failureUrl,
            'currency' => 'IDR',
            'customer' => [
                'given_names' => $payment->user->name,
                'email' => $payment->user->email,
                'mobile_number' => $payment->user->phone ?? '',
            ],
            'items' => [
                [
                    'name' => 'Paket ' . ($payment->plan->name ?? 'Premium'),
                    'quantity' => 1,
                    'price' => (int) $payment->amount,
                ],
            ],
        ];

        try {
            $response = Http::withBasicAuth($this->secretKey, '')
                ->post($this->baseUrl . '/v2/invoices', $payload);

            if ($response->successful()) {
                $data = $response->json();

                // Update payment record
                $payment->update([
                    'external_id' => $externalId,
                    'gateway_order_id' => $data['id'],
                    'gateway_transaction_id' => $data['id'],
                    'payment_gateway' => 'xendit',
                    'metadata' => [
                        'invoice_url' => $data['invoice_url'],
                        'expiry_date' => $data['expiry_date'] ?? null,
                    ],
                ]);

                return [
                    'success' => true,
                    'invoice_url' => $data['invoice_url'],
                    'invoice_id' => $data['id'],
                    'external_id' => $externalId,
                ];
            }

            Log::error('Xendit Invoice Error', ['status' => $response->status(), 'body' => $response->body()]);
            return ['success' => false, 'error' => 'Gagal membuat invoice: ' . $response->body()];
        } catch (\Exception $e) {
            Log::error('Xendit Exception', ['message' => $e->getMessage()]);
            return ['success' => false, 'error' => 'Terjadi kesalahan: ' . $e->getMessage()];
        }
    }

    /**
     * Handle webhook callback from Xendit.
     */
    public function handleWebhook(array $payload): bool
    {
        $externalId = $payload['external_id'] ?? null;
        $status = $payload['status'] ?? null;

        if (!$externalId || !$status) {
            Log::warning('Xendit Webhook: missing external_id or status', $payload);
            return false;
        }

        $payment = Payment::where('external_id', $externalId)->first();

        if (!$payment) {
            Log::warning('Xendit Webhook: payment not found', ['external_id' => $externalId]);
            return false;
        }

        if ($status === 'PAID' || $status === 'SETTLED') {
            $payment->update([
                'status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $payload['payment_method'] ?? $payload['payment_channel'] ?? 'xendit',
                'metadata' => array_merge($payment->metadata ?? [], [
                    'xendit_status' => $status,
                    'paid_amount' => $payload['paid_amount'] ?? $payment->amount,
                ]),
            ]);

            // Activate subscription
            Subscription::create([
                'user_id' => $payment->user_id,
                'plan_id' => $payment->plan_id,
                'payment_id' => $payment->id,
                'starts_at' => now(),
                'expires_at' => now()->addDays($payment->plan->duration_days),
                'status' => 'active',
            ]);

            Log::info('Xendit Webhook: payment successful', ['payment_id' => $payment->id]);
            return true;
        }

        if ($status === 'EXPIRED') {
            $payment->update(['status' => 'expired']);
        }

        return false;
    }

    /**
     * Verify webhook token.
     */
    public function verifyWebhookToken(string $token): bool
    {
        $expectedToken = GlobalSetting::getValue('xendit_webhook_token', '');
        return !empty($expectedToken) && hash_equals($expectedToken, $token);
    }
}
