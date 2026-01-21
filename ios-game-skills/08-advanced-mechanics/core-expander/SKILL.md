---
name: core-expander
description: Use when game's core loop reaches 90% quality and needs expansion beyond basics. Triggers on quality milestone. Analyzes genre, identifies gaps, prioritizes mechanics by impact/effort, and provides phased implementation guidance.
---

# Core Expander

## Purpose

Strategically expand games with solid core loops (90%+) by recommending high-impact mechanics based on genre, existing features, and retention needs. Prevents feature bloat by prioritizing and phasing additions.

## When to Use

- Core loop quality reaches 90%+
- Need to add depth without diluting core
- Planning next development phase
- Retention metrics need improvement

## Core Process

1. **Analyze Game**: Identify genre, session length, progression type
2. **Catalog Existing**: List current mechanics
3. **Find Gaps**: Compare to genre expectations
4. **Score Candidates**: Prioritize by fit/effort/impact/synergy
5. **Phase Recommendations**: 2-3 mechanics per phase, quick wins first
6. **Reference Research**: Link to detailed implementation guides

## Key Rules

- Never recommend mechanics for sub-90% core loops
- Max 3 mechanics per implementation phase
- Match mechanics to genre (no PvP in relaxation games)
- Quick wins first (Phase 1), depth later (Phase 2-3)
- Every recommendation needs success metric
- Avoid complexity if retention is the issue

## Quick Reference

**Priority Formula**: Genre Fit (25%) + Low Effort (25%) + Retention (20%) + Synergy (15%) + Uniqueness (15%)

**Genre Must-Haves**:
- Idle: Prestige, Offline Progress, Upgrades
- Puzzle: Star Rating, Power-ups, Episode Gates
- Action: Leaderboards, Combos, Unlockables
- Strategy: Unit Upgrades, Currencies
- Roguelike: Meta Progression, Random Items

See `references/api-reference.md` for full genre recommendations.
See `references/code-patterns.md` for analysis code and synergy maps.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `core-loop-architect` | Design core loop first |
| `progression-systems` | Implement prestige, battle pass |
| `loot-systems` | Implement chests, gacha |
| `economy-systems` | Implement currencies, shops |
| `character-systems` | Implement traits, classes |
| `enemy-design` | Implement variety, bosses |
