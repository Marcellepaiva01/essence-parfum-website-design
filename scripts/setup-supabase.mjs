/**
 * Setup Essence Parfum no Supabase:
 * 1. Cria usuário admin (signup)
 * 2. Faz login e insere os perfumes mockados no banco
 *
 * Uso: node scripts/setup-supabase.mjs
 * Requer VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(root, '.env');
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key] = rest.join('=');
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
  process.exit(1);
}

const ADMIN_EMAIL = 'teste@teste.com';
const ADMIN_PASSWORD = '123456';

const FRAGRANCES = JSON.parse(readFileSync(resolve(root, 'scripts/seed-data.json'), 'utf8'));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function ensureAdminUser() {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (!signInError && signInData.session) {
    console.log('✅ Admin já existe — login OK');
    return signInData.session;
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (signUpError) {
    console.error('❌ Erro ao criar admin:', signUpError.message);
    process.exit(1);
  }

  if (signUpData.session) {
    console.log('✅ Admin criado e autenticado');
    return signUpData.session;
  }

  // Email confirmation pode estar ativo — tenta login novamente
  const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (retryError) {
    console.error('❌ Admin criado mas login falhou. Desative confirmação de email no Supabase Auth.');
    console.error(retryError.message);
    process.exit(1);
  }

  console.log('✅ Admin criado — login OK');
  return retryData.session;
}

async function seedFragrances() {
  const { data, error } = await supabase
    .from('fragrances')
    .upsert(FRAGRANCES, { onConflict: 'id' })
    .select('id');

  if (error) {
    console.error('❌ Erro ao inserir perfumes:', error.message);
    process.exit(1);
  }

  console.log(`✅ ${data.length} perfumes inseridos/atualizados no banco`);
}

async function verifyPublicRead() {
  await supabase.auth.signOut();
  const { data, error } = await supabase
    .from('fragrances')
    .select('id, name, status')
    .eq('status', 'publicado');

  if (error) {
    console.warn('⚠️ Leitura pública:', error.message);
    return;
  }
  console.log(`✅ Leitura pública OK — ${data.length} perfumes publicados visíveis`);
}

async function main() {
  console.log('🚀 Setup Essence Parfum Supabase\n');
  await ensureAdminUser();
  await seedFragrances();
  await verifyPublicRead();
  console.log('\n✨ Setup concluído!');
}

main();
