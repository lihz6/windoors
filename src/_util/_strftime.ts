type Data = {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
};
type Pad = (n: number) => string;
type Formater<T> = (data: Data, pad: Pad) => T;

export default function strftime(timestamp: number): string;
export default function strftime<T>(timestamp: number, format: Formater<T>): T;
export default function strftime(timestamp: any, format: any = longFormat) {
  const date = new Date(timestamp);
  const data = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
  const pad: Pad = n => `0${n}`.slice(-2);
  return format(data, pad);
}

export const shortFormat: Formater<string> = (
  { month, date, hour, minute },
  pad
) => `${pad(month)}-${pad(date)} ${pad(hour)}:${pad(minute)}`;

export const longFormat: Formater<string> = (
  { year, month, date, hour, minute },
  pad
) => `${year}年${month}月${date}日 ${pad(hour)}:${pad(minute)}`;

function getAccordToday(date: Date) {
  const _year = date.getFullYear();
  const _month = date.getMonth() + 1;
  const _date = date.getDate();
  const _hour = date.getHours();
  return (year: number, month: number, date: number) => {
    if (_hour > 20) {
      accordToday = getAccordToday(new Date());
    }
    if (year === _year) {
      if (month === _month) {
        switch (_date - date) {
          case 0:
            return '';
          case 1:
            return '昨天';
          default:
            return `${date}日`;
        }
      }
      return `${month}月${date}日`;
    }
    return `${year}年${month}月${date}日`;
  };
}

let accordToday = getAccordToday(new Date());

function getTime(hour: number, minute: number, pad: Pad) {
  if (hour < 6) {
    return `凌晨 ${hour}:${pad(minute)}`;
  }
  if (hour < 12) {
    return `早上 ${hour}:${pad(minute)}`;
  }
  if (hour < 18) {
    return `下午 ${hour - 12}:${pad(minute)}`;
  }
  return `晚上 ${hour - 12}:${pad(minute)}`;
}
export const chatFormat: Formater<string> = (
  { year, month, date, hour, minute },
  pad
) => `${accordToday(year, month, date)}${getTime(hour, minute, pad)}`;
