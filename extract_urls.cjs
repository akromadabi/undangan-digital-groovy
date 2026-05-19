const fs = require('fs');
const https = require('https');
const path = require('path');
const url = 'https://attarivitation.com/demo-heritage-series-utary/';

https.get(url, (res) => {
    let html = '';
    res.on('data', d => html += d);
    res.on('end', () => {
        const regex = /https:\/\/(?:attarivitation|byattari)\.com\/wp-content\/uploads\/[^\s\"\'\>)]+\.(?:webp|jpg|jpeg|png)/g;
        const urls = [...new Set(html.match(regex) || [])];
        console.log(urls.join('\n'));
    });
}).on('error', e => console.error(e));
