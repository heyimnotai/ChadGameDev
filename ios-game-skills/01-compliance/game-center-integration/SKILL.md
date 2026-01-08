---
name: game-center-integration
description: Implements complete Game Center integration for iOS games including authentication, leaderboards, achievements, and Access Point. Use this skill when adding social/competitive features to a game, implementing leaderboards or achievements, handling player authentication, or configuring Game Center in App Store Connect. Triggers include: new game social features, leaderboard implementation, achievement system design, Game Center setup, authentication flow issues.
---

# Game Center Integration

## Purpose

This skill enables Claude agents to implement complete Game Center integration for iOS games. It covers authentication flows, leaderboard design and submission, achievement systems, and Access Point configuration. Games following this skill provide seamless social gaming experiences with proper handling of authentication failures, offline scenarios, and edge cases that cause common Game Center integration issues.

## Domain Boundaries

- **This skill handles**: GameKit framework integration, Game Center authentication, leaderboard implementation (classic and recurring), achievement definition and unlocking, Access Point configuration, multiplayer setup basics, handling unauthenticated players
- **This skill does NOT handle**: IAP for unlockable content (see `iap-implementation` skill), app submission process (see `app-store-review` skill), social sharing to external platforms, server-authoritative anti-cheat (custom implementation required)

## Core Specifications

### Game Center Capabilities

| Feature | iOS Version | Description |
|---------|-------------|-------------|
| Leaderboards (Classic) | iOS 4+ | All-time high scores |
| Leaderboards (Recurring) | iOS 14+ | Periodic reset (daily/weekly/etc.) |
| Achievements | iOS 4+ | Progress-based unlocks |
| Access Point | iOS 14+ | Floating Game Center dashboard entry |
| Challenges | iOS 6+ | Challenge friends to beat scores |
| Multiplayer | iOS 4+ | Turn-based and real-time matches |
| Friends | iOS 4.1+ | Friend lists and presence |

### Leaderboard Types

| Type | Reset Period | Use Case | Best For |
|------|--------------|----------|----------|
| Classic | Never | All-time records | Total playtime, highest level |
| Recurring Daily | 24 hours | Daily competition | Daily challenges |
| Recurring Weekly | 7 days | Weekly competition | Weekly events |
| Recurring Monthly | ~30 days | Monthly seasons | Monthly rankings |

### Achievement Design Limits

| Property | Limit |
|----------|-------|
| Maximum achievements per game | 100 |
| Maximum points total | 1000 |
| Points per achievement | 1-100 (increments of 5 recommended) |
| Title length | 50 characters |
| Pre-earned description | 255 characters |
| Earned description | 255 characters |
| Achievement icon size | 512x512 px (1024x1024 px @2x) |

### Score Formatting

| Format Type | Display Example | Use Case |
|-------------|-----------------|----------|
| Integer | 1,234,567 | Points, coins |
| Fixed Point (1 decimal) | 1,234.5 | Time in seconds |
| Fixed Point (2 decimals) | 12.34 | Precise measurements |
| Fixed Point (3 decimals) | 1.234 | Very precise values |
| Elapsed Time (Minutes) | 12:34 | Race times under 1 hour |
| Elapsed Time (Seconds) | 12:34.56 | Precise race times |
| Money | $1,234.56 | In-game currency displays |

## Implementation Patterns

### Game Center Manager - Complete Implementation

