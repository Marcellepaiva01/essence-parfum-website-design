-- Essence Parfum — Migration inicial
-- Projeto: lqyevhohmyweqcuyqmjr

-- Perfis de admin
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- Fragrâncias
create table if not exists public.fragrances (
  id text primary key,
  brand text not null,
  name text not null,
  line text,
  concentration text not null,
  volume text not null,
  year integer,
  country text,
  manufacturer text,
  distributor text,
  importacao_oficial boolean not null default false,
  category text not null,
  familia_olfativa text not null,
  genero text not null,
  fixacao text,
  projecao text,
  preco numeric,
  sob_consulta boolean not null default false,
  disponibilidade text not null,
  estoque integer,
  notas_saida text[] not null default '{}',
  notas_coracao text[] not null default '{}',
  notas_fundo text[] not null default '{}',
  destaques text[] not null default '{}',
  historia text,
  selos text[] not null default '{}',
  status text not null default 'rascunho',
  imagem text not null,
  data_cadastro date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists fragrances_updated_at on public.fragrances;
create trigger fragrances_updated_at
  before update on public.fragrances
  for each row execute function public.handle_updated_at();

alter table public.fragrances enable row level security;

drop policy if exists "Leitura pública de fragrâncias publicadas" on public.fragrances;
drop policy if exists "Escrita pública (ajustar conforme auth)" on public.fragrances;
drop policy if exists "fragrances_public_read" on public.fragrances;
drop policy if exists "fragrances_admin_select" on public.fragrances;
drop policy if exists "fragrances_admin_insert" on public.fragrances;
drop policy if exists "fragrances_admin_update" on public.fragrances;
drop policy if exists "fragrances_admin_delete" on public.fragrances;

create policy "fragrances_public_read"
  on public.fragrances for select
  using (status = 'publicado');

create policy "fragrances_admin_select"
  on public.fragrances for select
  to authenticated
  using (public.is_admin());

create policy "fragrances_admin_insert"
  on public.fragrances for insert
  to authenticated
  with check (public.is_admin());

create policy "fragrances_admin_update"
  on public.fragrances for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "fragrances_admin_delete"
  on public.fragrances for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "profiles_admin_read" on public.profiles;

create policy "profiles_self_read"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_admin_read"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fragrance-images', 'fragrance-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fragrance_images_public_read" on storage.objects;
drop policy if exists "fragrance_images_admin_insert" on storage.objects;
drop policy if exists "fragrance_images_admin_update" on storage.objects;
drop policy if exists "fragrance_images_admin_delete" on storage.objects;

create policy "fragrance_images_public_read"
  on storage.objects for select
  using (bucket_id = 'fragrance-images');

create policy "fragrance_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fragrance-images' and public.is_admin());

create policy "fragrance_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fragrance-images' and public.is_admin())
  with check (bucket_id = 'fragrance-images' and public.is_admin());

create policy "fragrance_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fragrance-images' and public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.fragrances to anon, authenticated;
grant all on public.fragrances to authenticated;
grant select on public.profiles to authenticated;
