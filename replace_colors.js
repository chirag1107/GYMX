const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.js')) {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Replace hex
        content = content.replace(/#00ff88/gi, '#4DD21D');

        // Replace rgb inside rgba
        content = content.replace(/0,\s*255,\s*136/g, '77, 210, 29');

        // Replace hover dim green
        content = content.replace(/#00cc6a/gi, '#3EB117');

        if (content !== original) {
            fs.writeFileSync(file, content);
            console.log('Updated ' + file);
        }
    }
});
