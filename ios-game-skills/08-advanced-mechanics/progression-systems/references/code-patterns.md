# Progression Systems Code Patterns

## PrestigeSystem Class

```typescript
interface PrestigeConfig {
  currencyName: string;
  formula: (lifetimeEarnings: number) => number;
  minimumForPrestige: number;
  multiplierFormula: (currency: number) => number;
  carryover: string[];  // What persists
  unlocks: PrestigeUnlock[];
}

interface PrestigeState {
  prestigeCount: number;
  prestigeCurrency: number;
  lifetimeEarnings: number;
  multiplier: number;
  unlockedFeatures: string[];
}

class PrestigeSystem {
  private config: PrestigeConfig;
  private state: PrestigeState;

  canPrestige(): boolean {
    const potentialCurrency = this.calculatePrestigeCurrency();
    return potentialCurrency >= this.config.minimumForPrestige;
  }

  calculatePrestigeCurrency(): number {
    return this.config.formula(this.state.lifetimeEarnings);
  }

  prestige(): PrestigeResult {
    if (!this.canPrestige()) {
      return { success: false, reason: 'insufficient_progress' };
    }

    const earnedCurrency = this.calculatePrestigeCurrency();

    // Grant currency
    this.state.prestigeCurrency += earnedCurrency;

    // Update multiplier
    this.state.multiplier = this.config.multiplierFormula(
      this.state.prestigeCurrency
    );

    // Check unlocks
    const newUnlocks = this.config.unlocks.filter(
      u => u.requirement <= this.state.prestigeCurrency &&
           !this.state.unlockedFeatures.includes(u.id)
    );
    newUnlocks.forEach(u => this.state.unlockedFeatures.push(u.id));

    // Increment count
    this.state.prestigeCount++;

    // Reset non-carryover data
    this.resetProgress();

    return {
      success: true,
      currencyEarned: earnedCurrency,
      totalCurrency: this.state.prestigeCurrency,
      newMultiplier: this.state.multiplier,
      newUnlocks,
      prestigeNumber: this.state.prestigeCount,
    };
  }

  getRecommendedPrestigePoint(): number {
    // Recommend prestige when gain would be >= current * 0.1
    const current = this.state.prestigeCurrency;
    const potential = this.calculatePrestigeCurrency();

    if (potential >= current * 0.1) {
      return this.state.lifetimeEarnings;  // Now is good
    }

    // Calculate when 10% gain would occur
    const targetGain = current * 0.1;
    // Inverse of formula to find required earnings
    return this.inverseFormula(current + targetGain);
  }
}
```

## BattlePassSystem Class

```typescript
interface BattlePassConfig {
  id: string;
  seasonName: string;
  tiers: BattlePassTier[];
  xpPerTier: (tier: number) => number;
  startDate: Date;
  endDate: Date;
  premiumPrice: number;
}

interface BattlePassTier {
  tier: number;
  freeReward: Reward;
  premiumReward: Reward;
  isMilestone: boolean;
}

interface PlayerPassState {
  currentXP: number;
  currentTier: number;
  isPremium: boolean;
  claimedFree: number[];
  claimedPremium: number[];
}

class BattlePassSystem {
  private config: BattlePassConfig;
  private state: PlayerPassState;

  addXP(amount: number): XPResult {
    this.state.currentXP += amount;

    const tiersGained: number[] = [];

    // Check tier ups
    while (this.canTierUp()) {
      const xpNeeded = this.config.xpPerTier(this.state.currentTier);
      this.state.currentXP -= xpNeeded;
      this.state.currentTier++;
      tiersGained.push(this.state.currentTier);
    }

    return {
      currentXP: this.state.currentXP,
      currentTier: this.state.currentTier,
      tiersGained,
      xpToNextTier: this.getXPToNextTier(),
      seasonProgress: this.getSeasonProgress(),
    };
  }

  claimReward(tier: number, premium: boolean): ClaimResult {
    if (tier > this.state.currentTier) {
      return { success: false, reason: 'tier_not_reached' };
    }

    if (premium && !this.state.isPremium) {
      return { success: false, reason: 'premium_required' };
    }

    const claimed = premium ? this.state.claimedPremium : this.state.claimedFree;
    if (claimed.includes(tier)) {
      return { success: false, reason: 'already_claimed' };
    }

    claimed.push(tier);

    const tierConfig = this.config.tiers[tier - 1];
    const reward = premium ? tierConfig.premiumReward : tierConfig.freeReward;

    return {
      success: true,
      reward,
      isMilestone: tierConfig.isMilestone,
    };
  }

  getSeasonProgress(): SeasonProgress {
    const now = new Date();
    const total = this.config.endDate.getTime() - this.config.startDate.getTime();
    const elapsed = now.getTime() - this.config.startDate.getTime();
    const timeProgress = elapsed / total;

    const tierProgress = this.state.currentTier / this.config.tiers.length;

    return {
      timeRemaining: this.config.endDate.getTime() - now.getTime(),
      timeProgress,
      tierProgress,
      onTrack: tierProgress >= timeProgress,
      projectedFinalTier: Math.floor(tierProgress / timeProgress * 100),
    };
  }
}
```

