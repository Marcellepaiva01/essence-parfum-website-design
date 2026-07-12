import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { buildWhatsAppLink } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goHome = () => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  type NavItem =
    | { label: string; action: () => void }

  const navLinks: NavItem[] = [
    { label: 'Início', action: goHome },
    { label: 'Coleção', action: () => { setMenuOpen(false); navigate('/colecao'); } },
    { label: 'Quem Somos', action: () => scrollToSection('sobre') },
    { label: 'Perguntas Frequentes', action: () => scrollToSection('faq') },
  ];

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || menuOpen
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-sand'
            : isHome
            ? 'bg-transparent'
            : 'bg-cream/95 backdrop-blur-md border-b border-sand'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start group">
              <span
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
                className={`text-xl tracking-widest transition-colors ${
                  isScrolled || menuOpen || !isHome ? 'text-noir' : 'text-cream'
                }`}
              >
                ESSENCE
              </span>
              <span
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.4em', fontSize: '0.6rem' }}
                className={`uppercase transition-colors ${
                  isScrolled || menuOpen || !isHome ? 'text-gold' : 'text-gold'
                }`}
              >
                PARFUM
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-8">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={link.action}
                  style={{ letterSpacing: '0.1em', fontSize: '0.78rem' }}
                  className={`uppercase transition-colors hover:text-gold cursor-pointer bg-transparent border-0 p-0 ${
                    isScrolled || !isHome ? 'text-espresso' : 'text-cream/90'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <a
                href={buildWhatsAppLink('Olá! Gostaria de receber uma consultoria para encontrar uma fragrância ideal para mim.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-gold text-ink text-xs uppercase hover:bg-gold-dark transition-colors"
                style={{ letterSpacing: '0.1em' }}
              >
                <MessageCircle size={14} />
                <span className="hidden lg:inline">Falar com Especialista</span>
                <span className="lg:hidden">Especialista</span>
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`md:hidden p-2 transition-colors ${
                  isScrolled || menuOpen || !isHome ? 'text-noir' : 'text-cream'
                }`}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-cream border-t border-sand">
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={link.action}
                  style={{ letterSpacing: '0.12em', fontSize: '0.85rem' }}
                  className="uppercase text-espresso hover:text-gold transition-colors py-2 border-b border-sand/50 text-left bg-transparent border-x-0 border-t-0 w-full cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <a
                href={buildWhatsAppLink('Olá! Gostaria de receber uma consultoria para encontrar uma fragrância ideal para mim.')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 whitespace-nowrap w-full px-4 py-3 bg-gold text-ink text-xs uppercase"
                style={{ letterSpacing: '0.1em' }}
              >
                <MessageCircle size={14} />
                Falar com Especialista
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
