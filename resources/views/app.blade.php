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

    // 1. Set default branding fallbacks from global settings
    $globalSiteName = \App\Models\GlobalSetting::where('setting_key', 'site_name')->value('setting_value');
    $globalSiteLogo = \App\Models\GlobalSetting::where('setting_key', 'site_logo')->value('setting_value');
    $globalSiteFavicon = \App\Models\GlobalSetting::where('setting_key', 'site_favicon')->value('setting_value');
    $globalMetaTitle = \App\Models\GlobalSetting::where('setting_key', 'meta_title')->value('setting_value');
    $globalMetaDescription = \App\Models\GlobalSetting::where('setting_key', 'meta_description')->value('setting_value');

    $brandName = $globalSiteName ?: 'Undangan Digital';
    $faviconUrl = $globalSiteFavicon ? asset('storage/' . $globalSiteFavicon) : ($globalSiteLogo ? asset('storage/' . $globalSiteLogo) : asset('favicon.ico'));
    $metaTitle = $globalMetaTitle ?: ($brandName . ' - Undangan Digital Premium');
    $metaDescription = $globalMetaDescription ?: 'Buat undangan pernikahan digital elegan dengan mudah, cepat, dan murah.';
    $metaImage = $globalSiteLogo ? asset('storage/' . $globalSiteLogo) : null;

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

    // Resolve active greeting card
    $greetingCard = null;
    if (count($pathParts) >= 2 && $pathParts[0] === 'card') {
        $cardSlug = $pathParts[1];
        $greetingCard = \App\Models\GreetingCard::where('custom_url', $cardSlug)->where('is_active', true)->first();
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
        } else {
            $faviconUrl = asset('favicon.ico');
        }
    }

    // 4. Resolve metadata for invitation, greeting card, or reseller pages
    if ($greetingCard) {
        $metaTitle = "Kartu Ucapan {$greetingCard->type_label} - {$greetingCard->title}";
        $metaDescription = "Kartu Ucapan {$greetingCard->type_label} spesial dari {$greetingCard->sender_name} untuk {$greetingCard->recipient_name}. Klik untuk melihat kartu ucapan selengkapnya.";
        $metaImage = route('greeting-card.og-image', $greetingCard->custom_url);
    } elseif ($invitation) {
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
            $coverImages = explode(',', $invitation->cover_image);
            $metaImage = trim($coverImages[0]);
            if (!str_starts_with($metaImage, 'http') && !str_starts_with($metaImage, '/')) {
                $metaImage = '/storage/' . $metaImage;
            }
        }
    } elseif ($resellerSetting) {
        $metaTitle = $resellerSetting->site_title ?: ($brandName . ' - Undangan Digital Premium');
        $metaDescription = $resellerSetting->site_motto ?: 'Buat undangan pernikahan digital elegan dengan mudah, cepat, dan gratis.';
        if ($resellerSetting->brand_logo) {
            $metaImage = '/storage/' . $resellerSetting->brand_logo;
        } else {
            $metaImage = null;
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
    <!-- Global JavaScript Error Visualizer -->
    <script>
        window.addEventListener('error', function(event) {
            showErrorVisualizer('Error: ' + event.message + '\nat ' + event.filename + ':' + event.lineno + ':' + event.colno + '\nStack: ' + (event.error ? event.error.stack : 'N/A'));
        });
        window.addEventListener('unhandledrejection', function(event) {
            showErrorVisualizer('Unhandled Promise Rejection: ' + event.reason + (event.reason && event.reason.stack ? '\nStack: ' + event.reason.stack : ''));
        });

        function showErrorVisualizer(message) {
            var container = document.getElementById('js-error-visualizer');
            if (container) {
                container.style.setProperty('display', 'flex', 'important');
                var preEl = document.getElementById('js-error-pre');
                if (preEl) {
                    preEl.innerText += message + '\n\n---------------------------------\n\n';
                }
            } else {
                console.error(message);
                setTimeout(function() { showErrorVisualizer(message); }, 100);
            }
        }
    </script>
</head>

<body class="font-sans antialiased">
    <!-- Global JavaScript Error Visualizer Container (Refactored to be a compact, non-blocking toast, hidden by default) -->
    <div id="js-error-visualizer" style="display: none !important; position: fixed; bottom: 20px; right: 20px; max-width: 420px; width: calc(100vw - 40px); z-index: 999999; padding: 16px; background: #fff5f5; color: #991b1b; border: 1.5px solid #feb2b2; border-radius: 16px; font-family: monospace; font-size: 11px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); max-height: 50vh; overflow: hidden; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-b: 1px solid #fed7d7; padding-bottom: 8px; margin-bottom: 6px;">
            <h3 style="margin: 0; color: #9b2c2c; font-size: 12px; font-weight: bold; display: flex; align-items: center; gap: 6px;">🔴 JavaScript Error Detected</h3>
            <button onclick="document.getElementById('js-error-visualizer').style.setProperty('display', 'none', 'important')" style="background: #fed7d7; border: none; color: #9b2c2c; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 6px; cursor: pointer; transition: background 0.2s;">Tutup</button>
        </div>
        <pre id="js-error-pre" style="margin: 0; overflow: auto; max-height: calc(50vh - 60px); white-space: pre-wrap; word-break: break-all; color: #4a5568; line-height: 1.4;"></pre>
    </div>
    @inertia
</body>

</html>