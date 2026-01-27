import ProfileButton from '@/components/ProfileButton';
import useAuth from '@/hooks/useAuth';
import { Link, NavLink } from 'react-router';

export default function Header() {
  const { user, isLoggedIn, handleLogout } = useAuth();

  const linkClassName = (isActive: boolean) => `
    h-[42px] items-center px-4 py-2 rounded-md text-black font-semibold
    ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200 transition-all'}
  `;

  return (
    <header className="sticky top-0 z-40 flex w-full justify-center bg-gray-50 border">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:w-screen-sm md:w-screen-md lg:w-screen-lg xl:max-w-screen-xl">
        <Link to="/" className="text-xl font-bold font-title">
          모이샤
        </Link>
        <div className="items-center space-x-2">
          {!isLoggedIn || !user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => linkClassName(isActive)}
              >
                로그인
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => linkClassName(isActive)}
              >
                회원가입
              </NavLink>
            </>
          ) : (
            <ProfileButton user={user} handleLogout={handleLogout} />
          )}
        </div>
      </div>
    </header>
  );
}
