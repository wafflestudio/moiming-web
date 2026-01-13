import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Event from './routes/Event';
import Home from './routes/Home';
import Login from './routes/Login';
import RegisterChoice from './routes/RegisterChoice';
import RegisterForm from './routes/RegisterForm';
import SocialCallback from './routes/SocialCallback';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'login', Component: Login },
      { path: 'register', Component: RegisterChoice },
      { path: 'register/email', Component: RegisterForm },
      { path: 'auth/callback/:provider', Component: SocialCallback },
    ],
  },
  {
    path: '/event/:id',
    Component: RootLayout,
    children: [{ index: true, Component: Event }],
  },
]);
