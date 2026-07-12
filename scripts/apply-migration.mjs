/**
 * Aplica migration SQL via Supabase Management API
 * Uso: node scripts/apply-migration.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PROJECT_REF = 'lqyevhohmyweqcuyqmjr';

function getAccessToken() {
  const mcpPath = resolve(process.env.USERPROFILE || process.env.HOME, '.cursor', 'mcp.json');
  const mcp = JSON.parse(readFileSync(mcpPath, 'utf8'));
  const auth = mcp.mcpServers?.supabase?.headers?.Authorization;
  if (!auth) throw new Error('Token Supabase não encontrado em ~/.cursor/mcp.json');
  return auth.replace('Bearer ', '');
}

async function runQuery(query) {
  const token = getAccessToken();
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function main() {
  const migrationPath = resolve(root, 'supabase/migrations/20260712180000_initial_schema_rls_storage.sql');
  const sql = readFileSync(migrationPath, 'utf8');

  console.log('📦 Aplicando migration no Supabase...');
  await runQuery(sql);
  console.log('✅ Migration aplicada com sucesso!');
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
