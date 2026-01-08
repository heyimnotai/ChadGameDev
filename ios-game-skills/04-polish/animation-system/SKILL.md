---
name: animation-system
description: Implements game-feel animations with precise timing specifications for iOS games. Use this skill when implementing button press feedback, item collection sequences, score animations, screen transitions, character feedback animations (hit, jump, land, die), menu animations, reward reveals, or victory/defeat sequences. This skill provides exact millisecond timing values, easing curves with cubic-bezier specifications, squash-and-stretch values with volume conservation, and production-ready Swift code for both SwiftUI and SpriteKit implementations.
---

# Animation System

## Purpose

This skill enables the implementation of polished, responsive animations that define top-tier iOS game feel. It enforces exact timing specifications, proper easing curves, and volume-conserving deformations that transform functional games into experiences that feel professionally crafted. Every animation specification is implementation-ready with precise values that have been validated against successful App Store games.

## Domain Boundaries

- **This skill handles**:
  - Button press/release animations with scale and timing
  - Item/collectible pickup animation sequences
  - Score and counter increment animations
  - Screen transition timing and choreography
  - Character feedback animations (hit reactions, jumps, landings, deaths)
  - Menu element animations (open, close, hover states)
  - Reward reveal and loot box opening sequences
  - Victory and defeat celebration animations
  - Squash and stretch deformations
  - Animation easing curves and timing functions
  - Multi-element choreography and sequencing

- **This skill does NOT handle**:
  - Particle effects (see: particle-effects skill)
  - Screen shake and camera effects (see: screen-shake-impact skill)
  - Haptic feedback timing (see: haptic-optimizer skill)
  - Audio synchronization (see: audio-designer skill)
  - UI layout transitions between screens (see: ui-transitions skill)

## Core Specifications

### Button Press Animation

