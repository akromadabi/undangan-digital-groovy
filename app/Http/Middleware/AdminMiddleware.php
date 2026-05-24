<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Allow only admin (reseller) role.
     * Super admin has separate middleware.
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return redirect()->route('dashboard');
        }

        // Domain Gating: Prevent reseller from accessing admin panel of another reseller's domain
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        if ($resellerSetting && $resellerSetting->user_id !== $request->user()->id) {
            abort(403, 'Akses ditolak. Anda tidak diperbolehkan mengelola reseller lain.');
        }

        return $next($request);
    }
}
