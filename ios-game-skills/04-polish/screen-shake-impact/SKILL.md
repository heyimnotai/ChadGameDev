---
name: screen-shake-impact
description: Implement impactful screen feedback systems including camera shake, freeze frames (hitstop), and flash effects for iOS games. Use when adding impact feedback to combat systems, collisions, explosions, or any moment requiring visceral player feedback. Triggers when implementing damage systems, hit detection, or dramatic game events requiring visual emphasis.
---

# Screen Shake & Impact Effects

## Purpose

This skill enables implementation of screen-based impact feedback that makes game events feel powerful and consequential. Proper screen shake, freeze frames, and flash effects transform routine collisions into memorable moments. An agent with this skill can implement trauma-based shake systems, hitstop mechanics, and coordinated flash effects that meet top 10% App Store polish standards.

## Domain Boundaries

**This skill handles:**
- Camera/screen shake implementation with Perlin noise
- Trauma-based shake accumulation and decay systems
- Freeze frame (hitstop) timing and partial freeze techniques
- Screen flash effects (white flash, damage flash, color overlays)
- Camera zoom/punch effects for emphasis
- Directional shake (horizontal, vertical, rotational)
- Accessibility options for motion-sensitive players
- SpriteKit camera node shake implementation

**This skill does NOT handle:**
- Haptic feedback patterns (see `haptic-optimizer`)
- Particle effects spawning (see `particle-effects`)
- Sound effect design (see `audio-designer`)
- Animation timing (see `animation-system`)
- Coordination of all feedback systems together (see `juice-orchestrator`)

---

## Core Specifications

### Screen Shake Intensity Values

| Impact Level | Magnitude (pixels) | Duration | Use Case |
|-------------|-------------------|----------|----------|
| **Light** | 2-5 px | 0.1-0.2s | Small hits, footsteps, light bumps |
| **Medium** | 5-10 px | 0.2-0.4s | Standard damage, explosions, heavy landings |
| **Heavy** | 10-20 px | 0.3-0.6s | Critical hits, boss attacks, major events |
| **Extreme** | 20-30 px | 0.4-0.8s | Screen-clearing events, death, phase transitions |

### Shake Direction Types

| Direction | Application | Feel |
|-----------|-------------|------|
| **Horizontal** | Side impacts, horizontal knockback | Pushed sideways |
| **Vertical** | Ground pounds, vertical hits | Jarring, heavy |
| **Omni-directional** | Explosions, general impacts | Chaotic, powerful |
| **Rotational** | Disorientation, stun effects | Dizzying, off-balance |

### Decay Curve Formula

**Trauma-squared decay** produces the most satisfying shake:

```
Effective Shake = Trauma^2
```

This creates:
- Intense initial shake at high trauma
- Rapid falloff as trauma decreases
- Natural-feeling deceleration

### Freeze Frame (Hitstop) Duration

| Impact Type | Frame Count | Duration (at 60fps) | Use Case |
|------------|-------------|---------------------|----------|
| **Fast/Light** | 2-4 frames | 33-66ms | Quick jabs, light attacks |
| **Standard** | 8-12 frames | 133-200ms | Normal combat hits |
| **Heavy** | 15-20 frames | 250-333ms | Charged attacks, finishers |
| **Ultra** | 20-30 frames | 333-500ms | Critical kills, boss phase ends |

### Flash Effect Specifications

