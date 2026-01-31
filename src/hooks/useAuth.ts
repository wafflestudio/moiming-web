import loginApi from '@/api/auth/login';
import logoutApi from '@/api/auth/logout';
import signupApi from '@/api/auth/signup';
import socialApi from '@/api/auth/social';
import { getMe as getMeApi } from '@/api/users/me';
import useAuthStore from '@/hooks/useAuthStore';
import { useErrorStore } from '@/hooks/useErrorStore';
import type {
  ApiError,
  LoginRequest,
  SignUpRequest,
  SocialLoginRequest,
} from '@/types/auth';
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function useAuth() {
  const navigate = useNavigate();

  const { user, isLoggedIn, login, logout, updateUser } = useAuthStore(
    (state) => state
  );

  const showError = useErrorStore((state) => state.showError);

  // 1. 이메일 로그인 로직
  const handleLogin = async (data: LoginRequest) => {
    try {
      const { token } = await loginApi(data);
      const user = await getMeApi(token);
      login(user, token); // Zustand 스토어 업데이트
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('Login failed:', error);
      showError('아이디 또는 비밀번호를 확인해주세요.', '로그인 실패');
    }
  };

  // 2. 이메일 회원가입 로직
  const handleSignUp = async (data: SignUpRequest) => {
    try {
      const response = await signupApi(data);

      // 204 No Content
      if (response.status === 204) {
        navigate('/please-verify-email');
        return;
      }
    } catch (error) {
      console.error('Signup failed:', error);

      if (axios.isAxiosError<ApiError>(error) && error.response) {
        const { status, data: errorData } = error.response;

        // 409 Conflict
        if (status === 409 && errorData.errorCode === 1004) {
          showError('이미 사용 중인 이메일입니다.', '회원가입 실패');
          return;
        }

        // 503 Email service unavailable
        if (status === 503 && errorData.errorCode === 4001) {
          showError(
            '이메일 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            '서비스 일시 중단'
          );
          return;
        }

        // 400 Bad Request
        if (status === 400) {
          let message = '입력 정보를 확인해주세요.';
          switch (errorData.errorCode) {
            case 1001:
              message = '비밀번호가 유효하지 않습니다.';
              break;
            case 1002:
              message = '이메일 주소가 유효하지 않습니다.';
              break;
            case 1003:
              message = '사용자 이름이 유효하지 않습니다.';
              break;
            default:
              message = errorData.message || message;
          }
          showError(message, '입력 오류');
          return;
        }
      }

      showError(
        '회원가입 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        '오류 발생'
      );
    }
  };

  // 3. 소셜 로그인 로직
  const handleSocialLogin = async (data: SocialLoginRequest) => {
    try {
      const { token } = await socialApi(data);
      const user = await getMeApi(token);
      login(user, token);
      navigate('/');
    } catch (error) {
      console.error('Social login failed:', error);
      alert('소셜 로그인에 실패했습니다.');
    }
  };

  // 4. 내 정보 동기화
  const refreshUser = async () => {
    if (!isLoggedIn) return;
    try {
      const userData = await getMeApi();
      // 유저 정보와 그룹 정보 등이 담긴 데이터로 스토어 갱신
      updateUser(userData);
    } catch (error) {
      console.error('Refresh user failed:', error);
      handleLogout(); // 토큰이 유효하지 않으면 로그아웃 처리
      alert('유저 정보 동기화 중 오류가 발생했습니다.');
    }
  };

  // 5. 로그아웃 로직
  const handleLogout = async () => {
    await logoutApi();
    logout(); // Zustand 상태 초기화
    navigate('/login');
  };

  return {
    user,
    isLoggedIn,
    handleLogin,
    handleSignUp,
    handleSocialLogin,
    refreshUser,
    handleLogout,
  };
}
