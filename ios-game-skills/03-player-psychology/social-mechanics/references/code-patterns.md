# Social Mechanics - Code Patterns

## LeaderboardSystem

```swift
import Foundation

final class LeaderboardSystem {

    enum LeaderboardType {
        case global
        case weekly
        case friends
        case percentile
        case nearby
    }

    struct LeaderboardEntry: Codable, Identifiable {
        let id: String
        let rank: Int
        let playerId: String
        let playerName: String
        let score: Int
        let avatarId: String?
        let isFriend: Bool
        let isCurrentPlayer: Bool
        let lastUpdated: Date
    }

    struct LeaderboardView {
        let type: LeaderboardType
        let entries: [LeaderboardEntry]
        let playerRank: Int
        let playerPercentile: Double
        let totalPlayers: Int
        let neighborsAbove: [LeaderboardEntry]
        let neighborsBelow: [LeaderboardEntry]
    }

    private let maxNeighbors = 5
    private var cachedLeaderboards: [LeaderboardType: [LeaderboardEntry]] = [:]

    func getLeaderboardView(
        type: LeaderboardType,
        playerId: String,
        playerScore: Int,
        friends: [String]
    ) -> LeaderboardView {

        var entries: [LeaderboardEntry]
        var allEntries: [LeaderboardEntry] = cachedLeaderboards[type] ?? []

        switch type {
        case .global:
            entries = Array(allEntries.prefix(100))
        case .weekly:
            entries = Array(allEntries.prefix(100))
        case .friends:
            entries = allEntries.filter { $0.isFriend || $0.playerId == playerId }
        case .percentile:
            entries = getPercentileView(playerId: playerId, all: allEntries)
        case .nearby:
            entries = getNearbyPlayers(playerScore: playerScore, all: allEntries)
        }

        // Find player's position
        let playerRank = (allEntries.firstIndex { $0.playerId == playerId } ?? allEntries.count) + 1
        let percentile = calculatePercentile(rank: playerRank, total: allEntries.count)

        // Get neighbors
        let playerIndex = playerRank - 1
        let neighborsAbove = getNeighbors(
            around: playerIndex,
            direction: .above,
            from: allEntries,
            count: maxNeighbors
        )
        let neighborsBelow = getNeighbors(
            around: playerIndex,
            direction: .below,
            from: allEntries,
            count: maxNeighbors
        )

        return LeaderboardView(
            type: type,
            entries: entries,
            playerRank: playerRank,
            playerPercentile: percentile,
            totalPlayers: allEntries.count,
            neighborsAbove: neighborsAbove,
            neighborsBelow: neighborsBelow
        )
    }

    func submitScore(playerId: String, score: Int) {
        // Would submit to backend
        // Update cached leaderboards
    }

    func formatRank(rank: Int, total: Int) -> String {
        let percentile = calculatePercentile(rank: rank, total: total)

        if percentile <= 1 {
            return "Top 1%"
        } else if percentile <= 5 {
            return "Top 5%"
        } else if percentile <= 10 {
            return "Top 10%"
        } else if percentile <= 25 {
            return "Top 25%"
        } else if percentile <= 50 {
            return "Top 50%"
        } else if total > 10000 {
            // For large pools, show percentile
            return "Top \(Int(percentile))%"
        } else {
            // For smaller pools, show rank
            return "#\(rank)"
        }
    }

    private func calculatePercentile(rank: Int, total: Int) -> Double {
        guard total > 0 else { return 100 }
        return (Double(rank) / Double(total)) * 100
    }

    private func getPercentileView(
        playerId: String,
        all: [LeaderboardEntry]
    ) -> [LeaderboardEntry] {
        // Show player centered with neighbors
        guard let playerIndex = all.firstIndex(where: { $0.playerId == playerId }) else {
            return Array(all.prefix(11))
        }

        let start = max(0, playerIndex - 5)
        let end = min(all.count, playerIndex + 6)
        return Array(all[start..<end])
    }

    private func getNearbyPlayers(
        playerScore: Int,
        all: [LeaderboardEntry]
    ) -> [LeaderboardEntry] {
        // Find players within 20% of player's score
        let lowerBound = Int(Double(playerScore) * 0.8)
        let upperBound = Int(Double(playerScore) * 1.2)

        return all.filter { $0.score >= lowerBound && $0.score <= upperBound }
            .prefix(20)
            .map { $0 }
    }

    private enum Direction {
        case above, below
    }

    private func getNeighbors(
        around index: Int,
        direction: Direction,
        from entries: [LeaderboardEntry],
        count: Int
    ) -> [LeaderboardEntry] {
        switch direction {
        case .above:
            let start = max(0, index - count)
            let end = index
            return Array(entries[start..<end])
        case .below:
            let start = min(entries.count, index + 1)
            let end = min(entries.count, index + 1 + count)
            guard start < end else { return [] }
            return Array(entries[start..<end])
        }
    }
}
```

