import * as Haptics from 'expo-haptics';

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'success' | 'warning' | 'error';

class HapticManagerClass {
  private enabled: boolean = true;

  async impact(style: ImpactStyle = 'medium'): Promise<void> {
    if (!this.enabled) return;

    const styleMap: Record<ImpactStyle, Haptics.ImpactFeedbackStyle> = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
      rigid: Haptics.ImpactFeedbackStyle.Rigid,
      soft: Haptics.ImpactFeedbackStyle.Soft,
    };

    try {
      await Haptics.impactAsync(styleMap[style]);
    } catch (error) {
      // Haptics not available on this device
    }
  }

  async notification(type: NotificationType = 'success'): Promise<void> {
    if (!this.enabled) return;

    const typeMap: Record<NotificationType, Haptics.NotificationFeedbackType> = {
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
      error: Haptics.NotificationFeedbackType.Error,
    };

    try {
      await Haptics.notificationAsync(typeMap[type]);
    } catch (error) {
      // Haptics not available on this device
    }
  }

  async selection(): Promise<void> {
    if (!this.enabled) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Haptics not available on this device
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const HapticManager = new HapticManagerClass();
export type { ImpactStyle, NotificationType };
