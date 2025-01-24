/**
 * 날짜를 문자열로 변환
 */
export const dateToString = (date: Date, separator: string = '-') => {
  const year = String(date.getFullYear());
  const month = String(`0${date.getMonth() + 1}`.slice(-2));
  const day = String(`0${date.getDate()}`.slice(-2));

  return `${year}${separator}${month}${separator}${day}`;
};

/**
 * 오늘 날짜 반환
 * 2022-01-25
 */
export const getToday = () => {
  const today = new Date();
  return dateToString(today, '-');
};

/**
 * 현재 시각 반환
 * 15:14:23
 */
export const getCurrentTime = () => {
  const today = new Date();

  const hour = String(today.getHours());
  const minute = String(today.getMinutes());
  const second = String(today.getSeconds());

  return `${hour}:${minute}:${second}`;
};

/**
 * time 문자열을 Date 객체로 생성한 뒤 yyyy-MM-dd am/pm hh:mm 형식으로 변환
 * 2023-08-31 오후 1:30
 */
export const getFormattedTimeString = (time: string) => {
  const timeDate = new Date(time);

  const year = timeDate.getFullYear();
  const month = `0${(timeDate.getMonth() + 1).toString()}`.slice(-2);
  const date = `0${timeDate.getDate().toString()}`.slice(-2);
  const ampm = timeDate.getHours() >= 12 ? '오후' : '오전';
  const hours = (timeDate.getHours() % 12 || 12).toString();
  const minutes =
    timeDate.getMinutes() < 10 ? `0${timeDate.getMinutes().toString()}` : timeDate.getMinutes().toString();

  return `${year}-${month}-${date} ${ampm} ${hours}:${minutes}`;
};

/**
 * 파일이 지금으로부터 얼마 전에 만들어졌는지 나타내는 문자열 생성.
 *
 * @param timestamp 파일의 생성 시간 (서버에서 생성된 시간)
 * @returns 지금으로부터 얼마 전에 만들어졌는지 나타내는 string
 */
export const getTimeAgo = (timestamp?: string): string => {
  if (!timestamp) {
    return '';
  }
  const date = new Date(timestamp);

  /**
   * hunmin_park
   * 현재 서버 상에서는 DB에 한국 시간 대신 UTC 시간이 저장되는 걸로 추정하여, 시간 보정.
   * 배포 모드에서만 보정 적용.
   * (임시적인 처리이므로 추후 서버 쪽에서 해결해야함.)
   */
  const timezoneOffset = 0; // getProgramMode() === 'Development' ? 0 : 9;
  date.setHours(date.getHours() + timezoneOffset);

  const timeDiff = Number(new Date()) - Number(date);

  if (timeDiff > 7 * 24 * 60 * 60 * 1000) {
    return `${timestamp.split(' ')[0].replace(/-/g, '.')} 작업`;
  }
  if (timeDiff > 24 * 60 * 60 * 1000) {
    return `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))}일 전 작업`;
  }
  if (timeDiff > 60 * 60 * 1000) {
    return `${Math.floor(timeDiff / (60 * 60 * 1000))}시간 전 작업`;
  }
  if (timeDiff > 60 * 1000) {
    return `${Math.floor(timeDiff / (60 * 1000))}분 전 작업`;
  }

  return '방금 전';
};
