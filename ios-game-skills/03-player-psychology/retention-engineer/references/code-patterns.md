# Retention Engineer - Code Patterns

## Daily Login System

```swift
import Foundation

final class DailyLoginSystem {

    struct LoginReward {
        let day: Int
        let softCurrency: Int
        let hardCurrency: Int
        let items: [String]
        let isWeeklyBonus: Bool
    }

    struct LoginState: Codable {
        var currentDay: Int
        var lastLoginDate: Date?
        var totalLogins: Int
        var currentStreak: Int
        var longestStreak: Int
        var freeRecoveryUsed: Date?
    }

    private static let baseRewardValue = 100
    private var state: LoginState
    private let calendar = Calendar.current

    init() {
        self.state = LoginState(
            currentDay: 0,
            lastLoginDate: nil,
            totalLogins: 0,
            currentStreak: 0,
            longestStreak: 0,
            freeRecoveryUsed: nil
        )
        loadState()
    }

    func checkLogin() -> LoginCheckResult {
        let today = calendar.startOfDay(for: Date())

        guard let lastLogin = state.lastLoginDate else {
            return .firstLogin(reward: getRewardForDay(1))
        }

        let lastLoginDay = calendar.startOfDay(for: lastLogin)
        let daysDifference = calendar.dateComponents([.day], from: lastLoginDay, to: today).day ?? 0

        switch daysDifference {
        case 0:
            return .alreadyClaimedToday
        case 1:
            return .consecutiveDay(reward: getRewardForDay(state.currentDay + 1))
        case 2...7:
            return .streakBroken(
                daysAway: daysDifference,
                canRecover: canUseStreakRecovery(),
                reward: getRewardForDay(1)
            )
        default:
            return .welcomeBack(
                daysAway: daysDifference,
                reward: getWelcomeBackReward(daysAway: daysDifference)
            )
        }
    }

    func claimDailyReward(useStreakRecovery: Bool = false) -> LoginReward {
        let result = checkLogin()

        switch result {
        case .firstLogin(let reward),
             .consecutiveDay(let reward):
            state.currentDay = (state.currentDay % 7) + 1
            state.currentStreak += 1
            state.longestStreak = max(state.longestStreak, state.currentStreak)
            state.totalLogins += 1
            state.lastLoginDate = Date()
            saveState()
            return reward

        case .streakBroken(_, let canRecover, let reward):
            if useStreakRecovery && canRecover {
                state.freeRecoveryUsed = Date()
                state.currentDay = (state.currentDay % 7) + 1
            } else {
                state.currentDay = 1
                state.currentStreak = 1
            }
            state.totalLogins += 1
            state.lastLoginDate = Date()
            saveState()
            return reward

        case .welcomeBack(_, let reward):
            state.currentDay = 1
            state.currentStreak = 1
            state.totalLogins += 1
            state.lastLoginDate = Date()
            saveState()
            return reward

        case .alreadyClaimedToday:
            return getRewardForDay(state.currentDay)
        }
    }

    private func getRewardForDay(_ day: Int) -> LoginReward {
        let baseValue = Self.baseRewardValue
        let multipliers: [Int: Double] = [
            1: 1.0, 2: 1.2, 3: 1.5, 4: 1.8, 5: 2.2, 6: 2.8, 7: 4.0
        ]
        let multiplier = multipliers[day] ?? 1.0
        let softCurrency = Int(Double(baseValue) * multiplier)

        var hardCurrency = 0
        var items: [String] = []

        switch day {
        case 2: items = ["boost_small"]
        case 3: items = ["boost_medium"]
        case 4: hardCurrency = 10
        case 5: items = ["exclusive_item_common"]
        case 6: hardCurrency = 25
        case 7:
            hardCurrency = 50
            items = ["weekly_chest"]
        default: break
        }

        return LoginReward(
            day: day,
            softCurrency: softCurrency,
            hardCurrency: hardCurrency,
            items: items,
            isWeeklyBonus: day == 7
        )
    }

    private func getWelcomeBackReward(daysAway: Int) -> LoginReward {
        let baseReward = getRewardForDay(1)
        let multiplier: Int
        switch daysAway {
        case 3...6: multiplier = 2
        case 7...13: multiplier = 3
        case 14...29: multiplier = 5
        default: multiplier = 10
        }

        var items = baseReward.items
        if daysAway >= 14 { items.append("welcome_back_exclusive") }
        if daysAway >= 30 { items.append("premium_welcome_package") }

        return LoginReward(
            day: 1,
            softCurrency: baseReward.softCurrency * multiplier,
            hardCurrency: baseReward.hardCurrency * multiplier,
            items: items,
            isWeeklyBonus: false
        )
    }

    private func canUseStreakRecovery() -> Bool {
        guard let lastRecovery = state.freeRecoveryUsed else { return true }
        let daysSinceRecovery = calendar.dateComponents([.day], from: lastRecovery, to: Date()).day ?? 0
        return daysSinceRecovery >= 30
    }

    private func loadState() {
        if let data = UserDefaults.standard.data(forKey: "dailyLoginState"),
           let decoded = try? JSONDecoder().decode(LoginState.self, from: data) {
            state = decoded
        }
    }

    private func saveState() {
        if let encoded = try? JSONEncoder().encode(state) {
            UserDefaults.standard.set(encoded, forKey: "dailyLoginState")
        }
    }

    enum LoginCheckResult {
        case firstLogin(reward: LoginReward)
        case consecutiveDay(reward: LoginReward)
        case streakBroken(daysAway: Int, canRecover: Bool, reward: LoginReward)
        case welcomeBack(daysAway: Int, reward: LoginReward)
        case alreadyClaimedToday
    }
}
```

