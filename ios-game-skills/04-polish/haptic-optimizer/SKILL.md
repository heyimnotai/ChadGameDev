---
name: haptic-optimizer
description: Implements best-in-class haptic feedback for iOS games using UIFeedbackGenerator and Core Haptics. Use this skill when adding tactile feedback to button presses, collisions, collections, notifications, UI selections, or any game event that benefits from physical sensation. This skill provides exact usage contexts for each haptic style, Core Haptics AHAP patterns for custom effects, battery-conscious implementation strategies, and production-ready Swift code. Covers UIImpactFeedbackGenerator (.light, .medium, .heavy, .soft, .rigid), UINotificationFeedbackGenerator, UISelectionFeedbackGenerator, and CHHapticEngine for advanced patterns.
---

# Haptic Optimizer

## Purpose

This skill enables the implementation of precise, satisfying haptic feedback that elevates iOS game feel to top-tier quality. It enforces exact contexts for each haptic style, proper prepare() timing for latency elimination, and battery-conscious patterns that provide meaningful feedback without overuse. Haptics synchronized with visuals and audio create a cohesive multi-sensory experience that distinguishes premium games from average ones.

## Domain Boundaries

- **This skill handles**:
  - UIImpactFeedbackGenerator usage and contexts
  - UINotificationFeedbackGenerator for outcomes
  - UISelectionFeedbackGenerator for UI navigation
  - Core Haptics (CHHapticEngine) custom patterns
  - AHAP file format for complex haptics
  - Intensity and sharpness curves
  - Audio-haptic synchronization
  - Battery and performance considerations
  - Haptic event catalog (what deserves haptics)
  - prepare() timing optimization

- **This skill does NOT handle**:
  - Audio feedback (see: audio-designer skill)
  - Visual animation timing (see: animation-system skill)
  - Particle effects (see: particle-effects skill)
  - Controller rumble (different API)

## Core Specifications

### UIImpactFeedbackGenerator Styles

| Style | Intensity | Sharpness | When to Use | Examples |
|-------|-----------|-----------|-------------|----------|
| `.light` | Low | Medium | Subtle confirmations, minor interactions | Soft tap, hover state, list scroll tick |
| `.medium` | Medium | Medium | Standard interactions, moderate impacts | Button press, item pickup, small collision |
| `.heavy` | High | Medium | Significant impacts, important moments | Enemy hit, heavy landing, explosion nearby |
| `.soft` (iOS 13+) | Medium | Low | Gentle feedback, organic feel | Bubble pop, soft landing, stretch |
| `.rigid` (iOS 13+) | Medium | High | Mechanical feel, precise actions | Click, toggle switch, lock-in |

### Intensity/Sharpness Technical Values

| Style | Intensity Value | Sharpness Value | Physical Feel |
|-------|-----------------|-----------------|---------------|
| `.light` | 0.3 - 0.5 | 0.4 - 0.6 | Subtle tap |
| `.medium` | 0.5 - 0.7 | 0.4 - 0.6 | Definite thump |
| `.heavy` | 0.8 - 1.0 | 0.4 - 0.6 | Strong impact |
| `.soft` | 0.5 - 0.7 | 0.1 - 0.3 | Dull, rounded |
| `.rigid` | 0.5 - 0.7 | 0.8 - 1.0 | Sharp, clicking |

### UINotificationFeedbackGenerator Types

| Type | Pattern | When to Use | Examples |
|------|---------|-------------|----------|
| `.success` | Two quick taps (ascending feel) | Positive outcome confirmed | Level complete, achievement unlocked, purchase success |
| `.warning` | Single firm tap | Caution needed, attention required | Low health, timer warning, approaching limit |
| `.error` | Three rapid taps (descending feel) | Action failed or blocked | Invalid move, insufficient funds, connection lost |

### UISelectionFeedbackGenerator

| Method | Pattern | When to Use | Examples |
|--------|---------|-------------|----------|
| `selectionChanged()` | Very light tick | Scrolling through options | Picker wheel, slider tick, list scroll position |

### prepare() Timing Requirements

| Scenario | When to Call prepare() | Notes |
|----------|------------------------|-------|
| Button about to be pressed | On touchDown | 50-100ms before expected impact |
| Collision likely | When objects approaching | Within 1-2 seconds of expected impact |
| Menu opening | As transition starts | Before first interactive element |
| Game loading | After scene setup | Before gameplay begins |
| Re-prepare interval | Every 1-2 seconds | Taptic Engine returns to idle after ~2s |

