---
name: particle-effects
description: Implements satisfying particle systems for iOS games with exact performance budgets and visual specifications. Use this skill when creating coin collection sparkles, explosions, confetti celebrations, dust/debris effects, magic/power-up visuals, or any visual effect requiring many small animated elements. This skill provides particle count limits, lifetime specifications, emission patterns, color/alpha curves, texture atlas optimization, object pooling strategies, and production-ready SpriteKit SKEmitterNode configurations with exact parameter values.
---

# Particle Effects

## Purpose

This skill enables the implementation of visually satisfying particle effects that enhance game feel while respecting mobile performance constraints. It enforces strict particle count budgets, optimal emission patterns, and efficient texture usage that keep games running at 60fps even during effect-heavy moments. Every specification is implementation-ready with exact values validated against iOS device performance profiles.

## Domain Boundaries

- **This skill handles**:
  - Particle count budgets (per-effect and global)
  - Particle lifetime specifications
  - Emission rate and patterns (burst vs continuous)
  - Color and alpha curves over lifetime
  - Scale and rotation over lifetime
  - Common effect recipes (coin, explosion, sparkle, confetti, dust, magic)
  - SKEmitterNode configuration
  - Texture atlas optimization for particles
  - Object pooling for particle emitters
  - Performance profiling guidelines

- **This skill does NOT handle**:
  - Animation timing for non-particle visuals (see: animation-system skill)
  - Audio synchronization (see: audio-designer skill)
  - Haptic feedback (see: haptic-optimizer skill)
  - Screen shake/camera effects (see: screen-shake-impact skill)
  - Shader-based effects (custom Metal shaders)

## Core Specifications

### Global Particle Budget

| Constraint | Value | Notes |
|------------|-------|-------|
| Total active particles | 200-500 maximum | All emitters combined |
| Target for smooth 60fps | 200-300 | Conservative for older devices |
| Per-effect maximum | 35-100 particles | Depends on effect type |
| Simultaneous emitters | 8-12 maximum | Active emitters at once |
| Particle texture size | 32x32 to 64x64 px | Smaller = better performance |

### Per-Effect Particle Counts

| Effect Type | Particle Count | Emission | Duration |
|-------------|----------------|----------|----------|
| Coin collect | 15-25 | Burst | 0.3-0.5s |
| Small explosion | 30-50 | Burst | 0.4-0.6s |
| Large explosion | 50-80 | Burst | 0.6-1.0s |
| Sparkle/shine | 10-20 | Continuous | Looping |
| Confetti | 40-80 | Burst | 1.5-3.0s |
| Dust/debris | 20-40 | Burst | 0.5-1.0s |
| Magic/power-up | 20-35 | Continuous | Effect duration |
| Trail | 15-30/sec | Continuous | While moving |
| Ambient (background) | 10-20 | Continuous | Looping |
| Hit impact | 10-20 | Burst | 0.2-0.4s |
| Fire/flame | 25-40 | Continuous | Looping |
| Smoke | 15-25 | Continuous | Looping |

### Particle Lifetime Guidelines

| Effect Type | Lifetime | Variation | Notes |
|-------------|----------|-----------|-------|
| Quick burst (hit, collect) | 0.3-0.5s | 20% | Short, punchy |
| Standard (explosion) | 0.5-1.0s | 30% | Medium duration |
| Floaty (confetti, feathers) | 1.5-3.0s | 40% | Slow fall |
| Ambient (sparkles, dust) | 2.0-4.0s | 50% | Gentle cycling |
| Trail | 0.2-0.5s | 10% | Quick fade behind |
| Smoke | 1.0-2.0s | 30% | Slower dissipation |

### Emission Patterns

| Pattern | Birth Rate | Use Case |
|---------|------------|----------|
| Single burst | Total / 0.01s | Explosion, impact, collect |
| Rapid burst | Total / 0.1s | Confetti, celebration |
| Continuous | 10-50/sec | Ambient, fire, magic aura |
| Trail | 20-40/sec | Movement trail, projectile |
| Pulsing | Varies | Heartbeat, warning |

### Color Over Lifetime Curves

