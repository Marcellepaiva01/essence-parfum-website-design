import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';

export function Root() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }} className="min-h-screen bg-cream">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