| Flash Type | Color | Opacity | Duration | Decay |
|-----------|-------|---------|----------|-------|
| **Hit Flash** | White (#FFFFFF) | 0.6-0.8 | 50-100ms | Linear |
| **Damage Flash** | Red (#FF0000) | 0.3-0.5 | 100-150ms | Ease-out |
| **Critical Flash** | Yellow (#FFFF00) | 0.7-0.9 | 80-120ms | Linear |
| **Heal Flash** | Green (#00FF00) | 0.3-0.5 | 150-200ms | Ease-out |
| **Shield Flash** | Blue (#0088FF) | 0.4-0.6 | 100-150ms | Ease-out |

### Camera Zoom/Punch Values

| Effect | Scale Change | Duration | Easing |
|--------|-------------|----------|--------|
| **Subtle punch** | 1.0 -> 1.02 -> 1.0 | 100-150ms | Ease-out |
| **Medium punch** | 1.0 -> 1.05 -> 1.0 | 150-250ms | Ease-out |
| **Heavy punch** | 1.0 -> 1.08 -> 1.0 | 200-350ms | Ease-out-elastic |
| **Zoom in (focus)** | 1.0 -> 1.15 | 300-500ms | Ease-in-out |

---

## Implementation Patterns

### Trauma-Based Shake System (SpriteKit)

```swift
import SpriteKit

final class TraumaShakeSystem {

    // MARK: - Configuration

    struct ShakeConfig {
        var maxOffset: CGFloat = 20.0        // Maximum pixel displacement
        var maxRotation: CGFloat = 0.05      // Maximum rotation in radians (~3 degrees)
        var traumaDecay: CGFloat = 2.0       // Trauma units lost per second
        var noiseSpeed: CGFloat = 30.0       // Perlin noise sample speed
    }

    // MARK: - Properties

    private var trauma: CGFloat = 0.0 {
        didSet { trauma = min(max(trauma, 0), 1) }
    }

    private var noiseOffset: CGFloat = 0.0
    private var config: ShakeConfig

    // Perlin noise samples (pre-computed for performance)
    private let noiseSamplesX: [CGFloat]
    private let noiseSamplesY: [CGFloat]
    private let noiseSamplesRotation: [CGFloat]

    // MARK: - Initialization

    init(config: ShakeConfig = ShakeConfig()) {
        self.config = config

        // Pre-compute noise samples (256 samples for smooth looping)
        noiseSamplesX = Self.generatePerlinNoise(count: 256, seed: 1)
        noiseSamplesY = Self.generatePerlinNoise(count: 256, seed: 2)
        noiseSamplesRotation = Self.generatePerlinNoise(count: 256, seed: 3)
    }

    // MARK: - Public API

    /// Add trauma from an impact event
    func addTrauma(_ amount: CGFloat) {
        trauma += amount
    }

    /// Add trauma for predefined impact levels
    func addImpact(_ level: ImpactLevel) {
        switch level {
        case .light:
            trauma += 0.2
        case .medium:
            trauma += 0.4
        case .heavy:
            trauma += 0.7
        case .extreme:
            trauma += 1.0
        }
    }

    /// Update and return shake offset for this frame
    func update(deltaTime: TimeInterval) -> ShakeOffset {
        guard trauma > 0 else {
            return ShakeOffset.zero
        }

        // Decay trauma over time
        trauma -= config.traumaDecay * CGFloat(deltaTime)

        // Advance noise sampling
        noiseOffset += config.noiseSpeed * CGFloat(deltaTime)

        // Calculate shake using trauma squared for dramatic curve
        let shake = trauma * trauma

        // Sample noise for smooth shake
        let noiseX = sampleNoise(noiseSamplesX, at: noiseOffset)
        let noiseY = sampleNoise(noiseSamplesY, at: noiseOffset * 1.1)
        let noiseR = sampleNoise(noiseSamplesRotation, at: noiseOffset * 0.9)

        return ShakeOffset(
            x: config.maxOffset * shake * noiseX,
            y: config.maxOffset * shake * noiseY,
            rotation: config.maxRotation * shake * noiseR
        )
    }

    /// Current trauma level (0-1)
    var currentTrauma: CGFloat { trauma }

    /// Whether shake is currently active
    var isShaking: Bool { trauma > 0.01 }

    // MARK: - Types

    enum ImpactLevel {
        case light   // 2-5 pixels, 0.1-0.2s
        case medium  // 5-10 pixels, 0.2-0.4s
        case heavy   // 10-20 pixels, 0.3-0.6s
        case extreme // 20-30 pixels, 0.4-0.8s
    }

    struct ShakeOffset {
        let x: CGFloat
        let y: CGFloat
        let rotation: CGFloat

        static let zero = ShakeOffset(x: 0, y: 0, rotation: 0)
    }

    // MARK: - Perlin Noise Generation

    private static func generatePerlinNoise(count: Int, seed: UInt64) -> [CGFloat] {
        var samples: [CGFloat] = []
        samples.reserveCapacity(count)

        // Simplified 1D Perlin-like noise using sine waves
        var generator = RandomNumberGenerator(seed: seed)
        let frequency1 = CGFloat.random(in: 0.5...1.5, using: &generator)
        let frequency2 = CGFloat.random(in: 1.5...3.0, using: &generator)
        let phase1 = CGFloat.random(in: 0...(.pi * 2), using: &generator)
        let phase2 = CGFloat.random(in: 0...(.pi * 2), using: &generator)

        for i in 0..<count {
            let t = CGFloat(i) / CGFloat(count) * .pi * 2
            let value = sin(t * frequency1 + phase1) * 0.7 + sin(t * frequency2 + phase2) * 0.3
            samples.append(value)
        }

        return samples
    }

    private func sampleNoise(_ samples: [CGFloat], at offset: CGFloat) -> CGFloat {
        let index = Int(offset) % samples.count
        let nextIndex = (index + 1) % samples.count
        let fraction = offset - floor(offset)

        // Smooth interpolation between samples
        return samples[index] * (1 - fraction) + samples[nextIndex] * fraction
    }
}

// Simple seeded random for deterministic noise
private struct RandomNumberGenerator: Swift.RandomNumberGenerator {
    private var state: UInt64

    init(seed: UInt64) {
        state = seed
    }

    mutating func next() -> UInt64 {
        state = state &* 6364136223846793005 &+ 1442695040888963407
        return state
    }
}
```

### Applying Shake to SpriteKit Camera

```swift
import SpriteKit

class GameScene: SKScene {

    private let shakeSystem = TraumaShakeSystem()
    private var cameraNode: SKCameraNode!
    private var cameraBasePosition: CGPoint = .zero

    override func didMove(to view: SKView) {
        // Setup camera
        cameraNode = SKCameraNode()
        cameraNode.position = CGPoint(x: size.width / 2, y: size.height / 2)
        cameraBasePosition = cameraNode.position
        addChild(cameraNode)
        camera = cameraNode
    }

    override func update(_ currentTime: TimeInterval) {
        // Calculate delta time
        let deltaTime = calculateDeltaTime(currentTime)

        // Get shake offset
        let shakeOffset = shakeSystem.update(deltaTime: deltaTime)

        // Apply to camera
        cameraNode.position = CGPoint(
            x: cameraBasePosition.x + shakeOffset.x,
            y: cameraBasePosition.y + shakeOffset.y
        )
        cameraNode.zRotation = shakeOffset.rotation
    }

    // MARK: - Public API

    func triggerImpact(_ level: TraumaShakeSystem.ImpactLevel) {
        shakeSystem.addImpact(level)
    }

    func triggerCustomShake(trauma: CGFloat) {
        shakeSystem.addTrauma(trauma)
    }
}
```

### Freeze Frame (Hitstop) Implementation

```swift
import SpriteKit

final class HitstopController {

    // MARK: - Configuration

    struct HitstopConfig {
        let duration: TimeInterval
        let freezePhysics: Bool
        let freezeAnimations: Bool
        let allowParticles: Bool      // Particles continue during freeze
        let allowCameraEffects: Bool  // Camera shake continues

        // Presets
        static let light = HitstopConfig(
            duration: 0.05,  // 3 frames at 60fps
            freezePhysics: true,
            freezeAnimations: true,
            allowParticles: true,
            allowCameraEffects: true
        )

        static let standard = HitstopConfig(
            duration: 0.167, // 10 frames at 60fps
            freezePhysics: true,
            freezeAnimations: true,
            allowParticles: true,
            allowCameraEffects: true
        )

        static let heavy = HitstopConfig(
            duration: 0.283, // 17 frames at 60fps
            freezePhysics: true,
            freezeAnimations: true,
            allowParticles: true,
            allowCameraEffects: true
        )

        static let ultra = HitstopConfig(
            duration: 0.4,   // 24 frames at 60fps
            freezePhysics: true,
            freezeAnimations: true,
            allowParticles: true,
            allowCameraEffects: true
        )
    }

    // MARK: - State

    private(set) var isFrozen: Bool = false
    private var freezeEndTime: TimeInterval = 0
    private var currentConfig: HitstopConfig?
    private weak var scene: SKScene?

    // Store paused nodes for partial freeze
    private var pausedNodes: [SKNode] = []

    // MARK: - Initialization

    init(scene: SKScene) {
        self.scene = scene
    }

    // MARK: - Public API

    func triggerHitstop(_ config: HitstopConfig) {
        guard !isFrozen else { return }

        isFrozen = true
        currentConfig = config
        freezeEndTime = CACurrentMediaTime() + config.duration

        applyFreeze(config)
    }

    func triggerHitstop(frames: Int) {
        let duration = TimeInterval(frames) / 60.0
        let config = HitstopConfig(
            duration: duration,
            freezePhysics: true,
            freezeAnimations: true,
            allowParticles: true,
            allowCameraEffects: true
        )
        triggerHitstop(config)
    }

    func update() {
        guard isFrozen else { return }

        if CACurrentMediaTime() >= freezeEndTime {
            endFreeze()
        }
    }

    // MARK: - Freeze Logic

    private func applyFreeze(_ config: HitstopConfig) {
        guard let scene = scene else { return }

        if config.freezePhysics {
            scene.physicsWorld.speed = 0
        }

        if config.freezeAnimations {
            pausedNodes = []

            scene.enumerateChildNodes(withName: "//*") { node, _ in
                // Skip particles if allowed to continue
                if config.allowParticles && node is SKEmitterNode {
                    return
                }

                // Skip camera if effects allowed
                if config.allowCameraEffects && node is SKCameraNode {
                    return
                }

                if node.speed != 0 {
                    self.pausedNodes.append(node)
                    node.isPaused = true
                }
            }
        }
    }

    private func endFreeze() {
        guard let scene = scene else { return }

        isFrozen = false
        currentConfig = nil

        // Restore physics
        scene.physicsWorld.speed = 1.0

        // Unpause nodes
        for node in pausedNodes {
            node.isPaused = false
        }
        pausedNodes = []
    }
}
```

### Screen Flash Effect System

```swift
import SpriteKit

final class ScreenFlashController {

    // MARK: - Flash Types

    struct FlashConfig {
        let color: SKColor
        let peakOpacity: CGFloat
        let duration: TimeInterval
        let holdTime: TimeInterval    // Time at peak before fade

        // Presets
        static let hit = FlashConfig(
            color: .white,
            peakOpacity: 0.7,
            duration: 0.08,
            holdTime: 0.02
        )

        static let damage = FlashConfig(
            color: SKColor(red: 1, green: 0, blue: 0, alpha: 1),
            peakOpacity: 0.4,
            duration: 0.12,
            holdTime: 0.03
        )

        static let critical = FlashConfig(
            color: .yellow,
            peakOpacity: 0.8,
            duration: 0.1,
            holdTime: 0.02
        )

        static let heal = FlashConfig(
            color: .green,
            peakOpacity: 0.4,
            duration: 0.18,
            holdTime: 0.05
        )

        static let shield = FlashConfig(
            color: SKColor(red: 0, green: 0.53, blue: 1, alpha: 1),
            peakOpacity: 0.5,
            duration: 0.12,
            holdTime: 0.03
        )
    }

    // MARK: - Properties

    private let flashNode: SKSpriteNode
    private weak var parentNode: SKNode?

    // MARK: - Initialization

    init(size: CGSize, parent: SKNode) {
        flashNode = SKSpriteNode(color: .clear, size: size)
        flashNode.anchorPoint = CGPoint(x: 0.5, y: 0.5)
        flashNode.zPosition = 10000 // Above everything
        flashNode.alpha = 0
        flashNode.isHidden = true

        self.parentNode = parent
        parent.addChild(flashNode)
    }

    // MARK: - Public API

    func flash(_ config: FlashConfig) {
        flashNode.removeAllActions()
        flashNode.color = config.color
        flashNode.isHidden = false

        let fadeInDuration = config.duration * 0.3
        let fadeOutDuration = config.duration * 0.7

        let sequence = SKAction.sequence([
            SKAction.fadeAlpha(to: config.peakOpacity, duration: fadeInDuration),
            SKAction.wait(forDuration: config.holdTime),
            SKAction.fadeAlpha(to: 0, duration: fadeOutDuration),
            SKAction.run { [weak self] in
                self?.flashNode.isHidden = true
            }
        ])

        flashNode.run(sequence)
    }

    func flashHit() { flash(.hit) }
    func flashDamage() { flash(.damage) }
    func flashCritical() { flash(.critical) }
    func flashHeal() { flash(.heal) }
    func flashShield() { flash(.shield) }

    /// Custom flash with specific color and timing
    func flash(color: SKColor, opacity: CGFloat, duration: TimeInterval) {
        let config = FlashConfig(
            color: color,
            peakOpacity: opacity,
            duration: duration,
            holdTime: duration * 0.2
        )
        flash(config)
    }
}
```

### Camera Zoom/Punch Effect

```swift
import SpriteKit

final class CameraZoomController {

    // MARK: - Types

    struct ZoomConfig {
        let targetScale: CGFloat
        let duration: TimeInterval
        let easing: TimingFunction

        enum TimingFunction {
            case linear
            case easeOut
            case easeOutElastic
        }

        // Presets
        static let subtlePunch = ZoomConfig(
            targetScale: 1.02,
            duration: 0.12,
            easing: .easeOut
        )

        static let mediumPunch = ZoomConfig(
            targetScale: 1.05,
            duration: 0.2,
            easing: .easeOut
        )

        static let heavyPunch = ZoomConfig(
            targetScale: 1.08,
            duration: 0.28,
            easing: .easeOutElastic
        )

        static let focusZoom = ZoomConfig(
            targetScale: 1.15,
            duration: 0.4,
            easing: .easeOut
        )
    }

    // MARK: - Properties

    private weak var cameraNode: SKCameraNode?
    private var baseScale: CGFloat = 1.0

    // MARK: - Initialization

    init(camera: SKCameraNode) {
        self.cameraNode = camera
        self.baseScale = camera.xScale
    }

    // MARK: - Public API

    func punch(_ config: ZoomConfig) {
        guard let camera = cameraNode else { return }

        camera.removeAction(forKey: "zoom")

        // Punch in then return
        let zoomIn = createZoomAction(to: config.targetScale, duration: config.duration * 0.4, easing: config.easing)
        let zoomOut = createZoomAction(to: baseScale, duration: config.duration * 0.6, easing: .easeOut)

        let sequence = SKAction.sequence([zoomIn, zoomOut])
        camera.run(sequence, withKey: "zoom")
    }

    func zoomTo(_ scale: CGFloat, duration: TimeInterval, completion: (() -> Void)? = nil) {
        guard let camera = cameraNode else { return }

        camera.removeAction(forKey: "zoom")

        let action = createZoomAction(to: scale, duration: duration, easing: .easeOut)

        if let completion = completion {
            camera.run(SKAction.sequence([action, SKAction.run(completion)]), withKey: "zoom")
        } else {
            camera.run(action, withKey: "zoom")
        }
    }

    func resetZoom(duration: TimeInterval = 0.3) {
        zoomTo(baseScale, duration: duration)
    }

    // MARK: - Action Creation

    private func createZoomAction(to scale: CGFloat, duration: TimeInterval, easing: ZoomConfig.TimingFunction) -> SKAction {
        let timingMode: SKActionTimingMode

        switch easing {
        case .linear:
            timingMode = .linear
        case .easeOut:
            timingMode = .easeOut
        case .easeOutElastic:
            // Elastic requires custom implementation
            return createElasticZoomAction(to: scale, duration: duration)
        }

        let action = SKAction.scale(to: scale, duration: duration)
        action.timingMode = timingMode
        return action
    }

    private func createElasticZoomAction(to targetScale: CGFloat, duration: TimeInterval) -> SKAction {
        return SKAction.customAction(withDuration: duration) { [weak self] node, elapsedTime in
            guard let camera = node as? SKCameraNode,
                  let self = self else { return }

            let progress = elapsedTime / CGFloat(duration)
            let elasticProgress = self.elasticEaseOut(progress)

            let startScale = self.baseScale
            let scale = startScale + (targetScale - startScale) * elasticProgress
            camera.setScale(scale)
        }
    }

    private func elasticEaseOut(_ t: CGFloat) -> CGFloat {
        if t == 0 { return 0 }
        if t == 1 { return 1 }

        let p: CGFloat = 0.3
        let s = p / 4

        return pow(2, -10 * t) * sin((t - s) * (2 * .pi) / p) + 1
    }
}
```

### Combined Impact Effect Coordinator

```swift
import SpriteKit

/// Coordinates shake, hitstop, flash, and zoom for impact events
final class ImpactEffectCoordinator {

    private let shakeSystem: TraumaShakeSystem
    private let hitstopController: HitstopController
    private let flashController: ScreenFlashController
    private let zoomController: CameraZoomController

    init(scene: SKScene, camera: SKCameraNode, screenSize: CGSize) {
        self.shakeSystem = TraumaShakeSystem()
        self.hitstopController = HitstopController(scene: scene)
        self.flashController = ScreenFlashController(size: screenSize, parent: camera)
        self.zoomController = CameraZoomController(camera: camera)
    }

    /// Light impact - small enemies, minor collisions
    func lightImpact() {
        shakeSystem.addImpact(.light)
        // No hitstop for light impacts
        // No flash for light impacts
    }

    /// Medium impact - standard hits, regular damage
    func mediumImpact() {
        shakeSystem.addImpact(.medium)
        hitstopController.triggerHitstop(.standard)
        flashController.flashHit()
    }

    /// Heavy impact - critical hits, boss damage, explosions
    func heavyImpact() {
        shakeSystem.addImpact(.heavy)
        hitstopController.triggerHitstop(.heavy)
        flashController.flashCritical()
        zoomController.punch(.mediumPunch)
    }

    /// Extreme impact - death, phase transitions, ultimate attacks
    func extremeImpact() {
        shakeSystem.addImpact(.extreme)
        hitstopController.triggerHitstop(.ultra)
        flashController.flash(color: .white, opacity: 0.9, duration: 0.15)
        zoomController.punch(.heavyPunch)
    }

    /// Player takes damage
    func playerDamage(severity: CGFloat) {
        // severity: 0-1 scale
        shakeSystem.addTrauma(0.3 + severity * 0.4)
        hitstopController.triggerHitstop(frames: Int(4 + severity * 8))
        flashController.flashDamage()
    }

    /// Must be called every frame
    func update(deltaTime: TimeInterval, camera: SKCameraNode, basePosition: CGPoint) {
        hitstopController.update()

        let offset = shakeSystem.update(deltaTime: deltaTime)
        camera.position = CGPoint(
            x: basePosition.x + offset.x,
            y: basePosition.y + offset.y
        )
        camera.zRotation = offset.rotation
    }
}
```

### Accessibility: Motion Reduction

```swift
import UIKit

/// Respects user's accessibility preferences for reduced motion
final class AccessibleShakeSystem {

    private let shakeSystem: TraumaShakeSystem

    var reduceMotion: Bool {
        UIAccessibility.isReduceMotionEnabled
    }

    init() {
        self.shakeSystem = TraumaShakeSystem()

        // Listen for accessibility changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(accessibilityChanged),
            name: UIAccessibility.reduceMotionStatusDidChangeNotification,
            object: nil
        )
    }

    @objc private func accessibilityChanged() {
        // Configuration updates if needed
    }

    func addImpact(_ level: TraumaShakeSystem.ImpactLevel) {
        if reduceMotion {
            // Skip shake entirely when reduce motion is enabled
            return
        }
        shakeSystem.addImpact(level)
    }

    func update(deltaTime: TimeInterval) -> TraumaShakeSystem.ShakeOffset {
        if reduceMotion {
            return .zero
        }
        return shakeSystem.update(deltaTime: deltaTime)
    }
}
```

---

## Decision Trees

### When to Add Screen Shake

```
Is this a collision/impact event?
├── Yes: What's the magnitude?
│   ├── Trivial (coin pickup): No shake
│   ├── Minor (small enemy hit): Light shake (2-5px, 0.1s)
│   ├── Standard (normal combat): Medium shake (5-10px, 0.2s)
│   ├── Significant (boss hit): Heavy shake (10-20px, 0.4s)
│   └── Dramatic (death/explosion): Extreme shake (20-30px, 0.6s)
└── No: Is this a dramatic moment?
    ├── Yes (level complete, achievement): Consider subtle shake
    └── No: No shake needed
```

### When to Use Hitstop

```
Did a hit connect?
├── Yes: Was it a player attack?
│   ├── Yes: Hitstop emphasizes player power
│   │   ├── Light attack: 2-4 frames (33-66ms)
│   │   ├── Normal attack: 8-12 frames (133-200ms)
│   │   └── Heavy/special: 15-20 frames (250-333ms)
│   └── No (enemy attack on player):
│       ├── Want to emphasize danger? Add hitstop
│       └── Fast-paced game? Skip hitstop on player damage
└── No: Skip hitstop
```

### Flash Effect Selection

```
What just happened?
├── Player dealt damage: White flash (0.08s)
├── Player critical hit: Yellow flash (0.1s)
├── Player took damage: Red flash (0.12s)
├── Player healed: Green flash (0.18s)
├── Shield activated: Blue flash (0.12s)
├── Major event (level clear): White flash (0.1s, higher opacity)
└── Custom: Match color to game theme
```

### Directional Shake Selection

```
What caused the impact?
├── Horizontal force (side hit, knockback): Horizontal shake
├── Vertical force (ground pound, fall): Vertical shake
├── Explosion/AOE: Omni-directional shake
├── Stun/confusion effect: Rotational shake
└── Combination (diagonal attack): Combined horizontal + vertical
```

---

## Quality Checklist

Before completing screen shake implementation, verify:

- [ ] Trauma-based shake system implemented with decay rate of 2.0/second
- [ ] Perlin noise (not random) used for smooth shake motion
- [ ] Shake magnitudes follow specification (2-5, 5-10, 10-20, 20-30 pixels)
- [ ] Shake durations match impact level (0.1-0.2s to 0.4-0.8s)
- [ ] Trauma squared formula used for dramatic decay curve
- [ ] Hitstop implemented with partial freeze (particles continue)
- [ ] Hitstop durations match specification (2-4, 8-12, 15-20 frames)
- [ ] Flash effects have appropriate colors and durations
- [ ] Flash opacity peaks then fades (not instant on/off)
- [ ] Camera zoom/punch effects work without disrupting gameplay
- [ ] Maximum shake capped to prevent motion sickness
- [ ] Accessibility option checks `UIAccessibility.isReduceMotionEnabled`
- [ ] Reduced motion mode provides alternative feedback (flash only, no shake)
- [ ] Multiple simultaneous impacts layer additively (not replace)
- [ ] Performance profiled (shake calculations under 0.5ms per frame)
- [ ] Tested on device (not just simulator)

---

## Anti-Patterns

**Don't**: Use random values for shake offset
**Why**: Creates jarring, stuttery motion that feels broken
**Instead**: Use Perlin noise or sine wave combinations for smooth shake

**Don't**: Apply same shake intensity to all impacts
**Why**: Diminishes impact hierarchy; big hits don't feel bigger
**Instead**: Scale shake magnitude to impact significance (2-30 pixel range)

**Don't**: Freeze EVERYTHING during hitstop
**Why**: Feels like the game crashed; breaks immersion
**Instead**: Use partial freeze - particles, camera shake continue

**Don't**: Flash at 100% opacity
**Why**: Causes discomfort, especially in dark environments
**Instead**: Cap flash opacity at 80%, typically use 40-70%

**Don't**: Stack multiple long hitstops
**Why**: Game feels unresponsive; breaks flow
**Instead**: Use shorter hitstops for rapid hits, reserve long hitstops for finishers

**Don't**: Ignore accessibility settings
**Why**: Motion-sensitive users cannot play; potential App Store rejection
**Instead**: Check `isReduceMotionEnabled`, provide fallback feedback

**Don't**: Apply rotation shake without damping
**Why**: Can cause nausea, especially on larger screens
**Instead**: Limit rotation to 0.05 radians (~3 degrees) maximum

**Don't**: Use linear decay for trauma
**Why**: Shake ends abruptly, feels unnatural
**Instead**: Use trauma-squared for smooth, dramatic falloff

---

## Adjacent Skills

- `haptic-optimizer` - Pair screen shake with haptic feedback for multi-sensory impact
- `audio-designer` - Impact sounds should sync with screen shake start
- `particle-effects` - Spawn impact particles at moment of hitstop
- `animation-system` - Character reactions should complement screen effects
- `juice-orchestrator` - Coordinates all feedback systems for cohesive impacts
