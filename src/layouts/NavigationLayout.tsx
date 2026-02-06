import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';
import { Toaster } from 'sonner';

export default function RootLayout() {
  const navigate = useNavigate();
  const onPrevClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex w-full flex-1 flex-col bg-white">
        <nav className="flex pl-2 pr-6 py-4 gap-2 items-center">
          <Button
            onClick={onPrevClick}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <h2>일정 만들기</h2>
        </nav>
        <Outlet />
      </main>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
