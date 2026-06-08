# Email Service API

Next.js API-only service for sending email via [Resend](https://resend.com).

## Setup

```bash
cp .env.example .env.local
# Edit .env.local with your Resend API keys and sender addresses
npm install
npm run dev
```

Server runs at [http://localhost:3000](http://localhost:3000).

## Endpoints

Each endpoint has its own API key, Resend API key, and default sender address.

| Endpoint | Path |
|----------|------|
| Thmoas | `POST /api/send/thmoas` |
| Moonsofts (test) | `POST /api/send/moonsofts-test` |
| Moonsofts (prod) | `POST /api/send/moonsofts-prod` |

### `GET /api/health`

Health check and per-endpoint config status.

### Send email

**Headers** (when the endpoint's `API_KEY_*` is set):

- `Authorization: Bearer <API_KEY>`, or
- `X-API-Key: <API_KEY>`

**Body** (JSON):

```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "Plain text body",
  "html": "<p>Optional HTML</p>",
  "from": "optional@example.com",
  "replyTo": "optional@example.com"
}
```

`to` can be a string or array of emails. Either `text` or `html` is required.

**Example:**

```bash
curl -X POST http://localhost:3000/api/send/thmoas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-thmoas-api-key" \
  -d '{"to":"you@example.com","subject":"Test","text":"Hello from the API"}'
```

## Environment variables

Each endpoint needs three variables:

| Endpoint | API key | Resend key | Default sender |
|----------|---------|------------|----------------|
| thmoas | `API_KEY_THMOAS` | `RESEND_API_KEY_THMOAS` | `FROM_THMOAS` |
| moonsofts-test | `API_KEY_MOONSOFTS_TEST` | `RESEND_API_KEY_MOONSOFTS_TEST` | `FROM_MOONSOFTS_TEST` |
| moonsofts-prod | `API_KEY_MOONSOFTS_PROD` | `RESEND_API_KEY_MOONSOFTS_PROD` | `FROM_MOONSOFTS_PROD` |

If an endpoint's `API_KEY_*` is unset, that endpoint is open (useful for local dev). The Resend API key and default `from` address are required to send mail.

\*Required unless every request includes `from`.
