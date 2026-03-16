# 📡 API SPECIFICATION — Every Route Documented
> **Every API route in this project — method, auth requirement, request schema, response shape, error codes.**
> Cursor must read this before creating or modifying any file in `app/api/`.

---

## Conventions

- All routes live in `apps/web/app/api/`
- All request bodies are JSON
- All responses are JSON
- All routes validate input with **Zod** before processing
- All routes check authentication unless marked `[PUBLIC]`
- HTTP status codes follow REST conventions strictly
- Error responses always have shape: `{ error: string, details?: any }`

---

## Authentication Routes

### `GET /api/auth/callback` — `[PUBLIC]`
Supabase OAuth callback handler. Exchanges code for session.

**Handled by:** Supabase Auth Helpers — do not modify this route.

**Query params:** `code` (string), `next` (string, optional redirect path)

**Redirects to:** `next` param or `/dashboard`

---

## Progress Routes

### `GET /api/progress`
Fetch the authenticated user's full lesson progress.

**Auth:** Required

**Response `200`:**
```json
{
  "completedLessons": ["1.1", "1.2", "1.3"],
  "totalCompleted": 3,
  "byModule": {
    "beginner": {
      "completed": 3,
      "total": 28,
      "percentage": 10.7
    },
    "intermediate": {
      "completed": 0,
      "total": 30,
      "percentage": 0
    },
    "advanced": {
      "completed": 0,
      "total": 30,
      "percentage": 0
    }
  },
  "streak": {
    "current": 3,
    "lastActiveDate": "2024-01-15"
  }
}
```

**Errors:**
- `401` — Not authenticated

---

### `POST /api/progress/complete`
Mark a lesson as complete. Called after quiz is passed.

**Auth:** Required

**Request body:**
```json
{
  "lessonId": "1.1"
}
```

**Zod schema:**
```typescript
z.object({
  lessonId: z.string().regex(/^\d+\.\d+$/, 'Invalid lesson ID format'),
})
```

**Response `200`:**
```json
{
  "success": true,
  "lessonId": "1.1",
  "newStreak": 4,
  "certificateEarned": null
}
```

**Response `200` (module completed, certificate earned):**
```json
{
  "success": true,
  "lessonId": "5.6",
  "newStreak": 12,
  "certificateEarned": {
    "moduleSlug": "beginner",
    "moduleTitle": "Beginner Forex Trader",
    "issuedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400` — Invalid lessonId format
- `401` — Not authenticated
- `409` — Lesson already marked complete (idempotent — returns 200 anyway in practice)

---

## Quiz Routes

### `GET /api/quiz`
Fetch quiz questions for a lesson.

**Auth:** Required

**Query params:** `lessonId` (string, e.g., `1.1`)

**Response `200`:**
```json
{
  "lessonId": "1.1",
  "questions": [
    {
      "id": "uuid",
      "questionKey": "1.1.q1",
      "questionText": "The Forex market is best described as:",
      "options": [
        "A physical exchange located in New York",
        "A decentralised, global, over-the-counter market",
        "A government-controlled currency exchange system",
        "A marketplace that only operates during US business hours"
      ],
      "order": 1
    }
  ],
  "passingScore": 4,
  "totalQuestions": 5
}
```

**Note:** `correctIndex` and `explanation` are NOT returned here — only returned after submission to prevent cheating.

**Errors:**
- `400` — Missing or invalid lessonId
- `401` — Not authenticated
- `403` — Lesson is paid tier and user is not subscribed
- `404` — No questions found for this lessonId

---

### `POST /api/quiz/submit`
Submit quiz answers, receive score and feedback.

**Auth:** Required

**Request body:**
```json
{
  "lessonId": "1.1",
  "answers": [1, 3, 0, 2, 3]
}
```

**Zod schema:**
```typescript
z.object({
  lessonId: z.string().regex(/^\d+\.\d+$/),
  answers: z.array(z.number().int().min(0).max(3)).length(5),
})
```

**Response `200`:**
```json
{
  "score": 4,
  "total": 5,
  "passed": true,
  "passingScore": 4,
  "results": [
    {
      "questionKey": "1.1.q1",
      "selectedIndex": 1,
      "correctIndex": 1,
      "isCorrect": true,
      "explanation": "The Forex market has no central location..."
    },
    {
      "questionKey": "1.1.q2",
      "selectedIndex": 3,
      "correctIndex": 3,
      "isCorrect": true,
      "explanation": "The Forex market trades approximately $7.5 trillion..."
    }
  ],
  "attemptNumber": 1
}
```

**Side effects:**
- Saves `quiz_attempts` record to database
- If `passed: true`, automatically calls the progress/complete logic
- If this is the last lesson in a module and passed, generates certificate

**Errors:**
- `400` — Invalid request body
- `401` — Not authenticated
- `403` — Lesson is paid and user is not subscribed
- `404` — Questions not found for lessonId

---

## Stripe Payment Routes

### `POST /api/stripe/checkout`
Create a Stripe Checkout session and return the hosted URL.

**Auth:** Required

**Request body:**
```json
{
  "priceId": "price_xxxxxxxxxxxxx",
  "plan": "monthly"
}
```

