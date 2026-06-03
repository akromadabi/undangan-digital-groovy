<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EditorOrSuperAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Block access to admin routes on reseller subdomains or custom domains
        $resellerSetting = \App\Helpers\DomainHelper::resolveReseller($request->getHost());
        if ($resellerSetting) {
            abort(404);
        }

        $user = $request->user();
        if (!$user || (!$user->isSuperAdmin() && !$user->isEditor())) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
