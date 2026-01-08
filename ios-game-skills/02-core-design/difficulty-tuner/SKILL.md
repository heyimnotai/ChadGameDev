---
name: difficulty-tuner
description: Implement proper difficulty progression and dynamic difficulty adjustment (DDA) for iOS games. Use this skill when designing difficulty curves, implementing adaptive difficulty, creating fail-state handling, or balancing skill-based vs time-based progression. Triggers when players are churning due to frustration, breezing through content without engagement, or when difficulty feels unfair. Provides DDA algorithms in Swift, stair-step patterns, and accessibility options.
---

# Difficulty Tuner

## Purpose

This skill enables the design and implementation of difficulty systems that maintain player flow state across all skill levels. It enforces the quality bar of top-performing games by providing validated difficulty curve formulas, hidden DDA algorithms, and accessibility options that expand player reach without compromising core challenge. A well-tuned difficulty system is invisible to players but critical to retention.

## Domain Boundaries

- **This skill handles**: Difficulty curves, dynamic difficulty adjustment (DDA), fail-state design, rubber-banding, skill-based vs time-based progression, accessibility difficulty options, challenge-skill balance
- **This skill does NOT handle**: XP and progression curves (see `progression-system`), core loop design (see `core-loop-architect`), currency balancing (see `economy-balancer`), session pacing (see `session-designer`), onboarding flow (see `onboarding-architect`)

## Core Specifications

### Difficulty Curve Formulas

#### Linear Difficulty

```
difficulty(level) = base + (increment * level)
```

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| base | Starting difficulty | 1.0-2.0 |
| increment | Difficulty increase per level | 0.1-0.5 |

**Characteristics:**
- Predictable, easy to balance
- Can feel monotonous over time
- Works for short games (< 50 levels)

#### Exponential Difficulty

```
difficulty(level) = base * multiplier^(level - 1)
```

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| base | Starting difficulty | 1.0 |
| multiplier | Per-level scaling | 1.02-1.10 |

**Characteristics:**
- Feels fair early, challenging late
- Requires prestige or level cap
- Matches exponential player power growth

#### Logarithmic Difficulty (Diminishing Increases)

```
difficulty(level) = base + (coefficient * ln(level))
```

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| base | Starting difficulty | 1.0 |
| coefficient | Curve steepness | 0.5-2.0 |

**Characteristics:**
- Large early jumps, small late jumps
- Good for casual games
- Prevents late-game frustration

#### Stair-Step Difficulty (Recommended)

```
Pattern: Hard level followed by 5-6 easier levels

Stair-Step Example:
Level 1: Difficulty 2.0
Level 2: Difficulty 2.5
Level 3: Difficulty 3.0
Level 4: Difficulty 3.5 ← Peak difficulty
Level 5: Difficulty 2.5 ← New mechanic introduced (reset)
Level 6: Difficulty 3.0
Level 7: Difficulty 3.5
Level 8: Difficulty 4.0 ← New peak
```

**Implementation:**
```swift
struct StairStepDifficulty {
    let baseDifficulty: Double = 2.0
    let stepSize: Int = 5 // Levels per stair
    let peakIncrease: Double = 1.5 // Difficulty increase at peak
    let resetRatio: Double = 0.7 // Reset to 70% of peak

    func difficulty(forLevel level: Int) -> Double {
        let stairNumber = (level - 1) / stepSize
        let positionInStair = (level - 1) % stepSize

        // Base for this stair
        let stairBase = baseDifficulty + (Double(stairNumber) * peakIncrease * resetRatio)

        // Ramp up within stair
        let rampUp = (Double(positionInStair) / Double(stepSize - 1)) * peakIncrease

        return stairBase + rampUp
    }

    func isNewMechanicLevel(_ level: Int) -> Bool {
        return level > 1 && (level - 1) % stepSize == 0
    }
}
```

### Dynamic Difficulty Adjustment (DDA)

#### Core DDA Principles

1. **Hidden**: Players should not perceive adaptation (they game obvious systems)
2. **Gradual**: Adjust 5-15% per evaluation, not dramatic swings
3. **Bounded**: Define minimum and maximum difficulty bounds
4. **Reversible**: Difficulty can increase AND decrease based on performance

#### Player Performance Metrics