```swift
import GameKit
import SwiftUI

/// Manages all Game Center functionality
@MainActor
final class GameCenterManager: NSObject, ObservableObject {

    // MARK: - Singleton

    static let shared = GameCenterManager()

    // MARK: - Published Properties

    @Published private(set) var isAuthenticated = false
    @Published private(set) var localPlayer: GKLocalPlayer?
    @Published private(set) var error: GameCenterError?

    // MARK: - Leaderboard IDs

    enum LeaderboardID {
        static let highScore = "com.game.leaderboard.highscore"
        static let totalCoins = "com.game.leaderboard.totalcoins"
        static let fastestTime = "com.game.leaderboard.fastesttime"
        static let dailyChallenge = "com.game.leaderboard.daily"
        static let weeklyRanking = "com.game.leaderboard.weekly"
    }

    // MARK: - Achievement IDs

    enum AchievementID {
        static let firstWin = "com.game.achievement.firstwin"
        static let score1000 = "com.game.achievement.score1000"
        static let score10000 = "com.game.achievement.score10000"
        static let playedOneHour = "com.game.achievement.hour1"
        static let perfectLevel = "com.game.achievement.perfect"
        static let collector100 = "com.game.achievement.collect100"
        static let socialPlayer = "com.game.achievement.social"
    }

    // MARK: - Initialization

    private override init() {
        super.init()
    }

    // MARK: - Authentication

    /// Authenticate the local player with Game Center
    func authenticate() async {
        let player = GKLocalPlayer.local

        // Set the authentication handler
        player.authenticateHandler = { [weak self] viewController, error in
            Task { @MainActor in
                await self?.handleAuthentication(viewController: viewController, error: error)
            }
        }
    }

    private func handleAuthentication(viewController: UIViewController?, error: Error?) async {
        if let error = error {
            self.error = .authenticationFailed(error)
            self.isAuthenticated = false
            return
        }

        if let viewController = viewController {
            // Present the Game Center login UI
            await presentViewController(viewController)
            return
        }

        // Check if authenticated
        let player = GKLocalPlayer.local
        if player.isAuthenticated {
            self.localPlayer = player
            self.isAuthenticated = true
            self.error = nil

            // Register for authentication changes
            player.register(self)

            // Load achievements progress
            await loadAchievements()
        } else {
            self.isAuthenticated = false
            self.localPlayer = nil
        }
    }

    private func presentViewController(_ viewController: UIViewController) async {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootVC = windowScene.windows.first?.rootViewController else {
            return
        }

        await withCheckedContinuation { continuation in
            rootVC.present(viewController, animated: true) {
                continuation.resume()
            }
        }
    }

    // MARK: - Access Point

    /// Configure and show the Game Center Access Point
    func configureAccessPoint(location: GKAccessPoint.Location = .topLeading, showHighlights: Bool = true) {
        GKAccessPoint.shared.location = location
        GKAccessPoint.shared.showHighlights = showHighlights
        GKAccessPoint.shared.isActive = isAuthenticated
    }

    /// Hide the Access Point (e.g., during gameplay)
    func hideAccessPoint() {
        GKAccessPoint.shared.isActive = false
    }

    /// Show the Access Point
    func showAccessPoint() {
        guard isAuthenticated else { return }
        GKAccessPoint.shared.isActive = true
    }

    /// Trigger Access Point highlight programmatically
    func triggerAccessPointHighlight() {
        guard isAuthenticated else { return }
        GKAccessPoint.shared.triggerAccessPoint(handler: { })
    }
}

// MARK: - Leaderboards

extension GameCenterManager {

    /// Submit a score to a leaderboard
    func submitScore(_ score: Int, to leaderboardID: String, context: Int = 0) async throws {
        guard isAuthenticated else {
            throw GameCenterError.notAuthenticated
        }

        try await GKLeaderboard.submitScore(
            score,
            context: context,
            player: GKLocalPlayer.local,
            leaderboardIDs: [leaderboardID]
        )
    }

    /// Submit a score to multiple leaderboards at once
    func submitScore(_ score: Int, to leaderboardIDs: [String], context: Int = 0) async throws {
        guard isAuthenticated else {
            throw GameCenterError.notAuthenticated
        }

        try await GKLeaderboard.submitScore(
            score,
            context: context,
            player: GKLocalPlayer.local,
            leaderboardIDs: leaderboardIDs
        )
    }

    /// Load leaderboard scores
    func loadLeaderboard(
        id: String,
        timeScope: GKLeaderboard.TimeScope = .allTime,
        range: NSRange = NSRange(location: 1, length: 10)
    ) async throws -> (scores: [GKLeaderboard.Entry], localPlayerEntry: GKLeaderboard.Entry?) {
        guard isAuthenticated else {
            throw GameCenterError.notAuthenticated
        }

        let leaderboards = try await GKLeaderboard.loadLeaderboards(IDs: [id])
        guard let leaderboard = leaderboards.first else {
            throw GameCenterError.leaderboardNotFound
        }

        let (localEntry, entries, _) = try await leaderboard.loadEntries(
            for: .global,
            timeScope: timeScope,
            range: range
        )

        return (entries, localEntry)
    }

    /// Load player's rank on a leaderboard
    func loadPlayerRank(for leaderboardID: String) async throws -> GKLeaderboard.Entry? {
        guard isAuthenticated else {
            throw GameCenterError.notAuthenticated
        }

        let leaderboards = try await GKLeaderboard.loadLeaderboards(IDs: [leaderboardID])
        guard let leaderboard = leaderboards.first else {
            return nil
        }

        let (localEntry, _, _) = try await leaderboard.loadEntries(
            for: .global,
            timeScope: .allTime,
            range: NSRange(location: 1, length: 1)
        )

        return localEntry
    }

    /// Load friends' scores on a leaderboard
    func loadFriendsScores(for leaderboardID: String) async throws -> [GKLeaderboard.Entry] {
        guard isAuthenticated else {
            throw GameCenterError.notAuthenticated
        }

        let leaderboards = try await GKLeaderboard.loadLeaderboards(IDs: [leaderboardID])
        guard let leaderboard = leaderboards.first else {
            return []
        }

        let (_, entries, _) = try await leaderboard.loadEntries(
            for: .friends,
            timeScope: .allTime,
            range: NSRange(location: 1, length: 100)
        )

        return entries
    }

    /// Show the full Game Center leaderboard UI
    func showLeaderboard(id: String? = nil) async {
        guard isAuthenticated else { return }

        let viewController = GKGameCenterViewController(state: .leaderboards)
        if let id = id {
            viewController.leaderboardIdentifier = id
        }
        viewController.gameCenterDelegate = self

        await presentViewController(viewController)
    }
}

// MARK: - Achievements

extension GameCenterManager {

    /// Local cache of achievement progress
    private static var achievementCache: [String: Double] = [:]

    /// Load all achievements and their progress
    func loadAchievements() async {
        guard isAuthenticated else { return }

        do {
            let achievements = try await GKAchievement.loadAchievements()
            for achievement in achievements {
                Self.achievementCache[achievement.identifier] = achievement.percentComplete
            }
        } catch {
            // Non-critical - continue without cache
        }
    }

    /// Report achievement progress
    func reportAchievement(
        id: String,
        percentComplete: Double,
        showBanner: Bool = true
    ) async throws {
        guard isAuthenticated else {
            // Queue for later submission when authenticated
            queueAchievement(id: id, percentComplete: percentComplete)
            return
        }

        // Check if already at this progress or higher
        if let cached = Self.achievementCache[id], cached >= percentComplete {
            return
        }

        let achievement = GKAchievement(identifier: id)
        achievement.percentComplete = min(100, max(0, percentComplete))
        achievement.showsCompletionBanner = showBanner

        try await GKAchievement.report([achievement])
        Self.achievementCache[id] = percentComplete
    }

    /// Unlock an achievement completely (100%)
    func unlockAchievement(id: String, showBanner: Bool = true) async throws {
        try await reportAchievement(id: id, percentComplete: 100, showBanner: showBanner)
    }

    /// Increment progress on a progressive achievement
    func incrementAchievement(id: String, by amount: Double, showBanner: Bool = true) async throws {
        let current = Self.achievementCache[id] ?? 0
        let newProgress = min(100, current + amount)
        try await reportAchievement(id: id, percentComplete: newProgress, showBanner: showBanner)
    }

    /// Get current progress for an achievement
    func achievementProgress(for id: String) -> Double {
        Self.achievementCache[id] ?? 0
    }

    /// Reset all achievement progress (development only)
    func resetAllAchievements() async throws {
        #if DEBUG
        try await GKAchievement.resetAchievements()
        Self.achievementCache.removeAll()
        #endif
    }

    /// Show the full achievements UI
    func showAchievements() async {
        guard isAuthenticated else { return }

        let viewController = GKGameCenterViewController(state: .achievements)
        viewController.gameCenterDelegate = self

        await presentViewController(viewController)
    }

    // MARK: - Achievement Queue (Offline Support)

    private static var achievementQueue: [(id: String, percentComplete: Double)] = []

    private func queueAchievement(id: String, percentComplete: Double) {
        Self.achievementQueue.append((id, percentComplete))
        // Persist to UserDefaults for crash recovery
        saveAchievementQueue()
    }

    private func saveAchievementQueue() {
        let data = Self.achievementQueue.map { ["id": $0.id, "progress": $0.percentComplete] }
        UserDefaults.standard.set(data, forKey: "queuedAchievements")
    }

    func processQueuedAchievements() async {
        guard isAuthenticated else { return }

        // Load from persistence
        if let data = UserDefaults.standard.array(forKey: "queuedAchievements") as? [[String: Any]] {
            for item in data {
                if let id = item["id"] as? String,
                   let progress = item["progress"] as? Double {
                    Self.achievementQueue.append((id, progress))
                }
            }
        }

        // Process queue
        for item in Self.achievementQueue {
            try? await reportAchievement(id: item.id, percentComplete: item.percentComplete)
        }

        // Clear queue
        Self.achievementQueue.removeAll()
        UserDefaults.standard.removeObject(forKey: "queuedAchievements")
    }
}

// MARK: - GKGameCenterControllerDelegate

extension GameCenterManager: GKGameCenterControllerDelegate {

    nonisolated func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}

// MARK: - GKLocalPlayerListener

extension GameCenterManager: GKLocalPlayerListener {

    nonisolated func player(_ player: GKPlayer, didAccept invite: GKInvite) {
        // Handle multiplayer invite
        Task { @MainActor in
            // Navigate to multiplayer match
        }
    }

    nonisolated func player(_ player: GKPlayer, didRequestMatchWithRecipients recipientPlayers: [GKPlayer]) {
        // Handle match request
    }
}

// MARK: - Errors

enum GameCenterError: LocalizedError {
    case notAuthenticated
    case authenticationFailed(Error)
    case leaderboardNotFound
    case achievementNotFound
    case networkError(Error)

    var errorDescription: String? {
        switch self {
        case .notAuthenticated:
            return "Not signed in to Game Center"
        case .authenticationFailed(let error):
            return "Game Center sign in failed: \(error.localizedDescription)"
        case .leaderboardNotFound:
            return "Leaderboard not found"
        case .achievementNotFound:
            return "Achievement not found"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        }
    }
}
```

