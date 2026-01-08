---
name: reward-scheduler
description: Designs optimal reward timing and distribution systems including fixed schedules, daily/weekly/monthly cadences, achievement unlock pacing, and loot drop rates. Use this skill when planning reward calendars, designing achievement systems, calibrating drop rates, or scheduling recurring rewards. Triggers when determining how often players receive rewards, what magnitude rewards should be, and how to pace unlocks over time. This skill ensures rewards feel meaningful and properly spaced without overwhelming or underwhelming players.
---

# Reward Scheduler

## Purpose

This skill enables the design of reward timing and distribution systems that maintain player engagement through properly paced unlocks, calibrated reward magnitudes, and balanced schedules. It enforces a quality bar where rewards feel earned and exciting, progression feels steady but not trivial, and the reward economy remains sustainable over months of play. All implementations must include ethical considerations and meet disclosure requirements.

## Domain Boundaries

- **This skill handles**:
  - Fixed vs variable reward schedule design
  - Reward magnitude calibration
  - Daily, weekly, and monthly reward cadences
  - Achievement unlock pacing and milestone design
  - Loot and drop rate design
  - Reward anticipation UI patterns
  - Reward schedule mathematics
  - Ethical considerations and disclosure requirements
  - Long-term reward sustainability

- **This skill does NOT handle**:
  - Variable ratio psychology (see: dopamine-optimizer)
  - Pity systems and gacha mechanics (see: dopamine-optimizer)
  - Daily login and streak systems (see: retention-engineer)
  - First-time user rewards (see: onboarding-architect)
  - Leaderboard rewards (see: social-mechanics)
  - Economy balancing (see: economy-balancer)

## Core Specifications

### Fixed vs Variable Schedule Selection

**Fixed Ratio (FR)**: Reward after N actions
```
FR-1:  Every action (collection games)
FR-5:  Every 5 actions (level completion)
FR-10: Every 10 actions (milestone achievements)
FR-25: Every 25 actions (major milestones)
```

**Fixed Interval (FI)**: Reward after N time units
```
FI-1h:   Every hour (energy refill)
FI-4h:   Every 4 hours (free chest)
FI-24h:  Daily reward
FI-168h: Weekly reward (7 days)
```

**Variable Ratio (VR)**: Average reward after N actions
```
Use when: Engagement is primary goal
See: dopamine-optimizer skill for VR implementation
```

**Schedule Selection Matrix**:
| Goal | Schedule | Ratio/Interval |
|------|----------|----------------|
| Teach mechanic | FR-1 | Every action |
| Maintain engagement | FR-3 to FR-5 | Regular reinforcement |
| Create milestones | FR-10 to FR-25 | Achievement points |
| Drive sessions | FI-4h to FI-8h | Energy/resource systems |
| Create habits | FI-24h | Daily rewards |
| Long-term goals | FI-168h to FI-720h | Weekly/monthly |

### Reward Magnitude Calibration

**Base Value Calculation**:
```
Base Reward = (Player Level × Level Multiplier) + Flat Bonus

Level Multiplier by stage:
- Early game (1-10): 1.0
- Mid game (11-30): 0.8
- Late game (31+): 0.6

Flat Bonus: Starting currency ÷ 10
```

**Magnitude Tiers**:
| Tier | Value Range | Frequency | Example |
|------|-------------|-----------|---------|
| Micro | 1-10% of session earnings | Every 30s-2min | Coin pickup |
| Small | 10-25% of session earnings | Every 2-5min | Level clear bonus |
| Medium | 25-50% of session earnings | Every 10-20min | Achievement |
| Large | 50-100% of session earnings | Every 30-60min | Quest completion |
| Major | 100-200% of session earnings | Every 2-4 hours | Milestone |
| Jackpot | 500%+ of session earnings | Daily or less | Special event |

**Relative Value Guidelines**:
```
Daily reward total = 80-120% of average daily earnings
Weekly reward = 5-7x daily reward
Monthly reward = 20-25x daily reward
Event reward = 3-5x normal equivalent activity
```

### Daily Reward Cadence

**Standard Daily Structure**:
| Time | Reward Type | Value | Trigger |
|------|-------------|-------|---------|
| Login | Login bonus | 100 coins | Automatic on first session |
| First win | First victory bonus | 150 coins | Complete first match/level |
| Quests | Daily quest completion (x3) | 50 each | Manual claim |
| Activity | Play time bonus | 25/15min | Every 15 min (cap at 4) |
| Lucky | Random lucky drop | Variable | 10% chance per session |
| **Total** | | 450-550 coins | |

**Daily Quest Design**:
```
Total daily quests: 3-5
Completion time target: 15-30 minutes total
Quest difficulty distribution:
- Easy (5 min): 40%
- Medium (10 min): 40%
- Hard (15 min): 20%

Quest refresh: Midnight local time
Reroll option: 1 free, additional cost soft currency
```

**Daily Bonus Cap**:
```
Maximum daily soft currency: 3x average session earnings
Maximum daily hard currency (free): 10-25 gems
Maximum daily premium items: 1-2 (low tier only)
Diminishing returns after: 90 minutes play time
```

### Weekly Reward Cadence

**Weekly Quest Structure**:
| Quest Type | Requirement | Reward | Notes |
|------------|-------------|--------|-------|
| Cumulative | "Win 20 matches" | 500 coins | Progress carries over |
| Streak | "Login 5 days" | 200 gems | Resets if missed |
| Challenge | "Score 100k points" | Rare item | Skill-based |
| Social | "Play with friend" | 100 coins | Low barrier |
| Collection | "Earn 3 daily chests" | Epic chest | Engagement driver |