## MasteryTracker Class

```typescript
interface MasteryConfig {
  elementType: string;  // 'weapon', 'character', 'skill'
  maxLevel: number;
  xpPerLevel: (level: number) => number;
  rewards: MasteryReward[];
  challenges: MasteryChallenge[];
}

interface MasteryReward {
  level: number;
  type: 'cosmetic' | 'stat' | 'ability' | 'title';
  value: any;
}

class MasteryTracker {
  private masteryData: Map<string, MasteryProgress> = new Map();

  recordUsage(elementId: string, context: UsageContext): void {
    const progress = this.getOrCreate(elementId);

    // Base XP from usage
    let xpGained = context.baseXP;

    // Challenge completion bonuses
    const completedChallenges = this.checkChallenges(elementId, context);
    xpGained += completedChallenges.reduce((sum, c) => sum + c.xpBonus, 0);

    // Apply XP
    progress.currentXP += xpGained;

    // Level up check
    while (this.canLevelUp(progress)) {
      const required = this.config.xpPerLevel(progress.level);
      progress.currentXP -= required;
      progress.level++;
      this.grantLevelReward(elementId, progress.level);
    }

    this.masteryData.set(elementId, progress);
  }

  getMasteryDisplay(elementId: string): MasteryDisplay {
    const progress = this.masteryData.get(elementId);
    if (!progress) return this.getDefaultDisplay();

    return {
      level: progress.level,
      xpProgress: progress.currentXP / this.config.xpPerLevel(progress.level),
      badges: this.getEarnedBadges(progress),
      nextReward: this.getNextReward(progress.level),
      totalXP: progress.totalXP,
    };
  }
}
```

## Prestige Currency Formulas

```typescript
// Standard idle game formula
const soulEggsFormula = (lifetimeEarnings: number) => {
  return Math.floor(Math.pow(lifetimeEarnings / 1e12, 0.5));
};

// First prestige multiplier formula (meaningful boost)
const multiplierFormula = (prestigeCurrency: number) => {
  return 1 + Math.sqrt(prestigeCurrency) * 0.5;
  // Even 1 prestige currency = 1.5x
};

// Optimal prestige timing
const optimalPrestigePoint = {
  first: '2x current max',
  mid: '3-4x current max',
  late: '2x current max (maintenance)',
};
```

## Anti-Pattern Examples

### Weak First Prestige (Wrong)

```typescript
// First prestige gives 1.1x multiplier
const multiplier = 1 + (prestigeCurrency * 0.001);
```

### Weak First Prestige (Correct)

```typescript
// First prestige gives noticeable boost
const multiplier = 1 + Math.sqrt(prestigeCurrency) * 0.5;
// Even 1 prestige currency = 1.5x
```

### Punishing Reset (Correct)

```typescript
// Keep meaningful progress
function prestige() {
  const carryover = extractCarryover(playerData);
  playerData = {
    ...initialState,
    achievements: carryover.achievements,
    unlocks: carryover.unlocks,
    cosmetics: carryover.cosmetics,
  };
  prestigeCount++;
  prestigeCurrency += calculateEarned();
}
```

### Achievable Battle Pass (Correct)

```typescript
// Achievable with 30-60 min daily
const xpPerTier = 2000;
const xpPerMatch = 200;  // 10 matches per tier
const dailyChallenge = 500;  // Helps a lot
const weeklyChallenge = 2500;  // Major boost
```

### Mastery Counts Usage (Correct)

```typescript
// Count usage, bonus for performance
mastery.addXP(elementId, baseXP);
if (match.result === 'win') {
  mastery.addXP(elementId, bonusXP);
}
```
