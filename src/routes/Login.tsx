import ContinueWithGoogle from '@/components/ContinueWithGoogle';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { GOOGLE_AUTH_URL } from '@/constants/auth';
import useAuth from '@/hooks/useAuth';
import { useState } from 'react';
import { Link } from 'react-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4.5">
      <div className="flex w-full flex-col gap-6 rounded-lg bg-white px-6 py-6 border border-border max-w-md xs:px-4 xs:py-4">
        <h1>로그인</h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FieldGroup className="flex gap-3">
            <Field className="flex gap-1.5">
              <FieldLabel>
                <span className="body-base">이메일</span>
              </FieldLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field className="flex gap-1.5">
              <FieldLabel>
                <span className="body-base">비밀번호</span>
              </FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full h-10">
            로그인하기
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 w-[90%]">
            <Separator className="flex-1" />
            <span className="single-line-body-base text-muted-foreground">
              or
            </span>
            <Separator className="flex-1" />
          </div>
          <span className="body-base text-center">간편 로그인</span>
          <a href={GOOGLE_AUTH_URL} aria-label="Google로 로그인">
            <ContinueWithGoogle />
          </a>
        </div>

        <div className="flex w-full items-center justify-center">
          <div className="flex">
            <span className="body-base text-[#767676] py-[5px]">
              아직 가입 전인가요?
            </span>
          </div>
          <Button
            className="body-base text-foreground hover:text-primary"
            variant="link"
          >
            <Link to="/sign-up/email">회원가입</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