**Weekly Reset Schedule**:
```
Reset day: Monday 00:00 UTC (convert to local)
Preview period: 24 hours before reset
Last chance reminder: 4 hours before reset
Grace period: None (creates urgency)
```

**Weekly Reward Pacing**:
```
Day 1-2: Focus on easy daily quests
Day 3-4: Medium weekly progress check
Day 5-6: Push for weekly completion
Day 7: Catch-up day for stragglers

Weekly completion target: 70% of active players
```

### Monthly Reward Cadence

**Monthly Calendar System**:
```
Days 1-7:   Tier 1 rewards (common)
Days 8-14:  Tier 2 rewards (uncommon)
Days 15-21: Tier 3 rewards (rare)
Days 22-28: Tier 4 rewards (epic)
Days 29-31: Bonus days (if applicable)

Cumulative milestone rewards:
- 7 days logged: Bronze badge + 200 coins
- 14 days logged: Silver badge + 500 coins + 50 gems
- 21 days logged: Gold badge + 1000 coins + 100 gems
- 28 days logged: Platinum badge + exclusive item
```

**Battle Pass Integration**:
| Component | Free Track | Premium Track |
|-----------|------------|---------------|
| Total tiers | 30-50 | 30-50 |
| Tier duration | 1-2 days per tier | Same |
| Total duration | 30-60 days | Same |
| Final reward | Epic item | Legendary item |
| Total value | 50% of premium price | 300-500% of price |

**Seasonal Event Schedule**:
```
Major events per year: 4-6 (align with seasons)
Event duration: 14-28 days
Event currency: Separate, expires after event
Event exclusive content: 30-40% unique items
Returning content: Previous event items at premium

Event reward distribution:
- Participation: 20% (just logging in)
- Engagement: 50% (playing regularly)
- Mastery: 30% (completing all challenges)
```

### Achievement Unlock Pacing

**Achievement Category Distribution**:
| Category | % of Total | Unlock Rate |
|----------|------------|-------------|
| Tutorial/Basic | 15% | Session 1 |
| Progression | 30% | 1-2 per session |
| Skill-based | 25% | 1 per 3-5 sessions |
| Collection | 15% | Ongoing (months) |
| Secret/Hidden | 10% | Discovery-based |
| Social | 5% | Variable |

**Achievement Reward Scaling**:
```
Tier 1 (Common):     10-50 coins or 1-5 gems
Tier 2 (Uncommon):   50-200 coins or 5-15 gems
Tier 3 (Rare):       200-500 coins or 15-30 gems
Tier 4 (Epic):       500-1500 coins or 30-75 gems
Tier 5 (Legendary):  1500+ coins or 75-150 gems + exclusive

Total achievement count by game stage:
- Launch: 50-100 achievements
- Year 1: 150-250 achievements
- Mature: 300-500 achievements
```

**Achievement Unlock Curve**:
```
First session: 5-8 achievements (tutorial + early wins)
First week: 15-25 achievements
First month: 40-60 achievements
First quarter: 80-120 achievements
First year: 150-200 achievements (50-60% of total)
Completion: Never (always add new achievements)
```

**Hidden Achievement Design**:
```
Hint level: None (true secret) OR cryptic clue
Unlock notification: Surprise popup with fanfare
Percentage of hidden: 5-15% of total achievements
Discovery methods:
- Exploration (find hidden area)
- Experimentation (unusual action)
- Persistence (extreme repetition)
- Easter egg (reference/joke)
```

### Loot and Drop Rate Design

**Rarity Distribution Standards**:
| Rarity | Drop Rate | Pity Threshold | Color Code |
|--------|-----------|----------------|------------|
| Common | 60-70% | N/A | Gray/White |
| Uncommon | 20-25% | N/A | Green |
| Rare | 8-12% | 15 attempts | Blue |
| Epic | 3-5% | 30 attempts | Purple |
| Legendary | 0.5-1% | 75 attempts | Gold/Orange |
| Mythic | 0.05-0.1% | 150 attempts | Red/Rainbow |

**Drop Rate Disclosure Requirements** (Apple):
```
ALL loot box/gacha odds must be disclosed PRIOR to purchase

Required information:
- Individual item drop rates (not just rarity tiers)
- Pity system mechanics (if applicable)
- Rate-up/featured item probabilities
- Regional variations (if any)

Format: Accessible from purchase screen
Update: Within 24 hours of any change
```

**Duplicate Handling**:
```
Option 1: Convert to currency
- Common duplicate: 10 coins
- Rare duplicate: 50 coins
- Epic duplicate: 200 coins
- Legendary duplicate: 1000 coins OR upgrade material

Option 2: Upgrade system
- 3 commons = 1 uncommon
- 3 uncommons = 1 rare
- 5 rares = 1 epic
- 10 epics = 1 legendary

Option 3: Pity tokens
- Each duplicate adds to separate pity counter
- Counter guarantees choice selection
```

### Reward Anticipation UI Patterns

**Countdown Timer Design**:
```
Format by duration:
- < 1 hour: MM:SS (countdown feels fast)
- 1-24 hours: HH:MM (manageable wait)
- > 24 hours: X days Y hours (distant but trackable)

Visual treatment:
- Final 10 minutes: Pulsing animation
- Final 1 minute: Color change (orange/red)
- Available: Bouncing/glowing "CLAIM" button
```

