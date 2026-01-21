---
name: animation-system
description: Use when implementing game animations with precise timing specs. Triggers on button feedback, score counters, item collection, character movement, hit reactions, menus, or reward reveals.
---

# Animation System

## Purpose

Implements frame-perfect animation timing for iOS games. Provides exact durations, easing curves, and choreography specs that create polished, satisfying feedback meeting top App Store standards.

## When to Use

- Implementing button press/release animations
- Creating score counter roll-up effects
- Building item collection fly-to-counter sequences
- Designing character jump/land squash-stretch
- Adding hit reaction and damage feedback
- Creating menu open/close transitions
- Building reward reveal ceremonies (loot boxes, daily rewards)
- Choreographing victory/defeat sequences

## Core Process

1. **Identify animation type** - Button, counter, collection, character, menu, or reward
2. **Look up timing spec** - Get duration, easing from reference tables
3. **Apply squash/stretch** - Maintain volume (X*Y=1.0) for physical animations
4. **Add anticipation** - 50-100ms wind-up before major actions
5. **Layer feedback** - Coordinate haptic + audio + visual timing
6. **Test on device** - Verify feel at 60fps on actual hardware

## Key Rules

**Timing Fundamentals:**
- Press: 100ms ease-out, Release: 150ms ease-out-back
- Score counter: 500-1000ms ease-in-out with completion pulse
- Item collection: 260ms total (scale + fly + counter pulse)
- Screen transitions: 200-350ms (multiply 1.3x for iPad)

**Squash/Stretch Volume Conservation:**
- Jump anticipation: X=1.2, Y=0.83
- Land squash: X=1.3, Y=0.77
- Always maintain X*Y approximately 1.0

**Choreography Principles:**
- Stagger list items 50ms apart
- Reward items: 300ms per item reveal
- Victory sequence: 2500-3000ms total
- Defeat sequence: 1700-2000ms total (respectful but quick)

## Quick Reference

| Animation | Duration | Easing |
|-----------|----------|--------|
| Button press | 100ms | ease-out |
| Button release | 150ms | ease-out-back |
| Item fly-to-counter | 200ms | ease-in-out |
| Menu open | 250ms | ease-out-back |
| Menu close | 200ms | ease-in |
| Screen transition | 300ms | ease-in-out |
| Hit reaction | 300ms | (flash+knockback+recover) |
| Reward reveal/item | 300ms | spring |

See `references/api-reference.md` for complete timing tables.
See `references/code-patterns.md` for Swift/SpriteKit implementations.

## Adjacent Skills

- **audio-designer**: Sync sound effects to animation keyframes
- **haptic-optimizer**: Fire haptics at impact moments (T+5ms from visual)
- **particle-effects**: Spawn particles at collection/impact frames
- **juice-orchestrator**: Coordinate all feedback channels together
