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
]);

// Gallery - use placeholder images
$galleryUrls = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=400&fit=crop',
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

// Make sure invitation sections exist
$existingSections = \App\Models\InvitationSection::where('invitation_id', $inv->id)->count();
if ($existingSections == 0) {
    $sections = [
        ['section_key' => 'opening', 'section_label' => 'Opening', 'sort_order' => 1, 'is_visible' => true],
        ['section_key' => 'bride_groom', 'section_label' => 'Mempelai', 'sort_order' => 2, 'is_visible' => true],
        ['section_key' => 'event', 'section_label' => 'Acara', 'sort_order' => 3, 'is_visible' => true],
        ['section_key' => 'gallery', 'section_label' => 'Galeri', 'sort_order' => 4, 'is_visible' => true],
        ['section_key' => 'bank', 'section_label' => 'Amplop', 'sort_order' => 5, 'is_visible' => true],
        ['section_key' => 'wishes', 'section_label' => 'Ucapan', 'sort_order' => 6, 'is_visible' => true],
        ['section_key' => 'closing', 'section_label' => 'Penutup', 'sort_order' => 7, 'is_visible' => true],
    ];
    foreach ($sections as $sec) {
        \App\Models\InvitationSection::create(array_merge($sec, ['invitation_id' => $inv->id]));
    }
    echo "Created {count($sections)} invitation sections\n";
}

echo "Done! Populated demo data for mira-randi\n";
echo "  - 2 bride/grooms\n";
echo "  - 2 events\n";
echo "  - " . count($galleryUrls) . " gallery photos\n";
echo "  - 2 bank accounts\n";
