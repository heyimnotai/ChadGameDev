---
name: swiftui-game-ui
description: Implements SwiftUI patterns for game user interface layers including HUDs, menus, settings, leaderboards, achievement displays, store/IAP screens, and pause handling. Use this skill when building UI overlays for games, implementing TimelineView+Canvas game loops, integrating CADisplayLink with SwiftUI, or creating reusable game UI components. Triggers on any game UI construction, menu system design, or SwiftUI-based game rendering needs.
---

# SwiftUI Game UI

## Purpose

This skill enables Claude to build production-quality game UI layers using SwiftUI. It covers overlay architecture for SpriteKit/Metal games, standalone SwiftUI-based game rendering with TimelineView+Canvas, and comprehensive UI component libraries for menus, HUDs, stores, and social features. The quality bar ensures responsive, animated interfaces that match top 10% App Store game polish standards.

## Domain Boundaries

- **This skill handles**:
  - Game UI overlay architecture (SwiftUI on SpriteKit/Metal)
  - HUD components (score, lives, timers, progress bars)
  - Menu systems (main menu, pause, game over)
  - Settings screens with game-appropriate controls
  - Leaderboard display integration with Game Center
  - Achievement UI and unlock notifications
  - Store/IAP purchase flows
  - Pause handling and app lifecycle
  - TimelineView + Canvas game loops (iOS 15+)
  - CADisplayLink integration with SwiftUI
  - Reusable game UI component library

- **This skill does NOT handle**:
  - SpriteKit scene implementation (see: spritekit-patterns)
  - Frame rate optimization and profiling (see: performance-optimizer)
  - IAP StoreKit implementation logic (see: 01-compliance/iap-implementation)
  - Game Center API integration (see: 01-compliance/game-center-integration)
  - Analytics event tracking (see: analytics-integration)

## Core Specifications

### Touch Target Specifications

| Element | Minimum Size | Recommended Size |
|---------|--------------|------------------|
| Buttons | 44x44 pt | 48-60 pt |
| List items | 44 pt height | 48 pt height |
| Slider thumb | 44x44 pt | - |
| Close/dismiss | 44x44 pt | - |

### Animation Timing

| Transition | Duration | Easing |
|------------|----------|--------|
| Button press | 100-150ms | ease-out |
| Screen transition | 200-400ms | ease-in-out |
| Score increment | 500-1000ms | ease-out |
| Notification appear | 300ms | spring |
| Menu slide | 250ms | ease-out |

### Safe Area Requirements

| Device Feature | Handling |
|----------------|----------|
| Notch/Dynamic Island | Use `.ignoresSafeArea()` for game, respect for UI |
| Home indicator | 34 pt bottom padding on Face ID devices |
| Landscape notch | 44 pt horizontal padding |

## Implementation Patterns

### Overlay Architecture

```swift
import SwiftUI
import SpriteKit

// MARK: - Main Game Container

struct GameContainerView: View {
    @StateObject private var gameState = GameState()
    @StateObject private var storeManager = StoreManager()
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ZStack {
            // Layer 1: Game rendering (SpriteKit)
            GameSpriteView(gameState: gameState)
                .ignoresSafeArea()

            // Layer 2: HUD overlay
            if !gameState.isPaused && !gameState.isGameOver {
                GameHUD(gameState: gameState)
            }

            // Layer 3: Pause menu
            if gameState.isPaused {
                PauseMenuView(gameState: gameState)
                    .transition(.opacity.combined(with: .scale(scale: 0.9)))
            }

            // Layer 4: Game over screen
            if gameState.isGameOver {
                GameOverView(gameState: gameState)
                    .transition(.opacity.combined(with: .move(edge: .bottom)))
            }

            // Layer 5: Store overlay
            if gameState.isStoreOpen {
                StoreView(storeManager: storeManager, gameState: gameState)
                    .transition(.move(edge: .trailing))
            }
        }
        .animation(.easeInOut(duration: 0.25), value: gameState.isPaused)
        .animation(.easeInOut(duration: 0.3), value: gameState.isGameOver)
        .animation(.easeOut(duration: 0.25), value: gameState.isStoreOpen)
        .onChange(of: scenePhase) { oldPhase, newPhase in
            handleScenePhaseChange(from: oldPhase, to: newPhase)
        }
    }

    private func handleScenePhaseChange(from oldPhase: ScenePhase, to newPhase: ScenePhase) {
        switch newPhase {
        case .inactive, .background:
            if !gameState.isPaused && !gameState.isGameOver {
                gameState.isPaused = true
            }
        case .active:
            // Resume is manual via pause menu
            break
        @unknown default:
            break
        }
    }
}

// MARK: - Game State Observable

final class GameState: ObservableObject {
    // Score and progress
    @Published var score: Int = 0
    @Published var highScore: Int = UserDefaults.standard.integer(forKey: "highScore")
    @Published var level: Int = 1
    @Published var lives: Int = 3
    @Published var coins: Int = 0

    // Game flow
    @Published var isPaused: Bool = false
    @Published var isGameOver: Bool = false
    @Published var isStoreOpen: Bool = false
    @Published var showAchievement: AchievementData? = nil

    // Settings
    @Published var isMusicEnabled: Bool = true
    @Published var isSoundEnabled: Bool = true
    @Published var isHapticsEnabled: Bool = true

    func reset() {
        score = 0
        level = 1
        lives = 3
        isPaused = false
        isGameOver = false
    }

    func updateHighScore() {
        if score > highScore {
            highScore = score
            UserDefaults.standard.set(highScore, forKey: "highScore")
        }
    }
}

struct AchievementData: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let icon: String
}
```

