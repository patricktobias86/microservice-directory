# Microservice Directory

A set of simple serverless APIs hosted on Netlify.

`encode-base64` takes a JSON input with a `name` field and returns the same object with an added `base64` field containing the Base64 (UTF-8) encoding of `name`.

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

3. Generate the API index (will run automatically on Netlify build):
   ```bash
   npm run generate-index
   ```

4. Run locally:
   ```bash
   netlify dev
   ```
   - API index page: `http://localhost:8888/`

## Usage

Send a `POST` request with a JSON body:
```bash
curl -X POST http://localhost:8888/encode-base64 \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

Response:
```json
{"name":"test","base64":"dGVzdA=="}
```

## Deployment

Netlify will automatically generate and include an `index.html` containing Swagger UI for all functions.

1. Login to Netlify:
   ```bash
   netlify login
   ```

2. Initialize the project:
   ```bash
   netlify init
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```