| Property | Value | Notes |
|----------|-------|-------|
| Press duration | 100ms | Time to reach pressed state |
| Release duration | 150ms | Slightly longer for satisfying return |
| Press scale | 0.95x | Scale down on touch |
| Release overshoot | 1.05x | Brief overshoot before settling |
| Settle scale | 1.0x | Final resting state |
| Press easing | ease-out | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` |
| Release easing | ease-out-back | `cubic-bezier(0.2, 0.8, 0.2, 1.0)` |
| Disabled opacity | 0.5 | Visual disabled state |
| Disabled scale | 1.0x | No scale change when disabled |

### Item Collection Sequence

| Time Offset | Event | Duration | Specification |
|-------------|-------|----------|---------------|
| T+0ms | Touch detected | - | Collision or tap registered |
| T+5ms | Haptic fires | - | UIImpactFeedbackGenerator(.light) |
| T+10ms | Scale up begins | 50ms | 1.0x to 1.3x, ease-out |
| T+15ms | Sound plays | - | Collection SFX triggers |
| T+30ms | Particles spawn | - | Burst emission (see particle-effects) |
| T+60ms | Fly to counter | 200ms | Bezier path to UI element |
| T+60ms | Alpha fade begins | 150ms | 1.0 to 0.0 during flight |
| T+260ms | Counter pulse | 150ms | Scale 1.0x to 1.2x to 1.0x |
| T+260ms | Score increment | 500ms | Animated number roll |

### Score Counter Animation

| Property | Value | Notes |
|----------|-------|-------|
| Total duration | 500-1000ms | Scales with score delta |
| Easing | ease-in-out | Fast in middle, slow at ends |
| Digit rate | 50ms minimum | Minimum time per digit change |
| Pulse on complete | 150ms | Scale 1.0x to 1.15x to 1.0x |
| Color flash | optional | Brief highlight color on increment |

### Screen Transitions

| Transition Type | Duration | Easing | Use Case |
|-----------------|----------|--------|----------|
| Modal present | 300ms | ease-out | Popup dialogs, settings |
| Modal dismiss | 250ms | ease-in | Closing popups |
| Push navigation | 350ms | ease-in-out | Level progression |
| Fade crossfade | 200ms | linear | Scene changes |
| Scale zoom | 400ms | ease-out-back | Menu to gameplay |
| Slide horizontal | 300ms | ease-in-out | Tab switching |

**Tablet Adjustment**: Multiply all durations by 1.3x for iPad (e.g., 300ms becomes 390ms).

### Character Feedback Animations

#### Hit Reaction
| Property | Value | Notes |
|----------|-------|-------|
| Flash white | 50ms | Full sprite tint to white |
| Knockback | 100ms | Small positional offset |
| Recovery | 150ms | Return to normal |
| Total duration | 300ms | Complete hit reaction cycle |
| Invulnerability flash | 100ms on/off | Alternating alpha during i-frames |

#### Jump Animation
| Phase | Duration | Scale X | Scale Y | Notes |
|-------|----------|---------|---------|-------|
| Anticipation | 80ms | 1.2x | 0.8x | Crouch before jump |
| Launch | 50ms | 0.9x | 1.15x | Stretch during ascent |
| Apex | - | 1.0x | 1.0x | Normal at peak |
| Fall | - | 0.95x | 1.05x | Slight stretch descending |
| Land squash | 60ms | 1.3x | 0.7x | Impact deformation |
| Recovery | 100ms | 1.0x | 1.0x | Return to normal |

#### Death Animation
| Phase | Duration | Effect |
|-------|----------|--------|
| Flash | 100ms | White tint |
| Freeze | 150ms | Brief pause (hit stop) |
| Collapse/Explode | 300ms | Genre-dependent destruction |
| Fade out | 200ms | Alpha 1.0 to 0.0 |
| Total | 750ms | Full death sequence |

### Menu Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Menu open | Scale 0.8x to 1.0x + fade in | 250ms | ease-out-back |
| Menu close | Scale 1.0x to 0.9x + fade out | 200ms | ease-in |
| Button hover (iPad) | Scale to 1.05x | 150ms | ease-out |
| List item appear | Stagger 50ms per item | 150ms each | ease-out |
| Tab switch | Slide + fade | 200ms | ease-in-out |
| Tooltip appear | Scale 0.9x to 1.0x + fade | 150ms | ease-out |

### Reward Reveal Sequences

#### Loot Box / Chest Opening
| Phase | Duration | Animation |
|-------|----------|-----------|
| Anticipation | 800ms | Shake intensity 0 to 0.5, glow pulse |
| Peak buildup | 400ms | Shake intensity 0.5 to 1.0, particles emit |
| Open action | 200ms | Lid opens, flash white |
| Item reveal | 300ms per item | Items fly out with stagger |
| Rarity indicator | 150ms | Color/particle burst by rarity |
| Settle | 500ms | Items land in display position |
| **Total** | **2000-2500ms** | Sweet spot for ceremony vs speed |

#### Daily Reward Claim
| Phase | Duration | Animation |
|-------|----------|-----------|
| Highlight current | 200ms | Scale 1.0x to 1.1x, glow |
| Claim action | 150ms | Scale 1.1x to 0.9x (press) |
| Burst | 100ms | Particles + flash |
| Fly to inventory | 300ms | Bezier curve path |
| Next day preview | 200ms | Shift calendar view |

### Victory/Defeat Sequences

#### Victory
| Phase | Duration | Animation |
|-------|----------|-----------|
| Freeze frame | 200ms | Gameplay pauses |
| Score tally begin | 100ms | UI elements appear |
| Stars/rating reveal | 300ms each | Staggered with particles |
| Score count up | 1000ms | Animated increment |
| Best score flash | 500ms | If new record, pulse effect |
| Continue prompt | 200ms | Fade in button |
| **Total** | **2500-3000ms** | Full victory celebration |

#### Defeat
| Phase | Duration | Animation |
|-------|----------|-----------|
| Death animation | 500ms | Character-specific |
| Screen fade/vignette | 300ms | Darken edges |
| "Game Over" text | 400ms | Scale in with bounce |
| Score display | 300ms | Fade in |
| Retry/Exit buttons | 200ms | Staggered fade in |
| **Total** | **1700-2000ms** | Respectful but not prolonged |

### Easing Curves Reference

| Name | Cubic Bezier | Use Case |
|------|--------------|----------|
| Linear | `(0.0, 0.0, 1.0, 1.0)` | Continuous rotation, progress bars |
| Ease In | `(0.4, 0.0, 1.0, 1.0)` | Elements leaving screen |
| Ease Out | `(0.0, 0.0, 0.2, 1.0)` | Elements entering screen |
| Ease In Out | `(0.4, 0.0, 0.2, 1.0)` | Navigation transitions |
| Ease Out Back | `(0.2, 0.8, 0.2, 1.0)` | Bouncy button release |
| Spring | Use spring animator | Natural physical motion |
| Bounce | Custom keyframes | Landing, celebration |

### Squash and Stretch Values

**Volume Conservation Principle**: X scale * Y scale should remain constant (approximately 1.0).

| Action | X Scale | Y Scale | Product | Duration |
|--------|---------|---------|---------|----------|
| Jump anticipation | 1.2 | 0.83 | 1.0 | 80ms |
| Jump stretch | 0.85 | 1.18 | 1.0 | During rise |
| Land squash | 1.3 | 0.77 | 1.0 | 60ms |
| Button press | 1.1 | 0.91 | 1.0 | 50ms |
| Bounce impact | 1.25 | 0.8 | 1.0 | 50ms |
| Stretch vertical | 0.9 | 1.11 | 1.0 | Variable |
| Wobble settle | 1.05/0.95 | 0.95/1.05 | 1.0 | 3 cycles, 80ms each |

### Anticipation Frame Counts

| Action | Anticipation Frames | At 60fps | Purpose |
|--------|---------------------|----------|---------|
| Jump | 5-6 frames | 83-100ms | Crouch before launch |
| Attack | 3-4 frames | 50-66ms | Wind-up before strike |
| Dash | 2-3 frames | 33-50ms | Brief pause before speed |
| Throw | 4-5 frames | 66-83ms | Arm back before release |
| Heavy attack | 8-12 frames | 133-200ms | Power move wind-up |

## Implementation Patterns

### SwiftUI Button Press Animation

```swift
import SwiftUI

