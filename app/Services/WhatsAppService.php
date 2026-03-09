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
        $personalUrl = url('/u/' . $invitation->slug . '?to=' . $guest->slug);
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
     * Format Indonesian phone number.
     */
    protected function formatPhone(string $phone): string
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
