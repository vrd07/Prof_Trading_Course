-- 007_indexes.sql

create index if not exists idx_user_progress_user_id on public.user_progress(user_id);
create index if not exists idx_quiz_attempts_user_lesson on public.quiz_attempts(user_id, lesson_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_lessons_lesson_id on public.lessons(lesson_id);

