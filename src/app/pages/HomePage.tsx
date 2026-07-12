import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { MessageCircle, ChevronDown, ArrowRight, Check, Star, Quote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FragranceCard } from '../components/FragranceCard';
import { FragranceDrawer } from '../components/FragranceDrawer';
import type { Fragrance } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const HERO_VIDEO_URL =
  'https://lqyevhohmyweqcuyqmjr.supabase.co/storage/v1/object/public/video/Girar_frasco_perfume_abre_fecha_202607121812.mp4';

const BRANDS = [
  'Creed', 'Maison Francis Kurkdjian', 'Xerjoff', 'Roja Parfums',
  'Amouage', 'Tom Ford', 'Clive Christian', 'Parfums de Marly',
  'Kilian Paris', 'Initio', 'Memo Paris', 'Byredo',
];

const CATEGORIES = ['Todos', 'Nicho', 'Árabes', 'Exclusivos', 'Edições Limitadas', 'Designers', 'Recém-chegados'];

const CAT_MAP: Record<string, string> = {
  'Nicho': 'nicho',
  'Árabes': 'arabes',
  'Exclusivos': 'exclusivos',
  'Edições Limitadas': 'edicoes-limitadas',
  'Designers': 'designer',
  'Recém-chegados': 'recem-chegados',
};

const TIMELINE_ITEMS = [
  { year: '1828', title: 'Guerlain', desc: 'Pierre-François Pascal Guerlain funda a primeira grande casa de perfumaria em Paris.' },
  { year: '1921', title: 'Chanel Nº 5', desc: 'Ernest Beaux cria o primeiro perfume a usar aldeídos, revolucionando a perfumaria.' },
  { year: '1970', title: 'Nicho Nasce', desc: 'Surge o movimento de perfumaria nicho, priorizando ingredientes raros e composições artísticas.' },
  { year: '2000', title: 'Renascimento Oud', desc: 'O oud árabe conquista o mercado ocidental, redefinindo o luxo olfativo global.' },
  { year: '2024', title: 'Essence Parfum', desc: 'Nossa curadoria reúne as maiores expressões da perfumaria mundial em um único lugar.' },
];

const TESTIMONIALS = [
  {
    name: 'Rafael Mendonça',
    role: 'Colecionador',
    text: 'A Essence Parfum é o único lugar onde encontro fragrâncias verdadeiramente raras com garantia de autenticidade. O atendimento personalizado via WhatsApp é impecável.',
    rating: 5,
  },
  {
    name: 'Isabella Torres',
    role: 'Entusiasta de Perfumaria',
    text: 'Comprei o Baccarat Rouge 540 e chegou com todos os documentos de autenticidade. Nunca vi um serviço tão cuidadoso e elegante no Brasil.',
    rating: 5,
  },
  {
    name: 'Marcelo Cavalcante',
    role: 'Empresário',
    text: 'Eles importaram sob encomenda uma fragrância que eu procurava há anos. O processo foi transparente, rápido e o resultado superou todas as minhas expectativas.',
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: 'Como garantem a originalidade dos perfumes?',
    a: 'Cada fragrância é adquirida diretamente de distribuidores oficiais ou das próprias casas perfumistas. Fornecemos certificado de autenticidade, nota fiscal e, quando aplicável, documentação de importação.',
  },
  {
    q: 'Como funciona a importação sob encomenda?',
    a: 'Você nos informa a fragrância desejada, verificamos a disponibilidade e custo de importação, e apresentamos um orçamento detalhado. O prazo médio é de 15 a 30 dias úteis após a confirmação.',
  },
  {
    q: 'Quais são as formas de pagamento?',
    a: 'Aceitamos Pix, transferência bancária e cartões de crédito (parcelamento em até 12x). Os detalhes são tratados diretamente via WhatsApp com nosso especialista.',
  },
  {
    q: 'Como é feito o envio?',
    a: 'Utilizamos embalagem premium com proteção especial para frascos de vidro. Enviamos para todo o Brasil via transportadora especializada, com rastreamento completo e seguro.',
  },
  {
    q: 'Qual é a política de troca?',
    a: 'Aceitamos troca em caso de defeito de fabricação ou produto divergente do pedido, dentro de 7 dias do recebimento. Perfumes não são trocados por preferência pessoal.',
  },
  {
    q: 'Posso testar antes de comprar?',
    a: 'Para clientes em São Paulo, oferecemos consultas presenciais na boutique mediante agendamento. Para clientes de outras cidades, disponibilizamos uma consultoria olfativa detalhada via WhatsApp.',
  },
];

