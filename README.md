# Microservice Directory

A set of simple serverless APIs hosted on Netlify.

`encode-base64` takes a JSON input with a `name` field and returns the same object with an added `base64` field containing the Base64 (UTF-8) encoding of `name`.

The `index.json` file defines the API using the OpenAPI specification. Documentation (`index.html`) is generated from this file using **openapi-generator**.

## Prerequisites

- Node.js (>= 20)
- Java 21
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

To update the documentation after modifying `index.json` run:
```bash
npx @openapitools/openapi-generator-cli generate -i index.json -g html2 -o docs-temp && cp docs-temp/index.html index.html && rm -rf docs-temp
```

3. Run locally:
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

Netlify will automatically generate and include an `index.html` containing an OpenAPI definition of all functions.
The build environment uses Node.js 20 and Java 21 to run the OpenAPI generator.

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