struct GameButton: View {
    let title: String
    let action: () -> Void

    @State private var isPressed = false
    @State private var isDisabled = false

    var body: some View {
        Text(title)
            .font(.headline)
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
            .scaleEffect(isPressed ? 0.95 : 1.0)
            .opacity(isDisabled ? 0.5 : 1.0)
            .animation(
                isPressed
                    ? .easeOut(duration: 0.1)
                    : .interpolatingSpring(stiffness: 300, damping: 15),
                value: isPressed
            )
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in
                        guard !isDisabled else { return }
                        if !isPressed {
                            isPressed = true
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        }
                    }
                    .onEnded { _ in
                        guard !isDisabled else { return }
                        isPressed = false
                        action()
                    }
            )
    }
}
```

### SwiftUI Score Counter Animation

```swift
import SwiftUI

struct AnimatedScoreCounter: View {
    let targetScore: Int
    @State private var displayedScore: Int = 0
    @State private var scale: CGFloat = 1.0

    var body: some View {
        Text("\(displayedScore)")
            .font(.system(size: 48, weight: .bold, design: .rounded))
            .scaleEffect(scale)
            .onChange(of: targetScore) { newTarget in
                animateScore(to: newTarget)
            }
    }

    private func animateScore(to target: Int) {
        let startScore = displayedScore
        let delta = target - startScore
        let duration: Double = min(1.0, max(0.5, Double(abs(delta)) * 0.01))
        let steps = Int(duration * 60) // 60fps
        let stepDuration = duration / Double(steps)

        for step in 0...steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + stepDuration * Double(step)) {
                // Ease-in-out interpolation
                let t = Double(step) / Double(steps)
                let eased = t < 0.5
                    ? 2 * t * t
                    : 1 - pow(-2 * t + 2, 2) / 2

                displayedScore = startScore + Int(Double(delta) * eased)

                if step == steps {
                    // Pulse on complete
                    withAnimation(.easeOut(duration: 0.075)) {
                        scale = 1.15
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.075) {
                        withAnimation(.easeIn(duration: 0.075)) {
                            scale = 1.0
                        }
                    }
                }
            }
        }
    }
}
```

### SpriteKit Item Collection Animation

```swift
import SpriteKit

