import ProfileButton from '@/components/ProfileButton';
import useAuth from '@/hooks/useAuth';
import { Link, NavLink } from 'react-router';

const userExample = {
  id: 1,
  email: 'user@example.com',
  name: '박준영',
  profileImage: 'https://github.com/shadcn.png',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

export default function Header() {
  const { isLoggedIn, handleLogout } = useAuth();

  const linkClassName = (isActive: boolean) => `
    font-bold h-[42px] items-center px-4 py-2 rounded-md
    ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200 transition-all text-gray-500'}
  `;

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center bg-grey-50 shadow-md">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:w-screen-sm md:w-screen-md lg:w-screen-lg xl:max-w-screen-xl">
        <Link to="/" className="text-xl font-bold font-title">
          모이샤
        </Link>
        <div className="items-center space-x-2">
          {!isLoggedIn ? (
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
            <ProfileButton user={userExample} handleLogout={handleLogout} />
          )}
        </div>
      </div>
    </header>
  );
}
