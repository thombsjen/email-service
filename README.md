# Email Service API

Next.js API-only service for sending email over SMTP.

## Setup

```bash
cp .env.example .env.local
# Edit .env.local with your SMTP credentials
npm install
npm run dev
```

Server runs at [http://localhost:3000](http://localhost:3000).

## Endpoints

### `GET /api/health`

Health check and config status.

### `POST /api/send`

Send an email.

**Headers** (when `API_KEY` is set):

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
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-api-key" \
  -d '{"to":"you@example.com","subject":"Test","text":"Hello from the API"}'
```

## Environment variables

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `SMTP_HOST`    | yes      | SMTP server hostname                 |
| `SMTP_PORT`    | no       | Port (default `587`)                 |
| `SMTP_SECURE`  | no       | `true` for TLS on connect (port 465) |
| `SMTP_USER`    | yes      | SMTP username                        |
| `SMTP_PASS`    | yes      | SMTP password                        |
| `SMTP_FROM`    | yes*     | Default From address                 |
| `API_KEY`      | no       | If set, requests must authenticate   |

\*Required unless every request includes `from`.