class CollectibleNode: SKSpriteNode {

    func collect(flyTo target: CGPoint, scoreLabel: SKLabelNode, completion: @escaping () -> Void) {
        // T+0ms: Touch detected (called externally)

        // T+5ms: Haptic (handled by caller)

        // T+10ms: Scale up
        let scaleUp = SKAction.scale(to: 1.3, duration: 0.05)
        scaleUp.timingMode = .easeOut

        // T+30ms: Start particles (handled by caller adding emitter)

        // T+60ms: Fly to counter with bezier path
        let flyAction = createBezierFlyAction(to: target, duration: 0.2)

        // Fade during flight
        let fadeOut = SKAction.fadeAlpha(to: 0, duration: 0.15)

        // Sequence with proper timing
        let wait10ms = SKAction.wait(forDuration: 0.01)
        let wait50ms = SKAction.wait(forDuration: 0.05)

        let flyGroup = SKAction.group([flyAction, fadeOut])

        let sequence = SKAction.sequence([
            wait10ms,
            scaleUp,
            wait50ms,
            flyGroup,
            SKAction.run {
                self.pulseScoreLabel(scoreLabel)
                completion()
            },
            SKAction.removeFromParent()
        ])

        run(sequence)
    }

    private func createBezierFlyAction(to target: CGPoint, duration: TimeInterval) -> SKAction {
        let start = position
        let control = CGPoint(
            x: (start.x + target.x) / 2,
            y: max(start.y, target.y) + 100 // Arc upward
        )

        return SKAction.customAction(withDuration: duration) { node, elapsedTime in
            let t = CGFloat(elapsedTime / duration)
            // Ease-in-out curve
            let eased = t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2

            // Quadratic bezier interpolation
            let x = (1-eased)*(1-eased)*start.x + 2*(1-eased)*eased*control.x + eased*eased*target.x
            let y = (1-eased)*(1-eased)*start.y + 2*(1-eased)*eased*control.y + eased*eased*target.y
            node.position = CGPoint(x: x, y: y)
        }
    }

    private func pulseScoreLabel(_ label: SKLabelNode) {
        let scaleUp = SKAction.scale(to: 1.2, duration: 0.075)
        let scaleDown = SKAction.scale(to: 1.0, duration: 0.075)
        scaleUp.timingMode = .easeOut
        scaleDown.timingMode = .easeIn
        label.run(SKAction.sequence([scaleUp, scaleDown]))
    }
}
```

### SpriteKit Character Jump with Squash/Stretch

```swift
import SpriteKit

class PlayerNode: SKSpriteNode {

    private var isGrounded = true
    private let originalSize: CGSize

