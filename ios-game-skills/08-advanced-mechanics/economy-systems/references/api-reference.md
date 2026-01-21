# Economy Systems API Reference

## Currency Hierarchy

| Tier | Type | Earn Rate | Primary Use | Monetization |
|------|------|-----------|-------------|--------------|
| 1 | Soft (Gold) | Abundant | Basic items, upgrades | Free |
| 2 | Medium (Gems) | Moderate | Acceleration, cosmetics | Optional IAP |
| 3 | Hard (Premium) | Scarce | Exclusive items, skips | Primary IAP |

## Exchange Rates

| From | To | Typical Rate |
|------|-----|--------------|
| Hard → Medium | 1:10 to 1:20 | Premium feels valuable |
| Medium → Soft | 1:100 to 1:500 | Soft is truly abundant |
| Soft → Medium | NOT ALLOWED | Prevents farming exploits |

## Shop Pricing Psychology

| Price Point | Player Perception | Best For |
|-------------|-------------------|----------|
| Free | Obvious value | Onboarding, daily claims |
| 1-9 soft | Trivial | Basic consumables |
| 10-99 soft | Affordable | Regular purchases |
| 100-999 soft | Considered | Meaningful items |
| 1000+ soft | Investment | Significant upgrades |
| 1-9 premium | Impulse | Cosmetics, small skips |
| 10-49 premium | Moderate | Good value bundles |
| 50-99 premium | Significant | Major content |
| 100+ premium | Whale territory | Exclusive/collection |

## Crafting System Design

| Element | Specification | Rationale |
|---------|---------------|-----------|
| Recipe Complexity | 2-5 ingredients | Understandable |
| Success Rate | 80-100% base | Frustration prevention |
| Time Gates | 0-4 hours typical | Encourages return |
| Upgrade Path | Clear progression | Goal visibility |

## Ingredient Rarity Distribution

| Ingredient Rarity | Recipe Appearance |
|-------------------|-------------------|
| Common | 1-3 per recipe |
| Rare | 0-2 per recipe |
| Epic | 0-1 per recipe |
| Legendary | 0-1 for top recipes |

## Faucets (Currency Sources)

| Source | Flow Rate | Notes |
|--------|-----------|-------|
| Core gameplay | Constant | Primary soft currency |
| Daily rewards | Moderate | Medium currency mix |
| Achievements | One-time | Mixed currencies |
| Events | Burst | Temporary, generous |
| IAP | Variable | Hard currency |

## Sinks (Currency Drains)

| Sink | Drain Rate | Notes |
|------|------------|-------|
| Upgrades | Progressive | Increasing costs |
| Consumables | Steady | Replenishing need |
| Cosmetics | Optional | Vanity spending |
| Gacha/Chests | Variable | Gamified drain |
| Skip timers | Optional | Impatience tax |

**Balance Rule:** Total faucets should exceed sinks by 10-20% to create accumulation satisfaction.

## Decision Trees

### How Many Currencies?

```
Is the game free-to-play?
├── NO (Premium) → 1-2 currencies (soft + optional medium)
└── YES → Continue
    │
    Does monetization rely on IAP?
    ├── YES → 3 currencies (soft, medium, hard)
    └── NO (Ads only) → 2 currencies (soft, medium)

Is there a gacha/loot system?
├── YES → Ensure premium currency for pulls
└── NO → Medium currency optional
```

### Pricing New Items

```
What type of item is it?
├── Consumable → Price for regular purchase (10-100 soft)
├── Permanent Upgrade → Price for scarcity (100-1000 soft)
├── Cosmetic → Price for desirability (medium currency)
└── Skip/Boost → Price for impatience (premium currency)

How does it compare to existing items?
├── Strictly better → Price higher
├── Sidegrade → Similar price
└── Situational → Slightly lower
```

### Preventing Inflation

```
Is soft currency accumulating too fast?
├── YES → Add new sinks
│   ├── Expensive upgrades
│   ├── Consumable items
│   └── Vanity cosmetics
└── NO → Continue
    │
    Are players not spending?
    ├── YES → Items not desirable
    │   └── Improve item quality, not lower prices
    └── NO → Balance is working
```

## Quality Checklists

### Currency Balance
- [ ] Soft currency earned steadily in core loop
- [ ] Medium currency is scarce but earnable (F2P friendly)
- [ ] Hard currency primarily from IAP
- [ ] Exchange rates prevent currency farming
- [ ] Lifetime tracking for analytics

### Shop Design
- [ ] Prices feel fair for item value
- [ ] Daily rotating deals create urgency
- [ ] Limited stock creates scarcity
- [ ] Bundles offer perceived value
- [ ] All prices shown before purchase

### Crafting
- [ ] Recipes are discoverable
- [ ] Success rates are fair (80%+)
- [ ] Failed crafts refund partially
- [ ] Skip costs are reasonable
- [ ] Multiple crafting slots available

### Economy Health
- [ ] Faucets slightly exceed sinks
- [ ] No runaway inflation
- [ ] New players can progress
- [ ] Veterans have meaningful sinks
- [ ] Analytics track economy metrics
