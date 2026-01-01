import { Outlet } from 'react-router';
import Header from '../components/Header';

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className="flex w-full flex-1 flex-col items-center justify-center bg-gray-50 px-3 xs:px-0"
        style={{ padding: '2rem' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
