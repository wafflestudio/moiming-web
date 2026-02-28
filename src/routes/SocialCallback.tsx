import type { AuthProvider } from '@/types/auth';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import useAuth from '../hooks/useAuth';

const SOCIAL_PROVIDER_MAP: Record<string, AuthProvider> = {
  google: 'GOOGLE',
};

export default function SocialCallback() {
  const { provider: providerParam } = useParams();
  const provider = providerParam
    ? SOCIAL_PROVIDER_MAP[providerParam.toLowerCase()]
    : undefined;
  const [searchParams] = useSearchParams();
  const { handleSocialLogin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const loginAttempted = useRef(false);

  useEffect(() => {
    // 1. 이미 로그인되어 있거나 이미 요청을 보냈다면 중단
    if (isLoggedIn || loginAttempted.current) {
      return;
    }

    const code = searchParams.get('code');

    if (code && provider) {
      loginAttempted.current = true; // 요청 시작을 표시
      handleSocialLogin({ provider, code });
    } else {
      alert('로그인에 실패했습니다.');
      navigate('/login');
    }
  }, [provider, searchParams, handleSocialLogin, navigate, isLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600">소셜 계정 정보를 확인 중입니다...</p>
    </div>
  );
}
