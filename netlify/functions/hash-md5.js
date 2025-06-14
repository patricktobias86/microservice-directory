// netlify/functions/hash-md5.js
/**
 * Returns the MD5 hash of a given "text" field from the JSON payload.
 */
const crypto = require('crypto');

exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');
    const text = data.text;
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "text" field in request body.' })
      };
    }
    const md5 = crypto.createHash('md5').update(text, 'utf8').digest('hex');
    const response = { ...data, md5 };
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
