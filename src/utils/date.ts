export const formatEventDate = (
  dateString: number | string | null | undefined, // number 타입 추가
  fallback: string = '미정'
): string => {
  if (!dateString) return fallback;

  const date = new Date(dateString);

  // 유효하지 않은 날짜 체크
  if (isNaN(date.getTime())) return fallback;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // 요일 계산
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day}(${weekDay}) ${hours}:${minutes}`;
};

export const getShortenedDate = (dateString: number | string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '미정';

  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());

  const hours = String(date.getHours());
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}월 ${day}일 ${hours}:${minutes}`;
};
