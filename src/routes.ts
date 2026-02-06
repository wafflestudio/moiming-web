import LoginLayout from '@/layouts/LoginLayout';
import NavigationLayout from '@/layouts/NavigationLayout';
import RootLayout from '@/layouts/RootLayout';

import EventMain from '@/routes/EventMain';
import EventRegister from '@/routes/EventRegister';
import Guests from '@/routes/Guests';
import Home from '@/routes/Home';
import Login from '@/routes/Login';
import LoginEmail from '@/routes/LoginEmail';
import NewEvent from '@/routes/NewEvent';
import ProfileEdit from '@/routes/ProfileEdit';
import SignUp from '@/routes/SignUp';
import SocialCallback from '@/routes/SocialCallback';
import VerifyEmail from '@/routes/VerifyEmail';

import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        path: 'login',
        Component: LoginLayout,
        children: [
          { index: true, Component: Login },
          { path: 'email', Component: LoginEmail },
        ],
        handle: { title: '로그인 - 모이밍' },
      },
      {
        path: 'sign-up',
        children: [{ path: 'email', Component: SignUp }],
        handle: { title: '회원가입 - 모이밍' },
      },
      {
        path: 'auth/verify',
        Component: VerifyEmail,
        handle: { title: '이메일 인증 - 모이밍' },
      },
      {
        path: 'auth/callback/:provider',
        Component: SocialCallback,
        handle: { title: '소셜 로그인 - 모이밍' },
      },
      {
        path: 'profile',
        Component: ProfileEdit,
        handle: { title: '프로필 수정 - 모이밍' },
      },
    ],
  },
  {
    path: '/new-event',
    Component: NavigationLayout,
    children: [{ index: true, Component: NewEvent }],
    handle: { title: '일정 만들기 - 모이밍' },
  },
  {
    path: '/event/:id',
    Component: RootLayout,
    children: [
      { index: true, Component: EventMain },
      { path: 'guests', Component: Guests },
      { path: 'register', Component: EventRegister },
    ],
    handle: { title: '일정 상세 - 모이밍' },
  },
]);
