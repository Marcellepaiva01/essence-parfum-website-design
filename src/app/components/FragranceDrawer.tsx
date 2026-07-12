import { useState, useEffect } from 'react';
import { X, MessageCircle, Star, Droplets, Wind, Layers } from 'lucide-react';
import type { Fragrance } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FragranceDrawerProps {
  fragrance: Fragrance | null;
  onClose: () => void;
}

type Tab = 'saida' | 'coracao' | 'fundo' | 'performance' | 'autenticidade';

export function FragranceDrawer({ fragrance, onClose }: FragranceDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('saida');
  const { buildWhatsAppLink } = useApp();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!fragrance) return null;

  const handleWhatsApp = () => {
    const msg = `Olá! Gostaria de saber mais sobre a fragrância ${fragrance.brand} ${fragrance.name} ${fragrance.volume}.`;
    window.open(buildWhatsAppLink(msg), '_blank');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'saida', label: 'Notas de Saída', icon: <Wind size={13} /> },
    { id: 'coracao', label: 'Notas de Coração', icon: <Star size={13} /> },
    { id: 'fundo', label: 'Notas de Fundo', icon: <Layers size={13} /> },
    { id: 'performance', label: 'Performance', icon: <Droplets size={13} /> },
    { id: 'autenticidade', label: 'Autenticidade', icon: <Star size={13} /> },
  ];

  const tabNotes: Record<Tab, string[]> = {
    saida: fragrance.notasSaida,
    coracao: fragrance.notasCoracao,
    fundo: fragrance.notasFundo,
    performance: [],
    autenticidade: [],
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[61] w-full max-w-lg bg-cream shadow-2xl flex flex-col">
        {/* Header */}
        <div className="shrink-0 bg-cream border-b border-sand px-6 py-4 flex items-center justify-between">
          <div>
            <div
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
              className="uppercase text-taupe"
            >
              {fragrance.brand}
            </div>
            <div
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-noir text-lg leading-tight"
            >
              {fragrance.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-taupe hover:text-noir transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto flex flex-col">

        {/* Image */}
        <div className="relative bg-cream-dark overflow-hidden shrink-0" style={{ height: '280px' }}>
          <ImageWithFallback
            src={fragrance.imagem}
            alt={`${fragrance.brand} ${fragrance.name}`}
            className="w-full h-full object-cover"
          />
          {/* Destaques overlay */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {fragrance.destaques.slice(0, 3).map(d => (
              <span
                key={d}
                style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}
                className="bg-ink/80 text-cream px-2 py-1 uppercase backdrop-blur-sm"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Quick specs */}
        <div className="grid grid-cols-2 border-b border-sand">
          {[
            { label: 'Concentração', value: fragrance.concentration },
            { label: 'Volume', value: fragrance.volume },
            { label: 'Família Olfativa', value: fragrance.familiaOlfativa },
            { label: 'Gênero', value: fragrance.genero },
          ].map(spec => (
            <div key={spec.label} className="px-5 py-4 border-r border-b border-sand last:border-r-0 even:border-r-0">
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em' }}
                className="uppercase text-taupe mb-1"
              >
                {spec.label}
              </div>
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                className="text-noir capitalize"
              >
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-sand overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}
                className={`flex items-center gap-1.5 px-4 py-3 uppercase whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-taupe hover:text-noir'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-6 flex-1">
          {(activeTab === 'saida' || activeTab === 'coracao' || activeTab === 'fundo') && (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {tabNotes[activeTab].map(nota => (
                  <span
                    key={nota}
                    className="px-3 py-1.5 border border-sand bg-cream-dark text-espresso"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {nota}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-5">
              {[
                { label: 'Fixação', value: fragrance.fixacao || '—' },
                {
                  label: 'Projeção',
                  value: fragrance.projecao
                    ? { baixa: 'Baixa', media: 'Média', alta: 'Alta' }[fragrance.projecao]
                    : '—',
                  bars: fragrance.projecao === 'baixa' ? 1 : fragrance.projecao === 'media' ? 2 : 3,
                },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em' }}
                      className="uppercase text-taupe"
                    >
                      {item.label}
                    </span>
                    <span
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                      className="text-noir"
                    >
                      {item.value}
                    </span>
                  </div>
                  {item.bars && (
                    <div className="flex gap-1">
                      {[1, 2, 3].map(b => (
                        <div
                          key={b}
                          className={`h-1.5 flex-1 ${b <= item.bars! ? 'bg-gold' : 'bg-sand'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-sand">
                <div
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em' }}
                  className="uppercase text-taupe mb-3"
                >
                  Destaques
                </div>
                <div className="flex flex-wrap gap-2">
                  {fragrance.destaques.map(d => (
                    <span
                      key={d}
                      className="px-3 py-1.5 border border-gold/30 text-espresso"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'autenticidade' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[#6B8E5A]/10 border border-[#6B8E5A]/30">
                <div className="text-[#6B8E5A]">✓</div>
                <div>
                  <div
                    style={{ fontSize: '0.85rem' }}
                    className="text-noir mb-0.5"
                  >
                    Fragrância 100% Autêntica
                  </div>
                  <div
                    style={{ fontSize: '0.75rem' }}
                    className="text-taupe"
                  >
                    Verificada e garantida pela Essence Parfum
                  </div>
                </div>
              </div>
              {[
                { label: 'Fabricante', value: fragrance.manufacturer || '—' },
                { label: 'País de Origem', value: fragrance.country || '—' },
                { label: 'Importação Oficial', value: fragrance.importacaoOficial ? 'Sim' : 'Não' },
                { label: 'Ano de Lançamento', value: fragrance.year?.toString() || '—' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-3 border-b border-sand">
                  <span
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em' }}
                    className="uppercase text-taupe"
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: '0.85rem' }} className="text-noir">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Historia */}
          {fragrance.historia && (
            <div className="mt-6 pt-6 border-t border-sand">
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
                className="uppercase text-taupe mb-3"
              >
                História
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.7' }} className="text-espresso">
                {fragrance.historia}
              </p>
            </div>
          )}
        </div>

        </div>{/* end scrollable body */}

        {/* CTA Footer */}
        <div className="shrink-0 bg-cream border-t border-sand p-5 space-y-3">
          {!fragrance.sobConsulta && fragrance.preco && (
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em' }} className="uppercase text-taupe">
                Preço
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }} className="text-noir">
                R$ {fragrance.preco.toLocaleString('pt-BR')}
              </span>
            </div>
          )}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-gold text-ink py-4 uppercase tracking-widest text-sm hover:bg-gold-dark transition-colors"
            style={{ letterSpacing: '0.18em' }}
          >
            <MessageCircle size={16} />
            Quero Esta Fragrância
          </button>
        </div>
      </div>
    </>
  );
}
