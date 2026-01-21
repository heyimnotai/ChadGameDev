---
name: enemy-design
description: Use when adding new enemy types, boss fights, adaptive difficulty, or encounter design. Triggers on enemy archetypes, AI behaviors, boss phases, telegraphing, or difficulty scaling.
---

# Enemy Design

## Purpose

Design and implement enemy systems that create memorable, fair, and escalating challenges. Covers enemy archetypes, boss fight phases, AI behavior trees, weakness systems, and difficulty scaling.

## When to Use

- Adding new enemy types
- Designing boss encounters
- Implementing AI behaviors
- Creating weakness/resistance systems
- Tuning difficulty scaling
- Composing encounter waves

## Core Process

1. Define enemy archetype hierarchy (fodder to boss)
2. Create behavior trees for each archetype
3. Design boss phases with escalating mechanics
4. Implement telegraph timing for fairness
5. Add weakness system for strategic depth
6. Tune difficulty scaling (static and adaptive)

## Key Rules

**Archetypes**: Each must have distinct silhouette, recognizable behavior, and learnable counter. Mix creates interesting compositions.

**Boss Phases**: 2-4 phases based on fight length. Each phase adds mechanics, not just HP. Enrage creates urgency, not unfairness.

**Telegraphs**: Fast attacks 0.3-0.5s, medium 0.5-1.0s, slow 1.0-2.0s, ultimates 2.0-3.0s. Always visual + audio.

**Scaling**: HP grows 10% per level, damage 8% per level, speed caps at 1.5x. Adaptive difficulty adjusts invisibly.

**Fairness**: Every attack has counterplay. Swarms need AoE options. Immunities show clear feedback.

## Quick Reference

| Tier | Type | Role |
|------|------|------|
| 1 | Fodder | Tutorial, power fantasy |
| 2 | Basic | Standard challenge |
| 3 | Elite | Skill check |
| 4 | Champion | Mini-boss |
| 5 | Boss | Climactic |

## Anti-Patterns

- **Unfair Damage**: One-shots with no warning
- **Damage Sponge**: High HP, no phase evolution
- **Swarm Without Counter**: No AoE available
- **Invisible Stats**: Hidden immunity, no feedback

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `loot-systems` | Enemy drop tables |
| `progression-systems` | Enemy scaling with player |
| `difficulty-tuner` | Balance challenge |
| `haptic-optimizer` | Impact feedback |

## References

See `references/code-patterns.md` for EnemyFactory, BehaviorTree, BossEncounter, DifficultyScaler.
See `references/api-reference.md` for archetype tables, phase structure, scaling formulas.