### HUD Implementation

```swift
import SwiftUI

struct GameHUD: View {
    @ObservedObject var gameState: GameState

    var body: some View {
        VStack {
            // Top bar
            HStack {
                // Score
                ScoreDisplay(score: gameState.score)

                Spacer()

                // Coins
                CurrencyDisplay(
                    amount: gameState.coins,
                    icon: "coin",
                    color: .yellow
                )

                // Pause button
                HUDButton(icon: "pause.fill") {
                    gameState.isPaused = true
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)

            Spacer()

            // Bottom bar
            HStack {
                // Lives
                LivesDisplay(lives: gameState.lives, maxLives: 3)

                Spacer()

                // Level indicator
                LevelIndicator(level: gameState.level)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .safeAreaPadding()
    }
}

// MARK: - Score Display with Animation

struct ScoreDisplay: View {
    let score: Int
    @State private var displayedScore: Int = 0
    @State private var isAnimating: Bool = false

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "star.fill")
                .foregroundStyle(.yellow)
                .scaleEffect(isAnimating ? 1.2 : 1.0)

            Text("\(displayedScore)")
                .font(.system(size: 24, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
                .contentTransition(.numericText())
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial, in: Capsule())
        .onChange(of: score) { oldValue, newValue in
            animateScoreChange(from: oldValue, to: newValue)
        }
    }

    private func animateScoreChange(from oldValue: Int, to newValue: Int) {
        // Trigger icon pulse
        withAnimation(.spring(duration: 0.3)) {
            isAnimating = true
        }

        // Animate number counting
        let duration: Double = 0.5
        let steps = 20
        let increment = Double(newValue - oldValue) / Double(steps)

        for step in 0...steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + duration * Double(step) / Double(steps)) {
                withAnimation(.easeOut(duration: 0.05)) {
                    displayedScore = oldValue + Int(increment * Double(step))
                }
            }
        }

        // Ensure final value
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            displayedScore = newValue
            withAnimation(.spring(duration: 0.2)) {
                isAnimating = false
            }
        }
    }
}

// MARK: - Currency Display

struct CurrencyDisplay: View {
    let amount: Int
    let icon: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            Image(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)

            Text("\(amount)")
                .font(.system(size: 18, weight: .semibold, design: .rounded))
                .foregroundStyle(.white)
                .contentTransition(.numericText())
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(color.opacity(0.3), in: Capsule())
        .overlay(Capsule().stroke(color.opacity(0.5), lineWidth: 1))
    }
}

// MARK: - Lives Display

struct LivesDisplay: View {
    let lives: Int
    let maxLives: Int

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<maxLives, id: \.self) { index in
                Image(systemName: index < lives ? "heart.fill" : "heart")
                    .foregroundStyle(index < lives ? .red : .gray.opacity(0.5))
                    .font(.system(size: 20))
                    .scaleEffect(index < lives ? 1.0 : 0.8)
                    .animation(.spring(duration: 0.3), value: lives)
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(.ultraThinMaterial, in: Capsule())
    }
}

// MARK: - Level Indicator

struct LevelIndicator: View {
    let level: Int

    var body: some View {
        Text("Level \(level)")
            .font(.system(size: 16, weight: .semibold, design: .rounded))
            .foregroundStyle(.white)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(.blue.opacity(0.6), in: Capsule())
    }
}

// MARK: - HUD Button

struct HUDButton: View {
    let icon: String
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 44, height: 44)
                .background(.ultraThinMaterial, in: Circle())
                .scaleEffect(isPressed ? 0.9 : 1.0)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    withAnimation(.easeOut(duration: 0.1)) {
                        isPressed = true
                    }
                }
                .onEnded { _ in
                    withAnimation(.easeOut(duration: 0.15)) {
                        isPressed = false
                    }
                }
        )
    }
}
```