## Streak System with Recovery

```swift
import Foundation

final class StreakSystem {

    struct StreakState: Codable {
        var currentStreak: Int
        var longestStreak: Int
        var lastActivityDate: Date?
        var recoveryTokens: Int
        var isPaused: Bool
        var pauseEndDate: Date?
    }

    struct StreakBonus {
        let multiplier: Double
        let bonusItems: [String]
        let milestoneReached: Int?
    }

    private var state: StreakState
    private let calendar = Calendar.current
    private let milestones = [7, 14, 30, 60, 90, 180, 365]

    init() {
        self.state = StreakState(
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: nil,
            recoveryTokens: 1,
            isPaused: false,
            pauseEndDate: nil
        )
        loadState()
    }

    func checkStreak() -> StreakCheckResult {
        let today = calendar.startOfDay(for: Date())

        if state.isPaused {
            if let pauseEnd = state.pauseEndDate, today > pauseEnd {
                state.isPaused = false
                state.pauseEndDate = nil
            } else {
                return .paused(resumeDate: state.pauseEndDate)
            }
        }

        guard let lastActivity = state.lastActivityDate else {
            return .noStreak
        }

        let lastActivityDay = calendar.startOfDay(for: lastActivity)
        let daysDifference = calendar.dateComponents([.day], from: lastActivityDay, to: today).day ?? 0

        switch daysDifference {
        case 0: return .active(currentStreak: state.currentStreak)
        case 1: return .canExtend(currentStreak: state.currentStreak)
        default:
            let canRecover = state.recoveryTokens > 0 || daysDifference <= 1
            return .broken(daysAgo: daysDifference, lostStreak: state.currentStreak, canRecover: canRecover)
        }
    }

    func recordActivity() -> StreakBonus {
        let result = checkStreak()

        switch result {
        case .noStreak, .canExtend:
            state.currentStreak += 1
            state.longestStreak = max(state.longestStreak, state.currentStreak)
            state.lastActivityDate = Date()
        case .active:
            break
        case .broken:
            state.currentStreak = 1
            state.lastActivityDate = Date()
        case .paused:
            break
        }

        saveState()
        return calculateBonus()
    }

    func useRecoveryToken() -> Bool {
        guard state.recoveryTokens > 0 else { return false }
        let result = checkStreak()
        guard case .broken(let daysAgo, _, _) = result, daysAgo <= 3 else { return false }

        state.recoveryTokens -= 1
        state.lastActivityDate = calendar.date(byAdding: .day, value: -1, to: Date())
        saveState()
        return true
    }

    func pauseStreak(days: Int) -> Bool {
        guard days >= 1 && days <= 7, !state.isPaused else { return false }
        state.isPaused = true
        state.pauseEndDate = calendar.date(byAdding: .day, value: days, to: Date())
        saveState()
        return true
    }

    private func calculateBonus() -> StreakBonus {
        let multiplier: Double
        switch state.currentStreak {
        case 1...3: multiplier = 1.0
        case 4...7: multiplier = 1.2
        case 8...14: multiplier = 1.5
        case 15...30: multiplier = 2.0
        default: multiplier = 2.5
        }

        var bonusItems: [String] = []
        let milestone = milestones.first { $0 == state.currentStreak }

        if let m = milestone {
            switch m {
            case 7: bonusItems = ["streak_badge_bronze", "chest_rare"]
            case 14: bonusItems = ["streak_badge_silver", "chest_epic"]
            case 30: bonusItems = ["streak_badge_gold", "chest_legendary"]
            case 60: bonusItems = ["streak_badge_platinum", "exclusive_skin"]
            case 90: bonusItems = ["streak_badge_diamond", "premium_bundle"]
            case 180: bonusItems = ["streak_badge_master", "legendary_exclusive"]
            case 365: bonusItems = ["streak_badge_eternal", "anniversary_package"]
            default: break
            }
        }

        return StreakBonus(multiplier: multiplier, bonusItems: bonusItems, milestoneReached: milestone)
    }

    private func loadState() {
        if let data = UserDefaults.standard.data(forKey: "streakState"),
           let decoded = try? JSONDecoder().decode(StreakState.self, from: data) {
            state = decoded
        }
    }

    private func saveState() {
        if let encoded = try? JSONEncoder().encode(state) {
            UserDefaults.standard.set(encoded, forKey: "streakState")
        }
    }

    enum StreakCheckResult {
        case noStreak
        case active(currentStreak: Int)
        case canExtend(currentStreak: Int)
        case broken(daysAgo: Int, lostStreak: Int, canRecover: Bool)
        case paused(resumeDate: Date?)
    }
}
```

