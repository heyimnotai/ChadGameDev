---
name: session-designer
description: Optimize play session structure for iOS games including session length, natural break points, session bookending, and inter-session bridges. Use this skill when designing how long players should play, creating satisfying session endings, implementing return hooks, or timing energy/lives systems. Triggers when analyzing session metrics, optimizing for retention, or designing the rhythm of play. Provides timing values from successful games and proven session patterns.
---

# Session Designer

## Purpose

This skill enables the design of optimally-structured play sessions that respect player time while maximizing engagement and return visits. It enforces the quality bar of top-grossing mobile games by providing validated session length targets, natural break point patterns, and inter-session bridge mechanisms. Well-designed sessions create the "one more game" effect while ending on satisfying notes that drive next-day retention.

## Domain Boundaries

- **This skill handles**: Session length targets, natural break points, session bookending (start/end), mid-session hooks, inter-session bridges (return reasons), energy/lives system timing
- **This skill does NOT handle**: Core loop structure (see `core-loop-architect`), progression mathematics (see `progression-system`), difficulty curves (see `difficulty-tuner`), economy balancing (see `economy-balancer`), reward psychology (see `reward-scheduler`)

## Core Specifications

### Session Length Targets by Genre

| Genre | Target Session | Min Session | Max Session | Sessions/Day |
|-------|---------------|-------------|-------------|--------------|
| Hyper-Casual | 2-5 minutes | 30 seconds | 10 minutes | 5-10 |
| Puzzle (Match-3) | 5-15 minutes | 3 minutes | 30 minutes | 3-5 |
| Card Game | 10-20 minutes | 5 minutes | 45 minutes | 2-4 |
| Roguelike | 15-30 minutes | 10 minutes | 60 minutes | 1-3 |
| Idle/Incremental | 1-3 minutes (active) | 30 seconds | 10 minutes | 8-15 |
| Strategy/Builder | 5-15 minutes | 2 minutes | 30 minutes | 4-8 |
| RPG | 15-30 minutes | 10 minutes | 60 minutes | 2-4 |

### Session Structure Template

```
SESSION STRUCTURE (15-minute example):

0:00 - 0:30   [HOOK] Strong opening
              - Show accumulated rewards
              - Daily bonus collection
              - Clear immediate goal

0:30 - 2:00   [WARM-UP] Easy engagement
              - Complete simple task
              - First quick win
              - Build momentum

2:00 - 10:00  [CORE] Main gameplay
              - Core loop repetition
              - Increasing challenge
              - Reward accumulation

10:00 - 12:00 [CLIMAX] Peak engagement
              - Boss/challenge level
              - High-stakes decision
              - Maximum reward opportunity

12:00 - 14:00 [RESOLUTION] Wind down
              - Reward collection ceremony
              - Progress summary
              - Achievement notifications

14:00 - 15:00 [BRIDGE] Setup for return
              - Preview next content
              - Set timer for bonus
              - Create anticipation
```

### Natural Break Point Design

#### Break Point Triggers

| Trigger | Response | Design Intent |
|---------|----------|---------------|
| Level Complete | Show score, offer continue | Natural pause, "one more" decision |
| Energy Depleted | Wait or watch ad | Monetization + natural end |
| Daily Limit Reached | "Come back tomorrow" | Prevents burnout, creates habit |
| Achievement Earned | Celebration screen | Satisfying stopping point |
| Boss Defeated | Victory ceremony | Major milestone = good exit |
| Collection Complete | Showcase unlock | Reward + natural pause |
| Time-Limited Event End | Results screen | Clear session boundary |

#### Break Point Timing Formula

```
break_point_interval = base_session_length / target_break_points

Example (15-minute session):
- Target: 3-4 break points
- Interval: 4-5 minutes between breaks

Break point quality:
- Should feel like achievement, not interruption
- Player should feel "I could stop now, but..."
- Each break offers reason to continue
```

**Implementation:**
```swift
struct BreakPointManager {
    let targetSessionLength: TimeInterval
    let targetBreakPoints: Int

    var breakPointInterval: TimeInterval {
        return targetSessionLength / Double(targetBreakPoints)
    }

    enum BreakPointType {
        case levelComplete(level: Int, score: Int)
        case energyDepleted(refillTime: TimeInterval)
        case achievementEarned(achievement: String)
        case bossDefeated(bossName: String)
        case dailyLimitReached
        case naturalPause // After X minutes of play

        var shouldShowContinuePrompt: Bool {
            switch self {
            case .levelComplete, .achievementEarned, .bossDefeated:
                return true
            case .energyDepleted, .dailyLimitReached:
                return false
            case .naturalPause:
                return true
            }
        }

        var returnIncentive: String? {
            switch self {
            case .levelComplete:
                return "Next level unlocked!"
            case .energyDepleted(let time):
                return "Full energy in \(Int(time / 60)) minutes"
            case .achievementEarned:
                return "More achievements await!"
            case .bossDefeated:
                return "New area unlocked!"
            case .dailyLimitReached:
                return "Daily rewards reset at midnight"
            case .naturalPause:
                return nil
            }
        }
    }

    struct BreakPointScreen {
        let type: BreakPointType
        let sessionSummary: SessionSummary
        let continueOption: ContinueOption?
        let returnIncentive: String?
    }

    struct SessionSummary {
        let duration: TimeInterval
        let levelsCompleted: Int
        let currencyEarned: Int
        let xpEarned: Int
        let achievementsUnlocked: Int
    }

    enum ContinueOption {
        case playNextLevel
        case tryAgain
        case watchAdForBonus
        case purchaseEnergy
    }
}
```

