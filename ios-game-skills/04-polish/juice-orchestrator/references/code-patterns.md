# Juice Orchestrator Code Patterns

## JuiceOrchestrator Core Class

```swift
import Foundation
import SpriteKit
import CoreHaptics

final class JuiceOrchestrator {
    private let haptics: HapticManager
    private let audio: AudioManager
    private let particles: ParticleManager
    private let screenEffects: ScreenEffectManager
    private let animations: AnimationManager

    private var lastEventTimes: [JuiceEvent: TimeInterval] = [:]
    private var activeEffectCount: Int = 0
    private let maxConcurrentEffects: Int = 12

    init(scene: SKScene, camera: SKCameraNode) {
        self.haptics = HapticManager()
        self.audio = AudioManager()
        self.particles = ParticleManager(scene: scene)
        self.screenEffects = ScreenEffectManager(scene: scene, camera: camera)
        self.animations = AnimationManager()
    }

    func trigger(_ event: JuiceEvent, at position: CGPoint? = nil, intensity: Float = 1.0) {
        guard canTrigger(event) else { return }
        guard activeEffectCount < maxConcurrentEffects else { return }
        lastEventTimes[event] = CACurrentMediaTime()
        executeSequence(for: event, at: position, intensity: intensity)
    }

    private func canTrigger(_ event: JuiceEvent) -> Bool {
        guard let lastTime = lastEventTimes[event] else { return true }
        return CACurrentMediaTime() - lastTime >= event.minimumCooldown
    }

    private func executeSequence(for event: JuiceEvent, at position: CGPoint?, intensity: Float) {
        let sequence = event.feedbackSequence
        for step in sequence.steps {
            let delay = step.delay
            let scaledIntensity = step.intensity * intensity
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
                self?.executeStep(step, at: position, intensity: scaledIntensity)
            }
        }
    }

    private func executeStep(_ step: FeedbackStep, at position: CGPoint?, intensity: Float) {
        activeEffectCount += 1
        defer {
            DispatchQueue.main.asyncAfter(deadline: .now() + step.duration) { [weak self] in
                self?.activeEffectCount -= 1
            }
        }

        switch step.type {
        case .haptic(let style): haptics.trigger(style, intensity: intensity)
        case .sound(let name): audio.play(name, volume: intensity)
        case .particle(let effect):
            if let pos = position { particles.spawn(effect, at: pos, intensity: intensity) }
        case .screenShake(let magnitude):
            screenEffects.shake(magnitude: magnitude * CGFloat(intensity))
        case .flash(let color, let opacity):
            screenEffects.flash(color: color, opacity: opacity * CGFloat(intensity))
        case .hitstop(let frames):
            screenEffects.hitstop(frames: Int(Float(frames) * intensity))
        case .cameraZoom(let scale):
            let scaledZoom = 1.0 + (scale - 1.0) * CGFloat(intensity)
            screenEffects.zoom(to: scaledZoom)
        case .animation(let name): animations.play(name, intensity: intensity)
        }
    }

    func update(deltaTime: TimeInterval) {
        particles.update(deltaTime: deltaTime)
        screenEffects.update(deltaTime: deltaTime)
    }
}
```

## Feedback Sequence Definitions