### Menu Systems

```swift
import SwiftUI

// MARK: - Main Menu

struct MainMenuView: View {
    @Binding var isPlaying: Bool
    @State private var showSettings = false
    @State private var showLeaderboard = false
    @State private var buttonScale: [Int: CGFloat] = [:]

    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                colors: [.indigo.opacity(0.8), .purple.opacity(0.6)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 32) {
                Spacer()

                // Title
                VStack(spacing: 8) {
                    Text("GAME TITLE")
                        .font(.system(size: 48, weight: .black, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.white, .yellow],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .shadow(color: .black.opacity(0.3), radius: 4, y: 4)

                    Text("Subtitle or tagline")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundStyle(.white.opacity(0.8))
                }

                Spacer()

                // Menu buttons
                VStack(spacing: 16) {
                    MenuButton(title: "Play", icon: "play.fill", color: .green) {
                        isPlaying = true
                    }

                    MenuButton(title: "Leaderboard", icon: "trophy.fill", color: .yellow) {
                        showLeaderboard = true
                    }

                    MenuButton(title: "Settings", icon: "gearshape.fill", color: .gray) {
                        showSettings = true
                    }
                }
                .padding(.horizontal, 32)

                Spacer()

                // Version
                Text("v1.0.0")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.5))
                    .padding(.bottom, 16)
            }
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
        .sheet(isPresented: $showLeaderboard) {
            LeaderboardView()
        }
    }
}

// MARK: - Menu Button

struct MenuButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 24, weight: .semibold))

                Text(title)
                    .font(.system(size: 22, weight: .bold, design: .rounded))

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 18, weight: .semibold))
                    .opacity(0.7)
            }
            .foregroundStyle(.white)
            .padding(.horizontal, 24)
            .padding(.vertical, 18)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(color.gradient)
                    .shadow(color: color.opacity(0.4), radius: 8, y: 4)
            )
            .scaleEffect(isPressed ? 0.95 : 1.0)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    withAnimation(.easeOut(duration: 0.1)) {
                        isPressed = true
                    }
                }
                .onEnded { _ in
                    withAnimation(.spring(duration: 0.3)) {
                        isPressed = false
                    }
                }
        )
    }
}

// MARK: - Pause Menu

struct PauseMenuView: View {
    @ObservedObject var gameState: GameState
    @State private var showSettings = false

    var body: some View {
        ZStack {
            // Dimmed background
            Color.black.opacity(0.6)
                .ignoresSafeArea()

            // Menu card
            VStack(spacing: 24) {
                Text("PAUSED")
                    .font(.system(size: 36, weight: .black, design: .rounded))
                    .foregroundStyle(.white)

                VStack(spacing: 12) {
                    PauseButton(title: "Resume", icon: "play.fill", color: .green) {
                        gameState.isPaused = false
                    }

                    PauseButton(title: "Settings", icon: "gearshape.fill", color: .blue) {
                        showSettings = true
                    }

                    PauseButton(title: "Restart", icon: "arrow.counterclockwise", color: .orange) {
                        gameState.reset()
                        gameState.isPaused = false
                    }

                    PauseButton(title: "Quit", icon: "xmark", color: .red) {
                        gameState.isGameOver = true
                        gameState.isPaused = false
                    }
                }
            }
            .padding(32)
            .background(
                RoundedRectangle(cornerRadius: 24)
                    .fill(.ultraThinMaterial)
                    .shadow(color: .black.opacity(0.3), radius: 20)
            )
            .padding(.horizontal, 48)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
    }
}

struct PauseButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .frame(width: 24)

                Text(title)
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(color, in: RoundedRectangle(cornerRadius: 12))
            .scaleEffect(isPressed ? 0.95 : 1.0)
        }
        .buttonStyle(.plain)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    withAnimation(.easeOut(duration: 0.05)) {
                        isPressed = true
                    }
                }
                .onEnded { _ in
                    withAnimation(.easeOut(duration: 0.1)) {
                        isPressed = false
                    }
                }
        )
    }
}

// MARK: - Game Over

struct GameOverView: View {
    @ObservedObject var gameState: GameState
    @State private var showShare = false

    var body: some View {
        ZStack {
            Color.black.opacity(0.7)
                .ignoresSafeArea()

            VStack(spacing: 32) {
                // Title
                Text("GAME OVER")
                    .font(.system(size: 42, weight: .black, design: .rounded))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.red, .orange],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )

                // Score display
                VStack(spacing: 8) {
                    Text("SCORE")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.7))

                    Text("\(gameState.score)")
                        .font(.system(size: 56, weight: .black, design: .rounded))
                        .foregroundStyle(.white)

                    if gameState.score >= gameState.highScore {
                        Text("NEW HIGH SCORE!")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundStyle(.yellow)
                            .padding(.top, 4)
                    } else {
                        Text("Best: \(gameState.highScore)")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(.white.opacity(0.6))
                    }
                }

                // Stats
                HStack(spacing: 32) {
                    StatItem(title: "Level", value: "\(gameState.level)")
                    StatItem(title: "Coins", value: "\(gameState.coins)")
                }

                // Buttons
                VStack(spacing: 12) {
                    MenuButton(title: "Play Again", icon: "arrow.counterclockwise", color: .green) {
                        gameState.reset()
                    }

                    MenuButton(title: "Share Score", icon: "square.and.arrow.up", color: .blue) {
                        showShare = true
                    }

                    MenuButton(title: "Main Menu", icon: "house.fill", color: .gray) {
                        // Navigate to main menu
                    }
                }
                .padding(.horizontal, 32)
            }
            .padding(.vertical, 48)
        }
        .onAppear {
            gameState.updateHighScore()
        }
        .sheet(isPresented: $showShare) {
            ShareSheet(score: gameState.score)
        }
    }
}

struct StatItem: View {
    let title: String
    let value: String

    var body: some View {
        VStack(spacing: 4) {
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.white.opacity(0.6))

            Text(value)
                .font(.system(size: 28, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
        }
    }
}
```