## Churn Prediction System

```swift
import Foundation

final class ChurnPredictionSystem {

    struct PlayerMetrics {
        var sessionsLast7Days: Int
        var avgSessionLengthSeconds: Double
        var timeSinceLastSession: TimeInterval
        var spendingLast30Days: Double
        var socialActionsLast7Days: Int
        var questCompletionRate: Double
        var featuresUsedLast7Days: Set<String>
        var baselineSessionsPerWeek: Double
        var baselineSessionLength: Double
        var baselineSpending: Double
    }

    struct ChurnRisk {
        let score: Double
        let level: RiskLevel
        let signals: [ChurnSignal]
        let recommendedIntervention: Intervention

        enum RiskLevel: String {
            case low, medium, high, critical
        }
    }

    struct ChurnSignal {
        let type: SignalType
        let severity: Double
        let description: String

        enum SignalType {
            case sessionFrequency, sessionLength, spending, socialActivity, questCompletion, featureUsage
        }
    }

    enum Intervention {
        case none
        case extraDailyReward
        case personalizedOffer(discountPercent: Int)
        case winbackPackage
        case reengagementCampaign
    }

    func analyzeChurnRisk(metrics: PlayerMetrics) -> ChurnRisk {
        var signals: [ChurnSignal] = []

        let sessionDecline = calculateDecline(current: Double(metrics.sessionsLast7Days), baseline: metrics.baselineSessionsPerWeek)
        if sessionDecline > 0.3 {
            signals.append(ChurnSignal(type: .sessionFrequency, severity: sessionDecline, description: "Sessions dropped \(Int(sessionDecline * 100))%"))
        }

        let lengthDecline = calculateDecline(current: metrics.avgSessionLengthSeconds, baseline: metrics.baselineSessionLength)
        if lengthDecline > 0.3 {
            signals.append(ChurnSignal(type: .sessionLength, severity: lengthDecline, description: "Session length dropped \(Int(lengthDecline * 100))%"))
        }

        if metrics.baselineSpending > 0 {
            let spendingDecline = calculateDecline(current: metrics.spendingLast30Days, baseline: metrics.baselineSpending)
            if spendingDecline > 0.8 {
                signals.append(ChurnSignal(type: .spending, severity: spendingDecline, description: "Spending dropped significantly"))
            }
        }

        if metrics.socialActionsLast7Days == 0 {
            signals.append(ChurnSignal(type: .socialActivity, severity: 0.5, description: "No social interactions in 7 days"))
        }

        if metrics.questCompletionRate < 0.3 {
            signals.append(ChurnSignal(type: .questCompletion, severity: 0.7, description: "Quest completion below 30%"))
        }

        let score = calculateCompositeScore(
            sessionDecline: sessionDecline,
            lengthDecline: lengthDecline,
            spendingDecline: metrics.baselineSpending > 0 ? calculateDecline(current: metrics.spendingLast30Days, baseline: metrics.baselineSpending) : 0,
            socialDecline: metrics.socialActionsLast7Days == 0 ? 1.0 : 0,
            questDecline: 1.0 - metrics.questCompletionRate
        )

        let level = determineRiskLevel(score: score)
        let intervention = recommendIntervention(level: level, metrics: metrics)

        return ChurnRisk(score: score, level: level, signals: signals, recommendedIntervention: intervention)
    }

    private func calculateDecline(current: Double, baseline: Double) -> Double {
        guard baseline > 0 else { return 0 }
        return max(0, (baseline - current) / baseline)
    }

    private func calculateCompositeScore(sessionDecline: Double, lengthDecline: Double, spendingDecline: Double, socialDecline: Double, questDecline: Double) -> Double {
        return (0.30 * sessionDecline) + (0.25 * lengthDecline) + (0.20 * spendingDecline) + (0.15 * socialDecline) + (0.10 * questDecline)
    }

    private func determineRiskLevel(score: Double) -> ChurnRisk.RiskLevel {
        switch score {
        case 0..<0.3: return .low
        case 0.3..<0.5: return .medium
        case 0.5..<0.7: return .high
        default: return .critical
        }
    }

    private func recommendIntervention(level: ChurnRisk.RiskLevel, metrics: PlayerMetrics) -> Intervention {
        switch level {
        case .low: return .none
        case .medium: return .extraDailyReward
        case .high: return .personalizedOffer(discountPercent: metrics.baselineSpending > 0 ? 30 : 20)
        case .critical: return metrics.timeSinceLastSession > 7 * 24 * 3600 ? .reengagementCampaign : .winbackPackage
        }
    }
}
```

