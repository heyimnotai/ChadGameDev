# Progression System - Code Patterns

## Hybrid XP Curve

```swift
struct HybridXPCurve {
    let earlyThreshold: Int = 10
    let midThreshold: Int = 40
    let earlyBase: Double = 20
    let earlyExponent: Double = 0.7
    let midBase: Double = 50
    let lateBase: Double = 10
    let lateExponent: Double = 1.8

    func xpRequired(forLevel level: Int) -> Int {
        if level <= earlyThreshold {
            return Int(earlyBase * pow(Double(level), earlyExponent))
        } else if level <= midThreshold {
            return Int(midBase * Double(level))
        } else {
            return Int(lateBase * pow(Double(level), lateExponent))
        }
    }

    func totalXPToLevel(_ targetLevel: Int) -> Int {
        return (1..<targetLevel).reduce(0) { total, level in
            total + xpRequired(forLevel: level)
        }
    }
}
```

## Unlock Schedule

```swift
struct UnlockSchedule {
    let totalItems: Int
    let maxLevel: Int
    let pacingCurve: Double

    func unlockLevel(forItem index: Int) -> Int {
        guard index > 0 && index <= totalItems else { return 0 }
        let progress = Double(index) / Double(totalItems)
        let curvedProgress = pow(progress, pacingCurve)
        return Int(floor(Double(maxLevel) * curvedProgress))
    }

    func itemsUnlockedAt(level: Int) -> [Int] {
        return (1...totalItems).filter { unlockLevel(forItem: $0) <= level }
    }
}
```

## Power Curve with Diminishing Returns

```swift
struct PowerCurve {
    let basePower: Double = 100
    let maxLevel: Int
    let targetMaxPower: Double

    var powerPerLevel: Double {
        return (targetMaxPower - 1.0) / Double(maxLevel)
    }

    func effectivePower(atLevel level: Int) -> Double {
        return basePower * (1.0 + powerPerLevel * Double(level))
    }
}

func diminishingReturns(investment: Double, maxStat: Double, k: Double = 0.05) -> Double {
    return maxStat * (1.0 - exp(-k * investment))
}
```

## Prestige Patterns

```swift
enum PrestigePattern {
    case linear(bonusPerReset: Double)
    case diminishing(baseBonus: Double, factor: Double)
    case asymptotic(maxBonus: Double, rate: Double)

    func bonus(forResets resets: Int) -> Double {
        switch self {
        case .linear(let bonusPerReset):
            return bonusPerReset * Double(resets)
        case .diminishing(let baseBonus, let factor):
            return baseBonus * pow(Double(resets), factor)
        case .asymptotic(let maxBonus, let rate):
            return maxBonus * (1.0 - exp(-rate * Double(resets)))
        }
    }
}
```

## Complete Progression Manager

```swift
final class ProgressionManager {
    struct Config {
        let xpCurve: XPCurveType
        let maxLevel: Int
        let softCapLevel: Int?
        let prestigeEnabled: Bool
        let prestigePattern: PrestigePattern?

        enum XPCurveType {
            case linear(base: Int)
            case polynomial(base: Double, exponent: Double)
            case exponential(base: Int, multiplier: Double)
            case hybrid(HybridXPCurve)
        }
    }

    private(set) var currentXP: Int = 0
    private(set) var currentLevel: Int = 1
    private(set) var prestigeCount: Int = 0
    private(set) var totalXPEarned: Int = 0
    private let config: Config

    init(config: Config) {
        self.config = config
    }

    func xpRequiredForLevel(_ level: Int) -> Int {
        switch config.xpCurve {
        case .linear(let base):
            return base * level
        case .polynomial(let base, let exponent):
            return Int(base * pow(Double(level), exponent))
        case .exponential(let base, let multiplier):
            return Int(Double(base) * pow(multiplier, Double(level - 1)))
        case .hybrid(let curve):
            return curve.xpRequired(forLevel: level)
        }
    }

    func grantXP(_ amount: Int) -> XPGrantResult {
        var effectiveAmount = applyPrestigeBonus(amount)
        effectiveAmount = applySoftCap(effectiveAmount)
        currentXP += effectiveAmount
        totalXPEarned += effectiveAmount

        var levelsGained = 0
        var unlockedItems: [String] = []

        while currentXP >= xpRequiredForLevel(currentLevel) &&
              currentLevel < config.maxLevel {
            currentXP -= xpRequiredForLevel(currentLevel)
            currentLevel += 1
            levelsGained += 1
            unlockedItems.append(contentsOf: getUnlocksForLevel(currentLevel))
        }

        if currentLevel >= config.maxLevel { currentXP = 0 }

        return XPGrantResult(
            xpGranted: effectiveAmount,
            levelsGained: levelsGained,
            newLevel: currentLevel,
            progressToNext: Double(currentXP) / Double(xpRequiredForLevel(currentLevel)),
            unlockedItems: unlockedItems
        )
    }

    private func applyPrestigeBonus(_ xp: Int) -> Int {
        guard let pattern = config.prestigePattern, prestigeCount > 0 else { return xp }
        return Int(Double(xp) * (1.0 + pattern.bonus(forResets: prestigeCount)))
    }

    private func applySoftCap(_ xp: Int) -> Int {
        guard let softCap = config.softCapLevel, currentLevel >= softCap else { return xp }
        return Int(Double(xp) * 0.25)
    }

    private func getUnlocksForLevel(_ level: Int) -> [String] { [] }

    func canPrestige() -> Bool {
        guard config.prestigeEnabled else { return false }
        return currentLevel >= config.maxLevel ||
               (config.softCapLevel != nil && currentLevel >= config.softCapLevel!)
    }

    func prestige() -> PrestigeResult? {
        guard canPrestige(), let pattern = config.prestigePattern else { return nil }
        let previousBonus = pattern.bonus(forResets: prestigeCount)
        prestigeCount += 1
        let newBonus = pattern.bonus(forResets: prestigeCount)
        let previousLevel = currentLevel
        currentLevel = 1
        currentXP = 0
        return PrestigeResult(
            prestigeLevel: prestigeCount,
            previousLevel: previousLevel,
            bonusGained: newBonus - previousBonus,
            totalBonus: newBonus
        )
    }
}

struct XPGrantResult {
    let xpGranted: Int
    let levelsGained: Int
    let newLevel: Int
    let progressToNext: Double
    let unlockedItems: [String]
    var didLevelUp: Bool { levelsGained > 0 }
}

struct PrestigeResult {
    let prestigeLevel: Int
    let previousLevel: Int
    let bonusGained: Double
    let totalBonus: Double
}
```

## Soft Cap Implementation

```swift
struct SoftCappedProgression {
    let softCapLevel: Int = 50
    let hardCapLevel: Int = 100
    let softCapPenalty: Double = 0.25

    func effectiveXPGain(rawXP: Int, currentLevel: Int) -> Int {
        if currentLevel < softCapLevel { return rawXP }
        else if currentLevel < hardCapLevel { return Int(Double(rawXP) * softCapPenalty) }
        else { return 0 }
    }
}
```
