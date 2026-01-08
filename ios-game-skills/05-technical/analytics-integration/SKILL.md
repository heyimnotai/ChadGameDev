---
name: analytics-integration
description: Implements game analytics for data-driven iteration including event tracking, funnel analysis, cohort tracking, and A/B testing infrastructure. Use this skill when setting up analytics events, defining progression funnels, implementing cohort analysis, building A/B test frameworks, or ensuring privacy compliance. Triggers on any analytics requirement, player behavior tracking need, or game optimization through data.
---

# Analytics Integration

## Purpose

This skill enables Claude to implement comprehensive game analytics that support data-driven development decisions. It covers event taxonomy design, funnel definitions, cohort tracking, A/B test infrastructure, and privacy-compliant implementation. The quality bar ensures actionable data collection that enables rapid iteration while respecting player privacy and platform requirements.

## Domain Boundaries

- **This skill handles**:
  - Event taxonomy for games (session, progression, economy, engagement, error, business)
  - Funnel definitions (FTUE, conversion, progression)
  - Cohort tracking setup
  - A/B test infrastructure implementation
  - Privacy-compliant analytics
  - Analytics event implementation code
  - Minimum sample size calculations
  - Data validation and debugging

- **This skill does NOT handle**:
  - Privacy manifest configuration (see: 01-compliance/privacy-manifest)
  - App Tracking Transparency prompts (see: 01-compliance/privacy-manifest)
  - IAP transaction handling (see: 01-compliance/iap-implementation)
  - Game design decisions based on data (see: 02-core-design skills)
  - Retention mechanics implementation (see: 03-player-psychology skills)

## Core Specifications

### Event Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Session | Track app usage patterns | app_open, app_close, session_duration |
| Progression | Track player advancement | level_start, level_complete, level_fail |
| Economy | Track resource flow | currency_earned, currency_spent, item_purchased |
| Engagement | Track feature usage | tutorial_step, menu_opened, feature_used |
| Error | Track issues | crash, error, warning |
| Business | Track monetization | iap_initiated, iap_completed, ad_watched |

### Retention Benchmarks (2025)

| Metric | Median | Top 25% | Target |
|--------|--------|---------|--------|
| D1 | 26-28% | 31-33% | 45%+ |
| D7 | 3-4% | 7-8% | 20%+ |
| D30 | <3% | 5-7% | 10%+ |

### A/B Test Sample Sizes

| Minimum Detectable Effect | Confidence | Power | Sample per Variant |
|---------------------------|------------|-------|-------------------|
| 5% relative change | 95% | 80% | 6,400 |
| 10% relative change | 95% | 80% | 1,600 |
| 20% relative change | 95% | 80% | 400 |
| 5% relative change | 99% | 80% | 10,000 |

### Test Duration Requirements

| Metric Type | Minimum Duration | Recommended |
|-------------|------------------|-------------|
| Session metrics | 3 days | 7 days |
| D7 retention | 10 days | 14 days |
| D30 retention | 33 days | 45 days |
| LTV | 60 days | 90 days |

## Implementation Patterns

### Analytics Event System

