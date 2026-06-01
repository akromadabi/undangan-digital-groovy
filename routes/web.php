<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminFeatureController;
use App\Http\Controllers\Admin\AdminLiveTamuController;
use App\Http\Controllers\Admin\AdminMusicController;
use App\Http\Controllers\Admin\AdminPlanController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminThemeController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\ContentController;
use App\Http\Controllers\Dashboard\LiveTamuController;
use App\Http\Controllers\Dashboard\SettingsController;
use App\Http\Controllers\Dashboard\ThemeSettingsController;
use App\Http\Controllers\Dashboard\GreetingCardController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WizardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ═══════════════════════════════════════
// Landing Page
// ═══════════════════════════════════════
Route::get('/', function () {
    // Check if accessing via reseller subdomain or custom domain
    $resellerSetting = \App\Helpers\DomainHelper::resolveReseller(request()->getHost());
    if ($resellerSetting) {
        return app(\App\Http\Controllers\ResellerLandingPageController::class)->show($resellerSetting->subdomain);
    }

    $themes = \App\Models\Theme::where('is_active', true)
        ->orderBy('sort_order')
        ->get(['id', 'name', 'slug', 'thumbnail', 'preview_images', 'preview_template', 'preview_bg_style', 'preview_url', 'category', 'is_premium', 'base_likes', 'real_likes'])
        ->map(function ($theme) {
            $theme->preview_url = route('demo.theme', ['slug' => $theme->slug]);
            return $theme;
        });

    $recentInvitations = \App\Models\Invitation::where('is_active', true)
        ->where('is_private', false)
        ->whereNotNull('cover_image')
        ->with(['brideGrooms:id,invitation_id,full_name,nickname', 'theme:id,name,slug'])
        ->latest()
        ->take(6)
        ->get(['id', 'slug', 'cover_image', 'cover_title', 'cover_subtitle', 'theme_id', 'created_at']);

    $resellerCount = \App\Models\User::where('role', 'admin')->count() + 15;
    $invitationCount = \App\Models\Invitation::count() + 40;
    $adminWhatsapp = \App\Models\GlobalSetting::getValue('footer_whatsapp') ?: \App\Models\GlobalSetting::getValue('mpwav9_sender_number') ?: '6283132211830';
    $adminEmail = \App\Models\GlobalSetting::getValue('footer_email') ?: 'admin@groovy.com';
    $minModalCost = \App\Models\SubscriptionPlan::where('price', '>', 0)->min('price') ?: 15000;
    $subscriptionPlans = \App\Models\SubscriptionPlan::where('price', '>', 0)
        ->orderBy('sort_order')
        ->get(['id', 'name', 'slug', 'price', 'suggested_price']);

    $greetingCards = \App\Models\GreetingCardTemplate::where('is_active', true)
        ->select('id', 'name', 'slug', 'thumbnail', 'preview_images', 'preview_template', 'preview_bg_style', 'type', 'base_likes', 'sort_order')
        ->orderBy('sort_order')
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => false,
        'appName' => \App\Models\GlobalSetting::where('setting_key', 'site_name')->value('setting_value') ?: 'Undangan Digital',
        'themes' => $themes,
        'recentInvitations' => $recentInvitations,
        'resellerCount' => $resellerCount,
        'invitationCount' => $invitationCount,
        'adminWhatsapp' => $adminWhatsapp,
        'adminEmail' => $adminEmail,
        'minModalCost' => (float) $minModalCost,
        'subscriptionPlans' => $subscriptionPlans,
        'greetingCards' => $greetingCards,
        'greetingCardTypeOptions' => \App\Models\GreetingCardTemplate::$typeOptions,
    ]);
})->name('home');

// Reseller Landing Page (public)
Route::get('/r/{subdomain}', [\App\Http\Controllers\ResellerLandingPageController::class, 'show'])->name('reseller.landing');
Route::get('/r/{subdomain}/themes', [\App\Http\Controllers\ResellerLandingPageController::class, 'themes'])->name('reseller.themes');
Route::get('/r/{subdomain}/faq', [\App\Http\Controllers\ResellerLandingPageController::class, 'faq'])->name('reseller.faq');

Route::get('/katalog-tema', function () {
    $resellerSetting = \App\Helpers\DomainHelper::resolveReseller(request()->getHost());
    if ($resellerSetting) {
        return app(\App\Http\Controllers\ResellerLandingPageController::class)->themes($resellerSetting->subdomain);
    }

    // Domain utama: tampilkan katalog semua tema global
    $themes = \App\Models\Theme::where('is_active', true)
        ->select('id', 'name', 'slug', 'thumbnail', 'preview_images', 'preview_template', 'preview_bg_style', 'category', 'is_premium', 'preview_url', 'base_likes', 'real_likes')
        ->orderBy('sort_order')
        ->get()
        ->map(function ($theme) {
            $theme->preview_url = route('demo.theme', ['slug' => $theme->slug]);
            return $theme;
        });

    return Inertia::render('Themes', [
        'themes' => $themes,
        'appName' => \App\Models\GlobalSetting::where('setting_key', 'site_name')->value('setting_value') ?: 'Undangan Digital',
    ]);
})->name('themes');

