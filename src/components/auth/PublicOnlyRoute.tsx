import useAuthStore from '@/hooks/useAuthStore';
import { Navigate, Outlet } from 'react-router';

export default function PublicOnlyRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
