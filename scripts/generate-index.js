// scripts/generate-index.js
const fs = require('fs');
const path = require('path');

// Paths
const rootDir = path.resolve(__dirname, '..');
const functionsDir = path.join(rootDir, 'netlify', 'functions');
const indexPath = path.join(rootDir, 'index.html');

// Read function files
const files = fs.readdirSync(functionsDir).filter(f => f.endsWith('.js'));


// Prepare basic OpenAPI structure
const spec = {
  openapi: '3.0.0',
  info: {
    title: 'Microservice Directory',
    version: '1.0.0'
  },
  paths: {}
};


 files.forEach(file => {
   const content = fs.readFileSync(path.join(functionsDir, file), 'utf8');
   const match = content.match(/\/\*\*([\s\S]*?)\*\//);
   let desc = '';
   if (match) {
     const lines = match[1]
       .split('\n')
       .map(l => l.replace(/^\s*\*\s?/, '').trim());
     desc = lines.find(line => line && !line.startsWith('@')) || '';
   }
   const name = path.basename(file, '.js');
   const urlPath = name === 'encode-base64'
     ? '/encode-base64'
     : `/.netlify/functions/${name}`;
   spec.paths[urlPath] = {
     post: {
       description: desc
     }
   };
});

// Write index.html containing the OpenAPI JSON
fs.writeFileSync(indexPath, JSON.stringify(spec, null, 2));
console.log('Generated index.html with', files.length, 'endpoints in OpenAPI format.');
