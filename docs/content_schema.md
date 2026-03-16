# 📝 CONTENT SCHEMA — MDX Lesson Format Specification
> **The exact format every MDX lesson file must follow. Cursor must read this before creating or editing any `.mdx` file.**

---

## Overview

All 88 lessons are stored as MDX files in the `content/` directory. MDX is Markdown + JSX — you can embed React components directly in lesson prose.

Lesson content is **never stored in the database**. The database stores only metadata (lesson IDs, tiers, ordering). The full text, exercises, and quiz references live in these MDX files.

---

## File Naming Convention

```
content/
└── [module]/
    └── [unit-slug]/
        └── [lesson-id]-[lesson-slug].mdx
```

**Examples:**
```
content/beginner/unit-1-how-forex-works/1.1-what-is-forex.mdx
content/beginner/unit-1-how-forex-works/1.2-who-are-the-players.mdx
content/intermediate/unit-6-market-structure/6.1-swing-highs-lows.mdx
content/advanced/unit-13-algorithmic-trading/13.1-what-is-algo-trading.mdx
```

**Rules:**
- Module folder: `beginner` | `intermediate` | `advanced`
- Unit folder: `unit-[N]-[kebab-case-title]`
- Lesson file: `[N.N]-[kebab-case-title].mdx`
- Lesson ID in filename matches `lessonId` in frontmatter exactly

---

## Frontmatter Specification

Every MDX file must begin with YAML frontmatter between `---` delimiters.

```yaml
---
title: "What is Forex?"                    # Required. Display title. Max 60 chars.
unit: 1                                    # Required. Unit number (integer)
lesson: 1                                  # Required. Lesson number within unit (integer)
lessonId: "1.1"                            # Required. Unique ID. Format: "unit.lesson"
tier: "free"                               # Required. "free" | "paid"
estimatedMinutes: 9                        # Required. Honest estimate. Range: 5-20
module: "beginner"                         # Required. "beginner" | "intermediate" | "advanced"
prerequisites: []                          # Required. Array of lessonIds. Empty array if none.
animationComponents:                       # Optional. Array of animation component names used
  - "GlobalFlowMap"
  - "MarketHierarchyPyramid"
prev:                                      # Optional. null for first lesson
  title: "Previous Lesson Title"
  slug: "1.0-previous-lesson"             # Relative to module/unit
next:                                      # Optional. null for last lesson
  title: "Who Are the Players?"
  slug: "1.2-who-are-the-players"
quizQuestionIds:                           # Required if lesson has a quiz
  - "1.1.q1"
  - "1.1.q2"
  - "1.1.q3"
  - "1.1.q4"
  - "1.1.q5"
---
```

### Frontmatter Field Rules

| Field | Type | Required | Rules |
|---|---|---|---|
| `title` | string | ✅ | Max 60 chars. Title case. No trailing punctuation. |
| `unit` | integer | ✅ | 1–15 |
| `lesson` | integer | ✅ | 1–7 (max lessons per unit) |
| `lessonId` | string | ✅ | Format: `"N.N"` e.g. `"1.1"`, `"13.7"` — must be globally unique |
| `tier` | string | ✅ | `"free"` or `"paid"` only |
| `estimatedMinutes` | integer | ✅ | 5–20. Be honest — students trust this. |
| `module` | string | ✅ | `"beginner"`, `"intermediate"`, or `"advanced"` |
| `prerequisites` | array | ✅ | Array of `lessonId` strings. Use `[]` if none. |
| `animationComponents` | array | ❌ | List component names — helps validate mdx/components.ts |
| `prev` | object\|null | ❌ | `null` for lesson 1.1. Object with `title` + `slug` otherwise. |
| `next` | object\|null | ❌ | `null` for final lesson. Object with `title` + `slug` otherwise. |
| `quizQuestionIds` | array | ✅ if quiz | Always 5 items. Format: `"N.N.qN"` |

---

## Content Structure

Every lesson follows this exact structure. Sections must appear in this order.

```mdx
---
(frontmatter)
---

## 🎯 Learning Objectives

*By the end of this lesson, the student will be able to:*
- [Objective 1 — specific, measurable, starts with a verb]
- [Objective 2]
- [Objective 3]
- [Objective 4]

---

## 📖 LESSON CONTENT

---

### SECTION 1 — [Section Title]

[Prose content here]

---

### SECTION 2 — [Section Title]

[Prose content here]

<AnimationComponentName />

[More prose content continuing from the animation]

---

### SECTION 3 — [Continue as needed]

<InteractiveExercise id="exercise-id" lessonId="N.N" />

---

## ✅ KEY TAKEAWAYS

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

---

## 🧩 INTERACTIVE EXERCISE — "[Exercise Name]"

*Type: [Exercise type]. Difficulty: [Easy|Medium|Hard]. Estimated time: [N] mins.*

[Exercise description and instructions]

---

## 🧠 QUIZ — Lesson N.N

<QuizBlock lessonId="N.N" questionIds={["N.N.q1", "N.N.q2", "N.N.q3", "N.N.q4", "N.N.q5"]} />

---

## 🎓 LESSON COMPLETE

> ✅ Lesson N.N Complete
> ➡️ Next: **Lesson N.N+1 — [Next Lesson Title]**

[Completion message to student — 2-3 sentences, motivating and forward-looking]
```

---

## Embedded Components Reference

