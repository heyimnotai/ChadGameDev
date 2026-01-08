---
name: game-architect
description: Master orchestration skill for iOS game development. Use when starting a new game project, planning overall game architecture, or coordinating multiple game systems. Triggers on new game creation, major feature planning, system integration, or when needing to decide which specialized skills to invoke. This skill coordinates all other ios-game-skills and provides the development workflow from concept to ship.
---

# Game Architect

## Purpose

The Game Architect skill provides the master workflow for building iOS games from concept to App Store submission. It orchestrates all other ios-game-skills, ensuring they are invoked in the correct order with proper handoffs. An agent with this skill can systematically guide game development through each phase, making informed decisions about when to delegate to specialized skills and how to integrate their outputs into a cohesive product.

## Domain Boundaries

**This skill handles:**
- Overall game development workflow orchestration
- Phase sequencing and milestone definition
- Skill selection and delegation decisions
- Cross-system integration coordination
- Genre selection and core concept validation
- Development phase gate criteria
- Skill invocation decision trees

**This skill does NOT handle:**
- Deep implementation of any single system (delegates to specialized skills)
- Specific technical implementations (see `05-technical/*`)
- Individual polish systems (see `04-polish/*`)
- Detailed psychology mechanics (see `03-player-psychology/*`)
- Core design specifics (see `02-core-design/*`)
- Compliance details (see `01-compliance/*`)

---

## Development Workflow

### Phase Overview

```
PHASE 1: CONCEPT (1-2 days)
    └─> Define genre, core loop, target audience
    └─> Skills: core-loop-architect

PHASE 2: FOUNDATION (1-2 weeks)
    └─> Implement core loop, basic progression
    └─> Skills: core-loop-architect, progression-system, difficulty-tuner

PHASE 3: SYSTEMS (2-4 weeks)
    └─> Economy, session design, retention mechanics
    └─> Skills: economy-balancer, session-designer, retention-engineer

PHASE 4: PSYCHOLOGY (1-2 weeks)
    └─> Onboarding, rewards, engagement hooks
    └─> Skills: onboarding-architect, dopamine-optimizer, reward-scheduler

PHASE 5: POLISH (2-3 weeks)
    └─> Animation, audio, haptics, particles, juice
    └─> Skills: animation-system, audio-designer, haptic-optimizer, particle-effects, screen-shake-impact, ui-transitions, juice-orchestrator

PHASE 6: TECHNICAL (1-2 weeks)
    └─> Performance, analytics, asset optimization
    └─> Skills: performance-optimizer, analytics-integration, asset-pipeline, spritekit-patterns OR swiftui-game-ui

PHASE 7: COMPLIANCE (3-5 days)
    └─> App Store requirements, privacy, IAP
    └─> Skills: app-store-review, privacy-manifest, iap-implementation, universal-app-requirements

PHASE 8: SOCIAL (1 week, if applicable)
    └─> Leaderboards, Game Center, sharing
    └─> Skills: game-center-integration, social-mechanics

PHASE 9: VALIDATION (3-5 days)
    └─> Quality audit, ship readiness
    └─> Skills: quality-validator, ship-readiness-checker
```

---

## Phase 1: Concept

### Genre Selection Decision Tree

```
START: What is the primary player experience?
│
├─ Quick, skill-based bursts
│  └─> HYPER-CASUAL
│      Session: 30s-2min, Monetization: Ads
│
├─ Pattern matching, strategic thinking
│  └─> PUZZLE/MATCH-3
│      Session: 3-5min, Monetization: Lives/boosters
│
├─ Power fantasy, build optimization
│  └─> ROGUELIKE
│      Session: 15-30min, Monetization: Characters/cosmetics
│
├─ Passive growth, number satisfaction
│  └─> IDLE/INCREMENTAL
│      Session: 30s active, Monetization: Time skips
│
├─ Base building, resource management
│  └─> STRATEGY
│      Session: Variable, Monetization: Gems/time
│
└─ Collection, competitive matching
   └─> CARD GAME
       Session: 3-4min, Monetization: Packs/passes
```

### Core Concept Validation Checklist

Before proceeding to Phase 2, verify:

- [ ] Genre clearly identified
- [ ] Core loop can be described in one sentence
- [ ] Session length target defined (exact minutes)
- [ ] Primary monetization strategy identified
- [ ] Target audience defined (age, player type)
- [ ] Retention hook identified (what brings players back)
- [ ] Differentiation from competitors articulated

**Required Skill:** `core-loop-architect` - Define the exact loop structure

---

## Phase 2: Foundation

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `core-loop-architect` | Finalize ACTION->FEEDBACK->REWARD->PROGRESSION cycle |
| 2 | `progression-system` | Define XP curves, level structure, power growth |
| 3 | `difficulty-tuner` | Establish difficulty curve, DDA parameters |

