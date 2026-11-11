-- A lista de autorizados também sai do schema exposto pela API.
alter table public.allowed_github_users set schema private;

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
    join private.allowed_github_users a on a.github_id::text = i.provider_id
    where i.user_id = auth.uid() and i.provider = 'github'
  );
$$;