#### Explosion
| Time | Color | Alpha |
|------|-------|-------|
| 0% | White (#FFFFFF) | 1.0 |
| 20% | Yellow (#FFDD00) | 1.0 |
| 50% | Orange (#FF6600) | 0.8 |
| 80% | Dark Red (#AA0000) | 0.4 |
| 100% | Black (#000000) | 0.0 |

#### Coin Collect Sparkle
| Time | Color | Alpha |
|------|-------|-------|
| 0% | White (#FFFFFF) | 1.0 |
| 30% | Gold (#FFD700) | 1.0 |
| 70% | Gold (#FFD700) | 0.6 |
| 100% | Transparent Gold (#FFD70000) | 0.0 |

#### Magic/Power-Up
| Time | Color | Alpha |
|------|-------|-------|
| 0% | White (#FFFFFF) | 1.0 |
| 25% | Effect Color (varies) | 1.0 |
| 75% | Effect Color (saturated) | 0.7 |
| 100% | Effect Color (dark) | 0.0 |

#### Dust/Debris
| Time | Color | Alpha |
|------|-------|-------|
| 0% | Brown (#8B7355) | 0.8 |
| 50% | Light Brown (#A0907B) | 0.5 |
| 100% | Tan (#C0B090) | 0.0 |

### Scale Over Lifetime

| Effect Type | Start Scale | End Scale | Variation |
|-------------|-------------|-----------|-----------|
| Explosion | 0.5 | 2.0-3.0 | 30% |
| Sparkle | 0.8 | 0.2 | 20% |
| Confetti | 1.0 | 1.0 | 10% |
| Dust | 0.3 | 1.5 | 40% |
| Smoke | 0.5 | 2.5 | 30% |
| Fire | 0.8 | 0.3 | 25% |
| Trail | 1.0 | 0.1 | 10% |
| Magic | 0.6 | 1.2 | 20% |

### Velocity and Physics

| Effect Type | Initial Speed | Speed Range | Gravity | Notes |
|-------------|---------------|-------------|---------|-------|
| Explosion | 200-400 pt/s | 150-600 | 0 to 50 | Outward radial |
| Coin collect | 100-200 pt/s | 80-250 | -20 | Upward arc |
| Confetti | 50-150 pt/s | 30-200 | 100-200 | Floaty fall |
| Dust | 30-80 pt/s | 20-100 | 50-100 | Settling |
| Smoke | 20-50 pt/s | 10-70 | -30 to -50 | Rising |
| Fire | 40-80 pt/s | 30-100 | -100 | Strong upward |
| Sparkle | 10-30 pt/s | 5-50 | 0 | Gentle drift |
| Hit impact | 150-300 pt/s | 100-400 | 200-400 | Quick spray |

### Rotation Over Lifetime

| Effect Type | Rotation Speed | Variation | Notes |
|-------------|----------------|-----------|-------|
| Confetti | 90-360 deg/s | High | Tumbling |
| Debris | 180-540 deg/s | High | Spinning fragments |
| Sparkle | 0-45 deg/s | Low | Subtle twinkle |
| Smoke | 0-30 deg/s | Low | Gentle swirl |
| Fire | 0 | - | Oriented upward |
| Leaves | 90-180 deg/s | Medium | Natural tumble |

### Blend Modes

| Effect Type | Blend Mode | Notes |
|-------------|------------|-------|
| Explosion | Additive (.add) | Bright, glowing |
| Fire | Additive (.add) | Hot glow |
| Sparkle | Additive (.add) | Light emission |
| Magic | Additive (.add) | Mystical glow |
| Smoke | Alpha (.alpha) | Realistic |
| Dust | Alpha (.alpha) | Realistic |
| Confetti | Alpha (.alpha) | Solid pieces |
| Debris | Alpha (.alpha) | Solid pieces |

### Texture Atlas Requirements

| Requirement | Specification |
|-------------|---------------|
| Atlas size | 512x512 or 1024x1024 maximum |
| Particle texture size | 32x32 (standard), 64x64 (detailed) |
| Particles per atlas | 16-64 textures |
| Texture format | ASTC 4x4 (quality) or ASTC 6x6 (balance) |
| Alpha channel | Required for soft edges |
| Texture variations | 4-8 per effect type |

## Implementation Patterns

### Basic Particle System Manager

```swift
import SpriteKit

final class ParticleManager {
    static let shared = ParticleManager()

    private var activeEmitters: [String: SKEmitterNode] = [:]
    private var emitterPool: [String: [SKEmitterNode]] = [:]

    // Budget tracking
    private var totalActiveParticles: Int = 0
    private let maxTotalParticles: Int = 400
    private let maxSimultaneousEmitters: Int = 12

    private init() {}

    // MARK: - Loading

    func preloadEmitter(named name: String, count: Int = 3) {
        guard emitterPool[name] == nil else { return }

        emitterPool[name] = []

        for _ in 0..<count {
            if let emitter = SKEmitterNode(fileNamed: name) {
                emitter.isPaused = true
                emitter.particleBirthRate = 0
                emitterPool[name]?.append(emitter)
            }
        }
    }

    // MARK: - Spawning

    func spawnEffect(
        named name: String,
        at position: CGPoint,
        in scene: SKScene,
        duration: TimeInterval? = nil
    ) -> SKEmitterNode? {
        // Check emitter limit
        guard activeEmitters.count < maxSimultaneousEmitters else {
            print("Too many active emitters, skipping \(name)")
            return nil
        }

        // Get or create emitter
        let emitter: SKEmitterNode
        if let pooled = emitterPool[name]?.popLast() {
            emitter = pooled
        } else if let loaded = SKEmitterNode(fileNamed: name) {
            emitter = loaded
        } else {
            print("Failed to load emitter: \(name)")
            return nil
        }

        // Check particle budget
        let estimatedParticles = estimateParticleCount(emitter, duration: duration ?? 1.0)
        guard totalActiveParticles + estimatedParticles <= maxTotalParticles else {
            print("Particle budget exceeded, skipping \(name)")
            returnToPool(emitter, named: name)
            return nil
        }

        // Configure and add
        emitter.position = position
        emitter.isPaused = false
        emitter.resetSimulation()

        let id = UUID().uuidString
        activeEmitters[id] = emitter
        totalActiveParticles += estimatedParticles

        scene.addChild(emitter)

        // Schedule cleanup
        let cleanupDuration = duration ?? calculateDuration(emitter)
        scheduleCleanup(emitter: emitter, id: id, name: name, after: cleanupDuration)

        return emitter
    }

    private func estimateParticleCount(_ emitter: SKEmitterNode, duration: TimeInterval) -> Int {
        let birthRate = emitter.particleBirthRate
        let lifetime = Double(emitter.particleLifetime)
        let lifetimeRange = Double(emitter.particleLifetimeRange)

        if emitter.numParticlesToEmit > 0 {
            return emitter.numParticlesToEmit
        }

        let avgLifetime = lifetime + (lifetimeRange / 2)
        let maxConcurrent = Int(birthRate * CGFloat(min(avgLifetime, duration)))
        return min(maxConcurrent, 100) // Cap estimate
    }

    private func calculateDuration(_ emitter: SKEmitterNode) -> TimeInterval {
        let lifetime = Double(emitter.particleLifetime)
        let lifetimeRange = Double(emitter.particleLifetimeRange)

        if emitter.numParticlesToEmit > 0 {
            // Burst emitter
            let emissionTime = Double(emitter.numParticlesToEmit) / Double(emitter.particleBirthRate)
            return emissionTime + lifetime + (lifetimeRange / 2)
        }

        // Continuous - return default
        return lifetime + (lifetimeRange / 2) + 0.5
    }

    private func scheduleCleanup(emitter: SKEmitterNode, id: String, name: String, after duration: TimeInterval) {
        let wait = SKAction.wait(forDuration: duration)
        let cleanup = SKAction.run { [weak self] in
            emitter.removeFromParent()
            self?.activeEmitters.removeValue(forKey: id)
            self?.returnToPool(emitter, named: name)
            self?.totalActiveParticles -= self?.estimateParticleCount(emitter, duration: 1.0) ?? 0
        }

        emitter.run(SKAction.sequence([wait, cleanup]))
    }

    private func returnToPool(_ emitter: SKEmitterNode, named name: String) {
        emitter.isPaused = true
        emitter.particleBirthRate = 0
        emitter.removeAllActions()

        if emitterPool[name] == nil {
            emitterPool[name] = []
        }
        emitterPool[name]?.append(emitter)
    }

    // MARK: - Convenience Methods

    func spawnCoinCollect(at position: CGPoint, in scene: SKScene) {
        spawnEffect(named: "CoinCollect", at: position, in: scene, duration: 0.5)
    }

    func spawnExplosion(at position: CGPoint, in scene: SKScene, size: ExplosionSize = .medium) {
        let name: String
        let duration: TimeInterval

        switch size {
        case .small:
            name = "ExplosionSmall"
            duration = 0.5
        case .medium:
            name = "ExplosionMedium"
            duration = 0.7
        case .large:
            name = "ExplosionLarge"
            duration = 1.0
        }

        spawnEffect(named: name, at: position, in: scene, duration: duration)
    }

    func spawnHitImpact(at position: CGPoint, in scene: SKScene) {
        spawnEffect(named: "HitImpact", at: position, in: scene, duration: 0.3)
    }

    func spawnDust(at position: CGPoint, in scene: SKScene) {
        spawnEffect(named: "Dust", at: position, in: scene, duration: 0.8)
    }

    enum ExplosionSize {
        case small, medium, large
    }

    // MARK: - Cleanup

    func removeAllEffects() {
        for emitter in activeEmitters.values {
            emitter.removeFromParent()
        }
        activeEmitters.removeAll()
        totalActiveParticles = 0
    }
}
```

### SKEmitterNode Configuration Recipes

#### Coin Collect Effect

```swift
import SpriteKit

extension SKEmitterNode {

    static func coinCollectEmitter() -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Texture
        emitter.particleTexture = SKTexture(imageNamed: "spark")

        // Emission (burst)
        emitter.numParticlesToEmit = 20
        emitter.particleBirthRate = 2000 // Instant burst

        // Lifetime
        emitter.particleLifetime = 0.4
        emitter.particleLifetimeRange = 0.15

        // Position
        emitter.particlePositionRange = CGVector(dx: 10, dy: 10)

        // Velocity (upward arc)
        emitter.particleSpeed = 150
        emitter.particleSpeedRange = 80
        emitter.emissionAngle = .pi / 2 // Upward
        emitter.emissionAngleRange = .pi / 3 // 60 degree spread

        // Gravity (slight downward for arc)
        emitter.yAcceleration = -50

        // Scale
        emitter.particleScale = 0.4
        emitter.particleScaleRange = 0.15
        emitter.particleScaleSpeed = -0.6 // Shrink

        // Color
        emitter.particleColor = SKColor(red: 1.0, green: 0.84, blue: 0, alpha: 1.0) // Gold
        emitter.particleColorBlendFactor = 1.0
        emitter.particleColorSequence = SKKeyframeSequence(
            keyframeValues: [
                SKColor.white,
                SKColor(red: 1.0, green: 0.84, blue: 0, alpha: 1.0),
                SKColor(red: 1.0, green: 0.84, blue: 0, alpha: 0.6)
            ],
            times: [0, 0.3, 1.0]
        )

        // Alpha
        emitter.particleAlpha = 1.0
        emitter.particleAlphaSpeed = -2.0 // Fade out

        // Blend
        emitter.particleBlendMode = .add

        return emitter
    }
}
```

#### Explosion Effect

```swift
extension SKEmitterNode {

    static func explosionEmitter(size: ParticleManager.ExplosionSize = .medium) -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Texture
        emitter.particleTexture = SKTexture(imageNamed: "smoke")

        // Emission (burst)
        let particleCount: Int
        let baseSpeed: CGFloat
        let lifetime: CGFloat

        switch size {
        case .small:
            particleCount = 30
            baseSpeed = 200
            lifetime = 0.4
        case .medium:
            particleCount = 50
            baseSpeed = 300
            lifetime = 0.6
        case .large:
            particleCount = 80
            baseSpeed = 400
            lifetime = 0.8
        }

        emitter.numParticlesToEmit = particleCount
        emitter.particleBirthRate = 5000 // Instant burst

        // Lifetime
        emitter.particleLifetime = lifetime
        emitter.particleLifetimeRange = lifetime * 0.3

        // Position
        emitter.particlePositionRange = CGVector(dx: 5, dy: 5)

        // Velocity (radial outward)
        emitter.particleSpeed = baseSpeed
        emitter.particleSpeedRange = baseSpeed * 0.5
        emitter.emissionAngle = 0
        emitter.emissionAngleRange = .pi * 2 // Full circle

        // Gravity (slight upward for smoke)
        emitter.yAcceleration = 20

        // Scale (grow)
        emitter.particleScale = 0.5
        emitter.particleScaleRange = 0.2
        emitter.particleScaleSpeed = 1.5

        // Color sequence (hot to cool)
        emitter.particleColorBlendFactor = 1.0
        emitter.particleColorSequence = SKKeyframeSequence(
            keyframeValues: [
                SKColor.white,
                SKColor.yellow,
                SKColor.orange,
                SKColor(red: 0.7, green: 0, blue: 0, alpha: 1),
                SKColor.black
            ],
            times: [0, 0.1, 0.3, 0.6, 1.0]
        )

        // Alpha
        emitter.particleAlpha = 1.0
        emitter.particleAlphaSequence = SKKeyframeSequence(
            keyframeValues: [1.0 as NSNumber, 1.0, 0.8, 0.3, 0.0],
            times: [0, 0.2, 0.5, 0.8, 1.0]
        )

        // Blend
        emitter.particleBlendMode = .add

        // Rotation
        emitter.particleRotation = 0
        emitter.particleRotationRange = .pi * 2
        emitter.particleRotationSpeed = .pi / 4

        return emitter
    }
}
```

#### Sparkle/Shine Effect

```swift
extension SKEmitterNode {

    static func sparkleEmitter() -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Texture
        emitter.particleTexture = SKTexture(imageNamed: "sparkle")

        // Emission (continuous, gentle)
        emitter.particleBirthRate = 10
        emitter.numParticlesToEmit = 0 // Continuous

        // Lifetime
        emitter.particleLifetime = 1.0
        emitter.particleLifetimeRange = 0.3

        // Position spread
        emitter.particlePositionRange = CGVector(dx: 30, dy: 30)

        // Velocity (very gentle)
        emitter.particleSpeed = 15
        emitter.particleSpeedRange = 10
        emitter.emissionAngleRange = .pi * 2

        // No gravity
        emitter.yAcceleration = 0

        // Scale (start visible, shrink out)
        emitter.particleScale = 0.5
        emitter.particleScaleRange = 0.2
        emitter.particleScaleSpeed = -0.3

        // Color
        emitter.particleColor = .white
        emitter.particleColorBlendFactor = 1.0

        // Alpha (fade in and out)
        emitter.particleAlpha = 0.8
        emitter.particleAlphaSequence = SKKeyframeSequence(
            keyframeValues: [0.0 as NSNumber, 0.8, 0.8, 0.0],
            times: [0, 0.2, 0.8, 1.0]
        )

        // Blend
        emitter.particleBlendMode = .add

        return emitter
    }
}
```

#### Confetti Effect

```swift
extension SKEmitterNode {

    static func confettiEmitter() -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Texture
        emitter.particleTexture = SKTexture(imageNamed: "confetti")

        // Emission (rapid burst)
        emitter.numParticlesToEmit = 60
        emitter.particleBirthRate = 300 // Over 0.2 seconds

        // Lifetime (floaty)
        emitter.particleLifetime = 2.5
        emitter.particleLifetimeRange = 1.0

        // Position
        emitter.particlePositionRange = CGVector(dx: 100, dy: 20)

        // Velocity (upward then fall)
        emitter.particleSpeed = 200
        emitter.particleSpeedRange = 100
        emitter.emissionAngle = .pi / 2 // Upward
        emitter.emissionAngleRange = .pi / 4

        // Gravity
        emitter.yAcceleration = -150 // Fall slowly

        // X drift
        emitter.xAcceleration = 0

        // Scale (uniform)
        emitter.particleScale = 0.3
        emitter.particleScaleRange = 0.1

        // Color (random via color ramp)
        emitter.particleColorBlendFactor = 1.0
        emitter.particleColorSequence = SKKeyframeSequence(
            keyframeValues: [
                SKColor.red,
                SKColor.blue,
                SKColor.green,
                SKColor.yellow,
                SKColor.purple,
                SKColor.orange
            ],
            times: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
        )
        emitter.particleColorRedRange = 0.5
        emitter.particleColorGreenRange = 0.5
        emitter.particleColorBlueRange = 0.5

        // Alpha
        emitter.particleAlpha = 1.0
        emitter.particleAlphaSpeed = -0.3

        // Blend (solid pieces)
        emitter.particleBlendMode = .alpha

        // Rotation (tumbling)
        emitter.particleRotation = 0
        emitter.particleRotationRange = .pi * 2
        emitter.particleRotationSpeed = .pi * 1.5

        return emitter
    }
}
```

#### Dust/Debris Effect

```swift
extension SKEmitterNode {

    static func dustEmitter() -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Texture
        emitter.particleTexture = SKTexture(imageNamed: "dust")

        // Emission (burst)
        emitter.numParticlesToEmit = 30
        emitter.particleBirthRate = 1000

        // Lifetime
        emitter.particleLifetime = 0.7
        emitter.particleLifetimeRange = 0.2

        // Position
        emitter.particlePositionRange = CGVector(dx: 15, dy: 5)

        // Velocity (low spread)
        emitter.particleSpeed = 60
        emitter.particleSpeedRange = 30
        emitter.emissionAngle = .pi / 2 // Upward
        emitter.emissionAngleRange = .pi / 2 // 90 degrees

        // Gravity
        emitter.yAcceleration = -80

        // Scale (grow as disperses)
        emitter.particleScale = 0.3
        emitter.particleScaleRange = 0.1
        emitter.particleScaleSpeed = 0.8

        // Color
        emitter.particleColor = SKColor(red: 0.6, green: 0.5, blue: 0.4, alpha: 1.0)
        emitter.particleColorBlendFactor = 1.0

        // Alpha
        emitter.particleAlpha = 0.7
        emitter.particleAlphaSpeed = -0.8

        // Blend
        emitter.particleBlendMode = .alpha

        // Rotation
        emitter.particleRotationRange = .pi * 2
        emitter.particleRotationSpeed = .pi / 8

        return emitter
    }
}
```

#### Magic/Power-Up Effect

```swift
extension SKEmitterNode {

    static func magicEmitter(color: SKColor = .cyan) -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Texture
        emitter.particleTexture = SKTexture(imageNamed: "magic")

        // Emission (continuous aura)
        emitter.particleBirthRate = 25
        emitter.numParticlesToEmit = 0 // Continuous

        // Lifetime
        emitter.particleLifetime = 0.8
        emitter.particleLifetimeRange = 0.2

        // Position (ring pattern)
        emitter.particlePositionRange = CGVector(dx: 40, dy: 40)

        // Velocity (swirling)
        emitter.particleSpeed = 30
        emitter.particleSpeedRange = 15
        emitter.emissionAngle = 0
        emitter.emissionAngleRange = .pi * 2

        // Spiral effect via action
        emitter.particleAction = SKAction.repeatForever(
            SKAction.rotate(byAngle: .pi * 2, duration: 2.0)
        )

        // Scale
        emitter.particleScale = 0.4
        emitter.particleScaleRange = 0.15
        emitter.particleScaleSequence = SKKeyframeSequence(
            keyframeValues: [0.3 as NSNumber, 0.5, 0.3],
            times: [0, 0.5, 1.0]
        )

        // Color
        emitter.particleColor = color
        emitter.particleColorBlendFactor = 1.0

        // Alpha
        emitter.particleAlpha = 0.8
        emitter.particleAlphaSequence = SKKeyframeSequence(
            keyframeValues: [0.0 as NSNumber, 0.8, 0.8, 0.0],
            times: [0, 0.2, 0.7, 1.0]
        )

        // Blend
        emitter.particleBlendMode = .add

        return emitter
    }
}
```

#### Trail Effect

```swift
extension SKEmitterNode {

    static func trailEmitter(color: SKColor = .white) -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Texture
        emitter.particleTexture = SKTexture(imageNamed: "trail")

        // Emission (continuous while attached)
        emitter.particleBirthRate = 30
        emitter.numParticlesToEmit = 0

        // Lifetime (quick fade)
        emitter.particleLifetime = 0.3
        emitter.particleLifetimeRange = 0.05

        // Position (tight to emitter)
        emitter.particlePositionRange = CGVector(dx: 2, dy: 2)

        // Velocity (minimal - trails behind due to parent movement)
        emitter.particleSpeed = 5
        emitter.particleSpeedRange = 3
        emitter.emissionAngleRange = .pi * 2

        // No gravity
        emitter.yAcceleration = 0

        // Scale (shrink to point)
        emitter.particleScale = 0.6
        emitter.particleScaleSpeed = -1.5

        // Color
        emitter.particleColor = color
        emitter.particleColorBlendFactor = 1.0

        // Alpha (fade out)
        emitter.particleAlpha = 0.9
        emitter.particleAlphaSpeed = -2.5

        // Blend
        emitter.particleBlendMode = .add

        // Target node (inherit position from parent)
        emitter.targetNode = nil // Set to scene to leave trail

        return emitter
    }

    /// Attach trail to moving node
    func attachTrail(to node: SKNode, in scene: SKScene) {
        // Set target to scene so particles don't move with emitter
        targetNode = scene
        node.addChild(self)
    }
}
```

### Performance Monitor

```swift
import SpriteKit

class ParticlePerformanceMonitor {
    static let shared = ParticlePerformanceMonitor()

    private var frameCount: Int = 0
    private var particleCount: Int = 0
    private var lastReportTime: Date = Date()

    private init() {}

    func update(scene: SKScene) {
        frameCount += 1

        // Count particles every 60 frames
        if frameCount % 60 == 0 {
            particleCount = countParticles(in: scene)

            // Warn if over budget
            if particleCount > 400 {
                print("WARNING: Particle count \(particleCount) exceeds budget 400")
            }
        }

        // Report every 5 seconds
        let now = Date()
        if now.timeIntervalSince(lastReportTime) >= 5.0 {
            print("Particles: \(particleCount), Emitters: \(countEmitters(in: scene))")
            lastReportTime = now
        }
    }

    private func countParticles(in node: SKNode) -> Int {
        var count = 0

        if let emitter = node as? SKEmitterNode {
            // Estimate active particles
            let lifetime = Double(emitter.particleLifetime)
            let birthRate = Double(emitter.particleBirthRate)

            if emitter.numParticlesToEmit > 0 {
                count += emitter.numParticlesToEmit
            } else {
                count += Int(birthRate * lifetime)
            }
        }

        for child in node.children {
            count += countParticles(in: child)
        }

        return count
    }

    private func countEmitters(in node: SKNode) -> Int {
        var count = 0

        if node is SKEmitterNode {
            count += 1
        }

        for child in node.children {
            count += countEmitters(in: child)
        }

        return count
    }
}
```

### Texture Atlas Setup

```swift
import SpriteKit

class ParticleTextureAtlas {
    static let shared = ParticleTextureAtlas()

    private var atlas: SKTextureAtlas?
    private var textures: [String: SKTexture] = [:]

    private init() {}

    func load(atlasNamed name: String = "Particles") {
        atlas = SKTextureAtlas(named: name)
        atlas?.preload { [weak self] in
            self?.cacheTextures()
        }
    }

    private func cacheTextures() {
        guard let atlas = atlas else { return }

        for textureName in atlas.textureNames {
            textures[textureName] = atlas.textureNamed(textureName)
        }
    }

    func texture(named name: String) -> SKTexture? {
        return textures[name] ?? atlas?.textureNamed(name)
    }
}

// Usage in emitter creation
extension SKEmitterNode {

    static func configuredEmitter(textureName: String) -> SKEmitterNode {
        let emitter = SKEmitterNode()

        // Use atlas texture
        if let texture = ParticleTextureAtlas.shared.texture(named: textureName) {
            emitter.particleTexture = texture
        }

        return emitter
    }
}
```

## Decision Trees

### Choosing Particle Count

```
What is the effect type?
├── Quick feedback (hit, collect)
│   └── 10-25 particles, burst emission
├── Medium event (explosion, power-up)
│   └── 30-50 particles, burst or continuous
├── Large celebration (victory, level up)
│   └── 50-80 particles, rapid burst
├── Ambient (sparkles, dust motes)
│   └── 10-20 particles, continuous low rate
└── Trail (projectile, movement)
    └── 15-30/sec, continuous while moving

Is total particle count under 400?
├── YES → Proceed
└── NO → Reduce counts or skip lower priority effects
```

### Choosing Emission Pattern

```
Is this a one-time event?
├── YES (explosion, collect, hit)
│   └── Use burst: numParticlesToEmit > 0, high birthRate
└── NO (ambient, aura, trail)
    └── Use continuous: numParticlesToEmit = 0, moderate birthRate

Should effect linger?
├── YES (smoke, confetti)
│   └── Longer lifetime (1.5-3.0s)
└── NO (hit, collect)
    └── Short lifetime (0.3-0.6s)
```

### Choosing Blend Mode

```
Is the effect luminous/glowing?
├── YES (fire, magic, sparkle, explosion flash)
│   └── .add (additive blending)
└── NO (smoke, dust, debris, confetti)
    └── .alpha (normal blending)

Is performance critical?
├── YES → Fewer .add particles (expensive)
└── NO → Use appropriate blend for visual
```

### Managing Performance

```
Is frame rate dropping below 60fps?
├── YES:
│   ├── Reduce per-effect particle counts by 25%
│   ├── Shorten lifetimes by 20%
│   ├── Reduce simultaneous emitter limit
│   └── Skip low-priority ambient effects
└── NO:
    └── Current settings acceptable

Is device older (A10 or earlier)?
├── YES:
│   ├── Cap total at 200 particles
│   ├── Use 32x32 textures max
│   └── Limit emitters to 6-8
└── NO:
    └── Standard limits apply
```

## Quality Checklist

### Performance
- [ ] Total active particles under 400
- [ ] Simultaneous emitters under 12
- [ ] Frame rate maintained at 60fps during effects
- [ ] Particle textures are 32x32 or 64x64
- [ ] Textures use ASTC compression
- [ ] Object pooling implemented for frequent effects

### Visual Quality
- [ ] Burst effects feel instant and satisfying
- [ ] Continuous effects loop seamlessly
- [ ] Color gradients enhance the effect
- [ ] Alpha fades out smoothly (no hard cutoff)
- [ ] Scale changes support the visual story
- [ ] Blend mode matches effect type

### Effect Appropriateness
- [ ] Coin collect has upward, sparkly feel
- [ ] Explosions have hot-to-cool color progression
- [ ] Confetti tumbles realistically with gravity
- [ ] Dust settles naturally
- [ ] Magic effects feel mystical and swirling
- [ ] Trails fade quickly behind movement

### Resource Management
- [ ] Emitters removed after effect completes
- [ ] Textures loaded from atlas (not individual files)
- [ ] Preloading done during scene setup
- [ ] Cleanup called on scene transitions

## Anti-Patterns

### Too Many Particles
**Problem**: Explosion with 500 particles
**Consequence**: Frame rate drops, device heats up
**Solution**: Cap explosions at 50-80 particles, use larger textures if needed

### Infinite Lifetime
**Problem**: Particles with lifetime = 0 or very high values
**Consequence**: Particles accumulate indefinitely, memory grows
**Solution**: Always set finite lifetime with appropriate range

### No Pooling
**Problem**: Creating new SKEmitterNode for every effect
**Consequence**: Memory allocation spikes, GC pauses
**Solution**: Implement emitter pool, reuse nodes

### Wrong Blend Mode
**Problem**: Using additive blend for smoke/debris
**Consequence**: Unrealistic glowing dirt
**Solution**: Use .alpha for solid particles, .add only for luminous

### Forgetting Cleanup
**Problem**: Emitters left in scene after effect completes
**Consequence**: Invisible emitters consuming resources
**Solution**: Schedule removal based on effect duration

### Giant Textures
**Problem**: Using 256x256 particle textures
**Consequence**: VRAM exhaustion, render overhead
**Solution**: Use 32x32 to 64x64 maximum for particles

### Particle Spam
**Problem**: Triggering same effect many times per frame
**Consequence**: Exceeds budget instantly, visual noise
**Solution**: Rate limit effect spawning, combine nearby effects

## Adjacent Skills

- **animation-system**: Sync particle spawns with animation keyframes (spawn at impact moment)
- **audio-designer**: Time particle bursts with sound effects
- **haptic-optimizer**: Do NOT trigger haptics per particle (too frequent)
- **screen-shake-impact**: Combine screen shake with explosion particles for impact
- **juice-orchestrator**: Coordinate particles with all feedback channels for cohesive game feel
