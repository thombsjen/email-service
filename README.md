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

- `Content-Type: application/json`
- `Authorization: Bearer <API_KEY>`, or
- `X-API-Key: <API_KEY>`

## Email request format

Send a JSON body with these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | `string` or `string[]` | yes | Recipient email(s). Use an array for multiple recipients. |
| `subject` | `string` | yes | Email subject line (1–998 characters). |
| `text` | `string` | one of `text` / `html` | Plain-text body. |
| `html` | `string` | one of `text` / `html` | HTML body. |
| `from` | `string` | no | Sender address. Uses the endpoint's `FROM_*` env var if omitted. |
| `replyTo` | `string` | no | Reply-to address. |

### Plain text email

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome",
  "text": "Hi there,\n\nThanks for signing up.\n\n— The Team"
}
```

The recipient receives a plain-text email with line breaks preserved.

### HTML email

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome",
  "html": "<h1>Welcome!</h1><p>Thanks for signing up.</p><p><a href=\"https://example.com\">Get started</a></p>"
}
```

The recipient receives a formatted HTML email. Use valid HTML tags (`<p>`, `<h1>`, `<a>`, `<strong>`, etc.).

### HTML + plain text (recommended)

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome",
  "text": "Welcome! Thanks for signing up. Get started: https://example.com",
  "html": "<h1>Welcome!</h1><p>Thanks for signing up.</p><p><a href=\"https://example.com\">Get started</a></p>"
}
```

Clients that don't support HTML will see the `text` version.

### Multiple recipients

```json
{
  "to": ["alice@example.com", "bob@example.com"],
  "subject": "Team update",
  "text": "Hello everyone, here is the latest update."
}
```

### Custom sender and reply-to

```json
{
  "to": "recipient@example.com",
  "subject": "Support reply",
  "from": "Support <support@yourdomain.com>",
  "replyTo": "helpdesk@yourdomain.com",
  "text": "We received your message and will respond shortly."
}
```

If `from` is omitted, the endpoint's default sender is used (e.g. `FROM_THMOAS=Thmoas <noreply@yourdomain.com>`).

## API responses

### Success (200)

```json
{
  "ok": true,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

`id` is the Resend email ID. Use it to track delivery in the Resend dashboard.

### Validation error (400)

```json
{
  "error": "Validation failed",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "to": ["Invalid email"]
    }
  }
}
```

### Unauthorized (401)

```json
{
  "error": "Unauthorized"
}
```

### Server error (500 / 503)

```json
{
  "error": "Resend API key for thmoas must be set"
}
```

## Examples

```bash
# Plain text
curl -X POST http://localhost:3000/api/send/thmoas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-thmoas-api-key" \
  -d '{"to":"you@example.com","subject":"Test","text":"Hello from the API"}'

# HTML
curl -X POST http://localhost:3000/api/send/moonsofts-prod \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-moonsofts-prod-api-key" \
  -d '{"to":"you@example.com","subject":"Invoice","html":"<p>Your invoice is <strong>ready</strong>.</p>"}'
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
