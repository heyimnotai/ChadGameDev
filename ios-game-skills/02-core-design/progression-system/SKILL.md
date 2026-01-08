---
name: progression-system
description: Design mathematically-sound progression systems for iOS games including XP curves, level counts, unlock pacing, and prestige mechanics. Use this skill when implementing player leveling, character advancement, content unlocking, or any system where players accumulate progress over time. Triggers when calculating XP requirements, designing level caps, balancing power curves, or implementing reset/prestige systems. Provides exact mathematical formulas with tunable parameters.
---

# Progression System

## Purpose

This skill enables the design of mathematically rigorous progression systems that maintain player engagement from first play through hundreds of hours. It enforces the quality bar of top-grossing games by providing validated XP curve formulas, level count recommendations, and power curve management strategies. A well-designed progression system creates the illusion of infinite growth while maintaining sustainable pacing that neither frustrates new players nor exhausts content for veterans.

## Domain Boundaries

- **This skill handles**: XP curve mathematics, level count design, unlock pacing, power curves, prestige/reset systems, soft and hard caps, progression formula tuning
- **This skill does NOT handle**: Core loop structure (see `core-loop-architect`), currency balancing (see `economy-balancer`), difficulty scaling (see `difficulty-tuner`), session pacing (see `session-designer`), reward scheduling (see `reward-scheduler`)

## Core Specifications

### XP Curve Formulas

#### Linear Curve

```
XP_needed(level) = base * level
```

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| base | XP required for level 1->2 | 10-100 |

**Characteristics:**
- Feel: Monotonous, predictable
- Use case: Rarely used alone; base layer for hybrid curves
- Example: `base = 50` -> Level 10 requires 500 XP

**Formula Implementation:**
```swift
func linearXP(level: Int, base: Int = 50) -> Int {
    return base * level
}
```

#### Polynomial Curve

```
XP_needed(level) = base * level^exponent
```

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| base | Starting XP coefficient | 1-20 |
| exponent | Growth rate | 1.5-3.0 |

**Characteristics:**
- Feel: Accelerating difficulty, rewards early investment
- Use case: Games with moderate level counts (20-100 levels)
- Example (Armada): `8 * level^3`

**Common Exponent Values:**
| Exponent | Feel | Use Case |
|----------|------|----------|
| 1.5 | Gentle curve | Casual games, long progression |
| 2.0 | Quadratic | Standard RPG feel |
| 2.5 | Steep curve | Mid-length progression |
| 3.0 | Cubic | Short level count, dramatic growth |

**Formula Implementation:**
```swift
func polynomialXP(level: Int, base: Double = 8.0, exponent: Double = 2.0) -> Int {
    return Int(base * pow(Double(level), exponent))
}
```

#### Exponential Curve

```
XP_needed(level) = base * multiplier^(level - 1)
```

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| base | XP for level 1->2 | 50-200 |
| multiplier | Per-level scaling factor | 1.05-1.20 |

**Characteristics:**
- Feel: Eventually explodes, necessitates prestige
- Use case: Idle games, long-term MMOs, prestige systems
- Example (RuneScape-style): `multiplier = 1.1`

**Multiplier Impact Analysis:**
| Multiplier | Level 10 XP | Level 50 XP | Level 100 XP |
|------------|-------------|-------------|--------------|
| 1.05 | 155 | 1,147 | 13,150 |
| 1.10 | 236 | 10,672 | 1,378,061 |
| 1.15 | 351 | 76,861 | 117,390,853 |
| 1.20 | 516 | 563,475 | 8.28 billion |

**Formula Implementation:**
```swift
func exponentialXP(level: Int, base: Int = 100, multiplier: Double = 1.1) -> Int {
    return Int(Double(base) * pow(multiplier, Double(level - 1)))
}
```

#### Hybrid Curve (Recommended)

```
Early game (L1-10):   Concave curve (fast progression)
Mid game (L11-40):    Linear (steady)
Late game (L41+):     Convex (slow grind, prestige incentive)
```

**Formula:**
```
XP_needed(level) =
    if level <= earlyThreshold:
        earlyBase * level^earlyExp (earlyExp < 1, e.g., 0.7)
    elif level <= midThreshold:
        midBase * level
    else:
        lateBase * level^lateExp (lateExp > 1, e.g., 1.5-2.0)
```

