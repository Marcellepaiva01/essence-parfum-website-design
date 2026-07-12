import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { ArrowLeft, Plus, X, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Fragrance } from '../context/AppContext';

type Toast = { message: string; type: 'success' | 'error' };

type FormData = Omit<Fragrance, 'id' | 'dataCadastro'>;

const EMPTY: FormData = {
  brand: '',
  name: '',
  line: '',
  concentration: 'Eau de Parfum',
  volume: '100ml',
  year: undefined,
  country: '',
  manufacturer: '',
  distributor: '',
  importacaoOficial: false,
  category: 'nicho',
  familiaOlfativa: 'amadeirada',
  genero: 'unissex',
  fixacao: '',
  projecao: 'media',
  preco: undefined,
  sobConsulta: false,
  disponibilidade: 'pronta-entrega',
  estoque: undefined,
  notasSaida: [],
  notasCoracao: [],
  notasFundo: [],
  destaques: [],
  historia: '',
  selos: [],
  status: 'rascunho',
  imagem: '',
};

const SELOS_OPTIONS = [
  { value: 'exclusivo', label: 'Exclusivo' },
  { value: 'novo', label: 'Novo' },
  { value: 'edicao-limitada', label: 'Edição Limitada' },
  { value: 'ultimas-unidades', label: 'Últimas Unidades' },
  { value: 'importacao-oficial', label: 'Importação Oficial' },
];

const CONCENTRATIONS = ['Eau de Cologne', 'Eau de Toilette', 'Eau de Parfum', 'Parfum', 'Extrait de Parfum'];
const VOLUMES = ['30ml', '50ml', '75ml', '100ml', '125ml', '200ml'];
const CATEGORIES = [
  { value: 'nicho', label: 'Nicho' },
  { value: 'designer', label: 'Designer' },
  { value: 'arabes', label: 'Árabes' },
  { value: 'exclusivos', label: 'Exclusivos' },
  { value: 'edicoes-limitadas', label: 'Edições Limitadas' },
  { value: 'classicos', label: 'Clássicos' },
  { value: 'recem-chegados', label: 'Recém-chegados' },
];
const FAMILIES = [
  'floral', 'oriental', 'gourmand', 'citrica', 'amadeirada',
  'aromatica', 'especiada', 'couro', 'aquatica', 'frutada', 'fougere',
];
const PROJECOES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
];
const DISPONIBILIDADES = [
  { value: 'pronta-entrega', label: 'Pronta Entrega' },
  { value: 'sob-encomenda', label: 'Sob Encomenda' },
  { value: 'indisponivel', label: 'Indisponível' },
];

const DESTAQUE_SUGGESTIONS = [
  'Produção Artesanal', 'Ingredientes Naturais', 'Rosa Búlgara',
  'Oud Natural', 'Alta Concentração', 'Lote Exclusivo',
  'Frasco Colecionável', 'Importação Oficial', 'Certificado de Autenticidade',
  'Edição Limitada', 'Íris Francesa',
];