```swift
import Foundation

// MARK: - Event Protocol

protocol AnalyticsEvent {
    var name: String { get }
    var parameters: [String: Any] { get }
    var timestamp: Date { get }
}

// MARK: - Event Categories

enum GameEvent: AnalyticsEvent {
    // Session Events
    case sessionStart(sessionId: String)
    case sessionEnd(sessionId: String, duration: TimeInterval)
    case sessionResume(sessionId: String)

    // Progression Events
    case levelStart(level: Int, difficulty: String)
    case levelComplete(level: Int, score: Int, duration: TimeInterval, stars: Int)
    case levelFail(level: Int, reason: String, progress: Double)
    case levelRetry(level: Int, attemptNumber: Int)

    // Economy Events
    case currencyEarned(currency: String, amount: Int, source: String)
    case currencySpent(currency: String, amount: Int, item: String, category: String)
    case itemPurchased(itemId: String, currency: String, amount: Int)
    case itemUsed(itemId: String, context: String)

    // Engagement Events
    case tutorialStep(step: Int, stepName: String)
    case tutorialComplete(duration: TimeInterval)
    case tutorialSkipped(atStep: Int)
    case featureUsed(feature: String, context: String)
    case menuOpened(menu: String)
    case settingChanged(setting: String, value: String)

    // Error Events
    case errorOccurred(code: String, message: String, context: String)
    case crashRecovered(lastScreen: String)

    // Business Events
    case iapInitiated(productId: String, price: Decimal, currency: String)
    case iapCompleted(productId: String, price: Decimal, currency: String, transactionId: String)
    case iapFailed(productId: String, error: String)
    case iapRestored(productId: String)
    case adRequested(adType: String, placement: String)
    case adLoaded(adType: String, placement: String)
    case adShown(adType: String, placement: String)
    case adClicked(adType: String, placement: String)
    case adCompleted(adType: String, placement: String, rewarded: Bool)
    case adFailed(adType: String, placement: String, error: String)

    var name: String {
        switch self {
        // Session
        case .sessionStart: return "session_start"
        case .sessionEnd: return "session_end"
        case .sessionResume: return "session_resume"

        // Progression
        case .levelStart: return "level_start"
        case .levelComplete: return "level_complete"
        case .levelFail: return "level_fail"
        case .levelRetry: return "level_retry"

        // Economy
        case .currencyEarned: return "currency_earned"
        case .currencySpent: return "currency_spent"
        case .itemPurchased: return "item_purchased"
        case .itemUsed: return "item_used"

        // Engagement
        case .tutorialStep: return "tutorial_step"
        case .tutorialComplete: return "tutorial_complete"
        case .tutorialSkipped: return "tutorial_skipped"
        case .featureUsed: return "feature_used"
        case .menuOpened: return "menu_opened"
        case .settingChanged: return "setting_changed"

        // Error
        case .errorOccurred: return "error_occurred"
        case .crashRecovered: return "crash_recovered"

        // Business
        case .iapInitiated: return "iap_initiated"
        case .iapCompleted: return "iap_completed"
        case .iapFailed: return "iap_failed"
        case .iapRestored: return "iap_restored"
        case .adRequested: return "ad_requested"
        case .adLoaded: return "ad_loaded"
        case .adShown: return "ad_shown"
        case .adClicked: return "ad_clicked"
        case .adCompleted: return "ad_completed"
        case .adFailed: return "ad_failed"
        }
    }

    var parameters: [String: Any] {
        switch self {
        // Session
        case .sessionStart(let sessionId):
            return ["session_id": sessionId]
        case .sessionEnd(let sessionId, let duration):
            return ["session_id": sessionId, "duration_seconds": Int(duration)]
        case .sessionResume(let sessionId):
            return ["session_id": sessionId]

        // Progression
        case .levelStart(let level, let difficulty):
            return ["level": level, "difficulty": difficulty]
        case .levelComplete(let level, let score, let duration, let stars):
            return ["level": level, "score": score, "duration_seconds": Int(duration), "stars": stars]
        case .levelFail(let level, let reason, let progress):
            return ["level": level, "fail_reason": reason, "progress_percent": Int(progress * 100)]
        case .levelRetry(let level, let attempt):
            return ["level": level, "attempt_number": attempt]

        // Economy
        case .currencyEarned(let currency, let amount, let source):
            return ["currency": currency, "amount": amount, "source": source]
        case .currencySpent(let currency, let amount, let item, let category):
            return ["currency": currency, "amount": amount, "item": item, "category": category]
        case .itemPurchased(let itemId, let currency, let amount):
            return ["item_id": itemId, "currency": currency, "amount": amount]
        case .itemUsed(let itemId, let context):
            return ["item_id": itemId, "context": context]

        // Engagement
        case .tutorialStep(let step, let stepName):
            return ["step": step, "step_name": stepName]
        case .tutorialComplete(let duration):
            return ["duration_seconds": Int(duration)]
        case .tutorialSkipped(let atStep):
            return ["skipped_at_step": atStep]
        case .featureUsed(let feature, let context):
            return ["feature": feature, "context": context]
        case .menuOpened(let menu):
            return ["menu": menu]
        case .settingChanged(let setting, let value):
            return ["setting": setting, "value": value]

        // Error
        case .errorOccurred(let code, let message, let context):
            return ["error_code": code, "error_message": message, "context": context]
        case .crashRecovered(let lastScreen):
            return ["last_screen": lastScreen]

        // Business
        case .iapInitiated(let productId, let price, let currency):
            return ["product_id": productId, "price": NSDecimalNumber(decimal: price).doubleValue, "currency": currency]
        case .iapCompleted(let productId, let price, let currency, let transactionId):
            return ["product_id": productId, "price": NSDecimalNumber(decimal: price).doubleValue, "currency": currency, "transaction_id": transactionId]
        case .iapFailed(let productId, let error):
            return ["product_id": productId, "error": error]
        case .iapRestored(let productId):
            return ["product_id": productId]
        case .adRequested(let adType, let placement):
            return ["ad_type": adType, "placement": placement]
        case .adLoaded(let adType, let placement):
            return ["ad_type": adType, "placement": placement]
        case .adShown(let adType, let placement):
            return ["ad_type": adType, "placement": placement]
        case .adClicked(let adType, let placement):
            return ["ad_type": adType, "placement": placement]
        case .adCompleted(let adType, let placement, let rewarded):
            return ["ad_type": adType, "placement": placement, "rewarded": rewarded]
        case .adFailed(let adType, let placement, let error):
            return ["ad_type": adType, "placement": placement, "error": error]
        }
    }

    var timestamp: Date { Date() }
}
```

### Analytics Manager

