// netlify/functions/timestamp.js
/**
 * Returns the current timestamp in ISO 8601 format.
 */
const checkRateLimit = require('./rate-limit');

exports.handler = async function() {
  if (!checkRateLimit()) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  const timestamp = new Date().toISOString();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamp })
  };
};
