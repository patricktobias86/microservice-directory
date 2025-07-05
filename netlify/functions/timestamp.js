// netlify/functions/timestamp.js
/**
 * Returns the current timestamp in ISO 8601 and UNIX format.
 * Accepts an optional `timezone` query parameter using IANA names
 * like "America/New_York". Defaults to UTC.
 */
const checkRateLimit = require('./rate-limit');
const { record } = require('./usage');

function formatIso(date, zone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = fmt.formatToParts(date);
  const get = type => parts.find(p => p.type === type).value;
  const base = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: zone }));
  const diff = Math.round((tzDate.getTime() - date.getTime()) / 60000);
  const sign = diff > 0 ? '+' : diff < 0 ? '-' : '+';
  const abs = Math.abs(diff);
  const offset = `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
  return base + offset;
}

exports.handler = async function(event) {
  if (!checkRateLimit()) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  record('timestamp');
  const zone = (event && event.queryStringParameters && event.queryStringParameters.timezone) || 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid timezone' })
    };
  }
  const now = new Date();
  const iso = formatIso(now, zone);
  const unix = Math.floor(now.getTime() / 1000);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iso, unix })
  };
};