### Haptic Event Catalog

#### Events That SHOULD Have Haptics

| Event Category | Haptic Type | Intensity | Notes |
|----------------|-------------|-----------|-------|
| **Button Press** | Impact (.light) | 0.4 | On touchDown, not touchUp |
| **Significant Button** | Impact (.medium) | 0.6 | Start game, confirm purchase |
| **Item Collection** | Impact (.light) | 0.3-0.5 | Coins, pickups, small rewards |
| **Valuable Collection** | Impact (.medium) | 0.6-0.8 | Rare items, power-ups |
| **Player Hit (light)** | Impact (.medium) | 0.6 | Minor damage taken |
| **Player Hit (heavy)** | Impact (.heavy) | 0.9-1.0 | Significant damage |
| **Player Death** | Notification (.error) | N/A | Finality of death |
| **Enemy Kill** | Impact (.rigid) | 0.7 | Satisfying defeat |
| **Jump Land** | Impact (.medium) | 0.5-0.6 | Ground contact |
| **Heavy Land** | Impact (.heavy) | 0.8 | Fall from height |
| **Collision** | Impact (varies) | By force | Physics-based |
| **Explosion Nearby** | Impact (.heavy) | 1.0 | Major event |
| **Level Complete** | Notification (.success) | N/A | Achievement |
| **Achievement Unlock** | Notification (.success) | N/A | Milestone |
| **Error/Invalid** | Notification (.error) | N/A | Blocked action |
| **Warning** | Notification (.warning) | N/A | Attention needed |
| **List Scroll Tick** | Selection | N/A | Position feedback |
| **Slider Value Change** | Selection | N/A | Increment feedback |
| **Toggle Switch** | Impact (.rigid) | 0.6 | State change |

#### Events That Should NOT Have Haptics

| Event | Reason |
|-------|--------|
| Background animations | No user action, battery waste |
| Particle effects | Too frequent, noise |
| Character walking | Every frame = fatigue |
| Continuous actions | Sustained holding |
| Menu hover (no action) | No commitment |
| Score incrementing | Too frequent |
| Timer ticking | Constant, annoying |
| Ambient events | Not player-related |

### Battery and Frequency Guidelines

| Guideline | Specification |
|-----------|---------------|
| Maximum sustained rate | 10 haptics per second (100ms minimum between) |
| Recommended sustained rate | 2-4 haptics per second |
| Burst maximum | 5 haptics in 500ms, then pause |
| Continuous event | Use single transient, not repeating |
| Idle battery drain | Minimal (Taptic Engine sleeps after ~2s) |
| Heavy usage impact | 3-5% additional battery per hour of play |

### Core Haptics Specifications

| Parameter | Range | Description |
|-----------|-------|-------------|
| Intensity | 0.0 - 1.0 | Strength of vibration |
| Sharpness | 0.0 - 1.0 | 0 = dull/round, 1 = sharp/clicking |
| Attack time | 0.0 - 1.0 seconds | Fade in duration |
| Decay time | 0.0 - 1.0 seconds | Fade out duration |
| Sustain time | 0.0 - 30.0 seconds | Maximum continuous duration |
| Release time | 0.0 - 1.0 seconds | Final fade out |

### Device Support

| Device | Haptic Support | Engine |
|--------|----------------|--------|
| iPhone 8+ | Full | Taptic Engine (2nd gen) |
| iPhone 7 | Full | Taptic Engine (1st gen) |
| iPhone 6s | Limited | Taptic Engine (basic) |
| iPhone 6 and earlier | None | No Taptic Engine |
| iPad | None | No Taptic Engine |
| iPod Touch | None | No Taptic Engine |

## Implementation Patterns

### Basic Haptic Manager

