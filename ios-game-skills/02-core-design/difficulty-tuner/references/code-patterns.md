# Difficulty Tuner - Code Patterns

## Stair-Step Difficulty

```swift
struct StairStepDifficulty {
    let baseDifficulty: Double = 2.0
    let stepSize: Int = 5 // Levels per stair
    let peakIncrease: Double = 1.5 // Difficulty increase at peak
    let resetRatio: Double = 0.7 // Reset to 70% of peak

    func difficulty(forLevel level: Int) -> Double {
        let stairNumber = (level - 1) / stepSize
        let positionInStair = (level - 1) % stepSize

        let stairBase = baseDifficulty + (Double(stairNumber) * peakIncrease * resetRatio)
        let rampUp = (Double(positionInStair) / Double(stepSize - 1)) * peakIncrease

        return stairBase + rampUp
    }

    func isNewMechanicLevel(_ level: Int) -> Bool {
        return level > 1 && (level - 1) % stepSize == 0
    }
}
```

## Dynamic Difficulty Adjustment (DDA)

```swift
final class DynamicDifficultyAdjuster {
    struct Config {
        let minModifier: Double = 0.5      // Easiest: 50% of base
        let maxModifier: Double = 1.5      // Hardest: 150% of base
        let adjustmentStep: Double = 0.05  // 5% per adjustment
        let largeAdjustmentStep: Double = 0.1 // 10% for struggling
        let evaluationWindow: Int = 3

        let deathWeight: Double = 0.35
        let timeWeight: Double = 0.25
        let retryWeight: Double = 0.25
        let resourceWeight: Double = 0.15
    }

    private(set) var difficultyModifier: Double = 1.0
    private var recentPerformance: [LevelPerformance] = []
    private let config: Config

    struct LevelPerformance {
        let levelNumber: Int
        let deaths: Int
        let completionTime: TimeInterval
        let targetTime: TimeInterval
        let retries: Int
        let usedHelp: Bool
        let nearMisses: Int
    }

    init(config: Config = Config()) {
        self.config = config
    }

    func recordPerformance(_ performance: LevelPerformance) {
        recentPerformance.append(performance)

        if recentPerformance.count > config.evaluationWindow {
            recentPerformance.removeFirst()
        }

        let score = calculatePerformanceScore()
        adjustDifficulty(basedOn: score)
    }

    private func calculatePerformanceScore() -> Double {
        guard !recentPerformance.isEmpty else { return 0.5 }

        var totalScore: Double = 0

        for perf in recentPerformance {
            let deathScore = max(0, 1.0 - (Double(perf.deaths) / 3.0))
            let timeRatio = perf.completionTime / perf.targetTime
            let timeScore = max(0, min(1.0, 2.0 - timeRatio))
            let retryScore = max(0, 1.0 - (Double(perf.retries) / 5.0))
            let resourceScore = perf.usedHelp ? 0.5 : 1.0

            let levelScore = (deathScore * config.deathWeight) +
                           (timeScore * config.timeWeight) +
                           (retryScore * config.retryWeight) +
                           (resourceScore * config.resourceWeight)

            totalScore += levelScore
        }

        return totalScore / Double(recentPerformance.count)
    }

    private func adjustDifficulty(basedOn score: Double) {
        if score < 0.4 {
            difficultyModifier = max(config.minModifier, difficultyModifier - config.largeAdjustmentStep)
        } else if score > 0.8 {
            difficultyModifier = min(config.maxModifier, difficultyModifier + config.adjustmentStep)
        }
    }

    func applyModifier(toBaseDifficulty base: Double) -> Double {
        return base * difficultyModifier
    }

    func applyModifier(toTimeLimit base: TimeInterval) -> TimeInterval {
        return base / difficultyModifier
    }
}
```

## Fail-State Manager

```swift
final class FailStateManager {
    private var attemptCounts: [Int: Int] = [:]

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
            return FailResponse(showHint: false, hintText: nil, offerHelp: false, reduceDifficulty: false, offerSkip: false)
        case 2:
            return FailResponse(showHint: true, hintText: nil, offerHelp: false, reduceDifficulty: false, offerSkip: false)
        case 3:
            return FailResponse(showHint: true, hintText: getHintForLevel(levelID), offerHelp: false, reduceDifficulty: false, offerSkip: false)
        case 4:
            return FailResponse(showHint: true, hintText: getHintForLevel(levelID), offerHelp: true, reduceDifficulty: false, offerSkip: false)
        case 5:
            return FailResponse(showHint: true, hintText: getHintForLevel(levelID), offerHelp: true, reduceDifficulty: true, offerSkip: false)
        default:
            return FailResponse(showHint: true, hintText: getHintForLevel(levelID), offerHelp: true, reduceDifficulty: true, offerSkip: true)
        }
    }

    func recordSuccess(forLevel levelID: Int) {
        attemptCounts[levelID] = 0
    }

    private func getHintForLevel(_ levelID: Int) -> String {
        return "Hint for level \(levelID)"
    }
}
```

## Rubber-Banding

```swift
struct RubberBandingConfig {
    let maxSpeedBoost: Double = 1.2     // 20% speed increase
    let maxSpeedPenalty: Double = 0.9   // 10% speed decrease
    let activationDistance: Double = 100
    let fullEffectDistance: Double = 300
}

func calculateRubberBandModifier(
    playerPosition: Double,
    leaderPosition: Double,
    config: RubberBandingConfig
) -> Double {
    let distanceBehind = leaderPosition - playerPosition

    if distanceBehind <= 0 {
        let leadAmount = min(abs(distanceBehind), config.fullEffectDistance)
        let penaltyFactor = leadAmount / config.fullEffectDistance
        return 1.0 - ((1.0 - config.maxSpeedPenalty) * penaltyFactor)
    } else if distanceBehind < config.activationDistance {
        return 1.0
    } else {
        let behindAmount = min(distanceBehind - config.activationDistance,
                               config.fullEffectDistance - config.activationDistance)
        let boostRange = config.fullEffectDistance - config.activationDistance
        let boostFactor = behindAmount / boostRange
        return 1.0 + ((config.maxSpeedBoost - 1.0) * boostFactor)
    }
}
```

## Accessibility Settings

```swift
struct AccessibilitySettings {
    var difficultyPreset: DifficultyPreset = .normal
    var assistMode: Bool = false
    var autoAim: Bool = false
    var gameSpeed: Double = 1.0
    var pauseOnFocusLoss: Bool = true
    var highContrastMode: Bool = false
    var colorblindMode: ColorblindMode = .none
    var screenShakeIntensity: Double = 1.0
    var flashingReduced: Bool = false
    var audioCuesEnabled: Bool = false
    var subtitlesEnabled: Bool = false

    enum DifficultyPreset: Double {
        case story = 0.5
        case easy = 0.75
        case normal = 1.0
        case hard = 1.25
        case expert = 1.5
    }

    enum ColorblindMode {
        case none
        case protanopia
        case deuteranopia
        case tritanopia
    }

    func applyToDifficulty(_ base: Double) -> Double {
        var modified = base * difficultyPreset.rawValue
        if assistMode {
            modified *= 0.5
        }
        return modified
    }
}
```
