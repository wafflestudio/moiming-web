import type { EventViewType } from '@/types/events';

export const formatEventDate = (
  dateString: number | string | null | undefined, // number 타입 추가
  fallback: string = '미정'
): string => {
  if (!dateString) return fallback;

  const date = new Date(dateString);

  // 유효하지 않은 날짜 체크
  if (isNaN(date.getTime())) return fallback;

  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // 요일 계산
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day}(${weekDay}) ${hours}:${minutes}`;
};

function getShortenedDate(isoDate: string) {
  return new Date(isoDate).toLocaleString('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
    hour12: false,
  });
}

export function getPeriod(
  startIsoDate: string | undefined,
  endIsoDate: string | undefined
) {
  if (!startIsoDate && !endIsoDate) return '미정';

  const startDate = startIsoDate ? getShortenedDate(startIsoDate) : '';
  const endDate = endIsoDate ? getShortenedDate(endIsoDate) : '';
  return `${startDate} ~ ${endDate}`.trim();
}

export const getRemainingTime = (
  view: EventViewType,
  endTime: string,
  startTime?: string
) => {
  const now = new Date();
  const end = new Date(endTime);
  const diffInMs = end.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours <= 0) return '모집 종료';

  if (view === 'ENDED' || view === 'CLOSED') return '모집 종료';

  if (view === 'UPCOMING') {
    if (!startTime) return '모집 예정';

    const start = new Date(startTime);
    const stDiffInMs = start.getTime() - now.getTime();
    const stDiffInHours = stDiffInMs / (1000 * 60 * 60);

    if (stDiffInHours < 24) {
      return `${Math.floor(stDiffInHours)}시간 뒤 모집 시작`;
    } else {
      const stDiffInDays = Math.floor(stDiffInHours / 24);
      return `${stDiffInDays}일 뒤 모집 시작`;
    }
  }

  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}시간 뒤 모집 종료`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 뒤 모집 종료`;
  }
};