```swift
import Foundation
import os.log

// MARK: - Analytics Provider Protocol

protocol AnalyticsProvider {
    func track(event: AnalyticsEvent)
    func setUserProperty(_ value: String?, forKey key: String)
    func setUserId(_ userId: String?)
    func flush()
}

// MARK: - Analytics Manager

final class AnalyticsManager {
    static let shared = AnalyticsManager()

    private var providers: [AnalyticsProvider] = []
    private let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "Game", category: "Analytics")
    private let queue = DispatchQueue(label: "com.game.analytics", qos: .utility)

    // User properties
    private(set) var userId: String?
    private var userProperties: [String: String] = [:]

    // Session tracking
    private var sessionId: String?
    private var sessionStartTime: Date?

    // Debug mode
    var isDebugMode: Bool = false

    private init() {}

    // MARK: - Configuration

    func configure(providers: [AnalyticsProvider]) {
        self.providers = providers
    }

    func addProvider(_ provider: AnalyticsProvider) {
        providers.append(provider)
    }

    // MARK: - User Management

    func setUserId(_ userId: String?) {
        self.userId = userId
        providers.forEach { $0.setUserId(userId) }
    }

    func setUserProperty(_ value: String?, forKey key: String) {
        if let value = value {
            userProperties[key] = value
        } else {
            userProperties.removeValue(forKey: key)
        }
        providers.forEach { $0.setUserProperty(value, forKey: key) }
    }

    // MARK: - Event Tracking

    func track(_ event: GameEvent) {
        queue.async { [weak self] in
            self?.trackEvent(event)
        }
    }

    private func trackEvent(_ event: AnalyticsEvent) {
        // Debug logging
        if isDebugMode {
            logger.debug("Event: \(event.name) | Params: \(event.parameters)")
        }

        // Enrich event with common properties
        var enrichedParams = event.parameters
        enrichedParams["session_id"] = sessionId
        enrichedParams["user_id"] = userId
        enrichedParams["app_version"] = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
        enrichedParams["build_number"] = Bundle.main.infoDictionary?["CFBundleVersion"] as? String

        // Create enriched event
        let enrichedEvent = EnrichedEvent(
            name: event.name,
            parameters: enrichedParams,
            timestamp: event.timestamp
        )

        // Send to all providers
        providers.forEach { $0.track(enrichedEvent) }
    }

    // MARK: - Session Management

    func startSession() {
        sessionId = UUID().uuidString
        sessionStartTime = Date()

        track(.sessionStart(sessionId: sessionId!))

        // Set session start user property
        setUserProperty(ISO8601DateFormatter().string(from: Date()), forKey: "last_session_start")
    }

    func endSession() {
        guard let sessionId = sessionId, let startTime = sessionStartTime else { return }

        let duration = Date().timeIntervalSince(startTime)
        track(.sessionEnd(sessionId: sessionId, duration: duration))

        self.sessionId = nil
        self.sessionStartTime = nil

        flush()
    }

    func resumeSession() {
        if let sessionId = sessionId {
            track(.sessionResume(sessionId: sessionId))
        } else {
            startSession()
        }
    }

    // MARK: - Flush

    func flush() {
        providers.forEach { $0.flush() }
    }
}

// MARK: - Enriched Event

struct EnrichedEvent: AnalyticsEvent {
    let name: String
    let parameters: [String: Any]
    let timestamp: Date
}
```

### Funnel Tracking

```swift
import Foundation

// MARK: - Funnel Definition

struct FunnelDefinition {
    let name: String
    let steps: [FunnelStep]

    struct FunnelStep {
        let name: String
        let eventName: String
        let requiredParams: [String: Any]?

        init(name: String, eventName: String, requiredParams: [String: Any]? = nil) {
            self.name = name
            self.eventName = eventName
            self.requiredParams = requiredParams
        }
    }
}

// MARK: - Predefined Funnels

extension FunnelDefinition {
    static let ftue = FunnelDefinition(
        name: "FTUE",
        steps: [
            FunnelStep(name: "App Opened", eventName: "session_start"),
            FunnelStep(name: "Tutorial Started", eventName: "tutorial_step", requiredParams: ["step": 1]),
            FunnelStep(name: "Tutorial Step 2", eventName: "tutorial_step", requiredParams: ["step": 2]),
            FunnelStep(name: "Tutorial Step 3", eventName: "tutorial_step", requiredParams: ["step": 3]),
            FunnelStep(name: "Tutorial Step 4", eventName: "tutorial_step", requiredParams: ["step": 4]),
            FunnelStep(name: "Tutorial Step 5", eventName: "tutorial_step", requiredParams: ["step": 5]),
            FunnelStep(name: "Tutorial Complete", eventName: "tutorial_complete"),
            FunnelStep(name: "First Level Started", eventName: "level_start", requiredParams: ["level": 1]),
            FunnelStep(name: "First Level Complete", eventName: "level_complete", requiredParams: ["level": 1])
        ]
    )

    static let conversion = FunnelDefinition(
        name: "Conversion",
        steps: [
            FunnelStep(name: "Store Opened", eventName: "menu_opened", requiredParams: ["menu": "store"]),
            FunnelStep(name: "Product Viewed", eventName: "feature_used", requiredParams: ["feature": "product_view"]),
            FunnelStep(name: "Purchase Initiated", eventName: "iap_initiated"),
            FunnelStep(name: "Purchase Completed", eventName: "iap_completed")
        ]
    )

    static let progression = FunnelDefinition(
        name: "Level Progression",
        steps: (1...20).map { level in
            FunnelStep(
                name: "Level \(level) Complete",
                eventName: "level_complete",
                requiredParams: ["level": level]
            )
        }
    )

    static let dailyEngagement = FunnelDefinition(
        name: "Daily Engagement",
        steps: [
            FunnelStep(name: "Session Start", eventName: "session_start"),
            FunnelStep(name: "Level Played", eventName: "level_start"),
            FunnelStep(name: "Daily Reward Claimed", eventName: "feature_used", requiredParams: ["feature": "daily_reward"]),
            FunnelStep(name: "Social Interaction", eventName: "feature_used", requiredParams: ["feature": "leaderboard"])
        ]
    )
}

// MARK: - Funnel Tracker

final class FunnelTracker {
    static let shared = FunnelTracker()

    private var userFunnelProgress: [String: Set<Int>] = [:]
    private let userDefaults = UserDefaults.standard

    private init() {
        loadProgress()
    }

    // MARK: - Progress Tracking

    func trackStep(for funnel: FunnelDefinition, stepIndex: Int) {
        var progress = userFunnelProgress[funnel.name] ?? []
        progress.insert(stepIndex)
        userFunnelProgress[funnel.name] = progress

        saveProgress()

        // Track funnel progress event
        let step = funnel.steps[stepIndex]
        AnalyticsManager.shared.track(.featureUsed(
            feature: "funnel_\(funnel.name)",
            context: "step_\(stepIndex)_\(step.name)"
        ))
    }

    func currentStep(for funnel: FunnelDefinition) -> Int {
        let progress = userFunnelProgress[funnel.name] ?? []
        for (index, _) in funnel.steps.enumerated() {
            if !progress.contains(index) {
                return index
            }
        }
        return funnel.steps.count // All complete
    }

    func isComplete(funnel: FunnelDefinition) -> Bool {
        currentStep(for: funnel) >= funnel.steps.count
    }

    func dropOffStep(for funnel: FunnelDefinition) -> Int? {
        let progress = userFunnelProgress[funnel.name] ?? []
        if isComplete(funnel: funnel) { return nil }

        // Find first incomplete step after at least one complete step
        var hasStarted = false
        for (index, _) in funnel.steps.enumerated() {
            if progress.contains(index) {
                hasStarted = true
            } else if hasStarted {
                return index
            }
        }
        return nil
    }

    // MARK: - Persistence

    private func loadProgress() {
        if let data = userDefaults.data(forKey: "funnelProgress"),
           let decoded = try? JSONDecoder().decode([String: [Int]].self, from: data) {
            userFunnelProgress = decoded.mapValues { Set($0) }
        }
    }

    private func saveProgress() {
        let encoded = userFunnelProgress.mapValues { Array($0) }
        if let data = try? JSONEncoder().encode(encoded) {
            userDefaults.set(data, forKey: "funnelProgress")
        }
    }

    func reset(funnel: FunnelDefinition) {
        userFunnelProgress.removeValue(forKey: funnel.name)
        saveProgress()
    }

    func resetAll() {
        userFunnelProgress.removeAll()
        saveProgress()
    }
}
```

