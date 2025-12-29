import { Outlet } from 'react-router';
import Header from '../components/Header';

export default function RootLayout() {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
