import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { JoinEventRequest } from '@/types/events';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL } from '../constants/auth';
import useEventDetail from '../hooks/useEventDetail';
import { formatEventDate } from '../utils/date';

// 아이콘 컴포넌트
const IconChevronLeft = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default function EventRegister() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, event, confirmedCount, handleFetchDetail, handleJoinEvent } =
    useEventDetail();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (id) {
      handleFetchDetail(id);
    }
  }, [id, handleFetchDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // 간단한 유효성 검사
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('성함과 이메일을 모두 입력해주세요.');
      return;
    }

    const requestData: JoinEventRequest = {
      guestName: formData.name,
      guestEmail: formData.email,
    };

    const success = await handleJoinEvent(id, requestData);
    if (success) {
      // 신청 성공 시 성공 페이지로 이동
      navigate(`/join/${id}/success`);
    }
  };

  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      {/* 상단 네비게이션 */}
      <div className="w-full flex justify-center">
        <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center justify-between px-6 py-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <IconChevronLeft />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold flex-1 ml-4 truncate text-black">
            {event.title}
          </h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] px-6 flex flex-col items-start gap-10">
        {/* 일정 정보 */}
        <div className="text-left space-y-3 w-full">
          <p className="text-lg sm:text-xl font-bold text-black">
            일시 {formatEventDate(event.startAt)}
          </p>
          <p className="text-lg sm:text-xl font-bold text-black">
            장소 {event.location || '미정'}
          </p>
        </div>

        {/* 신청 현황 버튼 */}
        <button
          onClick={() => navigate('guests')}
          className="flex items-center text-lg font-bold group hover:opacity-70 transition-opacity"
        >
          {event.capacity}명 중{' '}
          <span className="text-black ml-2 font-extrabold">
            {confirmedCount}명 신청
          </span>
          <div className="rotate-180 ml-2 group-hover:translate-x-1 transition-transform text-black">
            <IconChevronLeft />
          </div>
        </button>

        <hr className="w-full border-gray-100" />

        {/* 신청 폼 섹션 */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-12">
          <div className="space-y-10">
            <h2 className="text-xl font-bold text-black">
              예약자 정보를 입력해 주세요
            </h2>

            <div className="space-y-8">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="name" className="text-lg font-bold text-black">
                  이름
                </Label>
                <Input
                  id="name"
                  placeholder="이름"
                  className="h-16 rounded-2xl border-gray-200 text-base px-5 focus-visible:ring-black"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email" className="text-lg font-bold text-black">
                  이메일주소
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="h-16 rounded-2xl border-gray-200 text-base px-5 focus-visible:ring-black"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* 최종 신청 버튼 */}
          <Button
            type="submit"
            className="w-full h-16 rounded-2xl bg-[#333333] hover:bg-black text-xl font-bold text-white transition-all shadow-lg active:scale-[0.98]"
          >
            신청하기
          </Button>

          {/* 소셜/로그인 유도 섹션 */}
          <div className="flex flex-col items-center gap-6 pt-4">
            <span className="text-2xl font-bold text-black">or</span>

            <div className="flex justify-center gap-6">
              {/* 구글 로그인 */}
              <a
                href={GOOGLE_AUTH_URL}
                className="w-14 h-14 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm"
                aria-label="Google 로그인"
              >
                <svg width="28" height="28" viewBox="0 0 24 24">
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

              {/* 카카오 로그인 */}
              <a
                href={KAKAO_AUTH_URL}
                className="w-14 h-14 flex items-center justify-center bg-[#FEE500] rounded-full hover:bg-[#FDD835] transition-all shadow-sm"
                aria-label="카카오 로그인"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3C7.02944 3 3 6.13401 3 10C3 12.5 4.5 14.5 7 15.5L6 19L10 16.5C10.5 16.8 11.2 17 12 17C16.9706 17 21 13.866 21 10C21 6.13401 16.9706 3 12 3Z"
                    fill="#3A1D1D"
                  />
                </svg>
              </a>
            </div>

            {/* 회원가입, 로그인 버튼 */}
            <div className="w-full flex flex-col gap-4 items-center mt-2">
              <Button
                type="button"
                onClick={() => navigate('/register')}
                className="w-[75%] h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-base font-bold text-white border-none"
              >
                계정 만들기
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-[75%] h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 text-base font-bold text-black border-black"
                onClick={() => navigate('/login')}
              >
                로그인하기
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
