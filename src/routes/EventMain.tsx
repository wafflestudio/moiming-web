import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeftIcon,
  EllipsisVertical,
  Info,
  Link as LinkIcon,
  Loader,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

// Hooks
import useAuth from '@/hooks/useAuth';
import useAuthStore from '@/hooks/useAuthStore';
import useEventDetail from '@/hooks/useEventDetail';
import useEventView from '@/hooks/useEventView';

// Shared Components
import GuestsPreview from '@/components/GuestsPreview';
import LoadingSkeleton from '@/components/LoadingSkeleton';
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
import EventDetailContent from '../components/EventDetailContent';

export default function EventMain() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { removeGuestRegistration } = useAuthStore();

  // 1. 데이터 가져오기 및 권한 확인
  const {
    loading,
    data,
    isDeleted,
    handleFetchDetail,
    handleCancelEvent,
    handleJoinEvent,
    handleDeleteEvent,
  } = useEventDetail(id);
  const view = useEventView(data);

  // 2. 초기 데이터 로드
  useEffect(() => {
    if (id) {
      handleFetchDetail(id).then((status) => {
        if (status === 'ERROR') navigate('/');
      });
    }
  }, [id, handleFetchDetail, navigate]);

  if (isDeleted || !id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="bg-red-50 p-4 rounded-full text-red-500">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            삭제되었거나 없는 일정입니다.
          </h2>
          <p className="text-gray-500">
            요청하신 일정 정보를 찾을 수 없습니다.
          </p>
        </div>
        <Button onClick={() => navigate('/')} className="rounded-xl px-8 h-12">
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <LoadingSkeleton
        loadingTitle="일정 정보를 불러오는 중입니다"
        message="잠시만 기다려주세요. 일정 정보를 불러오고 있습니다."
      />
    );
  }

  const { event, viewer, guestsPreview } = data;
  const joinLink = `${window.location.origin}/event/${id}`;

  // 3. 액션 핸들러
  const onJoinClick = async () => {
    // 비로그인이면 폼 입력 페이지로 이동
    if (!isLoggedIn) return navigate(`/event/${id}/register`);

    const success = await handleJoinEvent(id, {});
    if (success) {
      navigate(`/join/${id}/success`);
    }
  };

  const onCancelClick = async () => {
    // API 우선, 없으면 Zustand 스토어 확인
    const regId =
      viewer.registrationPublicId ||
      useAuthStore.getState().guestRegistrations[id];
    if (!regId) return;

    const success = await handleCancelEvent(regId);
    if (success) {
      removeGuestRegistration(id);
      toast.success('신청이 취소되었습니다.');
    }
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    toast.success('링크가 복사되었습니다!', {
      description: '참여자에게 주소를 공유해 보세요.',
    });
  };

  const onDeleteClick = async () => {
    const success = await handleDeleteEvent(id);
    if (success) {
      toast.success('일정이 삭제되었습니다.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      {/* 1. 관리자 상단 네비게이션 */}
      {view === 'ADMIN' && (
        <header className="w-full flex justify-center">
          <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center justify-between px-6 py-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl sm:text-2xl flex-1 ml-4 truncate text-black">
              상세보기
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
                        삭제된 일정은 복구할 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDeleteClick}
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
        </header>
      )}

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
            {/* 성공 뷰일 때는 메시지, 아닐 때는 이벤트 제목 */}
            {view === 'CONFIRMED' || view === 'WAITLISTED'
              ? '예약이 완료되었습니다'
              : event.title}
          </h1>

          {view === 'ADMIN' && (
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
                        삭제된 일정은 복구할 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDeleteClick}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 2. 메인 콘텐츠 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] px-6 flex flex-col items-start gap-10">
        {/* 상태 안내 배너 */}
        <StatusBanner view={view} waitingNum={viewer.waitlistPosition} />
        <StatusBanner2 view={view} waitingNum={viewer.waitlistPosition} />

        {/* 성공 뷰일 때 제목 한 번 더 노출 (보내주신 성공 페이지 디자인 반영) */}
        {(view === 'CONFIRMED' || view === 'WAITLISTED') && (
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
            {event.title}
          </h2>
        )}

        <EventDetailContent
          schedule={event}
          totalApplicants={event.totalApplicants}
        />

        {/* 3. 상황별 액션 영역 */}
        <div className="w-full">
          {view === 'ADMIN' ? (
            <div className="bg-[#F8F9FA] rounded-3xl p-10 flex flex-col items-center gap-6 border border-gray-100">
              <div className="text-gray-400 scale-125">
                <LinkIcon />
              </div>
              <span className="text-base text-gray-500 font-medium break-all">
                {joinLink}
              </span>
              <Button
                onClick={onCopyLink}
                className="w-full h-14 text-lg font-bold bg-black rounded-2xl"
              >
                링크 복사하기
              </Button>
            </div>
          ) : (
            <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t flex justify-center z-20">
              <div className="max-w-2xl w-full">
                <ActionButton
                  view={view}
                  onJoin={onJoinClick}
                  onCancel={onCancelClick}
                />
              </div>
            </div>
          )}
        </div>

        {/* 참여자 명단 섹션 */}
        <GuestsPreview
          guests={guestsPreview}
          totalCount={event.totalApplicants}
          eventId={event.publicId}
        />
      </div>
    </div>
  );
}