## SocialProofManager

```swift
import Foundation
import Combine

final class SocialProofManager: ObservableObject {

    struct ActivityIndicator {
        let playersOnline: Int
        let friendsOnline: Int
        let recentActivity: [FriendActivity]
    }

    struct FriendActivity: Identifiable {
        let id: UUID
        let friendId: String
        let friendName: String
        let activityType: ActivityType
        let timestamp: Date
        let details: String

        enum ActivityType {
            case levelComplete
            case achievementUnlock
            case scoreBeaten
            case returnedToGame
            case purchasedItem
        }
    }

    struct PopularItem: Identifiable {
        let id: String
        let name: String
        let purchaseCount: Int
        let trend: Trend

        enum Trend {
            case rising, stable, falling
        }
    }

    @Published var currentOnline: Int = 0
    @Published var recentFriendActivity: [FriendActivity] = []
    @Published var popularItems: [PopularItem] = []

    private let minimumDisplayThreshold = 100
    private let updateInterval: TimeInterval = 300 // 5 minutes
    private var cancellables = Set<AnyCancellable>()

    init() {
        startPeriodicUpdates()
    }

    func getDisplayableOnlineCount() -> String? {
        guard currentOnline >= minimumDisplayThreshold else {
            return nil // Don't show embarrassingly low numbers
        }

        if currentOnline < 1000 {
            return "\(currentOnline) playing now"
        } else if currentOnline < 10000 {
            let thousands = Double(currentOnline) / 1000.0
            return String(format: "%.1fK playing now", thousands)
        } else {
            let thousands = currentOnline / 1000
            return "\(thousands)K+ playing now"
        }
    }

    func recordFriendActivity(_ activity: FriendActivity) {
        // Filter notifications
        guard shouldShowActivity(activity) else { return }

        recentFriendActivity.insert(activity, at: 0)

        // Keep only recent activities (last 24 hours)
        let cutoff = Date().addingTimeInterval(-86400)
        recentFriendActivity = recentFriendActivity.filter { $0.timestamp > cutoff }

        // Limit to 10 most recent
        if recentFriendActivity.count > 10 {
            recentFriendActivity = Array(recentFriendActivity.prefix(10))
        }
    }

    func getActivityMessage(for activity: FriendActivity) -> String {
        switch activity.activityType {
        case .levelComplete:
            return "\(activity.friendName) just beat \(activity.details)!"
        case .achievementUnlock:
            return "\(activity.friendName) unlocked \(activity.details)"
        case .scoreBeaten:
            return "\(activity.friendName) beat your high score!"
        case .returnedToGame:
            return "\(activity.friendName) is back after \(activity.details)"
        case .purchasedItem:
            return "\(activity.friendName) just got \(activity.details)"
        }
    }

    func getRarityBadge(achievementPercentage: Double) -> String {
        if achievementPercentage <= 1 {
            return "Ultra Rare (Top 1%)"
        } else if achievementPercentage <= 5 {
            return "Very Rare (Top 5%)"
        } else if achievementPercentage <= 10 {
            return "Rare (Top 10%)"
        } else if achievementPercentage <= 25 {
            return "Uncommon (Top 25%)"
        } else {
            return "Common"
        }
    }

    private func shouldShowActivity(_ activity: FriendActivity) -> Bool {
        // Don't spam with too many notifications
        let recentFromSameFriend = recentFriendActivity.filter {
            $0.friendId == activity.friendId &&
            $0.timestamp > Date().addingTimeInterval(-3600) // Last hour
        }
        return recentFromSameFriend.count < 2
    }

    private func startPeriodicUpdates() {
        Timer.publish(every: updateInterval, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.fetchUpdates()
            }
            .store(in: &cancellables)
    }

    private func fetchUpdates() {
        // Would fetch from backend
        // Update currentOnline, popularItems, etc.
    }
}
```