### Settings Screen

```swift
import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @AppStorage("musicEnabled") private var musicEnabled = true
    @AppStorage("soundEnabled") private var soundEnabled = true
    @AppStorage("hapticsEnabled") private var hapticsEnabled = true
    @AppStorage("notificationsEnabled") private var notificationsEnabled = true

    var body: some View {
        NavigationStack {
            List {
                // Audio section
                Section {
                    SettingsToggle(
                        title: "Music",
                        icon: "music.note",
                        iconColor: .pink,
                        isOn: $musicEnabled
                    )

                    SettingsToggle(
                        title: "Sound Effects",
                        icon: "speaker.wave.2.fill",
                        iconColor: .blue,
                        isOn: $soundEnabled
                    )

                    SettingsToggle(
                        title: "Haptics",
                        icon: "iphone.radiowaves.left.and.right",
                        iconColor: .purple,
                        isOn: $hapticsEnabled
                    )
                } header: {
                    Text("Audio & Feedback")
                }

                // Notifications section
                Section {
                    SettingsToggle(
                        title: "Push Notifications",
                        icon: "bell.fill",
                        iconColor: .orange,
                        isOn: $notificationsEnabled
                    )
                } header: {
                    Text("Notifications")
                }

                // Account section
                Section {
                    SettingsLink(
                        title: "Restore Purchases",
                        icon: "arrow.clockwise",
                        iconColor: .green
                    ) {
                        // Restore IAP
                    }

                    SettingsLink(
                        title: "Privacy Policy",
                        icon: "hand.raised.fill",
                        iconColor: .blue
                    ) {
                        // Open privacy policy
                    }

                    SettingsLink(
                        title: "Terms of Service",
                        icon: "doc.text.fill",
                        iconColor: .gray
                    ) {
                        // Open terms
                    }
                } header: {
                    Text("Account")
                }

                // About section
                Section {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundStyle(.secondary)
                    }

                    SettingsLink(
                        title: "Rate This Game",
                        icon: "star.fill",
                        iconColor: .yellow
                    ) {
                        // Request review
                    }
                } header: {
                    Text("About")
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

struct SettingsToggle: View {
    let title: String
    let icon: String
    let iconColor: Color
    @Binding var isOn: Bool

    var body: some View {
        Toggle(isOn: $isOn) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 28, height: 28)
                    .background(iconColor, in: RoundedRectangle(cornerRadius: 6))

                Text(title)
            }
        }
        .tint(.blue)
    }
}

struct SettingsLink: View {
    let title: String
    let icon: String
    let iconColor: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 28, height: 28)
                    .background(iconColor, in: RoundedRectangle(cornerRadius: 6))

                Text(title)
                    .foregroundStyle(.primary)

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.secondary)
            }
        }
    }
}
```

### Leaderboard Display