**Progress Bar Design**:
```
Visual milestones: Every 25% (4 markers)
Reward preview: Show at each milestone
Animation: Smooth fill, slight overshoot on completion
Sound: Tick at milestones, fanfare at 100%

Progress display:
"23/50 enemies defeated" (specific)
NOT: "46%" (abstract)
```

**Reward Preview Pattern**:
```
Before unlock:
- Silhouette or blurred image
- Rarity indicator visible
- "?" on item name
- Stats hidden

On unlock:
- 1-2 second anticipation pause
- Rarity flash effect
- Item reveal animation
- Stats appear with delay (500ms)
- Celebration particles
```

### Reward Schedule Mathematics

**Expected Value Calculation**:
```swift
// For variable reward systems
func expectedValue(rewards: [(probability: Double, value: Int)]) -> Double {
    return rewards.reduce(0) { $0 + ($1.probability * Double($1.value)) }
}

// Example loot box
let lootBox = [
    (probability: 0.60, value: 100),   // Common: 60 coins
    (probability: 0.25, value: 250),   // Uncommon: 250 coins equivalent
    (probability: 0.10, value: 500),   // Rare: 500 coins equivalent
    (probability: 0.04, value: 1500),  // Epic: 1500 coins equivalent
    (probability: 0.01, value: 5000)   // Legendary: 5000 coins equivalent
]
// EV = 60 + 62.5 + 50 + 60 + 50 = 282.5 coins
```

**Time-to-Unlock Estimation**:
```
Target unlock time = Desired playtime to unlock / Average session length

Example: Epic item should take 10 hours to unlock
- Average session: 15 minutes
- Sessions needed: 40
- At 2 sessions/day: 20 days
- Drop rate needed: 1/40 = 2.5% per session
```

**Inflation Prevention Formula**:
```
Weekly currency cap = (Daily earnings × 7) × 1.2
Monthly soft currency: Don't exceed 50x daily
Hard currency monthly free: 500-1000 (limits IAP devaluation)

If player accumulates > 30 days of currency:
- Introduce new sink
- Create limited-time exclusive
- Add prestige system
```

### Ethical Considerations and Disclosure

**Required Disclosures**:
| Element | Requirement | Where to Display |
|---------|-------------|------------------|
| Loot box odds | All individual rates | Pre-purchase screen |
| Pity mechanics | How they work | Info button on purchase |
| Premium currency value | Real money equivalent | Store page |
| Limited time | Actual end date/time | Offer UI |
| Regional restrictions | If odds vary by region | Settings/Legal |

**Ethical Guidelines**:
```
1. No manipulated odds (rates shown = rates actual)
2. No "pay to progress faster" disguised as "pay to win"
3. No targeting based on spending behavior
4. No fake scarcity (if "limited," truly limited)
5. Spending limits for minors (where required)
6. Clear distinction: Premium vs free content
7. No dark patterns in reward claim flows
```

**Age-Gating Requirements**:
```
Minors (under 18):
- Spending caps: $50/week in some regions
- Parental controls: Required accessibility
- Loot box restrictions: Banned in Belgium, Netherlands
- Age verification: Required for monetized random rewards

Implementation:
- Check device parental controls
- Respect Screen Time limits
- Provide in-game parental PIN option
```

## Implementation Patterns

### Reward Schedule Manager

