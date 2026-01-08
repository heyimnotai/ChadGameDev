---
name: economy-balancer
description: Design sustainable in-game economies for iOS games including dual currency systems, sink/faucet balance, inflation control, and monetization integration. Use this skill when implementing soft/hard currencies, designing spending opportunities, calibrating earning rates, or creating F2P economy structures. Triggers when balancing resource flow, optimizing pinch points, or preventing economy exploits. Provides mathematical formulas for economy simulation and IAP pricing.
---

# Economy Balancer

## Purpose

This skill enables the design of sustainable in-game economies that provide fair progression for non-paying players while creating compelling conversion opportunities for monetization. It enforces the quality bar of top-grossing F2P games by providing validated sink/faucet formulas, inflation control mechanisms, and pinch point optimization strategies. A well-balanced economy is the foundation of both player satisfaction and sustainable revenue.

## Domain Boundaries

- **This skill handles**: Currency design, earning rates, spending opportunities, sink/faucet balance, inflation control, economy simulation, pinch point optimization, IAP pricing, F2P vs premium economy differences
- **This skill does NOT handle**: XP and leveling curves (see `progression-system`), core gameplay loops (see `core-loop-architect`), difficulty tuning (see `difficulty-tuner`), session pacing (see `session-designer`), reward psychology (see `reward-scheduler`)

## Core Specifications

### Dual Currency Pattern

| Currency Type | Characteristics | Typical Names |
|--------------|-----------------|---------------|
| **Soft Currency** | Earned through gameplay, high flow rate, frequent spending | Coins, Gold, Cash, Bucks |
| **Hard Currency** | Purchased or rarely earned, low flow rate, premium purchases | Gems, Crystals, Diamonds, Rubies |

**Conversion Guidelines:**
| Aspect | Soft Currency | Hard Currency |
|--------|---------------|---------------|
| Earning Rate | 100-1000 per session | 0-50 per session |
| Spending Rate | Frequent (every few minutes) | Rare (major purchases) |
| Inflation Risk | High (must manage sinks) | Low (controlled supply) |
| IAP Connection | Indirect (buy hard, convert to soft) | Direct (purchased) |

### Sink/Faucet Balance Formulas

#### Core Balance Equation

```
Faucet Rate ≈ Sink Rate = Balanced Economy

Faucet > Sink = Inflation (currency worthless)
Sink > Faucet = Frustration (players can't progress)
```

#### Daily Balance Calculation

```
Daily_Net_Flow = Sum(Faucets) - Sum(Sinks)

Target: Daily_Net_Flow = 0 to slight positive (reward engaged players)

Inflation Rate = (Total_Currency_Supply_Today / Total_Currency_Supply_Yesterday) - 1
Target Inflation: -1% to +2% per week
```

**Implementation:**
```swift
struct EconomyBalance {
    // Faucets (currency entering the economy)
    var dailyLoginReward: Int = 100
    var levelCompletionReward: Int = 50
    var questRewards: Int = 200
    var adRewardPerWatch: Int = 25
    var expectedAdsPerDay: Int = 5
    var achievementRewards: Int = 50

    // Sinks (currency leaving the economy)
    var upgradesCostPerDay: Int = 150
    var consumablesPurchased: Int = 100
    var retryFees: Int = 50
    var cosmeticPurchases: Int = 100
    var premiumSpeedUps: Int = 0 // F2P may not use

    var totalDailyFaucet: Int {
        return dailyLoginReward +
               levelCompletionReward +
               questRewards +
               (adRewardPerWatch * expectedAdsPerDay) +
               achievementRewards
    }

    var totalDailySink: Int {
        return upgradesCostPerDay +
               consumablesPurchased +
               retryFees +
               cosmeticPurchases +
               premiumSpeedUps
    }

    var dailyNetFlow: Int {
        return totalDailyFaucet - totalDailySink
    }

    var isBalanced: Bool {
        let flowRatio = Double(totalDailyFaucet) / Double(max(1, totalDailySink))
        return flowRatio >= 0.9 && flowRatio <= 1.2
    }
}
```

### Faucet Types and Rates

