import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X, ChevronDown, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FragranceCard } from '../components/FragranceCard';
import { FragranceDrawer } from '../components/FragranceDrawer';
import type { Fragrance } from '../context/AppContext';

const CATEGORIES = [
  { value: 'todos', label: 'Todos' },
  { value: 'nicho', label: 'Nicho' },
  { value: 'arabes', label: 'Árabes' },
  { value: 'exclusivos', label: 'Exclusivos' },
  { value: 'edicoes-limitadas', label: 'Edições Limitadas' },
  { value: 'designer', label: 'Designers' },
  { value: 'recem-chegados', label: 'Recém-chegados' },
];

const FAMILIES = [
  'Todas', 'Floral', 'Oriental', 'Gourmand', 'Cítrica',
  'Amadeirada', 'Aromática', 'Especiada', 'Couro', 'Aquática', 'Frutada',
];

const CONCENTRATIONS = ['Todas', 'Eau de Cologne', 'Eau de Toilette', 'Eau de Parfum', 'Parfum', 'Extrait de Parfum'];

const GENDERS = [
  { value: 'todos', label: 'Todos' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'unissex', label: 'Unissex' },
];

const SORTS = [
  { value: 'default', label: 'Relevância' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'name_asc', label: 'Nome A-Z' },
  { value: 'recent', label: 'Recentes' },
];

interface Filters {
  search: string;
  category: string;
  family: string;
  concentration: string;
  gender: string;
  priceMin: string;
  priceMax: string;
  disponibilidade: string;
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: 'todos',
  family: 'Todas',
  concentration: 'Todas',
  gender: 'todos',
  priceMin: '',
  priceMax: '',
  disponibilidade: 'todos',
};

