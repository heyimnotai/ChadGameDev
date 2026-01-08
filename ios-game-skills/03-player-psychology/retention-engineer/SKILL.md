---
name: retention-engineer
description: Maximizes D1, D7, and D30 retention through systematic engagement loop design including daily rewards, streak mechanics, push notifications, and re-engagement systems. Use this skill when designing daily engagement features, implementing streak systems, planning notification strategies, or building winback flows. Triggers when retention metrics need improvement, churn prevention is required, or welcome-back systems are needed. This skill ensures players return consistently without feeling manipulated.
---

# Retention Engineer

## Purpose

This skill enables the design of engagement systems that maximize player retention across D1, D7, and D30 timeframes using evidence-based mechanics. It enforces a quality bar where daily engagement feels rewarding rather than obligatory, streaks provide motivation without punishment, and re-engagement respects player autonomy. All implementations must balance business metrics with player well-being.

## Domain Boundaries

- **This skill handles**:
  - Daily engagement loop architecture
  - Streak mechanics and recovery systems
  - Login bonus curves and escalation
  - Push notification strategy and timing
  - Re-engagement and winback triggers
  - Churn prediction signals
  - Welcome back systems
  - Retention benchmarks and targets
  - Session cadence optimization

- **This skill does NOT handle**:
  - First-time user experience (see: onboarding-architect)
  - Reward psychology and variable ratios (see: dopamine-optimizer)
  - Achievement and milestone pacing (see: reward-scheduler)
  - Social retention features (see: social-mechanics)
  - Core gameplay loop design (see: core-loop-architect)
  - Battle pass progression (see: progression-system)

## Core Specifications

### Retention Benchmarks by Timeframe

**Industry Medians (2025)**:
| Metric | Median | Top 25% | Top 10% Target |
|--------|--------|---------|----------------|
| D1 | 26-28% | 31-33% | 45%+ |
| D7 | 3-4% | 7-8% | 20%+ |
| D30 | <3% | 5-7% | 10%+ |

**By Genre (D1 Retention)**:
| Genre | D1 Median | D1 Top Quartile |
|-------|-----------|-----------------|
| Match-3 | 32.65% | 42%+ |
| Puzzle | 31.85% | 41%+ |
| Tabletop | 31.30% | 40%+ |
| RPG | 30.54% | 39%+ |
| Simulation | 30.10% | 38%+ |
| Casual | 28.50% | 36%+ |
| Hyper-casual | 25.00% | 32%+ |

**iOS vs Android**: iOS D1 retention is 4-6% higher than Android for top 25% of games.

### Daily Engagement Loop Structure

**Optimal Daily Session Pattern**:
```
Session 1 (Morning): 5-10 minutes
├── Collect overnight rewards
├── Check daily quests
├── Complete 1-2 quick activities
└── Set up passive progression

Session 2 (Midday): 3-5 minutes
├── Collect accumulated resources
├── Progress daily quests
└── Social check-in

Session 3 (Evening): 10-20 minutes
├── Main gameplay session
├── Complete remaining dailies
├── Claim daily rewards
└── Preview tomorrow's content
```

**Daily Reset Timing**:
- Reset at midnight user local time (not server time)
- Grace period: 2 hours before reset for "last chance" notification
- New content preview: Available 1 hour before reset

### Login Bonus Curves

**7-Day Escalating Cycle** (Standard):
| Day | Reward Value (% of Day 1) | Reward Type |
|-----|---------------------------|-------------|
| Day 1 | 100% | Soft currency |
| Day 2 | 120% | Soft currency + consumable |
| Day 3 | 150% | Soft currency + rare consumable |
| Day 4 | 180% | Soft currency + hard currency (small) |
| Day 5 | 220% | Soft currency + exclusive item |
| Day 6 | 280% | Soft currency + hard currency (medium) |
| Day 7 | 400% | Premium reward package |

