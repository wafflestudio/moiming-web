import ContinueWithGoogle from '@/components/ContinueWithGoogle';
import { Button } from '@/components/ui/button';
import { GOOGLE_AUTH_URL } from '@/constants/auth';
import { Link } from 'react-router';

function Separator() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="117"
      height="1"
      viewBox="0 0 117 1"
      fill="none"
    >
      <path d="M0 0.5H116.5" stroke="#D9D9D9" />
    </svg>
  );
}

type AuthMode = 'sign-up' | 'login';

export default function AuthBox({ mode }: { mode: AuthMode }) {
  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <span className="body-base text-center">
        소셜 계정으로 간편 {mode === 'sign-up' ? '회원가입' : '로그인'}
      </span>
      <a href={GOOGLE_AUTH_URL} aria-label="Google로 회원가입">
        <ContinueWithGoogle />
      </a>
      <div className="flex w-full items-center gap-[12px]">
        <Separator />
        <span className="single-line-body-base text-muted-foreground">or</span>
        <Separator />
      </div>
      <Button className="w-full h-[40px]">
        <Link to={`/${mode}/email`}>
          이메일로 {mode === 'sign-up' ? '가입하기' : '로그인하기'}
        </Link>
      </Button>
      <div className="flex">
        {mode === 'sign-up' && (
          <div className="flex">
            <span className="body-base text-[#767676] py-[5px]">
              이미 계정이 있나요?
            </span>
          </div>
        )}
        <Button
          className="body-base text-foreground hover:text-primary"
          variant="link"
        >
          <Link to={mode === 'sign-up' ? '/login' : '/'}>
            {mode === 'sign-up' ? '로그인' : '회원가입'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