export function CatalogPage() {
  const { fragrances, buildWhatsAppLink } = useApp();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState('default');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const published = fragrances.filter(f => f.status === 'publicado');

  const filtered = useMemo(() => {
    let result = published;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(f =>
        f.brand.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.familiaOlfativa.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'todos') {
      result = result.filter(f => f.category === filters.category);
    }

    if (filters.family !== 'Todas') {
      result = result.filter(f => f.familiaOlfativa.toLowerCase() === filters.family.toLowerCase());
    }

    if (filters.concentration !== 'Todas') {
      result = result.filter(f => f.concentration === filters.concentration);
    }

    if (filters.gender !== 'todos') {
      result = result.filter(f => f.genero === filters.gender);
    }

    if (filters.priceMin) {
      result = result.filter(f => !f.sobConsulta && f.preco && f.preco >= Number(filters.priceMin));
    }

    if (filters.priceMax) {
      result = result.filter(f => !f.sobConsulta && f.preco && f.preco <= Number(filters.priceMax));
    }

    if (filters.disponibilidade !== 'todos') {
      result = result.filter(f => f.disponibilidade === filters.disponibilidade);
    }

    switch (sort) {
      case 'price_asc': result = [...result].sort((a, b) => (a.preco || 0) - (b.preco || 0)); break;
      case 'price_desc': result = [...result].sort((a, b) => (b.preco || 0) - (a.preco || 0)); break;
      case 'name_asc': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'recent': result = [...result].sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro)); break;
    }

    return result;
  }, [published, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => v !== (DEFAULT_FILTERS as Record<string, string>)[k]);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }} className="min-h-screen bg-cream pt-20">
      {/* Page Header */}
      <div className="bg-cream-dark border-b border-sand py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.3em', fontSize: '0.65rem' }}
            className="uppercase text-gold mb-2"
          >
            Essence Parfum
          </div>
          <h1
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            className="text-noir mb-2"
          >
            Nossa Coleção
          </h1>
          <p className="text-taupe text-sm">
            {filtered.length} fragrância{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {/* Search — full width on mobile */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
            <input
              type="text"
              placeholder="Buscar fragrância ou marca..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-cream border border-sand text-noir placeholder-taupe/60 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter toggle (mobile + tablet) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden inline-flex items-center gap-2 whitespace-nowrap px-4 py-2.5 border border-sand text-espresso text-sm hover:border-gold/40 transition-colors"
            >
              <SlidersHorizontal size={15} />
              <span>Filtros</span>
              {hasActiveFilters && <span className="w-2 h-2 bg-gold rounded-full shrink-0" />}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-cream border border-sand text-espresso text-sm focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {SORTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-taupe pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.search && (
              <FilterPill label={`"${filters.search}"`} onRemove={() => setFilter('search', '')} />
            )}
            {filters.category !== 'todos' && (
              <FilterPill label={CATEGORIES.find(c => c.value === filters.category)?.label || ''} onRemove={() => setFilter('category', 'todos')} />
            )}
            {filters.family !== 'Todas' && (
              <FilterPill label={filters.family} onRemove={() => setFilter('family', 'Todas')} />
            )}
            {filters.gender !== 'todos' && (
              <FilterPill label={GENDERS.find(g => g.value === filters.gender)?.label || ''} onRemove={() => setFilter('gender', 'todos')} />
            )}
            <button
              onClick={resetFilters}
              style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}
              className="text-taupe hover:text-gold transition-colors uppercase"
            >
              Limpar tudo
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`
            lg:block w-64 shrink-0 space-y-6
            ${sidebarOpen ? 'block fixed inset-0 z-40 bg-cream overflow-y-auto p-6' : 'hidden lg:block'}
          `}>
            {/* Mobile close */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <span
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em' }}
                className="uppercase text-espresso"
              >
                Filtros
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-taupe hover:text-noir">
                <X size={18} />
              </button>
            </div>

            <FilterGroup title="Categoria">
              {CATEGORIES.map(c => (
                <FilterCheckbox
                  key={c.value}
                  label={c.label}
                  checked={filters.category === c.value}
                  onChange={() => setFilter('category', c.value)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Família Olfativa">
              {FAMILIES.map(f => (
                <FilterCheckbox
                  key={f}
                  label={f}
                  checked={filters.family === f}
                  onChange={() => setFilter('family', f)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Gênero">
              {GENDERS.map(g => (
                <FilterCheckbox
                  key={g.value}
                  label={g.label}
                  checked={filters.gender === g.value}
                  onChange={() => setFilter('gender', g.value)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Concentração">
              {CONCENTRATIONS.map(c => (
                <FilterCheckbox
                  key={c}
                  label={c}
                  checked={filters.concentration === c}
                  onChange={() => setFilter('concentration', c)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Disponibilidade">
              {[
                { value: 'todos', label: 'Todas' },
                { value: 'pronta-entrega', label: 'Pronta Entrega' },
                { value: 'sob-encomenda', label: 'Sob Encomenda' },
              ].map(d => (
                <FilterCheckbox
                  key={d.value}
                  label={d.label}
                  checked={filters.disponibilidade === d.value}
                  onChange={() => setFilter('disponibilidade', d.value)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Faixa de Preço">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.priceMin}
                  onChange={e => setFilter('priceMin', e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-sand text-noir text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <span className="text-taupe text-sm shrink-0">—</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.priceMax}
                  onChange={e => setFilter('priceMax', e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-sand text-noir text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </FilterGroup>

            {hasActiveFilters && (
              <button
                onClick={() => { resetFilters(); setSidebarOpen(false); }}
                className="w-full py-2.5 border border-sand text-taupe text-sm uppercase tracking-widest hover:border-gold/40 hover:text-espresso transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                Limpar Filtros
              </button>
            )}
          </aside>

          {/* Backdrop for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-ink/40 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Grid */}
          <main className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <div className="text-center py-24">
                <div
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}
                  className="text-noir mb-3"
                >
                  Nenhuma fragrância encontrada
                </div>
                <p className="text-taupe mb-6 text-sm">Tente ajustar os filtros ou entre em contato conosco.</p>
                <a
                  href={buildWhatsAppLink('Olá! Não encontrei a fragrância que procuro. Poderia me ajudar?')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-ink uppercase text-sm tracking-widest hover:bg-gold-dark transition-colors"
                >
                  <MessageCircle size={15} />
                  Falar no WhatsApp
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                  {paginated.map(f => (
                    <FragranceCard
                      key={f.id}
                      fragrance={f}
                      onClick={() => setSelectedFragrance(f)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 border border-sand text-espresso text-sm hover:border-gold/40 disabled:opacity-30 transition-colors"
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                        className={`w-9 h-9 border text-sm transition-colors ${
                          p === page
                            ? 'bg-gold border-gold text-ink'
                            : 'border-sand text-espresso hover:border-gold/40'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 border border-sand text-espresso text-sm hover:border-gold/40 disabled:opacity-30 transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* CTA banner */}
        <div className="mt-12 sm:mt-16 bg-ink p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}
              className="text-cream mb-1.5"
            >
              Não encontrou o que procura?
            </div>
            <p style={{ fontSize: '0.875rem' }} className="text-cream/60">
              Importamos qualquer fragrância do mundo sob encomenda.
            </p>
          </div>
          <a
            href={buildWhatsAppLink('Olá! Gostaria de saber como funciona o serviço de importação sob encomenda.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto px-6 py-4 bg-gold text-ink uppercase text-xs sm:text-sm hover:bg-gold-dark transition-colors"
            style={{ letterSpacing: '0.12em' }}
          >
            <MessageCircle size={15} />
            Importar Sob Encomenda
          </a>
        </div>
      </div>

      {/* Drawer */}
      {selectedFragrance && (
        <FragranceDrawer
          fragrance={selectedFragrance}
          onClose={() => setSelectedFragrance(null)}
        />
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-sand pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
          className="uppercase text-espresso group-hover:text-gold transition-colors"
        >
          {title}
        </span>
        <ChevronDown
          size={13}
          className={`text-taupe transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
          checked ? 'bg-gold border-gold' : 'border-sand group-hover:border-gold/40'
        }`}
      >
        {checked && <span className="text-ink text-xs">✓</span>}
      </div>
      <span
        style={{ fontSize: '0.82rem' }}
        className={`transition-colors ${checked ? 'text-noir' : 'text-taupe group-hover:text-espresso'}`}
      >
        {label}
      </span>
    </label>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-cream-dark border border-sand text-espresso">
      <span style={{ fontSize: '0.75rem' }}>{label}</span>
      <button onClick={onRemove} className="text-taupe hover:text-noir transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}