### Session Bookending

#### Strong Start (First 30 Seconds)

| Element | Timing | Purpose |
|---------|--------|---------|
| Welcome Back Message | 0-3s | Personal connection |
| Offline Earnings Display | 3-8s | Immediate reward (idle games) |
| Daily Bonus Collection | 5-15s | First action = first reward |
| Today's Goal Preview | 10-20s | Direction and purpose |
| Quick Win Opportunity | 20-30s | Momentum building |

**Implementation:**
```swift
struct SessionStartSequence {
    func execute(
        playerData: PlayerData,
        completion: @escaping () -> Void
    ) {
        var sequence: [(action: () -> Void, delay: TimeInterval)] = []

        // 1. Welcome back (0s)
        sequence.append((action: {
            self.showWelcomeBack(player: playerData)
        }, delay: 0))

        // 2. Offline earnings (3s) - if applicable
        if playerData.hasOfflineEarnings {
            sequence.append((action: {
                self.showOfflineEarnings(playerData.offlineEarnings)
            }, delay: 3.0))
        }

        // 3. Daily bonus (8s) - if available
        if playerData.canClaimDailyBonus {
            sequence.append((action: {
                self.showDailyBonusCollection(day: playerData.streakDay)
            }, delay: 8.0))
        }

        // 4. Today's goal (15s)
        sequence.append((action: {
            self.showTodaysGoal(playerData.dailyGoal)
        }, delay: 15.0))

        // 5. Quick win setup (25s)
        sequence.append((action: {
            self.transitionToQuickWin()
            completion()
        }, delay: 25.0))

        // Execute sequence
        executeSequence(sequence)
    }

    private func executeSequence(_ sequence: [(action: () -> Void, delay: TimeInterval)]) {
        for item in sequence {
            DispatchQueue.main.asyncAfter(deadline: .now() + item.delay) {
                item.action()
            }
        }
    }

    private func showWelcomeBack(player: PlayerData) {
        // "Welcome back, [Name]!" or time-based greeting
    }

    private func showOfflineEarnings(_ earnings: Int) {
        // Animated counter showing accumulated resources
    }

    private func showDailyBonusCollection(day: Int) {
        // Daily reward calendar with today highlighted
    }

    private func showTodaysGoal(_ goal: DailyGoal) {
        // "Today's Goal: Complete 5 levels"
    }

    private func transitionToQuickWin() {
        // Start first easy level/activity
    }
}

struct PlayerData {
    let name: String?
    let hasOfflineEarnings: Bool
    let offlineEarnings: Int
    let canClaimDailyBonus: Bool
    let streakDay: Int
    let dailyGoal: DailyGoal
}

struct DailyGoal {
    let description: String
    let progress: Int
    let target: Int
}
```

#### Satisfying End (Last 60 Seconds)

| Element | Timing | Purpose |
|---------|--------|---------|
| Progress Summary | 0-15s | Acknowledge accomplishment |
| Reward Animation | 15-30s | Dopamine hit |
| Achievement Display | 30-45s | Milestone recognition |
| Next Goal Preview | 45-55s | Reason to return |
| Return Reminder | 55-60s | Specific callback |

