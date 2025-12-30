import './App.css';

import { useState } from 'react';
import { RouterProvider } from 'react-router/dom';
import { TokenContext } from './contexts/TokenContext';
import { router } from './routes';

export default function App() {
  const [token, _] = useState<string | null>(null);

  return (
    <TokenContext value={{ token }}>
      <RouterProvider router={router} />
    </TokenContext>
  );
}
