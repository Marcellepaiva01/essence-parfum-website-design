-- Essence Parfum — Schema completo
-- Projeto: lqyevhohmyweqcuyqmjr
-- Migration: supabase/migrations/20260712180000_initial_schema_rls_storage.sql

-- Perfis de admin vinculados ao auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fragrâncias (catálogo)
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

-- RLS Fragrances:
--   Público (anon): SELECT onde status = 'publicado'
--   Admin (authenticated + profiles.role = 'admin'): CRUD completo

-- Storage bucket: fragrance-images (público para leitura)
-- Admin autenticado pode upload/update/delete

-- Admin padrão: teste@teste.com (criado via Supabase Auth)
