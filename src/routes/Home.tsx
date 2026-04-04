import ContinueWithGoogle from '@/components/ContinueWithGoogle';
import Dashboard from '@/components/Dashboard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import NewEventButton from '@/components/NewEventButton';
import { Button } from '@/components/ui/button';
import { GOOGLE_AUTH_URL } from '@/constants/auth';
import useAuth from '@/hooks/useAuth';
import useInfiniteMyEvents from '@/hooks/useInfiniteMyEvents';
import useInfiniteMyRegistrations from '@/hooks/useInfiniteMyRegistrations';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'hosted' | 'joined'>('hosted');

  // queries
  const {
    data: hostedData,
    fetchNextPage: fetchNextHosted,
    hasNextPage: hasNextHosted,
    isFetchingNextPage: isFetchingHosted,
    isLoading: isLoadingHosted,
  } = useInfiniteMyEvents();

  const {
    data: joinedData,
    fetchNextPage: fetchNextJoined,
    hasNextPage: hasNextJoined,
    isFetchingNextPage: isFetchingJoined,
    isLoading: isLoadingJoined,
  } = useInfiniteMyRegistrations();

  // 바닥 감지 훅
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (activeTab === 'hosted' && hasNextHosted && !isFetchingHosted) {
        fetchNextHosted();
      } else if (activeTab === 'joined' && hasNextJoined && !isFetchingJoined) {
        fetchNextJoined();
      }
    }
  }, [
    inView,
    activeTab,
    hasNextHosted,
    isFetchingHosted,
    fetchNextHosted,
    hasNextJoined,
    isFetchingJoined,
    fetchNextJoined,
  ]);

  // if not logged in, show the landing page
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex justify-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-10.5">
          <div className="flex flex-col gap-7.5">
            <h1 className="heading text-center">
              모임이 쉬워진다!
              <br /> 모이밍
            </h1>
            <span className="body-base text-center">
              선착순 모임, 모이밍으로 깔끔하게 정리 끝! <br />
              신청, 대기, 취소 관리까지 쉽게 해보세요.
            </span>
            <img src="/landing-calendar.svg" alt="landing" />
          </div>
          <div className="flex flex-col gap-3.5">
            <Link to="/sign-up">
              <Button className="w-full single-line-body-base p-3 cursor-pointer">
                시작하기
              </Button>
            </Link>
            <a href={GOOGLE_AUTH_URL} aria-label="Google로 회원가입">
              <ContinueWithGoogle />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리: 데이터가 없는 첫 로딩 시에만 스켈레톤 노출
  const isInitialLoading =
    (activeTab === 'hosted' && isLoadingHosted) ||
    (activeTab === 'joined' && isLoadingJoined);

  if (isInitialLoading) {
    return (
      <div className="flex flex-col flex-1 w-full max-w-2xl mx-auto px-4 py-4 gap-6">
        <LoadingSkeleton
          loadingTitle="불러오는 중..."
          message="모임 정보를 가져오고 있습니다."
        />
      </div>
    );
  }

  const events = hostedData?.pages.flatMap((page) => page?.events || []) || [];
  const registrations =
    joinedData?.pages.flatMap((page) => page?.registrations || []) || [];

  return (
    <div className="flex flex-col flex-1 w-full max-w-2xl mx-auto px-4 py-4 gap-4">
      {/* 새 모임 만들기 버튼 */}
      <div className="flex items-center justify-end mb-4">
        <NewEventButton />
      </div>

      {/* 탭 UI 영역 */}
      <div className="border-b-1 border-border sticky top-16 bg-white z-10 flex pt-2 -mx-4 px-4">
        {['생성한 모임', '참여한 모임'].map((label, idx) => {
          const tabValue = ['hosted', 'joined'][idx] as 'hosted' | 'joined';
          return (
            <button
              key={tabValue}
              onClick={() => setActiveTab(tabValue)}
              className={`flex-1 py-1 ${activeTab === tabValue ? 'text-xl font-semibold border-b-2 border-black text-black' : 'text-md text-[#767676]'}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 이벤트/신청내역 목록 렌더링 */}
      <Dashboard
        events={events}
        registrations={registrations}
        type={activeTab}
      />

      {/* 무한 스크롤 트리거 및 로딩 인디케이터 컨테이너 */}
      <div ref={ref} className="py-8 flex justify-center mt-auto">
        {(activeTab === 'hosted' && isFetchingHosted) ||
        (activeTab === 'joined' && isFetchingJoined) ? (
          <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
        ) : (activeTab === 'hosted' && hasNextHosted) ||
          (activeTab === 'joined' && hasNextJoined) ? (
          <p className="text-gray-400 text-sm">
            목록을 더 불러오고 있습니다...
          </p>
        ) : (
            activeTab === 'hosted'
              ? events.length > 0
              : registrations.length > 0
          ) ? (
          <p className="body-small text-muted-foreground">마지막 모임입니다.</p>
        ) : null}
      </div>
    </div>
  );
}
