// netlify/functions/decode-base64.js
/**
 * Reads a JSON payload with a "value" field containing a Base64 string and
 * returns a JSON object with a "decoded" field containing the UTF-8 value.
 */
exports.handler = async function(event, context) {
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
