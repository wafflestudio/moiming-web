import ProfileButton from '@/components/ProfileButton';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { Link } from 'react-router';

export default function Header() {
  const { user, isLoggedIn, handleLogout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex w-full justify-center border">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:w-screen-sm md:w-screen-md lg:w-screen-lg xl:max-w-screen-xl">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/moiming-symbol.svg" alt="logo" />
          <p className="moiming">모이밍</p>
        </Link>
        <div className="flex items-center gap-1.5">
          {!isLoggedIn || !user ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="px-2 py-2">
                  <span className="single-line-body-base">로그인</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="px-2 py-2">
                  <span className="single-line-body-base">회원가입</span>
                </Button>
              </Link>
            </>
          ) : (
            <ProfileButton user={user} handleLogout={handleLogout} />
          )}
        </div>
      </div>
    </header>
  );
}