### Cohort Tracking

```swift
import Foundation

// MARK: - Cohort Definition

struct CohortDefinition {
    let name: String
    let dimension: CohortDimension
    let value: String

    enum CohortDimension: String {
        case installDate = "install_date"
        case installVersion = "install_version"
        case acquisitionSource = "acquisition_source"
        case country = "country"
        case abTestGroup = "ab_test_group"
        case platform = "platform"
        case deviceType = "device_type"
        case firstPurchaseDate = "first_purchase_date"
        case playerSegment = "player_segment"
    }
}

// MARK: - Cohort Manager

final class CohortManager {
    static let shared = CohortManager()

    private let userDefaults = UserDefaults.standard
    private var cohorts: [String: String] = [:]

    private init() {
        loadCohorts()
        assignDefaultCohorts()
    }

    // MARK: - Cohort Assignment

    private func assignDefaultCohorts() {
        // Install date cohort
        if cohorts[CohortDefinition.CohortDimension.installDate.rawValue] == nil {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            setCohort(.installDate, value: formatter.string(from: Date()))
        }

        // Install version cohort
        if cohorts[CohortDefinition.CohortDimension.installVersion.rawValue] == nil {
            let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
            setCohort(.installVersion, value: version)
        }

        // Platform cohort
        setCohort(.platform, value: "ios")

        // Device type cohort
        let deviceType = UIDevice.current.userInterfaceIdiom == .pad ? "ipad" : "iphone"
        setCohort(.deviceType, value: deviceType)
    }

    func setCohort(_ dimension: CohortDefinition.CohortDimension, value: String) {
        cohorts[dimension.rawValue] = value
        saveCohorts()

        // Set as user property in analytics
        AnalyticsManager.shared.setUserProperty(value, forKey: dimension.rawValue)
    }

    func getCohort(_ dimension: CohortDefinition.CohortDimension) -> String? {
        cohorts[dimension.rawValue]
    }

    func getAllCohorts() -> [String: String] {
        cohorts
    }

    // MARK: - Player Segmentation

    func updatePlayerSegment(basedOn metrics: PlayerMetrics) {
        let segment: String

        switch (metrics.totalSpend, metrics.sessionsLast7Days, metrics.levelsCompleted) {
        case (let spend, _, _) where spend > 100:
            segment = "whale"
        case (let spend, _, _) where spend > 10:
            segment = "dolphin"
        case (let spend, _, _) where spend > 0:
            segment = "minnow"
        case (_, let sessions, let levels) where sessions >= 5 && levels >= 10:
            segment = "engaged_free"
        case (_, let sessions, _) where sessions >= 3:
            segment = "casual_free"
        case (_, _, let levels) where levels >= 5:
            segment = "progressing"
        default:
            segment = "new_user"
        }

        setCohort(.playerSegment, value: segment)
    }

    struct PlayerMetrics {
        let totalSpend: Double
        let sessionsLast7Days: Int
        let levelsCompleted: Int
    }

    // MARK: - Persistence

    private func loadCohorts() {
        if let data = userDefaults.data(forKey: "cohorts"),
           let decoded = try? JSONDecoder().decode([String: String].self, from: data) {
            cohorts = decoded
        }
    }

    private func saveCohorts() {
        if let data = try? JSONEncoder().encode(cohorts) {
            userDefaults.set(data, forKey: "cohorts")
        }
    }
}
```

### A/B Test Infrastructure

