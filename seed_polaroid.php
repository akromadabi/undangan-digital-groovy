<?php
// Populate Mira's invitation with Polaroid Scrapbook theme demo data
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
use Database\Seeders\PolaroidThemeSeeder;

echo "Running PolaroidThemeSeeder...\n";
$seeder = new PolaroidThemeSeeder();
$seeder->run();

$inv = Invitation::where('slug', 'mira-randi')->first();
if (!$inv) {
    echo "Invitation 'mira-randi' not found!\n";
    exit;
}

$theme = \App\Models\Theme::where('slug', 'polaroid-scrapbook')->first();
if (!$theme) {
    echo "Polaroid theme not found in database!\n";
    exit;
}

echo "Found invitation ID: {$inv->id} — {$inv->title}\n";
echo "Setting theme to 'polaroid-scrapbook' (ID: {$theme->id})...\n";

// Update invitation details
$inv->update([
    'theme_id' => $theme->id,
    'title' => 'Pernikahan Intan & Fahmi',
    'cover_title' => 'Intan & Fahmi',
    'cover_image' => null,
    'opening_image' => '/images/demo/korea-11-768x512.jpg',
    'opening_title' => 'The Wedding of',
    'opening_ayat' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    'opening_text' => "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami di bawah naungan berkah-Nya.\n\nKami mengundang Bapak/Ibu/Saudara/i untuk turut hadir dan memberikan doa restu di hari bahagia kami.",
    'closing_title' => 'THANK YOU',
    'closing_text' => "Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.\n\nSemoga Allah SWT membalas kebaikan kalian.",
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
    'photo' => null,
    'bio' => 'Putra pertama yang siap membangun bahtera rumah tangga.',
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
    'photo' => null,
    'bio' => 'Putri ketiga dari Bapak Gandi dan Ibu Nurjanah.',
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
    'event_name' => 'Resepsi',
    'event_date' => '2026-12-25',
    'start_time' => '11:00',
    'end_time' => '14:00',
    'timezone' => 'WIB',
    'venue_name' => 'Gedung Sasono Mulyo',
    'venue_address' => 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
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

// Bank Accounts
BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'BCA',
    'account_name' => 'Intan Mutiara',
    'account_number' => '1234567890',
    'sort_order' => 1,
]);

BankAccount::create([
    'invitation_id' => $inv->id,
    'bank_name' => 'Bank Mandiri',
    'account_name' => 'Fahmi Hidayat',
    'account_number' => '0987654321',
    'sort_order' => 2,
]);

// Reset sections
InvitationSection::where('invitation_id', $inv->id)->delete();
foreach ($theme->sections as $ts) {
    InvitationSection::create([
        'invitation_id' => $inv->id,
        'section_key' => $ts->section_key,
        'section_name' => $ts->section_name,
        'sort_order' => $ts->default_order,
        'is_visible' => true,
    ]);
}

echo "Done! Seeded Polaroid Scrapbook theme demo data to 'mira-randi'\n";
