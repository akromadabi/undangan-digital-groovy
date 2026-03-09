<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class SettingsController extends Controller
{
    private function getUserInvitation(Request $request)
    {
        return $request->user()->invitation;
    }

    public function cover(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        return Inertia::render('Dashboard/Settings/Cover', [
            'invitation' => $invitation?->only(['cover_image', 'cover_title', 'cover_subtitle']),
        ]);
    }

    public function saveCover(Request $request)
    {
        $request->validate([
            'cover_image' => 'nullable|string|max:500',
            'cover_title' => 'nullable|string|max:200',
            'cover_subtitle' => 'nullable|string|max:200',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->update($request->only(['cover_image', 'cover_title', 'cover_subtitle']));

        return back()->with('success', 'Cover berhasil disimpan.');
    }

    public function tamu(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        $guests = $invitation?->guests()->orderBy('name')->paginate(50) ?? [];

        // RSVP data
        $rsvps = $invitation?->rsvps()->with('guest')->latest()->get() ?? [];
        $rsvpStats = [
            'hadir' => $invitation?->rsvps()->where('attendance', 'hadir')->sum('number_of_guests') ?? 0,
            'tidak_hadir' => $invitation?->rsvps()->where('attendance', 'tidak_hadir')->count() ?? 0,
            'belum_pasti' => $invitation?->rsvps()->where('attendance', 'belum_pasti')->count() ?? 0,
        ];

        // Guestbook / Wishes
        $wishes = $invitation?->wishes()->with('guest')->latest()->get() ?? [];

        // WhatsApp data
        $allGuests = $invitation?->guests()->orderBy('name')->get() ?? [];
        $waLogs = $invitation?->whatsappLogs()->with('guest')->latest()->take(50)->get() ?? [];

        return Inertia::render('Dashboard/Settings/Tamu', [
            'guests' => $guests,
            'maxGuests' => $request->user()->currentPlan()?->max_guests ?? 50,
            'rsvps' => $rsvps,
            'rsvpStats' => $rsvpStats,
            'wishes' => $wishes,
            'allGuests' => $allGuests,
            'waLogs' => $waLogs,
            'invitation' => $invitation ? [
                'slug' => $invitation->slug,
                'live_delay' => $invitation->live_delay,
                'live_counter' => $invitation->live_counter,
                'live_template' => $invitation->live_template,
            ] : null,
            'liveUrl' => $invitation ? url('/live/' . $invitation->slug) : null,
        ]);
    }

    public function saveTamu(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:150',
            'phone' => 'nullable|string|max:20',
            'group_name' => 'nullable|string|max:100',
            'max_pax' => 'nullable|integer|min:1|max:10',
        ]);

        $invitation = $this->getUserInvitation($request);
        $maxGuests = $request->user()->currentPlan()?->max_guests ?? 50;

        if ($invitation->guests()->count() >= $maxGuests) {
            return back()->withErrors(['name' => 'Jumlah tamu sudah mencapai batas maksimal paket Anda.']);
        }

        Guest::create(array_merge($request->only(['name', 'phone', 'group_name', 'max_pax']), [
            'invitation_id' => $invitation->id,
        ]));

        return back()->with('success', 'Tamu berhasil ditambahkan.');
    }

    public function importTamu(Request $request)
    {
        $request->validate([
            'guests' => 'required|array',
            'guests.*.name' => 'required|string|max:150',
            'guests.*.phone' => 'nullable|string|max:20',
            'guests.*.group_name' => 'nullable|string|max:100',
        ]);

        $invitation = $this->getUserInvitation($request);

        foreach ($request->guests as $data) {
            Guest::create(array_merge($data, [
                'invitation_id' => $invitation->id,
            ]));
        }

        return back()->with('success', count($request->guests) . ' tamu berhasil diimport.');
    }

    /**
     * Import guests from Excel file
     */
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
        ]);

        $invitation = $this->getUserInvitation($request);
        $maxGuests = $request->user()->currentPlan()?->max_guests ?? 50;
        $currentCount = $invitation->guests()->count();

        $file = $request->file('file');
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Skip header row
        $imported = 0;
        foreach ($rows as $i => $row) {
            if ($i === 0)
                continue; // header row
            $name = trim($row[0] ?? '');
            $phone = trim($row[1] ?? '');

            if (empty($name))
                continue;
            if (($currentCount + $imported) >= $maxGuests)
                break;

            Guest::create([
                'invitation_id' => $invitation->id,
                'name' => $name,
                'phone' => $phone ?: null,
            ]);
            $imported++;
        }

        return back()->with('success', $imported . ' tamu berhasil diimport dari Excel.');
    }

    /**
     * Download Excel template for guest import
     */
    public function downloadTemplate()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Tamu');

        // Header
        $sheet->setCellValue('A1', 'Nama');
        $sheet->setCellValue('B1', 'No. HP');

        // Style header
        $sheet->getStyle('A1:B1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(30);
        $sheet->getColumnDimension('B')->setWidth(20);

        // Sample data
        $sheet->setCellValue('A2', 'Dr. H. Ahmad S.Pd, M.Pd');
        $sheet->setCellValue('B2', '081234567890');
        $sheet->setCellValue('A3', "Bpk. Joko & Ibu Sri");
        $sheet->setCellValue('B3', '089876543210');

        $writer = new Xlsx($spreadsheet);

        $filename = 'template-import-tamu.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), 'tamu_');
        $writer->save($tempFile);

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    public function deleteTamu(Request $request, $id)
    {
        $invitation = $this->getUserInvitation($request);
        $invitation->guests()->where('id', $id)->delete();

        return back()->with('success', 'Tamu berhasil dihapus.');
    }

    public function rsvp(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        $rsvps = $invitation?->rsvps()->with('guest')->latest()->paginate(20) ?? [];

        return Inertia::render('Dashboard/Settings/Rsvp', [
            'rsvps' => $rsvps,
            'stats' => [
                'hadir' => $invitation?->rsvps()->where('attendance', 'hadir')->sum('number_of_guests') ?? 0,
                'tidak_hadir' => $invitation?->rsvps()->where('attendance', 'tidak_hadir')->count() ?? 0,
                'belum_pasti' => $invitation?->rsvps()->where('attendance', 'belum_pasti')->count() ?? 0,
            ],
        ]);
    }

    public function musik(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        $platformMusic = \App\Models\MusicLibrary::where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get(['id', 'title', 'artist', 'category', 'url']);

        return Inertia::render('Dashboard/Settings/Musik', [
            'invitation' => $invitation?->only(['music_url', 'music_autoplay']),
            'platformMusic' => $platformMusic,
        ]);
    }

    public function saveMusik(Request $request)
    {
        $request->validate([
            'music_url' => 'nullable|string|max:500',
            'music_autoplay' => 'boolean',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->update($request->only(['music_url', 'music_autoplay']));

        return back()->with('success', 'Pengaturan musik berhasil disimpan.');
    }

    public function hadiah(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        $gifts = $invitation?->gifts()->latest()->paginate(20) ?? [];

        return Inertia::render('Dashboard/Settings/Hadiah', [
            'gifts' => $gifts,
        ]);
    }

    public function whatsapp(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        $guests = $invitation?->guests()->orderBy('name')->get() ?? [];
        $logs = $invitation?->whatsappLogs()->with('guest')->latest()->take(50)->get() ?? [];

        return Inertia::render('Dashboard/Settings/Whatsapp', [
            'guests' => $guests,
            'logs' => $logs,
        ]);
    }

    public function sendWhatsapp(Request $request)
    {
        $request->validate([
            'guest_ids' => 'required|array',
            'message_template' => 'required|string',
        ]);

        // TODO: Integrate with MP WA V9 API
        return back()->with('success', 'Pesan WhatsApp sedang dikirim.');
    }

    // Pengaturan Undangan (General Settings)
    public function pengaturan(Request $request)
    {
        $invitation = $this->getUserInvitation($request);
        return Inertia::render('Dashboard/Settings/PengaturanUndangan', [
            'invitation' => $invitation?->only([
                'show_photos',
                'show_animations',
                'show_guest_name',
                'show_countdown',
                'show_qr_code',
                'enable_rsvp',
                'enable_wishes',
                'music_autoplay',
                'language',
                'is_private',
                'enable_qr',
                'hide_photos',
            ]),
        ]);
    }

    public function savePengaturan(Request $request)
    {
        $request->validate([
            'show_photos' => 'boolean',
            'show_animations' => 'boolean',
            'show_guest_name' => 'boolean',
            'show_countdown' => 'boolean',
            'show_qr_code' => 'boolean',
            'enable_rsvp' => 'boolean',
            'enable_wishes' => 'boolean',
            'music_autoplay' => 'boolean',
            'language' => 'in:id,en',
            'is_private' => 'boolean',
            'enable_qr' => 'boolean',
            'hide_photos' => 'boolean',
        ]);

        $invitation = $this->getUserInvitation($request);
        $invitation->update($request->only([
            'show_photos',
            'show_animations',
            'show_guest_name',
            'show_countdown',
            'show_qr_code',
            'enable_rsvp',
            'enable_wishes',
            'music_autoplay',
            'language',
            'is_private',
            'enable_qr',
            'hide_photos',
        ]));

        return back()->with('success', 'Pengaturan undangan berhasil disimpan.');
    }
}