| Metric | Weight | Measurement |
|--------|--------|-------------|
| Deaths/Failures | High | Track per level/session |
| Completion Time | Medium | Compare to target time |
| Near-Misses | Medium | Close calls that succeed |
| Retries | High | Repeated attempts on same content |
| Idle Time | Low | Pauses may indicate confusion |
| Resource Usage | Medium | Using boosters/helps |

#### DDA Algorithm

```
Performance_Score = weighted_average(metrics)

If Performance_Score < 0.4:  // Struggling
    difficulty_modifier -= 0.1 (reduce by 10%)

If Performance_Score > 0.8:  // Dominating
    difficulty_modifier += 0.05 (increase by 5%)

Else:  // Flow state
    difficulty_modifier unchanged

Bounds: 0.5 <= difficulty_modifier <= 1.5
```

**Swift Implementation:**
```swift
final class DynamicDifficultyAdjuster {
    // MARK: - Configuration

    struct Config {
        let minModifier: Double = 0.5      // Easiest: 50% of base
        let maxModifier: Double = 1.5      // Hardest: 150% of base
        let adjustmentStep: Double = 0.05  // 5% per adjustment
        let largeAdjustmentStep: Double = 0.1 // 10% for struggling players
        let evaluationWindow: Int = 3       // Levels to consider

        // Metric weights (must sum to 1.0)
        let deathWeight: Double = 0.35
        let timeWeight: Double = 0.25
        let retryWeight: Double = 0.25
        let resourceWeight: Double = 0.15
    }

    // MARK: - State

    private(set) var difficultyModifier: Double = 1.0
    private var recentPerformance: [LevelPerformance] = []
    private let config: Config

    // MARK: - Initialization

    init(config: Config = Config()) {
        self.config = config
    }

    // MARK: - Performance Recording

    struct LevelPerformance {
        let levelNumber: Int
        let deaths: Int
        let completionTime: TimeInterval
        let targetTime: TimeInterval
        let retries: Int
        let usedHelp: Bool
        let nearMisses: Int
    }

    func recordPerformance(_ performance: LevelPerformance) {
        recentPerformance.append(performance)

        // Keep only recent levels
        if recentPerformance.count > config.evaluationWindow {
            recentPerformance.removeFirst()
        }

        // Evaluate and adjust
        let score = calculatePerformanceScore()
        adjustDifficulty(basedOn: score)
    }

    // MARK: - Score Calculation

    private func calculatePerformanceScore() -> Double {
        guard !recentPerformance.isEmpty else { return 0.5 }

        var totalScore: Double = 0

        for perf in recentPerformance {
            // Death score: 0 deaths = 1.0, 3+ deaths = 0.0
            let deathScore = max(0, 1.0 - (Double(perf.deaths) / 3.0))

            // Time score: under target = 1.0, 2x target = 0.0
            let timeRatio = perf.completionTime / perf.targetTime
            let timeScore = max(0, min(1.0, 2.0 - timeRatio))

            // Retry score: 0 retries = 1.0, 5+ retries = 0.0
            let retryScore = max(0, 1.0 - (Double(perf.retries) / 5.0))

            // Resource score: no help = 1.0, used help = 0.5
            let resourceScore = perf.usedHelp ? 0.5 : 1.0

            // Weighted average
            let levelScore = (deathScore * config.deathWeight) +
                           (timeScore * config.timeWeight) +
                           (retryScore * config.retryWeight) +
                           (resourceScore * config.resourceWeight)

            totalScore += levelScore
        }

        return totalScore / Double(recentPerformance.count)
    }

    // MARK: - Difficulty Adjustment

    private func adjustDifficulty(basedOn score: Double) {
        if score < 0.4 {
            // Player is struggling - decrease difficulty
            difficultyModifier = max(
                config.minModifier,
                difficultyModifier - config.largeAdjustmentStep
            )
        } else if score > 0.8 {
            // Player is dominating - increase difficulty
            difficultyModifier = min(
                config.maxModifier,
                difficultyModifier + config.adjustmentStep
            )
        }
        // 0.4-0.8: Flow state, no adjustment
    }

    // MARK: - Application

    func applyModifier(toBaseDifficulty base: Double) -> Double {
        return base * difficultyModifier
    }

    func applyModifier(toEnemyHealth base: Int) -> Int {
        return Int(Double(base) * difficultyModifier)
    }

    func applyModifier(toEnemyDamage base: Int) -> Int {
        return Int(Double(base) * difficultyModifier)
    }

    func applyModifier(toTimeLimit base: TimeInterval) -> TimeInterval {
        // Inverse: lower difficulty = more time
        return base / difficultyModifier
    }

    // MARK: - Debug

    var debugDescription: String {
        return "DDA Modifier: \(String(format: "%.2f", difficultyModifier)) " +
               "(\(recentPerformance.count) samples)"
    }
}
```