**Formula Implementation:**
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
            // Concave: Fast early progression
            return Int(earlyBase * pow(Double(level), earlyExponent))
        } else if level <= midThreshold {
            // Linear: Steady mid-game
            return Int(midBase * Double(level))
        } else {
            // Convex: Slow late-game grind
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

### Level Count Recommendations

| Game Type | Recommended Levels | Reasoning |
|-----------|-------------------|-----------|
| Hyper-Casual | 0-10 | Focus on score, not levels |
| Puzzle (Linear) | 200-2000+ | Level = content unit |
| Puzzle (Meta) | 30-100 player levels | XP across puzzle levels |
| Roguelike | 15-30 per run | Meta: 20-50 unlocks |
| Idle/Incremental | 50-200 + prestige | Reset extends infinitely |
| Strategy/RPG | 50-100 | Sweet spot for investment |
| Card Game | 50-100 player levels | Collection is real progression |

### Unlock Pacing Formulas

#### Content Unlock Distribution

```
unlock_at_level(item_index) =
    floor(max_level * (item_index / total_items)^pacing_curve)
```

| Pacing Curve Value | Distribution |
|-------------------|--------------|
| 0.5 | Front-loaded (50% unlocked by level 25%) |
| 1.0 | Even distribution |
| 1.5 | Back-loaded (50% unlocked by level 75%) |

**Implementation:**
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

// Example: 30 items across 50 levels, front-loaded
let schedule = UnlockSchedule(totalItems: 30, maxLevel: 50, pacingCurve: 0.5)
// Item 15 (50%) unlocks at level 25 (50% of levels)
// With curve 0.5: unlocks at level ~35 instead (earlier distribution)
```

#### Unlock Rate Guidelines

| Phase | Levels | Unlock Frequency |
|-------|--------|------------------|
| Tutorial | 1-5 | Every level (1 new thing) |
| Early Game | 6-15 | Every 2-3 levels |
| Mid Game | 16-40 | Every 3-5 levels |
| Late Game | 41+ | Every 5-10 levels |

### Power Curve Management

#### Player Power Formula

```
effective_power(level) = base_power * (1 + power_per_level * level)
```

**Balanced Power Growth:**
| Levels | Power Growth Rate | Total Power at Max |
|--------|-------------------|-------------------|
| 10 | 10% per level | 2x base |
| 50 | 3% per level | 2.5x base |
| 100 | 1.5% per level | 2.5x base |

**Implementation:**
```swift
struct PowerCurve {
    let basePower: Double = 100
    let maxLevel: Int
    let targetMaxPower: Double // How much stronger at max level

    var powerPerLevel: Double {
        return (targetMaxPower - 1.0) / Double(maxLevel)
    }

    func effectivePower(atLevel level: Int) -> Double {
        return basePower * (1.0 + powerPerLevel * Double(level))
    }

    func relativeStrength(level1: Int, level2: Int) -> Double {
        return effectivePower(atLevel: level1) / effectivePower(atLevel: level2)
    }
}

// Example: Level 50 player should be 2.5x stronger than level 1
let curve = PowerCurve(maxLevel: 50, targetMaxPower: 2.5)
// Power at level 50: 100 * (1 + 0.03 * 50) = 250
```

#### Diminishing Returns Formula

```
actual_stat(investment) = max_stat * (1 - e^(-k * investment))
```

**Implementation:**
```swift
func diminishingReturns(investment: Double, maxStat: Double, k: Double = 0.05) -> Double {
    return maxStat * (1.0 - exp(-k * investment))
}

// Example: Attack speed with investment
// At investment 0: 0% of max
// At investment 20: 63% of max
// At investment 40: 86% of max
// At investment 60: 95% of max
// At investment 100: 99.3% of max
```

### Prestige/Reset System Patterns

#### Prestige Multiplier Formula

```
prestige_bonus(resets) = base_bonus * resets^diminishing_factor
```

| Pattern | Formula | Use Case |
|---------|---------|----------|
| Linear | `0.1 * resets` | Simple, predictable (+10% per reset) |
| Diminishing | `0.5 * sqrt(resets)` | Encourages multiple resets |
| Asymptotic | `1 - e^(-0.1 * resets)` | Hard cap at +100% |

**Implementation:**
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

// Examples:
let linear = PrestigePattern.linear(bonusPerReset: 0.1)
linear.bonus(forResets: 5) // 0.5 = +50%

let diminishing = PrestigePattern.diminishing(baseBonus: 0.5, factor: 0.5)
diminishing.bonus(forResets: 4) // 1.0 = +100%
diminishing.bonus(forResets: 16) // 2.0 = +200%

let asymptotic = PrestigePattern.asymptotic(maxBonus: 1.0, rate: 0.1)
asymptotic.bonus(forResets: 10) // 0.63 = +63%
asymptotic.bonus(forResets: 30) // 0.95 = +95%
```

#### Prestige Decision Point

```
optimal_prestige_time = when prestige_bonus_gain > time_lost_to_reset

Rule of thumb: Reset when you can reach 50% of current progress
in 25% of the original time (due to prestige bonus)
```

### Soft vs Hard Caps

| Cap Type | Definition | Implementation |
|----------|------------|----------------|
| **Soft Cap** | Reduced gains beyond threshold | XP gains reduced 50-90% |
| **Hard Cap** | Absolute maximum | No further progression possible |
| **Time Cap** | Daily/weekly limits | Energy, attempts, rewards |
| **Content Cap** | End of available content | "Coming Soon" messaging |

**Soft Cap Implementation:**
```swift
struct SoftCappedProgression {
    let softCapLevel: Int = 50
    let hardCapLevel: Int = 100
    let softCapPenalty: Double = 0.25 // 75% reduction beyond soft cap

    func effectiveXPGain(rawXP: Int, currentLevel: Int) -> Int {
        if currentLevel < softCapLevel {
            return rawXP
        } else if currentLevel < hardCapLevel {
            return Int(Double(rawXP) * softCapPenalty)
        } else {
            return 0
        }
    }

    func displayMessage(forLevel level: Int) -> String? {
        if level == softCapLevel {
            return "You've reached the soft cap! XP gains reduced."
        } else if level == hardCapLevel {
            return "Maximum level reached. Prestige to continue growing!"
        }
        return nil
    }
}
```

## Implementation Patterns

### Complete Progression Manager

```swift
import Foundation

final class ProgressionManager {
    // MARK: - Configuration

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

    // MARK: - State

    private(set) var currentXP: Int = 0
    private(set) var currentLevel: Int = 1
    private(set) var prestigeCount: Int = 0
    private(set) var totalXPEarned: Int = 0

    private let config: Config

    // MARK: - Initialization

    init(config: Config) {
        self.config = config
    }

    // MARK: - XP Calculation

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

    func xpToNextLevel() -> Int {
        return xpRequiredForLevel(currentLevel) - currentXP
    }

    func progressToNextLevel() -> Double {
        let required = xpRequiredForLevel(currentLevel)
        return Double(currentXP) / Double(required)
    }

    // MARK: - XP Granting

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

            // Check for unlocks at this level
            unlockedItems.append(contentsOf: getUnlocksForLevel(currentLevel))
        }

        // Cap XP at max level
        if currentLevel >= config.maxLevel {
            currentXP = 0
        }

        return XPGrantResult(
            xpGranted: effectiveAmount,
            levelsGained: levelsGained,
            newLevel: currentLevel,
            progressToNext: progressToNextLevel(),
            unlockedItems: unlockedItems
        )
    }

    private func applyPrestigeBonus(_ xp: Int) -> Int {
        guard let pattern = config.prestigePattern, prestigeCount > 0 else {
            return xp
        }

        let bonus = pattern.bonus(forResets: prestigeCount)
        return Int(Double(xp) * (1.0 + bonus))
    }

    private func applySoftCap(_ xp: Int) -> Int {
        guard let softCap = config.softCapLevel, currentLevel >= softCap else {
            return xp
        }

        // 75% reduction beyond soft cap
        return Int(Double(xp) * 0.25)
    }

    private func getUnlocksForLevel(_ level: Int) -> [String] {
        // Hook for unlock system integration
        return []
    }

    // MARK: - Prestige

    func canPrestige() -> Bool {
        guard config.prestigeEnabled else { return false }
        return currentLevel >= config.maxLevel ||
               (config.softCapLevel != nil && currentLevel >= config.softCapLevel!)
    }

    func prestige() -> PrestigeResult? {
        guard canPrestige(), let pattern = config.prestigePattern else {
            return nil
        }

        let previousBonus = pattern.bonus(forResets: prestigeCount)
        prestigeCount += 1
        let newBonus = pattern.bonus(forResets: prestigeCount)

        // Reset progression
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

    // MARK: - Persistence

    func save() -> [String: Any] {
        return [
            "currentXP": currentXP,
            "currentLevel": currentLevel,
            "prestigeCount": prestigeCount,
            "totalXPEarned": totalXPEarned
        ]
    }

    func load(from data: [String: Any]) {
        currentXP = data["currentXP"] as? Int ?? 0
        currentLevel = data["currentLevel"] as? Int ?? 1
        prestigeCount = data["prestigeCount"] as? Int ?? 0
        totalXPEarned = data["totalXPEarned"] as? Int ?? 0
    }
}

// MARK: - Result Types

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

### XP Curve Visualization Helper

```swift
struct XPCurveAnalyzer {
    let curve: ProgressionManager.Config.XPCurveType

    func analyze(upToLevel maxLevel: Int) -> CurveAnalysis {
        var xpPerLevel: [Int] = []
        var cumulativeXP: [Int] = []
        var totalXP = 0

        for level in 1...maxLevel {
            let xpNeeded = xpForLevel(level)
            xpPerLevel.append(xpNeeded)
            totalXP += xpNeeded
            cumulativeXP.append(totalXP)
        }

        // Calculate time estimates assuming 100 XP/minute earning rate
        let xpPerMinute = 100
        let timeToMax = totalXP / xpPerMinute

        // Find level at 50% of total time
        let halfTimeXP = (timeToMax / 2) * xpPerMinute
        let levelAtHalfTime = cumulativeXP.firstIndex { $0 >= halfTimeXP } ?? maxLevel

        return CurveAnalysis(
            xpPerLevel: xpPerLevel,
            cumulativeXP: cumulativeXP,
            totalXPToMax: totalXP,
            estimatedMinutesToMax: timeToMax,
            levelAtHalfTime: levelAtHalfTime + 1
        )
    }

    private func xpForLevel(_ level: Int) -> Int {
        switch curve {
        case .linear(let base):
            return base * level
        case .polynomial(let base, let exponent):
            return Int(base * pow(Double(level), exponent))
        case .exponential(let base, let multiplier):
            return Int(Double(base) * pow(multiplier, Double(level - 1)))
        case .hybrid(let hybridCurve):
            return hybridCurve.xpRequired(forLevel: level)
        }
    }

    func printCurveTable(upToLevel maxLevel: Int) {
        print("Level | XP Needed | Total XP | Est. Minutes")
        print("------|-----------|----------|-------------")

        var totalXP = 0
        for level in 1...maxLevel {
            let xpNeeded = xpForLevel(level)
            totalXP += xpNeeded
            let minutes = totalXP / 100 // Assuming 100 XP/min
            print(String(format: "%5d | %9d | %8d | %6d", level, xpNeeded, totalXP, minutes))
        }
    }
}

struct CurveAnalysis {
    let xpPerLevel: [Int]
    let cumulativeXP: [Int]
    let totalXPToMax: Int
    let estimatedMinutesToMax: Int
    let levelAtHalfTime: Int
}
```

### Level-Up Animation Sequencer

```swift
import SpriteKit

final class LevelUpSequencer {
    private weak var scene: SKScene?

    init(scene: SKScene) {
        self.scene = scene
    }

    func playLevelUpSequence(
        oldLevel: Int,
        newLevel: Int,
        unlockedItems: [String],
        completion: @escaping () -> Void
    ) {
        guard let scene = scene else { return }

        // Phase 1: Screen flash (0-200ms)
        let flash = SKSpriteNode(color: .white, size: scene.size)
        flash.position = CGPoint(x: scene.size.width / 2, y: scene.size.height / 2)
        flash.alpha = 0
        flash.zPosition = 1000
        scene.addChild(flash)

        let flashIn = SKAction.fadeAlpha(to: 0.8, duration: 0.05)
        let flashOut = SKAction.fadeAlpha(to: 0, duration: 0.15)
        let removeFlash = SKAction.removeFromParent()
        flash.run(SKAction.sequence([flashIn, flashOut, removeFlash]))

        // Phase 2: Level number animation (200-800ms)
        let levelLabel = SKLabelNode(text: "LEVEL \(newLevel)")
        levelLabel.fontName = "AvenirNext-Bold"
        levelLabel.fontSize = 72
        levelLabel.position = CGPoint(x: scene.size.width / 2, y: scene.size.height / 2)
        levelLabel.setScale(0.1)
        levelLabel.alpha = 0
        levelLabel.zPosition = 1001
        scene.addChild(levelLabel)

        let scaleUp = SKAction.scale(to: 1.2, duration: 0.3)
        scaleUp.timingMode = .easeOut
        let scaleDown = SKAction.scale(to: 1.0, duration: 0.1)
        let fadeIn = SKAction.fadeIn(withDuration: 0.2)
        let holdTime = SKAction.wait(forDuration: 1.0)
        let fadeOut = SKAction.fadeOut(withDuration: 0.3)
        let remove = SKAction.removeFromParent()

        let showSequence = SKAction.sequence([
            SKAction.group([scaleUp, fadeIn]),
            scaleDown,
            holdTime,
            fadeOut,
            remove
        ])

        levelLabel.run(showSequence, withKey: "levelUp")

        // Phase 3: Particles (0-2000ms)
        if let particles = SKEmitterNode(fileNamed: "LevelUpParticles") {
            particles.position = CGPoint(x: scene.size.width / 2, y: scene.size.height / 2)
            particles.zPosition = 999
            scene.addChild(particles)

            let particleLifetime = SKAction.wait(forDuration: 2.0)
            let removeParticles = SKAction.removeFromParent()
            particles.run(SKAction.sequence([particleLifetime, removeParticles]))
        }

        // Phase 4: Haptic feedback
        let haptic = UINotificationFeedbackGenerator()
        haptic.prepare()
        haptic.notificationOccurred(.success)

        // Phase 5: Show unlocks (after level animation)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            if !unlockedItems.isEmpty {
                self.showUnlockSequence(items: unlockedItems, completion: completion)
            } else {
                completion()
            }
        }
    }

    private func showUnlockSequence(items: [String], completion: @escaping () -> Void) {
        // Display unlocked items one by one
        var delay: TimeInterval = 0

        for item in items {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                self.showUnlockBanner(itemName: item)
            }
            delay += 0.8
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + delay + 0.5) {
            completion()
        }
    }

    private func showUnlockBanner(itemName: String) {
        guard let scene = scene else { return }

        let banner = SKLabelNode(text: "Unlocked: \(itemName)")
        banner.fontName = "AvenirNext-Medium"
        banner.fontSize = 24
        banner.position = CGPoint(x: scene.size.width / 2, y: scene.size.height * 0.7)
        banner.alpha = 0
        scene.addChild(banner)

        let slideIn = SKAction.moveBy(x: 0, y: 20, duration: 0.3)
        let fadeIn = SKAction.fadeIn(withDuration: 0.3)
        let hold = SKAction.wait(forDuration: 0.5)
        let fadeOut = SKAction.fadeOut(withDuration: 0.2)
        let remove = SKAction.removeFromParent()

        banner.run(SKAction.sequence([
            SKAction.group([slideIn, fadeIn]),
            hold,
            fadeOut,
            remove
        ]))

        // Light haptic for each unlock
        let haptic = UIImpactFeedbackGenerator(style: .light)
        haptic.impactOccurred()
    }
}
```

## Decision Trees

### XP Curve Selection

```
START: What is the expected player commitment?

