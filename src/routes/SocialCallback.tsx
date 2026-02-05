import type { AuthProvider } from '@/types/auth';
import { useEffect } from 'react';
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
  const { handleSocialLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code && provider) {
      handleSocialLogin({ provider, code });
    } else {
      alert('로그인에 실패했습니다.');
      navigate('/login');
    }
  }, [provider, searchParams, handleSocialLogin, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">소셜 계정 정보를 확인 중입니다...</p>
    </div>
  );
}
