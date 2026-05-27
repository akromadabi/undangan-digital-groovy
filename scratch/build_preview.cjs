const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const targetFile = path.join(projectRoot, 'resources', 'js', 'Pages', 'GreetingCardPreview.jsx');

const cosmicFile = path.join(__dirname, 'replacement.txt'); // contains CosmicDriftFull
const retroFile = path.join(__dirname, 'retroarcade.txt');
const cyberFile = path.join(__dirname, 'cyberpunk.txt');
const bioFile = path.join(__dirname, 'bioluminescent.txt');
const forestFile = path.join(__dirname, 'mysticforest.txt');

try {
    let originalCode = fs.readFileSync(targetFile, 'utf8');
    
    // Check if we already merged to prevent duplicate merging
    if (originalCode.includes('RetroArcadeFull') || originalCode.includes('BioluminescentFull')) {
        console.log("GreetingCardPreview.jsx already seems to contain the new templates. We will restore clean base first.");
        // Revert the file from git first to make it clean
        const { execSync } = require('child_process');
        execSync(`git checkout resources/js/Pages/GreetingCardPreview.jsx`, { cwd: projectRoot });
        originalCode = fs.readFileSync(targetFile, 'utf8');
        console.log("Reverted GreetingCardPreview.jsx from git successfully.");
    }
    
    // Read the new templates code
    const cosmicCode = fs.readFileSync(cosmicFile, 'utf8');
    const retroCode = fs.readFileSync(retroFile, 'utf8');
    const cyberCode = fs.readFileSync(cyberFile, 'utf8');
    const bioCode = fs.readFileSync(bioFile, 'utf8');
    const forestCode = fs.readFileSync(forestFile, 'utf8');
    
    // Find the split point
    const splitStr = '/* ─────────────────────────────────────────────────────────\n   ROOT PREVIEW PAGE';
    const splitStrWindows = '/* ─────────────────────────────────────────────────────────\r\n   ROOT PREVIEW PAGE';
    
    let index = originalCode.indexOf(splitStr);
    let splitLength = splitStr.length;
    if (index === -1) {
        index = originalCode.indexOf(splitStrWindows);
        splitLength = splitStrWindows.length;
    }
    
    if (index === -1) {
        console.error("CRITICAL ERROR: Could not find split marker in GreetingCardPreview.jsx!");
        process.exit(1);
    }
    
    const part1 = originalCode.substring(0, index);
    const part2 = originalCode.substring(index);
    
    // Build the middle block (all components)
    const newComponentsBlock = [
        '\n\n',
        cosmicCode,
        '\n\n',
        retroCode,
        '\n\n',
        cyberCode,
        '\n\n',
        bioCode,
        '\n\n',
        forestCode,
        '\n\n'
    ].join('');
    
    // Replace the rendering router inside part2
    const targetRouter = `            {normalizedCard.template === 'stillwithyou' ? (
                <StillWithYouFull card={normalizedCard} />
            ) : (
                <GiftForAnitaFull card={normalizedCard} />
            )}`;
            
    const targetRouterCRLF = `            {normalizedCard.template === 'stillwithyou' ? (\r
                <StillWithYouFull card={normalizedCard} />\r
            ) : (\r
                <GiftForAnitaFull card={normalizedCard} />\r
            )}`;
            
    const newRouter = `            {normalizedCard.template === 'stillwithyou' ? (
                <StillWithYouFull card={normalizedCard} />
            ) : normalizedCard.template === 'giftforanita' ? (
                <GiftForAnitaFull card={normalizedCard} />
            ) : normalizedCard.template === 'cosmicdrift' ? (
                <CosmicDriftFull card={normalizedCard} />
            ) : normalizedCard.template === 'retroarcade' ? (
                <RetroArcadeFull card={normalizedCard} />
            ) : normalizedCard.template === 'cyberpunk' ? (
                <CyberpunkFull card={normalizedCard} />
            ) : normalizedCard.template === 'bioluminescent' ? (
                <BioluminescentFull card={normalizedCard} />
            ) : normalizedCard.template === 'mysticforest' ? (
                <MysticForestFull card={normalizedCard} />
            ) : (
                <GiftForAnitaFull card={normalizedCard} />
            )}`;
            
    let updatedPart2 = part2;
    if (part2.includes(targetRouter)) {
        updatedPart2 = part2.replace(targetRouter, newRouter);
    } else if (part2.includes(targetRouterCRLF)) {
        updatedPart2 = part2.replace(targetRouterCRLF, newRouter);
    } else {
        console.warn("WARNING: Router switch pattern was not found in part2! Trying relaxed replacement.");
        // fallback search for conditional
        const fallbackRegex = /\{\s*normalizedCard\.template\s*===\s*'stillwithyou'\s*\?[\s\S]*?<StillWithYouFull[\s\S]*?<GiftForAnitaFull[\s\S]*?\}/;
        if (fallbackRegex.test(part2)) {
            updatedPart2 = part2.replace(fallbackRegex, newRouter);
        } else {
            console.error("CRITICAL ERROR: Failed to replace template routing block in GreetingCardPreview.jsx!");
            process.exit(1);
        }
    }
    
    // Combine everything
    const finalCode = part1 + newComponentsBlock + updatedPart2;
    
    // Write back
    fs.writeFileSync(targetFile, finalCode, 'utf8');
    console.log("SUCCESS: Merged and updated GreetingCardPreview.jsx successfully!");
    
} catch(err) {
    console.error("An error occurred during build:", err);
    process.exit(1);
}
