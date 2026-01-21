---
name: dopamine-optimizer
description: Use when designing reward systems, loot mechanics, gacha systems, or variable outcome features. Triggers on implementing drop rates, chest openings, reward reveals, pity systems, or near-miss feedback. Covers variable ratio schedules, anticipation building, and ethical implementation with App Store compliance.
---

# Dopamine Optimizer

Design reward systems that maximize player satisfaction through evidence-based psychology while maintaining ethical boundaries and regulatory compliance.

## Decision Tree: Schedule Selection

```
Is the reward the primary motivation for the action?
├── YES: How valuable is the reward?
│   ├── HIGH (rare items, premium currency)
│   │   └── Use VR-25 to VR-50 with pity system
│   ├── MEDIUM (uncommon items, boosters)
│   │   └── Use VR-10 with soft pity at 15
│   └── LOW (common drops, XP)
│       └── Use VR-3 to VR-5, no pity needed
└── NO: Is the action inherently enjoyable?
    ├── YES → Use VR-10+ to add surprise without overshadowing fun
    └── NO → Use fixed ratio FR-3 to FR-5 for predictability
```

## Decision Tree: Pity System Selection

```
What type of system is this?
├── GACHA/LOOT BOX
│   ├── Premium currency cost > $5 → Hard pity 70-90, soft at 75%
│   └── Premium currency cost < $5 → Hard pity 40-50, soft at 75%
├── GAMEPLAY DROP
│   ├── Required for progression → Hard pity 20-30, soft at 60%
│   └── Optional collectible → Soft pity only at 50% expected
└── FREE REWARD
    └── No pity needed, use PRD to smooth variance
```

## Core Principles

**Variable Ratio Schedules**: VR schedules produce highest engagement. Use VR-3 (early game) to VR-50 (ultra-rare). Keep average frequency below 55 attempts.

**Reward Timing**: Scale anticipation with rarity. Common: 500ms total (20% anticipation). Legendary: 4000ms total (60% anticipation). Immediate haptic/sound within 15ms.

**Pity Systems**: Soft pity at 75% of hard pity, increasing 6-10% per attempt. Hard pity guarantees at cap. Display counter before purchase.

**Burnout Prevention**: Cap legendary at 2/session, epic at 5/session. Apply diminishing returns: `value = base * 0.9^rewards_count`. Full recovery after 4 hours.

**Near-Miss Ethics**: Maximum 25% of losses. Only for skill-based outcomes. Never manipulate monetized random displays.

## Quality Checklist

### Pity System
- [ ] Hard pity guarantees at exact count
- [ ] Soft pity increases smoothly
- [ ] Counter persists across sessions
- [ ] Counter displayed before purchase
- [ ] Resets only on target rarity success

### Odds Disclosure (Apple Required)
- [ ] All odds disclosed BEFORE purchase
- [ ] Percentages with 2 decimal precision
- [ ] Individual item rates shown
- [ ] Accessible from purchase screen
- [ ] Unit tests verify implementation matches disclosure

### Reward Timing
- [ ] Haptic fires within 5ms
- [ ] Sound plays within 15ms
- [ ] Anticipation scales with rarity
- [ ] Max 4 seconds total
- [ ] Skip option after first view

### Ethics
- [ ] No fake near-misses
- [ ] No display manipulation
- [ ] Regional compliance (Belgium, Netherlands)
- [ ] Age-gating for monetized random rewards
- [ ] Spending limits available

## References

- [Code Patterns](references/code-patterns.md) - PitySystemManager, PRD, RewardTimingController, SessionRewardManager, LootTable
- [API Reference](references/api-reference.md) - VR schedules, pity tables, timing specs, session caps

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| retention-engineer | Daily rewards and streaks |
| reward-scheduler | Fixed schedules, achievements |
| onboarding-architect | First reward timing |
| economy-balancer | Currency values |
| juice-orchestrator | Reward reveal animations |