### SwiftUI Integration

```swift
import SwiftUI
import GameKit

// MARK: - Game Center Authentication View

struct GameCenterAuthView: View {
    @StateObject private var gameCenter = GameCenterManager.shared
    @State private var showingGameCenterUI = false

    var body: some View {
        VStack(spacing: 16) {
            if gameCenter.isAuthenticated {
                // Authenticated state
                HStack {
                    if let player = gameCenter.localPlayer {
                        AsyncImage(url: nil) { image in
                            image.resizable()
                        } placeholder: {
                            Image(systemName: "person.circle.fill")
                                .resizable()
                        }
                        .frame(width: 44, height: 44)
                        .clipShape(Circle())

                        VStack(alignment: .leading) {
                            Text(player.displayName)
                                .font(.headline)
                            Text("Game Center")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }

                    Spacer()

                    Button {
                        showingGameCenterUI = true
                    } label: {
                        Image(systemName: "gamecontroller.fill")
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            } else {
                // Not authenticated
                Button {
                    Task {
                        await gameCenter.authenticate()
                    }
                } label: {
                    Label("Sign in to Game Center", systemImage: "gamecontroller")
                }
                .buttonStyle(.bordered)
            }
        }
        .sheet(isPresented: $showingGameCenterUI) {
            GameCenterView()
        }
        .task {
            await gameCenter.authenticate()
        }
    }
}

// MARK: - Game Center View Wrapper

struct GameCenterView: UIViewControllerRepresentable {
    @Environment(\.dismiss) private var dismiss
    var state: GKGameCenterViewControllerState = .default

    func makeUIViewController(context: Context) -> GKGameCenterViewController {
        let viewController = GKGameCenterViewController(state: state)
        viewController.gameCenterDelegate = context.coordinator
        return viewController
    }

    func updateUIViewController(_ uiViewController: GKGameCenterViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(dismiss: dismiss)
    }

    class Coordinator: NSObject, GKGameCenterControllerDelegate {
        let dismiss: DismissAction

        init(dismiss: DismissAction) {
            self.dismiss = dismiss
        }

        func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
            dismiss()
        }
    }
}

// MARK: - Leaderboard View

struct LeaderboardView: View {
    let leaderboardID: String
    @State private var entries: [GKLeaderboard.Entry] = []
    @State private var localEntry: GKLeaderboard.Entry?
    @State private var isLoading = true
    @State private var selectedScope: GKLeaderboard.TimeScope = .allTime

    var body: some View {
        VStack {
            Picker("Time", selection: $selectedScope) {
                Text("Today").tag(GKLeaderboard.TimeScope.today)
                Text("Week").tag(GKLeaderboard.TimeScope.week)
                Text("All Time").tag(GKLeaderboard.TimeScope.allTime)
            }
            .pickerStyle(.segmented)
            .padding()

            if isLoading {
                ProgressView()
            } else {
                List {
                    // Local player section
                    if let localEntry = localEntry {
                        Section("Your Rank") {
                            LeaderboardEntryRow(entry: localEntry, isLocalPlayer: true)
                        }
                    }

                    // Top scores
                    Section("Top Scores") {
                        ForEach(entries, id: \.rank) { entry in
                            LeaderboardEntryRow(
                                entry: entry,
                                isLocalPlayer: entry.player == GKLocalPlayer.local
                            )
                        }
                    }
                }
            }
        }
        .navigationTitle("Leaderboard")
        .task {
            await loadLeaderboard()
        }
        .onChange(of: selectedScope) { _ in
            Task {
                await loadLeaderboard()
            }
        }
    }

    private func loadLeaderboard() async {
        isLoading = true
        do {
            let result = try await GameCenterManager.shared.loadLeaderboard(
                id: leaderboardID,
                timeScope: selectedScope
            )
            entries = result.scores
            localEntry = result.localPlayerEntry
        } catch {
            // Handle error
        }
        isLoading = false
    }
}

struct LeaderboardEntryRow: View {
    let entry: GKLeaderboard.Entry
    let isLocalPlayer: Bool

    var body: some View {
        HStack {
            Text("#\(entry.rank)")
                .font(.headline)
                .frame(width: 50, alignment: .leading)

            VStack(alignment: .leading) {
                Text(entry.player.displayName)
                    .font(.body)
                    .fontWeight(isLocalPlayer ? .bold : .regular)
                Text(entry.formattedScore)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            if isLocalPlayer {
                Image(systemName: "star.fill")
                    .foregroundColor(.yellow)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Achievements View

struct AchievementsView: View {
    @State private var achievements: [AchievementDisplay] = []
    @State private var isLoading = true

    struct AchievementDisplay: Identifiable {
        let id: String
        let title: String
        let description: String
        let progress: Double
        let isUnlocked: Bool
        let image: UIImage?
    }

    var body: some View {
        Group {
            if isLoading {
                ProgressView()
            } else {
                List(achievements) { achievement in
                    HStack {
                        if let image = achievement.image {
                            Image(uiImage: image)
                                .resizable()
                                .frame(width: 50, height: 50)
                                .cornerRadius(8)
                        } else {
                            Image(systemName: achievement.isUnlocked ? "trophy.fill" : "trophy")
                                .font(.title)
                                .frame(width: 50, height: 50)
                                .foregroundColor(achievement.isUnlocked ? .yellow : .gray)
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text(achievement.title)
                                .font(.headline)
                            Text(achievement.description)
                                .font(.caption)
                                .foregroundColor(.secondary)

                            if !achievement.isUnlocked && achievement.progress > 0 {
                                ProgressView(value: achievement.progress, total: 100)
                            }
                        }

                        Spacer()

                        if achievement.isUnlocked {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                        }
                    }
                    .padding(.vertical, 4)
                    .opacity(achievement.isUnlocked ? 1 : 0.7)
                }
            }
        }
        .navigationTitle("Achievements")
        .task {
            await loadAchievements()
        }
    }

    private func loadAchievements() async {
        isLoading = true

        do {
            let descriptions = try await GKAchievementDescription.loadAchievementDescriptions()
            let progress = try await GKAchievement.loadAchievements()

            let progressMap = Dictionary(uniqueKeysWithValues: progress.map { ($0.identifier, $0.percentComplete) })

            achievements = descriptions.map { desc in
                let currentProgress = progressMap[desc.identifier] ?? 0
                return AchievementDisplay(
                    id: desc.identifier,
                    title: desc.title,
                    description: currentProgress >= 100 ? desc.achievedDescription : desc.unachievedDescription,
                    progress: currentProgress,
                    isUnlocked: currentProgress >= 100,
                    image: nil // Load async if needed
                )
            }
        } catch {
            // Handle error
        }

        isLoading = false
    }
}
```

