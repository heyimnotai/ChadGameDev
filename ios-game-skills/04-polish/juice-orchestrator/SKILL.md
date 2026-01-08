---
name: juice-orchestrator
description: Coordinate multiple feedback systems (animation, sound, haptic, particle, screen effects) for maximum impact in iOS games. Use when implementing complete feedback sequences for game events, balancing feedback intensity across systems, or preventing feedback fatigue. This is the master coordination skill for all polish systems - invoke after individual polish systems are implemented to ensure cohesive multi-sensory feedback.
---

# Juice Orchestrator

## Purpose

This skill enables coordination of all game feedback systems into cohesive, impactful moments that create memorable player experiences. "Juice" is the sum of animation, sound, haptics, particles, and screen effects working together. An agent with this skill can design and implement complete feedback sequences that layer effects in precise timing, scale intensity appropriately, prevent sensory overload, and maintain performance budgets across all systems.

## Domain Boundaries

**This skill handles:**
- Multi-system feedback sequence design and timing
- Event-to-feedback mapping for all game events
- Feedback intensity scaling (minor to major events)
- Feedback fatigue prevention through cooldowns and caps
- Performance budgeting across simultaneous effects
- Centralized feedback orchestration implementation
- Priority systems for overlapping events
- Complete feedback templates for common game events

**This skill does NOT handle:**
- Individual system implementation (delegates to specialized skills):
  - Animation timing (see `animation-system`)
  - Sound design (see `audio-designer`)
  - Haptic patterns (see `haptic-optimizer`)
  - Particle systems (see `particle-effects`)
  - Screen effects (see `screen-shake-impact`)
  - UI transitions (see `ui-transitions`)

---

## Core Specifications

### Feedback Layer Timing (Relative to Event Trigger at T+0)

| Layer | Offset | Duration | Priority |
|-------|--------|----------|----------|
| **Haptic** | T+0ms | Instant | 1 (first) |
| **Sound** | T+5-15ms | Varies | 2 |
| **Visual Flash** | T+0-10ms | 50-150ms | 3 |
| **Animation Start** | T+0-20ms | Varies | 4 |
| **Particle Spawn** | T+20-50ms | 200-2000ms | 5 |
| **Screen Shake** | T+0-30ms | 100-600ms | 6 |
| **UI Update** | T+50-200ms | 200-500ms | 7 (last) |

### Feedback Intensity Tiers

| Tier | Name | Use Case | Layer Count | Max Duration |
|------|------|----------|-------------|--------------|
| **1** | Micro | UI taps, minor collisions | 1-2 layers | 100ms |
| **2** | Small | Coin pickup, basic hits | 2-3 layers | 300ms |
| **3** | Medium | Enemy defeat, combo milestone | 3-4 layers | 500ms |
| **4** | Large | Level complete, achievement | 4-5 layers | 1000ms |
| **5** | Epic | Boss defeat, new high score | All layers | 2000ms+ |

### Feedback Fatigue Prevention

| Mechanism | Threshold | Cooldown |
|-----------|-----------|----------|
| **Same Event Cooldown** | Any repeat | 50-100ms minimum |
| **Haptic Rate Limit** | 10/second max | 100ms forced gap |
| **Sound Overlap Limit** | 8 simultaneous | Oldest dropped |
| **Particle Budget** | 500 total active | New effects throttled |
| **Screen Shake Cap** | Trauma 1.0 max | Additive capped |

### Performance Budget Per Frame

| System | Target Budget | Max Budget |
|--------|---------------|------------|
| **Haptic Trigger** | 0.1ms | 0.5ms |
| **Audio Mix** | 1.0ms | 2.0ms |
| **Particle Update** | 2.0ms | 4.0ms |
| **Screen Shake Calc** | 0.3ms | 0.5ms |
| **Total Juice** | 5.0ms | 8.0ms |

---

## Event-to-Feedback Mappings

### Tier 1: Micro Feedback

**UI Button Tap**
| Layer | Specification |
|-------|--------------|
| Haptic | Light impact |
| Sound | Soft click, 20ms |
| Animation | Scale 0.95x, 100ms |

