---
name: particle-effects
description: Use when implementing visual particle systems for iOS games including explosions, sparkles, trails, confetti, and environmental effects with performance budgets.
---

# Particle Effects

## Core Principles

**Budget strictly**: 200-400 total particles, 8-12 simultaneous emitters. Use SKEmitterNode with object pooling. Texture size 32x32-64x64 max. Additive blend for glowing, alpha blend for solid.

## Global Budget

| Constraint | Value |
|------------|-------|
| Total active particles | 200-400 max |
| Target for 60fps | 200-300 |
| Per-effect maximum | 35-100 |
| Simultaneous emitters | 8-12 |
| Texture size | 32x32 to 64x64 |

## Per-Effect Specifications

| Effect | Count | Emission | Duration |
|--------|-------|----------|----------|
| Coin collect | 15-25 | Burst | 0.3-0.5s |
| Small explosion | 30-50 | Burst | 0.4-0.6s |
| Large explosion | 50-80 | Burst | 0.6-1.0s |
| Sparkle/shine | 10-20 | Continuous | Looping |
| Confetti | 40-80 | Burst | 1.5-3.0s |
| Dust/debris | 20-40 | Burst | 0.5-1.0s |
| Trail | 15-30/sec | Continuous | While moving |
| Hit impact | 10-20 | Burst | 0.2-0.4s |

## Lifetime Guidelines

| Type | Lifetime | Variation |
|------|----------|-----------|
| Quick burst | 0.3-0.5s | 20% |
| Standard | 0.5-1.0s | 30% |
| Floaty | 1.5-3.0s | 40% |
| Trail | 0.2-0.5s | 10% |

## Color Progressions

**Explosion**: White -> Yellow -> Orange -> Dark Red -> Black
**Coin collect**: White -> Gold -> Fade
**Dust**: Brown -> Light Brown -> Fade

## Blend Mode Selection

- **Additive (.add)**: Explosions, fire, sparkles, magic (glowing)
- **Alpha (.alpha)**: Smoke, dust, confetti, debris (solid)

## Scale Over Lifetime

| Effect | Start | End |
|--------|-------|-----|
| Explosion | 0.5 | 2.0-3.0 (grow) |
| Sparkle | 0.8 | 0.2 (shrink) |
| Smoke | 0.5 | 2.5 (grow) |
| Trail | 1.0 | 0.1 (shrink) |

## Performance Tips

1. **Pool emitters**: Reuse nodes, don't create new
2. **Preload**: Load during scene setup
3. **Schedule cleanup**: Remove after effect duration
4. **Use texture atlas**: 512x512 or 1024x1024
5. **Monitor budget**: Log when exceeding 400 particles

## Checklist

- [ ] Total particles under 400
- [ ] Emitters pooled and reused
- [ ] Textures from atlas (32x32-64x64)
- [ ] Burst effects feel instant
- [ ] Alpha fades smooth (no hard cutoff)
- [ ] Blend mode matches effect type
- [ ] Cleanup scheduled after duration

## References

- [Code Patterns](references/code-patterns.md) - ParticleManager, SKEmitterNode recipes, performance monitor
- [API Reference](references/api-reference.md) - Budget specs, lifetime/velocity/color tables

## Adjacent Skills

- **animation-system**: Sync particle spawns with animation keyframes
- **audio-designer**: Time bursts with sound effects
- **screen-shake-impact**: Combine shake with explosion particles
