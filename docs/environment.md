# 🔐 ENVIRONMENT VARIABLES — Complete Reference
> **Every environment variable, its purpose, where it is used, and whether it is safe for the browser.**

---

## Security Rules

- Variables prefixed `NEXT_PUBLIC_` are bundled into the browser — **NEVER put secrets here**
- `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS — **server-only, never expose to client**
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` — **server-only**
- `RESEND_API_KEY` — **server-only**
- Never commit `.env` or `.env.local` to git — only `.env.example`

---

## `.env.example` — Full Template

```bash
# ============================================================
# SUPABASE
# ============================================================

# Public — safe for browser
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Server only — bypasses RLS, never expose to browser
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# ============================================================
# STRIPE
# ============================================================

# Public — safe for browser (used in frontend if needed)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Server only
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs — created in Stripe Dashboard
# Public — just IDs, not secrets
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_...

# ============================================================
# APP
# ============================================================

# Public — used for absolute URLs in OG tags, emails, redirects
NEXT_PUBLIC_URL=http://localhost:3000
# Production: NEXT_PUBLIC_URL=https://yourdomain.com

# ============================================================
# EMAIL — RESEND
# ============================================================

# Server only
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# ============================================================
# MONITORING — SENTRY (Phase 3+)
# ============================================================

# Public — Sentry DSN is intentionally public
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=      ← Server only — for sourcemap upload
SENTRY_ORG=your-org
SENTRY_PROJECT=trading-course-web
```

---

## Variable Usage Map

| Variable | Used In | Server/Client |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase browser + server client | Both |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase browser + server client | Both |
| `SUPABASE_SERVICE_ROLE_KEY` | Stripe webhook handler only | Server |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend if using Stripe.js directly | Client |
| `STRIPE_SECRET_KEY` | All Stripe API calls | Server |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification | Server |
| `NEXT_PUBLIC_STRIPE_PRICE_*` | PricingCards component, checkout button | Client |
| `NEXT_PUBLIC_URL` | Email templates, OG tags, Stripe redirects | Both |
| `RESEND_API_KEY` | Email sending after purchase | Server |
| `RESEND_FROM_EMAIL` | Email sender address | Server |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking | Client |

---

## Local Development Setup

```bash
# 1. Copy the template
cp .env.example .env.local

# 2. Fill in values from:
#    Supabase: https://app.supabase.com → Project Settings → API
#    Stripe: https://dashboard.stripe.com → Developers → API Keys
#    Resend: https://resend.com → API Keys

# 3. Start the dev server
pnpm dev

# For Stripe webhooks in local dev — use Stripe CLI:
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook signing secret it prints → STRIPE_WEBHOOK_SECRET
```

---

## Adding a New Environment Variable

When adding any new env var:
1. Add it to `.env.local` (your local)
2. Add it to `.env.example` with a blank value + comment
3. Add it to Vercel dashboard (Settings → Environment Variables)
4. Document it in this file
5. If it's a secret, add it to the "Server only" section of this file

---

*Last updated: Phase 0*