import Header from '@/components/Header';
import { useEffect } from 'react';
import { Outlet, useMatches } from 'react-router';
import { Toaster } from 'sonner';

export default function RootLayout() {
  const matches = useMatches();

  // Update document title based on current route
  useEffect(() => {
    const lastMatch = matches[matches.length - 1];
    const title = (lastMatch?.handle as { title?: string })?.title;
    if (title) {
      document.title = title;
    } else {
      document.title = '모이밍';
    }
  }, [matches]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
