---
name: difficulty-tuner
description: Use when designing difficulty curves or implementing dynamic difficulty adjustment (DDA). Triggers on player frustration/churn, content too easy, difficulty feeling unfair, or implementing accessibility options.
---

# Difficulty Tuner

## Purpose

Design difficulty systems that maintain player flow state across all skill levels. Well-tuned difficulty is invisible to players but critical to retention.

## When to Use

- Players churning due to frustration
- Players breezing through without engagement
- Difficulty spikes causing quits
- Implementing accessibility options
- Balancing skill vs time-based progression

## Core Process

1. **Select curve type** - Linear (short), polynomial (medium), exponential (idle), stair-step (puzzle)
2. **Implement stair-step pattern** - Hard level every 5-6 levels, reset with new mechanics
3. **Add hidden DDA** - Track deaths, time, retries; adjust 5-15% per evaluation
4. **Set DDA bounds** - 0.5x minimum, 1.5x maximum
5. **Design fail-states** - Progressive help: hint at 2, tip at 3, help at 4, skip at 6+
6. **Add accessibility presets** - Story (0.5x), Easy (0.75x), Normal (1.0x), Hard (1.25x)
7. **Validate first 5 levels** - 95% of players must complete

## Key Rules

- **DDA must be hidden** - Players game obvious systems
- **Bidirectional adjustment** - Can get easier AND harder
- **No spike >50%** - Between adjacent levels
- **First 5 levels: 95% completion** - Tutorial must be accessible
- **Help after 3 failures** - Progressive assistance
- **Death animation <1s** - Retry available <2s

## Quick Reference

**DDA Algorithm:**
```
score < 0.4 (struggling): -10% difficulty
score > 0.8 (dominating): +5% difficulty
0.4-0.8 (flow): no change
Bounds: 0.5x to 1.5x
```

**Stair-Step Pattern:**
- Every 5-6 levels: one hard "peak" level
- New mechanic = difficulty reset to 70%
- Hard level followed by 3-4 easier levels

**Fail-State Ladder:**
| Attempt | Response |
|---------|----------|
| 1-2 | Encourage retry |
| 3 | Show hint |
| 4 | Offer help |
| 5 | Reduce difficulty |
| 6+ | Offer skip |

**Anti-Patterns:**
- Obvious DDA (players will die intentionally)
- No recovery (stuck at high difficulty)
- Difficulty wall (>50% spike)
- Punishing tutorial (must be completable by all)

See `references/api-reference.md` for formulas and decision trees.
See `references/code-patterns.md` for Swift implementations.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `core-loop-architect` | Difficulty affects loop satisfaction |
| `progression-system` | Power curves align with difficulty |
| `session-designer` | Difficulty spikes affect session length |
| `onboarding-architect` | Tutorial difficulty critical for D1 |