```swift
import Foundation

final class RewardScheduleManager {

    enum ScheduleType {
        case fixedRatio(actions: Int)
        case fixedInterval(seconds: TimeInterval)
        case daily
        case weekly
        case monthly
    }

    struct ScheduledReward {
        let id: String
        let scheduleType: ScheduleType
        let reward: Reward
        let isActive: Bool
        let nextAvailable: Date?
        let progress: Double?
    }

    struct Reward {
        let softCurrency: Int
        let hardCurrency: Int
        let items: [String]
        let experiencePoints: Int
    }

    private var schedules: [String: ScheduleState] = [:]

    struct ScheduleState: Codable {
        var actionsCompleted: Int
        var lastClaimed: Date?
        var totalClaimed: Int
    }

    init() {
        loadState()
    }

    // MARK: - Fixed Ratio Rewards

    func recordAction(for scheduleId: String) {
        guard var state = schedules[scheduleId] else { return }
        state.actionsCompleted += 1
        schedules[scheduleId] = state
        saveState()
    }

    func checkFixedRatio(scheduleId: String, requiredActions: Int) -> Bool {
        guard let state = schedules[scheduleId] else { return false }
        return state.actionsCompleted >= requiredActions
    }

    func claimFixedRatio(scheduleId: String) {
        guard var state = schedules[scheduleId] else { return }
        state.actionsCompleted = 0
        state.lastClaimed = Date()
        state.totalClaimed += 1
        schedules[scheduleId] = state
        saveState()
    }

    func getFixedRatioProgress(scheduleId: String, required: Int) -> Double {
        guard let state = schedules[scheduleId] else { return 0 }
        return min(Double(state.actionsCompleted) / Double(required), 1.0)
    }

    // MARK: - Fixed Interval Rewards

    func checkFixedInterval(scheduleId: String, intervalSeconds: TimeInterval) -> Bool {
        guard let state = schedules[scheduleId],
              let lastClaimed = state.lastClaimed else {
            return true // Never claimed, available
        }
        return Date().timeIntervalSince(lastClaimed) >= intervalSeconds
    }

    func claimFixedInterval(scheduleId: String) {
        var state = schedules[scheduleId] ?? ScheduleState(
            actionsCompleted: 0,
            lastClaimed: nil,
            totalClaimed: 0
        )
        state.lastClaimed = Date()
        state.totalClaimed += 1
        schedules[scheduleId] = state
        saveState()
    }

    func getTimeUntilAvailable(scheduleId: String, intervalSeconds: TimeInterval) -> TimeInterval {
        guard let state = schedules[scheduleId],
              let lastClaimed = state.lastClaimed else {
            return 0 // Available now
        }
        let elapsed = Date().timeIntervalSince(lastClaimed)
        return max(0, intervalSeconds - elapsed)
    }

    // MARK: - Daily Rewards

    func checkDailyReward(scheduleId: String) -> Bool {
        guard let state = schedules[scheduleId],
              let lastClaimed = state.lastClaimed else {
            return true
        }
        return !Calendar.current.isDateInToday(lastClaimed)
    }

    func claimDailyReward(scheduleId: String) {
        claimFixedInterval(scheduleId: scheduleId)
    }

    // MARK: - Weekly Rewards

    func checkWeeklyReward(scheduleId: String) -> Bool {
        guard let state = schedules[scheduleId],
              let lastClaimed = state.lastClaimed else {
            return true
        }
        return !Calendar.current.isDate(lastClaimed, equalTo: Date(), toGranularity: .weekOfYear)
    }

    func getWeeklyProgress(scheduleId: String, weeklyGoal: Int) -> (current: Int, goal: Int) {
        guard let state = schedules[scheduleId] else {
            return (0, weeklyGoal)
        }
        return (state.actionsCompleted, weeklyGoal)
    }

    // MARK: - State Management

    private func loadState() {
        if let data = UserDefaults.standard.data(forKey: "rewardSchedules"),
           let decoded = try? JSONDecoder().decode([String: ScheduleState].self, from: data) {
            schedules = decoded
        }
    }

    private func saveState() {
        if let encoded = try? JSONEncoder().encode(schedules) {
            UserDefaults.standard.set(encoded, forKey: "rewardSchedules")
        }
    }

    func registerSchedule(_ scheduleId: String) {
        if schedules[scheduleId] == nil {
            schedules[scheduleId] = ScheduleState(
                actionsCompleted: 0,
                lastClaimed: nil,
                totalClaimed: 0
            )
            saveState()
        }
    }
}
```

### Achievement System

