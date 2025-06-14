// netlify/functions/decode-url.js
/**
 * Decodes a URL encoded string from the "encoded" field and returns it as "decoded".
 */
exports.handler = async function(event, context) {
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