**Menu Selection Change**
| Layer | Specification |
|-------|--------------|
| Haptic | Selection tick |
| Sound | Subtle tick, 15ms |
| Animation | Opacity pulse |

---

### Tier 2: Small Feedback

**Collect Coin/Common Item**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Light impact |
| T+5ms | Sound | Coin chime, 100-200ms |
| T+10ms | Animation | Item scales up 1.3x over 50ms |
| T+30ms | Particle | 5-10 sparkles, burst |
| T+60ms | Animation | Item flies to counter, 200ms ease-in-out |
| T+260ms | UI | Score increment animation, 300ms |

**Basic Enemy Hit**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Light impact |
| T+0ms | Flash | White sprite flash, 50ms |
| T+5ms | Sound | Hit sound, 80ms |
| T+10ms | Animation | Enemy knockback/flinch |
| T+20ms | Particle | 3-5 impact sparks |

**Player Jump**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Animation | Squash 1.2x/0.8y, 50ms |
| T+0ms | Haptic | Soft impact |
| T+10ms | Sound | Jump sound, 150ms |
| T+30ms | Particle | 2-3 dust puffs at feet |
| T+50ms | Animation | Stretch 0.8x/1.2y (during rise) |

---

### Tier 3: Medium Feedback

**Enemy Defeated**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 8-12 frames (133-200ms) |
| T+0ms | Haptic | Medium impact |
| T+0ms | Flash | White flash on enemy, 80ms |
| T+10ms | Sound | Defeat sound, 300ms |
| T+10ms | Screen Shake | Light (3px, 0.15s) |
| T+50ms | Particle | 15-25 explosion particles |
| T+100ms | Animation | Enemy death animation |
| T+150ms | Spawn | XP/loot drops with arcs |
| T+300ms | UI | Score popup at enemy position |

**Combo Milestone (5x, 10x, etc.)**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Medium impact |
| T+0ms | Flash | Color flash (tier color), 100ms |
| T+10ms | Sound | Combo sound (pitch increases with tier) |
| T+30ms | Particle | Ring burst, 20 particles |
| T+50ms | UI | Combo counter pulse scale 1.2x |
| T+50ms | Screen Shake | Light (2px, 0.1s) |

**Damage Taken**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 4-8 frames (66-133ms) |
| T+0ms | Haptic | Heavy impact |
| T+0ms | Flash | Red screen flash, 0.4 opacity, 100ms |
| T+10ms | Sound | Damage sound, 200ms |
| T+20ms | Screen Shake | Medium (6px, 0.2s) |
| T+20ms | Animation | Player knockback/flinch |
| T+50ms | UI | Health bar pulse red |
| T+100ms | Camera | Subtle zoom in 1.02x, 150ms |

---

### Tier 4: Large Feedback

**Level Complete**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Success notification |
| T+0ms | Sound | Victory fanfare start |
| T+100ms | Camera | Slow zoom to player, 500ms |
| T+200ms | Particle | Confetti burst, 50 particles |
| T+300ms | Animation | Player victory pose |
| T+500ms | UI | "Level Complete" banner slides in |
| T+700ms | UI | Star rating reveal (staggered) |
| T+1000ms | UI | Score tally begins (rolling numbers) |
| T+1500ms | UI | Rewards reveal (staggered cards) |

**Achievement Unlock**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Success notification |
| T+0ms | Sound | Achievement unlock sound |
| T+50ms | Animation | Achievement badge scales from 0 |
| T+100ms | Particle | Sparkle ring around badge |
| T+200ms | UI | Badge settles with spring |
| T+300ms | UI | Achievement title fades in |
| T+500ms | UI | Description appears |
| T+1500ms | Animation | Badge slides to corner/collection |

**Purchase Complete**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Success notification |
| T+0ms | Sound | Purchase confirm sound |
| T+50ms | Animation | Item reveal with scale bounce |
| T+100ms | Particle | Value sparkles on item |
| T+200ms | UI | "Purchase Complete" text |
| T+300ms | Animation | Item flies to inventory |
| T+500ms | UI | Inventory pulse to show addition |

---

### Tier 5: Epic Feedback

