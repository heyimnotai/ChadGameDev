---
name: social-mechanics
description: Designs social features that drive engagement through leaderboards, competition, cooperation, sharing mechanics, and community systems. Use this skill when implementing leaderboards, friend systems, guilds/clans, sharing features, or any multiplayer social component. Triggers when deciding between competitive vs cooperative design, implementing social proof, or building viral mechanics. This skill ensures social features enhance rather than detract from the core experience while respecting player autonomy and privacy.
---

# Social Mechanics

## Purpose

This skill enables the design of social features that drive engagement through psychological principles of competition, cooperation, social proof, and community belonging. It enforces a quality bar where social features enhance the core game experience, create positive player interactions, and drive organic growth while respecting player privacy and providing opt-out options. All implementations must handle edge cases like low player counts and toxic behavior.

## Domain Boundaries

- **This skill handles**:
  - Leaderboard psychology (local, global, friends)
  - Social proof implementation
  - Competition vs cooperation balance
  - Asynchronous multiplayer patterns
  - Sharing and viral mechanics
  - Guild/clan system basics
  - Friend challenge systems
  - When NOT to use social features
  - Privacy and opt-out requirements

- **This skill does NOT handle**:
  - Real-time multiplayer networking (see: technical skills)
  - Daily engagement and streaks (see: retention-engineer)
  - Reward timing and distribution (see: reward-scheduler)
  - First-time social feature introduction (see: onboarding-architect)
  - Dopamine and reward psychology (see: dopamine-optimizer)
  - Game Center integration specifics (see: game-center-integration)

## Core Specifications

### Leaderboard Psychology

**Leaderboard Display Principles**:
| Element | Recommendation | Psychological Basis |
|---------|----------------|---------------------|
| Default view | Friends-only or percentile | Avoids discouragement from global elites |
| Player position | Always visible, centered | Provides reference point |
| Neighbors shown | 5 above, 5 below | Creates achievable goals |
| Rank format | Percentile > Raw rank | "Top 15%" beats "Rank 42,372" |
| Update frequency | End of session | Prevents obsessive checking |
| Reset period | Weekly or seasonal | Fresh starts maintain engagement |

**Leaderboard Types and Use Cases**:
| Type | Best For | Avoid For |
|------|----------|-----------|
| Global all-time | Showcasing dedication | Casual games |
| Global weekly | Competitive games | Games with pay-to-win elements |
| Friends only | Social motivation | Games without friend systems |
| Local/regional | Cultural connection | Small player bases |
| Percentile | All competitive games | When exact rank matters |
| Skill-based tiers | Ranked modes | Casual modes |

**Friends Leaderboard Priority**:
```
Display order:
1. Friends who play actively (logged in < 7 days)
2. Friends with similar scores (within 20%)
3. Friends above you (motivation)
4. Friends below you (confidence)
5. "Invite friends" prompt if < 5 friends
```

**Anti-Discouragement Measures**:
```
If player rank > 90th percentile (bottom 10%):
- Show "Top 90%" not "Rank 9,000,000"
- Highlight personal best improvement
- Show "players you beat this week" count
- Emphasize friends comparison over global

If player has 0 friends:
- Show "nearby players" (similar skill)
- Prompt friend invites with bonus
- Show AI "ghost" competitors
```

### When NOT to Use Leaderboards

**Contraindicated Scenarios**:
| Scenario | Reason | Alternative |
|----------|--------|-------------|
| Meditation/wellness apps | Competition undermines purpose | Personal journey tracking |
| Creative/sandbox games | No objective "better" | Showcase gallery |
| Narrative-focused games | Breaks immersion | Achievement badges |
| Games with sensitive metrics | Privacy concerns | Private progress only |
| Pay-to-win games | Unfair competition | Skill-only modes |
| Very small player base | Embarrassing rankings | Milestone achievements |

**Red Flags for Leaderboard Removal**:
```
- D7 retention drops after leaderboard introduction
- Player feedback mentions "discouragement" or "unfair"
- Bottom 50% players show engagement drop
- Cheating/exploitation becomes prevalent
- Support tickets about ranking fairness increase
```

### Social Proof Implementation

**Social Proof Types**:
| Type | Implementation | Impact |
|------|----------------|--------|
| Activity indicators | "1,247 playing now" | FOMO, validation |
| Friend activity | "Alex just beat Level 15" | Competition, reconnection |
| Popular items | "Most purchased this week" | Decision simplification |
| Achievement rarity | "Only 3% have this" | Status, motivation |
| Trending content | "Hot levels right now" | Discovery, relevance |

