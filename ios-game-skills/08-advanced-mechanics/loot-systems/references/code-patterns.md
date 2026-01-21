# Loot Systems - Code Patterns

## ChestSystem Class

```typescript
interface ChestConfig {
  id: string;
  rarityWeights: Record<Rarity, number>;
  pityConfig?: PityConfig;
}

interface PityConfig {
  softPityStart: number;
  hardPity: number;
  softPityRateIncrease: number;
}

class ChestSystem {
  private pityCounters: Map<string, number> = new Map();

  open(chest: ChestConfig, count: number = 1): Item[] {
    const items: Item[] = [];

    for (let i = 0; i < count; i++) {
      const pityCount = this.pityCounters.get(chest.id) || 0;
      const weights = this.applyPity(chest.rarityWeights, chest.pityConfig, pityCount);
      const rarity = this.rollRarity(weights);
      const item = this.selectItem(chest.itemPool, rarity);

      items.push(item);

      if (rarity >= Rarity.Legendary) this.resetPity(chest.id);
      else this.incrementPity(chest.id);
    }

    return this.sortByRarity(items);  // Worst to best
  }

  private applyPity(weights, pity, count) {
    if (!pity) return weights;
    if (count >= pity.hardPity) return { ...weights, [Rarity.Legendary]: 1.0 };
    if (count >= pity.softPityStart) {
      const bonus = (count - pity.softPityStart) * pity.softPityRateIncrease;
      return { ...weights, [Rarity.Legendary]: weights[Rarity.Legendary] + bonus };
    }
    return weights;
  }
}
```

## Opening Animation

```typescript
async function playOpening(items: Item[]) {
  // Phase 1: Initiation
  await playInitiation();

  // Phase 2: Anticipation (longer for better drops)
  const bestRarity = Math.max(...items.map(i => i.rarity));
  await playAnticipation(1000 + bestRarity * 300);

  // Phase 3: Reveal (worst to best)
  const sorted = [...items].sort((a, b) => a.rarity - b.rarity);
  for (const item of sorted) {
    screenFlash(RARITY_COLORS[item.rarity], 100);
    HapticManager.impact(getHapticForRarity(item.rarity));
    await revealItem(item);
  }

  // Phase 4: Celebration
  await playCelebration(bestRarity);
}
```

## Daily Reward System

```typescript
class DailyRewardSystem {
  claim(): ClaimResult {
    const today = getCurrentDay();
    const lastClaim = this.playerData.lastClaimDay;

    if (isSameDay(today, lastClaim)) {
      return { success: false, reason: 'already_claimed' };
    }

    const daysSinceLast = daysBetween(lastClaim, today);
    if (daysSinceLast > 1) {
      this.handleMissedDays(daysSinceLast);
    }

    const reward = this.rewards[this.currentStreakDay % this.rewards.length];
    this.grantReward(reward);

    this.playerData.lastClaimDay = today;
    this.playerData.currentStreakDay++;

    return { success: true, reward };
  }

  handleMissedDays(missed: number) {
    switch (this.streakMode) {
      case 'strict': this.currentStreakDay = 0; break;
      case 'weekly': this.currentStreakDay = Math.floor(this.currentStreakDay / 7) * 7; break;
      case 'forgiving': /* keep progress */ break;
    }
  }
}
```

## Soft Pity Formula (Genshin-style)

```javascript
// 0.6% base, +6% per pull after 74
if (pulls >= softPityStart) {
  rate = baseRate + (pulls - softPityStart) * rateIncrease;
}
```

## Reveal Order

```
1. Show all slots as "?" silhouettes
2. Reveal common → rare (worst first)
3. Pause longer before better items
4. End on best item for maximum impact
```