// Katalog Kartu Ucapan (public)
Route::get('/katalog-kartu', function () {
    $resellerSetting = \App\Helpers\DomainHelper::resolveReseller(request()->getHost());
    if ($resellerSetting) {
        return app(\App\Http\Controllers\ResellerLandingPageController::class)->themes($resellerSetting->subdomain, 'kartu');
    }

    $templates = \App\Models\GreetingCardTemplate::where('is_active', true)
        ->withCount('greetingCards')
        ->orderBy('sort_order')
        ->orderBy('id')
        ->get();

    return Inertia::render('GreetingCardCatalog', [
        'templates' => $templates,
        'appName'   => \App\Models\GlobalSetting::where('setting_key', 'site_name')->value('setting_value') ?: 'Undangan Digital',
        'typeOptions' => \App\Models\GreetingCardTemplate::$typeOptions,
    ]);
})->name('greeting-card-catalog');

Route::get('/faq', function () {
    $resellerSetting = \App\Helpers\DomainHelper::resolveReseller(request()->getHost());
    if ($resellerSetting) {
        return app(\App\Http\Controllers\ResellerLandingPageController::class)->faq($resellerSetting->subdomain);
    }
    abort(404);
})->name('faq');

Route::post('/theme/{theme}/like', [ThemeSettingsController::class, 'toggleLike'])->name('theme.like');
Route::post('/greeting-card-template/{greetingCardTemplate}/like', [\App\Http\Controllers\Admin\AdminGreetingCardTemplateController::class, 'toggleLike'])->name('greeting-card-template.like');


// ═══════════════════════════════════════
// Public Invitation (no auth needed)
// ═══════════════════════════════════════
Route::get('/u/{slug}', [InvitationController::class, 'show'])->name('invitation.show');
Route::get('/u/{slug}/ar', [InvitationController::class, 'showAr'])->name('invitation.ar');
Route::post('/u/{slug}/rsvp', [InvitationController::class, 'submitRsvp'])->name('invitation.rsvp');
Route::post('/u/{slug}/wish', [InvitationController::class, 'submitWish'])->name('invitation.wish');
Route::post('/u/{slug}/opened', [InvitationController::class, 'markOpened'])->name('invitation.opened');
Route::get('/u/{slug}/checkin', [InvitationController::class, 'checkin'])->name('invitation.checkin');
Route::get('/demo/{slug}', [InvitationController::class, 'demo'])->name('demo.theme');

// Public Greeting Card Preview (no auth)
Route::get('/card/{slug}', [GreetingCardController::class, 'preview'])->name('greeting-card.preview');
Route::get('/card/{slug}/og-image', [GreetingCardController::class, 'ogImage'])->name('greeting-card.og-image');
Route::get('/demo-kartu/{slug}', [GreetingCardController::class, 'demo'])->name('greeting-card.demo');

// Wizard publik buat kartu ucapan (no auth required to VIEW)
Route::get('/buat-kartu', [GreetingCardController::class, 'wizard'])->name('greeting-card.wizard');
Route::get('/buat-kartu/{templateSlug}', [GreetingCardController::class, 'wizard'])->name('greeting-card.wizard.template');

// API: cek ketersediaan custom URL kartu
Route::get('/api/check-card-url', [GreetingCardController::class, 'checkUrl'])->name('greeting-card.check-url');


// Demo tema — hanya untuk user yang login (mencegah ekspos template ke publik)
Route::middleware(['auth'])->group(function () {
    Route::get('/demo-utary', function () {
        return Inertia::render('Invitation/utary/Index');
    });
    Route::get('/demo-aruna', function () {
        return Inertia::render('Invitation/aruna/Index');
    });
});

// Public Live Tamu fullscreen (no auth)
Route::get('/live/{slug}', [LiveTamuController::class, 'fullscreen'])->name('live.fullscreen');
Route::get('/live/{slug}/data', [LiveTamuController::class, 'publicData'])->name('live.data');

// ═══════════════════════════════════════
// OTP Verification
// ═══════════════════════════════════════
Route::middleware(['auth'])->group(function () {
    Route::get('/verify-otp', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'show'])->name('verification.otp.show');
    Route::post('/verify-otp/send', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'send'])->name('verification.otp.send');
    Route::post('/verify-otp/check', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'verify'])->name('verification.otp.verify');
});

