<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerSetting extends Model
{
    protected $fillable = [
        'user_id',
        'demo_user_id',
        'brand_name',
        'brand_logo',
        'site_title',
        'site_motto',
        'subdomain',
        'custom_domain',
        'landing_page_template',
        'landing_page_config',
        'landing_page_hero_image',
        'is_active',
        'bank_name',
        'bank_account',
        'bank_holder',
        'footer_phone',
        'footer_email',
        'footer_whatsapp',
        'footer_instagram',
        'footer_tiktok',
        'footer_address',
        'footer_description',
        'bank_accounts',
        'social_links',
        'greeting_card_price',
    ];

    protected function casts(): array
    {
        return [
            'is_active'           => 'boolean',
            'bank_accounts'       => 'array',
            'social_links'        => 'array',
            'landing_page_config' => 'array',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function demoUser()
    {
        return $this->belongsTo(User::class, 'demo_user_id');
    }

    /**
     * Default section definitions (fallback if no config saved).
     */
    public static function defaultSections(): array
    {
        return [
            [
                'key'    => 'banner',
                'active' => true,
                'order'  => 0,
                'config' => [
                    'text'               => '🔥 Promo Spesial: Aktifkan paket premium hari ini & dapatkan diskon langsung hingga 50%! Sisa waktu: {countdown}',
                    'cta_text'           => 'Daftar Sekarang',
                    'cta_link'           => '#plans',
                    'bg_color'           => 'linear-gradient(90deg, #E5654B 0%, #D55A42 100%)',
                    'text_color'         => '#ffffff',
                    'show_countdown'     => true,
                    'countdown_duration' => 19,
                ],
            ],
            [
                'key'    => 'hero',
                'active' => true,
                'order'  => 1,
                'config' => [
                    'badge_text'          => 'Platform Undangan Digital Terpercaya',
                    'title'               => 'Undangan Digital',
                    'subtitle'            => 'Premium',
                    'description'         => 'Buat undangan pernikahan digital yang elegan dan berkesan dalam hitungan menit. Desain premium, fitur lengkap, langsung bisa dibagikan ke semua tamu.',
                    'cta_primary_text'    => 'Buat Undangan Gratis',
                    'cta_secondary_text'  => 'Lihat Contoh Tema',
                    'perks'               => ['Gratis selamanya', 'Tanpa watermark', 'Langsung aktif'],
                    'hero_image'          => null,
                    'carousel_images'     => [],
                ],
            ],
            [
                'key'    => 'stats',
                'active' => true,
                'order'  => 2,
                'config' => [
                    'items' => [
                        ['val' => '20+',    'label' => 'Tema Tersedia',    'icon' => '🎨'],
                        ['val' => '1.200+', 'label' => 'Undangan Dibuat',  'icon' => '💌'],
                        ['val' => '5 Menit','label' => 'Waktu Pembuatan',  'icon' => '⚡'],
                        ['val' => '24/7',   'label' => 'Selalu Online',    'icon' => '🌐'],
                        ['val' => '100%',   'label' => 'Mobile Friendly',  'icon' => '📱'],
                    ],
                ],
            ],
            [
                'key'    => 'how_it_works',
                'active' => true,
                'order'  => 3,
                'config' => [
                    'title' => 'Mudah & Cepat dalam 3 Langkah',
                    'steps' => [
                        ['num' => '01', 'title' => 'Daftar Gratis',    'desc' => 'Buat akun dalam 30 detik. Tidak perlu kartu kredit.'],
                        ['num' => '02', 'title' => 'Pilih & Isi Tema', 'desc' => 'Pilih tema favorit, isi data mempelai, unggah foto, dan sesuaikan warna.'],
                        ['num' => '03', 'title' => 'Bagikan ke Tamu',  'desc' => 'Kirim tautan undangan via WhatsApp, Instagram, atau media sosial lainnya.'],
                    ],
                ],
            ],
            [
                'key'    => 'features',
                'active' => true,
                'order'  => 4,
                'config' => [
                    'title'    => 'Semua yang Anda Butuhkan Ada di Sini',
                    'subtitle' => 'Fitur Unggulan',
                ],
            ],
            [
                'key'    => 'preview',
                'active' => true,
                'order'  => 5,
                'config' => [
                    'style'     => 'carousel',
                    'max_items' => 8,
                    'title'     => 'Pilih Desain Sempurna untuk Anda',
                    'subtitle'  => 'Koleksi Desain',
                ],
            ],
            [
                'key'    => 'greeting_cards',
                'active' => true,
                'order'  => 6,
                'config' => [
                    'style'    => 'carousel',
                    'title'    => 'Koleksi Kartu Ucapan Premium',
                    'subtitle' => 'Koleksi Kartu',
                ],
            ],
            [
                'key'    => 'testimonials',
                'active' => true,
                'order'  => 7,
                'config' => [
                    'style'    => 'marquee',
                    'title'    => 'Dipercaya Ribuan Pasangan Bahagia',
                    'subtitle' => 'Testimoni',
                    'items'    => [
                        ['name' => 'Sari & Budi',     'city' => 'Jakarta',     'text' => 'Undangannya cantik banget! Banyak tamu yang tanya beli di mana. Sangat rekomendasikan!',          'stars' => 5],
                        ['name' => 'Ayu & Fajar',     'city' => 'Surabaya',    'text' => 'Fitur RSVP dan QR Code sangat membantu kami mendata tamu yang hadir. Top banget!',                'stars' => 5],
                        ['name' => 'Rina & Deni',     'city' => 'Bandung',     'text' => 'Harga terjangkau tapi kualitas premium. Proses pembuatan mudah, tidak butuh keahlian IT.',       'stars' => 5],
                        ['name' => 'Putri & Aldi',    'city' => 'Yogyakarta',  'text' => 'Desainnya sangat elegan dan modern. Tamu-tamu kami kagum. Pengalaman yang luar biasa!',            'stars' => 5],
                        ['name' => 'Nadia & Rizky',   'city' => 'Semarang',    'text' => 'Fitur amplop digitalnya sangat praktis. Tidak perlu pusing soal transfer manual dari tamu.',      'stars' => 5],
                        ['name' => 'Fitri & Hendra',  'city' => 'Medan',       'text' => 'Temanya banyak dan bagus-bagus. Mudah disesuaikan, hasilnya profesional sekali!',                 'stars' => 5],
                    ],
                ],
            ],
            [
                'key'    => 'plans',
                'active' => true,
                'order'  => 8,
                'config' => [
                    'title'    => 'Pilih Paket yang Sesuai',
                    'subtitle' => 'Harga & Paket',
                ],
            ],
            [
                'key'    => 'faq',
                'active' => true,
                'order'  => 9,
                'config' => [
                    'title'    => 'Pertanyaan yang Sering Ditanyakan',
                    'subtitle' => 'FAQ',
                    'items'    => [
                        ['q' => 'Apakah benar-benar gratis?',            'a' => 'Ya! Paket dasar kami 100% gratis tanpa batas waktu. Anda bisa membuat undangan, mengundang tamu, dan menggunakan fitur dasar tanpa biaya apapun.'],
                        ['q' => 'Berapa lama undangan bisa diakses?',     'a' => 'Undangan Anda akan aktif sesuai dengan paket yang dipilih. Paket gratis berlaku selamanya, sementara paket premium memberikan akses penuh selama periode tertentu.'],
                        ['q' => 'Apakah tamu bisa konfirmasi kehadiran?', 'a' => 'Ya! Fitur RSVP tersedia di paket tertentu. Tamu bisa konfirmasi kehadiran langsung dari undangan digital Anda.'],
                        ['q' => 'Bagaimana cara membagikan undangan?',    'a' => 'Setelah undangan selesai dibuat, Anda akan mendapatkan tautan unik yang bisa dibagikan via WhatsApp, pesan teks, email, atau media sosial lainnya.'],
                        ['q' => 'Apakah bisa menggunakan foto sendiri?',  'a' => 'Tentu! Anda bisa mengunggah foto couple, foto venue, dan foto-foto lain untuk ditampilkan di galeri undangan Anda.'],
                    ],
                ],
            ],
            [
                'key'    => 'cta',
                'active' => true,
                'order'  => 10,
                'config' => [
                    'title'    => 'Siap Membuat Undangan Digital yang Berkesan?',
                    'cta_text' => 'Mulai Gratis Sekarang',
                ],
            ],
        ];
    }

    /**
     * Get ordered sections merged with defaults.
     */
    public function getOrderedSections(): array
    {
        $defaults = collect(self::defaultSections())->keyBy('key');
        $saved    = collect($this->landing_page_config['sections'] ?? []);

        if ($saved->isEmpty()) {
            return $defaults->values()->toArray();
        }

        $savedKeyed = $saved->keyBy('key');
        $merged = $defaults->map(function ($def) use ($savedKeyed) {
            if ($savedKeyed->has($def['key'])) {
                $s = $savedKeyed[$def['key']];
                return array_merge($def, [
                    'active' => $s['active'] ?? $def['active'],
                    'order'  => $s['order']  ?? $def['order'],
                    'config' => array_merge($def['config'], $s['config'] ?? []),
                ]);
            }
            return $def;
        });

        return $merged->sortBy('order')->values()->toArray();
    }

    /**
     * Get the active theme id.
     */
    public function getLandingTheme(): string
    {
        return $this->landing_page_config['theme'] ?? $this->landing_page_template ?? 'galaxy';
    }
}
