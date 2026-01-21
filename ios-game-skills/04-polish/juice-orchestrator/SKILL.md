---
name: juice-orchestrator
description: Use when coordinating multiple feedback systems (haptics, audio, particles, screen effects) into cohesive, impactful game feel moments.
---

# Juice Orchestrator

## Core Principles

"Juice" is the coordinated firing of multiple feedback channels to make events feel satisfying. **Order matters**: haptic first (T+0ms), sound (T+5-15ms), visual (T+0-30ms), particles (T+20-50ms), screen effects last. Prevent fatigue with rate limiting.

## Feedback Layer Timing

| Layer | Offset | Priority |
|-------|--------|----------|
| Haptic | T+0ms | 1 (first) |
| Sound | T+5-15ms | 2 |
| Visual Flash | T+0-10ms | 3 |
| Animation | T+0-20ms | 4 |
| Particles | T+20-50ms | 5 |
| Screen Shake | T+0-30ms | 6 |
| UI Update | T+50-200ms | 7 (last) |

## Intensity Tiers

| Tier | Name | Layers | Max Duration | Use Case |
|------|------|--------|--------------|----------|
| 1 | Micro | 1-2 | 100ms | UI taps, minor collisions |
| 2 | Small | 2-3 | 300ms | Coin pickup, basic hits |
| 3 | Medium | 3-4 | 500ms | Enemy defeat, milestone |
| 4 | Large | 4-5 | 1000ms | Level complete, achievement |
| 5 | Epic | All | 2000ms+ | Boss defeat, high score |

## Common Event Sequences

**Collect Coin (Tier 2)**
- T+0ms: Light haptic
- T+5ms: Coin chime
- T+10ms: Scale up animation
- T+30ms: 5-10 sparkles
- T+60ms: Fly to counter
- T+260ms: Score increment

**Enemy Defeated (Tier 3)**
- T+0ms: Hitstop (10 frames), medium haptic, white flash
- T+10ms: Defeat sound, light shake
- T+50ms: 15-25 explosion particles
- T+100ms: Death animation
- T+150ms: Loot drops
- T+300ms: Score popup

**Boss Defeated (Tier 5)**
- T+0ms: Hitstop (25 frames), heavy haptic, white flash
- T+50ms: Heavy shake (15px, 0.5s)
- T+100ms: Victory fanfare
- T+200ms: 100+ particles
- T+300ms: Camera zoom
- T+800ms: Slow-motion (0.3x, 1s)

## Fatigue Prevention

| Mechanism | Threshold |
|-----------|-----------|
| Same event cooldown | 50-100ms minimum |
| Haptic rate limit | 10/second max |
| Sound overlap limit | 8 simultaneous |
| Particle budget | 500 total active |
| Screen shake cap | Trauma 1.0 max |

## Performance Budget

| System | Target | Max |
|--------|--------|-----|
| Haptic trigger | 0.1ms | 0.5ms |
| Audio mix | 1.0ms | 2.0ms |
| Particle update | 2.0ms | 4.0ms |
| Total juice | 5.0ms | 8.0ms |

## Priority System

When events conflict:
- Critical (3): Cannot be interrupted
- High (2): Important events
- Normal (1): Standard gameplay
- Low (0): Ambient, decoration

Higher priority events interrupt lower. Critical always executes.

## Checklist

- [ ] Haptics fire before audio (0-5ms lead)
- [ ] Intensity matches event significance
- [ ] Rate limiting prevents fatigue
- [ ] All layers coordinated with proper timing
- [ ] Performance budget respected (<8ms total)
- [ ] Priority system handles conflicts

## References

- [Code Patterns](references/code-patterns.md) - JuiceOrchestrator, feedback sequences, priority manager
- [API Reference](references/api-reference.md) - Layer timing, event mappings, fatigue thresholds

## Adjacent Skills

- **haptic-optimizer**: Haptic layer implementation
- **audio-designer**: Audio layer implementation
- **particle-effects**: Particle layer implementation
- **screen-shake-impact**: Screen effects layer
