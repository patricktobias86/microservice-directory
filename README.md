[![Netlify Status](https://api.netlify.com/api/v1/badges/e63407ac-f5f2-4d43-b67b-9a33518dbafc/deploy-status)](https://app.netlify.com/projects/microservice-directory/deploys)

# Microservice Directory

A set of simple serverless APIs hosted on Netlify.

`/encode/base64` takes a JSON input with a `value` field and returns a response with an `encoded` field containing the Base64 (UTF-8) encoding of that value.
Additional endpoints cover Base64 decoding, URL encoding/decoding, hex encoding/decoding, hashing, UUID generation and timestamps.

This project uses a `swagger.json` file for all functions and loads Swagger UI from unpkg via `index.html`.

## Prerequisites

- Node.js (>= 14)
- `netlify-cli` installed globally: `npm install -g netlify-cli`

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/patricktobias86/microservice-directory.git
   cd microservice-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file with a `RATE_LIMIT_RPS` value to limit
   requests per second. Example:
   ```bash
   echo "RATE_LIMIT_RPS=5" > .env
   ```

4. Run locally:
   ```bash
   netlify dev
   ```
   - API index page: `http://localhost:8888/`

## Usage

Send a `POST` request with a JSON body:
```bash
curl -X POST http://localhost:8888/encode/base64 \
  -H "Content-Type: application/json" \
  -d '{"value":"test"}'
```

Response:
```json
{"encoded":"dGVzdA=="}
```

## Rate Limiting

If `RATE_LIMIT_RPS` is set in the `.env` file, all functions enforce the
specified number of requests per second. When the limit is exceeded, functions
return HTTP `429` with `{ "error": "Too many requests" }`.
