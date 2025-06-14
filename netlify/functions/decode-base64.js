// netlify/functions/decode-base64.js
/**
 * Reads a JSON payload with a "base64" field and returns the original payload
 * with an added "decoded" field containing the UTF-8 string represented by the
 * Base64 value.
 */
exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');
    const encoded = data.base64;
    if (!encoded) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "base64" field in request body.' })
      };
    }
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const response = { ...data, decoded };
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
