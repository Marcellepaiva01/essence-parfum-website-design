import type { Fragrance } from '../app/context/AppContext';
import { supabase } from './supabase';

interface FragranceRow {
  id: string;
  brand: string;
  name: string;
  line: string | null;
  concentration: string;
  volume: string;
  year: number | null;
  country: string | null;
  manufacturer: string | null;
  distributor: string | null;
  importacao_oficial: boolean;
  category: Fragrance['category'];
  familia_olfativa: string;
  genero: Fragrance['genero'];
  fixacao: string | null;
  projecao: Fragrance['projecao'] | null;
  preco: number | null;
  sob_consulta: boolean;
  disponibilidade: Fragrance['disponibilidade'];
  estoque: number | null;
  notas_saida: string[];
  notas_coracao: string[];
  notas_fundo: string[];
  destaques: string[];
  historia: string | null;
  selos: string[];
  status: Fragrance['status'];
  imagem: string;
  data_cadastro: string;
}

function rowToFragrance(row: FragranceRow): Fragrance {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    line: row.line ?? undefined,
    concentration: row.concentration,
    volume: row.volume,
    year: row.year ?? undefined,
    country: row.country ?? undefined,
    manufacturer: row.manufacturer ?? undefined,
    distributor: row.distributor ?? undefined,
    importacaoOficial: row.importacao_oficial,
    category: row.category,
    familiaOlfativa: row.familia_olfativa,
    genero: row.genero,
    fixacao: row.fixacao ?? undefined,
    projecao: row.projecao ?? undefined,
    preco: row.preco ?? undefined,
    sobConsulta: row.sob_consulta,
    disponibilidade: row.disponibilidade,
    estoque: row.estoque ?? undefined,
    notasSaida: row.notas_saida,
    notasCoracao: row.notas_coracao,
    notasFundo: row.notas_fundo,
    destaques: row.destaques,
    historia: row.historia ?? undefined,
    selos: row.selos,
    status: row.status,
    imagem: row.imagem,
    dataCadastro: row.data_cadastro,
  };
}

function fragranceToRow(f: Fragrance): FragranceRow {
  return {
    id: f.id,
    brand: f.brand,
    name: f.name,
    line: f.line ?? null,
    concentration: f.concentration,
    volume: f.volume,
    year: f.year ?? null,
    country: f.country ?? null,
    manufacturer: f.manufacturer ?? null,
    distributor: f.distributor ?? null,
    importacao_oficial: f.importacaoOficial,
    category: f.category,
    familia_olfativa: f.familiaOlfativa,
    genero: f.genero,
    fixacao: f.fixacao ?? null,
    projecao: f.projecao ?? null,
    preco: f.preco ?? null,
    sob_consulta: f.sobConsulta,
    disponibilidade: f.disponibilidade,
    estoque: f.estoque ?? null,
    notas_saida: f.notasSaida,
    notas_coracao: f.notasCoracao,
    notas_fundo: f.notasFundo,
    destaques: f.destaques,
    historia: f.historia ?? null,
    selos: f.selos,
    status: f.status,
    imagem: f.imagem,
    data_cadastro: f.dataCadastro,
  };
}

export async function fetchFragrances(): Promise<Fragrance[] | null> {
  const { data, error } = await supabase
    .from('fragrances')
    .select('*')
    .order('data_cadastro', { ascending: false });

  if (error) {
    console.error('Supabase fetchFragrances:', error.message);
    return null;
  }

  return (data as FragranceRow[]).map(rowToFragrance);
}

export async function upsertFragrance(f: Fragrance): Promise<boolean> {
  const { error } = await supabase
    .from('fragrances')
    .upsert(fragranceToRow(f));

  if (error) {
    console.error('Supabase upsertFragrance:', error.message);
    return false;
  }
  return true;
}

export async function deleteFragrance(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('fragrances')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase deleteFragrance:', error.message);
    return false;
  }
  return true;
}

export async function seedFragrances(fragrances: Fragrance[]): Promise<boolean> {
  const { error } = await supabase
    .from('fragrances')
    .upsert(fragrances.map(fragranceToRow));

  if (error) {
    console.error('Supabase seedFragrances:', error.message);
    return false;
  }
  return true;
}
