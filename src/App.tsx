import './App.css';

import { GlobalErrorModal } from '@/components/GlobalErrorModal';
import { RouterProvider } from 'react-router/dom';
import { router } from './routes';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <GlobalErrorModal />
    </>
  );
}