// Subdomain Availability Check (Publicly accessible for guest resellers and logged-in admins)
Route::get('/api/check-subdomain', function (\Illuminate\Http\Request $request) {
    $subdomain = strtolower($request->query('subdomain'));
    
    if (empty($subdomain) || !preg_match('/^[a-z0-9-]+$/', $subdomain)) {
        return response()->json(['available' => false, 'message' => 'Subdomain tidak valid. Hanya huruf, angka, dan tanda hubung (-)']);
    }
    
    $reserved = ['admin', 'super-admin', 'www', 'api', 'assets', 'dashboard', 'reseller', 'customer', 'login', 'register', 'u', 'r'];
    if (in_array($subdomain, $reserved)) {
        return response()->json(['available' => false, 'message' => 'Subdomain tidak dapat digunakan (kata terpesan)']);
    }
    
    $query = \App\Models\ResellerSetting::where('subdomain', $subdomain);
    
    if ($excludeUserId = $request->query('exclude_user_id')) {
        $query->where('user_id', '!=', $excludeUserId);
    } elseif ($excludeResellerSettingId = $request->query('exclude_setting_id')) {
        $query->where('id', '!=', $excludeResellerSettingId);
    } elseif (auth()->check() && auth()->user()->role === 'admin') {
        $currentSettings = \App\Models\ResellerSetting::where('user_id', auth()->id())->first();
        if ($currentSettings) {
            $query->where('id', '!=', $currentSettings->id);
        }
    }
    
    $exists = $query->exists();
    
    return response()->json([
        'available' => !$exists,
        'message' => $exists ? 'Subdomain sudah digunakan' : 'Subdomain tersedia!'
    ]);
})->name('subdomain.check');

// ═══════════════════════════════════════
// Onboarding Wizard
// ═══════════════════════════════════════
Route::middleware(['auth', 'invitation.lock'])->prefix('wizard')->name('wizard.')->group(function () {
    Route::get('/verification', [WizardController::class, 'verification'])->name('verification');
    Route::post('/verification', [WizardController::class, 'completeVerification'])->name('verification.complete');

    Route::get('/link', [WizardController::class, 'link'])->name('link');
    Route::post('/link/check', [WizardController::class, 'checkLink'])->name('link.check');
    Route::post('/link', [WizardController::class, 'saveLink'])->name('link.save');

    Route::get('/profile', [WizardController::class, 'profile'])->name('profile');
    Route::post('/profile', [WizardController::class, 'saveProfile'])->name('profile.save');

    Route::get('/events', [WizardController::class, 'events'])->name('events');
    Route::post('/events', [WizardController::class, 'saveEvents'])->name('events.save');

    Route::get('/template', [WizardController::class, 'template'])->name('template');
    Route::post('/template', [WizardController::class, 'saveTemplate'])->name('template.save');
});

