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
            
            <!-- Rotating Postcard Group -->
            <a-entity id="postcard-group" position="0 1 0" animation="property: rotation; to: 0 360 0; loop: true; dur: 12000; easing: linear">
                
                <!-- Main Card Base / Frame -->
                <a-box position="0 0 0" width="1.6" height="2" depth="0.06" color="#FFF8F6" shadow="cast: true; receive: true"></a-box>
                
                <!-- Front Side: Frame Border Decoration -->
                <a-plane position="0 0 0.031" width="1.45" height="1.85" color="#D4AF37"></a-plane>
                <a-plane position="0 0 0.032" width="1.41" height="1.81" color="#FFF8F6"></a-plane>

                <!-- Front Side: Wedding Couple Photo -->
                <a-image src="#wedding-photo" position="0 0.25 0.035" width="1.25" height="1.15"></a-image>
                
                <!-- Front Side: Groom & Bride Names -->
                <a-text value="{{ $groomNickname }} & {{ $brideNickname }}" 
                        color="#E5654B" 
                        align="center" 
                        position="0 -0.5 0.035" 
                        width="3.5" 
                        font="roboto"
                        wrap-count="18"></a-text>
                
                <!-- Front Side: Date -->
                <a-text value="{{ $weddingDate }}" 
                        color="#888888" 
                        align="center" 
                        position="0 -0.7 0.035" 
                        width="2.2" 
                        font="roboto"
                        wrap-count="20"></a-text>

                <!-- Back Side: Quote Frame -->
                <a-plane position="0 0 -0.031" width="1.45" height="1.85" color="#D4AF37" rotation="0 180 0"></a-plane>
                <a-plane position="0 0 -0.032" width="1.41" height="1.81" color="#E5654B" rotation="0 180 0"></a-plane>
                
                <a-text value="THE WEDDING OF" 
                        color="#FFF8F6" 
                        align="center" 
                        position="0 0.5 -0.035" 
                        rotation="0 180 0" 
                        width="2.5" 
                        font="roboto"
                        wrap-count="20"></a-text>
                        
                <a-text value="Thank you\nfor being a part of\nour beautiful journey" 
                        color="#FFF8F6" 
                        align="center" 
                        position="0 -0.1 -0.035" 
                        rotation="0 180 0" 
                        width="3.0" 
                        font="roboto"
                        wrap-count="22"></a-text>
                        
                <a-text value="#WeddingDay" 
                        color="#FFF8F6" 
                        align="center" 
                        position="0 -0.6 -0.035" 
                        rotation="0 180 0" 
                        width="2" 
                        font="roboto"
                        wrap-count="20"></a-text>

            </a-entity>

            <!-- Orbiting 3D floating hearts and stars decoration around card -->
            <a-entity position="0 1 0" animation="property: rotation; to: 0 -360 0; loop: true; dur: 9000; easing: linear">
                <!-- 3D Pink Heart 1 -->
                <a-entity geometry="primitive: box; width: 0.15; height: 0.15; depth: 0.15" 
                          material="color: #FF85A2; roughness: 0.2; metalness: 0.1" 
                          position="1.4 0.6 0"
                          animation="property: rotation; to: 360 360 0; loop: true; dur: 3000; easing: linear"></a-entity>
                
                <!-- 3D Gold Box 2 -->
                <a-entity geometry="primitive: sphere; radius: 0.1" 
                          material="color: #D4AF37; roughness: 0.1; metalness: 0.8" 
                          position="-1.3 -0.4 0.3"
                          animation="property: rotation; to: 0 360 360; loop: true; dur: 4500; easing: linear"></a-entity>
                
                <!-- 3D Red Box 3 -->
                <a-entity geometry="primitive: box; width: 0.1; height: 0.1; depth: 0.1" 
                          material="color: #E5654B; roughness: 0.3" 
                          position="0.5 -1.2 -1"
                          animation="property: rotation; to: 360 0 360; loop: true; dur: 3500; easing: linear"></a-entity>
            </a-entity>

            <!-- Lights specific to marker object to make 3D model look premium -->
            <a-entity light="type: point; intensity: 1.5; distance: 10; decay: 2" position="0 2 1"></a-entity>

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
