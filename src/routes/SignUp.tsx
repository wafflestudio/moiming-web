import ContinueWithGoogle from '@/components/ContinueWithGoogle';
// import { uploadImage } from '@/api/images/images';
import RegisterSuccess from '@/components/RegisterSuccess';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// import { toast } from 'sonner';
import { GOOGLE_AUTH_URL } from '@/constants/auth';
import useAuth from '@/hooks/useAuth';
// import { Loader2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const [imageKey, setImageKey] = useState<string | null>(null);
  // const [isUploading, setIsUploading] = useState(false);

  const [isSent, setIsSent] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { handleSignUp } = useAuth();

  // // 사진이 선택될 때마다 미리보기 URL 생성
  // const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // 로컬 미리보기 생성
  //   const objectUrl = URL.createObjectURL(file);
  //   setPreviewUrl(objectUrl);

  //   // 서버에 즉시 업로드하여 Key 확보
  //   setIsUploading(true);
  //   try {
  //     const res = await uploadImage({ image: file }, 'profile-image');
  //     setImageKey(res.key); // 나중에 handleSignUp에 보낼 값
  //   } catch (error) {
  //     console.error('Image upload failed:', error);
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // // 미리보기 URL 해제
  // useEffect(() => {
  //   return () => {
  //     if (previewUrl) URL.revokeObjectURL(previewUrl);
  //   };
  // }, [previewUrl]);

  const validations = useMemo(() => {
    // 이메일 형식 체크 정규표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      isEmailValid: emailRegex.test(email),
      isNameValid: name.trim().length > 0, // 공백 제외 한 글자라도 있으면 성공
      password: {
        isLongEnough: password.length >= 8,
        hasNumber: /[0-9]/.test(password),
      },
      isPasswordMatch:
        password === confirmPassword && confirmPassword.length > 0,
    };
  }, [email, name, password, confirmPassword]);

  const isPasswordValid = Object.values(validations.password).every(Boolean);

  const onRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    // if (isUploading) {
    //   toast.error('이미지 업로드 중입니다. 잠시만 기다려주세요.');
    //   return;
    // }

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

    const signUpData = {
      email,
      name,
      password,
      // profileImage: imageKey || null,
      profileImage: null,
    };

    handleSignUp(signUpData).then((success) => {
      if (success) setIsSent(true);
    });
  };

  const errorTextStyle = 'mt-1 text-xs text-destructive font-medium';

  if (isSent) {
    return <RegisterSuccess email={email} />;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="flex w-full flex-col gap-4 rounded-lg bg-white px-6 py-6 border border-border max-w-md xs:px-4 xs:py-4">
        <div className="flex flex-col gap-2">
          <h1>회원가입</h1>
          <p className="body-base text-[#757575]">
            회원가입에 필요한 정보를 입력해 주세요.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onRegisterSubmit}>
          {/* <div className="flex flex-col items-center mb-6">
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
              {isUploading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white w-6 h-6" />
                </div>
              )}
            </div>
            <label className="text-sm text-primary font-medium cursor-pointer hover:underline">
              사진 선택
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div> */}
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              <label className="body-base">이름</label>
              <label className="body-base text-destructive">*</label>
            </div>
            <input
              ref={nameRef}
              type="text"
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all single-line-body-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />

            {showErrors && !name && (
              <p className={errorTextStyle}>이름을 입력해주세요.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              <label className="body-base">이메일</label>
              <label className="body-base text-destructive">*</label>
            </div>
            <input
              ref={emailRef}
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all single-line-body-base ${
                email.length > 0 && !validations.isEmailValid
                  ? 'border-destructive focus:ring-destructive/10'
                  : 'border-border focus:ring-primary'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@moiming.com"
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

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              <label className="body-base">비밀번호</label>
              <label className="body-base text-destructive">*</label>
            </div>
            <input
              ref={passwordRef}
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all single-line-body-base ${
                password.length > 0 && !isPasswordValid
                  ? 'border-destructive focus:ring-destructive/10'
                  : 'border-border focus:ring-primary'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상, 숫자 포함"
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
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              <label className="body-base">비밀번호 확인</label>
            </div>
            <input
              ref={confirmPasswordRef}
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all single-line-body-base ${
                confirmPassword.length > 0 && !validations.isPasswordMatch
                  ? 'border-destructive focus:ring-destructive/10'
                  : 'border-border focus:ring-primary'
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

          <Button
            type="submit"
            className="w-full h-10"
            // disabled={isUploading}
          >
            회원가입
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
          <span className="body-base text-center">간편 회원가입</span>
          <a href={GOOGLE_AUTH_URL} aria-label="Google로 회원가입">
            <ContinueWithGoogle />
          </a>
        </div>

        <div className="flex w-full items-center justify-center">
          <div className="flex">
            <span className="body-base text-[#767676] py-[5px]">
              이미 계정이 있나요?
            </span>
          </div>
          <Button
            className="body-base text-foreground hover:text-primary"
            variant="link"
          >
            <Link to="/login">로그인</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
