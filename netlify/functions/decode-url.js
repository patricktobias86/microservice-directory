// netlify/functions/decode-url.js
/**
 * Decodes a URL encoded string from the "encoded" field and returns it as "decoded".
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
  record('decodeUrl');
  try {
    const data = JSON.parse(event.body || '{}');
    const encoded = data.encoded;
    if (!encoded) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "encoded" field in request body.' })
      };
    }
    const decoded = decodeURIComponent(encoded);
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
