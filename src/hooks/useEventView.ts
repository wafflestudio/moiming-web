import type { EventDetailResponse, EventViewType } from '@/types/events';
import { useMemo } from 'react';

export default function useEventView(
  data: EventDetailResponse | null
): EventViewType {
  return useMemo(() => {
    if (!data) return 'CLOSED';

    const { event, viewer, capabilities } = data;
    const now = new Date();

    if (viewer.status === 'HOST')
      // 1. 관리자 뷰: shareLink 권한이 있다면 다른 상태보다 최우선
      return 'ADMIN';

    if (viewer.status === 'BANNED')
      // 2. 차단 유저: 시스템에 의해 차단된 경우
      return 'BANNED';

    if (viewer.status === 'CONFIRMED')
      // 3. 이미 신청한 유저 (CONFIRMED 또는 WAITLISTED)
      // 기간이 종료되었더라도 본인이 신청했다면 신청 상태를 먼저 보여줘야 합니다 (취소 가능성 때문)
      return 'CONFIRMED';
    if (viewer.status === 'WAITLISTED') return 'WAITLISTED';

    if (viewer.status === 'CANCELED')
      // 취소한 유저
      return 'CANCELED';

    if (capabilities.apply)
      // 4. 신청/대기 가능 여부 확인 (capabilities 기반)
      return 'APPLY';
    if (capabilities.wait) return 'WAITLIST';

    if (
      event.registrationStartsAt &&
      now < new Date(event.registrationStartsAt)
    ) {
      // 5. 신청이 불가능한 경우 (capabilities.apply/wait가 모두 false일 때) 이유 판별

      // 5-1. 모집 시작 전인 경우
      return 'UPCOMING';
    }

    if (event.registrationEndsAt && now > new Date(event.registrationEndsAt)) {
      // 5-2. 모집 기간이 종료된 경우
      return 'ENDED';
    }

    // 5. 기본값: 모집 마감 혹은 접근 권한 없음
    return 'CLOSED';
  }, [data]);
}
