-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Submissions Table
create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  code text not null,
  language text not null,
  problem_title text,
  difficulty text, -- Added difficulty (Easy, Medium, Hard)
  topic text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analyses Table
create table public.analyses (
  id uuid default uuid_generate_v4() primary key,
  submission_id uuid references public.submissions(id) on delete cascade not null,
  rating integer,
  correctness text,
  user_approach text, -- Added user's approach
  optimized_approach text, -- Added optimized approach
  optimized_code text,
  improvement_points jsonb,
  visualization_mermaid text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.submissions enable row level security;
alter table public.analyses enable row level security;

create policy "Public Access Submissions" on public.submissions for all using (true);
create policy "Public Access Analyses" on public.analyses for all using (true);