```swift
import Foundation

// MARK: - A/B Test Definition

struct ABTest: Codable, Identifiable {
    let id: String
    let name: String
    let variants: [Variant]
    let startDate: Date
    let endDate: Date?
    let targetSampleSize: Int
    let metricName: String

    struct Variant: Codable {
        let name: String
        let weight: Double // 0.0 to 1.0
        let config: [String: AnyCodable]
    }

    var isActive: Bool {
        let now = Date()
        if now < startDate { return false }
        if let end = endDate, now > end { return false }
        return true
    }
}

// MARK: - A/B Test Manager

final class ABTestManager {
    static let shared = ABTestManager()

    private var tests: [String: ABTest] = [:]
    private var assignments: [String: String] = [:] // testId: variantName
    private let userDefaults = UserDefaults.standard

    private init() {
        loadAssignments()
    }

    // MARK: - Test Configuration

    func registerTest(_ test: ABTest) {
        tests[test.id] = test

        // Assign variant if not already assigned
        if assignments[test.id] == nil && test.isActive {
            assignVariant(for: test)
        }
    }

    func registerTests(_ tests: [ABTest]) {
        tests.forEach { registerTest($0) }
    }

    // MARK: - Variant Assignment

    private func assignVariant(for test: ABTest) {
        // Deterministic assignment based on user ID for consistency
        let userId = AnalyticsManager.shared.userId ?? UIDevice.current.identifierForVendor?.uuidString ?? UUID().uuidString

        let hashValue = abs("\(test.id):\(userId)".hashValue)
        let normalizedValue = Double(hashValue % 10000) / 10000.0

        var cumulativeWeight = 0.0
        var assignedVariant: ABTest.Variant?

        for variant in test.variants {
            cumulativeWeight += variant.weight
            if normalizedValue < cumulativeWeight {
                assignedVariant = variant
                break
            }
        }

        if let variant = assignedVariant ?? test.variants.last {
            assignments[test.id] = variant.name
            saveAssignments()

            // Track assignment
            AnalyticsManager.shared.track(.featureUsed(
                feature: "ab_test_assigned",
                context: "\(test.id):\(variant.name)"
            ))

            // Set cohort
            CohortManager.shared.setCohort(.abTestGroup, value: "\(test.id):\(variant.name)")
        }
    }

    // MARK: - Variant Access

    func getVariant(for testId: String) -> String? {
        assignments[testId]
    }

    func getConfig<T>(for testId: String, key: String, default defaultValue: T) -> T {
        guard let variantName = assignments[testId],
              let test = tests[testId],
              let variant = test.variants.first(where: { $0.name == variantName }),
              let value = variant.config[key]?.value as? T else {
            return defaultValue
        }
        return value
    }

    func isInVariant(testId: String, variantName: String) -> Bool {
        assignments[testId] == variantName
    }

    // MARK: - Exposure Tracking

    func trackExposure(testId: String) {
        guard let variantName = assignments[testId] else { return }

        AnalyticsManager.shared.track(.featureUsed(
            feature: "ab_test_exposed",
            context: "\(testId):\(variantName)"
        ))
    }

    // MARK: - Conversion Tracking

    func trackConversion(testId: String, value: Double = 1.0) {
        guard let variantName = assignments[testId],
              let test = tests[testId] else { return }

        AnalyticsManager.shared.track(.featureUsed(
            feature: "ab_test_conversion",
            context: "\(testId):\(variantName):\(test.metricName):\(value)"
        ))
    }

    // MARK: - Persistence

    private func loadAssignments() {
        if let data = userDefaults.data(forKey: "abTestAssignments"),
           let decoded = try? JSONDecoder().decode([String: String].self, from: data) {
            assignments = decoded
        }
    }

    private func saveAssignments() {
        if let data = try? JSONEncoder().encode(assignments) {
            userDefaults.set(data, forKey: "abTestAssignments")
        }
    }

    // MARK: - Debug

    func forceVariant(testId: String, variantName: String) {
        assignments[testId] = variantName
        saveAssignments()
    }

    func resetAssignment(testId: String) {
        assignments.removeValue(forKey: testId)
        saveAssignments()
    }

    func resetAllAssignments() {
        assignments.removeAll()
        saveAssignments()
    }
}

// MARK: - AnyCodable Helper

struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([AnyCodable].self) {
            value = array.map { $0.value }
        } else if let dict = try? container.decode([String: AnyCodable].self) {
            value = dict.mapValues { $0.value }
        } else {
            value = NSNull()
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        switch value {
        case let bool as Bool:
            try container.encode(bool)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let string as String:
            try container.encode(string)
        default:
            try container.encodeNil()
        }
    }
}
```

### Privacy-Compliant Implementation

