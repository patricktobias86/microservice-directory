const test = require('node:test');
const assert = require('node:assert');

const encodeBase64 = require('../netlify/functions/encode-base64.js');
const decodeBase64 = require('../netlify/functions/decode-base64.js');
const encodeUrl = require('../netlify/functions/encode-url.js');
const decodeUrl = require('../netlify/functions/decode-url.js');
const hashMd5 = require('../netlify/functions/hash-md5.js');
const generateUuid = require('../netlify/functions/generate-uuid.js');
const timestamp = require('../netlify/functions/timestamp.js');
const stats = require('../netlify/functions/stats.js');
const fs = require('fs');

// Test encodeBase64
test('encodeBase64 encodes text to base64', async () => {
  const event = { body: JSON.stringify({ value: 'test' }) };
  const res = await encodeBase64.handler(event);
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.body), { encoded: 'dGVzdA==' });
});

// Test decodeBase64
test('decodeBase64 decodes base64 to text', async () => {
  const event = { body: JSON.stringify({ value: 'dGVzdA==' }) };
  const res = await decodeBase64.handler(event);
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.body), { decoded: 'test' });
});

// Test encodeUrl
test('encodeUrl encodes text for URL usage', async () => {
  const text = 'https://microservice-directory.netlify.app';
  const event = { body: JSON.stringify({ text }) };
  const res = await encodeUrl.handler(event);
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.body), {
    encoded: encodeURIComponent(text)
  });
});

// Test decodeUrl
test('decodeUrl decodes URL encoded text', async () => {
  const encoded = encodeURIComponent('https://example.com');
  const event = { body: JSON.stringify({ encoded }) };
  const res = await decodeUrl.handler(event);
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.body), { decoded: 'https://example.com' });
});

// Test hashMd5
test('hashMd5 returns md5 hash of text', async () => {
  const event = { body: JSON.stringify({ text: 'hello' }) };
  const res = await hashMd5.handler(event);
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.body), {
    hash: '5d41402abc4b2a76b9719d911017c592'
  });
});

// Test generateUuid
test('generateUuid returns a uuid v4', async () => {
  const res = await generateUuid.handler();
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.match(body.uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

// Test timestamp
test('timestamp returns iso and unix for timezone', async () => {
  const event = { queryStringParameters: { timezone: 'UTC' } };
  const res = await timestamp.handler(event);
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.ok(body.iso.endsWith('+00:00'));
  assert.ok(Number.isInteger(body.unix));
});

test('timestamp rejects invalid timezone', async () => {
  const event = { queryStringParameters: { timezone: 'Invalid/Zone' } };
  const res = await timestamp.handler(event);
  assert.strictEqual(res.statusCode, 400);
});

// Test usage stats
test('stats endpoint returns usage counts', async () => {
  await encodeBase64.handler({ body: JSON.stringify({ value: 'check' }) });
  const res = await stats.handler();
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.ok(body.encodeBase64 >= 1);
});

// Validate swagger.json with online Swagger validator
test('swagger.json is valid', async () => {
  const schema = fs.readFileSync('./swagger.json', 'utf8');
  const res = await fetch('https://validator.swagger.io/validator/debug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: schema
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.deepStrictEqual(body, { schemaValidationMessages: [] });
});
