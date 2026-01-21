# Reward Scheduler - Code Patterns

## RewardScheduleManager

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

    init() { loadState() }

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
        guard let state = schedules[scheduleId], let lastClaimed = state.lastClaimed else { return true }
        return Date().timeIntervalSince(lastClaimed) >= intervalSeconds
    }

    func claimFixedInterval(scheduleId: String) {
        var state = schedules[scheduleId] ?? ScheduleState(actionsCompleted: 0, lastClaimed: nil, totalClaimed: 0)
        state.lastClaimed = Date()
        state.totalClaimed += 1
        schedules[scheduleId] = state
        saveState()
    }

    func getTimeUntilAvailable(scheduleId: String, intervalSeconds: TimeInterval) -> TimeInterval {
        guard let state = schedules[scheduleId], let lastClaimed = state.lastClaimed else { return 0 }
        let elapsed = Date().timeIntervalSince(lastClaimed)
        return max(0, intervalSeconds - elapsed)
    }

    // MARK: - Daily/Weekly Rewards

    func checkDailyReward(scheduleId: String) -> Bool {
        guard let state = schedules[scheduleId], let lastClaimed = state.lastClaimed else { return true }
        return !Calendar.current.isDateInToday(lastClaimed)
    }

    func checkWeeklyReward(scheduleId: String) -> Bool {
        guard let state = schedules[scheduleId], let lastClaimed = state.lastClaimed else { return true }
        return !Calendar.current.isDate(lastClaimed, equalTo: Date(), toGranularity: .weekOfYear)
    }

    // MARK: - State Management

    func registerSchedule(_ scheduleId: String) {
        if schedules[scheduleId] == nil {
            schedules[scheduleId] = ScheduleState(actionsCompleted: 0, lastClaimed: nil, totalClaimed: 0)
            saveState()
        }
    }

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
}
```

## AchievementSystem

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

        enum Category: String, Codable { case tutorial, progression, skill, collection, secret, social }
        enum Tier: Int, Codable { case common = 1, uncommon = 2, rare = 3, epic = 4, legendary = 5 }

        struct Requirement: Codable {
            let type: RequirementType
            let target: Int
            enum RequirementType: String, Codable {
                case levelReached, enemiesDefeated, itemsCollected, gamesPlayed, gamesWon, scoreReached, streakDays, friendsAdded, secretAction
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

    init() { loadAchievements(); loadProgress() }

    func updateProgress(type: Achievement.Requirement.RequirementType, value: Int) {
        let key = type.rawValue
        progressTracking[key] = (progressTracking[key] ?? 0) + value
        checkUnlocks(for: type)
        saveProgress()
    }

    func setProgress(type: Achievement.Requirement.RequirementType, value: Int) {
        progressTracking[type.rawValue] = value
        checkUnlocks(for: type)
        saveProgress()
    }

    private func checkUnlocks(for type: Achievement.Requirement.RequirementType) {
        let currentValue = progressTracking[type.rawValue] ?? 0
        for (index, achievement) in achievements.enumerated() {
            guard !achievement.isUnlocked, achievement.requirement.type == type else { continue }
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
        grantReward(achievements[index].reward)
        saveAchievements()
    }

    private func grantReward(_ reward: Achievement.AchievementReward) {
        print("Granting: \(reward.softCurrency) coins, \(reward.hardCurrency) gems")
    }

    func getUnlockedCount() -> Int { achievements.filter { $0.isUnlocked }.count }

    func getProgress(for category: Achievement.Category) -> (unlocked: Int, total: Int) {
        let categoryAchievements = achievements.filter { $0.category == category }
        return (categoryAchievements.filter { $0.isUnlocked }.count, categoryAchievements.count)
    }

    func getVisibleAchievements() -> [Achievement] { achievements.filter { !$0.isHidden || $0.isUnlocked } }

    private func loadAchievements() {
        achievements = createDefaultAchievements()
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
           let decoded = try? JSONDecoder().decode([String: Int].self, from: data) { progressTracking = decoded }
    }

    private func saveProgress() {
        if let encoded = try? JSONEncoder().encode(progressTracking) {
            UserDefaults.standard.set(encoded, forKey: "achievementProgress")
        }
    }

    private func createDefaultAchievements() -> [Achievement] {
        [
            Achievement(id: "first_game", name: "First Steps", description: "Complete your first game", category: .tutorial, tier: .common, requirement: .init(type: .gamesPlayed, target: 1), reward: .init(softCurrency: 50, hardCurrency: 5, experiencePoints: 100, items: []), isHidden: false),
            Achievement(id: "level_10", name: "Rising Star", description: "Reach level 10", category: .progression, tier: .uncommon, requirement: .init(type: .levelReached, target: 10), reward: .init(softCurrency: 200, hardCurrency: 20, experiencePoints: 500, items: []), isHidden: false),
            Achievement(id: "score_100k", name: "High Scorer", description: "Score 100,000 points in a single game", category: .skill, tier: .rare, requirement: .init(type: .scoreReached, target: 100000), reward: .init(softCurrency: 500, hardCurrency: 50, experiencePoints: 1000, items: ["badge_scorer"]), isHidden: false),
            Achievement(id: "secret_easter_egg", name: "???", description: "???", category: .secret, tier: .legendary, requirement: .init(type: .secretAction, target: 1), reward: .init(softCurrency: 1000, hardCurrency: 100, experiencePoints: 2000, items: ["secret_skin"]), isHidden: true)
        ]
    }
}
```