**Activity Counter Design**:
```
Display thresholds:
- < 100 active: Don't show (embarrassing)
- 100-999: Show exact number
- 1,000-9,999: Show as "1.2K"
- 10,000+: Show as "10K+"

Update frequency: Every 5 minutes
Boost factor: 1.2x during low periods (ethical ceiling)
Never show: Declining numbers in real-time
```

**Friend Activity Notifications**:
```
Trigger conditions:
- Friend beats a level you're stuck on
- Friend earns achievement you don't have
- Friend plays after 7+ day absence
- Friend beats your high score

Frequency cap: 3 per day
Timing: Not during active gameplay
Opt-out: Always available
```

### Competition vs Cooperation Balance

**Competition Spectrum**:
```
Pure Competition ←————————————→ Pure Cooperation
     ↓                              ↓
Zero-sum games              Shared goals only
PvP battles                 Guild bosses
Ranked matches              Cooperative puzzles
Leaderboards               Shared resources
```

**Optimal Balance by Game Type**:
| Game Type | Competition % | Cooperation % |
|-----------|---------------|---------------|
| Battle royale | 90% | 10% (squad modes) |
| Match-3 puzzle | 40% (leaderboards) | 60% (lives sharing) |
| RPG | 50% (PvP arena) | 50% (guilds, raids) |
| Casual | 20% (optional) | 80% (helping, sharing) |
| Strategy | 60% (battles) | 40% (alliances) |

**Competition Safeguards**:
```
Required elements:
- Skill-based matchmaking (within 20% skill range)
- Protected beginner period (first 10-20 matches)
- Opt-out for non-competitive players
- Rewards for participation, not just winning
- Anti-smurf detection

Prohibited elements:
- Forced PvP in primarily PvE games
- Public shaming of losses
- Permanent negative consequences
- Matchmaking manipulation for spending
```

**Cooperation Incentives**:
```
Guild/clan benefits:
- Shared resource pool (10-20% bonus)
- Exclusive cooperative challenges
- Group rewards scaled by participation
- Mentorship bonuses (veteran helps newbie)

Friend benefits:
- Gift sending (daily, limited)
- Lives/energy sharing
- Cooperative bonuses (+10% when playing together)
- Referral rewards
```

### Asynchronous Multiplayer Patterns

**Async Multiplayer Types**:
| Pattern | Description | Example |
|---------|-------------|---------|
| Ghost racing | Race against friend's recorded run | Mario Kart Time Trials |
| Base raiding | Attack offline player's setup | Clash of Clans |
| Challenge sharing | Send custom challenges | Words with Friends |
| Leaderboard competition | Compete on scores | Candy Crush |
| Gift/request economy | Exchange resources | FarmVille |

**Ghost Racing Implementation**:
```swift
// Record player run
struct GhostData: Codable {
    let playerId: String
    let timestamp: Date
    let score: Int
    let inputEvents: [TimestampedInput]
    let checkpoints: [Float] // Position at each second
}

// Ghost selection priority:
// 1. Friend who recently beat your score
// 2. Player with score 5-10% higher than yours
// 3. Your personal best
// 4. Daily/weekly top score

// Display: Semi-transparent, same visual style
// Behavior: Non-blocking (pass through)
// Update: End of each race, not real-time
```

**Base Defense/Raid Pattern**:
```
Defender perspective:
- Setup phase: Design base when online
- Defense replay: Watch raids when returning
- Notification: "Your base was attacked" (optional)
- Recovery: Auto-repair after X hours
- Reward: Defense bonus for successful repels

Attacker perspective:
- Target selection: Similar strength ± 15%
- Time limit: 3-5 minutes per attack
- Outcome: Immediate result, defender notified later
- Cooldown: Cannot attack same player for 12-24 hours
```

**Turn-Based Async Games**:
```
Turn timeout: 24-72 hours
Reminder notification: At 50% and 90% of timeout
Forfeit: Auto-loss after timeout
Concurrent games: Allow 5-10 simultaneous
Move preview: Show pending move before confirm
Undo: Allow within 5 seconds of submit
```

### Sharing and Viral Mechanics

**Share Trigger Moments**:
| Moment | Share Rate | Content |
|--------|------------|---------|
| New high score | 15-25% | Score + visual |
| Achievement unlock | 10-20% | Achievement badge |
| Level complete | 5-10% | Level + score |
| Epic loot drop | 20-30% | Item showcase |
| Milestone reached | 25-35% | Progress milestone |