| Faucet | Frequency | Amount (Soft) | Purpose |
|--------|-----------|---------------|---------|
| Level Completion | Per level | 25-100 | Core progression reward |
| Daily Login | Once/day | 50-500 (escalating) | Daily retention |
| Quest Completion | 3-5/day | 25-100 each | Engagement direction |
| Achievement | One-time | 100-1000 | Milestone celebration |
| Ad Watch | 3-10/day | 15-50 each | Monetization alternative |
| Time-Based | Passive | 10-50/hour | Idle game pattern |
| PvP Victory | Per match | 10-50 | Competitive reward |
| Collection Bonus | One-time | Variable | Collection motivation |

**Daily Faucet Budget Example (Casual Game):**
```
Target: 500 soft currency per active day

Login Bonus: 100 (20%)
3 Levels Completed: 150 (30%)
Daily Quests (3): 150 (30%)
5 Ad Watches: 100 (20%)
---
Total: 500 soft currency
```

### Sink Types and Purposes

| Sink | Impact | Purpose | Implementation |
|------|--------|---------|----------------|
| **Upgrades** | Permanent | Core progression | Power/efficiency increases |
| **Consumables** | One-time use | Strategic options | Boosters, revives, hints |
| **Gacha/Loot** | Variable | Collection/excitement | Random rewards with odds |
| **Time Skip** | Convenience | Monetization | Skip wait timers |
| **Cosmetics** | Aesthetic only | Self-expression | No gameplay impact |
| **Repair/Maint** | Tax on play | Prevent hoarding | Equipment durability |
| **Entry Fees** | Per attempt | Adds stakes | Tournament/special modes |

**Sink Priority Order:**
1. **Essential sinks**: Required for progress (upgrades)
2. **Convenience sinks**: Optional acceleration (time skip)
3. **Expression sinks**: Purely cosmetic (skins)

### Earning Rate Calibration

#### Session-Based Earning

```
Earning_Per_Session = Session_Length * Earning_Rate_Per_Minute

Guidelines:
- Hyper-casual: 5-20 soft currency per minute
- Puzzle: 20-50 soft currency per minute
- RPG/Strategy: 50-200 soft currency per minute
- Idle: Variable (offline accumulation)
```

**Implementation:**
```swift
struct EarningRateCalculator {
    enum GameGenre {
        case hyperCasual
        case puzzle
        case rpg
        case idle

        var earningPerMinute: ClosedRange<Int> {
            switch self {
            case .hyperCasual: return 5...20
            case .puzzle: return 20...50
            case .rpg: return 50...200
            case .idle: return 100...500
            }
        }

        var typicalSessionMinutes: Int {
            switch self {
            case .hyperCasual: return 3
            case .puzzle: return 10
            case .rpg: return 20
            case .idle: return 2 // Active portion
            }
        }
    }

    let genre: GameGenre

    func expectedEarningsPerSession() -> ClosedRange<Int> {
        let min = genre.earningPerMinute.lowerBound * genre.typicalSessionMinutes
        let max = genre.earningPerMinute.upperBound * genre.typicalSessionMinutes
        return min...max
    }

    func targetDailyEarnings(sessionsPerDay: Int) -> ClosedRange<Int> {
        let perSession = expectedEarningsPerSession()
        return (perSession.lowerBound * sessionsPerDay)...(perSession.upperBound * sessionsPerDay)
    }
}
```

#### Purchase Power Calibration

```
Time_To_Earn_Item = Item_Cost / Earning_Rate

Guidelines:
- Common items: 1-5 minutes of play
- Uncommon items: 15-30 minutes of play
- Rare items: 1-3 hours of play
- Epic items: 1-3 days of play
- Legendary items: 1-2 weeks of play OR premium currency
```

### Spending Opportunity Design

#### Spending Moment Triggers

| Trigger | Timing | Offer Type |
|---------|--------|------------|
| Level Failed | Immediate | Retry/Continue for currency |
| Level Complete | Post-victory | Booster for next level |
| Energy Depleted | When blocked | Refill energy |
| New Content Unlocked | Achievement | Themed bundle |
| Return After Absence | App open | Welcome back deal |
| Near-Miss | Almost won | One more chance |
| Collection Gap | Viewing collection | Missing items |

#### Spending UI Patterns

