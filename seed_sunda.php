<?php
// Populate Mira's invitation with Adat Sunda theme demo data
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
use Database\Seeders\AdatSundaThemeSeeder;

echo "Running AdatSundaThemeSeeder...\n";
$seeder = new AdatSundaThemeSeeder();
$seeder->run();

$inv = Invitation::where('slug', 'mira-randi-sunda')->first();
if (!$inv) {
    echo "Creating new invitation 'mira-randi-sunda'...\n";
    $theme = \App\Models\Theme::where('slug', 'adat-sunda')->first();
    $inv = Invitation::create([
        'user_id' => 1, // Default admin/user
        'theme_id' => $theme->id,
        'title' => 'Pernikahan Rian & Yuyun',
        'slug' => 'mira-randi-sunda',
        'is_active' => true,
    ]);
}

$theme = \App\Models\Theme::where('slug', 'adat-sunda')->first();
if (!$theme) {
    echo "Adat Sunda theme not found in database!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";
echo "Setting theme to 'adat-sunda' (ID: {$theme->id})...\n";

// Update invitation details
$inv->update([
    'theme_id' => $theme->id,
    'title' => 'Pernikahan Rian & Yuyun',
    'cover_title' => 'Rian & Yuyun',
    'cover_image' => null,
    'opening_image' => '/themes/adat-sunda/demo/bride.jpg',
    'opening_title' => 'Ngabageakeun',
    'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nKalayan puji sinareng syukur ka Gusti Allah SWT, anu parantos maparinan rahmat sareng hidayah-Na, sim kuring sakulawargi maksad nyepeng acara syukuran pernikahan kami (Patuay Tinemu) dina kaayaan anu barokah.\n\nKami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu di hari bahagia kami.",
    'closing_title' => 'HATUR NUHUN',
    'closing_text' => "Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.\n\nSemoga Allah SWT membalas kebaikan kalian.",
    'enable_auto_scroll' => true,
    'countdown_target_date' => '2026-12-25 08:00:00',
    'music_url' => '/audio/backsound.mp3',
]);

// Clear existing data
BrideGroom::where('invitation_id', $inv->id)->delete();
Event::where('invitation_id', $inv->id)->delete();
Gallery::where('invitation_id', $inv->id)->delete();
BankAccount::where('invitation_id', $inv->id)->delete();
LoveStory::where('invitation_id', $inv->id)->delete();

// Mempelai Pria (Rian)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 1,
    'full_name' => 'Rian Hidayat, S.T.',
    'nickname' => 'Rian',
    'father_name' => 'H. Cecep Hidayat',
    'mother_name' => 'Hj. Neneng Hasanah',
    'gender' => 'pria',
    'photo' => '/themes/adat-sunda/demo/groom.jpg',
    'bio' => 'Putra pertama yang siap membangun rumah tangga sakinah mawaddah wa rahmah.',
    'instagram' => 'rianhidayat',
    'child_order' => '1',
]);

// Mempelai Wanita (Yuyun)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 2,
    'full_name' => 'Yuyun Wahyuni, S.E.',
    'nickname' => 'Yuyun',
    'father_name' => 'H. Dadang Wahyu',
    'mother_name' => 'Hj. Kokom Komariah',
    'gender' => 'wanita',
    'photo' => '/themes/adat-sunda/demo/bride.jpg',
    'bio' => 'Putri ketiga yang bersiap melangkah di jalan ibadah terpanjang.',
    'instagram' => 'yuyunwahyuni',
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
    'venue_name' => 'Masjid Raya Al-Jabbar',
    'venue_address' => 'Jl. Cimincrang No. 14, Gedebage, Kota Bandung, Jawa Barat',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 1,
    'is_primary' => true,
    'streaming_platform' => 'YouTube',
    'streaming_url' => 'https://youtube.com/live/demo',
    'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/demo']],
    'show_dress_code' => true,
    'dress_code_text' => 'Baju Adat Sunda / Busana Nasional Rapi',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#1E5E3A', '#E5C060', '#FAF7F0']]],
]);

Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'resepsi',
    'event_name' => 'Walimatul Urus (Resepsi)',
    'event_date' => '2026-12-25',
    'start_time' => '11:00',
    'end_time' => '14:00',
    'timezone' => 'WIB',
    'venue_name' => 'Bumi Sangkuriang',
    'venue_address' => 'Jl. Kiputih No. 12, Ciumbuleuit, Cidadap, Kota Bandung, Jawa Barat',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 2,
    'is_primary' => false,
    'show_dress_code' => true,
    'dress_code_text' => 'Baju Adat Sunda / Busana Nasional Rapi',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#1E5E3A', '#E5C060', '#FAF7F0']]],
]);

// Gallery
$galleryUrls = [
    '/themes/adat-sunda/demo/bride.jpg',
    '/themes/adat-sunda/demo/groom.jpg',
];

foreach ($galleryUrls as $i => $url) {
    Gallery::create([
        'invitation_id' => $inv->id,
        'image_url' => $url,
        'caption' => 'Kisah Kasih Rian & Yuyun',
        'sort_order' => $i,
    ]);
}

// Love Stories
LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Tepang (Pertemuan)',
    'story_date' => '2023-11-20',
    'description' => 'Kami diperkenalkan oleh seorang sahabat di Bandung pada akhir tahun 2023. Sejak pertemuan pertama itu, kami merasa memiliki kecocokan visi hidup yang sama.',
    'sort_order' => 1,
]);

LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Maminang (Pinangan)',
    'story_date' => '2024-11-20',
    'description' => 'Setelah satu tahun menjalin komunikasi yang intens, keluarga kami sepakat untuk melangkah ke jenjang pernikahan dengan adat pinangan.',
    'sort_order' => 2,
]);

// Bank Accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'BCA',
    'account_name' => 'Rian Hidayat',
    'account_number' => '1234567890',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Bank BNI',
    'account_name' => 'Yuyun Wahyuni',
    'account_number' => '0987654321',
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

echo "Database successfully populated with Adat Sunda theme test data!\n";
echo "Invitation URL: /mira-randi-sunda\n";