### Access Point Configuration

```swift
import GameKit

extension GameCenterManager {

    /// Configure Access Point for different game states
    func configureAccessPointForState(_ state: GameState) {
        guard isAuthenticated else {
            GKAccessPoint.shared.isActive = false
            return
        }

        switch state {
        case .mainMenu:
            // Show in menu, allow highlights
            GKAccessPoint.shared.location = .topLeading
            GKAccessPoint.shared.showHighlights = true
            GKAccessPoint.shared.isActive = true

        case .gameplay:
            // Hide during active gameplay
            GKAccessPoint.shared.isActive = false

        case .pause:
            // Show during pause without highlights
            GKAccessPoint.shared.location = .topLeading
            GKAccessPoint.shared.showHighlights = false
            GKAccessPoint.shared.isActive = true

        case .gameOver:
            // Show prominently with highlights for new achievements
            GKAccessPoint.shared.location = .topTrailing
            GKAccessPoint.shared.showHighlights = true
            GKAccessPoint.shared.isActive = true
        }
    }

    enum GameState {
        case mainMenu
        case gameplay
        case pause
        case gameOver
    }
}

// Access Point locations and their recommended use:
/*
 .topLeading    - Default, good for most games
 .topTrailing   - Alternative if top-left conflicts with UI
 .bottomLeading - For games with top-heavy UI
 .bottomTrailing - Alternative bottom position
*/
```