```swift
enum SpendingOpportunity {
    case continuePlay(cost: Int, benefit: String)
    case booster(cost: Int, effect: String, duration: Int)
    case bundle(cost: Int, items: [String], savings: Int)
    case cosmetic(cost: Int, item: String)
    case timeSkip(cost: Int, hoursSkipped: Int)

    var urgencyLevel: UrgencyLevel {
        switch self {
        case .continuePlay: return .high     // Lose progress otherwise
        case .booster: return .medium        // Optional advantage
        case .bundle: return .medium         // Limited time
        case .cosmetic: return .low          // Pure desire
        case .timeSkip: return .low          // Convenience
        }
    }

    enum UrgencyLevel {
        case high   // Player may lose something
        case medium // Clear benefit, limited time
        case low    // Want, not need
    }
}
```

### F2P vs Premium Economy Differences

| Aspect | F2P Economy | Premium Economy |
|--------|-------------|-----------------|
| Initial Currency | Generous (500-2000 soft) | Moderate (player already invested) |
| Earning Rate | Designed around IAP option | Can be faster (no conversion pressure) |
| Hard Currency | Essential for monetization | Optional or absent |
| Time Gates | Common (drives IAP) | Minimal (player paid for access) |
| Content Gating | Progression-locked | Often fully unlocked |
| Ads | Rewarded ads for currency | No ads |
| Cosmetic Pricing | Premium currency | Soft currency acceptable |

**F2P Conversion Funnel:**
```
Free Player -> Engaged Player -> Minnow ($1-10) -> Dolphin ($10-50) -> Whale ($50+)

Conversion Rates (Industry Average):
Free to Any Purchase: 2-5%
Minnow to Dolphin: 20-30%
Dolphin to Whale: 5-10%
```

### Inflation Control Mechanisms

#### Prevention Strategies

| Mechanism | Description | Implementation |
|-----------|-------------|----------------|
| **Currency Cap** | Maximum holdable currency | Soft cap with warning, hard cap |
| **Scaling Costs** | Prices increase with progression | Cost = base * (1 + 0.1 * level) |
| **Time Decay** | Currency loses value over time | Seasonal reset, daily caps |
| **Transaction Tax** | % lost on trades/transfers | 5-15% on player-to-player |
| **Prestige Reset** | Full reset for bonuses | Idle game pattern |
| **Exclusive Sinks** | Content requiring large currency dumps | Limited edition items |

**Implementation:**
```swift
struct InflationController {
    let baseCurrencyCap: Int = 100_000
    let warningThreshold: Double = 0.8 // 80% of cap

    func checkCurrencyHealth(currentAmount: Int, level: Int) -> CurrencyHealth {
        let adjustedCap = baseCurrencyCap + (level * 5000)
        let ratio = Double(currentAmount) / Double(adjustedCap)

        if ratio >= 1.0 {
            return .capped(overflow: currentAmount - adjustedCap)
        } else if ratio >= warningThreshold {
            return .warning(roomRemaining: adjustedCap - currentAmount)
        } else {
            return .healthy
        }
    }

    func scaledCost(baseCost: Int, playerLevel: Int, inflationFactor: Double = 0.05) -> Int {
        return Int(Double(baseCost) * (1.0 + inflationFactor * Double(playerLevel)))
    }

    func applyTransactionTax(amount: Int, taxRate: Double = 0.1) -> (transferred: Int, taxed: Int) {
        let tax = Int(Double(amount) * taxRate)
        return (amount - tax, tax)
    }

    enum CurrencyHealth {
        case healthy
        case warning(roomRemaining: Int)
        case capped(overflow: Int)
    }
}
```

### Economy Simulation Approach

#### Monte Carlo Simulation

