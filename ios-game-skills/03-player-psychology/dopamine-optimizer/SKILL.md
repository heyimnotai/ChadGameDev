---
name: dopamine-optimizer
description: Maximizes player satisfaction through reward psychology by implementing variable ratio reinforcement schedules, optimal reward timing, anticipation mechanics, and pity systems. Use this skill when designing reward systems, loot mechanics, gacha systems, or any feature where players receive variable outcomes. Triggers when implementing drop rates, chest openings, reward reveals, surprise mechanics, or near-miss feedback. This skill ensures rewards feel satisfying while maintaining ethical boundaries and regulatory compliance.
---

# Dopamine Optimizer

## Purpose

This skill enables the design of reward systems that maximize player satisfaction through evidence-based psychological principles. It enforces a quality bar where rewards feel earned, surprising, and appropriately paced to maintain long-term engagement without exploiting vulnerable players. All implementations must comply with Apple's loot box disclosure requirements and regional gambling regulations.

## Domain Boundaries

- **This skill handles**:
  - Variable ratio reinforcement schedule design
  - Reward timing and anticipation building
  - Near-miss mechanics and feedback
  - Pity system mathematics (soft pity, hard pity)
  - Reward variety and novelty maintenance
  - Dopamine cooldown and burnout prevention
  - Reward probability distributions
  - Surprise and delight moment engineering
  - Ethical implementation guidelines

- **This skill does NOT handle**:
  - Daily login systems and streaks (see: retention-engineer)
  - Achievement unlock pacing (see: reward-scheduler)
  - First-time user experience rewards (see: onboarding-architect)
  - Leaderboard and competition rewards (see: social-mechanics)
  - Economy balancing and currency flow (see: economy-balancer)
  - Visual reward animations (see: juice-orchestrator)

## Core Specifications

### Variable Ratio Reinforcement Schedules

Variable ratio (VR) schedules produce the highest engagement rates and greatest resistance to extinction. Use these exact parameters:

| Schedule Type | Average Ratio | Variance | Use Case |
|---------------|---------------|----------|----------|
| VR-3 | Every 3 actions | 1-5 range | Early game, frequent small rewards |
| VR-5 | Every 5 actions | 2-8 range | Standard gameplay rewards |
| VR-10 | Every 10 actions | 5-15 range | Medium-value rewards |
| VR-25 | Every 25 actions | 15-40 range | High-value rare drops |
| VR-50 | Every 50 actions | 30-75 range | Ultra-rare collectibles |

**Reward Frequency Ceiling**: Keep average reward frequency below 55 attempts to avoid gambling-like compulsion patterns.

### Probability Distribution Models

**Linear Drop Rate** (Simple):
```
P(drop) = base_rate
Example: 5% chance per enemy = 0.05 constant
```

**Weighted Random with Rarity Tiers**:
```
Common:     60% (0.60)
Uncommon:   25% (0.25)
Rare:       10% (0.10)
Epic:        4% (0.04)
Legendary:   1% (0.01)
Total:     100%
```

**Pseudo-Random Distribution (PRD)** - Prevents long droughts:
```
Initial probability: C = base_rate / 5
Increment per failure: C
After N failures: P(N) = C * N
Maximum N before guarantee: ceil(1/C)

Example for 10% base rate:
C = 0.02 (2%)
Attempt 1: 2%, Attempt 2: 4%, Attempt 3: 6%...
Guarantee by attempt 50 (100% cumulative)
```

### Pity System Design

**Soft Pity** - Gradually increasing probability:
```
Standard rate: base_rate (e.g., 0.6% for legendary)
Soft pity threshold: 75% of hard pity (e.g., attempt 54 for hard pity at 72)
Rate increase per attempt after soft pity: +6% per attempt

Formula after soft pity:
P(n) = base_rate + (n - soft_threshold) * 0.06
```

**Hard Pity** - Guaranteed reward at threshold:
```
Gacha/Loot Box hard pity ranges:
- Premium currency items: 70-90 pulls
- Standard items: 40-50 pulls
- Featured rate-up: 160-180 pulls (50/50 then guarantee)
```

**Implementation Table**:

| Rarity | Base Rate | Soft Pity Start | Hard Pity | Soft Pity Rate Increase |
|--------|-----------|-----------------|-----------|------------------------|
| Epic | 5.1% | 8 pulls | 10 pulls | +10% per pull |
| Legendary | 0.6% | 54 pulls | 72 pulls | +6% per pull |
| Featured | 0.3% | 54 pulls | 72 pulls + 72 pulls | +6% per pull |

### Reward Timing Windows

**Immediate Feedback** (0-100ms):
- Haptic response
- Sound effect trigger
- Visual particle spawn