```swift
import Foundation
import AppTrackingTransparency

// MARK: - Privacy Manager

final class AnalyticsPrivacyManager {
    static let shared = AnalyticsPrivacyManager()

    private let userDefaults = UserDefaults.standard

    enum ConsentStatus: String {
        case unknown
        case granted
        case denied
        case restricted
    }

    private(set) var trackingConsentStatus: ConsentStatus = .unknown
    private(set) var analyticsConsentStatus: ConsentStatus = .unknown

    private init() {
        loadConsentStatus()
    }

    // MARK: - Tracking Consent (ATT)

    func requestTrackingAuthorization(completion: @escaping (ConsentStatus) -> Void) {
        if #available(iOS 14.5, *) {
            ATTrackingManager.requestTrackingAuthorization { [weak self] status in
                DispatchQueue.main.async {
                    let consentStatus: ConsentStatus = switch status {
                    case .authorized:
                        .granted
                    case .denied:
                        .denied
                    case .restricted:
                        .restricted
                    case .notDetermined:
                        .unknown
                    @unknown default:
                        .unknown
                    }

                    self?.trackingConsentStatus = consentStatus
                    self?.saveConsentStatus()
                    completion(consentStatus)
                }
            }
        } else {
            trackingConsentStatus = .granted
            completion(.granted)
        }
    }

    var canTrackUser: Bool {
        trackingConsentStatus == .granted
    }

    // MARK: - Analytics Consent

    func setAnalyticsConsent(granted: Bool) {
        analyticsConsentStatus = granted ? .granted : .denied
        saveConsentStatus()

        // Notify analytics manager
        if !granted {
            AnalyticsManager.shared.setUserId(nil)
        }
    }

    var canCollectAnalytics: Bool {
        analyticsConsentStatus != .denied
    }

    // MARK: - Data Deletion

    func requestDataDeletion(completion: @escaping (Bool) -> Void) {
        // Clear local analytics data
        userDefaults.removeObject(forKey: "analyticsUserId")
        userDefaults.removeObject(forKey: "cohorts")
        userDefaults.removeObject(forKey: "funnelProgress")
        userDefaults.removeObject(forKey: "abTestAssignments")

        // Reset analytics manager
        AnalyticsManager.shared.setUserId(nil)
        FunnelTracker.shared.resetAll()
        ABTestManager.shared.resetAllAssignments()

        // Note: Contact analytics provider for server-side deletion
        completion(true)
    }

    // MARK: - Persistence

    private func loadConsentStatus() {
        if let tracking = userDefaults.string(forKey: "trackingConsent") {
            trackingConsentStatus = ConsentStatus(rawValue: tracking) ?? .unknown
        }
        if let analytics = userDefaults.string(forKey: "analyticsConsent") {
            analyticsConsentStatus = ConsentStatus(rawValue: analytics) ?? .unknown
        }
    }

    private func saveConsentStatus() {
        userDefaults.set(trackingConsentStatus.rawValue, forKey: "trackingConsent")
        userDefaults.set(analyticsConsentStatus.rawValue, forKey: "analyticsConsent")
    }
}

// MARK: - Privacy-Aware Analytics Wrapper

extension AnalyticsManager {

    func trackIfAllowed(_ event: GameEvent) {
        guard AnalyticsPrivacyManager.shared.canCollectAnalytics else { return }

        // Anonymize if tracking not allowed
        if !AnalyticsPrivacyManager.shared.canTrackUser {
            setUserId(nil)
        }

        track(event)
    }
}
```

### Debug and Validation

```swift
import Foundation
import os.log

// MARK: - Analytics Debugger

final class AnalyticsDebugger: AnalyticsProvider {
    private let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "Game", category: "AnalyticsDebug")

    private var eventLog: [LoggedEvent] = []
    private let maxLogSize = 1000

    struct LoggedEvent {
        let event: AnalyticsEvent
        let timestamp: Date
    }

    // MARK: - AnalyticsProvider

    func track(event: AnalyticsEvent) {
        // Log to console
        logger.info("📊 [\(event.name)] \(event.parameters)")

        // Store in memory
        eventLog.append(LoggedEvent(event: event, timestamp: Date()))
        if eventLog.count > maxLogSize {
            eventLog.removeFirst(eventLog.count - maxLogSize)
        }
    }

    func setUserProperty(_ value: String?, forKey key: String) {
        logger.info("👤 User property: \(key) = \(value ?? "nil")")
    }

    func setUserId(_ userId: String?) {
        logger.info("🆔 User ID: \(userId ?? "nil")")
    }

    func flush() {
        logger.info("💾 Analytics flushed")
    }

    // MARK: - Event Log Access

    func getRecentEvents(count: Int = 50) -> [LoggedEvent] {
        Array(eventLog.suffix(count))
    }

    func getEvents(named name: String) -> [LoggedEvent] {
        eventLog.filter { $0.event.name == name }
    }

    func clearLog() {
        eventLog.removeAll()
    }

    // MARK: - Validation

    func validateEvent(_ event: AnalyticsEvent) -> [ValidationError] {
        var errors: [ValidationError] = []

        // Check event name
        if event.name.isEmpty {
            errors.append(.emptyEventName)
        }
        if event.name.count > 40 {
            errors.append(.eventNameTooLong)
        }
        if !event.name.allSatisfy({ $0.isLetter || $0.isNumber || $0 == "_" }) {
            errors.append(.invalidEventNameCharacters)
        }

        // Check parameters
        for (key, value) in event.parameters {
            if key.count > 40 {
                errors.append(.parameterKeyTooLong(key))
            }
            if let stringValue = value as? String, stringValue.count > 100 {
                errors.append(.parameterValueTooLong(key))
            }
        }

        if event.parameters.count > 25 {
            errors.append(.tooManyParameters)
        }

        return errors
    }

    enum ValidationError: CustomStringConvertible {
        case emptyEventName
        case eventNameTooLong
        case invalidEventNameCharacters
        case parameterKeyTooLong(String)
        case parameterValueTooLong(String)
        case tooManyParameters

        var description: String {
            switch self {
            case .emptyEventName:
                return "Event name cannot be empty"
            case .eventNameTooLong:
                return "Event name exceeds 40 characters"
            case .invalidEventNameCharacters:
                return "Event name contains invalid characters (use letters, numbers, underscore)"
            case .parameterKeyTooLong(let key):
                return "Parameter key '\(key)' exceeds 40 characters"
            case .parameterValueTooLong(let key):
                return "Parameter value for '\(key)' exceeds 100 characters"
            case .tooManyParameters:
                return "Event has more than 25 parameters"
            }
        }
    }
}

// MARK: - Debug View

#if DEBUG
import SwiftUI

struct AnalyticsDebugView: View {
    @State private var events: [AnalyticsDebugger.LoggedEvent] = []
    @State private var filter: String = ""

    let debugger: AnalyticsDebugger

    var filteredEvents: [AnalyticsDebugger.LoggedEvent] {
        if filter.isEmpty {
            return events
        }
        return events.filter { $0.event.name.contains(filter) }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(filteredEvents.reversed(), id: \.timestamp) { logged in
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            Text(logged.event.name)
                                .font(.system(size: 14, weight: .semibold, design: .monospaced))

                            Spacer()

                            Text(timeString(logged.timestamp))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }

                        ForEach(Array(logged.event.parameters.keys.sorted()), id: \.self) { key in
                            HStack {
                                Text(key)
                                    .font(.system(size: 12, design: .monospaced))
                                    .foregroundStyle(.secondary)
                                Text("=")
                                    .font(.system(size: 12))
                                    .foregroundStyle(.secondary)
                                Text("\(String(describing: logged.event.parameters[key]!))")
                                    .font(.system(size: 12, design: .monospaced))
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
            .searchable(text: $filter, prompt: "Filter events")
            .navigationTitle("Analytics Debug")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Refresh") {
                        events = debugger.getRecentEvents()
                    }
                }
            }
        }
        .onAppear {
            events = debugger.getRecentEvents()
        }
    }

    private func timeString(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        return formatter.string(from: date)
    }
}
#endif
```

