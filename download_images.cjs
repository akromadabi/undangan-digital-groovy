const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        response.resume();
        resolve(`Failed: ${response.statusCode}`);
      }
    }).on('error', err => reject(err));
  });
};

(async () => {
  for (let i = 1; i <= 10; i++) {
    const url = `https://byattari.com/wp-content/uploads/2026/02/Utary-${i}.webp`;
    const dest = path.join(__dirname, 'resources', 'js', 'Pages', 'Invitation', 'utary', 'asset', `utary-${i}.webp`);
    try {
      await download(url, dest);
      console.log(`Downloaded ${url}`);
    } catch (e) {
      console.log(`Error ${url}`);
    }
  }
  
  // also download bride and groom if they have special names 
  // Let's also download Utary-Couple.webp just in case.
  await download(`https://byattari.com/wp-content/uploads/2026/02/Utary-Couple.webp`, path.join(__dirname, 'resources', 'js', 'Pages', 'Invitation', 'utary', 'asset', `utary-couple.webp`));
  await download(`https://byattari.com/wp-content/uploads/2026/02/Utary-7-1.webp`, path.join(__dirname, 'resources', 'js', 'Pages', 'Invitation', 'utary', 'asset', `utary-7-1.webp`));
  await download(`https://byattari.com/wp-content/uploads/2026/02/Utary-8-1.webp`, path.join(__dirname, 'resources', 'js', 'Pages', 'Invitation', 'utary', 'asset', `utary-8-1.webp`));
})();
