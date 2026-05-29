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
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">

    <!-- AR.js & A-Frame library resources -->
    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>

    <!-- Custom A-Frame Components for Grand Wedding Effects -->
    <script>
        // 1. Confetti/Petals falling down around the marker
        AFRAME.registerComponent('confetti-rain', {
            schema: {
                count: {type: 'int', default: 60},
                style: {type: 'string', default: 'classic'}
            },
            init: function() {
                this.petals = [];
                let colors = ['#FFC0CB', '#FF69B4', '#FFD700', '#FFF8F6', '#FF0000']; // classic colors
                
                if (this.data.style === 'cosmic') {
                    colors = ['#00FFFF', '#8A2BE2', '#4B0082', '#E6E6FA', '#C0C0C0', '#4169E1']; // cosmic colors
                } else if (this.data.style === 'java') {
                    colors = ['#D4AF37', '#FFD700', '#B8860B', '#FFFDD0', '#E59866']; // golden javanese colors
                }

                for (let i = 0; i < this.data.count; i++) {
                    const petal = document.createElement('a-plane');
                    
                    // Position randomly
                    const x = (Math.random() - 0.5) * 4;
                    const y = Math.random() * 5 + 1;
                    const z = (Math.random() - 0.5) * 4;
                    
                    petal.setAttribute('position', {x: x, y: y, z: z});
                    petal.setAttribute('rotation', {
                        x: Math.random() * 360,
                        y: Math.random() * 360,
                        z: Math.random() * 360
                    });
                    
                    const size = 0.04 + Math.random() * 0.06;
                    petal.setAttribute('width', size);
                    petal.setAttribute('height', size * 1.5);
                    petal.setAttribute('color', colors[Math.floor(Math.random() * colors.length)]);
                    
                    if (this.data.style === 'cosmic') {
                        petal.setAttribute('material', 'side: double; depthWrite: false; roughness: 0.2; metalness: 0.8; emissive: ' + colors[Math.floor(Math.random() * colors.length)] + '; emissiveIntensity: 0.5');
                    } else {
                        petal.setAttribute('material', 'side: double; depthWrite: false; roughness: 0.8');
                    }
                    
                    this.el.appendChild(petal);
                    this.petals.push({
                        el: petal,
                        speedY: (this.data.style === 'java' ? 0.008 : 0.012) + Math.random() * 0.016,
                        speedX: (Math.random() - 0.5) * 0.004,
                        rotSpeed: 1 + Math.random() * 2
                    });
                }
            },
            tick: function() {
                this.petals.forEach(p => {
                    const pos = p.el.getAttribute('position');
                    const rot = p.el.getAttribute('rotation');
                    
                    pos.y -= p.speedY;
                    pos.x += p.speedX + Math.sin(pos.y * 2) * 0.002;
                    
                    rot.x += p.rotSpeed;
                    rot.y += p.rotSpeed * 0.5;
                    
                    if (pos.y < 0) {
                        pos.y = 5;
                        pos.x = (Math.random() - 0.5) * 4;
                    }
                    
                    p.el.setAttribute('position', pos);
                    p.el.setAttribute('rotation', rot);
                });
            }
        });

        // 2. Continuous Fireworks Spark explosions above the arch
        AFRAME.registerComponent('fireworks-sparks', {
            schema: {
                style: {type: 'string', default: 'classic'}
            },
            init: function() {
                this.timer = 0;
                this.sparks = [];
            },
            tick: function(time, deltaTime) {
                this.timer += deltaTime;
                if (this.timer > 2500) { // explode every 2.5 seconds
                    this.timer = 0;
                    this.launch();
                }
                
                // Update sparks
                for (let i = this.sparks.length - 1; i >= 0; i--) {
                    const spark = this.sparks[i];
                    const pos = spark.el.getAttribute('position');
                    const scale = spark.el.getAttribute('scale');
                    
                    pos.x += spark.vel.x;
                    pos.y += spark.vel.y;
                    pos.z += spark.vel.z;
                    
                    spark.vel.y -= 0.0006; // gravity
                    
                    scale.x -= 0.015;
                    scale.y -= 0.015;
                    scale.z -= 0.015;
                    
                    spark.el.setAttribute('position', pos);
                    spark.el.setAttribute('scale', scale);
                    
                    if (scale.x <= 0) {
                        this.el.removeChild(spark.el);
                        this.sparks.splice(i, 1);
                    }
                }
            },
            launch: function() {
                // Burst origin above the wedding arch (x: -0.5 to 0.5, y: 2.3 to 2.6)
                const origin = {
                    x: (Math.random() - 0.5) * 1.5,
                    y: 2.3 + Math.random() * 0.4,
                    z: (Math.random() - 0.5) * 0.8
                };
                
                let colors = ['#FFD700', '#FF4500', '#FF1493', '#00FFFF', '#39FF14', '#FF8C00'];
                if (this.data.style === 'cosmic') {
                    colors = ['#00FFFF', '#E6E6FA', '#8A2BE2', '#39FF14', '#C0C0C0'];
                } else if (this.data.style === 'java') {
                    colors = ['#D4AF37', '#FFD700', '#FF4500', '#E59866'];
                }

                const color = colors[Math.floor(Math.random() * colors.length)];
                const count = 18;
                
                for (let i = 0; i < count; i++) {
                    const spark = document.createElement('a-sphere');
                    spark.setAttribute('position', origin);
                    spark.setAttribute('radius', 0.04);
                    spark.setAttribute('color', color);
                    spark.setAttribute('material', 'emissive: ' + color + '; emissiveIntensity: 2; metalness: 0.8');
                    spark.setAttribute('scale', '1 1 1');
                    
                    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
                    const pitch = (Math.random() - 0.5) * Math.PI;
                    const speed = 0.025 + Math.random() * 0.025;
                    
                    const vel = {
                        x: Math.cos(angle) * Math.cos(pitch) * speed,
                        y: Math.sin(pitch) * speed + 0.01,
                        z: Math.sin(angle) * Math.cos(pitch) * speed
                    };
                    
                    this.el.appendChild(spark);
                    this.sparks.push({ el: spark, vel: vel });
                }
            }
        });
    </script>

    <style>
        body {
            margin: 0;
            overflow: hidden;
            font-family: 'Outfit', sans-serif;
            background-color: #000;
        }

        /* Glassmorphic Start Screen Overlay */
        #ar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, rgba(20, 20, 20, 0.98), rgba(40, 40, 40, 0.96));
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            padding: 24px;
            box-sizing: border-box;
            backdrop-filter: blur(10px);
            transition: opacity 0.6s ease, visibility 0.6s;
        }

        #ar-overlay.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        .avatar-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(229, 101, 75, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px 0 rgba(229, 101, 75, 0.2);
            overflow: hidden;
        }

        .avatar-circle img {
            width: 100%;
            height: 100%;
            object-cover: cover;
        }

        .welcome-title {
            font-family: 'Great Vibes', cursive;
            font-size: 42px;
            margin: 0 0 10px 0;
            color: #ffeadb;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .welcome-subtitle {
            font-size: 14px;
            letter-spacing: 0.12em;
            color: #ff9d85;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 25px;
        }

        .instructions-box {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px;
            max-width: 320px;
            font-size: 13px;
            color: #d1d1d1;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .instructions-box p {
            margin: 6px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-start {
            background: linear-gradient(135deg, #E5654B, #d64e32);
            border: none;
            color: white;
            padding: 16px 40px;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.05em;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 12px 24px rgba(229, 101, 75, 0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .btn-start:hover {
            transform: scale(1.04);
            box-shadow: 0 16px 30px rgba(229, 101, 75, 0.6);
        }

        .btn-start:active {
            transform: scale(0.98);
        }

        /* Ambient scan status indicator on screen */
        #scan-status {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
            padding: 10px 20px;
            border-radius: 30px;
            color: white;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.03em;
            pointer-events: none;
            display: none;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 80%;
        }

        .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #E5654B;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.5; }
        }

        /* Dynamic Floating Action buttons */
        #ar-ui-overlay {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            display: none;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            width: 100%;
            max-width: 320px;
            box-sizing: border-box;
            padding: 0 16px;
        }

        .btn-back-invitation {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            color: white;
            padding: 14px 28px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 0.05em;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            text-transform: uppercase;
        }

        .btn-back-invitation:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
        }

        /* Frame overlay indicator */
        #target-frame {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 260px;
            height: 260px;
            border: 2px dashed rgba(255, 255, 255, 0.4);
            border-radius: 12px;
            pointer-events: none;
            z-index: 500;
            display: none;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
        }

        .corner {
            position: absolute;
            width: 20px;
            height: 20px;
            border-color: #E5654B;
            border-style: solid;
            pointer-events: none;
        }
        .top-left { top: -2px; left: -2px; border-width: 4px 0 0 4px; border-top-left-radius: 8px; }
        .top-right { top: -2px; right: -2px; border-width: 4px 4px 0 0; border-top-right-radius: 8px; }
        .bottom-left { bottom: -2px; left: -2px; border-width: 0 0 4px 4px; border-bottom-left-radius: 8px; }
        .bottom-right { bottom: -2px; right: -2px; border-width: 0 4px 4px 0; border-bottom-right-radius: 8px; }

        /* A-Frame standard elements loader hidden */
        .a-loader-title {
            display: none !important;
        }
        .a-enter-vr {
            display: none !important;
        }
    </style>
