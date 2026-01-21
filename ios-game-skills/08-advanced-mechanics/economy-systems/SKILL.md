---
name: economy-systems
description: Use when adding in-game stores, multiple currencies, crafting recipes, or upgrade systems. Triggers on shop design, currency balance, sink/faucet tuning, or inflation prevention.
---

# Economy Systems

## Purpose

Design and implement virtual economies that feel fair, engaging, and sustainable. Covers multi-currency systems, shops, crafting, upgrades, and trading with proper sink/faucet balance.

## When to Use

- Adding multi-currency systems
- Designing shop/store interfaces
- Implementing crafting with recipes
- Balancing premium vs soft currency
- Preventing inflation
- Creating upgrade cost curves

## Core Process

1. Define currency hierarchy (soft, medium, hard)
2. Set exchange rates (downward only)
3. Design shop with pricing psychology
4. Implement crafting with fair success rates
5. Balance faucets vs sinks (faucets 10-20% higher)
6. Add analytics for economy health tracking

## Key Rules

**Currency Tiers**: Soft (abundant, free), Medium (moderate, optional IAP), Hard (scarce, primary IAP). Never allow upward conversion.

**Pricing**: Consumables 10-100 soft, permanent upgrades 100-1000 soft, cosmetics in medium, skips in premium.

**Crafting**: 2-5 ingredients, 80%+ success rate, partial refund on failure, time gates 0-4 hours.

**Balance**: Faucets exceed sinks by 10-20%. New players must progress. Veterans need meaningful sinks.

**F2P Respect**: Premium earnable through play (monthly pull achievable). Cosmetics for premium, stats grindable.

## Quick Reference

| Currency | Earn Rate | Primary Use |
|----------|-----------|-------------|
| Soft | Abundant | Basic items, upgrades |
| Medium | Moderate | Acceleration, cosmetics |
| Hard | Scarce | Exclusive items, skips |

## Anti-Patterns

- **Pay-to-Win**: Best stats locked behind premium
- **Exploitable Exchange**: Soft-to-hard conversion enables farming
- **Infinite Sinks**: Exponential costs create mid-game wall
- **Stingy F2P**: Premium takes years to earn

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `loot-systems` | Currency drops from chests |
| `progression-systems` | Currency earned through progress |
| `retention-engineer` | Economy affects retention |

## References

See `references/code-patterns.md` for CurrencyManager, ShopSystem, CraftingSystem.
See `references/api-reference.md` for pricing tables, exchange rates, checklists.
