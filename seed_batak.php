<?php
// Populate Togu & Santi's invitation with Adat Batak theme demo data
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
use Database\Seeders\AdatBatakThemeSeeder;

echo "Running AdatBatakThemeSeeder...\n";
$seeder = new AdatBatakThemeSeeder();
$seeder->run();

$inv = Invitation::where('slug', 'togu-santi-batak')->first();
if (!$inv) {
    echo "Creating new invitation 'togu-santi-batak'...\n";
    $theme = \App\Models\Theme::where('slug', 'adat-batak')->first();
    $inv = Invitation::create([
        'user_id' => 1, // Default admin/user
        'theme_id' => $theme->id,
        'title' => 'Pernikahan Togu & Santi',
        'slug' => 'togu-santi-batak',
        'is_active' => true,
    ]);
}

$theme = \App\Models\Theme::where('slug', 'adat-batak')->first();
if (!$theme) {
    echo "Adat Batak theme not found in database!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";
echo "Setting theme to 'adat-batak' (ID: {$theme->id})...\n";

// Update invitation details
$inv->update([
    'theme_id' => $theme->id,
    'title' => 'Pernikahan Togu & Santi',
    'cover_title' => 'Togu & Santi',
    'cover_image' => null,
    'opening_image' => '/themes/adat-batak/demo/bride.jpg',
    'opening_title' => 'Horas',
    'opening_ayat' => 'Maka sekarang, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.',
    'opening_text' => "Horas Talu, Horas Nabolon!\n\nMenjunjung tinggi tali pergaulan, adat, dan rasa hormat yang mendalam, kami bermaksud menyelenggarakan Ibadah Pemberkatan Pernikahan (Pamasu-masuan) serta Upacara Adat Pernikahan (Ulaon Unjuk) putra-putri kami.\n\nKami mengundang Bapak/Ibu/Saudara/i sekalian untuk hadir memberikan doa restu pada upacara suci ini.",
    'closing_title' => 'MAULIATE',
    'closing_text' => "Mauliate godang (Terima kasih banyak) atas kehadiran serta untaian doa restu Bapak/Ibu/Saudara/i sekalian.\n\nHoras! Horas! Horas!",
    'enable_auto_scroll' => true,
    'countdown_target_date' => '2026-10-24 09:00:00',
    'music_url' => '/audio/backsound.mp3',
]);

// Clear existing data
BrideGroom::where('invitation_id', $inv->id)->delete();
Event::where('invitation_id', $inv->id)->delete();
Gallery::where('invitation_id', $inv->id)->delete();
BankAccount::where('invitation_id', $inv->id)->delete();
LoveStory::where('invitation_id', $inv->id)->delete();

// Mempelai Pria (Togu)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 1,
    'full_name' => 'Togu Johannes Hutapea, S.T.',
    'nickname' => 'Togu',
    'father_name' => 'Baringin Hutapea',
    'mother_name' => 'Pinta Simanjuntak',
    'gender' => 'pria',
    'photo' => '/themes/adat-batak/demo/groom.jpg',
    'bio' => 'Putra sulung yang bersiap memimpin keluarga baru dalam tuntunan iman.',
    'instagram' => 'togu.hutapea',
    'child_order' => '1',
]);

// Mempelai Wanita (Santi)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 2,
    'full_name' => 'Santi Romauli Boru Situmorang, S.E.',
    'nickname' => 'Santi',
    'father_name' => 'St. Mangatur Situmorang',
    'mother_name' => 'Rosanna Sinaga',
    'gender' => 'wanita',
    'photo' => '/themes/adat-batak/demo/bride.jpg',
    'bio' => 'Putri bungsu yang siap melangkah mendampingi suami tercinta.',
    'instagram' => 'santi.situmorang',
    'child_order' => 'bungsu',
]);

// Events
Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'akad',
    'event_name' => 'Ibadah Pemberkatan (Pamasu-masuan)',
    'event_date' => '2026-10-24',
    'start_time' => '09:00',
    'end_time' => '11:00',
    'timezone' => 'WIB',
    'venue_name' => 'Gereja HKBP Sudirman Jakarta',
    'venue_address' => 'Jl. Jend. Sudirman No. 10, Karet Tengsin, Jakarta Pusat',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 1,
    'is_primary' => true,
    'streaming_platform' => 'YouTube',
    'streaming_url' => 'https://youtube.com/live/demo',
    'streamings' => [['platform' => 'YouTube', 'url' => 'https://youtube.com/live/demo']],
    'show_dress_code' => true,
    'dress_code_text' => 'Pakaian Formal / Kebaya Nasional / Jas',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#8F1E1E', '#D4AF37', '#FCFBF9']]],
]);

Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'resepsi',
    'event_name' => 'Pesta Adat & Resepsi (Ulaon Unjuk)',
    'event_date' => '2026-10-24',
    'start_time' => '12:00',
    'end_time' => '17:00',
    'timezone' => 'WIB',
    'venue_name' => 'Gedung Pertemuan Mulia Raja',
    'venue_address' => 'Jl. Kebon Nanas No. 2, Cipinang, Jakarta Timur',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 2,
    'is_primary' => false,
    'show_dress_code' => true,
    'dress_code_text' => 'Pakaian Adat Batak Toba / Kebaya / Jas',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#8F1E1E', '#D4AF37', '#FCFBF9']]],
]);

// Gallery
$galleryUrls = [
    '/themes/adat-batak/demo/bride.jpg',
    '/themes/adat-batak/demo/groom.jpg',
];

foreach ($galleryUrls as $i => $url) {
    Gallery::create([
        'invitation_id' => $inv->id,
        'image_url' => $url,
        'caption' => 'Kisah Kasih Togu & Santi',
        'sort_order' => $i,
    ]);
}

// Love Stories
LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Parjumpahan (Pertemuan)',
    'story_date' => '2023-05-12',
    'description' => 'Awal mula kisah kami terjalin ketika dipertemukan dalam ibadah pemuda gereja di Jakarta. Komunikasi kami berlanjut hingga menemukan visi pelayanan yang sejalan.',
    'sort_order' => 1,
]);

LoveStory::create([
    'invitation_id' => $inv->id,
    'title' => 'Marhusip (Persetujuan Pernikahan)',
    'story_date' => '2025-06-15',
    'description' => 'Setelah dua tahun memantapkan langkah, perwakilan keluarga kami berkumpul melakukan musyawarah adat Marhusip untuk menyepakati tanggal dan bentuk pesta adat.',
    'sort_order' => 2,
]);

// Bank Accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'BCA',
    'account_name' => 'Togu Johannes Hutapea',
    'account_number' => '7894561230',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Mandiri',
    'account_name' => 'Santi Romauli Situmorang',
    'account_number' => '1357924680',
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

echo "Database successfully populated with Adat Batak theme test data!\n";
echo "Invitation URL: /togu-santi-batak\n";