### Fail-State Design

#### Attempts Before Help

| Attempt # | Response |
|-----------|----------|
| 1 | Normal failure, encourage retry |
| 2 | Subtle hint (highlight mechanic) |
| 3 | Explicit tip ("Try X to defeat Y") |
| 4 | Offer help option (watch ad, use item) |
| 5 | Reduce difficulty for this attempt |
| 6+ | Offer skip option (if available) |

**Implementation:**
```swift
final class FailStateManager {
    private var attemptCounts: [Int: Int] = [:] // levelID: attempts

    struct FailResponse {
        let showHint: Bool
        let hintText: String?
        let offerHelp: Bool
        let reduceDifficulty: Bool
        let offerSkip: Bool
    }

    func recordFailure(forLevel levelID: Int) -> FailResponse {
        attemptCounts[levelID, default: 0] += 1
        let attempts = attemptCounts[levelID]!

        switch attempts {
        case 1:
            return FailResponse(
                showHint: false,
                hintText: nil,
                offerHelp: false,
                reduceDifficulty: false,
                offerSkip: false
            )

        case 2:
            return FailResponse(
                showHint: true,
                hintText: nil, // Subtle visual highlight
                offerHelp: false,
                reduceDifficulty: false,
                offerSkip: false
            )

        case 3:
            return FailResponse(
                showHint: true,
                hintText: getHintForLevel(levelID),
                offerHelp: false,
                reduceDifficulty: false,
                offerSkip: false
            )

        case 4:
            return FailResponse(
                showHint: true,
                hintText: getHintForLevel(levelID),
                offerHelp: true,
                reduceDifficulty: false,
                offerSkip: false
            )

        case 5:
            return FailResponse(
                showHint: true,
                hintText: getHintForLevel(levelID),
                offerHelp: true,
                reduceDifficulty: true,
                offerSkip: false
            )

        default: // 6+
            return FailResponse(
                showHint: true,
                hintText: getHintForLevel(levelID),
                offerHelp: true,
                reduceDifficulty: true,
                offerSkip: true
            )
        }
    }

    func recordSuccess(forLevel levelID: Int) {
        attemptCounts[levelID] = 0
    }

    private func getHintForLevel(_ levelID: Int) -> String {
        // Return level-specific hint from configuration
        return "Hint for level \(levelID)"
    }
}
```

### Rubber-Banding Techniques

#### Racing/Competitive Rubber-Banding

```swift
struct RubberBandingConfig {
    let maxSpeedBoost: Double = 1.2     // 20% speed increase
    let maxSpeedPenalty: Double = 0.9   // 10% speed decrease
    let activationDistance: Double = 100 // Units behind leader
    let fullEffectDistance: Double = 300 // Maximum effect distance
}

func calculateRubberBandModifier(
    playerPosition: Double,
    leaderPosition: Double,
    config: RubberBandingConfig
) -> Double {
    let distanceBehind = leaderPosition - playerPosition

    if distanceBehind <= 0 {
        // Player is leading - slight penalty
        let leadAmount = min(abs(distanceBehind), config.fullEffectDistance)
        let penaltyFactor = leadAmount / config.fullEffectDistance
        return 1.0 - ((1.0 - config.maxSpeedPenalty) * penaltyFactor)
    } else if distanceBehind < config.activationDistance {
        // Close to leader - no effect
        return 1.0
    } else {
        // Behind - boost
        let behindAmount = min(distanceBehind - config.activationDistance,
                               config.fullEffectDistance - config.activationDistance)
        let boostRange = config.fullEffectDistance - config.activationDistance
        let boostFactor = behindAmount / boostRange
        return 1.0 + ((config.maxSpeedBoost - 1.0) * boostFactor)
    }
}
```

#### AI Opponent Rubber-Banding

