// netlify/functions/encode-hex.js
/**
 * Converts the provided "value" field to a hex string and returns it as "encoded".
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
  record('encodeHex');
  try {
    const data = JSON.parse(event.body || '{}');
    const value = data.value;
    if (!value) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "value" field in request body.' })
      };
    }
    const encoded = Buffer.from(value, 'utf8').toString('hex');
    const response = { encoded };
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
