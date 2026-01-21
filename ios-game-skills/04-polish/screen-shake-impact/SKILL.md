---
name: screen-shake-impact
description: Use when implementing camera shake, freeze frames (hitstop), and screen flash effects for impactful combat and collision feedback in iOS games.
---

# Screen Shake & Impact Effects

## Core Principles

**Trauma-based shake with squared decay** creates satisfying impact feel. Use Perlin noise (not random) for smooth motion. Combine with hitstop and flash for layered impact. Respect accessibility settings.

## Shake Intensity

| Level | Magnitude | Duration | Use Case |
|-------|-----------|----------|----------|
| Light | 2-5 px | 0.1-0.2s | Small hits, footsteps |
| Medium | 5-10 px | 0.2-0.4s | Standard damage, explosions |
| Heavy | 10-20 px | 0.3-0.6s | Critical hits, boss attacks |
| Extreme | 20-30 px | 0.4-0.8s | Death, phase transitions |

## Shake Direction

| Direction | Application |
|-----------|-------------|
| Horizontal | Side impacts, knockback |
| Vertical | Ground pounds, vertical hits |
| Omni-directional | Explosions, general impacts |
| Rotational | Stun, disorientation (max 3 degrees) |

## Trauma System

```
Effective Shake = Trauma^2
Trauma decays at 2.0/second
```

Squared formula creates intense initial shake with rapid natural falloff.

## Freeze Frame (Hitstop)

| Type | Frames | Duration | Use Case |
|------|--------|----------|----------|
| Light | 2-4 | 33-66ms | Quick jabs |
| Standard | 8-12 | 133-200ms | Normal hits |
| Heavy | 15-20 | 250-333ms | Charged attacks |
| Ultra | 20-30 | 333-500ms | Critical kills |

**Partial freeze**: Particles and camera effects continue during hitstop.

## Flash Effects

| Type | Color | Opacity | Duration |
|------|-------|---------|----------|
| Hit | White | 0.6-0.8 | 50-100ms |
| Damage | Red | 0.3-0.5 | 100-150ms |
| Critical | Yellow | 0.7-0.9 | 80-120ms |
| Heal | Green | 0.3-0.5 | 150-200ms |

## Camera Zoom/Punch

| Effect | Scale | Duration |
|--------|-------|----------|
| Subtle punch | 1.02x | 100-150ms |
| Medium punch | 1.05x | 150-250ms |
| Heavy punch | 1.08x | 200-350ms |

## Combined Impact Example

**Heavy Impact (boss hit)**:
1. Heavy shake (10-20px)
2. Heavy hitstop (15-20 frames)
3. Critical flash (yellow)
4. Medium camera punch (1.05x)

## Accessibility

Check `UIAccessibility.isReduceMotionEnabled`:
- When enabled: Skip shake/zoom, use flash only
- Rotation shake max 3 degrees to prevent nausea
- Cap shake magnitude to prevent motion sickness

## Checklist

- [ ] Perlin noise for smooth shake
- [ ] Trauma-squared decay curve
- [ ] Magnitude matches impact significance
- [ ] Partial freeze (particles continue)
- [ ] Flash opacity capped at 80%
- [ ] Reduce motion setting respected
- [ ] Effects layer additively

## References

- [Code Patterns](references/code-patterns.md) - TraumaShakeSystem, HitstopController, FlashController, ImpactCoordinator
- [API Reference](references/api-reference.md) - Intensity values, hitstop durations, flash specs

## Adjacent Skills

- **haptic-optimizer**: Pair shake with haptic feedback
- **audio-designer**: Sync impact sounds with shake start
- **particle-effects**: Spawn particles at hitstop moment
