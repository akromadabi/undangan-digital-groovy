const puppeteer = require('puppeteer');

const url = process.argv[2];
const outputPath = process.argv[3];
const width = parseInt(process.argv[4]) || 375;
const height = parseInt(process.argv[5]) || 812;
const delay = parseInt(process.argv[6]) || 4000;

if (!url || !outputPath) {
    console.error("Usage: node screenshot_worker.cjs <url> <outputPath> [width] [height] [delay]");
    process.exit(1);
}

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: width,
            height: height,
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 2
        });

        // Set user agent to mobile
        await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1");

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        console.log(`Waiting for ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));

        console.log(`Saving screenshot to ${outputPath}...`);
        await page.screenshot({ path: outputPath, type: 'jpeg', quality: 90 });

        console.log("Screenshot captured successfully!");
        await browser.close();
        process.exit(0);
    } catch (error) {
        console.error("Puppeteer error:", error);
        if (browser) await browser.close();
        process.exit(1);
    }
})();
