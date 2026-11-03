-- Mufrodat Academy database schema
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text default 'BookOpen',
  created_at timestamptz not null default now()
);

create table if not exists public.vocabularies (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  arabic text not null,
  transliteration text not null,
  meaning text not null,
  part_of_speech text,
  example_arabic text,
  example_meaning text,
  audio_url text,
  image_url text,
  level text not null default 'Pemula' check (level in ('Pemula','Menengah','Lanjutan')),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  vocabulary_id uuid references public.vocabularies(id) on delete set null,
  question_text text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  vocabulary_id uuid not null references public.vocabularies(id) on delete cascade,
  status text not null default 'known' check (status in ('learning','known','review')),
  times_seen integer not null default 1,
  last_reviewed timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  total_questions integer not null check (total_questions > 0),
  correct_answers integer not null check (correct_answers >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  vocabulary_id uuid not null references public.vocabularies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.vocabularies enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.favorites enable row level security;

-- Profiles: users can read their own profile; admins can read all profiles.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
for select to authenticated using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
grant update (full_name) on public.profiles to authenticated;

-- Categories are public to read; only admins can change them.
drop policy if exists "categories_read_all" on public.categories;
create policy "categories_read_all" on public.categories for select using (true);
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Published vocabulary is public; admin has full control.
drop policy if exists "vocabularies_read_published" on public.vocabularies;
create policy "vocabularies_read_published" on public.vocabularies for select using (is_published = true or public.is_admin());
drop policy if exists "vocabularies_admin_all" on public.vocabularies;
create policy "vocabularies_admin_all" on public.vocabularies for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Quiz answer keys are private. Public users read only the safe view created below.
drop policy if exists "quiz_questions_read_published" on public.quiz_questions;
drop policy if exists "quiz_questions_admin_all" on public.quiz_questions;
create policy "quiz_questions_admin_all" on public.quiz_questions for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Each user can only access their own learning data.
drop policy if exists "progress_own_all" on public.user_progress;
create policy "progress_own_all" on public.user_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "attempts_own_all" on public.quiz_attempts;
create policy "attempts_own_all" on public.quiz_attempts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "favorites_own_all" on public.favorites;
create policy "favorites_own_all" on public.favorites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- Public quiz view deliberately excludes correct_answer and explanation.
-- The browser cannot inspect answer keys; grading happens in a server-side RPC.
create or replace view public.quiz_questions_public
with (security_invoker = false)
as
select id, question_text, options, vocabulary_id
from public.quiz_questions
where is_published = true;

grant select on public.quiz_questions_public to anon, authenticated;

create or replace function public.grade_quiz_attempt(p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_total integer;
  v_correct integer;
  v_checked integer;
  v_distinct integer;
  v_details jsonb;
  v_score integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if jsonb_typeof(p_answers) <> 'array' then
    raise exception 'Answers must be a JSON array';
  end if;

  v_total := jsonb_array_length(p_answers);
  if v_total < 1 or v_total > 30 then
    raise exception 'Invalid quiz length';
  end if;

  with submitted as (
    select (entry.value->>'questionId')::uuid as question_id,
           coalesce(entry.value->>'answer', '') as answer,
           entry.ordinality as answer_order
    from jsonb_array_elements(p_answers) with ordinality as entry(value, ordinality)
  ), checked as (
    select q.id, q.correct_answer, q.explanation, s.answer_order,
           (s.answer = q.correct_answer) as is_correct
    from submitted s
    join public.quiz_questions q on q.id = s.question_id and q.is_published = true
  )
  select count(*), count(distinct id), count(*) filter (where is_correct),
         coalesce(jsonb_agg(jsonb_build_object(
           'questionId', id,
           'correct', is_correct,
           'correctAnswer', correct_answer,
           'explanation', explanation
         ) order by answer_order), '[]'::jsonb)
  into v_checked, v_distinct, v_correct, v_details
  from checked;

  if coalesce(v_checked, 0) <> v_total or coalesce(v_distinct, 0) <> v_total then
    raise exception 'One or more quiz questions are invalid';
  end if;
  v_correct := coalesce(v_correct, 0);
  v_score := round((v_correct::numeric / v_total::numeric) * 100)::integer;

  insert into public.quiz_attempts (user_id, score, total_questions, correct_answers)
  values (v_user_id, v_score, v_total, v_correct);

  return jsonb_build_object('score', v_correct, 'total', v_total, 'percentage', v_score, 'details', v_details);
end;
$$;

revoke all on function public.grade_quiz_attempt(jsonb) from public;
grant execute on function public.grade_quiz_attempt(jsonb) to authenticated;

create index if not exists vocabularies_category_idx on public.vocabularies(category_id);
create index if not exists vocabularies_slug_idx on public.vocabularies(slug);
create index if not exists progress_user_idx on public.user_progress(user_id);
create index if not exists attempts_user_created_idx on public.quiz_attempts(user_id, created_at desc);
