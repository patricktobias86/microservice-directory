// netlify/functions/generate-uuid.js
/**
 * Generates a random UUID v4 and returns it in a JSON response.
 */
const { randomUUID } = require('crypto');

exports.handler = async function() {
  const uuid = randomUUID();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid })
  };
};
