import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchFragrances,
  upsertFragrance,
  deleteFragrance as deleteFragranceFromDb,
  seedFragrances,
} from '../../lib/fragrances';

export interface Fragrance {
  id: string;
  brand: string;
  name: string;
  line?: string;
  concentration: string;
  volume: string;
  year?: number;
  country?: string;
  manufacturer?: string;
  distributor?: string;
  importacaoOficial: boolean;
  category: 'nicho' | 'designer' | 'arabes' | 'exclusivos' | 'edicoes-limitadas' | 'classicos' | 'recem-chegados';
  familiaOlfativa: string;
  genero: 'masculino' | 'feminino' | 'unissex';
  fixacao?: string;
  projecao?: 'baixa' | 'media' | 'alta';
  preco?: number;
  sobConsulta: boolean;
  disponibilidade: 'pronta-entrega' | 'sob-encomenda' | 'indisponivel';
  estoque?: number;
  notasSaida: string[];
  notasCoracao: string[];
  notasFundo: string[];
  destaques: string[];
  historia?: string;
  selos: string[];
  status: 'publicado' | 'rascunho' | 'pausado';
  imagem: string;
  dataCadastro: string;
}

const WHATSAPP_NUMBER = '5511999999999';

const INITIAL_FRAGRANCES: Fragrance[] = [
  {
    id: '1',
    brand: 'Creed',
    name: 'Aventus',
    line: 'Millésime',
    concentration: 'Eau de Parfum',
    volume: '100ml',
    year: 2010,
    country: 'França',
    manufacturer: 'House of Creed',
    importacaoOficial: true,
    category: 'nicho',
    familiaOlfativa: 'amadeirada',
    genero: 'masculino',
    fixacao: '12-16 horas',
    projecao: 'alta',
    preco: 2890,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 3,
    notasSaida: ['Bergamota', 'Maçã', 'Abacaxi', 'Groselha Preta'],
    notasCoracao: ['Rosa Búlgara', 'Jasmim', 'Patchouli', 'Musgo de Carvalho'],
    notasFundo: ['Vetiver', 'Almíscar', 'Âmbar', 'Baunilha'],
    destaques: ['Importação Oficial', 'Ingredientes Naturais', 'Alta Concentração', 'Lote Exclusivo'],
    historia: 'Aventus celebra a força, o sucesso e o poder de uma figura mítica. Inspirado nos triunfos e tragédias de Napoleão Bonaparte, este perfume combina frutas frescas com ingredientes de madeira defumada para criar uma fragrância verdadeiramente icônica e atemporal.',
    selos: ['exclusivo', 'importacao-oficial'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80',
    dataCadastro: '2024-01-15',
  },
  {
    id: '2',
    brand: 'Maison Francis Kurkdjian',
    name: 'Baccarat Rouge 540',
    line: 'Collections',
    concentration: 'Extrait de Parfum',
    volume: '70ml',
    year: 2015,
    country: 'França',
    manufacturer: 'Maison Francis Kurkdjian',
    importacaoOficial: true,
    category: 'nicho',
    familiaOlfativa: 'floral',
    genero: 'unissex',
    fixacao: '16-24 horas',
    projecao: 'alta',
    preco: 4200,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 2,
    notasSaida: ['Jasmim', 'Açafrão'],
    notasCoracao: ['Amberwood', 'Ambrette'],
    notasFundo: ['Cedro', 'Fir Resin'],
    destaques: ['Extrait de Parfum', 'Produção Artesanal', 'Frasco Colecionável', 'Certificado de Autenticidade'],
    historia: 'Criado para a mítica cristaleria Baccarat, este extrait encapsula a luz e o fascínio do cristal. Uma fragrância que evoca luxo absoluto com suas facetas amadeiradas e florais únicas.',
    selos: ['exclusivo', 'ultimas-unidades'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1608721279136-cd41b752fa41?w=600&q=80',
    dataCadastro: '2024-01-20',
  },
  {
    id: '3',
    brand: 'Xerjoff',
    name: 'Naxos',
    line: 'Casamorati',
    concentration: 'Eau de Parfum',
    volume: '100ml',
    year: 2016,
    country: 'Itália',
    manufacturer: 'Xerjoff',
    importacaoOficial: true,
    category: 'nicho',
    familiaOlfativa: 'gourmand',
    genero: 'masculino',
    fixacao: '10-14 horas',
    projecao: 'media',
    preco: 1980,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 5,
    notasSaida: ['Bergamota', 'Lavanda', 'Limão'],
    notasCoracao: ['Mel', 'Tabaco', 'Jasmim'],
    notasFundo: ['Baunilha', 'Âmbar', 'Musgo'],
    destaques: ['Ingredientes Naturais', 'Alta Concentração', 'Importação Oficial'],
    historia: 'Naxos é uma jornada pela Sicília ensolarada, onde o mel dourado encontra o tabaco suave em uma composição gourmand irresistível. Uma fragrância que desperta memórias de deliciosas manhãs mediterrâneas.',
    selos: ['novo'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=600&q=80',
    dataCadastro: '2024-02-01',
  },
  {
    id: '4',
    brand: 'Roja Parfums',
    name: 'Elysium',
    line: 'Parfum Cologne Collection',
    concentration: 'Parfum Cologne',
    volume: '100ml',
    year: 2017,
    country: 'Reino Unido',
    manufacturer: 'Roja Parfums',
    importacaoOficial: true,
    category: 'nicho',
    familiaOlfativa: 'citrica',
    genero: 'masculino',
    fixacao: '8-12 horas',
    projecao: 'media',
    preco: 2450,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 4,
    notasSaida: ['Grapefruit', 'Bergamota', 'Limão Siciliano', 'Mandarina'],
    notasCoracao: ['Violeta', 'Pimenta Rosa', 'Neroli'],
    notasFundo: ['Almíscar Branco', 'Cedro', 'Vetiver'],
    destaques: ['Alta Concentração', 'Ingredientes Naturais', 'Certificado de Autenticidade'],
    historia: 'Elysium transporta quem o usa para um paraíso atemporal. A frescor cítrico de suas notas de topo abre caminho para um coração floral delicado, concluindo com uma base madeirosa e almiscarada de elegância suprema.',
    selos: ['importacao-oficial'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1615160460366-2c9a41771b51?w=600&q=80',
    dataCadastro: '2024-02-10',
  },
  {
    id: '5',
    brand: 'Amouage',
    name: 'Interlude Man',
    line: 'Library Collection',
    concentration: 'Eau de Parfum',
    volume: '100ml',
    year: 2012,
    country: 'Omã',
    manufacturer: 'Amouage',
    importacaoOficial: true,
    category: 'arabes',
    familiaOlfativa: 'oriental',
    genero: 'masculino',
    fixacao: '16-24 horas',
    projecao: 'alta',
    preco: 3100,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 2,
    notasSaida: ['Incenso', 'Orégano', 'Bergamota'],
    notasCoracao: ['Labdanum', 'Patchouli', 'Oud', 'Cedro'],
    notasFundo: ['Âmbar', 'Vetiver', 'Almíscar', 'Resina de Pinheiro'],
    destaques: ['Oud Natural', 'Alta Concentração', 'Produção Artesanal', 'Lote Exclusivo'],
    historia: 'Interlude Man narra a história de uma jornada épica entre mundos opostos. O incenso sagrado encontra o oud opulento em uma composição de complexidade inigualável, digna da herança perfumística do Oriente.',
    selos: ['exclusivo', 'ultimas-unidades'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1780811070739-faa3b575b669?w=600&q=80',
    dataCadastro: '2024-02-15',
  },
  {
    id: '6',
    brand: 'Tom Ford',
    name: 'Oud Wood',
    line: 'Private Blend',
    concentration: 'Eau de Parfum',
    volume: '100ml',
    year: 2007,
    country: 'EUA',
    manufacturer: 'Tom Ford Beauty',
    importacaoOficial: true,
    category: 'designer',
    familiaOlfativa: 'amadeirada',
    genero: 'unissex',
    fixacao: '10-14 horas',
    projecao: 'media',
    preco: 1750,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 6,
    notasSaida: ['Oud', 'Sândalos', 'Rosewood'],
    notasCoracao: ['Cardamomo', 'Vetiver', 'Âmbar'],
    notasFundo: ['Tonka', 'Almíscar', 'Âmbar'],
    destaques: ['Oud Natural', 'Ingredientes Naturais', 'Importação Oficial'],
    historia: 'Oud Wood foi pioneiro ao introduzir o oud ao mundo ocidental da alta perfumaria. Sua combinação de oud raro com sândalos e especiarias criou uma nova linguagem do luxo olfativo, tornando-se instantaneamente um clássico moderno.',
    selos: ['importacao-oficial'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1770301410072-f6ef6dad65b2?w=600&q=80',
    dataCadastro: '2024-02-20',
  },
  {
    id: '7',
    brand: 'Parfums de Marly',
    name: 'Layton',
    line: 'Royal Essence',
    concentration: 'Eau de Parfum',
    volume: '125ml',
    year: 2016,
    country: 'França',
    manufacturer: 'Parfums de Marly',
    importacaoOficial: true,
    category: 'nicho',
    familiaOlfativa: 'gourmand',
    genero: 'masculino',
    fixacao: '12-16 horas',
    projecao: 'alta',
    preco: 2200,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 7,
    notasSaida: ['Maçã', 'Bergamota', 'Lavanda'],
    notasCoracao: ['Geranium', 'Jasmim', 'Violeta'],
    notasFundo: ['Sândalos', 'Baunilha', 'Almíscar', 'Caramelo'],
    destaques: ['Alta Concentração', 'Importação Oficial', 'Ingredientes Naturais'],
    historia: 'Inspirado no estilo de vida elegante do Château de Marly, Layton é uma fragrância que captura a essência do luxo francês do século XVIII. Sua abertura frutada e especiada evolui para um coração floral rico e uma base gourmand irresistível.',
    selos: ['novo'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1672848700906-2b8ca62639e4?w=600&q=80',
    dataCadastro: '2024-03-01',
  },
  {
    id: '8',
    brand: 'Clive Christian',
    name: 'No.1 Imperial Majesty',
    line: 'Iconic Collection',
    concentration: 'Parfum',
    volume: '50ml',
    year: 2005,
    country: 'Reino Unido',
    manufacturer: 'Clive Christian',
    importacaoOficial: true,
    category: 'exclusivos',
    familiaOlfativa: 'floral',
    genero: 'feminino',
    fixacao: '24+ horas',
    projecao: 'alta',
    preco: 18500,
    sobConsulta: false,
    disponibilidade: 'sob-encomenda',
    estoque: 1,
    notasSaida: ['Bergamota de Calábria', 'Cardamomo', 'Ylang-Ylang'],
    notasCoracao: ['Rosa Turca', 'Jasmim de Grasse', 'Íris Florentina'],
    notasFundo: ['Sândalos de Mysore', 'Almíscar', 'Civet', 'Âmbar'],
    destaques: ['Frasco Colecionável', 'Certificado de Autenticidade', 'Edição Limitada', 'Produção Artesanal', 'Ingredientes Naturais'],
    historia: 'Reconhecido pelo Guinness World Records como o perfume mais caro do mundo, o No.1 Imperial Majesty apresenta ingredientes raríssimos dos quatro cantos do globo, encapsulados em um frasco de cristal adornado com ouro 18k e diamante.',
    selos: ['exclusivo', 'edicao-limitada', 'ultimas-unidades'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1718466044521-d38654f3ba0a?w=600&q=80',
    dataCadastro: '2024-03-05',
  },
  {
    id: '9',
    brand: 'Memo Paris',
    name: 'African Leather',
    line: 'Cuir Collection',
    concentration: 'Eau de Parfum',
    volume: '75ml',
    year: 2009,
    country: 'França',
    manufacturer: 'Memo Paris',
    importacaoOficial: true,
    category: 'nicho',
    familiaOlfativa: 'couro',
    genero: 'unissex',
    fixacao: '10-14 horas',
    projecao: 'media',
    preco: 1650,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 4,
    notasSaida: ['Bergamota', 'Pimenta Preta', 'Cardamomo'],
    notasCoracao: ['Couro', 'Flor de Laranjeira', 'Jasmim'],
    notasFundo: ['Âmbar', 'Castoreum', 'Cedro'],
    destaques: ['Importação Oficial', 'Ingredientes Naturais'],
    historia: 'African Leather é uma ode ao couro africano, nobre e selvagem. Uma fragrância que combina o calor das especiarias do Norte da África com a sofisticação de um couro refinado, criando uma composição verdadeiramente única e inesquecível.',
    selos: ['importacao-oficial'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1593487568720-92097fb460fb?w=600&q=80',
    dataCadastro: '2024-03-10',
  },
  {
    id: '10',
    brand: 'Kilian Paris',
    name: 'Good Girl Gone Bad',
    line: 'The Fresh Collection',
    concentration: 'Eau de Parfum',
    volume: '50ml',
    year: 2012,
    country: 'França',
    manufacturer: 'Kilian Paris',
    importacaoOficial: true,
    category: 'nicho',
    familiaOlfativa: 'floral',
    genero: 'feminino',
    fixacao: '8-12 horas',
    projecao: 'media',
    preco: 2100,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 3,
    notasSaida: ['Bergamota', 'Limão', 'Mandarina'],
    notasCoracao: ['Rosa', 'Tuberosa', 'Jasmim', 'Íris'],
    notasFundo: ['Cedro', 'Almíscar Branco', 'Âmbar'],
    destaques: ['Alta Concentração', 'Importação Oficial', 'Frasco Colecionável'],
    historia: 'Good Girl Gone Bad captura a dualidade feminina com maestria. A frescor cítrico que mascara uma alma floral ardente e sensual. Uma fragrância que desafia e seduz em igual medida, perfeita para quem não teme se destacar.',
    selos: ['novo', 'importacao-oficial'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1615160460524-432433ba1b8f?w=600&q=80',
    dataCadastro: '2024-03-15',
  },
  {
    id: '11',
    brand: 'Initio',
    name: 'Oud for Greatness',
    line: 'Initio Parfums Privés',
    concentration: 'Eau de Parfum',
    volume: '90ml',
    year: 2018,
    country: 'França',
    manufacturer: 'Initio',
    importacaoOficial: false,
    category: 'nicho',
    familiaOlfativa: 'amadeirada',
    genero: 'unissex',
    fixacao: '16-24 horas',
    projecao: 'alta',
    preco: 2750,
    sobConsulta: false,
    disponibilidade: 'pronta-entrega',
    estoque: 2,
    notasSaida: ['Oud', 'Especiarias'],
    notasCoracao: ['Patchouli', 'Couro', 'Tabaco'],
    notasFundo: ['Almíscar', 'Âmbar', 'Vetiver'],
    destaques: ['Oud Natural', 'Alta Concentração', 'Produção Artesanal'],
    historia: 'Oud for Greatness é uma declaração de poder e conquista. O oud mais nobre se funde com especiarias e couro em uma composição que transcende o tempo e o espaço, criando uma assinatura olfativa verdadeiramente memorável.',
    selos: ['exclusivo'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1535683577427-740aaac4ec25?w=600&q=80',
    dataCadastro: '2024-03-20',
  },
  {
    id: '12',
    brand: 'Parfums MDCI',
    name: 'Chypre Palatin',
    line: 'Vocalises',
    concentration: 'Parfum',
    volume: '75ml',
    year: 2005,
    country: 'França',
    manufacturer: 'MDCI Parfums',
    importacaoOficial: false,
    category: 'edicoes-limitadas',
    familiaOlfativa: 'especiada',
    genero: 'unissex',
    fixacao: '16-24 horas',
    projecao: 'media',
    sobConsulta: true,
    disponibilidade: 'sob-encomenda',
    estoque: 1,
    notasSaida: ['Bergamota', 'Rosa', 'Sálvia'],
    notasCoracao: ['Labdanum', 'Patchouli', 'Vetiver'],
    notasFundo: ['Âmbar', 'Almíscar', 'Civeta'],
    destaques: ['Frasco Colecionável', 'Edição Limitada', 'Produção Artesanal', 'Certificado de Autenticidade'],
    historia: 'Chypre Palatin é a ressurreição dos grandes chypres do século XX, reimaginados com a maestria artesanal da perfumaria francesa contemporânea. Uma obra-prima que celebra a tradição e a inovação olfativa.',
    selos: ['edicao-limitada', 'ultimas-unidades'],
    status: 'publicado',
    imagem: 'https://images.unsplash.com/photo-1514348871858-1d3c20902571?w=600&q=80',
    dataCadastro: '2024-03-25',
  },
];

interface AppContextType {
  fragrances: Fragrance[];
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addFragrance: (f: Omit<Fragrance, 'id' | 'dataCadastro'>) => void;
  updateFragrance: (id: string, f: Partial<Fragrance>) => void;
  deleteFragrance: (id: string) => void;
  publishFragrance: (id: string) => void;
  pauseFragrance: (id: string) => void;
  getFragranceById: (id: string) => Fragrance | undefined;
  whatsappNumber: string;
  buildWhatsAppLink: (message: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

const ADMIN_PASSWORD = 'essence2024';
const STORAGE_KEY = 'essence_fragrances';
const AUTH_KEY = 'essence_admin_auth';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fragrances, setFragrances] = useState<Fragrance[]>(INITIAL_FRAGRANCES);
  const [isLoading, setIsLoading] = useState(true);
  const hasSynced = useRef(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  useEffect(() => {
    let cancelled = false;

    async function loadFragrances() {
      const remote = await fetchFragrances();

      if (cancelled) return;

      if (remote && remote.length > 0) {
        setFragrances(remote);
      } else {
        const fallback = (() => {
          try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? (JSON.parse(stored) as Fragrance[]) : INITIAL_FRAGRANCES;
          } catch {
            return INITIAL_FRAGRANCES;
          }
        })();

        setFragrances(fallback);

        if (remote && remote.length === 0) {
          await seedFragrances(fallback);
        }
      }

      setIsLoading(false);
      hasSynced.current = true;
    }

    loadFragrances();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hasSynced.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fragrances));
  }, [fragrances]);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const addFragrance = useCallback((f: Omit<Fragrance, 'id' | 'dataCadastro'>) => {
    const newFrag: Fragrance = {
      ...f,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString().split('T')[0],
    };
    setFragrances(prev => [newFrag, ...prev]);
    upsertFragrance(newFrag);
  }, []);

  const updateFragrance = useCallback((id: string, f: Partial<Fragrance>) => {
    setFragrances(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...f } : item);
      const updated = next.find(item => item.id === id);
      if (updated) upsertFragrance(updated);
      return next;
    });
  }, []);

  const deleteFragrance = useCallback((id: string) => {
    setFragrances(prev => prev.filter(item => item.id !== id));
    deleteFragranceFromDb(id);
  }, []);

  const publishFragrance = useCallback((id: string) => {
    setFragrances(prev => {
      const next = prev.map(item => item.id === id ? { ...item, status: 'publicado' as const } : item);
      const updated = next.find(item => item.id === id);
      if (updated) upsertFragrance(updated);
      return next;
    });
  }, []);

  const pauseFragrance = useCallback((id: string) => {
    setFragrances(prev => {
      const next = prev.map(item => item.id === id ? { ...item, status: 'pausado' as const } : item);
      const updated = next.find(item => item.id === id);
      if (updated) upsertFragrance(updated);
      return next;
    });
  }, []);

  const getFragranceById = useCallback((id: string) => {
    return fragrances.find(f => f.id === id);
  }, [fragrances]);

  const buildWhatsAppLink = useCallback((message: string) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, []);

  return (
    <AppContext.Provider value={{
      fragrances,
      isLoading,
      isAdminLoggedIn,
      login,
      logout,
      addFragrance,
      updateFragrance,
      deleteFragrance,
      publishFragrance,
      pauseFragrance,
      getFragranceById,
      whatsappNumber: WHATSAPP_NUMBER,
      buildWhatsAppLink,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