```swift
final class EconomySimulator {
    struct PlayerProfile {
        var currency: Int
        var level: Int
        var daysPlayed: Int
        var purchaseProbability: Double // 0-1
        var sessionsPerDay: Double
    }

    struct SimulationConfig {
        let faucets: [Faucet]
        let sinks: [Sink]
        let simulationDays: Int
        let playerCount: Int
    }

    struct Faucet {
        let name: String
        let amount: Int
        let probabilityPerSession: Double
    }

    struct Sink {
        let name: String
        let cost: Int
        let probabilityPerSession: Double
    }

    func simulate(config: SimulationConfig) -> SimulationResult {
        var players: [PlayerProfile] = (0..<config.playerCount).map { _ in
            PlayerProfile(
                currency: 500, // Starting currency
                level: 1,
                daysPlayed: 0,
                purchaseProbability: Double.random(in: 0.01...0.1),
                sessionsPerDay: Double.random(in: 1...5)
            )
        }

        var dailySnapshots: [DailySnapshot] = []

        for day in 1...config.simulationDays {
            var totalCurrencyInEconomy = 0
            var totalSpentToday = 0
            var totalEarnedToday = 0

            for i in 0..<players.count {
                let sessions = Int(players[i].sessionsPerDay)

                for _ in 0..<sessions {
                    // Apply faucets
                    for faucet in config.faucets {
                        if Double.random(in: 0...1) < faucet.probabilityPerSession {
                            players[i].currency += faucet.amount
                            totalEarnedToday += faucet.amount
                        }
                    }

                    // Apply sinks
                    for sink in config.sinks {
                        if Double.random(in: 0...1) < sink.probabilityPerSession &&
                           players[i].currency >= sink.cost {
                            players[i].currency -= sink.cost
                            totalSpentToday += sink.cost
                        }
                    }
                }

                players[i].daysPlayed += 1
                totalCurrencyInEconomy += players[i].currency
            }

            dailySnapshots.append(DailySnapshot(
                day: day,
                totalCurrencyInEconomy: totalCurrencyInEconomy,
                averageCurrencyPerPlayer: totalCurrencyInEconomy / config.playerCount,
                currencyEarned: totalEarnedToday,
                currencySpent: totalSpentToday
            ))
        }

        return SimulationResult(
            dailySnapshots: dailySnapshots,
            inflationRate: calculateInflationRate(snapshots: dailySnapshots)
        )
    }

    private func calculateInflationRate(snapshots: [DailySnapshot]) -> Double {
        guard snapshots.count >= 7 else { return 0 }

        let weekAgo = snapshots[snapshots.count - 7].totalCurrencyInEconomy
        let today = snapshots[snapshots.count - 1].totalCurrencyInEconomy

        return (Double(today) / Double(weekAgo)) - 1.0
    }

    struct DailySnapshot {
        let day: Int
        let totalCurrencyInEconomy: Int
        let averageCurrencyPerPlayer: Int
        let currencyEarned: Int
        let currencySpent: Int
    }

    struct SimulationResult {
        let dailySnapshots: [DailySnapshot]
        let inflationRate: Double

        var isHealthy: Bool {
            return inflationRate >= -0.01 && inflationRate <= 0.02
        }
    }
}
```

### Pinch Point Optimization

#### Definition

**Pinch Point**: The optimal scarcity level where demand is maximized because players are concerned about supply but can still acquire resources through reasonable effort.

#### Pinch Point Formula

```
Pinch_Severity = (Desired_Spending - Available_Currency) / Desired_Spending

Optimal Range: 0.2 to 0.5 (20-50% short of desired purchase)

< 0.2: Too easy, no conversion pressure
> 0.5: Too hard, frustration and churn
```

**Implementation:**
```swift
struct PinchPointAnalyzer {
    struct PinchMetrics {
        let severity: Double
        let recommendation: PinchRecommendation
    }

    enum PinchRecommendation {
        case tooLoose(adjustment: String)
        case optimal
        case tooTight(adjustment: String)
    }

    func analyzePinchPoint(
        playerCurrency: Int,
        desiredPurchaseCost: Int
    ) -> PinchMetrics {
        let shortfall = max(0, desiredPurchaseCost - playerCurrency)
        let severity = Double(shortfall) / Double(desiredPurchaseCost)

        let recommendation: PinchRecommendation

        if severity < 0.2 {
            recommendation = .tooLoose(
                adjustment: "Consider reducing faucets by \(Int((0.2 - severity) * 100))%"
            )
        } else if severity > 0.5 {
            recommendation = .tooTight(
                adjustment: "Consider increasing faucets or offering bundle deals"
            )
        } else {
            recommendation = .optimal
        }

        return PinchMetrics(severity: severity, recommendation: recommendation)
    }

    func optimizePinchTiming(
        earningRate: Int, // Per session
        desiredPurchaseCost: Int,
        targetSessionsToAfford: Int
    ) -> Int {
        // Calculate what earning rate achieves target sessions
        return desiredPurchaseCost / targetSessionsToAfford
    }
}
```

