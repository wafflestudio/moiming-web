import verifyEmailApi from '@/api/auth/email-verification';
import { CircleCheckBig } from '@/components/animate-ui/icons/circle-check-big';
import { MessageCircleWarning } from '@/components/animate-ui/icons/message-circle-warning';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

type VerificationStatus = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const verificationCode = searchParams.get('verificationCode');

  const [status, setStatus] = useState<VerificationStatus>('loading');

  useEffect(() => {
    let isIgnored = false;

    if (!verificationCode) {
      setStatus('error');
      return;
    }

    // Set the state to 'loading' when new request is made
    setStatus('loading');

    verifyEmailApi(verificationCode)
      .then(() => {
        if (!isIgnored) setStatus('success');
      })
      .catch(() => {
        if (!isIgnored) setStatus('error');
      });

    // Cleanup function to prevent state updates after component unmounts
    return () => {
      isIgnored = true;
    };
  }, [verificationCode]);

  // 1. Loading screen
  if (status === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex justify-center">
            <Spinner className="size-16" />
          </div>
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-center">
              이메일 인증을 처리 중입니다
            </h1>
          </div>
          <div className="flex justify-center">
            <p className="text-center">
              잠시만 기다려주세요. 인증을 처리하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Result screen (success/error)
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        {status === 'success' ? (
          <>
            <div className="flex justify-center">
              <CircleCheckBig animateOnView size={70} />
            </div>
            <div className="flex justify-center">
              <h1 className="text-2xl font-bold text-center">
                이메일 인증이 완료되었습니다
              </h1>
            </div>
            <div className="flex justify-center">
              <p className="text-center">
                로그인 후 모이밍의 서비스를 이용할 수 있습니다.
              </p>
            </div>
            <div className="flex justify-center">
              <Button type="button" variant="default" className="font-semibold">
                <Link to="/login">로그인하러 가기</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <MessageCircleWarning animateOnView size={70} />
            </div>
            <div className="flex justify-center">
              <h1 className="text-2xl font-bold text-center">
                이메일 인증에 실패하였습니다
              </h1>
            </div>
            <div className="flex justify-center">
              <p className="text-center leading-relaxed">
                유효하지 않거나, 만료된 인증 링크입니다.
                <br />
                링크가 만료되었다면 회원가입을 다시 진행해 주세요.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="default"
                  className="font-semibold"
                >
                  <Link to="/">홈으로 돌아가기</Link>
                </Button>
                <Button type="button" variant="ghost" className="font-semibold">
                  <Link to="/register">회원가입하러 가기</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
