# Screen Shake & Impact Code Patterns

## Trauma-Based Shake System

```swift
import SpriteKit

final class TraumaShakeSystem {
    struct ShakeConfig {
        var maxOffset: CGFloat = 20.0
        var maxRotation: CGFloat = 0.05
        var traumaDecay: CGFloat = 2.0
        var noiseSpeed: CGFloat = 30.0
    }

    private var trauma: CGFloat = 0.0 { didSet { trauma = min(max(trauma, 0), 1) } }
    private var noiseOffset: CGFloat = 0.0
    private var config: ShakeConfig
    private let noiseSamplesX: [CGFloat]
    private let noiseSamplesY: [CGFloat]
    private let noiseSamplesRotation: [CGFloat]

    init(config: ShakeConfig = ShakeConfig()) {
        self.config = config
        noiseSamplesX = Self.generatePerlinNoise(count: 256, seed: 1)
        noiseSamplesY = Self.generatePerlinNoise(count: 256, seed: 2)
        noiseSamplesRotation = Self.generatePerlinNoise(count: 256, seed: 3)
    }

    enum ImpactLevel { case light, medium, heavy, extreme }

    struct ShakeOffset {
        let x: CGFloat, y: CGFloat, rotation: CGFloat
        static let zero = ShakeOffset(x: 0, y: 0, rotation: 0)
    }

    func addTrauma(_ amount: CGFloat) { trauma += amount }

    func addImpact(_ level: ImpactLevel) {
        switch level {
        case .light: trauma += 0.2
        case .medium: trauma += 0.4
        case .heavy: trauma += 0.7
        case .extreme: trauma += 1.0
        }
    }

    func update(deltaTime: TimeInterval) -> ShakeOffset {
        guard trauma > 0 else { return .zero }
        trauma -= config.traumaDecay * CGFloat(deltaTime)
        noiseOffset += config.noiseSpeed * CGFloat(deltaTime)

        let shake = trauma * trauma
        let noiseX = sampleNoise(noiseSamplesX, at: noiseOffset)
        let noiseY = sampleNoise(noiseSamplesY, at: noiseOffset * 1.1)
        let noiseR = sampleNoise(noiseSamplesRotation, at: noiseOffset * 0.9)

        return ShakeOffset(
            x: config.maxOffset * shake * noiseX,
            y: config.maxOffset * shake * noiseY,
            rotation: config.maxRotation * shake * noiseR
        )
    }

    var isShaking: Bool { trauma > 0.01 }

    private static func generatePerlinNoise(count: Int, seed: UInt64) -> [CGFloat] {
        var samples: [CGFloat] = []
        let freq1 = CGFloat.random(in: 0.5...1.5)
        let freq2 = CGFloat.random(in: 1.5...3.0)
        let phase1 = CGFloat.random(in: 0...(.pi * 2))
        let phase2 = CGFloat.random(in: 0...(.pi * 2))
        for i in 0..<count {
            let t = CGFloat(i) / CGFloat(count) * .pi * 2
            samples.append(sin(t * freq1 + phase1) * 0.7 + sin(t * freq2 + phase2) * 0.3)
        }
        return samples
    }

    private func sampleNoise(_ samples: [CGFloat], at offset: CGFloat) -> CGFloat {
        let index = Int(offset) % samples.count
        let nextIndex = (index + 1) % samples.count
        let fraction = offset - floor(offset)
        return samples[index] * (1 - fraction) + samples[nextIndex] * fraction
    }
}
```

## Freeze Frame (Hitstop) Implementation