```swift
import Foundation
import Combine

final class AchievementSystem: ObservableObject {

    struct Achievement: Codable, Identifiable {
        let id: String
        let name: String
        let description: String
        let category: Category
        let tier: Tier
        let requirement: Requirement
        let reward: AchievementReward
        let isHidden: Bool

        var isUnlocked: Bool = false
        var progress: Int = 0
        var unlockDate: Date?

        enum Category: String, Codable {
            case tutorial, progression, skill, collection, secret, social
        }

        enum Tier: Int, Codable {
            case common = 1, uncommon = 2, rare = 3, epic = 4, legendary = 5
        }

        struct Requirement: Codable {
            let type: RequirementType
            let target: Int

            enum RequirementType: String, Codable {
                case levelReached
                case enemiesDefeated
                case itemsCollected
                case gamesPlayed
                case gamesWon
                case scoreReached
                case streakDays
                case friendsAdded
                case secretAction
            }
        }

        struct AchievementReward: Codable {
            let softCurrency: Int
            let hardCurrency: Int
            let experiencePoints: Int
            let items: [String]
        }
    }

    @Published var achievements: [Achievement] = []
    @Published var recentUnlock: Achievement?

    private var progressTracking: [String: Int] = [:]

    init() {
        loadAchievements()
        loadProgress()
    }

    func updateProgress(type: Achievement.Requirement.RequirementType, value: Int) {
        let key = type.rawValue
        progressTracking[key] = (progressTracking[key] ?? 0) + value

        checkUnlocks(for: type)
        saveProgress()
    }

    func setProgress(type: Achievement.Requirement.RequirementType, value: Int) {
        let key = type.rawValue
        progressTracking[key] = value

        checkUnlocks(for: type)
        saveProgress()
    }

    private func checkUnlocks(for type: Achievement.Requirement.RequirementType) {
        let currentValue = progressTracking[type.rawValue] ?? 0

        for (index, achievement) in achievements.enumerated() {
            guard !achievement.isUnlocked,
                  achievement.requirement.type == type else { continue }

            achievements[index].progress = min(currentValue, achievement.requirement.target)

            if currentValue >= achievement.requirement.target {
                unlockAchievement(at: index)
            }
        }
    }

    private func unlockAchievement(at index: Int) {
        achievements[index].isUnlocked = true
        achievements[index].unlockDate = Date()
        recentUnlock = achievements[index]

        // Grant reward
        let reward = achievements[index].reward
        grantReward(reward)

        saveAchievements()

        // Analytics
        trackAchievementUnlock(achievements[index])
    }

    private func grantReward(_ reward: Achievement.AchievementReward) {
        // Implementation would interact with economy system
        print("Granting: \(reward.softCurrency) coins, \(reward.hardCurrency) gems")
    }

    private func trackAchievementUnlock(_ achievement: Achievement) {
        // Analytics implementation
        print("Achievement unlocked: \(achievement.name)")
    }

    func getUnlockedCount() -> Int {
        return achievements.filter { $0.isUnlocked }.count
    }

    func getProgress(for category: Achievement.Category) -> (unlocked: Int, total: Int) {
        let categoryAchievements = achievements.filter { $0.category == category }
        let unlocked = categoryAchievements.filter { $0.isUnlocked }.count
        return (unlocked, categoryAchievements.count)
    }

    func getVisibleAchievements() -> [Achievement] {
        return achievements.filter { !$0.isHidden || $0.isUnlocked }
    }

    // MARK: - Persistence

    private func loadAchievements() {
        // Load from bundled JSON or create defaults
        achievements = createDefaultAchievements()

        // Merge with saved unlock state
        if let data = UserDefaults.standard.data(forKey: "achievementState"),
           let saved = try? JSONDecoder().decode([Achievement].self, from: data) {
            for savedAchievement in saved {
                if let index = achievements.firstIndex(where: { $0.id == savedAchievement.id }) {
                    achievements[index].isUnlocked = savedAchievement.isUnlocked
                    achievements[index].progress = savedAchievement.progress
                    achievements[index].unlockDate = savedAchievement.unlockDate
                }
            }
        }
    }

    private func saveAchievements() {
        if let encoded = try? JSONEncoder().encode(achievements) {
            UserDefaults.standard.set(encoded, forKey: "achievementState")
        }
    }

    private func loadProgress() {
        if let data = UserDefaults.standard.data(forKey: "achievementProgress"),
           let decoded = try? JSONDecoder().decode([String: Int].self, from: data) {
            progressTracking = decoded
        }
    }

    private func saveProgress() {
        if let encoded = try? JSONEncoder().encode(progressTracking) {
            UserDefaults.standard.set(encoded, forKey: "achievementProgress")
        }
    }

    private func createDefaultAchievements() -> [Achievement] {
        return [
            // Tutorial achievements
            Achievement(
                id: "first_game",
                name: "First Steps",
                description: "Complete your first game",
                category: .tutorial,
                tier: .common,
                requirement: .init(type: .gamesPlayed, target: 1),
                reward: .init(softCurrency: 50, hardCurrency: 5, experiencePoints: 100, items: []),
                isHidden: false
            ),
            // Progression achievements
            Achievement(
                id: "level_10",
                name: "Rising Star",
                description: "Reach level 10",
                category: .progression,
                tier: .uncommon,
                requirement: .init(type: .levelReached, target: 10),
                reward: .init(softCurrency: 200, hardCurrency: 20, experiencePoints: 500, items: []),
                isHidden: false
            ),
            // Skill achievements
            Achievement(
                id: "score_100k",
                name: "High Scorer",
                description: "Score 100,000 points in a single game",
                category: .skill,
                tier: .rare,
                requirement: .init(type: .scoreReached, target: 100000),
                reward: .init(softCurrency: 500, hardCurrency: 50, experiencePoints: 1000, items: ["badge_scorer"]),
                isHidden: false
            ),
            // Secret achievement
            Achievement(
                id: "secret_easter_egg",
                name: "???",
                description: "???",
                category: .secret,
                tier: .legendary,
                requirement: .init(type: .secretAction, target: 1),
                reward: .init(softCurrency: 1000, hardCurrency: 100, experiencePoints: 2000, items: ["secret_skin"]),
                isHidden: true
            )
        ]
    }
}
```

### Loot Table System

