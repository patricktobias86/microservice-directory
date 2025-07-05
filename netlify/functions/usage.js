const fs = require('fs');
const path = require('path');

const statsFile = path.join(__dirname, '..', 'usage.json');

let stats = {};
try {
  const data = fs.readFileSync(statsFile, 'utf8');
  stats = JSON.parse(data);
} catch {
  stats = {};
}

function record(name) {
  stats[name] = (stats[name] || 0) + 1;
  try {
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  } catch {
    // ignore write errors
  }
}

function getStats() {
  return stats;
}

module.exports = { record, getStats };