#### Pinch Point Timing

| Purchase Type | Sessions to Afford | Days to Afford |
|---------------|-------------------|----------------|
| Common upgrade | 1-2 sessions | Same day |
| Uncommon upgrade | 3-5 sessions | 1-2 days |
| Rare upgrade | 10-20 sessions | 3-7 days |
| Epic upgrade | 50+ sessions | 2-3 weeks |
| Legendary item | 100+ sessions | 1-2 months OR IAP |

### IAP Pricing Guidelines

#### Price Point Psychology

| Price | Conversion Rate | Target Audience |
|-------|-----------------|-----------------|
| $0.99-$1.99 | Highest | Impulse, first purchase |
| $2.99-$4.99 | High | Engaged players |
| $9.99-$19.99 | Medium | Committed players |
| $49.99-$99.99 | Low | Whales |

#### Value Anchoring

```
Always show "value" comparison:

❌ Wrong: "100 Gems - $4.99"
✅ Right: "100 Gems - $4.99 (Best Value! 20% Bonus)"

Bundle the best deal prominently:
- Starter Pack: $0.99 (90% off, one-time)
- Weekly Deal: $4.99 (refreshes weekly)
- Mega Bundle: $19.99 (most gems per dollar)
```

#### Hard Currency Exchange Rates

```
Base Rate: $1 = 100 hard currency (gems)

Volume Bonuses:
$0.99  = 80 gems  (80 gems/$)
$4.99  = 500 gems (100 gems/$)
$9.99  = 1100 gems (110 gems/$)
$19.99 = 2400 gems (120 gems/$)
$49.99 = 6500 gems (130 gems/$)
$99.99 = 14000 gems (140 gems/$)
```

**Implementation:**
```swift
struct IAPCatalog {
    struct IAPItem {
        let identifier: String
        let price: Decimal
        let currencyAmount: Int
        let bonusPercentage: Int
        let isOneTimePurchase: Bool

        var valuePerDollar: Double {
            return Double(currencyAmount) / NSDecimalNumber(decimal: price).doubleValue
        }
    }

    static let gems: [IAPItem] = [
        IAPItem(identifier: "gems_80", price: 0.99, currencyAmount: 80, bonusPercentage: 0, isOneTimePurchase: false),
        IAPItem(identifier: "gems_500", price: 4.99, currencyAmount: 500, bonusPercentage: 25, isOneTimePurchase: false),
        IAPItem(identifier: "gems_1100", price: 9.99, currencyAmount: 1100, bonusPercentage: 38, isOneTimePurchase: false),
        IAPItem(identifier: "gems_2400", price: 19.99, currencyAmount: 2400, bonusPercentage: 50, isOneTimePurchase: false),
        IAPItem(identifier: "gems_6500", price: 49.99, currencyAmount: 6500, bonusPercentage: 63, isOneTimePurchase: false),
        IAPItem(identifier: "gems_14000", price: 99.99, currencyAmount: 14000, bonusPercentage: 75, isOneTimePurchase: false),
    ]

    static let starterPack = IAPItem(
        identifier: "starter_pack",
        price: 0.99,
        currencyAmount: 500, // 5x normal value
        bonusPercentage: 400,
        isOneTimePurchase: true
    )
}
```

## Implementation Patterns

### Complete Economy Manager