// --- 하위 컴포넌트들 ---

// --- 서브 컴포넌트: 상태 배너 ---
function StatusBanner({
  view,
  waitingNum,
}: { view: string; waitingNum?: number }) {
  if (view === 'NONE') return null;

  const config = {
    NONE: {
      icon: <Check className="text-white w-6 h-6" />,
      bg: 'bg-blue-500',
      text: '신청이 완료되었습니다.',
    },
    ADMIN: {
      icon: <Loader className="text-white w-6 h-6" />,
      bg: 'bg-green-500',
      text: `${waitingNum}번째로 대기 완료되었습니다.`,
    },
    NONE: {
      icon: <X className="text-white w-6 h-6" />,
      bg: 'bg-red-500',
      text: '취소가 완료되었습니다.',
    },
  };

  const current = config[view as keyof typeof config];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${current.bg}`}
        >
          {current.icon}
        </div>
        <span className="text-3xl font-bold text-gray-900">{current.text}</span>
      </div>
      <div className="text-sm text-gray-600 pl-11 space-y-1">
        <p>예약자명: 홍길동</p>
        <p>예약정보 전달 이메일: moisha@weee.com</p>
      </div>
      <hr className="border-gray-100" />
    </motion.div>
  );
}

function StatusBanner2({
  view,
  waitingNum,
}: { view: string; waitingNum?: number }) {
  const config = {
    CONFIRMED: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-100',
      icon: CheckCircle2,
      msg: '참여가 확정되었습니다!',
    },
    WAITLISTED: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      icon: Info,
      msg: `${waitingNum}번째로 대기 중입니다!`,
    },
    BANNED: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-100',
      icon: Info,
      msg: '관리자의 요청으로 취소되었습니다!',
    },
  };

  const status = config[view as keyof typeof config];
  if (!status) return null;

  return (
    <div
      className={`w-full p-4 rounded-2xl border flex items-center gap-3 ${status.bg} ${status.text} ${status.border}`}
    >
      <status.icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-semibold">{status.msg}</p>
    </div>
  );
}

function ActionButton({
  view,
  onJoin,
  onCancel,
}: { view: string; onJoin: () => void; onCancel: () => void }) {
  switch (view) {
    case 'APPLY':
      return (
        <Button
          onClick={onJoin}
          className="w-full h-16 rounded-2xl bg-black text-xl font-bold shadow-lg active:scale-95 transition-all"
        >
          신청하기
        </Button>
      );
    case 'WAITLIST':
      return (
        <Button
          onClick={onJoin}
          className="w-full h-16 rounded-2xl bg-gray-800 text-xl font-bold shadow-lg active:scale-95 transition-all"
        >
          대기 신청하기
        </Button>
      );
    case 'CONFIRMED':
    case 'WAITLISTED':
      return (
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
              <AlertDialogTitle>신청을 취소하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                취소 후 재신청은 모집 기간 내에만 가능합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                신청 유지하기
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onCancel}
                className="bg-red-600 hover:bg-red-700 rounded-xl"
              >
                취소 확정
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case 'CLOSED':
      return (
        <Button
          disabled
          className="w-full h-16 rounded-2xl bg-gray-100 text-gray-400 text-xl font-bold"
        >
          모집 마감
        </Button>
      );
    default:
      return null;
  }
}
