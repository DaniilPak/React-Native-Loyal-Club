import { Vibration } from 'react-native';

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

export function formatToClassicDateStyle(targetDateStr: string): string {
  const targetDate = new Date(targetDateStr);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = targetDate.getTime() - currentDate.getTime();

  // Calculate the remaining days
  const daysLeft = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  // Get the target date components
  const targetDay = targetDate.getDate();
  const targetMonth = targetDate.getMonth() + 1; // Months are 0-based, so add 1
  const targetYear = targetDate.getFullYear();

  // Format the result as a string in "DD.MM.YYYY" format
  const formattedResult = `${targetDay.toString().padStart(2, '0')}.${targetMonth
    .toString()
    .padStart(2, '0')}.${targetYear}`;

  return formattedResult;
}
