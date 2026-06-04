<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $email = $this->email;
        $password = $this->password;

        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller(request()->getHost());

        // Find candidate users by email, name (username), or phone
        $query = \App\Models\User::where(function ($q) use ($email) {
            $q->where('email', $email)
              ->orWhere('name', $email)
              ->orWhere('phone', $email);
        });

        if ($resellerSetting) {
            // Either a user client under this reseller, or the reseller admin account itself
            $query->where(function ($q) use ($resellerSetting) {
                $q->where(function ($sub) use ($resellerSetting) {
                    $sub->where('reseller_id', $resellerSetting->user_id)
                        ->whereIn('role', ['user', 'editor']);
                })->orWhere(function ($sub) use ($resellerSetting) {
                    $sub->where('id', $resellerSetting->user_id)
                        ->where('role', 'admin');
                });
            });
        } else {
            // Central login: Super Admin, or central client (reseller role 'admin' must log in via their own subdomain)
            $query->where(function ($q) {
                $q->where(function ($sub) {
                    $sub->whereNull('reseller_id')
                        ->whereIn('role', ['user', 'editor']);
                })->orWhere('role', 'super_admin');
            });
        }

        $users = $query->get();
        $authenticatedUser = null;

        foreach ($users as $user) {
            if (\Illuminate\Support\Facades\Hash::check($password, $user->password)) {
                $authenticatedUser = $user;
                break;
            }
        }

        if (!$authenticatedUser) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        if ($authenticatedUser->is_active === false) {
            RateLimiter::hit($this->throttleKey());

            $message = 'Akun Anda belum aktif atau telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk melakukan aktivasi.';
            if ($authenticatedUser->role === 'admin') {
                $message = 'Pendaftaran Anda sebagai partner reseller berhasil diterima. Akun Anda saat ini sedang menunggu aktivasi oleh Super Admin. Silakan hubungi admin utama untuk mempercepat proses aktivasi.';
            }

            throw ValidationException::withMessages([
                'email' => $message,
            ]);
        }

        Auth::login($authenticatedUser, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
