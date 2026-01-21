---
name: core-loop-architect
description: Use when designing the fundamental ACTION -> FEEDBACK -> REWARD -> PROGRESSION cycle. Triggers on creating primary gameplay patterns, defining moment-to-moment player actions, or architecting engagement loops for any genre.
---

# Core Loop Architect

## Purpose

Design genre-appropriate core gameplay loops that create compelling, repeatable engagement patterns. The core loop is the foundation upon which all retention, monetization, and progression systems are built.

## When to Use

- Creating new game's primary gameplay pattern
- Defining what players do moment-to-moment
- Choosing loop structure for specific genre
- Optimizing engagement timing

## Core Process

1. **Identify target session length** - Determines genre pattern
2. **Select loop pattern** - Hyper-casual, puzzle, roguelike, idle, strategy, or card
3. **Define phases** - ACTION (input) -> FEEDBACK (response) -> REWARD (benefit) -> PROGRESSION (growth)
4. **Set timing targets** - Feedback <16ms, reward <5s, progression <2min
5. **Add engagement hooks** - First win <30s, first reward <2min
6. **Implement near-miss feedback** - Makes failures motivating
7. **Enable instant restart** - <500ms to retry
8. **Validate loop timing** - Match genre specifications

## Key Rules

- **Feedback within 16ms** - 1 frame at 60fps, includes haptic+visual+audio
- **Reward within 5 seconds** - Player must see benefit quickly
- **First success in 30 seconds** - Competence validation
- **Instant restart capability** - <500ms, no friction
- **Near-miss feedback required** - Failures should motivate, not punish
- **Variable outcomes** - Prevents monotony, drives engagement

## Quick Reference

**Loop Pattern by Session Length:**
- <2 min: Hyper-casual (Play->Score->Retry)
- 2-10 min: Puzzle/Card (Level->Win->Unlock)
- 10-30 min: Roguelike (Kill->Level->Upgrade)
- Passive: Idle (Collect->Upgrade->Wait)

**Timing Targets:**
| Genre | Micro-Loop | Session | Loops/Session |
|-------|------------|---------|---------------|
| Hyper-Casual | 1-5s | 2-5 min | 5-15 |
| Puzzle | 2-4s | 10-20 min | 3-6 |
| Roguelike | 0.5-2s | 20-40 min | 1-2 |
| Card | 1-5s | 10-30 min | 3-10 |

**Anti-Patterns:**
- Front-loading complexity (teach 1 mechanic, not 5)
- Delayed rewards (must come within 2 min)
- Monotonous outcomes (vary rarity, magnitude)
- No near-miss feedback (show "Almost!")
- Slow restart (>500ms kills flow)

See `references/api-reference.md` for detailed timing tables and decision trees.
See `references/code-patterns.md` for Swift implementations.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `progression-system` | XP curves fuel PROGRESSION phase |
| `economy-balancer` | Currency rewards in loop |
| `difficulty-tuner` | Challenge maintains flow |
| `session-designer` | Multiple loops form sessions |
| `reward-scheduler` | Fine-tunes reward timing |
| `onboarding-architect` | Teaches loop through play |
