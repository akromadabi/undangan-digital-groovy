<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ResellerSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ImpersonateController extends Controller
{
    /**
     * Impersonate a regular user.
     * Accessible by Reseller (admin) or Super Admin.
     */
    public function impersonateUser(Request $request, User $user)
    {
        $currentUser = $request->user();

        // Security check
        if ($currentUser->isSuperAdmin()) {
            // Super Admin can impersonate any user
        } elseif ($currentUser->isReseller()) {
            // Reseller can only impersonate their own users
            if ($user->reseller_id !== $currentUser->id) {
                abort(403, 'Unauthorized action.');
            }
        } else {
            abort(403, 'Unauthorized action.');
        }

        // Prevent impersonating yourself
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'Tidak dapat melakukan impersonasi ke akun sendiri.');
        }

        // Store original user in session
        session([
            'impersonator_id' => $currentUser->id,
            'impersonator_role' => $currentUser->role,
        ]);

        // Login as the user
        auth()->login($user);

        return redirect()->route('dashboard')->with('success', "Sekarang Anda masuk sebagai {$user->name}.");
    }

    /**
     * Impersonate a reseller.
     * Accessible by Super Admin.
     */
    public function impersonateReseller(Request $request, User $user)
    {
        $currentUser = $request->user();

        if (!$currentUser->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$user->isReseller()) {
            return back()->with('error', 'User target bukan reseller.');
        }

        // Store original user in session
        session([
            'impersonator_id' => $currentUser->id,
            'impersonator_role' => $currentUser->role,
        ]);

        // Login as the reseller
        auth()->login($user);

        return redirect()->route('admin.dashboard')->with('success', "Sekarang Anda masuk sebagai Reseller {$user->name}.");
    }

    /**
     * Switch to the reseller's demo user account.
     * Automatically creates one if not exists.
     */
    public function switchToDemoUser(Request $request)
    {
        $reseller = $request->user();

        if (!$reseller->isReseller()) {
            abort(403, 'Unauthorized action.');
        }

        $settings = $reseller->resellerSettings;
        if (!$settings) {
            // Create default settings if missing
            $settings = ResellerSetting::create([
                'user_id' => $reseller->id,
                'brand_name' => $reseller->name,
                'subdomain' => Str::slug($reseller->name),
                'is_active' => true,
            ]);
        }

        $demoUser = null;
        if ($settings->demo_user_id) {
            $demoUser = User::find($settings->demo_user_id);
        }

        // If no demo user exists, create one!
        if (!$demoUser) {
            $subdomain = $settings->subdomain ?: Str::slug($reseller->name);
            $demoEmail = 'demo-' . $reseller->id . '@groovy-demo.com';

            // Check if email already used (unlikely)
            $existing = User::where('email', $demoEmail)->first();
            if ($existing) {
                $demoUser = $existing;
            } else {
                $demoUser = User::create([
                    'name' => 'Akun Demo ' . ($settings->brand_name ?: $reseller->name),
                    'email' => $demoEmail,
                    'role' => 'user',
                    'password' => Hash::make(Str::random(16)),
                    'reseller_id' => $reseller->id,
                    'is_active' => true,
                    'onboarding_step' => 6, // Skip wizard
                ]);
            }

            // Update settings
            $settings->update(['demo_user_id' => $demoUser->id]);

            // Create default premium subscription for demo user
            $premiumPlan = \App\Models\SubscriptionPlan::where('slug', 'platinum')->first()
                ?: \App\Models\SubscriptionPlan::where('slug', 'gold')->first()
                ?: \App\Models\SubscriptionPlan::orderBy('sort_order', 'desc')->first();

            if ($premiumPlan) {
                \App\Models\Subscription::updateOrCreate(
                    ['user_id' => $demoUser->id],
                    [
                        'plan_id' => $premiumPlan->id,
                        'status' => 'active',
                        'starts_at' => now(),
                        'expires_at' => null,
                    ]
                );
            }

            // Initialize default invitation data
            $invitation = \App\Models\Invitation::where('user_id', $demoUser->id)->first();
            if (!$invitation) {
                $defaultTheme = \App\Models\Theme::where('is_active', true)->first();

                $invitation = \App\Models\Invitation::create([
                    'user_id' => $demoUser->id,
                    'theme_id' => $defaultTheme ? $defaultTheme->id : 1,
                    'slug' => 'demo-' . $subdomain,
                    'title' => 'Pernikahan Rian & Amelia',
                    'opening_title' => 'Bismillahirrahmanirrahim',
                    'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
                    'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                    'opening_ayat_translation' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
                    'opening_ayat_source' => 'Ar-Rum: 21',
                    'closing_title' => 'Terima Kasih',
                    'closing_text' => "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
                    'cover_title' => 'Rian & Amelia',
                    'cover_subtitle' => 'Kami mengundang Anda untuk menghadiri pernikahan kami.',
                    'countdown_target_date' => now()->addDays(60)->toDateTimeString(),
                    'music_url' => '/audio/backsound.mp3',
                    'music_autoplay' => true,
                    'enable_rsvp' => true,
                    'enable_wishes' => true,
                    'show_countdown' => true,
                    'show_animations' => true,
                    'save_the_date_enabled' => true,
                    'enable_auto_scroll' => true,
                    'show_qr_code' => true,
                    'enable_qr' => true,
                    'particle_type' => 'gold-dust',
                    'cover_image' => '/images/demo/korea-11-768x512.jpg',
                    'is_active' => true,
                ]);

                // Bride & Groom
                \App\Models\BrideGroom::create([
                    'invitation_id' => $invitation->id,
                    'order_number' => 1,
                    'full_name' => 'Rian Wijaya',
                    'nickname' => 'Rian',
                    'father_name' => 'Bpk. H. Wijaya Kusuma',
                    'mother_name' => 'Ibu Hj. Ratna Sari',
                    'gender' => 'pria',
                    'child_order' => 'Pertama',
                    'photo' => '/images/demo/korea-8.jpg',
                ]);

                \App\Models\BrideGroom::create([
                    'invitation_id' => $invitation->id,
                    'order_number' => 2,
                    'full_name' => 'Amelia Putri',
                    'nickname' => 'Amelia',
                    'father_name' => 'Bpk. H. Ahmad Fauzi',
                    'mother_name' => 'Ibu Hj. Aminah',
                    'gender' => 'wanita',
                    'child_order' => 'Kedua',
                    'photo' => '/images/demo/korea-3.jpg',
                ]);

                // Events
                \App\Models\Event::create([
                    'invitation_id' => $invitation->id,
                    'event_type' => 'akad',
                    'event_name' => 'Akad Nikah',
                    'event_date' => now()->addDays(60)->toDateString(),
                    'start_time' => '09:00',
                    'end_time' => '10:00',
                    'timezone' => 'WIB',
                    'venue_name' => 'Masjid Raya Baiturrahman',
                    'venue_address' => 'Jl. Merdeka No. 1, Jakarta Pusat',
                    'gmaps_link' => 'https://maps.google.com',
                    'sort_order' => 0,
                    'is_primary' => true,
                ]);

                \App\Models\Event::create([
                    'invitation_id' => $invitation->id,
                    'event_type' => 'resepsi',
                    'event_name' => 'Resepsi Pernikahan',
                    'event_date' => now()->addDays(60)->toDateString(),
                    'start_time' => '11:00',
                    'end_time' => '14:00',
                    'timezone' => 'WIB',
                    'venue_name' => 'Gedung Serbaguna Indah',
                    'venue_address' => 'Jl. Kebahagiaan No. 10, Jakarta Pusat',
                    'gmaps_link' => 'https://maps.google.com',
                    'sort_order' => 1,
                    'is_primary' => false,
                ]);

                // Galleries
                \App\Models\Gallery::create([
                    'invitation_id' => $invitation->id,
                    'image_url' => '/images/demo/korea-7-768x512.jpg',
                    'caption' => 'Prewedding Day 1',
                    'sort_order' => 0,
                ]);
                \App\Models\Gallery::create([
                    'invitation_id' => $invitation->id,
                    'image_url' => '/images/demo/korea-11-768x512.jpg',
                    'caption' => 'Prewedding Day 2',
                    'sort_order' => 1,
                ]);
                \App\Models\Gallery::create([
                    'invitation_id' => $invitation->id,
                    'image_url' => '/images/demo/korea-12-768x512.jpg',
                    'caption' => 'Prewedding Day 3',
                    'sort_order' => 2,
                ]);

                // Bank Account
                \App\Models\BankAccount::create([
                    'invitation_id' => $invitation->id,
                    'bank_name' => 'BCA',
                    'account_name' => 'Rian Wijaya',
                    'account_number' => '1234567890',
                    'sort_order' => 0,
                ]);

                // Sections
                if ($defaultTheme) {
                    foreach ($defaultTheme->sections as $ts) {
                        \App\Models\InvitationSection::create([
                            'invitation_id' => $invitation->id,
                            'section_key' => $ts->section_key,
                            'section_name' => $ts->section_name,
                            'sort_order' => $ts->default_order,
                            'is_visible' => $ts->is_default,
                        ]);
                    }
                }
            }
        }

        // Store original reseller in session
        session([
            'impersonator_id' => $reseller->id,
            'impersonator_role' => $reseller->role,
        ]);

        // Login as the demo user
        auth()->login($demoUser);

        return redirect()->route('dashboard')->with('success', "Sekarang Anda mengelola Akun Demo.");
    }

    /**
     * Leave impersonation and return to original account.
     */
    public function leave(Request $request)
    {
        if (!session()->has('impersonator_id')) {
            return redirect('/');
        }

        $impersonatorId = session('impersonator_id');
        $impersonatorRole = session('impersonator_role');

        $impersonator = User::find($impersonatorId);

        if (!$impersonator) {
            session()->forget(['impersonator_id', 'impersonator_role']);
            auth()->logout();
            return redirect()->route('login')->with('error', 'Sesi asli tidak ditemukan.');
        }

        // Login back as impersonator
        auth()->login($impersonator);

        // Clear session keys
        session()->forget(['impersonator_id', 'impersonator_role']);

        if ($impersonatorRole === 'super_admin') {
            return redirect()->route('super-admin.dashboard')->with('success', 'Kembali ke panel Super Admin.');
        } elseif ($impersonatorRole === 'admin') {
            return redirect()->route('admin.dashboard')->with('success', 'Kembali ke panel Reseller.');
        }

        return redirect('/dashboard');
    }
}