[Casual (< 1 hour total)]
    -> Use LINEAR with low base (10-25)
    -> 10-20 levels max
    -> Fast early progression

[Moderate (1-10 hours)]
    -> Use POLYNOMIAL with exponent 1.5-2.0
    -> 30-50 levels
    -> Satisfying mid-game plateau

[Dedicated (10-50 hours)]
    -> Use HYBRID curve
    -> 50-100 levels
    -> Soft cap at 70% of max level

[Hardcore (50+ hours)]
    -> Use EXPONENTIAL + prestige
    -> 50-100 levels per prestige
    -> Infinite progression through resets

[Idle/Incremental]
    -> Use EXPONENTIAL with high multiplier (1.15+)
    -> Prestige mandatory for progression
    -> Display large numbers (notation system)
```

### Level Count Decision

```
START: How is content delivered?

[Levels ARE content] (puzzle games)
    -> Level count = content quantity
    -> 200-2000+ levels
    -> Focus on level design variety
    -> Player level is meta-layer (optional)

[Levels unlock content] (RPG, strategy)
    -> 50-100 levels
    -> Major unlock every 5-10 levels
    -> End-game content for max level players

[Levels represent skill] (competitive)
    -> Match-based ranking
    -> 20-50 ranks with divisions
    -> Season resets