**Monthly Login Calendar** (28-Day):
```
Week 1: Days 1-7 → Standard rewards, Day 7 = weekly bonus
Week 2: Days 8-14 → 1.5x multiplier, Day 14 = bi-weekly bonus
Week 3: Days 15-21 → 2x multiplier, Day 21 = tri-weekly bonus
Week 4: Days 22-28 → 2.5x multiplier, Day 28 = monthly jackpot

Monthly jackpot value: 10x Day 1 base value
```

**Cumulative vs Consecutive Design**:
| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| Consecutive | Higher urgency | Punishes missed days | Hardcore players |
| Cumulative | Forgiving | Lower urgency | Casual players |
| Hybrid | Balanced | Complex to communicate | Mid-core games |

### Streak Mechanics

**Optimal Streak Design Parameters**:
```
Minimum streak for bonus: 3 days
Streak multiplier cap: 2.5x (at day 30)
Streak milestone rewards: Days 7, 14, 30, 60, 90

Multiplier progression:
Days 1-3:   1.0x (building)
Days 4-7:   1.2x
Days 8-14:  1.5x
Days 15-30: 2.0x
Days 30+:   2.5x (capped)
```

**Streak Recovery System** (Critical for retention):
| Recovery Method | Cost | Availability |
|-----------------|------|--------------|
| Free recovery | None | Once per 30 days |
| Ad-supported | Watch 1 ad | Once per 7 days |
| Soft currency | 500 coins | Unlimited |
| Hard currency | 50 gems | Unlimited |
| Time-limited | None | Within 24 hours of break |

**Streak Forgiveness Rules**:
- First break in 30 days: Free recovery offered
- Server outage: Automatic preservation
- Major update: 48-hour grace period
- Holiday/vacation mode: Pre-set up to 7-day pause

### Push Notification Strategy

**Opt-In Rate Benchmarks**:
- Gaming industry average: 63.5%
- Optimized games: 75-80%
- Personalized notifications: 259% higher engagement

**Permission Request Timing**:
```
NEVER: At first launch
WRONG: During tutorial
CORRECT: After player experiences value (session 3+)
OPTIMAL: After player completes first achievement or reaches milestone

Trigger conditions for permission request:
- Player has completed 3+ sessions
- Player has achieved first milestone
- Player has used a feature that benefits from notifications
- At least 24 hours since install
```