```swift
import SwiftUI
import GameKit

struct LeaderboardView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = LeaderboardViewModel()
    @State private var selectedScope: LeaderboardScope = .global

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Scope picker
                Picker("Scope", selection: $selectedScope) {
                    Text("Global").tag(LeaderboardScope.global)
                    Text("Friends").tag(LeaderboardScope.friends)
                }
                .pickerStyle(.segmented)
                .padding()

                // Leaderboard list
                if viewModel.isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if viewModel.entries.isEmpty {
                    ContentUnavailableView(
                        "No Scores Yet",
                        systemImage: "trophy",
                        description: Text("Be the first to set a high score!")
                    )
                } else {
                    ScrollView {
                        LazyVStack(spacing: 8) {
                            ForEach(viewModel.entries) { entry in
                                LeaderboardRow(entry: entry)
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Leaderboard")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            viewModel.loadLeaderboard(scope: selectedScope)
        }
        .onChange(of: selectedScope) { _, newScope in
            viewModel.loadLeaderboard(scope: newScope)
        }
    }
}

enum LeaderboardScope {
    case global
    case friends
}

struct LeaderboardEntry: Identifiable {
    let id = UUID()
    let rank: Int
    let playerName: String
    let score: Int
    let isCurrentPlayer: Bool
    var avatarImage: UIImage?
}

struct LeaderboardRow: View {
    let entry: LeaderboardEntry

    var body: some View {
        HStack(spacing: 12) {
            // Rank
            RankBadge(rank: entry.rank)

            // Avatar
            if let image = entry.avatarImage {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 44, height: 44)
                    .clipShape(Circle())
            } else {
                Image(systemName: "person.circle.fill")
                    .resizable()
                    .frame(width: 44, height: 44)
                    .foregroundStyle(.gray)
            }

            // Name
            Text(entry.playerName)
                .font(.system(size: 16, weight: entry.isCurrentPlayer ? .bold : .medium))
                .foregroundStyle(entry.isCurrentPlayer ? .blue : .primary)

            Spacer()

            // Score
            Text("\(entry.score)")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(entry.isCurrentPlayer ? Color.blue.opacity(0.1) : Color(.systemBackground))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(entry.isCurrentPlayer ? Color.blue.opacity(0.3) : Color.clear, lineWidth: 2)
        )
    }
}

struct RankBadge: View {
    let rank: Int

    var body: some View {
        Group {
            switch rank {
            case 1:
                Image(systemName: "trophy.fill")
                    .foregroundStyle(.yellow)
            case 2:
                Image(systemName: "trophy.fill")
                    .foregroundStyle(.gray)
            case 3:
                Image(systemName: "trophy.fill")
                    .foregroundStyle(.orange)
            default:
                Text("#\(rank)")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(.secondary)
            }
        }
        .frame(width: 32)
    }
}

@MainActor
final class LeaderboardViewModel: ObservableObject {
    @Published var entries: [LeaderboardEntry] = []
    @Published var isLoading = false

    func loadLeaderboard(scope: LeaderboardScope) {
        isLoading = true
        // Game Center integration would go here
        // See: 01-compliance/game-center-integration skill

        // Mock data for demonstration
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.entries = [
                LeaderboardEntry(rank: 1, playerName: "Champion", score: 50000, isCurrentPlayer: false),
                LeaderboardEntry(rank: 2, playerName: "ProGamer", score: 45000, isCurrentPlayer: false),
                LeaderboardEntry(rank: 3, playerName: "You", score: 42000, isCurrentPlayer: true),
            ]
            self.isLoading = false
        }
    }
}
```

### Achievement UI

```swift
import SwiftUI

// MARK: - Achievement Notification

struct AchievementNotification: View {
    let achievement: AchievementData
    @Binding var isShowing: Bool

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                // Icon
                Image(systemName: achievement.icon)
                    .font(.system(size: 28))
                    .foregroundStyle(.yellow)
                    .frame(width: 48, height: 48)
                    .background(.yellow.opacity(0.2), in: Circle())

                // Text
                VStack(alignment: .leading, spacing: 2) {
                    Text("Achievement Unlocked!")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(.secondary)

                    Text(achievement.title)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(.primary)

                    Text(achievement.description)
                        .font(.system(size: 13))
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                Spacer()
            }
            .padding(16)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.15), radius: 10, y: 5)
        }
        .padding(.horizontal, 16)
        .transition(.move(edge: .top).combined(with: .opacity))
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                withAnimation(.easeOut(duration: 0.3)) {
                    isShowing = false
                }
            }
        }
    }
}

// Achievement notification modifier
struct AchievementNotificationModifier: ViewModifier {
    @ObservedObject var gameState: GameState

    func body(content: Content) -> some View {
        content.overlay(alignment: .top) {
            if let achievement = gameState.showAchievement {
                AchievementNotification(
                    achievement: achievement,
                    isShowing: Binding(
                        get: { gameState.showAchievement != nil },
                        set: { if !$0 { gameState.showAchievement = nil } }
                    )
                )
                .padding(.top, 60)
            }
        }
        .animation(.spring(duration: 0.4), value: gameState.showAchievement?.id)
    }
}

extension View {
    func achievementNotifications(gameState: GameState) -> some View {
        modifier(AchievementNotificationModifier(gameState: gameState))
    }
}
```

