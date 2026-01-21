---
name: loot-systems
description: Use when adding chest systems, gacha, daily rewards, or loot boxes. Triggers on reward system design. Covers probability tuning, pity mechanics, opening animations, and legal compliance.
---

# Loot Systems

## Purpose

Design and implement loot and reward systems that create excitement through variable ratio reinforcement, anticipation building, and bad luck protection while respecting legal requirements.

## When to Use

- Adding chest/loot box mechanics
- Implementing gacha/pull systems
- Designing daily login rewards
- Creating wheel spin mechanics

## Core Process

1. **Define Rarity Tiers**: 5-tier standard (Common to Mythic)
2. **Set Probabilities**: Sum to 100%, disclose for compliance
3. **Add Pity System**: Soft pity + hard pity prevents frustration
4. **Design Animation**: Build anticipation, reveal worst-to-best
5. **Handle Duplicates**: Convert, upgrade, or add pity credit
6. **Track Legally**: Disclose rates, implement age gates if needed

## Key Rules

- Always reveal items worst-to-best (builds anticipation)
- Never skip pity system (legal requirement in many regions)
- Animation length scales with rarity (longer = better)
- Disclose all probabilities (App Store requirement)
- Streak resets should feel fair, not punishing
- Day 7 daily reward must be genuinely exciting

## Quick Reference

**Standard Rarity**: Common 60%, Rare 25%, Epic 10%, Legendary 4%, Mythic 1%

**Pity Timing**: Soft pity at 60-75 pulls, hard pity at 80-100

**Animation Phases**: Initiation (500ms) > Anticipation (1-2s) > Reveal (200ms) > Celebration (1-3s)

**Streak Modes**: Strict (reset all), Weekly (reset to week), Forgiving (pause)

See `references/code-patterns.md` for chest system and animation code.
See `references/api-reference.md` for rarity tiers and legal requirements.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `economy-systems` | Currency for pulls |
| `progression-systems` | Reward pacing |
| `dopamine-optimizer` | Reward psychology |
| `animation-system` | Opening animations |