**Boss Defeated**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 20-30 frames (333-500ms) |
| T+0ms | Haptic | Heavy impact sequence |
| T+0ms | Flash | White screen flash, 0.8 opacity |
| T+50ms | Screen Shake | Heavy (15px, 0.5s) |
| T+100ms | Sound | Boss defeat fanfare |
| T+200ms | Particle | Massive explosion, 100+ particles |
| T+300ms | Camera | Zoom in on boss, 500ms |
| T+500ms | Animation | Boss death sequence |
| T+800ms | Slow Motion | 0.3x speed for 1 second |
| T+1000ms | Particle | Secondary explosions |
| T+1500ms | Camera | Pan to player |
| T+2000ms | UI | Victory sequence begins |

**New High Score**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Success notification |
| T+0ms | Sound | High score fanfare |
| T+100ms | Flash | Gold flash, 150ms |
| T+200ms | Particle | Gold confetti continuous |
| T+300ms | Animation | Score counter rapid count-up |
| T+500ms | Screen Shake | Light celebration (3px, 0.3s) |
| T+800ms | UI | "NEW HIGH SCORE!" banner |
| T+1000ms | Animation | Crown/medal stamp on score |
| T+1200ms | Particle | Fireworks burst |
| T+2000ms | UI | Share prompt appears |

**Game Over**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 15-20 frames |
| T+0ms | Haptic | Heavy impact |
| T+0ms | Flash | Red flash, 0.6 opacity |
| T+50ms | Sound | Failure sound |
| T+100ms | Screen Shake | Heavy (12px, 0.4s) |
| T+200ms | Animation | Player death animation |
| T+300ms | Color | Desaturate screen over 500ms |
| T+500ms | Audio | Music fade out, 1000ms |
| T+1000ms | UI | "Game Over" text fades in |
| T+1500ms | UI | Final score display |
| T+2000ms | UI | Retry/menu buttons appear |

---

## Implementation Patterns

### JuiceOrchestrator Core Class

