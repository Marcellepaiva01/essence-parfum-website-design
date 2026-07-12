/**
 * Confirma email do admin e executa seed
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PROJECT_REF = 'lqyevhohmyweqcuyqmjr';

function getAccessToken() {
  const mcpPath = resolve(process.env.USERPROFILE || process.env.HOME, '.cursor', 'mcp.json');
  const mcp = JSON.parse(readFileSync(mcpPath, 'utf8'));
  return mcp.mcpServers.supabase.headers.Authorization.replace('Bearer ', '');
}

function loadEnv() {
  const content = readFileSync(resolve(root, '.env'), 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [k, ...v] = t.split('=');
    env[k] = v.join('=');
  }
  return env;
}

async function runQuery(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`API ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  console.log('📧 Confirmando email do admin...');
  await runQuery(`
    update auth.users
    set email_confirmed_at = now(),
        confirmation_token = null
    where email = 'teste@teste.com';
  `);

  await runQuery(`
    insert into public.profiles (id, email, role)
    select id, email, 'admin'
    from auth.users
    where email = 'teste@teste.com'
    on conflict (id) do update set role = 'admin', email = excluded.email;
  `);

  console.log('✅ Admin confirmado');

  const env = loadEnv();
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: 'teste@teste.com',
    password: '123456',
  });
  if (loginError) throw new Error('Login falhou: ' + loginError.message);
  console.log('✅ Login admin OK');

  // Import seed from setup script - run setup-supabase for seed part
  const { execSync } = await import('child_process');
  execSync('node scripts/setup-supabase.mjs', { cwd: root, stdio: 'inherit' });
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
