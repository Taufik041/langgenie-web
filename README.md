# langgenie.ai — web app

Marketing site, auth, developer dashboard (Playground, API keys, usage) and docs for **langgenie.ai**, the Odia voice AI platform powered by **BIPROS**.

Only two model modalities exist, by design:

| Model | ID | Endpoint |
| --- | --- | --- |
| Odia → Odia (speech-to-text) | `langgenie-od-od-v1` | `POST /v1/speech-to-text` |
| Odia → English (speech translation) | `langgenie-od-en-v1` | `POST /v1/speech-translate` |

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui (new-york, Radix) · lucide-react · sonner.
Fonts are self-hosted via Fontsource: Outfit (wordmark + headings), Inter (body), Noto Sans Oriya (Odia), JetBrains Mono (code).

## Run

```bash
npm install
cp .env.example .env.local   # set AUTH_SECRET
npm run dev                  # http://localhost:3000
```

## What's real vs. mock

- **Auth** — working email/password signup + login with scrypt-hashed passwords and an HMAC-signed httpOnly session cookie. Users live in a JSON file at `.data/db.json` (`src/lib/db.ts`). Swap that module for Postgres/Prisma/Supabase for production. "Continue with Google" and "Forgot password" show a toast until a real provider is connected.
- **API keys** — real: created in the dashboard, shown once, stored as SHA-256 hashes, revocable. Public API accepts `api-subscription-key: <key>` or `Authorization: Bearer <key>`.
- **Inference** — `src/lib/inference.ts`. With `INFERENCE_URL` unset it returns mock Odia/English output. Set `INFERENCE_URL` (and optionally `INFERENCE_API_KEY`) to forward the audio as multipart `file` to `${INFERENCE_URL}/odia-odia` or `${INFERENCE_URL}/odia-english`; your server should return `{ "transcript": "...", "segments": [...] }`.
- **Usage** — every API/Playground call is logged and shown on Overview/Usage with cost estimated from `pricePerHour` in `src/lib/models.ts`.
- **Contact form** — client-side mock submit.

## Structure

```
src/app/(marketing)   landing, /models/[slug], /pricing, /contact, /terms, /privacy
src/app/(auth)        /login, /signup
src/app/dashboard     overview, playground, api-keys, usage, settings
src/app/docs          docs shell + [[...slug]] pages (content in src/content/docs.tsx)
src/app/api           auth, keys, playground, v1/speech-to-text, v1/speech-translate
src/components/ui     shadcn components
src/components/site   header, footer, wordmark, voice demo, code block, auth form
```

Adding more shadcn components: `npx shadcn@latest add <component>` (components.json is configured).

## Before launch

Placeholders to replace: prices (₹30 / ₹45 per hour), ₹500 free credits, rate limits, security/data-residency claims, Terms and Privacy text, `api.langgenie.ai` base URL.