```swift
import UIKit
import CoreHaptics

final class HapticManager {
    static let shared = HapticManager()

    // Generators (reuse for performance)
    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
    private let softImpact = UIImpactFeedbackGenerator(style: .soft)
    private let rigidImpact = UIImpactFeedbackGenerator(style: .rigid)
    private let notification = UINotificationFeedbackGenerator()
    private let selection = UISelectionFeedbackGenerator()

    // Core Haptics
    private var hapticEngine: CHHapticEngine?
    private var engineNeedsStart = true

    // Settings
    var isEnabled: Bool = true

    // Rate limiting
    private var lastHapticTime: Date = .distantPast
    private let minimumInterval: TimeInterval = 0.05 // 50ms = 20 haptics/sec max

    private init() {
        setupCoreHaptics()
    }

    // MARK: - Setup

    private func setupCoreHaptics() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
            return
        }

        do {
            hapticEngine = try CHHapticEngine()
            hapticEngine?.playsHapticsOnly = true

            // Handle engine reset
            hapticEngine?.resetHandler = { [weak self] in
                self?.engineNeedsStart = true
            }

            // Handle engine stop
            hapticEngine?.stoppedHandler = { [weak self] reason in
                self?.engineNeedsStart = true
            }
        } catch {
            print("Core Haptics engine creation failed: \(error)")
        }
    }

    private func startEngineIfNeeded() {
        guard engineNeedsStart, let engine = hapticEngine else { return }

        do {
            try engine.start()
            engineNeedsStart = false
        } catch {
            print("Failed to start haptic engine: \(error)")
        }
    }

    // MARK: - Rate Limiting

    private func canPlayHaptic() -> Bool {
        guard isEnabled else { return false }

        let now = Date()
        guard now.timeIntervalSince(lastHapticTime) >= minimumInterval else {
            return false
        }
        lastHapticTime = now
        return true
    }

    // MARK: - Prepare (call before expected haptic)

    func prepareForButtonPress() {
        lightImpact.prepare()
    }

    func prepareForImpact() {
        mediumImpact.prepare()
        heavyImpact.prepare()
    }

    func prepareForNotification() {
        notification.prepare()
    }

    func prepareForSelection() {
        selection.prepare()
    }

    func prepareAll() {
        lightImpact.prepare()
        mediumImpact.prepare()
        heavyImpact.prepare()
        softImpact.prepare()
        rigidImpact.prepare()
        notification.prepare()
        selection.prepare()
    }

    // MARK: - Impact Haptics

    func buttonTap() {
        guard canPlayHaptic() else { return }
        lightImpact.impactOccurred(intensity: 0.4)
    }

    func significantButtonTap() {
        guard canPlayHaptic() else { return }
        mediumImpact.impactOccurred(intensity: 0.6)
    }

    func itemCollect() {
        guard canPlayHaptic() else { return }
        lightImpact.impactOccurred(intensity: 0.5)
    }

    func valuableCollect() {
        guard canPlayHaptic() else { return }
        mediumImpact.impactOccurred(intensity: 0.7)
    }

    func playerHitLight() {
        guard canPlayHaptic() else { return }
        mediumImpact.impactOccurred(intensity: 0.6)
    }

    func playerHitHeavy() {
        guard canPlayHaptic() else { return }
        heavyImpact.impactOccurred(intensity: 1.0)
    }

    func enemyKill() {
        guard canPlayHaptic() else { return }
        rigidImpact.impactOccurred(intensity: 0.7)
    }

    func jumpLand() {
        guard canPlayHaptic() else { return }
        mediumImpact.impactOccurred(intensity: 0.5)
    }

    func heavyLand() {
        guard canPlayHaptic() else { return }
        heavyImpact.impactOccurred(intensity: 0.8)
    }

    func explosion() {
        guard canPlayHaptic() else { return }
        heavyImpact.impactOccurred(intensity: 1.0)
    }

    func toggleSwitch() {
        guard canPlayHaptic() else { return }
        rigidImpact.impactOccurred(intensity: 0.6)
    }

    func softPop() {
        guard canPlayHaptic() else { return }
        softImpact.impactOccurred(intensity: 0.5)
    }

    /// Variable intensity impact (0.0 - 1.0)
    func impact(style: UIImpactFeedbackGenerator.FeedbackStyle, intensity: CGFloat) {
        guard canPlayHaptic() else { return }

        switch style {
        case .light:
            lightImpact.impactOccurred(intensity: intensity)
        case .medium:
            mediumImpact.impactOccurred(intensity: intensity)
        case .heavy:
            heavyImpact.impactOccurred(intensity: intensity)
        case .soft:
            softImpact.impactOccurred(intensity: intensity)
        case .rigid:
            rigidImpact.impactOccurred(intensity: intensity)
        @unknown default:
            mediumImpact.impactOccurred(intensity: intensity)
        }
    }

    // MARK: - Notification Haptics

    func success() {
        guard canPlayHaptic() else { return }
        notification.notificationOccurred(.success)
    }

    func warning() {
        guard canPlayHaptic() else { return }
        notification.notificationOccurred(.warning)
    }

    func error() {
        guard canPlayHaptic() else { return }
        notification.notificationOccurred(.error)
    }

    // MARK: - Selection Haptics

    func selectionTick() {
        guard canPlayHaptic() else { return }
        selection.selectionChanged()
    }
}
```

