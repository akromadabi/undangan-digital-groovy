const fs = require('fs');
const Jimp = require('jimp');

async function removeWhiteBackground(inputPath, outputPath) {
    try {
        const image = await Jimp.read(inputPath);
        const targetColor = { r: 255, g: 255, b: 255, a: 255 }; // White
        const colorDistance = (c1, c2) => {
            return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
        };
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const currentR = this.bitmap.data[idx + 0];
            const currentG = this.bitmap.data[idx + 1];
            const currentB = this.bitmap.data[idx + 2];
            
            // If the pixel is close to white, make it completely transparent
            if (colorDistance(targetColor, { r: currentR, g: currentG, b: currentB }) < 30) {
                this.bitmap.data[idx + 3] = 0; // Set Alpha to 0
            } else {
                // optional edge smoothing based on distance
                const dist = colorDistance(targetColor, { r: currentR, g: currentG, b: currentB });
                if (dist < 60) {
                    this.bitmap.data[idx + 3] = Math.floor((dist - 30) * (255 / 30));
                }
            }
        });

        await image.writeAsync(outputPath);
        console.log(`Successfully processed ${outputPath}`);
    } catch (err) {
        console.error('Error processing image:', err);
    }
}

async function main() {
    const heroInput = 'C:\\Users\\Mazin Si Kecil\\.gemini\\antigravity\\brain\\cb9f2fa1-5eac-401b-8981-2655231bb115\\wedding_hero_transparent_1773941494221.png';
    const heroOutput = 'C:\\laragon\\www\\Undangan Digital\\public\\images\\wedding_hero.png';
    
    const reviewInput = 'C:\\Users\\Mazin Si Kecil\\.gemini\\antigravity\\brain\\cb9f2fa1-5eac-401b-8981-2655231bb115\\happy_review_transparent_1773941510148.png';
    const reviewOutput = 'C:\\laragon\\www\\Undangan Digital\\public\\images\\happy_review.png';

    await removeWhiteBackground(heroInput, heroOutput);
    await removeWhiteBackground(reviewInput, reviewOutput);
}

main();