```swift
import Foundation

final class LootTableSystem {

    struct LootTable: Codable {
        let id: String
        let entries: [LootEntry]
        let guaranteedDrops: [String]
        let pityConfig: PityConfig?
    }

    struct LootEntry: Codable {
        let itemId: String
        let rarity: Rarity
        let weight: Double
        let maxPerDrop: Int

        enum Rarity: String, Codable, CaseIterable {
            case common, uncommon, rare, epic, legendary, mythic

            var color: String {
                switch self {
                case .common: return "#FFFFFF"
                case .uncommon: return "#1EFF00"
                case .rare: return "#0070DD"
                case .epic: return "#A335EE"
                case .legendary: return "#FF8000"
                case .mythic: return "#E6CC80"
                }
            }
        }
    }

    struct PityConfig: Codable {
        let rarity: LootEntry.Rarity
        let softPityStart: Int
        let hardPity: Int
        let incrementPerAttempt: Double
    }

    struct DropResult {
        let items: [DroppedItem]
        let pityProgress: Int?
        let wasGuaranteed: Bool
    }

    struct DroppedItem {
        let itemId: String
        let rarity: LootEntry.Rarity
        let quantity: Int
    }

    private var lootTables: [String: LootTable] = [:]
    private var pityCounters: [String: Int] = [:]

    init() {
        loadPityCounters()
    }

    func registerTable(_ table: LootTable) {
        lootTables[table.id] = table
    }

    func roll(tableId: String, count: Int = 1) -> DropResult {
        guard let table = lootTables[tableId] else {
            return DropResult(items: [], pityProgress: nil, wasGuaranteed: false)
        }

        var items: [DroppedItem] = []
        var wasGuaranteed = false

        // Add guaranteed drops
        for itemId in table.guaranteedDrops {
            if let entry = table.entries.first(where: { $0.itemId == itemId }) {
                items.append(DroppedItem(itemId: itemId, rarity: entry.rarity, quantity: 1))
            }
        }

        // Roll for random drops
        for _ in 0..<count {
            let (item, guaranteed) = rollSingle(table: table)
            if let item = item {
                items.append(item)
                if guaranteed { wasGuaranteed = true }
            }
        }

        let pityProgress = table.pityConfig != nil ? pityCounters[tableId] : nil

        return DropResult(items: items, pityProgress: pityProgress, wasGuaranteed: wasGuaranteed)
    }

    private func rollSingle(table: LootTable) -> (DroppedItem?, Bool) {
        let tableId = table.id
        var wasGuaranteed = false

        // Check pity
        if let pity = table.pityConfig {
            let currentPity = pityCounters[tableId] ?? 0

            if currentPity >= pity.hardPity - 1 {
                // Hard pity triggered
                if let entry = table.entries.first(where: { $0.rarity == pity.rarity }) {
                    pityCounters[tableId] = 0
                    savePityCounters()
                    return (DroppedItem(itemId: entry.itemId, rarity: entry.rarity, quantity: 1), true)
                }
            }
        }

        // Calculate total weight with pity adjustment
        var adjustedEntries = table.entries
        if let pity = table.pityConfig {
            let currentPity = pityCounters[tableId] ?? 0
            if currentPity >= pity.softPityStart {
                // Boost rates for pity rarity
                adjustedEntries = table.entries.map { entry in
                    if entry.rarity == pity.rarity {
                        let boost = Double(currentPity - pity.softPityStart) * pity.incrementPerAttempt
                        return LootEntry(
                            itemId: entry.itemId,
                            rarity: entry.rarity,
                            weight: entry.weight * (1 + boost),
                            maxPerDrop: entry.maxPerDrop
                        )
                    }
                    return entry
                }
            }
        }

        let totalWeight = adjustedEntries.reduce(0) { $0 + $1.weight }
        let roll = Double.random(in: 0..<totalWeight)

        var cumulative: Double = 0
        for entry in adjustedEntries {
            cumulative += entry.weight
            if roll < cumulative {
                // Check if this breaks pity
                if let pity = table.pityConfig, entry.rarity == pity.rarity {
                    pityCounters[tableId] = 0
                } else {
                    pityCounters[tableId] = (pityCounters[tableId] ?? 0) + 1
                }
                savePityCounters()

                let quantity = Int.random(in: 1...entry.maxPerDrop)
                return (DroppedItem(itemId: entry.itemId, rarity: entry.rarity, quantity: quantity), wasGuaranteed)
            }
        }

        return (nil, false)
    }

    // MARK: - Disclosure (Apple Requirement)

    func generateOddsDisclosure(tableId: String) -> String {
        guard let table = lootTables[tableId] else { return "Table not found" }

        var disclosure = "Drop Rates for \(tableId):\n\n"

        let totalWeight = table.entries.reduce(0) { $0 + $1.weight }

        let byRarity = Dictionary(grouping: table.entries) { $0.rarity }

        for rarity in LootEntry.Rarity.allCases {
            guard let entries = byRarity[rarity] else { continue }

            let rarityWeight = entries.reduce(0) { $0 + $1.weight }
            let rarityPercent = (rarityWeight / totalWeight) * 100

            disclosure += "\(rarity.rawValue.capitalized): \(String(format: "%.2f", rarityPercent))%\n"

            for entry in entries {
                let itemPercent = (entry.weight / totalWeight) * 100
                disclosure += "  - \(entry.itemId): \(String(format: "%.2f", itemPercent))%\n"
            }
            disclosure += "\n"
        }

        if let pity = table.pityConfig {
            disclosure += "Pity System:\n"
            disclosure += "- Boosted rates start at \(pity.softPityStart) attempts\n"
            disclosure += "- Guaranteed \(pity.rarity.rawValue) at \(pity.hardPity) attempts\n"
        }

        return disclosure
    }

    func getPityProgress(tableId: String) -> Int {
        return pityCounters[tableId] ?? 0
    }

    // MARK: - Persistence

    private func loadPityCounters() {
        if let data = UserDefaults.standard.data(forKey: "pityCounters"),
           let decoded = try? JSONDecoder().decode([String: Int].self, from: data) {
            pityCounters = decoded
        }
    }

    private func savePityCounters() {
        if let encoded = try? JSONEncoder().encode(pityCounters) {
            UserDefaults.standard.set(encoded, forKey: "pityCounters")
        }
    }
}
```

### Reward Anticipation UI