## GuildSystem

```swift
import Foundation
import Combine

final class GuildSystem: ObservableObject {

    struct Guild: Codable, Identifiable {
        let id: String
        var name: String
        var description: String
        var emblemId: String
        var level: Int
        var experience: Int
        var memberCount: Int
        var maxMembers: Int
        var isPublic: Bool
        var createdDate: Date
        var members: [GuildMember]
        var settings: GuildSettings
    }

    struct GuildMember: Codable, Identifiable {
        let id: String
        let playerId: String
        let playerName: String
        let avatarId: String?
        var role: GuildRole
        var joinDate: Date
        var lastActive: Date
        var weeklyContribution: Int
        var totalContribution: Int
    }

    enum GuildRole: String, Codable, CaseIterable {
        case leader
        case officer
        case elder
        case member

        var permissions: Set<GuildPermission> {
            switch self {
            case .leader:
                return Set(GuildPermission.allCases)
            case .officer:
                return [.acceptMembers, .rejectMembers, .kickMembers,
                        .promoteToElder, .startEvents, .postAnnouncements]
            case .elder:
                return [.acceptMembers, .moderateChat]
            case .member:
                return []
            }
        }
    }

    enum GuildPermission: String, Codable, CaseIterable {
        case acceptMembers
        case rejectMembers
        case kickMembers
        case promoteToElder
        case promoteToOfficer
        case demoteMembers
        case startEvents
        case postAnnouncements
        case moderateChat
        case editSettings
        case disbandGuild
        case transferLeadership
    }

    struct GuildSettings: Codable {
        var minLevelToJoin: Int
        var autoKickDays: Int
        var requireApproval: Bool
        var chatEnabled: Bool
    }

    @Published var currentGuild: Guild?
    @Published var pendingApplications: [GuildApplication] = []
    @Published var guildEvents: [GuildEvent] = []

    struct GuildApplication: Identifiable {
        let id: String
        let playerId: String
        let playerName: String
        let playerLevel: Int
        let message: String
        let timestamp: Date
    }

    struct GuildEvent: Identifiable {
        let id: String
        let name: String
        let type: EventType
        let startDate: Date
        let endDate: Date
        let progress: Double
        let rewards: [String]

        enum EventType {
            case quest
            case boss
            case war
            case donation
        }
    }

    func createGuild(name: String, description: String, isPublic: Bool) -> Result<Guild, GuildError> {
        guard name.count >= 3 && name.count <= 20 else {
            return .failure(.invalidName)
        }
        guard currentGuild == nil else {
            return .failure(.alreadyInGuild)
        }

        let guild = Guild(
            id: UUID().uuidString,
            name: name,
            description: description,
            emblemId: "default",
            level: 1,
            experience: 0,
            memberCount: 1,
            maxMembers: 10,
            isPublic: isPublic,
            createdDate: Date(),
            members: [],
            settings: GuildSettings(
                minLevelToJoin: 1,
                autoKickDays: 14,
                requireApproval: !isPublic,
                chatEnabled: true
            )
        )

        currentGuild = guild
        return .success(guild)
    }

    func joinGuild(guildId: String, message: String?) -> Result<Void, GuildError> {
        guard currentGuild == nil else {
            return .failure(.alreadyInGuild)
        }
        // Would submit join request to backend
        return .success(())
    }

    func leaveGuild() -> Result<Void, GuildError> {
        guard let guild = currentGuild else {
            return .failure(.notInGuild)
        }

        // Check if leader trying to leave
        if let member = guild.members.first(where: { $0.role == .leader }) {
            if guild.members.count > 1 {
                return .failure(.mustTransferLeadership)
            }
        }

        currentGuild = nil
        return .success(())
    }

    func promoteMember(memberId: String, to role: GuildRole) -> Result<Void, GuildError> {
        guard var guild = currentGuild else {
            return .failure(.notInGuild)
        }
        guard let memberIndex = guild.members.firstIndex(where: { $0.id == memberId }) else {
            return .failure(.memberNotFound)
        }

        // Role limits
        let currentRoleCount = guild.members.filter { $0.role == role }.count
        let maxForRole: Int
        switch role {
        case .leader: maxForRole = 1
        case .officer: maxForRole = 5
        case .elder: maxForRole = 10
        case .member: maxForRole = guild.maxMembers
        }

        guard currentRoleCount < maxForRole else {
            return .failure(.roleLimitReached)
        }

        guild.members[memberIndex].role = role
        currentGuild = guild
        return .success(())
    }

    func kickMember(memberId: String) -> Result<Void, GuildError> {
        guard var guild = currentGuild else {
            return .failure(.notInGuild)
        }
        guard let memberIndex = guild.members.firstIndex(where: { $0.id == memberId }) else {
            return .failure(.memberNotFound)
        }

        let member = guild.members[memberIndex]
        guard member.role != .leader else {
            return .failure(.cannotKickLeader)
        }

        guild.members.remove(at: memberIndex)
        guild.memberCount -= 1
        currentGuild = guild
        return .success(())
    }

    func checkInactiveMembers() -> [GuildMember] {
        guard let guild = currentGuild else { return [] }

        let cutoffDate = Date().addingTimeInterval(
            -Double(guild.settings.autoKickDays) * 86400
        )

        return guild.members.filter {
            $0.lastActive < cutoffDate && $0.role == .member
        }
    }

    func getGuildBonuses() -> GuildBonuses {
        guard let guild = currentGuild else {
            return GuildBonuses(resourceBonus: 0, xpBonus: 0, specialPerks: [])
        }

        let resourceBonus: Double
        let xpBonus: Double
        var specialPerks: [String] = []

        switch guild.level {
        case 1:
            resourceBonus = 0.05
            xpBonus = 0.05
        case 2:
            resourceBonus = 0.10
            xpBonus = 0.10
            specialPerks.append("Guild chat")
        case 3:
            resourceBonus = 0.15
            xpBonus = 0.15
            specialPerks.append("Guild events")
        case 4:
            resourceBonus = 0.20
            xpBonus = 0.20
            specialPerks.append("Guild wars")
        default:
            resourceBonus = 0.25
            xpBonus = 0.25
            specialPerks.append("Guild bosses")
            specialPerks.append("Territory control")
        }

        return GuildBonuses(
            resourceBonus: resourceBonus,
            xpBonus: xpBonus,
            specialPerks: specialPerks
        )
    }

    struct GuildBonuses {
        let resourceBonus: Double
        let xpBonus: Double
        let specialPerks: [String]
    }

    enum GuildError: Error {
        case invalidName
        case alreadyInGuild
        case notInGuild
        case memberNotFound
        case roleLimitReached
        case cannotKickLeader
        case mustTransferLeadership
        case insufficientPermissions
    }
}
```

