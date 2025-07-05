// netlify/functions/decode-hex.js
/**
 * Decodes a hex string provided in the "value" field and returns it as "decoded".
 */
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
  record('decodeHex');
  try {
    const data = JSON.parse(event.body || '{}');
    const value = data.value;
    if (!value) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "value" field in request body.' })
      };
    }
    const decoded = Buffer.from(value, 'hex').toString('utf8');
    const response = { decoded };
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
