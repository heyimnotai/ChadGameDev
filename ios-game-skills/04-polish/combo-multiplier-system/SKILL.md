---
name: combo-multiplier-system
description: Use when implementing score multiplier mechanics, combo counters, and streak reward systems that provide escalating feedback and dopamine hits.
---

# Combo Multiplier System

## Core Principles

Combos reward sustained skillful play with escalating multipliers and feedback. **Timer window shrinks as combo grows** (2.5s at x1, 1.0s at x31+). Anti-spam via variety rewards and repetition penalties.

## Timing Windows

| Combo | Time Window | Tension |
|-------|-------------|---------|
| 1-5x | 2.5 seconds | Relaxed |
| 6-15x | 2.0 seconds | Building |
| 16-30x | 1.5 seconds | Tense |
| 31x+ | 1.0 seconds | Intense |

## Multiplier Tiers

| Count | Multiplier | Name | Color |
|-------|------------|------|-------|
| 1-4 | x1 | - | White |
| 5-9 | x2 | Nice! | Yellow |
| 10-14 | x3 | Great! | Orange |
| 15-24 | x4 | Awesome! | Red |
| 25-49 | x5 | Amazing! | Purple |
| 50-99 | x8 | Incredible! | Blue |
| 100+ | x10 | LEGENDARY! | Gold |

## Visual Escalation

- **Font scale**: 100% at x1 to 200% at x10
- **Glow effect**: Tier color with increasing intensity
- **Particles**: Start at x3, increase per tier
- **Timer bar**: Pulses red below 25%, frantic below 10%

## Feedback Per Action

| Combo | Haptic | Sound Pitch |
|-------|--------|-------------|
| 1-4 | Light 0.3 | 1.00x |
| 5-9 | Light 0.5 | 1.05x |
| 10-14 | Medium 0.6 | 1.10x |
| 15-24 | Medium 0.7 | 1.15x |
| 25-49 | Heavy 0.8 | 1.20x |
| 50+ | Heavy 0.9+ | 1.25x+ |

## Milestone Celebrations

| Milestone | Effects |
|-----------|---------|
| x5 | Flash (yellow, 80ms) + "Nice!" + ring burst |
| x10 | Flash (orange, 100ms) + slam + 15 particles |
| x25 | Flash + slam + 25 particles + screen shake |
| x50 | Full celebration + camera zoom punch |
| x100 | Gold flash + fireworks + slow-mo moment |

## Anti-Spam System

Repetition reduces points:
- 1-2 uses: 100%
- 3rd use: 75%
- 4th use: 50%
- 5th+ use: 25%

Variety bonus: +25% for 2 types, +50% for 3+ types.

## Combo Saver (Recovery)

High combos get second chance:
- x10-24 breaks: 2s recovery window, 50% restored (min x5)
- x25-49 breaks: 2s recovery window, 50% restored (min x12)
- x50+ breaks: 2.5s recovery window, 50% restored (min x25)

## Checklist

- [ ] Timer shrinks as combo grows
- [ ] Visual intensity matches combo level
- [ ] Haptic/audio pitch scales with combo
- [ ] Milestone celebrations feel rewarding
- [ ] Anti-spam prevents button mashing
- [ ] Near-miss recovery reduces frustration
- [ ] Timer bar provides clear urgency feedback

## References

- [Code Patterns](references/code-patterns.md) - ComboManager, feedback controller, UI component
- [API Reference](references/api-reference.md) - Timing windows, tier specs, celebration sequences

## Adjacent Skills

- **haptic-optimizer**: Escalating haptic intensity per tier
- **audio-designer**: Rising pitch for combo sounds
- **animation-system**: Counter bounce and scale animations
