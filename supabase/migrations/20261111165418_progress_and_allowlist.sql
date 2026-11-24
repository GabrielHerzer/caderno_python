-- Contas do GitHub que podem gravar progresso na nuvem. Sem políticas: invisível pela API.
create table public.allowed_github_users (
  github_id bigint primary key,
  login text not null
);
alter table public.allowed_github_users enable row level security;

insert into public.allowed_github_users (github_id, login) values
  (93893533, 'JohnPetros'),
  (318659476, 'GabrielHerzer');

-- Confere pela identidade do GitHub (auth.identities), que o usuário não consegue alterar.
-- Não usar user_metadata: o próprio usuário edita esse campo.
create or replace function public.is_allowed_user()
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
revoke execute on function public.is_allowed_user() from public, anon;
grant execute on function public.is_allowed_user() to authenticated;

-- Um documento de progresso por usuário (o mesmo formato do localStorage, sem rascunhos).
create table public.progress (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  state jsonb not null check (jsonb_typeof(state) = 'object' and octet_length(state::text) < 5000000),
  updated_at timestamptz not null default now()
);
alter table public.progress enable row level security;

create policy "progress: ler o próprio" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id and (select public.is_allowed_user()));

create policy "progress: criar o próprio" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select public.is_allowed_user()));

create policy "progress: atualizar o próprio" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id and (select public.is_allowed_user()))
  with check ((select auth.uid()) = user_id and (select public.is_allowed_user()));

create or replace function public.touch_progress()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger progress_updated_at
  before update on public.progress
  for each row execute function public.touch_progress();

revoke all on public.progress from anon;
revoke all on public.allowed_github_users from anon, authenticated;
