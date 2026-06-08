<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Allow authenticated super admin to bypass subdomain check
        if ($request->user() && $request->user()->isSuperAdmin()) {
            return $next($request);
        }

        // Block access to super admin routes on reseller subdomains or custom domains
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        if ($resellerSetting) {
            abort(404);
        }

        if (!$request->user() || !$request->user()->isSuperAdmin()) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
