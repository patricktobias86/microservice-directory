# Base64 API

A simple serverless API hosted on Netlify that takes a JSON input with a `name` field and returns the same object with an added `base64` field containing the Base64 (UTF-8) encoding of `name`.

## Prerequisites

- Node.js (>= 14)
- `netlify-cli` installed globally: `npm install -g netlify-cli`

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/base64-api.git
   cd base64-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   netlify dev
   ```
   The function will be available at:
   ```
   http://localhost:8888/base64
   ```

## Usage

Send a `POST` request with a JSON body:
```bash
curl -X POST http://localhost:8888/base64 \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

Response:
```json
{"name":"test","base64":"dGVzdA=="}
```

## Deployment

1. Login to Netlify:
   ```bash
   netlify login
   ```

2. Initialize the project (if first time):
   ```bash
   netlify init
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```
