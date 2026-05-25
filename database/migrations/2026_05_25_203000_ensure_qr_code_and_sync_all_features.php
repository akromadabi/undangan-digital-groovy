<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Feature;
use App\Models\SubscriptionPlan;
use App\Models\PlanFeatureAccess;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ensure all core features exist in the features table (with their correct default details)
        $featuresToEnsure = [
            // Core content features
            ['name' => 'Opening', 'slug' => 'opening', 'category' => 'content', 'icon' => 'MdOutlineWavingHand'],
            ['name' => 'Mempelai', 'slug' => 'bride_groom', 'category' => 'content', 'icon' => 'MdPeople'],
            ['name' => 'Acara', 'slug' => 'event', 'category' => 'content', 'icon' => 'MdEvent'],
            ['name' => 'Galeri', 'slug' => 'gallery', 'category' => 'content', 'icon' => 'MdPhotoLibrary'],
            ['name' => 'Kisah Cinta', 'slug' => 'love_story', 'category' => 'content', 'icon' => 'MdFavorite'],
            ['name' => 'Bank / E-Wallet', 'slug' => 'bank', 'category' => 'content', 'icon' => 'MdAccountBalance'],
            ['name' => 'Penutup', 'slug' => 'closing', 'category' => 'content', 'icon' => 'MdFlag'],
            ['name' => 'Guestbook', 'slug' => 'guestbook', 'category' => 'content', 'icon' => 'MdMenuBook'],
            ['name' => 'Save The Date', 'slug' => 'save_the_date', 'category' => 'content', 'icon' => 'MdCalendarToday'],
            ['name' => 'Turut Mengundang', 'slug' => 'turut_mengundang', 'category' => 'content', 'icon' => 'MdGroups'],
            ['name' => 'BrideGroom Detail', 'slug' => 'bride_groom_detail', 'category' => 'content', 'icon' => 'MdPersonPin'],

            // Core settings features
            ['name' => 'Cover', 'slug' => 'cover', 'category' => 'settings', 'icon' => 'MdImage'],
            ['name' => 'Tamu', 'slug' => 'guest', 'category' => 'settings', 'icon' => 'MdPersonAdd'],
            ['name' => 'RSVP', 'slug' => 'rsvp', 'category' => 'settings', 'icon' => 'MdFactCheck'],
            ['name' => 'Musik', 'slug' => 'music', 'category' => 'settings', 'icon' => 'MdMusicNote'],
            ['name' => 'Hadiah', 'slug' => 'gift', 'category' => 'settings', 'icon' => 'MdCardGiftcard'],
            ['name' => 'Kirim WhatsApp', 'slug' => 'whatsapp', 'category' => 'settings', 'icon' => 'MdWhatsapp'],
            ['name' => 'Template', 'slug' => 'template', 'category' => 'settings', 'icon' => 'MdPalette'],

            // Extra features (animasi, qr_code, layar_sapa, partikel, etc.)
            ['name' => 'Animasi', 'slug' => 'animasi', 'category' => 'settings', 'icon' => 'MdAutoAwesome', 'description' => 'Akses ke pengaturan animasi dan transisi tema'],
            ['name' => 'QR Code', 'slug' => 'qr_code', 'category' => 'other', 'icon' => 'MdQrCode', 'description' => 'Fitur QR code untuk tamu undangan'],
            ['name' => 'Jumlah Tamu', 'slug' => 'jumlah_tamu', 'category' => 'other', 'icon' => 'MdPeopleOutline', 'description' => 'Kontrol batas maksimum jumlah tamu undangan'],
            ['name' => 'Layar Sapa', 'slug' => 'layar_sapa', 'category' => 'settings', 'icon' => 'MdTv', 'description' => 'Layar sambutan sebelum masuk ke undangan'],
            ['name' => 'Partikel', 'slug' => 'partikel', 'category' => 'settings', 'icon' => 'MdOutlineSparkles', 'description' => 'Akses ke efek partikel melayang indah'],
            ['name' => 'Tampilkan Foto', 'slug' => 'show_photos', 'category' => 'settings', 'icon' => 'MdImage', 'description' => 'Akses ke fitur tampilkan foto/galeri tema'],
            ['name' => 'Tombol Auto Scroll', 'slug' => 'auto_scroll', 'category' => 'settings', 'icon' => 'MdMouse', 'description' => 'Akses ke fitur auto scroll halaman'],
        ];

        foreach ($featuresToEnsure as $f) {
            Feature::updateOrCreate(['slug' => $f['slug']], $f);
        }

        // 2. Map features to plans (Free, Silver, Gold, Platinum)
        $plans = SubscriptionPlan::all();
        $allFeatures = Feature::all();

        foreach ($plans as $plan) {
            foreach ($allFeatures as $feature) {
                $isEnabled = false;

                if (in_array($plan->slug, ['gold', 'platinum'])) {
                    // Gold and Platinum have access to all features
                    $isEnabled = true;
                } elseif ($plan->slug === 'silver') {
                    // Silver has access to most features except specific premium ones
                    $silverLocked = ['gift', 'bride_groom_detail', 'layar_sapa', 'qr_code', 'jumlah_tamu'];
                    $isEnabled = !in_array($feature->slug, $silverLocked);
                } elseif ($plan->slug === 'free') {
                    // Free has basic features only
                    $freeEnabled = ['opening', 'bride_groom', 'event', 'gallery', 'closing', 'guestbook', 'cover', 'guest', 'rsvp', 'template', 'show_photos'];
                    $isEnabled = in_array($feature->slug, $freeEnabled);
                }

                PlanFeatureAccess::updateOrCreate(
                    ['plan_id' => $plan->id, 'feature_id' => $feature->id],
                    ['is_enabled' => $isEnabled]
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not needed
    }
};
