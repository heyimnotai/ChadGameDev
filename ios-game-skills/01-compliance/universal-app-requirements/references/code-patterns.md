# Universal App Code Patterns

## Size Class Responsive Layout

```swift
import SwiftUI

struct AdaptiveGameView: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.verticalSizeClass) private var verticalSizeClass

    var body: some View {
        Group {
            if horizontalSizeClass == .compact && verticalSizeClass == .regular {
                // iPhone portrait or iPad Split View (narrow)
                iPhonePortraitLayout
            } else if horizontalSizeClass == .compact && verticalSizeClass == .compact {
                // iPhone landscape
                iPhoneLandscapeLayout
            } else {
                // iPad or iPhone Plus landscape
                iPadLayout
            }
        }
    }

    private var iPhonePortraitLayout: some View {
        VStack(spacing: 0) {
            GameHeaderView().frame(height: 60)
            GameBoardView().frame(maxWidth: .infinity, maxHeight: .infinity)
            GameControlsView().frame(height: 120)
        }
    }

    private var iPhoneLandscapeLayout: some View {
        HStack(spacing: 0) {
            GameControlsView().frame(width: 100)
            GameBoardView().frame(maxWidth: .infinity, maxHeight: .infinity)
            VStack { GameHeaderView(); Spacer() }.frame(width: 150)
        }
    }

    private var iPadLayout: some View {
        HStack(spacing: 20) {
            VStack { GameHeaderView(); Spacer(); GameControlsView() }.frame(width: 280)
            GameBoardView().frame(maxWidth: .infinity, maxHeight: .infinity)
            SidebarView().frame(width: 250)
        }
        .padding(20)
    }
}
```

## Scalable Game Board

```swift
struct ScalableGameBoard: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    let gridSize = 8

    var body: some View {
        GeometryReader { geometry in
            let cellSize = calculateCellSize(for: geometry.size)

            ZStack {
                Color.black.opacity(0.1)
                GameGrid(cellSize: cellSize, gridSize: gridSize)
                    .frame(width: cellSize * CGFloat(gridSize),
                           height: cellSize * CGFloat(gridSize))
            }
        }
    }

    private func calculateCellSize(for availableSize: CGSize) -> CGFloat {
        let smallerDimension = min(availableSize.width, availableSize.height)
        let paddingFactor: CGFloat = horizontalSizeClass == .compact ? 0.9 : 0.85
        let maxBoardSize = smallerDimension * paddingFactor
        return max(maxBoardSize / CGFloat(gridSize), 44) // Minimum touch target
    }
}
```

## Safe Area Handling

```swift
struct SafeAreaAwareGameView: View {
    var body: some View {
        GeometryReader { geometry in
            let safeArea = geometry.safeAreaInsets

            ZStack {
                GameBackgroundView().ignoresSafeArea()

                VStack(spacing: 0) {
                    GameHUD()
                        .padding(.top, safeArea.top)
                        .background(Color.black.opacity(0.5))

                    GameplayArea()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)

                    GameControls()
                        .padding(.bottom, safeArea.bottom)
                        .background(Color.black.opacity(0.5))
                }
            }
        }
    }
}
```

## iPad Pointer Support

```swift
struct PointerAwareButton: View {
    let title: String
    let action: () -> Void
    @State private var isHovered = false

    var body: some View {
        Button(action: action) {
            Text(title)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(RoundedRectangle(cornerRadius: 12)
                    .fill(isHovered ? Color.blue.opacity(0.8) : Color.blue))
                .scaleEffect(isHovered ? 1.05 : 1.0)
        }
        .buttonStyle(.plain)
        .onHover { isHovered = $0 }
        .hoverEffect(.lift)
    }
}
```

## iPad Keyboard Support

```swift
struct KeyboardEnabledGame: View {
    @State private var playerPosition: CGPoint = .zero
    @FocusState private var isFocused: Bool

    var body: some View {
        GameView(playerPosition: $playerPosition)
            .focusable()
            .focused($isFocused)
            .onKeyPress(.leftArrow) { movePlayer(dx: -10, dy: 0); return .handled }
            .onKeyPress(.rightArrow) { movePlayer(dx: 10, dy: 0); return .handled }
            .onKeyPress(.upArrow) { movePlayer(dx: 0, dy: -10); return .handled }
            .onKeyPress(.downArrow) { movePlayer(dx: 0, dy: 10); return .handled }
            .onKeyPress(.space) { performAction(); return .handled }
            .onAppear { isFocused = true }
    }
}
```

## Split View Handling

```swift
struct MultitaskingAwareGame: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.scenePhase) private var scenePhase
    @State private var isGamePaused = false

    var body: some View {
        ZStack {
            if horizontalSizeClass == .compact {
                CompactGameView() // Simplified for Split View
            } else {
                FullGameView()
            }
            if isGamePaused { PauseOverlay() }
        }
        .onChange(of: horizontalSizeClass) { newValue in
            if newValue == .compact { isGamePaused = true }
        }
        .onChange(of: scenePhase) { newPhase in
            if newPhase != .active { isGamePaused = true }
        }
    }
}
```

## Orientation Handling

```swift
struct OrientationAdaptiveGame: View {
    @Environment(\.verticalSizeClass) private var verticalSizeClass

    var body: some View {
        GeometryReader { geometry in
            if geometry.size.width > geometry.size.height {
                LandscapeGameLayout()
            } else {
                PortraitGameLayout()
            }
        }
    }
}

// UIKit orientation lock
class GameViewController: UIViewController {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }
    override var shouldAutorotate: Bool { true }
}
```

## Device Detection

```swift
struct ScreenSizeHelper {
    static var isSmallPhone: Bool { UIScreen.main.bounds.height <= 667 }
    static var isLargePhone: Bool { UIScreen.main.bounds.height >= 896 }
    static var isIPad: Bool { UIDevice.current.userInterfaceIdiom == .pad }
    static var isIPadPro12: Bool { isIPad && UIScreen.main.bounds.height >= 1024 }
}
```

## Anti-Patterns to Avoid

```swift
// WRONG: Hardcoded dimensions
.frame(width: 390, height: 600)

// RIGHT: Relative sizing
GeometryReader { geo in
    .frame(width: geo.size.width * 0.9, height: geo.size.height * 0.7)
}

// WRONG: Ignoring safe area
.padding(.top, 20)

// RIGHT: Respecting safe area
.padding(.top) // or .safeAreaInset(edge: .top)

// WRONG: Tiny touch targets
.frame(width: 24, height: 24)

// RIGHT: Proper touch area
.frame(width: 44, height: 44)
.contentShape(Rectangle())
```
