<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckInvitationLock
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        // Super Admins and Resellers (Admins) bypass the locking mechanism
        if ($user && ($user->isSuperAdmin() || $user->isAdmin())) {
            return $next($request);
        }

        $invitation = $user?->invitation;
        
        // If invitation exists and is locked H+3 after the primary event date
        if ($invitation && $invitation->isLocked()) {
            // Block all modifying requests (POST, PUT, PATCH, DELETE)
            if ($request->isMethod('POST') || $request->isMethod('PUT') || $request->isMethod('PATCH') || $request->isMethod('DELETE')) {
                $routeName = $request->route()?->getName();
                
                if ($routeName) {
                    $whitelisted = [
                        'dashboard.invitations.select',
                        'dashboard.invitations.create',
                        'profile.update',
                        'profile.destroy',
                        'payment.checkout',
                        'payment.manual.proof',
                        'payment.manual.cancel',
                    ];
                    
                    // Allow if route name is whitelisted or belongs to greeting-card features
                    if (in_array($routeName, $whitelisted) || str_starts_with($routeName, 'dashboard.greeting-card.')) {
                        return $next($request);
                    }
                }

                $errorMessage = 'Pemberitahuan: Masa aktif pengeditan undangan telah berakhir (kunci otomatis H+3 setelah acara selesai). Jika ada perubahan darurat, silakan hubungi Customer Service kami.';
                
                if ($request->header('X-Inertia')) {
                    return back()->withErrors([
                        'error' => $errorMessage
                    ])->with('error', $errorMessage);
                }

                if ($request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'error' => $errorMessage
                    ], 403);
                }
                
                return back()->withErrors([
                    'error' => $errorMessage
                ])->with('error', $errorMessage);
            }
        }

        return $next($request);
    }
}