```swift
import Foundation

final class EconomyManager {
    // MARK: - Currencies

    private(set) var softCurrency: Int = 0 {
        didSet { notifyObservers() }
    }

    private(set) var hardCurrency: Int = 0 {
        didSet { notifyObservers() }
    }

    // MARK: - Configuration

    struct Config {
        let startingSoftCurrency: Int
        let startingHardCurrency: Int
        let softCurrencyCap: Int
        let hardToSoftExchangeRate: Int // 1 hard = X soft
    }

    private let config: Config
    private var observers: [(EconomyManager) -> Void] = []

    // MARK: - Analytics Tracking

    private var totalSoftEarned: Int = 0
    private var totalSoftSpent: Int = 0
    private var totalHardEarned: Int = 0
    private var totalHardSpent: Int = 0

    // MARK: - Initialization

    init(config: Config) {
        self.config = config
        self.softCurrency = config.startingSoftCurrency
        self.hardCurrency = config.startingHardCurrency
    }

    // MARK: - Currency Operations

    enum TransactionResult {
        case success(newBalance: Int)
        case insufficientFunds(shortfall: Int)
        case capReached(overflow: Int)
    }

    @discardableResult
    func grantSoftCurrency(_ amount: Int, source: String) -> TransactionResult {
        let potentialNew = softCurrency + amount

        if potentialNew > config.softCurrencyCap {
            let overflow = potentialNew - config.softCurrencyCap
            softCurrency = config.softCurrencyCap
            totalSoftEarned += (amount - overflow)
            logTransaction(type: .softEarn, amount: amount - overflow, source: source)
            return .capReached(overflow: overflow)
        }

        softCurrency = potentialNew
        totalSoftEarned += amount
        logTransaction(type: .softEarn, amount: amount, source: source)
        return .success(newBalance: softCurrency)
    }

    @discardableResult
    func spendSoftCurrency(_ amount: Int, sink: String) -> TransactionResult {
        if softCurrency < amount {
            return .insufficientFunds(shortfall: amount - softCurrency)
        }

        softCurrency -= amount
        totalSoftSpent += amount
        logTransaction(type: .softSpend, amount: amount, source: sink)
        return .success(newBalance: softCurrency)
    }

    @discardableResult
    func grantHardCurrency(_ amount: Int, source: String) -> TransactionResult {
        hardCurrency += amount
        totalHardEarned += amount
        logTransaction(type: .hardEarn, amount: amount, source: source)
        return .success(newBalance: hardCurrency)
    }

    @discardableResult
    func spendHardCurrency(_ amount: Int, sink: String) -> TransactionResult {
        if hardCurrency < amount {
            return .insufficientFunds(shortfall: amount - hardCurrency)
        }

        hardCurrency -= amount
        totalHardSpent += amount
        logTransaction(type: .hardSpend, amount: amount, source: sink)
        return .success(newBalance: hardCurrency)
    }

    func exchangeHardForSoft(_ hardAmount: Int) -> TransactionResult {
        guard hardCurrency >= hardAmount else {
            return .insufficientFunds(shortfall: hardAmount - hardCurrency)
        }

        let softAmount = hardAmount * config.hardToSoftExchangeRate

        if case .success = spendHardCurrency(hardAmount, sink: "exchange") {
            return grantSoftCurrency(softAmount, source: "exchange")
        }

        return .insufficientFunds(shortfall: hardAmount - hardCurrency)
    }

    // MARK: - Purchase Checks

    func canAfford(softCost: Int) -> Bool {
        return softCurrency >= softCost
    }

    func canAfford(hardCost: Int) -> Bool {
        return hardCurrency >= hardCost
    }

    func shortfall(forSoftCost cost: Int) -> Int {
        return max(0, cost - softCurrency)
    }

    func shortfall(forHardCost cost: Int) -> Int {
        return max(0, cost - hardCurrency)
    }

    // MARK: - Analytics

    func getEconomyHealth() -> EconomyHealth {
        let netSoftFlow = totalSoftEarned - totalSoftSpent
        let netHardFlow = totalHardEarned - totalHardSpent

        return EconomyHealth(
            softCurrencyBalance: softCurrency,
            hardCurrencyBalance: hardCurrency,
            totalSoftEarned: totalSoftEarned,
            totalSoftSpent: totalSoftSpent,
            totalHardEarned: totalHardEarned,
            totalHardSpent: totalHardSpent,
            netSoftFlow: netSoftFlow,
            netHardFlow: netHardFlow
        )
    }

    struct EconomyHealth {
        let softCurrencyBalance: Int
        let hardCurrencyBalance: Int
        let totalSoftEarned: Int
        let totalSoftSpent: Int
        let totalHardEarned: Int
        let totalHardSpent: Int
        let netSoftFlow: Int
        let netHardFlow: Int
    }

    // MARK: - Transaction Logging

    private enum TransactionType {
        case softEarn, softSpend, hardEarn, hardSpend
    }

    private func logTransaction(type: TransactionType, amount: Int, source: String) {
        // Hook for analytics integration
        // Example: AnalyticsManager.shared.logEconomyEvent(...)
    }

    // MARK: - Observation

    func observe(_ observer: @escaping (EconomyManager) -> Void) {
        observers.append(observer)
    }

    private func notifyObservers() {
        observers.forEach { $0(self) }
    }

    // MARK: - Persistence

    func save() -> [String: Any] {
        return [
            "softCurrency": softCurrency,
            "hardCurrency": hardCurrency,
            "totalSoftEarned": totalSoftEarned,
            "totalSoftSpent": totalSoftSpent,
            "totalHardEarned": totalHardEarned,
            "totalHardSpent": totalHardSpent
        ]
    }

    func load(from data: [String: Any]) {
        softCurrency = data["softCurrency"] as? Int ?? config.startingSoftCurrency
        hardCurrency = data["hardCurrency"] as? Int ?? config.startingHardCurrency
        totalSoftEarned = data["totalSoftEarned"] as? Int ?? 0
        totalSoftSpent = data["totalSoftSpent"] as? Int ?? 0
        totalHardEarned = data["totalHardEarned"] as? Int ?? 0
        totalHardSpent = data["totalHardSpent"] as? Int ?? 0
    }
}
```

