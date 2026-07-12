import { Link } from 'react-router';
import { Instagram, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { buildWhatsAppLink } = useApp();

  return (
    <footer className="bg-ink text-cream/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <div
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
                className="text-2xl text-cream"
              >
                ESSENCE
              </div>
              <div
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.4em', fontSize: '0.6rem' }}
                className="text-gold uppercase"
              >
                PARFUM
              </div>
            </div>
            <p className="text-sm text-cream/60 leading-relaxed mb-6">
              Uma curadoria exclusiva das melhores fragrâncias do mundo. Autenticidade, sofisticação e atendimento personalizado.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Instagram size={15} />
              </a>
              <a
                href={buildWhatsAppLink('Olá! Gostaria de saber mais sobre a Essence Parfum.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-cream text-xs uppercase tracking-widest mb-6"
              style={{ letterSpacing: '0.2em' }}
            >
              Navegação
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Início', to: '/' },
                { label: 'Coleção', to: '/colecao' },
                { label: 'Quem Somos', to: '/#sobre' },
                { label: 'Perguntas Frequentes', to: '/#faq' },
              ].map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-cream/60 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="text-cream text-xs uppercase tracking-widest mb-6"
              style={{ letterSpacing: '0.2em' }}
            >
              Categorias
            </h4>
            <ul className="space-y-3">
              {['Nicho', 'Árabes', 'Exclusivos', 'Edições Limitadas', 'Designers', 'Recém-chegados'].map(cat => (
                <li key={cat}>
                  <Link
                    to="/colecao"
                    className="text-sm text-cream/60 hover:text-gold transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-cream text-xs uppercase tracking-widest mb-6"
              style={{ letterSpacing: '0.2em' }}
            >
              Contato
            </h4>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              <li>
                <a
                  href={buildWhatsAppLink('Olá! Gostaria de falar com um especialista.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors group"
                >
                  <MessageCircle size={14} className="shrink-0 group-hover:text-gold" />
                  <span>(11) 99999-9999</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+551199999999"
                  className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
                >
                  <Phone size={14} className="shrink-0" />
                  <span>(11) 99999-9999</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@essenceparfum.com.br"
                  className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
                >
                  <Mail size={14} className="shrink-0" />
                  <span>contato@essenceparfum.com.br</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-cream/60">
                <MapPin size={14} className="shrink-0" />
                <span>Rua Oscar Freire, 123 — Jardins, São Paulo – SP</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-cream/60">
                <Clock size={14} className="shrink-0" />
                <span>Seg–Sex: 10h–19h · Sáb: 10h–17h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/30">
            © 2024 Essence Parfum. Todos os direitos reservados.
          </p>
          <p className="text-xs text-cream/30">
            Fragrâncias autênticas com certificado de autenticidade.
          </p>
        </div>
      </div>
    </footer>
  );
}