### Foundation Gate Criteria

Before proceeding to Phase 3:

- [ ] Core loop playable end-to-end
- [ ] One complete session achievable
- [ ] Basic progression visible to player
- [ ] Difficulty scales appropriately for first 10 levels
- [ ] Core mechanics feel responsive (feedback within 16ms)

---

## Phase 3: Systems

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `economy-balancer` | Design currency systems, sink/faucet balance |
| 2 | `session-designer` | Optimize session length, break points, return hooks |
| 3 | `retention-engineer` | Daily rewards, streaks, re-engagement systems |

### Systems Gate Criteria

Before proceeding to Phase 4:

- [ ] Currency system implemented (soft + hard if applicable)
- [ ] Economy simulated for D30 balance
- [ ] Session length matches genre target (+/- 20%)
- [ ] At least one daily return mechanic functional
- [ ] Streak system implemented with recovery option

---

## Phase 4: Psychology

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `onboarding-architect` | FTUE flow, progressive disclosure, early success |
| 2 | `dopamine-optimizer` | Variable rewards, anticipation, pity systems |
| 3 | `reward-scheduler` | Reward timing, magnitude, distribution |

### Psychology Gate Criteria

Before proceeding to Phase 5:

- [ ] FTUE completes in < 60 seconds to core loop
- [ ] First reward delivered within 2 minutes
- [ ] Tutorial completion tracked with analytics
- [ ] Variable reward system tested for engagement
- [ ] Reward schedule documented (daily/weekly/milestone)

---

## Phase 5: Polish

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `animation-system` | Timing, easing, squash/stretch |
| 2 | `audio-designer` | SFX, music, audio architecture |
| 3 | `haptic-optimizer` | Tactile feedback, Core Haptics |
| 4 | `particle-effects` | Visual effects, performance budgets |
| 5 | `screen-shake-impact` | Camera shake, freeze frames, flash |
| 6 | `ui-transitions` | Screen navigation, modal presentations |
| 7 | `juice-orchestrator` | Cross-system coordination, feedback intensity |

### Polish Gate Criteria

Before proceeding to Phase 6:

- [ ] Every button has press/release feedback
- [ ] Every significant action has sound
- [ ] Haptics implemented for all major events
- [ ] Particles within budget (< 500 active)
- [ ] Screen shake implemented with disable option
- [ ] All transitions animated (no hard cuts)
- [ ] Juice orchestrator validated cross-system sync

---

## Phase 6: Technical

### Framework Decision Tree

```
START: What is the primary rendering need?
│
├─ UI-heavy, minimal real-time graphics
│  └─> SwiftUI + TimelineView/Canvas
│      Skill: swiftui-game-ui
│
├─ 2D sprites, physics, particles
│  └─> SpriteKit
│      Skill: spritekit-patterns
│
└─ Custom 3D, demanding performance
   └─> Metal (advanced)
       Skill: performance-optimizer (includes Metal guidance)
```

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `spritekit-patterns` OR `swiftui-game-ui` | Framework implementation |
| 2 | `performance-optimizer` | 60fps, ProMotion, thermals, memory |
| 3 | `asset-pipeline` | Compression, formats, ODR |
| 4 | `analytics-integration` | Event tracking, funnels, A/B testing |

### Technical Gate Criteria

Before proceeding to Phase 7:

- [ ] 60fps sustained on oldest supported device
- [ ] Launch time < 400ms to first frame
- [ ] Memory peak < 1GB
- [ ] ProMotion support enabled (if targeting 120Hz)
- [ ] Thermal throttling handled gracefully
- [ ] Analytics events firing correctly
- [ ] FTUE funnel tracked

---

## Phase 7: Compliance

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `app-store-review` | Guideline compliance, rejection prevention |
| 2 | `privacy-manifest` | PrivacyInfo.xcprivacy, ATT |
| 3 | `iap-implementation` | StoreKit 2, purchase flows, validation |
| 4 | `universal-app-requirements` | iPhone + iPad, size classes, safe areas |

### Compliance Gate Criteria

Before proceeding to Phase 8:

- [ ] Privacy manifest complete and accurate
- [ ] All IAP tested with StoreKit configuration
- [ ] Restore purchases functional
- [ ] Loot box odds disclosed (if applicable)
- [ ] Universal app tested on iPad
- [ ] Safe areas respected on all devices
- [ ] Touch targets minimum 44x44 pt
- [ ] Age rating accurately reflects content

---

## Phase 8: Social (If Applicable)

### Decision: Social Features Needed?

