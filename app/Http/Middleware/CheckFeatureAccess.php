<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckFeatureAccess
{
    public function handle(Request $request, Closure $next, string $featureSlug)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->hasFeatureAccess($featureSlug)) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Fitur ini terkunci. Upgrade paket Anda untuk mengakses.',
                    'feature' => $featureSlug,
                    'upgrade_required' => true,
                ], 403);
            }

            return redirect()->route('dashboard')->with('error', 'Fitur ini terkunci. Upgrade paket Anda untuk mengakses fitur ini.');
        }

        return $next($request);
    }
}
