-- A função só serve às políticas de RLS; fora do schema exposto pela API, ninguém a chama por /rpc.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_allowed_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.identities i
    join public.allowed_github_users a on a.github_id::text = i.provider_id
    where i.user_id = auth.uid() and i.provider = 'github'
  );
$$;
revoke execute on function private.is_allowed_user() from public, anon;
grant execute on function private.is_allowed_user() to authenticated;

drop policy "progress: ler o próprio" on public.progress;
drop policy "progress: criar o próprio" on public.progress;
drop policy "progress: atualizar o próprio" on public.progress;

create policy "progress: ler o próprio" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id and (select private.is_allowed_user()));

create policy "progress: criar o próprio" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select private.is_allowed_user()));

create policy "progress: atualizar o próprio" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id and (select private.is_allowed_user()))
  with check ((select auth.uid()) = user_id and (select private.is_allowed_user()));

drop function public.is_allowed_user();