**Implementation:**
```swift
struct SessionEndSequence {
    func execute(
        sessionData: SessionData,
        completion: @escaping (SessionEndAction) -> Void
    ) {
        // Phase 1: Progress Summary (0-15s)
        showProgressSummary(sessionData) {

            // Phase 2: Reward Animation (15-30s)
            self.playRewardAnimation(sessionData.rewards) {

                // Phase 3: Achievement Display (30-45s)
                self.showAchievements(sessionData.achievements) {

                    // Phase 4: Next Goal Preview (45-55s)
                    self.showNextGoalPreview(sessionData.upcomingContent) {

                        // Phase 5: Return Reminder (55-60s)
                        self.showReturnReminder(sessionData.nextReward) {
                            completion(.sessionComplete)
                        }
                    }
                }
            }
        }
    }

    private func showProgressSummary(_ data: SessionData, completion: @escaping () -> Void) {
        // "This Session: 5 levels, 1,234 coins, 15 minutes"
        // Animated counters
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            completion()
        }
    }

    private func playRewardAnimation(_ rewards: [Reward], completion: @escaping () -> Void) {
        // Coins flying to counter
        // XP bar filling
        // Items collected showcase
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            completion()
        }
    }

    private func showAchievements(_ achievements: [Achievement], completion: @escaping () -> Void) {
        guard !achievements.isEmpty else {
            completion()
            return
        }
        // Achievement badges with fanfare
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            completion()
        }
    }

    private func showNextGoalPreview(_ content: UpcomingContent, completion: @escaping () -> Void) {
        // "Next: Boss Level!"
        // Preview image of upcoming content
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            completion()
        }
    }

    private func showReturnReminder(_ nextReward: NextReward, completion: @escaping () -> Void) {
        // "Free chest in 4 hours!"
        // Or "Daily bonus resets in 8 hours"
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            completion()
        }
    }

    enum SessionEndAction {
        case sessionComplete
        case continuePlayRequested
    }
}

struct SessionData {
    let duration: TimeInterval
    let levelsCompleted: Int
    let rewards: [Reward]
    let achievements: [Achievement]
    let upcomingContent: UpcomingContent
    let nextReward: NextReward
}

struct Reward {
    let type: String
    let amount: Int
}

struct Achievement {
    let name: String
    let icon: String
}

struct UpcomingContent {
    let name: String
    let previewImage: String
}

struct NextReward {
    let description: String
    let timeUntilAvailable: TimeInterval
}
```

### Mid-Session Hooks

#### Hook Types and Timing

| Hook | Placement | Purpose | Implementation |
|------|-----------|---------|----------------|
| Streak Counter | Every action | Build investment | "5-hit combo!" |
| Near-Miss Feedback | On close calls | Increase tension | "So close!" |
| Surprise Reward | Random (5-10%) | Variable reinforcement | Bonus chest appears |
| Progress Milestone | Every 25% | Mark accomplishment | "Halfway there!" |
| Challenge Opportunity | Mid-session | Increase stakes | "Double or nothing?" |
| Social Trigger | After achievement | Connection | "Share your score?" |

**Implementation:**
```swift
final class MidSessionHookManager {
    private var sessionStartTime: Date?
    private var actionsThisSession: Int = 0
    private var lastHookTime: Date?

    let minTimeBetweenHooks: TimeInterval = 60 // 1 minute minimum

    struct HookConfig {
        let surpriseRewardChance: Double = 0.07 // 7%
        let progressMilestones: [Double] = [0.25, 0.5, 0.75] // 25%, 50%, 75%
        let challengeOfferThreshold: Int = 10 // After 10 actions
    }

    let config = HookConfig()

    enum Hook {
        case streakCounter(count: Int)
        case nearMiss(description: String)
        case surpriseReward(reward: Reward)
        case progressMilestone(percentage: Int)
        case challengeOpportunity(stakes: String)
        case socialTrigger(achievement: String)

        var priority: Int {
            switch self {
            case .surpriseReward: return 100
            case .progressMilestone: return 80
            case .challengeOpportunity: return 60
            case .nearMiss: return 40
            case .streakCounter: return 20
            case .socialTrigger: return 10
            }
        }
    }

    func startSession() {
        sessionStartTime = Date()
        actionsThisSession = 0
        lastHookTime = nil
    }

    func recordAction(
        streakCount: Int,
        wasNearMiss: Bool,
        progressPercentage: Double
    ) -> Hook? {
        actionsThisSession += 1

        // Check cooldown
        if let lastHook = lastHookTime,
           Date().timeIntervalSince(lastHook) < minTimeBetweenHooks {
            return nil
        }

        var possibleHooks: [Hook] = []

        // Check for streak
        if streakCount >= 5 && streakCount % 5 == 0 {
            possibleHooks.append(.streakCounter(count: streakCount))
        }

        // Check for near miss
        if wasNearMiss {
            possibleHooks.append(.nearMiss(description: "That was close!"))
        }

        // Check for surprise reward
        if Double.random(in: 0...1) < config.surpriseRewardChance {
            possibleHooks.append(.surpriseReward(
                reward: Reward(type: "bonus_chest", amount: 1)
            ))
        }

        // Check for progress milestone
        for milestone in config.progressMilestones {
            let tolerance = 0.02 // 2% tolerance
            if abs(progressPercentage - milestone) < tolerance {
                possibleHooks.append(.progressMilestone(
                    percentage: Int(milestone * 100)
                ))
            }
        }

        // Check for challenge opportunity
        if actionsThisSession == config.challengeOfferThreshold {
            possibleHooks.append(.challengeOpportunity(
                stakes: "Double rewards for next level?"
            ))
        }

        // Return highest priority hook
        if let hook = possibleHooks.sorted(by: { $0.priority > $1.priority }).first {
            lastHookTime = Date()
            return hook
        }

        return nil
    }

    func triggerSocialHook(forAchievement achievement: String) -> Hook {
        return .socialTrigger(achievement: achievement)
    }
}
```