// ═══════════════════════════════════════
// User Dashboard
// ═══════════════════════════════════════
Route::middleware(['auth', 'onboarding', 'invitation.lock'])->group(function () {
    // Main Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/invitations', [DashboardController::class, 'list'])->name('dashboard.invitations');
    Route::post('/invitations/select/{invitation}', [DashboardController::class, 'select'])->name('dashboard.invitations.select');
    Route::post('/invitations/create', [DashboardController::class, 'create'])->name('dashboard.invitations.create');

    // Tutorial & Panduan
    Route::get('/tutorial', [DashboardController::class, 'tutorial'])->name('tutorial');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Content Management
    Route::prefix('content')->name('content.')->group(function () {
        // Merged Teks & Sambutan (Opening + Penutup)
        Route::get('/teks-sambutan', [ContentController::class, 'teksSambutan'])->name('teks-sambutan');

        // Keep old routes for backward compat (POST saves)
        Route::get('/opening', [ContentController::class, 'teksSambutan'])->name('opening');
        Route::post('/opening', [ContentController::class, 'saveOpening'])->name('opening.save');

        Route::get('/penutup', [ContentController::class, 'teksSambutan'])->name('penutup');
        Route::post('/penutup', [ContentController::class, 'savePenutup'])->name('penutup.save');

        Route::get('/mempelai', [ContentController::class, 'mempelai'])->name('mempelai');
        Route::post('/mempelai', [ContentController::class, 'saveMempelai'])->name('mempelai.save');

        Route::get('/acara', [ContentController::class, 'acara'])->name('acara');
        Route::post('/acara', [ContentController::class, 'saveAcara'])->name('acara.save');

        Route::get('/galeri', [ContentController::class, 'galeri'])->name('galeri');
        Route::post('/galeri', [ContentController::class, 'saveGaleri'])->name('galeri.save');
        Route::post('/galeri/mode', [ContentController::class, 'saveGalleryMode'])->name('galeri.mode');
        Route::post('/galeri/video', [ContentController::class, 'saveVideoSettings'])->name('galeri.video');
        Route::delete('/galeri/{id}', [ContentController::class, 'deleteGaleri'])->name('galeri.delete');

        Route::get('/kisah', [ContentController::class, 'kisah'])->middleware('feature:love_story')->name('kisah');
        Route::post('/kisah', [ContentController::class, 'saveKisah'])->middleware('feature:love_story')->name('kisah.save');

        Route::get('/bank', [ContentController::class, 'bank'])->middleware('feature:bank')->name('bank');
        Route::post('/bank', [ContentController::class, 'saveBank'])->middleware('feature:bank')->name('bank.save');

        Route::get('/guestbook', [ContentController::class, 'guestbook'])->name('guestbook');
    });

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/cover', [SettingsController::class, 'cover'])->name('cover');
        Route::post('/cover', [SettingsController::class, 'saveCover'])->name('cover.save');

        Route::get('/tamu', [SettingsController::class, 'tamu'])->name('tamu');
        Route::post('/tamu', [SettingsController::class, 'saveTamu'])->name('tamu.save');
        Route::post('/tamu/{id}', [SettingsController::class, 'updateTamu'])->name('tamu.update');
        Route::post('/tamu/import', [SettingsController::class, 'importTamu'])->name('tamu.import');
        Route::post('/tamu/import-excel', [SettingsController::class, 'importExcel'])->name('tamu.import.excel');
        Route::get('/tamu/template', [SettingsController::class, 'downloadTemplate'])->name('tamu.template');
        Route::delete('/tamu/{id}', [SettingsController::class, 'deleteTamu'])->name('tamu.delete');

        Route::get('/rsvp', [SettingsController::class, 'rsvp'])->name('rsvp');

        Route::get('/musik', [SettingsController::class, 'musik'])->middleware('feature:music')->name('musik');
        Route::post('/musik', [SettingsController::class, 'saveMusik'])->middleware('feature:music')->name('musik.save');
        Route::post('/musik/convert-youtube', [SettingsController::class, 'convertYoutube'])->middleware('feature:music')->name('musik.convert');
        Route::post('/musik/crop', [SettingsController::class, 'cropMusik'])->middleware('feature:music')->name('musik.crop');
        Route::post('/musik/compress', [SettingsController::class, 'compressMusik'])->middleware('feature:music')->name('musik.compress');

        Route::get('/hadiah', [SettingsController::class, 'hadiah'])->middleware('feature:gift')->name('hadiah');
        Route::get('/whatsapp', [SettingsController::class, 'whatsapp'])->middleware('feature:whatsapp')->name('whatsapp');
        Route::post('/whatsapp/send', [SettingsController::class, 'sendWhatsapp'])->middleware('feature:whatsapp')->name('whatsapp.send');
        Route::get('/ar', [SettingsController::class, 'ar'])->name('ar');
        Route::post('/ar/style', [SettingsController::class, 'saveArStyle'])->name('ar.style');
        // NFT Marker routes
        Route::get('/ar/nft/status', [\App\Http\Controllers\Dashboard\ArNftController::class, 'status'])->name('ar.nft.status');
        Route::post('/ar/nft/store', [\App\Http\Controllers\Dashboard\ArNftController::class, 'store'])->name('ar.nft.store');
        Route::delete('/ar/nft', [\App\Http\Controllers\Dashboard\ArNftController::class, 'destroy'])->name('ar.nft.destroy');
        
        // Instagram Filter settings
        Route::get('/instagram-filter', [\App\Http\Controllers\Dashboard\InstagramFilterController::class, 'index'])->middleware('feature:instagram_filter')->name('instagram-filter');
        Route::post('/instagram-filter/apply', [\App\Http\Controllers\Dashboard\InstagramFilterController::class, 'apply'])->middleware('feature:instagram_filter')->name('instagram-filter.apply');
    });

    // Theme Settings (Dynamic)
    Route::get('/theme', [ThemeSettingsController::class, 'index'])->name('theme.index');
    Route::post('/theme/layout', [ThemeSettingsController::class, 'updateLayout'])->name('theme.layout');
    Route::post('/theme/settings', [ThemeSettingsController::class, 'updateSettings'])->name('theme.settings.save');
    Route::post('/theme/change', [ThemeSettingsController::class, 'changeTheme'])->name('theme.change');
    Route::post('/theme/sections', [ThemeSettingsController::class, 'updateSections'])->name('theme.sections');
    Route::post('/theme/video-list', [ThemeSettingsController::class, 'saveVideoList'])->name('theme.video_list.save');

    // Media Library APIs
    Route::get('/theme/media', [\App\Http\Controllers\Dashboard\MediaAssetController::class, 'index'])->name('theme.media.index');
    Route::post('/theme/media/upload', [\App\Http\Controllers\Dashboard\MediaAssetController::class, 'upload'])->name('theme.media.upload');
    Route::delete('/theme/media/{id}', [\App\Http\Controllers\Dashboard\MediaAssetController::class, 'destroy'])->name('theme.media.destroy');
    Route::post('/theme/media/toggle-usage', [\App\Http\Controllers\Dashboard\MediaAssetController::class, 'toggleUsage'])->name('theme.media.toggle-usage');
    Route::post('/theme/media/save-position', [\App\Http\Controllers\Dashboard\MediaAssetController::class, 'savePosition'])->name('theme.media.save-position');
    Route::post('/theme/media/sync-gallery', [\App\Http\Controllers\Dashboard\MediaAssetController::class, 'syncGallery'])->name('theme.media.sync-gallery');



    // File Upload
    Route::post('/upload', [DashboardController::class, 'upload'])->name('upload');

    // Payment / Upgrade
    Route::get('/pricing', [PaymentController::class, 'pricing'])->name('payment.pricing');
    Route::post('/checkout', [PaymentController::class, 'checkout'])->name('payment.checkout');
    Route::get('/payment-history', [PaymentController::class, 'history'])->name('payment.history');
    Route::get('/payment/manual/{payment}', [PaymentController::class, 'showManualPayment'])->name('payment.manual.show');
    Route::post('/payment/manual/{payment}/proof', [PaymentController::class, 'uploadProof'])->name('payment.manual.proof');
    Route::post('/payment/manual/{payment}/cancel', [PaymentController::class, 'cancelPayment'])->name('payment.manual.cancel');

    // Live Tamu
    Route::get('/live-tamu', [LiveTamuController::class, 'index'])->middleware('feature:layar_sapa')->name('live-tamu');
    Route::post('/live-tamu/save', [LiveTamuController::class, 'saveSettings'])->middleware('feature:layar_sapa')->name('live-tamu.save');
    Route::get('/live-tamu/data', [LiveTamuController::class, 'data'])->middleware('feature:layar_sapa')->name('live-tamu.data');
    Route::get('/qr-scanner', [LiveTamuController::class, 'qrScanner'])->middleware('feature:layar_sapa')->name('qr-scanner');
});