    init(texture: SKTexture) {
        self.originalSize = texture.size()
        super.init(texture: texture, color: .clear, size: texture.size())
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func jump(velocity: CGFloat) {
        guard isGrounded else { return }
        isGrounded = false

        // Remove any existing animations
        removeAction(forKey: "squashStretch")

        // Anticipation: Squash (80ms)
        let anticipation = SKAction.customAction(withDuration: 0.08) { [weak self] _, elapsed in
            guard let self = self else { return }
            let t = CGFloat(elapsed / 0.08)
            let scaleX = 1.0 + (0.2 * t)  // 1.0 -> 1.2
            let scaleY = 1.0 - (0.17 * t) // 1.0 -> 0.83
            self.xScale = scaleX
            self.yScale = scaleY
        }

        // Launch stretch (50ms) + apply physics
        let launchStretch = SKAction.customAction(withDuration: 0.05) { [weak self] _, elapsed in
            guard let self = self else { return }
            let t = CGFloat(elapsed / 0.05)
            let scaleX = 1.2 - (0.35 * t) // 1.2 -> 0.85
            let scaleY = 0.83 + (0.35 * t) // 0.83 -> 1.18
            self.xScale = scaleX
            self.yScale = scaleY
        }

        let applyVelocity = SKAction.run { [weak self] in
            self?.physicsBody?.applyImpulse(CGVector(dx: 0, dy: velocity))
        }

        let launchGroup = SKAction.group([launchStretch, applyVelocity])

        // Gradual return to normal during rise
        let normalize = SKAction.customAction(withDuration: 0.15) { [weak self] _, elapsed in
            guard let self = self else { return }
            let t = CGFloat(elapsed / 0.15)
            let scaleX = 0.85 + (0.15 * t) // 0.85 -> 1.0
            let scaleY = 1.18 - (0.18 * t) // 1.18 -> 1.0
            self.xScale = scaleX
            self.yScale = scaleY
        }

        let sequence = SKAction.sequence([anticipation, launchGroup, normalize])
        run(sequence, withKey: "squashStretch")
    }

    func land() {
        isGrounded = true

        removeAction(forKey: "squashStretch")

        // Land squash (60ms)
        let squash = SKAction.customAction(withDuration: 0.06) { [weak self] _, elapsed in
            guard let self = self else { return }
            let t = CGFloat(elapsed / 0.06)
            let scaleX = 1.0 + (0.3 * t)  // 1.0 -> 1.3
            let scaleY = 1.0 - (0.23 * t) // 1.0 -> 0.77
            self.xScale = scaleX
            self.yScale = scaleY
        }

        // Recovery (100ms)
        let recovery = SKAction.customAction(withDuration: 0.1) { [weak self] _, elapsed in
            guard let self = self else { return }
            let t = CGFloat(elapsed / 0.1)
            let scaleX = 1.3 - (0.3 * t) // 1.3 -> 1.0
            let scaleY = 0.77 + (0.23 * t) // 0.77 -> 1.0
            self.xScale = scaleX
            self.yScale = scaleY
        }

        let sequence = SKAction.sequence([squash, recovery])
        run(sequence, withKey: "squashStretch")
    }
}
```

### SpriteKit Hit Reaction Animation

```swift
import SpriteKit

extension SKSpriteNode {

    func playHitReaction(knockbackDirection: CGVector = .zero) {
        // Flash white (50ms)
        let flashWhite = SKAction.colorize(with: .white, colorBlendFactor: 1.0, duration: 0)
        let holdFlash = SKAction.wait(forDuration: 0.05)
        let removeFlash = SKAction.colorize(withColorBlendFactor: 0, duration: 0.05)

        // Knockback (100ms)
        let knockback = SKAction.move(by: knockbackDirection, duration: 0.1)
        knockback.timingMode = .easeOut

        // Recovery (150ms)
        let recovery = SKAction.move(by: CGVector(dx: -knockbackDirection.dx, dy: -knockbackDirection.dy), duration: 0.15)
        recovery.timingMode = .easeIn

        let flashSequence = SKAction.sequence([flashWhite, holdFlash, removeFlash])
        let knockbackSequence = SKAction.sequence([knockback, recovery])

        run(SKAction.group([flashSequence, knockbackSequence]), withKey: "hitReaction")
    }

    func playInvulnerabilityFlash(duration: TimeInterval) {
        let flashOn = SKAction.fadeAlpha(to: 0.3, duration: 0.05)
        let flashOff = SKAction.fadeAlpha(to: 1.0, duration: 0.05)
        let singleFlash = SKAction.sequence([flashOn, flashOff])

        let flashCount = Int(duration / 0.1)
        let repeatFlash = SKAction.repeat(singleFlash, count: flashCount)

        run(repeatFlash, withKey: "invulnerability")
    }
}
```

### SwiftUI Reward Reveal Animation

```swift
import SwiftUI

struct RewardRevealView: View {
    @State private var phase: RevealPhase = .idle
    @State private var shakeIntensity: CGFloat = 0
    @State private var glowOpacity: CGFloat = 0
    @State private var chestScale: CGFloat = 1.0
    @State private var itemsRevealed: [Bool] = [false, false, false]

