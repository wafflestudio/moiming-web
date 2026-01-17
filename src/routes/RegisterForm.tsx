import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showErrors, setShowErrors] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { handleSignUp } = useAuth();

  // 사진이 선택될 때마다 미리보기 URL 생성
  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);

    // 컴포넌트 언마운트 시 메모리 누수 방지를 위해 URL 해제
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const validations = useMemo(() => {
    // 이메일 형식 체크 정규표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      isEmailValid: emailRegex.test(email),
      isNameValid: name.trim().length > 0, // 공백 제외 한 글자라도 있으면 성공
      password: {
        isLongEnough: password.length >= 8,
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()]/.test(password),
      },
      isPasswordMatch:
        password === confirmPassword && confirmPassword.length > 0,
    };
  }, [email, name, password, confirmPassword]);

  const isPasswordValid = Object.values(validations.password).every(Boolean);

  const onRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!validations.isNameValid) {
      nameRef.current?.focus();
      return;
    }

    if (!validations.isEmailValid) {
      emailRef.current?.focus();
      return;
    }

    if (!isPasswordValid) {
      passwordRef.current?.focus();
      return;
    }

    if (!validations.isPasswordMatch) {
      confirmPasswordRef.current?.focus();
      return;
    }

    handleSignUp({ username: email, password, name, photo });
  };

  const errorTextStyle = 'mt-1 text-xs text-red-500 font-medium';

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex w-full flex-col gap-8 rounded-2xl bg-white px-5 pb-[30px] pt-10 shadow-md max-w-md xs:px-[34px]">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          회원 정보 입력
        </h2>

        <form className="space-y-5" onSubmit={onRegisterSubmit}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 mb-3 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">사진 없음</span>
              )}
            </div>
            <label className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
              사진 선택
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setPhoto(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              ref={nameRef}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />

            {showErrors && !name && (
              <p className={errorTextStyle}>이름을 입력해주세요.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              ref={emailRef}
              type="email"
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                email.length > 0 && !validations.isEmailValid
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@moisha.com"
            />

            {showErrors && !email && (
              <p className={errorTextStyle}>이메일을 입력해주세요.</p>
            )}
            {email.length > 0 && !validations.isEmailValid && (
              <p className={errorTextStyle}>
                <span>유효한 이메일 형식을 입력해주세요.</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              ref={passwordRef}
              type="password"
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                password.length > 0 && !isPasswordValid
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상, 숫자, 특수문자 포함"
            />

            {showErrors && !password && (
              <p className={errorTextStyle}>비밀번호를 입력해주세요.</p>
            )}
            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                <li
                  className={`text-xs flex items-center ${validations.password.isLongEnough ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {validations.password.isLongEnough ? '✓' : '○'} 8자 이상
                </li>
                <li
                  className={`text-xs flex items-center ${validations.password.hasNumber ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {validations.password.hasNumber ? '✓' : '○'} 숫자 포함
                </li>
                <li
                  className={`text-xs flex items-center ${validations.password.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {validations.password.hasSpecial ? '✓' : '○'} 특수문자 포함
                </li>
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              ref={confirmPasswordRef}
              type="password"
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                confirmPassword.length > 0 && !validations.isPasswordMatch
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 확인해주세요"
            />

            {showErrors && !confirmPassword && (
              <p className={errorTextStyle}>비밀번호를 확인해주세요.</p>
            )}
            {confirmPassword.length > 0 && !validations.isPasswordMatch && (
              <p className={errorTextStyle}>비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
            >
              회원가입
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              이전 단계로
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