// ═══════════════════════════════════════
// ═══════════════════════════════════════
// Greeting Card (Kartu Ucapan) — auth only, no onboarding/invitation required
// ═══════════════════════════════════════
Route::middleware(['auth'])->prefix('greeting-card')->name('greeting-card.')->group(function () {
    Route::get('/', [GreetingCardController::class, 'index'])->name('index');
    Route::get('/create', [GreetingCardController::class, 'create'])->name('create');
    Route::post('/', [GreetingCardController::class, 'store'])->name('store');
    Route::get('/{id}/edit', [GreetingCardController::class, 'edit'])->name('edit');
    Route::put('/{id}', [GreetingCardController::class, 'update'])->name('update');
    Route::delete('/{id}', [GreetingCardController::class, 'destroy'])->name('destroy');
});

// ═══════════════════════════════════════
// Admin Panel (Reseller + Super Admin)
// ═══════════════════════════════════════
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/themes', [AdminDashboardController::class, 'themes'])->name('themes');
    Route::get('/greeting-card-catalog', [AdminDashboardController::class, 'greetingCardCatalog'])->name('greeting-card-catalog');
    Route::post('/themes/{theme}/custom-preview', [AdminDashboardController::class, 'updateThemeCustomPreview'])->name('themes.custom-preview.update');
    Route::post('/greeting-card-catalog/{greetingCardTemplate}/custom-preview', [AdminDashboardController::class, 'updateGreetingCardCustomPreview'])->name('greeting-card-catalog.custom-preview.update');

    Route::get('/faq', [AdminDashboardController::class, 'faq'])->name('faq');
    Route::resource('users', AdminUserController::class)->only(['index', 'show']);
    Route::get('/live-tamu', [AdminLiveTamuController::class, 'index'])->name('live-tamu');
    Route::get('/live-tamu/data', [AdminLiveTamuController::class, 'data'])->name('live-tamu.data');

    // File Upload (admin)
    Route::post('/upload', [\App\Http\Controllers\Dashboard\DashboardController::class, 'upload'])->name('upload');

    // Reseller Settings (branding, landing page, domain)
    Route::get('/branding', [\App\Http\Controllers\Admin\ResellerSettingsController::class, 'branding'])->name('branding');
    Route::post('/branding', [\App\Http\Controllers\Admin\ResellerSettingsController::class, 'updateBranding'])->name('branding.update');
    Route::get('/landing-page', [\App\Http\Controllers\Admin\ResellerSettingsController::class, 'landingPage'])->name('landing-page');
    Route::post('/landing-page', [\App\Http\Controllers\Admin\ResellerSettingsController::class, 'updateLandingPage'])->name('landing-page.update');
    Route::get('/domain', [\App\Http\Controllers\Admin\ResellerSettingsController::class, 'domain'])->name('domain');
    Route::post('/domain', [\App\Http\Controllers\Admin\ResellerSettingsController::class, 'updateDomain'])->name('domain.update');

    // Reseller Revenue
    Route::get('/pendapatan', [\App\Http\Controllers\Admin\ResellerRevenueController::class, 'index'])->name('pendapatan');

    // Reseller Pricing (markup harga paket)
    Route::get('/pricing', [\App\Http\Controllers\Admin\ResellerPricingController::class, 'index'])->name('pricing');
    Route::post('/pricing', [\App\Http\Controllers\Admin\ResellerPricingController::class, 'update'])->name('pricing.update');

    // Reseller Withdrawal (pencairan)
    Route::get('/pencairan', [\App\Http\Controllers\Admin\ResellerWithdrawalController::class, 'index'])->name('pencairan');
    Route::post('/pencairan/request', [\App\Http\Controllers\Admin\ResellerWithdrawalController::class, 'requestWithdrawal'])->name('pencairan.request');
    Route::post('/pencairan/bank', [\App\Http\Controllers\Admin\ResellerWithdrawalController::class, 'updateBank'])->name('pencairan.bank');

    // Transactions Manual Review
    Route::get('/transactions', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{payment}', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'show'])->name('transactions.show');
    Route::post('/transactions/{payment}/approve', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'approve'])->name('transactions.approve');
    Route::post('/transactions/{payment}/reject', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'reject'])->name('transactions.reject');

    // Impersonation
    Route::post('/impersonate/user/{user}', [\App\Http\Controllers\Auth\ImpersonateController::class, 'impersonateUser'])->name('impersonate.user');
    Route::post('/impersonate/demo-user', [\App\Http\Controllers\Auth\ImpersonateController::class, 'switchToDemoUser'])->name('impersonate.demo-user');
});

