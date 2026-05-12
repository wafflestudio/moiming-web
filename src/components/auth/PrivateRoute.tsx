import useAuthStore from '@/hooks/useAuthStore';
import { Navigate, Outlet } from 'react-router';

export default function PrivateRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
