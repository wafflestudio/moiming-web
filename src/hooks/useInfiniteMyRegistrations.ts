import getMyRegistrations from '@/api/registrations/me';
import type { MyRegistrationsResponse } from '@/types/registrations';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useInfiniteMyRegistrations(enabled = true) {
  return useInfiniteQuery<MyRegistrationsResponse, Error>({
    queryKey: ['myRegistrations'],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const data = await getMyRegistrations(pageParam as number, 5);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // API size specification: 5
      if (
        !lastPage ||
        !lastPage.registrations ||
        lastPage.registrations.length < 5
      ) {
        return undefined; // No more pages
      }
      return allPages.length; // Next page number (0-indexed)
    },
    enabled,
  });
}
