import { useNavigate } from 'react-router';
import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL } from '../constants/auth';

export default function RegisterChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-title">
            회원가입
          </h2>
          <p className="text-gray-500">
            모이샤와 함께 모임 활동을 시작해 보세요!
          </p>
        </div>

        <div className="flex justify-center gap-6">
          <a
            href={GOOGLE_AUTH_URL}
            className="w-14 h-14 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm bg-white"
            aria-label="Google로 회원가입"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </a>

          <a
            href={KAKAO_AUTH_URL}
            className="w-14 h-14 flex items-center justify-center bg-[#FEE500] rounded-full hover:bg-[#FDD835] transition-all shadow-sm"
            aria-label="카카오로 회원가입"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C7.02944 3 3 6.13401 3 10C3 12.5 4.5 14.5 7 15.5L6 19L10 16.5C10.5 16.8 11.2 17 12 17C16.9706 17 21 13.866 21 10C21 6.13401 16.9706 3 12 3Z"
                fill="#3A1D1D"
              />
            </svg>
          </a>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-medium">
              또는
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/register/email')}
          className="w-full py-3.5 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md transition-all active:scale-[0.98]"
        >
          이메일로 가입하기
        </button>
      </div>
    </div>
  );
}
