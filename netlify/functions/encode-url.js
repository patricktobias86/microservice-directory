// netlify/functions/encode-url.js
/**
 * URL encodes the provided "text" field and returns it as "encoded".
 */
const checkRateLimit = require('./rate-limit');

exports.handler = async function(event, context) {
  if (!checkRateLimit()) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  try {
    const data = JSON.parse(event.body || '{}');
    const text = data.text;
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "text" field in request body.' })
      };
    }
    const encoded = encodeURIComponent(text);
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
