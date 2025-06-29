let requestCount = 0;
let lastReset = Date.now();
const limit = parseInt(process.env.RATE_LIMIT_RPS, 10);

function checkRateLimit() {
  if (!limit || Number.isNaN(limit)) {
    return true;
  }
  const now = Date.now();
  if (now - lastReset >= 1000) {
    requestCount = 0;
    lastReset = now;
  }
  requestCount += 1;
  return requestCount <= limit;
}

module.exports = checkRateLimit;
