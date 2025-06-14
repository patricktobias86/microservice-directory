// netlify/functions/encode-url.js
/**
 * URL encodes the provided "text" field and returns it as "encoded".
 */
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
    const encoded = encodeURIComponent(text);
    const response = { ...data, encoded };
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