### Handling Authentication Gracefully

```swift
extension GameCenterManager {

    /// Check authentication status and handle gracefully
    func requireAuthentication(
        for feature: String,
        completion: @escaping (Bool) -> Void
    ) {
        if isAuthenticated {
            completion(true)
            return
        }

        // Show explanation and attempt authentication
        Task { @MainActor in
            // Could show a custom UI explaining why Game Center is needed
            await authenticate()
            completion(isAuthenticated)
        }
    }

    /// Safely perform Game Center operation with fallback
    func performIfAuthenticated<T>(
        _ operation: @escaping () async throws -> T,
        fallback: T
    ) async -> T {
        guard isAuthenticated else {
            return fallback
        }

        do {
            return try await operation()
        } catch {
            return fallback
        }
    }
}

// Usage example:
class ScoreSubmitter {
    func submitGameOverScore(_ score: Int) async {
        // Try to submit, but don't fail the game over flow if it fails
        await GameCenterManager.shared.performIfAuthenticated({
            try await GameCenterManager.shared.submitScore(
                score,
                to: GameCenterManager.LeaderboardID.highScore
            )
        }, fallback: ())

        // Always save locally too
        LocalScoreManager.shared.saveScore(score)
    }
}
```

## Decision Trees

### Leaderboard Type Selection