```swift
import SwiftUI

struct RewardCountdownView: View {
    let targetDate: Date
    let onAvailable: () -> Void

    @State private var timeRemaining: TimeInterval = 0
    @State private var isAvailable: Bool = false

    private let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(spacing: 8) {
            if isAvailable {
                claimButton
            } else {
                countdownDisplay
            }
        }
        .onReceive(timer) { _ in
            updateTimeRemaining()
        }
        .onAppear {
            updateTimeRemaining()
        }
    }

    private var countdownDisplay: some View {
        VStack(spacing: 4) {
            Text("Next Reward In")
                .font(.caption)
                .foregroundColor(.secondary)

            Text(formattedTime)
                .font(.system(size: 24, weight: .bold, design: .monospaced))
                .foregroundColor(urgencyColor)

            ProgressView(value: progressValue)
                .progressViewStyle(LinearProgressViewStyle(tint: urgencyColor))
        }
    }

    private var claimButton: some View {
        Button(action: onAvailable) {
            Text("CLAIM")
                .font(.headline)
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(Color.green)
                .cornerRadius(8)
        }
        .scaleEffect(isAvailable ? 1.05 : 1.0)
        .animation(
            Animation.easeInOut(duration: 0.5).repeatForever(autoreverses: true),
            value: isAvailable
        )
    }

    private var formattedTime: String {
        if timeRemaining < 3600 { // Less than 1 hour
            let minutes = Int(timeRemaining) / 60
            let seconds = Int(timeRemaining) % 60
            return String(format: "%02d:%02d", minutes, seconds)
        } else if timeRemaining < 86400 { // Less than 24 hours
            let hours = Int(timeRemaining) / 3600
            let minutes = (Int(timeRemaining) % 3600) / 60
            return String(format: "%02d:%02d", hours, minutes)
        } else {
            let days = Int(timeRemaining) / 86400
            let hours = (Int(timeRemaining) % 86400) / 3600
            return "\(days)d \(hours)h"
        }
    }

    private var urgencyColor: Color {
        if timeRemaining < 60 { return .red }
        if timeRemaining < 600 { return .orange }
        return .primary
    }

    private var progressValue: Double {
        // Assuming 24-hour cycle for visualization
        let totalInterval: TimeInterval = 86400
        return max(0, 1 - (timeRemaining / totalInterval))
    }

    private func updateTimeRemaining() {
        timeRemaining = max(0, targetDate.timeIntervalSince(Date()))
        isAvailable = timeRemaining <= 0
    }
}

struct RewardProgressView: View {
    let current: Int
    let target: Int
    let milestones: [Int]
    let rewardPreviews: [Int: String]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("\(current)/\(target)")
                    .font(.headline)
                Spacer()
                Text("\(Int(progressPercent * 100))%")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background track
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.gray.opacity(0.3))
                        .frame(height: 8)

                    // Progress fill
                    RoundedRectangle(cornerRadius: 4)
                        .fill(progressGradient)
                        .frame(width: geometry.size.width * progressPercent, height: 8)

                    // Milestone markers
                    ForEach(milestones, id: \.self) { milestone in
                        let position = Double(milestone) / Double(target)
                        Circle()
                            .fill(current >= milestone ? Color.yellow : Color.gray)
                            .frame(width: 12, height: 12)
                            .offset(x: geometry.size.width * position - 6)
                    }
                }
            }
            .frame(height: 20)

            // Milestone previews
            HStack {
                ForEach(milestones, id: \.self) { milestone in
                    if let preview = rewardPreviews[milestone] {
                        VStack(spacing: 2) {
                            Image(systemName: current >= milestone ? "checkmark.circle.fill" : "gift")
                                .foregroundColor(current >= milestone ? .green : .gray)
                            Text("\(milestone)")
                                .font(.caption2)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
        }
        .padding()
    }

    private var progressPercent: Double {
        return min(Double(current) / Double(target), 1.0)
    }

    private var progressGradient: LinearGradient {
        LinearGradient(
            colors: [.blue, .purple],
            startPoint: .leading,
            endPoint: .trailing
        )
    }
}
```

## Decision Trees

### Schedule Type Selection

```
What behavior are you trying to reinforce?
├── Specific action completion
│   ├── Should feel predictable?
│   │   └── YES: Fixed Ratio (FR)
│   │       └── How many actions per reward?
│   │           ├── Training: FR-1 (every action)
│   │           ├── Engagement: FR-3 to FR-5
│   │           └── Milestone: FR-10 to FR-25
│   └── Should feel surprising?
│       └── YES: Variable Ratio (VR)
│           └── See dopamine-optimizer skill
├── Time-based return
│   └── Fixed Interval (FI)
│       └── What's the target session gap?
│           ├── Multiple daily: FI-4h (energy systems)
│           ├── Once daily: FI-24h (daily rewards)
│           └── Weekly habit: FI-168h (weekly quests)
└── Long-term goal
    └── Use combination
        ├── Fixed milestones for predictability
        ├── Variable bonuses for excitement
        └── Interval resets for fresh starts
```

### Reward Magnitude Decision

```
What is the source of this reward?
├── Free gameplay
│   ├── How rare is the trigger?
│   │   ├── Very common (every 30s)
│   │   │   └── Micro reward (1-10 coins)
│   │   ├── Common (every 2-5 min)
│   │   │   └── Small reward (10-50 coins)
│   │   ├── Uncommon (every 10-20 min)
│   │   │   └── Medium reward (50-200 coins)
│   │   └── Rare (every 30+ min)
│   │       └── Large reward (200+ coins)
├── Daily engagement
│   └── Total daily = 80-120% of session earnings
│       ├── Login: 30% of daily total
│       ├── Quests: 50% of daily total
│       └── Bonus: 20% of daily total
├── Weekly engagement
│   └── Weekly total = 5-7x daily total
├── Paid/Premium
│   └── Premium reward = 3-5x free equivalent
└── Event/Special
    └── Event reward = 2-3x normal equivalent
```

### Drop Rate Calibration

```
What is the item's intended rarity?
├── Common (frequent, low value)
│   └── 60-70% drop rate, no pity needed
├── Uncommon (regular, moderate value)
│   └── 20-25% drop rate, no pity needed
├── Rare (occasional, good value)
│   └── 8-12% drop rate, soft pity at 15
├── Epic (infrequent, high value)
│   └── 3-5% drop rate, hard pity at 30
├── Legendary (rare, very high value)
│   └── 0.5-1% drop rate, hard pity at 75
└── Mythic (extremely rare, maximum value)
    └── 0.05-0.1% drop rate, hard pity at 150

For monetized drops, add:
├── Odds disclosure REQUIRED
├── Pity system RECOMMENDED
└── Regional restrictions CHECK
```