```swift
import Foundation
import SpriteKit
import CoreHaptics

/// Central coordinator for all game feedback systems
final class JuiceOrchestrator {

    // MARK: - Subsystems

    private let haptics: HapticManager
    private let audio: AudioManager
    private let particles: ParticleManager
    private let screenEffects: ScreenEffectManager
    private let animations: AnimationManager

    // MARK: - Rate Limiting

    private var lastEventTimes: [JuiceEvent: TimeInterval] = [:]
    private var activeEffectCount: Int = 0
    private let maxConcurrentEffects: Int = 12

    // MARK: - Performance Tracking

    private var frameJuiceBudget: TimeInterval = 0.005 // 5ms per frame
    private var currentFrameTime: TimeInterval = 0

    // MARK: - Initialization

    init(scene: SKScene, camera: SKCameraNode) {
        self.haptics = HapticManager()
        self.audio = AudioManager()
        self.particles = ParticleManager(scene: scene)
        self.screenEffects = ScreenEffectManager(scene: scene, camera: camera)
        self.animations = AnimationManager()
    }

    // MARK: - Event Triggering

    func trigger(_ event: JuiceEvent, at position: CGPoint? = nil, intensity: Float = 1.0) {
        // Rate limiting check
        guard canTrigger(event) else { return }

        // Budget check
        guard activeEffectCount < maxConcurrentEffects else { return }

        // Mark event time
        lastEventTimes[event] = CACurrentMediaTime()

        // Execute event sequence
        executeSequence(for: event, at: position, intensity: intensity)
    }

    private func canTrigger(_ event: JuiceEvent) -> Bool {
        guard let lastTime = lastEventTimes[event] else { return true }

        let elapsed = CACurrentMediaTime() - lastTime
        return elapsed >= event.minimumCooldown
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
        case .haptic(let style):
            haptics.trigger(style, intensity: intensity)

        case .sound(let name):
            audio.play(name, volume: intensity)

        case .particle(let effect):
            if let pos = position {
                particles.spawn(effect, at: pos, intensity: intensity)
            }

        case .screenShake(let magnitude):
            screenEffects.shake(magnitude: magnitude * CGFloat(intensity))

        case .flash(let color, let opacity):
            screenEffects.flash(color: color, opacity: opacity * CGFloat(intensity))

        case .hitstop(let frames):
            screenEffects.hitstop(frames: Int(Float(frames) * intensity))

        case .cameraZoom(let scale):
            let scaledZoom = 1.0 + (scale - 1.0) * CGFloat(intensity)
            screenEffects.zoom(to: scaledZoom)

        case .animation(let name):
            animations.play(name, intensity: intensity)
        }
    }

    // MARK: - Update

    func update(deltaTime: TimeInterval) {
        particles.update(deltaTime: deltaTime)
        screenEffects.update(deltaTime: deltaTime)
    }
}

// MARK: - Event Definitions

enum JuiceEvent: Hashable {
    // Tier 1: Micro
    case buttonTap
    case menuSelect

    // Tier 2: Small
    case collectCoin
    case collectItem(rarity: ItemRarity)
    case basicHit
    case playerJump
    case playerLand

    // Tier 3: Medium
    case enemyDefeated
    case comboMilestone(count: Int)
    case damageTaken(severity: Float)
    case obstacleDestroyed

    // Tier 4: Large
    case levelComplete(stars: Int)
    case achievementUnlock
    case purchaseComplete
    case streakMilestone

    // Tier 5: Epic
    case bossDefeated
    case newHighScore
    case gameOver
    case rareItemFound

    var minimumCooldown: TimeInterval {
        switch self {
        case .buttonTap, .menuSelect:
            return 0.05
        case .collectCoin, .basicHit:
            return 0.08
        case .playerJump, .playerLand:
            return 0.1
        case .enemyDefeated, .comboMilestone:
            return 0.15
        case .damageTaken:
            return 0.2
        default:
            return 0.3
        }
    }

    var feedbackSequence: FeedbackSequence {
        switch self {
        case .collectCoin:
            return .coinCollect
        case .basicHit:
            return .basicHit
        case .enemyDefeated:
            return .enemyDefeated
        case .damageTaken(let severity):
            return .damageTaken(severity: severity)
        case .levelComplete(let stars):
            return .levelComplete(stars: stars)
        case .bossDefeated:
            return .bossDefeated
        case .newHighScore:
            return .newHighScore
        case .gameOver:
            return .gameOver
        default:
            return .minimal
        }
    }
}

enum ItemRarity {
    case common, uncommon, rare, epic, legendary
}
```

### Feedback Sequence Definitions

