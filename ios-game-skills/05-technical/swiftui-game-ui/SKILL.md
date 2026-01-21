---
name: swiftui-game-ui
description: Use when building game UI layers including HUDs, menus, settings, stores, or pause handling. Triggers on game UI construction, menu system design, TimelineView+Canvas game loops, or creating reusable game UI components.
---

# SwiftUI Game UI

## Purpose

Build production-quality game UI layers using SwiftUI for HUDs, menus, settings, stores, and achievement displays that overlay SpriteKit/Metal games or power standalone SwiftUI-based games.

## When to Use

- Creating HUD overlays (score, lives, timers)
- Building menu systems (main, pause, game over)
- Implementing settings and store screens
- Using TimelineView + Canvas for simple games
- Integrating CADisplayLink with SwiftUI

## Core Process

1. **Layer Architecture**: ZStack with game layer + UI overlays
2. **State Management**: ObservableObject for game state shared with SpriteKit
3. **Pause Handling**: Auto-pause on `scenePhase` change to background
4. **Transitions**: Animate overlay changes with appropriate timing
5. **Touch Targets**: Minimum 44x44pt for all interactive elements
6. **Safe Areas**: Game ignores, UI respects safe areas

## Key Rules

- All buttons minimum 44x44pt touch target
- Button press feedback: 100-150ms
- Screen transitions: 200-400ms with ease-in-out
- Auto-pause when app backgrounds (`scenePhase`)
- Use `.buttonStyle(.plain)` + custom gesture for press effects
- Score animations use counting effect (500-1000ms)

## Quick Reference

| Component | Pattern |
|-----------|---------|
| HUD | VStack/HStack with Spacer, safeAreaPadding |
| Score | contentTransition(.numericText), counting animation |
| Lives | ForEach with heart.fill/heart icons |
| Buttons | DragGesture for press state, scaleEffect |
| Pause | Color.black.opacity(0.6) + card overlay |
| Menus | sheet for 1-3 screens, NavigationStack for more |

### Animation Timing
| Transition | Duration | Easing |
|------------|----------|--------|
| Button press | 100-150ms | ease-out |
| Screen transition | 200-400ms | ease-in-out |
| Score increment | 500-1000ms | ease-out |
| Notification appear | 300ms | spring |

### Rendering Approach Selection
- Simple puzzle (<100 elements): TimelineView + Canvas
- Physics-based 2D: SpriteKit + SwiftUI overlay
- 120Hz action: SpriteKit or CADisplayLink
- UI-heavy: Pure SwiftUI

## Adjacent Skills

- `spritekit-patterns`: SpriteView for game rendering with SwiftUI overlays
- `performance-optimizer`: Ensure UI animations maintain 60fps
- `iap-implementation`: Full StoreKit integration for store UI
- `game-center-integration`: Game Center API for leaderboard data

See `references/code-patterns.md` for complete implementation examples.
