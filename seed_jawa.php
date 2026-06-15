<?php
// Populate Mira's invitation with comprehensive demo data
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
use App\Models\LoveStory;

$inv = Invitation::where('slug', 'mira-randi')->first();
if (!$inv) {
    echo "Invitation mira-randi not found!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";

// Update invitation details
$inv->update([
    'title' => 'Pernikahan Mira & Randi',
    'cover_title' => 'The Wedding Of',
    'cover_image' => null,
    'opening_title' => 'Bismillahirrahmanirrahim',
    'opening_ayat' => 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً',
    'opening_text' => "Assalamualaikum Wr. Wb.\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.\n\nKami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu.",
    'closing_title' => 'Wassalamualaikum Wr. Wb.',
    'closing_text' => "Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.\n\nSemoga Allah SWT membalas kebaikan kalian.",
]);

// Clear existing data
BrideGroom::where('invitation_id', $inv->id)->delete();
Event::where('invitation_id', $inv->id)->delete();
Gallery::where('invitation_id', $inv->id)->delete();
BankAccount::where('invitation_id', $inv->id)->delete();
LoveStory::where('invitation_id', $inv->id)->delete();

// Mempelai Wanita
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 1,
    'full_name' => 'Mira Rahayu',
    'nickname' => 'Mira',
    'father_name' => 'H. Ahmad Suryanto',
    'mother_name' => 'Hj. Siti Nurhaliza',
    'gender' => 'wanita',
    'photo' => '/themes/adat-jawa/demo/bride.jpg',
    'bio' => 'Putri bungsu yang tumbuh di lingkungan penuh kasih sayang',
    'instagram' => 'mirarahayu',
    'child_order' => 3,
]);

// Mempelai Pria
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 2,
    'full_name' => 'Randi Wijaya',
    'nickname' => 'Randi',
    'father_name' => 'H. Bambang Wijaya',
    'mother_name' => 'Hj. Dewi Lestari',
    'gender' => 'pria',
    'photo' => '/themes/adat-jawa/demo/groom.jpg',
    'bio' => 'Putra sulung yang bertekad membangun keluarga sakinah',
    'instagram' => 'randiwijaya',
    'child_order' => 1,
]);

// Events
Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'akad',
    'event_name' => 'Akad Nikah',
    'event_date' => '2026-04-15',
    'start_time' => '08:00',
    'end_time' => '10:00',
    'timezone' => 'WIB',
    'venue_name' => 'Masjid Agung Al-Ittihad',
    'venue_address' => 'Jl. Raya Ciputat No. 15, Tangerang Selatan, Banten',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 1,
    'is_primary' => true,
    'streaming_platform' => 'YouTube',
    'streaming_url' => 'https://youtube.com/live/demo',
    'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/demo']],
    'show_dress_code' => true,
    'dress_code_text' => 'Batik Modern / Busana Nasional Rapi',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#8B5A2B', '#CD853F', '#DEB887', '#F5F5DC']]],
]);

Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'resepsi',
    'event_name' => 'Resepsi',
    'event_date' => '2026-04-15',
    'start_time' => '11:00',
    'end_time' => '14:00',
    'timezone' => 'WIB',
    'venue_name' => 'Gedung Sasono Mulyo',
    'venue_address' => 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 2,
    'is_primary' => false,
    'show_dress_code' => true,
    'dress_code_text' => 'Batik Modern / Busana Nasional Rapi',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#8B5A2B', '#CD853F', '#DEB887', '#F5F5DC']]],
]);

// Gallery
$galleryUrls = [
    '/images/demo/korea-7-768x512.jpg',
    '/images/demo/korea-11-768x512.jpg',
    '/images/demo/korea-12-768x512.jpg',
    '/images/demo/korea-4-768x528.jpg',
];

foreach ($galleryUrls as $i => $url) {
    Gallery::create([
        'invitation_id' => $inv->id,
        'image_url' => $url,
        'caption' => 'Foto ' . ($i + 1),
        'sort_order' => $i + 1,
    ]);
}

// Love Stories
LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Pertemuan',
    'story_date' => '2023-11-20',
    'description' => 'Dipertemukan pertama kali di Yogyakarta, awal kisah indah perjalanan kami.',
    'sort_order' => 1,
]);

LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Membangun Komitmen',
    'story_date' => '2024-11-20',
    'description' => 'Niat suci untuk melangkah bersama membangun masa depan.',
    'sort_order' => 2,
]);

// Bank Accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Bank BNI',
    'account_name' => 'Mira Rahayu',
    'account_number' => '0987654321',
    'bank_logo' => '/themes/adat-jawa/demo/bni.png',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Bank Mandiri',
    'account_name' => 'Randi Wijaya',
    'account_number' => '1234567890',
    'sort_order' => 2,
]);

// Re-generate invitation sections for this invitation specifically
$theme = \App\Models\Theme::where('slug', 'adat-jawa')->first();
if ($theme) {
    $inv->update(['theme_id' => $theme->id]);
    $inv->sections()->delete();
    foreach ($theme->sections as $ts) {
        $inv->sections()->create([
            'section_key' => $ts->section_key,
            'section_name' => $ts->section_name,
            'sort_order' => $ts->default_order,
            'is_visible' => true,
        ]);
    }
}

echo "Done! Populated demo data for mira-randi\n";
