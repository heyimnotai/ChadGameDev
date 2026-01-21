---
name: reward-scheduler
description: Use when planning reward calendars, designing achievement systems, calibrating drop rates, or scheduling recurring rewards. Triggers on determining reward frequency, magnitude calibration, and unlock pacing. Covers fixed schedules, daily/weekly/monthly cadences, loot tables, and odds disclosure requirements.
---

# Reward Scheduler

Design reward timing and distribution systems that maintain engagement through properly paced unlocks, calibrated magnitudes, and balanced schedules.

## Decision Tree: Schedule Type

```
What behavior to reinforce?
+-- Specific action completion
|   +-- Predictable? → Fixed Ratio (FR)
|   |   +-- Training: FR-1 (every action)
|   |   +-- Engagement: FR-3 to FR-5
|   |   +-- Milestone: FR-10 to FR-25
|   +-- Surprising? → Variable Ratio (see dopamine-optimizer)
+-- Time-based return
|   +-- Fixed Interval (FI)
|   +-- Multiple daily: FI-4h (energy)
|   +-- Once daily: FI-24h (daily rewards)
|   +-- Weekly habit: FI-168h
+-- Long-term goal
    +-- Fixed milestones + variable bonuses + interval resets
```

## Decision Tree: Drop Rate Calibration

```
Item's intended rarity?
+-- Common: 60-70% drop, no pity
+-- Uncommon: 20-25% drop, no pity
+-- Rare: 8-12% drop, soft pity at 15
+-- Epic: 3-5% drop, hard pity at 30
+-- Legendary: 0.5-1% drop, hard pity at 75
+-- Mythic: 0.05-0.1% drop, hard pity at 150

Monetized drops require:
+-- Odds disclosure BEFORE purchase
+-- Pity system RECOMMENDED
+-- Regional restrictions CHECK (Belgium, Netherlands)
```

## Core Principles

**Magnitude Tiers**: Micro (1-10% session, every 30s), Small (10-25%, every 2-5min), Medium (25-50%, every 10-20min), Large (50-100%, every 30-60min), Major (100-200%, every 2-4h), Jackpot (500%+, daily or less).

**Daily Structure**: Login (100), First win (150), 3 quests (50 each), Play time (25/15min x4). Total: 450-550 coins. Cap at 3x session earnings.

**Weekly Pacing**: Cumulative + Streak + Challenge + Social + Collection quests. Reset Monday 00:00 UTC. Target 70% completion rate.

**Achievement Curve**: First session=5-8, First week=15-25, First month=40-60, First year=50-60% of total. Never 100% completion.

**Drop Rate Disclosure (Apple)**: All odds before purchase, 2 decimal precision, individual item rates, pity mechanics explained, update within 24h of changes.

## Quality Checklist

### Schedule Implementation
- [ ] Fixed ratio triggers at exact action count
- [ ] Fixed interval respects cooldown precisely
- [ ] Daily reset at midnight user local time
- [ ] Weekly reset Monday 00:00 UTC
- [ ] Progress persists across app restarts

### Magnitude Calibration
- [ ] Daily free earnings within 3x session target
- [ ] Weekly = 5-7x daily, Monthly = 20-25x daily
- [ ] Premium provides 3-5x value of price
- [ ] Inflation rate < 5% monthly

### Achievement System
- [ ] First session unlocks 5-8 achievements
- [ ] Hidden achievements stay hidden until unlocked
- [ ] Rewards grant correctly on unlock
- [ ] Notification appears on unlock

### Drop Rate Verification
- [ ] Actual rates match disclosed rates (unit tested)
- [ ] Pity counter increments correctly
- [ ] Hard pity guarantees at exact threshold
- [ ] Disclosure text accurate and accessible

### Ethical Compliance
- [ ] All monetized random odds disclosed before purchase
- [ ] No dynamic odds based on spending
- [ ] Regional restrictions implemented
- [ ] Age-gating for monetized random rewards

## Anti-Patterns

**Reward Flooding**: Constant high-value rewards every action. Causes fatigue, inflation, devalued progression.

**Hidden Odds Changes**: Adjusting rates based on player spending. Violates disclosure requirements, legal liability.

**Unpredictable Schedules**: Random daily reset times. Players can't form habits, frustration from missed rewards.

**Achievement Overload**: 20+ achievements unlocking simultaneously. Achievement fatigue, meaningless progression.

## References

- [Code Patterns](references/code-patterns.md) - RewardScheduleManager, AchievementSystem, LootTableSystem, RewardCountdownView
- [API Reference](references/api-reference.md) - Schedule matrix, magnitude tiers, rarity distributions, disclosure requirements

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| dopamine-optimizer | Variable ratio schedules, pity systems |
| retention-engineer | Daily/weekly reward integration |
| economy-balancer | Reward values affect economic balance |
| onboarding-architect | First session reward pacing |
| progression-system | Achievement integration with levels |