## LootTableSystem

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
                case .common: return "#FFFFFF"; case .uncommon: return "#1EFF00"; case .rare: return "#0070DD"
                case .epic: return "#A335EE"; case .legendary: return "#FF8000"; case .mythic: return "#E6CC80"
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

    init() { loadPityCounters() }

    func registerTable(_ table: LootTable) { lootTables[table.id] = table }

    func roll(tableId: String, count: Int = 1) -> DropResult {
        guard let table = lootTables[tableId] else {
            return DropResult(items: [], pityProgress: nil, wasGuaranteed: false)
        }

        var items: [DroppedItem] = []
        var wasGuaranteed = false

        for itemId in table.guaranteedDrops {
            if let entry = table.entries.first(where: { $0.itemId == itemId }) {
                items.append(DroppedItem(itemId: itemId, rarity: entry.rarity, quantity: 1))
            }
        }

        for _ in 0..<count {
            let (item, guaranteed) = rollSingle(table: table)
            if let item = item { items.append(item); if guaranteed { wasGuaranteed = true } }
        }

        return DropResult(items: items, pityProgress: table.pityConfig != nil ? pityCounters[tableId] : nil, wasGuaranteed: wasGuaranteed)
    }

    private func rollSingle(table: LootTable) -> (DroppedItem?, Bool) {
        let tableId = table.id

        if let pity = table.pityConfig {
            let currentPity = pityCounters[tableId] ?? 0
            if currentPity >= pity.hardPity - 1 {
                if let entry = table.entries.first(where: { $0.rarity == pity.rarity }) {
                    pityCounters[tableId] = 0; savePityCounters()
                    return (DroppedItem(itemId: entry.itemId, rarity: entry.rarity, quantity: 1), true)
                }
            }
        }

        var adjustedEntries = table.entries
        if let pity = table.pityConfig {
            let currentPity = pityCounters[tableId] ?? 0
            if currentPity >= pity.softPityStart {
                adjustedEntries = table.entries.map { entry in
                    if entry.rarity == pity.rarity {
                        let boost = Double(currentPity - pity.softPityStart) * pity.incrementPerAttempt
                        return LootEntry(itemId: entry.itemId, rarity: entry.rarity, weight: entry.weight * (1 + boost), maxPerDrop: entry.maxPerDrop)
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
                if let pity = table.pityConfig, entry.rarity == pity.rarity {
                    pityCounters[tableId] = 0
                } else {
                    pityCounters[tableId] = (pityCounters[tableId] ?? 0) + 1
                }
                savePityCounters()
                return (DroppedItem(itemId: entry.itemId, rarity: entry.rarity, quantity: Int.random(in: 1...entry.maxPerDrop)), false)
            }
        }
        return (nil, false)
    }

    // MARK: - Apple Disclosure Requirement

    func generateOddsDisclosure(tableId: String) -> String {
        guard let table = lootTables[tableId] else { return "Table not found" }
        var disclosure = "Drop Rates for \(tableId):\n\n"
        let totalWeight = table.entries.reduce(0) { $0 + $1.weight }
        let byRarity = Dictionary(grouping: table.entries) { $0.rarity }

        for rarity in LootEntry.Rarity.allCases {
            guard let entries = byRarity[rarity] else { continue }
            let rarityWeight = entries.reduce(0) { $0 + $1.weight }
            disclosure += "\(rarity.rawValue.capitalized): \(String(format: "%.2f", (rarityWeight / totalWeight) * 100))%\n"
            for entry in entries {
                disclosure += "  - \(entry.itemId): \(String(format: "%.2f", (entry.weight / totalWeight) * 100))%\n"
            }
        }

        if let pity = table.pityConfig {
            disclosure += "\nPity System:\n- Boosted rates start at \(pity.softPityStart) attempts\n- Guaranteed \(pity.rarity.rawValue) at \(pity.hardPity) attempts\n"
        }
        return disclosure
    }

    func getPityProgress(tableId: String) -> Int { pityCounters[tableId] ?? 0 }

    private func loadPityCounters() {
        if let data = UserDefaults.standard.data(forKey: "pityCounters"),
           let decoded = try? JSONDecoder().decode([String: Int].self, from: data) { pityCounters = decoded }
    }

    private func savePityCounters() {
        if let encoded = try? JSONEncoder().encode(pityCounters) {
            UserDefaults.standard.set(encoded, forKey: "pityCounters")
        }
    }
}
```

## RewardCountdownView

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
            if isAvailable { claimButton } else { countdownDisplay }
        }
        .onReceive(timer) { _ in updateTimeRemaining() }
        .onAppear { updateTimeRemaining() }
    }

    private var countdownDisplay: some View {
        VStack(spacing: 4) {
            Text("Next Reward In").font(.caption).foregroundColor(.secondary)
            Text(formattedTime).font(.system(size: 24, weight: .bold, design: .monospaced)).foregroundColor(urgencyColor)
            ProgressView(value: progressValue).progressViewStyle(LinearProgressViewStyle(tint: urgencyColor))
        }
    }

    private var claimButton: some View {
        Button(action: onAvailable) {
            Text("CLAIM").font(.headline).foregroundColor(.white)
                .padding(.horizontal, 24).padding(.vertical, 12)
                .background(Color.green).cornerRadius(8)
        }
        .scaleEffect(isAvailable ? 1.05 : 1.0)
        .animation(Animation.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: isAvailable)
    }

    private var formattedTime: String {
        if timeRemaining < 3600 {
            return String(format: "%02d:%02d", Int(timeRemaining) / 60, Int(timeRemaining) % 60)
        } else if timeRemaining < 86400 {
            return String(format: "%02d:%02d", Int(timeRemaining) / 3600, (Int(timeRemaining) % 3600) / 60)
        } else {
            return "\(Int(timeRemaining) / 86400)d \((Int(timeRemaining) % 86400) / 3600)h"
        }
    }

    private var urgencyColor: Color {
        if timeRemaining < 60 { return .red }
        if timeRemaining < 600 { return .orange }
        return .primary
    }

    private var progressValue: Double { max(0, 1 - (timeRemaining / 86400)) }

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
                Text("\(current)/\(target)").font(.headline)
                Spacer()
                Text("\(Int(progressPercent * 100))%").font(.caption).foregroundColor(.secondary)
            }
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4).fill(Color.gray.opacity(0.3)).frame(height: 8)
                    RoundedRectangle(cornerRadius: 4).fill(progressGradient).frame(width: geometry.size.width * progressPercent, height: 8)
                    ForEach(milestones, id: \.self) { milestone in
                        Circle().fill(current >= milestone ? Color.yellow : Color.gray).frame(width: 12, height: 12)
                            .offset(x: geometry.size.width * (Double(milestone) / Double(target)) - 6)
                    }
                }
            }.frame(height: 20)
        }.padding()
    }

    private var progressPercent: Double { min(Double(current) / Double(target), 1.0) }
    private var progressGradient: LinearGradient { LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing) }
}
```
