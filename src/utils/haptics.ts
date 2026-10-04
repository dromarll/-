/**
 * Haptic feedback utility using the Navigator.vibrate API
 * Mimics iOS Taptic Engine and watchOS haptic feedback patterns
 */

export type HapticPattern =
  | 'selection'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'notification'
  | 'cameraShutter'
  | 'radarPing'
  | 'heartbeat';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  selection: 10,
  light: 15,
  medium: 30,
  heavy: 55,
  cameraShutter: [40, 20, 25],
  radarPing: [25, 45, 25],
  heartbeat: [35, 70, 45],
  notification: [30, 40, 50, 40, 60],
  success: [20, 40, 35],
  warning: [40, 60, 40],
  error: [50, 35, 50, 35, 70],
};

export const triggerHaptic = (pattern: HapticPattern = 'light') => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      const vibrationPattern = HAPTIC_PATTERNS[pattern];
      navigator.vibrate(vibrationPattern);
    } catch {
      // Vibration not permitted or supported in this context
    }
  }
};

/**
 * React hook for consuming haptics in components
 */
export function useHaptics() {
  const trigger = (pattern: HapticPattern = 'light') => {
    triggerHaptic(pattern);
  };

  return {
    trigger,
    selection: () => triggerHaptic('selection'),
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
    notification: () => triggerHaptic('notification'),
    cameraShutter: () => triggerHaptic('cameraShutter'),
    radarPing: () => triggerHaptic('radarPing'),
    heartbeat: () => triggerHaptic('heartbeat'),
  };
}
