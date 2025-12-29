import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
    ],
  },
]);
