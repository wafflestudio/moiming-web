import ProfileButton from '@/components/ProfileButton';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Link } from 'react-router';

export default function Header() {
  const { user, isLoggedIn, handleLogout, refreshUser } = useAuth();

  useEffect(() => {
    // 1. 로그인 상태가 아니면 타이머를 돌릴 필요가 없음
    if (!isLoggedIn) return;

    // 2. 25분 주기로 유저 정보(이미지 URL 포함) 갱신
    // 1000ms * 60s * 25m = 1,500,000ms
    const REFRESH_INTERVAL = 1000 * 60 * 25;

    const timer = setInterval(() => {
      refreshUser();
    }, REFRESH_INTERVAL);

    // 3. 컴포넌트가 언마운트되거나 로그아웃 시 타이머 정리
    return () => clearInterval(timer);
  }, [isLoggedIn, refreshUser]);

  return (
    <header className="sticky top-0 z-40 flex w-full justify-center border bg-white">
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
