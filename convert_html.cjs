const fs = require('fs');

let html = fs.readFileSync('BAHAN/Tema Netflix.html', 'utf-8');

// Extract the main elementor wrapper
const match = html.match(/<div data-elementor-type="single-post"[\s\S]*?<\/body>/);
if (!match) {
    console.error("Could not find main elementor wrapper");
    process.exit(1);
}

let bodyContent = match[0];
bodyContent = bodyContent.replace(/<\/body>/, ''); // Remove body tag

// Convert class to className
bodyContent = bodyContent.replace(/ class="/g, ' className="');
// Convert for to htmlFor
bodyContent = bodyContent.replace(/ for="/g, ' htmlFor="');
// Convert tabindex to tabIndex
bodyContent = bodyContent.replace(/ tabindex="/g, ' tabIndex="');
// Convert autoplay to autoPlay
bodyContent = bodyContent.replace(/ autoplay/g, ' autoPlay');
bodyContent = bodyContent.replace(/ playsinline/g, ' playsInline');
bodyContent = bodyContent.replace(/ frameborder/g, ' frameBorder');
bodyContent = bodyContent.replace(/ allowfullscreen/g, ' allowFullScreen');

// Self close tags
bodyContent = bodyContent.replace(/<img([^>]*?[^\/])>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<br>/g, '<br />');
bodyContent = bodyContent.replace(/<hr([^>]*?[^\/])>/g, '<hr$1 />');
bodyContent = bodyContent.replace(/<input([^>]*?[^\/])>/g, '<input$1 />');

// Remove HTML comments
bodyContent = bodyContent.replace(/<!--[\s\S]*?-->/g, '');

// Naive inline style converter
bodyContent = bodyContent.replace(/ style="([^"]*)"/g, (match, styleStr) => {
    const styles = styleStr.split(';').filter(s => s.trim() !== '');
    let objStr = '{';
    styles.forEach(s => {
        let [key, ...valParts] = s.split(':');
        let val = valParts.join(':');
        if (!key || !val) return;
        key = key.trim();
        val = val.trim();
        if (!key.startsWith('--')) {
            key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        }
        objStr += `"${key}": "${val}",`;
    });
    objStr += '}';
    return ` style={${objStr}}`;
});

// Remove some generic script tags that might be inside
bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/g, '');
// Replace iframe with self closing or fix it
bodyContent = bodyContent.replace(/<iframe([^>]*?[^\/])><\/iframe>/g, '<iframe$1 />');

// Remove &amp; and replace properly
bodyContent = bodyContent.replace(/&amp;/g, '&');
bodyContent = bodyContent.replace(/&/g, '&amp;');

let jsx = `import React from 'react';
import ParticleEffect from '@/Components/ParticleEffect';

export default function StaticNetflixTheme({ invitation, brideGrooms, events, galleries }) {
    return (
        <div className="netflix-wrapper" style={{background: '#141414', minHeight: '100vh', color: '#fff'}}>
            ${bodyContent}
        </div>
    );
}
`;

fs.writeFileSync('resources/js/Pages/Invitation/netflix/StaticNetflixTheme.jsx', jsx);
console.log("Converted successfully!");
