# Analytics Integration Code Patterns

## GameEvent Enum

```swift
protocol AnalyticsEvent {
    var name: String { get }
    var parameters: [String: Any] { get }
}

enum GameEvent: AnalyticsEvent {
    // Session
    case sessionStart(sessionId: String)
    case sessionEnd(sessionId: String, duration: TimeInterval)

    // Progression
    case levelStart(level: Int, difficulty: String)
    case levelComplete(level: Int, score: Int, duration: TimeInterval, stars: Int)
    case levelFail(level: Int, reason: String, progress: Double)

    // Economy
    case currencyEarned(currency: String, amount: Int, source: String)
    case currencySpent(currency: String, amount: Int, item: String)

    // Engagement
    case tutorialStep(step: Int, stepName: String)
    case tutorialComplete(duration: TimeInterval)
    case featureUsed(feature: String, context: String)

    // Business
    case iapInitiated(productId: String, price: Decimal, currency: String)
    case iapCompleted(productId: String, transactionId: String)
    case adCompleted(adType: String, placement: String, rewarded: Bool)

    var name: String {
        switch self {
        case .sessionStart: return "session_start"
        case .sessionEnd: return "session_end"
        case .levelStart: return "level_start"
        case .levelComplete: return "level_complete"
        case .levelFail: return "level_fail"
        case .currencyEarned: return "currency_earned"
        case .currencySpent: return "currency_spent"
        case .tutorialStep: return "tutorial_step"
        case .tutorialComplete: return "tutorial_complete"
        case .featureUsed: return "feature_used"
        case .iapInitiated: return "iap_initiated"
        case .iapCompleted: return "iap_completed"
        case .adCompleted: return "ad_completed"
        }
    }

    var parameters: [String: Any] {
        switch self {
        case .sessionStart(let id): return ["session_id": id]
        case .sessionEnd(let id, let dur): return ["session_id": id, "duration_seconds": Int(dur)]
        case .levelStart(let lvl, let diff): return ["level": lvl, "difficulty": diff]
        case .levelComplete(let lvl, let score, let dur, let stars):
            return ["level": lvl, "score": score, "duration_seconds": Int(dur), "stars": stars]
        case .levelFail(let lvl, let reason, let prog):
            return ["level": lvl, "fail_reason": reason, "progress_percent": Int(prog * 100)]
        case .currencyEarned(let curr, let amt, let src):
            return ["currency": curr, "amount": amt, "source": src]
        case .currencySpent(let curr, let amt, let item):
            return ["currency": curr, "amount": amt, "item": item]
        case .tutorialStep(let step, let name): return ["step": step, "step_name": name]
        case .tutorialComplete(let dur): return ["duration_seconds": Int(dur)]
        case .featureUsed(let feat, let ctx): return ["feature": feat, "context": ctx]
        case .iapInitiated(let pid, let price, let curr):
            return ["product_id": pid, "price": NSDecimalNumber(decimal: price).doubleValue, "currency": curr]
        case .iapCompleted(let pid, let tid): return ["product_id": pid, "transaction_id": tid]
        case .adCompleted(let type, let place, let rew):
            return ["ad_type": type, "placement": place, "rewarded": rew]
        }
    }
}
```

## AnalyticsManager

```swift
protocol AnalyticsProvider {
    func track(event: AnalyticsEvent)
    func setUserProperty(_ value: String?, forKey key: String)
    func setUserId(_ userId: String?)
}

final class AnalyticsManager {
    static let shared = AnalyticsManager()

    private var providers: [AnalyticsProvider] = []
    private var sessionId: String?
    var isDebugMode = false

    func configure(providers: [AnalyticsProvider]) { self.providers = providers }

    func track(_ event: GameEvent) {
        if isDebugMode { print("Analytics: \(event.name) \(event.parameters)") }
        providers.forEach { $0.track(event: event) }
    }

    func setUserProperty(_ value: String?, forKey key: String) {
        providers.forEach { $0.setUserProperty(value, forKey: key) }
    }

    func startSession() {
        sessionId = UUID().uuidString
        track(.sessionStart(sessionId: sessionId!))
    }

    func endSession(startTime: Date) {
        guard let id = sessionId else { return }
        track(.sessionEnd(sessionId: id, duration: Date().timeIntervalSince(startTime)))
        sessionId = nil
    }
}
```

## Funnel Tracking

