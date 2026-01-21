# Particle Effects Code Patterns

## Basic Particle System Manager

```swift
import SpriteKit

final class ParticleManager {
    static let shared = ParticleManager()

    private var activeEmitters: [String: SKEmitterNode] = [:]
    private var emitterPool: [String: [SKEmitterNode]] = [:]

    private var totalActiveParticles: Int = 0
    private let maxTotalParticles: Int = 400
    private let maxSimultaneousEmitters: Int = 12

    private init() {}

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

    func spawnEffect(named name: String, at position: CGPoint, in scene: SKScene, duration: TimeInterval? = nil) -> SKEmitterNode? {
        guard activeEmitters.count < maxSimultaneousEmitters else { return nil }

        let emitter: SKEmitterNode
        if let pooled = emitterPool[name]?.popLast() { emitter = pooled }
        else if let loaded = SKEmitterNode(fileNamed: name) { emitter = loaded }
        else { return nil }

        let estimatedParticles = estimateParticleCount(emitter, duration: duration ?? 1.0)
        guard totalActiveParticles + estimatedParticles <= maxTotalParticles else {
            returnToPool(emitter, named: name)
            return nil
        }

        emitter.position = position
        emitter.isPaused = false
        emitter.resetSimulation()

        let id = UUID().uuidString
        activeEmitters[id] = emitter
        totalActiveParticles += estimatedParticles

        scene.addChild(emitter)
        scheduleCleanup(emitter: emitter, id: id, name: name, after: duration ?? calculateDuration(emitter))

        return emitter
    }

    private func estimateParticleCount(_ emitter: SKEmitterNode, duration: TimeInterval) -> Int {
        if emitter.numParticlesToEmit > 0 { return emitter.numParticlesToEmit }
        let avgLifetime = Double(emitter.particleLifetime) + Double(emitter.particleLifetimeRange) / 2
        return min(Int(emitter.particleBirthRate * CGFloat(min(avgLifetime, duration))), 100)
    }

    private func calculateDuration(_ emitter: SKEmitterNode) -> TimeInterval {
        let lifetime = Double(emitter.particleLifetime) + Double(emitter.particleLifetimeRange) / 2
        if emitter.numParticlesToEmit > 0 {
            return Double(emitter.numParticlesToEmit) / Double(emitter.particleBirthRate) + lifetime
        }
        return lifetime + 0.5
    }

    func spawnCoinCollect(at position: CGPoint, in scene: SKScene) {
        spawnEffect(named: "CoinCollect", at: position, in: scene, duration: 0.5)
    }

    func spawnExplosion(at position: CGPoint, in scene: SKScene, size: ExplosionSize = .medium) {
        let name = size == .small ? "ExplosionSmall" : size == .medium ? "ExplosionMedium" : "ExplosionLarge"
        spawnEffect(named: name, at: position, in: scene, duration: size == .large ? 1.0 : 0.7)
    }

    enum ExplosionSize { case small, medium, large }
}
```

## SKEmitterNode Configuration Recipes

### Coin Collect Effect

```swift
extension SKEmitterNode {
    static func coinCollectEmitter() -> SKEmitterNode {
        let emitter = SKEmitterNode()
        emitter.particleTexture = SKTexture(imageNamed: "spark")
        emitter.numParticlesToEmit = 20
        emitter.particleBirthRate = 2000
        emitter.particleLifetime = 0.4
        emitter.particleLifetimeRange = 0.15
        emitter.particlePositionRange = CGVector(dx: 10, dy: 10)
        emitter.particleSpeed = 150
        emitter.particleSpeedRange = 80
        emitter.emissionAngle = .pi / 2
        emitter.emissionAngleRange = .pi / 3
        emitter.yAcceleration = -50
        emitter.particleScale = 0.4
        emitter.particleScaleRange = 0.15
        emitter.particleScaleSpeed = -0.6
        emitter.particleColor = SKColor(red: 1.0, green: 0.84, blue: 0, alpha: 1.0)
        emitter.particleColorBlendFactor = 1.0
        emitter.particleAlpha = 1.0
        emitter.particleAlphaSpeed = -2.0
        emitter.particleBlendMode = .add
        return emitter
    }
}
```

### Explosion Effect

```swift
extension SKEmitterNode {
    static func explosionEmitter(size: ParticleManager.ExplosionSize = .medium) -> SKEmitterNode {
        let emitter = SKEmitterNode()
        emitter.particleTexture = SKTexture(imageNamed: "smoke")

        let (particleCount, baseSpeed, lifetime): (Int, CGFloat, CGFloat) = {
            switch size {
            case .small: return (30, 200, 0.4)
            case .medium: return (50, 300, 0.6)
            case .large: return (80, 400, 0.8)
            }
        }()

        emitter.numParticlesToEmit = particleCount
        emitter.particleBirthRate = 5000
        emitter.particleLifetime = lifetime
        emitter.particleLifetimeRange = lifetime * 0.3
        emitter.particlePositionRange = CGVector(dx: 5, dy: 5)
        emitter.particleSpeed = baseSpeed
        emitter.particleSpeedRange = baseSpeed * 0.5
        emitter.emissionAngleRange = .pi * 2
        emitter.yAcceleration = 20
        emitter.particleScale = 0.5
        emitter.particleScaleRange = 0.2
        emitter.particleScaleSpeed = 1.5
        emitter.particleColorBlendFactor = 1.0
        emitter.particleColorSequence = SKKeyframeSequence(
            keyframeValues: [SKColor.white, .yellow, .orange, SKColor(red: 0.7, green: 0, blue: 0, alpha: 1), .black],
            times: [0, 0.1, 0.3, 0.6, 1.0]
        )
        emitter.particleAlpha = 1.0
        emitter.particleBlendMode = .add
        emitter.particleRotationRange = .pi * 2
        emitter.particleRotationSpeed = .pi / 4
        return emitter
    }
}
```