```
Include social features if:
├─ Competitive element (scores, ranks)
├─ Cooperative gameplay
├─ Viral growth desired
├─ Long-term retention priority
└─ Genre expects it (strategy, card games)

Skip social features if:
├─ Hyper-casual with ad monetization only
├─ Single-player puzzle with no rankings
└─ Minimal viable product timeline
```

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `game-center-integration` | Authentication, leaderboards, achievements |
| 2 | `social-mechanics` | Sharing, friend systems, guilds |

### Social Gate Criteria

Before proceeding to Phase 9:

- [ ] Game Center authentication functional
- [ ] Leaderboards submit and display correctly
- [ ] Achievements unlock as expected
- [ ] Share functionality tested
- [ ] Friend-based features work (if implemented)

---

## Phase 9: Validation

### Skills to Invoke

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `quality-validator` | Comprehensive quality audit |
| 2 | `ship-readiness-checker` | Final submission requirements |

### Validation Process

1. **Run quality-validator** - Full audit across all dimensions
2. **Address all critical failures** - Go back to relevant phase/skill
3. **Run ship-readiness-checker** - Final submission gates
4. **Submit to App Store** - Only after all gates pass

---

## Skill Quick Reference

### By Category

**Compliance (01-compliance/)**
| Skill | Use When |
|-------|----------|
| `app-store-review` | Pre-submission, rejection response |
| `privacy-manifest` | New project, SDK integration |
| `iap-implementation` | Adding monetization |
| `game-center-integration` | Adding social/competitive features |
| `universal-app-requirements` | iPhone + iPad support |

**Core Design (02-core-design/)**
| Skill | Use When |
|-------|----------|
| `core-loop-architect` | Designing primary gameplay |
| `progression-system` | XP, levels, unlocks |
| `economy-balancer` | Currencies, spending, earning |
| `difficulty-tuner` | Challenge scaling, DDA |
| `session-designer` | Session length, return hooks |

**Player Psychology (03-player-psychology/)**
| Skill | Use When |
|-------|----------|
| `dopamine-optimizer` | Variable rewards, loot |
| `retention-engineer` | Daily loops, streaks |
| `onboarding-architect` | FTUE, tutorials |
| `reward-scheduler` | Timing reward delivery |
| `social-mechanics` | Leaderboards, sharing |

**Polish (04-polish/)**
| Skill | Use When |
|-------|----------|
| `animation-system` | Movement, feedback timing |
| `audio-designer` | SFX, music, latency |
| `haptic-optimizer` | Tactile feedback |
| `particle-effects` | Visual effects |
| `screen-shake-impact` | Camera shake, freeze frames |
| `ui-transitions` | Screen navigation |
| `juice-orchestrator` | Cross-system coordination |

**Technical (05-technical/)**
| Skill | Use When |
|-------|----------|
| `spritekit-patterns` | 2D game implementation |
| `swiftui-game-ui` | UI-heavy games, HUDs |
| `performance-optimizer` | Frame rate, memory |
| `asset-pipeline` | Textures, audio formats |
| `analytics-integration` | Event tracking, funnels |

**Orchestration (06-orchestration/)**
| Skill | Use When |
|-------|----------|
| `game-architect` | Starting project, overall planning |
| `quality-validator` | Phase completion, audits |
| `ship-readiness-checker` | Pre-submission final check |

---

## Anti-Patterns

### Skip Phase Thinking

**Don't:** Jump directly to polish before core loop is validated
**Why:** Polishing broken mechanics wastes effort and masks problems
**Instead:** Complete each phase gate before advancing

### Parallel Phase Execution

**Don't:** Work on all phases simultaneously
**Why:** Dependencies between phases cause rework
**Instead:** Sequential phases with complete handoffs

### Single-Skill Reliance

**Don't:** Use only one skill for complex features
**Why:** Missing cross-domain concerns leads to gaps
**Instead:** Layer skills appropriately (e.g., `dopamine-optimizer` + `reward-scheduler`)

### Skipping Validation

**Don't:** Submit without running `quality-validator` and `ship-readiness-checker`
**Why:** 40% of App Store rejections are preventable with proper validation
**Instead:** Always run both validation skills before submission

---

## Quality Checklist

Before considering game development complete:

- [ ] All 9 phases completed with gates passed
- [ ] Core loop validated with actual play sessions
- [ ] Retention mechanics tested over simulated D1/D7/D30
- [ ] All polish systems coordinated via juice-orchestrator
- [ ] Performance validated on oldest supported device
- [ ] Compliance checklist from app-store-review complete
- [ ] Quality-validator shows all dimensions passing
- [ ] Ship-readiness-checker gives green light

---

## Adjacent Skills

| Concern | Skill | Handoff |
|---------|-------|---------|
| Starting point for any system | Category skills | This skill determines WHICH skill to invoke |
| Phase completion validation | `quality-validator` | Run after each major phase |
| Final submission | `ship-readiness-checker` | Run after quality-validator passes |
| Specific implementations | All other skills | Delegate based on phase and need |
