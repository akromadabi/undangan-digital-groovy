<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(prepend: [
            \App\Http\Middleware\ResolveCustomDomain::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'super_admin' => \App\Http\Middleware\SuperAdminMiddleware::class,
            'editor_or_super_admin' => \App\Http\Middleware\EditorOrSuperAdminMiddleware::class,
            'feature' => \App\Http\Middleware\CheckFeatureAccess::class,
            'onboarding' => \App\Http\Middleware\CheckOnboarding::class,
            'invitation.lock' => \App\Http\Middleware\CheckInvitationLock::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function ($response, $exception, $request) {
            if ($response->getStatusCode() === 419) {
                // If accessing admin/dashboard routes, redirect to login page with a friendly message
                if ($request->is('dashboard*') || $request->is('admin*') || $request->is('super-admin*') || $request->is('wizard*')) {
                    return redirect()->route('login')->with('message', 'Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan masuk kembali.');
                }
                // For public/invitation pages, redirect back to refresh the CSRF token automatically
                return back()->with('message', 'Sesi halaman telah kedaluwarsa. Silakan coba kembali.');
            }
            return $response;
        });
    })->create();