const SERVICES = [
  {
    icon: '◈',
    title: 'Consultoria Olfativa',
    desc: 'Atendimento personalizado para encontrar a fragrância perfeita para seu perfil e ocasião.',
    waMsgKey: 'consultoria',
  },
  {
    icon: '✦',
    title: 'Importação Sob Encomenda',
    desc: 'Buscamos qualquer fragrância do mundo diretamente para você, com garantia de autenticidade.',
    waMsgKey: 'importacao',
  },
  {
    icon: '◇',
    title: 'Gift Selection',
    desc: 'Curadoria especial para presentear. Embalagem premium e mensagem personalizada.',
    waMsgKey: 'gift',
  },
  {
    icon: '⬡',
    title: 'Curadoria para Colecionadores',
    desc: 'Acesso a edições limitadas, descontinuadas e raridades do mercado internacional.',
    waMsgKey: 'colecao',
  },
];

const SERVICE_MESSAGES: Record<string, string> = {
  consultoria: 'Olá! Gostaria de receber uma recomendação personalizada de perfumes.',
  importacao: 'Olá! Gostaria de saber como funciona o serviço de importação sob encomenda.',
  gift: 'Olá! Gostaria de um auxílio com Gift Selection.',
  colecao: 'Olá! Tenho interesse na curadoria para colecionadores.',
};

