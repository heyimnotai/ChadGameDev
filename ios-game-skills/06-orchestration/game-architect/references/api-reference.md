# Game Architect API Reference

## Skills by Category

### 01-compliance
| Skill | Use When |
|-------|----------|
| app-store-review | Pre-submission, rejection response |
| privacy-manifest | New project, SDK integration |
| iap-implementation | Adding monetization |
| game-center-integration | Social/competitive features |
| universal-app-requirements | iPhone + iPad support |

### 02-core-design
| Skill | Use When |
|-------|----------|
| core-loop-architect | Designing primary gameplay |
| progression-system | XP, levels, unlocks |
| economy-balancer | Currencies, spending, earning |
| difficulty-tuner | Challenge scaling, DDA |
| session-designer | Session length, return hooks |

### 03-player-psychology
| Skill | Use When |
|-------|----------|
| dopamine-optimizer | Variable rewards, loot |
| retention-engineer | Daily loops, streaks |
| onboarding-architect | FTUE, tutorials |
| reward-scheduler | Timing reward delivery |
| social-mechanics | Leaderboards, sharing |

### 04-polish
| Skill | Use When |
|-------|----------|
| animation-system | Movement, feedback timing |
| audio-designer | SFX, music, latency |
| haptic-optimizer | Tactile feedback |
| particle-effects | Visual effects |
| screen-shake-impact | Camera shake, freeze frames |
| ui-transitions | Screen navigation |
| juice-orchestrator | Cross-system coordination |

### 05-technical
| Skill | Use When |
|-------|----------|
| spritekit-patterns | 2D game implementation |
| swiftui-game-ui | UI-heavy games, HUDs |
| performance-optimizer | Frame rate, memory |
| asset-pipeline | Textures, audio formats |
| analytics-integration | Event tracking, funnels |

### 06-orchestration
| Skill | Use When |
|-------|----------|
| game-architect | Starting project, planning |
| quality-validator | Phase completion, audits |
| ship-readiness-checker | Pre-submission check |

## Genre Selection

```
Quick skill bursts → HYPER-CASUAL (30s-2min, Ads)
Pattern matching → PUZZLE/MATCH-3 (3-5min, Lives)
Power fantasy → ROGUELIKE (15-30min, Characters)
Passive growth → IDLE (30s active, Time skips)
Base building → STRATEGY (Variable, Gems)
Collection → CARD GAME (3-4min, Packs)
```

## Phase Duration Guide

| Phase | Duration | Gate |
|-------|----------|------|
| Concept | 1-2 days | Loop describable in 1 sentence |
| Foundation | 1-2 weeks | Core loop playable |
| Systems | 2-4 weeks | Economy simulated D30 |
| Psychology | 1-2 weeks | FTUE <60s |
| Polish | 2-3 weeks | All feedback present |
| Technical | 1-2 weeks | 60fps oldest device |
| Compliance | 3-5 days | Privacy manifest done |
| Social | 1 week | Game Center works |
| Validation | 3-5 days | All validators pass |

## Concept Validation Checklist

- [ ] Genre identified
- [ ] Core loop in one sentence
- [ ] Session length defined
- [ ] Monetization strategy identified
- [ ] Target audience defined
- [ ] Retention hook identified
- [ ] Differentiation articulated

## Framework Decision

```
UI-heavy, minimal graphics → SwiftUI + TimelineView
2D sprites, physics → SpriteKit
Custom 3D, demanding → Metal
```
