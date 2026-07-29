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
            'invitation.reseller' => \App\Http\Middleware\ValidateInvitationReseller::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Illuminate\Http\Exceptions\PostTooLargeException $e, $request) {
            return back()->with('error', 'Ukuran file yang diunggah terlalu besar untuk server. Silakan pilih foto dengan ukuran lebih kecil.');
        });

        $exceptions->respond(function ($response, $exception, $request) {
            if ($response->getStatusCode() === 419) {
                return back()->with('error', 'Sesi halaman telah kedaluwarsa atau file terlalu besar. Silakan coba simpan kembali.');
            }
            return $response;
        });
    })->create();
