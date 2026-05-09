import { createEvent as createEventApi } from '@/api/events/event';
import type { CreateEventRequest, CreateEventResponse } from '@/types/events';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useEvent() {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateEventResponse, Error, CreateEventRequest>({
    mutationFn: async (data) => {
      const response = await createEventApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['myEvents'] });
    },
  });

  return {
    loading: mutation.isPending,
    createEvent: mutation.mutateAsync,
  };
}