</head>
<body>
    @php
        $arStyle = $invitation->ar_style ?? 'classic';
    @endphp

    <!-- 1. Start Screen Glassmorphic Overlay -->
    <div id="ar-overlay">
        <div class="avatar-circle">
            @if($invitation->cover_image)
                <img src="{{ $photoUrl }}" alt="Cover">
            @else
                <svg className="w-12 h-12 text-[#E5654B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 50px; height: 50px; color: #E5654B; margin-top: 20px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            @endif
        </div>
        <h1 class="welcome-title">{{ $groomNickname }} & {{ $brideNickname }}</h1>
        <p class="welcome-subtitle">Augmented Reality Undangan</p>
        
        <div class="instructions-box">
            <p><strong>Cara Menikmati Efek AR:</strong></p>
            <p>🔔 Pastikan volume HP Anda aktif.</p>
            <p>📷 Berikan izin akses kamera setelah menekan tombol.</p>
            <p>🎯 Arahkan kamera ke pola <strong>Marker Hiro</strong> pada kartu AR.</p>
        </div>

        <button class="btn-start" id="start-btn">BUKA UNDANGAN AR</button>
    </div>

    <!-- 2. Screen Indicators -->
    <div id="scan-status">
        <div class="pulse-dot"></div>
        <span id="scan-text">Mencari Marker Hiro...</span>
    </div>

    <div id="target-frame">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
    </div>

    <!-- 3. Bottom Float Action UI -->
    <div id="ar-ui-overlay">
        <a href="{{ route('invitation.show', ['slug' => $invitation->slug]) }}" class="btn-back-invitation">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Buka Buku Undangan
        </a>
    </div>

    <!-- 4. WebAR Rendering Engine (A-Scene) -->
    <!-- Custom setting: VR-mode button is disabled, webcam sources size set to optimized viewport -->
    <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;" renderer="antialias: true; colorManagement: true; logarithmicDepthBuffer: true;">
        
        <a-assets>
            <img id="wedding-photo" src="{{ $photoUrl }}" crossorigin="anonymous">
        </a-assets>

        <!-- Detect Hiro Marker -->
        <a-marker preset="hiro" id="ar-marker">
            
            <!-- Particle & Firework Spark Generators inside Marker -->
            <a-entity confetti-rain="count: 60; style: {{ $arStyle }}"></a-entity>
            <a-entity fireworks-sparks="style: {{ $arStyle }}"></a-entity>

            @if($arStyle === 'classic')
            <!-- ================= STYLE: CLASSIC ================= -->
            <!-- 1. Gerbang Pernikahan Megah (3D Arch) -->
            <a-entity id="wedding-arch" position="0 0 0">
                <!-- Pillars Left and Right -->
                <a-cylinder position="-0.9 1 0" radius="0.06" height="2" color="#FFFFFF" material="roughness: 0.7"></a-cylinder>
                <a-cylinder position="0.9 1 0" radius="0.06" height="2" color="#FFFFFF" material="roughness: 0.7"></a-cylinder>
                
                <!-- Pillar Bases -->
                <a-box position="-0.9 0.05 0" width="0.2" height="0.1" depth="0.2" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                <a-box position="0.9 0.05 0" width="0.2" height="0.1" depth="0.2" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                
                <!-- Curved Gold Arch Top -->
                <a-torus position="0 2 0" radius="0.9" radius-tubular="0.03" arc="180" color="#D4AF37" rotation="0 0 0" material="metalness: 0.8; roughness: 0.2"></a-torus>

                <!-- Arch Flowers (Spheres representing beautiful roses) -->
                <a-sphere position="-0.9 2 0" radius="0.1" color="#FF69B4" animation="property: scale; from: 1 1 1; to: 1.1 1.1 1.1; loop: true; dir: alternate; dur: 800"></a-sphere>
                <a-sphere position="-0.7 2.4 0.02" radius="0.08" color="#FFB6C1"></a-sphere>
                <a-sphere position="-0.4 2.7 0.03" radius="0.09" color="#FFFFFF"></a-sphere>
                
                <!-- Glowing Center Wedding Heart above Arch -->
                <a-entity position="0 2.9 0" animation="property: scale; from: 0.8 0.8 0.8; to: 1.0 1.0 1.0; loop: true; dir: alternate; dur: 1200; easing: easeInOutQuad">
                    <a-sphere position="-0.07 0 0" radius="0.09" color="#E5654B" material="emissive: #E5654B; emissiveIntensity: 1.2"></a-sphere>
                    <a-sphere position="0.07 0 0" radius="0.09" color="#E5654B" material="emissive: #E5654B; emissiveIntensity: 1.2"></a-sphere>
                    <a-cone position="0 -0.07 0" radius-bottom="0.09" height="0.18" rotation="180 0 0" color="#E5654B" material="emissive: #E5654B; emissiveIntensity: 1.2"></a-cone>
                </a-entity>
                
                <a-sphere position="0.4 2.7 0.03" radius="0.09" color="#FFFFFF"></a-sphere>
                <a-sphere position="0.7 2.4 0.02" radius="0.08" color="#FFB6C1"></a-sphere>
                <a-sphere position="0.9 2 0" radius="0.1" color="#FF69B4" animation="property: scale; from: 1 1 1; to: 1.1 1.1 1.1; loop: true; dir: alternate; dur: 820"></a-sphere>

                <!-- Leaves Wrapped on Pillars -->
                <a-sphere position="-0.9 1.5 0.04" radius="0.07" color="#82E0AA"></a-sphere>
                <a-sphere position="-0.85 1.1 0.04" radius="0.06" color="#52BE80"></a-sphere>
                <a-sphere position="-0.9 0.7 0.04" radius="0.07" color="#82E0AA"></a-sphere>
                <a-sphere position="0.9 1.5 0.04" radius="0.07" color="#82E0AA"></a-sphere>
                <a-sphere position="0.85 1.1 0.04" radius="0.06" color="#52BE80"></a-sphere>
                <a-sphere position="0.9 0.7 0.04" radius="0.07" color="#82E0AA"></a-sphere>
            </a-entity>

            <!-- 2. Flapping White Doves (Burung Merpati) flying in circle above the Arch -->
            <a-entity position="0 2.2 0" animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear">
                <!-- Dove 1 -->
                <a-entity position="1.3 0.4 0" rotation="0 90 0">
                    <a-cone radius-bottom="0.035" radius-top="0.005" height="0.18" rotation="90 0 0" color="#FFFFFF"></a-cone>
                    <!-- Left flapping wing -->
                    <a-plane position="-0.09 0 0" width="0.18" height="0.07" color="#FFFFFF" material="side: double"
                              animation="property: rotation; from: 0 0 0; to: 0 0 60; dir: alternate; loop: true; dur: 220; easing: easeInOutQuad"></a-plane>
                    <!-- Right flapping wing -->
                    <a-plane position="0.09 0 0" width="0.18" height="0.07" color="#FFFFFF" material="side: double"
                              animation="property: rotation; from: 0 0 0; to: 0 0 -60; dir: alternate; loop: true; dur: 220; easing: easeInOutQuad"></a-plane>
                </a-entity>
                
                <!-- Dove 2 -->
                <a-entity position="-1.3 0.6 0.4" rotation="0 -90 0">
                    <a-cone radius-bottom="0.035" radius-top="0.005" height="0.18" rotation="90 0 0" color="#FFFFFF"></a-cone>
                    <a-plane position="-0.09 0 0" width="0.18" height="0.07" color="#FFFFFF" material="side: double"
                              animation="property: rotation; from: 0 0 0; to: 0 0 60; dir: alternate; loop: true; dur: 200; easing: easeInOutQuad"></a-plane>
                    <a-plane position="0.09 0 0" width="0.18" height="0.07" color="#FFFFFF" material="side: double"
                              animation="property: rotation; from: 0 0 0; to: 0 0 -60; dir: alternate; loop: true; dur: 200; easing: easeInOutQuad"></a-plane>
                </a-entity>
            </a-entity>

            <!-- 3. Floating Orbiting Gems/Hearts decoration -->
            <a-entity position="0 1 0" animation="property: rotation; to: 0 -360 0; loop: true; dur: 9000; easing: linear">
                <!-- Orbiting Heart Left -->
                <a-entity position="1.3 0 0" rotation="0 0 0">
                    <a-sphere position="-0.04 0 0" radius="0.06" color="#FF1493" material="emissive: #FF1493; emissiveIntensity: 0.5"></a-sphere>
                    <a-sphere position="0.04 0 0" radius="0.06" color="#FF1493" material="emissive: #FF1493; emissiveIntensity: 0.5"></a-sphere>
                    <a-cone position="0 -0.05 0" radius-bottom="0.06" height="0.12" rotation="180 0 0" color="#FF1493" material="emissive: #FF1493; emissiveIntensity: 0.5"></a-cone>
                </a-entity>
                
                <!-- Orbiting Star / Box Right -->
                <a-entity geometry="primitive: box; width: 0.08; height: 0.08; depth: 0.08" 
                          material="color: #FFD700; metalness: 0.9; roughness: 0.1" 
                          position="-1.3 0.2 -0.2"
                          animation="property: rotation; to: 360 360 0; loop: true; dur: 3000; easing: linear"></a-entity>
            </a-entity>
            @endif

            @if($arStyle === 'cosmic')
            <!-- ================= STYLE: COSMIC ================= -->
            <!-- 1. Orbiting Galaxy Rings (Futuristic Space Nebula) -->
            <a-entity position="0 1 0">
                <!-- Cyan Ring (Horizontal) -->
                <a-torus radius="1.3" radius-tubular="0.015" color="#00FFFF" rotation="90 0 0" material="emissive: #00FFFF; emissiveIntensity: 1.2; metalness: 0.8"
                          animation="property: rotation; to: 90 360 0; loop: true; dur: 8000; easing: linear"></a-torus>
                <!-- Purple Ring (Tilted) -->
                <a-torus radius="1.1" radius-tubular="0.015" color="#8A2BE2" rotation="45 45 0" material="emissive: #8A2BE2; emissiveIntensity: 1.2; metalness: 0.8"
                          animation="property: rotation; to: 45 405 0; loop: true; dur: 10000; easing: linear"></a-torus>
                <!-- Magenta Ring (Tilted Opposite) -->
                <a-torus radius="1.2" radius-tubular="0.01" color="#FF00FF" rotation="-45 45 0" material="emissive: #FF00FF; emissiveIntensity: 1.2; metalness: 0.8"
                          animation="property: rotation; to: -45 405 0; loop: true; dur: 12000; easing: linear"></a-torus>
            </a-entity>

            <!-- 2. Rotating Glowing Moon Floating above the card -->
            <a-entity position="0 2.5 0" animation="property: rotation; to: 0 360 0; loop: true; dur: 15000; easing: linear">
                <a-sphere radius="0.16" color="#E6E6FA" material="emissive: #4B0082; emissiveIntensity: 0.4; roughness: 0.8; metalness: 0.2"></a-sphere>
                <!-- Tiny Moon Satellite orbiting the moon -->
                <a-sphere position="0.32 0 0" radius="0.03" color="#C0C0C0" material="emissive: #C0C0C0; emissiveIntensity: 0.3"
                          animation="property: rotation; to: 360 360 0; loop: true; dur: 4000; easing: linear"></a-sphere>
            </a-entity>

            <!-- 3. Orbiting Neon Crystal Stars -->
            <a-entity position="0 1 0" animation="property: rotation; to: 0 360 0; loop: true; dur: 15000; easing: linear">
                <!-- Cyan Octahedron -->
                <a-entity position="1.4 0.5 0" rotation="0 0 0" animation="property: rotation; to: 360 360 360; loop: true; dur: 4000; easing: linear">
                    <a-octahedron radius="0.09" color="#00FFFF" material="emissive: #00FFFF; emissiveIntensity: 1; roughness: 0.1; metalness: 0.9"></a-octahedron>
                </a-entity>
                <!-- Purple Octahedron -->
                <a-entity position="-1.4 -0.3 0.2" rotation="0 0 0" animation="property: rotation; to: 360 0 360; loop: true; dur: 5000; easing: linear">
                    <a-octahedron radius="0.08" color="#8A2BE2" material="emissive: #8A2BE2; emissiveIntensity: 1; roughness: 0.1; metalness: 0.9"></a-octahedron>
                </a-entity>
                <!-- Golden Star -->
                <a-entity position="0 0.8 -1.4" rotation="0 0 0" animation="property: rotation; to: 0 360 360; loop: true; dur: 6000; easing: linear">
                    <a-dodecahedron radius="0.07" color="#FFD700" material="emissive: #FFD700; emissiveIntensity: 1; roughness: 0.1; metalness: 0.9"></a-dodecahedron>
                </a-entity>
            </a-entity>
            @endif

            @if($arStyle === 'java')
            <!-- ================= STYLE: JAVA ================= -->
            <!-- 1. Gapura Candi Bentar (Gerbang Jawa) Left & Right -->
            <a-entity id="javanese-gate" position="0 0 0">
                <!-- Left Pillar of Split Gate -->
                <a-entity position="-0.95 0 0">
                    <a-box position="0 0.1 0" width="0.32" height="0.2" depth="0.32" color="#8A3324" material="roughness: 0.9"></a-box>
                    <a-box position="0 0.7 0" width="0.22" height="1.0" depth="0.22" color="#8A3324" material="roughness: 0.9"></a-box>
                    <!-- Gold Accents Left -->
                    <a-box position="0 0.4 0" width="0.24" height="0.05" depth="0.24" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                    <a-box position="0 0.9 0" width="0.24" height="0.05" depth="0.24" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                    <!-- Step Top and Pinnacle -->
                    <a-box position="0 1.25 0" width="0.26" height="0.1" depth="0.26" color="#8A3324" material="roughness: 0.9"></a-box>
                    <a-box position="0 1.35 0" width="0.18" height="0.1" depth="0.18" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                    <a-cone position="0 1.5 0" radius-bottom="0.09" height="0.2" segments-radial="4" rotation="0 45 0" color="#8A3324" material="roughness: 0.9"></a-cone>
                </a-entity>

                <!-- Right Pillar of Split Gate -->
                <a-entity position="0.95 0 0">
                    <a-box position="0 0.1 0" width="0.32" height="0.2" depth="0.32" color="#8A3324" material="roughness: 0.9"></a-box>
                    <a-box position="0 0.7 0" width="0.22" height="1.0" depth="0.22" color="#8A3324" material="roughness: 0.9"></a-box>
                    <!-- Gold Accents Right -->
                    <a-box position="0 0.4 0" width="0.24" height="0.05" depth="0.24" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                    <a-box position="0 0.9 0" width="0.24" height="0.05" depth="0.24" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                    <!-- Step Top and Pinnacle -->
                    <a-box position="0 1.25 0" width="0.26" height="0.1" depth="0.26" color="#8A3324" material="roughness: 0.9"></a-box>
                    <a-box position="0 1.35 0" width="0.18" height="0.1" depth="0.18" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-box>
                    <a-cone position="0 1.5 0" radius-bottom="0.09" height="0.2" segments-radial="4" rotation="0 45 0" color="#8A3324" material="roughness: 0.9"></a-cone>
                </a-entity>

                <!-- Hanging Traditional Javanese Lanterns (Lampion) -->
                <!-- Left Lantern -->
                <a-entity position="-1.1 0.8 0.1">
                    <a-cylinder position="0 0 0" radius="0.05" height="0.15" color="#B22222" material="roughness: 0.7"></a-cylinder>
                    <a-cylinder position="0 0.08 0" radius="0.06" height="0.02" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-cylinder>
                    <a-cylinder position="0 -0.08 0" radius="0.06" height="0.02" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-cylinder>
                    <a-cone position="0 -0.13 0" radius-bottom="0.01" height="0.08" rotation="180 0 0" color="#D4AF37" material="metalness: 0.5"></a-cone>
                </a-entity>

                <!-- Right Lantern -->
                <a-entity position="1.1 0.8 0.1">
                    <a-cylinder position="0 0 0" radius="0.05" height="0.15" color="#B22222" material="roughness: 0.7"></a-cylinder>
                    <a-cylinder position="0 0.08 0" radius="0.06" height="0.02" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-cylinder>
                    <a-cylinder position="0 -0.08 0" radius="0.06" height="0.02" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-cylinder>
                    <a-cone position="0 -0.13 0" radius-bottom="0.01" height="0.08" rotation="180 0 0" color="#D4AF37" material="metalness: 0.5"></a-cone>
                </a-entity>

                <!-- Jasmine Hanging Flower Garlands bridging the Gate -->
                <a-sphere position="-0.7 1.2 0" radius="0.05" color="#FFFDD0"></a-sphere>
                <a-sphere position="-0.4 1.05 -0.03" radius="0.05" color="#FFFDD0"></a-sphere>
                <a-sphere position="0 0.95 -0.05" radius="0.06" color="#FFFDD0" material="emissive: #FFFDD0; emissiveIntensity: 0.3"></a-sphere>
                <a-sphere position="0.4 1.05 -0.03" radius="0.05" color="#FFFDD0"></a-sphere>
                <a-sphere position="0.7 1.2 0" radius="0.05" color="#FFFDD0"></a-sphere>
            </a-entity>

            <!-- 2. Flapping Golden Birds (Javanese Elegance) flying in circle above the Gate -->
            <a-entity position="0 2.2 0" animation="property: rotation; to: 0 360 0; loop: true; dur: 12000; easing: linear">
                <!-- Golden Bird 1 -->
                <a-entity position="1.3 0.4 0" rotation="0 90 0">
                    <a-cone radius-bottom="0.035" radius-top="0.005" height="0.18" rotation="90 0 0" color="#D4AF37" material="metalness: 0.7; roughness: 0.3"></a-cone>
                    <!-- Left flapping wing -->
                    <a-plane position="-0.09 0 0" width="0.18" height="0.07" color="#D4AF37" material="side: double; metalness: 0.7; roughness: 0.3"
                              animation="property: rotation; from: 0 0 0; to: 0 0 55; dir: alternate; loop: true; dur: 240; easing: easeInOutQuad"></a-plane>
                    <!-- Right flapping wing -->
                    <a-plane position="0.09 0 0" width="0.18" height="0.07" color="#D4AF37" material="side: double; metalness: 0.7; roughness: 0.3"
                              animation="property: rotation; from: 0 0 0; to: 0 0 -55; dir: alternate; loop: true; dur: 240; easing: easeInOutQuad"></a-plane>
                </a-entity>
                
                <!-- Golden Bird 2 -->
                <a-entity position="-1.3 0.6 0.4" rotation="0 -90 0">
                    <a-cone radius-bottom="0.035" radius-top="0.005" height="0.18" rotation="90 0 0" color="#D4AF37" material="metalness: 0.7; roughness: 0.3"></a-cone>
                    <a-plane position="-0.09 0 0" width="0.18" height="0.07" color="#D4AF37" material="side: double; metalness: 0.7; roughness: 0.3"
                              animation="property: rotation; from: 0 0 0; to: 0 0 55; dir: alternate; loop: true; dur: 210; easing: easeInOutQuad"></a-plane>
                    <a-plane position="0.09 0 0" width="0.18" height="0.07" color="#D4AF37" material="side: double; metalness: 0.7; roughness: 0.3"
                              animation="property: rotation; from: 0 0 0; to: 0 0 -55; dir: alternate; loop: true; dur: 210; easing: easeInOutQuad"></a-plane>
                </a-entity>
            </a-entity>

            <!-- 3. Floating Orbiting Jasmine Buds and Golden Ornaments -->
            <a-entity position="0 1 0" animation="property: rotation; to: 0 -360 0; loop: true; dur: 10000; easing: linear">
                <!-- Orbiting Jasmine Left -->
                <a-entity position="1.35 0 0">
                    <a-sphere radius="0.06" color="#FFFDD0"></a-sphere>
                    <a-cone position="0 -0.07 0" radius-bottom="0.04" height="0.08" rotation="180 0 0" color="#82E0AA"></a-cone>
                </a-entity>
                <!-- Orbiting Gold Diamond Right -->
                <a-entity position="-1.35 0.3 -0.1" rotation="0 0 0" animation="property: rotation; to: 360 360 0; loop: true; dur: 4000; easing: linear">
                    <a-octahedron radius="0.07" color="#D4AF37" material="metalness: 0.8; roughness: 0.2"></a-octahedron>
                </a-entity>
            </a-entity>
            @endif

            <!-- 3. Rotating Postcard Group (Wedding Greeting Card) - Rendered with style-specific colors -->
            <a-entity id="postcard-group" position="0 1 0" animation="property: rotation; to: 0 360 0; loop: true; dur: 14000; easing: linear">
                
                <!-- Main Card Base / Frame -->
                <a-box position="0 0 0" width="1.4" height="1.85" depth="0.06" color="{{ $arStyle === 'cosmic' ? '#0d1117' : ($arStyle === 'java' ? '#5c0601' : '#FFF8F6') }}" shadow="cast: true; receive: true"></a-box>
                
                <!-- Front Side: Border Decoration -->
                <a-plane position="0 0 0.031" width="1.28" height="1.73" color="{{ $arStyle === 'cosmic' ? '#00FFFF' : ($arStyle === 'java' ? '#D4AF37' : '#D4AF37') }}"></a-plane>
                <a-plane position="0 0 0.032" width="1.24" height="1.69" color="{{ $arStyle === 'cosmic' ? '#161b22' : ($arStyle === 'java' ? '#5c0601' : '#FFF8F6') }}"></a-plane>

                <!-- Front Side: Wedding Couple Photo -->
                <a-image src="#wedding-photo" position="0 0.25 0.035" width="1.1" height="1.05" material="roughness: 1"></a-image>
                
                <!-- Front Side: Grand Names Text -->
                <!-- Multi-layer drop-shadow effect for text clarity -->
                <a-text value="{{ $groomNickname }} & {{ $brideNickname }}" 
                        color="{{ $arStyle === 'cosmic' ? '#004f4f' : ($arStyle === 'java' ? '#3d0400' : '#801a08') }}" 
                        align="center" 
                        position="0.01 -0.44 0.035" 
                        width="3.2" 
                        font="roboto"
                        wrap-count="18"></a-text>
                <a-text value="{{ $groomNickname }} & {{ $brideNickname }}" 
                        color="{{ $arStyle === 'cosmic' ? '#00FFFF' : ($arStyle === 'java' ? '#D4AF37' : '#E5654B') }}" 
                        align="center" 
                        position="0 -0.45 0.036" 
                        width="3.2" 
                        font="roboto"
                        wrap-count="18"></a-text>
                
                <!-- Front Side: Date -->
                <a-text value="{{ $weddingDate }}" 
                        color="{{ $arStyle === 'cosmic' ? '#8b949e' : ($arStyle === 'java' ? '#FADBD8' : '#888888') }}" 
                        align="center" 
                        position="0 -0.65 0.035" 
                        width="2" 
                        font="roboto"
                        wrap-count="22"></a-text>

                <!-- Back Side: Quote Frame -->
                <a-plane position="0 0 -0.031" width="1.28" height="1.73" color="{{ $arStyle === 'cosmic' ? '#00FFFF' : ($arStyle === 'java' ? '#D4AF37' : '#D4AF37') }}" rotation="0 180 0"></a-plane>
                <a-plane position="0 0 -0.032" width="1.24" height="1.69" color="{{ $arStyle === 'cosmic' ? '#161b22' : ($arStyle === 'java' ? '#801a08' : '#E5654B') }}" rotation="0 180 0"></a-plane>
                
                <a-text value="THE WEDDING OF" 
                        color="#FFF8F6" 
                        align="center" 
                        position="0 0.45 -0.035" 
                        rotation="0 180 0" 
                        width="2.2" 
                        font="roboto"
                        wrap-count="20"></a-text>
                        
                <a-text value="Thank you\nfor being a part of\nour beautiful journey" 
                        color="#FFF8F6" 
                        align="center" 
                        position="0 -0.1 -0.035" 
                        rotation="0 180 0" 
                        width="2.8" 
                        font="roboto"
                        wrap-count="22"></a-text>
                        
                <a-text value="#WeddingDay" 
                        color="#FFF8F6" 
                        align="center" 
                        position="0 -0.55 -0.035" 
                        rotation="0 180 0" 
                        width="1.8" 
                        font="roboto"
                        wrap-count="20"></a-text>

            </a-entity>

            <!-- Custom Point Light and Ambient Lights configured dynamically per theme -->
            @if($arStyle === 'cosmic')
                <a-entity light="type: ambient; color: #8A2BE2; intensity: 0.6"></a-entity>
                <a-entity light="type: point; color: #00FFFF; intensity: 2.2; distance: 10" position="0 2.5 1.5"></a-entity>
            @elseif($arStyle === 'java')
                <a-entity light="type: ambient; color: #FFA07A; intensity: 0.7"></a-entity>
                <a-entity light="type: point; color: #FFD700; intensity: 2.0; distance: 10" position="0 2.5 1.5"></a-entity>
            @else
                <a-entity light="type: ambient; color: #FFF; intensity: 0.8"></a-entity>
                <a-entity light="type: point; color: #FFEAD4; intensity: 1.6; distance: 10" position="0 2.5 1.5"></a-entity>
            @endif

        </a-marker>

        <!-- Active Camera -->
        <a-entity camera></a-entity>
    </a-scene>

    <script>
        // Init Backsound music object
        const musicUrl = "{{ $musicUrl }}";
        const bgMusic = new Audio(musicUrl);
        bgMusic.loop = true;
        bgMusic.volume = 0.8;

        const startBtn = document.getElementById('start-btn');
        const overlay = document.getElementById('ar-overlay');
        const scanStatus = document.getElementById('scan-status');
        const targetFrame = document.getElementById('target-frame');
        const uiOverlay = document.getElementById('ar-ui-overlay');
        const marker = document.getElementById('ar-marker');
        const scanText = document.getElementById('scan-text');

        let hasInteracted = false;

        // Overlay Start Button Action
        startBtn.addEventListener('click', () => {
            // Hide overlay
            overlay.classList.add('hidden');
            
            // Show scanning indicators
            scanStatus.style.display = 'flex';
            targetFrame.style.display = 'block';
            uiOverlay.style.display = 'flex';

            // Play background music (guaranteed to work since user tapped)
            bgMusic.play().then(() => {
                console.log("Audio playing successfully.");
            }).catch(e => {
                console.error("Audio play blocked: ", e);
            });

            hasInteracted = true;
        });

        // Detect when marker is found
        marker.addEventListener('markerFound', () => {
            if (!hasInteracted) return;
            
            // Update scanning status text and hide target guide frame
            scanStatus.style.background = 'rgba(229, 101, 75, 0.85)';
            scanText.innerText = 'Marker Ditemukan!';
            targetFrame.style.display = 'none';

            // Fade out the scanning status after 2 seconds of showing confirmation
            setTimeout(() => {
                if (scanText.innerText === 'Marker Ditemukan!') {
                    scanStatus.style.display = 'none';
                }
            }, 2000);
        });

        // Detect when marker is lost
        marker.addEventListener('markerLost', () => {
            if (!hasInteracted) return;

            // Reset scanning indicators
            scanStatus.style.display = 'flex';
            scanStatus.style.background = 'rgba(0, 0, 0, 0.7)';
            scanText.innerText = 'Arahkan Kamera ke Marker Hiro...';
            targetFrame.style.display = 'block';
        });
    </script>
</body>
</html>
