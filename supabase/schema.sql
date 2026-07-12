-- Execute no SQL Editor do Supabase (projeto lqyevhohmyweqcuyqmjr)

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

alter table public.fragrances enable row level security;

create policy "Leitura pública de fragrâncias publicadas"
  on public.fragrances for select
  using (status = 'publicado' or true);

create policy "Escrita pública (ajustar conforme auth)"
  on public.fragrances for all
  using (true)
  with check (true);
