# Combo Multiplier System Code Patterns

## ComboManager Class

```typescript
import { HapticManager, AudioManager, ParticleManager } from '@expo-games/game-engine';

interface ComboTier {
  min: number;
  multiplier: number;
  name: string;
  color: string;
}

interface ComboState {
  count: number;
  multiplier: number;
  tier: ComboTier;
  timeRemaining: number;
  maxTime: number;
  varietyActions: Set<string>;
  actionRepeatCount: Map<string, number>;
  personalBest: number;
  sessionBest: number;
  isInRecovery: boolean;
  recoveryCombo: number;
}

class ComboManager {
  private state: ComboState;
  private onStateChange: (state: ComboState) => void;
  private onMilestone: (count: number) => void;
  private onTierUp: (tier: ComboTier) => void;
  private onBreak: (finalCount: number, nextMilestone: number) => void;

  static readonly TIERS: ComboTier[] = [
    { min: 1,   multiplier: 1,  name: '',           color: '#FFFFFF' },
    { min: 5,   multiplier: 2,  name: 'Nice!',      color: '#FFD700' },
    { min: 10,  multiplier: 3,  name: 'Great!',     color: '#FFA500' },
    { min: 15,  multiplier: 4,  name: 'Awesome!',   color: '#FF4444' },
    { min: 25,  multiplier: 5,  name: 'Amazing!',   color: '#AA44FF' },
    { min: 50,  multiplier: 8,  name: 'Incredible!', color: '#4488FF' },
    { min: 100, multiplier: 10, name: 'LEGENDARY!', color: '#FFD700' },
  ];

  static readonly MILESTONES = [5, 10, 25, 50, 100];

  static readonly MILESTONE_BONUSES: Record<number, number> = {
    5: 500, 10: 2000, 25: 5000, 50: 10000, 100: 25000,
  };

  static getTimeWindow(count: number): number {
    if (count >= 31) return 1.0;
    if (count >= 16) return 1.5;
    if (count >= 6) return 2.0;
    return 2.5;
  }

  static getTier(count: number): ComboTier {
    for (let i = this.TIERS.length - 1; i >= 0; i--) {
      if (count >= this.TIERS[i].min) return this.TIERS[i];
    }
    return this.TIERS[0];
  }

  static getNextMilestone(count: number): number | null {
    for (const milestone of this.MILESTONES) {
      if (count < milestone) return milestone;
    }
    return null;
  }

  registerAction(actionType: string, isPerfect: boolean = false): number {
    if (this.state.isInRecovery) {
      this.state.count = this.state.recoveryCombo;
      this.state.isInRecovery = false;
      this.triggerRecoveryCelebration();
    }

    this.state.count++;
    this.state.varietyActions.add(actionType);

    const repeatCount = (this.state.actionRepeatCount.get(actionType) || 0) + 1;
    this.state.actionRepeatCount.set(actionType, repeatCount);

    this.state.maxTime = ComboManager.getTimeWindow(this.state.count);
    this.state.timeRemaining = this.state.maxTime;
    if (isPerfect) this.state.timeRemaining += 0.5;

    const newTier = ComboManager.getTier(this.state.count);
    if (newTier.multiplier > this.state.tier.multiplier) {
      this.state.tier = newTier;
      this.onTierUp?.(newTier);
    }

    if (ComboManager.MILESTONES.includes(this.state.count)) {
      this.onMilestone?.(this.state.count);
    }

    if (this.state.count > this.state.sessionBest) {
      this.state.sessionBest = this.state.count;
    }
    if (this.state.count > this.state.personalBest) {
      this.state.personalBest = this.state.count;
      this.triggerNewPersonalBest();
    }

    this.triggerComboFeedback(actionType, repeatCount);
    this.onStateChange?.(this.state);

    return this.calculatePointsModifier(repeatCount);
  }

  private calculatePointsModifier(repeatCount: number): number {
    const varietyBonus = this.state.varietyActions.size >= 3 ? 1.5 :
                         this.state.varietyActions.size >= 2 ? 1.25 : 1.0;

    const spamPenalty = repeatCount <= 2 ? 1.0 :
                        repeatCount === 3 ? 0.75 :
                        repeatCount === 4 ? 0.5 : 0.25;

    return this.state.tier.multiplier * varietyBonus * spamPenalty;
  }

  update(deltaTime: number): void {
    if (this.state.count === 0) return;

    this.state.timeRemaining -= deltaTime;

    const percentRemaining = this.state.timeRemaining / this.state.maxTime;
    if (percentRemaining <= 0.25 && percentRemaining > 0.1) {
      this.triggerTimerWarning('urgent');
    } else if (percentRemaining <= 0.5 && percentRemaining > 0.25) {
      this.triggerTimerWarning('warning');
    }

    if (this.state.timeRemaining <= 0) {
      this.breakCombo();
    }

    this.onStateChange?.(this.state);
  }

  private breakCombo(): void {
    const finalCount = this.state.count;
    const nextMilestone = ComboManager.getNextMilestone(finalCount);

    if (finalCount >= 10) {
      this.state.isInRecovery = true;
      this.state.recoveryCombo = Math.floor(finalCount / 2);
      this.state.recoveryCombo = Math.max(
        this.state.recoveryCombo,
        finalCount >= 50 ? 25 : finalCount >= 25 ? 12 : 5
      );

      setTimeout(() => {
        if (this.state.isInRecovery) {
          this.state.isInRecovery = false;
          this.finalizeBreak(finalCount, nextMilestone);
        }
      }, finalCount >= 50 ? 2500 : 2000);
    } else {
      this.finalizeBreak(finalCount, nextMilestone);
    }
  }

  private finalizeBreak(finalCount: number, nextMilestone: number | null): void {
    this.state.count = 0;
    this.state.multiplier = 1;
    this.state.tier = ComboManager.TIERS[0];
    this.state.timeRemaining = 0;
    this.state.varietyActions.clear();
    this.state.actionRepeatCount.clear();

    this.onBreak?.(finalCount, nextMilestone);
    this.triggerBreakFeedback(finalCount, nextMilestone);
  }
}
```

