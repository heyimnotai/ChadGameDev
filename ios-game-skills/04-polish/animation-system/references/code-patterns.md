# Animation System Code Patterns

## SwiftUI Button Press Animation

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

## SwiftUI Score Counter Animation

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
        let steps = Int(duration * 60)
        let stepDuration = duration / Double(steps)

        for step in 0...steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + stepDuration * Double(step)) {
                let t = Double(step) / Double(steps)
                let eased = t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2
                displayedScore = startScore + Int(Double(delta) * eased)

                if step == steps {
                    withAnimation(.easeOut(duration: 0.075)) { scale = 1.15 }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.075) {
                        withAnimation(.easeIn(duration: 0.075)) { scale = 1.0 }
                    }
                }
            }
        }
    }
}
```

## SpriteKit Item Collection Animation

```swift
import SpriteKit

class CollectibleNode: SKSpriteNode {

    func collect(flyTo target: CGPoint, scoreLabel: SKLabelNode, completion: @escaping () -> Void) {
        let scaleUp = SKAction.scale(to: 1.3, duration: 0.05)
        scaleUp.timingMode = .easeOut

        let flyAction = createBezierFlyAction(to: target, duration: 0.2)
        let fadeOut = SKAction.fadeAlpha(to: 0, duration: 0.15)

        let wait10ms = SKAction.wait(forDuration: 0.01)
        let wait50ms = SKAction.wait(forDuration: 0.05)
        let flyGroup = SKAction.group([flyAction, fadeOut])

        let sequence = SKAction.sequence([
            wait10ms, scaleUp, wait50ms, flyGroup,
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
        let control = CGPoint(x: (start.x + target.x) / 2, y: max(start.y, target.y) + 100)

        return SKAction.customAction(withDuration: duration) { node, elapsedTime in
            let t = CGFloat(elapsedTime / duration)
            let eased = t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2
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

## SpriteKit Character Jump with Squash/Stretch

```swift
import SpriteKit

class PlayerNode: SKSpriteNode {

    private var isGrounded = true

    func jump(velocity: CGFloat) {
        guard isGrounded else { return }
        isGrounded = false
        removeAction(forKey: "squashStretch")

        // Anticipation: Squash (80ms)
        let anticipation = SKAction.customAction(withDuration: 0.08) { [weak self] _, elapsed in
            let t = CGFloat(elapsed / 0.08)
            self?.xScale = 1.0 + (0.2 * t)   // 1.0 -> 1.2
            self?.yScale = 1.0 - (0.17 * t)  // 1.0 -> 0.83
        }

        // Launch stretch (50ms)
        let launchStretch = SKAction.customAction(withDuration: 0.05) { [weak self] _, elapsed in
            let t = CGFloat(elapsed / 0.05)
            self?.xScale = 1.2 - (0.35 * t)   // 1.2 -> 0.85
            self?.yScale = 0.83 + (0.35 * t)  // 0.83 -> 1.18
        }

        let applyVelocity = SKAction.run { [weak self] in
            self?.physicsBody?.applyImpulse(CGVector(dx: 0, dy: velocity))
        }

        let normalize = SKAction.customAction(withDuration: 0.15) { [weak self] _, elapsed in
            let t = CGFloat(elapsed / 0.15)
            self?.xScale = 0.85 + (0.15 * t)
            self?.yScale = 1.18 - (0.18 * t)
        }

        let sequence = SKAction.sequence([anticipation, SKAction.group([launchStretch, applyVelocity]), normalize])
        run(sequence, withKey: "squashStretch")
    }

    func land() {
        isGrounded = true
        removeAction(forKey: "squashStretch")

        let squash = SKAction.customAction(withDuration: 0.06) { [weak self] _, elapsed in
            let t = CGFloat(elapsed / 0.06)
            self?.xScale = 1.0 + (0.3 * t)
            self?.yScale = 1.0 - (0.23 * t)
        }

        let recovery = SKAction.customAction(withDuration: 0.1) { [weak self] _, elapsed in
            let t = CGFloat(elapsed / 0.1)
            self?.xScale = 1.3 - (0.3 * t)
            self?.yScale = 0.77 + (0.23 * t)
        }

        run(SKAction.sequence([squash, recovery]), withKey: "squashStretch")
    }
}
```

## SpriteKit Hit Reaction Animation

```swift
import SpriteKit

extension SKSpriteNode {

    func playHitReaction(knockbackDirection: CGVector = .zero) {
        let flashWhite = SKAction.colorize(with: .white, colorBlendFactor: 1.0, duration: 0)
        let holdFlash = SKAction.wait(forDuration: 0.05)
        let removeFlash = SKAction.colorize(withColorBlendFactor: 0, duration: 0.05)

        let knockback = SKAction.move(by: knockbackDirection, duration: 0.1)
        knockback.timingMode = .easeOut

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
        run(SKAction.repeat(singleFlash, count: flashCount), withKey: "invulnerability")
    }
}
```

## SwiftUI Reward Reveal Animation

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

    enum RevealPhase { case idle, anticipation, open, reveal, settle }

    var body: some View {
        ZStack {
            ChestView()
                .scaleEffect(chestScale)
                .modifier(ShakeModifier(intensity: shakeIntensity))
                .overlay(Circle().fill(Color.yellow.opacity(glowOpacity)).blur(radius: 30))

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
        // Anticipation (800ms)
        withAnimation(.easeInOut(duration: 0.8)) { shakeIntensity = 0.5 }
        withAnimation(.easeInOut(duration: 0.4).repeatForever(autoreverses: true)) { glowOpacity = 0.3 }

        // Peak (400ms)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            withAnimation(.easeIn(duration: 0.4)) { shakeIntensity = 1.0 }
        }

        // Open (200ms)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            withAnimation(.easeOut(duration: 0.2)) { chestScale = 1.3; glowOpacity = 1.0 }
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        }

        // Items reveal (300ms each)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) {
            for index in 0..<rewards.count {
                DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 0.3) {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) { itemsRevealed[index] = true }
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                }
            }
        }

        // Settle and complete
        let totalTime = 1.4 + Double(rewards.count) * 0.3
        DispatchQueue.main.asyncAfter(deadline: .now() + totalTime) {
            withAnimation(.easeOut(duration: 0.5)) { chestScale = 1.0; glowOpacity = 0; shakeIntensity = 0 }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + totalTime + 0.5) { onComplete() }
    }
}
```

## Animation Choreography Helper

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

    static func victorySequence(scoreLabel: SKLabelNode, stars: [SKSpriteNode], finalScore: Int, isBestScore: Bool) -> [AnimationStep] {
        var steps: [AnimationStep] = []

        steps.append(AnimationStep(delay: 0.1, duration: 0, action: SKAction.fadeIn(withDuration: 0.2), key: "scoreFadeIn"))

        for (index, _) in stars.enumerated() {
            steps.append(AnimationStep(delay: 0.3 + (Double(index) * 0.3), duration: 0.3, action: createStarRevealAction(), key: "star\(index)"))
        }

        let starsEndTime = 0.3 + (Double(stars.count) * 0.3)
        steps.append(AnimationStep(delay: starsEndTime, duration: 1.0, action: createScoreCountAction(to: finalScore, label: scoreLabel), key: "scoreCount"))

        if isBestScore {
            steps.append(AnimationStep(delay: starsEndTime + 1.0, duration: 0.5, action: createBestScoreFlashAction(label: scoreLabel), key: "bestScore"))
        }

        return steps
    }

    private static func createStarRevealAction() -> SKAction {
        let scaleIn = SKAction.scale(from: 0, to: 1.2, duration: 0.2)
        let settle = SKAction.scale(to: 1.0, duration: 0.1)
        scaleIn.timingMode = .easeOut
        let rotate = SKAction.rotate(byAngle: .pi * 2, duration: 0.3)
        return SKAction.group([SKAction.sequence([scaleIn, settle]), rotate])
    }

    private static func createScoreCountAction(to target: Int, label: SKLabelNode) -> SKAction {
        return SKAction.customAction(withDuration: 1.0) { _, elapsed in
            let t = elapsed / 1.0
            let eased = t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2
            label.text = "\(Int(Double(target) * Double(eased)))"
        }
    }

    private static func createBestScoreFlashAction(label: SKLabelNode) -> SKAction {
        let scaleUp = SKAction.scale(to: 1.3, duration: 0.15)
        let flash = SKAction.sequence([
            SKAction.colorize(with: .yellow, colorBlendFactor: 1.0, duration: 0.1),
            SKAction.colorize(withColorBlendFactor: 0, duration: 0.1)
        ])
        let scaleDown = SKAction.scale(to: 1.0, duration: 0.15)
        return SKAction.sequence([SKAction.group([scaleUp, flash]), scaleDown])
    }
}
```
