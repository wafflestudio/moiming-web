import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import EventPage from './routes/EventPage';
import EventRegister from './routes/EventRegister';
import Guests from './routes/Guests';
import Home from './routes/Home';
import Login from './routes/Login';
import NewEvent from './routes/NewEvent';
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
      { path: 'new-event', Component: NewEvent },
      { path: 'auth/callback/:provider', Component: SocialCallback },
    ],
  },
  {
    path: '/event/:id',
    Component: RootLayout,
    children: [
      { index: true, Component: EventPage },
      { path: 'guests', Component: Guests },
      { path: 'register', Component: EventRegister },
    ],
  },
]);
