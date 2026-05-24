<?php

namespace App\Helpers;

use App\Models\ResellerSetting;

class DomainHelper
{
    /**
     * Resolve ResellerSetting from the current host.
     *
     * @param string $host
     * @return ResellerSetting|null
     */
    public static function resolveReseller(string $host): ?ResellerSetting
    {
        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);

        if (!$centralHost) {
            return null;
        }

        // If host matches central domain exactly (or with www.), it is central, not reseller
        if ($host === $centralHost || $host === 'www.' . $centralHost) {
            return null;
        }

        $subdomain = null;

        // 1. Direct check: if host ends with .centralHost
        if (str_ends_with($host, '.' . $centralHost)) {
            $subdomain = str_replace('.' . $centralHost, '', $host);
        } else {
            // 2. Fallback check: in case centralHost has a prefix like 'u.siapp.in' but host is 'hello.u.siapp.in'
            // or vice versa (centralHost is 'siapp.in' and host is 'hello.u.siapp.in')
            $centralParts = explode('.', $centralHost);
            if (count($centralParts) >= 2) {
                // Get the root domain (e.g., 'siapp.in' from 'u.siapp.in' or 'siapp.in')
                $rootDomain = implode('.', array_slice($centralParts, -2));
                if (str_ends_with($host, '.' . $rootDomain)) {
                    $subdomain = str_replace('.' . $rootDomain, '', $host);
                }
            }
        }

        if ($subdomain) {
            // Extract the base subdomain part (e.g., 'hello' from 'hello.u')
            $subdomainParts = explode('.', $subdomain);
            $baseSubdomain = $subdomainParts[0];

            // Exclude system subdomains
            if (in_array($baseSubdomain, ['admin', 'superadmin', 'super-admin', 'www', 'api', 'localhost', 'u'])) {
                return null;
            }

            return ResellerSetting::where('subdomain', $baseSubdomain)
                ->where('is_active', true)
                ->first();
        }

        // If host is a custom domain (e.g., branddomain.com)
        return ResellerSetting::where('custom_domain', $host)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Resolve Invitation from the current host (for client custom domains).
     *
     * @param string $host
     * @return \App\Models\Invitation|null
     */
    public static function resolveInvitation(string $host): ?\App\Models\Invitation
    {
        $centralHost = parse_url(config('app.url'), PHP_URL_HOST);

        if (!$centralHost) {
            return null;
        }

        // If host matches central domain exactly (or with www.), it is central, not custom domain
        if ($host === $centralHost || $host === 'www.' . $centralHost) {
            return null;
        }

        // Subdomains of central domain are not custom domains for invitations
        if (str_ends_with($host, '.' . $centralHost)) {
            return null;
        }

        // Otherwise, check if it's a client custom domain
        return \App\Models\Invitation::where('custom_domain', $host)
            ->where('is_active', true)
            ->first();
    }
}
