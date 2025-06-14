// netlify/functions/convert-base64.js

/**
 * A Netlify serverless function that reads a JSON payload with a "name" field
 * and returns the original payload with an added "base64" field containing the
 * Base64 (UTF-8) encoding of the "name" value.
 */
exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body || '{}');
    const name = data.name;
    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "name" field in request body.' }),
      };
    }
    const base64 = Buffer.from(name, 'utf8').toString('base64');
    const response = { ...data, base64 };
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