// ═══════════════════════════════════════
// Super Admin Panel
// ═══════════════════════════════════════
Route::middleware(['auth', 'super_admin'])->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\SuperAdmin\SuperAdminDashboardController::class, 'index'])->name('dashboard');

    // Greeting Card Templates
    Route::post('/greeting-card-templates/make-demo', [\App\Http\Controllers\Admin\AdminGreetingCardTemplateController::class, 'makeDemo'])->name('greeting-card-templates.make-demo');
    Route::post('/greeting-card-templates/upload', [\App\Http\Controllers\Admin\AdminGreetingCardTemplateController::class, 'upload'])->name('greeting-card-templates.upload');
    Route::resource('greeting-card-templates', \App\Http\Controllers\Admin\AdminGreetingCardTemplateController::class);
    Route::post('/greeting-card-templates/{greetingCardTemplate}/toggle-active', [\App\Http\Controllers\Admin\AdminGreetingCardTemplateController::class, 'toggleActive'])->name('greeting-card-templates.toggle-active');

    // Static Previews
    Route::get('/static-previews', function () {
        return Inertia::render('SuperAdmin/StaticPreviews');
    })->name('static-previews.index');

    // Reseller Management
    Route::resource('resellers', \App\Http\Controllers\SuperAdmin\SuperAdminResellerController::class);
    Route::post('/resellers/{reseller}/prices', [\App\Http\Controllers\SuperAdmin\SuperAdminResellerController::class, 'updatePrices'])->name('resellers.prices');
    Route::post('/resellers/{reseller}/reset-password', [\App\Http\Controllers\SuperAdmin\SuperAdminResellerController::class, 'resetPassword'])->name('resellers.resetPassword');
    Route::post('/resellers/{reseller}/toggle-status', [\App\Http\Controllers\SuperAdmin\SuperAdminResellerController::class, 'toggleStatus'])->name('resellers.toggleStatus');

    // Global Management (themes, plans, music, quotes, settings, instagram filters)
    Route::post('plans/update-greeting-card-price', [AdminPlanController::class, 'updateGreetingCardPrice'])->name('plans.update-greeting-card-price');
    Route::resource('plans', AdminPlanController::class);
    Route::resource('instagram-filters', \App\Http\Controllers\SuperAdmin\SuperAdminInstagramFilterController::class);
    Route::post('/instagram-filters/{instagramFilter}/toggle-active', [\App\Http\Controllers\SuperAdmin\SuperAdminInstagramFilterController::class, 'toggleActive'])->name('instagram-filters.toggle-active');
    Route::post('themes/{theme}/toggle-active', [AdminThemeController::class, 'toggleActive'])->name('themes.toggle-active');
    Route::post('themes/categories/store', [AdminThemeController::class, 'storeCategory'])->name('themes.categories.store');
    Route::post('themes/categories/update', [AdminThemeController::class, 'updateCategory'])->name('themes.categories.update');
    Route::post('themes/categories/delete', [AdminThemeController::class, 'deleteCategory'])->name('themes.categories.delete');
    Route::resource('themes', AdminThemeController::class);
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

    // Music Library
    Route::get('/music', [AdminMusicController::class, 'index'])->name('music.index');
    Route::post('/music', [AdminMusicController::class, 'store'])->name('music.store');
    Route::put('/music/{id}', [AdminMusicController::class, 'update'])->name('music.update');
    Route::delete('/music/{id}', [AdminMusicController::class, 'destroy'])->name('music.destroy');
    Route::post('/music/{id}/toggle', [AdminMusicController::class, 'toggleActive'])->name('music.toggle');
    Route::post('/music/categories', [AdminMusicController::class, 'saveCategories'])->name('music.saveCategories');
    Route::post('/music/claim', [AdminMusicController::class, 'claimUserMusic'])->name('music.claim');
    Route::post('/music/convert-youtube', [AdminMusicController::class, 'convertYoutube'])->name('music.convert');
    Route::post('/music/crop', [AdminMusicController::class, 'cropMusic'])->name('music.crop');
    Route::post('/music/compress', [AdminMusicController::class, 'compressMusic'])->name('music.compress');

    // Quote Templates
    Route::get('/quotes', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'index'])->name('quotes.index');
    Route::post('/quotes', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'store'])->name('quotes.store');
    Route::put('/quotes/{id}', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'update'])->name('quotes.update');
    Route::delete('/quotes/{id}', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'destroy'])->name('quotes.destroy');

    // All Users (super admin can manage all)
    Route::resource('users', AdminUserController::class);
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.resetPassword');
    Route::post('/users/{user}/change-plan', [AdminUserController::class, 'changePlan'])->name('users.changePlan');
    Route::post('/users/{user}/extend-subscription', [AdminUserController::class, 'extendSubscription'])->name('users.extendSubscription');

    // File Upload
    Route::post('/upload', [\App\Http\Controllers\Dashboard\DashboardController::class, 'upload'])->name('upload');

    // Withdrawal Management
    Route::get('/withdrawals', [\App\Http\Controllers\SuperAdmin\WithdrawalManagementController::class, 'index'])->name('withdrawals.index');
    Route::post('/withdrawals/{id}', [\App\Http\Controllers\SuperAdmin\WithdrawalManagementController::class, 'updateStatus'])->name('withdrawals.update');

    // Activity Logs
    Route::get('/logs', [\App\Http\Controllers\SuperAdmin\SuperAdminActivityLogController::class, 'index'])->name('logs.index');
    Route::post('/logs/{id}/restore', [\App\Http\Controllers\SuperAdmin\SuperAdminActivityLogController::class, 'restore'])->name('logs.restore');

    // Transactions Manual Review
    Route::get('/transactions', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{payment}', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'show'])->name('transactions.show');
    Route::post('/transactions/{payment}/approve', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'approve'])->name('transactions.approve');
    Route::post('/transactions/{payment}/reject', [\App\Http\Controllers\Admin\AdminPaymentController::class, 'reject'])->name('transactions.reject');

    // Impersonation
    Route::post('/impersonate/user/{user}', [\App\Http\Controllers\Auth\ImpersonateController::class, 'impersonateUser'])->name('impersonate.user');
    Route::post('/impersonate/reseller/{user}', [\App\Http\Controllers\Auth\ImpersonateController::class, 'impersonateReseller'])->name('impersonate.reseller');
});