### Sample Size Calculator

```swift
import Foundation

// MARK: - Statistical Calculator

struct ABTestCalculator {

    // MARK: - Sample Size Calculation

    /// Calculate required sample size per variant
    /// - Parameters:
    ///   - baselineConversionRate: Current conversion rate (0.0 to 1.0)
    ///   - minimumDetectableEffect: Relative change to detect (e.g., 0.1 for 10%)
    ///   - confidenceLevel: Statistical confidence (typically 0.95)
    ///   - power: Statistical power (typically 0.80)
    /// - Returns: Required sample size per variant
    static func requiredSampleSize(
        baselineConversionRate: Double,
        minimumDetectableEffect: Double,
        confidenceLevel: Double = 0.95,
        power: Double = 0.80
    ) -> Int {
        let p1 = baselineConversionRate
        let p2 = baselineConversionRate * (1 + minimumDetectableEffect)

        let pBar = (p1 + p2) / 2
        let qBar = 1 - pBar

        // Z-scores
        let zAlpha = zScore(for: 1 - (1 - confidenceLevel) / 2) // Two-tailed
        let zBeta = zScore(for: power)

        // Sample size formula
        let numerator = pow(zAlpha * sqrt(2 * pBar * qBar) + zBeta * sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2)
        let denominator = pow(p2 - p1, 2)

        return Int(ceil(numerator / denominator))
    }

    private static func zScore(for probability: Double) -> Double {
        // Approximation of inverse normal CDF
        let a1 = -3.969683028665376e+01
        let a2 =  2.209460984245205e+02
        let a3 = -2.759285104469687e+02
        let a4 =  1.383577518672690e+02
        let a5 = -3.066479806614716e+01
        let a6 =  2.506628277459239e+00

        let b1 = -5.447609879822406e+01
        let b2 =  1.615858368580409e+02
        let b3 = -1.556989798598866e+02
        let b4 =  6.680131188771972e+01
        let b5 = -1.328068155288572e+01

        let c1 = -7.784894002430293e-03
        let c2 = -3.223964580411365e-01
        let c3 = -2.400758277161838e+00
        let c4 = -2.549732539343734e+00
        let c5 =  4.374664141464968e+00
        let c6 =  2.938163982698783e+00

        let d1 =  7.784695709041462e-03
        let d2 =  3.224671290700398e-01
        let d3 =  2.445134137142996e+00
        let d4 =  3.754408661907416e+00

        let pLow = 0.02425
        let pHigh = 1 - pLow
        var q: Double, r: Double

        if probability < pLow {
            q = sqrt(-2 * log(probability))
            return (((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6) / ((((d1*q+d2)*q+d3)*q+d4)*q+1)
        } else if probability <= pHigh {
            q = probability - 0.5
            r = q * q
            return (((((a1*r+a2)*r+a3)*r+a4)*r+a5)*r+a6)*q / (((((b1*r+b2)*r+b3)*r+b4)*r+b5)*r+1)
        } else {
            q = sqrt(-2 * log(1 - probability))
            return -(((((c1*q+c2)*q+c3)*q+c4)*q+c5)*q+c6) / ((((d1*q+d2)*q+d3)*q+d4)*q+1)
        }
    }

    // MARK: - Test Duration Estimation

    static func estimatedTestDuration(
        requiredSampleSize: Int,
        dailyActiveUsers: Int,
        numberOfVariants: Int = 2
    ) -> Int {
        let totalRequired = requiredSampleSize * numberOfVariants
        return Int(ceil(Double(totalRequired) / Double(dailyActiveUsers)))
    }

    // MARK: - Statistical Significance

    static func isSignificant(
        controlConversions: Int,
        controlSampleSize: Int,
        treatmentConversions: Int,
        treatmentSampleSize: Int,
        confidenceLevel: Double = 0.95
    ) -> (isSignificant: Bool, pValue: Double, uplift: Double) {
        let p1 = Double(controlConversions) / Double(controlSampleSize)
        let p2 = Double(treatmentConversions) / Double(treatmentSampleSize)

        let pooledP = Double(controlConversions + treatmentConversions) / Double(controlSampleSize + treatmentSampleSize)
        let pooledQ = 1 - pooledP

        let se = sqrt(pooledP * pooledQ * (1.0 / Double(controlSampleSize) + 1.0 / Double(treatmentSampleSize)))

        let z = (p2 - p1) / se

        // Approximate p-value (two-tailed)
        let pValue = 2 * (1 - normalCDF(abs(z)))

        let uplift = (p2 - p1) / p1

        return (pValue < (1 - confidenceLevel), pValue, uplift)
    }

    private static func normalCDF(_ x: Double) -> Double {
        return 0.5 * (1 + erf(x / sqrt(2)))
    }
}
```