```
What kind of competition?
├── All-time records (highest score ever)
│   └── CLASSIC LEADERBOARD
│       └── Never resets
│       └── Best for: Total progression, skill ceiling
├── Time-limited competition
│   └── How often should it reset?
│       ├── Daily → RECURRING (24h)
│       ├── Weekly → RECURRING (7d)
│       └── Monthly/Seasonal → RECURRING (custom)
└── Multiple metrics to track?
    └── Create MULTIPLE LEADERBOARDS
        └── Example: High Score + Fastest Time + Most Coins
```

### Achievement Design

```
What player behavior to reward?
├── One-time accomplishment
│   └── 100% completion achievement
│   └── Examples: First win, beat final boss, find secret
├── Cumulative progress
│   └── Progressive achievement (0-100%)
│   └── Examples: Collect 1000 coins, play 100 hours
├── Skill demonstration
│   └── Difficulty-tiered achievements
│   └── Examples: Beat level without damage, perfect combo
└── Social engagement
    └── Social achievements
    └── Examples: Play with friend, share score
```

### Authentication Failure Handling

```
Authentication failed?
├── User cancelled
│   └── Allow game to continue
│   └── Disable Game Center features gracefully
│   └── Show "Sign in for leaderboards" prompt occasionally
├── Network error
│   └── Queue scores/achievements locally
│   └── Retry on next app launch
│   └── Submit when connection restored
├── Parental restrictions
│   └── Game Center completely disabled
│   └── Hide all Game Center UI
│   └── Game must work fully offline
└── Account issues
    └── Prompt user to check Settings
    └── Provide fallback functionality
```