```swift
final class AIOpponent {
    var baseSkillLevel: Double = 1.0
    var rubberBandEnabled: Bool = true

    struct MatchState {
        let playerScore: Int
        let aiScore: Int
        let timeRemaining: TimeInterval
        let totalTime: TimeInterval
    }

    func effectiveSkill(given state: MatchState) -> Double {
        guard rubberBandEnabled else { return baseSkillLevel }

        let scoreDifference = state.playerScore - state.aiScore
        let timeProgress = 1.0 - (state.timeRemaining / state.totalTime)

        // More rubber-banding late in match
        let timeMultiplier = 0.5 + (timeProgress * 0.5)

        if scoreDifference > 3 {
            // Player winning big - AI gets better
            let boost = min(0.3, Double(scoreDifference - 3) * 0.05)
            return baseSkillLevel + (boost * timeMultiplier)
        } else if scoreDifference < -3 {
            // AI winning big - AI gets worse
            let penalty = min(0.2, Double(abs(scoreDifference) - 3) * 0.04)
            return baseSkillLevel - (penalty * timeMultiplier)
        }

        return baseSkillLevel
    }
}
```

### Skill-Based vs Time-Based Progression

| Aspect | Skill-Based | Time-Based |
|--------|-------------|------------|
| Advancement | Performance determines progress | Time/attempts determine progress |
| Player Feel | Mastery-oriented, can be frustrating | Inevitable progress, can feel hollow |
| Audience | Core/hardcore gamers | Casual gamers |
| Retention | High for skilled, low for struggling | Broad but shallow engagement |
| Monetization | Skill-assists (practice modes) | Time-acceleration (skip content) |

**Hybrid Approach (Recommended):**
```swift
enum ProgressionMode {
    case pureSkill      // Must meet skill requirement
    case pureTime       // Will unlock eventually
    case hybrid         // Skill speeds up, time guarantees

    func canProgress(
        skillScore: Double,    // 0-1, player's performance
        attempts: Int,         // Times tried
        skillThreshold: Double // Required for pure skill
    ) -> Bool {
        switch self {
        case .pureSkill:
            return skillScore >= skillThreshold

        case .pureTime:
            return true // Always can progress

        case .hybrid:
            // Lower threshold with more attempts
            let adjustedThreshold = max(0.3, skillThreshold - (Double(attempts) * 0.05))
            return skillScore >= adjustedThreshold || attempts >= 10
        }
    }
}
```

### Accessibility Difficulty Options

#### Required Options (App Store Expectations)

| Option | Description | Implementation |
|--------|-------------|----------------|
| **Difficulty Presets** | Easy/Normal/Hard | Multiplier on all difficulty values |
| **Assist Mode** | Invincibility/Skip options | Toggle for struggling players |
| **Time Controls** | Pause, slow motion | Accessibility for motor impairment |
| **Visual Assists** | High contrast, colorblind modes | See accessibility guidelines |
| **Audio Cues** | Sound indicators for visual events | Hearing accessibility |

#### Implementation

```swift
struct AccessibilitySettings {
    // Difficulty
    var difficultyPreset: DifficultyPreset = .normal
    var assistMode: Bool = false
    var autoAim: Bool = false

    // Time
    var gameSpeed: Double = 1.0 // 0.5 to 2.0
    var pauseOnFocusLoss: Bool = true

    // Visual
    var highContrastMode: Bool = false
    var colorblindMode: ColorblindMode = .none
    var screenShakeIntensity: Double = 1.0 // 0 to disable
    var flashingReduced: Bool = false

    // Audio
    var audioCuesEnabled: Bool = false
    var subtitlesEnabled: Bool = false

    enum DifficultyPreset: Double {
        case story = 0.5      // 50% difficulty
        case easy = 0.75      // 75% difficulty
        case normal = 1.0     // 100% difficulty
        case hard = 1.25      // 125% difficulty
        case expert = 1.5     // 150% difficulty
    }

    enum ColorblindMode {
        case none
        case protanopia   // Red-blind
        case deuteranopia // Green-blind
        case tritanopia   // Blue-blind
    }

    func applyToDifficulty(_ base: Double) -> Double {
        var modified = base * difficultyPreset.rawValue

        if assistMode {
            modified *= 0.5 // Additional 50% reduction
        }

        return modified
    }
}

final class AccessibilityManager {
    static let shared = AccessibilityManager()

    var settings = AccessibilitySettings() {
        didSet { saveSettings() }
    }

    func applyToGameScene(_ scene: GameScene) {
        // Apply game speed
        scene.speed = CGFloat(settings.gameSpeed)

        // Apply screen shake
        scene.screenShakeMultiplier = settings.screenShakeIntensity

        // Apply color filters if needed
        if settings.colorblindMode != .none {
            scene.applyColorblindFilter(settings.colorblindMode)
        }
    }

    private func saveSettings() {
        // Persist to UserDefaults
    }
}

// Usage in game
class GameScene: SKScene {
    var screenShakeMultiplier: Double = 1.0

    func applyColorblindFilter(_ mode: AccessibilitySettings.ColorblindMode) {
        // Apply appropriate color matrix filter
    }

    func takeDamage(_ amount: Int) {
        let accessibilityManager = AccessibilityManager.shared
        let adjustedDamage = Int(Double(amount) *
                                 accessibilityManager.settings.difficultyPreset.rawValue)

        if accessibilityManager.settings.assistMode && health - adjustedDamage <= 0 {
            health = 1 // Prevent death in assist mode
        } else {
            health -= adjustedDamage
        }
    }
}
```

