import { getResponsiveSetting } from './deepMergeResponsive';

const KEYFRAMES_CSS = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes zoomOut {
  from { opacity: 0; transform: scale(1.15); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 0.9; transform: scale(1.05); }
  70% { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
`;

export function compileNodeCss(node, activeBreakpoint) {
    if (!node) return '';
    const id = node.id;
    const advanced = node.advanced || {};
    
    // 1. Custom CSS
    let customCss = advanced.customCss || '';
    // Replace 'selector' placeholder with the actual element selector
    customCss = customCss.replace(/selector/g, `#${id}`);

    // 2. Transform CSS
    const transform = advanced.transform || {};
    const normalTransform = transform.normal || {};
    const hoverTransform = transform.hover || {};
    
    // Normal transform string builder
    const buildTransformString = (t) => {
        const parts = [];
        if (t.translateX || t.translateY) {
            const tx = t.translateX || 0;
            const ty = t.translateY || 0;
            parts.push(`translate(${tx}px, ${ty}px)`);
        }
        if (t.rotate) {
            parts.push(`rotate(${t.rotate}deg)`);
        }
        if (t.scale !== undefined && t.scale !== '') {
            parts.push(`scale(${t.scale})`);
        }
        if (t.skewX || t.skewY) {
            const sx = t.skewX || 0;
            const sy = t.skewY || 0;
            parts.push(`skew(${sx}deg, ${sy}deg)`);
        }
        if (t.flipH) {
            parts.push(`scaleX(-1)`);
        }
        if (t.flipV) {
            parts.push(`scaleY(-1)`);
        }
        return parts.join(' ');
    };

    const normalTransformStr = buildTransformString(normalTransform);
    const hoverTransformStr = buildTransformString(hoverTransform);

    let transformCss = '';
    if (normalTransformStr) {
        transformCss += `#${id} { transform: ${normalTransformStr}; }\n`;
    }
    if (hoverTransformStr) {
        const duration = hoverTransform.transitionDuration !== undefined ? hoverTransform.transitionDuration : 300;
        transformCss += `#${id} { transition: transform ${duration}ms ease-in-out; }\n`;
        transformCss += `#${id}:hover { transform: ${hoverTransformStr}; }\n`;
    }

    // 3. Background normal & hover CSS
    const background = advanced.background || {};
    const normalBg = background.normal || {};
    const hoverBg = background.hover || {};

    const buildBgStyle = (bg) => {
        if (bg.type === 'classic') {
            const parts = [];
            if (bg.image) {
                parts.push(`background-image: url(${bg.image})`);
                parts.push(`background-size: cover`);
                parts.push(`background-position: center`);
                parts.push(`background-repeat: no-repeat`);
            } else {
                parts.push(`background-image: none`);
            }
            if (bg.color) {
                parts.push(`background-color: ${bg.color}`);
            } else if (!bg.image) {
                parts.push(`background-color: transparent`);
            }
            return parts.join('; ') + ';';
        } else if (bg.type === 'gradient') {
            if (bg.gradient) {
                return `background-image: ${bg.gradient};`;
            }
        }
        return '';
    };

    const normalBgStr = buildBgStyle(normalBg);
    const hoverBgStr = buildBgStyle(hoverBg);

    let bgCss = '';
    if (normalBgStr) {
        bgCss += `#${id} { ${normalBgStr} }\n`;
    }
    if (hoverBgStr) {
        const duration = hoverBg.transitionDuration !== undefined ? hoverBg.transitionDuration : 300;
        bgCss += `#${id} { transition: background ${duration}ms ease-in-out, background-color ${duration}ms ease-in-out, background-image ${duration}ms ease-in-out; }\n`;
        bgCss += `#${id}:hover { ${hoverBgStr} }\n`;
    }

    // 4. Motion Effects & Sticky
    const motion = advanced.motionEffects || {};
    let motionCss = '';
    if (motion.entranceAnimation && motion.entranceAnimation !== 'none') {
        const delay = motion.animationDelay || 0;
        const duration = motion.animationDuration === 'fast' ? 500 : motion.animationDuration === 'slow' ? 1500 : 1000;
        motionCss += KEYFRAMES_CSS + `\n`;
        motionCss += `#${id} { animation: ${motion.entranceAnimation} ${duration}ms ${delay}ms both; }\n`;
    }
    if (motion.sticky && motion.sticky !== 'none') {
        motionCss += `#${id} { position: sticky; ${motion.sticky}: 0; z-index: 40; }\n`;
    }

    return [customCss, transformCss, bgCss, motionCss].filter(Boolean).join('\n');
}