```swift
import SpriteKit

struct FeedbackSequence {
    let steps: [FeedbackStep]

    // MARK: - Tier 2: Small

    static let coinCollect = FeedbackSequence(steps: [
        FeedbackStep(type: .haptic(.light), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .sound("coin_collect"), delay: 0.005, duration: 0.2, intensity: 1.0),
        FeedbackStep(type: .animation("item_scale_up"), delay: 0.01, duration: 0.05, intensity: 1.0),
        FeedbackStep(type: .particle(.sparkles), delay: 0.03, duration: 0.3, intensity: 1.0),
        FeedbackStep(type: .animation("fly_to_counter"), delay: 0.06, duration: 0.2, intensity: 1.0)
    ])

    static let basicHit = FeedbackSequence(steps: [
        FeedbackStep(type: .haptic(.light), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .flash(.white, 0.6), delay: 0, duration: 0.05, intensity: 1.0),
        FeedbackStep(type: .sound("hit_basic"), delay: 0.005, duration: 0.08, intensity: 1.0),
        FeedbackStep(type: .particle(.impactSparks), delay: 0.02, duration: 0.2, intensity: 1.0)
    ])

    // MARK: - Tier 3: Medium

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

    // MARK: - Tier 4: Large

    static func levelComplete(stars: Int) -> FeedbackSequence {
        var steps: [FeedbackStep] = [
            FeedbackStep(type: .haptic(.success), delay: 0, duration: 0.01, intensity: 1.0),
            FeedbackStep(type: .sound("victory_fanfare"), delay: 0, duration: 2.0, intensity: 1.0),
            FeedbackStep(type: .cameraZoom(1.1), delay: 0.1, duration: 0.5, intensity: 1.0),
            FeedbackStep(type: .particle(.confetti), delay: 0.2, duration: 1.5, intensity: 1.0),
            FeedbackStep(type: .animation("victory_pose"), delay: 0.3, duration: 0.5, intensity: 1.0)
        ]

        // Staggered star reveals
        for i in 0..<stars {
            let starDelay = 0.7 + Double(i) * 0.15
            steps.append(FeedbackStep(type: .sound("star_appear"), delay: starDelay, duration: 0.1, intensity: 1.0))
            steps.append(FeedbackStep(type: .haptic(.light), delay: starDelay, duration: 0.01, intensity: 1.0))
        }

        return FeedbackSequence(steps: steps)
    }

    // MARK: - Tier 5: Epic

    static let bossDefeated = FeedbackSequence(steps: [
        FeedbackStep(type: .hitstop(25), delay: 0, duration: 0.417, intensity: 1.0),
        FeedbackStep(type: .haptic(.heavy), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .flash(.white, 0.8), delay: 0, duration: 0.15, intensity: 1.0),
        FeedbackStep(type: .screenShake(15), delay: 0.05, duration: 0.5, intensity: 1.0),
        FeedbackStep(type: .sound("boss_defeat"), delay: 0.1, duration: 3.0, intensity: 1.0),
        FeedbackStep(type: .particle(.massiveExplosion), delay: 0.2, duration: 1.0, intensity: 1.0),
        FeedbackStep(type: .cameraZoom(1.15), delay: 0.3, duration: 0.5, intensity: 1.0),
        // Slow motion effect handled separately
        FeedbackStep(type: .particle(.secondaryExplosions), delay: 1.0, duration: 0.5, intensity: 1.0),
        FeedbackStep(type: .cameraZoom(1.0), delay: 1.5, duration: 0.5, intensity: 1.0)
    ])

    static let newHighScore = FeedbackSequence(steps: [
        FeedbackStep(type: .haptic(.success), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .sound("high_score_fanfare"), delay: 0, duration: 2.5, intensity: 1.0),
        FeedbackStep(type: .flash(.yellow, 0.6), delay: 0.1, duration: 0.15, intensity: 1.0),
        FeedbackStep(type: .particle(.goldConfetti), delay: 0.2, duration: 2.0, intensity: 1.0),
        FeedbackStep(type: .screenShake(3), delay: 0.5, duration: 0.3, intensity: 1.0),
        FeedbackStep(type: .particle(.fireworks), delay: 1.2, duration: 1.5, intensity: 1.0)
    ])

    static let gameOver = FeedbackSequence(steps: [
        FeedbackStep(type: .hitstop(18), delay: 0, duration: 0.3, intensity: 1.0),
        FeedbackStep(type: .haptic(.heavy), delay: 0, duration: 0.01, intensity: 1.0),
        FeedbackStep(type: .flash(.red, 0.6), delay: 0, duration: 0.15, intensity: 1.0),
        FeedbackStep(type: .sound("game_over"), delay: 0.05, duration: 1.5, intensity: 1.0),
        FeedbackStep(type: .screenShake(12), delay: 0.1, duration: 0.4, intensity: 1.0),
        FeedbackStep(type: .animation("player_death"), delay: 0.2, duration: 0.5, intensity: 1.0)
        // Desaturation handled by screen effects manager
    ])

    // MARK: - Minimal (fallback)

    static let minimal = FeedbackSequence(steps: [
        FeedbackStep(type: .haptic(.light), delay: 0, duration: 0.01, intensity: 1.0)
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

enum HapticStyle {
    case light, medium, heavy, soft, rigid
    case success, warning, error
    case selection
}

enum ParticleEffect: String {
    case sparkles
    case impactSparks
    case explosion
    case massiveExplosion
    case secondaryExplosions
    case confetti
    case goldConfetti
    case fireworks
    case dustPuff
}
```

### Event Priority System