    let rewards: [Reward]
    let onComplete: () -> Void

    enum RevealPhase {
        case idle, anticipation, open, reveal, settle
    }

    var body: some View {
        ZStack {
            // Chest
            ChestView()
                .scaleEffect(chestScale)
                .modifier(ShakeModifier(intensity: shakeIntensity))
                .overlay(
                    Circle()
                        .fill(Color.yellow.opacity(glowOpacity))
                        .blur(radius: 30)
                )

            // Revealed items
            ForEach(0..<rewards.count, id: \.self) { index in
                if itemsRevealed[index] {
                    RewardItemView(reward: rewards[index])
                        .offset(y: -150 - CGFloat(index * 80))
                        .transition(.scale.combined(with: .opacity))
                }
            }
        }
        .onAppear(perform: startRevealSequence)
    }

    private func startRevealSequence() {
        // Phase 1: Anticipation (800ms)
        phase = .anticipation
        withAnimation(.easeInOut(duration: 0.8)) {
            shakeIntensity = 0.5
        }
        withAnimation(.easeInOut(duration: 0.4).repeatForever(autoreverses: true)) {
            glowOpacity = 0.3
        }

        // Phase 2: Peak buildup (400ms)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            withAnimation(.easeIn(duration: 0.4)) {
                shakeIntensity = 1.0
            }
        }

        // Phase 3: Open (200ms)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            phase = .open
            withAnimation(.easeOut(duration: 0.2)) {
                chestScale = 1.3
                glowOpacity = 1.0
            }
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        }

        // Phase 4: Items reveal (300ms each, staggered)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) {
            phase = .reveal
            for index in 0..<rewards.count {
                DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 0.3) {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                        itemsRevealed[index] = true
                    }
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                }
            }
        }

        // Phase 5: Settle (500ms)
        let totalRevealTime = 1.4 + Double(rewards.count) * 0.3
        DispatchQueue.main.asyncAfter(deadline: .now() + totalRevealTime) {
            phase = .settle
            withAnimation(.easeOut(duration: 0.5)) {
                chestScale = 1.0
                glowOpacity = 0
                shakeIntensity = 0
            }
        }

        // Complete
        DispatchQueue.main.asyncAfter(deadline: .now() + totalRevealTime + 0.5) {
            onComplete()
        }
    }
}

struct ShakeModifier: ViewModifier {
    let intensity: CGFloat
    @State private var offset: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .offset(x: offset)
            .onChange(of: intensity) { newValue in
                guard newValue > 0 else {
                    offset = 0
                    return
                }
                // Simple shake animation
                withAnimation(.linear(duration: 0.05).repeatForever(autoreverses: true)) {
                    offset = intensity * 5
                }
            }
    }
}
```

### Animation Choreography Helper

```swift
import SpriteKit

class AnimationChoreographer {

    struct AnimationStep {
        let delay: TimeInterval
        let duration: TimeInterval
        let action: SKAction
        let key: String?
    }

    static func choreograph(steps: [AnimationStep], on node: SKNode) {
        for step in steps {
            let delayedAction = SKAction.sequence([
                SKAction.wait(forDuration: step.delay),
                step.action
            ])

            if let key = step.key {
                node.run(delayedAction, withKey: key)
            } else {
                node.run(delayedAction)
            }
        }
    }

