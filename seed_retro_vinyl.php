<?php
// Populate Mira's invitation with Retro Vinyl theme demo data
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Invitation;
use App\Models\BrideGroom;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\BankAccount;
use App\Models\InvitationSection;
use Database\Seeders\RetroVinylThemeSeeder;

echo "Running RetroVinylThemeSeeder...\n";
$seeder = new RetroVinylThemeSeeder();
$seeder->run();

$inv = Invitation::where('slug', 'mira-randi')->first();
if (!$inv) {
    echo "Invitation 'mira-randi' not found!\n";
    exit;
}

$theme = \App\Models\Theme::where('slug', 'retro-vinyl')->first();
if (!$theme) {
    echo "Retro Vinyl theme not found in database!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";
echo "Setting theme to 'retro-vinyl' (ID: {$theme->id})...\n";

// Update invitation details
$inv->update([
    'theme_id' => $theme->id,
    'title' => 'Pernikahan Fahmi & Intan',
    'cover_title' => 'Fahmi & Intan',
    'cover_image' => 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=1200&fit=crop',
    'opening_image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
    'opening_title' => 'Now Playing: Side A - The Wedding',
    'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami di bawah naungan berkah-Nya.\n\nKami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu di hari bahagia kami.",
    'closing_title' => 'Outro: Forever in Harmony',
    'closing_text' => "Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.\n\nSemoga Allah SWT membalas kebaikan kalian.",
    'enable_auto_scroll' => true,
]);

// Clear existing data
BrideGroom::where('invitation_id', $inv->id)->delete();
Event::where('invitation_id', $inv->id)->delete();
Gallery::where('invitation_id', $inv->id)->delete();
BankAccount::where('invitation_id', $inv->id)->delete();

// Mempelai Pria (Fahmi)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 1,
    'full_name' => 'Fahmi Hidayat',
    'nickname' => 'Fahmi',
    'father_name' => 'Gandi',
    'mother_name' => 'Nurjanah',
    'gender' => 'pria',
    'photo' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop',
    'bio' => 'Featured Artist - Side A - Groom',
    'instagram' => 'fahmi_hidayat',
    'child_order' => '1',
]);

// Mempelai Wanita (Intan)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 2,
    'full_name' => 'Intan Mutiara',
    'nickname' => 'Intan',
    'father_name' => 'Gandi',
    'mother_name' => 'Nurjanah',
    'gender' => 'wanita',
    'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop',
    'bio' => 'Featured Artist - Side B - Bride',
    'instagram' => 'intan_mutiara',
    'child_order' => '3',
]);

// Events
Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'akad',
    'event_name' => 'Akad Nikah',
    'event_date' => '2026-12-25',
    'start_time' => '08:00',
    'end_time' => '10:00',
    'timezone' => 'WIB',
    'venue_name' => 'Masjid Agung Al-Ittihad',
    'venue_address' => 'Jl. Raya Ciputat No. 15, Tangerang Selatan, Banten',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 1,
    'is_primary' => true,
]);

Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'resepsi',
    'event_name' => 'Resepsi Pernikahan',
    'event_date' => '2026-12-25',
    'start_time' => '11:00',
    'end_time' => '14:00',
    'timezone' => 'WIB',
    'venue_name' => 'Gedung Serbaguna Harmony',
    'venue_address' => 'Jl. Raya Ciputat No. 20, Tangerang Selatan, Banten',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 2,
    'is_primary' => false,
]);

// Gallery - use mockup photos from Unsplash
$galleryUrls = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop',
];

foreach ($galleryUrls as $i => $url) {
    Gallery::create([
        'invitation_id' => $inv->id,
        'image_url' => $url,
        'caption' => 'Foto ' . ($i + 1),
        'sort_order' => $i + 1,
    ]);
}

// Bank accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Bank Mandiri',
    'account_name' => 'Fahmi Hidayat',
    'account_number' => '1370012345678',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Bank BCA',
    'account_name' => 'Intan Mutiara',
    'account_number' => '8020123456',
    'sort_order' => 2,
]);

// Recreate default sections for invitation
$inv->sections()->delete();
foreach ($theme->sections as $ts) {
    $inv->sections()->create([
        'section_key' => $ts->section_key,
        'section_name' => $ts->section_name,
        'sort_order' => $ts->default_order,
        'is_visible' => $ts->is_default,
    ]);
}

echo "Invitation 'mira-randi' theme updated to 'retro-vinyl' successfully!\n";
