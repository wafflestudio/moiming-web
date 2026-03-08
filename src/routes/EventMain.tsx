import { motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  ChevronLeftIcon,
  EllipsisVertical,
  Link as LinkIcon,
  Loader,
  X,
} from 'lucide-react';
import { type ComponentProps, useEffect, useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DetailedEvent, EventViewType } from '@/types/events';
import { formatEventDate, getRemainingTime } from '@/utils/date';
import { EventDetailContent } from '../components/EventDetailContent';

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

  const { event, creator, viewer, guestsPreview } = data;
  const joinLink = `${window.location.origin}/event/${id}`;

  // 3. 액션 핸들러
  const onJoinClick = async () => {
    // 비로그인이면 폼 입력 페이지로 이동
    if (!isLoggedIn) return navigate(`/event/${id}/register`);

    const success = await handleJoinEvent(id, {});
    if (success) {
      toast.success('신청이 완료되었습니다.');
      navigate(0);
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

  const onDeleteClick = async () => {
    const success = await handleDeleteEvent(id);
    if (success) {
      toast.success('일정이 삭제되었습니다.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen relative pb-50">
      {/* 1. 상단 네비게이션 */}
      {view === 'ADMIN' && (
        <header className="w-full flex justify-center">
          <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center justify-between px-2 space-y-4">
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
                        className="bg-primary text-white hover:bg-primary/90 rounded-xl"
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

      {/* 2. 메인 콘텐츠 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] flex flex-col items-start gap-10">
        {/* 상태 안내 배너 */}
        <StatusBanner
          view={view}
          waitingNum={viewer.waitlistPosition}
          name={viewer.name}
          email={viewer.reservationEmail}
        />

        {/* 주최자 정보 영역 */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage src={creator.profileImage} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-xl gap-3">
                <span className="font-bold text-gray-900">{creator.name}</span>
                <span className="bg-blue-50 text-primary text-xs px-1.5 py-0.5 rounded-sm font-bold">
                  모임장
                </span>
              </div>
              <span className="text-sm text-gray-400">{creator.email}</span>
            </div>
          </div>
        </section>

        {/* 이벤트 상세 내용 */}
        <EventDetailContent view={view} event={event} />

        {/* 참여자 명단 섹션 */}
        <GuestsPreview
          guests={guestsPreview}
          totalCount={event.totalApplicants}
          eventId={event.publicId}
        />
      </div>

      {/* 3. 블러 푸터 (권한별 분기) */}
      <footer className="fixed bottom-0 left-0 right-0 z-40">
        <div className="h-16 bg-gradient-to-t from-white to-transparent" />
        <div className="bg-white/90 backdrop-blur-xl px-6 pb-10 pt-2 flex flex-col items-center gap-2">
          <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] flex flex-col items-center gap-3">
            <ActionButton
              view={view}
              event={event}
              joinLink={joinLink}
              onJoin={onJoinClick}
              onCancel={onCancelClick}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- 하위 컴포넌트들 ---

function StatusBanner({
  view,
  waitingNum,
  name,
  email,
}: { view: EventViewType; waitingNum?: number; name: string; email: string }) {
  if (
    view !== 'CONFIRMED' &&
    view !== 'WAITLISTED' &&
    view !== 'CANCELED' &&
    view !== 'BANNED'
  )
    return null;

  const config = {
    CONFIRMED: {
      icon: <Check className="text-white w-6 h-6" />,
      bg: 'bg-blue-500',
      text: '신청이 완료되었습니다.',
    },
    WAITLISTED: {
      icon: <Loader className="text-white w-6 h-6" />,
      bg: 'bg-green-500',
      text: `${waitingNum}번째로 대기 완료되었습니다.`,
    },
    CANCELED: {
      icon: <X className="text-white w-6 h-6" />,
      bg: 'bg-red-500',
      text: '취소가 완료되었습니다.',
    },
    BANNED: {
      icon: <X className="text-white w-6 h-6" />,
      bg: 'bg-red-500',
      text: '관리자에 의해 신청이 취소되었습니다.',
    },
  };

  const current = config[view as keyof typeof config];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${current.bg}`}
        >
          {current.icon}
        </div>
        <span className="text-3xl font-bold text-gray-900">{current.text}</span>
      </div>
      <div className="text-m text-gray-600 space-y-2">
        <p>예약자명</p>
        <p className="font-bold text-gray-900">{name}</p>
        <p>예약정보 전달 이메일</p>
        <p className="font-bold text-gray-900">{email}</p>
      </div>
      <hr className="border-gray-300" />
    </motion.div>
  );
}

type ButtonVariant = ComponentProps<typeof Button>['variant'];

interface ButtonConfig {
  variant: ButtonVariant;
  text: string;
  disabled: boolean;
  isAdmin?: boolean;
  isCancel?: boolean;
}

interface ActionButtonProps {
  view: EventViewType;
  event: DetailedEvent;
  joinLink: string;
  onJoin: () => void;
  onCancel: () => void;
}

function ActionButton({
  view,
  event,
  joinLink,
  onJoin,
  onCancel,
}: ActionButtonProps) {
  const [copyDetail, setCopyDetail] = useState(false);

  const remainingTime = getRemainingTime(
    view,
    event.registrationEndsAt,
    event.registrationStartsAt
  );

  const onCopyLink = () => {
    let textToCopy = joinLink;

    if (copyDetail) {
      textToCopy = `${event.title}

🔗 참여 링크:
${joinLink}

📅 일시: ${event.startsAt ? formatEventDate(event.startsAt) : '미정'} ${event.endsAt ? `- ${formatEventDate(event.endsAt)}` : ''}
📍 장소: ${event.location || '미정'}

📝 상세 내용:
${event.description}`;
    }

    navigator.clipboard.writeText(textToCopy);
    toast.success('링크가 복사되었습니다!', {
      description: copyDetail
        ? '모임 내용이 포함되었습니다.'
        : '참여자에게 주소를 공유해 보세요.',
    });
  };

  // 버튼 설정 맵 (색상, 문구, 비활성화 여부)
  const buttonConfigs: Record<EventViewType, ButtonConfig> = {
    ADMIN: {
      variant: 'moiming',
      text: '복사하기',
      disabled: false,
      isAdmin: true,
    },
    APPLY: { variant: 'moiming', text: '신청하기', disabled: false },
    WAITLIST: { variant: 'moiming', text: '대기 신청하기', disabled: false },
    CONFIRMED: {
      variant: 'moimingOutline',
      text: '취소하기',
      disabled: false,
      isCancel: true,
    },
    WAITLISTED: {
      variant: 'moimingOutline',
      text: '대기 취소하기',
      disabled: false,
      isCancel: true,
    },
    CANCELED: { variant: 'moiming', text: '다시 신청하기', disabled: false },
    BANNED: {
      variant: 'secondary',
      text: '참여가 제한된 모임입니다',
      disabled: true,
    },
    UPCOMING: { variant: 'secondary', text: '모집 예정', disabled: true },
    ENDED: { variant: 'secondary', text: '신청하기', disabled: true },
    CLOSED: { variant: 'secondary', text: '모집 종료', disabled: true },
  };

  const current = buttonConfigs[view] || buttonConfigs.CLOSED;

  if (current.isAdmin) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Checkbox
            id="copy"
            checked={copyDetail}
            onCheckedChange={(checked) => setCopyDetail(!!checked)}
          />
          <label
            htmlFor="copy"
            className="text-base text-gray-900 font-medium cursor-pointer"
          >
            모임 내용 텍스트 함께 복사하기
          </label>
        </div>
        <span className="text-base text-gray-400 font-mono tracking-tighter">
          {joinLink}
        </span>
        <Button
          variant="moiming"
          size="xl"
          onClick={onCopyLink}
          className="w-full px-6 flex"
        >
          <LinkIcon className="w-5 h-5" /> 링크 복사하기
        </Button>
      </>
    );
  }

  if (current.isCancel) {
    return (
      <>
        <span className="text-base text-gray-900 font-medium">
          {remainingTime}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="moimingOutline"
              size="xl"
              className="w-full px-6 flex text-red-500 border-red-200 hover:bg-red-50"
            >
              {current.text}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[2rem]">
            <AlertDialogHeader>
              <AlertDialogTitle>취소하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                취소 후 선착 마감된 경우, 신청이 어려울 수 있습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                신청 유지하기
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onCancel}
                className="bg-primary text-white hover:bg-primary/90 rounded-xl"
              >
                취소하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <span className="text-base text-gray-900 font-medium">
        {remainingTime}
      </span>
      <Button
        variant={current.variant}
        size="xl"
        disabled={current.disabled}
        onClick={onJoin}
        className="w-full px-6 flex"
      >
        {current.text}
      </Button>
    </>
  );
}
