# Economy Balancer - Code Patterns

## Economy Balance Calculator

```swift
struct EconomyBalance {
    // Faucets (currency entering)
    var dailyLoginReward: Int = 100
    var levelCompletionReward: Int = 50
    var questRewards: Int = 200
    var adRewardPerWatch: Int = 25
    var expectedAdsPerDay: Int = 5
    var achievementRewards: Int = 50

    // Sinks (currency leaving)
    var upgradesCostPerDay: Int = 150
    var consumablesPurchased: Int = 100
    var retryFees: Int = 50
    var cosmeticPurchases: Int = 100
    var premiumSpeedUps: Int = 0

    var totalDailyFaucet: Int {
        return dailyLoginReward + levelCompletionReward + questRewards +
               (adRewardPerWatch * expectedAdsPerDay) + achievementRewards
    }

    var totalDailySink: Int {
        return upgradesCostPerDay + consumablesPurchased + retryFees +
               cosmeticPurchases + premiumSpeedUps
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

## Economy Manager

```swift
final class EconomyManager {
    private(set) var softCurrency: Int = 0
    private(set) var hardCurrency: Int = 0

    struct Config {
        let startingSoftCurrency: Int
        let startingHardCurrency: Int
        let softCurrencyCap: Int
        let hardToSoftExchangeRate: Int
    }

    private let config: Config

    enum TransactionResult {
        case success(newBalance: Int)
        case insufficientFunds(shortfall: Int)
        case capReached(overflow: Int)
    }

    init(config: Config) {
        self.config = config
        self.softCurrency = config.startingSoftCurrency
        self.hardCurrency = config.startingHardCurrency
    }

    @discardableResult
    func grantSoftCurrency(_ amount: Int, source: String) -> TransactionResult {
        let potentialNew = softCurrency + amount

        if potentialNew > config.softCurrencyCap {
            let overflow = potentialNew - config.softCurrencyCap
            softCurrency = config.softCurrencyCap
            return .capReached(overflow: overflow)
        }

        softCurrency = potentialNew
        return .success(newBalance: softCurrency)
    }

    @discardableResult
    func spendSoftCurrency(_ amount: Int, sink: String) -> TransactionResult {
        if softCurrency < amount {
            return .insufficientFunds(shortfall: amount - softCurrency)
        }
        softCurrency -= amount
        return .success(newBalance: softCurrency)
    }

    @discardableResult
    func grantHardCurrency(_ amount: Int, source: String) -> TransactionResult {
        hardCurrency += amount
        return .success(newBalance: hardCurrency)
    }

    @discardableResult
    func spendHardCurrency(_ amount: Int, sink: String) -> TransactionResult {
        if hardCurrency < amount {
            return .insufficientFunds(shortfall: amount - hardCurrency)
        }
        hardCurrency -= amount
        return .success(newBalance: hardCurrency)
    }

    func canAfford(softCost: Int) -> Bool { softCurrency >= softCost }
    func canAfford(hardCost: Int) -> Bool { hardCurrency >= hardCost }
    func shortfall(forSoftCost cost: Int) -> Int { max(0, cost - softCurrency) }
}
```

## Inflation Controller

```swift
struct InflationController {
    let baseCurrencyCap: Int = 100_000
    let warningThreshold: Double = 0.8

    enum CurrencyHealth {
        case healthy
        case warning(roomRemaining: Int)
        case capped(overflow: Int)
    }

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
}
```

## Pinch Point Analyzer

```swift
struct PinchPointAnalyzer {
    enum PinchRecommendation {
        case tooLoose(adjustment: String)
        case optimal
        case tooTight(adjustment: String)
    }

    struct PinchMetrics {
        let severity: Double
        let recommendation: PinchRecommendation
    }

    func analyzePinchPoint(playerCurrency: Int, desiredPurchaseCost: Int) -> PinchMetrics {
        let shortfall = max(0, desiredPurchaseCost - playerCurrency)
        let severity = Double(shortfall) / Double(desiredPurchaseCost)

        let recommendation: PinchRecommendation
        if severity < 0.2 {
            recommendation = .tooLoose(adjustment: "Reduce faucets by \(Int((0.2 - severity) * 100))%")
        } else if severity > 0.5 {
            recommendation = .tooTight(adjustment: "Increase faucets or offer bundle deals")
        } else {
            recommendation = .optimal
        }

        return PinchMetrics(severity: severity, recommendation: recommendation)
    }
}
```

## IAP Catalog

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

## Spending Opportunity Types

```swift
enum SpendingOpportunity {
    case continuePlay(cost: Int, benefit: String)
    case booster(cost: Int, effect: String, duration: Int)
    case bundle(cost: Int, items: [String], savings: Int)
    case cosmetic(cost: Int, item: String)
    case timeSkip(cost: Int, hoursSkipped: Int)

    enum UrgencyLevel { case high, medium, low }

    var urgencyLevel: UrgencyLevel {
        switch self {
        case .continuePlay: return .high
        case .booster: return .medium
        case .bundle: return .medium
        case .cosmetic: return .low
        case .timeSkip: return .low
        }
    }
}
```