```swift
final class HitstopController {
    struct HitstopConfig {
        let duration: TimeInterval
        let freezePhysics: Bool
        let freezeAnimations: Bool
        let allowParticles: Bool
        let allowCameraEffects: Bool

        static let light = HitstopConfig(duration: 0.05, freezePhysics: true, freezeAnimations: true, allowParticles: true, allowCameraEffects: true)
        static let standard = HitstopConfig(duration: 0.167, freezePhysics: true, freezeAnimations: true, allowParticles: true, allowCameraEffects: true)
        static let heavy = HitstopConfig(duration: 0.283, freezePhysics: true, freezeAnimations: true, allowParticles: true, allowCameraEffects: true)
        static let ultra = HitstopConfig(duration: 0.4, freezePhysics: true, freezeAnimations: true, allowParticles: true, allowCameraEffects: true)
    }

    private(set) var isFrozen: Bool = false
    private var freezeEndTime: TimeInterval = 0
    private var currentConfig: HitstopConfig?
    private weak var scene: SKScene?
    private var pausedNodes: [SKNode] = []

    init(scene: SKScene) { self.scene = scene }

    func triggerHitstop(_ config: HitstopConfig) {
        guard !isFrozen else { return }
        isFrozen = true
        currentConfig = config
        freezeEndTime = CACurrentMediaTime() + config.duration
        applyFreeze(config)
    }

    func triggerHitstop(frames: Int) {
        triggerHitstop(HitstopConfig(duration: TimeInterval(frames) / 60.0, freezePhysics: true, freezeAnimations: true, allowParticles: true, allowCameraEffects: true))
    }

    func update() {
        guard isFrozen, CACurrentMediaTime() >= freezeEndTime else { return }
        endFreeze()
    }

    private func applyFreeze(_ config: HitstopConfig) {
        guard let scene = scene else { return }
        if config.freezePhysics { scene.physicsWorld.speed = 0 }
        if config.freezeAnimations {
            pausedNodes = []
            scene.enumerateChildNodes(withName: "//*") { node, _ in
                if config.allowParticles && node is SKEmitterNode { return }
                if config.allowCameraEffects && node is SKCameraNode { return }
                if node.speed != 0 { self.pausedNodes.append(node); node.isPaused = true }
            }
        }
    }

    private func endFreeze() {
        guard let scene = scene else { return }
        isFrozen = false
        currentConfig = nil
        scene.physicsWorld.speed = 1.0
        for node in pausedNodes { node.isPaused = false }
        pausedNodes = []
    }
}
```

## Screen Flash Effect System

```swift
final class ScreenFlashController {
    struct FlashConfig {
        let color: SKColor
        let peakOpacity: CGFloat
        let duration: TimeInterval
        let holdTime: TimeInterval

        static let hit = FlashConfig(color: .white, peakOpacity: 0.7, duration: 0.08, holdTime: 0.02)
        static let damage = FlashConfig(color: SKColor(red: 1, green: 0, blue: 0, alpha: 1), peakOpacity: 0.4, duration: 0.12, holdTime: 0.03)
        static let critical = FlashConfig(color: .yellow, peakOpacity: 0.8, duration: 0.1, holdTime: 0.02)
        static let heal = FlashConfig(color: .green, peakOpacity: 0.4, duration: 0.18, holdTime: 0.05)
    }

    private let flashNode: SKSpriteNode

    init(size: CGSize, parent: SKNode) {
        flashNode = SKSpriteNode(color: .clear, size: size)
        flashNode.anchorPoint = CGPoint(x: 0.5, y: 0.5)
        flashNode.zPosition = 10000
        flashNode.alpha = 0
        flashNode.isHidden = true
        parent.addChild(flashNode)
    }

    func flash(_ config: FlashConfig) {
        flashNode.removeAllActions()
        flashNode.color = config.color
        flashNode.isHidden = false

        let sequence = SKAction.sequence([
            SKAction.fadeAlpha(to: config.peakOpacity, duration: config.duration * 0.3),
            SKAction.wait(forDuration: config.holdTime),
            SKAction.fadeAlpha(to: 0, duration: config.duration * 0.7),
            SKAction.run { [weak self] in self?.flashNode.isHidden = true }
        ])
        flashNode.run(sequence)
    }

    func flashHit() { flash(.hit) }
    func flashDamage() { flash(.damage) }
    func flashCritical() { flash(.critical) }
}
```

