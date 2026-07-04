<?php

namespace App\Services;

use App\Models\GlobalSetting;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\WhatsappLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $apiUrl;
    protected string $apiToken;
    protected string $deviceId;
    protected string $senderNumber;

    public function __construct()
    {
        $this->apiUrl = rtrim(GlobalSetting::getValue('mpwav9_api_url', '') ?? '', '/');
        $this->apiToken = GlobalSetting::getValue('mpwav9_api_token', '') ?? '';
        $this->deviceId = GlobalSetting::getValue('mpwav9_device_id', '') ?? '';
        $this->senderNumber = GlobalSetting::getValue('mpwav9_sender_number', '') ?? '';
    }

    /**
     * Check if WA API is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiUrl) && !empty($this->apiToken);
    }

    /**
     * Send invitation message to a guest.
     */
    public function sendToGuest(Guest $guest, Invitation $invitation, string $template): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'WhatsApp API belum dikonfigurasi'];
        }

        if (empty($guest->phone)) {
            return ['success' => false, 'error' => 'Tamu tidak memiliki nomor HP'];
        }

        // Parse template variables
        $personalUrl = $invitation->getUrl($guest->slug);
        $message = str_replace(
            ['{nama}', '{link}'],
            [$guest->name, $personalUrl],
            $template
        );

        // Format phone number
        $phone = $this->formatPhone($guest->phone);

        // Create log entry first
        $log = WhatsappLog::create([
            'invitation_id' => $invitation->id,
            'guest_id' => $guest->id,
            'phone' => $phone,
            'message' => $message,
            'status' => 'pending',
        ]);

        try {
            $response = Http::post($this->apiUrl, [
                'api_key' => $this->apiToken,
                'sender' => $this->senderNumber,
                'number' => $phone,
                'message' => $message,
            ]);

            if ($response->successful()) {
                $log->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                    'response' => $response->json(),
                ]);

                // Mark guest as WA sent
                $guest->update(['wa_sent' => true, 'wa_sent_at' => now()]);

                return ['success' => true, 'log_id' => $log->id];
            }

            $log->update([
                'status' => 'failed',
                'response' => ['error' => $response->body(), 'status_code' => $response->status()],
            ]);

            Log::error('WA Send Failed', ['phone' => $phone, 'status' => $response->status(), 'body' => $response->body()]);
            return ['success' => false, 'error' => 'Gagal mengirim: ' . $response->status()];
        } catch (\Exception $e) {
            $log->update([
                'status' => 'failed',
                'response' => ['error' => $e->getMessage()],
            ]);

            Log::error('WA Send Exception', ['phone' => $phone, 'error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Send OTP code to a phone number.
     */
    public function sendOtp(string $phone, string $otp): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'WhatsApp API belum dikonfigurasi'];
        }

        $phone = $this->formatPhone($phone);
        $appName = config('app.name', 'Undangan Digital');
        $message = "*{$appName}*\n\nKode verifikasi Anda: *{$otp}*\n\nKode berlaku selama 5 menit.\nJangan bagikan kode ini kepada siapapun.";

        try {
            $response = Http::post($this->apiUrl, [
                'api_key' => $this->apiToken,
                'sender' => $this->senderNumber,
                'number' => $phone,
                'message' => $message,
            ]);

            if ($response->successful()) {
                return ['success' => true];
            }

            Log::error('WA OTP Send Failed', ['phone' => $phone, 'status' => $response->status(), 'body' => $response->body()]);
            return ['success' => false, 'error' => 'Gagal mengirim: HTTP ' . $response->status()];
        } catch (\Exception $e) {
            Log::error('WA OTP Exception', ['phone' => $phone, 'error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Send to multiple guests (batch).
     */
    public function sendBatch(array $guestIds, Invitation $invitation, string $template): array
    {
        $results = ['sent' => 0, 'failed' => 0, 'errors' => []];

        $guests = Guest::whereIn('id', $guestIds)
            ->where('invitation_id', $invitation->id)
            ->whereNotNull('phone')
            ->where('phone', '!=', '')
            ->get();

        foreach ($guests as $guest) {
            $result = $this->sendToGuest($guest, $invitation, $template);
            if ($result['success']) {
                $results['sent']++;
            } else {
                $results['failed']++;
                $results['errors'][] = $guest->name . ': ' . ($result['error'] ?? 'Unknown error');
            }

            // Delay between messages to avoid rate limiting
            usleep(500000); // 0.5 second
        }

        return $results;
    }

    /**
     * Send direct text message to a phone number.
     */
    public function sendMessage(string $phone, string $message): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'WhatsApp API belum dikonfigurasi'];
        }

        $formattedPhone = $this->formatPhone($phone);
        if (empty($formattedPhone)) {
            return ['success' => false, 'error' => 'Nomor WhatsApp tidak valid'];
        }

        try {
            $response = Http::post($this->apiUrl, [
                'api_key' => $this->apiToken,
                'sender' => $this->senderNumber,
                'number' => $formattedPhone,
                'message' => $message,
            ]);

            if ($response->successful()) {
                return ['success' => true];
            }

            Log::error('WA Direct Send Failed', ['phone' => $formattedPhone, 'status' => $response->status(), 'body' => $response->body()]);
            return ['success' => false, 'error' => 'Gagal mengirim: HTTP ' . $response->status()];
        } catch (\Exception $e) {
            Log::error('WA Direct Send Exception', ['phone' => $formattedPhone, 'error' => $e->getMessage()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Get Super Admin WhatsApp phone number.
     */
    public function getSuperAdminPhone(): string
    {
        $phone = GlobalSetting::getValue('footer_whatsapp') 
            ?: GlobalSetting::getValue('mpwav9_sender_number');

        if (!$phone) {
            $superAdmin = \App\Models\User::where('role', 'super_admin')->whereNotNull('phone')->first();
            if ($superAdmin) {
                $phone = $superAdmin->phone;
            }
        }

        return $phone ?: '6283132211830';
    }

    /**
     * Notify Super Admin about new reseller registration.
     */
    public function notifySuperAdminNewReseller(\App\Models\User $reseller, float $fee = 0): void
    {
        $adminPhone = $this->getSuperAdminPhone();
        $subdomain = $reseller->resellerSetting->subdomain ?? '-';
        $formattedFee = number_format($fee, 0, ',', '.');

        $message = "🔔 *PENDAFTARAN RESELLER BARU*\n\n"
            . "Ada pendaftaran Reseller baru di platform!\n\n"
            . "👤 *Nama:* {$reseller->name}\n"
            . "📧 *Email:* {$reseller->email}\n"
            . "📱 *No. WA:* {$reseller->phone}\n"
            . "🏪 *Subdomain:* {$subdomain}\n"
            . "💰 *Biaya Tahunan:* Rp {$formattedFee}\n\n"
            . "Status: Menunggu Pembayaran/Aktivasi.";

        $this->sendMessage($adminPhone, $message);
    }

    /**
     * Notify Super Admin about new end-user registration.
     */
    public function notifySuperAdminNewUser(\App\Models\User $user, ?\App\Models\User $reseller = null): void
    {
        $adminPhone = $this->getSuperAdminPhone();
        $resellerInfo = $reseller ? "{$reseller->name} (" . ($reseller->resellerSetting->brand_name ?? 'Reseller') . ")" : 'Platform Utama';

        $message = "👤 *PENDAFTARAN USER BARU*\n\n"
            . "Pengguna baru telah mendaftar:\n"
            . "• *Nama:* {$user->name}\n"
            . "• *No. WA:* {$user->phone}\n"
            . "• *Email:* {$user->email}\n"
            . "• *Tenant/Reseller:* {$resellerInfo}";

        $this->sendMessage($adminPhone, $message);
    }

    /**
     * Notify Super Admin about confirmed payment.
     */
    public function notifySuperAdminPayment(\App\Models\Payment $payment): void
    {
        $adminPhone = $this->getSuperAdminPhone();
        $formattedAmount = number_format($payment->amount, 0, ',', '.');
        $payerName = $payment->user->name ?? 'Pelanggan';

        $message = "💳 *PEMBAYARAN DITERIMA PLATFORM*\n\n"
            . "Pembayaran terverifikasi:\n"
            . "• *No. Order:* {$payment->external_id}\n"
            . "• *Pembayar:* {$payerName}\n"
            . "• *Nominal:* Rp {$formattedAmount}\n"
            . "• *Driver:* " . strtoupper($payment->payment_driver ?? 'Gateway') . "\n"
            . "• *Status:* LUNAS / VERIFIED";

        $this->sendMessage($adminPhone, $message);
    }

    /**
     * Send welcome & activation WA message to Reseller.
     */
    public function notifyResellerWelcome(\App\Models\User $reseller): void
    {
        if (empty($reseller->phone)) return;

        $appName = GlobalSetting::getValue('site_name', 'Undangan Digital');
        $brandName = $reseller->resellerSetting->brand_name ?? $reseller->name;
        $domain = $reseller->resellerSetting->subdomain ? ($reseller->resellerSetting->subdomain . '.' . config('app.domain', 'groovy.com')) : '-';
        $expires = $reseller->reseller_expires_at ? $reseller->reseller_expires_at->format('d M Y') : '1 Tahun';

        $message = "🎉 *SELAMAT! AKUN RESELLER AKTIF*\n\n"
            . "Halo *{$reseller->name}*, akun Reseller Anda di *{$appName}* telah *AKTIF*!\n\n"
            . "🏢 *Brand Anda:* {$brandName}\n"
            . "🌐 *Subdomain:* {$domain}\n"
            . "📅 *Masa Aktif s/d:* {$expires}\n\n"
            . "Anda sudah dapat mengakses Dashboard Reseller Anda untuk mengelola harga dan pelanggan. Terima kasih telah bergabung!";

        $this->sendMessage($reseller->phone, $message);
    }

    /**
     * Notify Reseller about new user registration under their brand.
     */
    public function notifyResellerNewUser(\App\Models\User $reseller, \App\Models\User $user): void
    {
        if (empty($reseller->phone)) return;

        $brandName = $reseller->resellerSetting->brand_name ?? 'Website Anda';

        $message = "🔔 *USER BARU MENDAFTAR*\n\n"
            . "Halo *{$reseller->name}*, ada pengguna baru yang mendaftar di *{$brandName}*:\n\n"
            . "• *Nama:* {$user->name}\n"
            . "• *No. WA:* {$user->phone}\n"
            . "• *Email:* {$user->email}\n\n"
            . "Silakan pantau pesanan pelanggan melalui Dashboard Reseller Anda.";

        $this->sendMessage($reseller->phone, $message);
    }

    /**
     * Notify Reseller when their client completes a payment.
     */
    public function notifyResellerUserPayment(\App\Models\User $reseller, \App\Models\Payment $payment, float $profit = 0): void
    {
        if (empty($reseller->phone)) return;

        $payerName = $payment->user->name ?? 'Pelanggan';
        $formattedAmount = number_format($payment->amount, 0, ',', '.');
        $formattedProfit = number_format($profit, 0, ',', '.');

        $message = "💰 *NOTIFIKASI PEMBAYARAN PELANGGAN*\n\n"
            . "Halo *{$reseller->name}*, pelanggan Anda telah menyelesaikan pembayaran tagihan:\n\n"
            . "• *Nama Pelanggan:* {$payerName}\n"
            . "• *No. Order:* {$payment->external_id}\n"
            . "• *Total Bayar:* Rp {$formattedAmount}\n"
            . "• *Profit Masuk Saldo:* Rp {$formattedProfit}\n\n"
            . "Saldo Dompet Reseller Anda telah otomatis bertambah! Terima kasih.";

        $this->sendMessage($reseller->phone, $message);
    }

    /**
     * Send payment notifications to Super Admin, Reseller, and Client.
     */
    public function triggerPaymentNotifications(\App\Models\Payment $payment, float $profit = 0): void
    {
        try {
            // 1. Notify Super Admin about the payment
            $this->notifySuperAdminPayment($payment);

            // 2. If this is a reseller annual subscription payment, notify Reseller welcome
            if ($payment->metadata && isset($payment->metadata['type']) && $payment->metadata['type'] === 'reseller_subscription') {
                $reseller = $payment->user;
                if ($reseller) {
                    $this->notifyResellerWelcome($reseller);
                }
                return;
            }

            // 3. If customer payment belongs to a reseller
            $payer = $payment->user;
            if ($payer && $payer->reseller_id) {
                $resellerUser = \App\Models\User::find($payer->reseller_id);
                if ($resellerUser) {
                    $this->notifyResellerUserPayment($resellerUser, $payment, $profit);
                }
            }

            // 4. Notify end-user client that payment is received & invitation active
            if ($payer && !empty($payer->phone)) {
                $formattedAmount = number_format($payment->amount, 0, ',', '.');
                $userMsg = "✅ *PEMBAYARAN DITERIMA & UNDANGAN AKTIF*\n\n"
                    . "Halo *{$payer->name}*, terima kasih! Pembayaran tagihan Anda telah *LUNAS*:\n\n"
                    . "• *No. Transaksi:* {$payment->external_id}\n"
                    . "• *Total Bayar:* Rp {$formattedAmount}\n"
                    . "• *Status Undangan:* *AKTIF*\n\n"
                    . "Silakan login untuk mengelola dan membagikan undangan digital Anda ke para tamu!";
                $this->sendMessage($payer->phone, $userMsg);
            }
        } catch (\Exception $e) {
            Log::error('WA Payment Notification Error: ' . $e->getMessage());
        }
    }

    /**
     * Notify Super Admin when a Reseller requests a wallet withdrawal.
     */
    public function notifySuperAdminWithdrawalRequest(\App\Models\Withdrawal $withdrawal): void
    {
        $adminPhone = $this->getSuperAdminPhone();
        $reseller = $withdrawal->reseller;
        $formattedAmount = number_format($withdrawal->amount, 0, ',', '.');

        $message = "💸 *PENGAJUAN PENCAIRAN SALDO RESELLER*\n\n"
            . "Reseller mengajukan pencairan dana:\n\n"
            . "• *Nama Reseller:* " . ($reseller->name ?? 'Reseller') . "\n"
            . "• *Nominal:* Rp {$formattedAmount}\n"
            . "• *Bank:* " . ($reseller->resellerSetting->bank_name ?? '-') . "\n"
            . "• *No. Rekening:* " . ($reseller->resellerSetting->bank_account ?? '-') . "\n"
            . "• *Atas Nama:* " . ($reseller->resellerSetting->bank_holder ?? '-') . "\n\n"
            . "Silakan proses verifikasi via Dashboard Super Admin.";

        $this->sendMessage($adminPhone, $message);
    }

    /**
     * Notify Reseller when withdrawal status is updated by Super Admin.
     */
    public function notifyResellerWithdrawalUpdated(\App\Models\Withdrawal $withdrawal): void
    {
        $reseller = $withdrawal->reseller;
        if (!$reseller || empty($reseller->phone)) return;

        $formattedAmount = number_format($withdrawal->amount, 0, ',', '.');
        $statusLabel = match($withdrawal->status) {
            'transferred' => 'TELAH DITRANSFER (LUNAS)',
            'approved' => 'DISETUJUI (Proses Transfer)',
            'rejected' => 'DITOLAK (Saldo Dikembalikan)',
            default => strtoupper($withdrawal->status),
        };

        $message = "🏦 *UPDATE PENCAIRAN SALDO DOMPET*\n\n"
            . "Halo *{$reseller->name}*, permohonan pencairan dana Anda telah diperbarui:\n\n"
            . "• *ID Pencairan:* #{$withdrawal->id}\n"
            . "• *Nominal:* Rp {$formattedAmount}\n"
            . "• *Status Baru:* *{$statusLabel}*\n"
            . ($withdrawal->admin_notes ? "• *Catatan:* {$withdrawal->admin_notes}\n" : "")
            . "\nTerima kasih telah bermitra bersama kami!";

        $this->sendMessage($reseller->phone, $message);
    }

    /**
     * Format Indonesian phone number.
     */
    public function formatPhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '08')) {
            $phone = '62' . substr($phone, 1);
        } elseif (str_starts_with($phone, '8')) {
            $phone = '62' . $phone;
        } elseif (str_starts_with($phone, '+62')) {
            $phone = substr($phone, 1);
        }

        return $phone;
    }
}