### Confetti Effect

```swift
extension SKEmitterNode {
    static func confettiEmitter() -> SKEmitterNode {
        let emitter = SKEmitterNode()
        emitter.particleTexture = SKTexture(imageNamed: "confetti")
        emitter.numParticlesToEmit = 60
        emitter.particleBirthRate = 300
        emitter.particleLifetime = 2.5
        emitter.particleLifetimeRange = 1.0
        emitter.particlePositionRange = CGVector(dx: 100, dy: 20)
        emitter.particleSpeed = 200
        emitter.particleSpeedRange = 100
        emitter.emissionAngle = .pi / 2
        emitter.emissionAngleRange = .pi / 4
        emitter.yAcceleration = -150
        emitter.particleScale = 0.3
        emitter.particleScaleRange = 0.1
        emitter.particleColorBlendFactor = 1.0
        emitter.particleColorRedRange = 0.5
        emitter.particleColorGreenRange = 0.5
        emitter.particleColorBlueRange = 0.5
        emitter.particleAlpha = 1.0
        emitter.particleAlphaSpeed = -0.3
        emitter.particleBlendMode = .alpha
        emitter.particleRotationRange = .pi * 2
        emitter.particleRotationSpeed = .pi * 1.5
        return emitter
    }
}
```

### Magic/Power-Up Effect

```swift
extension SKEmitterNode {
    static func magicEmitter(color: SKColor = .cyan) -> SKEmitterNode {
        let emitter = SKEmitterNode()
        emitter.particleTexture = SKTexture(imageNamed: "magic")
        emitter.particleBirthRate = 25
        emitter.numParticlesToEmit = 0
        emitter.particleLifetime = 0.8
        emitter.particleLifetimeRange = 0.2
        emitter.particlePositionRange = CGVector(dx: 40, dy: 40)
        emitter.particleSpeed = 30
        emitter.particleSpeedRange = 15
        emitter.emissionAngleRange = .pi * 2
        emitter.particleAction = SKAction.repeatForever(SKAction.rotate(byAngle: .pi * 2, duration: 2.0))
        emitter.particleScale = 0.4
        emitter.particleScaleRange = 0.15
        emitter.particleColor = color
        emitter.particleColorBlendFactor = 1.0
        emitter.particleAlpha = 0.8
        emitter.particleBlendMode = .add
        return emitter
    }
}
```

### Trail Effect

```swift
extension SKEmitterNode {
    static func trailEmitter(color: SKColor = .white) -> SKEmitterNode {
        let emitter = SKEmitterNode()
        emitter.particleTexture = SKTexture(imageNamed: "trail")
        emitter.particleBirthRate = 30
        emitter.numParticlesToEmit = 0
        emitter.particleLifetime = 0.3
        emitter.particleLifetimeRange = 0.05
        emitter.particlePositionRange = CGVector(dx: 2, dy: 2)
        emitter.particleSpeed = 5
        emitter.particleSpeedRange = 3
        emitter.emissionAngleRange = .pi * 2
        emitter.yAcceleration = 0
        emitter.particleScale = 0.6
        emitter.particleScaleSpeed = -1.5
        emitter.particleColor = color
        emitter.particleColorBlendFactor = 1.0
        emitter.particleAlpha = 0.9
        emitter.particleAlphaSpeed = -2.5
        emitter.particleBlendMode = .add
        return emitter
    }

    func attachTrail(to node: SKNode, in scene: SKScene) {
        targetNode = scene
        node.addChild(self)
    }
}
```

## Performance Monitor

```swift
class ParticlePerformanceMonitor {
    static let shared = ParticlePerformanceMonitor()

    private var frameCount: Int = 0
    private var particleCount: Int = 0
    private var lastReportTime: Date = Date()

    func update(scene: SKScene) {
        frameCount += 1
        if frameCount % 60 == 0 {
            particleCount = countParticles(in: scene)
            if particleCount > 400 {
                print("WARNING: Particle count \(particleCount) exceeds budget 400")
            }
        }
        if Date().timeIntervalSince(lastReportTime) >= 5.0 {
            print("Particles: \(particleCount), Emitters: \(countEmitters(in: scene))")
            lastReportTime = Date()
        }
    }

    private func countParticles(in node: SKNode) -> Int {
        var count = 0
        if let emitter = node as? SKEmitterNode {
            if emitter.numParticlesToEmit > 0 { count += emitter.numParticlesToEmit }
            else { count += Int(emitter.particleBirthRate * emitter.particleLifetime) }
        }
        for child in node.children { count += countParticles(in: child) }
        return count
    }

    private func countEmitters(in node: SKNode) -> Int {
        var count = node is SKEmitterNode ? 1 : 0
        for child in node.children { count += countEmitters(in: child) }
        return count
    }
}
```
