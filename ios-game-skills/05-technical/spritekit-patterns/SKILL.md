---
name: spritekit-patterns
description: Use when implementing 2D games with SpriteKit, optimizing sprite rendering, or setting up physics-based gameplay. Triggers on SpriteKit scene setup, texture management, physics configuration, node pooling needs, or SwiftUI integration.
---

# SpriteKit Patterns

## Purpose

Implement performant 2D games using SpriteKit with proper scene architecture, physics configuration, node pooling, and SwiftUI integration.

## When to Use

- Building 2D sprite-based games
- Setting up physics-based gameplay
- Optimizing texture and node management
- Integrating SpriteKit with SwiftUI UI

## Core Process

1. **Scene Architecture**: Use layered nodes (background, game, effects, HUD) with explicit zPosition
2. **Physics Setup**: Configure physics categories as bitmasks, use contact delegate for collisions
3. **Update Loop**: Cap deltaTime, separate update phases (player, enemies, cleanup)
4. **Node Pooling**: Pre-allocate frequently spawned nodes, reuse instead of create/destroy
5. **Texture Atlas**: Preload atlases, batch draw calls by atlas
6. **SwiftUI Bridge**: Use SpriteView with GameState ObservableObject

## Key Rules

- Enable `ignoresSiblingOrder` for rendering optimization
- Always cap deltaTime: `min(deltaTime, 1.0/30.0)`
- Remove offscreen nodes in `didFinishUpdate`
- Pool any node created >10/second
- Preload texture atlases before scene transition
- Use `shouldCullNonVisibleNodes` in SpriteView

## Quick Reference

| Concept | Pattern |
|---------|---------|
| Layers | SKNode per layer, set zPosition explicitly |
| Physics | Bitmask categories, contactTestBitMask for events |
| Pooling | Pre-allocate, acquire/return pattern |
| Textures | Atlas preloading, animation from atlas |
| SwiftUI | SpriteView + @StateObject GameState |
| Actions | Sequence with timing modes (easeIn/Out) |

### Physics Categories Pattern
```swift
struct PhysicsCategory {
    static let player: UInt32 = 0b1
    static let enemy:  UInt32 = 0b10
    static let bullet: UInt32 = 0b100
}
```

### Delta Time Capping
```swift
let cappedDelta = min(currentTime - lastUpdateTime, 1.0/30.0)
```

## Adjacent Skills

- `performance-optimizer`: Frame rate and memory optimization
- `swiftui-game-ui`: UI overlays for SpriteKit games
- `animation-system`: Animation timing and easing
- `particle-effects`: SpriteKit particle emitters

See `references/code-patterns.md` for complete implementation examples.
