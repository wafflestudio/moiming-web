import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import SocialCallback from './routes/SocialCallback';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'auth/callback/:provider', Component: SocialCallback },
    ],
  },
]);