## Feedback Integration

```typescript
class ComboFeedbackController {
  private haptics: HapticManager;
  private audio: AudioManager;
  private particles: ParticleManager;

  triggerActionFeedback(count: number, tier: ComboTier): void {
    const intensity = Math.min(count / 50, 1.0);

    const hapticType = intensity < 0.3 ? 'light' :
                       intensity < 0.6 ? 'medium' : 'heavy';
    this.haptics.impact(hapticType, 0.3 + intensity * 0.7);

    this.audio.play('combo_hit', {
      pitch: 1.0 + intensity * 0.3,
      volume: 0.7 + intensity * 0.3,
    });

    if (count >= 10) {
      this.particles.burst('combo_sparkle', {
        count: Math.floor(intensity * 15),
        color: tier.color,
      });
    }
  }

  triggerMilestoneCelebration(milestone: number, tier: ComboTier): void {
    this.screenFlash(tier.color, 100);
    this.haptics.notification('success');
    this.audio.play(`callout_${tier.name.toLowerCase().replace('!', '')}`);
    this.particles.burst('milestone_ring', { count: milestone / 2, color: tier.color });
    this.showMilestoneText(tier.name);

    if (milestone >= 25) {
      this.screenShake(milestone >= 50 ? 8 : 4, 200);
    }
    if (milestone >= 50) {
      this.cameraZoomPunch(1.05, 150);
    }
  }

  triggerBreakFeedback(count: number, nextMilestone: number | null): void {
    this.particles.burst('counter_shatter', { count: 10 });
    this.audio.play('combo_break');
    this.haptics.impact('heavy', 0.6);
    this.audio.duckMusic(0.7, 500);

    if (nextMilestone && count >= nextMilestone * 0.7) {
      const remaining = nextMilestone - count;
      this.showAlmostMessage(`${remaining} more for ${ComboManager.getTier(nextMilestone).name}`);
    }
  }
}
```

## UI Component

```typescript
interface ComboCounterProps {
  state: ComboState;
}

function ComboCounter({ state }: ComboCounterProps) {
  const { count, tier, timeRemaining, maxTime } = state;

  const scale = 1 + (Math.min(count, 100) / 100) * 1.0;
  const timerPercent = timeRemaining / maxTime;
  const isUrgent = timerPercent < 0.25;

  const nextTier = ComboManager.TIERS.find(t => t.min > count);
  const distanceToNext = nextTier ? (count / nextTier.min) : 1;
  const showAnticipation = distanceToNext >= 0.8;

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.count,
          {
            transform: [{ scale }],
            color: tier.color,
            textShadowColor: showAnticipation ? nextTier?.color : tier.color,
          },
        ]}
      >
        {count}x
      </Animated.Text>

      {tier.name && (
        <Text style={[styles.tierName, { color: tier.color }]}>
          {tier.name}
        </Text>
      )}

      <View style={styles.timerContainer}>
        <View
          style={[
            styles.timerBar,
            {
              width: `${timerPercent * 100}%`,
              backgroundColor: isUrgent ? '#FF0000' : tier.color,
              opacity: isUrgent ? (Math.sin(Date.now() / 50) + 1) / 2 : 1,
            },
          ]}
        />
      </View>

      <View style={[styles.multiplierBadge, { backgroundColor: tier.color }]}>
        <Text style={styles.multiplierText}>x{tier.multiplier}</Text>
      </View>
    </View>
  );
}
```
