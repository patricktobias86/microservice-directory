// netlify/functions/generate-uuid.js
/**
 * Generates a random UUID v4 and returns it in a JSON response.
 */
const { randomUUID } = require('crypto');

const checkRateLimit = require('./rate-limit');

exports.handler = async function() {
  if (!checkRateLimit()) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  const uuid = randomUUID();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid })
  };
};
