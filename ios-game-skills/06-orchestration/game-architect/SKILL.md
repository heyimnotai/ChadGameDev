---
name: game-architect
description: Use when starting a new game project, planning architecture, or coordinating multiple systems. Triggers on new game creation, major feature planning, or deciding which skills to invoke.
---

# Game Architect

## Purpose

Master workflow for iOS game development from concept to App Store. Orchestrates all ios-game-skills, ensuring correct invocation order and proper handoffs between phases.

## When to Use

- Starting a new game project
- Planning overall game architecture
- Deciding which specialized skill to invoke
- Coordinating cross-system integration
- Phase gate validation

## Core Process

**9 Phases (Sequential)**

1. **CONCEPT** (1-2 days) - Genre, core loop, audience
   - Skills: `core-loop-architect`

2. **FOUNDATION** (1-2 weeks) - Playable core loop
   - Skills: `core-loop-architect`, `progression-system`, `difficulty-tuner`

3. **SYSTEMS** (2-4 weeks) - Economy, sessions, retention
   - Skills: `economy-balancer`, `session-designer`, `retention-engineer`

4. **PSYCHOLOGY** (1-2 weeks) - FTUE, rewards, engagement
   - Skills: `onboarding-architect`, `dopamine-optimizer`, `reward-scheduler`

5. **POLISH** (2-3 weeks) - Animation, audio, haptics, juice
   - Skills: `animation-system`, `audio-designer`, `haptic-optimizer`, `particle-effects`, `juice-orchestrator`

6. **TECHNICAL** (1-2 weeks) - Performance, analytics, assets
   - Skills: `performance-optimizer`, `analytics-integration`, `asset-pipeline`

7. **COMPLIANCE** (3-5 days) - App Store, privacy, IAP
   - Skills: `app-store-review`, `privacy-manifest`, `iap-implementation`

8. **SOCIAL** (1 week, optional) - Leaderboards, sharing
   - Skills: `game-center-integration`, `social-mechanics`

9. **VALIDATION** (3-5 days) - Quality audit, ship check
   - Skills: `quality-validator`, `ship-readiness-checker`

## Key Rules

- Complete each phase gate before advancing
- Never skip directly to polish before core loop validated
- Run `quality-validator` at each phase completion
- Always run both validators before submission

## Genre Quick Reference

| Experience | Genre | Session | Monetization |
|------------|-------|---------|--------------|
| Quick skill bursts | Hyper-casual | 30s-2min | Ads |
| Pattern matching | Puzzle/Match-3 | 3-5min | Lives/boosters |
| Power fantasy | Roguelike | 15-30min | Characters |
| Passive growth | Idle | 30s active | Time skips |
| Base building | Strategy | Variable | Gems/time |

## Phase Gates

| Phase | Gate Criteria |
|-------|--------------|
| Foundation | Core loop playable, 10 levels |
| Systems | Economy simulated D30 |
| Psychology | FTUE <60s to loop |
| Polish | All feedback layers |
| Technical | 60fps on oldest device |
| Compliance | Privacy manifest complete |

## Anti-Patterns

**Skip phase thinking**: Complete gates before advancing
**Parallel phases**: Dependencies cause rework
**Single-skill reliance**: Layer skills for complex features
**Skipping validation**: 40% of rejections preventable

## Adjacent Skills

- `quality-validator` - Run after each phase
- `ship-readiness-checker` - Final submission gate
- All specialized skills - Delegated per phase

## References

See `references/api-reference.md` for skill quick reference by category.