### Store UI Manager

```swift
import SwiftUI

struct StoreItem: Identifiable {
    let id: String
    let name: String
    let description: String
    let icon: String
    let costType: CostType
    let cost: Int
    let category: Category

    enum CostType {
        case soft
        case hard
        case real(price: Decimal)
    }

    enum Category {
        case upgrade
        case consumable
        case cosmetic
        case bundle
    }
}

final class StoreManager: ObservableObject {
    @Published var items: [StoreItem] = []
    @Published var featuredItem: StoreItem?

    private let economyManager: EconomyManager

    init(economyManager: EconomyManager) {
        self.economyManager = economyManager
        loadStoreItems()
    }

    func purchase(_ item: StoreItem) -> PurchaseResult {
        switch item.costType {
        case .soft:
            let result = economyManager.spendSoftCurrency(item.cost, sink: "store_\(item.id)")
            return mapTransactionResult(result, item: item)

        case .hard:
            let result = economyManager.spendHardCurrency(item.cost, sink: "store_\(item.id)")
            return mapTransactionResult(result, item: item)

        case .real:
            // Trigger StoreKit purchase flow
            return .pendingIAP
        }
    }

    func canAfford(_ item: StoreItem) -> Bool {
        switch item.costType {
        case .soft:
            return economyManager.canAfford(softCost: item.cost)
        case .hard:
            return economyManager.canAfford(hardCost: item.cost)
        case .real:
            return true // IAP always available to attempt
        }
    }

    func shortfall(for item: StoreItem) -> Int {
        switch item.costType {
        case .soft:
            return economyManager.shortfall(forSoftCost: item.cost)
        case .hard:
            return economyManager.shortfall(forHardCost: item.cost)
        case .real:
            return 0
        }
    }

    private func mapTransactionResult(
        _ result: EconomyManager.TransactionResult,
        item: StoreItem
    ) -> PurchaseResult {
        switch result {
        case .success:
            return .success(item: item)
        case .insufficientFunds(let shortfall):
            return .insufficientFunds(shortfall: shortfall, currencyNeeded: item.costType)
        case .capReached:
            return .success(item: item) // Still succeeded
        }
    }

    private func loadStoreItems() {
        // Load from configuration
    }

    enum PurchaseResult {
        case success(item: StoreItem)
        case insufficientFunds(shortfall: Int, currencyNeeded: StoreItem.CostType)
        case pendingIAP
        case failed(reason: String)
    }
}
```

## Decision Trees

### Currency Type Selection

```
START: What is being purchased?

[Power/Progression items]
    -> Is it permanent?
        [Yes] -> Can be soft OR hard (hard for premium)
        [No]  -> Soft currency (consumables)

[Time acceleration]
    -> Hard currency only (monetization)

[Cosmetics]
    -> Is it limited edition?
        [Yes] -> Hard currency
        [No]  -> Soft or hard (soft builds engagement)

[Entry/Access fees]
    -> Soft currency (gameplay-related)
    -> Hard currency for premium modes

[Real-money purchases]
    -> Hard currency bundles
    -> Special bundles (one-time offers)
    -> Battle Pass / Subscriptions
```