```swift
import Foundation

/// Manages event priorities to prevent feedback collision
final class JuicePriorityManager {

    enum Priority: Int, Comparable {
        case low = 0        // Ambient, decoration
        case normal = 1     // Standard gameplay
        case high = 2       // Important events
        case critical = 3   // Cannot be interrupted

        static func < (lhs: Priority, rhs: Priority) -> Bool {
            lhs.rawValue < rhs.rawValue
        }
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

        // Current event finished
        if now >= currentEventEndTime {
            currentPriority = .low
        }

        // Higher or equal priority can execute
        if priority >= currentPriority {
            return true
        }

        // Lower priority gets queued
        queueEvent(event, priority: priority)
        return false
    }

    func markEventStart(_ event: JuiceEvent, priority: Priority, duration: TimeInterval) {
        currentPriority = priority
        currentEventEndTime = CACurrentMediaTime() + duration
    }

    private func queueEvent(_ event: JuiceEvent, priority: Priority, position: CGPoint? = nil, intensity: Float = 1.0) {
        guard eventQueue.count < maxQueueSize else { return }

        let queued = QueuedEvent(
            event: event,
            priority: priority,
            timestamp: CACurrentMediaTime(),
            position: position,
            intensity: intensity
        )
        eventQueue.append(queued)
    }

    func processQueue() -> QueuedEvent? {
        let now = CACurrentMediaTime()

        guard now >= currentEventEndTime else { return nil }
        guard !eventQueue.isEmpty else { return nil }

        // Sort by priority, then timestamp
        eventQueue.sort { a, b in
            if a.priority != b.priority {
                return a.priority > b.priority
            }
            return a.timestamp < b.timestamp
        }

        return eventQueue.removeFirst()
    }
}
```

### Fatigue Prevention Controller

```swift
import Foundation

/// Prevents feedback overload through rate limiting and cooldowns
final class FatiguePrevention {

    // MARK: - Configuration

    private let hapticRateLimit: Int = 10  // Max per second
    private let soundOverlapLimit: Int = 8
    private let particleBudget: Int = 500
    private let minEventCooldown: TimeInterval = 0.05

    // MARK: - Tracking

    private var hapticCount: Int = 0
    private var hapticWindowStart: TimeInterval = 0
    private var activeSoundCount: Int = 0
    private var activeParticleCount: Int = 0
    private var lastEventTimes: [String: TimeInterval] = [:]

    // MARK: - Rate Checking

    func canTriggerHaptic() -> Bool {
        let now = CACurrentMediaTime()

        // Reset window if needed
        if now - hapticWindowStart >= 1.0 {
            hapticCount = 0
            hapticWindowStart = now
        }

        return hapticCount < hapticRateLimit
    }

    func recordHaptic() {
        hapticCount += 1
    }

    func canPlaySound() -> Bool {
        return activeSoundCount < soundOverlapLimit
    }

    func recordSoundStart() {
        activeSoundCount += 1
    }

    func recordSoundEnd() {
        activeSoundCount = max(0, activeSoundCount - 1)
    }

    func canSpawnParticles(count: Int) -> Bool {
        return activeParticleCount + count <= particleBudget
    }

    func recordParticleSpawn(count: Int) {
        activeParticleCount += count
    }

    func recordParticleDespawn(count: Int) {
        activeParticleCount = max(0, activeParticleCount - count)
    }

    func canTriggerEvent(_ eventKey: String) -> Bool {
        guard let lastTime = lastEventTimes[eventKey] else { return true }
        return CACurrentMediaTime() - lastTime >= minEventCooldown
    }

    func recordEvent(_ eventKey: String) {
        lastEventTimes[eventKey] = CACurrentMediaTime()
    }

    // MARK: - Intensity Scaling

    /// Scale intensity based on recent activity to prevent overwhelming feedback
    func scaledIntensity(for event: JuiceEvent, baseIntensity: Float) -> Float {
        let recentEventCount = countRecentEvents(within: 0.5)

        if recentEventCount > 10 {
            return baseIntensity * 0.5  // Heavy reduction
        } else if recentEventCount > 5 {
            return baseIntensity * 0.75 // Moderate reduction
        }

        return baseIntensity
    }

    private func countRecentEvents(within window: TimeInterval) -> Int {
        let now = CACurrentMediaTime()
        return lastEventTimes.values.filter { now - $0 <= window }.count
    }
}
```

