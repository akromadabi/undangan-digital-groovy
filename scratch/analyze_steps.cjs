const fs = require('fs');
const path = require('path');

const steps = [243, 300, 346];

steps.forEach(step => {
    const file = path.join(__dirname, `tool_call_step_${step}.json`);
    if (!fs.existsSync(file)) {
        console.log(`Step ${step} json not found.`);
        return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`\n===================================`);
    console.log(`STEP ${step}:`);
    console.log(`Description: ${data.Description}`);
    console.log(`Instruction: ${data.Instruction}`);
    
    // Replacement chunks
    let chunks = data.ReplacementChunks;
    if (typeof chunks === 'string') {
        try {
            chunks = JSON.parse(chunks);
        } catch(e) {
            console.log(`Chunks is string but failed to parse: ${e.message}`);
        }
    }
    
    if (Array.isArray(chunks)) {
        console.log(`Chunks count: ${chunks.length}`);
        chunks.forEach((c, idx) => {
            console.log(`Chunk ${idx}: StartLine: ${c.StartLine}, EndLine: ${c.EndLine}`);
            console.log(`TargetContent length: ${c.TargetContent.length}`);
            console.log(`ReplacementContent length: ${c.ReplacementContent.length}`);
        });
    } else if (data.ReplacementChunks) {
        console.log(`Chunks key exists but is not array. Type: ${typeof data.ReplacementChunks}`);
    } else {
        // replace_file_content structure
        console.log(`Using replace_file_content structure:`);
        console.log(`StartLine: ${data.StartLine}, EndLine: ${data.EndLine}`);
        console.log(`TargetContent length: ${data.TargetContent?.length}`);
        console.log(`ReplacementContent length: ${data.ReplacementContent?.length}`);
    }
});