**Notification Types and Timing**:
| Type | Timing | Frequency Cap | Example |
|------|--------|---------------|---------|
| Streak reminder | 2 hours before reset | 1x daily | "Don't lose your 7-day streak!" |
| Daily reward | Same time daily (player's active hour) | 1x daily | "Your daily reward is waiting!" |
| Energy full | When energy reaches cap | 1x per 4 hours | "Energy full! Ready to play?" |
| Event ending | 2 hours before end | 1x per event | "Event ends in 2 hours!" |
| Friend activity | When friend acts | 3x daily max | "Alex beat your high score!" |
| Welcome back | After 3 days inactive | 1x per inactive period | "We miss you! Bonus waiting" |

**Notification Timing by Player Behavior**:
```
Track player's typical play times
Send notifications 30 minutes before typical session
Never send between 10 PM - 8 AM local time
Match notification frequency to session frequency:
- 1 session/day player: 1 notification max
- 3 sessions/day player: 2-3 notifications max
```

**A/B Test Matrix**:
| Element | Variant A | Variant B | Metric |
|---------|-----------|-----------|--------|
| Timing | Player's peak hour | 2 hours before reset | Open rate |
| Personalization | Generic | Name + specific reward | CTR |
| Urgency | "Available now" | "Expires in 2 hours" | Conversion |
| Emoji | Without | With | Open rate |

### Churn Prediction Signals

**Early Warning Indicators** (Track in analytics):
| Signal | Threshold | Risk Level |
|--------|-----------|------------|
| Session length decrease | >30% drop | Medium |
| Sessions per day decrease | >50% drop | High |
| Time between sessions increase | >2x normal | Medium |
| Feature engagement drop | <50% of usual | Medium |
| Spending decrease | >80% drop | High |
| Quest completion rate | <30% | High |
| Social interaction | 0 in 7 days | Medium |

**Churn Prediction Formula**:
```
Churn Risk Score =
  (0.3 × session_frequency_decline) +
  (0.25 × engagement_depth_decline) +
  (0.2 × spending_decline) +
  (0.15 × social_activity_decline) +
  (0.1 × feature_usage_decline)

Risk Levels:
0.0-0.3: Low risk (normal variation)
0.3-0.5: Medium risk (monitor)
0.5-0.7: High risk (intervene)
0.7-1.0: Critical (winback mode)
```

**Intervention Triggers**:
| Risk Level | Intervention | Timing |
|------------|--------------|--------|
| Medium | Extra daily reward | Next login |
| High | Personalized offer | Push notification |
| Critical | Winback package | Email + push |

### Re-engagement and Winback Systems

**Absence Period Definitions**:
| Period | Classification | Action |
|--------|----------------|--------|
| 1-2 days | Normal break | No action |
| 3-6 days | Short lapse | Reminder notification |
| 7-13 days | Lapsed | Winback offer |
| 14-29 days | Churned | Re-engagement campaign |
| 30+ days | Lost | Major winback incentive |

**Winback Reward Scaling**:
| Days Away | Reward Multiplier | Special Offer |
|-----------|-------------------|---------------|
| 3-6 days | 1.5x daily | "We saved your progress!" |
| 7-13 days | 3x daily | Login bonus catch-up |
| 14-29 days | 5x daily + exclusive item | "Welcome back" bundle |
| 30+ days | 10x daily + premium package | "Fresh start" bonus |

**Welcome Back Flow**:
```
Step 1: Personalized splash screen
├── Show days away
├── Highlight what's new
└── Preview welcome back reward

Step 2: Catch-up summary
├── Friend activity while away
├── Events missed (with consolation prize)
└── New content added

Step 3: Reward claim
├── Welcome back package
├── Streak recovery option (if applicable)
└── Daily bonus reset (fresh 7-day cycle)

Step 4: Re-onboarding (if 30+ days)
├── Optional gameplay refresher
├── Highlight new features
└── Adjusted difficulty (if applicable)
```

### Session Cadence Optimization

**Ideal Session Patterns by Genre**:
| Genre | Sessions/Day | Session Length | Total Daily Time |
|-------|--------------|----------------|------------------|
| Hyper-casual | 5-8 | 1-3 minutes | 10-15 minutes |
| Casual | 3-5 | 5-10 minutes | 20-30 minutes |
| Mid-core | 3-4 | 10-20 minutes | 40-60 minutes |
| Core | 2-3 | 30-60 minutes | 60-120 minutes |

**Energy/Timer Systems**:
```
Energy regeneration rate: 1 unit per 5-10 minutes
Maximum energy cap: 5-10 attempts
Full refill time: 30-60 minutes (matches session gap)
Premium bypass: Instant refill (hard currency)
Social bypass: Request from friends (soft encouragement)
```

## Implementation Patterns

### Daily Login System

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
            // First ever login
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
                // Streak preserved
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
        if daysAway >= 14 {
            items.append("welcome_back_exclusive")
        }
        if daysAway >= 30 {
            items.append("premium_welcome_package")
        }

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
        let daysSinceRecovery = calendar.dateComponents(
            [.day],
            from: lastRecovery,
            to: Date()
        ).day ?? 0
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

### Streak System with Recovery

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

        // Check if paused
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
        case 0:
            return .active(currentStreak: state.currentStreak)
        case 1:
            return .canExtend(currentStreak: state.currentStreak)
        default:
            let canRecover = state.recoveryTokens > 0 || daysDifference <= 1
            return .broken(
                daysAgo: daysDifference,
                lostStreak: state.currentStreak,
                canRecover: canRecover
            )
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
            // Already recorded today
            break

        case .broken:
            // Must use recovery first
            state.currentStreak = 1
            state.lastActivityDate = Date()

        case .paused:
            // Cannot record while paused
            break
        }

        saveState()
        return calculateBonus()
    }

    func useRecoveryToken() -> Bool {
        guard state.recoveryTokens > 0 else { return false }

        let result = checkStreak()
        guard case .broken(let daysAgo, _, _) = result, daysAgo <= 3 else {
            return false
        }

        state.recoveryTokens -= 1
        state.lastActivityDate = calendar.date(byAdding: .day, value: -1, to: Date())
        saveState()
        return true
    }

    func pauseStreak(days: Int) -> Bool {
        guard days >= 1 && days <= 7 else { return false }
        guard !state.isPaused else { return false }

        state.isPaused = true
        state.pauseEndDate = calendar.date(byAdding: .day, value: days, to: Date())
        saveState()
        return true
    }

    func grantRecoveryToken() {
        state.recoveryTokens = min(state.recoveryTokens + 1, 3)
        saveState()
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

        return StreakBonus(
            multiplier: multiplier,
            bonusItems: bonusItems,
            milestoneReached: milestone
        )
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

### Churn Prediction System

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
            case low = "Low"
            case medium = "Medium"
            case high = "High"
            case critical = "Critical"
        }
    }

    struct ChurnSignal {
        let type: SignalType
        let severity: Double
        let description: String

        enum SignalType {
            case sessionFrequency
            case sessionLength
            case spending
            case socialActivity
            case questCompletion
            case featureUsage
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

        // Session frequency decline
        let sessionDecline = calculateDecline(
            current: Double(metrics.sessionsLast7Days),
            baseline: metrics.baselineSessionsPerWeek
        )
        if sessionDecline > 0.3 {
            signals.append(ChurnSignal(
                type: .sessionFrequency,
                severity: sessionDecline,
                description: "Sessions dropped \(Int(sessionDecline * 100))% from baseline"
            ))
        }

        // Session length decline
        let lengthDecline = calculateDecline(
            current: metrics.avgSessionLengthSeconds,
            baseline: metrics.baselineSessionLength
        )
        if lengthDecline > 0.3 {
            signals.append(ChurnSignal(
                type: .sessionLength,
                severity: lengthDecline,
                description: "Session length dropped \(Int(lengthDecline * 100))%"
            ))
        }

        // Spending decline
        if metrics.baselineSpending > 0 {
            let spendingDecline = calculateDecline(
                current: metrics.spendingLast30Days,
                baseline: metrics.baselineSpending
            )
            if spendingDecline > 0.8 {
                signals.append(ChurnSignal(
                    type: .spending,
                    severity: spendingDecline,
                    description: "Spending dropped significantly"
                ))
            }
        }

        // Social activity
        if metrics.socialActionsLast7Days == 0 {
            signals.append(ChurnSignal(
                type: .socialActivity,
                severity: 0.5,
                description: "No social interactions in 7 days"
            ))
        }

        // Quest completion
        if metrics.questCompletionRate < 0.3 {
            signals.append(ChurnSignal(
                type: .questCompletion,
                severity: 0.7,
                description: "Quest completion below 30%"
            ))
        }

        // Calculate composite score
        let score = calculateCompositeScore(
            sessionDecline: sessionDecline,
            lengthDecline: lengthDecline,
            spendingDecline: metrics.baselineSpending > 0 ? calculateDecline(
                current: metrics.spendingLast30Days,
                baseline: metrics.baselineSpending
            ) : 0,
            socialDecline: metrics.socialActionsLast7Days == 0 ? 1.0 : 0,
            questDecline: 1.0 - metrics.questCompletionRate
        )

        let level = determineRiskLevel(score: score)
        let intervention = recommendIntervention(level: level, metrics: metrics)

        return ChurnRisk(
            score: score,
            level: level,
            signals: signals,
            recommendedIntervention: intervention
        )
    }

    private func calculateDecline(current: Double, baseline: Double) -> Double {
        guard baseline > 0 else { return 0 }
        return max(0, (baseline - current) / baseline)
    }

    private func calculateCompositeScore(
        sessionDecline: Double,
        lengthDecline: Double,
        spendingDecline: Double,
        socialDecline: Double,
        questDecline: Double
    ) -> Double {
        return (0.30 * sessionDecline) +
               (0.25 * lengthDecline) +
               (0.20 * spendingDecline) +
               (0.15 * socialDecline) +
               (0.10 * questDecline)
    }

    private func determineRiskLevel(score: Double) -> ChurnRisk.RiskLevel {
        switch score {
        case 0..<0.3: return .low
        case 0.3..<0.5: return .medium
        case 0.5..<0.7: return .high
        default: return .critical
        }
    }

    private func recommendIntervention(
        level: ChurnRisk.RiskLevel,
        metrics: PlayerMetrics
    ) -> Intervention {
        switch level {
        case .low:
            return .none
        case .medium:
            return .extraDailyReward
        case .high:
            let discount = metrics.baselineSpending > 0 ? 30 : 20
            return .personalizedOffer(discountPercent: discount)
        case .critical:
            if metrics.timeSinceLastSession > 7 * 24 * 3600 {
                return .reengagementCampaign
            }
            return .winbackPackage
        }
    }
}
```

### Push Notification Manager

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
        case streakReminder = "streak_reminder"
        case dailyReward = "daily_reward"
        case energyFull = "energy_full"
        case eventEnding = "event_ending"
        case friendActivity = "friend_activity"
        case welcomeBack = "welcome_back"
    }

    private let notificationCenter = UNUserNotificationCenter.current()
    private let dailyNotificationLimit = 3
    private var scheduledToday: [NotificationType: Int] = [:]

    func requestPermission(completion: @escaping (Bool) -> Void) {
        notificationCenter.requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
            DispatchQueue.main.async {
                completion(granted)
            }
        }
    }

    func scheduleStreakReminder(currentStreak: Int, resetTime: Date) {
        guard canSchedule(type: .streakReminder) else { return }

        let reminderTime = Calendar.current.date(
            byAdding: .hour,
            value: -2,
            to: resetTime
        ) ?? resetTime

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

        guard let scheduledTime = Calendar.current.date(from: components),
              scheduledTime > Date() else { return }

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
        let scheduledTime = Calendar.current.date(
            byAdding: .day,
            value: afterDays,
            to: Date()
        ) ?? Date()

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

    func scheduleEnergyFull(energyFullTime: Date) {
        guard canSchedule(type: .energyFull) else { return }

        let config = NotificationConfig(
            type: .energyFull,
            title: "Energy Restored!",
            body: "Your energy is full. Ready to play?",
            scheduledTime: energyFullTime,
            category: "ENERGY",
            userInfo: [:]
        )

        schedule(config: config)
    }

    func cancelAllNotifications(ofType type: NotificationType) {
        notificationCenter.removePendingNotificationRequests(
            withIdentifiers: [type.rawValue]
        )
    }

    private func canSchedule(type: NotificationType) -> Bool {
        let count = scheduledToday[type] ?? 0

        let typeLimit: Int
        switch type {
        case .streakReminder: typeLimit = 1
        case .dailyReward: typeLimit = 1
        case .energyFull: typeLimit = 6 // Every 4 hours
        case .eventEnding: typeLimit = 1
        case .friendActivity: typeLimit = 3
        case .welcomeBack: typeLimit = 1
        }

        return count < typeLimit
    }

    private func schedule(config: NotificationConfig) {
        // Enforce quiet hours (10 PM - 8 AM)
        let hour = Calendar.current.component(.hour, from: config.scheduledTime)
        guard hour >= 8 && hour < 22 else { return }

        let content = UNMutableNotificationContent()
        content.title = config.title
        content.body = config.body
        content.sound = .default
        content.categoryIdentifier = config.category
        content.userInfo = config.userInfo

        let triggerDate = Calendar.current.dateComponents(
            [.year, .month, .day, .hour, .minute],
            from: config.scheduledTime
        )
        let trigger = UNCalendarNotificationTrigger(
            dateMatching: triggerDate,
            repeats: false
        )

        let request = UNNotificationRequest(
            identifier: config.type.rawValue,
            content: content,
            trigger: trigger
        )

        notificationCenter.add(request) { [weak self] _ in
            self?.scheduledToday[config.type, default: 0] += 1
        }
    }

    func resetDailyLimits() {
        scheduledToday.removeAll()
    }
}
```