### Performance Budgeting

```swift
import Foundation

/// Monitors and manages performance budget for juice systems
final class JuicePerformanceMonitor {

    // MARK: - Budget Configuration (in seconds)

    private let hapticBudget: TimeInterval = 0.0005   // 0.5ms
    private let audioBudget: TimeInterval = 0.002     // 2ms
    private let particleBudget: TimeInterval = 0.004  // 4ms
    private let shakeBudget: TimeInterval = 0.0005    // 0.5ms
    private let totalBudget: TimeInterval = 0.008     // 8ms total

    // MARK: - Tracking

    private var currentFrameTime: [JuiceSystem: TimeInterval] = [:]
    private var frameStartTime: TimeInterval = 0
    private var warningThreshold: Float = 0.8  // Warn at 80% budget

    enum JuiceSystem: String, CaseIterable {
        case haptic
        case audio
        case particle
        case shake
    }

    // MARK: - Frame Management

    func beginFrame() {
        frameStartTime = CACurrentMediaTime()
        currentFrameTime.removeAll()
    }

    func recordTime(for system: JuiceSystem, time: TimeInterval) {
        currentFrameTime[system, default: 0] += time
    }

    func endFrame() -> PerformanceReport {
        let totalTime = JuiceSystem.allCases.reduce(0) { $0 + (currentFrameTime[$1] ?? 0) }

        var overBudget: [JuiceSystem] = []

        for system in JuiceSystem.allCases {
            let time = currentFrameTime[system] ?? 0
            let budget = budgetFor(system)

            if time > budget {
                overBudget.append(system)
            }
        }

        return PerformanceReport(
            totalTime: totalTime,
            isOverBudget: totalTime > totalBudget,
            overBudgetSystems: overBudget,
            budgetUsage: Float(totalTime / totalBudget)
        )
    }

    private func budgetFor(_ system: JuiceSystem) -> TimeInterval {
        switch system {
        case .haptic: return hapticBudget
        case .audio: return audioBudget
        case .particle: return particleBudget
        case .shake: return shakeBudget
        }
    }

    struct PerformanceReport {
        let totalTime: TimeInterval
        let isOverBudget: Bool
        let overBudgetSystems: [JuiceSystem]
        let budgetUsage: Float

        var shouldThrottle: Bool {
            budgetUsage > 0.9
        }
    }
}
```

---

## Decision Trees

### Selecting Feedback Intensity Tier

```
What type of event occurred?
├── UI interaction (tap, select)?
│   └── Tier 1: Micro (1-2 layers, 100ms)
├── Common gameplay action (collect, hit, jump)?
│   └── Tier 2: Small (2-3 layers, 300ms)
├── Significant moment (defeat, milestone, damage)?
│   └── Tier 3: Medium (3-4 layers, 500ms)
├── Major achievement (level, unlock, purchase)?
│   └── Tier 4: Large (4-5 layers, 1000ms)
└── Climactic moment (boss, high score, game end)?
    └── Tier 5: Epic (all layers, 2000ms+)
```

### Layer Selection for Event

```
For this event, which layers to include?

Always include for ANY event:
└── Haptic (appropriate intensity)

Add for gameplay events:
├── Sound effect
└── Animation response

Add for rewarding events:
├── Particle burst
└── UI celebration

Add for impactful events:
├── Screen shake
├── Flash effect
└── Hitstop (combat only)

Add for major events:
├── Camera effects (zoom/punch)
├── Extended sequences
└── Multiple particle waves
```

### Timing Layer Coordination

```
What should fire first?
├── Physical feedback (what player feels)
│   └── Haptic at T+0ms (always first)
├── Auditory feedback (what player hears)
│   └── Sound at T+5-15ms (slight delay acceptable)
├── Immediate visual (highlight the moment)
│   └── Flash/animation at T+0-20ms
├── Effect visuals (consequence)
│   └── Particles at T+20-50ms
├── Camera response (emphasis)
│   └── Shake/zoom at T+0-30ms
└── UI update (information)
    └── Score/counter at T+50-200ms (always last)
```

### Handling Overlapping Events

