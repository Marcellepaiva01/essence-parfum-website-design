# Variáveis de Ambiente — Essence Parfum

Guia de configuração segura das chaves do Supabase para desenvolvimento local e deploy em produção.

## Visão geral

| Arquivo | Commitar no Git? | Uso |
|---------|------------------|-----|
| `.env` | **Não** | Chaves reais — apenas na sua máquina |
| `.env.example` | **Sim** | Modelo sem segredos para o time |
| `.gitignore` | **Sim** | Impede vazamento acidental de `.env` |

O Vite expõe apenas variáveis com prefixo `VITE_` no frontend. O cliente Supabase está em `src/lib/supabase.ts`.

## Configuração local

1. Copie o modelo:

```bash
cp .env.example .env
```

2. Preencha `.env` com os valores do painel Supabase:

| Variável | Onde encontrar no Supabase |
|----------|---------------------------|
| `VITE_SUPABASE_URL` | **Project Settings → API → Project URL** |
| `VITE_SUPABASE_ANON_KEY` | **Project Settings → API → anon public** (ou **publishable key**) |

3. Reinicie o servidor de desenvolvimento após alterar o `.env`:

```bash
pnpm dev
```

### Projeto atual

- **Project ref:** `lqyevhohmyweqcuyqmjr`
- **URL:** `https://lqyevhohmyweqcuyqmjr.supabase.co`

As chaves reais já estão no seu `.env` local (gitignored). Não as copie para issues, PRs ou commits.

## Segurança — regras obrigatórias

### Pode ir no frontend (`.env` com `VITE_`)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (chave anon / publishable)

Essas chaves são pensadas para o browser. O acesso aos dados é controlado por **RLS (Row Level Security)** no PostgreSQL.

### Nunca coloque no frontend

- `service_role` — bypassa RLS e dá acesso total ao banco
- `SUPABASE_SERVICE_ROLE_KEY`
- Senhas de banco, connection strings diretas
- Tokens de API privados

> ⚠️ **ATENÇÃO:** Se a `service_role` vazar no repositório ou no bundle do frontend, qualquer pessoa pode ler e alterar todo o banco. Gere uma nova chave no painel Supabase imediatamente em caso de vazamento.

## Deploy (Vercel / produção)

Configure as mesmas variáveis no painel da plataforma:

1. **Vercel:** Project → **Settings** → **Environment Variables**
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Marque os ambientes: **Production**, **Preview** e **Development** (se usar preview)
4. Faça um novo deploy após salvar

Não use arquivo `.env` no repositório para produção — use sempre o painel da plataforma.

## Checklist antes do commit

- [ ] `.env` está listado no `.gitignore`
- [ ] Nenhuma chave real em arquivos versionados
- [ ] `.env.example` atualizado com placeholders
- [ ] `git status` não mostra `.env` como arquivo a commitar

```bash
git status
```

Se `.env` aparecer, **não commite**. Verifique o `.gitignore`.

## Onde as variáveis são usadas

```
src/lib/supabase.ts   → createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
src/vite-env.d.ts     → tipagem TypeScript das variáveis
```

## Obter chaves via Supabase Dashboard

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Abra o projeto **lqyevhohmyweqcuyqmjr**
3. **Project Settings** (ícone de engrenagem) → **API**
4. Copie **Project URL** e **anon public** (ou publishable key)

## Troubleshooting

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| `Supabase: variáveis de ambiente não configuradas` | `.env` ausente ou sem `VITE_` | Crie/corrija `.env` e reinicie `pnpm dev` |
| Erro de RLS no browser | Políticas restritivas | Ajuste policies em `supabase/schema.sql` / migrations |
| Funciona local, falha no deploy | Vars não configuradas na Vercel | Adicione env vars no painel e redeploy |

## Referências

- [Supabase — API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Vite — Env variables](https://vite.dev/guide/env-and-mode.html)
- Schema do banco: `supabase/schema.sql`
