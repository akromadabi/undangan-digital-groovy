const fs = require('fs');
const path = require('path');

const steps = [243, 300, 346];

steps.forEach(step => {
    const file = path.join(__dirname, `tool_call_step_${step}.json`);
    if (!fs.existsSync(file)) return;
    
    const raw = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(raw);
    const chunksStr = obj.ReplacementChunks;
    console.log(`\n================= STEP ${step} chunksStr detail =================`);
    console.log(`Length: ${chunksStr.length}`);
    console.log(`Snippet around 2063:`);
    console.log(chunksStr.substring(2000, 2150));
});