export function HomePage() {
  const { fragrances, buildWhatsAppLink } = useApp();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFeaturedTab, setActiveFeaturedTab] = useState<'saida' | 'coracao' | 'fundo' | 'performance' | 'autenticidade'>('saida');
  const [activeTimeline, setActiveTimeline] = useState(0);

  const published = fragrances.filter(f => f.status === 'publicado');
  const featured = published[0];

  const filteredFragrances = activeCategory === 'Todos'
    ? published.slice(0, 8)
    : published.filter(f => f.category === CAT_MAP[activeCategory]).slice(0, 8);

  const tabNotes = {
    saida: featured?.notasSaida || [],
    coracao: featured?.notasCoracao || [],
    fundo: featured?.notasFundo || [],
    performance: [],
    autenticidade: [],
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center bg-ink overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            src={HERO_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center lg:object-[58%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent lg:from-black/25 lg:via-transparent lg:to-transparent" />
        </div>

        {/* Decorative gold accents — desktop: entre texto e vídeo */}
        <div className="absolute hidden lg:block bg-gradient-to-b from-transparent via-gold/40 to-transparent w-px h-24 left-1/2 top-[32%] -translate-x-1/2" />
        <div className="absolute hidden lg:block bg-gradient-to-r from-transparent via-gold/30 to-transparent h-px w-24 left-1/2 top-[46%] -translate-x-1/2" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="max-w-2xl lg:max-w-none">
            {/* Eyebrow */}
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="text-gold uppercase mb-6"
            >
              Coleção Exclusiva · 2024
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 3.75rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.01em',
                fontWeight: 500,
              }}
              className="text-cream mb-8"
            >
              <span className="block">Perfumes que</span>
              <span className="block">não se encontram.</span>
              <em className="text-gold not-italic block">Se reconhecem.</em>
            </h1>

            {/* Paragraph */}
            <p
              style={{ fontSize: '1.1rem', lineHeight: '1.7' }}
              className="text-cream mb-10 max-w-lg"
            >
              Uma curadoria rigorosa das fragrâncias mais raras e exclusivas do mundo. Autenticidade certificada, atendimento personalizado.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/colecao"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-4 bg-gold text-ink uppercase text-sm hover:bg-gold-dark transition-colors"
                style={{ letterSpacing: '0.14em' }}
              >
                Ver Coleção
                <ArrowRight size={15} />
              </Link>
              <a
                href={buildWhatsAppLink('Olá! Gostaria de receber uma consultoria para encontrar uma fragrância ideal para mim.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-4 border border-cream/40 text-cream uppercase text-sm hover:border-gold hover:text-gold transition-colors"
                style={{ letterSpacing: '0.14em' }}
              >
                <MessageCircle size={15} />
                Consultoria
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-cream/15">
              {[
                { num: '+200', label: 'Fragrâncias' },
                { num: '5%',   label: 'Taxa de Curadoria' },
                { num: '100%', label: 'Autênticas' },
              ].map(s => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <div
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: '1.5', fontWeight: 400 }}
                    className="text-gold"
                  >
                    {s.num}
                  </div>
                  <div
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em' }}
                    className="uppercase text-cream"
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna direita vazia — o perfume fica visível ao centro no desktop */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50">
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', letterSpacing: '0.3em' }} className="uppercase">Explorar</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ── BRAND CAROUSEL ── */}
      <section id="marcas" className="bg-cream-dark border-y border-sand py-6 overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8">
              <span
                style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em' }}
                className="text-espresso/60 hover:text-gold transition-colors cursor-default"
              >
                {brand}
              </span>
              <span className="w-1 h-1 bg-gold/40 rounded-full" />
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── text-left QUEM SOMOS & COMO FUNCIONAMOS ── */}
      <section id="sobre" className="bg-cream py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="mb-20">
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="uppercase text-gold mb-4 text-center"
            >
              Nossa Essência
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 500, lineHeight: '1.15' }}
              className="text-noir mb-5 text-left"
            >
              Uma galeria olfativa construída com rigor e paixão
            </h2>
            <p
              style={{ fontSize: '1rem', lineHeight: '1.8' }}
              className="text-taupe text-justify max-w-3xl"
            >
              Apenas 5% das fragrâncias que avaliamos entram para a nossa coleção. Cada garrafa carrega uma história — e nós somos os seus curadores.
            </p>
          </div>

          {/* Dois blocos: Quem Somos + Como Funcionamos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-sand">

            {/* QUEM SOMOS */}
            <div className="p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-sand">
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.28em' }}
                className="uppercase text-gold mb-6"
              >
                Quem Somos
              </div>
              <div
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: '1.25' }}
                className="text-noir mb-6"
              >
                Não somos uma loja.<br />Somos uma curadoria.
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.85' }} className="text-taupe mb-8">
                A Essence Parfum nasceu da obsessão por fragrâncias que transcendem o comum. Somos especialistas que dedicam horas a avaliar, comparar e selecionar apenas o que é verdadeiramente excepcional — de casas nicho europeias a raridades árabes e edições de colecionador.
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.85' }} className="text-taupe mb-10">
                Cada fragrância que exibimos passa por verificação de autenticidade, análise sensorial e validação de origem. O resultado é um catálogo enxuto, preciso e repleto de significado.
              </p>

              {/* Três pilares */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-sand">
                {[
                  { icon: '◈', label: 'Autenticidade', sub: 'Certificada em cada frasco' },
                  { icon: '✦', label: 'Curadoria',     sub: 'Top 5% do mercado global' },
                  { icon: '◇', label: 'Exclusividade', sub: 'Raridades e edições únicas' },
                ].map(p => (
                  <div key={p.label} className="flex flex-col gap-2">
                    <span className="text-gold text-lg">{p.icon}</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }} className="text-noir">
                      {p.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', lineHeight: '1.5' }} className="text-taupe">
                      {p.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMO FUNCIONAMOS */}
            <div className="p-8 sm:p-12 bg-cream-dark">
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.28em' }}
                className="uppercase text-gold mb-6"
              >
                Como Funcionamos
              </div>
              <div
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: '1.25' }}
                className="text-noir mb-8"
              >
                Simples, direto<br />e completamente personalizado.
              </div>

              {/* Steps verticais compactos */}
              <div className="space-y-0">
                {[
                  {
                    num: '01',
                    title: 'Você nos conta o que busca',
                    desc: 'Via WhatsApp, nosso especialista entende seu estilo, ocasião e preferências olfativas.',
                  },
                  {
                    num: '02',
                    title: 'Nós fazemos a curadoria',
                    desc: 'Selecionamos as opções mais alinhadas ao seu perfil — sem julgamentos, só expertise.',
                  },
                  {
                    num: '03',
                    title: 'Autenticidade verificada',
                    desc: 'Cada fragrância entregue vem com certificado de autenticidade e documentação de origem.',
                  },
                  {
                    num: '04',
                    title: 'Entrega com cuidado premium',
                    desc: 'Embalagem artesanal, proteção total e rastreamento — da boutique até você.',
                  },
                ].map((step, i, arr) => (
                  <div
                    key={step.num}
                    className={`flex gap-5 py-5 ${i < arr.length - 1 ? 'border-b border-sand' : ''}`}
                  >
                    {/* Número + linha vertical */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em' }}
                        className="text-gold"
                      >
                        {step.num}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 bg-sand mt-1" />
                      )}
                    </div>
                    {/* Conteúdo */}
                    <div className="pb-1">
                      <div
                        style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}
                        className="text-noir mb-1"
                      >
                        {step.title}
                      </div>
                      <p style={{ fontSize: '0.82rem', lineHeight: '1.7' }} className="text-taupe">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-sand">
                <a
                  href={buildWhatsAppLink('Olá! Gostaria de receber uma consultoria para encontrar uma fragrância ideal para mim.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gold text-ink uppercase text-xs hover:bg-gold-dark transition-colors text-center"
                  style={{ letterSpacing: '0.1em', lineHeight: '1.4' }}
                >
                  <MessageCircle size={13} className="shrink-0" />
                  <span>Iniciar Consultoria pelo WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED FRAGRANCE ── */}
      {featured && (
        <section className="py-24 lg:py-32 bg-cream">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <div
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
                className="uppercase text-gold mb-4"
              >
                Fragrância em Destaque
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                className="text-noir"
              >
                A Escolha dos Especialistas
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Image with annotations */}
              <div className="relative">
                <div className="relative overflow-hidden bg-cream-dark" style={{ height: 'clamp(300px, 50vw, 560px)' }}>
                  <ImageWithFallback
                    src={featured.imagem}
                    alt={`${featured.brand} ${featured.name}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Annotation tags */}
                  <div className="absolute top-6 right-6 space-y-2">
                    {featured.destaques.slice(0, 3).map(d => (
                      <div
                        key={d}
                        className="bg-cream/90 backdrop-blur-sm px-2 py-1 text-right"
                      >
                        <span style={{ fontSize: '0.55rem', letterSpacing: '0.08em' }} className="uppercase text-espresso leading-none">
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Brand + Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/90 to-transparent p-6">
                    <div
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
                      className="text-gold uppercase mb-1"
                    >
                      {featured.brand}
                    </div>
                    <div
                      style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}
                      className="text-cream"
                    >
                      {featured.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info + Tabs */}
              <div>
                {/* Quick specs */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Família Olfativa', value: featured.familiaOlfativa },
                    { label: 'Concentração', value: featured.concentration },
                    { label: 'Fixação', value: featured.fixacao || '—' },
                    { label: 'Projeção', value: featured.projecao ? { baixa: 'Baixa', media: 'Média', alta: 'Alta' }[featured.projecao] : '—' },
                  ].map(spec => (
                    <div key={spec.label} className="bg-cream-dark p-4 border border-sand">
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em' }} className="uppercase text-taupe mb-1">
                        {spec.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)' }} className="text-noir capitalize">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="border-b border-sand mb-6">
                  <div className="flex overflow-x-auto">
                    {(['saida', 'coracao', 'fundo', 'performance', 'autenticidade'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveFeaturedTab(tab)}
                        style={{ fontSize: '0.7rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}
                        className={`px-4 py-3 uppercase border-b-2 transition-colors ${
                          activeFeaturedTab === tab
                            ? 'border-gold text-gold'
                            : 'border-transparent text-taupe hover:text-noir'
                        }`}
                      >
                        {tab === 'saida' ? 'Saída' : tab === 'coracao' ? 'Coração' : tab === 'fundo' ? 'Fundo' : tab === 'performance' ? 'Performance' : 'Autenticidade'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8 min-h-[100px]">
                  {(activeFeaturedTab === 'saida' || activeFeaturedTab === 'coracao' || activeFeaturedTab === 'fundo') && (
                    <div className="flex flex-wrap gap-2">
                      {tabNotes[activeFeaturedTab].map(nota => (
                        <span key={nota} className="px-3 py-1.5 border border-sand bg-cream-dark text-espresso" style={{ fontSize: '0.8rem' }}>
                          {nota}
                        </span>
                      ))}
                    </div>
                  )}
                  {activeFeaturedTab === 'performance' && (
                    <div className="space-y-4">
                      {[
                        { label: 'Fixação', value: featured.fixacao, bars: 3 },
                        { label: 'Projeção', value: featured.projecao === 'alta' ? 'Alta' : featured.projecao === 'media' ? 'Média' : 'Baixa', bars: featured.projecao === 'alta' ? 3 : featured.projecao === 'media' ? 2 : 1 },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between mb-2">
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em' }} className="uppercase text-taupe">{item.label}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} className="text-noir">{item.value}</span>
                          </div>
                          <div className="flex gap-1">
                            {[1,2,3].map(b => (
                              <div key={b} className={`h-1.5 flex-1 ${b <= item.bars ? 'bg-gold' : 'bg-sand'}`} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeFeaturedTab === 'autenticidade' && (
                    <div className="space-y-3">
                      {[
                        { label: 'Fabricante', value: featured.manufacturer || '—' },
                        { label: 'País de Origem', value: featured.country || '—' },
                        { label: 'Importação Oficial', value: featured.importacaoOficial ? 'Sim ✓' : 'Não' },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between py-2 border-b border-sand">
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em' }} className="uppercase text-taupe">{item.label}</span>
                          <span style={{ fontSize: '0.85rem' }} className="text-noir">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedFragrance(featured)}
                    className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-4 bg-gold text-ink uppercase text-xs sm:text-sm hover:bg-gold-dark transition-colors"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    <MessageCircle size={15} />
                    Quero Esta Fragrância
                  </button>
                  <button
                    onClick={() => setSelectedFragrance(featured)}
                    className="inline-flex items-center justify-center whitespace-nowrap px-5 py-4 border border-sand text-espresso hover:border-gold transition-colors text-xs sm:text-sm uppercase"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── COLLECTION GRID ── */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="uppercase text-gold mb-4"
            >
              Nossa Coleção
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              className="text-noir mb-6"
            >
              Fragrâncias Selecionadas
            </h2>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}
                className={`px-4 py-2 uppercase border transition-colors ${
                  activeCategory === cat
                    ? 'bg-gold border-gold text-ink'
                    : 'border-sand text-espresso hover:border-gold/50 hover:text-gold bg-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredFragrances.length === 0 ? (
            <div className="text-center py-16 text-taupe">
              <p>Nenhuma fragrância nesta categoria ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredFragrances.map(f => (
                <FragranceCard
                  key={f.id}
                  fragrance={f}
                  onClick={() => setSelectedFragrance(f)}
                />
              ))}
            </div>
          )}

          {/* CTA to full catalog */}
          <div className="text-center mt-12">
            <p className="text-taupe mb-4 text-sm">Não encontrou a fragrância que procura?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/colecao"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto px-6 py-3 bg-noir text-cream uppercase text-xs sm:text-sm hover:bg-espresso transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                Ver Coleção Completa
                <ArrowRight size={14} />
              </Link>
              <a
                href={buildWhatsAppLink('Olá! Não encontrei a fragrância que procuro. Poderia me ajudar?')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto px-6 py-3 border border-sand text-espresso uppercase text-xs sm:text-sm hover:border-gold hover:text-gold transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                <MessageCircle size={14} />
                Solicitar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="uppercase text-gold mb-4"
            >
              Serviços
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              className="text-noir"
            >
              Experiências Exclusivas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(service => (
              <a
                key={service.title}
                href={buildWhatsAppLink(SERVICE_MESSAGES[service.waMsgKey])}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 bg-cream-dark border border-sand hover:border-gold/40 transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col"
              >
                <div className="text-gold text-2xl mb-5 group-hover:scale-110 transition-transform origin-left">{service.icon}</div>
                <div
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}
                  className="text-noir mb-3"
                >
                  {service.title}
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }} className="text-taupe flex-1">
                  {service.desc}
                </p>
                <div className="mt-5 flex items-center gap-2 text-gold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Saiba Mais <ArrowRight size={12} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 bg-ink">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="uppercase text-gold mb-4"
            >
              Como Funciona
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              className="text-cream"
            >
              Sua Jornada Olfativa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-cream/10">
            {[
              { num: '01', title: 'Conversa Inicial', desc: 'Entre em contato via WhatsApp. Nosso especialista entende seu perfil e preferências.' },
              { num: '02', title: 'Curadoria Personalizada', desc: 'Selecionamos as fragrâncias ideais para o seu gosto, ocasião e momento.' },
              { num: '03', title: 'Verificação de Autenticidade', desc: 'Cada fragrância é verificada e acompanhada de certificado de autenticidade.' },
              { num: '04', title: 'Entrega Premium', desc: 'Embalagem especial, com cuidado artesanal, entregue onde você estiver.' },
            ].map((step, i) => (
              <div
                key={step.num}
                className="relative p-6 sm:p-8 border-r border-b border-cream/10 hover:bg-cream/5 transition-colors group"
              >
                <div
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', lineHeight: '1' }}
                  className="text-gold/40 group-hover:text-gold/70 transition-colors mb-6"
                >
                  {step.num}
                </div>
                <div
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-cream text-lg mb-3"
                >
                  {step.title}
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }} className="text-cream/75">
                  {step.desc}
                </p>
                {i < 3 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block text-gold/20 pr-px">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE (horizontal interactive) ── */}
      <section className="bg-ink py-20 lg:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="uppercase text-gold mb-3"
            >
              Linha do Tempo
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
              className="text-cream"
            >
              A História da Perfumaria
            </h2>
          </div>

          {/* Rail — scrollable on mobile */}
          <div className="overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="relative min-w-[560px]">

              {/* Horizontal gold line */}
              <div className="absolute top-[18px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              {/* Items row */}
              <div className="flex justify-between items-start relative">
                {TIMELINE_ITEMS.map((item, i) => {
                  const isActive = activeTimeline === i;
                  return (
                    <button
                      key={item.year}
                      onClick={() => setActiveTimeline(i)}
                      className="flex flex-col items-center gap-3 flex-1 group focus:outline-none"
                    >
                      {/* Diamond marker */}
                      <div
                        className={`w-[14px] h-[14px] rotate-45 border transition-all duration-300 ${
                          isActive
                            ? 'bg-gold border-gold scale-125'
                            : 'bg-transparent border-gold/40 group-hover:border-gold/80 group-hover:bg-gold/20'
                        }`}
                      />

                      {/* Year */}
                      <div
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em' }}
                        className={`uppercase transition-colors duration-200 ${
                          isActive ? 'text-gold' : 'text-cream/55 group-hover:text-cream/85'
                        }`}
                      >
                        {item.year}
                      </div>

                      {/* Title */}
                      <div
                        style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}
                        className={`transition-colors duration-200 text-center leading-tight px-2 ${
                          isActive ? 'text-cream' : 'text-cream/60 group-hover:text-cream/85'
                        }`}
                      >
                        {item.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content panel — expands below rail */}
          <div className="mt-10 border border-gold/40 relative overflow-hidden">
            {/* Gold left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold" />

            <div className="px-8 py-7 pl-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', letterSpacing: '-0.02em', lineHeight: '1' }}
                  className="text-gold/50"
                >
                  {TIMELINE_ITEMS[activeTimeline].year}
                </div>
                <div>
                  <div
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.25em' }}
                    className="uppercase text-gold mb-1"
                  >
                    Marco Histórico
                  </div>
                  <div
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}
                    className="text-cream"
                  >
                    {TIMELINE_ITEMS[activeTimeline].title}
                  </div>
                </div>
              </div>
              <p
                style={{ fontSize: '0.9rem', lineHeight: '1.8' }}
                className="text-cream/80 max-w-2xl"
              >
                {TIMELINE_ITEMS[activeTimeline].desc}
              </p>
            </div>

            {/* Navigation dots */}
            <div className="flex items-center gap-2 px-10 pb-6">
              {TIMELINE_ITEMS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTimeline(i)}
                  className={`transition-all duration-200 ${
                    activeTimeline === i
                      ? 'w-5 h-0.5 bg-gold'
                      : 'w-1.5 h-0.5 bg-cream/40 hover:bg-cream/65'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 lg:py-32 bg-blush">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="uppercase text-gold mb-4"
            >
              Depoimentos
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              className="text-noir"
            >
              Clientes Apaixonados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-cream p-8 border border-sand/50 hover:border-gold/30 transition-colors">
                <Quote size={24} className="text-gold/40 mb-4" />
                <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }} className="text-espresso mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={12} className="text-gold fill-gold" />
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-display)' }} className="text-noir">
                  {t.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="uppercase text-taupe mt-0.5">
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
              className="uppercase text-gold mb-4"
            >
              Perguntas Frequentes
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              className="text-noir"
            >
              Tudo que você precisa saber
            </h2>
          </div>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border border-sand bg-cream">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-cream-dark/40 transition-colors group"
                >
                  <span
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="text-noir pr-4 group-hover:text-gold transition-colors"
                  >
                    {item.q}
                  </span>
                  <span className={`text-gold shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }} className="text-taupe">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 lg:py-32 relative bg-noir overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0">
          <video
            src="/src/imports/Perfume_bottle_spraying_liquid_202607111555.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/50" />
        </div>

        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">

            {/* Texto — esquerda */}
            <div className="lg:max-w-xl">
              <div
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
                className="uppercase text-gold mb-5"
              >
                Sua Fragrância Ideal Existe
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.15' }}
                className="text-cream mb-5"
              >
                Encontre a fragrância que traduz sua personalidade.
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.75' }} className="text-cream/70">
                Nossos especialistas estão prontos para te guiar em uma jornada olfativa única, encontrando a fragrância perfeita para cada momento da sua vida.
              </p>

              {/* Trust markers */}
              <div className="mt-8 flex flex-col gap-2">
                {[
                  '✓ Fragrâncias 100% Autênticas',
                  '✓ Atendimento Personalizado',
                  '✓ Entrega Premium',
                ].map(item => (
                  <span
                    key={item}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em' }}
                    className="text-cream/55 uppercase"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs — direita */}
            <div className="flex flex-col items-center gap-3 lg:min-w-[220px]">
              <a
                href={buildWhatsAppLink('Olá! Gostaria de receber uma consultoria para encontrar uma fragrância ideal para mim.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full px-5 py-2 bg-gold text-ink uppercase text-xs hover:bg-gold-dark transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                <MessageCircle size={13} />
                Falar com um Especialista
              </a>
              <a
                href={buildWhatsAppLink('Olá! Gostaria de agendar um atendimento personalizado na boutique.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full px-5 py-2 border border-cream/40 text-cream uppercase text-xs hover:border-gold hover:text-gold transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                Agendar Atendimento
              </a>
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em' }}
                className="text-cream/35 uppercase text-center pt-1"
              >
                Resposta em até 2 horas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fragrance Drawer */}
      {selectedFragrance && (
        <FragranceDrawer
          fragrance={selectedFragrance}
          onClose={() => setSelectedFragrance(null)}
        />
      )}
    </div>
  );
}