### Inter-Session Bridges (Return Reasons)

#### Bridge Types

| Bridge Type | Timing | Message Example |
|-------------|--------|-----------------|
| Timer-Based Reward | 4-8 hours | "Free chest ready in 4h" |
| Daily Reset | 24 hours | "Daily bonus resets at midnight" |
| Energy Refill | 30min-4hr | "Full energy in 2 hours" |
| Event Countdown | Event-based | "Tournament ends in 2 days" |
| Friend Activity | Realtime | "Alex beat your high score!" |
| Cliffhanger | End of session | "Boss awaits..." |
| Streak Maintenance | 24 hours | "Don't lose your 7-day streak!" |

**Implementation:**
```swift
final class InterSessionBridgeManager {
    struct Bridge {
        let type: BridgeType
        let title: String
        let message: String
        let timeUntilRelevant: TimeInterval?
        let pushNotificationEnabled: Bool
    }

    enum BridgeType {
        case timerReward
        case dailyReset
        case energyRefill
        case eventCountdown
        case friendActivity
        case cliffhanger
        case streakMaintenance
    }

    func createBridges(forSessionEnd sessionData: SessionData) -> [Bridge] {
        var bridges: [Bridge] = []

        // Timer reward (always present)
        bridges.append(Bridge(
            type: .timerReward,
            title: "Free Reward",
            message: "Collect your free chest!",
            timeUntilRelevant: 4 * 3600, // 4 hours
            pushNotificationEnabled: true
        ))

        // Streak maintenance (if applicable)
        if sessionData.hasActiveStreak {
            bridges.append(Bridge(
                type: .streakMaintenance,
                title: "Keep Your Streak!",
                message: "Day \(sessionData.streakDay) - Don't break it!",
                timeUntilRelevant: calculateTimeUntilStreakExpires(),
                pushNotificationEnabled: true
            ))
        }

        // Energy refill (if depleted)
        if sessionData.energyDepleted {
            bridges.append(Bridge(
                type: .energyRefill,
                title: "Energy Restored",
                message: "Your energy is full again!",
                timeUntilRelevant: sessionData.timeUntilFullEnergy,
                pushNotificationEnabled: true
            ))
        }

        // Cliffhanger (content-based)
        if let nextBoss = sessionData.upcomingBoss {
            bridges.append(Bridge(
                type: .cliffhanger,
                title: nextBoss.name,
                message: "The \(nextBoss.name) awaits your challenge...",
                timeUntilRelevant: nil,
                pushNotificationEnabled: false
            ))
        }

        // Daily reset
        bridges.append(Bridge(
            type: .dailyReset,
            title: "Daily Rewards",
            message: "New daily challenges available!",
            timeUntilRelevant: timeUntilMidnight(),
            pushNotificationEnabled: true
        ))

        return bridges
    }

    private func calculateTimeUntilStreakExpires() -> TimeInterval {
        // Typically 24-48 hours from last claim
        return 24 * 3600
    }

    private func timeUntilMidnight() -> TimeInterval {
        let calendar = Calendar.current
        let now = Date()
        let midnight = calendar.startOfDay(for: now).addingTimeInterval(24 * 3600)
        return midnight.timeIntervalSince(now)
    }

    func schedulePushNotifications(forBridges bridges: [Bridge]) {
        for bridge in bridges where bridge.pushNotificationEnabled {
            guard let fireTime = bridge.timeUntilRelevant else { continue }

            scheduleNotification(
                title: bridge.title,
                body: bridge.message,
                delay: fireTime
            )
        }
    }

    private func scheduleNotification(title: String, body: String, delay: TimeInterval) {
        // UNUserNotificationCenter implementation
    }
}

extension SessionData {
    var hasActiveStreak: Bool { return streakDay > 0 }
    var energyDepleted: Bool { return currentEnergy == 0 }
    var timeUntilFullEnergy: TimeInterval { return 0 } // Calculate based on energy system
    var upcomingBoss: Boss? { return nil } // Based on progression
    var streakDay: Int { return 0 }
    var currentEnergy: Int { return 0 }
}

struct Boss {
    let name: String
}
```

### Energy/Lives System Timing

#### System Configurations

| Game Type | Max Energy | Regen Rate | Full Refill Time |
|-----------|-----------|------------|------------------|
| Hyper-Casual | None | N/A | N/A |
| Puzzle (Casual) | 5 lives | 1 per 30 min | 2.5 hours |
| Puzzle (Core) | 5 lives | 1 per 20 min | 1.5 hours |
| Strategy | 10-20 energy | 1 per 6-10 min | 1-3 hours |
| Gacha/RPG | 100-200 stamina | 1 per 5 min | 8-16 hours |

