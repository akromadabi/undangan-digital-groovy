<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

@php
    use App\Helpers\DomainHelper;
    use App\Models\Invitation;
    use App\Models\ResellerSetting;
    use App\Models\Guest;

    $path = request()->path();
    $pathParts = explode('/', $path);
    $currentUrl = request()->url();

    // 1. Set default branding fallbacks
    $brandName = 'Undangan Digital';
    $faviconUrl = asset('favicon.ico');
    $metaTitle = $brandName;
    $metaDescription = 'Buat undangan pernikahan digital elegan dengan mudah, cepat, dan murah.';
    $metaImage = null;

    // 2. Resolve active reseller setting
    $resellerSetting = null;

    // Resolve based on logged-in user
    if (auth()->check()) {
        $authUser = auth()->user();
        if ($authUser->role === 'admin') {
            $resellerSetting = $authUser->resellerSettings;
        } elseif ($authUser->role === 'user' && $authUser->reseller) {
            $resellerSetting = $authUser->reseller->resellerSettings;
        }
    }

    // Resolve based on domain or route slug
    if (!$resellerSetting) {
        $resellerSetting = DomainHelper::resolveReseller(request()->getHost());
        if (!$resellerSetting && count($pathParts) >= 2 && $pathParts[0] === 'r') {
            $subdomain = $pathParts[1];
            $resellerSetting = ResellerSetting::where('subdomain', $subdomain)->where('is_active', true)->first();
        }
    }

    // 3. Resolve active invitation
    $invitation = DomainHelper::resolveInvitation(request()->getHost());
    if (!$invitation && count($pathParts) >= 2 && $pathParts[0] === 'u') {
        $slug = $pathParts[1];
        $invitation = Invitation::where('slug', $slug)->where('is_active', true)->first();
    }

    // If invitation is active, resolve reseller branding from invitation owner
    if ($invitation) {
        $owner = $invitation->user;
        if ($owner) {
            if ($owner->role === 'admin') {
                $resellerSetting = $owner->resellerSettings;
            } elseif ($owner->reseller) {
                $resellerSetting = $owner->reseller->resellerSettings;
            }
        }
    }

    // Apply reseller setting brand details if resolved
    if ($resellerSetting) {
        $brandName = $resellerSetting->brand_name ?: $brandName;
        if ($resellerSetting->brand_logo) {
            $faviconUrl = asset('storage/' . $resellerSetting->brand_logo);
        }
    }

    // 4. Resolve metadata for invitation or reseller pages
    if ($invitation) {
        $groom = $invitation->brideGrooms()->where('gender', 'pria')->first();
        $bride = $invitation->brideGrooms()->where('gender', 'wanita')->first();
        
        if ($groom && $bride) {
            $names = "{$groom->nickname} & {$bride->nickname}";
        } else {
            $names = $invitation->cover_title ?: 'Groom & Bride';
        }

        // Customise title based on language
        $lang = $invitation->language ?: 'id';
        if ($lang === 'en') {
            $metaTitle = "Wedding Invitation of {$names}";
        } else {
            $metaTitle = "Undangan Pernikahan {$names}";
        }

        // Guest dynamic personalization
        $guestName = null;
        if (request()->has('to')) {
            $guestSlug = request()->query('to');
            $guest = Guest::where('invitation_id', $invitation->id)
                ->where('slug', $guestSlug)
                ->first();
            if ($guest) {
                $guestName = $guest->name;
            } else {
                $guestName = trim(str_replace(['-', '_'], ' ', urldecode($guestSlug)));
                $guestName = ucwords(strtolower($guestName));
            }
        }

        if ($lang === 'en') {
            if ($guestName) {
                $metaDescription = "Hello {$guestName}, you are cordially invited to our wedding. Click for more details.";
            } else {
                $metaDescription = strip_tags($invitation->opening_text ?: $invitation->cover_subtitle ?: "You are cordially invited to our wedding. Click for more details.");
            }
        } else {
            if ($guestName) {
                $metaDescription = "Hallo {$guestName}, Anda diundang ke acara pernikahan kami. Klik untuk info selengkapnya.";
            } else {
                $metaDescription = strip_tags($invitation->opening_text ?: $invitation->cover_subtitle ?: "Anda diundang ke acara pernikahan kami. Klik untuk info selengkapnya.");
            }
        }

        if ($invitation->cover_image) {
            $metaImage = $invitation->cover_image;
            if (!str_starts_with($metaImage, 'http') && !str_starts_with($metaImage, '/')) {
                $metaImage = '/storage/' . $metaImage;
            }
        }
    } elseif ($resellerSetting) {
        $metaTitle = $resellerSetting->site_title ?: ($brandName . ' - Undangan Digital Premium');
        $metaDescription = $resellerSetting->site_motto ?: 'Buat undangan pernikahan digital elegan dengan mudah, cepat, dan gratis.';
        if ($resellerSetting->brand_logo) {
            $metaImage = '/storage/' . $resellerSetting->brand_logo;
        }
    }

    // Convert relative image to absolute URL
    if ($metaImage && !str_starts_with($metaImage, 'http')) {
        $metaImage = asset($metaImage);
    }
@endphp
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Dynamic Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">

    <!-- Global App Name Script -->
    <script>
        window.appName = "{{ $brandName }}";
    </script>

    <title inertia>{{ $metaTitle }}</title>

    <!-- Meta Tags for Social Media Sharing (WA, Facebook, etc.) -->
    <meta name="description" content="{{ $metaDescription }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $currentUrl }}">
    <meta property="og:title" content="{{ $metaTitle }}">
    <meta property="og:description" content="{{ $metaDescription }}">
    @if($metaImage)
        <meta property="og:image" content="{{ $metaImage }}">
    @endif

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ $currentUrl }}">
    <meta name="twitter:title" content="{{ $metaTitle }}">
    <meta name="twitter:description" content="{{ $metaDescription }}">
    @if($metaImage)
        <meta name="twitter:image" content="{{ $metaImage }}">
    @endif

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>