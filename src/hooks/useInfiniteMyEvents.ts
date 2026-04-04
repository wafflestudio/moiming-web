import getMyEvents from '@/api/events/me';
import type { MyEventsResponse } from '@/types/events';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useInfiniteMyEvents(enabled = true) {
  return useInfiniteQuery<MyEventsResponse, Error>({
    queryKey: ['myEvents'],
    queryFn: async ({ pageParam = undefined }) => {
      const { data } = await getMyEvents(pageParam as string | undefined);
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.nextCursor;
      }
      return undefined;
    },
    initialPageParam: undefined,
    enabled,
  });
}
