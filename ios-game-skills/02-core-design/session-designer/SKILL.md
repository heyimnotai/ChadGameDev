---
name: session-designer
description: Use when designing play session structure, length, break points, or return hooks. Triggers on session pacing, energy system timing, or optimizing for retention through session flow.
---

# Session Designer

## Purpose

Design optimally-structured play sessions that respect player time while maximizing engagement and return visits. Create the "one more game" effect while ending on satisfying notes that drive next-day retention.

## When to Use

- Setting target session length by genre
- Designing natural break points
- Creating session start/end sequences
- Implementing energy/lives systems
- Building return hooks (inter-session bridges)

## Core Process

1. **Set session target by genre** - Hyper-casual 2-5min, Puzzle 5-15min, Roguelike 15-30min
2. **Design session structure** - Hook -> Warm-up -> Core -> Climax -> Resolution -> Bridge
3. **Place break points** - Every 3-5 minutes, always after level complete
4. **Create strong start** - Daily bonus, offline rewards, clear goal in <30s
5. **Create satisfying end** - Summary, reward animation, preview next content
6. **Add mid-session hooks** - Streaks, near-misses, surprise rewards
7. **Build return bridges** - Timer rewards (4-8h), daily reset, streak maintenance
8. **Configure energy (if needed)** - 5 lives, 30min regen = industry standard

## Key Rules

- **First interaction in 5 seconds** - No cold starts
- **Break point every 3-5 minutes** - Natural stopping opportunities
- **Never punish exit** - Auto-save, graceful exit
- **Clear return reason** - Always show when to come back
- **F2P viable** - 30+ minutes free play per day minimum
- **Session end = celebration** - Never make leaving feel bad

## Quick Reference

**Session Length by Genre:**
| Genre | Target | Sessions/Day |
|-------|--------|--------------|
| Hyper-Casual | 2-5 min | 5-10 |
| Puzzle | 5-15 min | 3-5 |
| Card | 10-20 min | 2-4 |
| Roguelike | 15-30 min | 1-3 |
| Idle | 1-3 min active | 8-15 |

**Session Structure (15 min example):**
```
0:00-0:30  HOOK: Daily bonus, clear goal
0:30-2:00  WARM-UP: Easy win, momentum
2:00-10:00 CORE: Main gameplay
10:00-12:00 CLIMAX: Boss/challenge
12:00-14:00 RESOLUTION: Rewards, achievements
14:00-15:00 BRIDGE: Preview next, set timer
```

**Energy System Standard:**
- 5 lives, 30 min regen each = 2.5 hr full refill
- F2P: 30+ min play per day
- Bonus energy can exceed cap

**Return Bridges:**
- Timer reward: 4-8 hours
- Daily reset: 24 hours
- Streak maintenance: 24 hours
- Energy refill: system-based

**Anti-Patterns:**
- Endless session (no breaks = burnout)
- Punishing exit ("All progress lost!")
- Cold start (no welcome/context)
- Aggressive energy (5 min/day free = predatory)

See `references/api-reference.md` for timing tables.
See `references/code-patterns.md` for Swift implementations.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `core-loop-architect` | Sessions contain multiple loops |
| `progression-system` | Level-ups punctuate sessions |
| `economy-balancer` | Currency earning per session |
| `reward-scheduler` | Drives session rhythm |
| `retention-engineer` | Session design = D1/D7 retention |
