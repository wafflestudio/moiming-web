// 유저 기본 정보
export interface User {
  id: number;
  email: string;
  name: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

// 멤버 권한 타입
type MemberRole = 'leader' | 'co-leader' | 'admin' | 'member';

// 내 정보 조회 시 함께 내려올 그룹 정보
export interface UserGroup {
  groupId: number; // group id
  groupName: string; // group name
  role: MemberRole; // member type
}

// API 응답 공통 규격
export interface AuthResponse {
  user: User;
  token: string;
}

// 로그인 요청 데이터
export interface LoginRequest {
  username: string; // 이메일
  password: string; // 비밀번호
}

// 회원가입 요청 데이터
export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
  photo: File | null; // 회원가입 시에는 선택 사항일 수 있음
}

// 소셜 로그인 요청 데이터
export interface SocialLoginRequest {
  provider: 'google' | 'kakao';
  code: string; // 플랫폼으로부터 받은 인가 코드
}
