<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Helpers\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminActivityLogController extends Controller
{
    /**
     * Display a listing of the activity logs.
     */
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->latest('id');

        // Text Search (searches descriptions or actor name/email)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by Role (super_admin, reseller, user, guest)
        if ($request->filled('role') && $request->input('role') !== 'all') {
            $query->where('role', $request->input('role'));
        }

        // Filter by Category
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        $logs = $query->paginate(50)->withQueryString();

        // Standardized categories list for filters
        $categories = [
            ['value' => 'all', 'label' => 'Semua Kategori'],
            ['value' => 'invitation', 'label' => 'Undangan'],
            ['value' => 'guest', 'label' => 'Tamu & Kontak'],
            ['value' => 'rsvp', 'label' => 'RSVP / Konfirmasi'],
            ['value' => 'wish', 'label' => 'Ucapan / Doa'],
            ['value' => 'gift', 'label' => 'Hadiah / Amplop'],
            ['value' => 'love_story', 'label' => 'Kisah Cinta'],
            ['value' => 'event', 'label' => 'Detail Acara'],
            ['value' => 'bank_account', 'label' => 'Rekening Pembayaran'],
            ['value' => 'music', 'label' => 'Koleksi Musik'],
            ['value' => 'theme', 'label' => 'Desain Tema'],
            ['value' => 'wallet', 'label' => 'Dompet / Reseller'],
            ['value' => 'withdrawal', 'label' => 'Pencairan Reseller'],
            ['value' => 'payment', 'label' => 'Transaksi / Paket'],
            ['value' => 'user', 'label' => 'Pengguna'],
            ['value' => 'general', 'label' => 'Umum / Sistem'],
        ];

        return Inertia::render('SuperAdmin/Logs', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'role', 'category']),
            'categories' => $categories,
        ]);
    }

    /**
     * Restore a deleted database record from the activity log payload.
     */
    public function restore(Request $request, $id)
    {
        $log = ActivityLog::findOrFail($id);

        if ($log->activity_type !== 'delete') {
            return back()->withErrors(['error' => 'Hanya log aktivitas penghapusan (delete) yang dapat dipulihkan.']);
        }

        if (empty($log->payload) || empty($log->subject_type)) {
            return back()->withErrors(['error' => 'Data backup tidak ditemukan di log ini. Pemulihan tidak dapat dilakukan.']);
        }

        $subjectClass = $log->subject_type;
        if (!class_exists($subjectClass)) {
            return back()->withErrors(['error' => "Model data '{$subjectClass}' tidak ditemukan di sistem."]);
        }

        $data = $log->payload;
        $subjectId = $log->subject_id ?? ($data['id'] ?? null);

        if (!$subjectId) {
            return back()->withErrors(['error' => 'ID data asli tidak terdeteksi di payload.']);
        }

        // Verify if record with the same ID already exists to prevent integrity conflicts
        $exists = $subjectClass::where('id', $subjectId)->exists();
        if ($exists) {
            return back()->withErrors(['error' => 'Data dengan ID yang sama sudah ada di database. Pemulihan dibatalkan.']);
        }

        try {
            \DB::transaction(function () use ($subjectClass, $data, $log) {
                // Restore the record with exact original attributes
                $instance = new $subjectClass;
                $instance->forceFill($data);
                $instance->save();

                // Log the restore event
                $modelName = class_basename($subjectClass);
                $identifier = $instance->name ?? $instance->title ?? $instance->sender_name ?? $instance->id;
                
                ActivityLogger::log(
                    'create',
                    $log->category,
                    "Memulihkan {$modelName} '{$identifier}' dari Log Aktivitas #{$log->id}",
                    $instance
                );
            });

            return back()->with('success', 'Data berhasil dipulihkan ke posisi semula!');
        } catch (\Exception $e) {
            \Log::error('Restore failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal memulihkan data: ' . $e->getMessage()]);
        }
    }
}
