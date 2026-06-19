import React from 'react';
import HeadingRenderer from './heading/HeadingRenderer';
import HeadingEditor from './heading/HeadingEditor';
import ImageRenderer from './image/ImageRenderer';
import ImageEditor from './image/ImageEditor';
import ButtonRenderer from './button/ButtonRenderer';
import ButtonEditor from './button/ButtonEditor';

// Registry containing metadata, renderers, and editor panels for all widgets
export const widgetRegistry = {
    heading: {
        type: 'heading',
        name: 'Heading / Judul',
        icon: 'Heading',
        category: 'basic',
        defaultSettings: {
            text: 'Masukkan Judul Baru',
            tag: 'h2',
            alignment: 'center',
            textColor: '#1f2937',
            fontSize: '32px',
            fontFamily: 'default',
            fontWeight: 'bold',
            lineHeight: '1.2'
        },
        Renderer: HeadingRenderer,
        Editor: HeadingEditor
    },
    image: {
        type: 'image',
        name: 'Gambar',
        icon: 'Image',
        category: 'basic',
        defaultSettings: {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
            alt: 'Wedding Image',
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            alignment: 'center'
        },
        Renderer: ImageRenderer,
        Editor: ImageEditor
    },
    button: {
        type: 'button',
        name: 'Tombol',
        icon: 'MousePointerClick',
        category: 'basic',
        defaultSettings: {
            text: 'Klik di Sini',
            url: '#',
            alignment: 'center',
            backgroundColor: '#E5654B',
            textColor: '#ffffff',
            borderRadius: '8px',
            paddingX: '24px',
            paddingY: '12px',
            fontSize: '14px',
            isExternal: false
        },
        Renderer: ButtonRenderer,
        Editor: ButtonEditor
    }
};

export const getWidgetMeta = (type) => widgetRegistry[type] || null;
