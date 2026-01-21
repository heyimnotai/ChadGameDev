---
name: economy-balancer
description: Use when designing virtual currency systems, managing sink/faucet balance, or optimizing monetization without harming player experience. Triggers on IAP implementation, currency inflation, purchase friction, or conversion optimization.
---

# Economy Balancer

## Purpose

Design sustainable virtual economies where players feel rewarded while maintaining healthy conversion funnels. Balance faucets (earning) and sinks (spending) to create intentional pinch points without frustration.

## When to Use

- Designing dual-currency systems (soft/hard)
- Currency feels worthless (inflation)
- Players hoarding without spending
- Setting IAP price points
- Players frustrated by economy
- Optimizing conversion funnel

## Core Process

1. **Design dual currency** - Soft (gameplay-earned) + Hard (purchased/rare)
2. **Map all faucets** - Every way players earn currency
3. **Map all sinks** - Every way players spend currency
4. **Balance daily flow** - Faucet rate ~ Sink rate
5. **Create pinch points** - Strategic moments of scarcity (20-50% short)
6. **Set purchase times** - Common=5min, Uncommon=30min, Rare=1-3hr, Epic=1-3 days
7. **Price IAPs by volume** - Higher bundles = better value/dollar
8. **Add inflation controls** - Caps, scaling costs, exclusive sinks

## Key Rules

- **F2P must be viable** - Core loop accessible without purchase
- **Pinch, don't block** - Shortage, not wall
- **Hard currency = premium** - Never make soft feel mandatory
- **Soft currency cap** - Prevent hoarding/inflation
- **Volume discounts** - Larger IAPs = better value
- **30% Apple/Google tax** - Price accordingly

## Quick Reference

**Dual Currency Design:**
| Type | Earn Rate | Spend Rate | Purpose |
|------|-----------|------------|---------|
| Soft | 100-1000/session | High | Core progression |
| Hard | 0-50/session | Low | Premium purchases |

**Pinch Point Formula:**
```
Severity = (Cost - Balance) / Cost
Optimal: 0.2 to 0.5 (20-50% short)
```

**Purchase Time by Rarity:**
- Common: 5 min
- Uncommon: 30 min
- Rare: 1-3 hours
- Epic: 1-3 days
- Legendary: 1-2 weeks OR IAP

**IAP Value Curve:**
| Price | Base Gems | Bonus |
|-------|-----------|-------|
| $0.99 | 80 | 0% |
| $4.99 | 500 | +25% |
| $9.99 | 1100 | +38% |
| $19.99 | 2400 | +50% |

**Anti-Patterns:**
- Infinite faucet (cap daily ads/rewards)
- Pay-walled core content (kills conversion)
- Unclear real-money value (show $ equivalent)
- Punishing F2P (they're future payers)

See `references/api-reference.md` for detailed tables and formulas.
See `references/code-patterns.md` for Swift implementations.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `progression-system` | Costs align with progression pace |
| `reward-scheduler` | Timing of currency drops |
| `session-designer` | Earning per session |
| `retention-engineer` | Spending drives daily return |
