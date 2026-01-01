import { useNavigate } from 'react-router';
import loginApi from '../api/auth/login';
import getMeApi from '../api/auth/me';
import signupApi from '../api/auth/signup';
import socialApi from '../api/auth/social';
import type {
  LoginRequest,
  SignUpRequest,
  SocialLoginRequest,
} from '../types/auth';
import useAuthStore from './useAuthStore';

export default function useAuth() {
  const navigate = useNavigate();

  const { user, isLoggedIn, login, logout, updateUser } = useAuthStore(
    (state) => state
  );

  // 1. 이메일 로그인 로직
  const handleLogin = async (data: LoginRequest) => {
    try {
      const { user, token } = await loginApi(data);
      login(user, token); // Zustand 스토어 업데이트
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('Login failed:', error);
      alert('아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  // 2. 이메일 회원가입 로직
  const handleSignUp = async (data: SignUpRequest) => {
    try {
      const { user, token } = await signupApi(data);
      login(user, token);
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  // 3. 소셜 로그인 로직
  const handleSocialLogin = async (data: SocialLoginRequest) => {
    try {
      const { user, token } = await socialApi(data);
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
  const handleLogout = () => {
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
