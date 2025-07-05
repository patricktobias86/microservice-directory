// netlify/functions/hash-sha256.js
/**
 * Returns the SHA-256 hash of a given "text" field from the JSON payload.
 */
const crypto = require('crypto');
const checkRateLimit = require('./rate-limit');
const { record } = require('./usage');

exports.handler = async function(event) {
  if (!checkRateLimit()) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  record('hashSha256');
  try {
    const data = JSON.parse(event.body || '{}');
    const text = data.text;
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "text" field in request body.' })
      };
    }
    const hash = crypto.createHash('sha256').update(text, 'utf8').digest('hex');
    const response = { hash };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    };
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body.' })
    };
  }
};
