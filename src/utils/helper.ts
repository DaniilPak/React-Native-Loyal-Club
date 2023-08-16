import { Vibration } from 'react-native';

export async function triggerVibration() {
  // Trigger vibration
  Vibration.vibrate(300);
}
