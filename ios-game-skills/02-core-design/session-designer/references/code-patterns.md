# Session Designer - Code Patterns

## Break Point Manager

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
        case naturalPause

        var shouldShowContinuePrompt: Bool {
            switch self {
            case .levelComplete, .achievementEarned, .bossDefeated, .naturalPause:
                return true
            case .energyDepleted, .dailyLimitReached:
                return false
            }
        }

        var returnIncentive: String? {
            switch self {
            case .levelComplete: return "Next level unlocked!"
            case .energyDepleted(let time): return "Full energy in \(Int(time/60)) min"
            case .achievementEarned: return "More achievements await!"
            case .bossDefeated: return "New area unlocked!"
            case .dailyLimitReached: return "Daily rewards reset at midnight"
            case .naturalPause: return nil
            }
        }
    }
}
```

## Mid-Session Hook Manager

```swift
final class MidSessionHookManager {
    private var sessionStartTime: Date?
    private var actionsThisSession: Int = 0
    private var lastHookTime: Date?
    let minTimeBetweenHooks: TimeInterval = 60

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

    func recordAction(streakCount: Int, wasNearMiss: Bool, progressPercentage: Double) -> Hook? {
        actionsThisSession += 1
        if let lastHook = lastHookTime, Date().timeIntervalSince(lastHook) < minTimeBetweenHooks {
            return nil
        }

        var possibleHooks: [Hook] = []

        if streakCount >= 5 && streakCount % 5 == 0 {
            possibleHooks.append(.streakCounter(count: streakCount))
        }
        if wasNearMiss {
            possibleHooks.append(.nearMiss(description: "That was close!"))
        }
        if Double.random(in: 0...1) < 0.07 {
            possibleHooks.append(.surpriseReward(reward: Reward(type: "bonus", amount: 1)))
        }
        for milestone in [0.25, 0.5, 0.75] {
            if abs(progressPercentage - milestone) < 0.02 {
                possibleHooks.append(.progressMilestone(percentage: Int(milestone * 100)))
            }
        }

        if let hook = possibleHooks.sorted(by: { $0.priority > $1.priority }).first {
            lastHookTime = Date()
            return hook
        }
        return nil
    }
}
```

## Inter-Session Bridge Manager

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
        case timerReward, dailyReset, energyRefill, eventCountdown
        case friendActivity, cliffhanger, streakMaintenance
    }

    func createBridges(forSessionEnd sessionData: SessionData) -> [Bridge] {
        var bridges: [Bridge] = []

        bridges.append(Bridge(type: .timerReward, title: "Free Reward",
            message: "Collect your free chest!", timeUntilRelevant: 4 * 3600, pushNotificationEnabled: true))

        if sessionData.hasActiveStreak {
            bridges.append(Bridge(type: .streakMaintenance, title: "Keep Your Streak!",
                message: "Day \(sessionData.streakDay) - Don't break it!",
                timeUntilRelevant: 24 * 3600, pushNotificationEnabled: true))
        }

        if sessionData.energyDepleted {
            bridges.append(Bridge(type: .energyRefill, title: "Energy Restored",
                message: "Your energy is full again!",
                timeUntilRelevant: sessionData.timeUntilFullEnergy, pushNotificationEnabled: true))
        }

        bridges.append(Bridge(type: .dailyReset, title: "Daily Rewards",
            message: "New daily challenges!", timeUntilRelevant: timeUntilMidnight(), pushNotificationEnabled: true))

        return bridges
    }

    private func timeUntilMidnight() -> TimeInterval {
        let calendar = Calendar.current
        let midnight = calendar.startOfDay(for: Date()).addingTimeInterval(24 * 3600)
        return midnight.timeIntervalSince(Date())
    }
}
```

## Energy System

```swift
final class EnergySystem {
    struct Config {
        let maxEnergy: Int
        let regenerationInterval: TimeInterval
        let levelCost: Int
        let bonusEnergyCap: Int
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

    var totalEnergy: Int { currentEnergy + bonusEnergy }
    var isFull: Bool { currentEnergy >= config.maxEnergy }
    func canPlay() -> Bool { totalEnergy >= config.levelCost }

    func consumeEnergy() -> Bool {
        updateEnergy()
        if bonusEnergy >= config.levelCost {
            bonusEnergy -= config.levelCost
            return true
        } else if currentEnergy >= config.levelCost {
            currentEnergy -= config.levelCost
            return true
        }
        return false
    }

    private func updateEnergy() {
        guard currentEnergy < config.maxEnergy else { return }
        let elapsed = Date().timeIntervalSince(lastUpdateTime)
        let energyGained = Int(elapsed / config.regenerationInterval)
        if energyGained > 0 {
            currentEnergy = min(currentEnergy + energyGained, config.maxEnergy)
            lastUpdateTime = Date()
        }
    }

    func timeUntilFull() -> TimeInterval {
        updateEnergy()
        guard currentEnergy < config.maxEnergy else { return 0 }
        let energyNeeded = config.maxEnergy - currentEnergy
        return Double(energyNeeded) * config.regenerationInterval
    }
}
```

## Session Start Sequence

```swift
struct SessionStartSequence {
    func execute(playerData: PlayerData, completion: @escaping () -> Void) {
        var delay: TimeInterval = 0

        // Welcome (0s)
        showWelcomeBack()

        // Offline earnings (3s)
        if playerData.hasOfflineEarnings {
            delay = 3.0
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                self.showOfflineEarnings(playerData.offlineEarnings)
            }
        }

        // Daily bonus (8s)
        if playerData.canClaimDailyBonus {
            delay = 8.0
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                self.showDailyBonus(day: playerData.streakDay)
            }
        }

        // Quick win (25s)
        DispatchQueue.main.asyncAfter(deadline: .now() + 25) {
            completion()
        }
    }

    private func showWelcomeBack() {}
    private func showOfflineEarnings(_ earnings: Int) {}
    private func showDailyBonus(day: Int) {}
}
```

## Session End Sequence

```swift
struct SessionEndSequence {
    func execute(sessionData: SessionData, completion: @escaping () -> Void) {
        // 0-15s: Progress summary
        showProgressSummary(sessionData) {
            // 15-30s: Reward animation
            self.playRewardAnimation(sessionData.rewards) {
                // 30-45s: Achievements
                self.showAchievements(sessionData.achievements) {
                    // 45-55s: Next goal preview
                    self.showNextGoalPreview(sessionData.upcomingContent) {
                        // 55-60s: Return reminder
                        self.showReturnReminder(sessionData.nextReward) {
                            completion()
                        }
                    }
                }
            }
        }
    }

    private func showProgressSummary(_ data: SessionData, completion: @escaping () -> Void) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) { completion() }
    }
    private func playRewardAnimation(_ rewards: [Reward], completion: @escaping () -> Void) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) { completion() }
    }
    private func showAchievements(_ achievements: [Achievement], completion: @escaping () -> Void) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { completion() }
    }
    private func showNextGoalPreview(_ content: UpcomingContent, completion: @escaping () -> Void) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { completion() }
    }
    private func showReturnReminder(_ reward: NextReward, completion: @escaping () -> Void) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { completion() }
    }
}
```