## Decision Trees

### Daily Reward Structure Selection

```
What is your game's target session frequency?
├── 1 session/day (casual)
│   └── Use 7-day consecutive cycle with generous catch-up
│       ├── Miss 1 day: Can claim previous day's reward
│       └── Miss 2+ days: Cycle resets but no penalty
├── 2-3 sessions/day (mid-core)
│   └── Use cumulative monthly calendar
│       ├── Each login stamps one day
│       ├── Monthly total determines bonus tier
│       └── Streak bonus is additive, not required
└── 4+ sessions/day (core/hardcore)
    └── Use hybrid consecutive + cumulative
        ├── Consecutive streak provides multiplier
        ├── Cumulative ensures no missed rewards
        └── Premium streak recovery available
```

### Streak Recovery Decision

```
Player broke their streak. What action to take?
├── How long was the streak?
│   ├── Less than 7 days
│   │   └── Reset silently, offer encouragement
│   ├── 7-30 days
│   │   └── Offer free recovery (if available) or ad-supported
│   ├── 31-60 days
│   │   └── Offer soft currency recovery + show streak badge preservation
│   └── 60+ days
│       └── Offer any recovery method + personalized message from team
├── Why did they break it?
│   ├── Server issue or app bug
│   │   └── Automatic preservation + compensation
│   ├── Device issues (identifiable)
│   │   └── Free recovery + apology reward
│   └── Player inactivity
│       └── Follow standard recovery flow
```

