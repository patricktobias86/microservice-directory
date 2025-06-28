// scripts/generate-index.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const rootDir = path.resolve(__dirname, '..');
const functionsDir = path.join(rootDir, 'netlify', 'functions');
const indexPath = path.join(rootDir, 'index.html');
const specPath = path.join(rootDir, 'openapi.json');
const docsDir = path.join(rootDir, 'docs-temp');

// Read function files
const files = fs.readdirSync(functionsDir).filter(f => f.endsWith('.js'));


// Prepare basic OpenAPI structure
const spec = {
    openapi: "3.0.0",
    info: {
        title: "Microservice Directory",
        description: "Small free APIs for anyone to use, hosted on Netlify.",
        version: "1.0.0"
    },
    servers: [
        {
            url: "https://microservice-directory.netlify.app",
            description: "Production server"
        }
    ],
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
  const urlPath = `/${name}`;
  const method = name === 'generate-uuid' ? 'get' : 'post';
  spec.paths[urlPath] = {
    [method]: {
      description: desc,
      responses: {
        '200': { description: 'Successful response' },
        ...(method === 'get' ? {} : { '400': { description: 'Invalid request' } })
      }
    }
  };
});

// Write OpenAPI spec
fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));

// Generate documentation using openapi-generator
try {
  execSync(`npx @openapitools/openapi-generator-cli generate -i ${specPath} -g html2 -o ${docsDir}`, { stdio: 'inherit' });
  fs.copyFileSync(path.join(docsDir, 'index.html'), indexPath);
  fs.rmSync(docsDir, { recursive: true, force: true });
  console.log('Generated index.html with', files.length, 'endpoints using openapi-generator.');
} catch (err) {
  console.error('Failed to generate documentation:', err);
}
