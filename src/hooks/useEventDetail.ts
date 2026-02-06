import { deleteEvent, getEventDetail } from '@/api/events/event';
import { getGuests, joinEvent } from '@/api/events/registrations';
import {
  getRegistrationDetail,
  patchRegistration,
} from '@/api/registrations/registration';
import useAuthStore from '@/hooks/useAuthStore';
import type { EventDetailResponse, JoinEventRequest } from '@/types/events';
import type { Guest } from '@/types/schemas';
import { isAxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

export default function useEventDetail(id?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [data, setData] = useState<EventDetailResponse | null>(null);
  const [searchParams] = useSearchParams();
  const [guests, setGuests] = useState<Guest[]>([]);

  // 1. 유저 식별용 ID 확보 (URL 파라미터 우선, 없으면 Zustand 스토어)
  const urlRegId = searchParams.get('regId');
  const guestRegId = useAuthStore((state) =>
    id ? state.guestRegistrations[id] : null
  );
  const effectiveRegId = urlRegId || guestRegId;

  // 2. 일정 상세 정보 로드 핸들러
  const handleFetchDetail = useCallback(
    async (eventId: string) => {
      setLoading(true);
      setIsDeleted(false);
      try {
        // (1) 기본 일정 정보 가져오기
        const eventRes = await getEventDetail(eventId);
        let mergedData = eventRes.data;

        // (2) 모임 이름을 페이지 제목으로 설정
        if (mergedData.event.title) {
          document.title = `${mergedData.event.title} - 모이밍`;
        } else {
          document.title = '일정 상세 - 모이밍';
        }

        if (mergedData.viewer.status === 'NONE' && effectiveRegId) {
          // (3) 비로그인 유저(NONE)인데 식별 ID가 있는 경우 유저 정보 추가 로드
          try {
            const regRes = await getRegistrationDetail(effectiveRegId);

            // 데이터 병합: 기존 event 정보는 유지하고 viewer와 capabilities를 유저 정보로 갱신
            mergedData = {
              ...mergedData,
              viewer: {
                ...mergedData.viewer,
                status: regRes.status,
                waitlistPosition: regRes.waitlistPosition,
                registrationPublicId: regRes.registrationPublicId,
                reservationEmail: regRes.reservationEmail,
              },
              capabilities: {
                ...mergedData.capabilities,
                cancel: true, // 내 정보를 조회했다는 것은 취소 권한이 있다는 의미
                apply: false, // 이미 신청했으므로 신청 버튼은 비활성화
                wait: false,
              },
            };
          } catch (regError) {
            // ID가 만료되었거나 잘못된 경우 조용히 기본 정보를 보여줌 (NONE 상태 유지)
            console.error('Failed to fetch guest registration info:', regError);
          }
        }

        setData(mergedData);
        return mergedData.viewer.status;
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setIsDeleted(true);
        } else {
          console.error('Fetch event detail failed:', error);
          toast.error('일정 정보를 불러오지 못했습니다.');
        }
        return 'ERROR';
      } finally {
        setLoading(false);
      }
    },
    [effectiveRegId]
  );

  // 3. 참여자 전체 명단 로드 핸들러
  const handleFetchRegistrations = useCallback(async (eventId: string) => {
    setLoading(true);
    try {
      const data = await getGuests(eventId);
      setGuests(data.data.participants);
    } catch (error: unknown) {
      console.error('Fetch registrations error:', error);
      toast.error('참여자 명단을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. 참여 신청 로직 핸들러
  const handleJoinEvent = async (
    id: string,
    data: JoinEventRequest
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { status } = await joinEvent(id, data);
      return status === 200 || status === 201;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('이미 신청이 완료된 모임입니다.');
      } else {
        toast.error('신청 처리 중 오류가 발생했습니다.');
      }
      console.error('Join event error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 5. 참여 취소 로직 핸들러
  const handleCancelEvent = async (registrationId: string) => {
    setLoading(true);
    try {
      await patchRegistration(registrationId, {
        status: 'CANCELED',
      });
      if (id) await handleFetchDetail(id);
      return true;
    } catch (error) {
      toast.error('취소 처리 중 오류가 발생했습니다.');
      console.error('Cancel event error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 6. 일정 삭제 로직 핸들러
  const handleDeleteEvent = async (eventId: string) => {
    setLoading(true);
    try {
      await deleteEvent(eventId);
      return true;
    } catch (error: unknown) {
      toast.error('일정 삭제 중 오류가 발생했습니다.');
      console.error('Delete event error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 7. 참여 강제 취소 로직 핸들러
  const handleBanEvent = async (registrationId: string) => {
    setLoading(true);
    try {
      await patchRegistration(registrationId, {
        status: 'BANNED',
      });
      if (id) await handleFetchDetail(id);
      return true;
    } catch (error) {
      toast.error('취소 처리 중 오류가 발생했습니다.');
      console.error('Ban event error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    isDeleted,
    guests,
    handleFetchDetail,
    handleFetchRegistrations,
    handleJoinEvent,
    handleCancelEvent,
    handleDeleteEvent,
    handleBanEvent,
  };
}