### Complete DDA System

```swift
import Foundation

/// Complete Dynamic Difficulty Adjustment system
final class DDASys {
    // MARK: - Configuration

    struct Config {
        // Adjustment bounds
        let minModifier: Double = 0.5
        let maxModifier: Double = 1.5

        // Adjustment rates
        let decreaseRate: Double = 0.1   // When struggling
        let increaseRate: Double = 0.05  // When dominating

        // Performance thresholds
        let strugglingThreshold: Double = 0.4
        let dominatingThreshold: Double = 0.8

        // Sample window
        let evaluationWindow: Int = 5

        // Metric weights
        let weights = MetricWeights()

        struct MetricWeights {
            let deaths: Double = 0.30
            let time: Double = 0.25
            let retries: Double = 0.25
            let resources: Double = 0.10
            let nearMisses: Double = 0.10
        }
    }

    // MARK: - Metrics

    struct LevelMetrics {
        let deaths: Int
        let completionTime: TimeInterval
        let targetTime: TimeInterval
        let retries: Int
        let resourcesUsed: Int
        let maxResources: Int
        let nearMisses: Int
        let totalAttempts: Int
    }

    // MARK: - State

    private let config: Config
    private var metricHistory: [LevelMetrics] = []
    private(set) var currentModifier: Double = 1.0
    private(set) var adjustmentHistory: [(timestamp: Date, modifier: Double)] = []

    // MARK: - Initialization

    init(config: Config = Config()) {
        self.config = config
    }

    // MARK: - Recording

    func recordLevelCompletion(_ metrics: LevelMetrics) {
        metricHistory.append(metrics)

        // Trim to window size
        while metricHistory.count > config.evaluationWindow {
            metricHistory.removeFirst()
        }

        // Calculate and adjust
        let score = calculatePerformanceScore()
        adjust(basedOn: score)
    }

    // MARK: - Scoring

    private func calculatePerformanceScore() -> Double {
        guard !metricHistory.isEmpty else { return 0.5 }

        var scores: [Double] = []

        for metrics in metricHistory {
            let deathScore = calculateDeathScore(metrics.deaths)
            let timeScore = calculateTimeScore(
                completion: metrics.completionTime,
                target: metrics.targetTime
            )
            let retryScore = calculateRetryScore(metrics.retries)
            let resourceScore = calculateResourceScore(
                used: metrics.resourcesUsed,
                max: metrics.maxResources
            )
            let nearMissScore = calculateNearMissScore(
                nearMisses: metrics.nearMisses,
                attempts: metrics.totalAttempts
            )

            let weightedScore =
                (deathScore * config.weights.deaths) +
                (timeScore * config.weights.time) +
                (retryScore * config.weights.retries) +
                (resourceScore * config.weights.resources) +
                (nearMissScore * config.weights.nearMisses)

            scores.append(weightedScore)
        }

        // Weight recent scores more heavily
        var weightedSum: Double = 0
        var weightSum: Double = 0

        for (index, score) in scores.enumerated() {
            let weight = Double(index + 1) // More recent = higher weight
            weightedSum += score * weight
            weightSum += weight
        }

        return weightedSum / weightSum
    }

    private func calculateDeathScore(_ deaths: Int) -> Double {
        // 0 deaths = 1.0, 5+ deaths = 0.0
        return max(0, 1.0 - (Double(deaths) / 5.0))
    }

    private func calculateTimeScore(completion: TimeInterval, target: TimeInterval) -> Double {
        // Under target = 1.0, 3x target = 0.0
        let ratio = completion / target
        return max(0, min(1.0, (3.0 - ratio) / 2.0))
    }

    private func calculateRetryScore(_ retries: Int) -> Double {
        // 0 retries = 1.0, 5+ retries = 0.0
        return max(0, 1.0 - (Double(retries) / 5.0))
    }

    private func calculateResourceScore(used: Int, max: Int) -> Double {
        // No resources used = 1.0, all resources used = 0.3
        guard max > 0 else { return 1.0 }
        let usageRatio = Double(used) / Double(max)
        return 1.0 - (usageRatio * 0.7)
    }

    private func calculateNearMissScore(nearMisses: Int, attempts: Int) -> Double {
        // High near-miss ratio = skilled player barely succeeding
        guard attempts > 0 else { return 0.5 }
        let ratio = Double(nearMisses) / Double(attempts)
        // Near misses indicate skill, but also challenge
        return 0.3 + (ratio * 0.4) // 0.3 to 0.7 range
    }

    // MARK: - Adjustment

    private func adjust(basedOn score: Double) {
        let previousModifier = currentModifier

        if score < config.strugglingThreshold {
            // Player struggling - make easier
            currentModifier = max(
                config.minModifier,
                currentModifier - config.decreaseRate
            )
        } else if score > config.dominatingThreshold {
            // Player dominating - make harder
            currentModifier = min(
                config.maxModifier,
                currentModifier + config.increaseRate
            )
        }

        // Log adjustment
        if currentModifier != previousModifier {
            adjustmentHistory.append((Date(), currentModifier))
        }
    }

    // MARK: - Application

    func apply(toEnemyHealth base: Int) -> Int {
        return Int(Double(base) * currentModifier)
    }

    func apply(toEnemyDamage base: Int) -> Int {
        return Int(Double(base) * currentModifier)
    }

    func apply(toEnemySpeed base: Double) -> Double {
        // Speed scales less aggressively
        let adjustedModifier = 1.0 + ((currentModifier - 1.0) * 0.5)
        return base * adjustedModifier
    }

    func apply(toSpawnRate base: TimeInterval) -> TimeInterval {
        // Lower modifier = slower spawns = easier
        return base / currentModifier
    }

    func apply(toTimeLimit base: TimeInterval) -> TimeInterval {
        // Lower modifier = more time = easier
        return base * (2.0 - currentModifier)
    }

    func apply(toAimAssist base: Double) -> Double {
        // Lower modifier = more aim assist = easier
        return base * (2.0 - currentModifier)
    }

    // MARK: - Reset

    func reset() {
        currentModifier = 1.0
        metricHistory.removeAll()
    }

    // MARK: - Debug

    func getDebugInfo() -> String {
        let recentScore = calculatePerformanceScore()
        return """
        DDA Status:
        - Current Modifier: \(String(format: "%.2f", currentModifier))
        - Recent Performance: \(String(format: "%.2f", recentScore))
        - Samples: \(metricHistory.count)/\(config.evaluationWindow)
        - Total Adjustments: \(adjustmentHistory.count)
        """
    }
}
```

