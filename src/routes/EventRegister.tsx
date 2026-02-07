import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { JoinEventRequest } from '@/types/events';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ShortEventDetailContent } from '../components/EventDetailContent';
import { GOOGLE_AUTH_URL } from '../constants/auth';
import useEventDetail from '../hooks/useEventDetail';

export default function EventRegister() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, data, handleFetchDetail, handleJoinEvent } =
    useEventDetail();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (id) {
      handleFetchDetail(id).then((status) => {
        if (status === 'ERROR') navigate('/');
      });
    }
  }, [id, handleFetchDetail, navigate]);

  if (loading || !data) {
    return (
      <LoadingSkeleton
        loadingTitle="일정 정보를 불러오는 중입니다"
        message="잠시만 기다려주세요. 일정 정보를 불러오고 있습니다."
      />
    );
  }

  const { event } = data;

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
      navigate(`/event/${id}`);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-25">
      {/* 1. 상단 네비게이션 */}
      <header className="w-full flex justify-center">
        <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl sm:text-2xl flex-1 ml-4 truncate text-black">
            정보 입력
          </h1>
        </div>
      </header>

      {/* 2. 메인 콘텐츠 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] flex flex-col items-start gap-10 mt-6">
        {/* 이벤트 상세 내용 */}
        <ShortEventDetailContent event={event} />

        {/* 신청 폼 섹션 */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-12">
          <div className="space-y-10">
            <div className="space-y-8 border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="grid w-full items-center gap-3 ">
                <Label htmlFor="name" className="text-base text-black">
                  예약자명
                </Label>
                <Input
                  id="name"
                  placeholder="이름"
                  className="h-12 rounded-xl border-gray-200 text-base px-5 focus-visible:ring-black"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid w-full items-center gap-3">
                <Label htmlFor="email" className="text-base text-black">
                  예약 정보 전달 이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="moiming@email.com"
                  className="h-12 rounded-xl border-gray-200 text-base px-5 focus-visible:ring-black"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* 소셜/로그인 유도 섹션 */}
          <div className="flex flex-col items-center gap-6 pt-4">
            <span className="text-2xl font-bold text-black">or</span>

            {/* 회원가입, 로그인 버튼 */}
            <div className="w-full flex flex-col gap-4 items-center mt-2">
              <Button
                type="button"
                variant="moiming"
                className="w-[75%] h-14 bg-blue-400 text-base"
                onClick={() => navigate('/login')}
              >
                로그인하기
              </Button>

              <Button
                type="button"
                variant="moimingOutline"
                onClick={() => navigate('/register')}
                className="w-[75%] h-14 text-base border-1"
              >
                계정 만들기
              </Button>
            </div>

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
            </div>
          </div>

          {/* 블러 푸터 (권한별 분기) */}
          <footer className="fixed bottom-0 left-0 right-0 z-40">
            <div className="h-16 bg-gradient-to-t from-white to-transparent" />
            <div className="bg-white/90 backdrop-blur-xl px-6 pb-10 pt-2 flex flex-col items-center gap-2">
              <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] flex flex-col items-center gap-3">
                <Button
                  variant="moiming"
                  size="xl"
                  type="submit"
                  className="w-full px-6 flex"
                >
                  신청하기
                </Button>
              </div>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
