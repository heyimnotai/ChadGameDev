---
name: ui-transitions
description: Use when implementing screen navigation, modal presentations, element choreography, and loading states for polished iOS game interfaces.
---

# UI Transitions

## Core Principles

Transitions guide attention and communicate state changes. **Match duration to context**: quick tabs (150-200ms), standard navigation (250-350ms), dramatic reveals (400-600ms). Use staggered choreography, never animate everything at once.

## Screen Transition Timing

| Type | Duration | Easing |
|------|----------|--------|
| Push/Pop | 200-350ms | ease-in-out |
| Modal Present | 300-400ms | ease-out |
| Modal Dismiss | 250-350ms | ease-in |
| Cross-Dissolve | 200-300ms | linear |
| Quick Switch (tabs) | 150-200ms | ease-out |
| Slow Reveal | 400-600ms | ease-in-out |

**iPad**: Add +30% to durations for larger screens.

## Element Choreography

| Count | Stagger Delay | Total Max |
|-------|---------------|-----------|
| 2-3 elements | 50-80ms | 240ms |
| 4-6 elements | 40-60ms | 360ms |
| 7-10 elements | 30-50ms | 500ms |
| 10+ elements | 20-40ms | Cap at 500ms |

Stagger directions:
- **Forward**: Lists from data
- **Reverse**: Dismissing content
- **Center-out**: Expanding menus
- **Edges-in**: Collecting items

## SwiftUI Transitions

Built-in with recommended timing:
- `.opacity`: 200-300ms
- `.scale`: 200-300ms (use 0.8-0.9 start scale)
- `.slide`: 250-350ms
- `.move(edge:)`: 200-350ms

Custom combinations:
```swift
.opacity.combined(with: .scale(scale: 0.9)).combined(with: .offset(y: 20))
```

## Modal Pattern

Present from bottom with dimming:
- Background: 50% black opacity
- Content: slide up + opacity
- Dismiss: tap background or swipe

Spring animation: response 0.35, damping 0.85.

## Hero Animations

Use `matchedGeometryEffect` for morphing elements between screens:
- Same ID in source and destination
- 1-2 hero elements max
- Spring animation (response 0.35, damping 0.8)

## Loading States

| Expected Duration | Approach |
|-------------------|----------|
| <200ms | Show nothing, then content |
| 200ms-2s | Skeleton immediately |
| >2s | Skeleton + spinner after 1s |

**Skeleton shimmer**: 1.5-2s period, subtle white gradient.

## Spring Parameters

| Use Case | Response | Damping |
|----------|----------|---------|
| Subtle | 0.35 | 0.85 |
| Standard | 0.35 | 0.75 |
| Bouncy | 0.4 | 0.6 |

Avoid damping <0.5 (too bouncy).

## Checklist

- [ ] Durations match context (tabs fast, modals medium)
- [ ] iPad transitions +30% duration
- [ ] Stagger total capped at 500ms
- [ ] Spring damping 0.7-0.85 range
- [ ] Loading states show skeleton immediately
- [ ] Hero animations use matching IDs
- [ ] Reduced motion accessibility respected
- [ ] No jarring cuts or instant changes

## References

- [Code Patterns](references/code-patterns.md) - Custom transitions, stagger controller, hero animations, skeleton views
- [API Reference](references/api-reference.md) - Timing tables, spring parameters, loading thresholds

## Adjacent Skills

- **animation-system**: Core animation timing for gameplay
- **audio-designer**: Whoosh sounds on transitions
- **haptic-optimizer**: Subtle haptics on transition complete
