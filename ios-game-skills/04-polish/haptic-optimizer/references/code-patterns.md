# Haptic Optimizer Code Patterns

## Basic Haptic Manager

```swift
import UIKit
import CoreHaptics

final class HapticManager {
    static let shared = HapticManager()

    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
    private let softImpact = UIImpactFeedbackGenerator(style: .soft)
    private let rigidImpact = UIImpactFeedbackGenerator(style: .rigid)
    private let notification = UINotificationFeedbackGenerator()
    private let selection = UISelectionFeedbackGenerator()

    private var hapticEngine: CHHapticEngine?
    private var engineNeedsStart = true
    var isEnabled: Bool = true

    private var lastHapticTime: Date = .distantPast
    private let minimumInterval: TimeInterval = 0.05

    private init() { setupCoreHaptics() }

    private func setupCoreHaptics() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
        do {
            hapticEngine = try CHHapticEngine()
            hapticEngine?.playsHapticsOnly = true
            hapticEngine?.resetHandler = { [weak self] in self?.engineNeedsStart = true }
            hapticEngine?.stoppedHandler = { [weak self] _ in self?.engineNeedsStart = true }
        } catch { print("Core Haptics engine creation failed: \(error)") }
    }

    private func startEngineIfNeeded() {
        guard engineNeedsStart, let engine = hapticEngine else { return }
        do { try engine.start(); engineNeedsStart = false }
        catch { print("Failed to start haptic engine: \(error)") }
    }

    private func canPlayHaptic() -> Bool {
        guard isEnabled else { return false }
        let now = Date()
        guard now.timeIntervalSince(lastHapticTime) >= minimumInterval else { return false }
        lastHapticTime = now
        return true
    }

    // MARK: - Prepare Methods
    func prepareForButtonPress() { lightImpact.prepare() }
    func prepareForImpact() { mediumImpact.prepare(); heavyImpact.prepare() }
    func prepareAll() {
        [lightImpact, mediumImpact, heavyImpact, softImpact, rigidImpact].forEach { $0.prepare() }
        notification.prepare(); selection.prepare()
    }

    // MARK: - Impact Haptics
    func buttonTap() { guard canPlayHaptic() else { return }; lightImpact.impactOccurred(intensity: 0.4) }
    func itemCollect() { guard canPlayHaptic() else { return }; lightImpact.impactOccurred(intensity: 0.5) }
    func playerHitLight() { guard canPlayHaptic() else { return }; mediumImpact.impactOccurred(intensity: 0.6) }
    func playerHitHeavy() { guard canPlayHaptic() else { return }; heavyImpact.impactOccurred(intensity: 1.0) }
    func enemyKill() { guard canPlayHaptic() else { return }; rigidImpact.impactOccurred(intensity: 0.7) }
    func jumpLand() { guard canPlayHaptic() else { return }; mediumImpact.impactOccurred(intensity: 0.5) }
    func heavyLand() { guard canPlayHaptic() else { return }; heavyImpact.impactOccurred(intensity: 0.8) }
    func toggleSwitch() { guard canPlayHaptic() else { return }; rigidImpact.impactOccurred(intensity: 0.6) }

    func impact(style: UIImpactFeedbackGenerator.FeedbackStyle, intensity: CGFloat) {
        guard canPlayHaptic() else { return }
        switch style {
        case .light: lightImpact.impactOccurred(intensity: intensity)
        case .medium: mediumImpact.impactOccurred(intensity: intensity)
        case .heavy: heavyImpact.impactOccurred(intensity: intensity)
        case .soft: softImpact.impactOccurred(intensity: intensity)
        case .rigid: rigidImpact.impactOccurred(intensity: intensity)
        @unknown default: mediumImpact.impactOccurred(intensity: intensity)
        }
    }

    // MARK: - Notification Haptics
    func success() { guard canPlayHaptic() else { return }; notification.notificationOccurred(.success) }
    func warning() { guard canPlayHaptic() else { return }; notification.notificationOccurred(.warning) }
    func error() { guard canPlayHaptic() else { return }; notification.notificationOccurred(.error) }

    // MARK: - Selection Haptics
    func selectionTick() { guard canPlayHaptic() else { return }; selection.selectionChanged() }
}
```

## Core Haptics Custom Patterns