### Core Haptics Custom Patterns

```swift
import CoreHaptics

extension HapticManager {

    // MARK: - Core Haptics Patterns

    /// Double tap pattern (collect valuable item)
    func playDoubleTap() {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()

        guard let engine = hapticEngine else {
            // Fallback to UIKit
            mediumImpact.impactOccurred()
            return
        }

        do {
            let tap1 = CHHapticEvent(
                eventType: .hapticTransient,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.6),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.5)
                ],
                relativeTime: 0
            )

            let tap2 = CHHapticEvent(
                eventType: .hapticTransient,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.8),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.6)
                ],
                relativeTime: 0.08 // 80ms later
            )

            let pattern = try CHHapticPattern(events: [tap1, tap2], parameters: [])
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to play double tap: \(error)")
        }
    }

    /// Rumble pattern (explosion, heavy impact)
    func playRumble(duration: TimeInterval = 0.3, intensity: Float = 0.8) {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()

        guard let engine = hapticEngine else {
            heavyImpact.impactOccurred()
            return
        }

        do {
            let continuous = CHHapticEvent(
                eventType: .hapticContinuous,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.3)
                ],
                relativeTime: 0,
                duration: duration
            )

            // Decay curve
            let decayCurve = CHHapticParameterCurve(
                parameterID: .hapticIntensityControl,
                controlPoints: [
                    CHHapticParameterCurve.ControlPoint(relativeTime: 0, value: 1.0),
                    CHHapticParameterCurve.ControlPoint(relativeTime: duration, value: 0.0)
                ],
                relativeTime: 0
            )

            let pattern = try CHHapticPattern(events: [continuous], parameterCurves: [decayCurve])
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to play rumble: \(error)")
        }
    }

    /// Heartbeat pattern (low health warning)
    func playHeartbeat(bpm: Int = 80) {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()

        guard let engine = hapticEngine else {
            warning()
            return
        }

        let beatInterval = 60.0 / Double(bpm)

        do {
            // First beat (lub)
            let lub = CHHapticEvent(
                eventType: .hapticTransient,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.8),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.3)
                ],
                relativeTime: 0
            )

            // Second beat (dub) - slightly softer
            let dub = CHHapticEvent(
                eventType: .hapticTransient,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.5),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.2)
                ],
                relativeTime: 0.15 // 150ms after lub
            )

            let pattern = try CHHapticPattern(events: [lub, dub], parameters: [])
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to play heartbeat: \(error)")
        }
    }

    /// Rising intensity (power charging)
    func playCharge(duration: TimeInterval = 1.0) {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()

        guard let engine = hapticEngine else {
            return
        }

        do {
            let continuous = CHHapticEvent(
                eventType: .hapticContinuous,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.2),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.5)
                ],
                relativeTime: 0,
                duration: duration
            )

            // Rising intensity curve
            let intensityCurve = CHHapticParameterCurve(
                parameterID: .hapticIntensityControl,
                controlPoints: [
                    CHHapticParameterCurve.ControlPoint(relativeTime: 0, value: 0.2),
                    CHHapticParameterCurve.ControlPoint(relativeTime: duration * 0.8, value: 0.9),
                    CHHapticParameterCurve.ControlPoint(relativeTime: duration, value: 1.0)
                ],
                relativeTime: 0
            )

            // Increasing sharpness
            let sharpnessCurve = CHHapticParameterCurve(
                parameterID: .hapticSharpnessControl,
                controlPoints: [
                    CHHapticParameterCurve.ControlPoint(relativeTime: 0, value: 0.3),
                    CHHapticParameterCurve.ControlPoint(relativeTime: duration, value: 0.8)
                ],
                relativeTime: 0
            )

            let pattern = try CHHapticPattern(
                events: [continuous],
                parameterCurves: [intensityCurve, sharpnessCurve]
            )
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to play charge: \(error)")
        }
    }

    /// Triple burst (achievement unlock, major success)
    func playTripleBurst() {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()

        guard let engine = hapticEngine else {
            success()
            return
        }

        do {
            let events = (0..<3).map { index -> CHHapticEvent in
                CHHapticEvent(
                    eventType: .hapticTransient,
                    parameters: [
                        CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.6 + Float(index) * 0.15),
                        CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.5 + Float(index) * 0.1)
                    ],
                    relativeTime: Double(index) * 0.1 // 100ms apart
                )
            }

            let pattern = try CHHapticPattern(events: events, parameters: [])
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to play triple burst: \(error)")
        }
    }
}
```