### Winback Timing Decision

```
Player has been inactive. When to send winback?
├── Days 1-2: No action
│   └── Normal variation, respect player autonomy
├── Days 3-6: Light touch
│   ├── Day 3: Reminder notification (if opted in)
│   └── Day 6: "We saved your progress" message
├── Days 7-13: Active winback
│   ├── Day 7: Winback offer notification
│   ├── Day 10: Email with exclusive return bonus
│   └── Day 13: Final reminder before "churned" status
├── Days 14-29: Re-engagement campaign
│   ├── Day 14: Major update announcement
│   ├── Day 21: "Fresh start" package offer
│   └── Day 28: Limited-time exclusive return bonus
└── Days 30+: Lost player campaign
    ├── Day 30: Premium winback package
    ├── Day 60: Feature highlight reel
    └── Day 90+: Minimal contact, major updates only
```

## Quality Checklist

### Daily Login System Verification
- [ ] Rewards escalate correctly across 7-day cycle
- [ ] Day 7 reward is exactly 4x Day 1 value
- [ ] Cycle resets properly after Day 7
- [ ] Login state persists across app restarts
- [ ] First login of the day is detected accurately across timezones
- [ ] Multiple logins on same day do not grant duplicate rewards

### Streak System Verification
- [ ] Streak increments correctly on consecutive days
- [ ] Streak breaks after exactly 1 missed day (not 0 or 2)
- [ ] Recovery tokens decrement properly
- [ ] Free recovery cooldown is exactly 30 days
- [ ] Pause functionality works for 1-7 days
- [ ] Milestone rewards trigger at exact day counts
- [ ] Longest streak record is preserved permanently