**Anticipation Building** (100ms-2000ms):
- Item glow/shimmer
- Sound pitch increase
- Camera focus shift

**Reveal Sequence** (2000ms-4000ms):
- Rarity indicator flash
- Item materialization
- Celebration effects

**Optimal Total Duration by Reward Value**:
| Reward Type | Total Duration | Anticipation % |
|-------------|----------------|----------------|
| Common drop | 500ms | 20% (100ms) |
| Uncommon drop | 1000ms | 30% (300ms) |
| Rare drop | 2000ms | 40% (800ms) |
| Epic drop | 3000ms | 50% (1500ms) |
| Legendary drop | 4000ms | 60% (2400ms) |

### Near-Miss Mechanics (Ethical Implementation)

Near-misses activate reward pathways similar to actual wins. Use responsibly:

**Acceptable Near-Miss Patterns**:
- Puzzle piece almost fitting (shows correct solution nearby)
- Boss health at 1% when player dies (motivates retry)
- Collection 95% complete (shows what's missing)
- Score within 5% of high score

**Near-Miss Frequency**: Maximum 1 in 4 losses should feel like near-misses (25%)

**Prohibited Patterns**:
- Fake near-misses (outcomes predetermined to look close)
- Manipulated slot-style reels
- Artificial "almost" animations on random outcomes

### Surprise and Delight Moments

**Surprise Categories**:
| Type | Frequency | Example |
|------|-----------|---------|
| Micro-surprise | Every 30-60 seconds | Extra coin, bonus XP |
| Mini-surprise | Every 5-10 minutes | Rare drop, achievement |
| Major-surprise | Every 30-60 minutes | Legendary item, unlock |
| Mega-surprise | Every 4-8 hours | Limited event, jackpot |

**Novelty Maintenance Schedule**:
- Week 1-2: Introduce core reward types
- Week 3-4: Add first variant rewards
- Month 2: Introduce seasonal/themed rewards
- Month 3+: Rotate limited-time exclusive rewards

### Dopamine Cooldown (Burnout Prevention)

**Session Reward Caps**:
```
Maximum legendary drops per session: 2
Maximum epic drops per session: 5
Cooldown after legendary: 15 minutes reduced rates
Daily bonus reset: 24 hours from first login
```

**Diminishing Returns Formula**:
```
Reward value = base_value * (0.9 ^ rewards_this_session)

Session 1st reward: 100% value
Session 2nd reward: 90% value
Session 3rd reward: 81% value
Session 10th reward: 35% value
```

**Recovery Mechanics**:
- Full reward potential restored after 4+ hours away
- 50% restoration after 2 hours
- Session cap resets at calendar midnight (user timezone)

## Implementation Patterns

### Pity System Manager

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

### Pseudo-Random Distribution

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

### Reward Timing Controller

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

### Session Reward Manager (Burnout Prevention)

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

### Loot Table with Disclosed Odds

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

## Decision Trees

### When to Use Variable Ratio vs Fixed Ratio

```
Is the reward the primary motivation for the action?
├── YES: How valuable is the reward?
│   ├── HIGH VALUE (rare items, premium currency)
│   │   └── Use VR-25 to VR-50 with pity system
│   ├── MEDIUM VALUE (uncommon items, boosters)
│   │   └── Use VR-10 with soft pity at 15
│   └── LOW VALUE (common drops, XP)
│       └── Use VR-3 to VR-5, no pity needed
└── NO: Is the action inherently enjoyable?
    ├── YES: Use VR-10+ to add surprise without overshadowing fun
    └── NO: Use fixed ratio FR-3 to FR-5 for predictability
```

### Pity System Selection

```
What type of monetized system is this?
├── GACHA/LOOT BOX
│   ├── Premium currency cost > $5 equivalent
│   │   └── Hard pity at 70-90, soft pity at 75% mark
│   └── Premium currency cost < $5 equivalent
│       └── Hard pity at 40-50, soft pity at 75% mark
├── GAMEPLAY DROP
│   ├── Required for progression
│   │   └── Hard pity at 20-30 attempts, soft pity at 60%
│   └── Optional collectible
│       └── Soft pity only, starting at 50% of expected attempts
└── FREE REWARD
    └── No pity needed, use PRD to smooth variance
```

### Near-Miss Implementation Decision

```
Is the outcome determined by player skill?
├── YES: Near-miss feedback is ENCOURAGED
│   ├── Show how close they were (health bars, scores)
│   ├── Highlight the moment of failure
│   └── Suggest improvement path
└── NO: Is this a paid/monetized mechanic?
    ├── YES: Near-miss visuals are PROHIBITED
    │   └── Outcomes must be clearly random
    └── NO: Near-miss can be shown if:
        ├── Frequency < 25% of losses
        ├── No manipulation of display
        └── Educational value present
```

## Quality Checklist

### Pity System Verification
- [ ] Hard pity guarantees reward at exactly the specified pull count
- [ ] Soft pity increases rates smoothly (no sudden jumps)
- [ ] Pity counter persists across sessions (saved to UserDefaults/CloudKit)
- [ ] Pity counter is displayed to player before purchase
- [ ] Pity resets only on successful pull of target rarity

### Odds Disclosure Compliance
- [ ] All loot box odds disclosed BEFORE purchase (Apple requirement)
- [ ] Odds shown as percentages with 2 decimal precision
- [ ] Individual item rates shown, not just rarity tiers
- [ ] Odds accessible from purchase screen (not buried in settings)
- [ ] Odds match actual implementation (verified by unit tests)

### Reward Timing Verification
- [ ] Haptic fires within 5ms of touch
- [ ] Sound plays within 15ms of touch
- [ ] Anticipation duration scales with rarity
- [ ] Total reveal time does not exceed 4 seconds
- [ ] Skip option available after first reveal viewing

### Burnout Prevention Verification
- [ ] Session caps enforced server-side (not just client)
- [ ] Diminishing returns formula applied correctly
- [ ] Cooldown timers accurate and visible
- [ ] Recovery mechanics clearly communicated
- [ ] Long-term engagement tracked (not just session metrics)

### Ethical Implementation Verification
- [ ] No fake near-misses (all outcomes are genuine)
- [ ] No manipulation of displayed results
- [ ] Regional compliance checked (Belgium, Netherlands bans)
- [ ] Age-gating implemented for monetized random rewards
- [ ] Spending limits or warnings available

## Anti-Patterns

### Anti-Pattern: Guaranteed Loss Streaks
**Wrong**:
```swift
// NEVER DO THIS: Forcing losses to increase frustration
if recentWinCount > 3 {
    forceNextLoss = true
}
```
**Consequence**: Destroys player trust, may violate consumer protection laws.

**Correct**:
```swift
// Use PRD to smooth variance naturally
let prd = PseudoRandomDistribution(baseRate: 0.10)
let result = prd.roll() // Naturally prevents extreme streaks
```

### Anti-Pattern: Hidden Pity Manipulation
**Wrong**:
```swift
// NEVER DO THIS: Resetting pity without player knowledge
if playerSpentMoney {
    pityCounter = 0 // Silent reset
}
```
**Consequence**: Violates disclosure requirements, legal liability.

**Correct**:
```swift
// Pity only resets on successful pull, always visible
func recordPull(success: Bool) {
    if success {
        pityCounter = 0
        notifyPlayer("Pity counter reset!")
    } else {
        pityCounter += 1
        notifyPlayer("Pity: \(pityCounter)/\(hardPity)")
    }
}
```

### Anti-Pattern: Unlimited Reward Flooding
**Wrong**:
```swift
// NEVER DO THIS: No caps on rewards
func grantReward() {
    player.inventory.add(generateRandomReward()) // Unlimited
}
```
**Consequence**: Reward devaluation, economic collapse, player burnout.

**Correct**:
```swift
// Enforce session limits and diminishing returns
func grantReward() {
    guard sessionManager.canReceiveReward(rarity: reward.rarity) else {
        showMessage("Daily limit reached. Return tomorrow!")
        return
    }
    let effectiveValue = sessionManager.getEffectiveValue(reward.baseValue)
    player.inventory.add(reward, value: effectiveValue)
    sessionManager.recordReward(rarity: reward.rarity)
}
```

### Anti-Pattern: Constant High-Value Rewards
**Wrong**:
```swift
// NEVER DO THIS: Every reward feels legendary
func showRewardAnimation(item: Item) {
    playEpicFanfare()
    spawnMaxParticles()
    shakeScreen(intensity: 1.0)
}
```
**Consequence**: Reward fatigue, inability to create excitement for actual rare items.

**Correct**:
```swift
// Scale celebration to actual rarity
func showRewardAnimation(item: Item) {
    let config = AnimationConfig.forRarity(item.rarity)
    playSound(config.sound)
    spawnParticles(count: config.particleCount)
    if item.rarity >= .epic {
        shakeScreen(intensity: config.shakeIntensity)
    }
}
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| **retention-engineer** | Daily rewards and streaks build on dopamine principles |
| **reward-scheduler** | Handles fixed schedules and achievement pacing |
| **onboarding-architect** | First reward timing during FTUE |
| **economy-balancer** | Currency values affect reward perception |
| **juice-orchestrator** | Visual/audio implementation of reward reveals |
| **analytics-integration** | Track reward engagement and conversion |