// ═══════════════════════════════════════
// Webhooks (no CSRF, no auth)
// ═══════════════════════════════════════
Route::post('/webhooks/xendit', [PaymentController::class, 'webhook'])->name('webhook.xendit')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

Route::middleware(['auth'])->group(function () {
    Route::post('/impersonate/leave', [\App\Http\Controllers\Auth\ImpersonateController::class, 'leave'])->name('impersonate.leave');
    Route::post('/impersonate/switch-role/{role}', [\App\Http\Controllers\Auth\ImpersonateController::class, 'switchRole'])->name('impersonate.switch-role');
    
    // Dashboard Real-time Notifications Data API
    Route::get('/admin/notifications-data', function (\Illuminate\Http\Request $request) {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['notifications' => [], 'count' => 0]);
        }

        $lastViewedAt = $request->query('last_viewed_at');
        $lastViewed = $lastViewedAt ? \Carbon\Carbon::parse($lastViewedAt) : null;

        $notifications = [];
        $count = 0;

        if ($user->isSuperAdmin()) {
            // 1. Pending Resellers (awaiting activation)
            $pendingResellers = \App\Models\User::where('role', 'admin')
                ->where('is_active', false)
                ->latest()
                ->get();
                
            foreach ($pendingResellers as $reseller) {
                $isUnread = $lastViewed ? ($reseller->created_at ? $reseller->created_at->gt($lastViewed) : true) : true;
                $notifications[] = [
                    'id' => 'reseller-pending-' . $reseller->id,
                    'type' => 'reseller_pending',
                    'title' => 'Pendaftaran Reseller Baru (Aktivasi)',
                    'message' => "Reseller '{$reseller->name}' mendaftar dan menunggu aktivasi Anda.",
                    'time' => $reseller->created_at ? $reseller->created_at->diffForHumans() : 'baru saja',
                    'action_url' => '/super-admin/resellers',
                    'is_unread' => $isUnread,
                    'badge' => 'Aktivasi'
                ];
                if ($isUnread) $count++;
            }

            // 2. Recently Registered Resellers (active, last 7 days)
            $recentResellers = \App\Models\User::where('role', 'admin')
                ->where('is_active', true)
                ->where('created_at', '>=', now()->subDays(7))
                ->latest()
                ->take(10)
                ->get();

            foreach ($recentResellers as $reseller) {
                $isUnread = $lastViewed ? ($reseller->created_at ? $reseller->created_at->gt($lastViewed) : true) : false;
                $notifications[] = [
                    'id' => 'reseller-recent-' . $reseller->id,
                    'type' => 'reseller_recent',
                    'title' => 'Reseller Baru Aktif',
                    'message' => "Reseller '{$reseller->name}' telah resmi bergabung dan aktif.",
                    'time' => $reseller->created_at ? $reseller->created_at->diffForHumans() : 'baru saja',
                    'action_url' => '/super-admin/resellers',
                    'is_unread' => $isUnread,
                    'badge' => 'Reseller Baru'
                ];
                if ($isUnread) $count++;
            }

            // 3. Recently Registered Users (last 7 days)
            $recentUsers = \App\Models\User::where('role', 'user')
                ->where('created_at', '>=', now()->subDays(7))
                ->latest()
                ->take(15)
                ->get();

            foreach ($recentUsers as $newUser) {
                $isUnread = $lastViewed ? ($newUser->created_at ? $newUser->created_at->gt($lastViewed) : true) : true;
                $notifications[] = [
                    'id' => 'user-recent-' . $newUser->id,
                    'type' => 'user_recent',
                    'title' => 'User Client Baru Terdaftar',
                    'message' => "User '{$newUser->name}' ({$newUser->email}) mendaftar di platform.",
                    'time' => $newUser->created_at ? $newUser->created_at->diffForHumans() : 'baru saja',
                    'action_url' => '/super-admin/users',
                    'is_unread' => $isUnread,
                    'badge' => 'User Baru'
                ];
                if ($isUnread) $count++;
            }
        } elseif ($user->isReseller()) {
            // 1. Recently Registered Users under this Reseller (last 7 days)
            $recentUsers = \App\Models\User::where('role', 'user')
                ->where('reseller_id', $user->id)
                ->where('created_at', '>=', now()->subDays(7))
                ->latest()
                ->take(15)
                ->get();

            foreach ($recentUsers as $newUser) {
                $isUnread = $lastViewed ? ($newUser->created_at ? $newUser->created_at->gt($lastViewed) : true) : true;
                $notifications[] = [
                    'id' => 'reseller-user-recent-' . $newUser->id,
                    'type' => 'reseller_user_recent',
                    'title' => 'Klien Baru Terdaftar',
                    'message' => "Klien baru '{$newUser->name}' ({$newUser->email}) mendaftar di bawah brand Anda.",
                    'time' => $newUser->created_at ? $newUser->created_at->diffForHumans() : 'baru saja',
                    'action_url' => '/admin/users',
                    'is_unread' => $isUnread,
                    'badge' => 'User Baru'
                ];
                if ($isUnread) $count++;
            }
        }

        return response()->json([
            'notifications' => $notifications,
            'count' => $count
        ]);
    })->name('admin.notifications-data');
});

require __DIR__ . '/auth.php';
