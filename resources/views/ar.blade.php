<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AR Undangan - {{ $invitation->cover_title ?: 'Pernikahan' }}</title>

    <!-- Google Fonts for premium looks -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">

    <!-- AR.js & A-Frame library resources -->
    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <!-- AR.js extra: Pattern marker component for wider detection radius -->
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>

    <!-- ===================== Custom A-Frame Components ===================== -->
    <script>
        // ─── 1. PETAL / CONFETTI RAIN ─────────────────────────────────────────
        AFRAME.registerComponent('petal-rain', {
            schema: {
                count: { type: 'int', default: 80 },
                style: { type: 'string', default: 'classic' }
            },
            init: function () {
                this.petals = [];
                const palettes = {
                    classic: ['#FFB7C5','#FF85A1','#FFD700','#FFF0F5','#FF6B6B','#FFDAB9'],
                    cosmic:  ['#00FFFF','#BF5FFF','#FF00FF','#7B2FFF','#C0C0C0','#39C5BB'],
                    java:    ['#FFD700','#D4AF37','#FFFACD','#F4C430','#E59866','#F9E4B7']
                };
                const colors = palettes[this.data.style] || palettes.classic;
                const isCosmic = this.data.style === 'cosmic';

                for (let i = 0; i < this.data.count; i++) {
                    const el = document.createElement('a-plane');
                    const size = 0.03 + Math.random() * 0.05;
                    el.setAttribute('width', size);
                    el.setAttribute('height', size * (isCosmic ? 1 : 1.6));
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    el.setAttribute('color', color);
                    el.setAttribute('material', isCosmic
                        ? `side: double; depthWrite: false; emissive: ${color}; emissiveIntensity: 0.6; roughness: 0.1; metalness: 0.8`
                        : 'side: double; depthWrite: false; roughness: 0.8; metalness: 0.1');
                    const x = (Math.random() - 0.5) * 5;
                    const y = Math.random() * 6 + 1;
                    const z = (Math.random() - 0.5) * 5;
                    el.setAttribute('position', { x, y, z });
                    el.setAttribute('rotation', {
                        x: Math.random() * 360,
                        y: Math.random() * 360,
                        z: Math.random() * 360
                    });
                    this.el.appendChild(el);
                    this.petals.push({
                        el,
                        vy: 0.007 + Math.random() * 0.014,
                        vx: (Math.random() - 0.5) * 0.003,
                        rs: 0.8 + Math.random() * 2.4,
                        startX: x
                    });
                }
            },
            tick: function () {
                this.petals.forEach(p => {
                    const pos = p.el.getAttribute('position');
                    const rot = p.el.getAttribute('rotation');
                    pos.y -= p.vy;
                    pos.x += p.vx + Math.sin(pos.y * 1.8 + p.startX) * 0.0015;
                    rot.z += p.rs; rot.x += p.rs * 0.4;
                    if (pos.y < -0.5) {
                        pos.y = 6; pos.x = (Math.random() - 0.5) * 5;
                    }
                    p.el.setAttribute('position', pos);
                    p.el.setAttribute('rotation', rot);
                });
            }
        });

        // ─── 2. FIREWORKS BURST ───────────────────────────────────────────────
        AFRAME.registerComponent('fireworks-burst', {
            schema: { style: { type: 'string', default: 'classic' } },
            init: function () { this.timer = 0; this.sparks = []; },
            tick: function (time, dt) {
                this.timer += dt;
                if (this.timer > 1800) { this.timer = 0; this.launch(); }
                for (let i = this.sparks.length - 1; i >= 0; i--) {
                    const s = this.sparks[i];
                    const pos = s.el.getAttribute('position');
                    const sc  = s.el.getAttribute('scale');
                    pos.x += s.vel.x; pos.y += s.vel.y; pos.z += s.vel.z;
                    s.vel.y -= 0.0005;
                    sc.x -= 0.013; sc.y -= 0.013; sc.z -= 0.013;
                    s.el.setAttribute('position', pos);
                    s.el.setAttribute('scale', sc);
                    if (sc.x <= 0) { this.el.removeChild(s.el); this.sparks.splice(i, 1); }
                }
            },
            launch: function () {
                const palettes = {
                    classic: ['#FFD700','#FF4500','#FF1493','#00FFFF','#39FF14','#FFFFFF'],
                    cosmic:  ['#00FFFF','#FF00FF','#8A2BE2','#39FF14','#C0C0C0'],
                    java:    ['#FFD700','#FFA500','#FF4500','#FFFACD','#D4AF37']
                };
                const colors = palettes[this.data.style] || palettes.classic;
                // launch 2 bursts at random positions above scene
                for (let b = 0; b < 2; b++) {
                    const origin = {
                        x: (Math.random() - 0.5) * 2,
                        y: 2.5 + Math.random() * 0.8,
                        z: (Math.random() - 0.5) * 1
                    };
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const count = 22;
                    for (let i = 0; i < count; i++) {
                        const spark = document.createElement('a-sphere');
                        spark.setAttribute('position', origin);
                        spark.setAttribute('radius', 0.035);
                        spark.setAttribute('color', color);
                        spark.setAttribute('material', `emissive: ${color}; emissiveIntensity: 2.5; roughness: 0.1`);
                        spark.setAttribute('scale', '1 1 1');
                        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
                        const pitch = (Math.random() - 0.5) * Math.PI;
                        const speed = 0.02 + Math.random() * 0.03;
                        this.el.appendChild(spark);
                        this.sparks.push({
                            el: spark,
                            vel: {
                                x: Math.cos(angle) * Math.cos(pitch) * speed,
                                y: Math.sin(pitch) * speed + 0.015,
                                z: Math.sin(angle) * Math.cos(pitch) * speed
                            }
                        });
                    }
                }
            }
        });

        // ─── 3. FLOATING PARTICLES (ambient sparkle cloud) ───────────────────
        AFRAME.registerComponent('sparkle-field', {
            schema: { count: { type: 'int', default: 40 }, style: { type: 'string', default: 'classic' } },
            init: function () {
                this.sparks = [];
                const palettes = {
                    classic: ['#FFD700','#FFFFFF','#FFB7C5'],
                    cosmic:  ['#00FFFF','#BF5FFF','#FFFFFF'],
                    java:    ['#FFD700','#FFFACD','#FFA500']
                };
                const colors = palettes[this.data.style] || palettes.classic;
                for (let i = 0; i < this.data.count; i++) {
                    const el = document.createElement('a-sphere');
                    const r = 0.015 + Math.random() * 0.02;
                    el.setAttribute('radius', r);
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    el.setAttribute('color', color);
                    el.setAttribute('material', `emissive: ${color}; emissiveIntensity: 1.5; roughness: 0.1`);
                    const x = (Math.random() - 0.5) * 3.5;
                    const y = Math.random() * 3.5;
                    const z = (Math.random() - 0.5) * 3.5;
                    el.setAttribute('position', { x, y, z });
                    this.el.appendChild(el);
                    this.sparks.push({ el, ox: x, oy: y, oz: z, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.7 });
                }
                this.t = 0;
            },
            tick: function (time, dt) {
                this.t += dt * 0.001;
                this.sparks.forEach(s => {
                    const fl = Math.sin(this.t * s.speed + s.phase) * 0.12;
                    s.el.setAttribute('position', { x: s.ox + fl * 0.5, y: s.oy + fl, z: s.oz + fl * 0.3 });
                });
            }
        });

        // ─── 4. SCALE-IN ENTRANCE ANIMATION ──────────────────────────────────
        AFRAME.registerComponent('scale-entrance', {
            schema: { delay: { type: 'number', default: 0 } },
            init: function () {
                this.el.setAttribute('scale', '0 0 0');
                this.el.setAttribute('visible', false);
                setTimeout(() => {
                    this.el.setAttribute('visible', true);
                    this.el.setAttribute('animation', 'property: scale; from: 0 0 0; to: 1 1 1; dur: 800; easing: easeOutElastic');
                }, this.data.delay);
            }
        });

        // ─── 5. FLOATING BOB ANIMATION ────────────────────────────────────────
        AFRAME.registerComponent('float-bob', {
            schema: { amp: { type: 'number', default: 0.08 }, speed: { type: 'number', default: 1.0 } },
            init: function () {
                this.t = 0;
                this.baseY = this.el.getAttribute('position').y;
            },
            tick: function (time, dt) {
                this.t += dt * 0.001 * this.data.speed;
                const pos = this.el.getAttribute('position');
                pos.y = this.baseY + Math.sin(this.t) * this.data.amp;
                this.el.setAttribute('position', pos);
            }
        });

        // ─── 6. NAME PULSE GLOW ────────────────────────────────────────────────
        AFRAME.registerComponent('name-pulse', {
            schema: { color: { type: 'string', default: '#FFD700' } },
            init: function () { this.t = 0; },
            tick: function (time, dt) {
                this.t += dt * 0.001;
                const intensity = 0.8 + Math.sin(this.t * 2) * 0.5;
                this.el.setAttribute('material', `emissive: ${this.data.color}; emissiveIntensity: ${intensity}`);
            }
        });
    </script>

    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            overflow: hidden;
            font-family: 'Outfit', sans-serif;
            background-color: #000;
        }

        /* ── Overlay ── */
        #ar-overlay {
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: linear-gradient(160deg, #0f0c29, #302b63, #24243e);
            z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            color: white; text-align: center;
            padding: 28px; transition: opacity 0.7s ease, visibility 0.7s;
        }
        #ar-overlay.hidden { opacity: 0; visibility: hidden; pointer-events: none; }

        .overlay-glow-ring {
            width: 100px; height: 100px; border-radius: 50%;
            background: radial-gradient(circle, rgba(229,101,75,0.25), transparent 70%);
            border: 2px solid rgba(229,101,75,0.6);
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 22px;
            box-shadow: 0 0 30px rgba(229,101,75,0.4), inset 0 0 20px rgba(229,101,75,0.1);
            overflow: hidden;
            animation: ringPulse 2.5s ease-in-out infinite;
        }
        @keyframes ringPulse {
            0%,100% { box-shadow: 0 0 20px rgba(229,101,75,0.4); }
            50%      { box-shadow: 0 0 45px rgba(229,101,75,0.8), 0 0 80px rgba(229,101,75,0.3); }
        }
        .overlay-glow-ring img { width: 100%; height: 100%; object-fit: cover; }

        .overlay-title {
            font-family: 'Great Vibes', cursive;
            font-size: 46px; margin: 0 0 6px;
            background: linear-gradient(135deg, #FFD700, #ff9a5c, #FFD700);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 2px 8px rgba(255,215,0,0.4));
        }
        .overlay-ampersand {
            font-family: 'Great Vibes', cursive; font-size: 30px; color: #ff9a5c;
            display: block; margin: 0 0 4px;
        }
        .overlay-subtitle {
            font-size: 10px; letter-spacing: 0.3em; color: #ff9d85;
            text-transform: uppercase; font-weight: 600; margin-bottom: 28px;
        }
        .instructions-box {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 18px; padding: 16px 20px;
            max-width: 300px; font-size: 12.5px; color: #ccc; line-height: 1.7;
            margin-bottom: 28px; backdrop-filter: blur(6px);
        }
        .instructions-box p { margin: 5px 0; display: flex; align-items: center; gap: 8px; }
        .btn-start {
            background: linear-gradient(135deg, #E5654B, #c0392b);
            border: none; color: white; padding: 16px 44px;
            font-size: 14px; font-weight: 700; letter-spacing: 0.1em;
            border-radius: 50px; cursor: pointer; font-family: 'Cinzel', serif;
            box-shadow: 0 10px 30px rgba(229,101,75,0.5);
            transition: all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
            text-transform: uppercase;
        }
        .btn-start:hover  { transform: scale(1.05); box-shadow: 0 16px 40px rgba(229,101,75,0.7); }
        .btn-start:active { transform: scale(0.97); }

        /* ── Scan Status ── */
        #scan-status {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            z-index: 1000; background: rgba(0,0,0,0.6);
            border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(10px);
            padding: 10px 22px; border-radius: 30px; color: white;
            font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em;
            pointer-events: none; display: none; align-items: center; gap: 9px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4); max-width: 85%;
        }
        .pulse-dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: #E5654B; animation: dot-pulse 1.4s ease-in-out infinite;
        }
        @keyframes dot-pulse {
            0%,100% { transform: scale(0.8); opacity: 0.5; }
            50%      { transform: scale(1.3); opacity: 1; }
        }

        /* ── Bottom UI ── */
        #ar-ui-overlay {
            position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
            z-index: 1000; display: none; flex-direction: column; align-items: center;
            gap: 10px; width: 100%; max-width: 300px; padding: 0 16px;
        }
        .btn-back-invitation {
            background: rgba(255,255,255,0.12); backdrop-filter: blur(14px);
            border: 1px solid rgba(255,255,255,0.22); color: white;
            padding: 13px 26px; border-radius: 28px; text-decoration: none;
            font-weight: 700; font-size: 12px; letter-spacing: 0.07em;
            box-shadow: 0 6px 24px rgba(0,0,0,0.25); transition: all 0.3s;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; text-transform: uppercase;
        }
        .btn-back-invitation:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }

        /* ── Target Frame ── */
        #target-frame {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 240px; height: 240px;
            border: 1.5px dashed rgba(255,255,255,0.35); border-radius: 12px;
            pointer-events: none; z-index: 500; display: none;
            box-shadow: 0 0 0 9999px rgba(0,0,0,0.3);
        }
        .corner { position: absolute; width: 22px; height: 22px; border-color: #E5654B; border-style: solid; }
        .top-left    { top:-2px; left:-2px;   border-width: 4px 0 0 4px; border-top-left-radius: 8px; }
        .top-right   { top:-2px; right:-2px;  border-width: 4px 4px 0 0; border-top-right-radius: 8px; }
        .bottom-left { bottom:-2px; left:-2px; border-width: 0 0 4px 4px; border-bottom-left-radius: 8px; }
        .bottom-right{ bottom:-2px; right:-2px;border-width: 0 4px 4px 0; border-bottom-right-radius: 8px; }

        /* ── A-Frame UI hiders ── */
        .a-loader-title { display: none !important; }
        .a-enter-vr     { display: none !important; }
    </style>
</head>
<body>
@php
    $arStyle = $invitation->ar_style ?? 'classic';
    $groom   = $groomNickname ?? 'Groom';
    $bride   = $brideNickname ?? 'Bride';
    $fullNames = $groom . ' & ' . $bride;

    // Per-style palette helpers
    $nameColor    = $arStyle === 'cosmic' ? '#00FFFF' : ($arStyle === 'java' ? '#FFD700' : '#FFD700');
    $nameShadow   = $arStyle === 'cosmic' ? '#0044ff' : ($arStyle === 'java' ? '#8B4513' : '#C0392B');
    $cardBg       = $arStyle === 'cosmic' ? '#080d1a' : ($arStyle === 'java' ? '#3B0A00' : '#FFF8F6');
    $borderColor  = $arStyle === 'cosmic' ? '#00FFFF' : '#D4AF37';
    $innerBg      = $arStyle === 'cosmic' ? '#0f1a2e' : ($arStyle === 'java' ? '#5C0A00' : '#FFF8F6');
    $dateColor    = $arStyle === 'cosmic' ? '#7fbfff' : ($arStyle === 'java' ? '#FFDEAD' : '#888');
    $backBg       = $arStyle === 'cosmic' ? '#0f1a2e' : ($arStyle === 'java' ? '#8B1A1A' : '#C0392B');
@endphp

    <!-- ── 1. START SCREEN OVERLAY ── -->
    <div id="ar-overlay">
        <div class="overlay-glow-ring">
            @if($invitation->cover_image)
                <img src="{{ $photoUrl }}" alt="Cover">
            @else
                <svg fill="none" stroke="#E5654B" viewBox="0 0 24 24" style="width:48px;height:48px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
            @endif
        </div>
        <h1 class="overlay-title">{{ $groom }}</h1>
        <span class="overlay-ampersand">&amp;</span>
        <h1 class="overlay-title">{{ $bride }}</h1>
        <p class="overlay-subtitle">✦ Augmented Reality Invitation ✦</p>

        <div class="instructions-box">
            <p><strong>Cara Menikmati AR:</strong></p>
            <p>🔔 Aktifkan volume HP Anda</p>
            <p>📷 Izinkan akses kamera</p>
            <p>🎯 Arahkan ke <strong>Marker Hiro</strong> di kartu</p>
        </div>

        <button class="btn-start" id="start-btn">✦ Buka Undangan AR ✦</button>
    </div>

    <!-- ── 2. SCAN STATUS ── -->
    <div id="scan-status">
        <div class="pulse-dot"></div>
        <span id="scan-text">Mencari Marker Hiro...</span>
    </div>

    <!-- ── 3. TARGET FRAME ── -->
    <div id="target-frame">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
    </div>

    <!-- ── 4. BOTTOM ACTION UI ── -->
    <div id="ar-ui-overlay">
        <a href="{{ route('invitation.show', ['slug' => $invitation->slug]) }}" class="btn-back-invitation">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            Buka Buku Undangan
        </a>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- 5. WEBАР A-SCENE                                                   -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!--
        A-SCENE SETTINGS:
        - patternRatio: 0.5  → detects marker dari jarak lebih jauh
        - maxDetectionRate: 60 → polling lebih sering = lebih responsif
        - smoothCount: 10    → rata-rata 10 frame posisi → kurangi goyang / putus
        - smoothTolerance: 0.01 → toleransi pergerakan kecil agar tidak reset
        - smoothThreshold: 5 → threshold sebelum reset tracking
    -->
    <a-scene
        embedded
        @if($hasNft)
        arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; smoothCount: 10; smoothTolerance: 0.01; smoothThreshold: 5;"
        @else
        arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; patternRatio: 0.5; maxDetectionRate: 60; smoothCount: 10; smoothTolerance: 0.01; smoothThreshold: 5;"
        @endif
        renderer="antialias: true; colorManagement: true; logarithmicDepthBuffer: true; physicallyCorrectLights: true;"
        vr-mode-ui="enabled: false">

        <!-- ── Assets ── -->
        <a-assets timeout="5000">
            <img id="wedding-photo" src="{{ $photoUrl }}" crossorigin="anonymous">
        </a-assets>

        {{-- ══════════ MARKER MODE ══════════ --}}
        @if($hasNft)
        {{-- NFT MODE: QR code sendiri sebagai marker --}}
        <a-nft
            id="ar-marker"
            type="nft"
            url="{{ $nftBasePath }}"
            smooth="true"
            smoothCount="10"
            smoothTolerance="0.01"
            smoothThreshold="5">
        @else
        {{-- FALLBACK: Hiro pattern marker --}}
        <a-marker preset="hiro" id="ar-marker">
        @endif

            <!-- ── Global Particle Systems ── -->
            <a-entity petal-rain="count: 70; style: {{ $arStyle }}"></a-entity>
            <a-entity fireworks-burst="style: {{ $arStyle }}"></a-entity>
            <a-entity sparkle-field="count: 35; style: {{ $arStyle }}"></a-entity>

            <!-- ════════════════════════════════════════════════════════════
                 STYLE: CLASSIC — Romantic Floral Wedding Arch
                 ════════════════════════════════════════════════════════ -->
            @if($arStyle === 'classic')

            <!-- GRAND PEDESTAL BASE -->
            <a-entity scale-entrance="delay: 0" position="0 0 0">
                <!-- Marble Base Platform -->
                <a-cylinder position="0 0.03 0" radius="1.4" height="0.06" color="#F5F5F5"
                             material="roughness: 0.3; metalness: 0.4; color: #FAFAFA"></a-cylinder>
                <a-torus position="0 0.06 0" radius="1.4" radius-tubular="0.02" color="#D4AF37"
                         material="metalness: 0.9; roughness: 0.1"></a-torus>

                <!-- LEFT PILLAR (detailed) -->
                <a-entity position="-1.0 0 0">
                    <a-cylinder position="0 0.06 0" radius="0.1" height="0.12" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                    <a-cylinder position="0 0.7 0" radius="0.065" height="1.2" color="#FFF8F0" material="roughness: 0.5; metalness: 0.2"></a-cylinder>
                    <a-cylinder position="0 1.35 0" radius="0.09" height="0.1" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                    <!-- Floral clusters on pillar -->
                    <a-sphere position="0.07 0.5 0.07" radius="0.07" color="#FF85A1" animation="property: scale; from: 0.9 0.9 0.9; to: 1.1 1.1 1.1; loop: true; dir: alternate; dur: 900"></a-sphere>
                    <a-sphere position="-0.06 0.75 0.06" radius="0.06" color="#FFB7C5"></a-sphere>
                    <a-sphere position="0.07 1.0 0.07" radius="0.07" color="#FFFFFF"></a-sphere>
                    <a-sphere position="-0.05 0.3 0.07" radius="0.05" color="#82E0AA"></a-sphere>
                    <a-sphere position="0.06 1.2 0.05" radius="0.055" color="#52BE80"></a-sphere>
                </a-entity>

                <!-- RIGHT PILLAR (mirrored) -->
                <a-entity position="1.0 0 0">
                    <a-cylinder position="0 0.06 0" radius="0.1" height="0.12" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                    <a-cylinder position="0 0.7 0" radius="0.065" height="1.2" color="#FFF8F0" material="roughness: 0.5; metalness: 0.2"></a-cylinder>
                    <a-cylinder position="0 1.35 0" radius="0.09" height="0.1" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                    <a-sphere position="-0.07 0.5 0.07" radius="0.07" color="#FF85A1" animation="property: scale; from: 0.9 0.9 0.9; to: 1.1 1.1 1.1; loop: true; dir: alternate; dur: 860"></a-sphere>
                    <a-sphere position="0.06 0.75 0.06" radius="0.06" color="#FFB7C5"></a-sphere>
                    <a-sphere position="-0.07 1.0 0.07" radius="0.07" color="#FFFFFF"></a-sphere>
                    <a-sphere position="0.05 0.3 0.07" radius="0.05" color="#82E0AA"></a-sphere>
                    <a-sphere position="-0.06 1.2 0.05" radius="0.055" color="#52BE80"></a-sphere>
                </a-entity>

                <!-- ARCH TOP — gold half torus -->
                <a-torus position="0 1.45 0" radius="1.0" radius-tubular="0.04" arc="180"
                         color="#D4AF37" rotation="0 0 0" material="metalness: 0.9; roughness: 0.1"></a-torus>
                <!-- Decorative inner arch -->
                <a-torus position="0 1.45 0" radius="0.88" radius-tubular="0.015" arc="180"
                         color="#FFD700" rotation="0 0 0" material="metalness: 0.95; roughness: 0.05"></a-torus>

                <!-- Floral crown on arch top -->
                <a-sphere position="-1.0 1.45 0" radius="0.11" color="#FF1493" material="emissive: #FF1493; emissiveIntensity: 0.3" animation="property: scale; from: 1 1 1; to: 1.15 1.15 1.15; loop: true; dir: alternate; dur: 700"></a-sphere>
                <a-sphere position="-0.75 1.76 0.02" radius="0.09" color="#FFB6C1"></a-sphere>
                <a-sphere position="-0.45 1.95 0.03" radius="0.1" color="#FFFFFF"></a-sphere>
                <a-sphere position="0 2.08 0.03" radius="0.1" color="#FF85A1" material="emissive: #FF1493; emissiveIntensity: 0.2" animation="property: scale; from: 1 1 1; to: 1.1 1.1 1.1; loop: true; dir: alternate; dur: 1000"></a-sphere>
                <a-sphere position="0.45 1.95 0.03" radius="0.1" color="#FFFFFF"></a-sphere>
                <a-sphere position="0.75 1.76 0.02" radius="0.09" color="#FFB6C1"></a-sphere>
                <a-sphere position="1.0 1.45 0" radius="0.11" color="#FF1493" material="emissive: #FF1493; emissiveIntensity: 0.3" animation="property: scale; from: 1 1 1; to: 1.15 1.15 1.15; loop: true; dir: alternate; dur: 720"></a-sphere>
            </a-entity>

            <!-- GIANT BEATING HEART at summit -->
            <a-entity scale-entrance="delay: 400" position="0 2.45 0"
                      animation="property: scale; from: 0.85 0.85 0.85; to: 1.0 1.0 1.0; loop: true; dir: alternate; dur: 900; easing: easeInOutSine"
                      float-bob="amp: 0.04; speed: 0.8">
                <a-sphere position="-0.1 0 0" radius="0.12" color="#E5654B" material="emissive: #E5654B; emissiveIntensity: 1.5; roughness: 0.1"></a-sphere>
                <a-sphere position="0.1 0 0" radius="0.12" color="#E5654B" material="emissive: #E5654B; emissiveIntensity: 1.5; roughness: 0.1"></a-sphere>
                <a-cone position="0 -0.1 0" radius-bottom="0.12" height="0.25" rotation="180 0 0" color="#C0392B" material="emissive: #C0392B; emissiveIntensity: 1.2"></a-cone>
                <!-- glow ring around heart -->
                <a-torus radius="0.22" radius-tubular="0.012" color="#FF6B6B" material="emissive: #FF6B6B; emissiveIntensity: 0.8; transparent: true; opacity: 0.5"
                         animation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear"></a-torus>
            </a-entity>

            <!-- 3 ORBITING WHITE DOVES -->
            <a-entity scale-entrance="delay: 600" position="0 2.1 0"
                      animation="property: rotation; to: 0 360 0; loop: true; dur: 9000; easing: linear">
                @foreach([['1.4', '0.3', '90'], ['-1.3', '0.6', '-90'], ['0.2', '0.9', '45']] as $idx => $dove)
                <a-entity position="{{ $dove[0] }} {{ $dove[1] }} 0" rotation="0 {{ $dove[2] }} 0">
                    <a-cone radius-bottom="0.04" radius-top="0.005" height="0.2" rotation="90 0 0" color="#FFFFFF" material="roughness: 0.3; metalness: 0.3"></a-cone>
                    <a-plane position="-0.1 0.01 0" width="0.22" height="0.08" color="#FFFFFF" material="side: double; roughness: 0.2"
                             animation="property: rotation; from: 0 0 0; to: 0 0 65; dir: alternate; loop: true; dur: {{ 200 + $idx * 15 }}; easing: easeInOutQuad"></a-plane>
                    <a-plane position="0.1 0.01 0" width="0.22" height="0.08" color="#FFFFFF" material="side: double; roughness: 0.2"
                             animation="property: rotation; from: 0 0 0; to: 0 0 -65; dir: alternate; loop: true; dur: {{ 200 + $idx * 15 }}; easing: easeInOutQuad"></a-plane>
                </a-entity>
                @endforeach
            </a-entity>

            @endif


            <!-- ════════════════════════════════════════════════════════════
                 STYLE: COSMIC — Space Nebula & Galaxy Rings
                 ════════════════════════════════════════════════════════ -->
            @if($arStyle === 'cosmic')

            <!-- PLATFORM BASE (space dock) -->
            <a-entity scale-entrance="delay: 0">
                <a-cylinder position="0 0.02 0" radius="1.5" height="0.04" color="#040d1e"
                             material="emissive: #00FFFF; emissiveIntensity: 0.08; roughness: 0.2; metalness: 0.9"></a-cylinder>
                <a-torus position="0 0.04 0" radius="1.5" radius-tubular="0.025" color="#00FFFF"
                         material="emissive: #00FFFF; emissiveIntensity: 1.2; roughness: 0.1; metalness: 0.9"></a-torus>
                <!-- pulsing inner ring -->
                <a-torus position="0 0.04 0" radius="1.0" radius-tubular="0.015" color="#BF5FFF"
                         material="emissive: #BF5FFF; emissiveIntensity: 1.0"
                         animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"></a-torus>
            </a-entity>

            <!-- 3 GALAXY RINGS orbiting center -->
            <a-entity scale-entrance="delay: 200" position="0 1.2 0">
                <!-- Horizontal cyan ring -->
                <a-torus radius="1.4" radius-tubular="0.022" color="#00FFFF" rotation="90 0 0"
                         material="emissive: #00FFFF; emissiveIntensity: 1.5; roughness: 0.05; metalness: 0.95"
                         animation="property: rotation; from: 90 0 0; to: 90 360 0; loop: true; dur: 7000; easing: linear"></a-torus>
                <!-- Tilted purple ring -->
                <a-torus radius="1.1" radius-tubular="0.018" color="#BF5FFF" rotation="55 30 0"
                         material="emissive: #BF5FFF; emissiveIntensity: 1.4; roughness: 0.05; metalness: 0.95"
                         animation="property: rotation; from: 55 30 0; to: 55 390 0; loop: true; dur: 9500; easing: linear"></a-torus>
                <!-- Magenta ring opposite tilt -->
                <a-torus radius="1.25" radius-tubular="0.012" color="#FF00FF" rotation="-40 60 0"
                         material="emissive: #FF00FF; emissiveIntensity: 1.2; roughness: 0.05; metalness: 0.95"
                         animation="property: rotation; from: -40 60 0; to: -40 420 0; loop: true; dur: 12000; easing: linear"></a-torus>
            </a-entity>

            <!-- GLOWING MOON + satellite -->
            <a-entity scale-entrance="delay: 300" position="0 2.6 0"
                      float-bob="amp: 0.1; speed: 0.6"
                      animation="property: rotation; to: 0 360 0; loop: true; dur: 18000; easing: linear">
                <a-sphere radius="0.18" color="#E8E8FF"
                          material="emissive: #6030A0; emissiveIntensity: 0.5; roughness: 0.9; metalness: 0.15"></a-sphere>
                <!-- craters -->
                <a-sphere position="0.08 0.1 0.14" radius="0.035" color="#CCCCEE" material="roughness: 1"></a-sphere>
                <a-sphere position="-0.12 -0.05 0.12" radius="0.025" color="#BBBBDD" material="roughness: 1"></a-sphere>
                <!-- Satellite ring around moon -->
                <a-torus radius="0.32" radius-tubular="0.01" color="#00FFFF"
                         material="emissive: #00FFFF; emissiveIntensity: 1.0"
                         rotation="45 0 0"
                         animation="property: rotation; from: 45 0 0; to: 45 360 0; loop: true; dur: 4000; easing: linear"></a-torus>
                <!-- tiny orbiting satellite body -->
                <a-entity position="0.32 0 0"
                          animation="property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear">
                    <a-box width="0.04" height="0.02" depth="0.07" color="#C0C0C0"
                           material="emissive: #88AAFF; emissiveIntensity: 0.5; metalness: 0.9; roughness: 0.1"></a-box>
                </a-entity>
            </a-entity>

            <!-- ORBITING CRYSTAL GEMS -->
            <a-entity scale-entrance="delay: 500" position="0 1.1 0"
                      animation="property: rotation; to: 0 360 0; loop: true; dur: 14000; easing: linear">
                <!-- Cyan octahedron -->
                <a-entity position="1.5 0.3 0"
                          animation="property: rotation; to: 360 360 360; loop: true; dur: 3500; easing: linear">
                    <a-octahedron radius="0.1" color="#00FFFF"
                                  material="emissive: #00FFFF; emissiveIntensity: 1.2; roughness: 0.05; metalness: 0.95"></a-octahedron>
                </a-entity>
                <!-- Purple octahedron -->
                <a-entity position="-1.5 -0.2 0.2"
                          animation="property: rotation; to: 360 0 360; loop: true; dur: 4500; easing: linear">
                    <a-octahedron radius="0.09" color="#BF5FFF"
                                  material="emissive: #BF5FFF; emissiveIntensity: 1.2; roughness: 0.05; metalness: 0.95"></a-octahedron>
                </a-entity>
                <!-- Gold dodecahedron -->
                <a-entity position="0 0.9 -1.5"
                          animation="property: rotation; to: 0 360 360; loop: true; dur: 5500; easing: linear">
                    <a-dodecahedron radius="0.08" color="#FFD700"
                                    material="emissive: #FFD700; emissiveIntensity: 1.0; roughness: 0.05; metalness: 0.95"></a-dodecahedron>
                </a-entity>
            </a-entity>

            @endif


            <!-- ════════════════════════════════════════════════════════════
                 STYLE: JAVA — Keraton Javanese Gate & Lanterns
                 ════════════════════════════════════════════════════════ -->
            @if($arStyle === 'java')

            <!-- STONE COURT BASE -->
            <a-entity scale-entrance="delay: 0">
                <a-cylinder position="0 0.02 0" radius="1.5" height="0.06" color="#5C3317"
                             material="roughness: 0.95; metalness: 0.05"></a-cylinder>
                <a-torus position="0 0.05 0" radius="1.5" radius-tubular="0.025" color="#D4AF37"
                         material="metalness: 0.85; roughness: 0.15"></a-torus>
                <!-- inner decorative ring -->
                <a-torus position="0 0.055 0" radius="1.1" radius-tubular="0.015" color="#D4AF37"
                         material="metalness: 0.9; roughness: 0.1"
                         animation="property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear"></a-torus>
            </a-entity>

            <!-- CANDI BENTAR LEFT TOWER -->
            <a-entity scale-entrance="delay: 100" position="-1.05 0 0">
                <!-- Base block -->
                <a-box position="0 0.12 0" width="0.38" height="0.24" depth="0.38" color="#7A2E1A" material="roughness: 0.95"></a-box>
                <!-- Gold band -->
                <a-box position="0 0.26 0" width="0.42" height="0.06" depth="0.42" color="#D4AF37" material="metalness: 0.85; roughness: 0.15"></a-box>
                <!-- Main tower body -->
                <a-box position="0 0.72 0" width="0.26" height="1.0" depth="0.26" color="#8A3324" material="roughness: 0.9"></a-box>
                <!-- Narrow mid gold ring -->
                <a-box position="0 0.62 0" width="0.29" height="0.05" depth="0.29" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                <a-box position="0 0.92 0" width="0.29" height="0.05" depth="0.29" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                <!-- Upper stepped roofs -->
                <a-box position="0 1.28 0" width="0.3" height="0.12" depth="0.3" color="#7A2E1A" material="roughness: 0.9"></a-box>
                <a-box position="0 1.38 0" width="0.22" height="0.1" depth="0.22" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                <a-box position="0 1.5 0" width="0.16" height="0.1" depth="0.16" color="#7A2E1A" material="roughness: 0.9"></a-box>
                <!-- Pinnacle spire -->
                <a-cone position="0 1.68 0" radius-bottom="0.08" height="0.28" segments-radial="6" rotation="0 30 0"
                        color="#D4AF37" material="metalness: 0.85; roughness: 0.15"></a-cone>
                <!-- Gold ornament ball -->
                <a-sphere position="0 1.85 0" radius="0.05" color="#FFD700" material="emissive: #FFD700; emissiveIntensity: 0.5; metalness: 0.95; roughness: 0.05"></a-sphere>
            </a-entity>

            <!-- CANDI BENTAR RIGHT TOWER (mirrored) -->
            <a-entity scale-entrance="delay: 150" position="1.05 0 0">
                <a-box position="0 0.12 0" width="0.38" height="0.24" depth="0.38" color="#7A2E1A" material="roughness: 0.95"></a-box>
                <a-box position="0 0.26 0" width="0.42" height="0.06" depth="0.42" color="#D4AF37" material="metalness: 0.85; roughness: 0.15"></a-box>
                <a-box position="0 0.72 0" width="0.26" height="1.0" depth="0.26" color="#8A3324" material="roughness: 0.9"></a-box>
                <a-box position="0 0.62 0" width="0.29" height="0.05" depth="0.29" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                <a-box position="0 0.92 0" width="0.29" height="0.05" depth="0.29" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                <a-box position="0 1.28 0" width="0.3" height="0.12" depth="0.3" color="#7A2E1A" material="roughness: 0.9"></a-box>
                <a-box position="0 1.38 0" width="0.22" height="0.1" depth="0.22" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                <a-box position="0 1.5 0" width="0.16" height="0.1" depth="0.16" color="#7A2E1A" material="roughness: 0.9"></a-box>
                <a-cone position="0 1.68 0" radius-bottom="0.08" height="0.28" segments-radial="6" rotation="0 30 0"
                        color="#D4AF37" material="metalness: 0.85; roughness: 0.15"></a-cone>
                <a-sphere position="0 1.85 0" radius="0.05" color="#FFD700" material="emissive: #FFD700; emissiveIntensity: 0.5; metalness: 0.95; roughness: 0.05"></a-sphere>
            </a-entity>

            <!-- HANGING JASMINE GARLAND (swag between towers) -->
            <a-entity scale-entrance="delay: 300">
                @foreach([[-0.8, 1.2], [-0.5, 1.05], [-0.25, 0.97], [0, 0.93], [0.25, 0.97], [0.5, 1.05], [0.8, 1.2]] as $b)
                <a-sphere position="{{ $b[0] }} {{ $b[1] }} 0" radius="0.055" color="#FFFDD0"
                          material="emissive: #FFFACD; emissiveIntensity: 0.2"></a-sphere>
                @endforeach
            </a-entity>

            <!-- HANGING LANTERNS -->
            <a-entity scale-entrance="delay: 250" position="-1.22 0.65 0.12"
                      animation="property: rotation; from: 0 0 -4; to: 0 0 4; loop: true; dir: alternate; dur: 2200; easing: easeInOutSine">
                <a-cylinder radius="0.055" height="0.18" color="#B22222" material="emissive: #8B0000; emissiveIntensity: 0.4; roughness: 0.7"></a-cylinder>
                <a-cylinder position="0 0.1 0" radius="0.07" height="0.025" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                <a-cylinder position="0 -0.1 0" radius="0.07" height="0.025" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                <a-cone position="0 -0.16 0" radius-bottom="0.01" height="0.1" rotation="180 0 0" color="#D4AF37" material="metalness: 0.7"></a-cone>
            </a-entity>
            <a-entity scale-entrance="delay: 280" position="1.22 0.65 0.12"
                      animation="property: rotation; from: 0 0 4; to: 0 0 -4; loop: true; dir: alternate; dur: 2400; easing: easeInOutSine">
                <a-cylinder radius="0.055" height="0.18" color="#B22222" material="emissive: #8B0000; emissiveIntensity: 0.4; roughness: 0.7"></a-cylinder>
                <a-cylinder position="0 0.1 0" radius="0.07" height="0.025" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                <a-cylinder position="0 -0.1 0" radius="0.07" height="0.025" color="#D4AF37" material="metalness: 0.9; roughness: 0.1"></a-cylinder>
                <a-cone position="0 -0.16 0" radius-bottom="0.01" height="0.1" rotation="180 0 0" color="#D4AF37" material="metalness: 0.7"></a-cone>
            </a-entity>

            <!-- GOLDEN BIRDS orbiting above -->
            <a-entity scale-entrance="delay: 600" position="0 2.2 0"
                      animation="property: rotation; to: 0 360 0; loop: true; dur: 11000; easing: linear">
                @foreach([['1.4', '0.35', '90'], ['-1.35', '0.5', '-90']] as $idx => $bird)
                <a-entity position="{{ $bird[0] }} {{ $bird[1] }} 0" rotation="0 {{ $bird[2] }} 0">
                    <a-cone radius-bottom="0.04" radius-top="0.005" height="0.2" rotation="90 0 0"
                            color="#D4AF37" material="metalness: 0.8; roughness: 0.2; emissive: #B8860B; emissiveIntensity: 0.3"></a-cone>
                    <a-plane position="-0.11 0.01 0" width="0.22" height="0.08" color="#D4AF37"
                             material="side: double; metalness: 0.7; roughness: 0.3"
                             animation="property: rotation; from: 0 0 0; to: 0 0 58; dir: alternate; loop: true; dur: {{ 230 + $idx * 20 }}; easing: easeInOutQuad"></a-plane>
                    <a-plane position="0.11 0.01 0" width="0.22" height="0.08" color="#D4AF37"
                             material="side: double; metalness: 0.7; roughness: 0.3"
                             animation="property: rotation; from: 0 0 0; to: 0 0 -58; dir: alternate; loop: true; dur: {{ 230 + $idx * 20 }}; easing: easeInOutQuad"></a-plane>
                </a-entity>
                @endforeach
            </a-entity>

            @endif


            <!-- ════════════════════════════════════════════════════════════
                 MAIN FEATURE: PHOTO FRAME + NAMES DISPLAY (all styles)
                 3D portrait frame with circular photo, large glowing names,
                 and floating date — all in the center of the AR scene.
                 ════════════════════════════════════════════════════════ -->
            <a-entity id="main-display" scale-entrance="delay: 700"
                      position="0 0.9 0"
                      float-bob="amp: 0.06; speed: 0.55">

                <!-- ── PHOTO CIRCLE FRAME ── -->
                <!-- Back backing disc -->
                <a-cylinder position="0 0.75 0.01" radius="0.44" height="0.04"
                             color="{{ $borderColor }}"
                             material="metalness: 0.85; roughness: 0.15; emissive: {{ $borderColor }}; emissiveIntensity: 0.2"
                             rotation="90 0 0"></a-cylinder>
                <!-- White photo disc -->
                <a-cylinder position="0 0.75 0.04" radius="0.40" height="0.04"
                             color="#FFFFFF"
                             material="roughness: 0.5; metalness: 0.1"
                             rotation="90 0 0"></a-cylinder>
                <!-- Photo texture mapped onto circle -->
                <a-circle position="0 0.75 0.065" radius="0.38"
                           material="src: #wedding-photo; roughness: 1; side: front"></a-circle>
                <!-- Glowing outer ring, slowly rotating -->
                <a-torus position="0 0.75 0.05" radius="0.45" radius-tubular="0.018"
                         color="{{ $borderColor }}"
                         material="emissive: {{ $borderColor }}; emissiveIntensity: 0.8; metalness: 0.9; roughness: 0.05"
                         animation="property: rotation; from: 0 0 0; to: 0 0 360; loop: true; dur: 12000; easing: linear"></a-torus>
                <!-- Diamond accents at cardinal points of ring -->
                @foreach([[0, 0.45], [0.45, 0], [0, -0.45], [-0.45, 0]] as $d)
                <a-octahedron position="{{ $d[0] }} {{ 0.75 + $d[1] }} 0.05" radius="0.035"
                               color="{{ $borderColor }}"
                               material="emissive: {{ $borderColor }}; emissiveIntensity: 1.0; metalness: 0.95; roughness: 0.05"
                               animation="property: rotation; to: 360 360 0; loop: true; dur: 3000; easing: linear"></a-octahedron>
                @endforeach

                <!-- ── GROOM NAME ── -->
                <!-- Shadow layer -->
                <a-text value="{{ $groom }}"
                        color="{{ $nameShadow }}"
                        align="center"
                        position="0.015 0.18 0.03"
                        width="4.5"
                        font="roboto"
                        wrap-count="14"></a-text>
                <!-- Main bright layer -->
                <a-text value="{{ $groom }}"
                        color="{{ $nameColor }}"
                        align="center"
                        position="0 0.19 0.04"
                        width="4.5"
                        font="roboto"
                        wrap-count="14"></a-text>

                <!-- ── AMPERSAND ── -->
                <a-entity position="0 -0.01 0.04"
                          animation="property: scale; from: 0.9 0.9 0.9; to: 1.05 1.05 1.05; loop: true; dir: alternate; dur: 1400; easing: easeInOutSine">
                    <a-text value="&amp;"
                            color="{{ $borderColor }}"
                            align="center"
                            position="0 0 0"
                            width="3.5"
                            font="roboto"
                            wrap-count="4"></a-text>
                </a-entity>

                <!-- ── BRIDE NAME ── -->
                <a-text value="{{ $bride }}"
                        color="{{ $nameShadow }}"
                        align="center"
                        position="0.015 -0.2 0.03"
                        width="4.5"
                        font="roboto"
                        wrap-count="14"></a-text>
                <a-text value="{{ $bride }}"
                        color="{{ $nameColor }}"
                        align="center"
                        position="0 -0.19 0.04"
                        width="4.5"
                        font="roboto"
                        wrap-count="14"></a-text>

                <!-- ── DECORATIVE DIVIDER LINE ── -->
                <a-box position="0 -0.32 0.04" width="0.8" height="0.008" depth="0.005"
                       color="{{ $borderColor }}"
                       material="emissive: {{ $borderColor }}; emissiveIntensity: 0.6; metalness: 0.9"></a-box>

                <!-- ── WEDDING DATE ── -->
                <a-text value="{{ $weddingDate }}"
                        color="{{ $dateColor }}"
                        align="center"
                        position="0 -0.44 0.04"
                        width="2.8"
                        font="roboto"
                        wrap-count="22"></a-text>

                <!-- ── SMALL DECORATIVE HEARTS beside date ── -->
                @foreach([[-0.52, -0.44], [0.52, -0.44]] as $h)
                <a-entity position="{{ $h[0] }} {{ $h[1] }} 0.05"
                          animation="property: scale; from: 0.8 0.8 0.8; to: 1.1 1.1 1.1; loop: true; dir: alternate; dur: 1100; easing: easeInOutSine">
                    <a-sphere position="-0.025 0 0" radius="0.04" color="#E5654B" material="emissive: #E5654B; emissiveIntensity: 0.8"></a-sphere>
                    <a-sphere position="0.025 0 0"  radius="0.04" color="#E5654B" material="emissive: #E5654B; emissiveIntensity: 0.8"></a-sphere>
                    <a-cone position="0 -0.03 0" radius-bottom="0.04" height="0.08" rotation="180 0 0" color="#C0392B" material="emissive: #C0392B; emissiveIntensity: 0.7"></a-cone>
                </a-entity>
                @endforeach

            </a-entity>

            <!-- ─── DYNAMIC PER-STYLE LIGHTING ────────────────────────── -->
            @if($arStyle === 'cosmic')
                <!-- Cosmic: Deep purple ambient + cool cyan key + magenta fill -->
                <a-entity light="type: ambient; color: #2A0A4A; intensity: 0.5"></a-entity>
                <a-entity light="type: point; color: #00FFFF; intensity: 2.8; distance: 8" position="0 3 1"></a-entity>
                <a-entity light="type: point; color: #FF00FF; intensity: 1.2; distance: 5" position="-1.5 1 0"></a-entity>
                <a-entity light="type: point; color: #7B2FFF; intensity: 1.0; distance: 5" position="1.5 1 0"></a-entity>
            @elseif($arStyle === 'java')
                <!-- Java: Warm golden sunset + deep orange key + crimson fill -->
                <a-entity light="type: ambient; color: #3D1A00; intensity: 0.6"></a-entity>
                <a-entity light="type: point; color: #FFD700; intensity: 2.6; distance: 8" position="0 3 1"></a-entity>
                <a-entity light="type: point; color: #FF6600; intensity: 1.0; distance: 5" position="-1.5 0.5 0"></a-entity>
                <a-entity light="type: point; color: #FFDEAD; intensity: 0.8; distance: 5" position="1.5 1.5 0"></a-entity>
            @else
                <!-- Classic: Warm natural white + soft rose key + golden fill -->
                <a-entity light="type: ambient; color: #FFF5EE; intensity: 0.7"></a-entity>
                <a-entity light="type: point; color: #FFEAD4; intensity: 2.0; distance: 8" position="0 3 1.5"></a-entity>
                <a-entity light="type: point; color: #FFB7C5; intensity: 1.0; distance: 5" position="-1.5 1.5 0"></a-entity>
                <a-entity light="type: point; color: #FFD700; intensity: 0.8; distance: 5" position="1.5 1 0"></a-entity>
            @endif

        @if($hasNft)
        </a-nft>
        @else
        </a-marker>
        @endif
        <!-- ── Active Camera ── -->
        <a-entity camera></a-entity>
    </a-scene>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- 6. CONTROL SCRIPT                                                  -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <script>
        const musicUrl  = "{{ $musicUrl }}";
        const bgMusic   = new Audio(musicUrl);
        bgMusic.loop    = true;
        bgMusic.volume  = 0.75;

        const isNftMode  = {{ $hasNft ? 'true' : 'false' }};

        const startBtn   = document.getElementById('start-btn');
        const overlay    = document.getElementById('ar-overlay');
        const scanStatus = document.getElementById('scan-status');
        const targetFrame= document.getElementById('target-frame');
        const uiOverlay  = document.getElementById('ar-ui-overlay');
        const scanText   = document.getElementById('scan-text');

        let hasInteracted = false;

        startBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            scanStatus.style.display = 'flex';
            targetFrame.style.display = 'block';
            uiOverlay.style.display  = 'flex';

            bgMusic.play()
                .then(() => console.log('🎵 Music playing'))
                .catch(e => console.warn('Audio blocked:', e));

            hasInteracted = true;
        });

        // Wait for A-Frame scene to initialize before binding marker events
        document.querySelector('a-scene').addEventListener('loaded', () => {
            const marker = document.getElementById('ar-marker');
            if (!marker) return;

            const foundEvent = isNftMode ? 'targetFound' : 'markerFound';
            const lostEvent  = isNftMode ? 'targetLost'  : 'markerLost';
            const lostText   = isNftMode
                ? 'Arahkan Kamera ke QR Code Undangan...'
                : 'Arahkan Kamera ke Marker Hiro...';

            marker.addEventListener(foundEvent, () => {
                if (!hasInteracted) return;
                scanStatus.style.background = 'rgba(229, 101, 75, 0.85)';
                scanText.innerText = '✦ ' + (isNftMode ? 'QR Terdeteksi!' : 'Marker Ditemukan!') + ' ✦';
                targetFrame.style.display = 'none';
                setTimeout(() => {
                    if (scanStatus.style.background.includes('229')) {
                        scanStatus.style.display = 'none';
                    }
                }, 2200);
            });

            marker.addEventListener(lostEvent, () => {
                if (!hasInteracted) return;
                scanStatus.style.display   = 'flex';
                scanStatus.style.background= 'rgba(0,0,0,0.6)';
                scanText.innerText = lostText;
                targetFrame.style.display  = 'block';
            });
        });
    </script>
</body>
</html>

