import './App.css';

import { GlobalErrorModal } from '@/components/GlobalErrorModal';
import { RouterProvider } from 'react-router/dom';
import { useAutoLogout } from './hooks/useAutoLogout';
import { router } from './routes';

export default function App() {
  useAutoLogout();

  return (
    <>
      <RouterProvider router={router} />
      <GlobalErrorModal />
    </>
  );
}