## Decision Trees

### Event Tracking Decision

```
Is this a user action?
├─ YES → Track as engagement event
│   └─ Is it monetization-related?
│       ├─ YES → Also track as business event
│       └─ NO → Just engagement event
└─ NO → Is it a system event?
    ├─ YES → Track as session/error event
    └─ NO → Is it a milestone?
        ├─ YES → Track as progression event
        └─ NO → Consider if tracking is needed
```

### A/B Test Design

```
What metric are you testing?
├─ Retention (D1, D7, D30)
│   └─ Duration: 7-45 days depending on Dx
├─ Conversion (first purchase)
│   └─ Duration: Until sample size reached (min 14 days)
├─ Engagement (session length, levels)
│   └─ Duration: 7-14 days
├─ Revenue (ARPU, ARPPU)
│   └─ Duration: 30-60 days for LTV
└─ Feature adoption
    └─ Duration: 7-14 days
```

### Privacy Consent Flow

```
Is app tracking required?
├─ YES (for advertising/attribution)
│   └─ Request ATT permission
│       ├─ Granted → Enable full tracking
│       └─ Denied → Anonymous analytics only
└─ NO (first-party only)
    └─ Enable analytics with user ID
        └─ Provide opt-out in settings
```

## Quality Checklist

### Event Implementation
- [ ] All events follow naming convention (snake_case)
- [ ] Event names < 40 characters
- [ ] Parameter keys < 40 characters
- [ ] Parameter values < 100 characters
- [ ] < 25 parameters per event
- [ ] Critical paths have complete event coverage

### Funnel Tracking
- [ ] FTUE funnel defined and tracked
- [ ] Conversion funnel defined and tracked
- [ ] Progression funnel defined and tracked
- [ ] Drop-off points identifiable

### Cohort Setup
- [ ] Install date cohort assigned
- [ ] Install version cohort assigned
- [ ] A/B test assignments tracked as cohorts
- [ ] Player segments defined

### A/B Testing
- [ ] Sample size calculated before launch
- [ ] Test duration determined
- [ ] Primary metric defined
- [ ] Variant assignment is deterministic
- [ ] Exposure tracking implemented

### Privacy Compliance
- [ ] ATT permission requested (if needed)
- [ ] Analytics opt-out available
- [ ] Data deletion request handled
- [ ] Privacy manifest includes analytics APIs

## Anti-Patterns

### DO NOT: Track without consent check

```swift
// WRONG - Ignores privacy
func userCompletedLevel(_ level: Int) {
    analytics.track("level_complete", ["level": level])
}

// CORRECT - Privacy-aware
func userCompletedLevel(_ level: Int) {
    guard AnalyticsPrivacyManager.shared.canCollectAnalytics else { return }
    analytics.track("level_complete", ["level": level])
}
```

### DO NOT: Use inconsistent event names

```swift
// WRONG - Inconsistent naming
analytics.track("LevelComplete")     // PascalCase
analytics.track("level-complete")    // kebab-case
analytics.track("Level Complete")    // Spaces

// CORRECT - Consistent snake_case
analytics.track("level_complete")
analytics.track("tutorial_step")
analytics.track("currency_earned")
```

### DO NOT: Run tests without adequate sample size

```swift
// WRONG - Declare winner with insufficient data
if testGroup == "A" && conversions > otherConversions {
    // "A wins!" - But only 50 users tested!
}

// CORRECT - Validate statistical significance
let result = ABTestCalculator.isSignificant(
    controlConversions: 50,
    controlSampleSize: 1000,
    treatmentConversions: 65,
    treatmentSampleSize: 1000
)

if result.isSignificant {
    // Confident in result
}
```

### DO NOT: Track PII in analytics

```swift
// WRONG - Tracking personally identifiable information
analytics.track(.featureUsed(
    feature: "profile_update",
    context: "email: user@email.com, name: John Doe" // PII!
))

// CORRECT - Track behavior, not identity
analytics.track(.featureUsed(
    feature: "profile_update",
    context: "fields_updated: email,name"
))
```

## Recommended A/B Tests for Games

| Test | Variants | Primary Metric | Sample Size | Duration |
|------|----------|----------------|-------------|----------|
| Tutorial length | Short vs Long | D1 retention | 2,000 | 10 days |
| First IAP price | $0.99 vs $1.99 | Conversion | 5,000 | 21 days |
| Ad frequency | 1/3 levels vs 1/5 | D7 retention | 3,000 | 14 days |
| Difficulty curve | Easy vs Normal | Level 10 completion | 1,500 | 7 days |
| Reward amount | 100 vs 200 coins | Session length | 2,000 | 7 days |
| UI layout | A vs B | Feature adoption | 1,500 | 7 days |
| Notification timing | Morning vs Evening | Open rate | 4,000 | 14 days |

## Adjacent Skills

- **01-compliance/privacy-manifest**: Privacy manifest and ATT configuration
- **01-compliance/iap-implementation**: IAP events and transaction tracking
- **02-core-design/progression-system**: Designing progression to optimize
- **03-player-psychology/retention-engineer**: Retention mechanics informed by data
- **03-player-psychology/onboarding-architect**: FTUE optimization based on funnel data
