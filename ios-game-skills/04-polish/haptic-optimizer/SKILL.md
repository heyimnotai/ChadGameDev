---
name: haptic-optimizer
description: Use when implementing tactile feedback for iOS games including button presses, collisions, collections, and notifications using UIFeedbackGenerator and Core Haptics.
---

# Haptic Optimizer

## Core Principles

**Haptics enhance meaningful actions only.** Call `prepare()` before expected haptics (50-100ms lead time). Reuse generators for performance. Rate limit to 50ms minimum between haptics.

## Impact Styles

| Style | Feel | Use For |
|-------|------|---------|
| `.light` | Subtle tap | Button press, soft tap, list tick |
| `.medium` | Definite thump | Item pickup, collision, standard hit |
| `.heavy` | Strong impact | Enemy hit, heavy landing, explosion |
| `.soft` | Dull, rounded | Bubble pop, stretch, organic feel |
| `.rigid` | Sharp click | Toggle switch, lock-in, precise action |

## Notification Types

| Type | Pattern | Use For |
|------|---------|---------|
| `.success` | Ascending double-tap | Level complete, achievement, purchase |
| `.warning` | Single firm tap | Low health, timer warning |
| `.error` | Descending triple-tap | Invalid move, blocked action, death |

## Event Catalog

**DO trigger haptics for:**
- Button press (light, 0.4 intensity)
- Item collection (light, 0.3-0.5)
- Player hit (medium/heavy based on damage)
- Jump land (medium, 0.5)
- Toggle switch (rigid, 0.6)
- Win/lose outcomes (notification)

**DO NOT trigger haptics for:**
- Background animations
- Particle effects
- Character walking
- Score incrementing
- Timer ticking

## Battery Guidelines

- Maximum sustained: 10 haptics/second
- Recommended: 2-4 haptics/second
- Burst limit: 5 in 500ms, then pause
- Heavy usage: 3-5% additional battery/hour

## Physics-Based Intensity

```swift
let normalized = min(1.0, impactForce / maxForce)
if normalized < 0.3 { lightImpact.impactOccurred(intensity: 0.3 + normalized) }
else if normalized < 0.7 { mediumImpact.impactOccurred(intensity: normalized) }
else { heavyImpact.impactOccurred(intensity: 0.7 + normalized * 0.3) }
```

## Core Haptics Patterns

Use Core Haptics (CHHapticEngine) for:
- Sustained vibration (rumble with decay)
- Complex patterns (heartbeat: lub-dub)
- Rising intensity (power charging)
- Audio synchronization

## Device Support

iPhone 8+: Full support. iPad: None (graceful fallback required).

```swift
guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
```

## Checklist

- [ ] Reuse generators (singleton pattern)
- [ ] Call prepare() before expected haptics
- [ ] Rate limit (50ms minimum between)
- [ ] Match intensity to event significance
- [ ] Handle iPad gracefully (no Taptic Engine)
- [ ] User toggle to disable haptics

## References

- [Code Patterns](references/code-patterns.md) - HapticManager, Core Haptics patterns, SwiftUI integration
- [API Reference](references/api-reference.md) - Style specs, event catalog, device support

## Adjacent Skills

- **audio-designer**: Sync haptics with audio (haptic 5-10ms before sound)
- **animation-system**: Time haptics to animation keyframes
- **screen-shake-impact**: Combine screen shake with heavy haptic
