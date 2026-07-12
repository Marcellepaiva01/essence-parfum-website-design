import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminFragranceFormPage } from './pages/AdminFragranceFormPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'colecao', Component: CatalogPage },
    ],
  },
  {
    path: '/admin',
    Component: AdminLoginPage,
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboardPage,
  },
  {
    path: '/admin/nova-fragancia',
    Component: AdminFragranceFormPage,
  },
  {
    path: '/admin/editar/:id',
    Component: AdminFragranceFormPage,
  },
]);