## Push Notification Manager

```swift
import Foundation
import UserNotifications

final class RetentionNotificationManager {

    struct NotificationConfig {
        let type: NotificationType
        let title: String
        let body: String
        let scheduledTime: Date
        let category: String
        let userInfo: [String: Any]
    }

    enum NotificationType: String {
        case streakReminder, dailyReward, energyFull, eventEnding, friendActivity, welcomeBack
    }

    private let notificationCenter = UNUserNotificationCenter.current()
    private var scheduledToday: [NotificationType: Int] = [:]

    func requestPermission(completion: @escaping (Bool) -> Void) {
        notificationCenter.requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
            DispatchQueue.main.async { completion(granted) }
        }
    }

    func scheduleStreakReminder(currentStreak: Int, resetTime: Date) {
        guard canSchedule(type: .streakReminder) else { return }
        let reminderTime = Calendar.current.date(byAdding: .hour, value: -2, to: resetTime) ?? resetTime
        guard reminderTime > Date() else { return }

        let config = NotificationConfig(
            type: .streakReminder,
            title: "Streak Alert!",
            body: "Don't lose your \(currentStreak)-day streak! Log in before midnight.",
            scheduledTime: reminderTime,
            category: "STREAK",
            userInfo: ["streak": currentStreak]
        )
        schedule(config: config)
    }

    func scheduleDailyRewardReminder(playerPeakHour: Int) {
        guard canSchedule(type: .dailyReward) else { return }
        var components = Calendar.current.dateComponents([.year, .month, .day], from: Date())
        components.hour = playerPeakHour
        components.minute = 0
        guard let scheduledTime = Calendar.current.date(from: components), scheduledTime > Date() else { return }

        let config = NotificationConfig(
            type: .dailyReward,
            title: "Daily Reward Ready!",
            body: "Your daily bonus is waiting. Claim it now!",
            scheduledTime: scheduledTime,
            category: "DAILY",
            userInfo: [:]
        )
        schedule(config: config)
    }

    func scheduleWelcomeBack(afterDays: Int) {
        let scheduledTime = Calendar.current.date(byAdding: .day, value: afterDays, to: Date()) ?? Date()
        let config = NotificationConfig(
            type: .welcomeBack,
            title: "We miss you!",
            body: "A special welcome back bonus is waiting for you.",
            scheduledTime: scheduledTime,
            category: "WINBACK",
            userInfo: ["daysAway": afterDays]
        )
        schedule(config: config)
    }

    private func canSchedule(type: NotificationType) -> Bool {
        let count = scheduledToday[type] ?? 0
        let typeLimit: Int
        switch type {
        case .streakReminder, .dailyReward, .eventEnding, .welcomeBack: typeLimit = 1
        case .energyFull: typeLimit = 6
        case .friendActivity: typeLimit = 3
        }
        return count < typeLimit
    }

    private func schedule(config: NotificationConfig) {
        let hour = Calendar.current.component(.hour, from: config.scheduledTime)
        guard hour >= 8 && hour < 22 else { return } // Quiet hours

        let content = UNMutableNotificationContent()
        content.title = config.title
        content.body = config.body
        content.sound = .default
        content.categoryIdentifier = config.category

        let triggerDate = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: config.scheduledTime)
        let trigger = UNCalendarNotificationTrigger(dateMatching: triggerDate, repeats: false)
        let request = UNNotificationRequest(identifier: config.type.rawValue, content: content, trigger: trigger)

        notificationCenter.add(request) { [weak self] _ in
            self?.scheduledToday[config.type, default: 0] += 1
        }
    }
}
```
