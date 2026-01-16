import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Event from './routes/Event';
import EventRegister from './routes/EventRegister';
import EventRegisterSuccess from './routes/EventRegisterSuccess';
import Guests from './routes/Guests';
import Home from './routes/Home';
import JoinEvent from './routes/JoinEvent';
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
    children: [
      { index: true, Component: Event },
      { path: 'guests', Component: Guests },
    ],
  },
  {
    path: '/join/:id',
    Component: RootLayout,
    children: [
      { index: true, Component: JoinEvent },
      { path: 'register', Component: EventRegister },
      { path: 'success', Component: EventRegisterSuccess },
    ],
  },
]);