**Share Content Design**:
```
Required elements:
- Visual: Screenshot or stylized graphic
- Text: Auto-generated, editable
- App link: Deep link to app/specific content
- No personal data: Unless explicitly added

Optimal image:
- Square format (1:1) for Instagram
- Branded but not overwhelming
- Player name/avatar visible
- Achievement/score prominent
- Call-to-action subtle

Example text templates:
"I just hit [SCORE] in [GAME]! Can you beat it?"
"Finally unlocked [ACHIEVEMENT]! [GAME]"
"Level [X] conquered! [GAME]"
```

**Viral Loop Design**:
```
Step 1: Player achieves shareable moment
Step 2: Low-friction share prompt appears
Step 3: Player shares to social platform
Step 4: Friend sees share with deep link
Step 5: Friend downloads game
Step 6: Original player gets referral reward
Step 7: New player is matched with referrer

Metrics to track:
- Share rate (shares / shareable moments)
- Click-through rate (clicks / shares)
- Install rate (installs / clicks)
- K-factor (viral coefficient)

Target K-factor: > 0.3 for organic growth
```

**Referral System Design**:
```
Referrer rewards:
- Immediate: 100 soft currency on install
- Milestone: 500 soft currency when referee reaches level 10
- Ongoing: 5% of referee's IAP for 30 days (soft currency equivalent)

Referee rewards:
- Welcome bonus: 2x normal starting resources
- Link bonus: Exclusive starter item
- Social bonus: Auto-friend with referrer

Limit: 50 referrals per player (anti-abuse)
Verification: Referee must play 3+ days
```

### Guild/Clan System Basics

**Guild Size Tiers**:
| Size | Type | Management | Benefits |
|------|------|------------|----------|
| 5-10 | Friends group | Minimal | Basic chat, shared progress |
| 15-30 | Small clan | Officer roles | Donations, basic events |
| 30-50 | Standard guild | Full hierarchy | All features, guild wars |
| 50-100 | Large guild | Complex management | Maximum benefits, prestige |

**Guild Feature Progression**:
```
Guild Level 1 (5 members):
- Chat
- Member list
- Basic donations

Guild Level 2 (10 members):
- Guild bank
- Simple quests
- Recruitment tools

Guild Level 3 (20 members):
- Officer roles
- Guild events
- Custom emblem

Guild Level 4 (30 members):
- Guild wars
- Advanced perks
- Alliance system

Guild Level 5 (50 members):
- Guild bosses
- Territory control
- Leaderboard ranking
```

**Guild Role Structure**:
```
Leader (1):
- All permissions
- Transfer leadership
- Disband guild

Officer (2-5):
- Accept/reject applications
- Promote/demote members
- Start events
- Manage announcements

Elder (5-10):
- Accept applications
- Chat moderation
- Event participation boost

Member (unlimited):
- Participate in events
- Donate resources
- Use guild chat
```

**Guild Retention Mechanics**:
```
Daily guild engagement:
- Guild check-in bonus: +20% daily reward
- Guild quest contribution: Shared progress bar
- Donation cooldown: Every 8 hours

Weekly guild engagement:
- Guild war participation
- Guild boss attempts
- Weekly contribution ranking

Anti-ghost guild measures:
- Inactivity warning: 7 days
- Auto-kick: 14-30 days inactive
- Activity leaderboard in guild
```

### Friend Challenge Systems

**Challenge Types**:
| Type | Duration | Stakes | Loser Experience |
|------|----------|--------|------------------|
| Quick challenge | 1 game | Bragging rights | "Rematch?" option |
| Daily challenge | 24 hours | Small rewards | Participation reward |
| Weekly challenge | 7 days | Medium rewards | Consolation prize |
| Season challenge | 30 days | Major rewards | Progress recognition |

**Challenge Design**:
```
Initiation:
- One-tap send from leaderboard
- Custom challenge creation
- Auto-challenge on score beat

Notification:
- Push: "Alex challenged you!"
- In-game: Challenge banner
- Reminder: 4 hours before expiry

Resolution:
- Winner celebration
- Loser encouragement
- Both get participation reward
- Streak tracking for regular challengers
```

**Fair Challenge Matching**:
```
Handicap system for skill gaps:
- 10-20% skill gap: 5% score bonus to lower player
- 20-40% skill gap: 10% score bonus
- 40%+ skill gap: Suggest easier challenge type

Challenge rejection handling:
- Don't notify rejection (avoid awkwardness)
- Auto-expire after 48 hours
- Limit pending challenges: 5 per player
```

### Privacy and Opt-Out Requirements

