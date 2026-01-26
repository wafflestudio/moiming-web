import GuestsPreview from '@/components/GuestsPreview';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import EventDetailContent from '../components/EventDetailContent';
import useAuth from '../hooks/useAuth';
import useEventDetail from '../hooks/useEventDetail';

export default function JoinEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    loading,
    event,
    registrations,
    confirmedCount,
    handleFetchDetail,
    handleJoinEvent,
  } = useEventDetail();

  // 초기 데이터 로드 및 리다이렉션 로직
  useEffect(() => {
    if (!id) return;

    const init = async () => {
      const status = await handleFetchDetail(id);

      // 백엔드 상태 코드 기반 분기 처리
      switch (status) {
        case 'HOST':
          // 관리자라면 관리자 전용 상세 페이지로 리다이렉트
          navigate(`/event/${id}`, { replace: true });
          break;
        case 'CONFIRMED':
          // 이미 신청한 사람이라면 성공 페이지로 리다이렉트
          navigate(`/join/${id}/success`, { replace: true });
          break;
        case 'WAITLISTED':
          // 이미 신청한 사람이라면 성공 페이지로 리다이렉트
          navigate(`/join/${id}/success`, { replace: true });
          break;
        case 'NOT_FOUND':
          navigate('/', { replace: true });
          break;
        case 'ERROR':
          // 에러 시 알림은 훅에서 toast로 처리하므로 메인으로만 이동
          navigate('/');
          break;
        default:
          // 'GUEST' (200 OK)인 경우에만 페이지에 머무름
          break;
      }
    };

    init();
  }, [id, handleFetchDetail, navigate]);

  // 신청하기 버튼 핸들러
  const onJoinClick = async () => {
    if (!id) return;

    // 로그인 되어 있지 않으면 참여 신청 페이지(폼 입력)로 이동
    if (!isLoggedIn) {
      return navigate(`/join/${id}/register`);
    }

    // 로그인 되어 있으면 즉시 API 호출
    const success = await handleJoinEvent(id, {});

    if (success) {
      navigate(`/join/${id}/success`);
    }
  };

  // 로딩 중이거나 데이터가 아직 없을 때 (리다이렉트 판단 전) 스피너나 빈 화면 표시
  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative pb-20">
      {/* 상단 네비게이션 */}
      <div className="w-full flex justify-center">
        <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center px-6 py-8">
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
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] px-6 flex flex-col gap-10">
        {/* 일정 정보 */}
        <EventDetailContent
          schedule={event}
          currentParticipants={confirmedCount}
        />

        {/* 신청하기 버튼*/}
        <Button
          onClick={onJoinClick}
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-black text-white text-xl font-bold"
        >
          {loading ? '처리 중...' : '신청하기'}
        </Button>

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
