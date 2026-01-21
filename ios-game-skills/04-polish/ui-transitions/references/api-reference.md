# UI Transitions API Reference

## Screen Transition Timing

| Transition Type | Duration | Easing | Use Case |
|----------------|----------|--------|----------|
| **Push/Pop** | 200-350ms | ease-in-out | Primary navigation |
| **Modal Present** | 300-400ms | ease-out | Overlays, popups |
| **Modal Dismiss** | 250-350ms | ease-in | Closing overlays |
| **Cross-Dissolve** | 200-300ms | linear | Scene changes |
| **Quick Switch** | 150-200ms | ease-out | Tabs, segments |
| **Slow Reveal** | 400-600ms | ease-in-out | Dramatic reveals |

## Platform-Specific Timing

| Platform | Adjustment | Rationale |
|----------|------------|-----------|
| **iPhone** | Base timing | Reference standard |
| **iPad** | +30% duration | Larger screen, more distance |
| **iPad Split View** | Base timing | Smaller area like phone |

## Element Choreography Stagger Delays

| Element Count | Stagger Delay | Total Sequence Duration |
|---------------|---------------|------------------------|
| 2-3 elements | 50-80ms | 100-240ms |
| 4-6 elements | 40-60ms | 160-360ms |
| 7-10 elements | 30-50ms | 210-500ms |
| 10+ elements | 20-40ms | Cap at 500ms total |

## Loading State Specifications

| State | Trigger Threshold | Animation |
|-------|------------------|-----------|
| **Skeleton** | Show immediately | Shimmer at 1.5-2s period |
| **Spinner** | After 200ms wait | Continuous rotation |
| **Progress Bar** | Known duration/progress | Linear fill |
| **Content Appear** | Data ready | Fade in 200-300ms |

## SwiftUI Built-in Transition Timing

| Transition | Default Duration | Recommended Duration |
|------------|-----------------|---------------------|
| `.opacity` | 350ms | 200-300ms |
| `.scale` | 350ms | 200-300ms |
| `.slide` | 350ms | 250-350ms |
| `.move(edge:)` | 350ms | 200-350ms |
| `.offset` | 350ms | 200-300ms |

## Spring Animation Parameters

| Use Case | Response | Damping Fraction |
|----------|----------|------------------|
| Subtle bounce | 0.35 | 0.85 |
| Standard | 0.35 | 0.75 |
| Bouncy | 0.4 | 0.6 |
| Very bouncy | 0.5 | 0.5 |

## Stagger Direction Options

| Direction | Order | Use Case |
|-----------|-------|----------|
| Forward | 0, 1, 2, 3... | List from data source |
| Reverse | 3, 2, 1, 0... | Dismissing list |
| Center-out | Middle first, then outward | Expanding menu |
| Edges-in | Edges first, then inward | Collecting items |

## Hero Animation Guidelines

| Aspect | Recommendation |
|--------|----------------|
| Element count | 1-2 hero elements max |
| Minimum size | >50pt for noticeable effect |
| Duration | 0.35s with spring response |
| Damping | 0.8 for smooth morph |

## Loading State Thresholds

| Expected Duration | Recommended Approach |
|-------------------|---------------------|
| <200ms | Show nothing, then content |
| 200ms-2s | Show skeleton immediately |
| >2s | Skeleton + spinner after 1s |
| Known progress | Progress bar with percentage |
