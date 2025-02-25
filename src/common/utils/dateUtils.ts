import { format, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 포맷팅 안전하게 처리하는 함수
export const safeFormatDate = (
  dateString: string | undefined | null,
  formatString: string = 'yyyy.MM.dd HH:mm',
  fallbackText: string = '-'
) => {
  if (!dateString) return fallbackText;
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return fallbackText;
    return format(date, formatString, { locale: ko });
  } catch (error) {
    console.error('날짜 형식 오류:', dateString, error);
    return fallbackText;
  }
}; 