---
name: progression-system
description: Use when designing XP curves, level counts, unlock pacing, or prestige mechanics. Triggers on player leveling, content unlocking, power curves, or any accumulating progress system.
---

# Progression System

## Purpose

Design mathematically rigorous progression systems that maintain engagement from first play through hundreds of hours. Create the illusion of infinite growth while maintaining sustainable pacing.

## When to Use

- Designing XP curve for new game
- Setting level count and cap
- Pacing content unlocks
- Implementing prestige/reset systems
- Balancing power growth curves

## Core Process

1. **Determine commitment level** - Casual (<1hr), Moderate (1-10hr), Dedicated (10-50hr), Hardcore (50+hr)
2. **Select XP curve** - Linear (short), polynomial (medium), exponential (idle), hybrid (recommended)
3. **Set level count** - 10-20 (casual), 30-50 (moderate), 50-100 (dedicated)
4. **Design unlock pacing** - Every 2-3 levels early, every 5-10 late
5. **Add soft/hard caps** - Soft at 70% max, hard at 100%
6. **Implement prestige (if needed)** - For 50+ hour games
7. **Validate timing** - Level 1->2 in <2 min, no level >4x previous

## Key Rules

- **Level 1->2 in <2 minutes** - Instant gratification
- **No level >4x previous** - Prevent frustration
- **Every level rewards something** - No empty levels
- **Unlock every 2-5 levels** - Constant forward motion
- **Soft cap before hard cap** - Grace period, not wall
- **Sell acceleration, not completion** - IAP preserves engagement

## Quick Reference

**XP Curve by Commitment:**
| Commitment | Curve | Levels |
|------------|-------|--------|
| Casual <1hr | Linear | 10-20 |
| Moderate 1-10hr | Polynomial 1.5-2.0 | 30-50 |
| Dedicated 10-50hr | Hybrid | 50-100 |
| Hardcore 50+hr | Exponential + prestige | Infinite |

**Hybrid Curve (Recommended):**
```
L1-10:  XP = 20 * level^0.7 (fast start)
L11-40: XP = 50 * level (steady)
L41+:   XP = 10 * level^1.8 (slow end)
```

**Unlock Pacing:**
| Phase | Levels | Frequency |
|-------|--------|-----------|
| Tutorial | 1-5 | Every level |
| Early | 6-15 | Every 2-3 |
| Mid | 16-40 | Every 3-5 |
| Late | 41+ | Every 5-10 |

**Prestige Patterns:**
- Linear: +10% per reset (simple)
- Diminishing: sqrt(resets) (encourages many)
- Asymptotic: 1-e^(-0.1*resets) (caps at +100%)

**Anti-Patterns:**
- Impossible grind (exponential without prestige)
- Empty levels (must always unlock something)
- Linear forever (needs variance)
- Pay-to-skip-all (sell speed, not completion)

See `references/api-reference.md` for formulas and decision trees.
See `references/code-patterns.md` for Swift implementations.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `core-loop-architect` | Progression is REWARD phase |
| `economy-balancer` | XP often tied to currency |
| `difficulty-tuner` | Power curves align with difficulty |
| `session-designer` | Level-up timing affects sessions |
| `onboarding-architect` | First 5 levels are FTUE |