**Privacy Levels**:
```
Level 1 - Full Public:
- Name visible to all
- Score on global leaderboards
- Activity visible to non-friends

Level 2 - Friends Only (Default):
- Name visible to friends
- Score visible to friends
- Activity visible to friends

Level 3 - Private:
- Anonymous on leaderboards
- No activity sharing
- Ghost mode available

Level 4 - Offline:
- No social features active
- No data shared
- Single-player only
```

**Required Opt-Out Options**:
| Feature | Must Allow Opt-Out | Default State |
|---------|-------------------|---------------|
| Leaderboards | Yes | Opt-in |
| Friend activity | Yes | Opt-in |
| Push notifications | Yes | Opt-in |
| Location sharing | Yes | Opt-out |
| Score sharing | Yes | Opt-in |
| Guild membership | Yes | Not joined |

**GDPR/CCPA Compliance**:
```
Data collection disclosure:
- What social data is collected
- How it's used
- Who can see it
- How to delete it

Right to deletion:
- Remove from all leaderboards
- Delete friend connections
- Remove guild history
- Anonymize past shares

Data portability:
- Export friend list
- Export achievement history
- Export game statistics
```

## Implementation Patterns

### Leaderboard System

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

### Social Proof Manager

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

### Guild System

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

### Share System

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

## Decision Trees

### Leaderboard Type Selection

```
What is the primary goal of your leaderboard?
├── Showcase top players globally
│   └── Use Global Leaderboard
│       ├── Show top 100
│       ├── Show player rank as percentile
│       └── Reset weekly or seasonally
├── Motivate friends to compete
│   └── Use Friends Leaderboard (default)
│       ├── Auto-populate with active friends
│       ├── Show "invite friends" if < 5
│       └── Highlight when friend beats player
├── Help struggling players feel good
│   └── Use Percentile View
│       ├── Show "Top X%" instead of raw rank
│       ├── Emphasize personal improvement
│       └── Hide from bottom 10% if discouraging
├── Match similar skill levels
│   └── Use Nearby Players
│       ├── Show players within 20% of score
│       ├── Update after each session
│       └── Exclude friends (they have own board)
└── Create fresh competition regularly
    └── Use Weekly/Seasonal Reset
        ├── Archive previous standings
        ├── Provide end-of-period rewards
        └── Give everyone fresh start
```

### Social Feature Introduction Timing

```
When should each social feature unlock?
├── Leaderboards
│   └── Level 10+
│       ├── Player has established baseline skill
│       ├── Has experienced core loop multiple times
│       └── Ready for external comparison
├── Friend system
│   └── Level 5+
│       ├── Player is invested in game
│       ├── Has something to share
│       └── Ready to connect
├── Guilds/Clans
│   └── Level 15+
│       ├── Understands game deeply
│       ├── Ready for commitment
│       └── Can contribute meaningfully
├── PvP/Competitive
│   └── Level 20+ OR tutorial complete
│       ├── Has all core mechanics
│       ├── Understands meta-strategy
│       └── Protected beginner period over
└── Sharing/Viral
    └── After first achievement
        ├── Has something worth sharing
        ├── Feels accomplished
        └── Natural share moment
```

### Competition vs Cooperation Decision

```
What is your game's core fantasy?
├── Power/Domination
│   └── Lean competitive (70-30)
│       ├── Ranked PvP modes
│       ├── Leaderboards prominent
│       └── Cooperation in alliances for wars
├── Community/Belonging
│   └── Lean cooperative (30-70)
│       ├── Guild content primary
│       ├── Shared goals and bosses
│       └── Competition friendly only
├── Self-improvement
│   └── Balanced with personal focus (40-40-20)
│       ├── Personal bests emphasized
│       ├── Optional competition
│       └── Cooperative challenges available
├── Social/Party
│   └── Heavily cooperative (20-80)
│       ├── Party modes primary
│       ├── Shared rewards
│       └── Competition is friendly/casual
└── Casual/Relaxation
    └── Minimal social (optional)
        ├── All social features optional
        ├── No forced competition
        └── Single-player fully viable
```

## Quality Checklist

### Leaderboard Implementation Verification
- [ ] Friends leaderboard is default view
- [ ] Player's position is always visible
- [ ] 5 neighbors above and below are shown
- [ ] Percentile format used for ranks > 1000
- [ ] Anti-discouragement measures active for bottom 10%
- [ ] Leaderboard updates at session end, not real-time
- [ ] Reset schedule is clearly communicated

### Social Proof Verification
- [ ] Online counter hidden when < 100 players
- [ ] Friend activity limited to 3 notifications per day
- [ ] Activity notifications don't interrupt gameplay
- [ ] Achievement rarity percentages are accurate
- [ ] Popular items list updates every 5 minutes
- [ ] All social proof has opt-out option

