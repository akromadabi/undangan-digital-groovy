<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Invitation;
use App\Helpers\DomainHelper;

class ValidateInvitationReseller
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
        $slug = $request->route('slug');

        if ($slug) {
            // Ignore demo invitations
            if (str_starts_with($slug, 'demo-')) {
                return $next($request);
            }

            $invitation = Invitation::where('slug', $slug)->first();

            if (!$invitation) {
                abort(404);
            }

            $host = $request->getHost();

            // If accessed via the invitation's own custom domain, it is valid
            if ($host === $invitation->custom_domain) {
                return $next($request);
            }

            $centralHost = parse_url(config('app.url'), PHP_URL_HOST);
            $isCentral = ($host === $centralHost || $host === 'www.' . $centralHost);

            $resellerSetting = DomainHelper::resolveReseller($host);
            $owner = $invitation->user;
            $ownerResellerId = $owner ? $owner->reseller_id : null;

            if ($isCentral) {
                // On central domain, invitation must not belong to any reseller
                if ($ownerResellerId !== null) {
                    abort(404);
                }
            } else {
                // On any other domain (subdomain or custom reseller domain):
                // It must resolve to a valid reseller, and the invitation must belong to that reseller.
                if (!$resellerSetting || $ownerResellerId !== $resellerSetting->user_id) {
                    abort(404);
                }
            }
        }

        return $next($request);
    }
}
