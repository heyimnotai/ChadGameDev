# Dopamine Optimizer - API Reference

## Variable Ratio Reinforcement Schedules

| Schedule Type | Average Ratio | Variance | Use Case |
|---------------|---------------|----------|----------|
| VR-3 | Every 3 actions | 1-5 range | Early game, frequent small rewards |
| VR-5 | Every 5 actions | 2-8 range | Standard gameplay rewards |
| VR-10 | Every 10 actions | 5-15 range | Medium-value rewards |
| VR-25 | Every 25 actions | 15-40 range | High-value rare drops |
| VR-50 | Every 50 actions | 30-75 range | Ultra-rare collectibles |

**Note**: Keep average reward frequency below 55 attempts to avoid gambling-like compulsion patterns.

## Rarity Tier Weights

```
Common:     60% (0.60)
Uncommon:   25% (0.25)
Rare:       10% (0.10)
Epic:        4% (0.04)
Legendary:   1% (0.01)
```

## Pity System Implementation

| Rarity | Base Rate | Soft Pity Start | Hard Pity | Soft Pity Rate Increase |
|--------|-----------|-----------------|-----------|------------------------|
| Epic | 5.1% | 8 pulls | 10 pulls | +10% per pull |
| Legendary | 0.6% | 54 pulls | 72 pulls | +6% per pull |
| Featured | 0.3% | 54 pulls | 72 pulls + 72 pulls | +6% per pull |

## Pseudo-Random Distribution (PRD) Formula

```
Initial probability: C = base_rate / 5
Increment per failure: C
After N failures: P(N) = C * N
Maximum N before guarantee: ceil(1/C)

Example for 10% base rate:
C = 0.02 (2%)
Attempt 1: 2%, Attempt 2: 4%, Attempt 3: 6%...
Guarantee by attempt 50 (100% cumulative)
```

## Reward Timing by Rarity

| Reward Type | Total Duration | Anticipation % |
|-------------|----------------|----------------|
| Common drop | 500ms | 20% (100ms) |
| Uncommon drop | 1000ms | 30% (300ms) |
| Rare drop | 2000ms | 40% (800ms) |
| Epic drop | 3000ms | 50% (1500ms) |
| Legendary drop | 4000ms | 60% (2400ms) |

## Reward Timing Phases

| Phase | Timing | Actions |
|-------|--------|---------|
| Immediate Feedback | 0-100ms | Haptic response, sound trigger, particle spawn |
| Anticipation Building | 100ms-2000ms | Item glow/shimmer, sound pitch increase, camera focus shift |
| Reveal Sequence | 2000ms-4000ms | Rarity indicator flash, item materialization, celebration effects |

## Surprise Categories

| Type | Frequency | Example |
|------|-----------|---------|
| Micro-surprise | Every 30-60 seconds | Extra coin, bonus XP |
| Mini-surprise | Every 5-10 minutes | Rare drop, achievement |
| Major-surprise | Every 30-60 minutes | Legendary item, unlock |
| Mega-surprise | Every 4-8 hours | Limited event, jackpot |

## Session Reward Caps (Burnout Prevention)

```
Maximum legendary drops per session: 2
Maximum epic drops per session: 5
Cooldown after legendary: 15 minutes reduced rates
Daily bonus reset: 24 hours from first login
```

## Diminishing Returns Formula

```
Reward value = base_value * (0.9 ^ rewards_this_session)

Session 1st reward: 100% value
Session 2nd reward: 90% value
Session 3rd reward: 81% value
Session 10th reward: 35% value
```

## Recovery Mechanics

- Full reward potential restored after 4+ hours away
- 50% restoration after 2 hours
- Session cap resets at calendar midnight (user timezone)

## Novelty Maintenance Schedule

| Period | Action |
|--------|--------|
| Week 1-2 | Introduce core reward types |
| Week 3-4 | Add first variant rewards |
| Month 2 | Introduce seasonal/themed rewards |
| Month 3+ | Rotate limited-time exclusive rewards |

## Near-Miss Constraints

- Maximum frequency: 1 in 4 losses (25%)
- Only for skill-based outcomes, not monetized random mechanics
- Must show genuine outcomes, never manipulated displays