### Notification System Verification
- [ ] Permission requested after session 3+
- [ ] Quiet hours (10 PM - 8 AM) are enforced
- [ ] Daily notification limit is respected
- [ ] Streak reminder fires exactly 2 hours before reset
- [ ] Canceled notifications are actually removed
- [ ] Deep links from notifications work correctly

### Churn Prevention Verification
- [ ] Risk score calculation matches documented formula
- [ ] All signal weights sum to 1.0
- [ ] Interventions trigger at correct risk levels
- [ ] Player baselines are calculated from first 14 days
- [ ] Metrics update in real-time, not just at session end

### Welcome Back System Verification
- [ ] Days away calculated from last session, not last login
- [ ] Reward multipliers match documented values
- [ ] Exclusive items granted at correct absence thresholds
- [ ] Re-onboarding offered after 30+ days
- [ ] Progress summary accurately reflects missed content

## Anti-Patterns

### Anti-Pattern: Punitive Streak Design
**Wrong**:
```swift
// NEVER DO THIS: Losing progress for missed streak
func onStreakBroken() {
    player.streakBonusMultiplier = 1.0
    player.accumulatedStreakRewards = 0 // Removing earned rewards
    showMessage("You lost all streak progress!")
}
```
**Consequence**: Players feel punished, may abandon game entirely.