## Decision Trees

### Difficulty Curve Selection

```
START: What is the game genre?

[Hyper-Casual]
    -> LINEAR curve with gentle slope
    -> Reset on death (no cumulative difficulty)
    -> Session-based, not level-based

[Puzzle]
    -> STAIR-STEP pattern
    -> New mechanic = difficulty reset
    -> Hard level every 5-6 levels

[Action/Roguelike]
    -> EXPONENTIAL within run
    -> Meta-progression reduces effective difficulty
    -> DDA for real-time adjustment

[Idle/Incremental]
    -> EXPONENTIAL (matches currency growth)
    -> Prestige resets difficulty
    -> Player-controlled pacing

[Strategy]
    -> LOGARITHMIC (diminishing difficulty growth)
    -> Multiple difficulty axes (economy, combat, management)
    -> Player-selected challenge level
```

### DDA Activation Decision

```
START: Should DDA be enabled?

[Competitive/Ranked mode]
    -> NO - Skill measurement requires consistent difficulty
    -> Exception: Matchmaking IS difficulty adjustment

[Story/Campaign mode]
    -> YES - Player should experience narrative
    -> Bound modifier to 0.7-1.3 range
    -> Faster decrease than increase

[Endless/High-score mode]
    -> PARTIAL - DDA on early game only
    -> Disable above certain score threshold
    -> Let skilled players prove themselves

[Tutorial/FTUE]
    -> AGGRESSIVE YES - Ensure completion
    -> Bound modifier to 0.5-1.0 (only easier)
    -> Reset to 1.0 after tutorial
```

