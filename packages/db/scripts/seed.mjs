import fs from 'node:fs/promises'
import path from 'node:path'

import { createClient } from '@supabase/supabase-js'

function required(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

const SUPABASE_URL = required('SUPABASE_URL')
const SERVICE_ROLE = required('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function readUnit1QuizJson() {
  const filePath = path.join(process.cwd(), '..', '..', 'content', 'quizzes', 'beginner.unit-1.json')
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

async function upsertQuizQuestionsFromJson(db) {
  const rows = []
  for (const [lessonId, lesson] of Object.entries(db.lessons)) {
    for (const [idx, q] of lesson.questions.entries()) {
      rows.push({
        lesson_id: lessonId,
        question_key: q.questionKey,
        question_text: q.questionText,
        options: q.options,
        correct_index: q.correctIndex,
        explanation: q.explanation,
        tier: 'free',
        order: idx + 1,
      })
    }
  }

  const { error } = await supabase.from('quiz_questions').upsert(rows, { onConflict: 'question_key' })
  if (error) throw error
  return rows.length
}

async function ensureTestUsers() {
  const users = [
    { email: 'free@test.com', password: 'test1234', tier: 'free' },
    { email: 'pro@test.com', password: 'test1234', tier: 'pro' },
  ]

  for (const u of users) {
    // Create if missing
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { display_name: u.email.split('@')[0] },
    })

    if (createError && (createError.status === 422 || createError.code === 'email_exists')) {
      continue
    }
    if (createError) throw createError

    if (u.tier === 'pro') {
      await supabase.from('users_profile').update({ tier: 'pro' }).eq('id', created.user.id)
      await supabase.from('subscriptions').upsert(
        {
          user_id: created.user.id,
          stripe_customer_id: `seed_${created.user.id}`,
          stripe_subscription_id: null,
          stripe_price_id: 'seed_price',
          plan: 'lifetime',
          status: 'active',
        },
        { onConflict: 'user_id' }
      )
    }
  }
}

async function main() {
  const db = await readUnit1QuizJson()
  const inserted = await upsertQuizQuestionsFromJson(db)
  await ensureTestUsers()
  console.log(`Seed complete. Upserted quiz questions: ${inserted}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

