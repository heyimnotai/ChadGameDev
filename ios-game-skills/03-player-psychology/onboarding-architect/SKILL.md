---
name: onboarding-architect
description: Use when designing first-time user experiences, tutorial sequences, or first-session flows. Triggers on FTUE design, new player onboarding, skip/restart flows, or building the first 30 seconds to 10 minutes of gameplay. Covers progressive disclosure, beginner's luck, and D1 retention optimization.
---

# Onboarding Architect

Design FTUE flows that maximize D1 retention by getting players to the core loop quickly, teaching through play, and engineering early success.

## Decision Tree: Tutorial Complexity

```
Game complexity?
+-- Hyper-casual (1 mechanic)
|   +-- No tutorial, first tap shows result, playing in 5s
+-- Casual (2-3 mechanics)
|   +-- Light tutorial: 3-5 steps, 30-60s, skip after first mechanic
+-- Mid-core (4-6 mechanics)
|   +-- Phased: Core=60s, each additional=30s, gate advanced features
+-- Core/Complex (7+ mechanics)
    +-- Extended: Session 1=core only, Sessions 2-3=supporting, 4+=advanced
```

## Decision Tree: Hint Escalation

```
Player idle on expected action?
+-- 0-3 seconds: No hint (thinking time)
+-- 3-5 seconds: Subtle glow on target
+-- 5-8 seconds: Animated finger indicator
+-- 8-12 seconds: Text hint in speech bubble
+-- 12+ seconds: Auto-demo of action

Failed same action before?
+-- First attempt: Use timing above
+-- Second attempt: Skip to finger at 3s
+-- Third+ attempt: Text at 3s, auto-demo at 8s
```

## Core Principles

**30-Second Rule**: Player must understand value proposition, perform first action, and receive feedback within 30 seconds. No text walls.

**First 2 Minutes**: Hook (0-30s) -> Core loop introduction (30-90s) -> First reward (90-120s). Total text budget: 35-70 words.

**Show Don't Tell**: Demonstrate -> Guide (highlight) -> Assist (auto-complete if stuck) -> Explain (text only as last resort).

**Beginner's Luck**: First 3 levels = 95-100% success rate. Enemy HP at 0.6x, damage at 0.5x, player damage at 1.5x, drops at 2.0x.

**Progressive Disclosure**: Gate features by level. Settings=Session 1, Shop=Level 3, Social=Level 5, Leaderboards=Level 10, Guilds=Level 15.

## First Session Structure

```
Minutes 0-2:   Hook + Core Loop (first action + feedback)
Minutes 2-4:   Mechanic Layering (secondary + combination)
Minutes 4-6:   First Challenge (85%+ success rate)
Minutes 6-8:   Meta-Game Peek (progression + first upgrade)
Minutes 8-10:  Session End (summary + next tease)
```

## Quality Checklist

### First 30 Seconds
- [ ] Value proposition clear without text
- [ ] First element visually obvious (size, color, animation)
- [ ] First tap produces feedback <100ms
- [ ] No loading screens after launch
- [ ] Player acted by 15 seconds

### Tutorial Flow
- [ ] Max 5-second idle before hint
- [ ] Hint escalation: glow -> finger -> text -> demo
- [ ] Auto-complete at 15 seconds if stuck
- [ ] Completable in under 5 minutes
- [ ] Skip option accessible but not prominent

### Beginner's Luck
- [ ] First 3 levels have 95%+ success rate
- [ ] Difficulty scaling invisible to player
- [ ] First loss includes encouragement
- [ ] Drop rates boosted early

### Analytics
- [ ] Every step fires tracking event
- [ ] Time and hints per step recorded
- [ ] Skip/abandon events include context
- [ ] D1 retention correlated with FTUE completion

## Anti-Patterns

**Text Wall**: Modal with 100+ words before gameplay. -40% drop-off.

**Forced Account**: Login required before playing. -60% abandonment.

**Feature Overload**: 8+ buttons visible on first launch. Decision paralysis.

**Punishing First Failure**: Life loss + score reset on first death. New players quit.

## References

- [Code Patterns](references/code-patterns.md) - TutorialStepManager, ProgressiveDisclosureManager, FirstSessionCoordinator, BeginnersLuckSystem, FTUEAnalyticsTracker
- [API Reference](references/api-reference.md) - Timing targets, D1 correlation, text budgets, difficulty multipliers, analytics events

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| retention-engineer | D1/D7/D30 retention systems |
| dopamine-optimizer | First reward timing |
| difficulty-tuner | Beginner's luck calibration |
| analytics-integration | FTUE funnel tracking |
| core-loop-architect | What FTUE teaches |
