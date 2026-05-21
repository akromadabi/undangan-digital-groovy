const fs = require('fs');
const https = require('https');
const path = require('path');

const targetUrl = 'https://attarivitation.com/demo-heritage-series-aruna/';
const downloadDir = path.join(__dirname, 'resources', 'js', 'Pages', 'Invitation', 'aruna');
const assetDir = path.join(downloadDir, 'asset');

if (!fs.existsSync(assetDir)) {
  fs.mkdirSync(assetDir, { recursive: true });
}

// Download html
https.get(targetUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('temp_aruna.html', data);
    console.log('Saved HTML to temp_aruna.html');
    
    // Extract asset URLs
    const regex = /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp|svg)/gi;
    let match;
    const urls = new Set();
    while ((match = regex.exec(data)) !== null) {
      urls.add(match[0]);
    }
    
    console.log(`Found ${urls.size} distinct image URLs.`);
    
    [...urls].forEach(url => {
      const fileName = path.basename(new URL(url).pathname);
      const dest = path.join(assetDir, fileName);
      https.get(url, (imgRes) => {
        if(imgRes.statusCode === 200) {
            const file = fs.createWriteStream(dest);
            imgRes.pipe(file);
        }
      }).on('error', e => console.error(e));
    });
  });
}).on('error', err => {
  console.error(err);
});