#### Energy System Design

```swift
final class EnergySystem {
    struct Config {
        let maxEnergy: Int
        let regenerationInterval: TimeInterval // Seconds per 1 energy
        let levelCost: Int
        let bonusEnergyCap: Int // Energy from ads/purchases can exceed max
    }

    private let config: Config
    private var currentEnergy: Int
    private var bonusEnergy: Int = 0
    private var lastUpdateTime: Date

    init(config: Config) {
        self.config = config
        self.currentEnergy = config.maxEnergy
        self.lastUpdateTime = Date()
    }

    // MARK: - Energy Operations

    var totalEnergy: Int {
        return currentEnergy + bonusEnergy
    }

    var isFull: Bool {
        return currentEnergy >= config.maxEnergy
    }

    func canPlay() -> Bool {
        return totalEnergy >= config.levelCost
    }

    func consumeEnergy() -> Bool {
        updateEnergy() // First, regenerate any pending energy

        if bonusEnergy >= config.levelCost {
            bonusEnergy -= config.levelCost
            return true
        } else if currentEnergy >= config.levelCost {
            currentEnergy -= config.levelCost
            return true
        }
        return false
    }

    func addBonusEnergy(_ amount: Int) {
        bonusEnergy = min(bonusEnergy + amount, config.bonusEnergyCap)
    }

    func refillEnergy() {
        currentEnergy = config.maxEnergy
        lastUpdateTime = Date()
    }

    // MARK: - Regeneration

    private func updateEnergy() {
        guard currentEnergy < config.maxEnergy else { return }

        let elapsed = Date().timeIntervalSince(lastUpdateTime)
        let energyGained = Int(elapsed / config.regenerationInterval)

        if energyGained > 0 {
            currentEnergy = min(currentEnergy + energyGained, config.maxEnergy)
            lastUpdateTime = Date()
        }
    }

    // MARK: - Time Calculations

    func timeUntilNextEnergy() -> TimeInterval {
        guard currentEnergy < config.maxEnergy else { return 0 }

        let elapsed = Date().timeIntervalSince(lastUpdateTime)
        let timeInCurrentCycle = elapsed.truncatingRemainder(
            dividingBy: config.regenerationInterval
        )
        return config.regenerationInterval - timeInCurrentCycle
    }

    func timeUntilFull() -> TimeInterval {
        updateEnergy()
        guard currentEnergy < config.maxEnergy else { return 0 }

        let energyNeeded = config.maxEnergy - currentEnergy
        let timeForRemaining = Double(energyNeeded) * config.regenerationInterval
        let timeInCurrentCycle = Date().timeIntervalSince(lastUpdateTime)
            .truncatingRemainder(dividingBy: config.regenerationInterval)

        return timeForRemaining - timeInCurrentCycle
    }

    // MARK: - Display

    func getDisplayState() -> EnergyDisplayState {
        updateEnergy()

        return EnergyDisplayState(
            current: currentEnergy,
            bonus: bonusEnergy,
            max: config.maxEnergy,
            timeUntilNext: timeUntilNextEnergy(),
            timeUntilFull: timeUntilFull(),
            canPlay: canPlay()
        )
    }

    struct EnergyDisplayState {
        let current: Int
        let bonus: Int
        let max: Int
        let timeUntilNext: TimeInterval
        let timeUntilFull: TimeInterval
        let canPlay: Bool

        var displayString: String {
            if bonus > 0 {
                return "\(current)+\(bonus)/\(max)"
            }
            return "\(current)/\(max)"
        }

        var timerString: String {
            guard timeUntilNext > 0 else { return "Full" }

            let minutes = Int(timeUntilNext) / 60
            let seconds = Int(timeUntilNext) % 60
            return String(format: "%d:%02d", minutes, seconds)
        }
    }

    // MARK: - Persistence

    func save() -> [String: Any] {
        return [
            "currentEnergy": currentEnergy,
            "bonusEnergy": bonusEnergy,
            "lastUpdateTime": lastUpdateTime.timeIntervalSince1970
        ]
    }

    func load(from data: [String: Any]) {
        currentEnergy = data["currentEnergy"] as? Int ?? config.maxEnergy
        bonusEnergy = data["bonusEnergy"] as? Int ?? 0
        if let timestamp = data["lastUpdateTime"] as? TimeInterval {
            lastUpdateTime = Date(timeIntervalSince1970: timestamp)
        }
        updateEnergy() // Apply any regeneration while away
    }
}
```

### Session Timing Values from Successful Games

