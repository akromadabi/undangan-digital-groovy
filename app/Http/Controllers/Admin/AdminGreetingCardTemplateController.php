<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GreetingCardTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminGreetingCardTemplateController extends Controller
{
    public function index()
    {
        $templates = GreetingCardTemplate::orderBy('sort_order')->orderBy('id')->get();

        return Inertia::render('SuperAdmin/GreetingCardTemplates/Index', [
            'templates'   => $templates,
            'typeOptions' => GreetingCardTemplate::$typeOptions,
        ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/GreetingCardTemplates/Form', [
            'template'    => null,
            'typeOptions' => GreetingCardTemplate::$typeOptions,
        ]);
    }

    /**
     * Handle file upload (used by the form via AJAX).
     */
    public function upload(Request $request)
    {
        $request->validate(['file' => 'required|file|image|max:3072']);
        $folder = $request->input('folder', 'greeting-card-templates');
        $path = $request->file('file')->store($folder, 'public');
        return response()->json(['url' => $path]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:100',
            'slug'             => 'required|string|max:60|alpha_dash|unique:greeting_card_templates,slug',
            'type'             => 'required|array|min:1',
            'type.*'           => 'in:anniversary,birthday,graduation,wedding',
            'features'         => 'nullable|array',
            'features.*'       => 'nullable|string|max:50',
            'bg_gradient'      => 'nullable|string|max:200',
            'base_likes'       => 'nullable|integer|min:0',
            'price'            => 'nullable|numeric|min:0',
            'is_active'        => 'boolean',
            'thumbnail'        => 'nullable|string|max:500',
            'preview_template' => 'nullable|string|in:full-mockup,single-phone,double-phone,triple-phone',
            'preview_images'   => 'nullable|array',
            'preview_images.*' => 'nullable|string|max:500',
            'preview_bg_style' => 'nullable|string|max:50',
        ]);

        $data = array_merge($validated, [
            'features'       => array_values(array_filter($validated['features'] ?? [])),
            'preview_images' => array_values(array_filter($validated['preview_images'] ?? [])),
            'base_likes'     => $validated['base_likes'] ?? 0,
            'price'          => $validated['price'] ?? 49000.00,
        ]);

        GreetingCardTemplate::create($data);

        return redirect()->route('super-admin.greeting-card-templates.index')
            ->with('success', 'Template kartu berhasil ditambahkan! 🎉');
    }

    public function edit(GreetingCardTemplate $greetingCardTemplate)
    {
        return Inertia::render('SuperAdmin/GreetingCardTemplates/Form', [
            'template'    => $greetingCardTemplate,
            'typeOptions' => GreetingCardTemplate::$typeOptions,
        ]);
    }

    public function update(Request $request, GreetingCardTemplate $greetingCardTemplate)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:100',
            'slug'             => 'required|string|max:60|alpha_dash|unique:greeting_card_templates,slug,' . $greetingCardTemplate->id,
            'type'             => 'required|array|min:1',
            'type.*'           => 'in:anniversary,birthday,graduation,wedding',
            'features'         => 'nullable|array',
            'features.*'       => 'nullable|string|max:50',
            'bg_gradient'      => 'nullable|string|max:200',
            'base_likes'       => 'nullable|integer|min:0',
            'price'            => 'nullable|numeric|min:0',
            'is_active'        => 'boolean',
            'thumbnail'        => 'nullable|string|max:500',
            'preview_template' => 'nullable|string|in:full-mockup,single-phone,double-phone,triple-phone',
            'preview_images'   => 'nullable|array',
            'preview_images.*' => 'nullable|string|max:500',
            'preview_bg_style' => 'nullable|string|max:50',
        ]);

        $updateData = array_merge($validated, [
            'features'       => array_values(array_filter($validated['features'] ?? [])),
            'preview_images' => array_values(array_filter($validated['preview_images'] ?? [])),
            'base_likes'     => $validated['base_likes'] ?? 0,
            'price'          => $validated['price'] ?? 49000.00,
        ]);

        $greetingCardTemplate->update($updateData);

        return redirect()->route('super-admin.greeting-card-templates.index')
            ->with('success', 'Template kartu berhasil diperbarui! ✨');
    }

    public function destroy(GreetingCardTemplate $greetingCardTemplate)
    {
        $greetingCardTemplate->delete();

        return back()->with('success', 'Template kartu berhasil dihapus.');
    }

    public function toggleActive(GreetingCardTemplate $greetingCardTemplate)
    {
        $greetingCardTemplate->update(['is_active' => !$greetingCardTemplate->is_active]);

        return back()->with('success', $greetingCardTemplate->is_active
            ? 'Template diaktifkan.' : 'Template dinonaktifkan.');
    }

    public function toggleLike(Request $request, GreetingCardTemplate $greetingCardTemplate)
    {
        $request->validate(['liked' => 'required|boolean']);

        if ($request->input('liked')) {
            $greetingCardTemplate->increment('base_likes');
        } else {
            if ($greetingCardTemplate->base_likes > 0) {
                $greetingCardTemplate->decrement('base_likes');
            }
        }

        $greetingCardTemplate->refresh();

        return response()->json([
            'success' => true,
            'likes'   => (int) $greetingCardTemplate->base_likes,
        ]);
    }

    /**
     * Buat atau perbarui kartu demo super admin untuk template ini.
     * Kartu ini digunakan sebagai demo saat reseller membuka preview template.
     */
    public function makeDemo(Request $request)
    {
        $request->validate(['slug' => 'required|string']);
        $slug = $request->input('slug');

        $template = GreetingCardTemplate::where('slug', $slug)->firstOrFail();

        // Map slug ke template renderer key
        $keyMap = [
            'stillwithyou'             => 'stillwithyou',
            'giftforanita'             => 'giftforanita',
            'love-code'                => 'giftforanita',
            'cosmicdrift'              => 'cosmicdrift',
            'cosmic-drift'             => 'cosmicdrift',
            'etherealwhispers'         => 'etherealwhispers',
            'ethereal-whispers'        => 'etherealwhispers',
            'balloonpop'               => 'balloonpop',
            'dreamyballoons'           => 'balloonpop',
            'lofilove'                 => 'lofilove',
            'lofi-love'                => 'lofilove',
        ];
        $templateKey = $keyMap[$slug] ?? $slug;

        $types     = is_array($template->type) ? $template->type : [];
        $firstType = $types[0] ?? 'anniversary';

        $dummyMessages = [
            'anniversary' => [
                'Setiap hari bersamamu adalah hadiah yang paling indah 💕',
                'Terima kasih sudah menjadi bagian dari hidupku',
                'Cintaku untukmu tak pernah pudar, justru semakin dalam setiap harinya ❤️',
                'Semoga kita selalu bersama hingga akhir waktu',
                'Kamu adalah alasan terbaikku untuk tersenyum setiap pagi 🌅',
            ],
            'birthday'    => [
                'Semoga hari ulang tahunmu dipenuhi kebahagiaan dan tawa 🎉',
                'Selamat bertambah bijak dan dewasa ya!',
                'Semua doaku tercurah untukmu di hari yang spesial ini 🎂',
                'Semoga semua impianmu tercapai tahun ini 🌟',
                'Kamu layak mendapatkan semua hal-hal indah di dunia ini ✨',
            ],
            'graduation'  => [
                'Selamat! Kerja kerasmu akhirnya terbayar 🎓',
                'Kini saatnya menaklukkan dunia dengan ilmu yang kau miliki',
                'Bangga sekali melihatmu berhasil melewati semua tantangan ini 💪',
                'Masa depan cerahmu sudah menunggumu di luar sana 🌟',
                'Terus bermimpi besar dan jangan pernah berhenti belajar 📚',
            ],
            'wedding'     => [
                'Selamat menempuh hidup baru, semoga selalu bahagia 💍',
                'Semoga rumah tangga kalian penuh dengan cinta dan berkah',
                'Doa terbaik kami untuk perjalanan hidup bersama kalian ❤️',
                'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah 🕊️',
                'Selamat! Akhirnya kalian bersatu, sungguh pasangan yang serasi 🌹',
            ],
        ];

        $superAdmin = auth()->user();

        // Cek apakah kartu demo untuk template ini sudah ada
        $existing = \App\Models\GreetingCard::where('user_id', $superAdmin->id)
            ->where('template', $templateKey)
            ->first();

        $cardData = [
            'user_id'        => $superAdmin->id,
            'title'          => $template->name,
            'template'       => $templateKey,
            'type'           => $firstType,
            'recipient_name' => 'Sahabat Tercinta',
            'sender_name'    => 'Tim ' . config('app.name', 'Undangan'),
            'photo_url'      => null,
            'photos'         => [],
            'messages'       => $dummyMessages[$firstType] ?? $dummyMessages['anniversary'],
            'is_active'      => true,
        ];

        if ($existing) {
            $existing->update($cardData);
            $card = $existing;
        } else {
            $cardData['custom_url'] = 'demo-' . $slug . '-' . \Illuminate\Support\Str::random(4);
            $card = \App\Models\GreetingCard::create($cardData);
        }

        return back()->with('success', "Demo kartu \"{$template->name}\" berhasil dibuat. Klik tombol Demo untuk melihatnya.");
    }
}