## Quality Checklist

### Authentication

- [ ] Authentication attempted at app launch
- [ ] Authentication handler properly set on GKLocalPlayer.local
- [ ] UI presented when authentication requires login
- [ ] Game fully playable when not authenticated
- [ ] Authentication state changes handled
- [ ] Player listener registered for invites/challenges

### Leaderboards

- [ ] Scores submitted after game completion
- [ ] Local high score saved regardless of authentication
- [ ] Leaderboard UI accessible from menu
- [ ] Score format matches App Store Connect configuration
- [ ] Multiple leaderboards use batch submission when possible
- [ ] Friends leaderboard option available

### Achievements

- [ ] Progress tracked locally in addition to Game Center
- [ ] Achievements queued when offline
- [ ] Queued achievements submitted when authenticated
- [ ] Progressive achievements increment properly
- [ ] Banner display enabled for major achievements
- [ ] Achievement descriptions match App Store Connect

### Access Point

- [ ] Access Point configured after successful authentication
- [ ] Access Point hidden during active gameplay
- [ ] Access Point shown in menus and pause screens
- [ ] Highlights enabled for achievement unlocks
- [ ] Position doesn't conflict with game UI

### Error Handling

- [ ] Network errors don't crash game
- [ ] Offline play fully supported
- [ ] Authentication failures handled gracefully
- [ ] Error messages user-friendly (not technical)
- [ ] Retry logic for transient failures

