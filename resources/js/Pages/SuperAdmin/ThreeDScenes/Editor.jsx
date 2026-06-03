import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { 
    Layers, ArrowLeft, Plus, Trash2, Save, Play, Pause, Camera, 
    Upload, Brush, Edit3, Move, Eye, EyeOff, RotateCw, ZoomIn, 
    ChevronRight, Undo2, Redo2, RotateCcw, Check, Sparkles, Scissors, Eraser,
    HelpCircle, Type
} from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import axios from 'axios';

const updateHandlesPosition = (mesh, handles) => {
    if (!mesh || !handles || handles.length === 0) return;
    const halfW = (3 * mesh.scale.x) / 2;
    const halfH = (3 * mesh.scale.y) / 2;
    
    const localPoints = [
        new THREE.Vector3(-halfW, halfH, 0),  // Top-Left (0)
        new THREE.Vector3(halfW, halfH, 0),   // Top-Right (1)
        new THREE.Vector3(-halfW, -halfH, 0), // Bottom-Left (2)
        new THREE.Vector3(halfW, -halfH, 0)   // Bottom-Right (3)
    ];
    
    localPoints.forEach((pt, idx) => {
        pt.applyMatrix4(mesh.matrixWorld);
        handles[idx].position.copy(pt);
    });
};

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

