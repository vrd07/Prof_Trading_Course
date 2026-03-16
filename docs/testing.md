# 🧪 TESTING — Strategy & Patterns
> **When to test, what to test, and exactly how to write each type of test.**

---

## Testing Philosophy

Tests are written **during Phase 3**, not during Phase 1 content build. The priority order is:
1. Working, correct product (Phases 1-2)
2. Critical path tests for payment and auth flows (Phase 3)
3. Comprehensive test coverage (Phase 4+)

**Do not spend time writing tests during Phase 1 or 2.** Getting the product working and the content built is more valuable than test coverage at this stage.

---

## What Must Always Be Tested (Phase 3+)

### Critical Path — Test These First

| Test | Why |
|---|---|
| Stripe webhook handler | Processes real money — must be bulletproof |
| Auth middleware paywall | Content security — wrong = content exposed |
| Supabase RLS policies | Second layer of content security |
| Quiz submission + scoring | Core learning loop |
| Lesson completion + streak | Progress tracking integrity |

### What Can Be Tested Later

- Component rendering
- Animation behaviour
- Dashboard data display
- Profile updates

---

## Testing Stack (Phase 3)

| Tool | Purpose |
|---|---|
| **Vitest** | Unit tests — fast, Vite-based |
| **Testing Library** | React component tests |
| **Playwright** | E2E — critical user journeys |
| **MSW (Mock Service Worker)** | Mock Supabase + Stripe in tests |

---

## Test File Locations

```
apps/web/
├── __tests__/
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── lessonHelpers.test.ts
│   │   │   └── progressCalc.test.ts
│   │   └── api/
│   │       ├── stripe-webhook.test.ts     ← CRITICAL
│   │       ├── quiz-submit.test.ts        ← CRITICAL
│   │       └── progress-complete.test.ts  ← CRITICAL
│   ├── components/
│   │   ├── QuizBlock.test.tsx
│   │   └── PaywallGate.test.tsx
│   └── e2e/                              ← Playwright
│       ├── auth.spec.ts                  ← Signup, login, logout
│       ├── lesson.spec.ts                ← View lesson, complete quiz
│       └── payment.spec.ts               ← Upgrade flow (Stripe test mode)
```

---

## Test Patterns

### API Route Unit Test

```typescript
// __tests__/unit/api/quiz-submit.test.ts
import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/quiz/submit/route'

describe('POST /api/quiz/submit', () => {
  it('returns 401 when not authenticated', async () => {
    const req = new Request('http://localhost/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ lessonId: '1.1', answers: [0, 1, 2, 3, 0] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('calculates score correctly', async () => {
    // Mock auth + DB...
    // Test that score = correct answers out of 5
  })

  it('marks lesson complete when passed', async () => {
    // Test side effect of passing quiz
  })
})
```

### Stripe Webhook Test

```typescript
// __tests__/unit/api/stripe-webhook.test.ts
// This is the most important test in the codebase
describe('POST /api/stripe/webhook', () => {
  it('rejects requests with invalid signature', async () => { ... })
  it('handles checkout.session.completed — sets user to pro', async () => { ... })
  it('handles subscription.deleted — downgrades user to free', async () => { ... })
  it('is idempotent — processing same event twice is safe', async () => { ... })
})
```

### E2E Critical Path Test

```typescript
// __tests__/e2e/lesson.spec.ts
test('user can complete a free lesson', async ({ page }) => {
  await page.goto('/learn/beginner/unit-1-how-forex-works/1.1-what-is-forex')
  await expect(page.getByRole('heading', { name: 'What is Forex?' })).toBeVisible()

  // Answer quiz correctly
  for (const question of [1, 3, 0, 2, 3]) {
    await page.getByTestId(`option-${question}`).click()
    await page.waitForTimeout(1200) // Feedback animation
  }

  // Lesson should be marked complete
  await expect(page.getByTestId('lesson-complete')).toBeVisible()
})
```

---

*Last updated: Phase 0*
*Tests to be written in Phase 3 — not a priority during Phase 1/2*