## ShareSystem

```swift
import UIKit
import SwiftUI

final class ShareSystem {

    struct ShareContent {
        let image: UIImage?
        let text: String
        let url: URL?
        let hashtags: [String]
    }

    struct ShareMoment {
        let type: MomentType
        let value: Any
        let timestamp: Date

        enum MomentType {
            case highScore(Int)
            case levelComplete(Int)
            case achievementUnlock(String)
            case epicLoot(String)
            case milestone(String)
        }
    }

    func generateShareContent(for moment: ShareMoment, playerName: String) -> ShareContent {
        let text: String
        let hashtags: [String]

        switch moment.type {
        case .highScore(let score):
            text = "I just scored \(formatScore(score)) in [GameName]! Can you beat it?"
            hashtags = ["GameName", "HighScore", "MobileGaming"]

        case .levelComplete(let level):
            text = "Level \(level) conquered! [GameName]"
            hashtags = ["GameName", "LevelUp", "Gaming"]

        case .achievementUnlock(let achievement):
            text = "Just unlocked '\(achievement)' in [GameName]!"
            hashtags = ["GameName", "Achievement", "Unlocked"]

        case .epicLoot(let item):
            text = "Look what I got! \(item) in [GameName]!"
            hashtags = ["GameName", "Loot", "Lucky"]

        case .milestone(let milestone):
            text = "Milestone reached: \(milestone) in [GameName]!"
            hashtags = ["GameName", "Milestone", "Progress"]
        }

        let url = generateDeepLink(for: moment)
        let image = generateShareImage(for: moment, playerName: playerName)

        return ShareContent(
            image: image,
            text: text,
            url: url,
            hashtags: hashtags
        )
    }

    func presentShareSheet(
        content: ShareContent,
        from viewController: UIViewController,
        completion: @escaping (Bool, String?) -> Void
    ) {
        var items: [Any] = [content.text]

        if let image = content.image {
            items.append(image)
        }

        if let url = content.url {
            items.append(url)
        }

        let activityVC = UIActivityViewController(
            activityItems: items,
            applicationActivities: nil
        )

        // Track share completion
        activityVC.completionWithItemsHandler = { activityType, completed, _, error in
            let platform = activityType?.rawValue ?? "unknown"
            completion(completed, platform)
        }

        // iPad support
        if let popover = activityVC.popoverPresentationController {
            popover.sourceView = viewController.view
            popover.sourceRect = CGRect(
                x: viewController.view.bounds.midX,
                y: viewController.view.bounds.midY,
                width: 0,
                height: 0
            )
        }

        viewController.present(activityVC, animated: true)
    }

    func shouldPromptShare(for moment: ShareMoment, recentShares: [Date]) -> Bool {
        // Don't prompt too frequently
        let lastDay = recentShares.filter {
            $0 > Date().addingTimeInterval(-86400)
        }
        guard lastDay.count < 3 else { return false }

        // Check moment significance
        switch moment.type {
        case .highScore:
            return true // Always significant
        case .levelComplete(let level):
            return level % 10 == 0 // Every 10 levels
        case .achievementUnlock:
            return true // Achievements are shareable
        case .epicLoot:
            return true // Rare items are exciting
        case .milestone:
            return true // Milestones are worth sharing
        }
    }

    private func formatScore(_ score: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        return formatter.string(from: NSNumber(value: score)) ?? "\(score)"
    }

    private func generateDeepLink(for moment: ShareMoment) -> URL? {
        var components = URLComponents()
        components.scheme = "gamename"
        components.host = "share"

        switch moment.type {
        case .highScore(let score):
            components.path = "/score"
            components.queryItems = [URLQueryItem(name: "score", value: "\(score)")]
        case .levelComplete(let level):
            components.path = "/level"
            components.queryItems = [URLQueryItem(name: "level", value: "\(level)")]
        case .achievementUnlock(let achievement):
            components.path = "/achievement"
            components.queryItems = [URLQueryItem(name: "id", value: achievement)]
        case .epicLoot(let item):
            components.path = "/item"
            components.queryItems = [URLQueryItem(name: "id", value: item)]
        case .milestone(let milestone):
            components.path = "/milestone"
            components.queryItems = [URLQueryItem(name: "id", value: milestone)]
        }

        return components.url
    }

    private func generateShareImage(for moment: ShareMoment, playerName: String) -> UIImage? {
        // Would generate branded image with game logo, achievement, score, etc.
        // Return nil to use default share behavior
        return nil
    }
}
```