export default function ThreeDSceneEditor({ scene = null }) {
    const isEdit = !!scene;
    const { data, setData, post, put, transform, processing, errors } = useForm({
        name: scene?.name || '',
        slug: scene?.slug || '',
        config: scene?.config || { layers: [], keyframes: [] },
        thumbnail: scene?.thumbnail || '',
        is_active: scene?.is_active ?? true,
    });

    const [activeTab, setActiveTab] = useState('layers'); // 'layers' | 'settings' | 'keyframes'
    const [selectedLayerId, setSelectedLayerId] = useState(null);
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const [showDrawingPad, setShowDrawingPad] = useState(false);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);

    // Background Remover State & Refs
    const bgCanvasRef = useRef(null);
    const [showBgRemover, setShowBgRemover] = useState(false);
    const [bgRemoverLayer, setBgRemoverLayer] = useState(null);
    const [bgRemoverTool, setBgRemoverTool] = useState('magic'); // 'magic' | 'manual'
    const [bgRemoverTolerance, setBgRemoverTolerance] = useState(35);
    const [bgRemoverBrushSize, setBgRemoverBrushSize] = useState(15);
    const [bgHistory, setBgHistory] = useState([]);
    const [bgHistoryIndex, setBgHistoryIndex] = useState(-1);
    const [bgIsDrawing, setBgIsDrawing] = useState(false);
    const [processingBgRemoval, setProcessingBgRemoval] = useState(false);
    
    const showBgRemoverRef = useRef(false);
    const bgOriginalImgRef = useRef(null);
    const bgBrushPreviewRef = useRef(null);

    useEffect(() => {
        showBgRemoverRef.current = showBgRemover;
    }, [showBgRemover]);

    // 3D Viewport Refs
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const meshesRef = useRef({}); // map layer id -> mesh
    const selectionHelperRef = useRef(null);
    const particlesRef = useRef(null);
    const particleVelocitiesRef = useRef([]);

    // Drawing Pad Canvas Refs & State
    const drawCanvasRef = useRef(null);
    const [drawColor, setDrawColor] = useState('#E5654B');
    const [drawWidth, setDrawWidth] = useState(5);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawTool, setDrawTool] = useState('brush'); // 'brush' | 'eraser'
    const [drawHistory, setDrawHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const drawLastXRef = useRef(0);
    const drawLastYRef = useRef(0);

    // Camera animation state
    const animationFrameIdRef = useRef(null);

    // Refs to bridge pointer event listeners without stale state closures
    const dragEndCallbackRef = useRef(null);
    const resizeEndCallbackRef = useRef(null);
    const selectLayerCallbackRef = useRef(null);
    const isPlayingPreviewRef = useRef(isPlayingPreview);
    
    const handlesRef = useRef([]);
    const selectedLayerIdRef = useRef(null);

    useEffect(() => {
        selectedLayerIdRef.current = selectedLayerId;
    }, [selectedLayerId]);

    const spacePressedRef = useRef(false);
    const spaceDraggedRef = useRef(false);
    const prevSelectedLayerIdRef = useRef(null);
    
    // Editor config history stack (Photoshop-style Undo/Redo)
    const historyRef = useRef([]);
    const historyIndexRef = useRef(-1);

    const saveHistoryState = (newConfig) => {
        const configStr = JSON.stringify(newConfig);
        const currentHistory = historyRef.current;
        const curIdx = historyIndexRef.current;
        if (curIdx >= 0 && currentHistory[curIdx] === configStr) {
            return;
        }

        const nextHistory = currentHistory.slice(0, curIdx + 1);
        nextHistory.push(configStr);
        if (nextHistory.length > 50) {
            nextHistory.shift();
        }

        historyRef.current = nextHistory;
        historyIndexRef.current = nextHistory.length - 1;
    };

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
            const type = configRef.current.particleType || 'none';

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

    const handleEditorUndo = () => {
        const curIdx = historyIndexRef.current;
        if (curIdx <= 0) return;
        
        const prevIdx = curIdx - 1;
        historyIndexRef.current = prevIdx;
        const prevConfig = JSON.parse(historyRef.current[prevIdx]);
        
        setData(d => ({
            ...d,
            config: prevConfig
        }));
    };

    const handleEditorRedo = () => {
        const curIdx = historyIndexRef.current;
        const history = historyRef.current;
        if (curIdx >= history.length - 1) return;
        
        const nextIdx = curIdx + 1;
        historyIndexRef.current = nextIdx;
        const nextConfig = JSON.parse(history[nextIdx]);
        
        setData(d => ({
            ...d,
            config: nextConfig
        }));
    };

    // Camera pan & focus animations
    const animateCameraAndTarget = (targetCamPos, targetControlsTarget) => {
        if (!cameraRef.current || !controlsRef.current) return;
        
        const controls = controlsRef.current;
        const camera = cameraRef.current;
        
        controls.enabled = false;
        
        const startTarget = controls.target.clone();
        const endTarget = targetControlsTarget;
        
        const startCamPos = camera.position.clone();
        const endCamPos = targetCamPos;
        
        let progress = 0;
        const duration = 20; // ~330ms
        
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }

        const animateFocus = () => {
            progress += 1 / duration;
            const t = Math.min(1, Math.sin((progress * Math.PI) / 2));
            
            camera.position.lerpVectors(startCamPos, endCamPos, t);
            controls.target.lerpVectors(startTarget, endTarget, t);
            
            animateParticles();
            if (rendererRef.current && sceneRef.current) {
                rendererRef.current.render(sceneRef.current, camera);
            }
            
            if (progress < 1) {
                animationFrameIdRef.current = requestAnimationFrame(animateFocus);
            } else {
                controls.enabled = true;
                controls.update();
                const restartAnimate = () => {
                    animationFrameIdRef.current = requestAnimationFrame(restartAnimate);
                    if (controlsRef.current) controlsRef.current.update();
                    animateParticles();
                    if (rendererRef.current && sceneRef.current && cameraRef.current) {
                        rendererRef.current.render(sceneRef.current, cameraRef.current);
                    }
                };
                restartAnimate();
            }
        };
        
        animateFocus();
    };

    const focusCameraOnLayer = (layer) => {
        const targetCamPos = new THREE.Vector3(layer.position.x, layer.position.y, layer.position.z + 4);
        const targetControlsTarget = new THREE.Vector3(layer.position.x, layer.position.y, layer.position.z);
        animateCameraAndTarget(targetCamPos, targetControlsTarget);
    };

    const resetCameraToDefault = () => {
        const targetCamPos = new THREE.Vector3(0, 0, 8);
        const targetControlsTarget = new THREE.Vector3(0, 0, 0);
        animateCameraAndTarget(targetCamPos, targetControlsTarget);
    };

    const configRef = useRef(data.config);
    useEffect(() => {
        configRef.current = data.config;
    }, [data.config]);

    // Sync container background gradient
    useEffect(() => {
        if (containerRef.current) {
            const gradKey = data.config.backgroundGradient || 'midnight';
            containerRef.current.style.background = GRADIENTS[gradKey] || GRADIENTS.midnight;
        }
    }, [data.config.backgroundGradient]);

    // Re-init particles on config change
    useEffect(() => {
        if (sceneRef.current) {
            initParticleSystem(sceneRef.current, data.config.particleType || 'none');
        }
    }, [data.config.particleType]);

    // Initialize config history
    useEffect(() => {
        if (data.config && historyRef.current.length === 0) {
            historyRef.current = [JSON.stringify(data.config)];
            historyIndexRef.current = 0;
        }
    }, [data.config]);

    // Focus camera on selected layer changes
    useEffect(() => {
        if (selectedLayerId !== prevSelectedLayerIdRef.current) {
            prevSelectedLayerIdRef.current = selectedLayerId;
            if (selectedLayerId) {
                const layer = data.config.layers.find(l => l.id === selectedLayerId);
                if (layer) {
                    focusCameraOnLayer(layer);
                }
            } else {
                resetCameraToDefault();
            }
        }
    }, [selectedLayerId]);

    // Keep refs in sync with React state
    useEffect(() => {
        isPlayingPreviewRef.current = isPlayingPreview;
    }, [isPlayingPreview]);

    useEffect(() => {
        dragEndCallbackRef.current = (layerId, x, y) => {
            setData(d => {
                const updatedLayers = d.config.layers.map(layer => {
                    if (layer.id === layerId) {
                        return {
                            ...layer,
                            position: { ...layer.position, x, y }
                        };
                    }
                    return layer;
                });
                
                const newConfig = { ...d.config, layers: updatedLayers };
                saveHistoryState(newConfig);

                return {
                    ...d,
                    config: newConfig
                };
            });
        };

        resizeEndCallbackRef.current = (layerId, scaleX, scaleY, posX, posY) => {
            setData(d => {
                const updatedLayers = d.config.layers.map(layer => {
                    if (layer.id === layerId) {
                        return {
                            ...layer,
                            scale: { ...layer.scale, x: scaleX, y: scaleY },
                            position: { ...layer.position, x: posX, y: posY }
                        };
                    }
                    return layer;
                });
                
                const newConfig = { ...d.config, layers: updatedLayers };
                saveHistoryState(newConfig);

                return {
                    ...d,
                    config: newConfig
                };
            });
        };
    }, [data.config.layers]);

    useEffect(() => {
        selectLayerCallbackRef.current = (layerId) => {
            setSelectedLayerId(layerId);
        };
    }, []);

    // Sync slug with name when creating
    const handleNameChange = (e) => {
        const name = e.target.value;
        setData(d => ({
            ...d,
            name,
            slug: isEdit ? d.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
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
        
        // Retrigger 3D text texture rendering when all fonts are fully loaded by the browser
        const reRenderOnFontLoad = () => {
            if (configRef.current && typeof render3DLayers === 'function') {
                render3DLayers(configRef.current.layers);
            }
        };
        document.fonts.ready.then(reRenderOnFontLoad);
    }, []);

    // 1. Core 3D Viewport Setup
    useEffect(() => {
        if (!containerRef.current) return;

        // Init Scene
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight || 500;

        const threeScene = new THREE.Scene();
        // Background is transparent to show CSS gradients
        sceneRef.current = threeScene;

        // Add Grid Helper
        const gridHelper = new THREE.GridHelper(30, 30, '#333338', '#222225');
        gridHelper.position.y = -5;
        threeScene.add(gridHelper);

        // Add Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        threeScene.add(ambientLight);

        // Add Directional Light
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
        dirLight.position.set(5, 10, 7);
        threeScene.add(dirLight);

        // Init Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 8);
        cameraRef.current = camera;

        // Init Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Init Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI; // allow full camera orbits
        controlsRef.current = controls;

        // Init particles based on current config setting
        initParticleSystem(threeScene, configRef.current.particleType || 'none');

        // Pointer dragging and resizing variables
        let isDraggingMesh = false;
        let isResizingMesh = false;
        let dragLayerId = null;
        let activeHandleIdx = -1;
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        const dragPlane = new THREE.Plane();
        const planeIntersection = new THREE.Vector3();
        const dragOffset = new THREE.Vector3();

        const initialScale = new THREE.Vector3();
        const initialPosition = new THREE.Vector3();
        const initialIntersection = new THREE.Vector3();

        const onPointerDown = (e) => {
            if (isPlayingPreviewRef.current) return;
            if (spacePressedRef.current) return; // Prevent element selection/dragging during space-pan mode

            const rect = renderer.domElement.getBoundingClientRect();
            const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
            const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
            
            if (clientX === undefined || clientY === undefined) return;

            mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            // 1. Check if clicked a corner handle first
            if (selectedLayerIdRef.current && handlesRef.current && handlesRef.current.length > 0) {
                const mesh = meshesRef.current[selectedLayerIdRef.current];
                if (mesh) {
                    const intersectsHandles = raycaster.intersectObjects(handlesRef.current);
                    if (intersectsHandles.length > 0) {
                        e.preventDefault();
                        isResizingMesh = true;
                        dragLayerId = selectedLayerIdRef.current;
                        activeHandleIdx = handlesRef.current.indexOf(intersectsHandles[0].object);
                        controls.enabled = false;
                        
                        const normal = new THREE.Vector3();
                        camera.getWorldDirection(normal);
                        normal.negate();
                        dragPlane.setFromNormalAndCoplanarPoint(normal, mesh.position);
                        
                        if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                            initialScale.copy(mesh.scale);
                            initialPosition.copy(mesh.position);
                            initialIntersection.copy(planeIntersection);
                        }
                        return; // Stop, do not trigger mesh selection or translation dragging
                    }
                }
            }

            // 2. Click mesh for normal select / drag translation
            const meshes = Object.values(meshesRef.current);
            const intersects = raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const hitMesh = intersects[0].object;
                const layerId = Object.keys(meshesRef.current).find(key => meshesRef.current[key] === hitMesh);
                
                if (layerId) {
                    e.preventDefault();
                    isDraggingMesh = true;
                    dragLayerId = layerId;
                    
                    if (selectLayerCallbackRef.current) {
                        selectLayerCallbackRef.current(layerId);
                    }
                    
                    controls.enabled = false;

                    const normal = new THREE.Vector3();
                    camera.getWorldDirection(normal);
                    normal.negate();
                    dragPlane.setFromNormalAndCoplanarPoint(normal, hitMesh.position);

                    if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                        dragOffset.copy(hitMesh.position).sub(planeIntersection);
                    }
                }
            }
        };

        const onPointerMove = (e) => {
            if (spacePressedRef.current) {
                spaceDraggedRef.current = true;
                if (containerRef.current && containerRef.current.style.cursor !== 'grabbing') {
                    containerRef.current.style.cursor = 'grabbing';
                }
            }

            const rect = renderer.domElement.getBoundingClientRect();
            const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
            const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
            
            if (clientX === undefined || clientY === undefined) return;

            mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            // A. Handle resizing mesh via handles
            if (isResizingMesh && dragLayerId && meshesRef.current[dragLayerId]) {
                if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                    const mesh = meshesRef.current[dragLayerId];
                    const texture = mesh.material.map;
                    const aspect = (texture && texture.image && texture.image.width > 0) ? (texture.image.width / texture.image.height) : 1;
                    
                    const halfW = (3 * initialScale.x) / 2;
                    const halfH = (3 * initialScale.y) / 2;
                    
                    const localPoints = [
                        new THREE.Vector3(-halfW, halfH, 0),  // Top-Left (0)
                        new THREE.Vector3(halfW, halfH, 0),   // Top-Right (1)
                        new THREE.Vector3(-halfW, -halfH, 0), // Bottom-Left (2)
                        new THREE.Vector3(halfW, -halfH, 0)   // Bottom-Right (3)
                    ];
                    
                    const startMatrix = new THREE.Matrix4().compose(
                        initialPosition,
                        mesh.quaternion,
                        new THREE.Vector3(1, 1, 1)
                    );
                    
                    const oppWorldPos = localPoints[3 - activeHandleIdx].clone().applyMatrix4(startMatrix);
                    
                    const localX = new THREE.Vector3(1, 0, 0).applyQuaternion(mesh.quaternion);
                    const localY = new THREE.Vector3(0, 1, 0).applyQuaternion(mesh.quaternion);
                    
                    const diagonal = planeIntersection.clone().sub(oppWorldPos);
                    const newWidth = Math.abs(diagonal.dot(localX));
                    const newHeight = Math.abs(diagonal.dot(localY));
                    
                    let newScaleX = newWidth / (3 * aspect);
                    let newScaleY = newHeight / 3;
                    
                    // Maintain aspect ratio if Shift is pressed
                    if (e.shiftKey) {
                        const origScaleX = initialScale.x / aspect;
                        const origScaleY = initialScale.y;
                        
                        const scaleFactorX = newScaleX / origScaleX;
                        const scaleFactorY = newScaleY / origScaleY;
                        const scaleFactor = (scaleFactorX + scaleFactorY) / 2;
                        
                        newScaleX = origScaleX * scaleFactor;
                        newScaleY = origScaleY * scaleFactor;
                    }
                    
                    const dx = (activeHandleIdx % 2 === 0) ? -1 : 1;
                    const dy = (activeHandleIdx < 2) ? 1 : -1;
                    
                    const newCenter = oppWorldPos.clone()
                        .add(localX.clone().multiplyScalar(dx * newScaleX * 3 * aspect * 0.5))
                        .add(localY.clone().multiplyScalar(dy * newScaleY * 3 * 0.5));
                    
                    mesh.position.copy(newCenter);
                    mesh.scale.set(newScaleX * aspect, newScaleY, 1);
                    
                    if (selectionHelperRef.current) {
                        selectionHelperRef.current.update();
                    }
                    if (handlesRef.current && handlesRef.current.length > 0) {
                        updateHandlesPosition(mesh, handlesRef.current);
                    }
                }
                return;
            }

            // B. Handle normal translation dragging
            if (!isDraggingMesh || !dragLayerId || !meshesRef.current[dragLayerId]) return;

            if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                const newPos = planeIntersection.clone().add(dragOffset);
                const mesh = meshesRef.current[dragLayerId];
                mesh.position.x = newPos.x;
                mesh.position.y = newPos.y;
            }
        };

        const onPointerUp = () => {
            if (spacePressedRef.current && containerRef.current) {
                containerRef.current.style.cursor = 'grab';
            }
            
            if (isResizingMesh && dragLayerId && meshesRef.current[dragLayerId]) {
                const mesh = meshesRef.current[dragLayerId];
                const texture = mesh.material.map;
                const aspect = (texture && texture.image && texture.image.width > 0) ? (texture.image.width / texture.image.height) : 1;
                
                const finalScaleX = Math.round((mesh.scale.x / aspect) * 100) / 100;
                const finalScaleY = Math.round(mesh.scale.y * 100) / 100;
                const finalPosX = Math.round(mesh.position.x * 10) / 10;
                const finalPosY = Math.round(mesh.position.y * 10) / 10;

                if (resizeEndCallbackRef.current) {
                    resizeEndCallbackRef.current(dragLayerId, finalScaleX, finalScaleY, finalPosX, finalPosY);
                }
            } else if (isDraggingMesh && dragLayerId && meshesRef.current[dragLayerId]) {
                const mesh = meshesRef.current[dragLayerId];
                const finalX = Math.round(mesh.position.x * 10) / 10;
                const finalY = Math.round(mesh.position.y * 10) / 10;

                if (dragEndCallbackRef.current) {
                    dragEndCallbackRef.current(dragLayerId, finalX, finalY);
                }
            }
            
            isDraggingMesh = false;
            isResizingMesh = false;
            dragLayerId = null;
            activeHandleIdx = -1;
            controls.enabled = true;
        };

        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerup', onPointerUp);

        // Animation Loop
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            controls.update();
            if (selectionHelperRef.current) {
                selectionHelperRef.current.update();
            }
            if (selectedLayerIdRef.current && meshesRef.current[selectedLayerIdRef.current] && handlesRef.current && handlesRef.current.length > 0) {
                updateHandlesPosition(meshesRef.current[selectedLayerIdRef.current], handlesRef.current);
            }
            animateParticles();
            renderer.render(threeScene, camera);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight || 500;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Render initial layers
        render3DLayers(data.config.layers);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (rendererRef.current && rendererRef.current.domElement) {
                rendererRef.current.domElement.removeEventListener('pointerdown', onPointerDown);
                rendererRef.current.domElement.removeEventListener('pointermove', onPointerMove);
                rendererRef.current.domElement.removeEventListener('pointerup', onPointerUp);
                rendererRef.current.domElement.remove();
            }
            // Dispose meshes
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
        };
    }, []);

    // 2. Mesh Builder for layers
    const render3DLayers = (layersList) => {
        if (!sceneRef.current) return;

        // Remove old meshes that are no longer in layers
        const layerIds = layersList.map(l => l.id);
        Object.keys(meshesRef.current).forEach(id => {
            if (!layerIds.includes(id)) {
                sceneRef.current.remove(meshesRef.current[id]);
                delete meshesRef.current[id];
            }
        });

        // Add or update meshes
        const textureLoader = new THREE.TextureLoader();

        layersList.forEach(layer => {
            if (!layer.visible) {
                if (meshesRef.current[layer.id]) {
                    sceneRef.current.remove(meshesRef.current[layer.id]);
                }
                return;
            }

            if (meshesRef.current[layer.id]) {
                const mesh = meshesRef.current[layer.id];
                
                if (layer.type === 'text') {
                    // Check if any text properties changed
                    if (
                        mesh.userData.type !== 'text' ||
                        mesh.userData.text !== layer.text ||
                        mesh.userData.fontFamily !== layer.fontFamily ||
                        mesh.userData.fontSize !== layer.fontSize ||
                        mesh.userData.color !== layer.color ||
                        mesh.userData.fontWeight !== layer.fontWeight ||
                        mesh.userData.fontStyle !== layer.fontStyle
                    ) {
                        if (mesh.material.map) {
                            mesh.material.map.dispose();
                        }
                        const newTexture = createTextTexture(layer);
                        mesh.material.map = newTexture;
                        mesh.material.needsUpdate = true;
                        
                        mesh.userData = {
                            type: 'text',
                            text: layer.text,
                            fontFamily: layer.fontFamily,
                            fontSize: layer.fontSize,
                            color: layer.color,
                            fontWeight: layer.fontWeight,
                            fontStyle: layer.fontStyle,
                            aspectRatio: newTexture.aspectRatio
                        };
                    }
                } else {
                    // Check if URL changed (e.g. background removed)
                    if (mesh.userData.url !== layer.url || mesh.userData.type === 'text') {
                        if (mesh.material.map) {
                            mesh.material.map.dispose();
                        }
                        
                        const newTexture = textureLoader.load(layer.url, (tex) => {
                            const aspect = tex.image.width / tex.image.height;
                            mesh.scale.set(layer.scale.x * aspect, layer.scale.y, 1);
                        });
                        
                        mesh.material.map = newTexture;
                        mesh.material.needsUpdate = true;
                        mesh.userData = { url: layer.url };
                    }
                }

                // Ensure it is added back to the scene if it was hidden
                if (!sceneRef.current.children.includes(mesh)) {
                    sceneRef.current.add(mesh);
                }

                mesh.position.set(layer.position.x, layer.position.y, layer.position.z);
                mesh.rotation.set(
                    THREE.MathUtils.degToRad(layer.rotation.x),
                    THREE.MathUtils.degToRad(layer.rotation.y),
                    THREE.MathUtils.degToRad(layer.rotation.z)
                );
                
                // Apply scale with texture aspect ratio
                const texture = mesh.material.map;
                if (layer.type === 'text') {
                    const aspect = mesh.userData.aspectRatio || 1;
                    mesh.scale.set(layer.scale.x * aspect, layer.scale.y, 1);
                } else if (texture && texture.image && texture.image.width > 0) {
                    const aspect = texture.image.width / texture.image.height;
                    mesh.scale.set(layer.scale.x * aspect, layer.scale.y, 1);
                } else {
                    mesh.scale.set(layer.scale.x, layer.scale.y, 1);
                }
                return;
            }

            // Create new Mesh
            const geometry = new THREE.PlaneGeometry(3, 3);
            let texture;
            
            if (layer.type === 'text') {
                texture = createTextTexture(layer);
            } else {
                texture = textureLoader.load(layer.url, (tex) => {
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
                mesh.userData = {
                    type: 'text',
                    text: layer.text,
                    fontFamily: layer.fontFamily,
                    fontSize: layer.fontSize,
                    color: layer.color,
                    fontWeight: layer.fontWeight,
                    fontStyle: layer.fontStyle,
                    aspectRatio: aspect
                };
            } else {
                mesh.scale.set(layer.scale.x, layer.scale.y, 1);
                mesh.userData = { url: layer.url };
            }

            sceneRef.current.add(mesh);
            meshesRef.current[layer.id] = mesh;
        });
    };

    // Keep 3D meshes in sync with config layers state changes
    useEffect(() => {
        render3DLayers(data.config.layers);
    }, [data.config.layers]);

    // Draw selection indicator (bounding box outline) around selected layer
    useEffect(() => {
        if (!sceneRef.current) return;

        // Clean up previous helper
        if (selectionHelperRef.current) {
            sceneRef.current.remove(selectionHelperRef.current);
            if (selectionHelperRef.current.geometry) selectionHelperRef.current.geometry.dispose();
            if (selectionHelperRef.current.material) selectionHelperRef.current.material.dispose();
            selectionHelperRef.current = null;
        }

        // Clean up previous handles
        if (handlesRef.current && handlesRef.current.length > 0) {
            handlesRef.current.forEach(h => {
                if (sceneRef.current) sceneRef.current.remove(h);
                if (h.geometry) h.geometry.dispose();
                if (h.material) h.material.dispose();
            });
            handlesRef.current = [];
        }

        if (selectedLayerId) {
            const mesh = meshesRef.current[selectedLayerId];
            if (mesh && sceneRef.current.children.includes(mesh)) {
                // Create selection BoxHelper in theme's highlight color (#E5654B)
                const helper = new THREE.BoxHelper(mesh, '#E5654B');
                // Make sure helper renders on top of layers for clear visibility
                helper.material.depthTest = false;
                helper.renderOrder = 999;
                
                sceneRef.current.add(helper);
                selectionHelperRef.current = helper;

                // Create 4 handles at corners
                const handles = [];
                const handleGeometry = new THREE.BoxGeometry(0.12, 0.12, 0.02);
                const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false });
                
                for (let i = 0; i < 4; i++) {
                    const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
                    handleMesh.renderOrder = 1000;
                    sceneRef.current.add(handleMesh);
                    handles.push(handleMesh);
                }
                handlesRef.current = handles;
                
                updateHandlesPosition(mesh, handles);
            }
        }

        return () => {
            if (selectionHelperRef.current && sceneRef.current) {
                sceneRef.current.remove(selectionHelperRef.current);
                if (selectionHelperRef.current.geometry) selectionHelperRef.current.geometry.dispose();
                if (selectionHelperRef.current.material) selectionHelperRef.current.material.dispose();
                selectionHelperRef.current = null;
            }
            if (handlesRef.current && handlesRef.current.length > 0) {
                handlesRef.current.forEach(h => {
                    if (sceneRef.current) sceneRef.current.remove(h);
                    if (h.geometry) h.geometry.dispose();
                    if (h.material) h.material.dispose();
                });
                handlesRef.current = [];
            }
        };
    }, [selectedLayerId, data.config.layers]);

    // Clipboard Paste & Keyboard Shortcuts Setup
    useEffect(() => {
        // Global Paste Listener (Ctrl+V)
        const handleGlobalPaste = async (e) => {
            const activeEl = document.activeElement;
            const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable;
            
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const file = items[i].getAsFile();
                    if (!file) continue;

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                        const response = await axios.post('/super-admin/three-d-scenes/upload-asset', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });

                        if (response.data.success) {
                            addLayer(response.data.url, 'upload');
                        }
                    } catch (error) {
                        console.error('Clipboard image paste upload error:', error);
                        alert('Gagal mengunggah gambar dari clipboard.');
                    }
                    return;
                }
            }

            // Check if pasted content is an image URL string
            const text = e.clipboardData.getData('text');
            if (text && (text.startsWith('http://') || text.startsWith('https://')) && text.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) {
                e.preventDefault();
                addLayer(text, 'upload');
            }
        };

        // Desktop Key Shortcuts
        const handleKeyDown = (e) => {
            const activeEl = document.activeElement;
            const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable;

            if (isInput) {
                if (e.key === 'Escape') activeEl.blur();
                return;
            }

            // Redirect to background remover functions if active
            if (showBgRemoverRef.current) {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    handleBgUndo();
                    return;
                }
                if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
                    e.preventDefault();
                    handleBgRedo();
                    return;
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    setShowBgRemover(false);
                    return;
                }
                return; // block other editor key events
            }

            // Space: Hold space down for Photoshop-style pan mode
            if (e.key === ' ') {
                e.preventDefault();
                if (!e.repeat) {
                    spacePressedRef.current = true;
                    spaceDraggedRef.current = false;
                    if (controlsRef.current) {
                        controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.PAN;
                        if (containerRef.current) {
                            containerRef.current.style.cursor = 'grab';
                        }
                    }
                }
                return;
            }

            // Ctrl+Z / Cmd+Z: Undo
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleEditorUndo();
                return;
            }

            // Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z: Redo
            if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
                e.preventDefault();
                handleEditorRedo();
                return;
            }

            // Ctrl+S / Cmd+S: Save
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                handleSubmit(e);
                return;
            }

            // Esc: Deselect or close DrawingPad
            if (e.key === 'Escape') {
                e.preventDefault();
                if (showDrawingPad) {
                    setShowDrawingPad(false);
                } else {
                    setSelectedLayerId(null);
                }
                return;
            }

            // Actions for selected layer
            if (selectedLayerId) {
                const currentLayer = configRef.current.layers.find(l => l.id === selectedLayerId);
                if (!currentLayer) return;

                // Delete selected layer
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault();
                    if (confirm(`Hapus layer "${currentLayer.name}"?`)) {
                        deleteLayer(selectedLayerId);
                    }
                }

                // Arrow keys navigation
                const step = e.shiftKey ? 1.0 : 0.1;
                
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    updateLayerProperty(selectedLayerId, 'position', {
                        ...currentLayer.position,
                        x: Math.round((currentLayer.position.x - step) * 10) / 10
                    });
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    updateLayerProperty(selectedLayerId, 'position', {
                        ...currentLayer.position,
                        x: Math.round((currentLayer.position.x + step) * 10) / 10
                    });
                }

                if (e.shiftKey) {
                    // Shift + Up/Down modifies Z (depth)
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        updateLayerProperty(selectedLayerId, 'position', {
                            ...currentLayer.position,
                            z: Math.round((currentLayer.position.z + step) * 10) / 10
                        });
                    }
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        updateLayerProperty(selectedLayerId, 'position', {
                            ...currentLayer.position,
                            z: Math.round((currentLayer.position.z - step) * 10) / 10
                        });
                    }
                } else {
                    // Regular Up/Down modifies Y position
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        updateLayerProperty(selectedLayerId, 'position', {
                            ...currentLayer.position,
                            y: Math.round((currentLayer.position.y + step) * 10) / 10
                        });
                    }
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        updateLayerProperty(selectedLayerId, 'position', {
                            ...currentLayer.position,
                            y: Math.round((currentLayer.position.y - step) * 10) / 10
                        });
                    }
                }
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === ' ') {
                spacePressedRef.current = false;
                if (controlsRef.current) {
                    controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
                    if (containerRef.current) {
                        containerRef.current.style.cursor = 'auto';
                    }
                }
                
                // If they just tapped Space without dragging, play/pause trajectory
                if (!spaceDraggedRef.current) {
                    if (configRef.current.keyframes.length >= 2) {
                        if (isPlayingPreviewRef.current) {
                            stopCameraTrajectory();
                        } else {
                            setSelectedLayerId(null); // Clear selection when starting pratinjau
                            playCameraTrajectory();
                        }
                    }
                }
            }

            // Save history when they release the Arrow key (finished nudging)
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                saveHistoryState(configRef.current);
            }
        };

        document.addEventListener('paste', handleGlobalPaste);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [selectedLayerId, showDrawingPad]);

    // 3. Layer manipulation functions
    const updateLayerProperty = (layerId, property, value) => {
        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    return { ...layer, [property]: value };
                }
                return layer;
            });
            return {
                ...d,
                config: { ...d.config, layers: updatedLayers }
            };
        });
    };

    const addLayer = (url, type = 'upload') => {
        const newLayer = {
            id: 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: type === 'draw' ? `Coretan #${data.config.layers.length + 1}` : `Gambar #${data.config.layers.length + 1}`,
            type,
            url,
            visible: true,
            position: { x: 0, y: 0, z: data.config.layers.length * -1.5 }, // space layers along Z axis
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1 }
        };

        const newLayers = [...data.config.layers, newLayer];
        // Save history state!
        saveHistoryState({ ...data.config, layers: newLayers });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: newLayers }
        }));
        setSelectedLayerId(newLayer.id);
    };

    const handleAddTextLayer = () => {
        const newLayer = {
            id: 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: `Teks #${data.config.layers.length + 1}`,
            type: 'text',
            text: 'Ketik Teks Di Sini',
            fontFamily: 'Playfair Display',
            fontSize: 64,
            color: '#E5654B',
            fontWeight: 'normal',
            fontStyle: 'normal',
            visible: true,
            position: { x: 0, y: 0, z: data.config.layers.length * -1.5 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1.5, y: 1.5 }
        };

        const newLayers = [...data.config.layers, newLayer];
        saveHistoryState({ ...data.config, layers: newLayers });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: newLayers }
        }));
        setSelectedLayerId(newLayer.id);
    };

    const deleteLayer = (id) => {
        const filtered = data.config.layers.filter(l => l.id !== id);
        // Save history state!
        saveHistoryState({ ...data.config, layers: filtered });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: filtered }
        }));
        if (selectedLayerId === id) setSelectedLayerId(null);
    };

    const toggleLayerVisibility = (id) => {
        const updated = data.config.layers.map(l => {
            if (l.id === id) return { ...l, visible: !l.visible };
            return l;
        });
        // Save history state!
        saveHistoryState({ ...data.config, layers: updated });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: updated }
        }));
    };

    // 4. File Upload Handler
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/super-admin/three-d-scenes/upload-asset', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                addLayer(response.data.url, 'upload');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal mengunggah file. Silakan coba lagi.');
        }
    };

    // 5. Drawing Pad Functions
    const startDrawing = (e) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
        const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
        if (clientX === undefined || clientY === undefined) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setIsDrawing(true);
        drawLastXRef.current = x;
        drawLastYRef.current = y;

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Configure brush style
        ctx.lineWidth = drawWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (drawTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.fillStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = drawColor;
            ctx.fillStyle = drawColor;
        }

        // Draw an initial point for simple clicks
        ctx.arc(x, y, drawWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        // Re-begin path for subsequent lines to draw cleanly from this point
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
        const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
        if (clientX === undefined || clientY === undefined) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = drawWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (drawTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = drawColor;
        }

        // Calculate midpoint for smooth curves
        const lastX = drawLastXRef.current;
        const lastY = drawLastYRef.current;
        const midX = (lastX + x) / 2;
        const midY = (lastY + y) / 2;

        ctx.quadraticCurveTo(lastX, lastY, midX, midY);
        ctx.stroke();

        drawLastXRef.current = x;
        drawLastYRef.current = y;
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        saveHistory();
    };

    const saveHistory = () => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const state = canvas.toDataURL();
        const newHistory = drawHistory.slice(0, historyIndex + 1);
        newHistory.push(state);
        setDrawHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleDrawingUndo = () => {
        if (historyIndex <= 0) {
            // Clear canvas
            clearDrawingCanvas();
            setHistoryIndex(-1);
            return;
        }
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        restoreCanvasState(drawHistory[prevIndex]);
    };

    const clearDrawingCanvas = () => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const restoreCanvasState = (dataUrl) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
    };
    const handleSaveDrawing = async () => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;

        // Verify if canvas is empty
        const ctx = canvas.getContext('2d');
        const buffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
        const hasContent = buffer.some(color => color !== 0);

        if (!hasContent) {
            alert('Kanvas masih kosong! Warnai coretan Anda terlebih dahulu.');
            return;
        }

        const base64Data = canvas.toDataURL('image/png');

        try {
            const response = await axios.post('/super-admin/three-d-scenes/upload-asset', {
                base64: base64Data
            });

            if (response.data.success) {
                addLayer(response.data.url, 'draw');
                setShowDrawingPad(false);
                clearDrawingCanvas();
                setDrawHistory([]);
                setHistoryIndex(-1);
            }
        } catch (error) {
            console.error('Base64 upload error:', error);
            alert('Gagal mengunggah coretan. Silakan coba lagi.');
        }
    };

    // 5b. Background Remover Functions & Handlers
    useEffect(() => {
        if (showBgRemover && bgRemoverLayer) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = bgCanvasRef.current;
                if (!canvas) return;
                
                const maxDim = 500;
                let w = img.naturalWidth;
                let h = img.naturalHeight;
                
                if (w > maxDim || h > maxDim) {
                    if (w > h) {
                        h = (h * maxDim) / w;
                        w = maxDim;
                    } else {
                        w = (w * maxDim) / h;
                        h = maxDim;
                    }
                }
                
                canvas.width = w;
                canvas.height = h;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                
                const initialState = canvas.toDataURL();
                
                // Create scaled original image from data URL for restore brush pattern
                const origImg = new Image();
                origImg.onload = () => {
                    bgOriginalImgRef.current = origImg;
                };
                origImg.src = initialState;

                setBgHistory([initialState]);
                setBgHistoryIndex(0);
            };
            img.src = bgRemoverLayer.url;
        }
    }, [showBgRemover, bgRemoverLayer]);

    const saveBgHistoryState = () => {
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const state = canvas.toDataURL();
        const newHistory = bgHistory.slice(0, bgHistoryIndex + 1);
        newHistory.push(state);
        setBgHistory(newHistory);
        setBgHistoryIndex(newHistory.length - 1);
    };

    const handleBgUndo = () => {
        if (bgHistoryIndex <= 0) return;
        const prevIndex = bgHistoryIndex - 1;
        setBgHistoryIndex(prevIndex);
        
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(img, 0, 0);
        };
        img.src = bgHistory[prevIndex];
    };

    const handleBgRedo = () => {
        if (bgHistoryIndex >= bgHistory.length - 1) return;
        const nextIndex = bgHistoryIndex + 1;
        setBgHistoryIndex(nextIndex);
        
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(img, 0, 0);
        };
        img.src = bgHistory[nextIndex];
    };

    const handleBgReset = () => {
        if (bgHistory.length === 0) return;
        setBgHistoryIndex(0);
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(img, 0, 0);
        };
        img.src = bgHistory[0];
    };

    const handleBgAutoRemove = () => {
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        const getPixel = (x, y) => {
            const idx = (y * width + x) * 4;
            return [data[idx], data[idx+1], data[idx+2], data[idx+3]];
        };
        
        // Define points to sample from the corners and nearby edges to detect alternating colors
        const samplePoints = [
            [0, 0], [8, 0], [0, 8],
            [width - 1, 0], [width - 9, 0], [width - 1, 8],
            [0, height - 1], [8, height - 1], [0, height - 9],
            [width - 1, height - 1], [width - 9, height - 1], [width - 1, height - 9]
        ];
        
        const colorDistance = (c1, c2) => {
            return Math.sqrt(
                Math.pow(c1[0] - c2[0], 2) +
                Math.pow(c1[1] - c2[1], 2) +
                Math.pow(c1[2] - c2[2], 2)
            );
        };

        // Collect background colors that are not transparent
        const bgColors = [];
        for (const [sx, sy] of samplePoints) {
            if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
            const col = getPixel(sx, sy);
            if (col[3] > 0) {
                // Check if this color is already represented in our bgColors list
                let exists = false;
                for (const existingCol of bgColors) {
                    if (colorDistance(col, existingCol) < 15) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    bgColors.push(col);
                }
            }
        }
        
        if (bgColors.length === 0) {
            alert('Tidak dapat mendeteksi warna latar belakang di sudut gambar.');
            return;
        }
        
        const tol = bgRemoverTolerance;
        const visited = new Uint8Array(width * height);
        const queue = [];
        
        // Push all non-transparent sample points to queue as starting points of flood fill
        for (const [sx, sy] of samplePoints) {
            if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
            const idx = sx + sy * width;
            if (!visited[idx] && getPixel(sx, sy)[3] > 0) {
                visited[idx] = 1;
                queue.push(idx);
            }
        }
        
        let head = 0;
        
        while (head < queue.length) {
            const val = queue[head++];
            const x = val % width;
            const y = Math.floor(val / width);
            
            const idx = val * 4;
            data[idx + 3] = 0; // Erase
            
            const checkNeighbor = (nx, ny) => {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nIdx = nx + ny * width;
                    if (!visited[nIdx]) {
                        const pIdx = nIdx * 4;
                        if (data[pIdx + 3] > 0) {
                            // Check similarity against ANY of the detected background colors
                            const nr = data[pIdx];
                            const ng = data[pIdx + 1];
                            const nb = data[pIdx + 2];
                            
                            let matches = false;
                            for (const bgCol of bgColors) {
                                const dist = Math.sqrt(
                                    Math.pow(nr - bgCol[0], 2) +
                                    Math.pow(ng - bgCol[1], 2) +
                                    Math.pow(nb - bgCol[2], 2)
                                );
                                if (dist < tol) {
                                    matches = true;
                                    break;
                                }
                            }
                            
                            if (matches) {
                                visited[nIdx] = 1;
                                queue.push(nIdx);
                            }
                        }
                    }
                }
            };
            
            checkNeighbor(x + 1, y);
            checkNeighbor(x - 1, y);
            checkNeighbor(x, y + 1);
            checkNeighbor(x, y - 1);
        }
        
        // Auto-remove inland checkerboard holes (enclosed spaces like between legs)
        if (bgColors.length >= 2) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    if (visited[idx] === 0 && data[idx * 4 + 3] > 0) {
                        const nr = data[idx * 4];
                        const ng = data[idx * 4 + 1];
                        const nb = data[idx * 4 + 2];
                        let matches = false;
                        for (const bgCol of bgColors) {
                            const dist = Math.sqrt(
                                Math.pow(nr - bgCol[0], 2) +
                                Math.pow(ng - bgCol[1], 2) +
                                Math.pow(nb - bgCol[2], 2)
                            );
                            if (dist < tol) {
                                matches = true;
                                break;
                            }
                        }
                        
                        if (matches) {
                            const component = [];
                            const compQueue = [idx];
                            visited[idx] = 1;
                            let compHead = 0;
                            
                            let color1Count = 0;
                            let color2Count = 0;
                            
                            while (compHead < compQueue.length) {
                                const curr = compQueue[compHead++];
                                component.push(curr);
                                
                                const cx = curr % width;
                                const cy = Math.floor(curr / width);
                                
                                const cIdx = curr * 4;
                                const cr = data[cIdx];
                                const cg = data[cIdx+1];
                                const cb = data[cIdx+2];
                                
                                const dist0 = Math.sqrt(
                                    Math.pow(cr - bgColors[0][0], 2) +
                                    Math.pow(cg - bgColors[0][1], 2) +
                                    Math.pow(cb - bgColors[0][2], 2)
                                );
                                const dist1 = Math.sqrt(
                                    Math.pow(cr - bgColors[1][0], 2) +
                                    Math.pow(cg - bgColors[1][1], 2) +
                                    Math.pow(cb - bgColors[1][2], 2)
                                );
                                
                                if (dist0 < dist1) {
                                    color1Count++;
                                } else {
                                    color2Count++;
                                }
                                
                                const checkCompNeighbor = (nx, ny) => {
                                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                        const nIdx = nx + ny * width;
                                        if (visited[nIdx] === 0 && data[nIdx * 4 + 3] > 0) {
                                            const nnr = data[nIdx * 4];
                                            const nng = data[nIdx * 4 + 1];
                                            const nnb = data[nIdx * 4 + 2];
                                            
                                            let nMatches = false;
                                            for (const bgCol of bgColors) {
                                                const ndist = Math.sqrt(
                                                    Math.pow(nnr - bgCol[0], 2) +
                                                    Math.pow(nng - bgCol[1], 2) +
                                                    Math.pow(nnb - bgCol[2], 2)
                                                );
                                                if (ndist < tol) {
                                                    nMatches = true;
                                                    break;
                                                }
                                            }
                                            
                                            if (nMatches) {
                                                visited[nIdx] = 1;
                                                compQueue.push(nIdx);
                                            }
                                        }
                                    }
                                };
                                
                                checkCompNeighbor(cx + 1, cy);
                                checkCompNeighbor(cx - 1, cy);
                                checkCompNeighbor(cx, cy + 1);
                                checkCompNeighbor(cx, cy - 1);
                            }
                            
                            const totalCompPixels = compQueue.length;
                            const ratio1 = color1Count / totalCompPixels;
                            const ratio2 = color2Count / totalCompPixels;
                            
                            if (ratio1 > 0.1 && ratio2 > 0.1 && color1Count > 5 && color2Count > 5) {
                                for (const compIdx of component) {
                                    data[compIdx * 4 + 3] = 0;
                                }
                            } else {
                                for (const compIdx of component) {
                                    visited[compIdx] = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
        saveBgHistoryState();
    };

    const getCanvasCoordinates = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: ((clientX - rect.left) * canvas.width) / rect.width,
            y: ((clientY - rect.top) * canvas.height) / rect.height
        };
    };

    const handleBgCanvasClick = (e) => {
        if (bgRemoverTool !== 'magic') return;
        
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const coords = getCanvasCoordinates(e, canvas);
        const clickX = Math.floor(coords.x);
        const clickY = Math.floor(coords.y);
        
        if (clickX < 0 || clickX >= canvas.width || clickY < 0 || clickY >= canvas.height) return;
        
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        const targetIdx = (clickY * width + clickX) * 4;
        const targetR = data[targetIdx];
        const targetG = data[targetIdx+1];
        const targetB = data[targetIdx+2];
        const targetA = data[targetIdx+3];
        
        if (targetA === 0) return;
        
        const tol = bgRemoverTolerance;
        const visited = new Uint8Array(width * height);
        
        // Define points to sample from the corners and nearby edges to detect background colors
        const samplePoints = [
            [0, 0], [8, 0], [0, 8],
            [width - 1, 0], [width - 9, 0], [width - 1, 8],
            [0, height - 1], [8, height - 1], [0, height - 9],
            [width - 1, height - 1], [width - 9, height - 1], [width - 1, height - 9]
        ];
        
        const colorDistance = (c1, c2) => {
            return Math.sqrt(
                Math.pow(c1[0] - c2[0], 2) +
                Math.pow(c1[1] - c2[1], 2) +
                Math.pow(c1[2] - c2[2], 2)
            );
        };

        // Collect background colors that are not transparent
        const bgColors = [];
        for (const [sx, sy] of samplePoints) {
            if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
            const sIdx = (sy * width + sx) * 4;
            if (data[sIdx + 3] > 0) {
                const col = [data[sIdx], data[sIdx+1], data[sIdx+2]];
                let exists = false;
                for (const existingCol of bgColors) {
                    if (colorDistance(col, existingCol) < 15) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    bgColors.push(col);
                }
            }
        }

        // Check if clicked pixel matches any background color
        let clickedBgColor = false;
        const clickedCol = [targetR, targetG, targetB];
        for (const bgCol of bgColors) {
            if (colorDistance(clickedCol, bgCol) < tol) {
                clickedBgColor = true;
                break;
            }
        }
        
        const startIdx = clickX + clickY * width;
        const queue = [startIdx];
        visited[startIdx] = 1;
        let head = 0;
        
        while (head < queue.length) {
            const val = queue[head++];
            const x = val % width;
            const y = Math.floor(val / width);
            
            const idx = val * 4;
            data[idx + 3] = 0; // Erase
            
            const checkNeighbor = (nx, ny) => {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nIdx = nx + ny * width;
                    if (!visited[nIdx]) {
                        const pIdx = nIdx * 4;
                        if (data[pIdx + 3] > 0) {
                            const nr = data[pIdx];
                            const ng = data[pIdx+1];
                            const nb = data[pIdx+2];
                            
                            let matches = false;
                            if (clickedBgColor) {
                                for (const bgCol of bgColors) {
                                    const dist = Math.sqrt(
                                        Math.pow(nr - bgCol[0], 2) +
                                        Math.pow(ng - bgCol[1], 2) +
                                        Math.pow(nb - bgCol[2], 2)
                                    );
                                    if (dist < tol) {
                                        matches = true;
                                        break;
                                    }
                                }
                            } else {
                                const dist = Math.sqrt(
                                    Math.pow(nr - targetR, 2) +
                                    Math.pow(ng - targetG, 2) +
                                    Math.pow(nb - targetB, 2)
                                );
                                if (dist < tol) {
                                    matches = true;
                                }
                            }
                            
                            if (matches) {
                                visited[nIdx] = 1;
                                queue.push(nIdx);
                            }
                        }
                    }
                }
            };
            
            checkNeighbor(x + 1, y);
            checkNeighbor(x - 1, y);
            checkNeighbor(x, y + 1);
            checkNeighbor(x, y - 1);
        }
        
        ctx.putImageData(imgData, 0, 0);
        saveBgHistoryState();
    };

    const startBgDrawing = (e) => {
        if (bgRemoverTool !== 'manual' && bgRemoverTool !== 'restore') return;
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const coords = getCanvasCoordinates(e, canvas);
        
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        setBgIsDrawing(true);
    };

    const drawBg = (e) => {
        if (!bgIsDrawing || (bgRemoverTool !== 'manual' && bgRemoverTool !== 'restore')) return;
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const coords = getCanvasCoordinates(e, canvas);
        
        ctx.lineWidth = bgRemoverBrushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (bgRemoverTool === 'restore') {
            ctx.globalCompositeOperation = 'source-over';
            if (bgOriginalImgRef.current) {
                const pattern = ctx.createPattern(bgOriginalImgRef.current, 'no-repeat');
                ctx.strokeStyle = pattern;
            } else {
                ctx.strokeStyle = 'rgba(0,0,0,1)';
            }
        } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        }
        
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const stopBgDrawing = () => {
        if (!bgIsDrawing) return;
        setBgIsDrawing(false);
        saveBgHistoryState();
    };

    const handleBgCanvasMouseMove = (e) => {
        if (bgRemoverTool !== 'manual' && bgRemoverTool !== 'restore') {
            if (bgBrushPreviewRef.current) bgBrushPreviewRef.current.style.display = 'none';
            return;
        }
        
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;
        
        const previewSizeX = bgRemoverBrushSize * scaleX;
        const previewSizeY = bgRemoverBrushSize * scaleY;
        
        const container = canvas.parentElement;
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        
        const left = e.clientX - containerRect.left;
        const top = e.clientY - containerRect.top;
        
        if (bgBrushPreviewRef.current) {
            bgBrushPreviewRef.current.style.left = `${left}px`;
            bgBrushPreviewRef.current.style.top = `${top}px`;
            bgBrushPreviewRef.current.style.width = `${previewSizeX}px`;
            bgBrushPreviewRef.current.style.height = `${previewSizeY}px`;
            bgBrushPreviewRef.current.style.display = 'block';
        }
    };

    const handleSaveBgRemoval = async () => {
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        
        setProcessingBgRemoval(true);
        const base64Data = canvas.toDataURL('image/png');
        
        try {
            const response = await axios.post('/super-admin/three-d-scenes/upload-asset', {
                base64: base64Data
            });
            
            if (response.data.success) {
                const updatedLayers = data.config.layers.map(layer => {
                    if (layer.id === bgRemoverLayer.id) {
                        return { ...layer, url: response.data.url };
                    }
                    return layer;
                });
                saveHistoryState({ ...data.config, layers: updatedLayers });
                setData(d => ({
                    ...d,
                    config: { ...d.config, layers: updatedLayers }
                }));
                setShowBgRemover(false);
            }
        } catch (error) {
            console.error('Save bg removal error:', error);
            alert('Gagal menyimpan hasil penghapusan latar belakang.');
        } finally {
            setProcessingBgRemoval(false);
        }
    };

    // Open drawing pad and init empty history
    useEffect(() => {
        if (showDrawingPad) {
            setTimeout(() => {
                const canvas = drawCanvasRef.current;
                if (canvas) {
                    canvas.width = 600;
                    canvas.height = 400;
                    // Reset canvas background
                    clearDrawingCanvas();
                }
            }, 100);
        }
    }, [showDrawingPad]);

    // 6. Camera Keyframes Manager
    const captureCameraKeyframe = () => {
        if (!cameraRef.current) return;
        const cam = cameraRef.current;
        const ctr = controlsRef.current;
        const newKeyframe = {
            id: 'kf_' + Date.now(),
            position: { x: cam.position.x, y: cam.position.y, z: cam.position.z },
            rotation: { x: cam.rotation.x, y: cam.rotation.y, z: cam.rotation.z },
            fov: cam.fov,
            target: ctr ? { x: ctr.target.x, y: ctr.target.y, z: ctr.target.z } : null
        };

        const newKeyframes = [...data.config.keyframes, newKeyframe];
        saveHistoryState({ ...data.config, keyframes: newKeyframes });
        setData(d => ({
            ...d,
            config: { ...d.config, keyframes: newKeyframes }
        }));
    };

    const deleteKeyframe = (id) => {
        const filtered = data.config.keyframes.filter(k => k.id !== id);
        saveHistoryState({ ...data.config, keyframes: filtered });
        setData(d => ({
            ...d,
            config: { ...d.config, keyframes: filtered }
        }));
    };

    const previewKeyframePosition = (kf) => {
        if (!cameraRef.current || !controlsRef.current) return;
        
        // Disable controls temporarily to change positions
        controlsRef.current.enabled = false;
        
        cameraRef.current.position.set(kf.position.x, kf.position.y, kf.position.z);
        cameraRef.current.rotation.set(kf.rotation.x, kf.rotation.y, kf.rotation.z);
        cameraRef.current.fov = kf.fov;
        cameraRef.current.updateProjectionMatrix();

        if (kf.target) {
            controlsRef.current.target.set(kf.target.x, kf.target.y, kf.target.z);
        } else {
            // Fallback for old saved keyframes without target data: project target in front of camera
            const dir = new THREE.Vector3();
            cameraRef.current.getWorldDirection(dir);
            controlsRef.current.target.copy(cameraRef.current.position).addScaledVector(dir, 5);
        }
        
        controlsRef.current.enabled = true;
        controlsRef.current.update();
    };

    // Play/Animate camera through path of all keyframes
    const playCameraTrajectory = () => {
        const kfs = data.config.keyframes;
        if (kfs.length < 2) {
            alert('Butuh minimal 2 keyframe kamera untuk menganimasikan pergerakan!');
            return;
        }

        setIsPlayingPreview(true);
        if (controlsRef.current) controlsRef.current.enabled = false;

        // Build Catmull-Rom Splines for camera position and OrbitControls target coordinates
        const cameraPoints = kfs.map(kf => new THREE.Vector3(kf.position.x, kf.position.y, kf.position.z));
        const cameraCurve = new THREE.CatmullRomCurve3(cameraPoints);

        const targetPoints = kfs.map(kf => {
            if (kf.target) {
                return new THREE.Vector3(kf.target.x, kf.target.y, kf.target.z);
            } else {
                return new THREE.Vector3(0, 0, kf.position.z - 5);
            }
        });
        const targetCurve = new THREE.CatmullRomCurve3(targetPoints);

        let start = null;
        const duration = (kfs.length - 1) * 2000; // 2 seconds duration per segment

        const animateCamera = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);

            // Interpolate position along Catmull-Rom spline
            const pos = cameraCurve.getPointAt(progress);
            cameraRef.current.position.copy(pos);

            // Interpolate target along Catmull-Rom spline
            if (controlsRef.current) {
                const tar = targetCurve.getPointAt(progress);
                controlsRef.current.target.copy(tar);
            }

            // Interpolate rotation using Quaternions
            const totalSegments = kfs.length - 1;
            const segmentFloat = progress * totalSegments;
            const currentIdx = Math.floor(segmentFloat);
            const segmentProgress = segmentFloat - currentIdx;

            const startKf = kfs[currentIdx];
            const endKf = kfs[Math.min(currentIdx + 1, totalSegments)];

            if (startKf && endKf) {
                const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(startKf.rotation.x, startKf.rotation.y, startKf.rotation.z));
                const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(endKf.rotation.x, endKf.rotation.y, endKf.rotation.z));
                cameraRef.current.quaternion.copy(qStart).slerp(qEnd, segmentProgress);
                
                // Interpolate FOV
                cameraRef.current.fov = THREE.MathUtils.lerp(startKf.fov, endKf.fov, segmentProgress);
                cameraRef.current.updateProjectionMatrix();
            }

            // Render visual updates during preview animation
            animateParticles();
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }

            if (progress < 1) {
                animationFrameIdRef.current = requestAnimationFrame(animateCamera);
            } else {
                stopCameraTrajectory();
            }
        };

        // Cancel core rendering loop temporarily, animate camera custom
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = requestAnimationFrame(animateCamera);
    };

    // Stop playback and restore standard render loop
    function stopCameraTrajectory() {
        setIsPlayingPreview(false);
        if (controlsRef.current && cameraRef.current) {
            // Restore controls target point directly in front of camera along its current direction
            // to align the controls with the camera's current viewport. This prevents camera jumping/freezing.
            const dir = new THREE.Vector3();
            cameraRef.current.getWorldDirection(dir);
            controlsRef.current.target.copy(cameraRef.current.position).addScaledVector(dir, 5);
            controlsRef.current.enabled = true;
            controlsRef.current.update();
        }

        cancelAnimationFrame(animationFrameIdRef.current);
        // Restart standard orbit loop
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            if (controlsRef.current) controlsRef.current.update();
            if (selectionHelperRef.current) {
                selectionHelperRef.current.update();
            }
            animateParticles();
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();
    }

    // 7. Save Scene Form Submit
    const submitForm = (thumbnailUrl = null) => {
        transform((oldData) => ({
            ...oldData,
            thumbnail: thumbnailUrl || oldData.thumbnail
        }));

        if (isEdit) {
            put(`/super-admin/three-d-scenes/${scene.id}`);
        } else {
            post('/super-admin/three-d-scenes');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Base64 thumbnail generation of current 3D state
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            const thumbUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.8);
            
            // Upload thumbnail as jpeg
            axios.post('/super-admin/three-d-scenes/upload-asset', {
                base64: thumbUrl
            }).then(response => {
                if (response.data.success) {
                    submitForm(response.data.url);
                } else {
                    submitForm(null);
                }
            }).catch(() => {
                submitForm(null);
            });
        } else {
            submitForm(null);
        }
    };

    const selectedLayer = data.config.layers.find(l => l.id === selectedLayerId);

    return (
        <SuperAdminLayout title={isEdit ? `Edit Scene: ${scene.name}` : "Buat Scene 3D"}>
            <Head title={isEdit ? `Edit Scene: ${scene.name} - Super Admin` : "Buat Scene 3D - Super Admin"} />

            <div className="space-y-4 max-w-7xl mx-auto">
                {/* Top Action Header */}
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/super-admin/three-d-scenes"
                            className="p-2 hover:bg-stone-50 rounded-xl transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-stone-600" />
                        </Link>
                        <div>
                            <h2 className="text-base font-bold text-stone-800">
                                {isEdit ? 'Edit Scene 3D Parallax' : 'Buat Scene 3D Parallax Baru'}
                            </h2>
                            <p className="text-[11px] text-stone-400">Posisikan gambar dalam ruang Z-axis untuk ilusi kedalaman parallax.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowShortcutsModal(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
                        >
                            <HelpCircle className="w-4 h-4" />
                            Shortcut Keyboard
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl transition shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Scene'}
                        </button>
                    </div>
                </div>

                {/* Editor Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Viewport 3D (Left/Center) */}
                    <div className="lg:col-span-2 flex flex-col bg-[#151518] rounded-2xl overflow-hidden border border-stone-800 relative group">
                        <div 
                            ref={containerRef} 
                            className="w-full h-[500px] cursor-grab active:cursor-grabbing relative"
                        />

                        {/* Viewport Controls Overlays */}
                        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
                            <div className="bg-black/75 backdrop-filter backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[10px] flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#E5654B]" />
                                <span>Gunakan klik-kiri + drag untuk rotasi kamera, klik-kanan + drag untuk menggeser.</span>
                            </div>
                        </div>

                        {/* Keyframe control triggers */}
                        {data.config.keyframes.length > 0 && (
                            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                                {!isPlayingPreview ? (
                                    <button
                                        type="button"
                                        onClick={playCameraTrajectory}
                                        className="flex items-center gap-1 bg-[#E5654B] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#c24b33] transition"
                                    >
                                        <Play className="w-3 h-3 fill-white" />
                                        Mainkan Jalur Kamera
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={stopCameraTrajectory}
                                        className="flex items-center gap-1 bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-amber-700 transition"
                                    >
                                        <Pause className="w-3 h-3 fill-white" />
                                        Hentikan Animasi
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Editor Control Sidebar (Right) */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col space-y-4 shadow-sm h-[500px] overflow-y-auto">
                        {/* Tabs */}
                        <div className="flex border-b border-stone-100 pb-2">
                            {['layers', 'keyframes', 'settings'].map(tab => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                                        activeTab === tab
                                            ? 'bg-stone-50 text-[#E5654B]'
                                            : 'text-stone-400 hover:text-stone-600'
                                    }`}
                                >
                                    {tab === 'layers' ? 'Layer Layer' : tab === 'keyframes' ? 'Kamera Keyframe' : 'Pengaturan'}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content: Settings */}
                        {activeTab === 'settings' && (
                            <div className="space-y-4 flex-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700">Nama Scene 3D</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="Contoh: Room Jogja Intimate"
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none"
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700">Slug</label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value)}
                                        placeholder="room-jogja-intimate"
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none"
                                    />
                                    {errors.slug && <p className="text-[10px] text-red-500">{errors.slug}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700">Tema Latar Belakang</label>
                                    <select
                                        value={data.config.backgroundGradient || 'midnight'}
                                        onChange={e => {
                                            const newConfig = {
                                                ...data.config,
                                                backgroundGradient: e.target.value
                                            };
                                            setData('config', newConfig);
                                            saveHistoryState(newConfig);
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-white"
                                    >
                                        <option value="midnight">Midnight Navy (Malam Biru Pekat)</option>
                                        <option value="romance">Romantic Plum (Ungu Romantis)</option>
                                        <option value="emerald">Emerald Forest (Hijau Emerald)</option>
                                        <option value="luxury_gold">Luxury Gold (Emas Mewah)</option>
                                        <option value="ivory_cream">Ivory Cream (Krem Klasik)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700">Efek Partikel Lingkungan</label>
                                    <select
                                        value={data.config.particleType || 'none'}
                                        onChange={e => {
                                            const newConfig = {
                                                ...data.config,
                                                particleType: e.target.value
                                            };
                                            setData('config', newConfig);
                                            saveHistoryState(newConfig);
                                        }}
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-white"
                                    >
                                        <option value="none">Tanpa Efek Partikel</option>
                                        <option value="gold_dust">Gold Dust (Butiran Emas Melayang)</option>
                                        <option value="sakura">Sakura Falling (Guguran Sakura)</option>
                                        <option value="snow">Drifting Snow (Salju Turun Lembut)</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs font-bold text-stone-700">Status Aktif</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E5654B]" />
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Keyframes */}
                        {activeTab === 'keyframes' && (
                            <div className="flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-stone-700">Titik Gerak Kamera ({data.config.keyframes.length})</span>
                                        <button
                                            type="button"
                                            onClick={captureCameraKeyframe}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-900 text-white rounded-lg text-[10px] font-bold hover:bg-stone-800 transition"
                                        >
                                            <Camera className="w-3.5 h-3.5" />
                                            Rekam Titik
                                        </button>
                                    </div>

                                    {data.config.keyframes.length === 0 ? (
                                        <div className="bg-stone-50 border border-stone-100 rounded-xl p-6 text-center">
                                            <p className="text-xs text-stone-400">Belum ada keyframe. Putar sudut pandang kamera 3D Anda lalu klik <strong>Rekam Titik</strong>.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                            {data.config.keyframes.map((kf, idx) => (
                                                <div 
                                                    key={kf.id}
                                                    className="flex items-center justify-between bg-stone-50 hover:bg-stone-100 border border-stone-100 rounded-xl p-2 transition cursor-pointer"
                                                    onClick={() => previewKeyframePosition(kf)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 bg-[#E5654B] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                                            {idx + 1}
                                                        </span>
                                                        <div>
                                                            <p className="text-xs font-bold text-stone-700">Posisi #{idx + 1}</p>
                                                            <p className="text-[9px] text-stone-400 font-mono">
                                                                X: {kf.position.x.toFixed(1)} | Y: {kf.position.y.toFixed(1)} | Z: {kf.position.z.toFixed(1)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteKeyframe(kf.id);
                                                        }}
                                                        className="p-1 text-stone-400 hover:text-red-500 rounded transition"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Layers */}
                        {activeTab === 'layers' && (
                            <div className="flex-1 flex flex-col justify-between space-y-4">
                                {/* Layer list */}
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center justify-between border-b border-stone-50 pb-2">
                                        <span className="text-xs font-bold text-stone-700">Daftar Layer ({data.config.layers.length})</span>
                                        <div className="flex items-center gap-1.5">
                                            {/* File Upload Input */}
                                            <label className="p-1.5 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition cursor-pointer" title="Upload PNG Transparan">
                                                <Upload className="w-3.5 h-3.5" />
                                                <input 
                                                    type="file" 
                                                    accept="image/png" 
                                                    className="hidden" 
                                                    onChange={handleFileUpload} 
                                                />
                                            </label>
                                            
                                            {/* Open Drawing pad */}
                                            <button
                                                type="button"
                                                onClick={() => setShowDrawingPad(true)}
                                                className="p-1.5 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition"
                                                title="Gambar Langsung"
                                            >
                                                <Brush className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Add Text Layer */}
                                            <button
                                                type="button"
                                                onClick={handleAddTextLayer}
                                                className="p-1.5 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition"
                                                title="Tambah Teks"
                                            >
                                                <Type className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {data.config.layers.length === 0 ? (
                                        <div className="bg-stone-50 border border-stone-100 rounded-xl p-6 text-center">
                                            <p className="text-xs text-stone-400">Belum ada layer gambar. Tambahkan gambar PNG transparan atau lukis coretan baru.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                                            {data.config.layers.map(layer => (
                                                <div 
                                                    key={layer.id}
                                                    onClick={() => setSelectedLayerId(layer.id)}
                                                    className={`flex items-center justify-between p-2 rounded-xl border text-xs transition cursor-pointer ${
                                                        selectedLayerId === layer.id
                                                            ? 'bg-stone-50 border-[#E5654B] text-[#E5654B]'
                                                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 truncate">
                                                        {layer.type === 'text' ? (
                                                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 font-bold font-serif text-sm">
                                                                T
                                                            </div>
                                                        ) : (
                                                            <img 
                                                                src={layer.url} 
                                                                alt={layer.name} 
                                                                className="w-8 h-8 rounded-lg object-contain bg-stone-100" 
                                                            />
                                                        )}
                                                        <div className="truncate">
                                                            <p className="font-bold truncate">{layer.name}</p>
                                                            <p className="text-[9px] text-stone-400 capitalize">{layer.type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleLayerVisibility(layer.id);
                                                            }}
                                                            className="p-1 text-stone-400 hover:text-stone-600 rounded transition"
                                                        >
                                                            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteLayer(layer.id);
                                                            }}
                                                            className="p-1 text-stone-400 hover:text-red-500 rounded transition"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Properties Inspector Panel */}
                                {selectedLayer && (
                                    <div className="border-t border-stone-100 pt-3 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-stone-700">Inspector: {selectedLayer.name}</span>
                                            {selectedLayer.type === 'upload' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setBgRemoverLayer(selectedLayer);
                                                        setShowBgRemover(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-lg text-[10px] font-bold transition shadow-sm"
                                                >
                                                    <Scissors className="w-3.5 h-3.5" />
                                                    Hapus Latar
                                                </button>
                                            )}
                                        </div>

                                        {/* Text Layer Properties Card */}
                                        {selectedLayer.type === 'text' && (
                                            <div className="space-y-2.5 p-2.5 bg-stone-50 rounded-2xl border border-stone-100 text-[9px] text-stone-600">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-stone-600">Konten Teks</span>
                                                    <textarea
                                                        rows={2}
                                                        value={selectedLayer.text || ''}
                                                        onChange={e => updateLayerProperty(selectedLayer.id, 'text', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full text-xs p-2 bg-white border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none transition"
                                                        placeholder="Tulis teks..."
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-stone-600">Jenis Font</span>
                                                        <select
                                                            value={selectedLayer.fontFamily || 'Playfair Display'}
                                                            onChange={e => {
                                                                updateLayerProperty(selectedLayer.id, 'fontFamily', e.target.value);
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[9px] p-1 bg-white border border-stone-200 rounded-lg outline-none"
                                                        >
                                                            <option value="Playfair Display">Playfair Display</option>
                                                            <option value="Great Vibes">Great Vibes</option>
                                                            <option value="Alex Brush">Alex Brush</option>
                                                            <option value="Dancing Script">Dancing Script</option>
                                                            <option value="Cinzel">Cinzel</option>
                                                            <option value="Montserrat">Montserrat</option>
                                                            <option value="Arial">Arial</option>
                                                        </select>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="font-bold text-stone-600">Warna Teks</span>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <input
                                                                type="color"
                                                                value={selectedLayer.color || '#E5654B'}
                                                                onChange={e => updateLayerProperty(selectedLayer.id, 'color', e.target.value)}
                                                                onBlur={() => saveHistoryState(data.config)}
                                                                className="w-5 h-5 p-0 border border-stone-200 rounded cursor-pointer bg-transparent"
                                                            />
                                                            <span className="font-mono text-[8px] text-stone-500">{selectedLayer.color}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-stone-600">Resolusi ({selectedLayer.fontSize || 64}px)</span>
                                                        <input
                                                            type="range"
                                                            min="32"
                                                            max="128"
                                                            step="4"
                                                            value={selectedLayer.fontSize || 64}
                                                            onChange={e => updateLayerProperty(selectedLayer.id, 'fontSize', parseInt(e.target.value))}
                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                            onTouchEnd={() => saveHistoryState(data.config)}
                                                            className="w-full accent-[#E5654B]"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="font-bold text-stone-600">Gaya & Tebal</span>
                                                        <div className="flex gap-1 mt-0.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const nextVal = selectedLayer.fontWeight === 'bold' ? 'normal' : 'bold';
                                                                    updateLayerProperty(selectedLayer.id, 'fontWeight', nextVal);
                                                                    saveHistoryState(data.config);
                                                                }}
                                                                className={`flex-1 py-0.5 rounded text-[9px] font-bold border transition ${
                                                                    selectedLayer.fontWeight === 'bold'
                                                                        ? 'bg-stone-800 text-white border-stone-800'
                                                                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                                                                }`}
                                                            >
                                                                B
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const nextVal = selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic';
                                                                    updateLayerProperty(selectedLayer.id, 'fontStyle', nextVal);
                                                                    saveHistoryState(data.config);
                                                                }}
                                                                className={`flex-1 py-0.5 rounded text-[9px] italic border transition ${
                                                                    selectedLayer.fontStyle === 'italic'
                                                                        ? 'bg-stone-800 text-white border-stone-800'
                                                                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                                                                }`}
                                                            >
                                                                I
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Coordinates Control */}
                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                            {/* Z Position (Kedalaman / Parallax) */}
                                            <div className="col-span-2 space-y-1">
                                                <div className="flex justify-between font-bold text-stone-500">
                                                    <span>Kedalaman (Z-axis)</span>
                                                    <span>{selectedLayer.position.z}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="-15"
                                                    max="5"
                                                    step="0.5"
                                                    value={selectedLayer.position.z}
                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'position', { ...selectedLayer.position, z: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>

                                            {/* X Position */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-500">
                                                    <span>Geser X</span>
                                                    <span>{selectedLayer.position.x}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="-8"
                                                    max="8"
                                                    step="0.2"
                                                    value={selectedLayer.position.x}
                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'position', { ...selectedLayer.position, x: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>

                                            {/* Y Position */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-500">
                                                    <span>Geser Y</span>
                                                    <span>{selectedLayer.position.y}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="-8"
                                                    max="8"
                                                    step="0.2"
                                                    value={selectedLayer.position.y}
                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'position', { ...selectedLayer.position, y: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>

                                            {/* Scale Width */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-500">
                                                    <span>Skala Lebar</span>
                                                    <span>{selectedLayer.scale.x}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="0.2"
                                                    max="5"
                                                    step="0.1"
                                                    value={selectedLayer.scale.x}
                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'scale', { ...selectedLayer.scale, x: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>

                                            {/* Scale Height */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-500">
                                                    <span>Skala Tinggi</span>
                                                    <span>{selectedLayer.scale.y}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="0.2"
                                                    max="5"
                                                    step="0.1"
                                                    value={selectedLayer.scale.y}
                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'scale', { ...selectedLayer.scale, y: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Drawing Pad Modal overlay */}
            {showDrawingPad && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="bg-stone-50 border-b border-stone-100 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brush className="w-5 h-5 text-[#E5654B]" />
                                <h3 className="text-base font-bold text-stone-800">Drawing Pad (Mental Canvas Drawing)</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDrawingPad(false)}
                                className="text-stone-400 hover:text-stone-600 font-semibold text-sm transition"
                            >
                                Tutup
                            </button>
                        </div>

                        {/* Drawing Workspace */}
                        <div className="p-6 flex flex-col items-center gap-4">
                            <div className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden relative shadow-inner">
                                <canvas
                                    ref={drawCanvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="cursor-crosshair w-full block"
                                />
                            </div>

                            {/* Toolbar */}
                            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-stone-100 pt-4">
                                {/* Color and brushes */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        {['#E5654B', '#FFB703', '#8ecae6', '#219ebc', '#023047', '#1a1a1a'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => {
                                                    setDrawColor(color);
                                                    setDrawTool('brush');
                                                }}
                                                className={`w-6 h-6 rounded-full border transition-all ${
                                                    drawColor === color && drawTool === 'brush'
                                                        ? 'scale-110 border-stone-800 shadow-sm'
                                                        : 'border-transparent'
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                        
                                        {/* Custom Color Picker */}
                                        <input
                                            type="color"
                                            value={drawColor}
                                            onChange={(e) => {
                                                setDrawColor(e.target.value);
                                                setDrawTool('brush');
                                            }}
                                            className="w-6 h-6 p-0 border border-stone-200 rounded-full cursor-pointer bg-transparent"
                                            title="Kustom Warna"
                                        />
                                    </div>
                                    <span className="h-4 w-px bg-stone-200" />
                                    
                                    {/* Tool Toggles */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setDrawTool('brush')}
                                            className={`p-1.5 rounded-lg text-xs font-bold transition ${
                                                drawTool === 'brush' ? 'bg-[#E5654B] text-white' : 'bg-stone-100 text-stone-600'
                                            }`}
                                        >
                                            Kuas
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDrawTool('eraser')}
                                            className={`p-1.5 rounded-lg text-xs font-bold transition ${
                                                drawTool === 'eraser' ? 'bg-[#E5654B] text-white' : 'bg-stone-100 text-stone-600'
                                            }`}
                                        >
                                            Penghapus
                                        </button>
                                    </div>
                                    
                                    {/* Thickness */}
                                    <input 
                                        type="range"
                                        min="2"
                                        max="20"
                                        value={drawWidth}
                                        onChange={e => setDrawWidth(parseInt(e.target.value))}
                                        className="w-20 accent-[#E5654B]"
                                    />
                                </div>

                                {/* Operations */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleDrawingUndo}
                                        className="p-2 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition"
                                        title="Undo"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearDrawingCanvas}
                                        className="p-2 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition"
                                        title="Clear All"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveDrawing}
                                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Masukkan ke 3D
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Remover Modal overlay */}
            {showBgRemover && bgRemoverLayer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="bg-stone-50 border-b border-stone-100 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Scissors className="w-5 h-5 text-[#E5654B]" />
                                <h3 className="text-base font-bold text-stone-800">Background Remover (Penghapus Latar Belakang)</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowBgRemover(false)}
                                className="text-stone-400 hover:text-stone-600 font-semibold text-sm transition"
                            >
                                Tutup
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                            {/* Toolbar (Left) */}
                            <div className="p-5 md:col-span-1 space-y-5 bg-stone-50/50">
                                <div>
                                    <h4 className="text-xs font-bold text-stone-700 mb-2">Pilih Alat</h4>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setBgRemoverTool('magic')}
                                            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition ${
                                                bgRemoverTool === 'magic' ? 'bg-[#E5654B] text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                                            }`}
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Magic Eraser (Klik)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBgRemoverTool('manual')}
                                            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition ${
                                                bgRemoverTool === 'manual' ? 'bg-[#E5654B] text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                                            }`}
                                        >
                                            <Eraser className="w-4 h-4" />
                                            Manual Brush (Gosok)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBgRemoverTool('restore')}
                                            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition ${
                                                bgRemoverTool === 'restore' ? 'bg-[#E5654B] text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                                            }`}
                                        >
                                            <Brush className="w-4 h-4" />
                                            Restore Brush (Pulihkan)
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-stone-200/60" />

                                {bgRemoverTool === 'magic' && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-stone-700">
                                            <span>Toleransi Warna</span>
                                            <span>{bgRemoverTolerance}</span>
                                        </div>
                                        <p className="text-[10px] text-stone-400">Semakin tinggi toleransi, semakin banyak warna mirip yang akan ikut terhapus.</p>
                                        <input 
                                            type="range"
                                            min="5"
                                            max="100"
                                            value={bgRemoverTolerance}
                                            onChange={e => setBgRemoverTolerance(parseInt(e.target.value))}
                                            className="w-full accent-[#E5654B]"
                                        />
                                    </div>
                                )}

                                {(bgRemoverTool === 'manual' || bgRemoverTool === 'restore') && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-stone-700">
                                            <span>Ukuran Kuas</span>
                                            <span>{bgRemoverBrushSize}px</span>
                                        </div>
                                        <input 
                                            type="range"
                                            min="2"
                                            max="50"
                                            value={bgRemoverBrushSize}
                                            onChange={e => setBgRemoverBrushSize(parseInt(e.target.value))}
                                            className="w-full accent-[#E5654B]"
                                        />
                                    </div>
                                )}

                                <hr className="border-stone-200/60" />

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-stone-700">Aksi Cepat</h4>
                                    <button
                                        type="button"
                                        onClick={handleBgAutoRemove}
                                        className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition shadow-sm flex items-center justify-center gap-1.5"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-[#E5654B] fill-[#E5654B]" />
                                        Hapus Latar Otomatis
                                    </button>
                                    <p className="text-[9px] text-stone-400 leading-relaxed">
                                        *Hapus Latar Otomatis akan mendeteksi warna di sudut-sudut gambar dan menghapusnya secara otomatis.
                                    </p>
                                </div>
                            </div>

                            {/* Canvas Area (Center/Right) */}
                            <div className="p-6 md:col-span-3 flex flex-col items-center justify-center gap-4 bg-stone-100/30">
                                <p className="text-xs text-stone-500 font-medium">
                                    {bgRemoverTool === 'magic' 
                                        ? 'Klik bagian background gambar yang ingin dibuat transparan.' 
                                        : bgRemoverTool === 'restore'
                                            ? 'Gosok / usap kursor Anda pada bagian gambar yang ingin dikembalikan seperti semula.'
                                            : 'Gosok / usap kursor Anda pada bagian gambar yang ingin dihapus secara manual.'}
                                </p>
                                
                                <div className="border border-stone-200 rounded-2xl overflow-hidden relative shadow-inner bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 8 8%22><rect width=%224%22 height=%224%22 fill=%22%23eee%22/><rect x=%224%22 y=%224%22 width=%224%22 height=%224%22 fill=%22%23eee%22/><rect x=%224%22 width=%224%22 height=%224%22 fill=%22%23fff%22/><rect y=%224%22 width=%224%22 height=%224%22 fill=%22%23fff%22/></svg>')] bg-repeat">
                                    <div 
                                        ref={bgBrushPreviewRef}
                                        className="absolute pointer-events-none rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)] bg-transparent"
                                        style={{ 
                                            display: 'none', 
                                            transform: 'translate(-50%, -50%)', 
                                            zIndex: 10 
                                        }}
                                    />
                                    <canvas
                                        ref={bgCanvasRef}
                                        onClick={handleBgCanvasClick}
                                        onMouseDown={startBgDrawing}
                                        onMouseMove={(e) => {
                                            drawBg(e);
                                            handleBgCanvasMouseMove(e);
                                        }}
                                        onMouseUp={stopBgDrawing}
                                        onMouseLeave={(e) => {
                                            stopBgDrawing();
                                            if (bgBrushPreviewRef.current) bgBrushPreviewRef.current.style.display = 'none';
                                        }}
                                        onTouchStart={startBgDrawing}
                                        onTouchMove={drawBg}
                                        onTouchEnd={stopBgDrawing}
                                        className={`block max-w-full ${bgRemoverTool === 'magic' ? 'cursor-crosshair' : bgRemoverTool === 'restore' || bgRemoverTool === 'manual' ? 'cursor-none' : 'cursor-default'}`}
                                        style={{ touchAction: 'none' }}
                                    />
                                </div>

                                <div className="w-full flex items-center justify-between border-t border-stone-200/60 pt-4 mt-2">
                                    {/* Undo & Reset */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleBgUndo}
                                            disabled={bgHistoryIndex <= 0}
                                            className="px-3.5 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 transition text-xs font-bold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Undo2 className="w-4 h-4" />
                                            Undo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleBgRedo}
                                            disabled={bgHistoryIndex >= bgHistory.length - 1}
                                            className="px-3.5 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 transition text-xs font-bold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Redo2 className="w-4 h-4" />
                                            Redo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleBgReset}
                                            className="px-3.5 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 transition text-xs font-bold flex items-center gap-1"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Reset Asli
                                        </button>
                                    </div>

                                    {/* Save and Cancel */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowBgRemover(false)}
                                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveBgRemoval}
                                            disabled={processingBgRemoval}
                                            className="px-5 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5 disabled:opacity-70"
                                        >
                                            <Check className="w-4 h-4" />
                                            {processingBgRemoval ? 'Memproses...' : 'Terapkan Penghapusan'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Keyboard Shortcuts Help Modal */}
            {showShortcutsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full border border-stone-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="bg-stone-50 border-b border-stone-100 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-stone-800">
                                <HelpCircle className="w-5 h-5 text-[#E5654B]" />
                                <h3 className="text-base font-bold">Panduan Shortcut Keyboard (3D Editor)</h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setShowShortcutsModal(false)} 
                                className="text-stone-400 hover:text-stone-600 font-semibold text-sm transition"
                            >
                                Tutup
                            </button>
                        </div>
                        <div className="p-6 space-y-4 text-xs text-stone-600">
                            <p className="text-[11px] text-stone-400 leading-relaxed mb-2">Gunakan shortcut keyboard berikut untuk mempermudah navigasi dan manipulasi layer 3D:</p>
                            <div className="space-y-3">
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Geser Layer (X-axis)</span>
                                    <div className="flex gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">←</kbd>
                                        <span className="text-stone-400">/</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">→</kbd>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Geser Layer (Y-axis)</span>
                                    <div className="flex gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">↑</kbd>
                                        <span className="text-stone-400">/</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">↓</kbd>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-stone-700">Kedalaman Layer (Z-axis)</span>
                                        <span className="text-[9px] text-stone-400">Maju/mundur dalam ruang parallax</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Shift</kbd>
                                        <span className="text-stone-400">+</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">↑</kbd>
                                        <span className="text-stone-400">/</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">↓</kbd>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Batal Pilihan Layer</span>
                                    <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Esc</kbd>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Hapus Layer Terpilih</span>
                                    <div className="flex gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Delete</kbd>
                                        <span className="text-stone-400">/</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Backspace</kbd>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Geser Kamera Bebas (Pan)</span>
                                    <div className="flex gap-1 items-center">
                                        <kbd className="px-2.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Spasi</kbd>
                                        <span className="text-stone-400">+</span>
                                        <span className="text-stone-500 font-semibold">Geser Mouse</span>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Undo (Batal Langkah)</span>
                                    <div className="flex gap-1 items-center">
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Ctrl</kbd>
                                        <span className="text-stone-400">+</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Z</kbd>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Redo (Ulang Langkah)</span>
                                    <div className="flex gap-1 items-center">
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Ctrl</kbd>
                                        <span className="text-stone-400">+</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Y</kbd>
                                        <span className="text-stone-400">/</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Shift</kbd>
                                        <span className="text-stone-400">+</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Z</kbd>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between border-b border-stone-50 pb-2">
                                    <span className="font-semibold text-stone-700">Main/Jeda Jalur Kamera</span>
                                    <kbd className="px-3 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Spasi (Tarik Cepat)</kbd>
                                </div>
                                <div className="flex items-start justify-between pb-1">
                                    <span className="font-semibold text-stone-700">Simpan Scene Instan</span>
                                    <div className="flex gap-1 items-center">
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Ctrl</kbd>
                                        <span className="text-stone-400">/</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">⌘</kbd>
                                        <span className="text-stone-400">+</span>
                                        <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">S</kbd>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-stone-50 px-6 py-4 flex justify-end">
                            <button 
                                type="button" 
                                onClick={() => setShowShortcutsModal(false)} 
                                className="px-4 py-2 bg-stone-950 text-white rounded-xl text-xs font-bold hover:bg-stone-900 transition"
                            >
                                Paham, Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
