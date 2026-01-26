import GuestsPreview from '@/components/GuestsPreview';
import { ChevronLeftIcon, EllipsisVertical, Link } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, event, registrations, confirmedCount, handleFetchDetail } =
    useEventDetail();

  // 권한 확인 및 데이터 로드
  useEffect(() => {
    if (!id) return;

    const init = async () => {
      const status = await handleFetchDetail(id);

      // 관리자 페이지이므로 'HOST' 상태가 아니면 무조건 차단
      if (status !== 'HOST') {
        alert('관리자만 접근 가능한 페이지입니다.');
        // 뒤로가기 시 다시 이 페이지로 오지 못하게 replace 사용
        navigate('/', { replace: true });
      }
    };

    init();
  }, [id, handleFetchDetail, navigate]);

  const handleDelete = () => {
    // 삭제 API 필요
    console.info('Deleting event...');
    toast.error('일정이 삭제되었습니다.');
    navigate('/');
  };

  const joinLink = `${window.location.origin}/join/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    toast.success('링크가 복사되었습니다!', {
      description: '참여자에게 주소를 공유해 보세요.',
    });
  };

  // 로딩 중이거나 권한 확인 전에는 화면을 비움
  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      {/* 1. 상단 네비게이션 */}
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
            {event.title}
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuItem
                onClick={() => navigate('edit')}
                className="cursor-pointer"
              >
                일정 수정하기
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent text-red-600 font-medium">
                    일정 삭제하기
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      정말 일정을 삭제하시겠습니까?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      삭제된 일정은 복구할 수 없으며, 모든 참여 정보가 함께
                      사라집니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. 메인 콘텐츠*/}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] px-6 flex flex-col items-start gap-10">
        {/* 일정 정보 */}
        <EventDetailContent
          schedule={event}
          currentParticipants={confirmedCount}
        />

        {/* 모집 마감 및 링크 블록 */}
        <div className="w-full flex flex-col items-start">
          <div className="w-full bg-[#F8F9FA] rounded-3xl p-10 flex flex-col items-center gap-6 border border-gray-100">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-gray-400 scale-125">
                <Link />
              </div>
              <span className="text-base text-gray-500 font-medium break-all">
                {joinLink}
              </span>
            </div>
            <Button
              onClick={handleCopyLink}
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-2xl bg-black hover:bg-gray-800 transition-all"
            >
              링크 복사하기
            </Button>
          </div>
        </div>

        {/* 참여자 명단 섹션 */}
        <GuestsPreview
          guests={registrations}
          totalCount={confirmedCount}
          eventId={event.publicId}
        />
      </div>
    </div>
  );
}