[Levels are investment] (idle)
    -> Effectively infinite via prestige
    -> Each reset: higher numbers, same time
    -> Display prestige level prominently
```

### Prestige Timing

```
When should the player prestige?

[Player has reached soft/hard cap]
    -> Show prestige button
    -> Display bonus calculation
    -> Explain what transfers (and what doesn't)

[Player progress has significantly slowed]
    -> Calculate: time to +10% vs prestige and regain +bonus
    -> If prestige is faster, suggest it
    -> Never force prestige

[New content is gated behind prestige]
    -> Clearly communicate requirements
    -> Show preview of prestige rewards
    -> Make first prestige easy

Prestige should feel REWARDING, not punishing:
- Show total progress (all prestiges combined)
- Maintain cosmetic unlocks
- Speed up early game significantly
- Add new content/mechanics in prestige
```

## Quality Checklist

### XP Curve Validation
- [ ] Level 1->2 achievable in < 2 minutes
- [ ] Time to max level appropriate for genre
- [ ] No level takes > 4x the time of previous level
- [ ] XP curve analyzed with real timing data
- [ ] Soft cap prevents burnout, hard cap prevents exploitation

### Unlock Pacing
- [ ] New unlock every 2-5 levels in early game
- [ ] No drought > 10 levels without unlock
- [ ] Most powerful items require investment
- [ ] Early unlocks are immediately useful
- [ ] Unlock preview shows what's coming

### Power Curve
- [ ] New players can compete (skill matters)
- [ ] Veterans feel investment rewarded
- [ ] No single level provides > 20% power increase
- [ ] Diminishing returns prevent runaway power
- [ ] PvP matchmaking accounts for level difference

### Prestige System (if applicable)
- [ ] First prestige achievable in 2-5 hours
- [ ] Bonus clearly visible and explained
- [ ] Progress feels faster after prestige
- [ ] Something carries over (cosmetics, achievements)
- [ ] Prestige count displayed as achievement

## Anti-Patterns

### Anti-Pattern: The Impossible Grind

**Wrong:**
```swift
// Exponential with no prestige
func xpForLevel(_ level: Int) -> Int {
    return Int(100 * pow(1.15, Double(level - 1)))
}
// Level 50: 8,091,142 XP
// Level 100: 117,390,853,050 XP (117 billion)
```

**Right:**
```swift
// Exponential WITH prestige or soft cap
func xpForLevel(_ level: Int) -> Int {
    if level <= 50 {
        return Int(100 * pow(1.1, Double(level - 1)))
    } else {
        // Soft cap: drastically reduced gains
        return Int(100 * pow(1.1, 49.0)) // Stay at level 50 rate
    }
}
```

**Consequence:** Players hit a wall and quit. Always provide prestige, catch-up mechanics, or content end.

### Anti-Pattern: Empty Levels

**Wrong:**
```
Level 1: Unlock Character A
Level 2: (nothing)
Level 3: (nothing)
Level 4: (nothing)
Level 5: Unlock Character B
```

**Right:**
```
Level 1: Unlock Character A
Level 2: Unlock Skill Slot 2
Level 3: +5% XP Bonus
Level 4: Unlock New Stage
Level 5: Unlock Character B
```

**Consequence:** Level-ups feel meaningless. Every level should unlock SOMETHING (even small bonuses).

### Anti-Pattern: Linear Forever

**Wrong:**
```swift
// Pure linear: predictable and boring
func xpForLevel(_ level: Int) -> Int {
    return 100 * level
}
```

**Right:**
```swift
// Hybrid: varied pacing creates interest
func xpForLevel(_ level: Int) -> Int {
    if level <= 10 { return Int(50 * pow(Double(level), 0.7)) }      // Fast start
    if level <= 40 { return 100 * level }                            // Steady middle
    return Int(50 * pow(Double(level), 1.5))                         // Challenging end
}
```

**Consequence:** Players can calculate exactly how long each level takes. Surprise and variance drive engagement.

### Anti-Pattern: Pay-to-Skip-Everything

**Wrong:**
```
$99.99 bundle: Instantly reach max level
Player skips 100% of progression content
Nothing left to do, refund request
```

**Right:**
```
$9.99 booster: 2x XP for 7 days
Player still plays, just progresses faster
Engagement maintained, revenue generated
```

**Consequence:** Players who skip content don't retain. Sell acceleration, not completion.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `core-loop-architect` | Progression rewards tie into the core loop's REWARD phase |
| `economy-balancer` | XP is often tied to currency; must balance together |
| `difficulty-tuner` | Power curves must align with difficulty curves |
| `session-designer` | Level-up timing affects session satisfaction |
| `onboarding-architect` | First 5 levels are part of FTUE design |
| `reward-scheduler` | Level-up is a major reward that needs proper ceremony |