    static func victorySequence(
        scoreLabel: SKLabelNode,
        stars: [SKSpriteNode],
        finalScore: Int,
        isBestScore: Bool
    ) -> [AnimationStep] {
        var steps: [AnimationStep] = []

        // Freeze frame effect (handled by game scene)

        // Score tally begin (100ms delay)
        steps.append(AnimationStep(
            delay: 0.1,
            duration: 0,
            action: SKAction.fadeIn(withDuration: 0.2),
            key: "scoreFadeIn"
        ))

        // Stars reveal (300ms each, staggered starting at 300ms)
        for (index, star) in stars.enumerated() {
            let delay = 0.3 + (Double(index) * 0.3)
            steps.append(AnimationStep(
                delay: delay,
                duration: 0.3,
                action: createStarRevealAction(),
                key: "star\(index)"
            ))
        }

        // Score count (starts after stars, 1000ms)
        let starsEndTime = 0.3 + (Double(stars.count) * 0.3)
        steps.append(AnimationStep(
            delay: starsEndTime,
            duration: 1.0,
            action: createScoreCountAction(to: finalScore, label: scoreLabel),
            key: "scoreCount"
        ))

        // Best score flash (if applicable, 500ms)
        if isBestScore {
            steps.append(AnimationStep(
                delay: starsEndTime + 1.0,
                duration: 0.5,
                action: createBestScoreFlashAction(label: scoreLabel),
                key: "bestScore"
            ))
        }

        return steps
    }

    private static func createStarRevealAction() -> SKAction {
        let scaleIn = SKAction.scale(from: 0, to: 1.2, duration: 0.2)
        let settle = SKAction.scale(to: 1.0, duration: 0.1)
        scaleIn.timingMode = .easeOut
        settle.timingMode = .easeInEaseOut

        let rotate = SKAction.rotate(byAngle: .pi * 2, duration: 0.3)

        return SKAction.group([
            SKAction.sequence([scaleIn, settle]),
            rotate
        ])
    }

    private static func createScoreCountAction(to target: Int, label: SKLabelNode) -> SKAction {
        return SKAction.customAction(withDuration: 1.0) { node, elapsed in
            let t = elapsed / 1.0
            // Ease-in-out
            let eased = t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2
            let currentScore = Int(Double(target) * Double(eased))
            label.text = "\(currentScore)"
        }
    }

    private static func createBestScoreFlashAction(label: SKLabelNode) -> SKAction {
        let scaleUp = SKAction.scale(to: 1.3, duration: 0.15)
        let flash = SKAction.sequence([
            SKAction.colorize(with: .yellow, colorBlendFactor: 1.0, duration: 0.1),
            SKAction.colorize(withColorBlendFactor: 0, duration: 0.1)
        ])
        let scaleDown = SKAction.scale(to: 1.0, duration: 0.15)

        return SKAction.sequence([
            SKAction.group([scaleUp, flash]),
            scaleDown
        ])
    }
}
```

## Decision Trees

### When to Add Animation

```
Is this a user-initiated action?
├── YES: Does it provide feedback?
│   ├── NO feedback currently → ADD animation (100-150ms response)
│   └── Has feedback → Is feedback perceptible?
│       ├── NO → ADD animation or increase intensity
│       └── YES → KEEP current, don't over-animate
└── NO: Is this a system state change?
    ├── YES: Is it significant to gameplay?
    │   ├── YES → ADD animation (reward, damage, level complete)
    │   └── NO → SKIP or use subtle animation
    └── NO: Is it visual polish?
        ├── YES → ADD if under performance budget
        └── NO → SKIP
```

### Choosing Animation Duration

```
What is the purpose?
├── Immediate feedback (button, hit) → 50-150ms
├── State transition (menu, screen) → 200-400ms
├── Reward moment (collect, score) → 300-500ms
├── Celebration (victory, unlock) → 1000-3000ms
└── Atmospheric (idle, ambient) → 1000ms+ loop

Is this on tablet?
├── YES → Multiply by 1.3x
└── NO → Use base values

Is the player waiting?
├── YES (blocking) → Minimize duration
└── NO (parallel) → Use full ceremony
```

### Choosing Easing Curve

```
Motion direction?
├── Entering screen/appearing → Ease Out (fast start, slow end)
├── Leaving screen/disappearing → Ease In (slow start, fast end)
├── Moving between positions → Ease In Out (smooth both ends)
└── Bouncy/playful → Spring or Ease Out Back

