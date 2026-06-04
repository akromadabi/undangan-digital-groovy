import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { 
    Layers, ArrowLeft, Plus, Trash2, Save, Play, Pause, Camera, 
    Upload, Brush, Edit3, Move, Eye, EyeOff, RotateCw, ZoomIn, 
    ChevronRight, Undo2, Redo2, RotateCcw, Check, Sparkles, Scissors, Eraser,
    HelpCircle, Type, Maximize2, Minimize2, SlidersHorizontal, X,
    Copy, ArrowUp, ArrowDown, Home, Lock, Unlock, Settings, ImageIcon,
    Search, ChevronDown, Loader2, Download, Focus, Box, Compass, Map, RefreshCw
} from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import axios from 'axios';
import { createPortal } from 'react-dom';

// Presets data binding form fields
const DATA_BINDING_LABELS = {
    bride_full_name: 'Nama Lengkap Mempelai Wanita',
    bride_nickname: 'Nama Panggilan Mempelai Wanita',
    bride_father_name: 'Nama Ayah Mempelai Wanita',
    bride_mother_name: 'Nama Ibu Mempelai Wanita',
    bride_child_order: 'Silsilah Anak Mempelai Wanita',
    bride_instagram: 'Instagram Mempelai Wanita',
    groom_full_name: 'Nama Lengkap Mempelai Pria',
    groom_nickname: 'Nama Panggilan Mempelai Pria',
    groom_father_name: 'Nama Ayah Mempelai Pria',
    groom_mother_name: 'Nama Ibu Mempelai Pria',
    groom_child_order: 'Silsilah Anak Mempelai Pria',
    groom_instagram: 'Instagram Mempelai Pria',
    event_name: 'Nama Acara',
    event_date: 'Tanggal Acara',
    event_time: 'Waktu Acara',
    venue_name: 'Nama Gedung / Tempat',
    venue_address: 'Alamat Lengkap Venue',
    event_dress_code: 'Dresscode Acara',
    guest_name: 'Nama Tamu Undangan'
};

const MOCK_TEMPLATE_DATA = {
    bride_full_name: 'Siti Aminah',
    bride_nickname: 'Siti',
    bride_father_name: 'Bapak Slamet',
    bride_mother_name: 'Ibu Kartini',
    bride_child_order: 'Putri pertama',
    bride_instagram: '@siti.aminah',
    groom_full_name: 'Budi Santoso',
    groom_nickname: 'Budi',
    groom_father_name: 'Bapak Joko',
    groom_mother_name: 'Ibu Sri',
    groom_child_order: 'Putra kedua',
    groom_instagram: '@budi.santoso',
    event_name: 'Akad Nikah & Resepsi',
    event_date: 'Minggu, 12 Juli 2026',
    event_time: '09:00 WIB s/d Selesai',
    venue_name: 'Gedung Serbaguna Jakarta',
    venue_address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    event_dress_code: 'Pastel / Batik',
    guest_name: 'Bapak Joko & Keluarga'
};

const parseTemplateText = (text, data = MOCK_TEMPLATE_DATA) => {
    if (!text) return '';
    let parsed = text;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        parsed = parsed.replace(regex, data[key]);
    });
    return parsed;
};

const migrateLayers = (layers) => {
    if (!layers) return [];
    return layers.map(l => {
        if (l.contents) return l; // already migrated
        
        // create a group from the old flat layer properties
        const contentId = 'content_' + l.id;
        const mainContent = {
            id: contentId,
            name: l.name || (l.type === 'text' ? 'Komponen Teks' : 'Komponen Gambar'),
            type: l.type,
            visible: true,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1 }
        };
        if (l.type === 'text') {
            mainContent.text = l.text;
            mainContent.fontFamily = l.fontFamily;
            mainContent.fontSize = l.fontSize;
            mainContent.color = l.color;
            mainContent.fontWeight = l.fontWeight;
            mainContent.fontStyle = l.fontStyle;
            mainContent.dataBinding = l.dataBinding || null;
        } else {
            mainContent.url = l.url;
        }
        return {
            id: l.id,
            name: l.name,
            visible: l.visible,
            position: l.position || { x: 0, y: 0, z: 0 },
            rotation: l.rotation || { x: 0, y: 0, z: 0 },
            scale: l.scale || { x: 1, y: 1 },
            contents: [mainContent]
        };
    });
};

const createDefaultConfig = () => {
    return {
        backgroundGradient: 'midnight',
        particleType: 'gold_dust',
        keyframePauseDuration: 2.0,
        musicUrl: '/audio/backsound.mp3',
        layers: [
            {
                id: 'layer_sampul',
                name: 'Sampul (Z = 0)',
                visible: true,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: [
                    {
                        id: 'content_sampul_flower_left',
                        name: 'Bunga Kiri',
                        type: 'upload',
                        url: '/themes/utary/asset/flower-left.webp',
                        visible: true,
                        position: { x: -3.8, y: 1.6, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.6, y: 0.6 }
                    },
                    {
                        id: 'content_sampul_flower_right',
                        name: 'Bunga Kanan',
                        type: 'upload',
                        url: '/themes/utary/asset/flower-right.webp',
                        visible: true,
                        position: { x: 3.8, y: 1.6, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.6, y: 0.6 }
                    },
                    {
                        id: 'content_sampul_divider',
                        name: 'Pembatas Pattern',
                        type: 'upload',
                        url: '/themes/utary/asset/divider-pattern.webp',
                        visible: true,
                        position: { x: 0, y: 0.5, z: -0.2 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.5, y: 0.5 }
                    },
                    {
                        id: 'content_sampul_title',
                        name: 'Judul Sampul',
                        type: 'text',
                        text: 'THE WEDDING OF',
                        fontFamily: 'Montserrat',
                        fontSize: 24,
                        color: '#E5654B',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: 1.2, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    },
                    {
                        id: 'content_sampul_names',
                        name: 'Nama Pengantin',
                        type: 'text',
                        text: 'Yusuf & Utari',
                        fontFamily: 'Great Vibes',
                        fontSize: 64,
                        color: '#ffffff',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: -0.2, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.2, y: 1.2 }
                    },
                    {
                        id: 'content_sampul_subtitle',
                        name: 'Nama Tamu',
                        type: 'text',
                        text: 'Dear {{guest_name}}',
                        fontFamily: 'Playfair Display',
                        fontSize: 32,
                        color: '#ffffff',
                        fontWeight: 'normal',
                        fontStyle: 'italic',
                        dataBinding: 'guest_name',
                        visible: true,
                        position: { x: 0, y: -1.2, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    }
                ]
            },
            {
                id: 'layer_opening',
                name: 'Opening (Z = -5)',
                visible: true,
                position: { x: 0, y: 0, z: -5 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: [
                    {
                        id: 'content_opening_frame_top',
                        name: 'Bingkai Atas',
                        type: 'upload',
                        url: '/themes/utary/asset/event-frame-top.webp',
                        visible: true,
                        position: { x: 0, y: 2.0, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.6, y: 0.6 }
                    },
                    {
                        id: 'content_opening_frame_bottom',
                        name: 'Bingkai Bawah',
                        type: 'upload',
                        url: '/themes/utary/asset/event-frame-bottom.webp',
                        visible: true,
                        position: { x: 0, y: -2.0, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.6, y: 0.6 }
                    },
                    {
                        id: 'content_opening_bismillah',
                        name: 'Salam Pembuka',
                        type: 'text',
                        text: 'Walimatul Ursy',
                        fontFamily: 'Great Vibes',
                        fontSize: 54,
                        color: '#E5654B',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: 0.8, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    },
                    {
                        id: 'content_opening_text',
                        name: 'Teks Pembuka',
                        type: 'text',
                        text: 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri pernikahan kami.',
                        fontFamily: 'Montserrat',
                        fontSize: 20,
                        color: '#ffffff',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: -0.4, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    }
                ]
            },
            {
                id: 'layer_mempelai',
                name: 'Mempelai (Z = -10)',
                visible: true,
                position: { x: 0, y: 0, z: -10 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: [
                    {
                        id: 'content_mempelai_photo',
                        name: 'Foto Pasangan',
                        type: 'upload',
                        url: '/themes/utary/asset/couple-photo.webp',
                        visible: true,
                        position: { x: 0, y: 0.8, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.5, y: 0.5 }
                    },
                    {
                        id: 'content_mempelai_frame',
                        name: 'Bingkai Profil',
                        type: 'upload',
                        url: '/themes/utary/asset/frame-profile.webp',
                        visible: true,
                        position: { x: 0, y: 0.8, z: 0.2 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.52, y: 0.52 }
                    },
                    {
                        id: 'content_mempelai_names',
                        name: 'Nama Pengantin',
                        type: 'text',
                        text: '{{groom_nickname}} & {{bride_nickname}}',
                        fontFamily: 'Great Vibes',
                        fontSize: 54,
                        color: '#E5654B',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: -0.8, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.1, y: 1.1 }
                    },
                    {
                        id: 'content_mempelai_sub',
                        name: 'Teks Pengantar',
                        type: 'text',
                        text: 'Kami yang berbahagia',
                        fontFamily: 'Montserrat',
                        fontSize: 18,
                        color: '#ffffff',
                        fontWeight: 'normal',
                        fontStyle: 'italic',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: -1.3, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    }
                ]
            },
            {
                id: 'layer_acara',
                name: 'Acara (Z = -15)',
                visible: true,
                position: { x: 0, y: 0, z: -15 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: [
                    {
                        id: 'content_acara_divider',
                        name: 'Pattern Acara',
                        type: 'upload',
                        url: '/themes/utary/asset/divider-pattern.webp',
                        visible: true,
                        position: { x: 0, y: 1.8, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.4, y: 0.4 }
                    },
                    {
                        id: 'content_acara_title',
                        name: 'Nama Acara',
                        type: 'text',
                        text: '{{event_name}}',
                        fontFamily: 'Montserrat',
                        fontSize: 32,
                        color: '#E5654B',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        dataBinding: 'event_name',
                        visible: true,
                        position: { x: 0, y: 1.0, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    },
                    {
                        id: 'content_acara_datetime',
                        name: 'Tanggal & Waktu',
                        type: 'text',
                        text: '{{event_date}} - {{event_time}}',
                        fontFamily: 'Montserrat',
                        fontSize: 24,
                        color: '#ffffff',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: 0.1, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    },
                    {
                        id: 'content_acara_venue',
                        name: 'Tempat Acara',
                        type: 'text',
                        text: 'Tempat: {{venue_name}}',
                        fontFamily: 'Montserrat',
                        fontSize: 20,
                        color: '#ffffff',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: 'venue_name',
                        visible: true,
                        position: { x: 0, y: -0.8, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    }
                ]
            },
            {
                id: 'layer_closing',
                name: 'Closing (Z = -20)',
                visible: true,
                position: { x: 0, y: 0, z: -20 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: [
                    {
                        id: 'content_closing_ornament_left',
                        name: 'Ornamen Kiri',
                        type: 'upload',
                        url: '/themes/utary/asset/ornament-left.webp',
                        visible: true,
                        position: { x: -3.5, y: 0, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.5, y: 0.5 }
                    },
                    {
                        id: 'content_closing_ornament_right',
                        name: 'Ornamen Kanan',
                        type: 'upload',
                        url: '/themes/utary/asset/ornament-right.webp',
                        visible: true,
                        position: { x: 3.5, y: 0, z: 0.1 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 0.5, y: 0.5 }
                    },
                    {
                        id: 'content_closing_text',
                        name: 'Teks Penutup',
                        type: 'text',
                        text: 'Terima Kasih atas Doa Restu Anda',
                        fontFamily: 'Great Vibes',
                        fontSize: 48,
                        color: '#E5654B',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: 0.2, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    },
                    {
                        id: 'content_closing_sub',
                        name: 'Teks Hormat Kami',
                        type: 'text',
                        text: 'Merupakan suatu kehormatan & kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.',
                        fontFamily: 'Montserrat',
                        fontSize: 16,
                        color: '#ffffff',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        dataBinding: null,
                        visible: true,
                        position: { x: 0, y: -0.6, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1.0, y: 1.0 }
                    }
                ]
            }
        ],
        keyframes: [
            {
                id: 'kf_1',
                time: 0,
                position: { x: 0, y: 0, z: 8 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                target: { x: 0, y: 0, z: 0 }
            },
            {
                id: 'kf_2',
                time: 0.25,
                position: { x: 0, y: 0, z: 3 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                target: { x: 0, y: 0, z: -5 }
            },
            {
                id: 'kf_3',
                time: 0.5,
                position: { x: 0, y: 0, z: -2 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                target: { x: 0, y: 0, z: -10 }
            },
            {
                id: 'kf_4',
                time: 0.75,
                position: { x: 0, y: 0, z: -7 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                target: { x: 0, y: 0, z: -15 }
            },
            {
                id: 'kf_5',
                time: 1.0,
                position: { x: 0, y: 0, z: -12 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                target: { x: 0, y: 0, z: -20 }
            }
        ]
    };
};

const updateHandlesPosition = (mesh, handles) => {
    if (!mesh || !handles || handles.length === 0) return;
    mesh.updateMatrixWorld(true);
    const halfW = 1.5;
    const halfH = 1.5;
    
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
    
    const text = parseTemplateText(layer.text || 'Teks Baru');
    const fontFamily = layer.fontFamily || 'Playfair Display';
    const fontSize = layer.fontSize || 64;
    const color = layer.color || '#E5654B';
    const fontWeight = layer.fontWeight || 'normal';
    const fontStyle = layer.fontStyle || 'normal';
    
    const textEffect = layer.textEffect || 'none';
    const strokeWidth = layer.strokeWidth !== undefined ? layer.strokeWidth : 6;
    const shadowBlur = layer.shadowBlur !== undefined ? layer.shadowBlur : 8;
    const glowBlur = layer.glowBlur !== undefined ? layer.glowBlur : 20;
    
    let effectPadding = 20;
    if (textEffect === 'shadow') effectPadding = Math.max(effectPadding, shadowBlur + 10);
    else if (textEffect === 'neon' || textEffect === 'neon_pink' || textEffect === 'neon_blue') effectPadding = Math.max(effectPadding, glowBlur + 10);
    else if (textEffect === 'outline') effectPadding = Math.max(effectPadding, strokeWidth + 10);
    else if (textEffect === 'outline_shadow') effectPadding = Math.max(effectPadding, strokeWidth + shadowBlur + 15);
    else if (textEffect === 'double_shadow') effectPadding = Math.max(effectPadding, shadowBlur + 20);
    else if (textEffect === '3d') effectPadding = Math.max(effectPadding, 30);
    
    const padding = effectPadding;
    
    // Set font to measure text width
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
    
    // Smart auto-wrap function based on maximum width
    const maxAllowedWidth = Math.max(600, fontSize * 12);
    const wrapText = (textStr, maxW) => {
        const paragraphs = textStr.split('\n');
        const finalLines = [];
        paragraphs.forEach(para => {
            const words = para.split(' ');
            let currentLine = '';
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxW && i > 0) {
                    finalLines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                finalLines.push(currentLine);
            }
        });
        return finalLines;
    };

    let lines = wrapText(text, maxAllowedWidth);
    
    // Dynamic Font Scaling: If the lines are too many, shrink font size to fit neatly
    let finalFontSize = fontSize;
    if (lines.length > 3) {
        const reduction = Math.min(0.4, (lines.length - 3) * 0.12);
        finalFontSize = Math.round(fontSize * (1 - reduction));
        ctx.font = `${fontStyle} ${fontWeight} ${finalFontSize}px "${fontFamily}", sans-serif`;
        lines = wrapText(text, Math.max(600, finalFontSize * 12));
    }
    
    let maxLineWidth = 0;
    lines.forEach(line => {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxLineWidth) {
            maxLineWidth = metrics.width;
        }
    });
    
    // Calculate canvas size with padding
    const canvasWidth = Math.max(128, Math.ceil(maxLineWidth + padding * 2));
    const lineHeight = finalFontSize * 1.25;
    const canvasHeight = Math.ceil(lines.length * lineHeight + padding * 2);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Re-set font context because size change resets context states
    ctx.font = `${fontStyle} ${fontWeight} ${finalFontSize}px "${fontFamily}", sans-serif`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    
    // Transparent background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Configure text effects
    if (textEffect === 'shadow') {
        ctx.shadowColor = layer.shadowColor || 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = layer.shadowOffsetX !== undefined ? layer.shadowOffsetX : 4;
        ctx.shadowOffsetY = layer.shadowOffsetY !== undefined ? layer.shadowOffsetY : 4;
    } else if (textEffect === 'neon') {
        ctx.shadowColor = layer.glowColor || color;
        ctx.shadowBlur = glowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    } else if (textEffect === 'neon_pink') {
        ctx.shadowColor = '#FF1493';
        ctx.shadowBlur = glowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    } else if (textEffect === 'neon_blue') {
        ctx.shadowColor = '#00BFFF';
        ctx.shadowBlur = glowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    
    // Render text lines
    lines.forEach((line, index) => {
        const yPos = padding + index * lineHeight;
        const xPos = canvasWidth / 2;
        
        if (textEffect === 'outline') {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = layer.strokeColor || '#000000';
            ctx.lineJoin = 'round';
            ctx.strokeText(line, xPos, yPos);
        } else if (textEffect === 'outline_shadow') {
            // Draw shadow first
            ctx.save();
            ctx.shadowColor = layer.shadowColor || 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = layer.shadowOffsetX !== undefined ? layer.shadowOffsetX : 4;
            ctx.shadowOffsetY = layer.shadowOffsetY !== undefined ? layer.shadowOffsetY : 4;
            
            // Draw outline with shadow
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = layer.strokeColor || '#000000';
            ctx.lineJoin = 'round';
            ctx.strokeText(line, xPos, yPos);
            ctx.restore();
        } else if (textEffect === 'double_shadow') {
            // Draw furthest shadow (Shadow 2)
            ctx.save();
            ctx.shadowColor = layer.secondShadowColor || 'rgba(229, 101, 75, 0.3)';
            ctx.shadowBlur = shadowBlur + 4;
            ctx.shadowOffsetX = (layer.shadowOffsetX !== undefined ? layer.shadowOffsetX : 4) * 2;
            ctx.shadowOffsetY = (layer.shadowOffsetY !== undefined ? layer.shadowOffsetY : 4) * 2;
            ctx.fillStyle = color;
            ctx.fillText(line, xPos, yPos);
            ctx.restore();

            // Draw closer shadow (Shadow 1)
            ctx.save();
            ctx.shadowColor = layer.shadowColor || 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = layer.shadowOffsetX !== undefined ? layer.shadowOffsetX : 4;
            ctx.shadowOffsetY = layer.shadowOffsetY !== undefined ? layer.shadowOffsetY : 4;
            ctx.fillStyle = color;
            ctx.fillText(line, xPos, yPos);
            ctx.restore();
        } else if (textEffect === '3d') {
            const extrusionDepth = layer.extrusionDepth !== undefined ? layer.extrusionDepth : 8;
            const extrusionColor = layer.extrusionColor || '#222222';
            
            ctx.save();
            ctx.fillStyle = extrusionColor;
            for (let i = extrusionDepth; i > 0; i--) {
                ctx.fillText(line, xPos - i, yPos + i);
            }
            ctx.restore();
        }
        
        // Define base text color/gradient
        let finalFillStyle = color;
        if (textEffect === 'gradient_fill') {
            const gradient = ctx.createLinearGradient(0, yPos, 0, yPos + finalFontSize);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, layer.gradientColor || '#ffffff');
            finalFillStyle = gradient;
        }
        
        ctx.fillStyle = finalFillStyle;
        ctx.fillText(line, xPos, yPos);
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

const THEME_PRESETS = [
    {
        name: 'Midnight Star',
        gradient: 'midnight',
        textColor: '#A5C0FF',
        particleType: 'stars',
        accentColor: '#3B82F6'
    },
    {
        name: 'Soft Romance',
        gradient: 'romance',
        textColor: '#FFB7C5',
        particleType: 'sakura',
        accentColor: '#EC4899'
    },
    {
        name: 'Forest Emerald',
        gradient: 'emerald',
        textColor: '#D1E7DD',
        particleType: 'leaves',
        accentColor: '#10B981'
    },
    {
        name: 'Royal Luxury Gold',
        gradient: 'luxury_gold',
        textColor: '#D4AF37',
        particleType: 'gold_dust',
        accentColor: '#F59E0B'
    },
    {
        name: 'Clean Ivory',
        gradient: 'ivory_cream',
        textColor: '#8A6D3B',
        particleType: 'bokeh',
        accentColor: '#B45309'
    }
];

const PRESET_LIBRARY = [
    {
        category: 'Bunga & Daun',
        items: [
            { name: 'Bunga Kiri', url: '/themes/utary/asset/flower-left.webp' },
            { name: 'Bunga Kanan', url: '/themes/utary/asset/flower-right.webp' }
        ]
    },
    {
        category: 'Tradisional & Wayang',
        items: [
            { name: 'Gunungan Jawa', url: '/themes/wayang/asset/gunungan.webp' },
            { name: 'Wayang Kiri', url: '/themes/wayang/asset/ornamen-wayang.webp' },
            { name: 'Wayang Kanan', url: '/themes/wayang/asset/ornamen-wayang-kanan.webp' },
            { name: 'Ornamen Atas', url: '/themes/wayang/asset/ornamen-atas.png' },
            { name: 'Ornamen Bawah', url: '/themes/wayang/asset/ornamen-bawah.png' }
        ]
    },
    {
        category: 'Frame & Border',
        items: [
            { name: 'Frame Atas', url: '/themes/utary/asset/event-frame-top.webp' },
            { name: 'Frame Bawah', url: '/themes/utary/asset/event-frame-bottom.webp' },
            { name: 'Border Kiri', url: '/themes/utary/asset/ornament-left.webp' },
            { name: 'Border Kanan', url: '/themes/utary/asset/ornament-right.webp' },
            { name: 'Frame Profil', url: '/themes/utary/asset/frame-profile.webp' }
        ]
    }
];

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
    } else if (type === 'leaves') {
        ctx.fillStyle = 'rgba(120, 180, 80, 0.9)';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.quadraticCurveTo(26, 12, 16, 28);
        ctx.quadraticCurveTo(6, 12, 16, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(90, 140, 60, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(16, 6);
        ctx.lineTo(16, 26);
        ctx.stroke();
    } else if (type === 'rose') {
        ctx.fillStyle = 'rgba(80, 140, 60, 0.9)';
        ctx.beginPath();
        ctx.moveTo(16, 20);
        ctx.lineTo(12, 28);
        ctx.quadraticCurveTo(16, 30, 20, 28);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(220, 60, 60, 0.9)';
        ctx.beginPath(); ctx.arc(16, 12, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(200, 50, 50, 0.9)';
        ctx.beginPath(); ctx.arc(12, 16, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(230, 70, 70, 0.9)';
        ctx.beginPath(); ctx.arc(20, 16, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(210, 55, 55, 0.9)';
        ctx.beginPath(); ctx.arc(16, 19, 4, 0, Math.PI * 2); ctx.fill();
    } else if (type === 'stars') {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(16 + Math.cos((18 + i * 72) * Math.PI / 180) * 12, 16 - Math.sin((18 + i * 72) * Math.PI / 180) * 12);
            ctx.lineTo(16 + Math.cos((54 + i * 72) * Math.PI / 180) * 6, 16 - Math.sin((54 + i * 72) * Math.PI / 180) * 6);
        }
        ctx.closePath();
        ctx.fill();
    } else if (type === 'hearts') {
        ctx.fillStyle = 'rgba(240, 100, 160, 0.9)';
        ctx.beginPath();
        ctx.moveTo(16, 26);
        ctx.bezierCurveTo(6, 17.5, 6, 6, 11, 6);
        ctx.bezierCurveTo(16, 6, 16, 10, 16, 10);
        ctx.bezierCurveTo(16, 10, 16, 6, 21, 6);
        ctx.bezierCurveTo(26, 6, 26, 17.5, 16, 26);
        ctx.closePath();
        ctx.fill();
    } else if (type === 'confetti') {
        const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bcb','#a66cff'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(8, 10, 16, 12);
    } else if (type === 'butterfly') {
        ctx.fillStyle = 'rgba(162, 155, 254, 0.9)';
        ctx.beginPath();
        ctx.moveTo(16, 16);
        ctx.bezierCurveTo(10, 6, 2, 8, 5, 14);
        ctx.bezierCurveTo(8, 18, 12, 20, 16, 16);
        ctx.fill();
        ctx.fillStyle = 'rgba(130, 120, 230, 0.9)';
        ctx.beginPath();
        ctx.moveTo(16, 16);
        ctx.bezierCurveTo(22, 6, 30, 8, 27, 14);
        ctx.bezierCurveTo(24, 18, 20, 20, 16, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(100, 90, 180, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(16, 10);
        ctx.lineTo(16, 22);
        ctx.stroke();
    } else if (type === 'flower') {
        ctx.fillStyle = 'rgba(250, 120, 170, 0.9)';
        ctx.beginPath(); ctx.ellipse(16, 10, 4, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(16, 22, 4, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(245, 130, 175, 0.9)';
        ctx.beginPath(); ctx.ellipse(22, 16, 6, 4, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(10, 16, 6, 4, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255, 200, 60, 0.9)';
        ctx.beginPath(); ctx.arc(16, 16, 3.5, 0, Math.PI*2); ctx.fill();
    } else if (type === 'sparkle') {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.quadraticCurveTo(16, 16, 28, 16);
        ctx.quadraticCurveTo(16, 16, 16, 28);
        ctx.quadraticCurveTo(16, 16, 4, 16);
        ctx.quadraticCurveTo(16, 16, 16, 4);
        ctx.closePath();
        ctx.fill();
    } else if (type === 'birds') {
        ctx.fillStyle = 'rgba(46, 63, 84, 0.9)';
        ctx.beginPath();
        ctx.moveTo(2, 16);
        ctx.quadraticCurveTo(8, 3, 14, 16);
        ctx.quadraticCurveTo(20, 3, 26, 16);
        ctx.quadraticCurveTo(20, 10, 14, 16);
        ctx.quadraticCurveTo(8, 10, 2, 16);
        ctx.closePath();
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};

const AVAILABLE_FONTS = [
    { name: 'Playfair Display', style: "'Playfair Display', serif" },
    { name: 'Great Vibes', style: "'Great Vibes', cursive" },
    { name: 'Alex Brush', style: "'Alex Brush', cursive" },
    { name: 'Dancing Script', style: "'Dancing Script', cursive" },
    { name: 'Cinzel', style: "'Cinzel', serif" },
    { name: 'Cormorant Garamond', style: "'Cormorant Garamond', serif" },
    { name: 'Outfit', style: "'Outfit', sans-serif" },
    { name: 'Parisienne', style: "'Parisienne', cursive" },
    { name: 'Pinyon Script', style: "'Pinyon Script', cursive" },
    { name: 'Prata', style: "'Prata', serif" },
    { name: 'Rochester', style: "'Rochester', cursive" },
    { name: 'Sacramento', style: "'Sacramento', cursive" },
    { name: 'Montserrat', style: "'Montserrat', sans-serif" },
    { name: 'Italiana', style: "'Italiana', serif" },
    { name: 'Niconne', style: "'Niconne', cursive" },
    { name: 'Tangerine', style: "'Tangerine', cursive" },
    { name: 'Allura', style: "'Allura', cursive" },
    { name: 'Herr Von Muellerhoff', style: "'Herr Von Muellerhoff', cursive" },
    { name: 'Cinzel Decorative', style: "'Cinzel Decorative', serif" },
    { name: 'Satisfy', style: "'Satisfy', cursive" },
    { name: 'Pacifico', style: "'Pacifico', cursive" },
    { name: 'Cardo', style: "'Cardo', serif" },
    { name: 'Lora', style: "'Lora', serif" },
    { name: 'Poppins', style: "'Poppins', sans-serif" },
    { name: 'Marck Script', style: "'Marck Script', cursive" },
    { name: 'Playball', style: "'Playball', cursive" },
    { name: 'Arial', style: 'Arial, sans-serif' }
].sort((a, b) => a.name.localeCompare(b.name));

const isPixelOpaque = (intersect) => {
    const mesh = intersect.object;
    if (!mesh.material || !mesh.material.map) return true;
    
    const texture = mesh.material.map;
    const img = texture.image;
    if (!img) return true;
    
    try {
        const uv = intersect.uv;
        if (!uv) return true;
        
        let canvas = texture.userData.canvas;
        let ctx = texture.userData.ctx;
        
        if (!canvas) {
            if (typeof HTMLCanvasElement !== 'undefined' && img instanceof HTMLCanvasElement) {
                canvas = img;
                ctx = canvas.getContext('2d');
            } else if (typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement) {
                if (img.width === 0 || img.height === 0) return true;
                canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                }
            } else {
                return true;
            }
            texture.userData.canvas = canvas;
            texture.userData.ctx = ctx;
        }
        
        if (!ctx) return true;
        
        const x = Math.floor(uv.x * canvas.width);
        const y = Math.floor((1 - uv.y) * canvas.height);
        
        const clampedX = Math.max(0, Math.min(canvas.width - 1, x));
        const clampedY = Math.max(0, Math.min(canvas.height - 1, y));
        
        const pixel = ctx.getImageData(clampedX, clampedY, 1, 1).data;
        const alpha = pixel[3];
        
        return alpha > 10;
    } catch (err) {
        console.warn("Could not check pixel transparency:", err);
        return true;
    }
};

export default function ThreeDSceneEditor({ scene = null }) {
    const isEdit = !!scene;
    
    // Initialize config and run migrations for backward compatibility
    const initialConfig = scene?.config || createDefaultConfig();
    const migratedConfig = {
        ...initialConfig,
        layers: migrateLayers(initialConfig.layers || [])
    };

    const { data, setData, post, put, transform, processing, errors, isDirty } = useForm({
        name: scene?.name || '',
        slug: scene?.slug || '',
        config: migratedConfig,
        thumbnail: scene?.thumbnail || '',
        is_active: scene?.is_active ?? true,
    });

    const [activeTab, setActiveTab] = useState('layers'); // 'layers' | 'settings' | 'keyframes'
    const [selectedLayerId, setSelectedLayerId] = useState(null);
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [isolatedLayerId, setIsolatedLayerId] = useState(null);
    const [selectedCameraPreset, setSelectedCameraPreset] = useState('cinematic_zoom');
    
    // Automatically select the first content item when selectedLayerId changes
    useEffect(() => {
        if (selectedLayerId) {
            const layer = data.config.layers.find(l => l.id === selectedLayerId);
            if (layer && layer.contents && layer.contents.length > 0) {
                const containsSelectedContent = layer.contents.some(c => c.id === selectedContentId);
                if (!containsSelectedContent) {
                    setSelectedContentId(layer.contents[0].id);
                }
            } else {
                setSelectedContentId(null);
            }
        } else {
            setSelectedContentId(null);
        }
    }, [selectedLayerId, data.config.layers]);

    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const [showDrawingPad, setShowDrawingPad] = useState(false);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, layerId: null, contentId: null });
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showExportConfig, setShowExportConfig] = useState(false);
    const [exportSettings, setExportSettings] = useState({
        fps: 60,
        quality: 'high', // 'low' | 'high' | 'ultra'
        bitrate: 8000000 // 8 Mbps
    });
    const [exportProgress, setExportProgress] = useState(0);
    const exportCancelledRef = useRef(false);
    const [recordedBytes, setRecordedBytes] = useState(0);
    const [exportResult, setExportResult] = useState(null);

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const radToDeg = (rad) => Math.round(rad * (180 / Math.PI));

    const getEstimatedDuration = () => {
        const kfs = data.config.keyframes || [];
        if (kfs.length < 2) return '0 detik';
        let durationMs = 0;
        for (let i = 1; i < kfs.length; i++) {
            const dMove = (kfs[i].transitionDuration ?? 2.0) * 1000;
            const dPause = (kfs[i].pauseDuration ?? 2.0) * 1000;
            durationMs += dMove + dPause;
        }
        return `${(durationMs / 1000).toFixed(1)} detik`;
    };

    const getEstimatedFileSize = (settings) => {
        const kfs = data.config.keyframes || [];
        if (kfs.length < 2) return '0 KB';
        
        let durationMs = 0;
        for (let i = 1; i < kfs.length; i++) {
            const dMove = (kfs[i].transitionDuration ?? 2.0) * 1000;
            const dPause = (kfs[i].pauseDuration ?? 2.0) * 1000;
            durationMs += dMove + dPause;
        }
        const durationSec = durationMs / 1000;
        
        const bitrate = settings?.bitrate || 8000000;
        const audioBitrate = data.config.musicUrl ? 128000 : 0;
        const totalBitrate = bitrate + audioBitrate;
        
        let bytes = durationSec * (totalBitrate / 8);
        
        if (settings?.quality === 'low') {
            bytes *= 0.45;
        } else if (settings?.quality === 'high') {
            bytes *= 0.85;
        } else if (settings?.quality === 'ultra') {
            bytes *= 1.1;
        }
        
        return formatBytes(bytes);
    };
    
    // Immersive fullscreen creative mode states
    const [isImmersive, setIsImmersive] = useState(true);
    const [immersiveActivePanel, setImmersiveActivePanel] = useState(null); // null | 'layers' | 'keyframes' | 'settings' | 'inspector'
    const [showFileDropdown, setShowFileDropdown] = useState(false);

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
    const [isReplacingImage, setIsReplacingImage] = useState(false);
    const [bgRemoverReturnState, setBgRemoverReturnState] = useState(null);
    
    // Custom presets (decoration library improvements) states
    const [customPresets, setCustomPresets] = useState(() => {
        try {
            const saved = localStorage.getItem('3d_editor_custom_presets');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [isUploadingPreset, setIsUploadingPreset] = useState(false);
    const [uploadPresetFile, setUploadPresetFile] = useState(null);
    const [uploadPresetName, setUploadPresetName] = useState('');
    const [uploadPresetCategory, setUploadPresetCategory] = useState('Bunga & Daun');
    const [customPresetCategory, setCustomPresetCategory] = useState('');
    const [showPresetUploadForm, setShowPresetUploadForm] = useState(false);

    // Combine static PRESET_LIBRARY with customPresets
    const getFullLibrary = () => {
        const lib = PRESET_LIBRARY.map(cat => ({
            category: cat.category,
            items: [...cat.items]
        }));
        
        customPresets.forEach(preset => {
            const catName = preset.category || 'Custom Uploads';
            let existingCat = lib.find(c => c.category.toLowerCase() === catName.toLowerCase());
            
            if (!existingCat) {
                existingCat = { category: catName, items: [] };
                lib.push(existingCat);
            }
            
            if (!existingCat.items.some(item => item.url === preset.url)) {
                existingCat.items.push({
                    name: preset.name,
                    url: preset.url,
                    isCustom: true
                });
            }
        });
        
        return lib;
    };

    const toggleCategory = (categoryName) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    const handleCustomPresetUpload = async (e) => {
        e.preventDefault();
        if (!uploadPresetFile) return;

        setIsUploadingPreset(true);
        const finalCategory = uploadPresetCategory === '__new__' ? customPresetCategory.trim() : uploadPresetCategory;
        if (!finalCategory) {
            alert('Kategori tidak boleh kosong.');
            setIsUploadingPreset(false);
            return;
        }

        const nameToUse = uploadPresetName.trim() || uploadPresetFile.name.replace(/\.[^/.]+$/, "");

        const formData = new FormData();
        formData.append('file', uploadPresetFile);

        try {
            const response = await axios.post('/super-admin/three-d-scenes/upload-asset', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.url) {
                const newPreset = {
                    name: nameToUse,
                    url: response.data.url,
                    category: finalCategory
                };

                const updatedPresets = [...customPresets, newPreset];
                setCustomPresets(updatedPresets);
                localStorage.setItem('3d_editor_custom_presets', JSON.stringify(updatedPresets));

                // Clear form
                setUploadPresetFile(null);
                setUploadPresetName('');
                setCustomPresetCategory('');
                setShowPresetUploadForm(false);
                
                // Open/expand the uploaded category automatically
                setCollapsedCategories(prev => ({
                    ...prev,
                    [finalCategory]: false
                }));
            } else {
                alert('Gagal mengunggah gambar preset.');
            }
        } catch (error) {
            console.error('Preset upload error:', error);
            alert('Terjadi kesalahan saat mengunggah preset.');
        } finally {
            setIsUploadingPreset(false);
        }
    };

    const deleteCustomPreset = (itemToDelete) => {
        if (confirm(`Hapus item album "${itemToDelete.name}" dari perpustakaan?`)) {
            const updatedPresets = customPresets.filter(preset => preset.url !== itemToDelete.url);
            setCustomPresets(updatedPresets);
            localStorage.setItem('3d_editor_custom_presets', JSON.stringify(updatedPresets));
        }
    };
    
    const layerPopupRef = useRef(null);
    const compPopupRef = useRef(null);

    const openBgRemover = (content) => {
        setBgRemoverReturnState({
            activeLayerSettingsId,
            activeComponentSettingsInfo,
            immersiveActivePanel,
            selectedLayerId,
            selectedContentId,
            activeSettingsTab
        });
        setBgRemoverLayer(content);
        setShowBgRemover(true);
        setActiveComponentSettingsInfo(null);
    };

    const closeBgRemover = () => {
        setShowBgRemover(false);
        if (bgRemoverReturnState) {
            setActiveLayerSettingsId(bgRemoverReturnState.activeLayerSettingsId);
            setActiveComponentSettingsInfo(bgRemoverReturnState.activeComponentSettingsInfo);
            setImmersiveActivePanel(bgRemoverReturnState.immersiveActivePanel);
            setSelectedLayerId(bgRemoverReturnState.selectedLayerId);
            setSelectedContentId(bgRemoverReturnState.selectedContentId);
            setActiveSettingsTab(bgRemoverReturnState.activeSettingsTab);
            setBgRemoverReturnState(null);
        }
    };

    const [draggedLayerId, setDraggedLayerId] = useState(null);
    const [dragOverLayerId, setDragOverLayerId] = useState(null);
    const [activeAddMenuLayerId, setActiveAddMenuLayerId] = useState(null);
    const [activeLayerSettingsId, setActiveLayerSettingsId] = useState(null);
    const [activeComponentSettingsInfo, setActiveComponentSettingsInfo] = useState(null); // { layerId, contentId }
    const [activeSettingsTab, setActiveSettingsTab] = useState('position'); // 'position' | 'animation' | 'transition' | 'content'
    const [draggedContentId, setDraggedContentId] = useState(null);
    const [draggedContentSourceLayerId, setDraggedContentSourceLayerId] = useState(null);
    const [dragOverContentId, setDragOverContentId] = useState(null);
    const replaceImageInputRef = useRef(null);
    const addImageInputRef = useRef(null);
    
    const [layerPopupPos, setLayerPopupPos] = useState({ x: 500, y: 120 });
    const [compPopupPos, setCompPopupPos] = useState({ x: 500, y: 120 });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLayerPopupPos({ x: window.innerWidth - 420, y: 120 });
            setCompPopupPos({ x: window.innerWidth - 420, y: 120 });
        }
    }, []);

    const layerDragStart = useRef(null);
    const handleLayerMouseDown = (e) => {
        if (e.button !== 0 || e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
        layerDragStart.current = {
            startX: e.clientX,
            startY: e.clientY,
            popupX: layerPopupPos.x,
            popupY: layerPopupPos.y
        };
        document.addEventListener('mousemove', handleLayerMouseMove);
        document.addEventListener('mouseup', handleLayerMouseUp);
    };

    const handleLayerMouseMove = (e) => {
        if (!layerDragStart.current) return;
        const dx = e.clientX - layerDragStart.current.startX;
        const dy = e.clientY - layerDragStart.current.startY;
        const nextX = Math.max(0, Math.min(window.innerWidth - 400, layerDragStart.current.popupX + dx));
        const nextY = Math.max(0, Math.min(window.innerHeight - 400, layerDragStart.current.popupY + dy));
        
        if (layerPopupRef.current) {
            layerPopupRef.current.style.left = `${nextX}px`;
            layerPopupRef.current.style.top = `${nextY}px`;
        }
        
        layerDragStart.current.currentX = nextX;
        layerDragStart.current.currentY = nextY;
    };

    const handleLayerMouseUp = () => {
        if (layerDragStart.current && layerDragStart.current.currentX !== undefined) {
            setLayerPopupPos({
                x: layerDragStart.current.currentX,
                y: layerDragStart.current.currentY
            });
        }
        layerDragStart.current = null;
        document.removeEventListener('mousemove', handleLayerMouseMove);
        document.removeEventListener('mouseup', handleLayerMouseUp);
    };

    const compDragStart = useRef(null);
    const handleCompMouseDown = (e) => {
        if (e.button !== 0 || e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea')) return;
        compDragStart.current = {
            startX: e.clientX,
            startY: e.clientY,
            popupX: compPopupPos.x,
            popupY: compPopupPos.y
        };
        document.addEventListener('mousemove', handleCompMouseMove);
        document.addEventListener('mouseup', handleCompMouseUp);
    };

    const handleCompMouseMove = (e) => {
        if (!compDragStart.current) return;
        const dx = e.clientX - compDragStart.current.startX;
        const dy = e.clientY - compDragStart.current.startY;
        const nextX = Math.max(0, Math.min(window.innerWidth - 400, compDragStart.current.popupX + dx));
        const nextY = Math.max(0, Math.min(window.innerHeight - 450, compDragStart.current.popupY + dy));
        
        if (compPopupRef.current) {
            compPopupRef.current.style.left = `${nextX}px`;
            compPopupRef.current.style.top = `${nextY}px`;
        }
        
        compDragStart.current.currentX = nextX;
        compDragStart.current.currentY = nextY;
    };

    const handleCompMouseUp = () => {
        if (compDragStart.current && compDragStart.current.currentX !== undefined) {
            setCompPopupPos({
                x: compDragStart.current.currentX,
                y: compDragStart.current.currentY
            });
        }
        compDragStart.current = null;
        document.removeEventListener('mousemove', handleCompMouseMove);
        document.removeEventListener('mouseup', handleCompMouseUp);
    };

    useEffect(() => {
        // Only update active settings if the inspector (Komponen) panel is already open.
        // This ensures selecting components on the canvas or layers list doesn't force-open the editing settings drawer.
        if (immersiveActivePanel === 'inspector') {
            if (selectedLayerId) {
                if (selectedContentId) {
                    setActiveComponentSettingsInfo({ layerId: selectedLayerId, contentId: selectedContentId });
                    setActiveLayerSettingsId(null);
                } else {
                    setActiveLayerSettingsId(selectedLayerId);
                    setActiveComponentSettingsInfo(null);
                }
            } else {
                setActiveLayerSettingsId(null);
                setActiveComponentSettingsInfo(null);
            }
        }
    }, [selectedLayerId, selectedContentId]);
    
    const showBgRemoverRef = useRef(false);
    const bgOriginalImgRef = useRef(null);
    const bgBrushPreviewRef = useRef(null);
    const previewAudioRef = useRef(null);

    useEffect(() => {
        showBgRemoverRef.current = showBgRemover;
    }, [showBgRemover]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (activeAddMenuLayerId && !e.target.closest('.add-menu-container')) {
                setActiveAddMenuLayerId(null);
            }
        };
        document.addEventListener('pointerdown', handleOutsideClick);
        return () => document.removeEventListener('pointerdown', handleOutsideClick);
    }, [activeAddMenuLayerId]);

    // Tracks initial state to detect unsaved changes
    const initialDataRef = useRef(null);

    useEffect(() => {
        initialDataRef.current = JSON.stringify({
            name: data.name,
            config: data.config,
            is_active: data.is_active
        });
    }, []);

    // Prompt user when navigating away or closing window with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const currentDataStr = JSON.stringify({
                name: data.name,
                config: data.config,
                is_active: data.is_active
            });
            const hasUnsaved = initialDataRef.current && initialDataRef.current !== currentDataStr;
            
            if (hasUnsaved) {
                e.preventDefault();
                e.returnValue = 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?';
                return e.returnValue;
            }
        };

        const removeBeforeEventListener = router.on('before', (event) => {
            // Only intercept GET requests (navigation away) and ignore form save/upload visits (PUT, POST)
            if (event.detail.visit.method !== 'get') return;

            const currentDataStr = JSON.stringify({
                name: data.name,
                config: data.config,
                is_active: data.is_active
            });
            const hasUnsaved = initialDataRef.current && initialDataRef.current !== currentDataStr;

            if (hasUnsaved) {
                const confirmSave = confirm("Project ini belum disimpan. Apakah Anda ingin menyimpan project terlebih dahulu?");
                if (confirmSave) {
                    event.preventDefault();
                    
                    let finalName = data.name;
                    if (!finalName || !finalName.trim()) {
                        const today = new Date();
                        const dd = String(today.getDate()).padStart(2, '0');
                        const mm = String(today.getMonth() + 1).padStart(2, '0');
                        const yyyy = today.getFullYear();
                        finalName = `Project - ${dd}-${mm}-${yyyy}`;
                    }
                    
                    handleSubmit(null, finalName, event.detail.visit.url);
                } else {
                    const confirmLeave = confirm("Apakah Anda yakin ingin pindah menu/page dan membuang semua perubahan?");
                    if (!confirmLeave) {
                        event.preventDefault();
                    }
                }
            }
        });

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            removeBeforeEventListener();
        };
    }, [data]);


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

    // 3D Minimap State & Refs
    const [showMinimap, setShowMinimap] = useState(true);
    const [minimapSize, setMinimapSize] = useState('md'); // 'sm' | 'md' | 'lg'
    const minimapCanvasRef = useRef(null);
    const minimapRendererRef = useRef(null);
    const minimapCameraRef = useRef(null);
    const minimapControlsRef = useRef(null);
    const cameraHelperRef = useRef(null);

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
    const dragContentEndCallbackRef = useRef(null);
    const resizeEndCallbackRef = useRef(null);
    const resizeContentEndCallbackRef = useRef(null);
    const selectLayerCallbackRef = useRef(null);
    const isPlayingPreviewRef = useRef(isPlayingPreview);
    
    // Drag tracking refs to avoid render loop position overrides
    const isDraggingMeshRef = useRef(false);
    const isResizingMeshRef = useRef(false);
    const dragLayerIdRef = useRef(null);
    const dragContentIdRef = useRef(null);
    
    const handlesRef = useRef([]);
    const selectedLayerIdRef = useRef(null);
    const selectedContentIdRef = useRef(null);

    useEffect(() => {
        selectedLayerIdRef.current = selectedLayerId;
    }, [selectedLayerId]);

    useEffect(() => {
        selectedContentIdRef.current = selectedContentId;
    }, [selectedContentId]);

    const isolatedLayerIdRef = useRef(null);
    useEffect(() => {
        isolatedLayerIdRef.current = isolatedLayerId;
    }, [isolatedLayerId]);
    const lastTapTimeRef = useRef(0);
    const lastTapObjectRef = useRef(null);
    const activeTouchCountRef = useRef(0);

    const depthSvgRef = useRef(null);
    const [draggingLayerId, setDraggingLayerId] = useState(null);
    const [depthAssetPickerTargetId, setDepthAssetPickerTargetId] = useState(null);

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

        const count = configRef.current.particleCount ?? 30;
        const speed = configRef.current.particleSpeed || 'normal';
        const speedFactor = speed === 'slow' ? 0.55 : speed === 'fast' ? 1.75 : 1.0;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = [];

        // Check if particle rises or falls
        const isRising = type === 'gold_dust' || type === 'stars' || type === 'sparkle';

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 4.5;

            let vx, vy, vz;
            if (isRising) {
                // Rise up
                vx = (Math.random() - 0.5) * 0.015;
                vy = (Math.random() * 0.015 + 0.005);
                vz = (Math.random() - 0.5) * 0.01;
            } else {
                // Fall down
                vx = (Math.random() - 0.5) * 0.015;
                vy = -(Math.random() * 0.015 + 0.01);
                vz = (Math.random() - 0.5) * 0.01;
            }
            
            // Adjust individual velocities slightly per type
            if (type === 'snow') {
                vx = (Math.random() - 0.5) * 0.005;
                vy = -(Math.random() * 0.012 + 0.008);
                vz = (Math.random() - 0.5) * 0.005;
            } else if (type === 'birds') {
                // Birds fly sideways/upwards
                vx = (Math.random() - 0.5) * 0.04 + 0.02;
                vy = (Math.random() - 0.5) * 0.01;
                vz = (Math.random() - 0.5) * 0.01;
            }

            velocities.push({
                x: vx * speedFactor,
                y: vy * speedFactor,
                z: vz * speedFactor
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const texture = createParticleTexture(type);
        
        let size = 0.22;
        if (type === 'sakura' || type === 'leaves' || type === 'rose' || type === 'flower' || type === 'butterfly') {
            size = 0.35;
        } else if (type === 'birds' || type === 'confetti') {
            size = 0.45;
        } else if (type === 'hearts' || type === 'stars') {
            size = 0.28;
        }

        const material = new THREE.PointsMaterial({
            size: size,
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

    const animateParticles = (customTime = null) => {
        if (particlesRef.current) {
            const points = particlesRef.current;
            const positions = points.geometry.attributes.position.array;
            const velocities = particleVelocitiesRef.current;
            const type = configRef.current.particleType || 'none';

            const currentCount = positions.length / 3;
            const isRising = type === 'gold_dust' || type === 'stars' || type === 'sparkle';

            const timeVal = customTime !== null ? customTime : Date.now();

            for (let i = 0; i < currentCount; i++) {
                if (!velocities[i]) continue;
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;

                if (type !== 'birds') {
                     positions[i * 3] += Math.sin(timeVal * 0.001 + i) * 0.003;
                }

                if (isRising) {
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

    const updateClosestKeyframeProgress = () => {
        if (!cameraRef.current || !configRef.current || !configRef.current.keyframes) return;
        const kfs = configRef.current.keyframes;
        if (kfs.length < 2) return;

        let closestKfIndex = 0;
        let minDistance = Infinity;
        kfs.forEach((kf, idx) => {
            const dist = cameraRef.current.position.distanceTo(new THREE.Vector3(kf.position.x, kf.position.y, kf.position.z));
            if (dist < minDistance) {
                minDistance = dist;
                closestKfIndex = idx;
            }
        });

        currentCameraProgressRef.current = closestKfIndex / (kfs.length - 1);
    };

    const animateLayers = (customTime = null) => {
        if (!configRef.current || !configRef.current.layers) return;
        const timeVal = customTime !== null ? customTime : Date.now();
        const timeSec = timeVal / 1000;

        configRef.current.layers.forEach(layer => {
            const group = meshesRef.current[layer.id];
            if (!group) return;

            // Compute Transition Progress (inProgress & outProgress)
            let inProgress = 1.0;
            let outProgress = 1.0;
            let alpha = 1.0;
            const kfs = configRef.current.keyframes || [];

            const activePreview = transitionPreviewRef.current;
            const isPreviewingThis = activePreview && activePreview.id === layer.id;

            if (isPreviewingThis) {
                const elapsedMs = Date.now() - activePreview.startTime;
                const durationMs = (layer.transitionDuration ?? 1.0) * 1000;
                const p = Math.min(1.0, elapsedMs / durationMs);
                if (activePreview.type === 'entry') {
                    inProgress = p;
                    outProgress = 1.0;
                } else {
                    inProgress = 1.0;
                    outProgress = 1.0 - p;
                }
                if (p >= 1.0) {
                    transitionPreviewRef.current = null;
                }
            } else if (kfs.length >= 2) {
                const progressVal = currentCameraProgressRef.current; // 0 to 1
                const k = progressVal * (kfs.length - 1);

                if (layer.fadeMode === 'show_at_keyframe') {
                    const target = layer.fadeInStart ?? 0;
                    const fiStart = Math.max(0, target - 1);
                    const fiEnd = target;
                    const foStart = target;
                    const foEnd = Math.min(kfs.length - 1, target + 1);

                    if (k < fiStart) {
                        inProgress = 0;
                    } else if (k < fiEnd) {
                        inProgress = fiEnd === fiStart ? 1.0 : (k - fiStart) / (fiEnd - fiStart);
                    } else {
                        inProgress = 1.0;
                    }

                    if (k < foStart) {
                        outProgress = 1.0;
                    } else if (k < foEnd) {
                        outProgress = foEnd === foStart ? 0.0 : 1.0 - (k - foStart) / (foEnd - foStart);
                    } else {
                        outProgress = 0;
                    }
                } else if (layer.fadeMode === 'fade_in_from') {
                    const target = layer.fadeInStart ?? 0;
                    const fiStart = Math.max(0, target - 1);
                    const fiEnd = target;

                    if (k < fiStart) {
                        inProgress = 0;
                    } else if (k < fiEnd) {
                        inProgress = fiEnd === fiStart ? 1.0 : (k - fiStart) / (fiEnd - fiStart);
                    } else {
                        inProgress = 1.0;
                    }
                    outProgress = 1.0;
                } else if (layer.fadeMode === 'fade_out_at') {
                    const target = layer.fadeOutStart ?? (kfs.length - 1);
                    const foStart = target;
                    const foEnd = Math.min(kfs.length - 1, target + 1);

                    inProgress = 1.0;
                    if (k < foStart) {
                        outProgress = 1.0;
                    } else if (k < foEnd) {
                        outProgress = foEnd === foStart ? 0.0 : 1.0 - (k - foStart) / (foEnd - foStart);
                    } else {
                        outProgress = 0;
                    }
                } else if (layer.fadeMode === 'keyframe' || layer.fadeMode === 'custom') {
                    const fiStart = layer.fadeInStart ?? 0;
                    const fiEnd = layer.fadeInEnd ?? 0;
                    const foStart = layer.fadeOutStart ?? (kfs.length - 1);
                    const foEnd = layer.fadeOutEnd ?? (kfs.length - 1);

                    if (k < fiStart) {
                        inProgress = 0;
                    } else if (k < fiEnd) {
                        inProgress = fiEnd === fiStart ? 1.0 : (k - fiStart) / (fiEnd - fiStart);
                    } else {
                        inProgress = 1.0;
                    }

                    if (k < foStart) {
                        outProgress = 1.0;
                    } else if (k < foEnd) {
                        outProgress = foEnd === foStart ? 0.0 : 1.0 - (k - foStart) / (foEnd - foStart);
                    } else {
                        outProgress = 0;
                    }
                }

                // Scale transition progress by duration factor
                const durationFactor = Math.max(0.05, Math.min(1.0, (layer.transitionDuration ?? 1.0) / 2.0));
                inProgress = Math.min(1.0, inProgress / durationFactor);
                outProgress = Math.max(0.0, 1.0 - (1.0 - outProgress) / durationFactor);
            }
            alpha = inProgress * outProgress;

            if (isolatedLayerIdRef.current && layer.id !== isolatedLayerIdRef.current) {
                alpha *= 0.15;
            }

            // Base position, rotation, scale
            let posX = layer.position.x;
            let posY = layer.position.y;
            let posZ = layer.position.z;
            let rotX = THREE.MathUtils.degToRad(layer.rotation?.x || 0);
            let rotY = THREE.MathUtils.degToRad(layer.rotation?.y || 0);
            let rotZ = THREE.MathUtils.degToRad(layer.rotation?.z || 0);
            let scaleX = layer.scale.x;
            let scaleY = layer.scale.y;

            // Apply continuous animation if any
            const animType = layer.animationType || 'none';
            const speed = layer.animationSpeed !== undefined ? layer.animationSpeed : 1.0;
            const intensity = layer.animationIntensity !== undefined ? layer.animationIntensity : 1.0;
            const t = timeSec * speed;

            if (animType === 'float') {
                posY += Math.sin(t) * 0.25 * intensity;
            } else if (animType === 'spin') {
                rotZ += t * 0.5 * intensity;
            } else if (animType === 'pulse') {
                const pulseScale = 1.0 + Math.sin(t) * 0.12 * intensity;
                scaleX *= pulseScale;
                scaleY *= pulseScale;
            } else if (animType === 'swing') {
                rotZ += Math.sin(t) * 0.18 * intensity;
            } else if (animType === 'bounce') {
                const bounce = Math.abs(Math.sin(t * 1.5));
                posY += bounce * 0.4 * intensity;
                if (bounce < 0.2) {
                    scaleY *= (1.0 - (0.2 - bounce) * 0.4 * intensity);
                }
            } else if (animType === 'wiggle') {
                posX += Math.sin(t * 5) * 0.05 * intensity;
                posY += Math.cos(t * 6) * 0.05 * intensity;
            } else if (animType === 'wave') {
                posX += Math.sin(t) * 0.3 * intensity;
                rotZ += Math.cos(t) * 0.05 * intensity;
            } else if (animType === 'heartbeat') {
                let hbScale = 1.0;
                const subT = t % (Math.PI * 2);
                if (subT < 0.3) {
                    hbScale = 1.0 + Math.sin(subT * (Math.PI / 0.3)) * 0.15 * intensity;
                } else if (subT >= 0.4 && subT < 0.7) {
                    hbScale = 1.0 + Math.sin((subT - 0.4) * (Math.PI / 0.3)) * 0.08 * intensity;
                }
                scaleX *= hbScale;
                scaleY *= hbScale;
            } else if (animType === 'flicker') {
                const flickerVal = 0.7 + Math.sin(t * 8) * 0.3 * intensity;
                alpha *= Math.max(0.2, Math.min(1.0, flickerVal));
            } else if (animType === 'spinY') {
                rotY += t * 0.5 * intensity;
            } else if (animType === 'flipX') {
                rotX += t * 0.5 * intensity;
            }

            // Apply entrance/exit transition animations
            if (layer.fadeMode && layer.fadeMode !== 'none') {
                const entryAnim = layer.entryAnim || 'fade';
                const exitAnim = layer.exitAnim || 'fade';
                const transIntensity = layer.transitionIntensity ?? 1.0;

                // Entry animation offsets
                if (entryAnim === 'slide_up') {
                    posY -= (1.0 - inProgress) * 1.5 * transIntensity;
                } else if (entryAnim === 'slide_down') {
                    posY += (1.0 - inProgress) * 1.5 * transIntensity;
                } else if (entryAnim === 'slide_left') {
                    posX += (1.0 - inProgress) * 1.5 * transIntensity;
                } else if (entryAnim === 'slide_right') {
                    posX -= (1.0 - inProgress) * 1.5 * transIntensity;
                } else if (entryAnim === 'zoom_in') {
                    scaleX *= Math.max(0.0, 1.0 - (1.0 - inProgress) * transIntensity);
                    scaleY *= Math.max(0.0, 1.0 - (1.0 - inProgress) * transIntensity);
                } else if (entryAnim === 'zoom_out') {
                    scaleX *= (1.0 + (1.0 - inProgress) * 0.5 * transIntensity);
                    scaleY *= (1.0 + (1.0 - inProgress) * 0.5 * transIntensity);
                } else if (entryAnim === 'rotate') {
                    rotZ += (1.0 - inProgress) * Math.PI * transIntensity;
                }

                // Exit animation offsets
                if (exitAnim === 'slide_up') {
                    posY -= (1.0 - outProgress) * 1.5 * transIntensity;
                } else if (exitAnim === 'slide_down') {
                    posY += (1.0 - outProgress) * 1.5 * transIntensity;
                } else if (exitAnim === 'slide_left') {
                    posX += (1.0 - outProgress) * 1.5 * transIntensity;
                } else if (exitAnim === 'slide_right') {
                    posX -= (1.0 - outProgress) * 1.5 * transIntensity;
                } else if (exitAnim === 'zoom_in') {
                    scaleX *= Math.max(0.0, 1.0 - (1.0 - outProgress) * transIntensity);
                    scaleY *= Math.max(0.0, 1.0 - (1.0 - outProgress) * transIntensity);
                } else if (exitAnim === 'zoom_out') {
                    scaleX *= (1.0 + (1.0 - outProgress) * 0.5 * transIntensity);
                    scaleY *= (1.0 + (1.0 - outProgress) * 0.5 * transIntensity);
                } else if (exitAnim === 'rotate') {
                    rotZ -= (1.0 - outProgress) * Math.PI * transIntensity;
                }
            }

            const isDraggingThisLayer = isDraggingMeshRef.current && dragLayerIdRef.current === layer.id && !dragContentIdRef.current;
            const isResizingThisLayer = isResizingMeshRef.current && dragLayerIdRef.current === layer.id && !dragContentIdRef.current;

            if (!isDraggingThisLayer && !isResizingThisLayer) {
                group.position.set(posX, posY, posZ);
                group.rotation.set(rotX, rotY, rotZ);
                group.scale.set(scaleX, scaleY, 1);
            }

            if (layer.contents && Array.isArray(layer.contents)) {
                layer.contents.forEach((content, contentIdx) => {
                    const childMesh = group.children.find(child => child.name === content.id);
                    if (!childMesh) return;

                    // Base position, rotation, scale
                    let cPosX = content.position.x || 0;
                    let cPosY = content.position.y || 0;
                    let cPosZ = (content.position.z || 0) + contentIdx * 0.005;
                    let cRotX = 0;
                    let cRotY = 0;
                    let cRotZ = 0;
                    let cScaleX = 1.0;
                    let cScaleY = 1.0;
                    let cFlickerAlpha = 1.0;

                    // Apply component continuous animation if any
                    const cAnimType = content.animationType || 'none';
                    const cSpeed = content.animationSpeed !== undefined ? content.animationSpeed : 1.0;
                    const cIntensity = content.animationIntensity !== undefined ? content.animationIntensity : 1.0;
                    const cT = timeSec * cSpeed;

                    if (cAnimType === 'float') {
                        cPosY += Math.sin(cT) * 0.25 * cIntensity;
                    } else if (cAnimType === 'spin') {
                        cRotZ += cT * 0.5 * cIntensity;
                    } else if (cAnimType === 'pulse') {
                        const cPulseScale = 1.0 + Math.sin(cT) * 0.12 * cIntensity;
                        cScaleX *= cPulseScale;
                        cScaleY *= cPulseScale;
                    } else if (cAnimType === 'swing') {
                        cRotZ += Math.sin(cT) * 0.18 * cIntensity;
                    } else if (cAnimType === 'bounce') {
                        const bounce = Math.abs(Math.sin(cT * 1.5));
                        cPosY += bounce * 0.4 * cIntensity;
                        if (bounce < 0.2) {
                            cScaleY *= (1.0 - (0.2 - bounce) * 0.4 * cIntensity);
                        }
                    } else if (cAnimType === 'wiggle') {
                        cPosX += Math.sin(cT * 5) * 0.05 * cIntensity;
                        cPosY += Math.cos(cT * 6) * 0.05 * cIntensity;
                    } else if (cAnimType === 'wave') {
                        cPosX += Math.sin(cT) * 0.3 * cIntensity;
                        cRotZ += Math.cos(cT) * 0.05 * cIntensity;
                    } else if (cAnimType === 'heartbeat') {
                        let hbScale = 1.0;
                        const subT = cT % (Math.PI * 2);
                        if (subT < 0.3) {
                            hbScale = 1.0 + Math.sin(subT * (Math.PI / 0.3)) * 0.15 * cIntensity;
                        } else if (subT >= 0.4 && subT < 0.7) {
                            hbScale = 1.0 + Math.sin((subT - 0.4) * (Math.PI / 0.3)) * 0.08 * cIntensity;
                        }
                        cScaleX *= hbScale;
                        cScaleY *= hbScale;
                    } else if (cAnimType === 'flicker') {
                        const flickerVal = 0.7 + Math.sin(cT * 8) * 0.3 * cIntensity;
                        cFlickerAlpha = Math.max(0.2, Math.min(1.0, flickerVal));
                    } else if (cAnimType === 'spinY') {
                        cRotY += cT * 0.5 * cIntensity;
                    } else if (cAnimType === 'flipX') {
                        cRotX += cT * 0.5 * cIntensity;
                    }

                    // Compute component level transition opacity
                    let cInProgress = 1.0;
                    let cOutProgress = 1.0;
                    let cAlpha = 1.0;

                    const isPreviewingThisContent = activePreview && activePreview.id === content.id;

                    if (isPreviewingThisContent) {
                        const elapsedMs = Date.now() - activePreview.startTime;
                        const durationMs = (content.transitionDuration ?? 1.0) * 1000;
                        const p = Math.min(1.0, elapsedMs / durationMs);
                        if (activePreview.type === 'entry') {
                            cInProgress = p;
                            cOutProgress = 1.0;
                        } else {
                            cInProgress = 1.0;
                            cOutProgress = 1.0 - p;
                        }
                        if (p >= 1.0) {
                            transitionPreviewRef.current = null;
                        }
                    } else if (kfs.length >= 2) {
                        const progressVal = currentCameraProgressRef.current;
                        const k = progressVal * (kfs.length - 1);

                        if (content.fadeMode === 'show_at_keyframe') {
                            const target = content.fadeInStart ?? 0;
                            const fiStart = Math.max(0, target - 1);
                            const fiEnd = target;
                            const foStart = target;
                            const foEnd = Math.min(kfs.length - 1, target + 1);

                            if (k < fiStart) {
                                cInProgress = 0;
                            } else if (k < fiEnd) {
                                cInProgress = fiEnd === fiStart ? 1.0 : (k - fiStart) / (fiEnd - fiStart);
                            } else {
                                cInProgress = 1.0;
                            }

                            if (k < foStart) {
                                cOutProgress = 1.0;
                            } else if (k < foEnd) {
                                cOutProgress = foEnd === foStart ? 0.0 : 1.0 - (k - foStart) / (foEnd - foStart);
                            } else {
                                cOutProgress = 0;
                            }
                        } else if (content.fadeMode === 'fade_in_from') {
                            const target = content.fadeInStart ?? 0;
                            const fiStart = Math.max(0, target - 1);
                            const fiEnd = target;

                            if (k < fiStart) {
                                cInProgress = 0;
                            } else if (k < fiEnd) {
                                cInProgress = fiEnd === fiStart ? 1.0 : (k - fiStart) / (fiEnd - fiStart);
                            } else {
                                cInProgress = 1.0;
                            }
                            cOutProgress = 1.0;
                        } else if (content.fadeMode === 'fade_out_at') {
                            const target = content.fadeOutStart ?? (kfs.length - 1);
                            const foStart = target;
                            const foEnd = Math.min(kfs.length - 1, target + 1);

                            cInProgress = 1.0;
                            if (k < foStart) {
                                cOutProgress = 1.0;
                            } else if (k < foEnd) {
                                cOutProgress = foEnd === foStart ? 0.0 : 1.0 - (k - foStart) / (foEnd - foStart);
                            } else {
                                cOutProgress = 0;
                            }
                        } else if (content.fadeMode === 'keyframe' || content.fadeMode === 'custom') {
                            const fiStart = content.fadeInStart ?? 0;
                            const fiEnd = content.fadeInEnd ?? 0;
                            const foStart = content.fadeOutStart ?? (kfs.length - 1);
                            const foEnd = content.fadeOutEnd ?? (kfs.length - 1);

                            if (k < fiStart) {
                                cInProgress = 0;
                            } else if (k < fiEnd) {
                                cInProgress = fiEnd === fiStart ? 1.0 : (k - fiStart) / (fiEnd - fiStart);
                            } else {
                                cInProgress = 1.0;
                            }

                            if (k < foStart) {
                                cOutProgress = 1.0;
                            } else if (k < foEnd) {
                                cOutProgress = foEnd === foStart ? 0.0 : 1.0 - (k - foStart) / (foEnd - foStart);
                            } else {
                                cOutProgress = 0;
                            }
                        }

                        // Scale transition progress by duration factor
                        const cDurationFactor = Math.max(0.05, Math.min(1.0, (content.transitionDuration ?? 1.0) / 2.0));
                        cInProgress = Math.min(1.0, cInProgress / cDurationFactor);
                        cOutProgress = Math.max(0.0, 1.0 - (1.0 - cOutProgress) / cDurationFactor);
                    }
                    cAlpha = cInProgress * cOutProgress;

                    // Apply entrance/exit transition animations for component
                    if (content.fadeMode && content.fadeMode !== 'none') {
                        const cEntryAnim = content.entryAnim || 'fade';
                        const cExitAnim = content.exitAnim || 'fade';
                        const transIntensity = content.transitionIntensity ?? 1.0;

                        // Entry animation offsets
                        if (cEntryAnim === 'slide_up') {
                            cPosY -= (1.0 - cInProgress) * 1.5 * transIntensity;
                        } else if (cEntryAnim === 'slide_down') {
                            cPosY += (1.0 - cInProgress) * 1.5 * transIntensity;
                        } else if (cEntryAnim === 'slide_left') {
                            cPosX += (1.0 - cInProgress) * 1.5 * transIntensity;
                        } else if (cEntryAnim === 'slide_right') {
                            cPosX -= (1.0 - cInProgress) * 1.5 * transIntensity;
                        } else if (cEntryAnim === 'zoom_in') {
                            cScaleX *= Math.max(0.0, 1.0 - (1.0 - cInProgress) * transIntensity);
                            cScaleY *= Math.max(0.0, 1.0 - (1.0 - cInProgress) * transIntensity);
                        } else if (cEntryAnim === 'zoom_out') {
                            cScaleX *= (1.0 + (1.0 - cInProgress) * 0.5 * transIntensity);
                            cScaleY *= (1.0 + (1.0 - cInProgress) * 0.5 * transIntensity);
                        } else if (cEntryAnim === 'rotate') {
                            cRotZ += (1.0 - cInProgress) * Math.PI * transIntensity;
                        }

                        // Exit animation offsets
                        if (cExitAnim === 'slide_up') {
                            cPosY -= (1.0 - cOutProgress) * 1.5 * transIntensity;
                        } else if (cExitAnim === 'slide_down') {
                            cPosY += (1.0 - cOutProgress) * 1.5 * transIntensity;
                        } else if (cExitAnim === 'slide_left') {
                            cPosX += (1.0 - cOutProgress) * 1.5 * transIntensity;
                        } else if (cExitAnim === 'slide_right') {
                            cPosX -= (1.0 - cOutProgress) * 1.5 * transIntensity;
                        } else if (cExitAnim === 'zoom_in') {
                            cScaleX *= Math.max(0.0, 1.0 - (1.0 - cOutProgress) * transIntensity);
                            cScaleY *= Math.max(0.0, 1.0 - (1.0 - cOutProgress) * transIntensity);
                        } else if (cExitAnim === 'zoom_out') {
                            cScaleX *= (1.0 + (1.0 - cOutProgress) * 0.5 * transIntensity);
                            cScaleY *= (1.0 + (1.0 - cOutProgress) * 0.5 * transIntensity);
                        } else if (cExitAnim === 'rotate') {
                            cRotZ -= (1.0 - cOutProgress) * Math.PI * transIntensity;
                        }
                    }

                    const isInteractingWithThisContent = (
                        (isDraggingMeshRef.current && dragContentIdRef.current === content.id) ||
                        (isResizingMeshRef.current && dragContentIdRef.current === content.id)
                    ) && dragLayerIdRef.current === layer.id;

                    if (!isInteractingWithThisContent) {
                        childMesh.position.set(cPosX, cPosY, cPosZ);
                        childMesh.rotation.set(cRotX, cRotY, cRotZ);
                        
                        let aspect = 1.0;
                        if (childMesh.userData && childMesh.userData.aspectRatio) {
                            aspect = childMesh.userData.aspectRatio;
                        }
                        
                        childMesh.scale.set(content.scale.x * aspect * cScaleX, content.scale.y * cScaleY, 1);
                    }

                    const baseOpacity = content.opacity ?? 1.0;
                    const combinedAlpha = alpha * cAlpha * cFlickerAlpha * baseOpacity;
                    if (childMesh.material) {
                        childMesh.material.opacity = combinedAlpha;
                        childMesh.material.transparent = true;
                    } else {
                        childMesh.traverse(child => {
                            if (child.isMesh && child.material) {
                                child.material.opacity = combinedAlpha;
                                child.material.transparent = true;
                            }
                        });
                    }
                });
            } else {
                group.traverse(child => {
                    if (child.isMesh && child.material) {
                        child.material.opacity = alpha;
                        child.material.transparent = true;
                    }
                });
            }
        });
    };

    // Render both main viewport and minimap viewport
    const showMinimapRef = useRef(showMinimap);
    useEffect(() => {
        showMinimapRef.current = showMinimap;
    }, [showMinimap]);

    useEffect(() => {
        if (!minimapRendererRef.current || !minimapCanvasRef.current || !minimapCameraRef.current) return;
        
        const resize = () => {
            const canvas = minimapCanvasRef.current;
            if (!canvas) return;
            const w = canvas.parentElement.clientWidth;
            const h = canvas.parentElement.clientHeight;
            
            if (w > 10 && h > 10) {
                minimapCameraRef.current.aspect = w / h;
                minimapCameraRef.current.updateProjectionMatrix();
                minimapRendererRef.current.setSize(w, h);
            }
        };

        const timer1 = setTimeout(resize, 80);
        const timer2 = setTimeout(resize, 320); // Sync after outer layout transition ends
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [minimapSize, showMinimap]);

    const renderBothViewports = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        if (cameraHelperRef.current) {
            cameraHelperRef.current.update();
        }
        if (showMinimapRef.current && minimapRendererRef.current && minimapCameraRef.current) {
            if (minimapControlsRef.current) {
                minimapControlsRef.current.update();
            }
            minimapRendererRef.current.render(sceneRef.current, minimapCameraRef.current);
        }
    };

    const runStandardAnimationLoop = () => {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
        
        const loop = () => {
            animationFrameIdRef.current = requestAnimationFrame(loop);
            
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            if (selectionHelperRef.current) {
                selectionHelperRef.current.update();
            }
            if (selectedLayerIdRef.current && meshesRef.current[selectedLayerIdRef.current] && handlesRef.current && handlesRef.current.length > 0) {
                const group = meshesRef.current[selectedLayerIdRef.current];
                const childMesh = selectedContentIdRef.current ? group.getObjectByName(selectedContentIdRef.current) : null;
                updateHandlesPosition(childMesh || group, handlesRef.current);
            }
            updateClosestKeyframeProgress();
            animateParticles();
            animateLayers();
            
            renderBothViewports();
        };
        
        loop();
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
            renderBothViewports();
            
            if (progress < 1) {
                animationFrameIdRef.current = requestAnimationFrame(animateFocus);
            } else {
                controls.enabled = true;
                controls.update();
                runStandardAnimationLoop();
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

    const handleContextMenuAddText = (initialText = 'Ketik Teks Di Sini') => {
        const newLayerId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const contentId = 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        
        setData(d => {
            const currentLayers = d.config.layers || [];
            const newLayer = {
                id: newLayerId,
                name: `Grup Layer Teks #${currentLayers.length + 1}`,
                visible: true,
                position: { x: 0, y: 0, z: currentLayers.length * -1.5 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: []
            };
            
            const newContent = {
                id: contentId,
                name: 'Komponen Teks',
                type: 'text',
                visible: true,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                text: initialText,
                fontFamily: 'Playfair Display',
                fontSize: 64,
                color: '#E5654B',
                fontWeight: 'normal',
                fontStyle: 'normal',
                dataBinding: null
            };
            newLayer.contents.push(newContent);
            
            const newLayers = [...currentLayers, newLayer];
            const newConfig = { ...d.config, layers: newLayers };
            saveHistoryState(newConfig);
            return {
                ...d,
                config: newConfig
            };
        });
        
        setSelectedLayerId(newLayerId);
        setSelectedContentId(contentId);
    };

    const handleContextMenuDuplicateLayer = (layerId) => {
        const layerToDup = data.config.layers.find(l => l.id === layerId);
        if (!layerToDup) return;
        
        const newLayerId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const duplicatedLayer = {
            ...layerToDup,
            id: newLayerId,
            name: `${layerToDup.name} (Salinan)`,
            position: {
                x: layerToDup.position.x + 0.3,
                y: layerToDup.position.y - 0.3,
                z: layerToDup.position.z
            },
            contents: (layerToDup.contents || []).map(c => {
                const newContentId = 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                return {
                    ...c,
                    id: newContentId
                };
            })
        };
        
        const newLayers = [...data.config.layers, duplicatedLayer];
        saveHistoryState({ ...data.config, layers: newLayers });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: newLayers }
        }));
        setSelectedLayerId(newLayerId);
        setSelectedContentId(null);
    };

    const handleContextMenuMoveLayerZ = (layerId, direction) => {
        const updatedLayers = data.config.layers.map(layer => {
            if (layer.id === layerId) {
                return {
                    ...layer,
                    position: {
                        ...layer.position,
                        z: Math.round((layer.position.z + direction * 0.5) * 10) / 10
                    }
                };
            }
            return layer;
        });
        const newConfig = { ...data.config, layers: updatedLayers };
        saveHistoryState(newConfig);
        setData(d => ({
            ...d,
            config: newConfig
        }));
    };

    const handleContextMenuAddTextUnified = (initialText = 'Ketik Teks Di Sini') => {
        let targetLayerId = selectedLayerId;
        if (!targetLayerId && data.config.layers.length > 0) {
            targetLayerId = data.config.layers[0].id;
        }
        if (targetLayerId) {
            addContentToLayer(targetLayerId, 'text', initialText);
        } else {
            handleContextMenuAddText(initialText);
        }
    };

    const toggleContentVisibility = (layerId, contentId) => {
        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    return {
                        ...layer,
                        contents: (layer.contents || []).map(c => {
                            if (c.id === contentId) {
                                return { ...c, visible: !c.visible };
                            }
                            return c;
                        })
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

    const handleContextMenuMoveContentZ = (layerId, contentId, direction) => {
        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    return {
                        ...layer,
                        contents: (layer.contents || []).map(c => {
                            if (c.id === contentId) {
                                return {
                                    ...c,
                                    position: {
                                        ...c.position,
                                        z: Math.round(((c.position.z || 0) + direction * 0.1) * 10) / 10
                                    }
                                };
                            }
                            return c;
                        })
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

    const configRef = useRef(data.config);
    const currentCameraProgressRef = useRef(0);
    const transitionPreviewRef = useRef(null);

    const triggerTransitionPreview = (id, type) => {
        transitionPreviewRef.current = { id, type, startTime: Date.now() };
    };

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
    }, [data.config.particleType, data.config.particleCount, data.config.particleSpeed]);

    const toggleImmersiveMode = () => {
        const nextImmersive = !isImmersive;
        setIsImmersive(nextImmersive);
        
        if (nextImmersive) {
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch(() => {});
            }
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        }

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 150);
    };

    // Keep isImmersive in sync with native browser fullscreen changes (e.g. Esc key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement;
            if (!isCurrentlyFullscreen && isImmersive) {
                setIsImmersive(false);
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 150);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [isImmersive]);

    // Close File dropdown on clicking elsewhere
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (showFileDropdown && !e.target.closest('.file-menu-dropdown-wrapper')) {
                setShowFileDropdown(false);
            }
        };
        document.addEventListener('pointerdown', handleOutsideClick);
        return () => document.removeEventListener('pointerdown', handleOutsideClick);
    }, [showFileDropdown]);

    // Dispatch resize event when the active sidebar panel changes to recalculate Three.js viewport
    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 150);
        return () => clearTimeout(timer);
    }, [immersiveActivePanel]);

    // Auto open inspector panel when a component or layer settings are activated
    useEffect(() => {
        if (activeLayerSettingsId || activeComponentSettingsInfo) {
            setImmersiveActivePanel('inspector');
        }
    }, [activeLayerSettingsId, activeComponentSettingsInfo]);

    // Close context menu on clicking elsewhere
    useEffect(() => {
        const closeMenu = () => {
            setContextMenu(prev => prev.show ? { ...prev, show: false } : prev);
        };
        window.addEventListener('click', closeMenu);
        window.addEventListener('contextmenu', closeMenu);
        return () => {
            window.removeEventListener('click', closeMenu);
            window.removeEventListener('contextmenu', closeMenu);
        };
    }, []);


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
                if (!isolatedLayerIdRef.current) {
                    resetCameraToDefault();
                }
            }
        }
    }, [selectedLayerId]);

    // Handle exiting focus/isolation mode
    useEffect(() => {
        if (!isolatedLayerId) {
            if (selectedLayerId) {
                const layer = data.config.layers.find(l => l.id === selectedLayerId);
                if (layer) {
                    focusCameraOnLayer(layer);
                }
            } else {
                resetCameraToDefault();
            }
        }
    }, [isolatedLayerId]);

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

        dragContentEndCallbackRef.current = (layerId, contentId, x, y) => {
            setData(d => {
                const updatedLayers = d.config.layers.map(layer => {
                    if (layer.id === layerId) {
                        const updatedContents = (layer.contents || []).map(content => {
                            if (content.id === contentId) {
                                return {
                                    ...content,
                                    position: { ...content.position, x, y }
                                };
                            }
                            return content;
                        });
                        return { ...layer, contents: updatedContents };
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

        resizeContentEndCallbackRef.current = (layerId, contentId, scaleX, scaleY, x, y) => {
            setData(d => {
                const updatedLayers = d.config.layers.map(layer => {
                    if (layer.id === layerId) {
                        const updatedContents = (layer.contents || []).map(content => {
                            if (content.id === contentId) {
                                return {
                                    ...content,
                                    scale: { ...content.scale, x: scaleX, y: scaleY },
                                    position: { ...content.position, x, y }
                                };
                            }
                            return content;
                        });
                        return { ...layer, contents: updatedContents };
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
            link.href = 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Cardo:wght@400;700&family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@700&family=Great+Vibes&family=Herr+Von+Muellerhoff&family=Italiana&family=Lora:ital,wght@0,400;0,700;1,400&family=Marck+Script&family=Montserrat:wght@400;700&family=Niconne&family=Outfit:wght@400;700&family=Pacifico&family=Parisienne&family=Playball&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Pinyon+Script&family=Poppins:wght@400;600;700&family=Prata&family=Rochester&family=Sacramento&family=Satisfy&family=Tangerine:wght@700&display=swap';
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

        // Add Snapping Helper Lines (Garis Bantu)
        const snapLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: false, depthWrite: false });
        
        const verticalGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -50, 0),
            new THREE.Vector3(0, 50, 0)
        ]);
        const verticalGuide = new THREE.Line(verticalGeometry, snapLineMaterial);
        verticalGuide.renderOrder = 999;
        verticalGuide.visible = false;
        threeScene.add(verticalGuide);

        const horizontalGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-50, 0, 0),
            new THREE.Vector3(50, 0, 0)
        ]);
        const horizontalGuide = new THREE.Line(horizontalGeometry, snapLineMaterial);
        horizontalGuide.renderOrder = 999;
        horizontalGuide.visible = false;
        threeScene.add(horizontalGuide);

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

        // Init Minimap Camera
        const minimapCamera = new THREE.PerspectiveCamera(60, 200 / 190, 0.1, 1000);
        minimapCamera.position.set(10, 10, 15);
        minimapCamera.lookAt(0, 0, 0);
        minimapCamera.layers.enable(0); // general layers
        minimapCamera.layers.enable(1); // camera representation layer
        minimapCameraRef.current = minimapCamera;

        // Init Minimap Renderer
        let minimapRenderer = null;
        if (minimapCanvasRef.current) {
            minimapRenderer = new THREE.WebGLRenderer({
                canvas: minimapCanvasRef.current,
                antialias: true,
                alpha: true
            });
            minimapRenderer.setSize(200, 190);
            minimapRenderer.setPixelRatio(window.devicePixelRatio);
            minimapRendererRef.current = minimapRenderer;
        }

        // Init Minimap Controls
        let minimapControls = null;
        if (minimapCanvasRef.current && minimapRenderer) {
            minimapControls = new OrbitControls(minimapCamera, minimapCanvasRef.current);
            minimapControls.enableDamping = true;
            minimapControls.dampingFactor = 0.05;
            minimapControlsRef.current = minimapControls;
        }

        // Init Camera Frustum Helper
        const cameraHelper = new THREE.CameraHelper(camera);
        cameraHelper.layers.set(1); // Only render helper in minimap
        cameraHelper.traverse(child => child.layers.set(1));
        threeScene.add(cameraHelper);
        cameraHelperRef.current = cameraHelper;

        // Bind interactive layer selection click on minimap
        const onMinimapPointerDown = (e) => {
            if (!minimapCanvasRef.current || !minimapCameraRef.current || !minimapRendererRef.current) return;
            const rect = minimapRendererRef.current.domElement.getBoundingClientRect();
            const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
            const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
            
            if (clientX === undefined || clientY === undefined) return;

            const mouse = new THREE.Vector2(
                ((clientX - rect.left) / rect.width) * 2 - 1,
                -((clientY - rect.top) / rect.height) * 2 + 1
            );

            const minimapRaycaster = new THREE.Raycaster();
            minimapRaycaster.setFromCamera(mouse, minimapCameraRef.current);

            const meshes = Object.values(meshesRef.current);
            const intersects = minimapRaycaster.intersectObjects(meshes, true);

            if (intersects.length > 0) {
                let group = intersects[0].object;
                while (group && group.parent !== threeScene) {
                    group = group.parent;
                }
                const layerId = Object.keys(meshesRef.current).find(key => meshesRef.current[key] === group);
                if (layerId) {
                    setSelectedLayerId(layerId);
                    const layer = configRef.current?.layers?.find(l => l.id === layerId);
                    if (layer) {
                        focusCameraOnLayer(layer);
                    }
                }
            }
        };

        if (minimapCanvasRef.current) {
            minimapCanvasRef.current.addEventListener('pointerdown', onMinimapPointerDown);
        }

        // Init particles based on current config setting
        initParticleSystem(threeScene, configRef.current.particleType || 'none');

        // Pointer dragging and resizing variables
        let isDraggingMesh = false;
        let isResizingMesh = false;
        let dragLayerId = null;
        let dragContentId = null;
        let activeHandleIdx = -1;
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        const dragPlane = new THREE.Plane();
        const planeIntersection = new THREE.Vector3();
        const dragOffset = new THREE.Vector3();

        const initialScale = new THREE.Vector3();
        const initialPosition = new THREE.Vector3();
        const initialIntersection = new THREE.Vector3();
        const initialMatrixWorld = new THREE.Matrix4();
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
                        isResizingMeshRef.current = true;
                        dragLayerId = selectedLayerIdRef.current;
                        dragLayerIdRef.current = selectedLayerIdRef.current;
                        dragContentId = selectedContentIdRef.current;
                        dragContentIdRef.current = selectedContentIdRef.current;
                        
                        const childMesh = dragContentId ? mesh.getObjectByName(dragContentId) : null;
                        const targetMesh = childMesh || mesh;
                        
                        activeHandleIdx = handlesRef.current.indexOf(intersectsHandles[0].object);
                        controls.enabled = false;
                        
                        const normal = new THREE.Vector3();
                        camera.getWorldDirection(normal);
                        normal.negate();
                        
                        let planePoint = targetMesh.position;
                        if (childMesh) {
                            planePoint = childMesh.position.clone().applyMatrix4(mesh.matrixWorld);
                        }
                        dragPlane.setFromNormalAndCoplanarPoint(normal, planePoint);
                        
                        if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                            targetMesh.updateMatrixWorld(true);
                            initialScale.copy(targetMesh.scale);
                            initialPosition.copy(targetMesh.position);
                            initialMatrixWorld.copy(targetMesh.matrixWorld);
                            initialIntersection.copy(planeIntersection);
                        }
                        return; // Stop, do not trigger mesh selection or translation dragging
                    }
                }
            }

            // 2. Click mesh for normal select / drag translation (recursive: true since children are inside groups)
            const meshes = Object.entries(meshesRef.current)
                .filter(([layerId]) => {
                    if (isolatedLayerIdRef.current && layerId !== isolatedLayerIdRef.current) {
                        return false;
                    }
                    const layer = configRef.current?.layers?.find(l => l.id === layerId);
                    return !(layer && layer.locked);
                })
                .map(([, mesh]) => mesh);
            const intersects = raycaster.intersectObjects(meshes, true);
            const firstOpaqueIntersect = intersects.find(intersect => isPixelOpaque(intersect));

            if (firstOpaqueIntersect) {
                const hitObj = firstOpaqueIntersect.object;
                let group = hitObj;
                while (group && group.parent !== threeScene) {
                    group = group.parent;
                }
                
                const layerId = Object.keys(meshesRef.current).find(key => meshesRef.current[key] === group);
                
                if (layerId) {
                    const layer = configRef.current?.layers?.find(l => l.id === layerId);
                    const content = layer?.contents?.find(c => c.id === hitObj.name);
                    if (content && content.locked) {
                        return; // Disable drag/selection if component is locked
                    }

                    // Check if it's already selected
                    const isAlreadySelected = (selectedLayerIdRef.current === layerId);

                    // Check for double click / double tap
                    const now = performance.now();
                    const isDoubleClick = (now - lastTapTimeRef.current < 300) && (lastTapObjectRef.current === hitObj);
                    lastTapTimeRef.current = now;
                    lastTapObjectRef.current = hitObj;

                    if (!isAlreadySelected && !isDoubleClick) {
                        // Single click/tap on unselected ornament -> do nothing, let OrbitControls handle it!
                        return;
                    }

                    e.preventDefault();
                    isDraggingMesh = true;
                    isDraggingMeshRef.current = true;
                    dragLayerId = layerId;
                    dragLayerIdRef.current = layerId;
                    dragContentId = hitObj.name;
                    dragContentIdRef.current = hitObj.name;
                    
                    if (selectLayerCallbackRef.current) {
                        selectLayerCallbackRef.current(layerId);
                    }
                    
                    // Automatically select the clicked child content
                    setSelectedContentId(hitObj.name);
                    
                    controls.enabled = false;

                    const normal = new THREE.Vector3();
                    camera.getWorldDirection(normal);
                    normal.negate();

                    if (dragContentId) {
                        const childMesh = group.getObjectByName(dragContentId);
                        if (childMesh) {
                            const worldPos = childMesh.position.clone().applyMatrix4(group.matrixWorld);
                            dragPlane.setFromNormalAndCoplanarPoint(normal, worldPos);
                            
                            if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                                initialPosition.copy(childMesh.position);
                                initialIntersection.copy(planeIntersection);
                            }
                        }
                    } else {
                        dragPlane.setFromNormalAndCoplanarPoint(normal, group.position);
                        if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                            dragOffset.copy(group.position).sub(planeIntersection);
                        }
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

            if (!isDraggingMesh && !isResizingMesh && !spacePressedRef.current && containerRef.current) {
                let hoveredHandle = false;
                if (handlesRef.current && handlesRef.current.length > 0) {
                    const intersectsHandles = raycaster.intersectObjects(handlesRef.current);
                    if (intersectsHandles.length > 0) {
                        hoveredHandle = true;
                        const handleMesh = intersectsHandles[0].object;
                        const handleIdx = handlesRef.current.indexOf(handleMesh);
                        if (handleIdx === 0 || handleIdx === 3) {
                            containerRef.current.style.cursor = 'nwse-resize';
                        } else if (handleIdx === 1 || handleIdx === 2) {
                            containerRef.current.style.cursor = 'nesw-resize';
                        }
                    }
                }

                if (!hoveredHandle) {
                    const sceneMeshes = [];
                    Object.values(meshesRef.current).forEach(group => {
                        group.traverse(child => {
                            if (child.isMesh && child !== selectionHelperRef.current && (!handlesRef.current || !handlesRef.current.includes(child))) {
                                sceneMeshes.push(child);
                            }
                        });
                    });
                    
                    const intersectsMeshes = raycaster.intersectObjects(sceneMeshes);
                    const firstOpaqueIntersect = intersectsMeshes.find(intersect => isPixelOpaque(intersect));
                    if (firstOpaqueIntersect) {
                        containerRef.current.style.cursor = 'pointer';
                    } else {
                        containerRef.current.style.cursor = 'default';
                    }
                }
            }

            // A. Handle resizing mesh via handles
            if (isResizingMesh && dragLayerId && meshesRef.current[dragLayerId]) {
                if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                    const mesh = meshesRef.current[dragLayerId];
                    const childMesh = dragContentId ? mesh.getObjectByName(dragContentId) : null;
                    const targetMesh = childMesh || mesh;
                    
                    const aspect = targetMesh.userData?.aspectRatio || 1;
                    
                    const halfW = 1.5;
                    const halfH = 1.5;
                    
                    const localPoints = [
                        new THREE.Vector3(-halfW, halfH, 0),  // Top-Left (0)
                        new THREE.Vector3(halfW, halfH, 0),   // Top-Right (1)
                        new THREE.Vector3(-halfW, -halfH, 0), // Bottom-Left (2)
                        new THREE.Vector3(halfW, -halfH, 0)   // Bottom-Right (3)
                    ];
                    
                    const oppWorldPos = localPoints[3 - activeHandleIdx].clone().applyMatrix4(initialMatrixWorld);
                    
                    const localX = new THREE.Vector3();
                    const localY = new THREE.Vector3();
                    localX.setFromMatrixColumn(initialMatrixWorld, 0).normalize();
                    localY.setFromMatrixColumn(initialMatrixWorld, 1).normalize();
                    
                    const diagonal = planeIntersection.clone().sub(oppWorldPos);
                    const newWidth = Math.abs(diagonal.dot(localX));
                    const newHeight = Math.abs(diagonal.dot(localY));
                    
                    let newScaleX = newWidth / (3 * aspect);
                    let newScaleY = newHeight / 3;
                    
                    // Maintain aspect ratio if Shift is pressed or if another finger is added anywhere on screen
                    if (e.shiftKey || activeTouchCountRef.current > 1) {
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
                    
                    if (childMesh) {
                        mesh.updateMatrixWorld(true);
                        const localCenter = newCenter.clone().applyMatrix4(mesh.matrixWorld.clone().invert());
                        childMesh.position.copy(localCenter);
                        childMesh.scale.set(newScaleX * aspect, newScaleY, 1);
                    } else {
                        mesh.position.copy(newCenter);
                        mesh.scale.set(newScaleX * aspect, newScaleY, 1);
                    }
                    
                    if (selectionHelperRef.current) {
                        selectionHelperRef.current.update();
                    }
                    if (handlesRef.current && handlesRef.current.length > 0) {
                        updateHandlesPosition(targetMesh, handlesRef.current);
                    }
                }
                return;
            }

            // B. Handle normal translation dragging
            if (!isDraggingMesh || !dragLayerId || !meshesRef.current[dragLayerId]) return;

            if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
                const group = meshesRef.current[dragLayerId];

                if (dragContentId) {
                    const childMesh = group.getObjectByName(dragContentId);
                    if (childMesh) {
                        const delta = planeIntersection.clone().sub(initialIntersection);
                        const localDelta = delta.clone().applyQuaternion(group.quaternion.clone().invert());
                        localDelta.x /= group.scale.x;
                        localDelta.y /= group.scale.y;
                        
                        childMesh.position.x = initialPosition.x + localDelta.x;
                        childMesh.position.y = initialPosition.y + localDelta.y;

                        if (selectionHelperRef.current) {
                            selectionHelperRef.current.update();
                        }
                    }
                } else {
                    const newPos = planeIntersection.clone().add(dragOffset);
                    
                    let snapX = false;
                    let snapY = false;
                    let snappedXVal = newPos.x;
                    let snappedYVal = newPos.y;
                    
                    const SNAP_THRESHOLD = 0.15;
                    
                    const targetsX = [0];
                    const targetsY = [0];
                    
                    Object.entries(meshesRef.current).forEach(([id, otherMesh]) => {
                        if (id !== dragLayerId && otherMesh) {
                            targetsX.push(otherMesh.position.x);
                            targetsY.push(otherMesh.position.y);
                        }
                    });
                    
                    for (const tx of targetsX) {
                        if (Math.abs(newPos.x - tx) < SNAP_THRESHOLD) {
                            snappedXVal = tx;
                            snapX = true;
                            break;
                        }
                    }
                    
                    for (const ty of targetsY) {
                        if (Math.abs(newPos.y - ty) < SNAP_THRESHOLD) {
                            snappedYVal = ty;
                            snapY = true;
                            break;
                        }
                    }
                    
                    group.position.x = snappedXVal;
                    group.position.y = snappedYVal;
                    
                    if (snapX) {
                        verticalGuide.position.x = snappedXVal;
                        verticalGuide.visible = true;
                    } else {
                        verticalGuide.visible = false;
                    }
                    
                    if (snapY) {
                        horizontalGuide.position.y = snappedYVal;
                        horizontalGuide.visible = true;
                    } else {
                        horizontalGuide.visible = false;
                    }
                }
            }
        };

        const onPointerUp = () => {
            if (verticalGuide) verticalGuide.visible = false;
            if (horizontalGuide) horizontalGuide.visible = false;

            if (spacePressedRef.current && containerRef.current) {
                containerRef.current.style.cursor = 'grab';
            }
            
            if (isResizingMesh && dragLayerId && meshesRef.current[dragLayerId]) {
                const mesh = meshesRef.current[dragLayerId];
                const childMesh = dragContentId ? mesh.getObjectByName(dragContentId) : null;
                const targetMesh = childMesh || mesh;
                
                const aspect = targetMesh.userData?.aspectRatio || 1;
                
                const finalScaleX = Math.round((targetMesh.scale.x / aspect) * 100) / 100;
                const finalScaleY = Math.round(targetMesh.scale.y * 100) / 100;
                
                if (childMesh) {
                    const finalPosX = Math.round(childMesh.position.x * 100) / 100;
                    const finalPosY = Math.round(childMesh.position.y * 100) / 100;
                    if (resizeContentEndCallbackRef.current) {
                        resizeContentEndCallbackRef.current(dragLayerId, dragContentId, finalScaleX, finalScaleY, finalPosX, finalPosY);
                    }
                } else {
                    const finalPosX = Math.round(mesh.position.x * 10) / 10;
                    const finalPosY = Math.round(mesh.position.y * 10) / 10;
                    if (resizeEndCallbackRef.current) {
                        resizeEndCallbackRef.current(dragLayerId, finalScaleX, finalScaleY, finalPosX, finalPosY);
                    }
                }
            } else if (isDraggingMesh && dragLayerId && meshesRef.current[dragLayerId]) {
                const group = meshesRef.current[dragLayerId];

                if (dragContentId) {
                    const childMesh = group.getObjectByName(dragContentId);
                    if (childMesh) {
                        const finalLocalX = Math.round(childMesh.position.x * 100) / 100;
                        const finalLocalY = Math.round(childMesh.position.y * 100) / 100;

                        if (dragContentEndCallbackRef.current) {
                            dragContentEndCallbackRef.current(dragLayerId, dragContentId, finalLocalX, finalLocalY);
                        }
                    }
                } else {
                    const finalX = Math.round(group.position.x * 10) / 10;
                    const finalY = Math.round(group.position.y * 10) / 10;

                    if (dragEndCallbackRef.current) {
                        dragEndCallbackRef.current(dragLayerId, finalX, finalY);
                    }
                }
            }
            
            setTimeout(() => {
                isDraggingMesh = false;
                isDraggingMeshRef.current = false;
                isResizingMesh = false;
                isResizingMeshRef.current = false;
                dragLayerId = null;
                dragLayerIdRef.current = null;
                dragContentId = null;
                dragContentIdRef.current = null;
                activeHandleIdx = -1;
                controls.enabled = true;
            }, 50);
        };

        const onDoubleClick = (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            const sceneMeshes = [];
            const meshToLayerMap = {};
            Object.keys(meshesRef.current).forEach(layerId => {
                if (isolatedLayerIdRef.current && layerId !== isolatedLayerIdRef.current) return;
                const layer = configRef.current?.layers?.find(l => l.id === layerId);
                if (layer && layer.locked) return;

                const group = meshesRef.current[layerId];
                group.traverse(child => {
                    if (child.isMesh && child !== selectionHelperRef.current && (!handlesRef.current || !handlesRef.current.includes(child))) {
                        sceneMeshes.push(child);
                        meshToLayerMap[child.uuid] = layerId;
                    }
                });
            });

            const intersects = raycaster.intersectObjects(sceneMeshes);
            const firstOpaqueIntersect = intersects.find(intersect => isPixelOpaque(intersect));
            if (firstOpaqueIntersect) {
                const layerId = meshToLayerMap[firstOpaqueIntersect.object.uuid];
                const layers = configRef.current.layers;
                const layer = layers.find(l => l.id === layerId);
                
                if (layer && layer.contents) {
                    const clickedContentId = firstOpaqueIntersect.object.name;
                    const textContent = layer.contents.find(c => c.id === clickedContentId && c.type === 'text');
                    if (textContent) {
                        const newText = prompt("Ubah Teks Layer:", textContent.text);
                        if (newText !== null && newText !== textContent.text) {
                            const updatedLayers = layers.map(l => {
                                if (l.id === layer.id) {
                                    return {
                                        ...l,
                                        contents: l.contents.map(c => {
                                            if (c.id === textContent.id) {
                                                return { ...c, text: newText };
                                            }
                                            return c;
                                        })
                                    };
                                }
                                return l;
                            });
                            setData('config', { ...data.config, layers: updatedLayers });
                            saveHistoryState({ ...data.config, layers: updatedLayers });
                        }
                    }
                }
            }
        };

        const onContextMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const rect = renderer.domElement.getBoundingClientRect();
            mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            const sceneMeshes = [];
            const meshToLayerMap = {};
            const meshToContentMap = {};
            Object.keys(meshesRef.current).forEach(layerId => {
                if (isolatedLayerIdRef.current && layerId !== isolatedLayerIdRef.current) return;
                const group = meshesRef.current[layerId];
                group.traverse(child => {
                    if (child.isMesh && child !== selectionHelperRef.current && (!handlesRef.current || !handlesRef.current.includes(child))) {
                        sceneMeshes.push(child);
                        meshToLayerMap[child.uuid] = layerId;
                        meshToContentMap[child.uuid] = child.name;
                    }
                });
            });

            const intersects = raycaster.intersectObjects(sceneMeshes);
            let layerId = null;
            let contentId = null;
            if (intersects.length > 0) {
                const hitMesh = intersects[0].object;
                layerId = meshToLayerMap[hitMesh.uuid];
                contentId = meshToContentMap[hitMesh.uuid];
                
                setSelectedLayerId(layerId);
                setSelectedContentId(contentId);
            }

            // Boundary adjustments so context menu doesn't overflow the viewport
            const menuWidth = 224; // w-56 is 14rem = 224px
            const menuHeight = 280; // approximate max height of the context menu
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let x = e.pageX;
            let y = e.pageY;

            if (e.clientX + menuWidth > windowWidth) {
                x = e.pageX - menuWidth;
            }
            if (e.clientY + menuHeight > windowHeight) {
                y = e.pageY - menuHeight;
            }

            setContextMenu({
                show: true,
                x,
                y,
                layerId,
                contentId
            });
        };

        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        renderer.domElement.addEventListener('dblclick', onDoubleClick);
        renderer.domElement.addEventListener('contextmenu', onContextMenu);

        const updateTouchCount = (e) => {
            activeTouchCountRef.current = e.touches ? e.touches.length : 0;
        };
        window.addEventListener('touchstart', updateTouchCount, { passive: true });
        window.addEventListener('touchend', updateTouchCount, { passive: true });
        window.addEventListener('touchcancel', updateTouchCount, { passive: true });

        // Animation Loop
        runStandardAnimationLoop();

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

        // Observe container size changes directly (useful for class toggles, sidebar open/close, etc.)
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Render initial layers
        render3DLayers(data.config.layers);

        return () => {
            window.removeEventListener('touchstart', updateTouchCount);
            window.removeEventListener('touchend', updateTouchCount);
            window.removeEventListener('touchcancel', updateTouchCount);
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (rendererRef.current && rendererRef.current.domElement) {
                rendererRef.current.domElement.removeEventListener('pointerdown', onPointerDown);
                rendererRef.current.domElement.removeEventListener('pointermove', onPointerMove);
                rendererRef.current.domElement.removeEventListener('pointerup', onPointerUp);
                rendererRef.current.domElement.removeEventListener('dblclick', onDoubleClick);
                rendererRef.current.domElement.removeEventListener('contextmenu', onContextMenu);
                rendererRef.current.domElement.remove();
            }
            if (minimapRendererRef.current) {
                minimapRendererRef.current.dispose();
            }
            if (minimapControlsRef.current) {
                minimapControlsRef.current.dispose();
            }
            if (cameraHelperRef.current && sceneRef.current) {
                sceneRef.current.remove(cameraHelperRef.current);
                cameraHelperRef.current.dispose();
            }
            if (minimapCanvasRef.current && onMinimapPointerDown) {
                minimapCanvasRef.current.removeEventListener('pointerdown', onMinimapPointerDown);
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

        // Remove old group meshes that are no longer in layers
        const layerIds = layersList.map(l => l.id);
        Object.keys(meshesRef.current).forEach(id => {
            if (!layerIds.includes(id)) {
                sceneRef.current.remove(meshesRef.current[id]);
                const group = meshesRef.current[id];
                if (group) {
                    group.traverse(child => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                            else child.material.dispose();
                        }
                    });
                }
                delete meshesRef.current[id];
            }
        });

        const textureLoader = new THREE.TextureLoader();

        layersList.forEach((layer, idx) => {
            if (!layer.visible) {
                if (meshesRef.current[layer.id]) {
                    sceneRef.current.remove(meshesRef.current[layer.id]);
                }
                return;
            }

            let group = meshesRef.current[layer.id];
            if (!group) {
                group = new THREE.Group();
                group.name = layer.id;
                sceneRef.current.add(group);
                meshesRef.current[layer.id] = group;
            }

            if (!sceneRef.current.children.includes(group)) {
                sceneRef.current.add(group);
            }

            const listOffset = (layersList.length - 1 - idx) * 0.05;
            group.position.set(layer.position.x, layer.position.y, layer.position.z + listOffset);
            group.rotation.set(
                THREE.MathUtils.degToRad(layer.rotation.x || 0),
                THREE.MathUtils.degToRad(layer.rotation.y || 0),
                THREE.MathUtils.degToRad(layer.rotation.z || 0)
            );
            group.scale.set(layer.scale.x, layer.scale.y, 1);

            const contentIds = (layer.contents || []).map(c => c.id);
            
            const toRemove = [];
            group.children.forEach(child => {
                if (!contentIds.includes(child.name)) {
                    toRemove.push(child);
                }
            });
            toRemove.forEach(child => {
                group.remove(child);
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });

            const geometry = new THREE.PlaneGeometry(3, 3);

            (layer.contents || []).forEach((content, idx) => {
                if (!content.visible) {
                    const existing = group.getObjectByName(content.id);
                    if (existing) {
                        group.remove(existing);
                    }
                    return;
                }

                let childMesh = group.getObjectByName(content.id);
                if (childMesh) {
                    if (content.type === 'text') {
                        if (
                            childMesh.userData.type !== 'text' ||
                            childMesh.userData.text !== content.text ||
                            childMesh.userData.fontFamily !== content.fontFamily ||
                            childMesh.userData.fontSize !== content.fontSize ||
                            childMesh.userData.color !== content.color ||
                            childMesh.userData.fontWeight !== content.fontWeight ||
                            childMesh.userData.fontStyle !== content.fontStyle ||
                            childMesh.userData.textEffect !== content.textEffect ||
                            childMesh.userData.shadowColor !== content.shadowColor ||
                            childMesh.userData.shadowBlur !== content.shadowBlur ||
                            childMesh.userData.shadowOffsetX !== content.shadowOffsetX ||
                            childMesh.userData.shadowOffsetY !== content.shadowOffsetY ||
                            childMesh.userData.glowColor !== content.glowColor ||
                            childMesh.userData.glowBlur !== content.glowBlur ||
                            childMesh.userData.strokeColor !== content.strokeColor ||
                            childMesh.userData.strokeWidth !== content.strokeWidth ||
                            childMesh.userData.secondShadowColor !== content.secondShadowColor ||
                            childMesh.userData.extrusionColor !== content.extrusionColor ||
                            childMesh.userData.extrusionDepth !== content.extrusionDepth ||
                            childMesh.userData.gradientColor !== content.gradientColor
                        ) {
                            if (childMesh.material.map) {
                                childMesh.material.map.dispose();
                            }
                            const newTexture = createTextTexture(content);
                            childMesh.material.map = newTexture;
                            childMesh.material.needsUpdate = true;
                            childMesh.userData = {
                                type: 'text',
                                text: content.text,
                                fontFamily: content.fontFamily,
                                fontSize: content.fontSize,
                                color: content.color,
                                fontWeight: content.fontWeight,
                                fontStyle: content.fontStyle,
                                textEffect: content.textEffect,
                                shadowColor: content.shadowColor,
                                shadowBlur: content.shadowBlur,
                                shadowOffsetX: content.shadowOffsetX,
                                shadowOffsetY: content.shadowOffsetY,
                                glowColor: content.glowColor,
                                glowBlur: content.glowBlur,
                                strokeColor: content.strokeColor,
                                strokeWidth: content.strokeWidth,
                                secondShadowColor: content.secondShadowColor,
                                extrusionColor: content.extrusionColor,
                                extrusionDepth: content.extrusionDepth,
                                gradientColor: content.gradientColor,
                                aspectRatio: newTexture.aspectRatio
                            };
                        }
                    } else {
                        if (childMesh.userData.url !== content.url || childMesh.userData.type === 'text') {
                            if (childMesh.material.map) {
                                childMesh.material.map.dispose();
                            }
                            const newTexture = textureLoader.load(content.url, (tex) => {
                                const rawAspect = tex.image.width / tex.image.height;
                                const aspect = Math.max(0.3, Math.min(3.0, rawAspect));
                                childMesh.scale.set(content.scale.x * aspect, content.scale.y, 1);
                                childMesh.userData.aspectRatio = aspect;
                            });
                            childMesh.material.map = newTexture;
                            childMesh.material.needsUpdate = true;
                            childMesh.userData = { url: content.url, type: content.type };
                        }
                    }

                    childMesh.position.set(
                        content.position.x, 
                        content.position.y, 
                        content.position.z + idx * 0.005
                    );
                    childMesh.rotation.set(
                        THREE.MathUtils.degToRad(content.rotation?.x || 0),
                        THREE.MathUtils.degToRad(content.rotation?.y || 0),
                        THREE.MathUtils.degToRad(content.rotation?.z || 0)
                    );
                    
                    const aspect = childMesh.userData.aspectRatio || 1;
                    childMesh.scale.set(content.scale.x * aspect, content.scale.y, 1);
                } else {
                    let texture;
                    if (content.type === 'text') {
                        texture = createTextTexture(content);
                    } else {
                        texture = textureLoader.load(content.url, (tex) => {
                            const rawAspect = tex.image.width / tex.image.height;
                            const aspect = Math.max(0.3, Math.min(3.0, rawAspect));
                            newMesh.scale.set(content.scale.x * aspect, content.scale.y, 1);
                            newMesh.userData.aspectRatio = aspect;
                        });
                    }

                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                    });

                    const newMesh = new THREE.Mesh(geometry, material);
                    newMesh.name = content.id;
                    newMesh.position.set(
                        content.position.x, 
                        content.position.y, 
                        content.position.z + idx * 0.005
                    );
                    newMesh.rotation.set(
                        THREE.MathUtils.degToRad(content.rotation?.x || 0),
                        THREE.MathUtils.degToRad(content.rotation?.y || 0),
                        THREE.MathUtils.degToRad(content.rotation?.z || 0)
                    );

                    if (content.type === 'text') {
                        const aspect = texture.aspectRatio || 1;
                        newMesh.scale.set(content.scale.x * aspect, content.scale.y, 1);
                        newMesh.userData = {
                            type: 'text',
                            text: content.text,
                            fontFamily: content.fontFamily,
                            fontSize: content.fontSize,
                            color: content.color,
                            fontWeight: content.fontWeight,
                            fontStyle: content.fontStyle,
                            aspectRatio: aspect
                        };
                    } else {
                        newMesh.scale.set(content.scale.x, content.scale.y, 1);
                        newMesh.userData = { url: content.url, type: content.type };
                    }

                    group.add(newMesh);
                }
            });
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
            const layer = configRef.current?.layers?.find(l => l.id === selectedLayerId);
            if (layer && layer.locked) {
                return;
            }
            const mesh = meshesRef.current[selectedLayerId];
            if (mesh && sceneRef.current.children.includes(mesh)) {
                const childMesh = selectedContentId ? mesh.getObjectByName(selectedContentId) : null;
                const targetMesh = childMesh || mesh;

                // Hide outline/BoxHelper if the selected component is locked
                const content = layer.contents?.find(c => c.id === selectedContentId);
                if (content && content.locked) {
                    return;
                }

                // Create selection BoxHelper in theme's highlight color (#E5654B)
                const helper = new THREE.BoxHelper(targetMesh, '#E5654B');
                // Make sure helper renders on top of layers for clear visibility
                helper.material.depthTest = false;
                helper.renderOrder = 999;
                
                sceneRef.current.add(helper);
                selectionHelperRef.current = helper;

                // Create 4 handles at corners for layers or components
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
                
                updateHandlesPosition(targetMesh, handles);
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
    }, [selectedLayerId, selectedContentId, data.config.layers]);

    // Clipboard Paste & Keyboard Shortcuts Setup
    const globalHandlersRef = useRef({});

    const handleGlobalPaste = async (e) => {
        const activeEl = document.activeElement;
        if (activeEl) {
            const isInput = activeEl.tagName === 'INPUT' || 
                            activeEl.tagName === 'TEXTAREA' || 
                            activeEl.tagName === 'SELECT' || 
                            activeEl.isContentEditable;
            if (isInput) return;
        }
        
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        // Debug logs for clipboard content formats and preview
        console.log("=== Clipboard Paste Event ===");
        console.log("Mime Types:", clipboardData.types);
        try {
            for (let type of clipboardData.types) {
                const data = clipboardData.getData(type);
                console.log(`Format: ${type} (Length: ${data.length}) -> Preview:`, data.substring(0, 200));
            }
        } catch (err) {
            console.error("Error reading clipboard data types:", err);
        }
        
        // 1. Check for file items (raw image files pasted, e.g. screenshot, local file)
        const items = clipboardData.items;
        if (items) {
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
                            handleImageAddition(response.data.url, 'upload');
                        }
                    } catch (error) {
                        console.error('Clipboard image paste upload error:', error);
                        alert('Gagal mengunggah gambar dari clipboard.');
                    }
                    return;
                }
            }
        }
        
        // 2. Check for HTML content (Canva and standard browser copy-pastes have HTML format)
        const html = clipboardData.getData('text/html');
        if (html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const img = doc.querySelector('img');
            if (img && img.src) {
                e.preventDefault();
                const imageUrl = img.src;
                
                if (imageUrl.startsWith('data:image/')) {
                    // Base64 upload
                    try {
                        const response = await axios.post('/super-admin/three-d-scenes/upload-asset', {
                            base64: imageUrl
                        });
                        if (response.data.success) {
                            handleImageAddition(response.data.url, 'upload');
                            return;
                        }
                    } catch (error) {
                        console.error('Base64 image upload error:', error);
                    }
                } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                    // URL download on backend (CORS bypass)
                    try {
                        const response = await axios.post('/super-admin/three-d-scenes/upload-asset', {
                            url: imageUrl
                        });
                        if (response.data.success) {
                            handleImageAddition(response.data.url, 'upload');
                            return;
                        }
                    } catch (error) {
                        console.error('URL image upload error:', error);
                        // Fallback to direct loading
                        handleImageAddition(imageUrl, 'upload');
                        return;
                    }
                }
            }
        }
        
        // 3. Check for URL or text in text/plain
        const text = clipboardData.getData('text');
        if (text) {
            const trimmedText = text.trim();
            if (trimmedText.startsWith('http://') || trimmedText.startsWith('https://')) {
                // Check if it is likely an image URL
                const cleanUrl = trimmedText.split('?')[0].split('#')[0];
                const isImage = cleanUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);
                if (isImage) {
                    e.preventDefault();
                    try {
                        const response = await axios.post('/super-admin/three-d-scenes/upload-asset', {
                            url: trimmedText
                        });
                        if (response.data.success) {
                            handleImageAddition(response.data.url, 'upload');
                            return;
                        }
                    } catch (error) {
                        console.error('Plain URL image upload error:', error);
                        handleImageAddition(trimmedText, 'upload');
                        return;
                    }
                }
            }
            
            // If it is just plain text, add it as a new text layer/component!
            if (trimmedText.length > 0) {
                e.preventDefault();
                handleTextAddition(trimmedText);
                return;
            }
        }
    };

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
                closeBgRemover();
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

            // Delete selected layer or content
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                if (selectedContentId) {
                    if (confirm('Hapus komponen terpilih?')) {
                        deleteContentFromLayer(selectedLayerId, selectedContentId);
                    }
                } else if (confirm(`Hapus grup layer "${currentLayer.name}"?`)) {
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

    // Update handlers ref on every render to ensure latest values/closures are captured
    globalHandlersRef.current = {
        paste: handleGlobalPaste,
        keydown: handleKeyDown,
        keyup: handleKeyUp
    };

    useEffect(() => {
        const onPaste = (e) => globalHandlersRef.current.paste?.(e);
        const onKeyDown = (e) => globalHandlersRef.current.keydown?.(e);
        const onKeyUp = (e) => globalHandlersRef.current.keyup?.(e);

        document.addEventListener('paste', onPaste);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('paste', onPaste);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    // 3D Depth Map mappings and interaction handlers
    const mapZToY = (z) => {
        const zMin = -12.0;
        const zMax = 4.0;
        const yMin = 20;
        const yMax = 220;
        const clampedZ = Math.max(zMin, Math.min(zMax, z));
        const ratio = (clampedZ - zMin) / (zMax - zMin);
        return yMax - ratio * (yMax - yMin);
    };

    const mapYToZ = (y) => {
        const zMin = -12.0;
        const zMax = 4.0;
        const yMin = 20;
        const yMax = 220;
        const clampedY = Math.max(yMin, Math.min(yMax, y));
        const ratio = (yMax - clampedY) / (yMax - yMin);
        return Math.round((zMin + ratio * (zMax - zMin)) * 10) / 10;
    };

    const handleDepthPointerDown = (e, layerId) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingLayerId(layerId);
        setSelectedLayerId(layerId);
        setSelectedContentId(null);
        if (depthSvgRef.current) {
            depthSvgRef.current.setPointerCapture(e.pointerId);
        }
    };

    const handleDepthPointerMove = (e) => {
        if (!draggingLayerId || !depthSvgRef.current) return;
        e.preventDefault();
        const rect = depthSvgRef.current.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const scale = 240 / rect.height;
        const svgY = relativeY * scale;
        const nextZ = mapYToZ(svgY);

        const layer = configRef.current?.layers?.find(l => l.id === draggingLayerId);
        if (layer) {
            updateLayerProperty(draggingLayerId, 'position', {
                ...layer.position,
                z: nextZ
            });
        }
    };

    const handleDepthPointerUp = (e) => {
        if (draggingLayerId) {
            if (depthSvgRef.current) {
                depthSvgRef.current.releasePointerCapture(e.pointerId);
            }
            setDraggingLayerId(null);
            saveHistoryState(configRef.current);
        }
    };

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

    const updateContentProperty = (layerId, contentId, property, value) => {
        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    const updatedContents = (layer.contents || []).map(content => {
                        if (content.id === contentId) {
                            // If updating dataBinding of a text component, automatically update text placeholder tags
                            if (property === 'dataBinding') {
                                return { 
                                    ...content, 
                                    dataBinding: value,
                                    text: value ? `{{${value}}}` : content.text
                                };
                            }
                            return { ...content, [property]: value };
                        }
                        return content;
                    });
                    return { ...layer, contents: updatedContents };
                }
                return layer;
            });
            return {
                ...d,
                config: { ...d.config, layers: updatedLayers }
            };
        });
    };

    const applyThemePreset = (preset) => {
        const updatedLayers = data.config.layers.map(layer => {
            const updatedContents = (layer.contents || []).map(content => {
                if (content.type === 'text') {
                    return {
                        ...content,
                        color: preset.textColor
                    };
                }
                return content;
            });
            return {
                ...layer,
                contents: updatedContents
            };
        });

        const newConfig = {
            ...data.config,
            backgroundGradient: preset.gradient,
            particleType: preset.particleType,
            layers: updatedLayers
        };

        saveHistoryState(newConfig);
        setData(d => ({
            ...d,
            config: newConfig
        }));
    };

    const addPresetToScene = (presetUrl, name = 'Album') => {
        let targetLayerId = selectedLayerId;
        if (!targetLayerId && data.config.layers.length > 0) {
            targetLayerId = data.config.layers[data.config.layers.length - 1].id;
        }
        
        if (!targetLayerId) {
            const layerId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const newLayer = {
                id: layerId,
                name: `Grup Layer #${data.config.layers.length + 1}`,
                visible: true,
                position: { x: 0, y: 0, z: data.config.layers.length * -1.5 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: []
            };
            
            const contentId = 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const newContent = {
                id: contentId,
                name: name,
                type: 'image',
                visible: true,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                url: presetUrl
            };
            newLayer.contents.push(newContent);
            
            const newLayers = [...data.config.layers, newLayer];
            saveHistoryState({ ...data.config, layers: newLayers });
            setData(d => ({
                ...d,
                config: { ...d.config, layers: newLayers }
            }));
            setSelectedLayerId(layerId);
            setSelectedContentId(contentId);
        } else {
            const contentId = 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const newContent = {
                id: contentId,
                name: name,
                type: 'image',
                visible: true,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                url: presetUrl
            };
            
            const newLayers = data.config.layers.map(layer => {
                if (layer.id === targetLayerId) {
                    return {
                        ...layer,
                        contents: [...(layer.contents || []), newContent]
                    };
                }
                return layer;
            });
            
            saveHistoryState({ ...data.config, layers: newLayers });
            setData(d => ({
                ...d,
                config: { ...d.config, layers: newLayers }
            }));
            setSelectedLayerId(targetLayerId);
            setSelectedContentId(contentId);
        }
    };

    const addLayerGroup = () => {
        const newLayer = {
            id: 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: `Grup Layer #${data.config.layers.length + 1}`,
            visible: true,
            position: { x: 0, y: 0, z: data.config.layers.length * -1.5 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1 },
            contents: []
        };
        const newLayers = [...data.config.layers, newLayer];
        saveHistoryState({ ...data.config, layers: newLayers });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: newLayers }
        }));
        setSelectedLayerId(newLayer.id);
        setSelectedContentId(null);
    };

    const handleReorderLayers = (draggedId, targetId) => {
        if (draggedId === targetId) return;
        
        setData(d => {
            const layers = [...d.config.layers];
            const draggedIdx = layers.findIndex(l => l.id === draggedId);
            const targetIdx = layers.findIndex(l => l.id === targetId);
            
            if (draggedIdx !== -1 && targetIdx !== -1) {
                const [draggedLayer] = layers.splice(draggedIdx, 1);
                layers.splice(targetIdx, 0, draggedLayer);
                
                const newConfig = { ...d.config, layers };
                saveHistoryState(newConfig);
                return {
                    ...d,
                    config: newConfig
                };
            }
            return d;
        });
    };

    const handleMoveContentToLayer = (srcLayerId, contentId, destLayerId, targetContentId = null) => {
        setData(d => {
            let draggedContent = null;
            
            // Remove from source layer
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === srcLayerId) {
                    const contents = (layer.contents || []).filter(c => {
                        if (c.id === contentId) {
                            draggedContent = c;
                            return false;
                        }
                        return true;
                    });
                    return { ...layer, contents };
                }
                return layer;
            });

            if (!draggedContent) return d;

            // Add to destination layer
            const finalLayers = updatedLayers.map(layer => {
                if (layer.id === destLayerId) {
                    const contents = [...(layer.contents || [])];
                    if (targetContentId) {
                        const targetIdx = contents.findIndex(c => c.id === targetContentId);
                        if (targetIdx !== -1) {
                            contents.splice(targetIdx, 0, draggedContent);
                        } else {
                            contents.push(draggedContent);
                        }
                    } else {
                        contents.push(draggedContent);
                    }
                    return { ...layer, contents };
                }
                return layer;
            });

            const newConfig = { ...d.config, layers: finalLayers };
            saveHistoryState(newConfig);
            return { ...d, config: newConfig };
        });
    };

    const handleMoveContent = (layerId, contentId, direction) => {
        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    const contents = [...(layer.contents || [])];
                    const idx = contents.findIndex(c => c.id === contentId);
                    if (idx !== -1) {
                        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
                        if (newIdx >= 0 && newIdx < contents.length) {
                            const temp = contents[idx];
                            contents[idx] = contents[newIdx];
                            contents[newIdx] = temp;
                            return { ...layer, contents };
                        }
                    }
                }
                return layer;
            });
            const newConfig = { ...d.config, layers: updatedLayers };
            saveHistoryState(newConfig);
            return { ...d, config: newConfig };
        });
    };

    const handleDuplicateContent = (layerId, contentId) => {
        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    const contents = [...(layer.contents || [])];
                    const idx = contents.findIndex(c => c.id === contentId);
                    if (idx !== -1) {
                        const src = contents[idx];
                        const dup = {
                            ...src,
                            id: 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                            name: `${src.name || (src.type === 'text' ? 'Teks' : 'Gambar')} (Copy)`,
                            position: { ...src.position, x: src.position.x + 0.2, y: src.position.y - 0.2 }
                        };
                        contents.splice(idx + 1, 0, dup);
                        return { ...layer, contents };
                    }
                }
                return layer;
            });
            const newConfig = { ...d.config, layers: updatedLayers };
            saveHistoryState(newConfig);
            return { ...d, config: newConfig };
        });
    };

    const addContentToLayer = (layerId, type, urlOrText = null) => {
        const contentId = 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const newContent = {
            id: contentId,
            name: type === 'text' ? 'Komponen Teks' : 'Komponen Gambar',
            type,
            visible: true,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1 }
        };
        if (type === 'text') {
            newContent.text = urlOrText || 'Ketik Teks Di Sini';
            newContent.fontFamily = 'Playfair Display';
            newContent.fontSize = 64;
            newContent.color = '#E5654B';
            newContent.fontWeight = 'normal';
            newContent.fontStyle = 'normal';
            newContent.dataBinding = null;
        } else {
            newContent.url = urlOrText || '/images/placeholder.png';
        }

        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    return {
                        ...layer,
                        contents: [...(layer.contents || []), newContent]
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
        setSelectedContentId(contentId);
    };

    const deleteContentFromLayer = (layerId, contentId) => {
        setData(d => {
            const updatedLayers = d.config.layers.map(layer => {
                if (layer.id === layerId) {
                    return {
                        ...layer,
                        contents: (layer.contents || []).filter(c => c.id !== contentId)
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
        if (selectedContentId === contentId) setSelectedContentId(null);
    };

    const deleteLayer = (id) => {
        const filtered = data.config.layers.filter(l => l.id !== id);
        saveHistoryState({ ...data.config, layers: filtered });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: filtered }
        }));
        if (selectedLayerId === id) {
            setSelectedLayerId(null);
            setSelectedContentId(null);
        }
    };

    const toggleLayerVisibility = (id) => {
        const updated = data.config.layers.map(l => {
            if (l.id === id) return { ...l, visible: !l.visible };
            return l;
        });
        saveHistoryState({ ...data.config, layers: updated });
        setData(d => ({
            ...d,
            config: { ...d.config, layers: updated }
        }));
    };

    const handleImageAddition = (url, type = 'upload') => {
        const currentLayers = configRef.current?.layers || [];
        let targetLayerId = selectedLayerId;
        if (!targetLayerId && currentLayers.length > 0) {
            targetLayerId = currentLayers[0].id;
        }
        
        if (!targetLayerId) {
            const newLayerId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const newLayer = {
                id: newLayerId,
                name: type === 'draw' ? 'Grup Lukisan' : 'Grup Gambar',
                visible: true,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 },
                contents: []
            };
            
            const contentId = 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const newContent = {
                id: contentId,
                name: type === 'text' ? 'Komponen Teks' : 'Komponen Gambar',
                type,
                visible: true,
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1 }
            };
            if (type === 'text') {
                newContent.text = 'Ketik Teks Di Sini';
                newContent.fontFamily = 'Playfair Display';
                newContent.fontSize = 64;
                newContent.color = '#E5654B';
                newContent.fontWeight = 'normal';
                newContent.fontStyle = 'normal';
                newContent.dataBinding = null;
            } else {
                newContent.url = url || '/images/placeholder.png';
            }
            newLayer.contents.push(newContent);
            
            setData(d => {
                const newConfig = { ...d.config, layers: [...(d.config.layers || []), newLayer] };
                saveHistoryState(newConfig);
                return { ...d, config: newConfig };
            });
            
            setSelectedLayerId(newLayerId);
            setSelectedContentId(contentId);
        } else {
            addContentToLayer(targetLayerId, type, url);
            setSelectedLayerId(targetLayerId);
        }
    };

    const handleTextAddition = (text) => {
        const currentLayers = configRef.current?.layers || [];
        let targetLayerId = selectedLayerId;
        if (!targetLayerId && currentLayers.length > 0) {
            targetLayerId = currentLayers[0].id;
        }

        if (!targetLayerId) {
            handleContextMenuAddText(text);
        } else {
            addContentToLayer(targetLayerId, 'text', text);
            setSelectedLayerId(targetLayerId);
        }
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
                handleImageAddition(response.data.url, 'upload');
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
                handleImageAddition(response.data.url, 'draw');
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
                    const hasContent = (layer.contents || []).some(content => content.id === bgRemoverLayer.id);
                    if (hasContent) {
                        const updatedContents = layer.contents.map(content => {
                            if (content.id === bgRemoverLayer.id) {
                                return { ...content, url: response.data.url };
                            }
                            return content;
                        });
                        return { ...layer, contents: updatedContents };
                    }
                    return layer;
                });
                saveHistoryState({ ...data.config, layers: updatedLayers });
                setData(d => ({
                    ...d,
                    config: { ...d.config, layers: updatedLayers }
                }));
                closeBgRemover();
            }
        } catch (error) {
            console.error('Save bg removal error:', error);
            alert('Gagal menyimpan hasil penghapusan latar belakang.');
        } finally {
            setProcessingBgRemoval(false);
        }
    };

    const handleReplaceImage = async (file) => {
        if (!file || !selectedLayer || !selectedContent) return;
        
        setIsReplacingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await axios.post('/super-admin/three-d-scenes/upload-asset', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                const newUrl = response.data.url;
                
                const updatedLayers = data.config.layers.map(layer => {
                    if (layer.id === selectedLayer.id) {
                        const updatedContents = (layer.contents || []).map(content => {
                            if (content.id === selectedContent.id) {
                                return { ...content, url: newUrl };
                            }
                            return content;
                        });
                        return { ...layer, contents: updatedContents };
                    }
                    return layer;
                });
                
                saveHistoryState({ ...data.config, layers: updatedLayers });
                setData(d => ({
                    ...d,
                    config: { ...d.config, layers: updatedLayers }
                }));
            }
        } catch (error) {
            console.error('Replace image error:', error);
            alert('Gagal mengganti gambar.');
        } finally {
            setIsReplacingImage(false);
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
            target: ctr ? { x: ctr.target.x, y: ctr.target.y, z: ctr.target.z } : null,
            transitionDuration: 2.0,
            pauseDuration: 2.0
        };

        const newKeyframes = [...data.config.keyframes, newKeyframe];
        saveHistoryState({ ...data.config, keyframes: newKeyframes });
        setData(d => ({
            ...d,
            config: { ...d.config, keyframes: newKeyframes }
        }));
    };

    const updateKeyframeProperty = (id, property, value) => {
        const newKeyframes = data.config.keyframes.map(kf => {
            if (kf.id === id) {
                return { ...kf, [property]: value };
            }
            return kf;
        });
        saveHistoryState({ ...data.config, keyframes: newKeyframes });
        setData(d => ({
            ...d,
            config: { ...d.config, keyframes: newKeyframes }
        }));
    };

    const updateKeyframeFromCamera = (id) => {
        if (!cameraRef.current) return;
        const cam = cameraRef.current;
        const ctr = controlsRef.current;

        const newKeyframes = data.config.keyframes.map(kf => {
            if (kf.id === id) {
                return {
                    ...kf,
                    position: { x: cam.position.x, y: cam.position.y, z: cam.position.z },
                    rotation: { x: cam.rotation.x, y: cam.rotation.y, z: cam.rotation.z },
                    fov: cam.fov,
                    target: ctr ? { x: ctr.target.x, y: ctr.target.y, z: ctr.target.z } : null
                };
            }
            return kf;
        });

        saveHistoryState({ ...data.config, keyframes: newKeyframes });
        setData(d => ({
            ...d,
            config: { ...d.config, keyframes: newKeyframes }
        }));

        alert('Keyframe berhasil diperbarui dengan koordinat kamera saat ini! 📸');
    };

    const applyCameraPreset = () => {
        const layers = data.config.layers || [];
        if (layers.length === 0) {
            alert('Tidak ada layer grup untuk dijadikan target kamera! Silakan tambahkan minimal 1 layer grup terlebih dahulu.');
            return;
        }

        const sortedLayers = [...layers].sort((a, b) => {
            const az = a.position?.z ?? 0;
            const bz = b.position?.z ?? 0;
            return bz - az;
        });

        const newKeyframes = sortedLayers.map((layer, idx) => {
            const zLayer = layer.position?.z ?? 0;
            let pos = { x: 0, y: 0, z: 0 };
            let rot = { x: 0, y: 0, z: 0 };
            let fov = 75;
            let target = { x: 0, y: 0, z: zLayer };

            if (selectedCameraPreset === 'cinematic_zoom') {
                pos = { x: 0, y: 0, z: zLayer + 8 };
                rot = { x: 0, y: 0, z: 0 };
                fov = 75;
            } else if (selectedCameraPreset === 'orbit_reveal') {
                const sign = idx % 2 === 0 ? 1 : -1;
                pos = { 
                    x: parseFloat((3 * sign).toFixed(2)), 
                    y: parseFloat((1 * sign).toFixed(2)), 
                    z: parseFloat((zLayer + 6).toFixed(2)) 
                };
                const angle = Math.atan2(pos.x, pos.z - zLayer);
                rot = { x: -0.15, y: parseFloat(angle.toFixed(3)), z: 0 };
                fov = 72;
            } else if (selectedCameraPreset === 'drift_pan') {
                const driftAmount = idx % 2 === 0 ? -1.8 : 1.8;
                pos = { 
                    x: parseFloat(driftAmount.toFixed(2)), 
                    y: 0.5, 
                    z: parseFloat((zLayer + 7).toFixed(2)) 
                };
                target = { x: parseFloat((-driftAmount * 0.25).toFixed(2)), y: 0, z: zLayer };
                rot = { x: -0.05, y: parseFloat((driftAmount * 0.05).toFixed(3)), z: 0 };
                fov = 75;
            } else if (selectedCameraPreset === 'dolly_zoom') {
                const segmentProgress = idx / Math.max(1, sortedLayers.length - 1);
                fov = Math.round(45 + segmentProgress * 35);
                const distance = 4 + (1 - segmentProgress) * 7;
                pos = { x: 0, y: 0, z: parseFloat((zLayer + distance).toFixed(2)) };
                rot = { x: 0, y: 0, z: 0 };
            }

            return {
                id: 'kf_preset_' + idx + '_' + Math.random().toString(36).substr(2, 5),
                time: parseFloat((idx / Math.max(1, sortedLayers.length - 1)).toFixed(2)),
                position: pos,
                rotation: rot,
                fov: fov,
                target: target,
                transitionDuration: 2.0,
                pauseDuration: 2.0
            };
        });

        if (newKeyframes.length > 0) {
            const firstKf = newKeyframes[0];
            cameraRef.current.position.set(firstKf.position.x, firstKf.position.y, firstKf.position.z);
            if (controlsRef.current) {
                if (firstKf.target) {
                    controlsRef.current.target.set(firstKf.target.x, firstKf.target.y, firstKf.target.z);
                } else {
                    controlsRef.current.target.set(0, 0, firstKf.position.z - 8);
                }
                controlsRef.current.update();
            }
            cameraRef.current.fov = firstKf.fov;
            cameraRef.current.updateProjectionMatrix();
        }

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
        setIsolatedLayerId(null);
        
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

        const idx = data.config.keyframes.indexOf(kf);
        if (idx !== -1 && data.config.keyframes.length > 1) {
            currentCameraProgressRef.current = idx / (data.config.keyframes.length - 1);
        } else {
            currentCameraProgressRef.current = 0;
        }
    };

    // Play/Animate camera through path of all keyframes
    const playCameraTrajectory = () => {
        const kfs = data.config.keyframes;
        if (kfs.length < 2) {
            alert('Butuh minimal 2 keyframe kamera untuk menganimasikan pergerakan!');
            return;
        }

        setIsolatedLayerId(null);
        setIsPlayingPreview(true);
        if (controlsRef.current) controlsRef.current.enabled = false;

        // Play backsound music
        if (data.config.musicUrl) {
            try {
                if (previewAudioRef.current) {
                    previewAudioRef.current.pause();
                }
                const audio = new Audio(data.config.musicUrl);
                audio.loop = true;
                audio.volume = 0.5;
                audio.play().catch(e => console.log("Audio autoplay prevented", e));
                previewAudioRef.current = audio;
            } catch (e) {
                console.error("Gagal memutar audio preview", e);
            }
        }

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

        // Precompute segments for variable durations
        const segments = [];
        let cumulativeTime = 0;
        for (let i = 0; i < kfs.length - 1; i++) {
            const nextKf = kfs[i + 1];
            const dMove = (nextKf.transitionDuration ?? 2.0) * 1000;
            const dPause = (nextKf.pauseDuration ?? 2.0) * 1000;
            segments.push({
                startIndex: i,
                endIndex: i + 1,
                dMove,
                dPause,
                startTime: cumulativeTime,
                endTime: cumulativeTime + dMove + dPause
            });
            cumulativeTime += dMove + dPause;
        }
        const duration = cumulativeTime;
        const totalSegments = kfs.length - 1;

        const animateCamera = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);

            // Find the active segment
            let activeSegment = null;
            let segmentIndex = 0;
            for (let i = 0; i < segments.length; i++) {
                if (elapsed >= segments[i].startTime && elapsed <= segments[i].endTime) {
                    activeSegment = segments[i];
                    segmentIndex = i;
                    break;
                }
            }
            if (!activeSegment) {
                activeSegment = segments[segments.length - 1];
                segmentIndex = segments.length - 1;
            }

            const elapsedInSegment = elapsed - activeSegment.startTime;
            let segmentProgress = elapsedInSegment < activeSegment.dMove 
                ? (elapsedInSegment / activeSegment.dMove) 
                : 1;

            // Apply smoothstep easing (ease-in-out)
            segmentProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);

            const globalProgress = totalSegments > 0 ? (segmentIndex + segmentProgress) / totalSegments : 1;

            // Interpolate position along Catmull-Rom spline
            const pos = cameraCurve.getPointAt(globalProgress);
            cameraRef.current.position.copy(pos);

            // Interpolate target along Catmull-Rom spline
            if (controlsRef.current) {
                const tar = targetCurve.getPointAt(globalProgress);
                controlsRef.current.target.copy(tar);
            }

            // Interpolate rotation using Quaternions
            const startKf = kfs[segmentIndex];
            const endKf = kfs[Math.min(segmentIndex + 1, kfs.length - 1)];

            if (startKf && endKf) {
                const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(startKf.rotation.x, startKf.rotation.y, startKf.rotation.z));
                const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(endKf.rotation.x, endKf.rotation.y, endKf.rotation.z));
                cameraRef.current.quaternion.copy(qStart).slerp(qEnd, segmentProgress);

                // Interpolate FOV
                cameraRef.current.fov = THREE.MathUtils.lerp(startKf.fov, endKf.fov, segmentProgress);
                cameraRef.current.updateProjectionMatrix();
            }

            // Apply handheld idle/sway camera offset
            const timeSec = elapsed / 1000;
            const swayX = Math.sin(timeSec * 1.5) * 0.03 + Math.cos(timeSec * 0.7) * 0.015;
            const swayY = Math.cos(timeSec * 1.2) * 0.03 + Math.sin(timeSec * 0.9) * 0.015;
            const swayZ = Math.sin(timeSec * 1.0) * 0.02;

            cameraRef.current.position.x += swayX;
            cameraRef.current.position.y += swayY;
            cameraRef.current.position.z += swayZ;

            const swayRotX = Math.sin(timeSec * 1.1) * 0.004;
            const swayRotY = Math.cos(timeSec * 1.4) * 0.004;
            const swayRotZ = Math.sin(timeSec * 0.8) * 0.002;
            const qSway = new THREE.Quaternion().setFromEuler(new THREE.Euler(swayRotX, swayRotY, swayRotZ));
            cameraRef.current.quaternion.multiply(qSway);

            currentCameraProgressRef.current = globalProgress;
            // Render visual updates during preview animation
            animateParticles();
            animateLayers();
            renderBothViewports();

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
        if (previewAudioRef.current) {
            previewAudioRef.current.pause();
            previewAudioRef.current = null;
        }
        if (controlsRef.current && cameraRef.current) {
            // Restore controls target point directly in front of camera along its current direction
            // to align the controls with the camera's current viewport. This prevents camera jumping/freezing.
            const dir = new THREE.Vector3();
            cameraRef.current.getWorldDirection(dir);
            controlsRef.current.target.copy(cameraRef.current.position).addScaledVector(dir, 5);
            controlsRef.current.enabled = true;
            controlsRef.current.update();
        }

        runStandardAnimationLoop();
    }

    const handleVideoExport = async (settings) => {
        const kfs = data.config.keyframes;
        if (kfs.length < 2) {
            alert('Butuh minimal 2 keyframe kamera untuk mengekspor video!');
            return;
        }

        if (isPlayingPreview) {
            stopCameraTrajectory();
        }

        // Setup exporting state
        setIsExporting(true);
        setExportProgress(0);
        exportCancelledRef.current = false;
        setRecordedBytes(0);
        setExportResult(null);
        
        // Pause regular rendering loops
        cancelAnimationFrame(animationFrameIdRef.current);
        if (controlsRef.current) controlsRef.current.enabled = false;

        const FPS = settings?.fps || 60;
        const videoBitsPerSecond = settings?.bitrate || 8000000;
        
        // Precompute segments for variable durations
        const segments = [];
        let cumulativeTime = 0;
        for (let i = 0; i < kfs.length - 1; i++) {
            const nextKf = kfs[i + 1];
            const dMove = (nextKf.transitionDuration ?? 2.0) * 1000;
            const dPause = (nextKf.pauseDuration ?? 2.0) * 1000;
            segments.push({
                startIndex: i,
                endIndex: i + 1,
                dMove,
                dPause,
                startTime: cumulativeTime,
                endTime: cumulativeTime + dMove + dPause
            });
            cumulativeTime += dMove + dPause;
        }
        const duration = cumulativeTime;
        const totalSegments = kfs.length - 1;

        // Splines
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

        // Mix Audio from configuration musicUrl
        let audioCtx = null;
        let dest = null;
        let audio = null;
        let mixedStream = new MediaStream();

        // Capture video track from WebGL Canvas with specified FPS
        const canvas = rendererRef.current.domElement;
        
        // Temporarily adjust pixel ratio for quality
        const originalPixelRatio = rendererRef.current.getPixelRatio();
        let scale = 1.0;
        if (settings?.quality === 'medium') scale = 0.75;
        if (settings?.quality === 'low') scale = 0.5;
        if (settings?.quality === 'ultra') scale = 1.5;

        if (scale !== 1.0) {
            rendererRef.current.setPixelRatio(originalPixelRatio * scale);
            if (sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        }

        const canvasStream = canvas.captureStream(FPS);
        const videoTrack = canvasStream.getVideoTracks()[0];
        mixedStream.addTrack(videoTrack);

        const musicUrl = data.config.musicUrl || '/audio/backsound.mp3';
        let useAudio = false;

        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            audio = new Audio(musicUrl);
            audio.crossOrigin = "anonymous";
            audio.loop = true;
            
            dest = audioCtx.createMediaStreamDestination();
            const source = audioCtx.createMediaElementSource(audio);
            source.connect(dest);
            
            const audioTrack = dest.stream.getAudioTracks()[0];
            if (audioTrack) {
                mixedStream.addTrack(audioTrack);
                useAudio = true;
            }
        } catch (e) {
            console.error("Gagal menginisialisasi audio untuk rekaman, mengekspor video tanpa suara:", e);
        }

        // Initialize MediaRecorder
        let mimeType = 'video/webm;codecs=vp9,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';

        let recorder = null;
        const chunks = [];

        try {
            recorder = new MediaRecorder(mixedStream, { 
                mimeType,
                videoBitsPerSecond: videoBitsPerSecond
            });
        } catch (err) {
            console.warn("MimeType/Bitrate tidak didukung, menggunakan default browser recorder:", err);
            recorder = new MediaRecorder(mixedStream);
        }

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                chunks.push(e.data);
                const currentBytes = chunks.reduce((acc, chunk) => acc + chunk.size, 0);
                setRecordedBytes(currentBytes);
            }
        };

        const cleanUpExport = () => {
            if (audio) {
                audio.pause();
                audio.remove();
            }
            if (audioCtx) {
                audioCtx.close();
            }
            // Restore renderer pixel ratio
            if (scale !== 1.0) {
                rendererRef.current.setPixelRatio(originalPixelRatio);
                if (sceneRef.current && cameraRef.current) {
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                }
            }
            stopCameraTrajectory();
        };

        recorder.onstop = () => {
            if (exportCancelledRef.current) {
                setIsExporting(false);
                chunks.length = 0;
                cleanUpExport();
                return;
            }

            const fileExtension = recorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
            const blob = new Blob(chunks, { type: recorder.mimeType || 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const sizeStr = formatBytes(blob.size);
            const filename = `${data.name || 'Projek-3D'}_ekspor.${fileExtension}`;
            
            setExportResult({ url, sizeStr, filename });

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            cleanUpExport();
        };

        // Start recording with timeslice (every 1 second) to get periodic size updates
        recorder.start(1000);
        if (useAudio && audio) {
            audio.play().catch(e => console.error("Play failed:", e));
        }

        let startTime = null;
        
        const renderFrame = (timestamp) => {
            if (exportCancelledRef.current) {
                if (recorder && recorder.state !== 'inactive') {
                    recorder.stop();
                }
                return;
            }

            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Find the active segment
            let activeSegment = null;
            let segmentIndex = 0;
            for (let i = 0; i < segments.length; i++) {
                if (elapsed >= segments[i].startTime && elapsed <= segments[i].endTime) {
                    activeSegment = segments[i];
                    segmentIndex = i;
                    break;
                }
            }
            if (!activeSegment) {
                activeSegment = segments[segments.length - 1];
                segmentIndex = segments.length - 1;
            }

            const elapsedInSegment = elapsed - activeSegment.startTime;
            let segmentProgress = elapsedInSegment < activeSegment.dMove 
                ? (elapsedInSegment / activeSegment.dMove) 
                : 1;

            // Apply smoothstep easing (ease-in-out)
            segmentProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);

            const globalProgress = totalSegments > 0 ? (segmentIndex + segmentProgress) / totalSegments : 1;

            // Update camera position
            const pos = cameraCurve.getPointAt(globalProgress);
            cameraRef.current.position.copy(pos);

            // Update controls target
            if (controlsRef.current) {
                const tar = targetCurve.getPointAt(globalProgress);
                controlsRef.current.target.copy(tar);
            }

            // Update camera rotation (quaternion slerp)
            const startKf = kfs[segmentIndex];
            const endKf = kfs[Math.min(segmentIndex + 1, kfs.length - 1)];

            if (startKf && endKf) {
                const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(startKf.rotation.x, startKf.rotation.y, startKf.rotation.z));
                const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(endKf.rotation.x, endKf.rotation.y, endKf.rotation.z));
                cameraRef.current.quaternion.copy(qStart).slerp(qEnd, segmentProgress);

                // Update FOV
                cameraRef.current.fov = THREE.MathUtils.lerp(startKf.fov, endKf.fov, segmentProgress);
                cameraRef.current.updateProjectionMatrix();
            }

            // Apply handheld idle/sway camera offset (matching preview perfectly)
            const timeSec = elapsed / 1000;
            const swayX = Math.sin(timeSec * 1.5) * 0.03 + Math.cos(timeSec * 0.7) * 0.015;
            const swayY = Math.cos(timeSec * 1.2) * 0.03 + Math.sin(timeSec * 0.9) * 0.015;
            const swayZ = Math.sin(timeSec * 1.0) * 0.02;

            cameraRef.current.position.x += swayX;
            cameraRef.current.position.y += swayY;
            cameraRef.current.position.z += swayZ;

            const swayRotX = Math.sin(timeSec * 1.1) * 0.004;
            const swayRotY = Math.cos(timeSec * 1.4) * 0.004;
            const swayRotZ = Math.sin(timeSec * 0.8) * 0.002;
            const qSway = new THREE.Quaternion().setFromEuler(new THREE.Euler(swayRotX, swayRotY, swayRotZ));
            cameraRef.current.quaternion.multiply(qSway);

            // Update particles and layers deterministically
            currentCameraProgressRef.current = globalProgress;
            animateLayers(elapsed);
            animateParticles(elapsed);

            // Render current frame
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }

            // Progress tracking
            const percent = Math.round(progress * 100);
            setExportProgress(percent);

            if (progress < 1) {
                animationFrameIdRef.current = requestAnimationFrame(renderFrame);
            } else {
                if (recorder && recorder.state !== 'inactive') {
                    recorder.stop();
                }
            }
        };

        animationFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    const cancelVideoExport = () => {
        exportCancelledRef.current = true;
        setIsExporting(false);
    };

    // 7. Save Scene Form Submit
    const submitForm = (thumbnailUrl = null, redirectAfterSaveUrl = null) => {
        transform((oldData) => ({
            ...oldData,
            thumbnail: thumbnailUrl || oldData.thumbnail,
            redirect_to: redirectAfterSaveUrl || 'edit'
        }));

        const options = {
            onSuccess: () => {
                // Update initial data ref to current data to clear dirty state
                initialDataRef.current = JSON.stringify({
                    name: data.name,
                    config: data.config,
                    is_active: data.is_active
                });
            }
        };

        if (isEdit) {
            put(`/super-admin/three-d-scenes/${scene.id}`, options);
        } else {
            post('/super-admin/three-d-scenes', options);
        }
    };

    const handleSubmit = (e, nameOverride = null, redirectAfterSaveUrl = null) => {
        if (e && e.preventDefault) e.preventDefault();
        
        let finalName = nameOverride || data.name;
        if (!finalName || !finalName.trim()) {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            finalName = `Project - ${dd}-${mm}-${yyyy}`;
        }
        
        if (finalName !== data.name) {
            const generatedSlug = isEdit ? data.slug : finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setData(d => ({
                ...d,
                name: finalName,
                slug: d.slug || generatedSlug
            }));
            
            transform((oldData) => ({
                ...oldData,
                name: finalName,
                slug: oldData.slug || generatedSlug,
                thumbnail: oldData.thumbnail
            }));
        }
        
        // Base64 thumbnail generation of current 3D state
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            const thumbUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.8);
            
            // Upload thumbnail as jpeg
            axios.post('/super-admin/three-d-scenes/upload-asset', {
                base64: thumbUrl
            }).then(response => {
                if (response.data.success) {
                    submitForm(response.data.url, redirectAfterSaveUrl);
                } else {
                    submitForm(null, redirectAfterSaveUrl);
                }
            }).catch(() => {
                submitForm(null, redirectAfterSaveUrl);
            });
        } else {
            submitForm(null, redirectAfterSaveUrl);
        }
    };

    const selectedLayer = data.config.layers.find(l => l.id === selectedLayerId);
    const selectedContent = selectedLayer ? selectedLayer.contents?.find(c => c.id === selectedContentId) : null;

    const handleCloseDrawer = () => {
        setImmersiveActivePanel(null);
        setActiveLayerSettingsId(null);
        setActiveComponentSettingsInfo(null);
    };

    const renderActiveLayerSettings = () => {
        const layer = data.config.layers.find(l => l.id === activeLayerSettingsId);
        if (!layer) return null;

        return (
            <div className="space-y-4">
                {/* Tab Headers */}
                <div className="flex border-b border-white/5 bg-zinc-950 p-1 gap-1 rounded-xl">
                    {[
                        { id: 'position', label: 'Posisi', icon: SlidersHorizontal },
                        { id: 'animation', label: 'Animasi', icon: Play },
                        { id: 'transition', label: 'Transisi', icon: Sparkles }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeSettingsTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveSettingsTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-bold rounded-lg transition ${
                                    isActive 
                                        ? 'bg-[#E5654B] text-white shadow-sm' 
                                        : 'hover:bg-white/5 text-stone-400 hover:text-stone-200'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="space-y-4 text-xs">
                    {activeSettingsTab === 'position' && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="font-bold text-stone-400 text-[10px]">Nama Grup Layer</span>
                                <input
                                    type="text"
                                    value={layer.name || ''}
                                    onChange={e => {
                                        updateLayerProperty(layer.id, 'name', e.target.value);
                                        saveHistoryState(data.config);
                                    }}
                                    className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition"
                                />
                            </div>

                            {/* Z Parallax */}
                            <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                    <span>Kedalaman (Z-axis / Parallax)</span>
                                    <span className="text-[#E5654B]">{layer.position.z}</span>
                                </div>
                                <input 
                                    type="range"
                                    min="-25"
                                    max="5"
                                    step="0.5"
                                    value={layer.position.z}
                                    onChange={e => updateLayerProperty(layer.id, 'position', { ...layer.position, z: parseFloat(e.target.value) })}
                                    onMouseUp={() => saveHistoryState(data.config)}
                                    onTouchEnd={() => saveHistoryState(data.config)}
                                    className="w-full accent-[#E5654B]"
                                />
                            </div>

                            {/* X Axis */}
                            <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                    <span>Geser X (Horizontal)</span>
                                    <span className="text-[#E5654B]">{layer.position.x}</span>
                                </div>
                                <input 
                                    type="range"
                                    min="-8"
                                    max="8"
                                    step="0.2"
                                    value={layer.position.x}
                                    onChange={e => updateLayerProperty(layer.id, 'position', { ...layer.position, x: parseFloat(e.target.value) })}
                                    onMouseUp={() => saveHistoryState(data.config)}
                                    onTouchEnd={() => saveHistoryState(data.config)}
                                    className="w-full accent-[#E5654B]"
                                />
                            </div>

                            {/* Y Axis */}
                            <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                    <span>Geser Y (Vertikal)</span>
                                    <span className="text-[#E5654B]">{layer.position.y}</span>
                                </div>
                                <input 
                                    type="range"
                                    min="-8"
                                    max="8"
                                    step="0.2"
                                    value={layer.position.y}
                                    onChange={e => updateLayerProperty(layer.id, 'position', { ...layer.position, y: parseFloat(e.target.value) })}
                                    onMouseUp={() => saveHistoryState(data.config)}
                                    onTouchEnd={() => saveHistoryState(data.config)}
                                    className="w-full accent-[#E5654B]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                {/* Width Scale */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                        <span>Skala Lebar</span>
                                        <span className="text-[#E5654B]">{layer.scale.x}</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="0.1"
                                        max="10"
                                        step="0.1"
                                        value={layer.scale.x}
                                        onChange={e => updateLayerProperty(layer.id, 'scale', { ...layer.scale, x: parseFloat(e.target.value) })}
                                        onMouseUp={() => saveHistoryState(data.config)}
                                        onTouchEnd={() => saveHistoryState(data.config)}
                                        className="w-full accent-[#E5654B]"
                                    />
                                </div>

                                {/* Height Scale */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                        <span>Skala Tinggi</span>
                                        <span className="text-[#E5654B]">{layer.scale.y}</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="0.1"
                                        max="10"
                                        step="0.1"
                                        value={layer.scale.y}
                                        onChange={e => updateLayerProperty(layer.id, 'scale', { ...layer.scale, y: parseFloat(e.target.value) })}
                                        onMouseUp={() => saveHistoryState(data.config)}
                                        onTouchEnd={() => saveHistoryState(data.config)}
                                        className="w-full accent-[#E5654B]"
                                    />
                                </div>
                            </div>

                            {/* Z Rotation */}
                            <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                    <span>Rotasi Z (Derajat)</span>
                                    <span className="text-[#E5654B]">{layer.rotation?.z || 0}°</span>
                                </div>
                                <input 
                                    type="range"
                                    min="-180"
                                    max="180"
                                    step="5"
                                    value={layer.rotation?.z || 0}
                                    onChange={e => updateLayerProperty(layer.id, 'rotation', { ...layer.rotation, z: parseFloat(e.target.value) })}
                                    onMouseUp={() => saveHistoryState(data.config)}
                                    onTouchEnd={() => saveHistoryState(data.config)}
                                    className="w-full accent-[#E5654B]"
                                />
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'animation' && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] text-stone-400 block font-bold">Gaya Gerak (Continuous Idle Effect)</span>
                                <select
                                    value={layer.animationType || 'none'}
                                    onChange={e => {
                                        updateLayerProperty(layer.id, 'animationType', e.target.value);
                                        saveHistoryState(data.config);
                                    }}
                                    className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B] font-sans"
                                >
                                    <option value="none">Tidak Ada</option>
                                    <option value="float">Melayang (Float)</option>
                                    <option value="spin">Berputar (Spin)</option>
                                    <option value="pulse">Denyut (Pulse)</option>
                                    <option value="swing">Goyang (Swing)</option>
                                    <option value="bounce">Memantul (Bounce)</option>
                                    <option value="wiggle">Bergetar (Wiggle)</option>
                                    <option value="wave">Gelombang (Wave)</option>
                                    <option value="heartbeat">Detak Jantung (Heartbeat)</option>
                                    <option value="flicker">Berkedip (Flicker)</option>
                                    <option value="spinY">Putar 3D - Y (Spin Y)</option>
                                    <option value="flipX">Flip 3D - X (Flip X)</option>
                                </select>
                            </div>

                            {layer.animationType && layer.animationType !== 'none' && (
                                <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 space-y-4">
                                    <div className="space-y-1">
                                        <span className="font-bold text-[10px] text-stone-400">Kecepatan ({(layer.animationSpeed ?? 1.0).toFixed(1)}x)</span>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5.0"
                                            step="0.1"
                                            value={layer.animationSpeed ?? 1.0}
                                            onChange={e => updateLayerProperty(layer.id, 'animationSpeed', parseFloat(e.target.value))}
                                            onMouseUp={() => saveHistoryState(data.config)}
                                            className="w-full accent-[#E5654B]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-bold text-[10px] text-stone-400">Intensitas ({(layer.animationIntensity ?? 1.0).toFixed(1)}x)</span>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5.0"
                                            step="0.1"
                                            value={layer.animationIntensity ?? 1.0}
                                            onChange={e => updateLayerProperty(layer.id, 'animationIntensity', parseFloat(e.target.value))}
                                            onMouseUp={() => saveHistoryState(data.config)}
                                            className="w-full accent-[#E5654B]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeSettingsTab === 'transition' && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] text-stone-400 block font-bold">Tipe Transisi (In/Out)</span>
                                <select
                                    value={layer.fadeMode || 'none'}
                                    onChange={e => {
                                        const mode = e.target.value;
                                        const kfCount = data.config?.keyframes?.length || 0;
                                        const activeKf = kfCount > 0 ? Math.max(0, Math.min(kfCount - 1, Math.round(currentCameraProgressRef.current * (kfCount - 1)))) : 0;
                                        
                                        updateLayerProperty(layer.id, 'fadeMode', mode);
                                        if (mode === 'show_at_keyframe' || mode === 'fade_in_from') {
                                            updateLayerProperty(layer.id, 'fadeInStart', activeKf);
                                        } else if (mode === 'fade_out_at') {
                                            updateLayerProperty(layer.id, 'fadeOutStart', activeKf);
                                        } else if (mode === 'custom' || mode === 'keyframe') {
                                            updateLayerProperty(layer.id, 'fadeInStart', activeKf);
                                            updateLayerProperty(layer.id, 'fadeInEnd', Math.min(kfCount - 1, activeKf + 1));
                                            updateLayerProperty(layer.id, 'fadeOutStart', Math.min(kfCount - 1, activeKf + 2));
                                            updateLayerProperty(layer.id, 'fadeOutEnd', Math.min(kfCount - 1, activeKf + 3));
                                        }
                                        const isExit = mode === 'fade_out_at';
                                        triggerTransitionPreview(layer.id, isExit ? 'exit' : 'entry');
                                        saveHistoryState(data.config);
                                    }}
                                    className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B] font-sans"
                                >
                                    <option value="none">Selalu Muncul</option>
                                    <option value="show_at_keyframe">Muncul di Keyframe Aktif</option>
                                    <option value="fade_in_from">Hanya Muncul (Fade In)</option>
                                    <option value="fade_out_at">Hanya Hilang (Fade Out)</option>
                                    <option value="custom">Kustom (Rentang Keyframe)</option>
                                </select>
                            </div>

                            {layer.fadeMode && layer.fadeMode !== 'none' && (
                                <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 space-y-3">
                                    {data.config.keyframes.length < 2 ? (
                                        <p className="text-[10px] text-[#E5654B] font-bold">Butuh minimal 2 keyframe kamera untuk mengatur transisi.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2.5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Durasi ({(layer.transitionDuration ?? 1.0).toFixed(1)}s)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="3.0"
                                                        step="0.1"
                                                        value={layer.transitionDuration ?? 1.0}
                                                        onChange={e => {
                                                            updateLayerProperty(layer.id, 'transitionDuration', parseFloat(e.target.value));
                                                        }}
                                                        onMouseUp={() => {
                                                            saveHistoryState(data.config);
                                                            const isExit = layer.fadeMode === 'fade_out_at';
                                                            triggerTransitionPreview(layer.id, isExit ? 'exit' : 'entry');
                                                        }}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Intensitas ({(layer.transitionIntensity ?? 1.0).toFixed(1)}x)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="3.0"
                                                        step="0.1"
                                                        value={layer.transitionIntensity ?? 1.0}
                                                        onChange={e => {
                                                            updateLayerProperty(layer.id, 'transitionIntensity', parseFloat(e.target.value));
                                                        }}
                                                        onMouseUp={() => {
                                                            saveHistoryState(data.config);
                                                            const isExit = layer.fadeMode === 'fade_out_at';
                                                            triggerTransitionPreview(layer.id, isExit ? 'exit' : 'entry');
                                                        }}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>

                                            {(layer.fadeMode === 'show_at_keyframe' || layer.fadeMode === 'fade_in_from') && (
                                                <div className="space-y-1">
                                                    <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                    <select
                                                        value={layer.fadeInStart ?? 0}
                                                        onChange={e => {
                                                            const val = parseInt(e.target.value);
                                                            updateLayerProperty(layer.id, 'fadeInStart', val);
                                                            saveHistoryState(data.config);
                                                        }}
                                                        className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                    >
                                                        {data.config.keyframes.map((_, i) => (
                                                            <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {layer.fadeMode === 'fade_out_at' && (
                                                <div className="space-y-1">
                                                    <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                    <select
                                                        value={layer.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                        onChange={e => {
                                                            const val = parseInt(e.target.value);
                                                            updateLayerProperty(layer.id, 'fadeOutStart', val);
                                                            saveHistoryState(data.config);
                                                        }}
                                                        className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                    >
                                                        {data.config.keyframes.map((_, i) => (
                                                            <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {(layer.fadeMode === 'custom' || layer.fadeMode === 'keyframe') && (
                                                <div className="grid grid-cols-2 gap-3 text-[10px]">
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Mulai Muncul</span>
                                                        <select
                                                            value={layer.fadeInStart ?? 0}
                                                            onChange={e => {
                                                                updateLayerProperty(layer.id, 'fadeInStart', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Selesai Muncul</span>
                                                        <select
                                                            value={layer.fadeInEnd ?? 0}
                                                            onChange={e => {
                                                                updateLayerProperty(layer.id, 'fadeInEnd', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Mulai Hilang</span>
                                                        <select
                                                            value={layer.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                            onChange={e => {
                                                                updateLayerProperty(layer.id, 'fadeOutStart', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Selesai Hilang</span>
                                                        <select
                                                            value={layer.fadeOutEnd ?? (data.config.keyframes.length - 1)}
                                                            onChange={e => {
                                                                updateLayerProperty(layer.id, 'fadeOutEnd', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="border-t border-white/5 pt-2 space-y-2">
                                                {(layer.fadeMode === 'show_at_keyframe' || layer.fadeMode === 'fade_in_from' || layer.fadeMode === 'custom' || layer.fadeMode === 'keyframe') && (
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold block">Animasi Masuk</span>
                                                        <select
                                                            value={layer.entryAnim || 'fade'}
                                                            onChange={e => {
                                                                updateLayerProperty(layer.id, 'entryAnim', e.target.value);
                                                                triggerTransitionPreview(layer.id, 'entry');
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            <option value="fade">Memudar</option>
                                                            <option value="slide_up">Geser Naik</option>
                                                            <option value="slide_down">Geser Turun</option>
                                                            <option value="slide_left">Geser Kiri</option>
                                                            <option value="slide_right">Geser Kanan</option>
                                                            <option value="zoom_in">Skala Besar</option>
                                                            <option value="zoom_out">Skala Kecil</option>
                                                            <option value="rotate">Berputar</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {(layer.fadeMode === 'show_at_keyframe' || layer.fadeMode === 'fade_out_at' || layer.fadeMode === 'custom' || layer.fadeMode === 'keyframe') && (
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold block">Animasi Keluar</span>
                                                        <select
                                                            value={layer.exitAnim || 'fade'}
                                                            onChange={e => {
                                                                updateLayerProperty(layer.id, 'exitAnim', e.target.value);
                                                                triggerTransitionPreview(layer.id, 'exit');
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            <option value="fade">Memudar</option>
                                                            <option value="slide_up">Geser Naik</option>
                                                            <option value="slide_down">Geser Turun</option>
                                                            <option value="slide_left">Geser Kiri</option>
                                                            <option value="slide_right">Geser Kanan</option>
                                                            <option value="zoom_in">Skala Besar</option>
                                                            <option value="zoom_out">Skala Kecil</option>
                                                            <option value="rotate">Berputar</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Selesai CTA Button */}
                <div className="pt-2 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (isImmersive) {
                                setImmersiveActivePanel('layers');
                            } else {
                                setActiveTab('layers');
                            }
                            setActiveLayerSettingsId(null);
                            setActiveComponentSettingsInfo(null);
                        }}
                        className="flex-1 py-2.5 bg-zinc-800 border border-white/10 hover:bg-zinc-750 text-stone-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleCloseDrawer}
                        className="flex-1 py-2.5 bg-[#E5654B] hover:bg-[#c24b33] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        );
    };

    const renderActiveComponentSettings = () => {
        const layer = data.config.layers.find(l => l.id === activeComponentSettingsInfo.layerId);
        const content = layer?.contents?.find(c => c.id === activeComponentSettingsInfo.contentId);
        if (!content) return null;

        const isText = content.type === 'text';

        return (
            <div className="space-y-4">
                {/* Tab Headers */}
                <div className="flex border-b border-white/5 bg-zinc-950 p-1 gap-1 rounded-xl">
                    {[
                        { id: 'position', label: 'Posisi', icon: SlidersHorizontal },
                        { id: 'content', label: isText ? 'Teks & Gaya' : 'Gambar', icon: isText ? Type : ImageIcon },
                        { id: 'animation', label: 'Animasi', icon: Sparkles }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeSettingsTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveSettingsTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-bold rounded-lg transition ${
                                    isActive 
                                        ? 'bg-[#E5654B] text-white shadow-sm' 
                                        : 'hover:bg-white/5 text-stone-400 hover:text-stone-200'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="space-y-4 text-xs">
                    {activeSettingsTab === 'position' && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="font-bold text-stone-400 text-[10px]">Nama Komponen</span>
                                <input
                                    type="text"
                                    value={content.name || ''}
                                    onChange={e => {
                                        updateContentProperty(layer.id, content.id, 'name', e.target.value);
                                        saveHistoryState(data.config);
                                    }}
                                    className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Offset X */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                        <span>Offset X</span>
                                        <span className="text-[#E5654B]">{content.position.x}</span>
                                    </div>
                                    <input 
                                        type="range" min="-5" max="5" step="0.1"
                                        value={content.position.x}
                                        onChange={e => updateContentProperty(layer.id, content.id, 'position', { ...content.position, x: parseFloat(e.target.value) })}
                                        onMouseUp={() => saveHistoryState(data.config)}
                                        onTouchEnd={() => saveHistoryState(data.config)}
                                        className="w-full accent-[#E5654B]"
                                    />
                                </div>

                                {/* Offset Y */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                        <span>Offset Y</span>
                                        <span className="text-[#E5654B]">{content.position.y}</span>
                                    </div>
                                    <input 
                                        type="range" min="-5" max="5" step="0.1"
                                        value={content.position.y}
                                        onChange={e => updateContentProperty(layer.id, content.id, 'position', { ...content.position, y: parseFloat(e.target.value) })}
                                        onMouseUp={() => saveHistoryState(data.config)}
                                        onTouchEnd={() => saveHistoryState(data.config)}
                                        className="w-full accent-[#E5654B]"
                                    />
                                </div>
                            </div>

                            {/* Local Z Offset */}
                            <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                    <span>Offset Z (Kedalaman Lokal / Urutan Tumpuk)</span>
                                    <span className="text-[#E5654B]">{content.position.z}</span>
                                </div>
                                <input 
                                    type="range" min="-2" max="2" step="0.1"
                                    value={content.position.z}
                                    onChange={e => updateContentProperty(layer.id, content.id, 'position', { ...content.position, z: parseFloat(e.target.value) })}
                                    onMouseUp={() => saveHistoryState(data.config)}
                                    onTouchEnd={() => saveHistoryState(data.config)}
                                    className="w-full accent-[#E5654B]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Scale X */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                        <span>Skala Lebar</span>
                                        <span className="text-[#E5654B]">{content.scale.x}</span>
                                    </div>
                                    <input 
                                        type="range" min="0.2" max="5" step="0.1"
                                        value={content.scale.x}
                                        onChange={e => updateContentProperty(layer.id, content.id, 'scale', { ...content.scale, x: parseFloat(e.target.value) })}
                                        onMouseUp={() => saveHistoryState(data.config)}
                                        onTouchEnd={() => saveHistoryState(data.config)}
                                        className="w-full accent-[#E5654B]"
                                    />
                                </div>

                                {/* Scale Y */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                        <span>Skala Tinggi</span>
                                        <span className="text-[#E5654B]">{content.scale.y}</span>
                                    </div>
                                    <input 
                                        type="range" min="0.2" max="5" step="0.1"
                                        value={content.scale.y}
                                        onChange={e => updateContentProperty(layer.id, content.id, 'scale', { ...content.scale, y: parseFloat(e.target.value) })}
                                        onMouseUp={() => saveHistoryState(data.config)}
                                        onTouchEnd={() => saveHistoryState(data.config)}
                                        className="w-full accent-[#E5654B]"
                                    />
                                </div>
                            </div>

                            {/* Transparansi / Opacity */}
                            <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                    <span>Transparansi (Opacity)</span>
                                    <span className="text-[#E5654B]">{Math.round((content.opacity ?? 1.0) * 100)}%</span>
                                </div>
                                <input 
                                    type="range" min="0.0" max="1.0" step="0.05"
                                    value={content.opacity ?? 1.0}
                                    onChange={e => updateContentProperty(layer.id, content.id, 'opacity', parseFloat(e.target.value))}
                                    onMouseUp={() => saveHistoryState(data.config)}
                                    onTouchEnd={() => saveHistoryState(data.config)}
                                    className="w-full accent-[#E5654B]"
                                />
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'content' && (
                        <div className="space-y-4">
                            {isText ? (
                                <>
                                    {/* Text Source */}
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-stone-400 block font-bold">Sumber Data Binding</span>
                                        <select
                                            value={content.dataBinding || ''}
                                            onChange={e => {
                                                updateContentProperty(layer.id, content.id, 'dataBinding', e.target.value || null);
                                                saveHistoryState(data.config);
                                            }}
                                            className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                        >
                                            <option value="">Teks Kustom Manual</option>
                                            {Object.entries(DATA_BINDING_LABELS).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-[10px] text-stone-400 block font-bold">Teks</span>
                                        <textarea
                                            value={content.text || ''}
                                            onChange={e => updateContentProperty(layer.id, content.id, 'text', e.target.value)}
                                            onBlur={() => saveHistoryState(data.config)}
                                            rows={2}
                                            className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition resize-none font-sans"
                                            disabled={!!content.dataBinding}
                                        />
                                        {content.dataBinding && (
                                            <p className="text-[9px] text-[#E5654B]">Teks otomatis: {`{{${content.dataBinding}}}`}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Font family */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-stone-400 block font-bold">Font Family</span>
                                            <select
                                                value={content.fontFamily || 'Playfair Display'}
                                                onChange={e => {
                                                    updateContentProperty(layer.id, content.id, 'fontFamily', e.target.value);
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B] font-sans"
                                                style={{ fontFamily: content.fontFamily || 'Playfair Display' }}
                                            >
                                                {AVAILABLE_FONTS.map(font => (
                                                    <option key={font.name} value={font.name} className="text-black bg-white" style={{ fontFamily: font.style }}>
                                                        {font.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Color */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-stone-400 block font-bold">Warna Teks</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <input
                                                    type="color"
                                                    value={content.color || '#E5654B'}
                                                    onChange={e => updateContentProperty(layer.id, content.id, 'color', e.target.value)}
                                                    onBlur={() => saveHistoryState(data.config)}
                                                    className="w-6 h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                />
                                                <span className="font-mono text-[9px] text-stone-450">{content.color || '#E5654B'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* FontSize (Resolution) */}
                                        <div className="space-y-1">
                                            <span className="font-bold text-stone-400 text-[10px]">Resolusi ({content.fontSize || 64}px)</span>
                                            <input
                                                type="range"
                                                min="24"
                                                max="128"
                                                step="4"
                                                value={content.fontSize || 64}
                                                onChange={e => updateContentProperty(layer.id, content.id, 'fontSize', parseInt(e.target.value))}
                                                onMouseUp={() => saveHistoryState(data.config)}
                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                className="w-full accent-[#E5654B]"
                                            />
                                        </div>

                                        {/* Bold/Italic */}
                                        <div className="space-y-1">
                                            <span className="font-bold text-stone-400 text-[10px]">Gaya & Tebal</span>
                                            <div className="flex gap-1.5 mt-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const nextVal = content.fontWeight === 'bold' ? 'normal' : 'bold';
                                                        updateContentProperty(layer.id, content.id, 'fontWeight', nextVal);
                                                        saveHistoryState(data.config);
                                                    }}
                                                    className={`flex-1 py-1 rounded text-[10px] font-bold border transition ${
                                                        content.fontWeight === 'bold'
                                                            ? 'bg-white text-stone-900 border-white font-bold'
                                                            : 'bg-zinc-950 text-stone-300 border-white/10 hover:bg-zinc-905'
                                                    }`}
                                                >
                                                    B
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const nextVal = content.fontStyle === 'italic' ? 'normal' : 'italic';
                                                        updateContentProperty(layer.id, content.id, 'fontStyle', nextVal);
                                                        saveHistoryState(data.config);
                                                    }}
                                                    className={`flex-1 py-1 rounded text-[10px] italic border transition ${
                                                        content.fontStyle === 'italic'
                                                            ? 'bg-white text-stone-900 border-white italic'
                                                            : 'bg-zinc-950 text-stone-300 border-white/10 hover:bg-zinc-905'
                                                    }`}
                                                >
                                                    I
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Effects */}
                                    <div className="space-y-3 border-t border-white/5 pt-3">
                                        <div className="space-y-1">
                                            <span className="font-bold text-stone-400 text-[10px]">Efek Teks</span>
                                            <select
                                                value={content.textEffect || 'none'}
                                                onChange={e => {
                                                    updateContentProperty(layer.id, content.id, 'textEffect', e.target.value);
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B] font-sans"
                                            >
                                                <option value="none">Tanpa Efek</option>
                                                <option value="shadow">Shadow (Bayangan)</option>
                                                <option value="double_shadow">Double Shadow (Bayangan Ganda)</option>
                                                <option value="neon">Neon / Glow (Kustom)</option>
                                                <option value="neon_pink">Neon Pink</option>
                                                <option value="neon_blue">Neon Biru</option>
                                                <option value="outline">Outline (Garis Tepi)</option>
                                                <option value="outline_shadow">Outline & Shadow</option>
                                                <option value="3d">Teks 3D / Extrusion</option>
                                                <option value="gradient_fill">Gradasi Warna</option>
                                            </select>
                                        </div>

                                        {(content.textEffect === 'shadow' || content.textEffect === 'double_shadow' || content.textEffect === 'outline_shadow') && (
                                            <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Bayangan</span>
                                                    <input
                                                        type="color"
                                                        value={content.shadowColor || '#000000'}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'shadowColor', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Blur ({content.shadowBlur ?? 8}px)</span>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="30"
                                                        value={content.shadowBlur ?? 8}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'shadowBlur', parseInt(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Jarak X ({content.shadowOffsetX ?? 4}px)</span>
                                                    <input
                                                        type="range"
                                                        min="-20"
                                                        max="20"
                                                        value={content.shadowOffsetX ?? 4}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'shadowOffsetX', parseInt(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Jarak Y ({content.shadowOffsetY ?? 4}px)</span>
                                                    <input
                                                        type="range"
                                                        min="-20"
                                                        max="20"
                                                        value={content.shadowOffsetY ?? 4}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'shadowOffsetY', parseInt(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {content.textEffect === 'double_shadow' && (
                                            <div className="grid grid-cols-1 gap-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Bayangan Kedua</span>
                                                    <input
                                                        type="color"
                                                        value={content.secondShadowColor || 'rgba(229, 101, 75, 0.3)'}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'secondShadowColor', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {content.textEffect === 'neon' && (
                                            <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Glow</span>
                                                    <input
                                                        type="color"
                                                        value={content.glowColor || content.color || '#E5654B'}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'glowColor', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Blur Glow ({content.glowBlur ?? 20}px)</span>
                                                    <input
                                                        type="range"
                                                        min="5"
                                                        max="50"
                                                        value={content.glowBlur ?? 20}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'glowBlur', parseInt(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {(content.textEffect === 'neon_pink' || content.textEffect === 'neon_blue') && (
                                            <div className="grid grid-cols-1 gap-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Blur Glow ({content.glowBlur ?? 20}px)</span>
                                                    <input
                                                        type="range"
                                                        min="5"
                                                        max="50"
                                                        value={content.glowBlur ?? 20}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'glowBlur', parseInt(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {(content.textEffect === 'outline' || content.textEffect === 'outline_shadow') && (
                                            <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Outline</span>
                                                    <input
                                                        type="color"
                                                        value={content.strokeColor || '#000000'}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'strokeColor', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Ketebalan ({content.strokeWidth ?? 6}px)</span>
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="20"
                                                        value={content.strokeWidth ?? 6}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'strokeWidth', parseInt(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {content.textEffect === '3d' && (
                                            <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Warna 3D</span>
                                                    <input
                                                        type="color"
                                                        value={content.extrusionColor || '#222222'}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'extrusionColor', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Ketebalan ({content.extrusionDepth ?? 8}px)</span>
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="25"
                                                        value={content.extrusionDepth ?? 8}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'extrusionDepth', parseInt(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {content.textEffect === 'gradient_fill' && (
                                            <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Mulai</span>
                                                    <input
                                                        type="color"
                                                        value={content.color || '#E5654B'}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'color', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Selesai</span>
                                                    <input
                                                        type="color"
                                                        value={content.gradientColor || '#ffffff'}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'gradientColor', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Image properties & Replace button */}
                                    <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-3">
                                        <span className="text-[10px] text-stone-400 block font-bold self-start">Aset Gambar</span>
                                        <div className="w-full h-32 bg-stone-900 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                                            <img src={content.url} alt={content.name || 'Image component'} className="max-w-full max-h-full object-contain p-1" />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full mt-1">
                                            <button
                                                type="button"
                                                disabled={isReplacingImage}
                                                onClick={() => {
                                                    setSelectedLayerId(layer.id);
                                                    setSelectedContentId(content.id);
                                                    replaceImageInputRef.current?.click();
                                                }}
                                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2c2c30] hover:bg-[#38383e] disabled:opacity-50 text-white rounded-xl text-[10px] font-bold border border-white/10 transition"
                                            >
                                                <Upload className="w-3.5 h-3.5" />
                                                <span>Ganti Gambar</span>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isReplacingImage}
                                                onClick={() => openBgRemover(content)}
                                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl text-[10px] font-bold transition"
                                            >
                                                <Scissors className="w-3.5 h-3.5" />
                                                <span>Hapus Latar Belakang</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeSettingsTab === 'animation' && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] text-stone-400 block font-bold">Gaya Gerak (Continuous Idle Effect)</span>
                                <select
                                    value={content.animationType || 'none'}
                                    onChange={e => {
                                        updateContentProperty(layer.id, content.id, 'animationType', e.target.value);
                                        saveHistoryState(data.config);
                                    }}
                                    className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B] font-sans"
                                >
                                    <option value="none">Tidak Ada</option>
                                    <option value="float">Melayang (Float)</option>
                                    <option value="spin">Berputar (Spin)</option>
                                    <option value="pulse">Denyut (Pulse)</option>
                                    <option value="swing">Goyang (Swing)</option>
                                    <option value="bounce">Memantul (Bounce)</option>
                                    <option value="wiggle">Bergetar (Wiggle)</option>
                                    <option value="wave">Gelombang (Wave)</option>
                                    <option value="heartbeat">Detak Jantung (Heartbeat)</option>
                                    <option value="flicker">Berkedip (Flicker)</option>
                                    <option value="spinY">Putar 3D - Y (Spin Y)</option>
                                    <option value="flipX">Flip 3D - X (Flip X)</option>
                                </select>
                            </div>

                            {content.animationType && content.animationType !== 'none' && (
                                <div className="bg-zinc-950 p-3.5 rounded-xl border border-white/5 space-y-4">
                                    <div className="space-y-1">
                                        <span className="font-bold text-[10px] text-stone-400">Kecepatan ({(content.animationSpeed ?? 1.0).toFixed(1)}x)</span>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5.0"
                                            step="0.1"
                                            value={content.animationSpeed ?? 1.0}
                                            onChange={e => updateContentProperty(layer.id, content.id, 'animationSpeed', parseFloat(e.target.value))}
                                            onMouseUp={() => saveHistoryState(data.config)}
                                            className="w-full accent-[#E5654B]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-bold text-[10px] text-stone-400">Intensitas ({(content.animationIntensity ?? 1.0).toFixed(1)}x)</span>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5.0"
                                            step="0.1"
                                            value={content.animationIntensity ?? 1.0}
                                            onChange={e => updateContentProperty(layer.id, content.id, 'animationIntensity', parseFloat(e.target.value))}
                                            onMouseUp={() => saveHistoryState(data.config)}
                                            className="w-full accent-[#E5654B]"
                                        />
                                    </div>
                                </div>
                            )}

                            <hr className="border-white/5 my-2" />

                            <div className="space-y-1">
                                <span className="text-[10px] text-stone-400 block font-bold">Tipe Transisi (In/Out)</span>
                                <select
                                    value={content.fadeMode || 'none'}
                                    onChange={e => {
                                        const mode = e.target.value;
                                        const kfCount = data.config?.keyframes?.length || 0;
                                        const activeKf = kfCount > 0 ? Math.max(0, Math.min(kfCount - 1, Math.round(currentCameraProgressRef.current * (kfCount - 1)))) : 0;
                                        
                                        updateContentProperty(layer.id, content.id, 'fadeMode', mode);
                                        if (mode === 'show_at_keyframe' || mode === 'fade_in_from') {
                                            updateContentProperty(layer.id, content.id, 'fadeInStart', activeKf);
                                        } else if (mode === 'fade_out_at') {
                                            updateContentProperty(layer.id, content.id, 'fadeOutStart', activeKf);
                                        } else if (mode === 'custom' || mode === 'keyframe') {
                                            updateContentProperty(layer.id, content.id, 'fadeInStart', activeKf);
                                            updateContentProperty(layer.id, content.id, 'fadeInEnd', Math.min(kfCount - 1, activeKf + 1));
                                            updateContentProperty(layer.id, content.id, 'fadeOutStart', Math.min(kfCount - 1, activeKf + 2));
                                            updateContentProperty(layer.id, content.id, 'fadeOutEnd', Math.min(kfCount - 1, activeKf + 3));
                                        }
                                        const isExit = mode === 'fade_out_at';
                                        triggerTransitionPreview(content.id, isExit ? 'exit' : 'entry');
                                        saveHistoryState(data.config);
                                    }}
                                    className="w-full text-xs p-2.5 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B] font-sans"
                                >
                                    <option value="none">Selalu Muncul</option>
                                    <option value="show_at_keyframe">Muncul di Keyframe Aktif</option>
                                    <option value="fade_in_from">Hanya Muncul (Fade In)</option>
                                    <option value="fade_out_at">Hanya Hilang (Fade Out)</option>
                                    <option value="custom">Kustom (Rentang Keyframe)</option>
                                </select>
                            </div>

                            {content.fadeMode && content.fadeMode !== 'none' && (
                                <div className="bg-zinc-950 p-3 rounded-xl border border-white/5 space-y-3">
                                    {data.config.keyframes.length < 2 ? (
                                        <p className="text-[10px] text-[#E5654B] font-bold">Butuh minimal 2 keyframe kamera untuk mengatur transisi.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2.5">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Durasi ({(content.transitionDuration ?? 1.0).toFixed(1)}s)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="3.0"
                                                        step="0.1"
                                                        value={content.transitionDuration ?? 1.0}
                                                        onChange={e => {
                                                            updateContentProperty(layer.id, content.id, 'transitionDuration', parseFloat(e.target.value));
                                                        }}
                                                        onMouseUp={() => {
                                                            saveHistoryState(data.config);
                                                            const isExit = content.fadeMode === 'fade_out_at';
                                                            triggerTransitionPreview(content.id, isExit ? 'exit' : 'entry');
                                                        }}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Intensitas ({(content.transitionIntensity ?? 1.0).toFixed(1)}x)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="3.0"
                                                        step="0.1"
                                                        value={content.transitionIntensity ?? 1.0}
                                                        onChange={e => {
                                                            updateContentProperty(layer.id, content.id, 'transitionIntensity', parseFloat(e.target.value));
                                                        }}
                                                        onMouseUp={() => {
                                                            saveHistoryState(data.config);
                                                            const isExit = content.fadeMode === 'fade_out_at';
                                                            triggerTransitionPreview(content.id, isExit ? 'exit' : 'entry');
                                                        }}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>

                                            {(content.fadeMode === 'show_at_keyframe' || content.fadeMode === 'fade_in_from') && (
                                                <div className="space-y-1">
                                                    <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                    <select
                                                        value={content.fadeInStart ?? 0}
                                                        onChange={e => {
                                                            const val = parseInt(e.target.value);
                                                            updateContentProperty(layer.id, content.id, 'fadeInStart', val);
                                                            saveHistoryState(data.config);
                                                        }}
                                                        className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                    >
                                                        {data.config.keyframes.map((_, i) => (
                                                            <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {content.fadeMode === 'fade_out_at' && (
                                                <div className="space-y-1">
                                                    <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                    <select
                                                        value={content.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                        onChange={e => {
                                                            const val = parseInt(e.target.value);
                                                            updateContentProperty(layer.id, content.id, 'fadeOutStart', val);
                                                            saveHistoryState(data.config);
                                                        }}
                                                        className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                    >
                                                        {data.config.keyframes.map((_, i) => (
                                                            <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {(content.fadeMode === 'custom' || content.fadeMode === 'keyframe') && (
                                                <div className="grid grid-cols-2 gap-3 text-[10px]">
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Mulai Muncul</span>
                                                        <select
                                                            value={content.fadeInStart ?? 0}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'fadeInStart', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Selesai Muncul</span>
                                                        <select
                                                            value={content.fadeInEnd ?? 0}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'fadeInEnd', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Mulai Hilang</span>
                                                        <select
                                                            value={content.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'fadeOutStart', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold">Selesai Hilang</span>
                                                        <select
                                                            value={content.fadeOutEnd ?? (data.config.keyframes.length - 1)}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'fadeOutEnd', parseInt(e.target.value));
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            {data.config.keyframes.map((_, i) => (
                                                                <option key={i} value={i} className="bg-zinc-900 text-white">Keyframe #{i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="border-t border-white/5 pt-2 space-y-2">
                                                {(content.fadeMode === 'show_at_keyframe' || content.fadeMode === 'fade_in_from' || content.fadeMode === 'custom' || content.fadeMode === 'keyframe') && (
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold block">Animasi Masuk</span>
                                                        <select
                                                            value={content.entryAnim || 'fade'}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'entryAnim', e.target.value);
                                                                triggerTransitionPreview(content.id, 'entry');
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            <option value="fade">Memudar</option>
                                                            <option value="slide_up">Geser Naik</option>
                                                            <option value="slide_down">Geser Turun</option>
                                                            <option value="slide_left">Geser Kiri</option>
                                                            <option value="slide_right">Geser Kanan</option>
                                                            <option value="zoom_in">Skala Besar</option>
                                                            <option value="zoom_out">Skala Kecil</option>
                                                            <option value="rotate">Berputar</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {(content.fadeMode === 'show_at_keyframe' || content.fadeMode === 'fade_out_at' || content.fadeMode === 'custom' || content.fadeMode === 'keyframe') && (
                                                    <div className="space-y-1">
                                                        <span className="text-stone-400 text-[9px] font-bold block">Animasi Keluar</span>
                                                        <select
                                                            value={content.exitAnim || 'fade'}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'exitAnim', e.target.value);
                                                                triggerTransitionPreview(content.id, 'exit');
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                        >
                                                            <option value="fade">Memudar</option>
                                                            <option value="slide_up">Geser Naik</option>
                                                            <option value="slide_down">Geser Turun</option>
                                                            <option value="slide_left">Geser Kiri</option>
                                                            <option value="slide_right">Geser Kanan</option>
                                                            <option value="zoom_in">Skala Besar</option>
                                                            <option value="zoom_out">Skala Kecil</option>
                                                            <option value="rotate">Berputar</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Selesai CTA Button */}
                <div className="pt-2 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (isImmersive) {
                                setImmersiveActivePanel('layers');
                            } else {
                                setActiveTab('layers');
                            }
                            setActiveLayerSettingsId(null);
                            setActiveComponentSettingsInfo(null);
                        }}
                        className="flex-1 py-2.5 bg-zinc-800 border border-white/10 hover:bg-zinc-750 text-stone-300 text-xs font-bold rounded-xl transition font-sans flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleCloseDrawer}
                        className="flex-1 py-2.5 bg-[#E5654B] hover:bg-[#c24b33] text-white text-xs font-bold rounded-xl transition font-sans cursor-pointer"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        );
    };


    return (
        <SuperAdminLayout title={isEdit ? `Edit Scene: ${scene.name}` : "Buat Scene 3D"}>
            <Head title={isEdit ? `Edit Scene: ${scene.name} - Super Admin` : "Buat Scene 3D - Super Admin"} />

            {/* Dynamic CSS override to achieve absolute edge-to-edge full screen on PC and tablet */}
            <style dangerouslySetInnerHTML={{
                __html: isImmersive ? `
                    /* Completely hide core layout elements */
                    aside, 
                    header, 
                    nav.lg\\:hidden,
                    nav.fixed { 
                        display: none !important; 
                    }
                    
                    /* Force main wrapper to occupy the entire screen without padding or boundaries */
                    main { 
                        padding: 0 !important; 
                        margin: 0 !important; 
                        max-width: none !important; 
                        width: 100vw !important;
                        height: 100vh !important;
                        min-height: 100vh !important;
                        overflow: hidden !important;
                        background-color: #151518 !important;
                    }
                    
                    /* Lock scrollbars to avoid bounce/glitches on tab/desktop viewports */
                    body, html {
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                    }
                ` : `
                    body, html {
                        overflow: hidden !important;
                        height: 100vh !important;
                    }
                    main {
                        overflow: hidden !important;
                        height: calc(100vh - 64px) !important;
                    }
                    @media (max-width: 1023px) {
                        main {
                            height: calc(100vh - 56px) !important;
                        }
                    }
                `
            }} />

            <div className={isImmersive 
                ? "fixed inset-0 w-screen h-screen z-40 bg-[#151518] flex flex-col overflow-hidden select-none font-sans file-menu-container"
                : "relative w-full h-[calc(100vh-152px)] lg:h-[calc(100vh-128px)] z-10 bg-[#151518] flex flex-col overflow-hidden rounded-3xl select-none font-sans file-menu-container border border-white/10 shadow-2xl"
            }>
                {/* 1. Canva-style Top Header */}
                <div className="editor-top-bar h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-50 text-white select-none relative">
                    {/* Left section: Home, File menu */}
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/super-admin/three-d-scenes"
                            className="p-1.5 bg-stone-950 hover:bg-stone-900 text-stone-300 hover:text-white rounded-lg transition-all border border-white/5 shadow flex items-center justify-center"
                            title="Kembali ke Daftar Scene"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="h-5 w-px bg-zinc-800" />
                        
                        {/* File Menu Dropdown Trigger */}
                        <div className="relative file-menu-dropdown-wrapper">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFileDropdown(!showFileDropdown);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-800 rounded-lg text-sm font-semibold transition"
                            >
                                <span>File</span>
                                <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showFileDropdown ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Dropdown Options */}
                            {showFileDropdown && (
                                <div className="absolute left-0 mt-2 w-56 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5 backdrop-blur-md">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowFileDropdown(false);
                                            handleSubmit();
                                        }}
                                        disabled={processing}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-zinc-800 text-left text-xs font-medium text-white transition disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 text-emerald-500" />
                                        <div>
                                            <p className="font-semibold text-stone-200">Simpan Scene</p>
                                            <p className="text-[10px] text-stone-400">Simpan perubahan ke cloud</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowFileDropdown(false);
                                            setShowShortcutsModal(true);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-zinc-800 text-left text-xs font-medium text-white transition"
                                    >
                                        <HelpCircle className="w-4 h-4 text-blue-400" />
                                        <div>
                                            <p className="font-semibold text-stone-200">Shortcut Keyboard</p>
                                            <p className="text-[10px] text-stone-400">Lihat tombol pintas editor</p>
                                        </div>
                                    </button>
                                    <div className="h-px bg-zinc-800 my-1" />
                                    <Link
                                        href="/super-admin/three-d-scenes"
                                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-500/10 text-left text-xs font-medium text-red-450 transition"
                                    >
                                        <ArrowLeft className="w-4 h-4 text-red-400" />
                                        <div>
                                            <p className="font-semibold text-red-400">Keluar ke Dashboard</p>
                                            <p className="text-[10px] text-red-400/70">Kembali ke daftar scene</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center Section: Project Title Input & Save Status */}
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={data.name}
                            onChange={handleNameChange}
                            placeholder="Nama Project"
                            className="bg-transparent border border-transparent hover:border-zinc-850 focus:border-[#E5654B] focus:bg-zinc-950/80 text-white font-bold text-sm px-3 py-1.5 rounded-lg transition-all focus:outline-none w-64 text-center text-ellipsis font-sans"
                        />
                        <div className="h-4 w-px bg-zinc-800" />
                        <div className="flex items-center gap-1.5 text-xs select-none">
                            {processing ? (
                                <span className="text-stone-400 flex items-center gap-1.5 animate-pulse font-sans">
                                    <svg className="animate-spin h-3.5 w-3.5 text-stone-455" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : (initialDataRef.current && initialDataRef.current !== JSON.stringify({
                                name: data.name,
                                config: data.config,
                                is_active: data.is_active
                            })) ? (
                                <span className="text-amber-400 flex items-center gap-1.5 font-sans">
                                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                                    Belum disimpan
                                </span>
                            ) : (
                                <span className="text-green-400 flex items-center gap-1.5 font-sans">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Perubahan disimpan
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Undo, Redo, Save, Preview, Export, Fullscreen */}
                    <div className="flex items-center gap-2">
                        {/* Undo / Redo */}
                        <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-850">
                            <button
                                type="button"
                                onClick={handleEditorUndo}
                                className="p-1.5 hover:bg-zinc-855 text-stone-300 hover:text-white rounded-md transition"
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleEditorRedo}
                                className="p-1.5 hover:bg-zinc-855 text-stone-300 hover:text-white rounded-md transition"
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            disabled={processing}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 shadow-sm font-sans cursor-pointer ${
                                (initialDataRef.current && initialDataRef.current !== JSON.stringify({
                                    name: data.name,
                                    config: data.config,
                                    is_active: data.is_active
                                }))
                                    ? 'bg-[#E5654B] hover:bg-[#c24b33] text-white animate-pulse'
                                    : 'bg-zinc-950 border border-zinc-805 hover:bg-zinc-900 text-stone-300 hover:text-white disabled:opacity-50'
                            }`}
                            title="Simpan Perubahan ke Cloud (Ctrl+S)"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                        </button>
                        
                        <div className="h-5 w-px bg-zinc-800 mx-1" />

                        {/* Present / Play Trajectory */}
                        {data.config.keyframes.length > 0 && (
                            <button
                                type="button"
                                onClick={isPlayingPreview ? stopCameraTrajectory : playCameraTrajectory}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm font-sans ${
                                    isPlayingPreview
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                        : 'bg-zinc-950 border border-zinc-805 hover:bg-zinc-900 text-white'
                                }`}
                            >
                                {isPlayingPreview ? (
                                    <>
                                        <Pause className="w-3.5 h-3.5 fill-white text-white" />
                                        <span>Stop Preview</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                                        <span>Preview</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Export Video */}
                        {data.config.keyframes.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowExportConfig(true)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm font-sans"
                            >
                                <Camera className="w-3.5 h-3.5 text-white" />
                                <span>Ekspor Video (MP4)</span>
                            </button>
                        )}

                        {/* Fullscreen layout toggle */}
                        <button
                            type="button"
                            onClick={toggleImmersiveMode}
                            className="p-1.5 bg-zinc-950 border border-zinc-805 hover:bg-zinc-900 text-white rounded-lg transition animate-none"
                            title={isImmersive ? "Keluar Full Screen" : "Full Screen"}
                        >
                            {isImmersive ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* 2. Main Workspace Below Header */}
                <div className="flex flex-1 relative w-full overflow-hidden">
                    

                    
                    {/* Canva Sidebar Navigation Rail */}
                    <div className="w-[72px] bg-zinc-950 border-r border-zinc-800/80 flex flex-col items-center py-4 gap-4 z-40 select-none flex-shrink-0">
                        
                        {/* Tab Layer Manager */}
                        <button
                            type="button"
                            onClick={() => setImmersiveActivePanel(immersiveActivePanel === 'layers' ? null : 'layers')}
                            className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
                                immersiveActivePanel === 'layers'
                                    ? 'bg-zinc-900 text-[#E5654B] font-bold border-l-2 border-[#E5654B]'
                                    : 'text-stone-400 hover:text-white hover:bg-zinc-909'
                            }`}
                            title="Manajer Layer"
                        >
                            <Layers className="w-5 h-5" />
                            <span className="text-[9px]">Layer</span>
                        </button>

                        {/* Tab Preset Library */}
                        <button
                            type="button"
                            onClick={() => setImmersiveActivePanel(immersiveActivePanel === 'library' ? null : 'library')}
                            className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
                                immersiveActivePanel === 'library'
                                    ? 'bg-zinc-900 text-[#E5654B] font-bold border-l-2 border-[#E5654B]'
                                    : 'text-stone-400 hover:text-white hover:bg-zinc-909'
                            }`}
                            title="Album"
                        >
                            <ImageIcon className="w-5 h-5" />
                            <span className="text-[9px]">Album</span>
                        </button>

                        {/* Tab Keyframes */}
                        <button
                            type="button"
                            onClick={() => setImmersiveActivePanel(immersiveActivePanel === 'keyframes' ? null : 'keyframes')}
                            className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
                                immersiveActivePanel === 'keyframes'
                                    ? 'bg-zinc-900 text-[#E5654B] font-bold border-l-2 border-[#E5654B]'
                                    : 'text-stone-400 hover:text-white hover:bg-zinc-909'
                            }`}
                            title="Keyframe Kamera"
                        >
                            <Camera className="w-5 h-5" />
                            <span className="text-[9px]">Keyframe</span>
                        </button>

                        {/* Tab Settings */}
                        <button
                            type="button"
                            onClick={() => setImmersiveActivePanel(immersiveActivePanel === 'settings' ? null : 'settings')}
                            className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
                                immersiveActivePanel === 'settings'
                                    ? 'bg-zinc-900 text-[#E5654B] font-bold border-l-2 border-[#E5654B]'
                                    : 'text-stone-400 hover:text-white hover:bg-zinc-909'
                            }`}
                            title="Pengaturan Lingkungan"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="text-[9px]">Lingkungan</span>
                        </button>

                        {/* Tab Ruang 3D */}
                        <button
                            type="button"
                            onClick={() => setImmersiveActivePanel(immersiveActivePanel === 'depth' ? null : 'depth')}
                            className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
                                immersiveActivePanel === 'depth'
                                    ? 'bg-zinc-900 text-[#E5654B] font-bold border-l-2 border-[#E5654B]'
                                    : 'text-stone-400 hover:text-white hover:bg-zinc-909'
                            }`}
                            title="Manajer Ruang & Kedalaman 3D"
                        >
                            <Box className="w-5 h-5" />
                            <span className="text-[9px]">Ruang 3D</span>
                        </button>

                        {/* Tab Inspector (Komponen) */}
                        <button
                            type="button"
                            disabled={!selectedLayer}
                            onClick={() => {
                                if (selectedContentId) {
                                    setActiveComponentSettingsInfo({ layerId: selectedLayerId, contentId: selectedContentId });
                                    setActiveSettingsTab('position');
                                } else {
                                    setActiveLayerSettingsId(selectedLayerId);
                                    setActiveSettingsTab('position');
                                }
                                setImmersiveActivePanel(immersiveActivePanel === 'inspector' ? null : 'inspector');
                            }}
                            className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
                                !selectedLayer 
                                    ? 'opacity-30 cursor-not-allowed' 
                                    : immersiveActivePanel === 'inspector'
                                        ? 'bg-zinc-900 text-[#E5654B] font-bold border-l-2 border-[#E5654B]'
                                        : 'text-stone-400 hover:text-white hover:bg-zinc-909'
                            }`}
                            title={selectedContent ? `Komponen: ${selectedContent.name}` : selectedLayer ? `Layer: ${selectedLayer.name}` : "Pilih Layer/Komponen"}
                        >
                            <Edit3 className="w-5 h-5" />
                            <span className="text-[9px]">Komponen</span>
                        </button>
                    </div>

                    {/* Left Docked Sidebar Drawer Panel for Layer Manager */}
                    {immersiveActivePanel === 'layers' && (
                        <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-30 select-none animate-in fade-in slide-in-from-left-4 duration-150 flex-shrink-0">
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-stone-200">Layer Manager ({data.config.layers.length})</span>
                                <button onClick={handleCloseDrawer} className="text-stone-450 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="p-4 flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={addLayerGroup}
                                    className="p-2 bg-zinc-950 border border-white/10 text-white rounded-xl hover:bg-zinc-900 transition flex items-center gap-1 text-[10px] font-bold"
                                    title="Tambah Grup Layer Baru"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Grup Baru</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 pb-4">
                                {data.config.layers.length === 0 ? (
                                    <div className="bg-stone-900/50 border border-white/5 rounded-xl p-4 text-center">
                                        <p className="text-[11px] text-stone-400">Belum ada layer grup. Tambahkan grup layer baru untuk memulai.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                                        {data.config.layers.map(layer => (
                                            <div 
                                                key={layer.id} 
                                                draggable
                                                onDragStart={(e) => { 
                                                    setDraggedLayerId(layer.id); 
                                                    e.dataTransfer.setData('text/plain', layer.id); 
                                                }}
                                                onDragEnd={() => { 
                                                    setDraggedLayerId(null); 
                                                    setDragOverLayerId(null); 
                                                }}
                                                onDragOver={(e) => { 
                                                    e.preventDefault(); 
                                                    if (draggedLayerId && draggedLayerId !== layer.id) { 
                                                        setDragOverLayerId(layer.id); 
                                                    } else if (draggedContentId) {
                                                        setDragOverLayerId(layer.id);
                                                    }
                                                }}
                                                onDragLeave={() => setDragOverLayerId(null)}
                                                onDrop={(e) => { 
                                                    e.preventDefault(); 
                                                    const draggedId = e.dataTransfer.getData('text/plain'); 
                                                    try {
                                                        const dragData = JSON.parse(draggedId);
                                                        if (dragData.contentId) {
                                                            handleMoveContentToLayer(dragData.layerId, dragData.contentId, layer.id);
                                                            setDraggedContentId(null);
                                                            setDraggedContentSourceLayerId(null);
                                                            setDragOverContentId(null);
                                                            setDragOverLayerId(null);
                                                            return;
                                                        }
                                                    } catch (err) {
                                                        handleReorderLayers(draggedId, layer.id);
                                                    }
                                                    setDraggedLayerId(null); 
                                                    setDragOverLayerId(null); 
                                                }}
                                                className={`border rounded-xl overflow-hidden bg-stone-950/40 shadow-sm transition-all duration-150 ${
                                                    dragOverLayerId === layer.id 
                                                        ? 'border-[#E5654B] bg-[#E5654B]/10 scale-[0.98]' 
                                                        : 'border-white/10'
                                                } ${draggedLayerId === layer.id ? 'opacity-40' : ''}`}
                                            >
                                                {/* Group Row */}
                                                <div 
                                                    onClick={() => {
                                                        setSelectedLayerId(layer.id);
                                                        setSelectedContentId(null);
                                                    }}
                                                    className={`flex items-center justify-between p-2 text-[11px] transition cursor-pointer ${
                                                        selectedLayerId === layer.id && selectedContentId === null
                                                            ? 'bg-white/5 border-b border-white/5 text-[#E5654B]'
                                                            : 'hover:bg-white/5 text-stone-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 truncate">
                                                        <Layers className="w-3.5 h-3.5 text-stone-450" />
                                                        <span className="font-bold truncate">{layer.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {/* Settings Action */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedLayerId(layer.id);
                                                                setSelectedContentId(null);
                                                                setActiveLayerSettingsId(layer.id);
                                                                setActiveSettingsTab('position');
                                                            }}
                                                            className="p-1 text-stone-400 hover:text-white rounded transition"
                                                            title="Pengaturan Layer"
                                                        >
                                                            <Settings className="w-3.5 h-3.5" />
                                                        </button>

                                                        {/* Lock Action */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const nextLocked = !layer.locked;
                                                                updateLayerProperty(layer.id, 'locked', nextLocked);
                                                                saveHistoryState(data.config);
                                                                if (nextLocked && selectedLayerId === layer.id) {
                                                                    setSelectedLayerId(null);
                                                                    setSelectedContentId(null);
                                                                }
                                                            }}
                                                            className={`p-1 rounded transition ${layer.locked ? 'text-[#E5654B] hover:text-[#e5654bd0]' : 'text-stone-400 hover:text-white'}`}
                                                            title={layer.locked ? "Buka Kunci Layer" : "Kunci Layer"}
                                                        >
                                                            {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                                        </button>

                                                        {/* Focus Action */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const isCurrentlyIsolated = isolatedLayerId === layer.id;
                                                                if (isCurrentlyIsolated) {
                                                                    setIsolatedLayerId(null);
                                                                } else {
                                                                    setIsolatedLayerId(layer.id);
                                                                    setSelectedLayerId(layer.id);
                                                                    setSelectedContentId(null);
                                                                    focusCameraOnLayer(layer);
                                                                }
                                                            }}
                                                            className={`p-1 rounded transition ${isolatedLayerId === layer.id ? 'text-[#E5654B] bg-[#E5654B]/10 hover:bg-[#E5654B]/20' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}
                                                            title={isolatedLayerId === layer.id ? "Matikan Mode Fokus (Isolasi)" : "Nyalakan Mode Fokus (Isolasi)"}
                                                        >
                                                            <Focus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateLayerProperty(layer.id, 'visible', !layer.visible);
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="p-1 text-stone-400 hover:text-white rounded transition"
                                                        >
                                                            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if(confirm('Hapus grup layer ini?')) {
                                                                    deleteLayer(layer.id);
                                                                }
                                                            }}
                                                            className="p-1 text-stone-400 hover:text-red-450 rounded transition"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Nested content items */}
                                                <div className="bg-stone-900/20 p-1.5 space-y-1 pl-4 border-t border-white/5">
                                                    {layer.contents && layer.contents.map((content, contentIdx) => {
                                                        const isFirst = contentIdx === 0;
                                                        const isLast = contentIdx === layer.contents.length - 1;
                                                        return (
                                                            <div
                                                                key={content.id}
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.stopPropagation();
                                                                    setDraggedContentId(content.id);
                                                                    setDraggedContentSourceLayerId(layer.id);
                                                                    e.dataTransfer.setData('text/plain', JSON.stringify({ layerId: layer.id, contentId: content.id }));
                                                                }}
                                                                onDragEnd={() => {
                                                                    setDraggedContentId(null);
                                                                    setDraggedContentSourceLayerId(null);
                                                                    setDragOverContentId(null);
                                                                }}
                                                                onDragOver={(e) => {
                                                                    e.preventDefault();
                                                                    if (draggedContentId && draggedContentId !== content.id) {
                                                                        setDragOverContentId(content.id);
                                                                    }
                                                                }}
                                                                onDragLeave={() => setDragOverContentId(null)}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    try {
                                                                        const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                                                                        if (dragData.contentId) {
                                                                            handleMoveContentToLayer(dragData.layerId, dragData.contentId, layer.id, content.id);
                                                                        }
                                                                    } catch(err) {
                                                                        console.error(err);
                                                                    }
                                                                    setDraggedContentId(null);
                                                                    setDraggedContentSourceLayerId(null);
                                                                    setDragOverContentId(null);
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedLayerId(layer.id);
                                                                    setSelectedContentId(content.id);
                                                                }}
                                                                className={`flex items-center justify-between p-1.5 rounded-lg border text-[10px] transition cursor-pointer ${
                                                                    selectedLayerId === layer.id && selectedContentId === content.id
                                                                        ? 'bg-[#E5654B]/20 border-[#E5654B] text-[#E5654B]'
                                                                        : 'bg-stone-950 border-white/5 hover:bg-stone-900 text-stone-300'
                                                                } ${draggedContentId === content.id ? 'opacity-40' : ''} ${
                                                                    dragOverContentId === content.id ? 'border-[#E5654B] scale-[0.98]' : ''
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5 truncate mr-2 flex-1">
                                                                    {content.type === 'text' ? (
                                                                        <Type className="w-3 h-3 text-[#E5654B]" />
                                                                    ) : (
                                                                        <img 
                                                                            src={content.url} 
                                                                            alt={content.name || 'Image'} 
                                                                            className="w-4 h-4 rounded object-contain bg-stone-900 border border-white/5" 
                                                                        />
                                                                    )}
                                                                    <span className="truncate text-[10px]">{content.name || (content.type === 'text' ? content.text : 'Gambar')}</span>
                                                                </div>

                                                                {/* Inline Action Buttons */}
                                                                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                    {/* Settings Action */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedLayerId(layer.id);
                                                                            setSelectedContentId(content.id);
                                                                            setActiveComponentSettingsInfo({ layerId: layer.id, contentId: content.id });
                                                                            setActiveSettingsTab('position');
                                                                        }}
                                                                        className="p-0.5 text-stone-400 hover:text-white rounded transition"
                                                                        title="Pengaturan Komponen"
                                                                    >
                                                                        <Settings className="w-3 h-3" />
                                                                    </button>

                                                                    {/* Lock Action */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const nextLocked = !content.locked;
                                                                            updateContentProperty(layer.id, content.id, 'locked', nextLocked);
                                                                            if (nextLocked && selectedContentId === content.id) {
                                                                                setSelectedContentId(null);
                                                                            }
                                                                        }}
                                                                        className={`p-0.5 rounded transition ${content.locked ? 'text-[#E5654B] hover:text-[#e5654bd0]' : 'text-stone-400 hover:text-white'}`}
                                                                        title={content.locked ? "Buka Kunci Komponen" : "Kunci Komponen"}
                                                                    >
                                                                        {content.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                                    </button>

                                                                    {/* Move Up */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleMoveContent(layer.id, content.id, 'up')}
                                                                        disabled={isFirst}
                                                                        className={`p-0.5 rounded transition ${isFirst ? 'opacity-20 cursor-not-allowed' : 'text-stone-400 hover:text-white'}`}
                                                                        title="Geser ke Atas"
                                                                    >
                                                                        <ArrowUp className="w-3 h-3" />
                                                                    </button>

                                                                    {/* Move Down */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleMoveContent(layer.id, content.id, 'down')}
                                                                        disabled={isLast}
                                                                        className={`p-0.5 rounded transition ${isLast ? 'opacity-20 cursor-not-allowed' : 'text-stone-400 hover:text-white'}`}
                                                                        title="Geser ke Bawah"
                                                                    >
                                                                        <ArrowDown className="w-3 h-3" />
                                                                    </button>

                                                                    {/* Copy / Duplicate */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDuplicateContent(layer.id, content.id)}
                                                                        className="p-0.5 text-stone-400 hover:text-white rounded transition"
                                                                        title="Duplikat Komponen"
                                                                    >
                                                                        <Copy className="w-3 h-3" />
                                                                    </button>

                                                                    {/* Delete Action */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (confirm('Hapus komponen ini?')) {
                                                                                deleteContentFromLayer(layer.id, content.id);
                                                                            }
                                                                        }}
                                                                        className="p-0.5 text-stone-400 hover:text-red-400 rounded transition"
                                                                        title="Hapus Komponen"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Actions inside group - Tidy + Tambah popover */}
                                                    <div className="pt-1.5 flex justify-end add-menu-container">
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveAddMenuLayerId(activeAddMenuLayerId === layer.id ? null : layer.id);
                                                                }}
                                                                className="flex items-center gap-1 text-[9px] font-bold text-stone-400 hover:text-[#E5654B] bg-stone-900 hover:bg-stone-850 px-2 py-1 rounded-lg border border-white/5 transition"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                                <span>Tambah</span>
                                                            </button>

                                                            {activeAddMenuLayerId === layer.id && (
                                                                <div className="absolute right-full bottom-0 mr-1.5 w-32 bg-stone-950 border border-white/10 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-right-2 duration-100 flex flex-col">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            addContentToLayer(layer.id, 'text');
                                                                            setActiveAddMenuLayerId(null);
                                                                        }}
                                                                        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 text-[9px] font-bold text-stone-200 hover:text-white rounded-lg transition text-left"
                                                                    >
                                                                        <Plus className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                        <span>+ Teks</span>
                                                                    </button>
                                                                    
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedLayerId(layer.id);
                                                                            setSelectedContentId(null);
                                                                            setImmersiveActivePanel('library');
                                                                            setActiveAddMenuLayerId(null);
                                                                        }}
                                                                        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 text-[9px] font-bold text-stone-200 hover:text-white rounded-lg transition text-left cursor-pointer"
                                                                    >
                                                                        <ImageIcon className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                        <span>Pilih dari Album</span>
                                                                    </button>

                                                                    <label className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 text-[9px] font-bold text-stone-200 hover:text-white rounded-lg transition cursor-pointer text-left">
                                                                        <Upload className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                        <span>Unggah Gambar</span>
                                                                        <input 
                                                                            type="file" 
                                                                            accept="image/*" 
                                                                            className="hidden" 
                                                                            onChange={async (e) => {
                                                                                const file = e.target.files[0];
                                                                                if (!file) return;
                                                                                const formData = new FormData();
                                                                                formData.append('file', file);
                                                                                setActiveAddMenuLayerId(null);
                                                                                try {
                                                                                    const response = await axios.post('/super-admin/three-d-scenes/upload-asset', formData, {
                                                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                                                    });
                                                                                    if (response.data.success) {
                                                                                        addContentToLayer(layer.id, 'upload', response.data.url);
                                                                                    }
                                                                                } catch (err) {
                                                                                    console.error(err);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </label>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedLayerId(layer.id);
                                                                            setShowDrawingPad(true);
                                                                            setActiveAddMenuLayerId(null);
                                                                        }}
                                                                        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/5 text-[9px] font-bold text-stone-200 hover:text-white rounded-lg transition text-left"
                                                                    >
                                                                        <Brush className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                        <span>Lukis</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                        {/* Left Docked Sidebar Drawer Panel for Inspector */}
                        {immersiveActivePanel === 'inspector' && (
                            <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-30 select-none animate-in fade-in slide-in-from-left-4 duration-150 flex-shrink-0 text-white">
                                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                    <div className="truncate pr-4">
                                        <span className="text-xs font-bold text-[#E5654B] block truncate">
                                            {selectedContent ? `Komponen: ${selectedContent.name}` : selectedLayer ? `Layer: ${selectedLayer.name}` : "Pilih Layer/Komponen"}
                                        </span>
                                        <span className="text-[9px] text-stone-400">
                                            {selectedContent ? `${selectedContent.type.toUpperCase()} di ${selectedLayer.name}` : selectedLayer ? 'Pengaturan Grup Layer' : 'Inspektur Komponen'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {selectedContent && selectedContent.type === 'upload' && (
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    disabled={isReplacingImage}
                                                    onClick={() => replaceImageInputRef.current?.click()}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white rounded-lg text-[9px] font-bold transition shadow-sm border border-white/10"
                                                    title="Ganti Gambar"
                                                >
                                                    <Upload className="w-3 h-3" />
                                                    <span>Ganti</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isReplacingImage}
                                                    onClick={() => openBgRemover(selectedContent)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#E5654B] hover:bg-[#c24b33] disabled:opacity-50 text-white rounded-lg text-[9px] font-bold transition shadow-sm border border-[#E5654B]"
                                                    title="Hapus Latar"
                                                >
                                                    <Scissors className="w-3 h-3" />
                                                    <span>Hapus Latar</span>
                                                </button>
                                            </div>
                                        )}
                                        <button onClick={handleCloseDrawer} className="text-stone-450 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {activeLayerSettingsId && renderActiveLayerSettings()}
                                    {activeComponentSettingsInfo && renderActiveComponentSettings()}
                                    {!activeLayerSettingsId && !activeComponentSettingsInfo && (
                                        <div className="bg-stone-900/50 border border-white/5 rounded-xl p-4 text-center">
                                            <p className="text-[11px] text-stone-400">Pilih grup layer atau komponen dari daftar layer untuk melihat pengaturan di sini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                        {/* Immersive Keyframes Panel */}
                        {/* Left Docked Sidebar Drawer Panel for Keyframes */}
                        {immersiveActivePanel === 'keyframes' && (
                            <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-30 select-none animate-in fade-in slide-in-from-left-4 duration-150 flex-shrink-0 text-white">
                                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold text-stone-200">Titik Gerak Kamera ({data.config.keyframes.length})</span>
                                    <button onClick={handleCloseDrawer} className="text-stone-450 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {/* Global Pause Duration Control */}
                                    <div className="bg-stone-900/60 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-bold text-stone-300">Durasi Berhenti (Detik)</label>
                                            <span className="text-[10px] font-mono font-bold text-[#E5654B] bg-[#E5654B]/10 px-2 py-0.5 rounded">
                                                {(data.config.keyframePauseDuration ?? 2.0).toFixed(1)}s
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.0"
                                            max="10.0"
                                            step="0.1"
                                            value={data.config.keyframePauseDuration ?? 2.0}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setData(d => ({
                                                    ...d,
                                                    config: {
                                                        ...d.config,
                                                        keyframePauseDuration: val
                                                    }
                                                }));
                                            }}
                                            className="w-full accent-[#E5654B] h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-[8px] text-stone-400">Jeda waktu di setiap titik frame saat transisi autoplay.</span>
                                    </div>

                                    <div className="flex items-center gap-2 justify-end mb-1">
                                        {data.config.keyframes.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowExportConfig(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition shadow-sm border border-emerald-600"
                                            >
                                                <Play className="w-3.5 h-3.5" />
                                                <span>Ekspor MP4</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={captureCameraKeyframe}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl text-[10px] font-bold transition shadow-sm border border-[#E5654B]"
                                        >
                                            <Camera className="w-3.5 h-3.5" />
                                            <span>Rekam Titik Baru</span>
                                        </button>
                                    </div>

                                    {data.config.keyframes.length === 0 ? (
                                        <div className="bg-stone-900/50 border border-white/5 rounded-xl p-6 text-center">
                                            <p className="text-[11px] text-stone-400">Belum ada keyframe. Putar atau geser kamera di viewport, lalu klik <strong>Rekam Titik Baru</strong>.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                                            {data.config.keyframes.map((kf, idx) => (
                                                <div 
                                                    key={kf.id}
                                                    className="flex flex-col gap-1.5 bg-stone-900/40 hover:bg-stone-900/80 border border-white/10 rounded-xl p-2.5 transition cursor-pointer"
                                                    onClick={() => previewKeyframePosition(kf)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 bg-[#E5654B] text-white text-[10px] font-bold flex items-center justify-center rounded-full flex-shrink-0">
                                                                {idx + 1}
                                                            </span>
                                                            <div>
                                                                <p className="text-[11px] font-bold text-stone-200">Posisi #{idx + 1}</p>
                                                                <p className="text-[9px] text-stone-400 font-mono">
                                                                    X: {kf.position.x.toFixed(1)} | Y: {kf.position.y.toFixed(1)} | Z: {kf.position.z.toFixed(1)}
                                                                </p>
                                                                <p className="text-[9px] text-stone-400 font-mono">
                                                                    Rotasi: X: {radToDeg(kf.rotation?.x || 0)}° | Y: {radToDeg(kf.rotation?.y || 0)}° | Z: {radToDeg(kf.rotation?.z || 0)}°
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateKeyframeFromCamera(kf.id);
                                                                }}
                                                                className="p-1 text-stone-400 hover:text-sky-400 rounded transition"
                                                                title="Perbarui koordinat dari kamera saat ini"
                                                            >
                                                                <RefreshCw className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteKeyframe(kf.id);
                                                                }}
                                                                className="p-1 text-stone-400 hover:text-red-400 rounded transition"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Inline duration controls */}
                                                    <div className="mt-1 flex items-center gap-2 text-[9px] text-stone-300 border-t border-white/5 pt-1.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <span>Transisi:</span>
                                                            <input 
                                                                type="number"
                                                                min="0.1"
                                                                max="20"
                                                                step="0.5"
                                                                value={kf.transitionDuration ?? 2.0}
                                                                onChange={(e) => updateKeyframeProperty(kf.id, 'transitionDuration', parseFloat(e.target.value) || 2.0)}
                                                                className="w-10 bg-stone-850 border border-white/10 rounded px-1 py-0.5 text-center font-mono text-white text-[9px]"
                                                            />
                                                            <span>s</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 ml-auto">
                                                            <span>Jeda:</span>
                                                            <input 
                                                                type="number"
                                                                min="0.0"
                                                                max="20"
                                                                step="0.5"
                                                                value={kf.pauseDuration ?? 2.0}
                                                                onChange={(e) => updateKeyframeProperty(kf.id, 'pauseDuration', parseFloat(e.target.value) || 0.0)}
                                                                className="w-10 bg-stone-850 border border-white/10 rounded px-1 py-0.5 text-center font-mono text-white text-[9px]"
                                                            />
                                                            <span>s</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Immersive Settings Panel */}
                        {/* Left Docked Sidebar Drawer Panel for Settings */}
                        {immersiveActivePanel === 'settings' && (
                            <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-30 select-none animate-in fade-in slide-in-from-left-4 duration-150 flex-shrink-0 text-white">
                                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold text-stone-200">Pengaturan Lingkungan</span>
                                    <button onClick={handleCloseDrawer} className="text-stone-450 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-stone-400">Nama Scene 3D</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={handleNameChange}
                                            placeholder="Contoh: Room Jogja Intimate"
                                            className="w-full px-3 py-2 text-xs bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition"
                                        />
                                        {errors.name && <p className="text-[9px] text-red-400">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-stone-400">Slug</label>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={e => setData('slug', e.target.value)}
                                            placeholder="room-jogja-intimate"
                                            className="w-full px-3 py-2 text-xs bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition"
                                        />
                                        {errors.slug && <p className="text-[9px] text-red-400">{errors.slug}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-stone-400">URL Musik Latar (Audio)</label>
                                        <input
                                            type="text"
                                            value={data.config.musicUrl || ''}
                                            onChange={e => {
                                                const newConfig = {
                                                    ...data.config,
                                                    musicUrl: e.target.value
                                                };
                                                setData('config', newConfig);
                                            }}
                                            placeholder="Contoh: /audio/backsound.mp3"
                                            className="w-full px-3 py-2 text-xs bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition"
                                        />
                                    </div>

                                    <div className="space-y-1.5 border-b border-white/5 pb-2 mb-1">
                                        <label className="text-[10px] font-bold text-stone-400">Preset Warna Tema (Satu Klik)</label>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {THEME_PRESETS.map(preset => (
                                                <button
                                                    key={preset.name}
                                                    type="button"
                                                    onClick={() => applyThemePreset(preset)}
                                                    className="flex flex-col items-center gap-1 p-1.5 border border-white/5 hover:border-[#E5654B] rounded-xl hover:bg-white/5 transition text-[9px] font-bold text-stone-300"
                                                >
                                                    <div 
                                                        className="w-full h-5 rounded-lg border border-white/10 flex items-center justify-center text-[10px]"
                                                        style={{ background: GRADIENTS[preset.gradient] }}
                                                    >
                                                        <span style={{ color: preset.textColor }}>Aa</span>
                                                    </div>
                                                    <span className="truncate max-w-full text-stone-450">{preset.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-stone-400">Tema Latar Belakang</label>
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
                                            className="w-full px-3 py-2 text-xs bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white bg-transparent"
                                        >
                                            <option value="midnight">Midnight Navy (Malam Biru Pekat)</option>
                                            <option value="romance">Romantic Plum (Ungu Romantis)</option>
                                            <option value="emerald">Emerald Forest (Hijau Emerald)</option>
                                            <option value="luxury_gold">Luxury Gold (Emas Mewah)</option>
                                            <option value="ivory_cream">Ivory Cream (Krem Klasik)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-stone-400">Efek Partikel Lingkungan</label>
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
                                            className="w-full px-3 py-2 text-xs bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white bg-transparent"
                                        >
                                            <option value="none">Tanpa Efek Partikel</option>
                                            <option value="gold_dust">Gold Dust (Butiran Emas Melayang)</option>
                                            <option value="sakura">Sakura Falling (Guguran Sakura)</option>
                                            <option value="snow">Drifting Snow (Salju Turun Lembut)</option>
                                            <option value="leaves">Leaves (Daun Gugur)</option>
                                            <option value="rose">Rose Petals (Guguran Kelopak Mawar)</option>
                                            <option value="stars">Stars (Bintang Melayang)</option>
                                            <option value="hearts">Hearts (Hati Berjatuhan)</option>
                                            <option value="confetti">Confetti (Warna-warni)</option>
                                            <option value="butterfly">Butterflies (Kupu-kupu Melayang)</option>
                                            <option value="flower">Flower Petals (Kelopak Bunga)</option>
                                            <option value="sparkle">Sparkles (Kilauan Cahaya)</option>
                                            <option value="birds">Birds (Burung Terbang)</option>
                                        </select>
                                    </div>

                                    {data.config.particleType && data.config.particleType !== 'none' && (
                                        <>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] text-stone-400">
                                                    <label className="font-bold">Jumlah Partikel</label>
                                                    <span className="font-mono text-[#E5654B] bg-[#E5654B]/10 px-1.5 py-0.5 rounded">
                                                        {data.config.particleCount ?? 30} pcs
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="5"
                                                    max="150"
                                                    step="5"
                                                    value={data.config.particleCount ?? 30}
                                                    onChange={e => {
                                                        const newConfig = {
                                                            ...data.config,
                                                            particleCount: parseInt(e.target.value)
                                                        };
                                                        setData('config', newConfig);
                                                    }}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B] h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-stone-400">Kecepatan Partikel</label>
                                                <select
                                                    value={data.config.particleSpeed || 'normal'}
                                                    onChange={e => {
                                                        const newConfig = {
                                                            ...data.config,
                                                            particleSpeed: e.target.value
                                                        };
                                                        setData('config', newConfig);
                                                        saveHistoryState(newConfig);
                                                    }}
                                                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white bg-transparent"
                                                >
                                                    <option value="slow">Lambat</option>
                                                    <option value="normal">Normal</option>
                                                    <option value="fast">Cepat</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-[10px] font-bold text-stone-400">Status Aktif</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-stone-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E5654B]" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Left Docked Sidebar Drawer Panel for 3D Space & Depth Manager */}
                        {immersiveActivePanel === 'depth' && (
                            <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-30 select-none animate-in fade-in slide-in-from-left-4 duration-150 flex-shrink-0 text-white overflow-hidden">
                                <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <Box className="w-4 h-4 text-[#E5654B]" />
                                        <span className="text-xs font-bold text-stone-200">Kedalaman & Ruang 3D</span>
                                    </div>
                                    <button onClick={handleCloseDrawer} className="text-stone-450 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
                                    {/* 1. Visual 3D Space Map widget */}
                                    <div className="bg-zinc-950/80 rounded-xl p-3 border border-zinc-800/60 relative flex-shrink-0">
                                        <span className="text-[10px] font-bold text-stone-400 block mb-2">Peta Spasial / Perspektif (Z-Axis)</span>
                                        <div className="relative flex justify-center items-center bg-zinc-950 rounded-lg p-2 overflow-hidden border border-white/5 select-none">
                                            <svg
                                                ref={depthSvgRef}
                                                width="220"
                                                height="240"
                                                viewBox="0 0 220 240"
                                                className="overflow-visible touch-none cursor-crosshair"
                                                onPointerMove={handleDepthPointerMove}
                                                onPointerUp={handleDepthPointerUp}
                                                onPointerLeave={handleDepthPointerUp}
                                            >
                                                {/* Grid Lines */}
                                                <line x1="110" y1="20" x2="110" y2="220" stroke="rgba(255,255,255,0.03)" strokeDasharray="2,2" />
                                                <line x1="20" y1="120" x2="200" y2="120" stroke="rgba(255,255,255,0.03)" strokeDasharray="2,2" />
                                                
                                                {/* Camera Frustum Visual Cone */}
                                                <polygon 
                                                    points="110,220 30,20 190,20" 
                                                    fill="rgba(229, 101, 75, 0.03)" 
                                                    stroke="rgba(229, 101, 75, 0.15)" 
                                                    strokeWidth="1"
                                                    strokeDasharray="3,3" 
                                                />
                                                
                                                {/* Perspective Ground wedge */}
                                                <polygon 
                                                    points="110,220 50,70 170,70" 
                                                    fill="rgba(16, 185, 129, 0.04)" 
                                                    stroke="rgba(16, 185, 129, 0.15)" 
                                                    strokeWidth="1" 
                                                />
                                                <text x="110" y="85" textAnchor="middle" fill="rgba(16,185,129,0.3)" fontSize="8" fontWeight="bold">GROUND PLANE</text>

                                                {/* Depth zones text labels */}
                                                <text x="180" y="35" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8" fontWeight="bold">Jauh (Far)</text>
                                                <text x="180" y="85" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8" fontWeight="bold">Belakang (Back)</text>
                                                <text x="180" y="145" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8" fontWeight="bold">Tengah (Mid)</text>
                                                <text x="180" y="195" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8" fontWeight="bold">Depan (Front)</text>

                                                {/* Camera Anchor Node */}
                                                <circle cx="110" cy="220" r="8" fill="#10B981" />
                                                <circle cx="110" cy="220" r="14" fill="transparent" stroke="#10B981" strokeWidth="1" className="animate-pulse" />
                                                <path d="M106,218 L114,218 L114,224 L106,224 Z M108,218 L108,216 L112,216 L112,218" fill="none" stroke="white" strokeWidth="1" />
                                                <text x="110" y="238" textAnchor="middle" fill="#10B981" fontSize="8" fontWeight="bold">KAMERA</text>

                                                {/* Render Layer Horizontal bars */}
                                                {(data.config.layers || []).map((layer) => {
                                                    const zVal = layer.position?.z ?? 0;
                                                    const yPos = mapZToY(zVal);
                                                    const isSelected = selectedLayerId === layer.id;
                                                    const isIsolated = isolatedLayerId === layer.id;
                                                    
                                                    // Map perspective width fitting inside frustum: (wider near Y=220, narrower near Y=20)
                                                    const frustumRatio = (220 - yPos) / 200; // 0 at Y=220, 1 at Y=20
                                                    const leftBound = 110 - (110 - 30) * frustumRatio;
                                                    const rightBound = 110 + (190 - 110) * frustumRatio;

                                                    return (
                                                        <g key={layer.id} className="group select-none">
                                                            {/* Invisible wider hitarea for easier dragging */}
                                                            <line 
                                                                x1={leftBound - 20} 
                                                                y1={yPos} 
                                                                x2={rightBound + 20} 
                                                                y2={yPos} 
                                                                stroke="transparent" 
                                                                strokeWidth="16" 
                                                                className="cursor-ns-resize"
                                                                onPointerDown={(e) => handleDepthPointerDown(e, layer.id)}
                                                            />
                                                            {/* Visible Layer Bar */}
                                                            <line 
                                                                x1={leftBound} 
                                                                y1={yPos} 
                                                                x2={rightBound} 
                                                                y2={yPos} 
                                                                stroke={isSelected ? "#E5654B" : isIsolated ? "#10B981" : "rgba(255,255,255,0.4)"} 
                                                                strokeWidth={isSelected ? "3" : "2"} 
                                                                className="cursor-ns-resize transition-all duration-100 group-hover:stroke-[#E5654B]"
                                                                onPointerDown={(e) => handleDepthPointerDown(e, layer.id)}
                                                            />
                                                            {/* Layer Handle Dots */}
                                                            <circle 
                                                                cx={leftBound} 
                                                                cy={yPos} 
                                                                r={isSelected ? "5" : "4"} 
                                                                fill={isSelected ? "#E5654B" : "rgba(255,255,255,0.6)"} 
                                                                className="cursor-ns-resize"
                                                                onPointerDown={(e) => handleDepthPointerDown(e, layer.id)}
                                                            />
                                                            <circle 
                                                                cx={rightBound} 
                                                                cy={yPos} 
                                                                r={isSelected ? "5" : "4"} 
                                                                fill={isSelected ? "#E5654B" : "rgba(255,255,255,0.6)"} 
                                                                className="cursor-ns-resize"
                                                                onPointerDown={(e) => handleDepthPointerDown(e, layer.id)}
                                                            />
                                                            {/* Layer label */}
                                                            <text 
                                                                x={rightBound + 8} 
                                                                y={yPos + 3} 
                                                                fill={isSelected ? "#E5654B" : isIsolated ? "#10B981" : "#A8A29E"} 
                                                                fontSize="8" 
                                                                fontWeight={isSelected ? "bold" : "normal"}
                                                                className="pointer-events-none select-none"
                                                            >
                                                                {layer.name} ({zVal.toFixed(1)})
                                                            </text>
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                        </div>
                                        <span className="text-[8px] text-stone-500 block text-center mt-1">Gunakan mouse untuk drag & geser garis layer untuk mengatur Z (kedalaman)</span>
                                    </div>

                                    {/* 2. Room Structure Slots Templates */}
                                    <div className="bg-zinc-950/40 rounded-xl p-3 border border-zinc-800 flex flex-col gap-2 flex-shrink-0">
                                        <span className="text-[10px] font-bold text-stone-300 block border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#E5654B]" />
                                            Slot Struktur Ruang 3D (Room Slots)
                                        </span>
                                        
                                        <div className="flex flex-col gap-1.5">
                                            {[
                                                {
                                                    id: 'ground',
                                                    name: 'Lantai (Ground Floor)',
                                                    desc: 'Alas bawah mendatar ruang',
                                                    pos: { x: 0, y: -2.0, z: -3.0 },
                                                    rot: { x: 90, y: 0, z: 0 },
                                                    scl: { x: 10, y: 10 }
                                                },
                                                {
                                                    id: 'back',
                                                    name: 'Dinding Belakang (Back Wall)',
                                                    desc: 'Tembok batas pandangan belakang',
                                                    pos: { x: 0, y: 0, z: -6.0 },
                                                    rot: { x: 0, y: 0, z: 0 },
                                                    scl: { x: 10, y: 7.5 }
                                                },
                                                {
                                                    id: 'left',
                                                    name: 'Dinding Kiri (Left Wall)',
                                                    desc: 'Tembok batas samping kiri',
                                                    pos: { x: -5.0, y: 0, z: -3.0 },
                                                    rot: { x: 0, y: 90, z: 0 },
                                                    scl: { x: 10, y: 7.5 }
                                                },
                                                {
                                                    id: 'right',
                                                    name: 'Dinding Kanan (Right Wall)',
                                                    desc: 'Tembok batas samping kanan',
                                                    pos: { x: 5.0, y: 0, z: -3.0 },
                                                    rot: { x: 0, y: -90, z: 0 },
                                                    scl: { x: 10, y: 7.5 }
                                                },
                                                {
                                                    id: 'front',
                                                    name: 'Bingkai Depan (Front Frame)',
                                                    desc: 'Ornamen paralaks dekat lensa',
                                                    pos: { x: 0, y: 0, z: 1.5 },
                                                    rot: { x: 0, y: 0, z: 0 },
                                                    scl: { x: 4.5, y: 3.5 }
                                                }
                                            ].map((slot) => {
                                                // Find if layer matches slot layout
                                                const matchingLayer = data.config.layers.find(l => {
                                                    if (slot.id === 'ground') return l.rotation?.x === 90;
                                                    if (slot.id === 'left') return l.rotation?.y === 90;
                                                    if (slot.id === 'right') return l.rotation?.y === -90;
                                                    if (slot.id === 'back') return l.rotation?.x === 0 && l.rotation?.y === 0 && l.position?.z === -6.0;
                                                    if (slot.id === 'front') return l.rotation?.x === 0 && l.rotation?.y === 0 && l.position?.z === 1.5;
                                                    return false;
                                                });

                                                const isSelected = matchingLayer && selectedLayerId === matchingLayer.id;

                                                return (
                                                    <div 
                                                        key={slot.id} 
                                                        className={`p-2 bg-zinc-950/60 border rounded-lg flex flex-col gap-1.5 transition ${
                                                            isSelected ? 'border-[#E5654B]' : 'border-zinc-800 hover:border-zinc-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 truncate">
                                                                <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] ${
                                                                    matchingLayer ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-stone-500 border border-white/5'
                                                                }`}>
                                                                    {matchingLayer ? '✓' : '+'}
                                                                </span>
                                                                <div className="truncate flex-1">
                                                                    <span className="text-[9px] font-bold text-stone-200 block truncate">{slot.name}</span>
                                                                    <span className="text-[7.5px] text-stone-500 block truncate">{slot.desc}</span>
                                                                </div>
                                                            </div>

                                                            {matchingLayer ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedLayerId(matchingLayer.id);
                                                                        setSelectedContentId(null);
                                                                    }}
                                                                    className={`text-[8px] font-bold px-2 py-0.5 rounded transition ${
                                                                        isSelected ? 'bg-[#E5654B] text-white' : 'bg-zinc-900 text-stone-300 hover:text-white'
                                                                    }`}
                                                                >
                                                                    Pilih
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const layerId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                                                                        const newLayer = {
                                                                            id: layerId,
                                                                            name: slot.name.split(' ')[0],
                                                                            visible: true,
                                                                            position: slot.pos,
                                                                            rotation: slot.rot,
                                                                            scale: slot.scl,
                                                                            contents: []
                                                                        };
                                                                        
                                                                        setData(d => {
                                                                            const updatedLayers = [...d.config.layers, newLayer];
                                                                            const newConfig = { ...d.config, layers: updatedLayers };
                                                                            saveHistoryState(newConfig);
                                                                            return { ...d, config: newConfig };
                                                                        });
                                                                        setSelectedLayerId(layerId);
                                                                        setSelectedContentId(null);
                                                                    }}
                                                                    className="text-[8px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded transition"
                                                                >
                                                                    Aktifkan
                                                                </button>
                                                            )}
                                                        </div>

                                                        {matchingLayer && (
                                                            <div className="border-t border-zinc-900 pt-1.5 flex flex-col gap-1.5">
                                                                {matchingLayer.contents && matchingLayer.contents.length > 0 ? (
                                                                    <div className="flex items-center justify-between text-[8px] bg-zinc-950 p-1.5 rounded border border-white/5">
                                                                        <span className="truncate max-w-[150px] font-bold text-stone-300 flex items-center gap-1">
                                                                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                                                            {matchingLayer.contents[0].name}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const updatedLayers = data.config.layers.map(l => {
                                                                                    if (l.id === matchingLayer.id) {
                                                                                        return { ...l, contents: [] };
                                                                                    }
                                                                                    return l;
                                                                                });
                                                                                setData(d => {
                                                                                    const newConfig = { ...d.config, layers: updatedLayers };
                                                                                    saveHistoryState(newConfig);
                                                                                    return { ...d, config: newConfig };
                                                                                });
                                                                            }}
                                                                            className="text-red-400 hover:text-red-300 font-bold"
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col gap-1 p-1 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                                                                        <div className="flex items-center gap-1 text-[7.5px] font-bold text-amber-400 leading-tight">
                                                                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                                                                            <span>Slot Kosong! Isi dengan gambar agar menempel jadi pembatas</span>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedLayerId(matchingLayer.id);
                                                                                setSelectedContentId(null);
                                                                                setDepthAssetPickerTargetId(matchingLayer.id);
                                                                            }}
                                                                            className="w-full text-center py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded text-[8px] font-bold text-stone-300 hover:text-white transition"
                                                                        >
                                                                            + Isi Gambar dari Album
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 3. Selection Slider & Fine Tuning */}
                                    {selectedLayer ? (
                                        <div className="bg-zinc-950/40 rounded-xl p-3 border border-zinc-800 flex flex-col gap-2 flex-shrink-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-stone-400">Tweak Kedalaman Layer:</span>
                                                <span className="text-xs font-bold text-[#E5654B] truncate max-w-[120px]">{selectedLayer.name}</span>
                                            </div>
                                            
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between text-[9px] text-stone-450">
                                                    <span>Posisi Z (Fine-tune)</span>
                                                    <span className="font-bold text-[#E5654B]">{selectedLayer.position?.z ?? 0}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="-12.0"
                                                    max="4.0"
                                                    step="0.1"
                                                    value={selectedLayer.position?.z ?? 0}
                                                    onChange={(e) => {
                                                        const nextZ = parseFloat(e.target.value);
                                                        updateLayerProperty(selectedLayer.id, 'position', {
                                                            ...selectedLayer.position,
                                                            z: nextZ
                                                        });
                                                    }}
                                                    onMouseUp={() => saveHistoryState(configRef.current)}
                                                    className="w-full accent-[#E5654B] bg-zinc-800 rounded-lg appearance-none h-1 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-zinc-950/20 rounded-xl p-3 border border-zinc-850/60 text-center flex-shrink-0">
                                            <span className="text-[9px] text-stone-500">Pilih slot ruang atau klik garis pada peta di atas untuk fine-tuning posisi</span>
                                        </div>
                                    )}

                                    {/* 3. Parallax Design Guide Card */}
                                    <div className="bg-zinc-950/40 rounded-xl p-3 border border-zinc-800/80 flex-shrink-0">
                                        <span className="text-[10px] font-bold text-stone-300 block mb-2 border-b border-zinc-800 pb-1.5">Panduan Mengisi Ruang 3D agar Indah</span>
                                        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto text-[9px] text-stone-400 font-sans leading-relaxed">
                                            <div>
                                                <div className="flex items-center gap-1.5 text-stone-200 font-bold mb-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                    <span>Latar Depan (Front Space)</span>
                                                </div>
                                                <p className="pl-3">Isi dengan partikel melayang (dedaunan gugur, kelopak mawar, salju, lampion melayang). Z-depth: <span className="text-red-400 font-bold">Z = 0 s.d Z = 2.0</span>. Memberikan paralaks dramatis yang bergerak cepat saat kamera bergerak.</p>
                                            </div>
                                            
                                            <div>
                                                <div className="flex items-center gap-1.5 text-stone-200 font-bold mb-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                                    <span>Area Fokus Inti (Mid/Focus Space)</span>
                                                </div>
                                                <p className="pl-3">Gunakan untuk konten utama (foto mempelai, teks nama pengantin, detail acara). Z-depth: <span className="text-orange-400 font-bold">Z = -1.0 s.d Z = -3.5</span>. Ini adalah area baca utama pembaca undangan.</p>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-1.5 text-stone-200 font-bold mb-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                    <span>Latar Belakang (Back Space)</span>
                                                </div>
                                                <p className="pl-3">Gunakan gambar latar/scenic berukuran besar (siluet gunung, pola batik, gradasi awan). Z-depth: <span className="text-blue-400 font-bold">Z = -4.0 s.d Z = -7.0</span>. Menjaga visual ruang tetap penuh saat kamera berputar.</p>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                    <span>Lantai Ruang (Ground Plane)</span>
                                                </div>
                                                <p className="pl-3">Tambahkan satu layer memanjang horizontal (rumput, lantai ballroom, karpet) dan pilih <b>"Atur Sebagai Lantai"</b> (X-Rotation = 90°). Ini memberi visual dasar agar ruang tidak terasa melayang tanpa batas.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Left Docked Sidebar Drawer Panel for Library */}
                        {immersiveActivePanel === 'library' && (
                            <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-30 select-none animate-in fade-in slide-in-from-left-4 duration-150 flex-shrink-0 text-white">
                                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold text-stone-200">Album</span>
                                    <button onClick={handleCloseDrawer} className="text-stone-450 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Search and Upload Toggle Bar */}
                                <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center gap-2 bg-zinc-950/20">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-450" />
                                        <input
                                            type="text"
                                            placeholder="Cari album..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full text-xs pl-8 pr-7 py-2 bg-zinc-950 border border-white/10 text-white rounded-xl outline-none focus:border-[#E5654B] transition-all font-sans"
                                        />
                                        {searchQuery && (
                                            <button 
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-2.5 top-2.5 text-stone-450 hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowPresetUploadForm(!showPresetUploadForm)}
                                        className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                                            showPresetUploadForm 
                                                ? 'bg-[#E5654B] border-[#E5654B] text-white' 
                                                : 'bg-zinc-950 border-white/10 text-stone-300 hover:text-white hover:border-[#E5654B]'
                                        }`}
                                        title="Unggah Aset Baru"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Upload Form Panel */}
                                {showPresetUploadForm && (
                                    <form onSubmit={handleCustomPresetUpload} className="p-4 bg-zinc-950/60 border-b border-zinc-800/80 space-y-3 animate-in slide-in-from-top duration-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5654B]">Unggah Album Baru</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPresetUploadForm(false)}
                                                className="text-stone-450 hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                        
                                        {/* File Picker Zone */}
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-stone-400 block font-bold">File Gambar (PNG/JPG/WEBP)</span>
                                            <div 
                                                className="border border-dashed border-white/15 rounded-xl p-3 bg-zinc-900/40 text-center hover:border-[#E5654B]/50 transition cursor-pointer relative"
                                                onClick={() => document.getElementById('preset-file-input-immersive').click()}
                                            >
                                                <input
                                                    id="preset-file-input-immersive"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setUploadPresetFile(file);
                                                            if (!uploadPresetName) {
                                                                setUploadPresetName(file.name.replace(/\.[^/.]+$/, ""));
                                                            }
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                                {uploadPresetFile ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <ImageIcon className="h-4 w-4 text-[#E5654B]" />
                                                        <span className="text-[10px] text-stone-200 font-medium truncate max-w-[180px]">
                                                            {uploadPresetFile.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1 text-stone-400">
                                                        <Upload className="h-4 w-4 mx-auto text-stone-500" />
                                                        <p className="text-[9px] font-medium">Klik untuk memilih file</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Name Input */}
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-stone-400 block font-bold">Nama Aset</span>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Bunga Mawar Merah"
                                                value={uploadPresetName}
                                                onChange={e => setUploadPresetName(e.target.value)}
                                                className="w-full text-[10px] px-2.5 py-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none focus:border-[#E5654B]"
                                            />
                                        </div>

                                        {/* Category Select */}
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-stone-400 block font-bold">Kategori</span>
                                            <select
                                                value={uploadPresetCategory}
                                                onChange={e => setUploadPresetCategory(e.target.value)}
                                                className="w-full text-[10px] p-2 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer focus:border-[#E5654B] outline-none font-sans"
                                            >
                                                <option value="Bunga & Daun">Bunga & Daun</option>
                                                <option value="Tradisional & Wayang">Tradisional & Wayang</option>
                                                <option value="Frame & Border">Frame & Border</option>
                                                {Array.from(new Set(customPresets.map(p => p.category))).filter(c => !['Bunga & Daun', 'Tradisional & Wayang', 'Frame & Border'].includes(c)).map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="__new__">[ + Kategori Baru... ]</option>
                                            </select>
                                        </div>

                                        {/* New Category Input */}
                                        {uploadPresetCategory === '__new__' && (
                                            <div className="space-y-1 animate-in fade-in duration-200">
                                                <span className="text-[9px] text-[#E5654B] block font-bold">Nama Kategori Baru</span>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Ornamen Modern"
                                                    value={customPresetCategory}
                                                    onChange={e => setCustomPresetCategory(e.target.value)}
                                                    className="w-full text-[10px] px-2.5 py-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none focus:border-[#E5654B]"
                                                />
                                            </div>
                                        )}

                                        {/* Submit Action */}
                                        <button
                                            type="submit"
                                            disabled={isUploadingPreset || !uploadPresetFile}
                                            className="w-full py-1.5 bg-[#E5654B] hover:bg-[#c24b33] disabled:bg-zinc-800 disabled:text-stone-500 text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                                        >
                                            {isUploadingPreset ? (
                                                <>
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    <span>Mengunggah...</span>
                                                </>
                                            ) : (
                                                <span>Simpan ke Pustaka</span>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {/* Category Lists Accordion */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                                    {(() => {
                                        const finalLib = getFullLibrary().map(cat => {
                                            const items = cat.items.filter(item => 
                                                item.name.toLowerCase().includes(searchQuery.toLowerCase())
                                            );
                                            return { ...cat, items };
                                        }).filter(cat => cat.items.length > 0);

                                        if (finalLib.length === 0) {
                                            return (
                                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                                                    <ImageIcon className="h-8 w-8 text-stone-600 stroke-1" />
                                                    <div>
                                                        <p className="text-stone-300 font-bold text-xs">Tidak ada item album ditemukan</p>
                                                        <p className="text-[10px] text-stone-500 mt-0.5">Coba cari dengan kata kunci lain.</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setSearchQuery('')}
                                                        className="mt-2 text-[10px] font-bold text-[#E5654B] hover:underline"
                                                    >
                                                        Reset Pencarian
                                                    </button>
                                                </div>
                                            );
                                        }

                                        return finalLib.map(cat => {
                                            const isCollapsed = collapsedCategories[cat.category] ?? false;
                                            return (
                                                <div key={cat.category} className="space-y-2 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCategory(cat.category)}
                                                        className="w-full flex items-center justify-between text-left group"
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-white transition">
                                                                {cat.category}
                                                            </span>
                                                            <span className="text-[9px] font-mono bg-zinc-950 border border-white/5 px-1.5 py-0.5 text-[#E5654B] rounded-full font-bold">
                                                                {cat.items.length}
                                                            </span>
                                                        </div>
                                                        <ChevronDown 
                                                            className={`w-3.5 h-3.5 text-stone-450 transition-transform duration-200 ${
                                                                isCollapsed ? '-rotate-90' : 'rotate-0'
                                                            }`} 
                                                        />
                                                    </button>

                                                    {!isCollapsed && (
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {cat.items.map(item => (
                                                                <div
                                                                    key={item.name + '_' + item.url}
                                                                    onClick={() => addPresetToScene(item.url, item.name)}
                                                                    className="group relative flex flex-col items-center gap-1.5 p-2 border border-white/5 hover:border-[#E5654B] rounded-xl hover:bg-white/5 transition bg-stone-900/50 shadow-sm text-left cursor-pointer"
                                                                    title={`Klik untuk menambahkan ${item.name} ke canvas`}
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            e.preventDefault();
                                                                            addPresetToScene(item.url, item.name);
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="w-full h-16 bg-stone-950 rounded-lg overflow-hidden flex items-center justify-center border border-white/10 relative">
                                                                        <img
                                                                            src={item.url}
                                                                            alt={item.name}
                                                                            className="max-w-full max-h-full object-contain p-1 pointer-events-none group-hover:scale-105 transition-transform duration-300"
                                                                            onError={(e) => {
                                                                                e.target.src = '/images/placeholder.png';
                                                                            }}
                                                                        />
                                                                        {/* Floating Preview Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setPreviewImage(item);
                                                                            }}
                                                                            className="absolute top-1 right-1 p-1.5 bg-stone-900/90 hover:bg-[#E5654B] text-stone-300 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md cursor-pointer hover:scale-105 z-10"
                                                                            title="Lihat lebih besar"
                                                                        >
                                                                            <Eye className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    <div className="w-full flex items-center justify-between gap-1">
                                                                        <span className="text-[9px] font-bold text-stone-300 truncate flex-1 pointer-events-none">
                                                                            {item.name}
                                                                        </span>
                                                                        
                                                                        {item.isCustom && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    deleteCustomPreset(item);
                                                                                }}
                                                                                className="p-1 hover:bg-red-500/20 text-stone-500 hover:text-red-400 rounded transition cursor-pointer z-10"
                                                                                title="Hapus aset"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Viewport 3D (Center) */}
                        <div className="flex-1 h-full relative bg-[#151518] overflow-hidden flex flex-col justify-between">
                            <div 
                                ref={containerRef} 
                                className="w-full h-full cursor-grab active:cursor-grabbing relative"
                            />
                            {isolatedLayerId && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-950/95 border border-[#E5654B]/30 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 z-30 animate-in fade-in slide-in-from-top-4 duration-200">
                                    <div className="flex items-center gap-2 select-none">
                                        <span className="h-2 w-2 rounded-full bg-[#E5654B] animate-pulse" />
                                        <span className="text-xs font-semibold text-stone-300">Mode Fokus:</span>
                                        <span className="text-xs font-bold text-[#E5654B]">
                                            {data.config.layers.find(l => l.id === isolatedLayerId)?.name || 'Layer'}
                                        </span>
                                    </div>
                                    <div className="h-3 w-px bg-zinc-800" />
                                    <button
                                        type="button"
                                        onClick={() => setIsolatedLayerId(null)}
                                        className="text-[10px] font-bold text-stone-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 px-2.5 py-1.5 rounded-lg border border-white/5 transition cursor-pointer select-none"
                                    >
                                        Keluar Mode Fokus
                                    </button>
                                </div>
                            )}

                            {/* 3D Spatial Minimap Widget */}
                            <div 
                                className={`absolute top-4 right-4 z-20 flex flex-col items-stretch overflow-hidden rounded-2xl border bg-zinc-950/85 backdrop-blur-md border-white/10 shadow-2xl transition-all duration-300 ${
                                    showMinimap 
                                        ? (minimapSize === 'sm' ? 'w-[160px] h-[200px] opacity-100 pointer-events-auto scale-100' :
                                           minimapSize === 'lg' ? 'w-[320px] h-[360px] opacity-100 pointer-events-auto scale-100' :
                                           'w-[220px] h-[260px] opacity-100 pointer-events-auto scale-100')
                                        : 'w-0 h-0 opacity-0 pointer-events-none scale-95 border-none'
                                }`}
                            >
                                {/* Minimap Header */}
                                <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 select-none">
                                    <div className="flex items-center gap-1.5 text-stone-300 min-w-0">
                                        <Compass 
                                            className="w-3.5 h-3.5 text-[#E5654B] flex-shrink-0" 
                                            style={{ animation: 'spin 8s linear infinite' }}
                                        />
                                        {minimapSize !== 'sm' && (
                                            <span className="text-[10px] font-bold tracking-wide uppercase text-stone-300 truncate">Peta Spasial</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {/* Reset view camera button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (minimapCameraRef.current && minimapControlsRef.current) {
                                                    minimapCameraRef.current.position.set(10, 10, 15);
                                                    minimapControlsRef.current.target.set(0, 0, 0);
                                                    minimapControlsRef.current.update();
                                                }
                                            }}
                                            className="p-1 hover:bg-white/10 text-stone-400 hover:text-stone-200 rounded transition cursor-pointer"
                                            aria-label="Reset Sudut Pandang"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                        </button>
                                        {/* Size toggle button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMinimapSize(prev => {
                                                    if (prev === 'sm') return 'md';
                                                    if (prev === 'md') return 'lg';
                                                    return 'sm';
                                                });
                                            }}
                                            className="p-1 hover:bg-white/10 text-stone-400 hover:text-stone-200 rounded transition cursor-pointer"
                                            aria-label="Ubah Ukuran"
                                        >
                                            {minimapSize === 'lg' ? (
                                                <Minimize2 className="w-3 h-3" />
                                            ) : (
                                                <Maximize2 className="w-3 h-3" />
                                            )}
                                        </button>
                                        {/* Close button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMinimap(false);
                                            }}
                                            className="p-1 hover:bg-white/10 text-stone-400 hover:text-stone-200 rounded transition cursor-pointer"
                                            aria-label="Tutup Peta"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                {/* Minimap Canvas Container */}
                                <div className="relative flex-1 bg-stone-950/20 overflow-hidden">
                                    <canvas 
                                        ref={minimapCanvasRef} 
                                        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
                                    />
                                    {/* Compass Overlay HUD */}
                                    {minimapSize !== 'sm' && (
                                        <div className="absolute bottom-1.5 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900/60 border border-white/5 pointer-events-none select-none">
                                            <span className="text-[8px] text-stone-400 font-semibold tracking-tighter">3D PERSPECTIVE</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Show Minimap Button (Floating when closed) */}
                            {!showMinimap && (
                                <button
                                    type="button"
                                    onClick={() => setShowMinimap(true)}
                                    className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950/90 border border-white/10 hover:border-[#E5654B]/50 hover:bg-zinc-900/90 shadow-lg text-stone-300 hover:text-[#E5654B] transition cursor-pointer animate-in fade-in duration-200"
                                    aria-label="Tampilkan Peta Spasial"
                                >
                                    <Compass className="w-5 h-5" />
                                </button>
                            )}
                            

                    {/* Editor Control Sidebar (Right) */}
                    {false && !isImmersive && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col space-y-4 shadow-sm h-[500px] overflow-y-auto">
                        {/* Tabs */}
                        <div className="flex border-b border-stone-100 pb-2">
                            {['layers', 'keyframes', 'library', 'settings'].map(tab => (
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
                                    {tab === 'layers' ? 'Layer Layer' : tab === 'keyframes' ? 'Kamera Keyframe' : tab === 'library' ? 'Album' : 'Pengaturan'}
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
                                    <label className="text-xs font-bold text-stone-700">URL Musik Latar (Audio)</label>
                                    <input
                                        type="text"
                                        value={data.config.musicUrl || ''}
                                        onChange={e => {
                                            const newConfig = {
                                                ...data.config,
                                                musicUrl: e.target.value
                                            };
                                            setData('config', newConfig);
                                        }}
                                        placeholder="Contoh: /audio/backsound.mp3"
                                        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5 border-b border-stone-100 pb-2 mb-1">
                                    <label className="text-xs font-bold text-stone-700">Preset Warna Tema (Satu Klik)</label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {THEME_PRESETS.map(preset => (
                                            <button
                                                key={preset.name}
                                                type="button"
                                                onClick={() => applyThemePreset(preset)}
                                                className="flex flex-col items-center gap-1 p-1.5 border border-stone-200 hover:border-[#E5654B] rounded-xl hover:bg-stone-50 transition text-[9px] font-bold text-stone-600 bg-white"
                                            >
                                                <div 
                                                    className="w-full h-5 rounded-lg border border-stone-200 flex items-center justify-center text-[10px]"
                                                    style={{ background: GRADIENTS[preset.gradient] }}
                                                >
                                                    <span style={{ color: preset.textColor }}>Aa</span>
                                                </div>
                                                <span className="truncate max-w-full text-stone-500">{preset.name}</span>
                                            </button>
                                        ))}
                                    </div>
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
                                        <option value="leaves">Leaves (Daun Gugur)</option>
                                        <option value="rose">Rose Petals (Guguran Kelopak Mawar)</option>
                                        <option value="stars">Stars (Bintang Melayang)</option>
                                        <option value="hearts">Hearts (Hati Berjatuhan)</option>
                                        <option value="confetti">Confetti (Warna-warni)</option>
                                        <option value="butterfly">Butterflies (Kupu-kupu Melayang)</option>
                                        <option value="flower">Flower Petals (Kelopak Bunga)</option>
                                        <option value="sparkle">Sparkles (Kilauan Cahaya)</option>
                                        <option value="birds">Birds (Burung Terbang)</option>
                                    </select>
                                </div>

                                {data.config.particleType && data.config.particleType !== 'none' && (
                                    <>
                                        <div className="space-y-1 mt-2">
                                            <div className="flex justify-between items-center text-xs text-stone-700">
                                                <label className="font-bold">Jumlah Partikel</label>
                                                <span className="font-mono text-[#E5654B] bg-[#E5654B]/5 px-2 py-0.5 rounded-full font-bold">
                                                    {data.config.particleCount ?? 30} pcs
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="5"
                                                max="150"
                                                step="5"
                                                value={data.config.particleCount ?? 30}
                                                onChange={e => {
                                                    const newConfig = {
                                                        ...data.config,
                                                        particleCount: parseInt(e.target.value)
                                                    };
                                                    setData('config', newConfig);
                                                }}
                                                onMouseUp={() => saveHistoryState(data.config)}
                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E5654B]"
                                            />
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            <label className="text-xs font-bold text-stone-700">Kecepatan Partikel</label>
                                            <select
                                                value={data.config.particleSpeed || 'normal'}
                                                onChange={e => {
                                                    const newConfig = {
                                                        ...data.config,
                                                        particleSpeed: e.target.value
                                                    };
                                                    setData('config', newConfig);
                                                    saveHistoryState(newConfig);
                                                }}
                                                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-white"
                                            >
                                                <option value="slow">Lambat</option>
                                                <option value="normal">Normal</option>
                                                <option value="fast">Cepat</option>
                                            </select>
                                        </div>
                                    </>
                                )}

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

                                    {/* Global Pause Duration Control */}
                                    <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-bold text-stone-600">Durasi Berhenti (Detik)</label>
                                            <span className="text-[10px] font-mono font-bold text-[#E5654B] bg-[#E5654B]/5 px-2 py-0.5 rounded">
                                                {(data.config.keyframePauseDuration ?? 2.0).toFixed(1)}s
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.0"
                                            max="10.0"
                                            step="0.1"
                                            value={data.config.keyframePauseDuration ?? 2.0}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setData(d => ({
                                                    ...d,
                                                    config: {
                                                        ...d.config,
                                                        keyframePauseDuration: val
                                                    }
                                                }));
                                            }}
                                            className="w-full accent-[#E5654B] h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-[8px] text-stone-400">Jeda waktu di setiap titik frame saat transisi autoplay.</span>
                                    </div>

                                    {/* Camera Path Choreographer Presets */}
                                    <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-bold text-stone-600">Jalur Kamera Pintar (Presets)</label>
                                            <span className="text-[8px] font-bold text-[#E5654B] bg-[#E5654B]/5 px-1.5 py-0.5 rounded">Generator</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <select
                                                value={selectedCameraPreset}
                                                onChange={(e) => setSelectedCameraPreset(e.target.value)}
                                                className="flex-1 text-[10px] p-1.5 bg-white border border-stone-200 rounded-lg outline-none font-medium"
                                            >
                                                <option value="cinematic_zoom">Cinematic Zoom (Straight)</option>
                                                <option value="orbit_reveal">Orbit Reveal (Spiral)</option>
                                                <option value="drift_pan">Pan & Drift (Side to Side)</option>
                                                <option value="dolly_zoom">Dolly Zoom (Vertigo Effect)</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={applyCameraPreset}
                                                className="px-2.5 py-1.5 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-lg text-[9px] font-bold transition flex items-center gap-1 shadow-sm border border-[#E5654B]"
                                            >
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Terapkan
                                            </button>
                                        </div>
                                        <span className="text-[8px] text-stone-400">Men-generate keyframe gerak kamera otomatis berdasarkan Z-axis layer grup yang aktif.</span>
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
                                                    className="flex flex-col gap-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-100 rounded-xl p-2.5 transition cursor-pointer"
                                                    onClick={() => previewKeyframePosition(kf)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 bg-[#E5654B] text-white text-[10px] font-bold flex items-center justify-center rounded-full flex-shrink-0">
                                                                {idx + 1}
                                                            </span>
                                                            <div>
                                                                <p className="text-xs font-bold text-stone-700">Posisi #{idx + 1}</p>
                                                                <p className="text-[9px] text-stone-500 font-mono">
                                                                    X: {kf.position.x.toFixed(1)} | Y: {kf.position.y.toFixed(1)} | Z: {kf.position.z.toFixed(1)}
                                                                </p>
                                                                <p className="text-[9px] text-stone-500 font-mono">
                                                                    Rotasi: X: {radToDeg(kf.rotation?.x || 0)}° | Y: {radToDeg(kf.rotation?.y || 0)}° | Z: {radToDeg(kf.rotation?.z || 0)}°
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateKeyframeFromCamera(kf.id);
                                                                }}
                                                                className="p-1 text-stone-400 hover:text-sky-600 rounded transition"
                                                                title="Perbarui koordinat dari kamera saat ini"
                                                            >
                                                                <RefreshCw className="w-3.5 h-3.5" />
                                                            </button>
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
                                                    </div>

                                                    {/* Inline duration controls */}
                                                    <div className="mt-1 flex items-center gap-2 text-[9px] text-stone-600 border-t border-stone-200/50 pt-1.5" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            <span>Transisi:</span>
                                                            <input 
                                                                type="number"
                                                                min="0.1"
                                                                max="20"
                                                                step="0.5"
                                                                value={kf.transitionDuration ?? 2.0}
                                                                onChange={(e) => updateKeyframeProperty(kf.id, 'transitionDuration', parseFloat(e.target.value) || 2.0)}
                                                                className="w-10 bg-white border border-stone-200 rounded px-1 py-0.5 text-center font-mono text-stone-800 text-[9px]"
                                                            />
                                                            <span>s</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 ml-auto">
                                                            <span>Jeda:</span>
                                                            <input 
                                                                type="number"
                                                                min="0.0"
                                                                max="20"
                                                                step="0.5"
                                                                value={kf.pauseDuration ?? 2.0}
                                                                onChange={(e) => updateKeyframeProperty(kf.id, 'pauseDuration', parseFloat(e.target.value) || 0.0)}
                                                                className="w-10 bg-white border border-stone-200 rounded px-1 py-0.5 text-center font-mono text-stone-800 text-[9px]"
                                                            />
                                                            <span>s</span>
                                                        </div>
                                                    </div>
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
                                        <span className="text-xs font-bold text-stone-700">Daftar Layer Grup ({data.config.layers.length})</span>
                                        <div className="flex items-center gap-1.5">
                                            {/* Add Layer Group */}
                                            <button
                                                type="button"
                                                onClick={addLayerGroup}
                                                className="p-1.5 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition flex items-center gap-1 text-[10px] font-bold"
                                                title="Tambah Grup Layer Baru"
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>Grup</span>
                                            </button>
                                        </div>
                                    </div>

                                    {data.config.layers.length === 0 ? (
                                        <div className="bg-stone-50 border border-stone-100 rounded-xl p-6 text-center">
                                            <p className="text-xs text-stone-400">Belum ada layer grup. Tambahkan grup layer baru untuk memulai.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                                            {data.config.layers.map(layer => (
                                                <div 
                                                    key={layer.id} 
                                                    draggable
                                                    onDragStart={(e) => { 
                                                        setDraggedLayerId(layer.id); 
                                                        e.dataTransfer.setData('text/plain', layer.id); 
                                                    }}
                                                    onDragEnd={() => { 
                                                        setDraggedLayerId(null); 
                                                        setDragOverLayerId(null); 
                                                    }}
                                                    onDragOver={(e) => { 
                                                        e.preventDefault(); 
                                                        if (draggedLayerId && draggedLayerId !== layer.id) { 
                                                            setDragOverLayerId(layer.id); 
                                                        } else if (draggedContentId) {
                                                            setDragOverLayerId(layer.id);
                                                        }
                                                    }}
                                                    onDragLeave={() => setDragOverLayerId(null)}
                                                    onDrop={(e) => { 
                                                        e.preventDefault(); 
                                                        const draggedId = e.dataTransfer.getData('text/plain'); 
                                                        try {
                                                            const dragData = JSON.parse(draggedId);
                                                            if (dragData.contentId) {
                                                                handleMoveContentToLayer(dragData.layerId, dragData.contentId, layer.id);
                                                                setDraggedContentId(null);
                                                                setDraggedContentSourceLayerId(null);
                                                                setDragOverContentId(null);
                                                                setDragOverLayerId(null);
                                                                return;
                                                            }
                                                        } catch (err) {
                                                            handleReorderLayers(draggedId, layer.id);
                                                        }
                                                        setDraggedLayerId(null); 
                                                        setDragOverLayerId(null); 
                                                    }}
                                                    className={`border rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-150 ${
                                                        dragOverLayerId === layer.id 
                                                            ? 'border-[#E5654B] bg-[#E5654B]/5 scale-[0.98]' 
                                                             : 'border-stone-200'
                                                     } ${draggedLayerId === layer.id ? 'opacity-40' : ''}`}
                                                 >
                                                    {/* Group Row */}
                                                    <div 
                                                        onClick={() => {
                                                            setSelectedLayerId(layer.id);
                                                            setSelectedContentId(null);
                                                        }}
                                                        className={`flex items-center justify-between p-2 text-xs transition cursor-pointer ${
                                                            selectedLayerId === layer.id && selectedContentId === null
                                                                ? 'bg-stone-50 border-b border-stone-100 text-[#E5654B]'
                                                                : 'hover:bg-stone-50 text-stone-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Layers className="w-3.5 h-3.5 text-stone-400" />
                                                            <span className="font-bold truncate">{layer.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {/* Settings Action */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedLayerId(layer.id);
                                                                    setSelectedContentId(null);
                                                                    setActiveLayerSettingsId(layer.id);
                                                                    setActiveSettingsTab('position');
                                                                }}
                                                                className="p-1 text-stone-400 hover:text-stone-600 rounded transition"
                                                                title="Pengaturan Layer"
                                                            >
                                                                <Settings className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const nextLocked = !layer.locked;
                                                                    updateLayerProperty(layer.id, 'locked', nextLocked);
                                                                    saveHistoryState(data.config);
                                                                    if (nextLocked && selectedLayerId === layer.id) {
                                                                        setSelectedLayerId(null);
                                                                        setSelectedContentId(null);
                                                                    }
                                                                }}
                                                                className={`p-1 rounded transition ${layer.locked ? 'text-[#E5654B] hover:text-[#e5654bd0]' : 'text-stone-400 hover:text-stone-600'}`}
                                                                title={layer.locked ? "Buka Kunci Layer" : "Kunci Layer"}
                                                            >
                                                                {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                                            </button>

                                                            {/* Focus Action */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const isCurrentlyIsolated = isolatedLayerId === layer.id;
                                                                    if (isCurrentlyIsolated) {
                                                                        setIsolatedLayerId(null);
                                                                    } else {
                                                                        setIsolatedLayerId(layer.id);
                                                                        setSelectedLayerId(layer.id);
                                                                        setSelectedContentId(null);
                                                                        focusCameraOnLayer(layer);
                                                                    }
                                                                }}
                                                                className={`p-1 rounded transition ${isolatedLayerId === layer.id ? 'text-[#E5654B] bg-[#E5654B]/10 hover:bg-[#E5654B]/20' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
                                                                title={isolatedLayerId === layer.id ? "Matikan Mode Fokus (Isolasi)" : "Nyalakan Mode Fokus (Isolasi)"}
                                                            >
                                                                <Focus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateLayerProperty(layer.id, 'visible', !layer.visible);
                                                                    saveHistoryState(data.config);
                                                                }}
                                                                className="p-1 text-stone-400 hover:text-stone-600 rounded transition"
                                                            >
                                                                {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if(confirm('Hapus grup layer ini?')) {
                                                                        deleteLayer(layer.id);
                                                                    }
                                                                }}
                                                                className="p-1 text-stone-400 hover:text-red-500 rounded transition"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Nested content items */}
                                                    <div className="bg-stone-50/50 p-1.5 space-y-1 pl-4 border-t border-stone-100">
                                                        {layer.contents && layer.contents.map((content, contentIdx) => {
                                                            const isFirst = contentIdx === 0;
                                                            const isLast = contentIdx === layer.contents.length - 1;
                                                            return (
                                                                <div
                                                                    key={content.id}
                                                                    draggable
                                                                    onDragStart={(e) => {
                                                                        e.stopPropagation();
                                                                        setDraggedContentId(content.id);
                                                                        setDraggedContentSourceLayerId(layer.id);
                                                                        e.dataTransfer.setData('text/plain', JSON.stringify({ layerId: layer.id, contentId: content.id }));
                                                                    }}
                                                                    onDragEnd={() => {
                                                                        setDraggedContentId(null);
                                                                        setDraggedContentSourceLayerId(null);
                                                                        setDragOverContentId(null);
                                                                    }}
                                                                    onDragOver={(e) => {
                                                                        e.preventDefault();
                                                                        if (draggedContentId && draggedContentId !== content.id) {
                                                                            setDragOverContentId(content.id);
                                                                        }
                                                                    }}
                                                                    onDragLeave={() => setDragOverContentId(null)}
                                                                    onDrop={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        try {
                                                                            const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                                                                            if (dragData.contentId) {
                                                                                handleMoveContentToLayer(dragData.layerId, dragData.contentId, layer.id, content.id);
                                                                            }
                                                                        } catch(err) {
                                                                            console.error(err);
                                                                        }
                                                                        setDraggedContentId(null);
                                                                        setDraggedContentSourceLayerId(null);
                                                                        setDragOverContentId(null);
                                                                    }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedLayerId(layer.id);
                                                                        setSelectedContentId(content.id);
                                                                    }}
                                                                    className={`flex items-center justify-between p-1.5 rounded-lg border text-[11px] transition cursor-pointer ${
                                                                        selectedLayerId === layer.id && selectedContentId === content.id
                                                                            ? 'bg-[#E5654B]/10 border-[#E5654B] text-[#E5654B]'
                                                                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                                                                    } ${draggedContentId === content.id ? 'opacity-40' : ''} ${
                                                                        dragOverContentId === content.id ? 'border-[#E5654B] scale-[0.98]' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-1.5 truncate mr-2 flex-1">
                                                                        {content.type === 'text' ? (
                                                                            <Type className="w-3 h-3 text-[#E5654B]" />
                                                                        ) : (
                                                                            <img 
                                                                                src={content.url} 
                                                                                alt={content.name || 'Image'} 
                                                                                className="w-4 h-4 rounded object-contain bg-stone-100" 
                                                                            />
                                                                        )}
                                                                        <span className="truncate">{content.name || (content.type === 'text' ? content.text : 'Gambar')}</span>
                                                                    </div>

                                                                    {/* Inline Action Buttons */}
                                                                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                        {/* Settings Action */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedLayerId(layer.id);
                                                                                setSelectedContentId(content.id);
                                                                                setActiveComponentSettingsInfo({ layerId: layer.id, contentId: content.id });
                                                                                setActiveSettingsTab('position');
                                                                            }}
                                                                            className="p-0.5 text-stone-400 hover:text-stone-600 rounded transition"
                                                                            title="Pengaturan Komponen"
                                                                        >
                                                                            <Settings className="w-3 h-3" />
                                                                        </button>
                                                                        {/* Lock Action */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const nextLocked = !content.locked;
                                                                                updateContentProperty(layer.id, content.id, 'locked', nextLocked);
                                                                                if (nextLocked && selectedContentId === content.id) {
                                                                                    setSelectedContentId(null);
                                                                                }
                                                                            }}
                                                                            className={`p-0.5 rounded transition ${content.locked ? 'text-[#E5654B] hover:text-[#e5654bd0]' : 'text-stone-400 hover:text-stone-600'}`}
                                                                            title={content.locked ? "Buka Kunci Komponen" : "Kunci Komponen"}
                                                                        >
                                                                            {content.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                                        </button>

                                                                        {/* Move Up */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMoveContent(layer.id, content.id, 'up')}
                                                                            disabled={isFirst}
                                                                            className={`p-0.5 rounded transition ${isFirst ? 'opacity-20 cursor-not-allowed' : 'text-stone-400 hover:text-stone-600'}`}
                                                                            title="Geser ke Atas"
                                                                        >
                                                                            <ArrowUp className="w-3 h-3" />
                                                                        </button>

                                                                        {/* Move Down */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleMoveContent(layer.id, content.id, 'down')}
                                                                            disabled={isLast}
                                                                            className={`p-0.5 rounded transition ${isLast ? 'opacity-20 cursor-not-allowed' : 'text-stone-400 hover:text-stone-600'}`}
                                                                            title="Geser ke Bawah"
                                                                        >
                                                                            <ArrowDown className="w-3 h-3" />
                                                                        </button>

                                                                        {/* Copy / Duplicate */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDuplicateContent(layer.id, content.id)}
                                                                            className="p-0.5 text-stone-400 hover:text-stone-600 rounded transition"
                                                                            title="Duplikat Komponen"
                                                                        >
                                                                            <Copy className="w-3 h-3" />
                                                                        </button>

                                                                        {/* Delete Action */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (confirm('Hapus komponen ini?')) {
                                                                                    deleteContentFromLayer(layer.id, content.id);
                                                                                }
                                                                            }}
                                                                            className="p-0.5 text-stone-450 hover:text-red-500 rounded transition"
                                                                            title="Hapus Komponen"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                        {/* Actions inside group - Tidy + Tambah popover */}
                                                        <div className="pt-1.5 flex justify-end add-menu-container">
                                                            <div className="relative">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveAddMenuLayerId(activeAddMenuLayerId === layer.id ? null : layer.id);
                                                                    }}
                                                                    className="flex items-center gap-1 text-[10px] font-bold text-stone-500 hover:text-[#E5654B] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg border border-stone-250 transition"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                    <span>Tambah</span>
                                                                </button>

                                                                {activeAddMenuLayerId === layer.id && (
                                                                    <div className="absolute right-full bottom-0 mr-1.5 w-32 bg-white border border-stone-200 rounded-xl shadow-xl p-1 z-50 animate-in fade-in slide-in-from-right-2 duration-100 flex flex-col">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                addContentToLayer(layer.id, 'text');
                                                                                setActiveAddMenuLayerId(null);
                                                                            }}
                                                                            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-stone-50 text-[9px] font-bold text-stone-750 hover:text-stone-900 rounded-lg transition text-left"
                                                                        >
                                                                            <Plus className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                            <span>+ Teks</span>
                                                                        </button>
                                                                        
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedLayerId(layer.id);
                                                                                setSelectedContentId(null);
                                                                                setActiveTab('library');
                                                                                setActiveAddMenuLayerId(null);
                                                                            }}
                                                                            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-stone-50 text-[9px] font-bold text-stone-750 hover:text-stone-900 rounded-lg transition text-left cursor-pointer"
                                                                        >
                                                                            <ImageIcon className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                            <span>Pilih dari Album</span>
                                                                        </button>

                                                                        <label className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-stone-50 text-[9px] font-bold text-stone-750 hover:text-stone-900 rounded-lg transition cursor-pointer text-left">
                                                                            <Upload className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                            <span>Unggah Gambar</span>
                                                                            <input 
                                                                                type="file" 
                                                                                accept="image/*" 
                                                                                className="hidden" 
                                                                                onChange={async (e) => {
                                                                                    const file = e.target.files[0];
                                                                                    if (!file) return;
                                                                                    const formData = new FormData();
                                                                                    formData.append('file', file);
                                                                                    setActiveAddMenuLayerId(null);
                                                                                    try {
                                                                                        const response = await axios.post('/super-admin/three-d-scenes/upload-asset', formData, {
                                                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                                                        });
                                                                                        if (response.data.success) {
                                                                                            addContentToLayer(layer.id, 'upload', response.data.url);
                                                                                        }
                                                                                    } catch (err) {
                                                                                        console.error(err);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </label>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedLayerId(layer.id);
                                                                                setShowDrawingPad(true);
                                                                                setActiveAddMenuLayerId(null);
                                                                            }}
                                                                            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-stone-50 text-[9px] font-bold text-stone-750 hover:text-stone-900 rounded-lg transition text-left"
                                                                        >
                                                                            <Brush className="w-2.5 h-2.5 text-[#E5654B]" />
                                                                            <span>Lukis</span>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Properties Inspector Panel */}
                                {false && selectedLayer && (
                                    <div className="border-t border-stone-100 pt-3 space-y-3">
                                        <div className="flex items-center justify-between border-b border-stone-50 pb-1.5">
                                            <div>
                                                <span className="text-xs font-bold text-[#E5654B] block">
                                                    {selectedContent ? `Komponen: ${selectedContent.name}` : `Grup: ${selectedLayer.name}`}
                                                </span>
                                                <span className="text-[9px] text-stone-400">
                                                    {selectedContent ? `${selectedContent.type.toUpperCase()} di ${selectedLayer.name}` : 'Layer Group Posisi'}
                                                </span>
                                            </div>
                                            {selectedContent && selectedContent.type === 'upload' && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        disabled={isReplacingImage}
                                                        onClick={() => replaceImageInputRef.current?.click()}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-700 rounded-lg text-[9px] font-bold transition shadow-sm border border-stone-250"
                                                    >
                                                        <Upload className="w-3 h-3" />
                                                        <span>{isReplacingImage ? 'Mengunggah...' : 'Ganti Gambar'}</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isReplacingImage}
                                                        onClick={() => openBgRemover(selectedContent)}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E5654B] hover:bg-[#c24b33] disabled:opacity-50 text-white rounded-lg text-[9px] font-bold transition shadow-sm border border-[#E5654B]"
                                                    >
                                                        <Scissors className="w-3 h-3" />
                                                        <span>Hapus Latar</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Specific Properties */}
                                        {selectedContent && (
                                            <div className="space-y-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-150 text-[10px] text-stone-600">
                                                {/* Interactive Action Field (Raycaster Click Actions) */}
                                                <div className="space-y-1 pb-2 border-b border-stone-150">
                                                    <span className="font-bold text-stone-500">Aksi Klik Interaktif (3D Hotspot)</span>
                                                    <select
                                                        value={selectedContent.action || ''}
                                                        onChange={e => {
                                                            updateContentProperty(selectedLayer.id, selectedContent.id, 'action', e.target.value || null);
                                                            saveHistoryState(data.config);
                                                        }}
                                                        className="w-full text-[10px] p-1.5 bg-white border border-stone-200 rounded-lg outline-none font-medium cursor-pointer"
                                                    >
                                                        <option value="">-- Tidak Ada --</option>
                                                        <option value="rsvp">Buka Formulir RSVP</option>
                                                        <option value="wishes">Buka Buku Tamu (Ucapan)</option>
                                                        <option value="checkin">Buka QR Code Check-in</option>
                                                        <option value="map">Buka Peta Lokasi (Google Maps)</option>
                                                    </select>
                                                </div>

                                                {/* Text Component properties */}
                                                {selectedContent.type === 'text' && (
                                                    <>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-bold text-stone-500">Hubungkan ke Data Form</span>
                                                                {selectedContent.dataBinding && (
                                                                    <span className="bg-[#E5654B]/10 text-[#E5654B] px-1 rounded text-[8px] font-bold">Terhubung</span>
                                                                )}
                                                            </div>
                                                            <select
                                                                value={selectedContent.dataBinding || ''}
                                                                onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'dataBinding', e.target.value || null)}
                                                                className="w-full text-[10px] p-1.5 bg-white border border-stone-200 rounded-lg outline-none font-medium"
                                                            >
                                                                <option value="">-- Kustom (Bukan Data Form) --</option>
                                                                {Object.keys(DATA_BINDING_LABELS).map(key => (
                                                                    <option key={key} value={key}>{DATA_BINDING_LABELS[key]}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <span className="font-bold text-stone-500">Konten Teks</span>
                                                            <textarea
                                                                rows={2}
                                                                value={selectedContent.text || ''}
                                                                onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'text', e.target.value)}
                                                                onBlur={() => saveHistoryState(data.config)}
                                                                disabled={!!selectedContent.dataBinding}
                                                                className="w-full text-xs p-1.5 bg-white border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none transition disabled:bg-stone-100 disabled:text-stone-400"
                                                                placeholder="Tulis teks..."
                                                            />
                                                            {selectedContent.dataBinding && (
                                                                <p className="text-[8px] text-[#E5654B]">Konten diisi dinamis dari database (Placeholder: {`{{${selectedContent.dataBinding}}}`})</p>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-stone-500">Jenis Font</span>
                                                                <select
                                                                    value={selectedContent.fontFamily || 'Playfair Display'}
                                                                    onChange={e => {
                                                                        updateContentProperty(selectedLayer.id, selectedContent.id, 'fontFamily', e.target.value);
                                                                        saveHistoryState(data.config);
                                                                    }}
                                                                    className="w-full text-xs p-1 bg-white border border-stone-200 rounded-lg outline-none cursor-pointer"
                                                                    style={{ fontFamily: selectedContent.fontFamily || 'Playfair Display' }}
                                                                >
                                                                    {AVAILABLE_FONTS.map(font => (
                                                                        <option
                                                                            key={font.name}
                                                                            value={font.name}
                                                                            className="text-black bg-white"
                                                                            style={{ fontFamily: font.style }}
                                                                        >
                                                                            {font.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <span className="font-bold text-stone-500">Warna Teks</span>
                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    <input
                                                                        type="color"
                                                                        value={selectedContent.color || '#E5654B'}
                                                                        onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'color', e.target.value)}
                                                                        onBlur={() => saveHistoryState(data.config)}
                                                                        className="w-5 h-5 p-0 border border-stone-200 rounded cursor-pointer bg-transparent"
                                                                    />
                                                                    <span className="font-mono text-[8px] text-stone-400">{selectedContent.color}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-stone-500">Ukuran ({selectedContent.fontSize || 64}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="24"
                                                                    max="128"
                                                                    step="4"
                                                                    value={selectedContent.fontSize || 64}
                                                                    onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'fontSize', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <span className="font-bold text-stone-500">Gaya & Tebal</span>
                                                                <div className="flex gap-1 mt-0.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const nextVal = selectedContent.fontWeight === 'bold' ? 'normal' : 'bold';
                                                                            updateContentProperty(selectedLayer.id, selectedContent.id, 'fontWeight', nextVal);
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className={`flex-1 py-0.5 rounded text-[9px] font-bold border transition ${
                                                                            selectedContent.fontWeight === 'bold'
                                                                                ? 'bg-stone-850 text-white border-stone-850'
                                                                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                                                                        }`}
                                                                    >
                                                                        B
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const nextVal = selectedContent.fontStyle === 'italic' ? 'normal' : 'italic';
                                                                            updateContentProperty(selectedLayer.id, selectedContent.id, 'fontStyle', nextVal);
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className={`flex-1 py-0.5 rounded text-[9px] italic border transition ${
                                                                            selectedContent.fontStyle === 'italic'
                                                                                ? 'bg-stone-850 text-white border-stone-850'
                                                                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                                                                        }`}
                                                                    >
                                                                        I
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Text Effects Section */}
                                                        <div className="border-t border-stone-200/60 pt-2 mt-2 space-y-2">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-stone-500">Efek Teks</span>
                                                                <select
                                                                    value={selectedContent.textEffect || 'none'}
                                                                    onChange={e => {
                                                                        updateContentProperty(selectedLayer.id, selectedContent.id, 'textEffect', e.target.value);
                                                                        saveHistoryState(data.config);
                                                                    }}
                                                                    className="w-full text-xs p-1.5 bg-white border border-stone-200 rounded-lg outline-none cursor-pointer"
                                                                >
                                                                    <option value="none">Tanpa Efek</option>
                                                                    <option value="shadow">Shadow (Bayangan)</option>
                                                                    <option value="double_shadow">Double Shadow (Bayangan Ganda)</option>
                                                                    <option value="neon">Neon / Glow (Kustom)</option>
                                                                    <option value="neon_pink">Neon Pink</option>
                                                                    <option value="neon_blue">Neon Biru</option>
                                                                    <option value="outline">Outline (Garis Tepi)</option>
                                                                    <option value="outline_shadow">Outline & Shadow</option>
                                                                    <option value="3d">Teks 3D / Extrusion</option>
                                                                    <option value="gradient_fill">Gradasi Warna</option>
                                                                </select>
                                                            </div>

                                                            {(selectedContent.textEffect === 'shadow' || selectedContent.textEffect === 'double_shadow' || selectedContent.textEffect === 'outline_shadow') && (
                                                                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Warna Bayangan</span>
                                                                        <input
                                                                            type="color"
                                                                            value={selectedContent.shadowColor || 'rgba(0,0,0,0.5)'}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'shadowColor', e.target.value)}
                                                                            onBlur={() => saveHistoryState(data.config)}
                                                                            className="w-full h-6 p-0 border border-stone-250 rounded cursor-pointer bg-transparent"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Blur ({selectedContent.shadowBlur ?? 8}px)</span>
                                                                        <input
                                                                            type="range"
                                                                            min="0"
                                                                            max="30"
                                                                            value={selectedContent.shadowBlur ?? 8}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'shadowBlur', parseInt(e.target.value))}
                                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                                            className="w-full accent-[#E5654B]"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Jarak X ({selectedContent.shadowOffsetX ?? 4}px)</span>
                                                                        <input
                                                                            type="range"
                                                                            min="-20"
                                                                            max="20"
                                                                            value={selectedContent.shadowOffsetX ?? 4}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'shadowOffsetX', parseInt(e.target.value))}
                                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                                            className="w-full accent-[#E5654B]"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Jarak Y ({selectedContent.shadowOffsetY ?? 4}px)</span>
                                                                        <input
                                                                            type="range"
                                                                            min="-20"
                                                                            max="20"
                                                                            value={selectedContent.shadowOffsetY ?? 4}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'shadowOffsetY', parseInt(e.target.value))}
                                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                                            className="w-full accent-[#E5654B]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedContent.textEffect === 'double_shadow' && (
                                                                <div className="grid grid-cols-1 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Warna Bayangan Kedua</span>
                                                                        <input
                                                                            type="color"
                                                                            value={selectedContent.secondShadowColor || 'rgba(229, 101, 75, 0.3)'}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'secondShadowColor', e.target.value)}
                                                                            onBlur={() => saveHistoryState(data.config)}
                                                                            className="w-full h-6 p-0 border border-stone-250 rounded cursor-pointer bg-transparent"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedContent.textEffect === 'neon' && (
                                                                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Warna Glow</span>
                                                                        <input
                                                                            type="color"
                                                                            value={selectedContent.glowColor || selectedContent.color || '#E5654B'}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'glowColor', e.target.value)}
                                                                            onBlur={() => saveHistoryState(data.config)}
                                                                            className="w-full h-6 p-0 border border-stone-250 rounded cursor-pointer bg-transparent"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Intensitas ({selectedContent.glowBlur ?? 20}px)</span>
                                                                        <input
                                                                            type="range"
                                                                            min="5"
                                                                            max="50"
                                                                            value={selectedContent.glowBlur ?? 20}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'glowBlur', parseInt(e.target.value))}
                                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                                            className="w-full accent-[#E5654B]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {(selectedContent.textEffect === 'neon_pink' || selectedContent.textEffect === 'neon_blue') && (
                                                                <div className="grid grid-cols-1 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Intensitas ({selectedContent.glowBlur ?? 20}px)</span>
                                                                        <input
                                                                            type="range"
                                                                            min="5"
                                                                            max="50"
                                                                            value={selectedContent.glowBlur ?? 20}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'glowBlur', parseInt(e.target.value))}
                                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                                            className="w-full accent-[#E5654B]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {(selectedContent.textEffect === 'outline' || selectedContent.textEffect === 'outline_shadow') && (
                                                                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Warna Outline</span>
                                                                        <input
                                                                            type="color"
                                                                            value={selectedContent.strokeColor || '#000000'}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'strokeColor', e.target.value)}
                                                                            onBlur={() => saveHistoryState(data.config)}
                                                                            className="w-full h-6 p-0 border border-stone-250 rounded cursor-pointer bg-transparent"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Ketebalan ({selectedContent.strokeWidth ?? 6}px)</span>
                                                                        <input
                                                                            type="range"
                                                                            min="1"
                                                                            max="20"
                                                                            value={selectedContent.strokeWidth ?? 6}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'strokeWidth', parseInt(e.target.value))}
                                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                                            className="w-full accent-[#E5654B]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedContent.textEffect === '3d' && (
                                                                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Warna 3D</span>
                                                                        <input
                                                                            type="color"
                                                                            value={selectedContent.extrusionColor || '#222222'}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'extrusionColor', e.target.value)}
                                                                            onBlur={() => saveHistoryState(data.config)}
                                                                            className="w-full h-6 p-0 border border-stone-250 rounded cursor-pointer bg-transparent"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Ketebalan ({selectedContent.extrusionDepth ?? 8}px)</span>
                                                                        <input
                                                                            type="range"
                                                                            min="1"
                                                                            max="25"
                                                                            value={selectedContent.extrusionDepth ?? 8}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'extrusionDepth', parseInt(e.target.value))}
                                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                                            className="w-full accent-[#E5654B]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedContent.textEffect === 'gradient_fill' && (
                                                                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Warna Mulai</span>
                                                                        <input
                                                                            type="color"
                                                                            value={selectedContent.color || '#E5654B'}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'color', e.target.value)}
                                                                            onBlur={() => saveHistoryState(data.config)}
                                                                            className="w-full h-6 p-0 border border-stone-250 rounded cursor-pointer bg-transparent"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="font-bold text-[10px] text-stone-500">Warna Selesai</span>
                                                                        <input
                                                                            type="color"
                                                                            value={selectedContent.gradientColor || '#ffffff'}
                                                                            onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'gradientColor', e.target.value)}
                                                                            onBlur={() => saveHistoryState(data.config)}
                                                                            className="w-full h-6 p-0 border border-stone-250 rounded cursor-pointer bg-transparent"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Local Component offsets & local scale relative to the group container */}
                                                <div className="border-t border-stone-200/60 pt-2 mt-2 space-y-2">
                                                    <span className="font-bold text-stone-500 block">Posisi Lokal Komponen (Offset)</span>
                                                    
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Offset X</span>
                                                                <span className="font-bold text-[#E5654B]">{selectedContent.position.x}</span>
                                                            </div>
                                                            <input 
                                                                type="range" min="-5" max="5" step="0.1"
                                                                value={selectedContent.position.x}
                                                                onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'position', { ...selectedContent.position, x: parseFloat(e.target.value) })}
                                                                onMouseUp={() => saveHistoryState(data.config)}
                                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                                className="w-full accent-[#E5654B]"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Offset Y</span>
                                                                <span className="font-bold text-[#E5654B]">{selectedContent.position.y}</span>
                                                            </div>
                                                            <input 
                                                                type="range" min="-5" max="5" step="0.1"
                                                                value={selectedContent.position.y}
                                                                onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'position', { ...selectedContent.position, y: parseFloat(e.target.value) })}
                                                                onMouseUp={() => saveHistoryState(data.config)}
                                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                                className="w-full accent-[#E5654B]"
                                                            />
                                                        </div>
                                                        <div className="space-y-1 col-span-2">
                                                            <div className="flex justify-between">
                                                                <span>Offset Z (Tumpukan Lokal)</span>
                                                                <span className="font-bold text-[#E5654B]">{selectedContent.position.z}</span>
                                                            </div>
                                                            <input 
                                                                type="range" min="-2" max="2" step="0.1"
                                                                value={selectedContent.position.z}
                                                                onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'position', { ...selectedContent.position, z: parseFloat(e.target.value) })}
                                                                onMouseUp={() => saveHistoryState(data.config)}
                                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                                className="w-full accent-[#E5654B]"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Lebar Lokal</span>
                                                                <span className="font-bold text-[#E5654B]">{selectedContent.scale.x}</span>
                                                            </div>
                                                            <input 
                                                                type="range" min="0.2" max="5" step="0.1"
                                                                value={selectedContent.scale.x}
                                                                onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'scale', { ...selectedContent.scale, x: parseFloat(e.target.value) })}
                                                                onMouseUp={() => saveHistoryState(data.config)}
                                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                                className="w-full accent-[#E5654B]"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Tinggi Lokal</span>
                                                                <span className="font-bold text-[#E5654B]">{selectedContent.scale.y}</span>
                                                            </div>
                                                            <input 
                                                                type="range" min="0.2" max="5" step="0.1"
                                                                value={selectedContent.scale.y}
                                                                onChange={e => updateContentProperty(selectedLayer.id, selectedContent.id, 'scale', { ...selectedContent.scale, y: parseFloat(e.target.value) })}
                                                                onMouseUp={() => saveHistoryState(data.config)}
                                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                                className="w-full accent-[#E5654B]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Global Position Controls of Parent Group */}
                                        <div className="space-y-2 border border-stone-200/50 p-2 rounded-2xl">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 border-b border-stone-100 pb-1">
                                                <span>Grup Layer: Posisi Utama (Global)</span>
                                                <span className="text-[#E5654B]">{selectedLayer.name}</span>
                                            </div>

                                            <div className="space-y-1">
                                                <span className="font-bold text-stone-500 block text-[9px]">Nama Grup</span>
                                                <input
                                                    type="text"
                                                    value={selectedLayer.name || ''}
                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'name', e.target.value)}
                                                    onBlur={() => saveHistoryState(data.config)}
                                                    className="w-full text-xs p-1.5 bg-white border border-stone-200 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                {/* Z Position (Kedalaman / Parallax) */}
                                                <div className="col-span-2 space-y-1">
                                                    <div className="flex justify-between font-bold text-stone-500">
                                                        <span>Kedalaman (Z-axis / Parallax)</span>
                                                        <span>{selectedLayer.position.z}</span>
                                                    </div>
                                                    <input 
                                                        type="range"
                                                        min="-25"
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

                                                {/* Section: Animasi Idle Immersive */}
                                                <div className="border-t border-stone-200 pt-2 col-span-2 space-y-2">
                                                    <span className="font-bold text-stone-700">Animasi Idle</span>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-stone-500">Gaya Gerak</span>
                                                        <select
                                                            value={selectedLayer.animationType || 'none'}
                                                            onChange={e => {
                                                                updateLayerProperty(selectedLayer.id, 'animationType', e.target.value);
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-xs p-1.5 bg-white border border-stone-200 text-stone-850 rounded-lg outline-none cursor-pointer"
                                                        >
                                                            <option value="none">Tidak Ada</option>
                                                            <option value="float">Melayang (Float)</option>
                                                            <option value="spin">Berputar (Spin)</option>
                                                            <option value="pulse">Denyut (Pulse)</option>
                                                            <option value="swing">Goyang (Swing)</option>
                                                            <option value="bounce">Memantul (Bounce)</option>
                                                            <option value="wiggle">Bergetar (Wiggle)</option>
                                                            <option value="wave">Gelombang (Wave)</option>
                                                            <option value="heartbeat">Detak Jantung (Heartbeat)</option>
                                                            <option value="flicker">Berkedip (Flicker)</option>
                                                            <option value="spinY">Putar 3D - Y (Spin Y)</option>
                                                            <option value="flipX">Flip 3D - X (Flip X)</option>
                                                        </select>
                                                    </div>

                                                    {selectedLayer.animationType && selectedLayer.animationType !== 'none' && (
                                                        <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2 rounded-lg border border-stone-150">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[10px] text-stone-500">Kecepatan ({(selectedLayer.animationSpeed ?? 1.0).toFixed(1)}x)</span>
                                                                <input
                                                                    type="range"
                                                                    min="0.1"
                                                                    max="5.0"
                                                                    step="0.1"
                                                                    value={selectedLayer.animationSpeed ?? 1.0}
                                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'animationSpeed', parseFloat(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[10px] text-stone-500">Intensitas ({(selectedLayer.animationIntensity ?? 1.0).toFixed(1)}x)</span>
                                                                <input
                                                                    type="range"
                                                                    min="0.1"
                                                                    max="5.0"
                                                                    step="0.1"
                                                                    value={selectedLayer.animationIntensity ?? 1.0}
                                                                    onChange={e => updateLayerProperty(selectedLayer.id, 'animationIntensity', parseFloat(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Section: Efek In-Out Immersive */}
                                                <div className="border-t border-stone-200 pt-2 col-span-2 space-y-2">
                                                    <span className="font-bold text-stone-700">Efek Transisi (In/Out)</span>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-stone-505">Tipe Transisi</span>
                                                        <select
                                                            value={selectedLayer.fadeMode || 'none'}
                                                            onChange={e => {
                                                                const mode = e.target.value;
                                                                const kfCount = data.config?.keyframes?.length || 0;
                                                                const activeKf = kfCount > 0 ? Math.max(0, Math.min(kfCount - 1, Math.round(currentCameraProgressRef.current * (kfCount - 1)))) : 0;
                                                                
                                                                updateLayerProperty(selectedLayer.id, 'fadeMode', mode);
                                                                if (mode === 'show_at_keyframe' || mode === 'fade_in_from') {
                                                                    updateLayerProperty(selectedLayer.id, 'fadeInStart', activeKf);
                                                                } else if (mode === 'fade_out_at') {
                                                                    updateLayerProperty(selectedLayer.id, 'fadeOutStart', activeKf);
                                                                } else if (mode === 'custom' || mode === 'keyframe') {
                                                                    updateLayerProperty(selectedLayer.id, 'fadeInStart', activeKf);
                                                                    updateLayerProperty(selectedLayer.id, 'fadeInEnd', Math.min(kfCount - 1, activeKf + 1));
                                                                    updateLayerProperty(selectedLayer.id, 'fadeOutStart', Math.min(kfCount - 1, activeKf + 2));
                                                                    updateLayerProperty(selectedLayer.id, 'fadeOutEnd', Math.min(kfCount - 1, activeKf + 3));
                                                                }
                                                                const isExit = mode === 'fade_out_at';
                                                                triggerTransitionPreview(selectedLayer.id, isExit ? 'exit' : 'entry');
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-xs p-1.5 bg-white border border-stone-200 text-stone-850 rounded-lg outline-none cursor-pointer focus:border-[#E5654B]"
                                                        >
                                                            <option value="none">Selalu Muncul</option>
                                                            <option value="show_at_keyframe">Muncul di Keyframe Aktif</option>
                                                            <option value="fade_in_from">Hanya Muncul (Fade In)</option>
                                                            <option value="fade_out_at">Hanya Hilang (Fade Out)</option>
                                                            <option value="custom">Kustom (Rentang Keyframe)</option>
                                                        </select>
                                                    </div>

                                                    {selectedLayer.fadeMode && selectedLayer.fadeMode !== 'none' && (
                                                         <div className="bg-stone-50 p-2 rounded-lg border border-stone-150 space-y-2 col-span-2">
                                                             {data.config.keyframes.length < 2 ? (
                                                                 <p className="text-[9px] text-[#E5654B]">Butuh minimal 2 keyframe kamera untuk mengatur transisi.</p>
                                                             ) : (
                                                                 <div className="space-y-2">
                                                                     <div className="grid grid-cols-2 gap-2 border-b border-stone-200 pb-2">
                                                                         <div className="space-y-1">
                                                                             <span className="font-bold text-[10px] text-stone-500">Durasi ({(selectedLayer.transitionDuration ?? 1.0).toFixed(1)}s)</span>
                                                                             <input
                                                                                 type="range"
                                                                                 min="0.1"
                                                                                 max="3.0"
                                                                                 step="0.1"
                                                                                 value={selectedLayer.transitionDuration ?? 1.0}
                                                                                 onChange={e => {
                                                                                     updateLayerProperty(selectedLayer.id, 'transitionDuration', parseFloat(e.target.value));
                                                                                 }}
                                                                                 onMouseUp={() => {
                                                                                     saveHistoryState(data.config);
                                                                                     const isExit = selectedLayer.fadeMode === 'fade_out_at';
                                                                                     triggerTransitionPreview(selectedLayer.id, isExit ? 'exit' : 'entry');
                                                                                 }}
                                                                                 className="w-full accent-[#E5654B]"
                                                                             />
                                                                         </div>
                                                                         <div className="space-y-1">
                                                                             <span className="font-bold text-[10px] text-stone-500">Intensitas ({(selectedLayer.transitionIntensity ?? 1.0).toFixed(1)}x)</span>
                                                                             <input
                                                                                 type="range"
                                                                                 min="0.1"
                                                                                 max="3.0"
                                                                                 step="0.1"
                                                                                 value={selectedLayer.transitionIntensity ?? 1.0}
                                                                                 onChange={e => {
                                                                                     updateLayerProperty(selectedLayer.id, 'transitionIntensity', parseFloat(e.target.value));
                                                                                 }}
                                                                                 onMouseUp={() => {
                                                                                     saveHistoryState(data.config);
                                                                                     const isExit = selectedLayer.fadeMode === 'fade_out_at';
                                                                                     triggerTransitionPreview(selectedLayer.id, isExit ? 'exit' : 'entry');
                                                                                 }}
                                                                                 className="w-full accent-[#E5654B]"
                                                                             />
                                                                         </div>
                                                                     </div>

                                                                    {(selectedLayer.fadeMode === 'show_at_keyframe' || selectedLayer.fadeMode === 'fade_in_from') && (
                                                                        <div className="space-y-1 flex flex-col">
                                                                            <span className="text-stone-550 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                                            <select
                                                                                value={selectedLayer.fadeInStart ?? 0}
                                                                                onChange={e => {
                                                                                    const val = parseInt(e.target.value);
                                                                                    updateLayerProperty(selectedLayer.id, 'fadeInStart', val);
                                                                                    saveHistoryState(data.config);
                                                                                }}
                                                                                className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                            >
                                                                                {data.config.keyframes.map((_, i) => (
                                                                                    <option key={i} value={i} className="bg-white text-stone-800 font-sans">Keyframe #{i + 1}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    )}

                                                                    {selectedLayer.fadeMode === 'fade_out_at' && (
                                                                        <div className="space-y-1 flex flex-col">
                                                                            <span className="text-stone-550 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                                            <select
                                                                                value={selectedLayer.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                                                onChange={e => {
                                                                                    const val = parseInt(e.target.value);
                                                                                    updateLayerProperty(selectedLayer.id, 'fadeOutStart', val);
                                                                                    saveHistoryState(data.config);
                                                                                }}
                                                                                className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                            >
                                                                                {data.config.keyframes.map((_, i) => (
                                                                                    <option key={i} value={i} className="bg-white text-stone-800 font-sans">Keyframe #{i + 1}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    )}

                                                                    {(selectedLayer.fadeMode === 'custom' || selectedLayer.fadeMode === 'keyframe') && (
                                                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                                            <div className="space-y-1 flex flex-col">
                                                                                <span className="text-stone-550 text-[9px] font-bold">Mulai Muncul</span>
                                                                                <select
                                                                                    value={selectedLayer.fadeInStart ?? 0}
                                                                                    onChange={e => {
                                                                                        updateLayerProperty(selectedLayer.id, 'fadeInStart', parseInt(e.target.value));
                                                                                        saveHistoryState(data.config);
                                                                                    }}
                                                                                    className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                                >
                                                                                    {data.config.keyframes.map((_, i) => (
                                                                                        <option key={i} value={i} className="bg-white text-stone-800 font-sans">Keyframe #{i + 1}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div className="space-y-1 flex flex-col">
                                                                                <span className="text-stone-550 text-[9px] font-bold">Selesai Muncul</span>
                                                                                <select
                                                                                    value={selectedLayer.fadeInEnd ?? 0}
                                                                                    onChange={e => {
                                                                                        updateLayerProperty(selectedLayer.id, 'fadeInEnd', parseInt(e.target.value));
                                                                                        saveHistoryState(data.config);
                                                                                    }}
                                                                                    className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                                >
                                                                                    {data.config.keyframes.map((_, i) => (
                                                                                        <option key={i} value={i} className="bg-white text-stone-800 font-sans">Keyframe #{i + 1}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div className="space-y-1 flex flex-col">
                                                                                <span className="text-stone-550 text-[9px] font-bold">Mulai Hilang</span>
                                                                                <select
                                                                                    value={selectedLayer.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                                                    onChange={e => {
                                                                                        updateLayerProperty(selectedLayer.id, 'fadeOutStart', parseInt(e.target.value));
                                                                                        saveHistoryState(data.config);
                                                                                    }}
                                                                                    className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                                >
                                                                                    {data.config.keyframes.map((_, i) => (
                                                                                        <option key={i} value={i} className="bg-white text-stone-800 font-sans">Keyframe #{i + 1}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div className="space-y-1 flex flex-col">
                                                                                <span className="text-stone-550 text-[9px] font-bold">Selesai Hilang</span>
                                                                                <select
                                                                                    value={selectedLayer.fadeOutEnd ?? (data.config.keyframes.length - 1)}
                                                                                    onChange={e => {
                                                                                        updateLayerProperty(selectedLayer.id, 'fadeOutEnd', parseInt(e.target.value));
                                                                                        saveHistoryState(data.config);
                                                                                    }}
                                                                                    className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                                >
                                                                                    {data.config.keyframes.map((_, i) => (
                                                                                        <option key={i} value={i} className="bg-white text-stone-800 font-sans">Keyframe #{i + 1}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="border-t border-stone-200 pt-2 space-y-2">
                                                                        {(selectedLayer.fadeMode === 'show_at_keyframe' || selectedLayer.fadeMode === 'fade_in_from' || selectedLayer.fadeMode === 'custom' || selectedLayer.fadeMode === 'keyframe') && (
                                                                            <div className="space-y-1">
                                                                                <span className="text-stone-550 text-[9px] font-bold block">Animasi Masuk</span>
                                                                                <select
                                                                                    value={selectedLayer.entryAnim || 'fade'}
                                                                                    onChange={e => {
                                                                                        updateLayerProperty(selectedLayer.id, 'entryAnim', e.target.value);
                                                                                        triggerTransitionPreview(selectedLayer.id, 'entry');
                                                                                        saveHistoryState(data.config);
                                                                                    }}
                                                                                    className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                                >
                                                                                    <option value="fade">Memudar</option>
                                                                                    <option value="slide_up">Geser Naik</option>
                                                                                    <option value="slide_down">Geser Turun</option>
                                                                                    <option value="slide_left">Geser Kiri</option>
                                                                                    <option value="slide_right">Geser Kanan</option>
                                                                                    <option value="zoom_in">Skala Besar</option>
                                                                                    <option value="zoom_out">Skala Kecil</option>
                                                                                    <option value="rotate">Berputar</option>
                                                                                </select>
                                                                            </div>
                                                                        )}

                                                                        {(selectedLayer.fadeMode === 'show_at_keyframe' || selectedLayer.fadeMode === 'fade_out_at' || selectedLayer.fadeMode === 'custom' || selectedLayer.fadeMode === 'keyframe') && (
                                                                            <div className="space-y-1">
                                                                                <span className="text-stone-550 text-[9px] font-bold block">Animasi Keluar</span>
                                                                                <select
                                                                                    value={selectedLayer.exitAnim || 'fade'}
                                                                                    onChange={e => {
                                                                                        updateLayerProperty(selectedLayer.id, 'exitAnim', e.target.value);
                                                                                        triggerTransitionPreview(selectedLayer.id, 'exit');
                                                                                        saveHistoryState(data.config);
                                                                                    }}
                                                                                    className="w-full text-[10px] p-1.5 bg-white border border-stone-200 text-stone-800 rounded-md cursor-pointer font-sans"
                                                                                >
                                                                                    <option value="fade">Memudar</option>
                                                                                    <option value="slide_up">Geser Naik</option>
                                                                                    <option value="slide_down">Geser Turun</option>
                                                                                    <option value="slide_left">Geser Kiri</option>
                                                                                    <option value="slide_right">Geser Kanan</option>
                                                                                    <option value="zoom_in">Skala Besar</option>
                                                                                    <option value="zoom_out">Skala Kecil</option>
                                                                                    <option value="rotate">Berputar</option>
                                                                                </select>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Tab Content: Preset Library */}
                        {activeTab === 'library' && (
                            <div className="flex-1 flex flex-col space-y-4">
                                <div className="border-b border-stone-50 pb-2">
                                    <span className="text-xs font-bold text-stone-700">Album</span>
                                    <p className="text-[10px] text-stone-400 mt-1">Cari, filter, dan kelola item album untuk kanvas 3D Anda.</p>
                                </div>

                                {/* Search and Upload Toggle Bar */}
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari album..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full text-xs pl-8 pr-7 py-2 bg-stone-50 border border-stone-200 text-stone-700 rounded-xl outline-none focus:border-[#E5654B] transition-all font-sans"
                                        />
                                        {searchQuery && (
                                            <button 
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-2.5 top-2.5 text-stone-405 hover:text-stone-700"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowPresetUploadForm(!showPresetUploadForm)}
                                        className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                                            showPresetUploadForm 
                                                ? 'bg-[#E5654B] border-[#E5654B] text-white' 
                                                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-850 hover:border-[#E5654B]'
                                        }`}
                                        title="Unggah Aset Baru"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Upload Form Panel */}
                                {showPresetUploadForm && (
                                    <form onSubmit={handleCustomPresetUpload} className="p-3 bg-stone-50 border border-stone-100 rounded-xl space-y-3 animate-in slide-in-from-top duration-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5654B]">Unggah Album Baru</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPresetUploadForm(false)}
                                                className="text-stone-400 hover:text-stone-650"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                        
                                        {/* File Picker Zone */}
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-stone-500 block font-bold">File Gambar (PNG/JPG/WEBP)</span>
                                            <div 
                                                className="border border-dashed border-stone-300 rounded-xl p-3 bg-white text-center hover:border-[#E5654B]/50 transition cursor-pointer relative"
                                                onClick={() => document.getElementById('preset-file-input-tab').click()}
                                            >
                                                <input
                                                    id="preset-file-input-tab"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setUploadPresetFile(file);
                                                            if (!uploadPresetName) {
                                                                setUploadPresetName(file.name.replace(/\.[^/.]+$/, ""));
                                                            }
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                                {uploadPresetFile ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <ImageIcon className="h-4 w-4 text-[#E5654B]" />
                                                        <span className="text-[10px] text-stone-700 font-medium truncate max-w-[180px]">
                                                            {uploadPresetFile.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1 text-stone-400 border-none p-0 bg-transparent">
                                                        <Upload className="h-4 w-4 mx-auto text-stone-500" />
                                                        <p className="text-[9px] font-medium text-stone-500">Klik untuk memilih file</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Name Input */}
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-stone-500 block font-bold">Nama Aset</span>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Bunga Mawar Merah"
                                                value={uploadPresetName}
                                                onChange={e => setUploadPresetName(e.target.value)}
                                                className="w-full text-[10px] px-2.5 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg outline-none focus:border-[#E5654B]"
                                            />
                                        </div>

                                        {/* Category Select */}
                                        <div className="space-y-1">
                                            <span className="text-[9px] text-stone-500 block font-bold">Kategori</span>
                                            <select
                                                value={uploadPresetCategory}
                                                onChange={e => setUploadPresetCategory(e.target.value)}
                                                className="w-full text-[10px] p-2 bg-white border border-stone-200 text-stone-700 rounded-lg cursor-pointer focus:border-[#E5654B] outline-none font-sans"
                                            >
                                                <option value="Bunga & Daun">Bunga & Daun</option>
                                                <option value="Tradisional & Wayang">Tradisional & Wayang</option>
                                                <option value="Frame & Border">Frame & Border</option>
                                                {Array.from(new Set(customPresets.map(p => p.category))).filter(c => !['Bunga & Daun', 'Tradisional & Wayang', 'Frame & Border'].includes(c)).map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="__new__">[ + Kategori Baru... ]</option>
                                            </select>
                                        </div>

                                        {/* New Category Input */}
                                        {uploadPresetCategory === '__new__' && (
                                            <div className="space-y-1 animate-in fade-in duration-200">
                                                <span className="text-[9px] text-[#E5654B] block font-bold">Nama Kategori Baru</span>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Ornamen Modern"
                                                    value={customPresetCategory}
                                                    onChange={e => setCustomPresetCategory(e.target.value)}
                                                    className="w-full text-[10px] px-2.5 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg outline-none focus:border-[#E5654B]"
                                                />
                                            </div>
                                        )}

                                        {/* Submit Action */}
                                        <button
                                            type="submit"
                                            disabled={isUploadingPreset || !uploadPresetFile}
                                            className="w-full py-1.5 bg-[#E5654B] hover:bg-[#c24b33] disabled:bg-stone-200 disabled:text-stone-400 text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            {isUploadingPreset ? (
                                                <>
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    <span>Mengunggah...</span>
                                                </>
                                            ) : (
                                                <span>Simpan ke Pustaka</span>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {/* Category Lists Accordion */}
                                <div className="space-y-4 flex-1">
                                    {(() => {
                                        const finalLib = getFullLibrary().map(cat => {
                                            const items = cat.items.filter(item => 
                                                item.name.toLowerCase().includes(searchQuery.toLowerCase())
                                            );
                                            return { ...cat, items };
                                        }).filter(cat => cat.items.length > 0);

                                        if (finalLib.length === 0) {
                                            return (
                                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                                                    <ImageIcon className="h-8 w-8 text-stone-300 stroke-1" />
                                                    <div>
                                                        <p className="text-stone-700 font-bold text-xs">Tidak ada item album ditemukan</p>
                                                        <p className="text-[10px] text-stone-400 mt-0.5">Coba cari dengan kata kunci lain.</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setSearchQuery('')}
                                                        className="mt-2 text-[10px] font-bold text-[#E5654B] hover:underline cursor-pointer"
                                                    >
                                                        Reset Pencarian
                                                    </button>
                                                </div>
                                            );
                                        }

                                        return finalLib.map(cat => {
                                            const isCollapsed = collapsedCategories[cat.category] ?? false;
                                            return (
                                                <div key={cat.category} className="space-y-2 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCategory(cat.category)}
                                                        className="w-full flex items-center justify-between text-left group cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 group-hover:text-stone-850 transition">
                                                                {cat.category}
                                                            </span>
                                                            <span className="text-[9px] font-mono bg-stone-50 border border-stone-100 px-1.5 py-0.5 text-[#E5654B] rounded-full font-bold">
                                                                {cat.items.length}
                                                            </span>
                                                        </div>
                                                        <ChevronDown 
                                                            className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                                                                isCollapsed ? '-rotate-90' : 'rotate-0'
                                                            }`} 
                                                        />
                                                    </button>

                                                    {!isCollapsed && (
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {cat.items.map(item => (                                                                <div
                                                                    key={item.name + '_' + item.url}
                                                                    onClick={() => addPresetToScene(item.url, item.name)}
                                                                    className="group relative flex flex-col items-center gap-1.5 p-2 border border-stone-200 hover:border-[#E5654B] rounded-xl hover:bg-stone-50 transition bg-white shadow-sm text-left cursor-pointer"
                                                                    title={`Klik untuk menambahkan ${item.name}`}
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            e.preventDefault();
                                                                            addPresetToScene(item.url, item.name);
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="w-full h-16 bg-stone-50 rounded-lg overflow-hidden flex items-center justify-center border border-stone-100 relative">
                                                                        <img
                                                                            src={item.url}
                                                                            alt={item.name}
                                                                            className="max-w-full max-h-full object-contain p-1 pointer-events-none group-hover:scale-105 transition-transform duration-300"
                                                                            onError={(e) => {
                                                                                e.target.src = '/images/placeholder.png';
                                                                            }}
                                                                        />
                                                                        {/* Floating Preview Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setPreviewImage(item);
                                                                            }}
                                                                            className="absolute top-1 right-1 p-1.5 bg-white/90 hover:bg-[#E5654B] text-stone-600 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md cursor-pointer hover:scale-105 z-10"
                                                                            title="Lihat lebih besar"
                                                                        >
                                                                            <Eye className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    <div className="w-full flex items-center justify-between gap-1">
                                                                        <span className="text-[9px] font-bold text-stone-600 truncate flex-1 pointer-events-none">
                                                                            {item.name}
                                                                        </span>
                                                                        
                                                                        {item.isCustom && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    deleteCustomPreset(item);
                                                                                }}
                                                                                className="p-1 hover:bg-red-500/10 text-stone-400 hover:text-red-500 rounded transition cursor-pointer z-10"
                                                                                title="Hapus aset"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>

            {/* Canvas Custom Right-Click Context Menu */}
            {contextMenu.show && createPortal(
                <div 
                    className="absolute z-[100] bg-stone-900/95 backdrop-blur-md border border-white/10 rounded-2xl py-2 px-1.5 shadow-2xl w-56 text-white text-xs flex flex-col select-none"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    {contextMenu.contentId ? (() => {
                        const currentLayer = data.config.layers.find(l => l.id === contextMenu.layerId);
                        const contentItem = currentLayer?.contents?.find(c => c.id === contextMenu.contentId);
                        if (!contentItem) return null;
                        
                        const isLocked = contentItem.locked;
                        const isVisible = contentItem.visible !== false;
                        
                        return (
                            <>
                                <div className="px-3 py-1 text-[10px] text-stone-400 font-semibold border-b border-white/5 mb-1.5 flex items-center gap-1.5">
                                    {contentItem.type === 'text' ? <Type className="w-3 h-3 text-[#E5654B]" /> : <ImageIcon className="w-3 h-3 text-[#E5654B]" />}
                                    <span className="truncate max-w-[150px]">{contentItem.name}</span>
                                </div>

                                <button type="button" onClick={() => {
                                    setSelectedLayerId(contextMenu.layerId);
                                    setSelectedContentId(contextMenu.contentId);
                                    setActiveComponentSettingsInfo({ layerId: contextMenu.layerId, contentId: contextMenu.contentId });
                                    setContextMenu(prev => ({ ...prev, show: false }));
                                }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                    <Settings className="w-3.5 h-3.5 text-stone-300" />
                                    Edit Komponen
                                </button>
                                
                                <button type="button" onClick={() => {
                                    handleDuplicateContent(contextMenu.layerId, contextMenu.contentId);
                                    setContextMenu(prev => ({ ...prev, show: false }));
                                }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                    <Copy className="w-3.5 h-3.5 text-stone-300" />
                                    Duplikat Elemen
                                </button>

                                <button type="button" onClick={() => {
                                    updateContentProperty(contextMenu.layerId, contextMenu.contentId, 'locked', !isLocked);
                                    if (!isLocked && selectedContentId === contextMenu.contentId) {
                                        setSelectedContentId(null);
                                    }
                                    setContextMenu(prev => ({ ...prev, show: false }));
                                }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                    {isLocked ? <Unlock className="w-3.5 h-3.5 text-stone-300" /> : <Lock className="w-3.5 h-3.5 text-stone-300" />}
                                    {isLocked ? 'Buka Kunci Elemen' : 'Kunci Elemen'}
                                </button>

                                <button type="button" onClick={() => {
                                    toggleContentVisibility(contextMenu.layerId, contextMenu.contentId);
                                    setContextMenu(prev => ({ ...prev, show: false }));
                                }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                    {isVisible ? <EyeOff className="w-3.5 h-3.5 text-stone-300" /> : <Eye className="w-3.5 h-3.5 text-stone-300" />}
                                    {isVisible ? 'Sembunyikan Elemen' : 'Tampilkan Elemen'}
                                </button>

                                <div className="h-px bg-white/5 my-1" />

                                <button type="button" onClick={() => {
                                    handleContextMenuMoveContentZ(contextMenu.layerId, contextMenu.contentId, 1);
                                    setContextMenu(prev => ({ ...prev, show: false }));
                                }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                    <ArrowUp className="w-3.5 h-3.5 text-stone-300" />
                                    Bawa ke Depan (Z+)
                                </button>

                                <button type="button" onClick={() => {
                                    handleContextMenuMoveContentZ(contextMenu.layerId, contextMenu.contentId, -1);
                                    setContextMenu(prev => ({ ...prev, show: false }));
                                }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                    <ArrowDown className="w-3.5 h-3.5 text-stone-300" />
                                    Kirim ke Belakang (Z-)
                                </button>

                                <div className="h-px bg-white/5 my-1" />

                                <button type="button" onClick={() => {
                                    if (confirm('Hapus elemen komponen ini?')) {
                                        deleteContentFromLayer(contextMenu.layerId, contextMenu.contentId);
                                    }
                                    setContextMenu(prev => ({ ...prev, show: false }));
                                }} className="w-full text-left px-3 py-2 hover:bg-red-650 rounded-lg text-red-400 hover:text-white transition flex items-center gap-2">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Hapus Elemen
                                </button>
                            </>
                        );
                    })() : contextMenu.layerId ? (
                        <>
                            <div className="px-3 py-1 text-[10px] text-stone-400 font-semibold border-b border-white/5 mb-1.5 flex items-center gap-1.5">
                                <Layers className="w-3 h-3 text-[#E5654B]" />
                                <span>Layer Group</span>
                            </div>
                            <button type="button" onClick={() => {
                                handleContextMenuDuplicateLayer(contextMenu.layerId);
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <Copy className="w-3.5 h-3.5 text-stone-300" />
                                Duplikat Grup Layer
                            </button>
                            <button type="button" onClick={() => {
                                handleContextMenuMoveLayerZ(contextMenu.layerId, 1);
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <ArrowUp className="w-3.5 h-3.5 text-stone-300" />
                                Pindahkan ke Depan (Z+)
                            </button>
                            <button type="button" onClick={() => {
                                handleContextMenuMoveLayerZ(contextMenu.layerId, -1);
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <ArrowDown className="w-3.5 h-3.5 text-stone-300" />
                                Pindahkan ke Belakang (Z-)
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button type="button" onClick={() => {
                                const currentLayer = data.config.layers.find(l => l.id === contextMenu.layerId);
                                if (currentLayer && confirm(`Hapus grup layer "${currentLayer.name}"?`)) {
                                    deleteLayer(contextMenu.layerId);
                                }
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-red-650 rounded-lg text-red-400 hover:text-white transition flex items-center gap-2">
                                <Trash2 className="w-3.5 h-3.5" />
                                Hapus Grup Layer
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={() => {
                                handleContextMenuAddTextUnified();
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <Type className="w-3.5 h-3.5 text-stone-300" />
                                Tambah Teks Baru
                            </button>
                            <button type="button" onClick={() => {
                                if (addImageInputRef.current) addImageInputRef.current.click();
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5 text-stone-300" />
                                Tambah Gambar Baru
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button type="button" onClick={() => {
                                handleEditorUndo();
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <Undo2 className="w-3.5 h-3.5 text-stone-300" />
                                Undo (Batal)
                            </button>
                            <button type="button" onClick={() => {
                                handleEditorRedo();
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <Redo2 className="w-3.5 h-3.5 text-stone-300" />
                                Redo (Ulang)
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button type="button" onClick={() => {
                                resetCameraToDefault();
                                setContextMenu(prev => ({ ...prev, show: false }));
                            }} className="w-full text-left px-3 py-2 hover:bg-[#E5654B] rounded-lg transition flex items-center gap-2">
                                <Home className="w-3.5 h-3.5 text-stone-300" />
                                Reset Pandangan Kamera
                            </button>
                        </>
                    )}
                </div>,
                document.body
            )}

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
                                onClick={() => closeBgRemover()}
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
                                            onClick={() => closeBgRemover()}
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
            {/* Image Preview Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <div 
                        className="bg-[#1c1c1f]/95 border border-white/10 rounded-2xl max-w-lg w-full p-5 text-white shadow-2xl relative overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Glowing backdrop decorator */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#E5654B]/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 relative z-10">
                            <h3 className="text-sm font-bold tracking-wide truncate max-w-[80%]">{previewImage.name}</h3>
                            <button 
                                onClick={() => setPreviewImage(null)}
                                className="p-1 hover:bg-white/5 rounded-lg text-stone-400 hover:text-white transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Large Image View */}
                        <div className="relative z-10 bg-zinc-950 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[250px] max-h-[400px] p-4">
                            <img
                                src={previewImage.url}
                                alt={previewImage.name}
                                className="max-w-full max-h-[350px] object-contain rounded-lg"
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.png';
                                }}
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-2 relative z-10">
                            <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    addPresetToScene(previewImage.url, previewImage.name);
                                    setPreviewImage(null);
                                }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                            >
                                Tambahkan ke Kanvas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Export Config Modal */}
            {showExportConfig && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1c1c1f]/95 border border-white/10 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden">
                        {/* Glowing backdrop decorator */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#E5654B]/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <div className="flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-[#E5654B]" />
                                    <h3 className="text-sm font-bold tracking-wide">Konfigurasi Ekspor Video</h3>
                                </div>
                                <button 
                                    onClick={() => setShowExportConfig(false)}
                                    className="p-1 hover:bg-white/5 rounded-lg text-stone-400 hover:text-white transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-[11px] text-stone-400 text-left">
                                Sesuaikan kualitas rekaman video kanvas 3D Anda. Hasil rekaman akan diselaraskan secara otomatis dengan audio latar secara real-time.
                            </p>

                            {/* Form Fields */}
                            <div className="space-y-4 my-2 text-left">
                                {/* Frame Rate Setting */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">Frame Rate (Kehalusan)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setExportSettings(prev => ({ ...prev, fps: 60 }))}
                                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                                exportSettings.fps === 60
                                                    ? 'border-[#E5654B] bg-[#E5654B]/10 text-white'
                                                    : 'border-white/10 bg-zinc-950/40 text-stone-400 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-sm">60 FPS</span>
                                            <span className="text-[9px] font-normal opacity-80">Sangat Mulus (Rekomendasi)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setExportSettings(prev => ({ ...prev, fps: 30 }))}
                                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                                exportSettings.fps === 30
                                                    ? 'border-[#E5654B] bg-[#E5654B]/10 text-white'
                                                    : 'border-white/10 bg-zinc-950/40 text-stone-400 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-sm">30 FPS</span>
                                            <span className="text-[9px] font-normal opacity-80">Standar (File Lebih Kecil)</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Resolution Quality Setting */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">Resolusi Kualitas</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setExportSettings(prev => ({ ...prev, quality: 'low' }))}
                                            className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                                                exportSettings.quality === 'low'
                                                    ? 'border-[#E5654B] bg-[#E5654B]/10 text-white'
                                                    : 'border-white/10 bg-zinc-950/40 text-stone-400 hover:border-white/20'
                                            }`}
                                        >
                                            <span>Rendah</span>
                                            <span className="text-[8px] font-normal opacity-80">0.5x Resolusi</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setExportSettings(prev => ({ ...prev, quality: 'high' }))}
                                            className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                                                exportSettings.quality === 'high'
                                                    ? 'border-[#E5654B] bg-[#E5654B]/10 text-white'
                                                    : 'border-white/10 bg-zinc-950/40 text-stone-400 hover:border-white/20'
                                            }`}
                                        >
                                            <span>Normal</span>
                                            <span className="text-[8px] font-normal opacity-80">1.0x Resolusi</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setExportSettings(prev => ({ ...prev, quality: 'ultra' }))}
                                            className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                                                exportSettings.quality === 'ultra'
                                                    ? 'border-[#E5654B] bg-[#E5654B]/10 text-white'
                                                    : 'border-white/10 bg-zinc-950/40 text-stone-400 hover:border-white/20'
                                            }`}
                                        >
                                            <span>Tajam</span>
                                            <span className="text-[8px] font-normal opacity-80">1.5x (Super Crispy)</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Bitrate Quality Setting */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">Kekuatan Bitrate (Kepadatan Gambar)</label>
                                    <select
                                        value={exportSettings.bitrate}
                                        onChange={(e) => setExportSettings(prev => ({ ...prev, bitrate: parseInt(e.target.value) }))}
                                        className="w-full text-xs px-3 py-2 bg-[#151518] border border-white/10 rounded-xl outline-none focus:border-[#E5654B] text-white cursor-pointer"
                                    >
                                        <option value={2500000}>Rendah (2.5 Mbps) - Gambar Ringan</option>
                                        <option value={5000000}>Sedang (5.0 Mbps)</option>
                                        <option value={8000000}>Tinggi (8.0 Mbps) - Standar Youtube / Sosmed</option>
                                        <option value={12000000}>Ultra Tinggi (12.0 Mbps) - Kualitas Terbaik</option>
                                    </select>
                                </div>
                            </div>

                            {/* Estimasi Detail Box */}
                            <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3.5 space-y-2 text-xs text-left">
                                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                                    <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Durasi Video</span>
                                    <span className="font-semibold text-stone-200">{getEstimatedDuration()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-1.5">
                                    <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Estimasi Ukuran File</span>
                                    <span className="font-mono font-bold text-emerald-400">{getEstimatedFileSize(exportSettings)}</span>
                                </div>
                                <p className="text-[9px] text-stone-500 leading-relaxed italic">
                                    *Ukuran file sebenarnya dapat bervariasi tergantung kompleksitas visual 3D scene dan kemampuan kompresi encoder browser Anda.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setShowExportConfig(false)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 rounded-xl text-xs font-bold transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowExportConfig(false);
                                        handleVideoExport(exportSettings);
                                    }}
                                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                                >
                                    Mulai Rekam & Ekspor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Export Progress Modal */}
            {isExporting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1c1c1f]/95 border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center text-white shadow-2xl relative overflow-hidden">
                        {/* Glowing backdrop decorator */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        {!exportResult ? (
                            // Exporting Progress Screen
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                {/* Animated exporting spinner */}
                                <div className="relative flex items-center justify-center w-16 h-16">
                                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" />
                                    <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold tracking-wide">Mengekspor Scene 3D</h3>
                                    <p className="text-[10px] text-stone-400 mt-1">Sedang memproses video frame-by-frame untuk hasil 100% mulus...</p>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full mt-2">
                                    <div className="flex justify-between items-center text-xs font-mono font-bold text-stone-300 mb-1">
                                        <span>Kemajuan</span>
                                        <span className="text-emerald-400">{exportProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-stone-850 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className="h-full bg-emerald-500 transition-all duration-100 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                                            style={{ width: `${exportProgress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Current size */}
                                <div className="flex justify-between w-full text-[10px] text-stone-400 border-t border-white/5 pt-2 mt-1">
                                    <span>Ukuran Sementara:</span>
                                    <span className="font-mono text-emerald-400 font-bold">{formatBytes(recordedBytes)}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={cancelVideoExport}
                                    className="mt-2 px-4 py-1.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-stone-300 border border-white/10 rounded-xl text-[10px] font-bold transition duration-200"
                                >
                                    Batal Ekspor
                                </button>
                            </div>
                        ) : (
                            // Export Completed Screen
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <div className="relative flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                                    <Check className="w-8 h-8 text-emerald-400 animate-bounce" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold tracking-wide">Ekspor Video Selesai!</h3>
                                    <p className="text-[10px] text-stone-400 mt-1">Video Anda telah berhasil direkam dan diunduh secara otomatis.</p>
                                </div>

                                <div className="w-full bg-zinc-950/50 border border-white/5 rounded-xl p-3.5 space-y-2 text-left text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-stone-400">Nama File:</span>
                                        <span className="font-semibold text-stone-200 truncate max-w-[180px]">{exportResult.filename}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-400">Ukuran Akhir:</span>
                                        <span className="font-mono font-bold text-emerald-400">{exportResult.sizeStr}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-400">Kualitas:</span>
                                        <span className="capitalize text-stone-200">
                                            {exportSettings.quality === 'low' ? 'Rendah (0.5x)' : exportSettings.quality === 'high' ? 'Normal (1.0x)' : 'Tajam (1.5x)'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-400">Frame Rate:</span>
                                        <span className="text-stone-200">{exportSettings.fps} FPS</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = exportResult.url;
                                            a.download = exportResult.filename;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        }}
                                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Unduh Lagi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsExporting(false);
                                            setExportResult(null);
                                        }}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 rounded-xl text-xs font-bold transition cursor-pointer"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Layer Settings Popup Modal */}
            {false && activeLayerSettingsId && (() => {
                const layer = data.config.layers.find(l => l.id === activeLayerSettingsId);
                if (!layer) return null;

                return (
                    <div 
                        ref={layerPopupRef}
                        style={{ 
                            left: `${layerPopupPos.x}px`, 
                            top: `${layerPopupPos.y}px`
                        }}
                        className="fixed z-50 bg-[#18181b] text-white border border-white/10 rounded-2xl w-[380px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
                    >
                            {/* Header */}
                            <div 
                                onMouseDown={handleLayerMouseDown}
                                className="bg-stone-900 border-b border-white/5 px-5 py-4 flex items-center justify-between cursor-move select-none"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-[#E5654B]" />
                                    <h3 className="text-xs font-bold text-stone-200">Pengaturan Grup Layer: {layer.name}</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveLayerSettingsId(null)}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white rounded-lg transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tab Headers */}
                            <div className="flex border-b border-white/5 bg-stone-950/40 p-1 gap-1">
                                {[
                                    { id: 'position', label: 'Posisi', icon: SlidersHorizontal },
                                    { id: 'animation', label: 'Animasi', icon: Play },
                                    { id: 'transition', label: 'Transisi', icon: Sparkles }
                                ].map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeSettingsTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveSettingsTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] font-bold rounded-lg transition ${
                                                isActive 
                                                    ? 'bg-[#E5654B] text-white' 
                                                    : 'hover:bg-white/5 text-stone-400 hover:text-stone-200'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Scrollable Tab Content */}
                            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
                                {activeSettingsTab === 'position' && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="font-bold text-stone-400 text-[10px]">Nama Grup Layer</span>
                                            <input
                                                type="text"
                                                value={layer.name || ''}
                                                onChange={e => {
                                                    updateLayerProperty(layer.id, 'name', e.target.value);
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2 bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition"
                                            />
                                        </div>

                                        {/* Z Parallax */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                <span>Kedalaman (Z-axis / Parallax)</span>
                                                <span className="text-[#E5654B]">{layer.position.z}</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min="-25"
                                                max="5"
                                                step="0.5"
                                                value={layer.position.z}
                                                onChange={e => updateLayerProperty(layer.id, 'position', { ...layer.position, z: parseFloat(e.target.value) })}
                                                onMouseUp={() => saveHistoryState(data.config)}
                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                className="w-full accent-[#E5654B]"
                                            />
                                        </div>

                                        {/* X Axis */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                <span>Geser X (Horizontal)</span>
                                                <span className="text-[#E5654B]">{layer.position.x}</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min="-8"
                                                max="8"
                                                step="0.2"
                                                value={layer.position.x}
                                                onChange={e => updateLayerProperty(layer.id, 'position', { ...layer.position, x: parseFloat(e.target.value) })}
                                                onMouseUp={() => saveHistoryState(data.config)}
                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                className="w-full accent-[#E5654B]"
                                            />
                                        </div>

                                        {/* Y Axis */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                <span>Geser Y (Vertikal)</span>
                                                <span className="text-[#E5654B]">{layer.position.y}</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min="-8"
                                                max="8"
                                                step="0.2"
                                                value={layer.position.y}
                                                onChange={e => updateLayerProperty(layer.id, 'position', { ...layer.position, y: parseFloat(e.target.value) })}
                                                onMouseUp={() => saveHistoryState(data.config)}
                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                className="w-full accent-[#E5654B]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-1">
                                            {/* Width Scale */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                    <span>Skala Lebar</span>
                                                    <span className="text-[#E5654B]">{layer.scale.x}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="0.1"
                                                    max="10"
                                                    step="0.1"
                                                    value={layer.scale.x}
                                                    onChange={e => updateLayerProperty(layer.id, 'scale', { ...layer.scale, x: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>

                                            {/* Height Scale */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                    <span>Skala Tinggi</span>
                                                    <span className="text-[#E5654B]">{layer.scale.y}</span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min="0.1"
                                                    max="10"
                                                    step="0.1"
                                                    value={layer.scale.y}
                                                    onChange={e => updateLayerProperty(layer.id, 'scale', { ...layer.scale, y: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>
                                        </div>

                                        {/* Z Rotation */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                <span>Rotasi Z (Derajat)</span>
                                                <span className="text-[#E5654B]">{layer.rotation?.z || 0}°</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min="-180"
                                                max="180"
                                                step="5"
                                                value={layer.rotation?.z || 0}
                                                onChange={e => updateLayerProperty(layer.id, 'rotation', { ...layer.rotation, z: parseFloat(e.target.value) })}
                                                onMouseUp={() => saveHistoryState(data.config)}
                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                className="w-full accent-[#E5654B]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeSettingsTab === 'animation' && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-stone-400 block font-bold">Gaya Gerak (Continuous Idle Effect)</span>
                                            <select
                                                value={layer.animationType || 'none'}
                                                onChange={e => {
                                                    updateLayerProperty(layer.id, 'animationType', e.target.value);
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2 bg-stone-900 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                            >
                                                <option value="none">Tidak Ada</option>
                                                <option value="float">Melayang (Float)</option>
                                                <option value="spin">Berputar (Spin)</option>
                                                <option value="pulse">Denyut (Pulse)</option>
                                                <option value="swing">Goyang (Swing)</option>
                                                <option value="bounce">Memantul (Bounce)</option>
                                                <option value="wiggle">Bergetar (Wiggle)</option>
                                                <option value="wave">Gelombang (Wave)</option>
                                                <option value="heartbeat">Detak Jantung (Heartbeat)</option>
                                                <option value="flicker">Berkedip (Flicker)</option>
                                                <option value="spinY">Putar 3D - Y (Spin Y)</option>
                                                <option value="flipX">Flip 3D - X (Flip X)</option>
                                            </select>
                                        </div>

                                        {layer.animationType && layer.animationType !== 'none' && (
                                            <div className="bg-stone-950 p-3.5 rounded-xl border border-white/5 space-y-4">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Kecepatan ({(layer.animationSpeed ?? 1.0).toFixed(1)}x)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="5.0"
                                                        step="0.1"
                                                        value={layer.animationSpeed ?? 1.0}
                                                        onChange={e => updateLayerProperty(layer.id, 'animationSpeed', parseFloat(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Intensitas ({(layer.animationIntensity ?? 1.0).toFixed(1)}x)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="5.0"
                                                        step="0.1"
                                                        value={layer.animationIntensity ?? 1.0}
                                                        onChange={e => updateLayerProperty(layer.id, 'animationIntensity', parseFloat(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeSettingsTab === 'transition' && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-stone-400 block font-bold">Tipe Transisi (In/Out)</span>
                                            <select
                                                value={layer.fadeMode || 'none'}
                                                onChange={e => {
                                                    const mode = e.target.value;
                                                    const kfCount = data.config?.keyframes?.length || 0;
                                                    const activeKf = kfCount > 0 ? Math.max(0, Math.min(kfCount - 1, Math.round(currentCameraProgressRef.current * (kfCount - 1)))) : 0;
                                                    
                                                    updateLayerProperty(layer.id, 'fadeMode', mode);
                                                    if (mode === 'show_at_keyframe' || mode === 'fade_in_from') {
                                                        updateLayerProperty(layer.id, 'fadeInStart', activeKf);
                                                    } else if (mode === 'fade_out_at') {
                                                        updateLayerProperty(layer.id, 'fadeOutStart', activeKf);
                                                    } else if (mode === 'custom' || mode === 'keyframe') {
                                                        updateLayerProperty(layer.id, 'fadeInStart', activeKf);
                                                        updateLayerProperty(layer.id, 'fadeInEnd', Math.min(kfCount - 1, activeKf + 1));
                                                        updateLayerProperty(layer.id, 'fadeOutStart', Math.min(kfCount - 1, activeKf + 2));
                                                        updateLayerProperty(layer.id, 'fadeOutEnd', Math.min(kfCount - 1, activeKf + 3));
                                                    }
                                                    const isExit = mode === 'fade_out_at';
                                                    triggerTransitionPreview(layer.id, isExit ? 'exit' : 'entry');
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2 bg-stone-900 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                            >
                                                <option value="none">Selalu Muncul</option>
                                                <option value="show_at_keyframe">Muncul di Keyframe Aktif</option>
                                                <option value="fade_in_from">Hanya Muncul (Fade In)</option>
                                                <option value="fade_out_at">Hanya Hilang (Fade Out)</option>
                                                <option value="custom">Kustom (Rentang Keyframe)</option>
                                            </select>
                                        </div>

                                        {layer.fadeMode && layer.fadeMode !== 'none' && (
                                            <div className="bg-stone-950 p-3 rounded-xl border border-white/5 space-y-3">
                                                {data.config.keyframes.length < 2 ? (
                                                    <p className="text-[10px] text-[#E5654B] font-bold">Butuh minimal 2 keyframe kamera untuk mengatur transisi.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2.5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[10px] text-stone-400">Durasi ({(layer.transitionDuration ?? 1.0).toFixed(1)}s)</span>
                                                                <input
                                                                    type="range"
                                                                    min="0.1"
                                                                    max="3.0"
                                                                    step="0.1"
                                                                    value={layer.transitionDuration ?? 1.0}
                                                                    onChange={e => {
                                                                        updateLayerProperty(layer.id, 'transitionDuration', parseFloat(e.target.value));
                                                                    }}
                                                                    onMouseUp={() => {
                                                                        saveHistoryState(data.config);
                                                                        const isExit = layer.fadeMode === 'fade_out_at';
                                                                        triggerTransitionPreview(layer.id, isExit ? 'exit' : 'entry');
                                                                    }}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[10px] text-stone-400">Intensitas ({(layer.transitionIntensity ?? 1.0).toFixed(1)}x)</span>
                                                                <input
                                                                    type="range"
                                                                    min="0.1"
                                                                    max="3.0"
                                                                    step="0.1"
                                                                    value={layer.transitionIntensity ?? 1.0}
                                                                    onChange={e => {
                                                                        updateLayerProperty(layer.id, 'transitionIntensity', parseFloat(e.target.value));
                                                                    }}
                                                                    onMouseUp={() => {
                                                                        saveHistoryState(data.config);
                                                                        const isExit = layer.fadeMode === 'fade_out_at';
                                                                        triggerTransitionPreview(layer.id, isExit ? 'exit' : 'entry');
                                                                    }}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>

                                                        {(layer.fadeMode === 'show_at_keyframe' || layer.fadeMode === 'fade_in_from') && (
                                                            <div className="space-y-1">
                                                                <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                                <select
                                                                    value={layer.fadeInStart ?? 0}
                                                                    onChange={e => {
                                                                        const val = parseInt(e.target.value);
                                                                        updateLayerProperty(layer.id, 'fadeInStart', val);
                                                                        saveHistoryState(data.config);
                                                                    }}
                                                                    className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer"
                                                                >
                                                                    {data.config.keyframes.map((_, i) => (
                                                                        <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                        {layer.fadeMode === 'fade_out_at' && (
                                                            <div className="space-y-1">
                                                                <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                                <select
                                                                    value={layer.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                                    onChange={e => {
                                                                        const val = parseInt(e.target.value);
                                                                        updateLayerProperty(layer.id, 'fadeOutStart', val);
                                                                        saveHistoryState(data.config);
                                                                    }}
                                                                    className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer"
                                                                >
                                                                    {data.config.keyframes.map((_, i) => (
                                                                        <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                        {(layer.fadeMode === 'custom' || layer.fadeMode === 'keyframe') && (
                                                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Mulai Muncul</span>
                                                                    <select
                                                                        value={layer.fadeInStart ?? 0}
                                                                        onChange={e => {
                                                                            updateLayerProperty(layer.id, 'fadeInStart', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Selesai Muncul</span>
                                                                    <select
                                                                        value={layer.fadeInEnd ?? 0}
                                                                        onChange={e => {
                                                                            updateLayerProperty(layer.id, 'fadeInEnd', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Mulai Hilang</span>
                                                                    <select
                                                                        value={layer.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                                        onChange={e => {
                                                                            updateLayerProperty(layer.id, 'fadeOutStart', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Selesai Hilang</span>
                                                                    <select
                                                                        value={layer.fadeOutEnd ?? (data.config.keyframes.length - 1)}
                                                                        onChange={e => {
                                                                            updateLayerProperty(layer.id, 'fadeOutEnd', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="border-t border-white/5 pt-2 space-y-2">
                                                            {(layer.fadeMode === 'show_at_keyframe' || layer.fadeMode === 'fade_in_from' || layer.fadeMode === 'custom' || layer.fadeMode === 'keyframe') && (
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold block">Animasi Masuk</span>
                                                                    <select
                                                                        value={layer.entryAnim || 'fade'}
                                                                        onChange={e => {
                                                                            updateLayerProperty(layer.id, 'entryAnim', e.target.value);
                                                                            triggerTransitionPreview(layer.id, 'entry');
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        <option value="fade">Memudar</option>
                                                                        <option value="slide_up">Geser Naik</option>
                                                                        <option value="slide_down">Geser Turun</option>
                                                                        <option value="slide_left">Geser Kiri</option>
                                                                        <option value="slide_right">Geser Kanan</option>
                                                                        <option value="zoom_in">Skala Besar</option>
                                                                        <option value="zoom_out">Skala Kecil</option>
                                                                        <option value="rotate">Berputar</option>
                                                                    </select>
                                                                </div>
                                                            )}

                                                            {(layer.fadeMode === 'show_at_keyframe' || layer.fadeMode === 'fade_out_at' || layer.fadeMode === 'custom' || layer.fadeMode === 'keyframe') && (
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold block">Animasi Keluar</span>
                                                                    <select
                                                                        value={layer.exitAnim || 'fade'}
                                                                        onChange={e => {
                                                                            updateLayerProperty(layer.id, 'exitAnim', e.target.value);
                                                                            triggerTransitionPreview(layer.id, 'exit');
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-zinc-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        <option value="fade">Memudar</option>
                                                                        <option value="slide_up">Geser Naik</option>
                                                                        <option value="slide_down">Geser Turun</option>
                                                                        <option value="slide_left">Geser Kiri</option>
                                                                        <option value="slide_right">Geser Kanan</option>
                                                                        <option value="zoom_in">Skala Besar</option>
                                                                        <option value="zoom_out">Skala Kecil</option>
                                                                        <option value="rotate">Berputar</option>
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-stone-900 border-t border-white/5 px-5 py-3.5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setActiveLayerSettingsId(null)}
                                    className="px-4 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white text-[11px] font-bold rounded-xl transition"
                                >
                                    Selesai
                                </button>
                            </div>
                    </div>
                );
            })()}

            {/* Component Settings Popup Modal */}
            {false && activeComponentSettingsInfo && (() => {
                const layer = data.config.layers.find(l => l.id === activeComponentSettingsInfo.layerId);
                const content = layer?.contents?.find(c => c.id === activeComponentSettingsInfo.contentId);
                if (!content) return null;

                const isText = content.type === 'text';

                return (
                    <div 
                        ref={compPopupRef}
                        style={{ 
                            left: `${compPopupPos.x}px`, 
                            top: `${compPopupPos.y}px`
                        }}
                        className="fixed z-50 bg-[#18181b] text-white border border-white/10 rounded-2xl w-[380px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
                    >
                            {/* Header */}
                            <div 
                                onMouseDown={handleCompMouseDown}
                                className="bg-stone-900 border-b border-white/5 px-5 py-4 flex items-center justify-between cursor-move select-none"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-[#E5654B]" />
                                    <h3 className="text-xs font-bold text-stone-200">
                                        Komponen: {content.name || (isText ? 'Teks' : 'Gambar')}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveComponentSettingsInfo(null)}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white rounded-lg transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tab Headers */}
                            <div className="flex border-b border-white/5 bg-stone-950/40 p-1 gap-1">
                                {[
                                    { id: 'position', label: 'Posisi', icon: SlidersHorizontal },
                                    { id: 'content', label: isText ? 'Teks & Gaya' : 'Gambar', icon: isText ? Type : ImageIcon },
                                    { id: 'animation', label: 'Animasi', icon: Sparkles }
                                ].map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeSettingsTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveSettingsTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] font-bold rounded-lg transition ${
                                                isActive 
                                                    ? 'bg-[#E5654B] text-white' 
                                                    : 'hover:bg-white/5 text-stone-400 hover:text-stone-200'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Scrollable Tab Content */}
                            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
                                {activeSettingsTab === 'position' && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="font-bold text-stone-400 text-[10px]">Nama Komponen</span>
                                            <input
                                                type="text"
                                                value={content.name || ''}
                                                onChange={e => {
                                                    updateContentProperty(layer.id, content.id, 'name', e.target.value);
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2 bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Offset X */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                    <span>Offset X</span>
                                                    <span className="text-[#E5654B]">{content.position.x}</span>
                                                </div>
                                                <input 
                                                    type="range" min="-5" max="5" step="0.1"
                                                    value={content.position.x}
                                                    onChange={e => updateContentProperty(layer.id, content.id, 'position', { ...content.position, x: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>

                                            {/* Offset Y */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                    <span>Offset Y</span>
                                                    <span className="text-[#E5654B]">{content.position.y}</span>
                                                </div>
                                                <input 
                                                    type="range" min="-5" max="5" step="0.1"
                                                    value={content.position.y}
                                                    onChange={e => updateContentProperty(layer.id, content.id, 'position', { ...content.position, y: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>
                                        </div>

                                        {/* Local Z Offset */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                <span>Offset Z (Kedalaman Lokal / Urutan Tumpuk)</span>
                                                <span className="text-[#E5654B]">{content.position.z}</span>
                                            </div>
                                            <input 
                                                type="range" min="-2" max="2" step="0.1"
                                                value={content.position.z}
                                                onChange={e => updateContentProperty(layer.id, content.id, 'position', { ...content.position, z: parseFloat(e.target.value) })}
                                                onMouseUp={() => saveHistoryState(data.config)}
                                                onTouchEnd={() => saveHistoryState(data.config)}
                                                className="w-full accent-[#E5654B]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Scale X */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                    <span>Skala Lebar</span>
                                                    <span className="text-[#E5654B]">{content.scale.x}</span>
                                                </div>
                                                <input 
                                                    type="range" min="0.2" max="5" step="0.1"
                                                    value={content.scale.x}
                                                    onChange={e => updateContentProperty(layer.id, content.id, 'scale', { ...content.scale, x: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>

                                            {/* Scale Y */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-bold text-stone-400 text-[10px]">
                                                    <span>Skala Tinggi</span>
                                                    <span className="text-[#E5654B]">{content.scale.y}</span>
                                                </div>
                                                <input 
                                                    type="range" min="0.2" max="5" step="0.1"
                                                    value={content.scale.y}
                                                    onChange={e => updateContentProperty(layer.id, content.id, 'scale', { ...content.scale, y: parseFloat(e.target.value) })}
                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                    onTouchEnd={() => saveHistoryState(data.config)}
                                                    className="w-full accent-[#E5654B]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSettingsTab === 'content' && (
                                    <div className="space-y-4">
                                        {isText ? (
                                            <>
                                                {/* Text Source */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-stone-400 block font-bold">Sumber Data Binding</span>
                                                    <select
                                                        value={content.dataBinding || ''}
                                                        onChange={e => {
                                                            updateContentProperty(layer.id, content.id, 'dataBinding', e.target.value || null);
                                                            saveHistoryState(data.config);
                                                        }}
                                                        className="w-full text-xs p-2 bg-stone-900 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                                    >
                                                        <option value="">Teks Kustom Manual</option>
                                                        {Object.entries(DATA_BINDING_LABELS).map(([key, label]) => (
                                                            <option key={key} value={key}>{label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-stone-400 block font-bold">Teks</span>
                                                    <textarea
                                                        value={content.text || ''}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'text', e.target.value)}
                                                        onBlur={() => saveHistoryState(data.config)}
                                                        rows={2}
                                                        className="w-full text-xs p-2 bg-stone-900 border border-white/10 rounded-xl focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none text-white transition resize-none"
                                                        disabled={!!content.dataBinding}
                                                    />
                                                    {content.dataBinding && (
                                                        <p className="text-[9px] text-[#E5654B]">Teks otomatis: {`{{${content.dataBinding}}}`}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Font family */}
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-stone-400 block font-bold">Font Family</span>
                                                        <select
                                                            value={content.fontFamily || 'Playfair Display'}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'fontFamily', e.target.value);
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-xs p-2 bg-stone-900 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                                            style={{ fontFamily: content.fontFamily || 'Playfair Display' }}
                                                        >
                                                            {AVAILABLE_FONTS.map(font => (
                                                                <option key={font.name} value={font.name} className="text-black bg-white" style={{ fontFamily: font.style }}>
                                                                    {font.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Color */}
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-stone-400 block font-bold">Warna Teks</span>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input
                                                                type="color"
                                                                value={content.color || '#E5654B'}
                                                                onChange={e => updateContentProperty(layer.id, content.id, 'color', e.target.value)}
                                                                onBlur={() => saveHistoryState(data.config)}
                                                                className="w-6 h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                            />
                                                            <span className="font-mono text-[9px] text-stone-400">{content.color || '#E5654B'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* FontSize (Resolution) */}
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-stone-400 text-[10px]">Resolusi ({content.fontSize || 64}px)</span>
                                                        <input
                                                            type="range"
                                                            min="24"
                                                            max="128"
                                                            step="4"
                                                            value={content.fontSize || 64}
                                                            onChange={e => updateContentProperty(layer.id, content.id, 'fontSize', parseInt(e.target.value))}
                                                            onMouseUp={() => saveHistoryState(data.config)}
                                                            onTouchEnd={() => saveHistoryState(data.config)}
                                                            className="w-full accent-[#E5654B]"
                                                        />
                                                    </div>

                                                    {/* Bold/Italic */}
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-stone-400 text-[10px]">Gaya & Tebal</span>
                                                        <div className="flex gap-1.5 mt-0.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const nextVal = content.fontWeight === 'bold' ? 'normal' : 'bold';
                                                                    updateContentProperty(layer.id, content.id, 'fontWeight', nextVal);
                                                                    saveHistoryState(data.config);
                                                                }}
                                                                className={`flex-1 py-1 rounded text-[10px] font-bold border transition ${
                                                                    content.fontWeight === 'bold'
                                                                        ? 'bg-white text-stone-900 border-white'
                                                                        : 'bg-stone-900 text-stone-300 border-white/10 hover:bg-stone-850'
                                                                }`}
                                                            >
                                                                B
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const nextVal = content.fontStyle === 'italic' ? 'normal' : 'italic';
                                                                    updateContentProperty(layer.id, content.id, 'fontStyle', nextVal);
                                                                    saveHistoryState(data.config);
                                                                }}
                                                                className={`flex-1 py-1 rounded text-[10px] italic border transition ${
                                                                    content.fontStyle === 'italic'
                                                                        ? 'bg-white text-stone-900 border-white'
                                                                        : 'bg-stone-900 text-stone-300 border-white/10 hover:bg-stone-850'
                                                                }`}
                                                            >
                                                                I
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Text Effects */}
                                                <div className="space-y-3 border-t border-white/5 pt-3">
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-stone-400 text-[10px]">Efek Teks</span>
                                                        <select
                                                            value={content.textEffect || 'none'}
                                                            onChange={e => {
                                                                updateContentProperty(layer.id, content.id, 'textEffect', e.target.value);
                                                                saveHistoryState(data.config);
                                                            }}
                                                            className="w-full text-xs p-2 bg-stone-900 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                                        >
                                                            <option value="none">Tanpa Efek</option>
                                                            <option value="shadow">Shadow (Bayangan)</option>
                                                            <option value="double_shadow">Double Shadow (Bayangan Ganda)</option>
                                                            <option value="neon">Neon / Glow (Kustom)</option>
                                                            <option value="neon_pink">Neon Pink</option>
                                                            <option value="neon_blue">Neon Biru</option>
                                                            <option value="outline">Outline (Garis Tepi)</option>
                                                            <option value="outline_shadow">Outline & Shadow</option>
                                                            <option value="3d">Teks 3D / Extrusion</option>
                                                            <option value="gradient_fill">Gradasi Warna</option>
                                                        </select>
                                                    </div>

                                                    {(content.textEffect === 'shadow' || content.textEffect === 'double_shadow' || content.textEffect === 'outline_shadow') && (
                                                        <div className="grid grid-cols-2 gap-3 bg-stone-950 p-2.5 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Bayangan</span>
                                                                <input
                                                                    type="color"
                                                                    value={content.shadowColor || '#000000'}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'shadowColor', e.target.value)}
                                                                    onBlur={() => saveHistoryState(data.config)}
                                                                    className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Blur ({content.shadowBlur ?? 8}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="30"
                                                                    value={content.shadowBlur ?? 8}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'shadowBlur', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Jarak X ({content.shadowOffsetX ?? 4}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="-20"
                                                                    max="20"
                                                                    value={content.shadowOffsetX ?? 4}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'shadowOffsetX', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Jarak Y ({content.shadowOffsetY ?? 4}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="-20"
                                                                    max="20"
                                                                    value={content.shadowOffsetY ?? 4}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'shadowOffsetY', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {content.textEffect === 'double_shadow' && (
                                                        <div className="grid grid-cols-1 gap-3 bg-stone-950 p-2.5 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Bayangan Kedua</span>
                                                                <input
                                                                    type="color"
                                                                    value={content.secondShadowColor || 'rgba(229, 101, 75, 0.3)'}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'secondShadowColor', e.target.value)}
                                                                    onBlur={() => saveHistoryState(data.config)}
                                                                    className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {content.textEffect === 'neon' && (
                                                        <div className="grid grid-cols-2 gap-3 bg-stone-950 p-2.5 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Glow</span>
                                                                <input
                                                                    type="color"
                                                                    value={content.glowColor || content.color || '#E5654B'}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'glowColor', e.target.value)}
                                                                    onBlur={() => saveHistoryState(data.config)}
                                                                    className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Blur Glow ({content.glowBlur ?? 20}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="5"
                                                                    max="50"
                                                                    value={content.glowBlur ?? 20}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'glowBlur', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(content.textEffect === 'neon_pink' || content.textEffect === 'neon_blue') && (
                                                        <div className="grid grid-cols-1 gap-3 bg-stone-950 p-2.5 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Blur Glow ({content.glowBlur ?? 20}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="5"
                                                                    max="50"
                                                                    value={content.glowBlur ?? 20}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'glowBlur', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(content.textEffect === 'outline' || content.textEffect === 'outline_shadow') && (
                                                        <div className="grid grid-cols-2 gap-3 bg-stone-950 p-2.5 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Outline</span>
                                                                <input
                                                                    type="color"
                                                                    value={content.strokeColor || '#000000'}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'strokeColor', e.target.value)}
                                                                    onBlur={() => saveHistoryState(data.config)}
                                                                    className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Ketebalan ({content.strokeWidth ?? 6}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="1"
                                                                    max="20"
                                                                    value={content.strokeWidth ?? 6}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'strokeWidth', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {content.textEffect === '3d' && (
                                                        <div className="grid grid-cols-2 gap-3 bg-stone-950 p-2.5 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Warna 3D</span>
                                                                <input
                                                                    type="color"
                                                                    value={content.extrusionColor || '#222222'}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'extrusionColor', e.target.value)}
                                                                    onBlur={() => saveHistoryState(data.config)}
                                                                    className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Ketebalan ({content.extrusionDepth ?? 8}px)</span>
                                                                <input
                                                                    type="range"
                                                                    min="1"
                                                                    max="25"
                                                                    value={content.extrusionDepth ?? 8}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'extrusionDepth', parseInt(e.target.value))}
                                                                    onMouseUp={() => saveHistoryState(data.config)}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {content.textEffect === 'gradient_fill' && (
                                                        <div className="grid grid-cols-2 gap-3 bg-stone-950 p-2.5 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Mulai</span>
                                                                <input
                                                                    type="color"
                                                                    value={content.color || '#E5654B'}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'color', e.target.value)}
                                                                    onBlur={() => saveHistoryState(data.config)}
                                                                    className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[9px] text-stone-400 font-bold">Warna Selesai</span>
                                                                <input
                                                                    type="color"
                                                                    value={content.gradientColor || '#ffffff'}
                                                                    onChange={e => updateContentProperty(layer.id, content.id, 'gradientColor', e.target.value)}
                                                                    onBlur={() => saveHistoryState(data.config)}
                                                                    className="w-full h-6 p-0 border border-white/10 rounded cursor-pointer bg-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Image properties & Replace button */}
                                                <div className="bg-stone-950 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-3">
                                                    <span className="text-[10px] text-stone-400 block font-bold self-start">Aset Gambar</span>
                                                    <div className="w-32 h-32 bg-stone-900 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                                                        <img src={content.url} alt={content.name || 'Image component'} className="max-w-full max-h-full object-contain p-1" />
                                                    </div>
                                                    <div className="flex gap-2 w-full mt-1">
                                                        <button
                                                            type="button"
                                                            disabled={isReplacingImage}
                                                            onClick={() => {
                                                                setSelectedLayerId(layer.id);
                                                                setSelectedContentId(content.id);
                                                                replaceImageInputRef.current?.click();
                                                            }}
                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2c2c30] hover:bg-[#38383e] disabled:opacity-50 text-white rounded-xl text-[10px] font-bold border border-white/10 transition"
                                                        >
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <span>Ganti Gambar</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={isReplacingImage}
                                                            onClick={() => openBgRemover(content)}
                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl text-[10px] font-bold transition"
                                                        >
                                                            <Scissors className="w-3.5 h-3.5" />
                                                            <span>Hapus Latar</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeSettingsTab === 'animation' && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-stone-400 block font-bold">Gaya Gerak (Continuous Idle Effect)</span>
                                            <select
                                                value={content.animationType || 'none'}
                                                onChange={e => {
                                                    updateContentProperty(layer.id, content.id, 'animationType', e.target.value);
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2 bg-stone-900 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                            >
                                                <option value="none">Tidak Ada</option>
                                                <option value="float">Melayang (Float)</option>
                                                <option value="spin">Berputar (Spin)</option>
                                                <option value="pulse">Denyut (Pulse)</option>
                                                <option value="swing">Goyang (Swing)</option>
                                                <option value="bounce">Memantul (Bounce)</option>
                                                <option value="wiggle">Bergetar (Wiggle)</option>
                                                <option value="wave">Gelombang (Wave)</option>
                                                <option value="heartbeat">Detak Jantung (Heartbeat)</option>
                                                <option value="flicker">Berkedip (Flicker)</option>
                                                <option value="spinY">Putar 3D - Y (Spin Y)</option>
                                                <option value="flipX">Flip 3D - X (Flip X)</option>
                                            </select>
                                        </div>

                                        {content.animationType && content.animationType !== 'none' && (
                                            <div className="bg-stone-950 p-3.5 rounded-xl border border-white/5 space-y-4">
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Kecepatan ({(content.animationSpeed ?? 1.0).toFixed(1)}x)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="5.0"
                                                        step="0.1"
                                                        value={content.animationSpeed ?? 1.0}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'animationSpeed', parseFloat(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="font-bold text-[10px] text-stone-400">Intensitas ({(content.animationIntensity ?? 1.0).toFixed(1)}x)</span>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="5.0"
                                                        step="0.1"
                                                        value={content.animationIntensity ?? 1.0}
                                                        onChange={e => updateContentProperty(layer.id, content.id, 'animationIntensity', parseFloat(e.target.value))}
                                                        onMouseUp={() => saveHistoryState(data.config)}
                                                        className="w-full accent-[#E5654B]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <hr className="border-white/5 my-2" />

                                        <div className="space-y-1">
                                            <span className="text-[10px] text-stone-400 block font-bold">Tipe Transisi (In/Out)</span>
                                            <select
                                                value={content.fadeMode || 'none'}
                                                onChange={e => {
                                                    const mode = e.target.value;
                                                    const kfCount = data.config?.keyframes?.length || 0;
                                                    const activeKf = kfCount > 0 ? Math.max(0, Math.min(kfCount - 1, Math.round(currentCameraProgressRef.current * (kfCount - 1)))) : 0;
                                                    
                                                    updateContentProperty(layer.id, content.id, 'fadeMode', mode);
                                                    if (mode === 'show_at_keyframe' || mode === 'fade_in_from') {
                                                        updateContentProperty(layer.id, content.id, 'fadeInStart', activeKf);
                                                    } else if (mode === 'fade_out_at') {
                                                        updateContentProperty(layer.id, content.id, 'fadeOutStart', activeKf);
                                                    } else if (mode === 'custom' || mode === 'keyframe') {
                                                        updateContentProperty(layer.id, content.id, 'fadeInStart', activeKf);
                                                        updateContentProperty(layer.id, content.id, 'fadeInEnd', Math.min(kfCount - 1, activeKf + 1));
                                                        updateContentProperty(layer.id, content.id, 'fadeOutStart', Math.min(kfCount - 1, activeKf + 2));
                                                        updateContentProperty(layer.id, content.id, 'fadeOutEnd', Math.min(kfCount - 1, activeKf + 3));
                                                    }
                                                    const isExit = mode === 'fade_out_at';
                                                    triggerTransitionPreview(content.id, isExit ? 'exit' : 'entry');
                                                    saveHistoryState(data.config);
                                                }}
                                                className="w-full text-xs p-2 bg-stone-900 border border-white/10 text-white rounded-xl outline-none cursor-pointer focus:border-[#E5654B]"
                                            >
                                                <option value="none">Selalu Muncul</option>
                                                <option value="show_at_keyframe">Muncul di Keyframe Aktif</option>
                                                <option value="fade_in_from">Hanya Muncul (Fade In)</option>
                                                <option value="fade_out_at">Hanya Hilang (Fade Out)</option>
                                                <option value="custom">Kustom (Rentang Keyframe)</option>
                                            </select>
                                        </div>

                                        {content.fadeMode && content.fadeMode !== 'none' && (
                                            <div className="bg-stone-950 p-3 rounded-xl border border-white/5 space-y-3">
                                                {data.config.keyframes.length < 2 ? (
                                                    <p className="text-[10px] text-[#E5654B] font-bold">Butuh minimal 2 keyframe kamera untuk mengatur transisi.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2.5">
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[10px] text-stone-400">Durasi ({(content.transitionDuration ?? 1.0).toFixed(1)}s)</span>
                                                                <input
                                                                    type="range"
                                                                    min="0.1"
                                                                    max="3.0"
                                                                    step="0.1"
                                                                    value={content.transitionDuration ?? 1.0}
                                                                    onChange={e => {
                                                                        updateContentProperty(layer.id, content.id, 'transitionDuration', parseFloat(e.target.value));
                                                                    }}
                                                                    onMouseUp={() => {
                                                                        saveHistoryState(data.config);
                                                                        const isExit = content.fadeMode === 'fade_out_at';
                                                                        triggerTransitionPreview(content.id, isExit ? 'exit' : 'entry');
                                                                    }}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="font-bold text-[10px] text-stone-400">Intensitas ({(content.transitionIntensity ?? 1.0).toFixed(1)}x)</span>
                                                                <input
                                                                    type="range"
                                                                    min="0.1"
                                                                    max="3.0"
                                                                    step="0.1"
                                                                    value={content.transitionIntensity ?? 1.0}
                                                                    onChange={e => {
                                                                        updateContentProperty(layer.id, content.id, 'transitionIntensity', parseFloat(e.target.value));
                                                                    }}
                                                                    onMouseUp={() => {
                                                                        saveHistoryState(data.config);
                                                                        const isExit = content.fadeMode === 'fade_out_at';
                                                                        triggerTransitionPreview(content.id, isExit ? 'exit' : 'entry');
                                                                    }}
                                                                    className="w-full accent-[#E5654B]"
                                                                />
                                                            </div>
                                                        </div>

                                                        {(content.fadeMode === 'show_at_keyframe' || content.fadeMode === 'fade_in_from') && (
                                                            <div className="space-y-1">
                                                                <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                                <select
                                                                    value={content.fadeInStart ?? 0}
                                                                    onChange={e => {
                                                                        const val = parseInt(e.target.value);
                                                                        updateContentProperty(layer.id, content.id, 'fadeInStart', val);
                                                                        saveHistoryState(data.config);
                                                                    }}
                                                                    className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer"
                                                                >
                                                                    {data.config.keyframes.map((_, i) => (
                                                                        <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                        {content.fadeMode === 'fade_out_at' && (
                                                            <div className="space-y-1">
                                                                <span className="text-stone-400 text-[9px] font-bold">Keyframe Kamera Target</span>
                                                                <select
                                                                    value={content.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                                    onChange={e => {
                                                                        const val = parseInt(e.target.value);
                                                                        updateContentProperty(layer.id, content.id, 'fadeOutStart', val);
                                                                        saveHistoryState(data.config);
                                                                    }}
                                                                    className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer"
                                                                >
                                                                    {data.config.keyframes.map((_, i) => (
                                                                        <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                        {(content.fadeMode === 'custom' || content.fadeMode === 'keyframe') && (
                                                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Mulai Muncul</span>
                                                                    <select
                                                                        value={content.fadeInStart ?? 0}
                                                                        onChange={e => {
                                                                            updateContentProperty(layer.id, content.id, 'fadeInStart', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Selesai Muncul</span>
                                                                    <select
                                                                        value={content.fadeInEnd ?? 0}
                                                                        onChange={e => {
                                                                            updateContentProperty(layer.id, content.id, 'fadeInEnd', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Mulai Hilang</span>
                                                                    <select
                                                                        value={content.fadeOutStart ?? (data.config.keyframes.length - 1)}
                                                                        onChange={e => {
                                                                            updateContentProperty(layer.id, content.id, 'fadeOutStart', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold">Selesai Hilang</span>
                                                                    <select
                                                                        value={content.fadeOutEnd ?? (data.config.keyframes.length - 1)}
                                                                        onChange={e => {
                                                                            updateContentProperty(layer.id, content.id, 'fadeOutEnd', parseInt(e.target.value));
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        {data.config.keyframes.map((_, i) => (
                                                                            <option key={i} value={i} className="bg-stone-900 text-white">Keyframe #{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="border-t border-white/5 pt-2 space-y-2">
                                                            {(content.fadeMode === 'show_at_keyframe' || content.fadeMode === 'fade_in_from' || content.fadeMode === 'custom' || content.fadeMode === 'keyframe') && (
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold block">Animasi Masuk</span>
                                                                    <select
                                                                        value={content.entryAnim || 'fade'}
                                                                        onChange={e => {
                                                                            updateContentProperty(layer.id, content.id, 'entryAnim', e.target.value);
                                                                            triggerTransitionPreview(content.id, 'entry');
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        <option value="fade">Memudar</option>
                                                                        <option value="slide_up">Geser Naik</option>
                                                                        <option value="slide_down">Geser Turun</option>
                                                                        <option value="slide_left">Geser Kiri</option>
                                                                        <option value="slide_right">Geser Kanan</option>
                                                                        <option value="zoom_in">Skala Besar</option>
                                                                        <option value="zoom_out">Skala Kecil</option>
                                                                        <option value="rotate">Berputar</option>
                                                                    </select>
                                                                </div>
                                                            )}

                                                            {(content.fadeMode === 'show_at_keyframe' || content.fadeMode === 'fade_out_at' || content.fadeMode === 'custom' || content.fadeMode === 'keyframe') && (
                                                                <div className="space-y-1">
                                                                    <span className="text-stone-400 text-[9px] font-bold block">Animasi Keluar</span>
                                                                    <select
                                                                        value={content.exitAnim || 'fade'}
                                                                        onChange={e => {
                                                                            updateContentProperty(layer.id, content.id, 'exitAnim', e.target.value);
                                                                            triggerTransitionPreview(content.id, 'exit');
                                                                            saveHistoryState(data.config);
                                                                        }}
                                                                        className="w-full text-[10px] p-1.5 bg-stone-900 border border-white/10 text-white rounded-lg cursor-pointer font-sans"
                                                                    >
                                                                        <option value="fade">Memudar</option>
                                                                        <option value="slide_up">Geser Naik</option>
                                                                        <option value="slide_down">Geser Turun</option>
                                                                        <option value="slide_left">Geser Kiri</option>
                                                                        <option value="slide_right">Geser Kanan</option>
                                                                        <option value="zoom_in">Skala Besar</option>
                                                                        <option value="zoom_out">Skala Kecil</option>
                                                                        <option value="rotate">Berputar</option>
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                 )}
                             </div>
                            {/* Footer */}
                            <div className="bg-stone-900 border-t border-white/5 px-5 py-3.5 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setActiveComponentSettingsInfo(null)}
                                    className="px-4 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white text-[11px] font-bold rounded-xl transition"
                                >
                                    Selesai
                                </button>
                            </div>
                    </div>
                );
            })()}

            <input 
                type="file" 
                ref={replaceImageInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        handleReplaceImage(file);
                    }
                    e.target.value = null;
                }} 
            />

            <input 
                type="file" 
                ref={addImageInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    let targetLayerId = selectedLayerId || (data.config.layers.length > 0 ? data.config.layers[0].id : null);
                    if (!targetLayerId) {
                        const newLayerId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                        const newLayer = {
                            id: newLayerId,
                            name: `Grup Gambar`,
                            visible: true,
                            position: { x: 0, y: 0, z: 0 },
                            rotation: { x: 0, y: 0, z: 0 },
                            scale: { x: 1, y: 1 },
                            contents: []
                        };
                        setData(d => {
                            const newLayers = [...(d.config.layers || []), newLayer];
                            const newConfig = { ...d.config, layers: newLayers };
                            saveHistoryState(newConfig);
                            return { ...d, config: newConfig };
                        });
                        targetLayerId = newLayerId;
                    }
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                        const response = await axios.post('/super-admin/three-d-scenes/upload-asset', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        if (response.data.success) {
                            addContentToLayer(targetLayerId, 'upload', response.data.url);
                        }
                    } catch (err) {
                        console.error("Right-click image addition upload error:", err);
                    }
                    e.target.value = null;
                }} 
            />
            </div>
        </SuperAdminLayout>
    );
}
