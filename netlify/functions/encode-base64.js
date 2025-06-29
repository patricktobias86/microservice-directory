// netlify/functions/encode-base64.js

/**
 * A Netlify serverless function that reads a JSON payload with a "value" field
 * and returns a JSON object with an "encoded" field containing the Base64
 * (UTF-8) encoding of that value.
 */
const checkRateLimit = require('./rate-limit');

exports.handler = async function(event, context) {
  if (!checkRateLimit()) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests' }),
    };
  }
  try {
    const data = JSON.parse(event.body || '{}');
    const value = data.value;
    if (!value) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "value" field in request body.' }),
      };
    }
    const encoded = Buffer.from(value, 'utf8').toString('base64');
    const response = { encoded };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body.' }),
    };
  }
};