| Game | Avg Session | Sessions/Day | Key Timing |
|------|-------------|--------------|------------|
| Candy Crush | 8-12 min | 4-6 | 5 lives, 30min regen |
| Clash Royale | 12-15 min | 4-5 | 3-4 min matches |
| Marvel Snap | 8-10 min | 5-7 | 3 min matches |
| Clash of Clans | 6-10 min | 5-8 | Builder timers 1min-14days |
| Subway Surfers | 5-8 min | 6-10 | Endless, mission-based |
| Wordle | 2-5 min | 1 | Once per day |
| Cookie Clicker | 2-3 min active | 10-20 | Offline accumulation |
| Vampire Survivors | 20-30 min | 1-2 | 30 min max per run |
| Pokemon GO | 15-30 min | 2-4 | Real-world walking required |

### Complete Session Manager

```swift
import Foundation

final class SessionManager {
    // MARK: - Configuration

    struct Config {
        let targetSessionLength: TimeInterval
        let minSessionLength: TimeInterval
        let maxSessionLength: TimeInterval
        let targetBreakPoints: Int
        let hookCooldown: TimeInterval
    }

    // MARK: - Dependencies

    private let hookManager: MidSessionHookManager
    private let bridgeManager: InterSessionBridgeManager
    private let energySystem: EnergySystem?

    // MARK: - State

    private(set) var sessionStartTime: Date?
    private(set) var isInSession: Bool = false
    private var sessionMetrics = SessionMetrics()

    // MARK: - Initialization

    init(
        config: Config,
        energySystem: EnergySystem? = nil
    ) {
        self.hookManager = MidSessionHookManager()
        self.bridgeManager = InterSessionBridgeManager()
        self.energySystem = energySystem
    }

    // MARK: - Session Lifecycle

    func startSession() -> SessionStartResult {
        sessionStartTime = Date()
        isInSession = true
        sessionMetrics = SessionMetrics()
        hookManager.startSession()

        // Calculate session start content
        let startSequence = buildStartSequence()

        return SessionStartResult(
            welcomeMessage: getWelcomeMessage(),
            offlineRewards: calculateOfflineRewards(),
            dailyBonusAvailable: isDailyBonusAvailable(),
            startSequence: startSequence
        )
    }

    func endSession(reason: EndReason) -> SessionEndResult {
        guard let startTime = sessionStartTime else {
            return SessionEndResult(
                summary: SessionSummary.empty,
                bridges: [],
                recommendations: []
            )
        }

        let duration = Date().timeIntervalSince(startTime)
        isInSession = false

        // Build summary
        let summary = SessionSummary(
            duration: duration,
            levelsCompleted: sessionMetrics.levelsCompleted,
            currencyEarned: sessionMetrics.currencyEarned,
            xpEarned: sessionMetrics.xpEarned,
            achievementsUnlocked: sessionMetrics.achievementsUnlocked
        )

        // Create bridges for return
        let sessionData = buildSessionData(summary: summary)
        let bridges = bridgeManager.createBridges(forSessionEnd: sessionData)

        // Schedule notifications
        bridgeManager.schedulePushNotifications(forBridges: bridges)

        // Generate recommendations
        let recommendations = generateRecommendations(
            duration: duration,
            reason: reason
        )

        return SessionEndResult(
            summary: summary,
            bridges: bridges,
            recommendations: recommendations
        )
    }

    // MARK: - During Session

    func recordAction(
        type: ActionType,
        streakCount: Int = 0,
        wasNearMiss: Bool = false,
        progressPercentage: Double = 0
    ) -> MidSessionHookManager.Hook? {
        sessionMetrics.recordAction(type: type)

        return hookManager.recordAction(
            streakCount: streakCount,
            wasNearMiss: wasNearMiss,
            progressPercentage: progressPercentage
        )
    }

    func shouldSuggestBreak() -> BreakSuggestion? {
        guard let startTime = sessionStartTime else { return nil }

        let elapsed = Date().timeIntervalSince(startTime)

        // Suggest break at target session length
        if elapsed >= config.targetSessionLength {
            return BreakSuggestion(
                reason: .targetReached,
                message: "Great session! Take a break?"
            )
        }

        // Suggest break at max session length
        if elapsed >= config.maxSessionLength {
            return BreakSuggestion(
                reason: .maxReached,
                message: "You've been playing a while. Time for a break!"
            )
        }

        // Suggest break if energy depleted
        if let energy = energySystem, !energy.canPlay() {
            return BreakSuggestion(
                reason: .energyDepleted,
                message: "Out of energy. Come back in \(energy.getDisplayState().timerString)!"
            )
        }

        return nil
    }

    // MARK: - Private Helpers

    private let config: Config

    private func buildStartSequence() -> [SessionStartStep] {
        var steps: [SessionStartStep] = []

        steps.append(.welcome)

        if hasOfflineRewards() {
            steps.append(.offlineRewards)
        }

        if isDailyBonusAvailable() {
            steps.append(.dailyBonus)
        }

        steps.append(.goalPreview)
        steps.append(.quickWin)

        return steps
    }

    private func getWelcomeMessage() -> String {
        let hour = Calendar.current.component(.hour, from: Date())

        switch hour {
        case 5..<12: return "Good morning!"
        case 12..<17: return "Good afternoon!"
        case 17..<21: return "Good evening!"
        default: return "Welcome back!"
        }
    }

    private func calculateOfflineRewards() -> Int {
        // Calculate based on idle system if applicable
        return 0
    }

    private func hasOfflineRewards() -> Bool {
        return calculateOfflineRewards() > 0
    }

    private func isDailyBonusAvailable() -> Bool {
        // Check daily bonus claim status
        return true
    }

    private func buildSessionData(summary: SessionSummary) -> SessionData {
        return SessionData(
            duration: summary.duration,
            levelsCompleted: summary.levelsCompleted,
            rewards: [],
            achievements: [],
            upcomingContent: UpcomingContent(name: "Next Level", previewImage: ""),
            nextReward: NextReward(description: "Free chest", timeUntilAvailable: 4 * 3600)
        )
    }

    private func generateRecommendations(
        duration: TimeInterval,
        reason: EndReason
    ) -> [ReturnRecommendation] {
        var recommendations: [ReturnRecommendation] = []

        if reason == .energyDepleted {
            recommendations.append(ReturnRecommendation(
                timing: .whenEnergyRefills,
                message: "Come back when energy is full!"
            ))
        }

        recommendations.append(ReturnRecommendation(
            timing: .forDailyBonus,
            message: "Don't miss tomorrow's bonus!"
        ))

        return recommendations
    }

    // MARK: - Types

    enum ActionType {
        case levelComplete
        case itemCollected
        case enemyDefeated
        case achievementUnlocked
    }

    enum EndReason {
        case userChoice
        case energyDepleted
        case dailyLimitReached
        case appBackgrounded
        case targetSessionReached
    }

    struct SessionStartResult {
        let welcomeMessage: String
        let offlineRewards: Int
        let dailyBonusAvailable: Bool
        let startSequence: [SessionStartStep]
    }

    enum SessionStartStep {
        case welcome
        case offlineRewards
        case dailyBonus
        case goalPreview
        case quickWin
    }

    struct SessionEndResult {
        let summary: SessionSummary
        let bridges: [InterSessionBridgeManager.Bridge]
        let recommendations: [ReturnRecommendation]
    }

    struct SessionSummary {
        let duration: TimeInterval
        let levelsCompleted: Int
        let currencyEarned: Int
        let xpEarned: Int
        let achievementsUnlocked: Int

        static let empty = SessionSummary(
            duration: 0,
            levelsCompleted: 0,
            currencyEarned: 0,
            xpEarned: 0,
            achievementsUnlocked: 0
        )
    }

    struct BreakSuggestion {
        let reason: BreakReason
        let message: String

        enum BreakReason {
            case targetReached
            case maxReached
            case energyDepleted
        }
    }

    struct ReturnRecommendation {
        let timing: ReturnTiming
        let message: String

        enum ReturnTiming {
            case whenEnergyRefills
            case forDailyBonus
            case forEvent
            case forStreakMaintenance
        }
    }
}

private struct SessionMetrics {
    var levelsCompleted: Int = 0
    var currencyEarned: Int = 0
    var xpEarned: Int = 0
    var achievementsUnlocked: Int = 0
    var actionsPerformed: Int = 0

    mutating func recordAction(type: SessionManager.ActionType) {
        actionsPerformed += 1

        switch type {
        case .levelComplete:
            levelsCompleted += 1
        case .itemCollected:
            currencyEarned += 10 // Example
        case .enemyDefeated:
            xpEarned += 5 // Example
        case .achievementUnlocked:
            achievementsUnlocked += 1
        }
    }
}
```

