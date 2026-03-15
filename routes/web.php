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
    $themes = \App\Models\Theme::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug', 'thumbnail', 'preview_url', 'category', 'is_premium']);

    $recentInvitations = \App\Models\Invitation::where('is_active', true)
        ->where('is_private', false)
        ->whereNotNull('cover_image')
        ->with(['brideGrooms:id,invitation_id,full_name,nickname', 'theme:id,name,slug'])
        ->latest()
        ->take(6)
        ->get(['id', 'slug', 'cover_image', 'cover_title', 'cover_subtitle', 'theme_id', 'created_at']);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'appName' => config('app.name'),
        'themes' => $themes,
        'recentInvitations' => $recentInvitations,
    ]);
})->name('home');

// Reseller Landing Page (public)
Route::get('/r/{subdomain}', [\App\Http\Controllers\ResellerLandingPageController::class, 'show'])->name('reseller.landing');

// ═══════════════════════════════════════
// Public Invitation (no auth needed)
// ═══════════════════════════════════════
Route::get('/u/{slug}', [InvitationController::class, 'show'])->name('invitation.show');
Route::post('/u/{slug}/rsvp', [InvitationController::class, 'submitRsvp'])->name('invitation.rsvp');
Route::post('/u/{slug}/wish', [InvitationController::class, 'submitWish'])->name('invitation.wish');
Route::post('/u/{slug}/opened', [InvitationController::class, 'markOpened'])->name('invitation.opened');
Route::get('/u/{slug}/checkin', [InvitationController::class, 'checkin'])->name('invitation.checkin');

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

// ═══════════════════════════════════════
// Onboarding Wizard
// ═══════════════════════════════════════
Route::middleware(['auth', 'verified'])->prefix('wizard')->name('wizard.')->group(function () {
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
Route::middleware(['auth', 'verified', 'onboarding'])->group(function () {
    // Main Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

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
        Route::post('/tamu/import', [SettingsController::class, 'importTamu'])->name('tamu.import');
        Route::post('/tamu/import-excel', [SettingsController::class, 'importExcel'])->name('tamu.import.excel');
        Route::get('/tamu/template', [SettingsController::class, 'downloadTemplate'])->name('tamu.template');
        Route::delete('/tamu/{id}', [SettingsController::class, 'deleteTamu'])->name('tamu.delete');

        Route::get('/rsvp', [SettingsController::class, 'rsvp'])->name('rsvp');

        Route::get('/musik', [SettingsController::class, 'musik'])->middleware('feature:music')->name('musik');
        Route::post('/musik', [SettingsController::class, 'saveMusik'])->middleware('feature:music')->name('musik.save');

        Route::get('/hadiah', [SettingsController::class, 'hadiah'])->middleware('feature:gift')->name('hadiah');

        Route::get('/whatsapp', [SettingsController::class, 'whatsapp'])->middleware('feature:whatsapp')->name('whatsapp');
        Route::post('/whatsapp/send', [SettingsController::class, 'sendWhatsapp'])->middleware('feature:whatsapp')->name('whatsapp.send');

        Route::get('/pengaturan', [SettingsController::class, 'pengaturan'])->name('pengaturan');
        Route::post('/pengaturan', [SettingsController::class, 'savePengaturan'])->name('pengaturan.save');
    });

    // Theme Settings (Dynamic)
    Route::get('/theme', [ThemeSettingsController::class, 'index'])->name('theme.index');
    Route::post('/theme/layout', [ThemeSettingsController::class, 'updateLayout'])->name('theme.layout');
    Route::post('/theme/change', [ThemeSettingsController::class, 'changeTheme'])->name('theme.change');
    Route::post('/theme/sections', [ThemeSettingsController::class, 'updateSections'])->name('theme.sections');

    // File Upload
    Route::post('/upload', [DashboardController::class, 'upload'])->name('upload');

    // Payment / Upgrade
    Route::get('/pricing', [PaymentController::class, 'pricing'])->name('payment.pricing');
    Route::post('/checkout', [PaymentController::class, 'checkout'])->name('payment.checkout');
    Route::get('/payment-history', [PaymentController::class, 'history'])->name('payment.history');

    // Live Tamu
    Route::get('/live-tamu', [LiveTamuController::class, 'index'])->name('live-tamu');
    Route::post('/live-tamu/save', [LiveTamuController::class, 'saveSettings'])->name('live-tamu.save');
    Route::get('/live-tamu/data', [LiveTamuController::class, 'data'])->name('live-tamu.data');
    Route::get('/qr-scanner', [LiveTamuController::class, 'qrScanner'])->name('qr-scanner');
});

// ═══════════════════════════════════════
// Admin Panel (Reseller + Super Admin)
// ═══════════════════════════════════════
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', AdminUserController::class);
    Route::get('/live-tamu', [AdminLiveTamuController::class, 'index'])->name('live-tamu');
    Route::get('/live-tamu/data', [AdminLiveTamuController::class, 'data'])->name('live-tamu.data');

    // File Upload (admin)
    Route::post('/upload', [\App\Http\Controllers\Dashboard\DashboardController::class, 'upload'])->name('upload');

    // User Management Actions
    Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.resetPassword');
    Route::post('/users/{user}/change-plan', [AdminUserController::class, 'changePlan'])->name('users.changePlan');
    Route::post('/users/{user}/extend-subscription', [AdminUserController::class, 'extendSubscription'])->name('users.extendSubscription');

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
});

// ═══════════════════════════════════════
// Super Admin Panel
// ═══════════════════════════════════════
Route::middleware(['auth', 'verified', 'super_admin'])->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\SuperAdmin\SuperAdminDashboardController::class, 'index'])->name('dashboard');

    // Reseller Management
    Route::resource('resellers', \App\Http\Controllers\SuperAdmin\SuperAdminResellerController::class);
    Route::post('/resellers/{reseller}/prices', [\App\Http\Controllers\SuperAdmin\SuperAdminResellerController::class, 'updatePrices'])->name('resellers.prices');

    // Global Management (themes, plans, music, quotes, settings)
    Route::resource('plans', AdminPlanController::class);
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

    // Quote Templates
    Route::get('/quotes', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'index'])->name('quotes.index');
    Route::post('/quotes', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'store'])->name('quotes.store');
    Route::put('/quotes/{id}', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'update'])->name('quotes.update');
    Route::delete('/quotes/{id}', [\App\Http\Controllers\Admin\AdminQuoteController::class, 'destroy'])->name('quotes.destroy');

    // All Users (super admin can see all)
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');

    // File Upload
    Route::post('/upload', [\App\Http\Controllers\Dashboard\DashboardController::class, 'upload'])->name('upload');

    // Withdrawal Management
    Route::get('/withdrawals', [\App\Http\Controllers\SuperAdmin\WithdrawalManagementController::class, 'index'])->name('withdrawals.index');
    Route::post('/withdrawals/{id}', [\App\Http\Controllers\SuperAdmin\WithdrawalManagementController::class, 'updateStatus'])->name('withdrawals.update');
});

// ═══════════════════════════════════════
// Webhooks (no CSRF, no auth)
// ═══════════════════════════════════════
Route::post('/webhooks/xendit', [PaymentController::class, 'webhook'])->name('webhook.xendit')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

require __DIR__ . '/auth.php';