### When to Offer Help

```
START: Player just failed

[Attempt 1-2]
    -> Encourage retry, no help
    -> "Try again!"

[Attempt 3]
    -> Subtle hint (visual highlight)
    -> No explicit text

[Attempt 4]
    -> Explicit tip
    -> "Try using X against Y"

[Attempt 5]
    -> Offer optional help
    -> "Watch ad for hint" or "Use booster?"

[Attempt 6+]
    -> Offer skip (if available)
    -> Reduce difficulty automatically
    -> "Would you like to skip this level?"
```

## Quality Checklist

### Difficulty Curve
- [ ] First 5 levels achievable by 95% of players
- [ ] Difficulty resets with new mechanics
- [ ] No difficulty spike > 50% between adjacent levels
- [ ] Hard levels followed by 5-6 easier levels
- [ ] End-game content challenges even skilled players

### DDA System
- [ ] DDA is invisible to players
- [ ] Adjustment bounded (0.5x to 1.5x range)
- [ ] Multiple metrics inform adjustment
- [ ] More aggressive at decreasing than increasing
- [ ] Can be disabled for competitive modes

### Fail States
- [ ] Help offered after 3+ failures
- [ ] Skip option available after 6+ failures
- [ ] Failure feedback is encouraging, not punishing
- [ ] Death/failure animation < 1 second
- [ ] Retry available in < 2 seconds

### Accessibility
- [ ] At least 3 difficulty presets (Easy/Normal/Hard)
- [ ] Assist mode available for struggling players
- [ ] Screen shake can be reduced/disabled
- [ ] Game speed adjustable
- [ ] No content locked behind difficulty

## Anti-Patterns

### Anti-Pattern: Obvious DDA

**Wrong:**
```
Player dies 3 times
"EASY MODE ACTIVATED"
Enemies visibly weaker/slower
Player feels patronized
```

**Right:**
```
Player dies 3 times
(Silently) Enemy health reduced 10%
(Silently) Spawn rate decreased
Player succeeds, feels accomplished
```

**Consequence:** Players game obvious systems. If they know DDA exists, they'll die intentionally. Keep it hidden.

### Anti-Pattern: Difficulty Wall

**Wrong:**
```
Level 49: Difficulty 5.0
Level 50: Difficulty 15.0 (boss level)
90% of players quit at level 50
```

**Right:**
```
Level 49: Difficulty 5.0
Level 50: Difficulty 6.5 (boss, but manageable)
Level 51: Difficulty 4.0 (relief)
```

**Consequence:** Difficulty spikes cause churn. Boss levels should be challenging, not three times harder than previous content.

### Anti-Pattern: No Recovery

**Wrong:**
```swift
// DDA only increases difficulty
if performance > 0.8 {
    modifier += 0.1
}
// Player gets stuck at high difficulty forever
```

**Right:**
```swift
if performance < 0.4 {
    modifier -= 0.1 // Can decrease!
} else if performance > 0.8 {
    modifier += 0.05 // Slower increase
}
```

**Consequence:** Players who have one good streak get stuck at impossible difficulty. DDA must be bidirectional.

### Anti-Pattern: Punishing Tutorial

**Wrong:**
```
Tutorial Level 3: "Now combine both mechanics!"
Player dies 10 times
No hints offered
Player uninstalls
```

**Right:**
```
Tutorial Level 3: "Now combine both mechanics!"
Attempt 3: Highlight the solution area
Attempt 5: Show step-by-step
Attempt 7: Auto-complete option
```

**Consequence:** Tutorials must be completable by everyone. This is where DDA should be most aggressive.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `core-loop-architect` | Difficulty affects core loop satisfaction |
| `progression-system` | Power curves must align with difficulty curves |
| `session-designer` | Difficulty spikes affect session length |
| `onboarding-architect` | Tutorial difficulty is critical for D1 retention |
| `flow-state-engineer` | Difficulty directly determines flow state |
| `accessibility-designer` | Difficulty options are accessibility features |