### Sink/Faucet Adjustment

```
PROBLEM: Players have too much currency (inflation)

SOLUTIONS (in order):
1. Introduce new sinks (cosmetics, upgrades)
2. Create limited-time events with high costs
3. Reduce faucet rates by 10-20%
4. Add transaction taxes on trades
5. Implement currency caps

---

PROBLEM: Players have too little currency (frustration)

SOLUTIONS (in order):
1. Add catch-up bonus for returning players
2. Increase quest rewards by 20-30%
3. Offer one-time starter bundles at high value
4. Reduce prices of common items
5. Add more rewarded ad opportunities
```

## Quality Checklist

### Currency Balance
- [ ] Soft currency earnable at genre-appropriate rate
- [ ] Hard currency rare enough to feel valuable
- [ ] Exchange rate between currencies feels fair
- [ ] Currency caps prevent extreme hoarding
- [ ] Both currencies have meaningful sinks

### Sink/Faucet Health
- [ ] Daily net flow is balanced (±10%)
- [ ] Week-over-week inflation < 2%
- [ ] No currency drought > 3 sessions
- [ ] No currency flood overwhelming spending options
- [ ] Economy simulation run for 30+ simulated days

### Monetization Integration
- [ ] First IAP opportunity is high value (starter pack)
- [ ] Price points cover all ranges ($0.99 to $99.99)
- [ ] Volume bonuses reward larger purchases
- [ ] No pay-to-win complaints (cosmetics viable)
- [ ] Conversion pinch points at 20-50% severity

### Player Experience
- [ ] F2P player can complete core content
- [ ] Spending feels optional, not required
- [ ] Currency UI is clear and always visible
- [ ] Purchase confirmations prevent accidents
- [ ] Refund policy communicated

## Anti-Patterns

### Anti-Pattern: Pay Wall Core Content

**Wrong:**
```
Level 10: PAY $4.99 TO CONTINUE
(Cannot progress without purchase)
```

**Right:**
```
Level 10: Hard, may take multiple attempts
Optional: Buy boosters to make it easier
Eventual: Skill-based completion always possible
```

**Consequence:** App Store rejection risk (2.3, 3.1.1), negative reviews, player churn. Core content must be accessible to all.

### Anti-Pattern: Infinite Faucet

**Wrong:**
```swift
// Unlimited ad watching
func watchAd() {
    grantCurrency(50) // No daily cap
}
// Player watches 100 ads, earns 5000 currency, skips all progression
```

**Right:**
```swift
func watchAd() {
    guard dailyAdWatches < 10 else {
        showMessage("Come back tomorrow for more!")
        return
    }
    grantCurrency(50)
    dailyAdWatches += 1
}
```

**Consequence:** Economy breaks, no conversion pressure, players exploit system then leave bored.

### Anti-Pattern: Unclear Pricing

**Wrong:**
```
Item A: 500 gems
Item B: 750 gems
Item C: 1200 gems
(Player has no idea what a gem is worth)
```

**Right:**
```
Item A: 500 gems (~$2.50 value)
Item B: 750 gems (~$3.75 value) POPULAR!
Item C: 1200 gems (~$6.00 value) BEST VALUE

Shop: 500 gems = $4.99, 1100 gems = $9.99
```

**Consequence:** Players avoid spending due to uncertainty. Always anchor value.

### Anti-Pattern: Punishing Free Players

**Wrong:**
```
Free: 5 energy, regenerates 1/hour
Paid: Unlimited energy

Free player can play 15 minutes/day maximum
```

**Right:**
```
Free: 20 energy, regenerates 1/10 minutes
Paid: 2x energy cap, faster regeneration

Free player: 1-2 hours of play per day
Paid player: 3-4 hours, more convenience
```

**Consequence:** Free players churn before becoming paid players. F2P must be viable.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `progression-system` | XP earnings often tied to currency earnings |
| `core-loop-architect` | Economy rewards are part of core loop |
| `reward-scheduler` | Currency is primary reward type |
| `session-designer` | Currency gates can affect session length |
| `difficulty-tuner` | Purchasing boosters affects difficulty |
| `iap-implementation` | Technical implementation of premium purchases |
