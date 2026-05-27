const fs = require('fs');
const path = require('path');

// Regex matching common emojis
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1FAF8}]/u;

function scan(dir) {
    fs.readdirSync(dir).forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            scan(full);
        } else if (file.endsWith('.jsx')) {
            const content = fs.readFileSync(full, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
                if (emojiRegex.test(line)) {
                    console.log(`${path.relative('resources/js/Pages/Dashboard', full)}:${idx+1}: ${line.trim()}`);
                }
            });
        }
    });
}

console.log("Scanning Dashboard files for emojis...");
scan('resources/js/Pages/Dashboard');
