import { uploadImage } from '@/api/images/images';
import { patchMe } from '@/api/users/me';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import useAuthStore from '@/hooks/useAuthStore';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function SignUp() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const currentUser = useAuthStore((state) => state.user);

  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showErrors, setShowErrors] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // 사진이 선택될 때마다 미리보기 URL 생성
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 로컬 미리보기 생성
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // 서버에 즉시 업로드하여 Key 확보
    setIsUploading(true);
    try {
      const res = await uploadImage({ image: file }, 'profile-image');
      setImageKey(res.key); // 나중에 handleSignUp에 보낼 값
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // 미리보기 URL 해제
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validations = useMemo(() => {
    return {
      isNameValid: name.trim().length > 0, // 공백 제외 한 글자라도 있으면 성공
      password: {
        isLongEnough: password.length >= 8,
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()]/.test(password),
        isValid:
          password.length === 0 ||
          (password.length >= 8 &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*()]/.test(password)),
      },
      isPasswordMatch: password === confirmPassword,
    };
  }, [name, password, confirmPassword]);

  const onRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (isUploading) {
      toast.error('이미지 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!validations.isNameValid) {
      nameRef.current?.focus();
      return;
    }

    if (!validations.password.isValid) {
      passwordRef.current?.focus();
      return;
    }

    if (!validations.isPasswordMatch) {
      confirmPasswordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        name,
        profileImage: imageKey || undefined,
        ...(password && { password }),
      };

      await patchMe(updateData);
      refreshUser();
      toast.success('프로필이 성공적으로 수정되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorTextStyle = 'mt-1 text-xs text-red-500 font-medium';

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex w-full flex-col gap-8 rounded-2xl bg-white px-5 pb-[30px] pt-10 shadow-md max-w-md xs:px-[34px]">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          회원 정보 수정
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
              비밀번호
            </label>
            <input
              ref={passwordRef}
              type="password"
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all ${
                password.length > 0 && !validations.password.isValid
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="변경할 비밀번호 입력"
            />

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

            {showErrors &&
              confirmPassword.length > 0 &&
              !validations.isPasswordMatch && (
                <p className={errorTextStyle}>비밀번호가 일치하지 않습니다.</p>
              )}
          </div>

          <div className="pt-4 space-y-3">
            <Button
              variant="moiming"
              type="submit"
              className="w-full rounded-md"
              disabled={isUploading || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  수정 중...
                </>
              ) : (
                '회원 정보 수정하기'
              )}
            </Button>
            <Button
              variant="moimingOutline"
              type="button"
              onClick={() => navigate(-1)}
              className="w-full rounded-md border-1"
              disabled={isSubmitting}
            >
              이전 단계로
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