Physical simulation?
├── Falling/gravity → Ease In (accelerate)
├── Thrown/launched → Ease Out (decelerate)
├── Elastic/rubber → Spring with damping
└── Mechanical/robotic → Linear
```

## Quality Checklist

### Button Animations
- [ ] Press provides immediate visual feedback within 100ms
- [ ] Scale change is perceptible (0.95x or less)
- [ ] Release has slight overshoot (1.05x) before settling
- [ ] Disabled state is visually distinct (0.5 opacity)
- [ ] Animation does not block touch recognition

### Collection Animations
- [ ] Sequence follows timing specification (haptic -> scale -> sound -> particles -> fly -> score)
- [ ] Collection sprite scales up before movement
- [ ] Flight path uses curved bezier, not linear
- [ ] UI counter pulses when item arrives
- [ ] Score increments with animated roll

### Screen Transitions
- [ ] Duration is 200-400ms (260-520ms on tablet)
- [ ] Easing matches motion direction
- [ ] Transition does not cause frame drops
- [ ] Interruptible where appropriate
- [ ] No jarring cuts or pops

### Character Feedback
- [ ] Hit reactions include flash + knockback + recovery
- [ ] Jump has anticipation squash before launch
- [ ] Land has visible squash + recovery
- [ ] Death animation respects player (not mocking)
- [ ] Squash/stretch maintains volume (X * Y approximately 1.0)

### Reward Reveals
- [ ] Total ceremony is 2-2.5 seconds
- [ ] Anticipation phase builds tension (shake, glow)
- [ ] Open moment has clear "pop" (flash, scale)
- [ ] Items appear with stagger (300ms each)
- [ ] Rarity indicated before full reveal

### Performance
- [ ] Animations run at 60fps minimum
- [ ] No frame drops during transitions
- [ ] Animation actions are pooled/reused where possible
- [ ] Complex animations use SKAction over manual updates

## Anti-Patterns

### Too Fast / No Animation
**Problem**: Button press has no visual feedback
**Consequence**: Game feels unresponsive, players double-tap
**Solution**: Add 100ms scale animation to 0.95x

### Too Slow
**Problem**: Screen transitions take 800ms+
**Consequence**: Game feels sluggish, players become impatient
**Solution**: Keep transitions under 400ms, use ease-in-out

### Linear Everything
**Problem**: All animations use linear timing
**Consequence**: Movement feels robotic and unnatural
**Solution**: Use ease-out for entering, ease-in for leaving, springs for bouncy

### Ignoring Volume Conservation
**Problem**: Squash makes character 1.5x wide but stays same height
**Consequence**: Character appears to grow/shrink unnaturally
**Solution**: If X is 1.3, Y should be approximately 0.77 (product = 1.0)

### Blocking Animations
**Problem**: Player cannot act during 3-second victory sequence
**Consequence**: Frustration, especially on replays
**Solution**: Allow skip or make non-blocking after first view

### Animation Overload
**Problem**: Every element animates constantly
**Consequence**: Visual noise, nothing stands out, eye fatigue
**Solution**: Animate purposefully - feedback, rewards, state changes only

### Mismatched Timing
**Problem**: Sound plays 200ms after visual impact
**Consequence**: Disconnect between audio and visual, feels laggy
**Solution**: Sync audio to visual within 20ms (see audio-designer skill)

## Adjacent Skills

- **haptic-optimizer**: Synchronize haptic feedback with animation keyframes (T+5ms in collection sequence)
- **audio-designer**: Align sound effects with animation events (T+15ms in collection sequence)
- **particle-effects**: Spawn particles at animation peaks (T+30ms in collection, impact moments)
- **screen-shake-impact**: Trigger camera shake at impact animations for heavy attacks/explosions
- **ui-transitions**: Coordinate screen-level transitions with element-level animations
- **juice-orchestrator**: Combine all polish elements into cohesive game feel