### AHAP File Implementation

```swift
import CoreHaptics

extension HapticManager {

    /// Play haptic from AHAP file
    func playAHAP(named filename: String) {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()

        guard let engine = hapticEngine,
              let url = Bundle.main.url(forResource: filename, withExtension: "ahap") else {
            return
        }

        do {
            try engine.playPattern(from: url)
        } catch {
            print("Failed to play AHAP \(filename): \(error)")
        }
    }
}

/*
Example AHAP file: "explosion.ahap"

{
    "Version": 1.0,
    "Metadata": {
        "Project": "MyGame",
        "Created": "2024-01-01",
        "Description": "Explosion haptic pattern"
    },
    "Pattern": [
        {
            "Event": {
                "Time": 0.0,
                "EventType": "HapticTransient",
                "EventParameters": [
                    { "ParameterID": "HapticIntensity", "ParameterValue": 1.0 },
                    { "ParameterID": "HapticSharpness", "ParameterValue": 0.8 }
                ]
            }
        },
        {
            "Event": {
                "Time": 0.0,
                "EventType": "HapticContinuous",
                "EventDuration": 0.4,
                "EventParameters": [
                    { "ParameterID": "HapticIntensity", "ParameterValue": 0.8 },
                    { "ParameterID": "HapticSharpness", "ParameterValue": 0.2 }
                ]
            }
        },
        {
            "ParameterCurve": {
                "ParameterID": "HapticIntensityControl",
                "Time": 0.0,
                "ParameterCurveControlPoints": [
                    { "Time": 0.0, "ParameterValue": 1.0 },
                    { "Time": 0.1, "ParameterValue": 0.8 },
                    { "Time": 0.4, "ParameterValue": 0.0 }
                ]
            }
        }
    ]
}
*/
```

### Audio-Haptic Synchronization

```swift
import CoreHaptics
import AVFoundation

class AudioHapticPlayer {
    private var hapticEngine: CHHapticEngine?
    private var audioPlayer: AVAudioPlayer?

    func playWithHaptic(audioFile: String, hapticFile: String) {
        // Setup haptic engine for audio sync
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
            // Fallback: play audio only
            playAudioOnly(audioFile)
            return
        }

        do {
            // Create engine with audio session
            hapticEngine = try CHHapticEngine(audioSession: .sharedInstance())
            try hapticEngine?.start()

            // Load AHAP pattern
            guard let hapticURL = Bundle.main.url(forResource: hapticFile, withExtension: "ahap") else {
                return
            }

            // Play synchronized
            try hapticEngine?.playPattern(from: hapticURL)
            playAudioOnly(audioFile)

        } catch {
            print("Audio-haptic sync failed: \(error)")
            playAudioOnly(audioFile)
        }
    }

    private func playAudioOnly(_ filename: String) {
        guard let url = Bundle.main.url(forResource: filename, withExtension: "caf") else {
            return
        }

        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {
            print("Audio playback failed: \(error)")
        }
    }
}
```

### SwiftUI Button with Haptic

```swift
import SwiftUI

struct HapticButton<Label: View>: View {
    let action: () -> Void
    let label: () -> Label

    @State private var isPressed = false

    var body: some View {
        label()
            .scaleEffect(isPressed ? 0.95 : 1.0)
            .animation(.easeOut(duration: 0.1), value: isPressed)
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in
                        if !isPressed {
                            isPressed = true
                            HapticManager.shared.buttonTap()
                        }
                    }
                    .onEnded { _ in
                        isPressed = false
                        action()
                    }
            )
            .onAppear {
                HapticManager.shared.prepareForButtonPress()
            }
    }
}

// Usage
struct ContentView: View {
    var body: some View {
        HapticButton(action: {
            print("Tapped!")
        }) {
            Text("Play")
                .font(.headline)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
        }
    }
}
```