### Guild System Verification
- [ ] Guild creation requires minimum 3 character name
- [ ] Role permissions are enforced correctly
- [ ] Inactive member warnings trigger at 7 days
- [ ] Auto-kick triggers at configured threshold
- [ ] Guild bonuses scale with level correctly
- [ ] Leadership transfer works when leader leaves

### Privacy and Ethics Verification
- [ ] Privacy levels are clearly explained
- [ ] Friends-only is default privacy setting
- [ ] Complete opt-out is available
- [ ] No social data shared without consent
- [ ] GDPR deletion request removes all social data
- [ ] No forced social requirements for progression

### Sharing System Verification
- [ ] Share prompts limited to 3 per day
- [ ] Share content includes proper branding
- [ ] Deep links work and track correctly
- [ ] Share completion is tracked for analytics
- [ ] No personal data in share content without consent
- [ ] iPad popover presentation works correctly

## Anti-Patterns

### Anti-Pattern: Public Shaming
**Wrong**:
```swift
// NEVER DO THIS: Publicly embarrassing players
func displayLeaderboard() {
    for (index, entry) in entries.enumerated() {
        if index >= entries.count - 10 {
            cell.backgroundColor = .red
            cell.label = "BOTTOM 10 - \(entry.name)"
        }
    }
}
```
**Consequence**: Players quit, negative reviews, community backlash.

**Correct**:
```swift
func displayLeaderboard() {
    for entry in entries {
        if entry.isCurrentPlayer && entry.percentile > 90 {
            // Show encouraging personal view
            showPersonalProgressView(entry)
        } else {
            showStandardEntry(entry)
        }
    }
}
```

### Anti-Pattern: Forced Social Requirements
**Wrong**:
```swift
// NEVER DO THIS: Blocking progression for social actions
func canAccessLevel(_ level: Int) -> Bool {
    if level == 35 {
        return friendCount >= 5 // Must have 5 friends
    }
    return true
}
```
**Consequence**: Players who prefer solo play are locked out, frustration.

**Correct**:
```swift
func canAccessLevel(_ level: Int) -> Bool {
    if level == 35 {
        // Social gate with alternative
        return friendCount >= 5 || hasWatchedAd || hasPaidBypass
    }
    return true
}
```

### Anti-Pattern: Notification Spam
**Wrong**:
```swift
// NEVER DO THIS: Spamming friend notifications
func onFriendActivity(_ activity: FriendActivity) {
    sendPushNotification("\(activity.friendName) did something!")
    // No limits, no filtering, every activity
}
```
**Consequence**: Players disable notifications entirely, lost channel.

**Correct**:
```swift
func onFriendActivity(_ activity: FriendActivity) {
    guard shouldNotify(activity) else { return }
    guard dailyNotificationCount < 3 else { return }
    guard activity.isSignificant else { return }

    sendPushNotification(formatActivityMessage(activity))
    dailyNotificationCount += 1
}
```

### Anti-Pattern: Pay-to-Win Leaderboards
**Wrong**:
```swift
// NEVER DO THIS: Leaderboards where spending = winning
func calculateLeaderboardScore(player: Player) -> Int {
    return player.baseScore + (player.purchasedBoosts * 1000)
}
```
**Consequence**: Free players disengage, whale-only competition.

**Correct**:
```swift
func calculateLeaderboardScore(player: Player) -> Int {
    // Skill-only leaderboard
    return player.skillScore

    // OR separate leaderboards
    // skillLeaderboard: pure skill
    // overallLeaderboard: includes purchases (disclosed)
}
```

### Anti-Pattern: Empty Social Features
**Wrong**:
```swift
// NEVER DO THIS: Launching social features with no users
func showLeaderboard() {
    if entries.count < 10 {
        // Show sad empty leaderboard
        showEntries(entries) // Only 3 people
    }
}
```
**Consequence**: New players see ghost town, assume game is dead.

**Correct**:
```swift
func showLeaderboard() {
    if entries.count < minimumThreshold {
        // Add AI/ghost players or hide feature
        showComingSoonMessage()
        // OR
        showPersonalProgressInstead()
    } else {
        showEntries(entries)
    }
}
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| **retention-engineer** | Social features drive long-term retention |
| **game-center-integration** | Technical implementation of leaderboards |
| **onboarding-architect** | When to introduce social features |
| **dopamine-optimizer** | Social rewards and competition psychology |
| **analytics-integration** | Track social engagement metrics |
| **privacy-manifest** | Social data collection compliance |
