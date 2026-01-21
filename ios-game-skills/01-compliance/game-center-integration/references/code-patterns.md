# Game Center Integration - Code Patterns

## GameCenterManager - Complete Implementation

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

## SwiftUI Integration Views

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

## Access Point Configuration

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

## Authentication Error Handling

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
