const https = require('https');
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node w3c-validate.js <html-file>');
  process.exit(2);
}

const html = fs.readFileSync(path.resolve(file), 'utf8');

const options = {
  hostname: 'validator.w3.org',
  port: 443,
  path: '/nu/?out=json',
  method: 'POST',
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(html),
    'User-Agent': 'node-w3c-validator-script'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (!json.messages || json.messages.length === 0) {
        console.log('W3C validator: no messages (document appears valid).');
        return;
      }
      console.log(`W3C validator: found ${json.messages.length} message(s):\n`);
      json.messages.forEach((m, i) => {
        const type = m.type || 'info';
        const line = m.lastLine || m.firstLine || 'unknown';
        const col = m.lastColumn || m.firstColumn || '';
        const extract = m.extract ? (`\nExtract: ${m.extract.trim()}`) : '';
        console.log(`${i+1}. [${type.toUpperCase()}] line ${line}${col ? (','+col) : ''} — ${m.message}${extract}\n`);
      });
    } catch (err) {
      console.error('Failed to parse validator response:', err.message);
      console.error('Raw response:\n', data);
      process.exit(2);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
  process.exit(2);
});

req.write(html);
req.end();