## Decision Trees

### Session Length Selection

```
START: What is the game genre?

[Hyper-Casual]
    -> Target: 2-5 minutes
    -> No energy system
    -> Sessions are disposable
    -> Focus on quantity (many short sessions)

[Puzzle/Match-3]
    -> Target: 5-15 minutes
    -> Lives system (5 lives, 30min regen)
    -> 3-5 levels per session
    -> Natural break after each level

[Card/Battle]
    -> Target: 10-20 minutes
    -> Match-based sessions
    -> 3-5 matches per session
    -> Chest timers create return hooks

[Roguelike]
    -> Target: 15-30 minutes
    -> Run-based sessions
    -> 1-2 runs per session
    -> Meta-progression between runs

[Strategy/Builder]
    -> Target: 5-15 minutes
    -> Timer-based sessions
    -> Collection + action pattern
    -> Multiple short sessions daily

[Idle]
    -> Target: 1-3 minutes (active)
    -> Check-in sessions
    -> Offline accumulation
    -> 10-20 touch points daily
```

### Energy System Decision

```
START: Should the game have an energy system?

[Hyper-Casual]
    -> NO energy system
    -> Monetize through ads
    -> Unlimited play encourages ad views

[Casual Puzzle (Wide Audience)]
    -> YES - Lives system
    -> 5 lives, 30min regeneration
    -> Prevents burnout, creates return hooks

[Core Puzzle (Engaged Audience)]
    -> OPTIONAL - Lives or unlimited with daily limits
    -> Consider subscription for unlimited

[RPG/Gacha]
    -> YES - Stamina system
    -> 100-200 stamina, 5min regen
    -> Content gating + monetization

[Competitive]
    -> AVOID energy on ranked
    -> Optional on casual modes
    -> Players expect fair access

[Premium ($)]
    -> NO energy system
    -> Player already paid for access
    -> Unlimited play is expected
```

