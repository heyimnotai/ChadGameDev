# Dopamine Optimizer - Code Patterns

## Pity System Manager

```swift
import Foundation

final class PitySystemManager {

    struct PityConfig {
        let baseRate: Double
        let softPityStart: Int
        let hardPity: Int
        let softPityIncrement: Double

        static let legendary = PityConfig(
            baseRate: 0.006,
            softPityStart: 54,
            hardPity: 72,
            softPityIncrement: 0.06
        )

        static let epic = PityConfig(
            baseRate: 0.051,
            softPityStart: 8,
            hardPity: 10,
            softPityIncrement: 0.10
        )
    }

    private var pullCount: Int = 0
    private let config: PityConfig

    init(config: PityConfig) {
        self.config = config
    }

    func calculateCurrentRate() -> Double {
        if pullCount >= config.hardPity - 1 {
            return 1.0 // Guaranteed on next pull
        }

        if pullCount >= config.softPityStart {
            let softPityPulls = pullCount - config.softPityStart
            let boostedRate = config.baseRate + (Double(softPityPulls) * config.softPityIncrement)
            return min(boostedRate, 1.0)
        }

        return config.baseRate
    }

    func performPull() -> Bool {
        let currentRate = calculateCurrentRate()
        let roll = Double.random(in: 0..<1)
        let success = roll < currentRate

        if success {
            pullCount = 0
        } else {
            pullCount += 1
        }

        return success
    }

    func getPullCount() -> Int {
        return pullCount
    }

    func getGuaranteedIn() -> Int {
        return config.hardPity - pullCount
    }
}
```

## Pseudo-Random Distribution

```swift
import Foundation

final class PseudoRandomDistribution {

    private let baseRate: Double
    private let incrementConstant: Double
    private var failureCount: Int = 0

    init(baseRate: Double) {
        self.baseRate = baseRate
        // PRD constant calculation
        self.incrementConstant = baseRate / 5.0
    }

    func currentProbability() -> Double {
        return min(incrementConstant * Double(failureCount + 1), 1.0)
    }

    func roll() -> Bool {
        let probability = currentProbability()
        let roll = Double.random(in: 0..<1)
        let success = roll < probability

        if success {
            failureCount = 0
        } else {
            failureCount += 1
        }

        return success
    }

    func maximumAttempts() -> Int {
        return Int(ceil(1.0 / incrementConstant))
    }

    func reset() {
        failureCount = 0
    }
}
```

## Reward Timing Controller

```swift
import Foundation
import Combine

enum RewardRarity: Int, CaseIterable {
    case common = 0
    case uncommon = 1
    case rare = 2
    case epic = 3
    case legendary = 4

    var anticipationDuration: TimeInterval {
        switch self {
        case .common: return 0.1
        case .uncommon: return 0.3
        case .rare: return 0.8
        case .epic: return 1.5
        case .legendary: return 2.4
        }
    }

    var revealDuration: TimeInterval {
        switch self {
        case .common: return 0.4
        case .uncommon: return 0.7
        case .rare: return 1.2
        case .epic: return 1.5
        case .legendary: return 1.6
        }
    }

    var totalDuration: TimeInterval {
        return anticipationDuration + revealDuration
    }
}

final class RewardTimingController {

    struct TimingEvent {
        let phase: Phase
        let timestamp: TimeInterval

        enum Phase {
            case hapticTrigger
            case soundStart
            case particleSpawn
            case anticipationStart
            case rarityFlash
            case itemReveal
            case celebrationStart
            case complete
        }
    }

    func generateTimeline(for rarity: RewardRarity) -> [TimingEvent] {
        var events: [TimingEvent] = []
        var currentTime: TimeInterval = 0

        // Immediate feedback (0-100ms)
        events.append(TimingEvent(phase: .hapticTrigger, timestamp: 0.005))
        events.append(TimingEvent(phase: .soundStart, timestamp: 0.015))
        events.append(TimingEvent(phase: .particleSpawn, timestamp: 0.030))

        // Anticipation phase
        currentTime = 0.1
        events.append(TimingEvent(phase: .anticipationStart, timestamp: currentTime))

        // Rarity flash at 80% through anticipation
        let rarityFlashTime = currentTime + (rarity.anticipationDuration * 0.8)
        events.append(TimingEvent(phase: .rarityFlash, timestamp: rarityFlashTime))

        // Item reveal
        currentTime += rarity.anticipationDuration
        events.append(TimingEvent(phase: .itemReveal, timestamp: currentTime))

        // Celebration
        let celebrationTime = currentTime + (rarity.revealDuration * 0.3)
        events.append(TimingEvent(phase: .celebrationStart, timestamp: celebrationTime))

        // Complete
        events.append(TimingEvent(phase: .complete, timestamp: rarity.totalDuration))

        return events.sorted { $0.timestamp < $1.timestamp }
    }
}
```

