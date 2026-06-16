<?php
// Populate Rian & Maimunah's invitation with Adat Betawi theme demo data
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
use Database\Seeders\AdatBetawiThemeSeeder;

echo "Running AdatBetawiThemeSeeder...\n";
$seeder = new AdatBetawiThemeSeeder();
$seeder->run();

$inv = Invitation::where('slug', 'rian-maimunah-betawi')->first();
if (!$inv) {
    echo "Creating new invitation 'rian-maimunah-betawi'...\n";
    $theme = \App\Models\Theme::where('slug', 'adat-betawi')->first();
    $inv = Invitation::create([
        'user_id' => 1, // Default admin/user
        'theme_id' => $theme->id,
        'title' => 'Pernikahan Rian & Maimunah',
        'slug' => 'rian-maimunah-betawi',
        'is_active' => true,
    ]);
}

$theme = \App\Models\Theme::where('slug', 'adat-betawi')->first();
if (!$theme) {
    echo "Adat Betawi theme not found in database!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";
echo "Setting theme to 'adat-betawi' (ID: {$theme->id})...\n";

// Update invitation details
$inv->update([
    'theme_id' => $theme->id,
    'title' => 'Pernikahan Rian & Maimunah',
    'cover_title' => 'Rian & Maimunah',
    'cover_image' => null,
    'opening_image' => null, // default
    'opening_title' => "Assalamu'alaikum",
    'opening_ayat' => 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.',
    'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nMenjunjung tinggi tali silaturahim serta adat resam Betawi yang elok, kami bermaksud menyelenggarakan Akad Nikah serta Resepsi Pernikahan putra-putri kami.\n\nMerupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i sekalian berkenan hadir memberikan doa restu.",
    'closing_title' => 'TERIMA KASIH',
    'closing_text' => "Terima kasih banyak atas perhatian dan untaian doa restu Bapak/Ibu/Saudara/i sekalian.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
    'enable_auto_scroll' => true,
    'countdown_target_date' => '2026-11-15 08:00:00',
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
    'full_name' => 'Rian Hidayat, S.Kom.',
    'nickname' => 'Rian',
    'father_name' => 'H. Hidayat',
    'mother_name' => 'Hj. Aminah',
    'gender' => 'pria',
    'photo' => null,
    'bio' => 'Putra pertama yang siap membina biduk rumah tangga penuh berkah.',
    'instagram' => 'rian.hidayat',
    'child_order' => '1',
]);

// Mempelai Wanita (Maimunah)
BrideGroom::create([
    'invitation_id' => $inv->id,
    'order_number' => 2,
    'full_name' => 'Maimunah, S.E.',
    'nickname' => 'Maimunah',
    'father_name' => 'H. Mansur',
    'mother_name' => 'Hj. Fatimah',
    'gender' => 'wanita',
    'photo' => null,
    'bio' => 'Putri kedua yang siap melangkah mendampingi suami tercinta.',
    'instagram' => 'maimunah.mn',
    'child_order' => '2',
]);

// Events
Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'akad',
    'event_name' => 'Akad Nikah',
    'event_date' => '2026-11-15',
    'start_time' => '08:00',
    'end_time' => '10:00',
    'timezone' => 'WIB',
    'venue_name' => 'Masjid Ramlie Musofa',
    'venue_address' => 'Jl. Danau Sunter Selatan No.1, Sunter Agung, Jakarta Utara',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 1,
    'is_primary' => true,
    'show_dress_code' => true,
    'dress_code_text' => 'Pakaian Formal / Kebaya / Jas',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#1E8449', '#F1C40F', '#FCFBF9']]],
]);

Event::create([
    'invitation_id' => $inv->id,
    'event_type' => 'resepsi',
    'event_name' => 'Resepsi Pernikahan',
    'event_date' => '2026-11-15',
    'start_time' => '11:00',
    'end_time' => '14:00',
    'timezone' => 'WIB',
    'venue_name' => 'Balai Samudera',
    'venue_address' => 'Jl. Boulevard Bar. Raya No.1, Kelapa Gading, Jakarta Utara',
    'gmaps_link' => 'https://maps.google.com',
    'sort_order' => 2,
    'is_primary' => false,
    'show_dress_code' => true,
    'dress_code_text' => 'Batik / Pakaian Pesta Betawi / Jas',
    'dress_code_colors' => [['label' => 'Dress Code', 'colors' => ['#1E8449', '#F1C40F', '#FCFBF9']]],
]);

// Bank Accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'BCA',
    'account_name' => 'Rian Hidayat',
    'account_number' => '1122334455',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Mandiri',
    'account_name' => 'Maimunah',
    'account_number' => '5544332211',
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

echo "Database successfully populated with Adat Betawi theme test data!\n";
echo "Invitation URL: /rian-maimunah-betawi\n";
