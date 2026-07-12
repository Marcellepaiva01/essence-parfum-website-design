import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function getAccessToken() {
  const mcp = JSON.parse(readFileSync(resolve(process.env.USERPROFILE, '.cursor', 'mcp.json'), 'utf8'));
  return mcp.mcpServers.supabase.headers.Authorization.replace('Bearer ', '');
}

function loadEnv() {
  const env = {};
  for (const line of readFileSync(resolve(root, '.env'), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const FRAGRANCES = JSON.parse(readFileSync(resolve(root, 'scripts/seed-data.json'), 'utf8'));

async function seedViaSql() {
  const token = getAccessToken();
  const values = FRAGRANCES.map(f => {
    const arr = (a) => `array[${a.map(s => `'${s.replace(/'/g, "''")}'`).join(',')}]::text[]`;
    const str = (s) => s == null ? 'null' : `'${String(s).replace(/'/g, "''")}'`;
    const num = (n) => n == null ? 'null' : n;
    return `(${str(f.id)}, ${str(f.brand)}, ${str(f.name)}, ${str(f.line)}, ${str(f.concentration)}, ${str(f.volume)}, ${num(f.year)}, ${str(f.country)}, ${str(f.manufacturer)}, null, ${f.importacao_oficial}, ${str(f.category)}, ${str(f.familia_olfativa)}, ${str(f.genero)}, ${str(f.fixacao)}, ${str(f.projecao)}, ${num(f.preco)}, ${f.sob_consulta}, ${str(f.disponibilidade)}, ${num(f.estoque)}, ${arr(f.notas_saida)}, ${arr(f.notas_coracao)}, ${arr(f.notas_fundo)}, ${arr(f.destaques)}, ${str(f.historia)}, ${arr(f.selos)}, ${str(f.status)}, ${str(f.imagem)}, ${str(f.data_cadastro)}::date)`;
  }).join(',\n');

  const sql = `insert into public.fragrances (
    id, brand, name, line, concentration, volume, year, country, manufacturer, distributor,
    importacao_oficial, category, familia_olfativa, genero, fixacao, projecao, preco,
    sob_consulta, disponibilidade, estoque, notas_saida, notas_coracao, notas_fundo,
    destaques, historia, selos, status, imagem, data_cadastro
  ) values ${values}
  on conflict (id) do update set
    brand = excluded.brand,
    name = excluded.name,
    line = excluded.line,
    concentration = excluded.concentration,
    volume = excluded.volume,
    year = excluded.year,
    country = excluded.country,
    manufacturer = excluded.manufacturer,
    importacao_oficial = excluded.importacao_oficial,
    category = excluded.category,
    familia_olfativa = excluded.familia_olfativa,
    genero = excluded.genero,
    fixacao = excluded.fixacao,
    projecao = excluded.projecao,
    preco = excluded.preco,
    sob_consulta = excluded.sob_consulta,
    disponibilidade = excluded.disponibilidade,
    estoque = excluded.estoque,
    notas_saida = excluded.notas_saida,
    notas_coracao = excluded.notas_coracao,
    notas_fundo = excluded.notas_fundo,
    destaques = excluded.destaques,
    historia = excluded.historia,
    selos = excluded.selos,
    status = excluded.status,
    imagem = excluded.imagem,
    data_cadastro = excluded.data_cadastro,
    updated_at = now();`;

  const res = await fetch(`https://api.supabase.com/v1/projects/lqyevhohmyweqcuyqmjr/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) throw new Error(await res.text());
  console.log(`✅ ${FRAGRANCES.length} perfumes inseridos via SQL`);
}

async function testLogin() {
  const env = loadEnv();
  const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  const { data, error } = await sb.auth.signInWithPassword({ email: 'teste@teste.com', password: '123456' });
  if (error) throw new Error('Login: ' + error.message);
  console.log('✅ Login admin OK —', data.user.email);

  const { data: pub, error: pubErr } = await sb.from('fragrances').select('id').eq('status', 'publicado');
  if (pubErr) console.warn('Admin read:', pubErr.message);
  else console.log(`✅ Admin vê ${pub.length} perfumes publicados`);

  await sb.auth.signOut();
  const { data: anon, error: anonErr } = await sb.from('fragrances').select('id');
  if (anonErr) console.warn('Anon read:', anonErr.message);
  else console.log(`✅ Anônimo vê ${anon.length} perfumes publicados`);
}

await seedViaSql();
await testLogin();
