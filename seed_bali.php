<?php
// Populate Ketut & Wayan's invitation with Adat Bali theme demo data
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Invitation;
use App\Models\BrideGroom;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\BankAccount;
use App\Models\LoveStory;
use Database\Seeders\AdatBaliThemeSeeder;

echo "Running AdatBaliThemeSeeder...\n";
$seeder = new AdatBaliThemeSeeder();
$seeder->run();

$inv = Invitation::where('slug', 'ketut-wayan-bali')->first();
if (!$inv) {
    echo "Creating new invitation 'ketut-wayan-bali'...\n";
    $theme = \App\Models\Theme::where('slug', 'adat-bali')->first();
    $inv = Invitation::create([
        'user_id' => 1, // Default admin/user
        'theme_id' => $theme->id,
        'title' => 'Pernikahan Ketut & Wayan',
        'slug' => 'ketut-wayan-bali',
        'is_active' => true,
    ]);
}

$theme = \App\Models\Theme::where('slug', 'adat-bali')->first();
if (!$theme) {
    echo "Adat Bali theme not found in database!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";
echo "Setting theme to 'adat-bali' (ID: {$theme->id})...\n";

// Update invitation details
$inv->update([
    'theme_id' => $theme->id,
    'title' => 'Pernikahan Ketut & Wayan',
    'cover_title' => 'Ketut & Wayan',
    'cover_image' => null,
    'opening_image' => '/themes/adat-bali/demo/bride.jpg',
    'opening_title' => 'Om Swastyastu',
    'opening_ayat' => 'Kala pertama kali jiwa bertemu, di situlah takdir berjalan. Pernikahan adalah ikatan suci lahir batin untuk menempuh kehidupan berdasarkan Dharma.',
    'opening_text' => "Om Swastyastu\n\nAtas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa/Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan Upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami.\n\nKami mengundang Bapak/Ibu/Saudara/i sekalian untuk hadir memberikan doa restu pada upacara suci ini.",
    'closing_title' => 'MATUR SUKSMA',
    'closing_text' => "Matur suksma atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian.\n\nOm Shanti Shanti Shanti Om",
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

// Mempelai Pria (Ketut)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 1,
    'full_name' => 'I Ketut Bagus Satria, S.T.',
    'nickname' => 'Ketut',
    'father_name' => 'I Made Satria',
    'mother_name' => 'Ni Nyoman Triani',
    'gender' => 'pria',
    'photo' => '/themes/adat-bali/demo/groom.jpg',
    'bio' => 'Putra keempat yang siap membangun rumah tangga berasaskan dharma.',
    'instagram' => 'ketut.bagus',
    'child_order' => '4',
]);

// Mempelai Wanita (Wayan)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 2,
    'full_name' => 'Ni Wayan Cantika Sari, S.E.',
    'nickname' => 'Wayan',
    'father_name' => 'I Gede Putu Sari',
    'mother_name' => 'Ni Ketut Ningsih',
    'gender' => 'wanita',
    'photo' => '/themes/adat-bali/demo/bride.jpg',
    'bio' => 'Putri pertama yang bersiap melangkah di jalan pengabdian suci.',
    'instagram' => 'wayan.cantika',
    'child_order' => '1',
]);

// Events
Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'akad',
    'event_name' => 'Upacara Pawiwahan',
    'event_date' => '2026-12-25',
    'start_time' => '08:00',
    'end_time' => '11:00',
    'timezone' => 'WITA',
    'venue_name' => 'Pura Penataran Agung Lempuyang',
    'venue_address' => 'Jl. Ketut Bebandem, Karangasem, Bali',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 1,
    'is_primary' => true,
    'streaming_platform' => 'YouTube',
    'streaming_url' => 'https://youtube.com/live/demo',
    'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/demo']],
    'show_dress_code' => true,
    'dress_code_text' => 'Pakaian Adat Madya Bali / Bebas Rapi',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#5C1E4E', '#E6A11E', '#FAF5EB']]],
]);

Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'resepsi',
    'event_name' => 'Resepsi Pernikahan',
    'event_date' => '2026-12-25',
    'start_time' => '12:00',
    'end_time' => '15:00',
    'timezone' => 'WITA',
    'venue_name' => 'Taman Dedari Ubud',
    'venue_address' => 'Jl. Raya Kedewatan, Ubud, Gianyar, Bali',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 2,
    'is_primary' => false,
    'show_dress_code' => true,
    'dress_code_text' => 'Pakaian Adat Madya Bali / Bebas Rapi',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#5C1E4E', '#E6A11E', '#FAF5EB']]],
]);

// Gallery
$galleryUrls = [
    '/themes/adat-bali/demo/bride.jpg',
    '/themes/adat-bali/demo/groom.jpg',
];

foreach ($galleryUrls as $i => $url) {
    Gallery::create([
        'invitation_id' => $inv->id,
        'image_url' => $url,
        'caption' => 'Kisah Kasih Ketut & Wayan',
        'sort_order' => $i,
    ]);
}

// Love Stories
LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Tepang (Pertemuan)',
    'story_date' => '2023-11-20',
    'description' => 'Kami diperkenalkan oleh seorang sahabat di Denpasar pada akhir tahun 2023. Sejak pertemuan pertama itu, kami merasa memiliki kecocokan visi hidup yang sama.',
    'sort_order' => 1,
]);

LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Ngidih (Pinangan)',
    'story_date' => '2024-11-20',
    'description' => 'Setelah satu tahun menjalin komunikasi yang baik, keluarga besar kami melangsungkan upacara adat Ngidih untuk meminang sang gadis.',
    'sort_order' => 2,
]);

// Bank Accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'BCA',
    'account_name' => 'I Ketut Bagus Satria',
    'account_number' => '1234567890',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Bank BNI',
    'account_name' => 'Ni Wayan Cantika Sari',
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

echo "Database successfully populated with Adat Bali theme test data!\n";
echo "Invitation URL: /ketut-wayan-bali\n";
