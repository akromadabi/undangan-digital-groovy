<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Dynamically fix the domain typo (siap.in -> siapp.in) in config
        $appUrl = config('app.url');
        if (str_contains($appUrl, 'siap.in') && !str_contains($appUrl, 'siapp.in')) {
            $appUrl = str_replace('siap.in', 'siapp.in', $appUrl);
            config(['app.url' => $appUrl]);
        }

        // Dynamically fix session domain typo in config
        $sessionDomain = config('session.domain');
        if ($sessionDomain && str_contains($sessionDomain, 'siap.in') && !str_contains($sessionDomain, 'siapp.in')) {
            $sessionDomain = str_replace('siap.in', 'siapp.in', $sessionDomain);
            config(['session.domain' => $sessionDomain]);
        }

        // Force HTTPS if APP_URL starts with https://
        if (str_starts_with($appUrl, 'https://') || env('FORCE_HTTPS', false)) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
