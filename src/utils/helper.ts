import { Vibration } from 'react-native';
import moment from 'moment';

export async function triggerVibration() {
  // Trigger vibration
  Vibration.vibrate(300);
}

export function timeLeftUntilDate(targetDateStr: string): string {
  const targetDate = new Date(targetDateStr);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = targetDate.getTime() - currentDate.getTime();

  // Calculate the remaining days, hours, and minutes
  const daysLeft = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

  // Format the result as a string
  const formattedResult = `${daysLeft} дней ${hoursLeft} часов ${minutesLeft} мин`;

  return formattedResult;
}

export function formatToClassicDateStyle(targetDate: string): string {
  return moment(targetDate).format('DD.MM.YYYY');
}

export function formatToClassicDateStyleWithTime(targetDate: any) {
  return moment(targetDate).format('DD.MM.YYYY HH:mm');
}
