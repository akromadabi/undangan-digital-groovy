const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Mazin Si Kecil\\.gemini\\antigravity\\brain\\6f31158c-4527-4cbe-9457-e1211d7e2019\\.system_generated\\logs\\transcript.jsonl';
const outputDir = __dirname;

try {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    console.log(`Total log lines: ${lines.length}`);
    
    let matchCount = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        if (line.includes('multi_replace_file_content') || line.includes('replace_file_content')) {
            try {
                const parsed = JSON.parse(line);
                const toolCalls = parsed.tool_calls || [];
                for (const call of toolCalls) {
                    if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
                        matchCount++;
                        const args = call.args || {};
                        const targetFile = args.TargetFile || '';
                        console.log(`Match ${matchCount}: Step ${parsed.step_index}, Target: ${targetFile}`);
                        
                        // Let's write this tool call args to a file
                        const outPath = path.join(outputDir, `tool_call_step_${parsed.step_index}.json`);
                        fs.writeFileSync(outPath, JSON.stringify(args, null, 2), 'utf8');
                        console.log(`Saved to ${outPath}`);
                    }
                }
            } catch (e) {
                // Ignore parse errors on truncated lines
            }
        }
    }
} catch (err) {
    console.error(err);
}
