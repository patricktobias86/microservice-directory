# Microservice Directory

A set of simple serverless APIs hosted on Netlify.

`/encode/base64` takes a JSON input with a `value` field and returns a response with an `encoded` field containing the Base64 (UTF-8) encoding of that value.

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

3. Run locally:
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
