---
name: character-systems
description: Use when adding character customization, class selection, perk systems, or equipment loadouts. Triggers on trait systems, skill trees, build diversity, synergies, or theorycraft mechanics.
---

# Character Systems

## Purpose

Design and implement character customization systems that create meaningful player identity, build diversity, and replayability through choice. Covers traits, classes, skill trees, loadouts, and synergy mechanics.

## When to Use

- Adding trait/perk systems
- Designing class archetypes
- Implementing skill trees
- Creating loadout/preset systems
- Building equipment synergies
- Enabling theorycrafting depth

## Core Process

1. Define trait categories (offensive, defensive, utility, synergy)
2. Design skill tree structure (linear, branching, web, cluster)
3. Set point economy and slot progression
4. Implement loadout with preset saving
5. Create synergy rules (set bonuses, elemental, combos)
6. Add respec mechanics with reasonable cost

## Key Rules

**Trait Slots**: Scale with level (1 slot at start, 5 at endgame). Each trait must have clear purpose with no "trap" options.

**Skill Trees**: Linear for <10h games, branching for 10-50h, web/cluster for 50h+. Keystones should define builds.

**Loadouts**: 3 free presets minimum, quick-switch in lobby, handle missing items gracefully.

**Synergies**: 2-piece achievable easily, full set powerful but not mandatory. Mix-and-match must be viable.

**Respec**: Always allow with reasonable cost. Players afraid to experiment will just look up builds.

## Quick Reference

| System | Casual | Mid-core | Hardcore |
|--------|--------|----------|----------|
| Trait Slots | 2-3 | 3-5 | 5-8 |
| Tree Nodes | 20-30 | 50-100 | 100+ |
| Loadout Presets | 3 | 5 | 10 |

## Anti-Patterns

- **Trap Options**: Strictly worse traits destroy choice illusion
- **Locked Builds**: No respec kills experimentation
- **Mandatory Sets**: 6-piece too strong makes 2-piece useless
- **Hidden Synergies**: Discoverable but not cryptic

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `loot-systems` | Equipment drops for loadouts |
| `progression-systems` | Skill point earning |
| `economy-systems` | Respec costs |
| `enemy-design` | Encounters that test builds |

## References

See `references/code-patterns.md` for TraitSystem, SkillTreeSystem, LoadoutSystem.
See `references/api-reference.md` for scaling tables, archetypes, checklists.