```swift
struct FunnelDefinition {
    let name: String
    let steps: [FunnelStep]

    struct FunnelStep {
        let name: String
        let eventName: String
        let requiredParams: [String: Any]?
    }

    static let ftue = FunnelDefinition(name: "FTUE", steps: [
        FunnelStep(name: "App Opened", eventName: "session_start", requiredParams: nil),
        FunnelStep(name: "Tutorial Started", eventName: "tutorial_step", requiredParams: ["step": 1]),
        FunnelStep(name: "Tutorial Complete", eventName: "tutorial_complete", requiredParams: nil),
        FunnelStep(name: "First Level Complete", eventName: "level_complete", requiredParams: ["level": 1])
    ])

    static let conversion = FunnelDefinition(name: "Conversion", steps: [
        FunnelStep(name: "Store Opened", eventName: "menu_opened", requiredParams: ["menu": "store"]),
        FunnelStep(name: "Purchase Initiated", eventName: "iap_initiated", requiredParams: nil),
        FunnelStep(name: "Purchase Completed", eventName: "iap_completed", requiredParams: nil)
    ])
}
```

## A/B Test Manager

```swift
struct ABTest: Codable {
    let id: String
    let variants: [Variant]
    let startDate: Date

    struct Variant: Codable {
        let name: String
        let weight: Double
        let config: [String: String]
    }
}

final class ABTestManager {
    static let shared = ABTestManager()

    private var tests: [String: ABTest] = [:]
    private var assignments: [String: String] = [:]

    func registerTest(_ test: ABTest) {
        tests[test.id] = test
        if assignments[test.id] == nil { assignVariant(for: test) }
    }

    private func assignVariant(for test: ABTest) {
        let userId = UIDevice.current.identifierForVendor?.uuidString ?? UUID().uuidString
        let hash = abs("\(test.id):\(userId)".hashValue)
        let normalized = Double(hash % 10000) / 10000.0

        var cumulative = 0.0
        for variant in test.variants {
            cumulative += variant.weight
            if normalized < cumulative {
                assignments[test.id] = variant.name
                AnalyticsManager.shared.track(.featureUsed(feature: "ab_assigned", context: "\(test.id):\(variant.name)"))
                break
            }
        }
    }

    func getVariant(for testId: String) -> String? { assignments[testId] }

    func getConfig(for testId: String, key: String, default defaultValue: String) -> String {
        guard let variantName = assignments[testId],
              let test = tests[testId],
              let variant = test.variants.first(where: { $0.name == variantName }) else {
            return defaultValue
        }
        return variant.config[key] ?? defaultValue
    }
}
```

## Privacy-Compliant Wrapper

```swift
import AppTrackingTransparency

final class AnalyticsPrivacyManager {
    static let shared = AnalyticsPrivacyManager()

    enum ConsentStatus: String { case unknown, granted, denied }
    private(set) var trackingConsent: ConsentStatus = .unknown

    func requestTrackingAuthorization(completion: @escaping (ConsentStatus) -> Void) {
        if #available(iOS 14.5, *) {
            ATTrackingManager.requestTrackingAuthorization { status in
                DispatchQueue.main.async {
                    self.trackingConsent = status == .authorized ? .granted : .denied
                    completion(self.trackingConsent)
                }
            }
        } else {
            trackingConsent = .granted
            completion(.granted)
        }
    }

    var canTrackUser: Bool { trackingConsent == .granted }
}

extension AnalyticsManager {
    func trackIfAllowed(_ event: GameEvent) {
        guard AnalyticsPrivacyManager.shared.canTrackUser else { return }
        track(event)
    }
}
```

## Sample Size Calculator

```swift
struct ABTestCalculator {
    /// Calculate required sample size per variant
    static func requiredSampleSize(
        baselineRate: Double,      // e.g., 0.05 for 5%
        minimumEffect: Double,     // e.g., 0.10 for 10% relative change
        confidence: Double = 0.95,
        power: Double = 0.80
    ) -> Int {
        let p1 = baselineRate
        let p2 = baselineRate * (1 + minimumEffect)
        let pBar = (p1 + p2) / 2

        let zAlpha = 1.96 // 95% confidence
        let zBeta = 0.84  // 80% power

        let numerator = pow(zAlpha * sqrt(2 * pBar * (1-pBar)) + zBeta * sqrt(p1*(1-p1) + p2*(1-p2)), 2)
        let denominator = pow(p2 - p1, 2)

        return Int(ceil(numerator / denominator))
    }

    /// Estimate test duration in days
    static func estimatedDuration(sampleSize: Int, dailyUsers: Int, variants: Int = 2) -> Int {
        Int(ceil(Double(sampleSize * variants) / Double(dailyUsers)))
    }
}
```
