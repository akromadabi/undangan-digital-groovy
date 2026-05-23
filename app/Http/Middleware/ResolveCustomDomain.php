<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helpers\DomainHelper;

class ResolveCustomDomain
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
        $host = $request->getHost();
        $invitation = DomainHelper::resolveInvitation($host);

        if ($invitation) {
            $path = $request->getPathInfo(); // e.g. "/rsvp" or "/"

            if ($path === '/' || $path === '') {
                $newPath = "/u/{$invitation->slug}";
            } else {
                // If it already starts with /u/{slug}, don't rewrite it again
                if (str_starts_with($path, "/u/{$invitation->slug}")) {
                    $newPath = $path;
                } else {
                    $newPath = "/u/{$invitation->slug}" . $path;
                }
            }

            // Update request URI
            $request->server->set('REQUEST_URI', $newPath . ($request->getQueryString() ? '?' . $request->getQueryString() : ''));
            
            // Re-initialize the request to update the internal state
            $request->initialize(
                $request->query->all(),
                $request->request->all(),
                $request->attributes->all(),
                $request->cookies->all(),
                $request->files->all(),
                $request->server->all(),
                $request->getContent()
            );
        }

        return $next($request);
    }
}
