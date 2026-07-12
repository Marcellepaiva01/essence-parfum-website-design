import { MessageCircle } from 'lucide-react';
import type { Fragrance } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

const SELO_CONFIG: Record<string, { label: string; shortLabel: string; color: string }> = {
  'exclusivo':        { label: 'Exclusivo',          shortLabel: 'Exclusivo',    color: 'bg-gold text-ink' },
  'novo':             { label: 'Novo',                shortLabel: 'Novo',         color: 'bg-noir text-cream' },
  'edicao-limitada':  { label: 'Ed. Limitada',        shortLabel: 'Ed. Ltda',     color: 'bg-espresso text-cream' },
  'ultimas-unidades': { label: 'Últimas Unidades',    shortLabel: 'Últimas Un.',  color: 'bg-[#B4483A] text-cream' },
  'importacao-oficial':{ label: 'Importação Oficial', shortLabel: 'Imp. Oficial', color: 'bg-cream-dark text-espresso border border-sand' },
};

interface FragranceCardProps {
  fragrance: Fragrance;
  onClick: () => void;
}

export function FragranceCard({ fragrance, onClick }: FragranceCardProps) {
  const { buildWhatsAppLink } = useApp();

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Olá! Gostaria de saber mais sobre a fragrância ${fragrance.brand} ${fragrance.name} ${fragrance.volume}.`;
    window.open(buildWhatsAppLink(msg), '_blank');
  };

  const topSelos = fragrance.selos.slice(0, 1); // 1 selo on mobile to avoid overflow

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-cream border border-sand hover:border-gold/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-cream-dark aspect-[3/4]">
        <ImageWithFallback
          src={fragrance.imagem}
          alt={`${fragrance.brand} ${fragrance.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Selos */}
        {topSelos.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {topSelos.map(selo => {
              const config = SELO_CONFIG[selo];
              if (!config) return null;
              return (
                <span
                  key={selo}
                  style={{ letterSpacing: '0.06em', fontSize: '0.55rem' }}
                  className={`px-1.5 py-0.5 uppercase whitespace-nowrap ${config.color}`}
                >
                  {/* Short label on small screens, full on larger */}
                  <span className="sm:hidden">{config.shortLabel}</span>
                  <span className="hidden sm:inline">{config.label}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* WA button — always visible on touch, hover on desktop */}
        <button
          onClick={handleWhatsApp}
          className="absolute bottom-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 bg-gold text-ink p-2 hover:bg-gold-dark"
          title="Falar sobre esta fragrância"
        >
          <MessageCircle size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        <div
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em' }}
          className="uppercase text-taupe truncate"
        >
          {fragrance.brand}
        </div>
        <div
          style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}
          className="text-noir leading-snug line-clamp-2"
        >
          {fragrance.name}
        </div>
        <div
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em' }}
          className="text-taupe/80 truncate"
        >
          {fragrance.concentration} · {fragrance.volume}
        </div>

        <div className="mt-auto pt-2.5 flex items-end justify-between gap-1 border-t border-sand">
          <div className="min-w-0">
            {fragrance.sobConsulta ? (
              <span
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em' }}
                className="text-taupe uppercase"
              >
                Sob Consulta
              </span>
            ) : fragrance.preco ? (
              <span
                style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}
                className="text-noir"
              >
                R$ {fragrance.preco.toLocaleString('pt-BR')}
              </span>
            ) : null}
          </div>
          <span
            style={{ fontSize: '0.55rem', letterSpacing: '0.08em' }}
            className={`shrink-0 uppercase px-1.5 py-0.5 whitespace-nowrap ${
              fragrance.disponibilidade === 'pronta-entrega'
                ? 'text-[#6B8E5A] bg-[#6B8E5A]/10'
                : fragrance.disponibilidade === 'sob-encomenda'
                ? 'text-[#C98A3E] bg-[#C98A3E]/10'
                : 'text-taupe bg-sand/50'
            }`}
          >
            {fragrance.disponibilidade === 'pronta-entrega'
              ? 'P. Entrega'
              : fragrance.disponibilidade === 'sob-encomenda'
              ? 'Encomenda'
              : 'Indisp.'}
          </span>
        </div>
      </div>
    </article>
  );
}
