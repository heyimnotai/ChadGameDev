---
name: universal-app-requirements
description: Use when building games that must work on iPhone and iPad. Triggers on new project setup, iPad support, layout issues, orientation handling, size class adaptation, or device compatibility rejections.
---

# Universal App Requirements

## Purpose

Build iOS games that work flawlessly across all iPhone and iPad screen sizes, avoiding common rejection reasons related to iPad compatibility.

## Core Principles

**All games must be universal** - iPhone-only apps are rejected. Use size classes (not device detection) for layout decisions. Always respect safe areas. Minimum touch target: 44x44 points.

## Size Class Quick Reference

| Configuration | Width | Height |
|---------------|-------|--------|
| iPhone Portrait | Compact | Regular |
| iPhone Landscape | Compact | Compact |
| iPad Full Screen | Regular | Regular |
| iPad Split View | Compact | Regular |

## Essential Requirements

### Layout
- Use `@Environment(\.horizontalSizeClass)` for layout decisions
- Use `GeometryReader` for proportional sizing
- Never hardcode screen dimensions
- Scale game board to fit smaller dimension

### Safe Areas
- UI elements must respect `safeAreaInsets`
- Background can extend to edges (`ignoresSafeArea`)
- Top: Status bar / Dynamic Island (59pt on notch devices)
- Bottom: Home indicator (34pt)

### Touch Targets
- Minimum 44x44 points (Apple HIG)
- Recommended 48-60 points for game controls
- Use `.contentShape()` to extend tap area

### iPad-Specific
- Support pointer hover effects (`.onHover`, `.hoverEffect`)
- Support keyboard input (`.onKeyPress`, `.focusable`)
- Handle Split View gracefully (pause or adapt layout)
- Support all four orientations

### Assets
- Provide @2x (iPad, iPhone SE) and @3x (modern iPhone)
- App icons for all required sizes (see references)
- Launch screen that works on all devices

## Implementation Pattern

```swift
@Environment(\.horizontalSizeClass) var sizeClass

var body: some View {
    if sizeClass == .compact {
        CompactLayout()  // iPhone or iPad Split View
    } else {
        RegularLayout()  // iPad full screen
    }
}
```

## Checklist

- [ ] Works on iPhone SE through iPad Pro 12.9"
- [ ] Size classes handle all configurations
- [ ] Safe areas respected (test on notch devices)
- [ ] Touch targets ≥44pt
- [ ] iPad pointer/keyboard support
- [ ] Split View handled (supported or UIRequiresFullScreen)
- [ ] All orientations tested
- [ ] Assets at @2x and @3x

## References

- [Code Patterns](references/code-patterns.md) - Adaptive layouts, safe areas, iPad input
- [API Reference](references/api-reference.md) - Screen sizes, safe area values, Info.plist keys

## Adjacent Skills

- **app-store-review**: Universal app required for approval
- **swiftui-game-ui**: UI patterns with adaptive layouts
- **performance-optimizer**: Device-specific performance tuning
