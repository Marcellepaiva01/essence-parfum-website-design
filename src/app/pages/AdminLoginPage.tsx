import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AdminLoginPage() {
  const { login, isAdminLoggedIn } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('teste@teste.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) navigate('/admin/dashboard');
  }, [isAdminLoggedIn, navigate]);

  if (isAdminLoggedIn) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ok = await login(email.trim(), password);
    setLoading(false);

    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('E-mail ou senha incorretos. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div
      style={{ fontFamily: 'var(--font-sans)' }}
      className="min-h-screen bg-cream-dark flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.2em', fontSize: '1.8rem' }}
            className="text-noir"
          >
            ESSENCE
          </div>
          <div
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.5em', fontSize: '0.6rem' }}
            className="text-gold uppercase mt-1"
          >
            PARFUM
          </div>
          <div
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
            className="uppercase text-taupe mt-6"
          >
            Área Restrita
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-cream border border-sand p-8 space-y-5">
          <div className="text-center mb-2">
            <div className="w-12 h-12 bg-cream-dark border border-sand flex items-center justify-center mx-auto mb-4">
              <Lock size={18} className="text-gold" />
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-noir text-xl"
            >
              Painel Administrativo
            </h2>
          </div>

          <div>
            <label
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
              className="block uppercase text-taupe mb-2"
            >
              E-mail
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 bg-cream-dark border border-sand text-noir placeholder-taupe/50 focus:outline-none focus:border-gold/50 transition-colors text-sm"
                style={{ fontFamily: 'var(--font-sans)' }}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
              className="block uppercase text-taupe mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 bg-cream-dark border border-sand text-noir placeholder-taupe/50 focus:outline-none focus:border-gold/50 transition-colors text-sm pr-12"
                style={{ fontFamily: 'var(--font-sans)' }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-noir transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#B4483A]/10 border border-[#B4483A]/30 text-[#B4483A]">
              <span style={{ fontSize: '0.8rem' }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 bg-gold text-ink uppercase tracking-widest text-sm hover:bg-gold-dark transition-colors disabled:opacity-50"
            style={{ letterSpacing: '0.2em' }}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
