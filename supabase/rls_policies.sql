-- 1. Drop existing permissive policies
drop policy if exists "Public Access Submissions" on public.submissions;
drop policy if exists "Public Access Analyses" on public.analyses;

-- 2. Create strict policies for Submissions
-- Users can only see their own submissions
create policy "User View Own Submissions"
on public.submissions for select
using (auth.uid() = user_id);

-- Users can only insert their own submissions
create policy "User Insert Own Submissions"
on public.submissions for insert
with check (auth.uid() = user_id);

-- 3. Create strict policies for Analyses
-- Users can only see analyses linked to their own submissions
create policy "User View Own Analyses"
on public.analyses for select
using (
  exists (
    select 1 from public.submissions
    where submissions.id = analyses.submission_id
    and submissions.user_id = auth.uid()
  )
);

-- Users can insert analyses if they own the linked submission
create policy "User Insert Own Analyses"
on public.analyses for insert
with check (
  exists (
    select 1 from public.submissions
    where submissions.id = submission_id
    and submissions.user_id = auth.uid()
  )
);
