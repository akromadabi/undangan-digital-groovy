const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Invitation/netflix/StaticNetflixTheme.jsx', 'utf8');

// Fix style tags in JSX
content = content.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (m, c) => '<style>{`' + c.replace(/`/g, '\\`') + '`}</style>');

// Fix XML attributes in SVG
content = content.replace(/xml:space/g, 'xmlSpace');
content = content.replace(/enable-background/g, 'enableBackground');

// Also handle SVG viewBox if needed (should be camelCase but Vite sometimes allows it)
content = content.replace(/viewbox/gi, 'viewBox');
content = content.replace(/stroke-width/g, 'strokeWidth');
content = content.replace(/stroke-linecap/g, 'strokeLinecap');
content = content.replace(/stroke-linejoin/g, 'strokeLinejoin');

fs.writeFileSync('resources/js/Pages/Invitation/netflix/StaticNetflixTheme.jsx', content);
console.log('Fixed JSX SVG/Style syntax');
