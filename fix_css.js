const fs = require('fs');
const path = '/mnt/c/Users/Admin/Desktop/bt-tickets/src/index.css';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Look for the pattern: } followed by newlines, then } then } then newlines then @media
    // We want to remove the extra } }

    // Regex to match:
    // } (end of .toast-close)
    // \s* (whitespace/newlines)
    // } (extra)
    // \s*
    // } (extra)
    // \s*
    // @media

    const regex = /\}\s*\}\s*\}\s*@media/g;

    if (regex.test(content)) {
        console.log('Found the pattern!');
        const newContent = content.replace(regex, '}\n\n@media');
        fs.writeFileSync(path, newContent);
        console.log('Fixed index.css');
    } else {
        console.log('Pattern not found. Dumping context around @media (min-width: 1024px):');
        const index = content.indexOf('@media (min-width: 1024px)');
        if (index !== -1) {
            console.log(content.substring(index - 50, index + 50));
        } else {
            console.log('@media not found');
        }
    }
} catch (err) {
    console.error(err);
}
