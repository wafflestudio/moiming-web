import { motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  // Dot,
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
import { EventDetailContent } from '@/components/EventDetailContent';
import GuestsPreview from '@/components/GuestsPreview';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Subheader from '@/components/Subheader';
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
import { Separator } from '@/components/ui/separator';
import type { DetailedEvent, EventViewType } from '@/types/events';
import { formatEventDate, getRemainingTime } from '@/utils/date';

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
        <div className="bg-red-50 p-4 rounded-full text-destructive">
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

  const getRegistrationStatus = (event: DetailedEvent) => {
    const now = new Date();
    const startDate = new Date(event.registrationStartsAt);
    const endDate = new Date(event.registrationEndsAt);

    if (now < startDate) return '모집 전';
    if (endDate <= now) return '모집 종료';
    return '모집 중';
  };

  return (
    <div
      className={`flex flex-col ${view === 'ADMIN' ? 'pb-47' : 'pb-38 py-6'}`}
    >
      {/* 1. 상단 네비게이션 */}
      {view === 'ADMIN' && (
        <Subheader
          title="상세보기"
          onBackClick={() => navigate('/')}
          dropdownOptions={{
            onEditClick: () => navigate('edit'),
            onDeleteClick: onDeleteClick,
          }}
        />
      )}

      {/* 2. 메인 콘텐츠 */}
      <div className="flex flex-col px-4 gap-6 max-w-2xl mx-auto w-full">
        {/* 상태 안내 배너 */}
        <StatusBanner
          view={view}
          waitingNum={viewer.waitlistPosition}
          name={viewer.name}
          email={viewer.reservationEmail}
        />

        <section className="flex flex-col gap-4">
          {/* 주최자 정보 영역 */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={creator.profileImage} />
                <AvatarFallback>{creator.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <div className="flex gap-2">
                  <span className="body-strong text-[#757575]">
                    {creator.name}
                  </span>
                  <div className="flex rounded-md bg-[#E3F2FD] p-[5.5px]">
                    <span className="tag-base text-[#183057]">모임장</span>
                  </div>
                </div>
                <span className="body-small text-[#757575]">
                  {creator.email}
                </span>
                <div className="flex body-base">
                  {/* TODO: 모임 생성일시도 요청
                <span className="text-[#42A5F5]">15분 전 작성</span>
                <Dot className="text-muted-foreground" />
                */}
                  <span className="text-[#42A5F5]">
                    {getRegistrationStatus(event)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 이벤트 상세 내용 */}
          <EventDetailContent view={view} event={event} />
        </section>

        {/* 참여자 명단 섹션 */}
        <GuestsPreview
          guests={guestsPreview}
          totalCount={event.totalApplicants}
          eventId={event.publicId}
        />
      </div>

      {/* 3. 블러 푸터 (권한별 분기) */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="h-16 bg-gradient-to-t from-white to-transparent" />
        <div className="bg-white/90 backdrop-blur-xl px-6 pb-10 pt-2 flex flex-col items-center gap-2 pointer-events-auto">
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
      icon: <Check className="text-white size-5" />,
      bg: 'bg-ring',
      text: '신청이 완료되었습니다.',
    },
    WAITLISTED: {
      icon: <Loader className="text-white size-5" />,
      bg: 'bg-[#009951]',
      text: `${waitingNum}번째로 대기 완료되었습니다.`,
    },
    CANCELED: {
      icon: <X className="text-white size-5" />,
      bg: 'bg-destructive',
      text: '취소가 완료되었습니다.',
    },
    BANNED: {
      icon: <X className="text-white size-5" />,
      bg: 'bg-destructive',
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
      <div className="flex flex-col items-start gap-6">
        <div className="flex items-center gap-2">
          <div
            className={`size-9 rounded-full flex items-center justify-center ${current.bg}`}
          >
            {current.icon}
          </div>
          <h1 className="text-gray-900">{current.text}</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="body-small text-gray-900">예약자명</p>
            <p className="single-line-body-base text-gray-900">{name}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="body-small text-gray-900">예약정보 전달 이메일</p>
            <p className="single-line-body-base text-gray-900">{email}</p>
          </div>
        </div>

        <Separator />
      </div>
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
              className="w-full px-6 flex text-destructive border-red-200 hover:bg-red-50"
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
