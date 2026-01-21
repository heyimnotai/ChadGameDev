# Core Loop Architect - Code Patterns

## Swift Core Loop Manager

```swift
import Foundation

/// Core loop phase enumeration
enum LoopPhase: CaseIterable {
    case action
    case feedback
    case reward
    case progression
}

/// Protocol for genre-specific loop implementations
protocol CoreLoopProtocol {
    var currentPhase: LoopPhase { get }
    var microLoopDuration: TimeInterval { get }
    var macroLoopDuration: TimeInterval { get }

    func executeAction(_ input: PlayerInput) -> ActionResult
    func provideFeedback(_ result: ActionResult)
    func grantReward(_ result: ActionResult) -> Reward
    func updateProgression(_ reward: Reward)
}

/// Generic core loop manager
final class CoreLoopManager<T: CoreLoopProtocol> {
    private var loopImplementation: T
    private var loopsCompleted: Int = 0
    private var sessionStartTime: Date?

    private let feedbackDeadline: TimeInterval = 0.016 // 16ms (1 frame at 60fps)
    private let rewardDeadline: TimeInterval = 5.0 // 5 seconds max

    init(implementation: T) {
        self.loopImplementation = implementation
    }

    func startSession() {
        sessionStartTime = Date()
        loopsCompleted = 0
    }

    func processInput(_ input: PlayerInput) {
        let actionStart = CACurrentMediaTime()

        // Phase 1: Action
        let result = loopImplementation.executeAction(input)

        // Phase 2: Feedback (must complete within 16ms)
        let feedbackStart = CACurrentMediaTime()
        loopImplementation.provideFeedback(result)
        let feedbackDuration = CACurrentMediaTime() - feedbackStart

        if feedbackDuration > feedbackDeadline {
            print("Warning: Feedback exceeded \(feedbackDeadline * 1000)ms deadline")
        }

        // Phase 3: Reward (must complete within 5 seconds of action)
        let reward = loopImplementation.grantReward(result)
        let rewardTime = CACurrentMediaTime() - actionStart

        if rewardTime > rewardDeadline {
            print("Warning: Reward exceeded \(rewardDeadline)s deadline")
        }

        // Phase 4: Progression
        loopImplementation.updateProgression(reward)
        loopsCompleted += 1
    }

    func getSessionMetrics() -> LoopMetrics {
        guard let start = sessionStartTime else {
            return LoopMetrics(duration: 0, loopsCompleted: 0, avgLoopTime: 0)
        }

        let duration = Date().timeIntervalSince(start)
        let avgLoopTime = loopsCompleted > 0 ? duration / Double(loopsCompleted) : 0

        return LoopMetrics(
            duration: duration,
            loopsCompleted: loopsCompleted,
            avgLoopTime: avgLoopTime
        )
    }
}

struct LoopMetrics {
    let duration: TimeInterval
    let loopsCompleted: Int
    let avgLoopTime: TimeInterval
}

struct PlayerInput {
    let type: InputType
    let position: CGPoint?
    let timestamp: TimeInterval

    enum InputType {
        case tap
        case swipe(direction: Direction)
        case hold(duration: TimeInterval)
        case release
    }

    enum Direction {
        case up, down, left, right
    }
}

struct ActionResult {
    let success: Bool
    let magnitude: Float // 0.0 to 1.0
    let combo: Int
    let triggerReward: Bool
}

struct Reward {
    let type: RewardType
    let amount: Int
    let rarity: Rarity

    enum RewardType {
        case currency
        case experience
        case item
        case powerUp
    }

    enum Rarity {
        case common
        case uncommon
        case rare
        case epic
        case legendary
    }
}
```

## Hyper-Casual Loop Implementation