**Correct**:
```swift
func onStreakBroken() {
    let previousStreak = player.currentStreak
    player.currentStreak = 0
    player.streakBonusMultiplier = 1.0
    // Keep all previously earned rewards

    if previousStreak >= 7 {
        offerStreakRecovery(previousStreak: previousStreak)
    }
    showMessage("Streak paused. Start fresh today!")
}
```

### Anti-Pattern: Notification Spam
**Wrong**:
```swift
// NEVER DO THIS: Multiple notifications per day
func scheduleAllNotifications() {
    scheduleNotification(hour: 8, message: "Good morning!")
    scheduleNotification(hour: 10, message: "Energy full!")
    scheduleNotification(hour: 12, message: "Lunchtime bonus!")
    scheduleNotification(hour: 14, message: "Afternoon challenge!")
    scheduleNotification(hour: 18, message: "Evening rewards!")
    scheduleNotification(hour: 20, message: "Last chance for daily!")
    scheduleNotification(hour: 22, message: "Don't forget to login!")
}
```
**Consequence**: Players disable notifications entirely, lose all notification benefits.

**Correct**:
```swift
func scheduleNotifications(playerSessionCount: Int) {
    // Match notification frequency to player behavior
    let maxNotifications = min(playerSessionCount, 3)

    if maxNotifications >= 1 {
        scheduleStreakReminder() // Most important
    }
    if maxNotifications >= 2 {
        scheduleDailyReward()
    }
    if maxNotifications >= 3 {
        scheduleEnergyFull()
    }
}
```

### Anti-Pattern: Immediate Permission Request
**Wrong**:
```swift
// NEVER DO THIS: Requesting on first launch
func application(_ application: UIApplication, didFinishLaunchingWithOptions...) {
    UNUserNotificationCenter.current().requestAuthorization(...)
}
```
**Consequence**: Lower opt-in rates, player hasn't experienced value yet.

**Correct**:
```swift
func onMilestoneAchieved(milestone: Milestone) {
    let sessionCount = analytics.getSessionCount()

    if sessionCount >= 3 && !hasRequestedNotificationPermission {
        showNotificationValueProposition(context: milestone)
        // "Want to know when your streak is about to expire?"
    }
}
```

### Anti-Pattern: Aggressive Winback
**Wrong**:
```swift
// NEVER DO THIS: Daily winback spam
func checkInactivePlayer(daysAway: Int) {
    if daysAway >= 1 {
        sendPushNotification("Come back! We miss you!")
        sendEmail("Your account is waiting!")
        sendSMS("Special offer inside!")
    }
}
```
**Consequence**: Player marks as spam, damages brand reputation.

**Correct**:
```swift
func checkInactivePlayer(daysAway: Int) {
    switch daysAway {
    case 3:
        scheduleSingleNotification(type: .gentleReminder)
    case 7:
        scheduleWinbackOffer()
    case 14:
        sendWinbackEmail()
    default:
        break // Respect player's decision to leave
    }
}
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| **onboarding-architect** | First-time experience sets D1 retention baseline |
| **dopamine-optimizer** | Reward psychology supports daily engagement |
| **reward-scheduler** | Achievement pacing complements daily rewards |
| **social-mechanics** | Friend features provide retention hooks |
| **core-loop-architect** | Core loop quality determines baseline retention |
| **analytics-integration** | Track retention metrics and churn signals |
