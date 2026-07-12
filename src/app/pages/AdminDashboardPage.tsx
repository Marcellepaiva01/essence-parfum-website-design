import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff, LogOut,
  CheckCircle, AlertCircle, Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type ToastType = { message: string; type: 'success' | 'error' };

export function AdminDashboardPage() {
  const { fragrances, isAdminLoggedIn, logout, deleteFragrance, publishFragrance, pauseFragrance } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'publicado' | 'rascunho' | 'pausado'>('todos');
  const [toast, setToast] = useState<ToastType | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) navigate('/admin');
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleDelete = (id: string) => {
    deleteFragrance(id);
    setConfirmDelete(null);
    showToast('Fragrância excluída com sucesso.');
  };

  const handlePublish = (id: string) => {
    publishFragrance(id);
    showToast('Fragrância publicada.');
  };

  const handlePause = (id: string) => {
    pauseFragrance(id);
    showToast('Fragrância pausada.');
  };

  const filtered = useMemo(() => {
    let result = fragrances;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        f.brand.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'todos') {
      result = result.filter(f => f.status === statusFilter);
    }
    return result;
  }, [fragrances, search, statusFilter]);

  const stats = {
    total: fragrances.length,
    publicado: fragrances.filter(f => f.status === 'publicado').length,
    rascunho: fragrances.filter(f => f.status === 'rascunho').length,
    pausado: fragrances.filter(f => f.status === 'pausado').length,
  };

  const STATUS_CONFIG = {
    publicado: { label: 'Publicado', color: 'bg-[#6B8E5A]/15 text-[#6B8E5A] border border-[#6B8E5A]/30' },
    rascunho: { label: 'Rascunho', color: 'bg-[#C98A3E]/15 text-[#C98A3E] border border-[#C98A3E]/30' },
    pausado: { label: 'Pausado', color: 'bg-sand text-taupe border border-sand-dark' },
  };

  const SELO_LABELS: Record<string, string> = {
    'exclusivo': 'Exclusivo',
    'novo': 'Novo',
    'edicao-limitada': 'Ed. Limitada',
    'ultimas-unidades': 'Últimas Unid.',
    'importacao-oficial': 'Import. Oficial',
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }} className="min-h-screen bg-cream-dark">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 shadow-lg border ${
          toast.type === 'success'
            ? 'bg-cream border-[#6B8E5A]/30 text-[#6B8E5A]'
            : 'bg-cream border-[#B4483A]/30 text-[#B4483A]'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span style={{ fontSize: '0.875rem' }}>{toast.message}</span>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
          <div className="bg-cream border border-sand p-8 max-w-sm w-full">
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-noir text-xl mb-3">
              Confirmar Exclusão
            </h3>
            <p style={{ fontSize: '0.875rem' }} className="text-taupe mb-6">
              Esta ação é irreversível. A fragrância será removida permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 bg-[#B4483A] text-cream text-sm uppercase tracking-widest hover:bg-[#9a3d32] transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                Excluir
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-sand text-espresso text-sm uppercase tracking-widest hover:border-gold/40 transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-ink border-b border-cream/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
                className="text-cream"
              >
                ESSENCE
              </div>
              <div
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.4em', fontSize: '0.5rem' }}
                className="text-gold uppercase"
              >
                PARFUM · ADMIN
              </div>
            </div>
            <div className="h-6 w-px bg-cream/10" />
            <span
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em' }}
              className="uppercase text-cream/40"
            >
              Painel de Gerenciamento
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              className="text-cream/50 hover:text-cream transition-colors uppercase"
            >
              Ver Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-cream/20 text-cream/60 text-sm hover:border-cream/40 hover:text-cream transition-colors"
            >
              <LogOut size={14} />
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }} className="uppercase">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: <Package size={18} /> },
            { label: 'Publicadas', value: stats.publicado, color: '#6B8E5A' },
            { label: 'Rascunho', value: stats.rascunho, color: '#C98A3E' },
            { label: 'Pausadas', value: stats.pausado, color: '#A8946F' },
          ].map(s => (
            <div key={s.label} className="bg-cream border border-sand p-5">
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', lineHeight: '1' }}
                className="text-noir mb-1"
              >
                {s.value}
              </div>
              <div
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em' }}
                className="uppercase text-taupe"
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
              <input
                type="text"
                placeholder="Buscar por marca, nome..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-cream border border-sand text-noir placeholder-taupe/60 text-sm focus:outline-none focus:border-gold/50 transition-colors w-64"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>

            {/* Status filter */}
            {(['todos', 'publicado', 'rascunho', 'pausado'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                className={`px-3 py-2 uppercase border transition-colors ${
                  statusFilter === s
                    ? 'bg-gold border-gold text-ink'
                    : 'border-sand text-taupe hover:border-gold/40 bg-cream'
                }`}
              >
                {s === 'todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <Link
            to="/admin/nova-fragancia"
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-ink uppercase text-sm hover:bg-gold-dark transition-colors whitespace-nowrap"
            style={{ letterSpacing: '0.15em' }}
          >
            <Plus size={16} />
            Nova Fragrância
          </Link>
        </div>

        {/* Table */}
        <div className="bg-cream border border-sand overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream-dark border-b border-sand">
                  {['Foto', 'Marca / Nome', 'Categoria', 'Preço', 'Status', 'Selos', 'Ações'].map(col => (
                    <th
                      key={col}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em' }}
                      className="px-4 py-3 text-left uppercase text-taupe font-normal"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-taupe text-sm">
                      Nenhuma fragrância encontrada.
                    </td>
                  </tr>
                ) : (
                  filtered.map((f, i) => (
                    <tr
                      key={f.id}
                      className={`border-b border-sand/50 hover:bg-cream-dark/40 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-cream-dark/20'
                      }`}
                    >
                      {/* Foto */}
                      <td className="px-4 py-3">
                        <div className="w-12 h-14 bg-cream-dark overflow-hidden border border-sand shrink-0">
                          <img
                            src={f.imagem}
                            alt={f.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </td>

                      {/* Marca/Nome */}
                      <td className="px-4 py-3">
                        <div
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em' }}
                          className="uppercase text-taupe"
                        >
                          {f.brand}
                        </div>
                        <div
                          style={{ fontFamily: 'var(--font-display)' }}
                          className="text-noir"
                        >
                          {f.name}
                        </div>
                        <div
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em' }}
                          className="text-taupe/70 mt-0.5"
                        >
                          {f.concentration} · {f.volume}
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="px-4 py-3">
                        <span
                          style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}
                          className="text-espresso capitalize"
                        >
                          {f.category.replace('-', ' ')}
                        </span>
                      </td>

                      {/* Preço */}
                      <td className="px-4 py-3">
                        {f.sobConsulta ? (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }} className="text-taupe">
                            Sob Consulta
                          </span>
                        ) : f.preco ? (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} className="text-noir">
                            R$ {f.preco.toLocaleString('pt-BR')}
                          </span>
                        ) : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
                          className={`px-2 py-1 uppercase ${STATUS_CONFIG[f.status].color}`}
                        >
                          {STATUS_CONFIG[f.status].label}
                        </span>
                      </td>

                      {/* Selos */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {f.selos.slice(0, 2).map(s => (
                            <span
                              key={s}
                              style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
                              className="px-1.5 py-0.5 bg-cream-dark border border-sand text-taupe uppercase"
                            >
                              {SELO_LABELS[s] || s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/admin/editar/${f.id}`}
                            className="p-2 text-taupe hover:text-gold transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </Link>
                          {f.status === 'publicado' ? (
                            <button
                              onClick={() => handlePause(f.id)}
                              className="p-2 text-taupe hover:text-[#C98A3E] transition-colors"
                              title="Pausar"
                            >
                              <EyeOff size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublish(f.id)}
                              className="p-2 text-taupe hover:text-[#6B8E5A] transition-colors"
                              title="Publicar"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete(f.id)}
                            className="p-2 text-taupe hover:text-[#B4483A] transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 py-3 bg-cream-dark border-t border-sand">
            <span
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em' }}
              className="uppercase text-taupe"
            >
              {filtered.length} fragrância{filtered.length !== 1 ? 's' : ''}
              {filtered.length !== fragrances.length && ` de ${fragrances.length} total`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