```
Multiple events occurring simultaneously?
├── Same priority?
│   ├── Combine effects (additive shake, merged particles)
│   └── Use highest intensity of each layer
├── Different priorities?
│   ├── Higher priority executes fully
│   └── Lower priority queued or reduced
└── Event spam (rapid repeats)?
    ├── Rate limit with cooldowns
    ├── Reduce intensity for repeats
    └── Merge into single stronger effect
```

---

## Quality Checklist

Before completing juice orchestration, verify:

**Timing Coordination:**
- [ ] Haptic fires at T+0ms for all events
- [ ] Sound follows haptic by 5-15ms
- [ ] Flash/visual effects begin within 20ms
- [ ] Particles spawn 20-50ms after trigger
- [ ] UI updates are last (50-200ms delay)

**Intensity Scaling:**
- [ ] Tier 1 (micro) uses 1-2 layers only
- [ ] Tier 2 (small) uses 2-3 layers
- [ ] Tier 3 (medium) uses 3-4 layers
- [ ] Tier 4 (large) uses 4-5 layers
- [ ] Tier 5 (epic) uses all available layers
- [ ] Intensity parameters scale 0.0-1.0

**Fatigue Prevention:**
- [ ] Minimum 50-100ms cooldown between same events
- [ ] Haptic rate limited to 10/second max
- [ ] Sound overlap capped at 8 simultaneous
- [ ] Particle count capped at 500 active
- [ ] Screen shake trauma capped at 1.0

**Performance:**
- [ ] Total juice budget under 8ms/frame
- [ ] Haptic triggers under 0.5ms
- [ ] Audio mix under 2ms
- [ ] Particle updates under 4ms
- [ ] Shake calculations under 0.5ms

**Event Coverage:**
- [ ] Every gameplay event has feedback mapping
- [ ] Collection events have appropriate celebration
- [ ] Damage events have appropriate severity scaling
- [ ] Victory/achievement events have full sequences
- [ ] Failure events have distinct feedback

**Accessibility:**
- [ ] Reduced motion mode reduces/removes shake
- [ ] Haptics can be disabled independently
- [ ] Visual feedback remains when haptics disabled
- [ ] Sound is not sole feedback channel

---

## Anti-Patterns

**Don't**: Trigger all layers at exactly T+0ms
**Why**: Creates muddy, undefined impact; wastes some effects
**Instead**: Stagger layers (haptic first, UI last) for clear feedback hierarchy

**Don't**: Use same intensity for all events
**Why**: Major moments don't feel special; minor moments feel excessive
**Instead**: Scale intensity tiers (micro to epic) with appropriate layer counts

**Don't**: Allow unlimited simultaneous effects
**Why**: Performance degradation; sensory overload; diminishing returns
**Instead**: Cap concurrent effects (12 max), rate limit repeats

**Don't**: Skip haptic feedback for visual-heavy effects
**Why**: Haptic is fastest sensory channel; grounds visual in physical
**Instead**: Always include haptic as first layer, then build on it

**Don't**: Make all feedback equally loud/strong
**Why**: No hierarchy; player cannot distinguish importance
**Instead**: Reserve heavy shake/hitstop for truly significant moments

**Don't**: Fire particles before impact registered
**Why**: Effect appears before cause; feels disconnected
**Instead**: Particles spawn 20-50ms after haptic/sound confirm impact

**Don't**: Update UI score immediately
**Why**: Misses opportunity for anticipation and ceremony
**Instead**: Delay UI updates (50-200ms) for build-up effect

**Don't**: Allow feedback spam in rapid gameplay
**Why**: Haptic fatigue; audio cacophony; visual noise
**Instead**: Implement cooldowns, rate limits, and intensity decay

---

## Adjacent Skills

- `animation-system` - Core animation timing and easing specifications
- `audio-designer` - Sound design, mixing, and latency requirements
- `haptic-optimizer` - iOS haptic patterns and Core Haptics implementation
- `particle-effects` - Particle system design and optimization
- `screen-shake-impact` - Camera shake and visual impact effects
- `ui-transitions` - UI animation patterns and choreography
- `performance-optimizer` - Overall frame budget management
