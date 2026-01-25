import { getEventDetail } from '@/api/events/event';
import { getGuests, joinEvent } from '@/api/events/registrations';
import type {
  DetailedEvent,
  JoinEventRequest,
  ViewerStatus,
} from '@/types/events';
import type { Guest } from '@/types/schemas';
import { isAxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type EventFetchStatus = ViewerStatus | 'NOT_FOUND' | 'ERROR';

export default function useEventDetail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<DetailedEvent | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  // 1. 일정 상세 정보 로드 핸들러
  const handleFetchDetail = useCallback(
    async (id: string): Promise<EventFetchStatus> => {
      setLoading(true);
      try {
        const [eventRes, guestsRes] = await Promise.all([
          getEventDetail(id),
          getGuests(id),
        ]);
        setEvent(eventRes.data.event);
        setGuests(guestsRes.data.participants);

        return eventRes.data.viewer.status;
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (error.response?.status === 404) return 'NOT_FOUND';
        }
        console.error('Fetch event detail failed:', error);
        toast.error('일정 정보를 불러오지 못했습니다.');
        return 'ERROR';
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 2. 참여자 전체 명단 로드 핸들러
  const handleFetchRegistrations = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await getGuests(id);
      setGuests(data.data.participants);
    } catch (error: unknown) {
      console.error('Fetch registrations error:', error);
      toast.error('참여자 명단을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. 참여 신청 로직 핸들러
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

  const confirmedCount = guests.filter((r) => r.status === 'CONFIRMED').length;

  return {
    loading,
    event,
    registrations: guests,
    confirmedCount,
    handleFetchDetail,
    handleFetchRegistrations,
    handleJoinEvent,
  };
}
