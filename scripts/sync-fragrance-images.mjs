/**
 * Baixa imagens reais dos frascos, envia ao Supabase Storage
 * e atualiza a coluna imagem na tabela fragrances.
 *
 * Uso: node scripts/sync-fragrance-images.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PROJECT_REF = 'lqyevhohmyweqcuyqmjr';
const STORAGE_BASE = `https://${PROJECT_REF}.supabase.co/storage/v1/object/public/fragrance-images`;

const IMAGE_MAP = JSON.parse(readFileSync(resolve(__dirname, 'fragrance-image-map.json'), 'utf8'));

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

function getAccessToken() {
  const mcp = JSON.parse(readFileSync(resolve(process.env.USERPROFILE, '.cursor', 'mcp.json'), 'utf8'));
  return mcp.mcpServers.supabase.headers.Authorization.replace('Bearer ', '');
}

async function runQuery(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function downloadImage(fragranticaId) {
  const url = `https://fimgs.net/mdimg/perfume/375x500.${fragranticaId}.jpg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${fragranticaId}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const env = loadEnv();
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: 'teste@teste.com',
    password: '123456',
  });
  if (loginError) throw new Error(`Admin login: ${loginError.message}`);

  const imageUrls = {};

  for (const item of IMAGE_MAP) {
    const path = `${item.id}-${item.slug}.jpg`;
    console.log(`⬇️  Baixando ${path}...`);
    const buffer = await downloadImage(item.fragranticaId);

    const { error: uploadError } = await supabase.storage
      .from('fragrance-images')
      .upload(path, buffer, { upsert: true, contentType: 'image/jpeg' });

    if (uploadError) throw new Error(`Upload ${path}: ${uploadError.message}`);

    imageUrls[item.id] = `${STORAGE_BASE}/${path}`;
    console.log(`✅ ${path}`);
  }

  const updates = Object.entries(imageUrls)
    .map(([id, url]) => `('${id}', '${url}')`)
    .join(',\n');

  const sql = `
    UPDATE public.fragrances AS f
    SET imagem = v.imagem, updated_at = now()
    FROM (VALUES ${updates}) AS v(id, imagem)
    WHERE f.id = v.id;
  `;

  await runQuery(sql);
  console.log(`\n✅ ${IMAGE_MAP.length} imagens atualizadas no Supabase`);

  // Atualiza seed-data.json local
  const seedPath = resolve(__dirname, 'seed-data.json');
  const fragrances = JSON.parse(readFileSync(seedPath, 'utf8'));
  for (const f of fragrances) {
    if (imageUrls[f.id]) f.imagem = imageUrls[f.id];
  }
  const { writeFileSync } = await import('fs');
  writeFileSync(seedPath, JSON.stringify(fragrances, null, 2) + '\n');
  console.log('✅ seed-data.json atualizado');

  await supabase.auth.signOut();
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