### Store/IAP UI

```swift
import SwiftUI
import StoreKit

struct StoreView: View {
    @ObservedObject var storeManager: StoreManager
    @ObservedObject var gameState: GameState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Currency display
                    StoreCurrencyHeader(coins: gameState.coins)

                    // Coin packs
                    StoreSection(title: "Coin Packs") {
                        ForEach(storeManager.coinPacks) { pack in
                            CoinPackCard(pack: pack) {
                                Task {
                                    await storeManager.purchase(pack)
                                }
                            }
                        }
                    }

                    // Remove ads
                    if !storeManager.isAdFree {
                        StoreSection(title: "Premium") {
                            RemoveAdsCard(price: storeManager.removeAdsPrice) {
                                Task {
                                    await storeManager.purchaseRemoveAds()
                                }
                            }
                        }
                    }

                    // Restore purchases
                    Button("Restore Purchases") {
                        Task {
                            await storeManager.restorePurchases()
                        }
                    }
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(.secondary)
                    .padding(.top, 8)
                }
                .padding()
            }
            .navigationTitle("Store")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        gameState.isStoreOpen = false
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
    }
}

struct StoreCurrencyHeader: View {
    let coins: Int

    var body: some View {
        HStack {
            Image("coin")
                .resizable()
                .frame(width: 32, height: 32)

            Text("\(coins)")
                .font(.system(size: 28, weight: .bold, design: .rounded))

            Spacer()
        }
        .padding()
        .background(.yellow.opacity(0.15), in: RoundedRectangle(cornerRadius: 16))
    }
}

struct StoreSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 20, weight: .bold))

            content()
        }
    }
}

struct CoinPack: Identifiable {
    let id: String
    let coins: Int
    let bonusCoins: Int
    let price: String
    let isBestValue: Bool
}

struct CoinPackCard: View {
    let pack: CoinPack
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                // Coin stack image
                ZStack {
                    ForEach(0..<min(pack.coins / 100, 5), id: \.self) { index in
                        Image("coin")
                            .resizable()
                            .frame(width: 32, height: 32)
                            .offset(x: CGFloat(index * 4), y: CGFloat(-index * 2))
                    }
                }
                .frame(width: 60)

                // Details
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 4) {
                        Text("\(pack.coins)")
                            .font(.system(size: 20, weight: .bold))

                        if pack.bonusCoins > 0 {
                            Text("+\(pack.bonusCoins)")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(.green)
                        }
                    }

                    Text("Coins")
                        .font(.system(size: 14))
                        .foregroundStyle(.secondary)
                }

                Spacer()

                // Price
                Text(pack.price)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(.blue, in: RoundedRectangle(cornerRadius: 8))
            }
            .padding()
            .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(pack.isBestValue ? Color.yellow : Color.clear, lineWidth: 2)
            )
            .overlay(alignment: .topTrailing) {
                if pack.isBestValue {
                    Text("BEST VALUE")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(.yellow, in: Capsule())
                        .offset(x: -8, y: -8)
                }
            }
        }
        .buttonStyle(.plain)
    }
}

struct RemoveAdsCard: View {
    let price: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: "nosign")
                    .font(.system(size: 32))
                    .foregroundStyle(.red)
                    .frame(width: 60)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Remove Ads")
                        .font(.system(size: 18, weight: .bold))

                    Text("Enjoy ad-free gameplay forever")
                        .font(.system(size: 14))
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Text(price)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(.green, in: RoundedRectangle(cornerRadius: 8))
            }
            .padding()
            .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }
}

// Store Manager placeholder (see iap-implementation skill for full implementation)
@MainActor
final class StoreManager: ObservableObject {
    @Published var coinPacks: [CoinPack] = []
    @Published var isAdFree = false
    @Published var removeAdsPrice = "$2.99"

    func purchase(_ pack: CoinPack) async {}
    func purchaseRemoveAds() async {}
    func restorePurchases() async {}
}
```

### TimelineView + Canvas Game Loop

