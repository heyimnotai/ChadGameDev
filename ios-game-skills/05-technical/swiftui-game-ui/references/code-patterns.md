# SwiftUI Game UI Code Patterns

## Overlay Architecture Template

```swift
import SwiftUI
import SpriteKit

struct GameContainerView: View {
    @StateObject private var gameState = GameState()
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
        }
        .animation(.easeInOut(duration: 0.25), value: gameState.isPaused)
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase != .active && !gameState.isGameOver {
                gameState.isPaused = true
            }
        }
    }
}

final class GameState: ObservableObject {
    @Published var score: Int = 0
    @Published var highScore: Int = UserDefaults.standard.integer(forKey: "highScore")
    @Published var lives: Int = 3
    @Published var isPaused: Bool = false
    @Published var isGameOver: Bool = false
    @Published var isMusicEnabled: Bool = true
    @Published var isSoundEnabled: Bool = true
}
```

## HUD Components

```swift
struct GameHUD: View {
    @ObservedObject var gameState: GameState

    var body: some View {
        VStack {
            HStack {
                ScoreDisplay(score: gameState.score)
                Spacer()
                HUDButton(icon: "pause.fill") {
                    gameState.isPaused = true
                }
            }
            .padding(.horizontal, 16)
            Spacer()
            HStack {
                LivesDisplay(lives: gameState.lives, maxLives: 3)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
        .safeAreaPadding()
    }
}

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
        .onChange(of: score) { old, new in
            animateScoreChange(from: old, to: new)
        }
    }

    private func animateScoreChange(from old: Int, to new: Int) {
        withAnimation(.spring(duration: 0.3)) { isAnimating = true }
        let steps = 20
        let increment = Double(new - old) / Double(steps)
        for step in 0...steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5 * Double(step) / Double(steps)) {
                withAnimation(.easeOut(duration: 0.05)) {
                    displayedScore = old + Int(increment * Double(step))
                }
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            displayedScore = new
            withAnimation(.spring(duration: 0.2)) { isAnimating = false }
        }
    }
}

struct LivesDisplay: View {
    let lives: Int
    let maxLives: Int

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<maxLives, id: \.self) { index in
                Image(systemName: index < lives ? "heart.fill" : "heart")
                    .foregroundStyle(index < lives ? .red : .gray.opacity(0.5))
                    .scaleEffect(index < lives ? 1.0 : 0.8)
                    .animation(.spring(duration: 0.3), value: lives)
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(.ultraThinMaterial, in: Capsule())
    }
}

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
                .onChanged { _ in withAnimation(.easeOut(duration: 0.1)) { isPressed = true } }
                .onEnded { _ in withAnimation(.easeOut(duration: 0.15)) { isPressed = false } }
        )
    }
}
```

## Menu Systems

```swift
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
                    .opacity(0.7)
            }
            .foregroundStyle(.white)
            .padding(.horizontal, 24)
            .padding(.vertical, 18)
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
                .onChanged { _ in withAnimation(.easeOut(duration: 0.1)) { isPressed = true } }
                .onEnded { _ in withAnimation(.spring(duration: 0.3)) { isPressed = false } }
        )
    }
}

struct PauseMenuView: View {
    @ObservedObject var gameState: GameState

    var body: some View {
        ZStack {
            Color.black.opacity(0.6).ignoresSafeArea()
            VStack(spacing: 24) {
                Text("PAUSED")
                    .font(.system(size: 36, weight: .black, design: .rounded))
                    .foregroundStyle(.white)
                VStack(spacing: 12) {
                    PauseButton(title: "Resume", icon: "play.fill", color: .green) {
                        gameState.isPaused = false
                    }
                    PauseButton(title: "Restart", icon: "arrow.counterclockwise", color: .orange) {
                        gameState.reset()
                    }
                    PauseButton(title: "Quit", icon: "xmark", color: .red) {
                        gameState.isGameOver = true
                        gameState.isPaused = false
                    }
                }
            }
            .padding(32)
            .background(RoundedRectangle(cornerRadius: 24).fill(.ultraThinMaterial))
        }
    }
}
```

## TimelineView + Canvas Game Loop

```swift
struct CanvasGameView: View {
    @StateObject private var game = CanvasGameEngine()

    var body: some View {
        TimelineView(.animation) { timeline in
            Canvas { context, size in
                game.render(context: context, size: size)
            }
            .onChange(of: timeline.date) { _, newDate in
                game.update(currentTime: newDate.timeIntervalSinceReferenceDate)
            }
        }
        .ignoresSafeArea()
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { game.handleTouch(at: $0.location) }
                .onEnded { _ in game.handleTouchEnded() }
        )
    }
}

@MainActor
final class CanvasGameEngine: ObservableObject {
    private var playerPosition: CGPoint = CGPoint(x: 200, y: 400)
    private var lastUpdateTime: TimeInterval = 0

    func update(currentTime: TimeInterval) {
        if lastUpdateTime == 0 { lastUpdateTime = currentTime }
        let deltaTime = min(currentTime - lastUpdateTime, 1.0 / 30.0)
        lastUpdateTime = currentTime
        // Update game logic with deltaTime
    }

    func render(context: GraphicsContext, size: CGSize) {
        context.fill(Path(CGRect(origin: .zero, size: size)), with: .color(.black))
        let playerRect = CGRect(x: playerPosition.x - 20, y: playerPosition.y - 20, width: 40, height: 40)
        context.fill(Path(ellipseIn: playerRect), with: .color(.blue))
    }

    func handleTouch(at location: CGPoint) { /* Touch handling */ }
    func handleTouchEnded() { /* Touch end handling */ }
}
```

