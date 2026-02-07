// .env에서 정의한 기본 리다이렉트 주소
const REDIRECT_URI_BASE = import.meta.env.VITE_REDIRECT_URI;

// 구글 인증 URL
export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
  import.meta.env.VITE_GOOGLE_CLIENT_ID
}&redirect_uri=${REDIRECT_URI_BASE}/google&response_type=code&scope=openid email profile`;

// 카카오 인증 URL
// export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
//   import.meta.env.VITE_KAKAO_CLIENT_ID
// }&redirect_uri=${REDIRECT_URI_BASE}/kakao&response_type=code`;
