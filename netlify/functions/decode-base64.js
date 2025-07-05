// netlify/functions/decode-base64.js
/**
 * Reads a JSON payload with a "value" field containing a Base64 string and
 * returns a JSON object with a "decoded" field containing the UTF-8 value.
 */
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
  record('decodeBase64');
  try {
    const data = JSON.parse(event.body || '{}');
    const encoded = data.value;
    if (!encoded) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "value" field in request body.' })
      };
    }
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
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
