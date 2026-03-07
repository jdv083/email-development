const fs = require('fs');
const path = require('path');
const file = process.argv[2];
if (!file) { console.error('Usage: node fix-centers.js <file>'); process.exit(2); }
const p = path.resolve(file);
let s = fs.readFileSync(p, 'utf8');
// Fix nested conditional comments
s = s.split('<!--[if !mso]><!-- -->').join('<!--[if !mso]><!-->');
// Replace center tags conservatively
s = s.split('<center').join('<div');
s = s.split('</center>').join('</div>');
fs.writeFileSync(p, s, 'utf8');
console.log('Applied replacements to', p);