```swift
import SwiftUI

struct CanvasGameView: View {
    @StateObject private var game = CanvasGameEngine()

    var body: some View {
        TimelineView(.animation) { timeline in
            Canvas { context, size in
                game.render(context: context, size: size)
            }
            .onChange(of: timeline.date) { oldDate, newDate in
                game.update(currentTime: newDate.timeIntervalSinceReferenceDate)
            }
        }
        .ignoresSafeArea()
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { value in
                    game.handleTouch(at: value.location)
                }
                .onEnded { _ in
                    game.handleTouchEnded()
                }
        )
    }
}

@MainActor
final class CanvasGameEngine: ObservableObject {
    // Game state
    private var playerPosition: CGPoint = CGPoint(x: 200, y: 400)
    private var playerVelocity: CGVector = .zero
    private var enemies: [Enemy] = []
    private var bullets: [Bullet] = []

    // Timing
    private var lastUpdateTime: TimeInterval = 0
    private var score: Int = 0

    // Input
    private var touchLocation: CGPoint?

    struct Enemy {
        var position: CGPoint
        var velocity: CGVector
        let size: CGFloat = 30
    }

    struct Bullet {
        var position: CGPoint
        var velocity: CGVector
        let size: CGFloat = 8
    }

    func update(currentTime: TimeInterval) {
        // Calculate delta time
        if lastUpdateTime == 0 {
            lastUpdateTime = currentTime
        }
        let deltaTime = min(currentTime - lastUpdateTime, 1.0 / 30.0)
        lastUpdateTime = currentTime

        // Update player
        if let touch = touchLocation {
            let direction = CGVector(
                dx: touch.x - playerPosition.x,
                dy: touch.y - playerPosition.y
            )
            let length = sqrt(direction.dx * direction.dx + direction.dy * direction.dy)
            if length > 10 {
                let speed: CGFloat = 300
                playerPosition.x += (direction.dx / length) * speed * CGFloat(deltaTime)
                playerPosition.y += (direction.dy / length) * speed * CGFloat(deltaTime)
            }
        }

        // Update enemies
        for i in enemies.indices {
            enemies[i].position.x += enemies[i].velocity.dx * CGFloat(deltaTime)
            enemies[i].position.y += enemies[i].velocity.dy * CGFloat(deltaTime)
        }

        // Update bullets
        for i in bullets.indices {
            bullets[i].position.x += bullets[i].velocity.dx * CGFloat(deltaTime)
            bullets[i].position.y += bullets[i].velocity.dy * CGFloat(deltaTime)
        }

        // Remove offscreen bullets
        bullets.removeAll { $0.position.y < -10 }
    }

    func render(context: GraphicsContext, size: CGSize) {
        // Background
        context.fill(
            Path(CGRect(origin: .zero, size: size)),
            with: .color(.black)
        )

        // Player
        let playerRect = CGRect(
            x: playerPosition.x - 20,
            y: playerPosition.y - 20,
            width: 40,
            height: 40
        )
        context.fill(Path(ellipseIn: playerRect), with: .color(.blue))

        // Enemies
        for enemy in enemies {
            let enemyRect = CGRect(
                x: enemy.position.x - enemy.size / 2,
                y: enemy.position.y - enemy.size / 2,
                width: enemy.size,
                height: enemy.size
            )
            context.fill(Path(ellipseIn: enemyRect), with: .color(.red))
        }

        // Bullets
        for bullet in bullets {
            let bulletRect = CGRect(
                x: bullet.position.x - bullet.size / 2,
                y: bullet.position.y - bullet.size / 2,
                width: bullet.size,
                height: bullet.size
            )
            context.fill(Path(ellipseIn: bulletRect), with: .color(.yellow))
        }

        // Score
        context.draw(
            Text("\(score)")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.white),
            at: CGPoint(x: size.width / 2, y: 50)
        )
    }

    func handleTouch(at location: CGPoint) {
        touchLocation = location
    }

    func handleTouchEnded() {
        touchLocation = nil
        // Fire bullet
        bullets.append(Bullet(
            position: playerPosition,
            velocity: CGVector(dx: 0, dy: -500)
        ))
    }
}
```

### CADisplayLink Integration

```swift
import SwiftUI
import UIKit

struct CADisplayLinkGameView: UIViewRepresentable {
    @ObservedObject var gameState: GameState

    func makeUIView(context: Context) -> GameRenderView {
        let view = GameRenderView()
        view.gameState = gameState
        view.startDisplayLink()
        return view
    }

    func updateUIView(_ uiView: GameRenderView, context: Context) {
        // Update view if needed
    }

    static func dismantleUIView(_ uiView: GameRenderView, coordinator: ()) {
        uiView.stopDisplayLink()
    }
}

final class GameRenderView: UIView {
    weak var gameState: GameState?

    private var displayLink: CADisplayLink?
    private var lastTimestamp: TimeInterval = 0

    func startDisplayLink() {
        displayLink = CADisplayLink(target: self, selector: #selector(update))
        displayLink?.preferredFrameRateRange = CAFrameRateRange(
            minimum: 60,
            maximum: 120,
            preferred: 120
        )
        displayLink?.add(to: .main, forMode: .common)
    }

    func stopDisplayLink() {
        displayLink?.invalidate()
        displayLink = nil
    }

    @objc private func update(_ displayLink: CADisplayLink) {
        // Use targetTimestamp for accurate timing
        let currentTime = displayLink.targetTimestamp

        if lastTimestamp == 0 {
            lastTimestamp = currentTime
        }

        let deltaTime = currentTime - lastTimestamp
        lastTimestamp = currentTime

        // Update game logic
        updateGame(deltaTime: deltaTime)

        // Trigger redraw
        setNeedsDisplay()
    }

    private func updateGame(deltaTime: TimeInterval) {
        // Game update logic
    }

    override func draw(_ rect: CGRect) {
        guard let context = UIGraphicsGetCurrentContext() else { return }

        // Render game
        context.setFillColor(UIColor.black.cgColor)
        context.fill(rect)

        // Draw game objects...
    }
}
```

