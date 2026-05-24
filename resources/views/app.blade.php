<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

@php
    use App\Helpers\DomainHelper;
    use App\Models\Invitation;
    use App\Models\ResellerSetting;

    $metaTitle = config('app.name', 'Laravel');
    $metaDescription = 'Buat undangan pernikahan digital elegan dengan mudah, cepat, dan murah.';
    $metaImage = null;
    $currentUrl = request()->url();

    // 1. Check if it's an invitation page: /u/{slug}
    $path = request()->path();
    $pathParts = explode('/', $path);
    
    // Check custom domain invitation
    $invitation = DomainHelper::resolveInvitation(request()->getHost());
    
    // Check slug-based invitation (/u/{slug})
    if (!$invitation && count($pathParts) >= 2 && $pathParts[0] === 'u') {
        $slug = $pathParts[1];
        $invitation = Invitation::where('slug', $slug)->where('is_active', true)->first();
    }

    if ($invitation) {
        $groom = $invitation->brideGrooms()->where('gender', 'pria')->first();
        $bride = $invitation->brideGrooms()->where('gender', 'wanita')->first();
        
        if ($groom && $bride) {
            $metaTitle = ($groom->nickname && $bride->nickname) 
                ? "Undangan Pernikahan {$groom->nickname} & {$bride->nickname}"
                : "Undangan Pernikahan " . ($invitation->cover_title ?: 'Groom & Bride');
        } else {
            $metaTitle = $invitation->cover_title ? "Undangan Pernikahan {$invitation->cover_title}" : $invitation->title;
        }
        
        $metaDescription = strip_tags($invitation->opening_text ?: $invitation->cover_subtitle ?: 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.');
        
        if ($invitation->cover_image) {
            $metaImage = $invitation->cover_image;
            if (!str_starts_with($metaImage, 'http') && !str_starts_with($metaImage, '/')) {
                $metaImage = '/storage/' . $metaImage;
            }
        }
    } else {
        // 2. Check if it's a reseller domain / landing page
        $resellerSetting = DomainHelper::resolveReseller(request()->getHost());
        
        // Check slug-based reseller route (/r/{subdomain})
        if (!$resellerSetting && count($pathParts) >= 2 && $pathParts[0] === 'r') {
            $subdomain = $pathParts[1];
            $resellerSetting = ResellerSetting::where('subdomain', $subdomain)->where('is_active', true)->first();
        }

        if ($resellerSetting) {
            $metaTitle = $resellerSetting->site_title ?: (($resellerSetting->brand_name ?: config('app.name')) . ' - Undangan Digital Premium');
            $metaDescription = $resellerSetting->site_motto ?: 'Buat undangan pernikahan digital elegan dengan mudah, cepat, dan gratis.';
            if ($resellerSetting->brand_logo) {
                $metaImage = '/storage/' . $resellerSetting->brand_logo;
            }
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