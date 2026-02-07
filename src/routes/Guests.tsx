import LoadingSkeleton from '@/components/LoadingSkeleton';
import useEventDetail from '@/hooks/useEventDetail';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import useInfiniteGuests from '../hooks/useInfiniteGuests';

// shadcn UI 컴포넌트
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { GuestStatus } from '@/types/schemas';
import { ChevronLeftIcon, Loader2 } from 'lucide-react';

export default function Guests() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<GuestStatus>('CONFIRMED');
  const { handleBanEvent } = useEventDetail(id);

  // 1. 무한 스크롤 훅 연결
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteGuests({
    eventId: id!,
    filters: {
      status: activeTab,
      orderBy: 'registeredAt',
    },
  });

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // 2. 바닥 감지 훅 (마지막 요소가 보이면 다음 페이지 로드)
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCancelGuest = async (name: string | null, regId: string) => {
    const success = await handleBanEvent(regId);
    if (success) {
      toast.success(`${name} 님의 참여가 취소되었습니다.`);
      refetch();
    }
  };

  // 로딩 중이거나 데이터가 아직 없을 때 (리다이렉트 판단 전) 스피너나 빈 화면 표시
  if (isLoading || !data) {
    return (
      <LoadingSkeleton
        loadingTitle="참여자 목록을 불러오는 중입니다"
        message="잠시만 기다려주세요. 참여자 목록을 불러오고 있습니다."
      />
    );
  }

  return (
    <div className="min-h-screen relative">
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
            참여자 명단({totalCount}명)
          </h1>
        </div>
      </header>

      {/* 2. 메인 콘텐츠 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] flex flex-col gap-10 mt-2">
        {/* 탭 UI 영역 */}
        <div className="flex border-b">
          {['참여자', '대기자'].map((label, idx) => {
            const tabValue = ['CONFIRMED', 'WAITLISTED'][idx] as GuestStatus;
            return (
              <button
                key={tabValue}
                onClick={() => setActiveTab(tabValue)}
                className={`flex-1 py-4 font-bold ${activeTab === tabValue ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 참여자 리스트 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] flex flex-col gap-8 mt-6">
        {data?.pages.map((page) =>
          page.participants.map((guest) => (
            <div
              key={guest.registrationId}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-none shadow-sm">
                  <AvatarImage src={guest.profileImage || undefined} />
                  <AvatarFallback className="bg-black text-white text-xs">
                    {guest.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-black">
                    {guest.name}
                  </span>
                  {guest.email ? (
                    <span className="text-gray-400 text-lg">{guest.email}</span>
                  ) : null}
                  {guest.status === 'WAITLISTED' && (
                    <span className="text-blue-400 text-lg font-semibold">
                      대기 {guest.waitingNum}번
                    </span>
                  )}
                </div>
              </div>

              {/* 강제취소 버튼 */}
              {guest.email ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="bg-[#333333] hover:bg-black text-white rounded-lg px-4 py-6 text-base font-bold"
                    >
                      강제취소
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <strong>{guest.name}</strong> 님의 신청을
                        취소하시겠습니까?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        취소 후 원복이 어렵습니다. 취소 메일이 참여자에게
                        전송됩니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>신청 유지하기</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleCancelGuest(guest.name, guest.registrationId)
                        }
                        className="bg-primary text-white hover:bg-primary/90 rounded-xl"
                      >
                        취소하기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </div>
          ))
        )}

        {/* 4. 하단 무한 스크롤 트리거 & 로딩 인디케이터 */}
        <div ref={ref} className="py-10 flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          ) : hasNextPage ? (
            <p className="text-gray-400 text-sm">
              목록을 더 불러오고 있습니다...
            </p>
          ) : (
            <p className="text-gray-400 text-sm">마지막 참여자입니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
