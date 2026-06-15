<?php
// Populate Mira's invitation with Adat Minangkabau theme demo data
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
use Database\Seeders\AdatMinangThemeSeeder;

echo "Running AdatMinangThemeSeeder...\n";
$seeder = new AdatMinangThemeSeeder();
$seeder->run();

$inv = Invitation::where('slug', 'mira-randi')->first();
if (!$inv) {
    echo "Invitation 'mira-randi' not found!\n";
    exit;
}

$theme = \App\Models\Theme::where('slug', 'adat-minang')->first();
if (!$theme) {
    echo "Adat Minang theme not found in database!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";
echo "Setting theme to 'adat-minang' (ID: {$theme->id})...\n";

// Update invitation details
$inv->update([
    'theme_id' => $theme->id,
    'title' => 'Pernikahan Mira & Randi',
    'cover_title' => 'Mira & Randi',
    'cover_image' => null,
    'opening_image' => '/themes/adat-jawa/demo/bride.jpg', // Temporarily reuse Javanese demo photo or a generic one
    'opening_title' => 'Baralek Gadang',
    'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan syukuran pernikahan kami (Baralek Gadang) di bawah naungan berkah-Nya.\n\nKami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu di hari bahagia kami.",
    'closing_title' => 'TARIMO KASI',
    'closing_text' => "Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.\n\nSemoga Allah SWT membalas kebaikan kalian.",
    'enable_auto_scroll' => true,
    'music_url' => '/audio/backsound.mp3',
]);

// Clear existing data
BrideGroom::where('invitation_id', $inv->id)->delete();
Event::where('invitation_id', $inv->id)->delete();
Gallery::where('invitation_id', $inv->id)->delete();
BankAccount::where('invitation_id', $inv->id)->delete();
LoveStory::where('invitation_id', $inv->id)->delete();

// Mempelai Pria (Randi)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 1,
    'full_name' => 'Randi Wijaya, S.T.',
    'nickname' => 'Randi',
    'father_name' => 'H. Bambang Wijaya',
    'mother_name' => 'Hj. Dewi Lestari',
    'gender' => 'pria',
    'photo' => '/themes/adat-minang/demo/groom.jpg',
    'bio' => 'Putra pertama yang siap membangun rumah tangga sakinah mawaddah wa rahmah.',
    'instagram' => 'randiwijaya',
    'child_order' => '1',
]);

// Mempelai Wanita (Mira)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 2,
    'full_name' => 'Mira Rahayu, S.E.',
    'nickname' => 'Mira',
    'father_name' => 'H. Ahmad Suryanto',
    'mother_name' => 'Hj. Siti Nurhaliza',
    'gender' => 'wanita',
    'photo' => '/themes/adat-minang/demo/bride.jpg',
    'bio' => 'Putri ketiga yang bersiap melangkah di jalan ibadah terpanjang.',
    'instagram' => 'mirarahayu',
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
    'venue_name' => 'Masjid Raya Sumatera Barat',
    'venue_address' => 'Jl. Khatib Sulaiman, Alai Parak Kopi, Padang Utara, Kota Padang, Sumatera Barat',
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
    'event_name' => 'Baralek Gadang (Resepsi)',
    'event_date' => '2026-12-25',
    'start_time' => '11:00',
    'end_time' => '17:00',
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

// Galleries
Gallery::create([
    'invitation_id' => $inv->id,
    'image_url' => '/images/demo/korea-7-768x512.jpg',
    'caption' => 'Kisah Bahagia',
    'sort_order' => 1,
]);

Gallery::create([
    'invitation_id' => $inv->id,
    'image_url' => '/images/demo/korea-11-768x512.jpg',
    'caption' => 'Prewedding Day',
    'sort_order' => 2,
]);

Gallery::create([
    'invitation_id' => $inv->id,
    'image_url' => '/images/demo/korea-12-768x512.jpg',
    'caption' => 'Momen Bersama',
    'sort_order' => 3,
]);

Gallery::create([
    'invitation_id' => $inv->id,
    'image_url' => '/images/demo/korea-4-768x528.jpg',
    'caption' => 'Dua Hati',
    'sort_order' => 4,
]);

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
    'title' => 'Maminang',
    'story_date' => '2024-11-20',
    'description' => 'Pinangan resmi keluarga menyatukan niat suci menuju jenjang pernikahan.',
    'sort_order' => 2,
]);

// Bank Accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'BCA',
    'account_name' => 'Randi Wijaya',
    'account_number' => '1234567890',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'DANA',
    'account_name' => 'Mira Rahayu',
    'account_number' => '081234567890',
    'sort_order' => 2,
]);


// Re-generate invitation sections for this invitation specifically
$inv->sections()->delete();
foreach ($theme->sections as $ts) {
    $inv->sections()->create([
        'section_key' => $ts->section_key,
        'section_name' => $ts->section_name,
        'sort_order' => $ts->default_order,
        'is_visible' => true,
    ]);
}

echo "Database successfully populated with Adat Minangkabau theme test data!\n";