## Anti-Patterns

### 1. Blocking Gameplay on Authentication

**What NOT to do**:
```swift
func startGame() async {
    // WRONG: Waiting for authentication before allowing play
    await GameCenterManager.shared.authenticate()
    guard GameCenterManager.shared.isAuthenticated else {
        showError("You must sign in to Game Center to play!")
        return
    }
    beginGameplay()
}
```

**Consequence**: Users without Game Center or who cancel cannot play, App Store rejection risk

**Correct Approach**:
```swift
func startGame() async {
    // Start authentication in background
    Task {
        await GameCenterManager.shared.authenticate()
    }

    // Always allow gameplay
    beginGameplay()
}

func onGameOver(score: Int) async {
    // Try to submit, but don't require it
    if GameCenterManager.shared.isAuthenticated {
        try? await GameCenterManager.shared.submitScore(score, to: leaderboardID)
    }
    // Always save locally
    saveLocalHighScore(score)
}
```

### 2. Not Finishing Achievements Properly

**What NOT to do**:
```swift
func onCoinCollected() {
    totalCoins += 1
    // WRONG: Submitting achievement on every coin
    Task {
        try? await GameCenterManager.shared.reportAchievement(
            id: "collect1000",
            percentComplete: Double(totalCoins) / 10.0
        )
    }
}
```

**Consequence**: Excessive network calls, rate limiting, battery drain

**Correct Approach**:
```swift
func onCoinCollected() {
    totalCoins += 1

    // Only report at milestones
    let milestones = [100, 250, 500, 750, 1000]
    if milestones.contains(totalCoins) {
        Task {
            try? await GameCenterManager.shared.reportAchievement(
                id: "collect1000",
                percentComplete: Double(totalCoins) / 10.0
            )
        }
    }
}
```

### 3. Ignoring Access Point During Gameplay

**What NOT to do**:
```swift
func configureGameCenter() {
    // WRONG: Leaving Access Point always visible
    GKAccessPoint.shared.isActive = true
    // Never hiding during gameplay
}
```

**Consequence**: Access Point covers game UI, accidental taps interrupt gameplay

**Correct Approach**:
```swift
func onGameplayStart() {
    GKAccessPoint.shared.isActive = false
}

func onGameplayEnd() {
    GKAccessPoint.shared.isActive = true
}
```

### 4. Hardcoding Leaderboard Formats

**What NOT to do**:
```swift
func displayScore(_ entry: GKLeaderboard.Entry) -> String {
    // WRONG: Assuming format instead of using formattedScore
    return "\(entry.score) points"
}
```

**Consequence**: Wrong format for time-based leaderboards, localization issues

**Correct Approach**:
```swift
func displayScore(_ entry: GKLeaderboard.Entry) -> String {
    // Use the formatted score from Game Center
    return entry.formattedScore
}
```

### 5. Not Handling Recurring Leaderboard Resets

**What NOT to do**:
```swift
// Assuming leaderboard persists forever
func showPersonalBest() {
    // WRONG: Showing "all-time" for a daily leaderboard
    Text("Your Best: \(allTimeHighScore)")
}
```

**Consequence**: Confusing UX when recurring leaderboard resets and score disappears

**Correct Approach**:
```swift
func showPersonalBest(for leaderboardID: String, timeScope: GKLeaderboard.TimeScope) {
    switch timeScope {
    case .today:
        Text("Today's Best: \(dailyHighScore)")
    case .week:
        Text("This Week's Best: \(weeklyHighScore)")
    case .allTime:
        Text("All-Time Best: \(allTimeHighScore)")
    }
}
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `app-store-review` | Game Center IDs must be configured in App Store Connect |
| `analytics-integration` | Track Game Center engagement metrics |
| `retention-engineer` | Leaderboards and achievements drive retention |
| `social-mechanics` | Game Center provides social gaming foundation |
| `progression-system` | Achievements should align with progression milestones |
