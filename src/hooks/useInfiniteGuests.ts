import { getGuests } from '@/api/events/registrations';
import type { GuestsParams, GuestsResponse } from '@/types/events';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseInfiniteGuestsProps {
  eventId: string;
  filters: Omit<GuestsParams, 'cursor'>;
}

export default function useInfiniteGuests({
  eventId,
  filters,
}: UseInfiniteGuestsProps) {
  return useInfiniteQuery<
    GuestsResponse,
    Error,
    InfiniteData<GuestsResponse>,
    (string | object)[],
    number | undefined
  >({
    // 필터 조건이 바뀔 때마다 새로운 쿼리로 인식하도록 설정
    queryKey: ['guests', eventId, filters],

    queryFn: async ({ pageParam }) => {
      const response = await getGuests(eventId, {
        ...filters,
        cursor: pageParam,
      });
      return response.data;
    },

    // 첫 페이지 호출 시 cursor는 없으므로 undefined, 타입은 number로 명시
    initialPageParam: undefined as number | undefined,

    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
}
