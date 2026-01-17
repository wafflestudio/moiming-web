import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import Header2 from '@/components/Header2';

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header2 />
      <main
        className="flex w-full flex-1 flex-col bg-white px-3 xs:px-0"
        style={{ padding: '2rem' }}
      >
        <Outlet />
      </main>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