## Session Reward Manager (Burnout Prevention)

```swift
import Foundation

final class SessionRewardManager {

    struct SessionLimits {
        let maxLegendaryPerSession: Int
        let maxEpicPerSession: Int
        let cooldownAfterLegendary: TimeInterval
        let diminishingReturnsFactor: Double

        static let standard = SessionLimits(
            maxLegendaryPerSession: 2,
            maxEpicPerSession: 5,
            cooldownAfterLegendary: 900, // 15 minutes
            diminishingReturnsFactor: 0.9
        )
    }

    private let limits: SessionLimits
    private var sessionRewardCount: Int = 0
    private var legendaryCount: Int = 0
    private var epicCount: Int = 0
    private var lastLegendaryTime: Date?
    private var sessionStartTime: Date

    init(limits: SessionLimits = .standard) {
        self.limits = limits
        self.sessionStartTime = Date()
    }

    func canReceiveLegendary() -> Bool {
        guard legendaryCount < limits.maxLegendaryPerSession else { return false }

        if let lastTime = lastLegendaryTime {
            let elapsed = Date().timeIntervalSince(lastTime)
            if elapsed < limits.cooldownAfterLegendary {
                return false
            }
        }

        return true
    }

    func canReceiveEpic() -> Bool {
        return epicCount < limits.maxEpicPerSession
    }

    func recordReward(rarity: RewardRarity) {
        sessionRewardCount += 1

        switch rarity {
        case .legendary:
            legendaryCount += 1
            lastLegendaryTime = Date()
        case .epic:
            epicCount += 1
        default:
            break
        }
    }

    func calculateValueMultiplier() -> Double {
        return pow(limits.diminishingReturnsFactor, Double(sessionRewardCount))
    }

    func getEffectiveValue(baseValue: Double) -> Double {
        return baseValue * calculateValueMultiplier()
    }

    func resetSession() {
        sessionRewardCount = 0
        legendaryCount = 0
        epicCount = 0
        lastLegendaryTime = nil
        sessionStartTime = Date()
    }

    func getSessionDuration() -> TimeInterval {
        return Date().timeIntervalSince(sessionStartTime)
    }
}
```

## Loot Table with Disclosed Odds

```swift
import Foundation

struct LootItem: Identifiable {
    let id: UUID
    let name: String
    let rarity: RewardRarity
    let weight: Double

    init(name: String, rarity: RewardRarity, weight: Double) {
        self.id = UUID()
        self.name = name
        self.rarity = rarity
        self.weight = weight
    }
}

final class LootTable {

    private let items: [LootItem]
    private let totalWeight: Double

    init(items: [LootItem]) {
        self.items = items
        self.totalWeight = items.reduce(0) { $0 + $1.weight }
    }

    /// Returns disclosed odds for App Store compliance
    /// Apple requires disclosure PRIOR to purchase
    func getDisclosedOdds() -> [(item: LootItem, percentage: Double)] {
        return items.map { item in
            let percentage = (item.weight / totalWeight) * 100
            return (item: item, percentage: percentage.rounded(toPlaces: 2))
        }.sorted { $0.percentage > $1.percentage }
    }

    /// Generates formatted odds string for display
    func generateOddsDisclosure() -> String {
        var disclosure = "Item Drop Rates:\n"

        let byRarity = Dictionary(grouping: items) { $0.rarity }

        for rarity in RewardRarity.allCases.reversed() {
            guard let rarityItems = byRarity[rarity] else { continue }

            let totalRarityWeight = rarityItems.reduce(0) { $0 + $1.weight }
            let rarityPercentage = (totalRarityWeight / totalWeight) * 100

            disclosure += "\n\(rarity): \(rarityPercentage.rounded(toPlaces: 2))%\n"

            for item in rarityItems {
                let itemPercentage = (item.weight / totalWeight) * 100
                disclosure += "  - \(item.name): \(itemPercentage.rounded(toPlaces: 2))%\n"
            }
        }

        return disclosure
    }

    func roll() -> LootItem {
        let roll = Double.random(in: 0..<totalWeight)
        var cumulative: Double = 0

        for item in items {
            cumulative += item.weight
            if roll < cumulative {
                return item
            }
        }

        return items.last!
    }
}

private extension Double {
    func rounded(toPlaces places: Int) -> Double {
        let multiplier = pow(10.0, Double(places))
        return (self * multiplier).rounded() / multiplier
    }
}
```