### SpriteKit Integration

```swift
import SpriteKit

class GameScene: SKScene, SKPhysicsContactDelegate {

    override func didMove(to view: SKView) {
        physicsWorld.contactDelegate = self
        HapticManager.shared.prepareAll()
    }

    func didBegin(_ contact: SKPhysicsContact) {
        let collision = contact.bodyA.categoryBitMask | contact.bodyB.categoryBitMask

        // Determine haptic based on collision type
        switch collision {
        case PhysicsCategory.player | PhysicsCategory.coin:
            HapticManager.shared.itemCollect()

        case PhysicsCategory.player | PhysicsCategory.powerUp:
            HapticManager.shared.valuableCollect()

        case PhysicsCategory.player | PhysicsCategory.enemy:
            let impactForce = abs(contact.collisionImpulse)
            if impactForce > 50 {
                HapticManager.shared.playerHitHeavy()
            } else {
                HapticManager.shared.playerHitLight()
            }

        case PhysicsCategory.player | PhysicsCategory.ground:
            let verticalVelocity = abs(contact.bodyA.velocity.dy + contact.bodyB.velocity.dy)
            if verticalVelocity > 500 {
                HapticManager.shared.heavyLand()
            } else if verticalVelocity > 100 {
                HapticManager.shared.jumpLand()
            }

        default:
            break
        }
    }

    func playerDied() {
        HapticManager.shared.error()
    }

    func levelComplete() {
        HapticManager.shared.success()
    }

    func enemyDefeated() {
        HapticManager.shared.enemyKill()
    }
}

struct PhysicsCategory {
    static let player: UInt32 = 0x1 << 0
    static let enemy: UInt32 = 0x1 << 1
    static let coin: UInt32 = 0x1 << 2
    static let powerUp: UInt32 = 0x1 << 3
    static let ground: UInt32 = 0x1 << 4
}
```

### Physics-Based Impact Intensity

```swift
extension HapticManager {

    /// Calculate and play haptic based on physics collision
    func playCollisionHaptic(impactForce: CGFloat, maxForce: CGFloat = 1000) {
        guard canPlayHaptic() else { return }

        // Normalize force to 0-1 range
        let normalizedForce = min(1.0, max(0.0, impactForce / maxForce))

        // Choose style and intensity based on force
        if normalizedForce < 0.3 {
            lightImpact.impactOccurred(intensity: 0.3 + normalizedForce)
        } else if normalizedForce < 0.7 {
            mediumImpact.impactOccurred(intensity: normalizedForce)
        } else {
            heavyImpact.impactOccurred(intensity: 0.7 + (normalizedForce * 0.3))
        }
    }

    /// Calculate haptic for velocity-based events (landing, throwing)
    func playVelocityHaptic(velocity: CGFloat, maxVelocity: CGFloat = 2000) {
        guard canPlayHaptic() else { return }

        let normalizedVelocity = min(1.0, abs(velocity) / maxVelocity)

        if normalizedVelocity < 0.2 {
            // Very light or no haptic
            return
        } else if normalizedVelocity < 0.5 {
            lightImpact.impactOccurred(intensity: normalizedVelocity * 1.5)
        } else if normalizedVelocity < 0.8 {
            mediumImpact.impactOccurred(intensity: 0.5 + normalizedVelocity * 0.5)
        } else {
            heavyImpact.impactOccurred(intensity: 0.8 + normalizedVelocity * 0.2)
        }
    }
}
```

## Decision Trees

### Choosing Impact Style

```
What is the interaction weight?
├── Subtle/Light
│   ├── Is it mechanical/precise? → .rigid (intensity 0.4-0.5)
│   └── Is it organic/soft? → .soft (intensity 0.4-0.5)
│   └── Standard subtle? → .light (intensity 0.3-0.5)
├── Medium/Standard
│   ├── Is it a click/toggle? → .rigid (intensity 0.6)
│   └── Is it a thump/bump? → .medium (intensity 0.5-0.7)
└── Heavy/Significant
    ├── Is it an explosion/crash? → .heavy (intensity 0.9-1.0)
    └── Is it a strong hit? → .heavy (intensity 0.7-0.9)
```