## Decision Trees

### Game Rendering Approach Selection

```
What type of game?
├─ Simple puzzle/card game (< 100 moving elements)
│   └─ Use SwiftUI TimelineView + Canvas
├─ Physics-based 2D game
│   └─ Use SpriteKit with SwiftUI overlay
├─ Fast action game requiring 120Hz
│   └─ Use SpriteKit or CADisplayLink
├─ UI-heavy with minimal animation
│   └─ Pure SwiftUI with standard animations
└─ Complex 3D or custom rendering
    └─ Use Metal with SwiftUI overlay
```

### Menu System Architecture

```
How many screens in menu system?
├─ 1-3 screens
│   └─ Use sheet presentations
├─ 4+ screens with hierarchy
│   └─ Use NavigationStack
├─ Persistent menu overlay
│   └─ Use ZStack layers with transitions
└─ Full-screen takeover menus
    └─ Use fullScreenCover
```

## Quality Checklist

### Touch Targets
- [ ] All buttons minimum 44x44 pt
- [ ] Adequate spacing between interactive elements (8+ pt)
- [ ] Touch feedback on all interactive elements

### Animations
- [ ] Button press feedback < 150ms
- [ ] Screen transitions 200-400ms
- [ ] Score animations use counting effect
- [ ] All transitions use appropriate easing

### Safe Areas
- [ ] Game content uses `.ignoresSafeArea()`
- [ ] UI elements respect safe areas
- [ ] Home indicator area clear of critical controls
- [ ] Notch/Dynamic Island accounted for

### State Management
- [ ] Game state uses ObservableObject
- [ ] UI updates on main thread
- [ ] Pause triggered on app backgrounding
- [ ] State persisted appropriately

### Performance
- [ ] No unnecessary re-renders
- [ ] Heavy computations off main thread
- [ ] Images properly sized and cached
- [ ] Lazy loading for lists

## Anti-Patterns

### DO NOT: Block UI with game updates

```swift
// WRONG - Game logic in SwiftUI view body
var body: some View {
    Canvas { context, size in
        // Heavy computation here blocks UI
        for _ in 0..<10000 {
            calculatePhysics()
        }
    }
}

// CORRECT - Game logic in update, only rendering in Canvas
var body: some View {
    TimelineView(.animation) { timeline in
        Canvas { context, size in
            // Only render pre-calculated state
            game.render(context: context, size: size)
        }
        .onChange(of: timeline.date) { _, date in
            // Update logic separate from render
            game.update(time: date.timeIntervalSinceReferenceDate)
        }
    }
}
```

### DO NOT: Use fixed sizes for universal apps

```swift
// WRONG - Fixed button size
Button("Play") { }
    .frame(width: 200, height: 50)

// CORRECT - Responsive sizing
Button("Play") { }
    .frame(maxWidth: .infinity)
    .frame(height: 50)
    .padding(.horizontal, 32)
```

### DO NOT: Ignore pause on background

```swift
// WRONG - Game continues when app backgrounds
struct GameView: View {
    var body: some View {
        GameContent()
        // No lifecycle handling
    }
}

// CORRECT - Pause on background
struct GameView: View {
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var gameState = GameState()

    var body: some View {
        GameContent(gameState: gameState)
            .onChange(of: scenePhase) { _, newPhase in
                if newPhase != .active {
                    gameState.isPaused = true
                }
            }
    }
}
```

## Adjacent Skills

- **spritekit-patterns**: Use SpriteView for game rendering with SwiftUI UI overlays
- **performance-optimizer**: Ensure UI animations maintain 60fps target
- **01-compliance/iap-implementation**: Full StoreKit integration for store UI
- **01-compliance/game-center-integration**: Game Center API for leaderboard data
- **03-player-psychology/onboarding-architect**: Design effective FTUE flows
