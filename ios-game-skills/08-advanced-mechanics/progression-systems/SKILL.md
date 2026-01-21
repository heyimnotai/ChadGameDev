---
name: progression-systems
description: Use when adding long-term progression mechanics, seasonal content, or reset-for-bonus systems. Triggers on prestige, battle pass, mastery tracks, ascension, or meta-progression design.
---

# Progression Systems

## Purpose

Design and implement meta-progression systems that extend game lifespan from hours to months or years. Covers prestige systems, battle passes, mastery tracks, and ascension mechanics with proper pacing and reward curves.

## When to Use

- Adding prestige/rebirth systems
- Designing battle pass tiers
- Implementing mastery tracks
- Creating New Game+ mechanics
- Building season pass structures
- Setting progress carryover rules

## Core Process

1. Define prestige formula and multipliers
2. Set first prestige at 2-4 hours (hook before boredom)
3. Design carryover (achievements, unlocks persist)
4. Create battle pass with 80-100 hour completion
5. Add mastery with usage-based XP (not win-only)
6. Layer ascension tiers for deep progression

## Key Rules

**Prestige Multiplier**: First prestige must give 2x+ boost. Weak multipliers (1.1x) kill engagement.

**Carryover**: Never lose everything. Achievements, cosmetics, and unlocks persist across resets.

**Battle Pass**: 100 tiers over 80-100 hours. 30-60 min daily with challenges. Free track has real value.

**Mastery**: XP from usage, bonus for wins. Win-only gates make players avoid unmastered content.

**Timing**: Show optimal prestige point. 10-50% gain = good time. >100% gain = overdue.

## Quick Reference

| System | Target Duration |
|--------|-----------------|
| First Prestige | 2-4 hours |
| Battle Pass | 80-100 hours |
| Mastery Max | 20-40 hours per element |
| Ascension Tier | Days to weeks |

## Anti-Patterns

- **Weak First Prestige**: 1.1x multiplier feels pointless
- **Punishing Reset**: Lose everything = feels like punishment
- **Impossible Battle Pass**: 4+ hours daily excludes most players
- **Win-Only Mastery**: Discourages using unmastered content

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `loot-systems` | Rewards from milestones |
| `economy-systems` | Currencies through progression |
| `dopamine-optimizer` | Reward timing psychology |
| `retention-engineer` | Long-term engagement |

## References

See `references/code-patterns.md` for PrestigeSystem, BattlePassSystem, MasteryTracker.
See `references/api-reference.md` for tier structures, XP curves, checklists.