### Choosing Notification vs Impact

```
Is this an outcome/result?
├── YES (success, failure, warning)
│   ├── Positive outcome? → .success
│   ├── Negative outcome? → .error
│   └── Caution needed? → .warning
└── NO (action, collision, interaction)
    └── Use UIImpactFeedbackGenerator (see above)
```

### When to Use Core Haptics

```
Is built-in haptic sufficient?
├── YES → Use UIFeedbackGenerator (simpler, more compatible)
└── NO → What do you need?
    ├── Sustained vibration → Core Haptics (CHHapticContinuous)
    ├── Complex pattern → Core Haptics (multi-event)
    ├── Precise timing → Core Haptics (time-based events)
    ├── Dynamic curves → Core Haptics (parameter curves)
    └── Audio sync → Core Haptics (audio session integration)
```

### When to Call prepare()

```
Is haptic imminent?
├── Button touchDown → prepare() immediately
├── Collision likely (objects approaching) → prepare() when in range
├── Menu/screen appearing → prepare() as transition starts
├── Scene loading → prepare() after setup complete
└── Periodic gameplay → re-prepare() every 1-2 seconds
```

## Quality Checklist

### Implementation
- [ ] HapticManager is singleton with reused generators
- [ ] prepare() called before expected haptics
- [ ] Graceful fallback when haptics not supported
- [ ] Rate limiting prevents haptic spam (50ms minimum between)
- [ ] Core Haptics engine handles stop/reset callbacks

### Event Coverage
- [ ] All buttons have haptic feedback
- [ ] Player hits/damage have proportional feedback
- [ ] Collections have satisfying feedback
- [ ] UI navigation has selection feedback
- [ ] Outcomes (win/lose) have notification feedback
- [ ] Toggle switches have rigid click feedback

### Balance
- [ ] Haptics match visual/audio intensity
- [ ] No continuous haptics during sustained actions
- [ ] Ambient/background events do NOT have haptics
- [ ] Haptic frequency sustainable for battery
- [ ] Critical haptics are distinguishable from subtle ones

### Settings
- [ ] User can disable haptics
- [ ] Haptic preference persists across sessions
- [ ] iPad gracefully handles lack of haptics

## Anti-Patterns

### Haptic Overload
**Problem**: Every particle, animation frame, or background event triggers haptic
**Consequence**: User fatigues, battery drains, nothing feels special
**Solution**: Only trigger haptics for user-initiated actions and significant events

### No Prepare
**Problem**: Calling impactOccurred() without prior prepare()
**Consequence**: First haptic has 50-100ms latency, feels delayed
**Solution**: Call prepare() on touchDown, scene load, or predictable moments

### Same Haptic for Everything
**Problem**: Using .medium for all feedback
**Consequence**: No differentiation between light tap and heavy impact
**Solution**: Match haptic intensity to event significance

### Continuous Vibration
**Problem**: Sustained vibration during movement or charging
**Consequence**: Annoying, battery draining, diminishes impact
**Solution**: Use transient haptics at key moments, not continuous

### Ignoring Physics
**Problem**: Same haptic regardless of collision force or velocity
**Consequence**: Disconnect between visual physics and tactile feel
**Solution**: Scale haptic intensity with physics values

### Not Testing on Device
**Problem**: Developing haptics in simulator only
**Consequence**: Haptics feel wrong or are too intense on real device
**Solution**: Always test haptics on physical iPhone

### iPad Crashes
**Problem**: Force-unwrapping haptic generators on iPad
**Consequence**: App crashes on devices without Taptic Engine
**Solution**: Check `CHHapticEngine.capabilitiesForHardware().supportsHaptics`

## Adjacent Skills

- **animation-system**: Time haptics to animation keyframes (haptic at T+5ms before visual scale at T+10ms)
- **audio-designer**: Sync haptics with audio (haptic fires 5-10ms before sound for perceived simultaneity)
- **screen-shake-impact**: Combine screen shake with heavy haptic for maximum impact feel
- **particle-effects**: Do NOT trigger haptics for particle events (too frequent)
- **juice-orchestrator**: Coordinate haptics with all feedback channels for cohesive game feel
