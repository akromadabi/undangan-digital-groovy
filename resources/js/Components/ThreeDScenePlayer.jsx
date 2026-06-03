import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const createTextTexture = (layer) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const text = layer.text || 'Teks Baru';
    const fontFamily = layer.fontFamily || 'Playfair Display';
    const fontSize = layer.fontSize || 64;
    const color = layer.color || '#E5654B';
    const fontWeight = layer.fontWeight || 'normal';
    const fontStyle = layer.fontStyle || 'normal';
    
    // Set font to measure text width
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
    
    // Support multi-line text
    const lines = text.split('\n');
    let maxLineWidth = 0;
    lines.forEach(line => {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxLineWidth) {
            maxLineWidth = metrics.width;
        }
    });
    
    // Calculate canvas size with some padding
    const padding = 20;
    const canvasWidth = Math.max(128, Math.ceil(maxLineWidth + padding * 2));
    const lineHeight = fontSize * 1.25;
    const canvasHeight = Math.ceil(lines.length * lineHeight + padding * 2);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Re-set font context because size change resets context states
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    
    // Transparent background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Render text lines
    lines.forEach((line, index) => {
        ctx.fillStyle = color;
        ctx.fillText(line, canvasWidth / 2, padding + index * lineHeight);
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.aspectRatio = canvasWidth / canvasHeight;
    return texture;
};

const GRADIENTS = {
    midnight: 'linear-gradient(135deg, #151518 0%, #24242e 100%)',
    romance: 'linear-gradient(135deg, #2a1725 0%, #110e17 100%)',
    emerald: 'linear-gradient(135deg, #0c1b18 0%, #162822 100%)',
    luxury_gold: 'linear-gradient(135deg, #1a1612 0%, #2c241d 100%)',
    ivory_cream: 'linear-gradient(135deg, #fbfaf8 0%, #eae5dc 100%)'
};

const particleCount = 80;

const createParticleTexture = (type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (type === 'gold_dust' || type === 'bokeh') {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 223, 137, 1)');
        grad.addColorStop(0.3, 'rgba(255, 215, 0, 0.8)');
        grad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
    } else if (type === 'sakura') {
        ctx.fillStyle = 'rgba(255, 183, 197, 0.9)';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.quadraticCurveTo(28, 10, 16, 28);
        ctx.quadraticCurveTo(4, 10, 16, 4);
        ctx.fill();
    } else if (type === 'snow') {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};

export default function ThreeDScenePlayer({ 
    config = { layers: [], keyframes: [] }, 
    autoplay = false,
    scrollTriggerRef = null, // Ref to a scrollable element, defaults to window
    height = '400px',
    className = ''
}) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const meshesRef = useRef({});
    const particlesRef = useRef(null);
    const particleVelocitiesRef = useRef([]);

    // Animation frames and active state
    const animationFrameIdRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const initParticleSystem = (scene, type) => {
        if (particlesRef.current) {
            scene.remove(particlesRef.current);
            if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
            if (particlesRef.current.material) {
                if (particlesRef.current.material.map) particlesRef.current.material.map.dispose();
                particlesRef.current.material.dispose();
            }
            particlesRef.current = null;
        }

        if (!type || type === 'none') return;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 4.5;

            if (type === 'gold_dust') {
                velocities.push({
                    x: (Math.random() - 0.5) * 0.015,
                    y: Math.random() * 0.015 + 0.005,
                    z: (Math.random() - 0.5) * 0.01
                });
            } else if (type === 'sakura') {
                velocities.push({
                    x: (Math.random() - 0.3) * 0.015,
                    y: -(Math.random() * 0.015 + 0.01),
                    z: (Math.random() - 0.5) * 0.01
                });
            } else if (type === 'snow') {
                velocities.push({
                    x: (Math.random() - 0.5) * 0.005,
                    y: -(Math.random() * 0.02 + 0.015),
                    z: (Math.random() - 0.5) * 0.005
                });
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const texture = createParticleTexture(type);
        const material = new THREE.PointsMaterial({
            size: type === 'sakura' ? 0.35 : 0.22,
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        particlesRef.current = points;
        particleVelocitiesRef.current = velocities;
    };

    const animateParticles = () => {
        if (particlesRef.current) {
            const points = particlesRef.current;
            const positions = points.geometry.attributes.position.array;
            const velocities = particleVelocitiesRef.current;
            const type = config.particleType || 'none';

            for (let i = 0; i < particleCount; i++) {
                if (!velocities[i]) continue;
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;

                if (type === 'sakura' || type === 'gold_dust') {
                    positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.003;
                }

                if (type === 'gold_dust') {
                    if (positions[i * 3 + 1] > 7) {
                        positions[i * 3 + 1] = -7;
                        positions[i * 3] = (Math.random() - 0.5) * 20;
                    }
                } else {
                    if (positions[i * 3 + 1] < -7) {
                        positions[i * 3 + 1] = 7;
                        positions[i * 3] = (Math.random() - 0.5) * 20;
                    }
                }

                if (positions[i * 3] > 10) positions[i * 3] = -10;
                if (positions[i * 3] < -10) positions[i * 3] = 10;
            }

            points.geometry.attributes.position.needsUpdate = true;
        }
    };

    useEffect(() => {
        // Load Google Fonts for text layers
        const linkId = 'google-fonts-3d-scenes';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;700&family=Dancing+Script:wght@700&family=Great+Vibes&family=Montserrat:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current || !config || !config.layers) return;

        // Sync container background gradient
        const gradKey = config.backgroundGradient || 'midnight';
        containerRef.current.style.background = GRADIENTS[gradKey] || GRADIENTS.midnight;

        // Init Scene
        const width = containerRef.current.clientWidth;
        const heightPx = containerRef.current.clientHeight || 400;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
        scene.add(ambientLight);

        // Directional Light
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.35);
        dirLight.position.set(5, 8, 5);
        scene.add(dirLight);

        // Init Camera
        const camera = new THREE.PerspectiveCamera(75, width / heightPx, 0.1, 1000);
        // Default camera position if no keyframes
        const firstKf = config.keyframes && config.keyframes[0];
        if (firstKf) {
            camera.position.set(firstKf.position.x, firstKf.position.y, firstKf.position.z);
            camera.rotation.set(firstKf.rotation.x, firstKf.rotation.y, firstKf.rotation.z);
            camera.fov = firstKf.fov;
        } else {
            camera.position.set(0, 0, 8);
        }
        cameraRef.current = camera;

        // Init Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, heightPx);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Init particle system
        initParticleSystem(scene, config.particleType || 'none');

        // Load textures and construct meshes
        const textureLoader = new THREE.TextureLoader();
        config.layers.forEach(layer => {
            if (!layer.visible) return;

            const geometry = new THREE.PlaneGeometry(3, 3);
            let texture;
            
            if (layer.type === 'text') {
                texture = createTextTexture(layer);
            } else {
                texture = textureLoader.load(layer.url, (tex) => {
                    // Adjust plane scale based on texture dimensions
                    const aspect = tex.image.width / tex.image.height;
                    mesh.scale.set(layer.scale.x * aspect, layer.scale.y, 1);
                });
            }

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: true,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(layer.position.x, layer.position.y, layer.position.z);
            mesh.rotation.set(
                THREE.MathUtils.degToRad(layer.rotation.x),
                THREE.MathUtils.degToRad(layer.rotation.y),
                THREE.MathUtils.degToRad(layer.rotation.z)
            );
            
            if (layer.type === 'text') {
                const aspect = texture.aspectRatio || 1;
                mesh.scale.set(layer.scale.x * aspect, layer.scale.y, 1);
            } else {
                mesh.scale.set(layer.scale.x, layer.scale.y, 1);
            }

            scene.add(mesh);
            meshesRef.current[layer.id] = mesh;
        });

        // 3D Render loop
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            animateParticles();
            renderer.render(scene, camera);
        };
        animate();
        setIsInitialized(true);

        // Handle Resize
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight || 400;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (rendererRef.current && rendererRef.current.domElement) {
                rendererRef.current.domElement.remove();
            }
            // Dispose geometries and materials
            Object.values(meshesRef.current).forEach(mesh => {
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(m => m.dispose());
                    } else {
                        mesh.material.dispose();
                    }
                }
            });

            // Dispose particle system resources
            if (particlesRef.current) {
                if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
                if (particlesRef.current.material) {
                    if (particlesRef.current.material.map) particlesRef.current.material.map.dispose();
                    particlesRef.current.material.dispose();
                }
                particlesRef.current = null;
            }
        };
    }, [config]);

    // Camera scrolling/autoplay animation system
    useEffect(() => {
        if (!isInitialized || !cameraRef.current || !config.keyframes || config.keyframes.length < 2) return;

        const kfs = config.keyframes;

        // Build Catmull-Rom Spline for camera position
        const cameraPoints = kfs.map(kf => new THREE.Vector3(kf.position.x, kf.position.y, kf.position.z));
        const cameraCurve = new THREE.CatmullRomCurve3(cameraPoints);

        // Multi-keyframe smooth spline calculation
        const updateCameraPosition = (progress) => {
            const clampedProgress = Math.max(0, Math.min(1, progress));
            
            // 1. Position along spline
            const pos = cameraCurve.getPointAt(clampedProgress);
            cameraRef.current.position.copy(pos);

            // 2. Rotation using Quaternions
            const totalSegments = kfs.length - 1;
            const segmentFloat = clampedProgress * totalSegments;
            const currentIdx = Math.floor(segmentFloat);
            const segmentProgress = segmentFloat - currentIdx;

            const startKf = kfs[currentIdx];
            const endKf = kfs[Math.min(currentIdx + 1, totalSegments)];

            if (startKf && endKf) {
                const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(startKf.rotation.x, startKf.rotation.y, startKf.rotation.z));
                const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(endKf.rotation.x, endKf.rotation.y, endKf.rotation.z));
                cameraRef.current.quaternion.copy(qStart).slerp(qEnd, segmentProgress);

                cameraRef.current.fov = THREE.MathUtils.lerp(startKf.fov, endKf.fov, segmentProgress);
                cameraRef.current.updateProjectionMatrix();
            }
        };

        if (autoplay) {
            // Autoplay animation (e.g. for video recording or intro transitions)
            let start = null;
            const duration = 6000; // 6s duration

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                updateCameraPosition(progress);

                if (progress < 1) {
                    animationFrameIdRef.current = requestAnimationFrame(step);
                }
            };
            animationFrameIdRef.current = requestAnimationFrame(step);
        } else {
            // Scroll/swipe-based animation
            const handleScroll = () => {
                const target = scrollTriggerRef ? scrollTriggerRef.current : window;
                if (!target) return;

                let progress = 0;

                if (target === window) {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    if (docHeight > 0) progress = scrollTop / docHeight;
                } else {
                    const scrollTop = target.scrollTop;
                    const maxScroll = target.scrollHeight - target.clientHeight;
                    if (maxScroll > 0) progress = scrollTop / maxScroll;
                }

                updateCameraPosition(progress);
            };

            const trigger = scrollTriggerRef ? scrollTriggerRef.current : window;
            if (trigger) {
                trigger.addEventListener('scroll', handleScroll, { passive: true });
                // Initial update
                handleScroll();
            }

            return () => {
                if (trigger) {
                    trigger.removeEventListener('scroll', handleScroll);
                }
            };
        }
    }, [isInitialized, autoplay, config.keyframes, scrollTriggerRef]);

    return (
        <div 
            ref={containerRef} 
            className={`w-full relative select-none overflow-hidden ${className}`}
            style={{ height }}
        />
    );
}
