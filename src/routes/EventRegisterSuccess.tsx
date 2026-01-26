import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import EventDetailContent from '../components/EventDetailContent';
import useEventDetail from '../hooks/useEventDetail';

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

export default function EventRegisterSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, event, confirmedCount, handleFetchDetail } =
    useEventDetail();

  useEffect(() => {
    if (id) {
      handleFetchDetail(id);
    }
  }, [id, handleFetchDetail]);

  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      {/* 1. 상단 완료 메시지 */}
      <div className="w-full flex justify-center">
        <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center justify-between px-6 py-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronLeftIcon />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold flex-1 ml-4 truncate text-black">
            예약이 완료 되었습니다
          </h1>
        </div>
      </div>

      {/* 2. 메인 콘텐츠*/}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] px-6 flex flex-col items-start gap-10">
        {/* 일정 정보 (왼쪽 정렬) */}
        <div className="text-left space-y-3 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold flex-1 truncate text-black">
            {event.title}
          </h1>
        </div>

        {/* 일정 정보 */}
        <EventDetailContent
          schedule={event}
          currentParticipants={confirmedCount}
        />

        {/* 취소 버튼 */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-full h-16 rounded-2xl bg-[#333333] hover:bg-black text-xl font-bold text-white transition-all shadow-lg active:scale-[0.98]"
            >
              취소하기
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>취소하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                취소 후 선착 마감된 경우, 신청이 어려울 수 있습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>신청 유지하기</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700"
              >
                취소하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