export function AdminFragranceFormPage() {
  const { isAdminLoggedIn, addFragrance, updateFragrance, getFragranceById, logout } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [newNota, setNewNota] = useState({ saida: '', coracao: '', fundo: '' });
  const [newDestaque, setNewDestaque] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }
    if (isEditing && id) {
      const existing = getFragranceById(id);
      if (existing) {
        const { id: _id, dataCadastro: _dc, ...rest } = existing;
        setForm(rest);
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [id, isAdminLoggedIn]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const addNota = (field: 'notasSaida' | 'notasCoracao' | 'notasFundo', key: 'saida' | 'coracao' | 'fundo') => {
    const val = newNota[key].trim();
    if (!val) return;
    set(field, [...form[field], val]);
    setNewNota(prev => ({ ...prev, [key]: '' }));
  };

  const removeNota = (field: 'notasSaida' | 'notasCoracao' | 'notasFundo', idx: number) => {
    set(field, form[field].filter((_, i) => i !== idx));
  };

  const addDestaque = (val?: string) => {
    const d = (val || newDestaque).trim();
    if (!d || form.destaques.includes(d)) return;
    set('destaques', [...form.destaques, d]);
    if (!val) setNewDestaque('');
  };

  const toggleSelo = (s: string) => {
    set('selos', form.selos.includes(s) ? form.selos.filter(x => x !== s) : [...form.selos, s]);
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.brand.trim()) e.brand = 'Informe a marca.';
    if (!form.name.trim()) e.name = 'Informe o nome da fragrância.';
    if (!form.category) e.category = 'Selecione uma categoria.';
    if (!form.sobConsulta && !form.preco) e.preco = 'Informe o preço ou marque "Sob consulta".';
    if (!form.imagem.trim()) e.imagem = 'Informe a URL da imagem principal.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Verifique os campos obrigatórios.', 'error');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      if (isEditing && id) {
        updateFragrance(id, form);
        showToast('Alterações salvas com sucesso.');
      } else {
        addFragrance(form);
        showToast('Fragrância cadastrada com sucesso.');
      }
      setSaving(false);
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    }, 600);
  };

  const inputClass = (field?: keyof FormData) =>
    `w-full px-4 py-2.5 bg-cream border text-noir text-sm focus:outline-none transition-colors ${
      field && errors[field] ? 'border-[#B4483A]/60 focus:border-[#B4483A]' : 'border-sand focus:border-gold/50'
    }`;

  const labelClass = 'block text-xs uppercase tracking-widest text-taupe mb-1.5';

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

      {/* Admin Header */}
      <header className="bg-ink border-b border-cream/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              <span style={{ letterSpacing: '0.1em' }} className="uppercase text-xs">Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-cream/20" />
            <span
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
              className="uppercase text-cream/40"
            >
              {isEditing ? 'Editar Fragrância' : 'Nova Fragrância'}
            </span>
          </div>
          <button
            onClick={async () => { await logout(); navigate('/admin'); }}
            className="flex items-center gap-2 text-cream/40 hover:text-cream/70 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Section: Identificação */}
        <FormSection title="01. Identificação">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Marca *
              </label>
              <input
                value={form.brand}
                onChange={e => set('brand', e.target.value)}
                placeholder="Ex: Creed"
                className={inputClass('brand')}
              />
              {errors.brand && <p className="text-[#B4483A] text-xs mt-1">{errors.brand}</p>}
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Nome da Fragrância *
              </label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Ex: Aventus"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-[#B4483A] text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Linha / Coleção
              </label>
              <input
                value={form.line || ''}
                onChange={e => set('line', e.target.value)}
                placeholder="Ex: Millésime"
                className={inputClass()}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Ano de Lançamento
              </label>
              <input
                type="number"
                value={form.year || ''}
                onChange={e => set('year', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 2010"
                className={inputClass()}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>
        </FormSection>

        {/* Section: Origem */}
        <FormSection title="02. Origem">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                País de Origem
              </label>
              <input
                value={form.country || ''}
                onChange={e => set('country', e.target.value)}
                placeholder="Ex: França"
                className={inputClass()}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Fabricante
              </label>
              <input
                value={form.manufacturer || ''}
                onChange={e => set('manufacturer', e.target.value)}
                placeholder="Ex: House of Creed"
                className={inputClass()}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Distribuidor
              </label>
              <input
                value={form.distributor || ''}
                onChange={e => set('distributor', e.target.value)}
                placeholder="Ex: Distribuição Seletiva"
                className={inputClass()}
              />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <ToggleSwitch
                checked={form.importacaoOficial}
                onChange={v => set('importacaoOficial', v)}
              />
              <span className="text-sm text-espresso">Importação Oficial</span>
            </div>
          </div>
        </FormSection>

        {/* Section: Classificação */}
        <FormSection title="03. Classificação">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Categoria *
              </label>
              <SelectField
                value={form.category}
                onChange={v => set('category', v as FormData['category'])}
                options={CATEGORIES}
                error={errors.category}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Família Olfativa
              </label>
              <SelectField
                value={form.familiaOlfativa}
                onChange={v => set('familiaOlfativa', v)}
                options={FAMILIES.map(f => ({ value: f, label: f.charAt(0).toUpperCase() + f.slice(1) }))}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Gênero
              </label>
              <SelectField
                value={form.genero}
                onChange={v => set('genero', v as FormData['genero'])}
                options={[
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'feminino', label: 'Feminino' },
                  { value: 'unissex', label: 'Unissex' },
                ]}
              />
            </div>
          </div>
        </FormSection>

        {/* Section: Características */}
        <FormSection title="04. Características">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Concentração
              </label>
              <SelectField
                value={form.concentration}
                onChange={v => set('concentration', v)}
                options={CONCENTRATIONS.map(c => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Volume
              </label>
              <SelectField
                value={form.volume}
                onChange={v => set('volume', v)}
                options={VOLUMES.map(v => ({ value: v, label: v }))}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Fixação
              </label>
              <input
                value={form.fixacao || ''}
                onChange={e => set('fixacao', e.target.value)}
                placeholder="Ex: 12-16 horas"
                className={inputClass()}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Projeção
              </label>
              <SelectField
                value={form.projecao || 'media'}
                onChange={v => set('projecao', v as FormData['projecao'])}
                options={PROJECOES}
              />
            </div>
          </div>
        </FormSection>

        {/* Section: Comercial */}
        <FormSection title="05. Comercial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Preço (R$) {!form.sobConsulta && '*'}
              </label>
              <input
                type="number"
                value={form.preco || ''}
                onChange={e => set('preco', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 2890"
                disabled={form.sobConsulta}
                className={`${inputClass('preco')} disabled:opacity-40 disabled:cursor-not-allowed`}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              {errors.preco && <p className="text-[#B4483A] text-xs mt-1">{errors.preco}</p>}
            </div>
            <div className="flex items-end pb-0.5 gap-3">
              <ToggleSwitch
                checked={form.sobConsulta}
                onChange={v => { set('sobConsulta', v); if (v) set('preco', undefined); }}
              />
              <span className="text-sm text-espresso">Sob Consulta</span>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Disponibilidade
              </label>
              <SelectField
                value={form.disponibilidade}
                onChange={v => set('disponibilidade', v as FormData['disponibilidade'])}
                options={DISPONIBILIDADES}
              />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                Estoque (unidades)
              </label>
              <input
                type="number"
                value={form.estoque ?? ''}
                onChange={e => set('estoque', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 5"
                className={inputClass()}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>
        </FormSection>

        {/* Section: Pirâmide Olfativa */}
        <FormSection title="06. Pirâmide Olfativa">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(
              [
                { label: 'Notas de Saída', field: 'notasSaida' as const, key: 'saida' as const },
                { label: 'Notas de Coração', field: 'notasCoracao' as const, key: 'coracao' as const },
                { label: 'Notas de Fundo', field: 'notasFundo' as const, key: 'fundo' as const },
              ]
            ).map(({ label, field, key }) => (
              <div key={field}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={labelClass}>
                  {label}
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newNota[key]}
                    onChange={e => setNewNota(prev => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNota(field, key))}
                    placeholder="Adicionar nota..."
                    className={`${inputClass()} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => addNota(field, key)}
                    className="px-3 py-2.5 bg-gold text-ink hover:bg-gold-dark transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form[field].map((nota, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-cream border border-sand text-espresso text-sm"
                    >
                      {nota}
                      <button type="button" onClick={() => removeNota(field, i)} className="text-taupe hover:text-noir">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Section: Destaques */}
        <FormSection title="07. Destaques da Fragrância">
          <div className="flex gap-2 mb-4">
            <input
              value={newDestaque}
              onChange={e => setNewDestaque(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDestaque())}
              placeholder="Adicionar destaque..."
              className={`${inputClass()} flex-1`}
            />
            <button
              type="button"
              onClick={() => addDestaque()}
              className="px-4 py-2.5 bg-gold text-ink hover:bg-gold-dark transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {form.destaques.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-sand text-espresso text-sm">
                {d}
                <button type="button" onClick={() => set('destaques', form.destaques.filter((_, j) => j !== i))}>
                  <X size={11} className="text-taupe hover:text-noir" />
                </button>
              </span>
            ))}
          </div>
          <div className="border-t border-sand pt-3">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em' }} className="uppercase text-taupe mb-2">
              Sugestões
            </p>
            <div className="flex flex-wrap gap-2">
              {DESTAQUE_SUGGESTIONS.filter(s => !form.destaques.includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addDestaque(s)}
                  style={{ fontSize: '0.75rem' }}
                  className="px-3 py-1.5 border border-sand/60 text-taupe hover:border-gold/40 hover:text-gold transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Section: História */}
        <FormSection title="08. História da Fragrância">
          <textarea
            value={form.historia || ''}
            onChange={e => set('historia', e.target.value)}
            placeholder="Descreva a inspiração, origem e personalidade desta fragrância..."
            rows={5}
            className="w-full px-4 py-3 bg-cream border border-sand text-noir text-sm focus:outline-none focus:border-gold/50 transition-colors resize-none leading-relaxed"
            style={{ fontFamily: 'var(--font-sans)' }}
          />
        </FormSection>

        {/* Section: Selos */}
        <FormSection title="09. Selos de Destaque">
          <div className="flex flex-wrap gap-3">
            {SELOS_OPTIONS.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSelo(s.value)}
                style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}
                className={`px-4 py-2 uppercase border transition-colors ${
                  form.selos.includes(s.value)
                    ? 'bg-gold border-gold text-ink'
                    : 'border-sand text-taupe hover:border-gold/40 bg-cream'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Section: Mídia */}
        <FormSection title="10. Mídia">
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em' }} className={`${labelClass} mb-2`}>
              URL da Imagem Principal *
            </label>
            <input
              value={form.imagem}
              onChange={e => set('imagem', e.target.value)}
              placeholder="https://..."
              className={inputClass('imagem')}
            />
            {errors.imagem && <p className="text-[#B4483A] text-xs mt-1">{errors.imagem}</p>}
            {form.imagem && (
              <div className="mt-3 w-24 h-28 border border-sand overflow-hidden bg-cream-dark">
                <img src={form.imagem} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>
        </FormSection>

        {/* Section: Status e Publicação */}
        <FormSection title="11. Status e Publicação">
          <div className="flex flex-wrap gap-3">
            {(
              [
                { value: 'rascunho', label: 'Rascunho' },
                { value: 'publicado', label: 'Publicado' },
                { value: 'pausado', label: 'Pausado' },
              ] as const
            ).map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('status', s.value)}
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
                className={`px-5 py-2.5 uppercase border transition-colors ${
                  form.status === s.value
                    ? 'bg-noir border-noir text-cream'
                    : 'border-sand text-taupe hover:border-espresso/30 bg-cream'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-sand">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none sm:min-w-48 py-4 bg-gold text-ink uppercase tracking-widest text-sm hover:bg-gold-dark transition-colors disabled:opacity-50"
            style={{ letterSpacing: '0.18em' }}
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Fragrância'}
          </button>
          <Link
            to="/admin/dashboard"
            className="py-4 px-8 border border-sand text-espresso uppercase text-sm hover:border-gold/40 transition-colors text-center"
            style={{ letterSpacing: '0.12em' }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cream border border-sand p-6 lg:p-8">
      <h3
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.25em' }}
        className="uppercase text-gold mb-6 pb-3 border-b border-sand"
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function SelectField({
  value, onChange, options, error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[];
  error?: string;
}) {
  const normalized = (options as (string | { value: string; label: string })[]).map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  );
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 bg-cream border text-noir text-sm focus:outline-none transition-colors cursor-pointer appearance-none ${
        error ? 'border-[#B4483A]/60 focus:border-[#B4483A]' : 'border-sand focus:border-gold/50'
      }`}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {normalized.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 transition-colors shrink-0 ${checked ? 'bg-gold' : 'bg-sand-dark'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-cream transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