## Camera Zoom/Punch Effect

```swift
final class CameraZoomController {
    struct ZoomConfig {
        let targetScale: CGFloat
        let duration: TimeInterval
        let easing: TimingFunction

        enum TimingFunction { case linear, easeOut, easeOutElastic }

        static let subtlePunch = ZoomConfig(targetScale: 1.02, duration: 0.12, easing: .easeOut)
        static let mediumPunch = ZoomConfig(targetScale: 1.05, duration: 0.2, easing: .easeOut)
        static let heavyPunch = ZoomConfig(targetScale: 1.08, duration: 0.28, easing: .easeOutElastic)
    }

    private weak var cameraNode: SKCameraNode?
    private var baseScale: CGFloat = 1.0

    init(camera: SKCameraNode) { self.cameraNode = camera; self.baseScale = camera.xScale }

    func punch(_ config: ZoomConfig) {
        guard let camera = cameraNode else { return }
        camera.removeAction(forKey: "zoom")

        let zoomIn = SKAction.scale(to: config.targetScale, duration: config.duration * 0.4)
        zoomIn.timingMode = .easeOut
        let zoomOut = SKAction.scale(to: baseScale, duration: config.duration * 0.6)
        zoomOut.timingMode = .easeOut

        camera.run(SKAction.sequence([zoomIn, zoomOut]), withKey: "zoom")
    }

    func resetZoom(duration: TimeInterval = 0.3) {
        guard let camera = cameraNode else { return }
        let action = SKAction.scale(to: baseScale, duration: duration)
        action.timingMode = .easeOut
        camera.run(action, withKey: "zoom")
    }
}
```

## Combined Impact Effect Coordinator

```swift
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

    func lightImpact() { shakeSystem.addImpact(.light) }

    func mediumImpact() {
        shakeSystem.addImpact(.medium)
        hitstopController.triggerHitstop(.standard)
        flashController.flashHit()
    }

    func heavyImpact() {
        shakeSystem.addImpact(.heavy)
        hitstopController.triggerHitstop(.heavy)
        flashController.flashCritical()
        zoomController.punch(.mediumPunch)
    }

    func extremeImpact() {
        shakeSystem.addImpact(.extreme)
        hitstopController.triggerHitstop(.ultra)
        flashController.flash(ScreenFlashController.FlashConfig(color: .white, peakOpacity: 0.9, duration: 0.15, holdTime: 0.03))
        zoomController.punch(.heavyPunch)
    }

    func playerDamage(severity: CGFloat) {
        shakeSystem.addTrauma(0.3 + severity * 0.4)
        hitstopController.triggerHitstop(frames: Int(4 + severity * 8))
        flashController.flashDamage()
    }

    func update(deltaTime: TimeInterval, camera: SKCameraNode, basePosition: CGPoint) {
        hitstopController.update()
        let offset = shakeSystem.update(deltaTime: deltaTime)
        camera.position = CGPoint(x: basePosition.x + offset.x, y: basePosition.y + offset.y)
        camera.zRotation = offset.rotation
    }
}
```

## Accessibility: Motion Reduction

```swift
import UIKit

final class AccessibleShakeSystem {
    private let shakeSystem: TraumaShakeSystem

    var reduceMotion: Bool { UIAccessibility.isReduceMotionEnabled }

    init() {
        self.shakeSystem = TraumaShakeSystem()
        NotificationCenter.default.addObserver(self, selector: #selector(accessibilityChanged), name: UIAccessibility.reduceMotionStatusDidChangeNotification, object: nil)
    }

    @objc private func accessibilityChanged() { }

    func addImpact(_ level: TraumaShakeSystem.ImpactLevel) {
        if reduceMotion { return }
        shakeSystem.addImpact(level)
    }

    func update(deltaTime: TimeInterval) -> TraumaShakeSystem.ShakeOffset {
        if reduceMotion { return .zero }
        return shakeSystem.update(deltaTime: deltaTime)
    }
}
```
