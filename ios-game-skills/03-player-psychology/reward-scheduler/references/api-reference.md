# Reward Scheduler - API Reference

## Schedule Type Selection Matrix

| Goal | Schedule | Ratio/Interval |
|------|----------|----------------|
| Teach mechanic | FR-1 | Every action |
| Maintain engagement | FR-3 to FR-5 | Regular reinforcement |
| Create milestones | FR-10 to FR-25 | Achievement points |
| Drive sessions | FI-4h to FI-8h | Energy/resource systems |
| Create habits | FI-24h | Daily rewards |
| Long-term goals | FI-168h to FI-720h | Weekly/monthly |

## Reward Magnitude Tiers

| Tier | Value Range | Frequency | Example |
|------|-------------|-----------|---------|
| Micro | 1-10% of session earnings | Every 30s-2min | Coin pickup |
| Small | 10-25% of session earnings | Every 2-5min | Level clear bonus |
| Medium | 25-50% of session earnings | Every 10-20min | Achievement |
| Large | 50-100% of session earnings | Every 30-60min | Quest completion |
| Major | 100-200% of session earnings | Every 2-4 hours | Milestone |
| Jackpot | 500%+ of session earnings | Daily or less | Special event |

## Daily Reward Structure

| Time | Reward Type | Value | Trigger |
|------|-------------|-------|---------|
| Login | Login bonus | 100 coins | Automatic on first session |
| First win | First victory bonus | 150 coins | Complete first match/level |
| Quests | Daily quest completion (x3) | 50 each | Manual claim |
| Activity | Play time bonus | 25/15min | Every 15 min (cap at 4) |
| Lucky | Random lucky drop | Variable | 10% chance per session |
| **Total** | | 450-550 coins | |

## Weekly Quest Structure

| Quest Type | Requirement | Reward | Notes |
|------------|-------------|--------|-------|
| Cumulative | "Win 20 matches" | 500 coins | Progress carries over |
| Streak | "Login 5 days" | 200 gems | Resets if missed |
| Challenge | "Score 100k points" | Rare item | Skill-based |
| Social | "Play with friend" | 100 coins | Low barrier |
| Collection | "Earn 3 daily chests" | Epic chest | Engagement driver |

## Achievement Category Distribution

| Category | % of Total | Unlock Rate |
|----------|------------|-------------|
| Tutorial/Basic | 15% | Session 1 |
| Progression | 30% | 1-2 per session |
| Skill-based | 25% | 1 per 3-5 sessions |
| Collection | 15% | Ongoing (months) |
| Secret/Hidden | 10% | Discovery-based |
| Social | 5% | Variable |

## Achievement Unlock Curve

| Timeframe | Achievement Count |
|-----------|-------------------|
| First session | 5-8 achievements |
| First week | 15-25 achievements |
| First month | 40-60 achievements |
| First quarter | 80-120 achievements |
| First year | 150-200 (50-60% of total) |

## Rarity Distribution Standards

| Rarity | Drop Rate | Pity Threshold | Color Code |
|--------|-----------|----------------|------------|
| Common | 60-70% | N/A | Gray/White |
| Uncommon | 20-25% | N/A | Green |
| Rare | 8-12% | 15 attempts | Blue |
| Epic | 3-5% | 30 attempts | Purple |
| Legendary | 0.5-1% | 75 attempts | Gold/Orange |
| Mythic | 0.05-0.1% | 150 attempts | Red/Rainbow |

## Battle Pass Integration

| Component | Free Track | Premium Track |
|-----------|------------|---------------|
| Total tiers | 30-50 | 30-50 |
| Tier duration | 1-2 days per tier | Same |
| Total duration | 30-60 days | Same |
| Final reward | Epic item | Legendary item |
| Total value | 50% of premium price | 300-500% of price |

## Required Disclosures (Apple)

| Element | Requirement | Where to Display |
|---------|-------------|------------------|
| Loot box odds | All individual rates | Pre-purchase screen |
| Pity mechanics | How they work | Info button on purchase |
| Premium currency value | Real money equivalent | Store page |
| Limited time | Actual end date/time | Offer UI |
| Regional restrictions | If odds vary by region | Settings/Legal |

## Relative Value Guidelines

| Reward Type | Value Formula |
|-------------|---------------|
| Daily total | 80-120% of average daily earnings |
| Weekly reward | 5-7x daily reward |
| Monthly reward | 20-25x daily reward |
| Event reward | 3-5x normal equivalent activity |
| Premium reward | 3-5x free equivalent |

## Duplicate Handling Options

### Option 1: Convert to Currency
| Rarity | Currency Value |
|--------|----------------|
| Common | 10 coins |
| Rare | 50 coins |
| Epic | 200 coins |
| Legendary | 1000 coins OR upgrade material |

### Option 2: Upgrade System
| Conversion | Result |
|------------|--------|
| 3 commons | 1 uncommon |
| 3 uncommons | 1 rare |
| 5 rares | 1 epic |
| 10 epics | 1 legendary |

## Countdown Timer Design

| Duration | Format | Visual Treatment |
|----------|--------|------------------|
| < 1 hour | MM:SS | Fast countdown feel |
| 1-24 hours | HH:MM | Manageable wait |
| > 24 hours | X days Y hours | Distant but trackable |
| Final 10 min | - | Pulsing animation |
| Final 1 min | - | Color change (orange/red) |
| Available | - | Bouncing/glowing CLAIM |

## Ethical Guidelines

1. No manipulated odds (rates shown = rates actual)
2. No "pay to progress faster" disguised as "pay to win"
3. No targeting based on spending behavior
4. No fake scarcity (if "limited," truly limited)
5. Spending limits for minors (where required)
6. Clear distinction: Premium vs free content
7. No dark patterns in reward claim flows

## Inflation Prevention Limits

| Metric | Limit |
|--------|-------|
| Weekly currency cap | (Daily earnings x 7) x 1.2 |
| Monthly soft currency | 50x daily max |
| Monthly free hard currency | 500-1000 |
| Currency accumulation warning | > 30 days worth |