```swift
final class HyperCasualLoop: CoreLoopProtocol {
    var currentPhase: LoopPhase = .action

    // Genre-specific timing
    let microLoopDuration: TimeInterval = 2.0 // 2 seconds per attempt
    let macroLoopDuration: TimeInterval = 60.0 // 1 minute session

    private var score: Int = 0
    private var highScore: Int = 0
    private var nearMissCount: Int = 0

    func executeAction(_ input: PlayerInput) -> ActionResult {
        guard case .tap = input.type else {
            return ActionResult(success: false, magnitude: 0, combo: 0, triggerReward: false)
        }

        let success = evaluateTapTiming()
        let magnitude = calculateMagnitude()

        return ActionResult(
            success: success,
            magnitude: magnitude,
            combo: success ? 1 : 0,
            triggerReward: success
        )
    }

    func provideFeedback(_ result: ActionResult) {
        if result.success {
            triggerSuccessFeedback(magnitude: result.magnitude)
        } else {
            if result.magnitude > 0.7 {
                nearMissCount += 1
                triggerNearMissFeedback()
            } else {
                triggerFailureFeedback()
            }
        }
    }

    func grantReward(_ result: ActionResult) -> Reward {
        guard result.triggerReward else {
            return Reward(type: .experience, amount: 0, rarity: .common)
        }

        let points = Int(10.0 * result.magnitude)
        score += points

        return Reward(
            type: .currency,
            amount: points,
            rarity: result.magnitude > 0.9 ? .rare : .common
        )
    }

    func updateProgression(_ reward: Reward) {
        if score > highScore {
            highScore = score
            triggerNewHighScoreAnimation()
        }
    }

    private func evaluateTapTiming() -> Bool { true }
    private func calculateMagnitude() -> Float { Float.random(in: 0.5...1.0) }
    private func triggerSuccessFeedback(magnitude: Float) {}
    private func triggerNearMissFeedback() {}
    private func triggerFailureFeedback() {}
    private func triggerNewHighScoreAnimation() {}
}
```

## Roguelike Loop Implementation

```swift
final class RoguelikeLoop: CoreLoopProtocol {
    var currentPhase: LoopPhase = .action

    let microLoopDuration: TimeInterval = 1.0 // Kill every 1 second average
    let macroLoopDuration: TimeInterval = 1200.0 // 20 minute run

    private var currentXP: Int = 0
    private var level: Int = 1
    private var xpToNextLevel: Int = 10

    private let xpBase: Int = 10
    private let xpMultiplier: Float = 1.15

    private var killCount: Int = 0
    private var upgradesChosen: [Upgrade] = []

    func executeAction(_ input: PlayerInput) -> ActionResult {
        killCount += 1
        let isElite = killCount % 50 == 0

        return ActionResult(
            success: true,
            magnitude: isElite ? 1.0 : 0.3,
            combo: killCount,
            triggerReward: true
        )
    }

    func provideFeedback(_ result: ActionResult) {
        let hitStopDuration = result.magnitude > 0.5 ? 0.1 : 0.033
        applyHitStop(duration: hitStopDuration)
        spawnDamageNumber(magnitude: result.magnitude)
        spawnDeathParticles(count: Int(10 * result.magnitude))

        if result.magnitude > 0.5 {
            applyScreenShake(trauma: 0.3)
        }
    }

    func grantReward(_ result: ActionResult) -> Reward {
        let xpGain = result.magnitude > 0.5 ? 5 : 1
        currentXP += xpGain
        spawnXPGem(value: xpGain, magnetizeRadius: 100)

        return Reward(
            type: .experience,
            amount: xpGain,
            rarity: result.magnitude > 0.5 ? .rare : .common
        )
    }

    func updateProgression(_ reward: Reward) {
        if currentXP >= xpToNextLevel {
            levelUp()
        }
    }

    private func levelUp() {
        level += 1
        currentXP -= xpToNextLevel
        xpToNextLevel = calculateXPForLevel(level + 1)
        presentUpgradeSelection(count: 3)
    }

    private func calculateXPForLevel(_ level: Int) -> Int {
        return Int(Float(xpBase) * pow(xpMultiplier, Float(level - 1)))
    }

    private func presentUpgradeSelection(count: Int) {}
    private func applyHitStop(duration: TimeInterval) {}
    private func spawnDamageNumber(magnitude: Float) {}
    private func spawnDeathParticles(count: Int) {}
    private func applyScreenShake(trauma: Float) {}
    private func spawnXPGem(value: Int, magnetizeRadius: CGFloat) {}
}

struct Upgrade {
    let id: String
    let name: String
    let description: String
    let rarity: Reward.Rarity
}
```