### Break Point Placement

```
After Level Complete:
    -> ALWAYS offer break point
    -> Show score, stars, rewards
    -> "Continue" button prominent
    -> "Exit" option available

After Achievement:
    -> Celebration screen = break point
    -> Show what was unlocked
    -> Preview next achievement

After Boss/Major Event:
    -> Extended break point
    -> Story moment or cutscene
    -> Significant reward ceremony
    -> Clear chapter boundary

After Energy Depletes:
    -> Forced break point
    -> Show refill timer
    -> Offer ad/purchase options
    -> Schedule return notification

At Target Session Length:
    -> Gentle suggestion, not forced
    -> "Great session! Keep going?"
    -> Summary of accomplishments

At Max Session Length:
    -> Stronger suggestion
    -> Health/break reminder
    -> Still allow continue if desired
```

## Quality Checklist

### Session Start
- [ ] First interaction within 5 seconds of launch
- [ ] Offline rewards shown (if applicable)
- [ ] Daily bonus claimable immediately
- [ ] Clear goal visible within 30 seconds
- [ ] First success within 2 minutes

### Session Flow
- [ ] Natural break point every 3-5 minutes
- [ ] Mid-session hooks maintain engagement
- [ ] No dead time > 10 seconds without feedback
- [ ] Progress visible at all times
- [ ] Energy/lives clearly displayed

### Session End
- [ ] Summary shows accomplishments
- [ ] Rewards celebrated with animation
- [ ] Next goal previewed
- [ ] Return reason established
- [ ] Exit graceful, not punishing

### Return Hooks
- [ ] Timer-based reward within 4-8 hours
- [ ] Daily reset creates 24-hour cycle
- [ ] Streak maintenance motivation
- [ ] Push notification scheduled (if permitted)
- [ ] Social triggers for competitive players

## Anti-Patterns

### Anti-Pattern: Endless Session

**Wrong:**
```
No natural stopping points
No session summary
Player plays until exhausted
Next day: "I played too much, not coming back"
```

**Right:**
```
Break point every 5 minutes
Session summary after 15 minutes
"Great session! Come back for daily bonus"
Player returns refreshed next day
```

**Consequence:** Player burnout destroys long-term retention. Design sessions to end well, not endlessly.

### Anti-Pattern: Punishing Exit

**Wrong:**
```
Player wants to quit mid-level
"WARNING: All progress will be lost!"
Player feels trapped
Negative association with game
```

**Right:**
```
Player wants to quit mid-level
Auto-save progress
"Your progress is saved. See you soon!"
Positive exit experience
```

**Consequence:** Punishing exits create anxiety. Players should feel free to leave, confident they can return.

### Anti-Pattern: Cold Start

**Wrong:**
```
App opens -> Black screen -> Main menu
Player: "What was I doing?"
No momentum, player closes app
```

**Right:**
```
App opens -> "Welcome back!" -> Daily bonus
"Continue from Level 23?" -> Immediate engagement
Player re-engaged within 10 seconds
```

**Consequence:** Cold starts lose returning players. Always provide context and momentum.

### Anti-Pattern: Aggressive Energy Monetization

**Wrong:**
```
5 lives, 1 hour regeneration each
Player can play 5 minutes per day free
Constant "Buy more lives?" popups
Player uninstalls in frustration
```

**Right:**
```
5 lives, 30 minutes regeneration each
Player can play 30+ minutes per day free
Ads offer bonus energy (optional)
Purchase option is value, not gate
```

**Consequence:** Overly restrictive energy systems feel predatory. F2P must be viable.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `core-loop-architect` | Sessions contain multiple core loops |
| `progression-system` | Progression rewards punctuate sessions |
| `economy-balancer` | Currency earning/spending per session |
| `difficulty-tuner` | Difficulty within session should vary |
| `onboarding-architect` | First session is FTUE |
| `reward-scheduler` | Reward timing drives session rhythm |
| `retention-engineer` | Session design directly impacts D1/D7 |
