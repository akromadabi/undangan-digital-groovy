const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '..', 'resources', 'js', 'Pages', 'GreetingCardPreview.jsx');
const replacementFilePath = path.join(__dirname, 'replacement.txt');

try {
    const targetContent = fs.readFileSync(targetFilePath, 'utf8');
    const replacementContent = fs.readFileSync(replacementFilePath, 'utf8');

    const startMarker = 'function CosmicDriftFull({ card }) {';
    const endMarker = 'function GreetingCardPreviewContent({ card }) {';

    const startIndex = targetContent.indexOf(startMarker);
    const endIndex = targetContent.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
        console.error('CRITICAL ERROR: Start or End marker not found in GreetingCardPreview.jsx!');
        process.exit(1);
    }

    const updatedContent = targetContent.substring(0, startIndex) + replacementContent + '\n\n' + targetContent.substring(endIndex);
    fs.writeFileSync(targetFilePath, updatedContent, 'utf8');
    console.log('SUCCESS: CosmicDriftFull was successfully overhauled in GreetingCardPreview.jsx!');
} catch (err) {
    console.error('ERROR running substitution:', err);
    process.exit(1);
}