## CADisplayLink Integration

```swift
struct CADisplayLinkGameView: UIViewRepresentable {
    @ObservedObject var gameState: GameState

    func makeUIView(context: Context) -> GameRenderView {
        let view = GameRenderView()
        view.startDisplayLink()
        return view
    }

    func updateUIView(_ uiView: GameRenderView, context: Context) {}

    static func dismantleUIView(_ uiView: GameRenderView, coordinator: ()) {
        uiView.stopDisplayLink()
    }
}

final class GameRenderView: UIView {
    private var displayLink: CADisplayLink?
    private var lastTimestamp: TimeInterval = 0

    func startDisplayLink() {
        displayLink = CADisplayLink(target: self, selector: #selector(update))
        displayLink?.preferredFrameRateRange = CAFrameRateRange(minimum: 60, maximum: 120, preferred: 120)
        displayLink?.add(to: .main, forMode: .common)
    }

    func stopDisplayLink() {
        displayLink?.invalidate()
        displayLink = nil
    }

    @objc private func update(_ displayLink: CADisplayLink) {
        let currentTime = displayLink.targetTimestamp
        if lastTimestamp == 0 { lastTimestamp = currentTime }
        let deltaTime = currentTime - lastTimestamp
        lastTimestamp = currentTime
        // Update and render
        setNeedsDisplay()
    }
}
```

## Settings Screen

```swift
struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @AppStorage("musicEnabled") private var musicEnabled = true
    @AppStorage("soundEnabled") private var soundEnabled = true
    @AppStorage("hapticsEnabled") private var hapticsEnabled = true

    var body: some View {
        NavigationStack {
            List {
                Section("Audio & Feedback") {
                    SettingsToggle(title: "Music", icon: "music.note", iconColor: .pink, isOn: $musicEnabled)
                    SettingsToggle(title: "Sound Effects", icon: "speaker.wave.2.fill", iconColor: .blue, isOn: $soundEnabled)
                    SettingsToggle(title: "Haptics", icon: "iphone.radiowaves.left.and.right", iconColor: .purple, isOn: $hapticsEnabled)
                }
                Section("Account") {
                    SettingsLink(title: "Restore Purchases", icon: "arrow.clockwise", iconColor: .green) { }
                    SettingsLink(title: "Privacy Policy", icon: "hand.raised.fill", iconColor: .blue) { }
                }
            }
            .navigationTitle("Settings")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
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
                    .foregroundStyle(.white)
                    .frame(width: 28, height: 28)
                    .background(iconColor, in: RoundedRectangle(cornerRadius: 6))
                Text(title)
            }
        }
    }
}
```

## Store UI

```swift
struct StoreView: View {
    @ObservedObject var storeManager: StoreManager
    @ObservedObject var gameState: GameState

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    StoreCurrencyHeader(coins: gameState.coins)
                    StoreSection(title: "Coin Packs") {
                        ForEach(storeManager.coinPacks) { pack in
                            CoinPackCard(pack: pack) {
                                Task { await storeManager.purchase(pack) }
                            }
                        }
                    }
                    Button("Restore Purchases") {
                        Task { await storeManager.restorePurchases() }
                    }
                }
                .padding()
            }
            .navigationTitle("Store")
        }
    }
}

struct CoinPackCard: View {
    let pack: CoinPack
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                // Coin stack visual
                VStack(alignment: .leading) {
                    HStack {
                        Text("\(pack.coins)")
                            .font(.system(size: 20, weight: .bold))
                        if pack.bonusCoins > 0 {
                            Text("+\(pack.bonusCoins)")
                                .foregroundStyle(.green)
                        }
                    }
                    Text("Coins").foregroundStyle(.secondary)
                }
                Spacer()
                Text(pack.price)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(.blue, in: RoundedRectangle(cornerRadius: 8))
            }
            .padding()
            .background(Color(.systemBackground), in: RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }
}
```

## Achievement Notification

```swift
struct AchievementNotification: View {
    let achievement: AchievementData
    @Binding var isShowing: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: achievement.icon)
                .font(.system(size: 28))
                .foregroundStyle(.yellow)
                .frame(width: 48, height: 48)
                .background(.yellow.opacity(0.2), in: Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text("Achievement Unlocked!")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(.secondary)
                Text(achievement.title)
                    .font(.system(size: 16, weight: .bold))
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
        .transition(.move(edge: .top).combined(with: .opacity))
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                withAnimation { isShowing = false }
            }
        }
    }
}
```
