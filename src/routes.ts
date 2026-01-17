import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Dashboard from './routes/Dashboard';
import Event from './routes/Event';
import EventRegister from './routes/EventRegister';
import EventRegisterSuccess from './routes/EventRegisterSuccess';
import Guests from './routes/Guests';
import Home from './routes/Home';
import JoinEvent from './routes/JoinEvent';
import Login from './routes/Login';
import NewEvent from './routes/NewEvent';
import RegisterChoice from './routes/RegisterChoice';
import RegisterForm from './routes/RegisterForm';
import SocialCallback from './routes/SocialCallback';
import RootLayout2 from './layouts/RootLayout2';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout2,
    children: [
      { index: true, Component: Home },
      { path: 'login', Component: Login },
      { path: 'register', Component: RegisterChoice },
      { path: 'register/email', Component: RegisterForm },
    ],
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { path: 'new-event', Component: NewEvent },
      { path: 'auth/callback/:provider', Component: SocialCallback },
      { path: 'test-main', Component: Dashboard }, // 테스트용 메인 페이지 라우트
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
      { path: 'guests', Component: Guests },
    ],
  },
]);