These are all valid MDX component tags. Every one of them must be registered in `apps/web/lib/mdx/components.ts`.

### Animation Components

```mdx
<!-- Lesson 1.1 -->
<GlobalFlowMap />
<TradeMechanicDemo />
<MarketParticipantsPyramid />

<!-- Lesson 1.2 -->
<MarketHierarchyPyramid />
<StopHuntSequence />

<!-- Lesson 1.3 -->
<PairAnatomyDissection />
<PairsSolarSystem />

<!-- Lesson 1.4 -->
<BidAskSpreadVisualizer />

<!-- Lesson 1.5 -->
<SessionClockAnimation />

<!-- Charts (Units 2-4) -->
<AnimatedCandlestickChart data={sampleData} />
<MovingAverageOverlay />
<RSIOscillator />
<MACDHistogram />
<BollingerBandBreath />
<FibonacciOverlay />
<SupportResistanceDraw />

<!-- Chart patterns (Unit 4) -->
<HeadAndShouldersPattern />
<DoubleTopPattern />
<TriangleFormation type="ascending" />
<FlagPattern />

<!-- Intermediate (Units 6-10) -->
<WyckoffSchematic phase="accumulation" />
<WyckoffSchematic phase="distribution" />
<LiquiditySweepAnimation />
<OrderBlockHighlight />
<FairValueGapForm />
<TopDownZoomAnimation />

<!-- Formulas -->
<FormulaReveal title="Risk/Reward Ratio" steps={[...]} />
<KellyCriterionBreakdown />
<PipValueCalculator />
<RiskRewardVisualizer />
```

### Exercise Components

```mdx
<!-- Generic wrapper — id must match exercise config in DB -->
<InteractiveExercise id="match-the-driver" lessonId="1.1" />
<InteractiveExercise id="whos-behind-the-move" lessonId="1.2" />
<InteractiveExercise id="decode-the-quote" lessonId="1.3" />
<InteractiveExercise id="trendline-drawing" lessonId="2.6" />
<InteractiveExercise id="pattern-identifier-hs" lessonId="4.1" />

<!-- Python exercises (Unit 13+) -->
<PythonExercise
  lessonId="13.2"
  starterCode="# Your code here"
  testCode="assert result == expected"
/>
```

### Quiz Component

```mdx
<!-- Always 5 question IDs. passingScore defaults to 4. -->
<QuizBlock
  lessonId="1.1"
  questionIds={["1.1.q1", "1.1.q2", "1.1.q3", "1.1.q4", "1.1.q5"]}
/>
```

---

## Writing Style Guide

### Voice & Tone
- **Direct, confident, zero fluff** — no "as you can see" or "it's important to note"
- **Second person** — always "you", never "the trader" or "one should"
- **Present tense** — "Price moves because..." not "Price will move because..."
- **Concrete before abstract** — give the real-world example first, then the concept
- **Acknowledge difficulty honestly** — don't over-simplify complex topics

### Paragraph Rules
- Maximum **4 sentences per paragraph** in lesson prose
- Maximum **70 characters per line** (handled by max-w-prose in layout)
- One idea per paragraph — never try to cover two concepts in one paragraph
- End sections on a forward-looking note that transitions to the next

### Section Rules
- Maximum **6 sections per lesson** (not including objectives, takeaways, exercise, quiz)
- Each section should take **2-4 minutes** to read at normal pace
- Every section that introduces a complex concept must have an animation checkpoint after it

### Animation Checkpoint Format
```mdx
### 🎬 ANIMATION CHECKPOINT N — "[Animation Name]"

> **What the animation shows:**
> [2-3 sentences describing exactly what the student sees — written as a brief for the developer]
>
> **Student takeaway:**
> [One sentence — what insight the student should have after watching]
```

### Table Format
- Use markdown tables for comparisons and multi-column data
- Maximum 5 columns in a table
- Header row always present
- Align numbers right, text left

### Lists
- Bullet lists: use for 3+ unordered items
- Numbered lists: use for sequential steps only
- Maximum 7 items in any list — split into sections if more needed
- Each list item: 1 sentence maximum (brief explanations go in prose, not bullets)

---

## `_meta.json` Files

Every module and unit folder has a `_meta.json` file.

**Module `_meta.json`:**
```json
{
  "title": "Beginner — Retail Forex Trader",
  "slug": "beginner",
  "description": "Master the foundations of Forex trading...",
  "tier": "free",
  "order": 1,
  "color": "#34d399",
  "icon": "🟢",
  "totalLessons": 28,
  "estimatedHours": 4.5
}
```

**Unit `_meta.json`:**
```json
{
  "title": "How the Forex Market Works",
  "slug": "unit-1-how-forex-works",
  "order": 1,
  "lessons": ["1.1", "1.2", "1.3", "1.4", "1.5"],
  "estimatedMinutes": 45
}
```

---

## Content Validation Script

Run before committing any new lesson:

```bash
pnpm run validate-content
```

This script checks:
- All frontmatter fields present and correctly typed
- `lessonId` is globally unique across all MDX files
- `quizQuestionIds` match records in the database
- `animationComponents` are registered in `lib/mdx/components.ts`
- `prev`/`next` slugs resolve to real files
- `prerequisites` lessonIds exist

---

*Last updated: Phase 0*
*Run `pnpm run validate-content` after every MDX edit*