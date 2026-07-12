import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