**Zod schema:**
```typescript
z.object({
  priceId: z.string().startsWith('price_'),
  plan: z.enum(['monthly', 'annual', 'lifetime']),
})
```

**Response `200`:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_xxxxx"
}
```

**Client action after response:** `window.location.href = url`

**Errors:**
- `400` — Invalid priceId or plan
- `401` — Not authenticated
- `500` — Stripe API error

---

### `POST /api/stripe/portal`
Create a Stripe Customer Portal session (for managing/cancelling subscription).

**Auth:** Required

**Request body:** None

**Response `200`:**
```json
{
  "url": "https://billing.stripe.com/session/xxxxx"
}
```

**Errors:**
- `401` — Not authenticated
- `404` — No Stripe customer found for this user
- `500` — Stripe API error

---

### `POST /api/stripe/webhook` — `[PUBLIC — but signature-verified]`
Receives Stripe webhook events. **Not called by the client — called by Stripe.**

**Auth:** None (public endpoint). Verified via `stripe-signature` header.

**CRITICAL:** Always verify webhook signature before processing:
```typescript
const sig = req.headers.get('stripe-signature')!
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
```

**Handled events:**

| Event | Action |
|---|---|
| `checkout.session.completed` | Create/update subscription record, set user tier to `'pro'` |
| `customer.subscription.updated` | Update plan, status, period dates in subscriptions table |
| `customer.subscription.deleted` | Set status to `'cancelled'`, downgrade user_profile tier to `'free'` |
| `invoice.payment_failed` | Set status to `'past_due'`, send payment failed email via Resend |
| `invoice.payment_succeeded` | Update `current_period_end`, ensure status is `'active'` |

**Response `200`:**
```json
{ "received": true }
```

**Errors:**
- `400` — Invalid webhook signature (returns immediately, logs attempt)
- `500` — Database write failed (Stripe will retry)

**IMPORTANT:** Always return `200` even after processing errors when possible — if you return non-2xx, Stripe retries the webhook and you may process it twice. Handle idempotency with the Stripe event ID.

---

## Certificate Routes

### `GET /api/certificates`
Fetch all certificates earned by the authenticated user.

**Auth:** Required

**Response `200`:**
```json
{
  "certificates": [
    {
      "id": "uuid",
      "moduleSlug": "beginner",
      "moduleTitle": "Beginner Forex Trader",
      "pdfUrl": "https://...supabase.co/storage/v1/object/public/certificates/uuid.pdf",
      "issuedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### `POST /api/certificates/generate`
Generate a PDF certificate for a completed module.

**Auth:** Required

**Called by:** Progress completion logic internally — not called directly by the client.

**Request body:**
```json
{
  "moduleSlug": "beginner",
  "userId": "uuid"
}
```

**Response `200`:**
```json
{
  "certificateId": "uuid",
  "pdfUrl": "https://...supabase.co/storage/v1/object/public/certificates/uuid.pdf"
}
```

**Errors:**
- `400` — Module not completed (not all lessons passed)
- `401` — Not authenticated
- `409` — Certificate already exists for this module

---

## User Profile Routes

### `GET /api/profile`
Fetch the authenticated user's profile.

**Auth:** Required

**Response `200`:**
```json
{
  "id": "uuid",
  "displayName": "John Trader",
  "avatarUrl": "https://...",
  "tier": "pro",
  "streakCount": 7,
  "joinedAt": "2024-01-01T00:00:00Z"
}
```

---

### `PATCH /api/profile`
Update display name or avatar URL.

**Auth:** Required

**Request body (all fields optional):**
```json
{
  "displayName": "John Trader",
  "avatarUrl": "https://..."
}
```

**Zod schema:**
```typescript
z.object({
  displayName: z.string().min(2).max(50).optional(),
  avatarUrl: z.string().url().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})
```

**Response `200`:**
```json
{
  "success": true,
  "profile": { /* updated profile */ }
}
```

---

## Error Response Standard

All errors follow this format:

```typescript
// Standard error response type
interface ApiErrorResponse {
  error: string           // Human-readable error message
  code?: string           // Machine-readable error code (optional)
  details?: unknown       // Zod validation errors or additional context (optional)
}
```

```json
// Example validation error
{
  "error": "Invalid request body",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "path": ["lessonId"],
      "message": "Invalid lesson ID format"
    }
  ]
}

// Example auth error
{
  "error": "Unauthorized",
  "code": "AUTH_REQUIRED"
}

// Example permission error
{
  "error": "This lesson requires a Pro subscription",
  "code": "SUBSCRIPTION_REQUIRED"
}
```

---

## Adding a New Route — Checklist

When adding any new API route:

- [ ] Create file at correct path in `app/api/`
- [ ] Add Zod schema for request validation
- [ ] Add auth check if required
- [ ] Add subscription check if route accesses paid content
- [ ] Handle all error cases with correct status codes
- [ ] Document the route in this file
- [ ] Add route to `.env.example` if it needs new env vars
- [ ] Test with both authenticated and unauthenticated requests

---

*Last updated: Phase 0*
*Update this file every time a route is added, modified, or removed*