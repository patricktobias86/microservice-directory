// netlify/functions/hash-md5.js
/**
 * Returns the MD5 hash of a given "text" field from the JSON payload.
 */
const crypto = require('crypto');
const checkRateLimit = require('./rate-limit');
const { record } = require('./usage');

exports.handler = async function(event, context) {
  if (!checkRateLimit()) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  record('hashMd5');
  try {
    const data = JSON.parse(event.body || '{}');
    const text = data.text;
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "text" field in request body.' })
      };
    }
    const hash = crypto.createHash('md5').update(text, 'utf8').digest('hex');
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