```swift
struct FeedbackSequence {
    let steps: [FeedbackStep]

    static let coinCollect = FeedbackSequence(steps: [
        FeedbackStep(type: .haptic(.light), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .sound("coin_collect"), delay: 0.005, duration: 0.2, intensity: 1.0),
        FeedbackStep(type: .animation("item_scale_up"), delay: 0.01, duration: 0.05, intensity: 1.0),
        FeedbackStep(type: .particle(.sparkles), delay: 0.03, duration: 0.3, intensity: 1.0),
        FeedbackStep(type: .animation("fly_to_counter"), delay: 0.06, duration: 0.2, intensity: 1.0)
    ])

    static let enemyDefeated = FeedbackSequence(steps: [
        FeedbackStep(type: .hitstop(10), delay: 0, duration: 0.167, intensity: 1.0),
        FeedbackStep(type: .haptic(.medium), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .flash(.white, 0.7), delay: 0, duration: 0.08, intensity: 1.0),
        FeedbackStep(type: .sound("enemy_defeat"), delay: 0.01, duration: 0.3, intensity: 1.0),
        FeedbackStep(type: .screenShake(3), delay: 0.01, duration: 0.15, intensity: 1.0),
        FeedbackStep(type: .particle(.explosion), delay: 0.05, duration: 0.5, intensity: 1.0),
        FeedbackStep(type: .animation("enemy_death"), delay: 0.1, duration: 0.3, intensity: 1.0)
    ])

    static func damageTaken(severity: Float) -> FeedbackSequence {
        let hitstopFrames = Int(4 + severity * 8)
        let shakeIntensity = 4 + severity * 8
        return FeedbackSequence(steps: [
            FeedbackStep(type: .hitstop(hitstopFrames), delay: 0, duration: Double(hitstopFrames) / 60, intensity: 1.0),
            FeedbackStep(type: .haptic(.heavy), delay: 0, duration: 0.01, intensity: severity),
            FeedbackStep(type: .flash(.red, 0.4), delay: 0, duration: 0.1, intensity: severity),
            FeedbackStep(type: .sound("damage_taken"), delay: 0.01, duration: 0.2, intensity: severity),
            FeedbackStep(type: .screenShake(shakeIntensity), delay: 0.02, duration: 0.2, intensity: severity),
            FeedbackStep(type: .cameraZoom(1.02), delay: 0.05, duration: 0.15, intensity: severity)
        ])
    }

    static let bossDefeated = FeedbackSequence(steps: [
        FeedbackStep(type: .hitstop(25), delay: 0, duration: 0.417, intensity: 1.0),
        FeedbackStep(type: .haptic(.heavy), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .flash(.white, 0.8), delay: 0, duration: 0.15, intensity: 1.0),
        FeedbackStep(type: .screenShake(15), delay: 0.05, duration: 0.5, intensity: 1.0),
        FeedbackStep(type: .sound("boss_defeat"), delay: 0.1, duration: 3.0, intensity: 1.0),
        FeedbackStep(type: .particle(.massiveExplosion), delay: 0.2, duration: 1.0, intensity: 1.0),
        FeedbackStep(type: .cameraZoom(1.15), delay: 0.3, duration: 0.5, intensity: 1.0),
        FeedbackStep(type: .particle(.secondaryExplosions), delay: 1.0, duration: 0.5, intensity: 1.0)
    ])
}

struct FeedbackStep {
    let type: FeedbackType
    let delay: TimeInterval
    let duration: TimeInterval
    let intensity: Float
}

enum FeedbackType {
    case haptic(HapticStyle)
    case sound(String)
    case particle(ParticleEffect)
    case screenShake(CGFloat)
    case flash(SKColor, CGFloat)
    case hitstop(Int)
    case cameraZoom(CGFloat)
    case animation(String)
}
```

## Event Priority System

```swift
final class JuicePriorityManager {
    enum Priority: Int, Comparable {
        case low = 0, normal = 1, high = 2, critical = 3
        static func < (lhs: Priority, rhs: Priority) -> Bool { lhs.rawValue < rhs.rawValue }
    }

    struct QueuedEvent {
        let event: JuiceEvent
        let priority: Priority
        let timestamp: TimeInterval
        let position: CGPoint?
        let intensity: Float
    }

    private var currentPriority: Priority = .low
    private var currentEventEndTime: TimeInterval = 0
    private var eventQueue: [QueuedEvent] = []
    private let maxQueueSize = 5

    func shouldExecute(_ event: JuiceEvent, priority: Priority) -> Bool {
        let now = CACurrentMediaTime()
        if now >= currentEventEndTime { currentPriority = .low }
        if priority >= currentPriority { return true }
        queueEvent(event, priority: priority)
        return false
    }

    func markEventStart(_ event: JuiceEvent, priority: Priority, duration: TimeInterval) {
        currentPriority = priority
        currentEventEndTime = CACurrentMediaTime() + duration
    }

    func processQueue() -> QueuedEvent? {
        let now = CACurrentMediaTime()
        guard now >= currentEventEndTime, !eventQueue.isEmpty else { return nil }
        eventQueue.sort { $0.priority > $1.priority || ($0.priority == $1.priority && $0.timestamp < $1.timestamp) }
        return eventQueue.removeFirst()
    }
}
```

## Fatigue Prevention Controller

```swift
final class FatiguePrevention {
    private let hapticRateLimit: Int = 10
    private let soundOverlapLimit: Int = 8
    private let particleBudget: Int = 500
    private let minEventCooldown: TimeInterval = 0.05

    private var hapticCount: Int = 0
    private var hapticWindowStart: TimeInterval = 0
    private var activeSoundCount: Int = 0
    private var activeParticleCount: Int = 0
    private var lastEventTimes: [String: TimeInterval] = [:]

    func canTriggerHaptic() -> Bool {
        let now = CACurrentMediaTime()
        if now - hapticWindowStart >= 1.0 { hapticCount = 0; hapticWindowStart = now }
        return hapticCount < hapticRateLimit
    }

    func recordHaptic() { hapticCount += 1 }
    func canPlaySound() -> Bool { activeSoundCount < soundOverlapLimit }
    func recordSoundStart() { activeSoundCount += 1 }
    func recordSoundEnd() { activeSoundCount = max(0, activeSoundCount - 1) }
    func canSpawnParticles(count: Int) -> Bool { activeParticleCount + count <= particleBudget }

    func scaledIntensity(for event: JuiceEvent, baseIntensity: Float) -> Float {
        let recentEventCount = lastEventTimes.values.filter { CACurrentMediaTime() - $0 <= 0.5 }.count
        if recentEventCount > 10 { return baseIntensity * 0.5 }
        else if recentEventCount > 5 { return baseIntensity * 0.75 }
        return baseIntensity
    }
}
```