```swift
extension HapticManager {

    func playDoubleTap() {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()
        guard let engine = hapticEngine else { mediumImpact.impactOccurred(); return }

        do {
            let tap1 = CHHapticEvent(eventType: .hapticTransient, parameters: [
                CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.6),
                CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.5)
            ], relativeTime: 0)
            let tap2 = CHHapticEvent(eventType: .hapticTransient, parameters: [
                CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.8),
                CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.6)
            ], relativeTime: 0.08)
            let pattern = try CHHapticPattern(events: [tap1, tap2], parameters: [])
            try engine.makePlayer(with: pattern).start(atTime: CHHapticTimeImmediate)
        } catch { print("Failed to play double tap: \(error)") }
    }

    func playRumble(duration: TimeInterval = 0.3, intensity: Float = 0.8) {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()
        guard let engine = hapticEngine else { heavyImpact.impactOccurred(); return }

        do {
            let continuous = CHHapticEvent(eventType: .hapticContinuous, parameters: [
                CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity),
                CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.3)
            ], relativeTime: 0, duration: duration)
            let decay = CHHapticParameterCurve(parameterID: .hapticIntensityControl, controlPoints: [
                CHHapticParameterCurve.ControlPoint(relativeTime: 0, value: 1.0),
                CHHapticParameterCurve.ControlPoint(relativeTime: duration, value: 0.0)
            ], relativeTime: 0)
            let pattern = try CHHapticPattern(events: [continuous], parameterCurves: [decay])
            try engine.makePlayer(with: pattern).start(atTime: CHHapticTimeImmediate)
        } catch { print("Failed to play rumble: \(error)") }
    }

    func playHeartbeat(bpm: Int = 80) {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()
        guard let engine = hapticEngine else { warning(); return }

        do {
            let lub = CHHapticEvent(eventType: .hapticTransient, parameters: [
                CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.8),
                CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.3)
            ], relativeTime: 0)
            let dub = CHHapticEvent(eventType: .hapticTransient, parameters: [
                CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.5),
                CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.2)
            ], relativeTime: 0.15)
            let pattern = try CHHapticPattern(events: [lub, dub], parameters: [])
            try engine.makePlayer(with: pattern).start(atTime: CHHapticTimeImmediate)
        } catch { print("Failed to play heartbeat: \(error)") }
    }

    func playTripleBurst() {
        guard canPlayHaptic() else { return }
        startEngineIfNeeded()
        guard let engine = hapticEngine else { success(); return }

        do {
            let events = (0..<3).map { i -> CHHapticEvent in
                CHHapticEvent(eventType: .hapticTransient, parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.6 + Float(i) * 0.15),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.5 + Float(i) * 0.1)
                ], relativeTime: Double(i) * 0.1)
            }
            let pattern = try CHHapticPattern(events: events, parameters: [])
            try engine.makePlayer(with: pattern).start(atTime: CHHapticTimeImmediate)
        } catch { print("Failed to play triple burst: \(error)") }
    }
}
```

## SwiftUI Button with Haptic

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
            .onAppear { HapticManager.shared.prepareForButtonPress() }
    }
}
```

## Physics-Based Impact Intensity

```swift
extension HapticManager {

    func playCollisionHaptic(impactForce: CGFloat, maxForce: CGFloat = 1000) {
        guard canPlayHaptic() else { return }
        let normalized = min(1.0, max(0.0, impactForce / maxForce))
        if normalized < 0.3 { lightImpact.impactOccurred(intensity: 0.3 + normalized) }
        else if normalized < 0.7 { mediumImpact.impactOccurred(intensity: normalized) }
        else { heavyImpact.impactOccurred(intensity: 0.7 + normalized * 0.3) }
    }

    func playVelocityHaptic(velocity: CGFloat, maxVelocity: CGFloat = 2000) {
        guard canPlayHaptic() else { return }
        let normalized = min(1.0, abs(velocity) / maxVelocity)
        if normalized < 0.2 { return }
        else if normalized < 0.5 { lightImpact.impactOccurred(intensity: normalized * 1.5) }
        else if normalized < 0.8 { mediumImpact.impactOccurred(intensity: 0.5 + normalized * 0.5) }
        else { heavyImpact.impactOccurred(intensity: 0.8 + normalized * 0.2) }
    }
}
```
