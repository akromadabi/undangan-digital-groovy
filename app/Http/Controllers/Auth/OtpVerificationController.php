<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    /**
     * Show the OTP verification page.
     */
    public function show(): Response|RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'phoneHint' => $user->phone ? $this->maskPhone($user->phone) : null,
        ]);
    }

    /**
     * Send OTP via WhatsApp or Email.
     */
    public function send(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        // Rate limit: don't allow resend if OTP still valid (< 1 minute old)
        if ($user->otp_expires_at && $user->otp_expires_at->gt(now()->addMinutes(4))) {
            return back()->with('error', 'Tunggu sebentar sebelum mengirim ulang kode OTP.');
        }

        if (empty($user->phone)) {
            return back()->with('error', 'Nomor WhatsApp belum terdaftar.');
        }

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store hashed OTP with 5 minute expiry
        $user->update([
            'otp_code' => Hash::make($otp),
            'otp_expires_at' => now()->addMinutes(5),
        ]);

        $wa = app(WhatsAppService::class);
        if (!$wa->isConfigured()) {
            return back()->with('error', 'Layanan WhatsApp belum dikonfigurasi oleh admin.');
        }

        $result = $wa->sendOtp($user->phone, $otp);
        if (!$result['success']) {
            return back()->with('error', 'Gagal mengirim OTP via WA: ' . ($result['error'] ?? 'Unknown error'));
        }

        return back()->with('success', 'Kode OTP berhasil dikirim ke WhatsApp Anda.');
    }

    /**
     * Verify the OTP code.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        $user = Auth::user();
        $user->refresh(); // Get fresh data from DB

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        // Check if OTP exists and hasn't expired
        if (!$user->otp_code || !$user->otp_expires_at) {
            return back()->with('error', 'Kode OTP belum dikirim. Silakan kirim OTP terlebih dahulu.');
        }

        if ($user->otp_expires_at->lt(now())) {
            return back()->with('error', 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.');
        }

        // Verify OTP
        if (!Hash::check($request->input('otp'), $user->otp_code)) {
            return back()->with('error', 'Kode OTP tidak valid. Silakan coba lagi.');
        }

        // Mark as verified and clear OTP
        $user->forceFill([
            'email_verified_at' => now(),
            'otp_code' => null,
            'otp_expires_at' => null,
        ])->save();

        \Log::info('OTP verified for user: ' . $user->id);

        // Redirect directly to wizard (new users) or dashboard (existing)
        if ($user->onboardingComplete()) {
            return redirect()->route('dashboard')->with('success', 'Akun berhasil diverifikasi!');
        }

        return redirect()->route('wizard.verification')->with('success', 'Akun berhasil diverifikasi!');
    }

    protected function maskPhone(string $phone): string
    {
        $len = strlen($phone);
        if ($len <= 4)
            return $phone;
        return substr($phone, 0, 4) . str_repeat('*', $len - 8) . substr($phone, -4);
    }
}
