const { execSync } = require('child_process');
const fs = require('fs');

try {
    const diff = execSync('git diff resources/js/Pages/Dashboard/GreetingCard/Form.jsx', { encoding: 'utf8' });
    fs.writeFileSync('scratch/form_diff_clean.txt', diff, 'utf8');
    console.log("Successfully wrote clean diff to scratch/form_diff_clean.txt. Length:", diff.length);
} catch (err) {
    console.error(err);
}