## Quality Checklist

### Schedule Implementation Verification
- [ ] Fixed ratio rewards trigger at exact action count
- [ ] Fixed interval rewards respect cooldown precisely
- [ ] Daily reset happens at midnight in user's local timezone
- [ ] Weekly reset happens at Monday 00:00 UTC
- [ ] Progress persists across app restarts
- [ ] Schedule state syncs with cloud if applicable

### Magnitude Calibration Verification
- [ ] Daily free earnings stay within 3x session target
- [ ] Weekly rewards equal 5-7x daily rewards
- [ ] Monthly rewards equal 20-25x daily rewards
- [ ] Premium rewards provide 3-5x value of price
- [ ] Inflation rate stays below 5% monthly

### Achievement System Verification
- [ ] First session unlocks 5-8 achievements
- [ ] Hidden achievements stay hidden until unlocked
- [ ] Progress tracking persists accurately
- [ ] Rewards grant correctly on unlock
- [ ] Notification appears on unlock
- [ ] Total achievement count appropriate for game stage

### Drop Rate Verification
- [ ] Actual rates match disclosed rates (unit tested)
- [ ] Pity counter increments correctly
- [ ] Soft pity increases rates as specified
- [ ] Hard pity guarantees drop at exact threshold
- [ ] Pity counter resets only on appropriate drop
- [ ] Disclosure text is accurate and accessible

### Ethical Compliance Verification
- [ ] All monetized random odds disclosed before purchase
- [ ] Pity mechanics clearly explained
- [ ] No manipulated or dynamic odds based on spending
- [ ] Regional restrictions implemented (Belgium, Netherlands)
- [ ] Age-gating for monetized random rewards
- [ ] Spending tracking for parental controls

## Anti-Patterns

### Anti-Pattern: Reward Flooding
**Wrong**:
```swift
// NEVER DO THIS: Constant high-value rewards
func onEnemyDefeated() {
    grantReward(coins: 500, gems: 10) // Every enemy
    showCelebration(intensity: .maximum)
    playFanfare()
}
```
**Consequence**: Reward fatigue, economic inflation, devalued progression.

**Correct**:
```swift
func onEnemyDefeated() {
    let baseReward = calculateBaseReward(enemy: enemy)
    let diminishedReward = applyDiminishingReturns(baseReward)

    grantReward(coins: diminishedReward)

    if diminishedReward > threshold {
        showCelebration(intensity: .proportional(diminishedReward))
    }
}
```

### Anti-Pattern: Hidden Odds Changes
**Wrong**:
```swift
// NEVER DO THIS: Adjusting odds without disclosure
func calculateDropRate(player: Player) -> Double {
    if player.recentSpending > 100 {
        return 0.005 // Worse odds for spenders
    } else if player.daysInactive > 7 {
        return 0.02 // Better odds for returning
    }
    return 0.01
}
```
**Consequence**: Violates disclosure requirements, potential legal liability.

**Correct**:
```swift
func calculateDropRate() -> Double {
    return 0.01 // Constant rate as disclosed
}

// Separately handle returning player bonuses
func getReturningPlayerBonus(player: Player) -> Reward {
    if player.daysInactive > 7 {
        return Reward(bonusDrops: 3) // Extra attempts, not rate change
    }
    return Reward()
}
```

### Anti-Pattern: Unpredictable Schedules
**Wrong**:
```swift
// NEVER DO THIS: Random daily reset times
func checkDailyReset() {
    let randomHour = Int.random(in: 0...23)
    if currentHour == randomHour {
        resetDailyRewards()
    }
}
```
**Consequence**: Players can't form habits, frustration from missed rewards.

**Correct**:
```swift
func checkDailyReset() {
    let userMidnight = Calendar.current.startOfDay(for: Date())
    if lastReset < userMidnight {
        resetDailyRewards()
        lastReset = userMidnight
    }
}
```

### Anti-Pattern: Achievement Overload
**Wrong**:
```swift
// NEVER DO THIS: Too many achievements at once
func onTutorialComplete() {
    unlockAchievement("tutorial_complete")
    unlockAchievement("first_game")
    unlockAchievement("first_tap")
    unlockAchievement("first_move")
    unlockAchievement("first_coin")
    // 20 more achievements...

    // Player overwhelmed by notifications
}
```
**Consequence**: Achievement fatigue, meaningless progression.

**Correct**:
```swift
func onTutorialComplete() {
    // Queue achievements with delay
    achievementQueue.add("tutorial_complete", delay: 0)
    achievementQueue.add("first_game", delay: 2.0)

    // Batch related achievements
    let pendingCount = achievementQueue.count
    if pendingCount > 3 {
        showBatchedUnlock(count: pendingCount)
    }
}
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| **dopamine-optimizer** | Variable ratio schedules and pity systems |
| **retention-engineer** | Daily/weekly reward integration |
| **economy-balancer** | Reward values affect economic balance |
| **onboarding-architect** | First session reward pacing |
| **progression-system** | Achievement integration with levels |
| **analytics-integration** | Track reward engagement metrics |
