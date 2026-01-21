# Retention Engineer - API Reference

## Retention Benchmarks

### Industry Medians (2025)

| Metric | Median | Top 25% | Top 10% Target |
|--------|--------|---------|----------------|
| D1 | 26-28% | 31-33% | 45%+ |
| D7 | 3-4% | 7-8% | 20%+ |
| D30 | <3% | 5-7% | 10%+ |

### By Genre (D1 Retention)

| Genre | D1 Median | D1 Top Quartile |
|-------|-----------|-----------------|
| Match-3 | 32.65% | 42%+ |
| Puzzle | 31.85% | 41%+ |
| Tabletop | 31.30% | 40%+ |
| RPG | 30.54% | 39%+ |
| Simulation | 30.10% | 38%+ |
| Casual | 28.50% | 36%+ |
| Hyper-casual | 25.00% | 32%+ |

**Note:** iOS D1 retention is 4-6% higher than Android for top 25% of games.

## 7-Day Login Bonus Curve

| Day | Reward Value (% of Day 1) | Reward Type |
|-----|---------------------------|-------------|
| Day 1 | 100% | Soft currency |
| Day 2 | 120% | Soft currency + consumable |
| Day 3 | 150% | Soft currency + rare consumable |
| Day 4 | 180% | Soft currency + hard currency (small) |
| Day 5 | 220% | Soft currency + exclusive item |
| Day 6 | 280% | Soft currency + hard currency (medium) |
| Day 7 | 400% | Premium reward package |

## Streak Multiplier Progression

| Days | Multiplier | Milestone Rewards |
|------|------------|-------------------|
| 1-3 | 1.0x | Building phase |
| 4-7 | 1.2x | Day 7: Bronze badge + rare chest |
| 8-14 | 1.5x | Day 14: Silver badge + epic chest |
| 15-30 | 2.0x | Day 30: Gold badge + legendary chest |
| 31-60 | 2.5x (cap) | Day 60: Platinum badge + exclusive skin |
| 61-90 | 2.5x | Day 90: Diamond badge + premium bundle |

## Streak Recovery Methods

| Recovery Method | Cost | Availability |
|-----------------|------|--------------|
| Free recovery | None | Once per 30 days |
| Ad-supported | Watch 1 ad | Once per 7 days |
| Soft currency | 500 coins | Unlimited |
| Hard currency | 50 gems | Unlimited |
| Time-limited | None | Within 24 hours of break |

## Push Notification Types

| Type | Timing | Frequency Cap | Example |
|------|--------|---------------|---------|
| Streak reminder | 2 hours before reset | 1x daily | "Don't lose your 7-day streak!" |
| Daily reward | Same time daily | 1x daily | "Your daily reward is waiting!" |
| Energy full | When cap reached | 1x per 4 hours | "Energy full! Ready to play?" |
| Event ending | 2 hours before end | 1x per event | "Event ends in 2 hours!" |
| Friend activity | When friend acts | 3x daily max | "Alex beat your high score!" |
| Welcome back | After 3 days inactive | 1x per period | "We miss you! Bonus waiting" |

## Churn Prediction Signals

| Signal | Threshold | Risk Level | Weight |
|--------|-----------|------------|--------|
| Session frequency decline | >50% drop | High | 0.30 |
| Session length decline | >30% drop | Medium | 0.25 |
| Spending decline | >80% drop | High | 0.20 |
| Social interaction | 0 in 7 days | Medium | 0.15 |
| Quest completion | <30% | High | 0.10 |

### Risk Level Thresholds

| Score Range | Risk Level | Intervention |
|-------------|------------|--------------|
| 0.0-0.3 | Low | No action |
| 0.3-0.5 | Medium | Extra daily reward |
| 0.5-0.7 | High | Personalized offer |
| 0.7-1.0 | Critical | Winback package |

## Winback Reward Scaling

| Days Away | Classification | Reward Multiplier | Special Offer |
|-----------|----------------|-------------------|---------------|
| 1-2 | Normal break | 1x | No action |
| 3-6 | Short lapse | 1.5x | "We saved your progress!" |
| 7-13 | Lapsed | 3x | Login bonus catch-up |
| 14-29 | Churned | 5x + exclusive | "Welcome back" bundle |
| 30+ | Lost | 10x + premium | "Fresh start" bonus |

## Session Cadence by Genre

| Genre | Sessions/Day | Session Length | Total Daily Time |
|-------|--------------|----------------|------------------|
| Hyper-casual | 5-8 | 1-3 minutes | 10-15 minutes |
| Casual | 3-5 | 5-10 minutes | 20-30 minutes |
| Mid-core | 3-4 | 10-20 minutes | 40-60 minutes |
| Core | 2-3 | 30-60 minutes | 60-120 minutes |

## Energy System Parameters

| Parameter | Value |
|-----------|-------|
| Regeneration rate | 1 unit per 5-10 minutes |
| Maximum cap | 5-10 attempts |
| Full refill time | 30-60 minutes |
| Premium bypass | Instant refill (hard currency) |
| Social bypass | Request from friends |

## Notification Opt-In Benchmarks

| Metric | Value |
|--------|-------|
| Gaming industry average | 63.5% |
| Optimized games | 75-80% |
| Personalized notifications | +259% engagement |

## A/B Test Matrix

| Element | Variant A | Variant B | Metric |
|---------|-----------|-----------|--------|
| Timing | Player's peak hour | 2 hours before reset | Open rate |
| Personalization | Generic | Name + specific reward | CTR |
| Urgency | "Available now" | "Expires in 2 hours" | Conversion |
| Emoji | Without | With | Open rate |
