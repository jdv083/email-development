const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node check-tags.js <html-file>');
  process.exit(2);
}

const text = fs.readFileSync(path.resolve(file), 'utf8');
const voidTags = new Set([
  'area','base','br','col','embed','hr','img','input','keygen','link','meta','param','source','track','wbr'
]);

// remove HTML comments (including conditional comments) to avoid false matches
const stripped = text.replace(/<!--([\s\S]*?)-->/g, '');

const tagRegex = /<\s*(\/)?\s*([a-zA-Z0-9:-]+)([^>]*)>/g;
let match;
const stack = [];
const unmatchedClosings = [];

function lineOfIndex(idx) {
  return text.slice(0, idx).split('\n').length;
}

while ((match = tagRegex.exec(stripped)) !== null) {
  const [full, closingSlash, tagName, rest] = match;
  const rawIndex = match.index;
  const idx = rawIndex; // position in stripped string, but we'll map to original using heuristic
  const lc = tagName.toLowerCase();

  // ignore DOCTYPE and processing instructions
  if (lc.startsWith('!') || lc.startsWith('?')) continue;

  // detect self-closing '/>' in rest
  const selfClosing = /\/$/.test(rest) || rest.includes('/>');

  if (closingSlash) {
    // closing tag
    // pop until matching tag found
    let found = false;
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].tag === lc) {
        stack.splice(i);
        found = true;
        break;
      }
    }
    if (!found) unmatchedClosings.push({tag: lc, line: lineOfIndex(idx)});
  } else {
    // opening tag
    if (voidTags.has(lc) || selfClosing) continue;
    stack.push({tag: lc, line: lineOfIndex(idx)});
  }
}

if (unmatchedClosings.length === 0 && stack.length === 0) {
  console.log('No unmatched or unclosed tags found.');
  process.exit(0);
}

if (unmatchedClosings.length) {
  console.log('Unmatched closing tags:');
  unmatchedClosings.forEach(u => console.log(`</${u.tag}> at approx line ${u.line}`));
}

if (stack.length) {
  console.log('\nUnclosed opening tags (remaining on stack, innermost last):');
  stack.forEach(s => console.log(`<${s.tag}> opened at approx line ${s.line}`));
}

process.exit(0);
