// scripts/generate-index.js
const fs = require('fs');
const path = require('path');

// Paths
const rootDir = path.resolve(__dirname, '..');
const functionsDir = path.join(rootDir, 'netlify', 'functions');
const indexPath = path.join(rootDir, 'index.html');

// Read function files
const files = fs.readdirSync(functionsDir).filter(f => f.endsWith('.js'));

// Generate HTML
let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Microservice Directory</title>
</head>
<body>
<h1>API Index</h1>
<ul>
`;

files.forEach(file => {
  const content = fs.readFileSync(path.join(functionsDir, file), 'utf8');
  const match = content.match(/\/\*\*([\s\S]*?)\*\//);
  let desc = '';
  if (match) {
    const lines = match[1].split('\n').map(l => l.replace(/^\s*\*\s?/, '').trim());
    desc = lines.find(line => line && !line.startsWith('@')) || '';
  }
  const name = path.basename(file, '.js');
});

html += `</ul>
</body>
</html>`;

// Write index.html
fs.writeFileSync(indexPath, html);
console.log('Generated index.html with', files.length, 'endpoints.');
