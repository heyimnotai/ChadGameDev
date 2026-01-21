# Economy Balancer - API Reference

## Dual Currency Pattern

| Currency Type | Characteristics | Typical Names |
|--------------|-----------------|---------------|
| **Soft Currency** | Earned through gameplay, high flow rate | Coins, Gold, Cash |
| **Hard Currency** | Purchased or rarely earned, low flow rate | Gems, Crystals, Diamonds |

| Aspect | Soft Currency | Hard Currency |
|--------|---------------|---------------|
| Earning Rate | 100-1000 per session | 0-50 per session |
| Spending Rate | Every few minutes | Major purchases |
| Inflation Risk | High (manage sinks) | Low (controlled supply) |
| IAP Connection | Indirect | Direct (purchased) |

## Sink/Faucet Balance

```
Faucet Rate ≈ Sink Rate = Balanced Economy
Faucet > Sink = Inflation (currency worthless)
Sink > Faucet = Frustration (can't progress)

Target Daily Net Flow: 0 to slight positive
Target Inflation: -1% to +2% per week
```

## Faucet Types

| Faucet | Frequency | Amount (Soft) | Purpose |
|--------|-----------|---------------|---------|
| Level Completion | Per level | 25-100 | Core reward |
| Daily Login | Once/day | 50-500 (escalating) | Daily retention |
| Quest Completion | 3-5/day | 25-100 each | Engagement |
| Achievement | One-time | 100-1000 | Milestone |
| Ad Watch | 3-10/day | 15-50 each | Monetization |
| PvP Victory | Per match | 10-50 | Competitive |

## Sink Types

| Sink | Impact | Purpose |
|------|--------|---------|
| Upgrades | Permanent | Core progression |
| Consumables | One-time use | Strategic options |
| Gacha/Loot | Variable | Collection/excitement |
| Time Skip | Convenience | Monetization |
| Cosmetics | Aesthetic only | Self-expression |
| Entry Fees | Per attempt | Adds stakes |

## Earning Rate by Genre

| Genre | Per Minute | Typical Session |
|-------|------------|-----------------|
| Hyper-casual | 5-20 | 15-60 |
| Puzzle | 20-50 | 200-500 |
| RPG | 50-200 | 1000-4000 |
| Idle | 100-500 | Variable |

## Purchase Time Targets

| Item Rarity | Time to Earn |
|-------------|--------------|
| Common | 1-5 minutes |
| Uncommon | 15-30 minutes |
| Rare | 1-3 hours |
| Epic | 1-3 days |
| Legendary | 1-2 weeks OR IAP |

## Pinch Point Formula

```
Pinch_Severity = (Desired_Cost - Available_Currency) / Desired_Cost

Optimal Range: 0.2 to 0.5 (20-50% short)
< 0.2: Too easy, no conversion pressure
> 0.5: Too hard, frustration and churn
```

## IAP Pricing Guidelines

| Price | Conversion Rate | Target Audience |
|-------|-----------------|-----------------|
| $0.99-$1.99 | Highest | Impulse, first purchase |
| $2.99-$4.99 | High | Engaged players |
| $9.99-$19.99 | Medium | Committed players |
| $49.99-$99.99 | Low | Whales |

## Hard Currency Exchange Rates

```
Base Rate: $1 = 100 hard currency

Volume Bonuses:
$0.99  = 80 gems  (80 gems/$)
$4.99  = 500 gems (100 gems/$)
$9.99  = 1100 gems (110 gems/$)
$19.99 = 2400 gems (120 gems/$)
$49.99 = 6500 gems (130 gems/$)
$99.99 = 14000 gems (140 gems/$)
```

## Conversion Funnel

```
Free Player -> Engaged -> Minnow ($1-10) -> Dolphin ($10-50) -> Whale ($50+)

Conversion Rates (Industry Average):
Free to Any Purchase: 2-5%
Minnow to Dolphin: 20-30%
Dolphin to Whale: 5-10%
```

## Inflation Control Mechanisms

| Mechanism | Description |
|-----------|-------------|
| Currency Cap | Maximum holdable currency |
| Scaling Costs | Prices increase with level |
| Time Decay | Currency loses value over time |
| Transaction Tax | 5-15% on trades |
| Prestige Reset | Full reset for bonuses |
| Exclusive Sinks | Limited edition items |

## Decision Trees

### Currency Type Selection
```
[Power/Progression] -> Soft OR Hard (hard for premium)
[Time acceleration] -> Hard currency only
[Cosmetics] -> Soft (engagement) or Hard (limited)
[Entry fees] -> Soft (gameplay), Hard (premium modes)
```

### Sink/Faucet Adjustment
```
INFLATION (too much currency):
1. New sinks (cosmetics, upgrades)
2. Limited-time events with high costs
3. Reduce faucets 10-20%
4. Add transaction taxes
5. Currency caps

FRUSTRATION (too little currency):
1. Catch-up bonus for returning players
2. Increase quest rewards 20-30%
3. Starter bundles at high value
4. Reduce common item prices
5. More rewarded ad opportunities
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Pay-wall core content | Rejection, churn | Core must be accessible |
| Infinite faucet | Economy breaks | Cap ads/day |
| Unclear pricing | Spending avoidance | Show $ value |
| Punishing F2P | Churn before conversion | F2P must be viable |
