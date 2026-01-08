---
name: universal-app-requirements
description: Implements proper iPhone and iPad universal app support for iOS games including size classes, asset scaling, iPad-specific features, multitasking, and adaptive layouts. Use this skill when creating a new game targeting multiple iOS devices, adapting an iPhone-only game to iPad, handling orientation changes, implementing safe area layouts, or responding to device compatibility rejections. Triggers include: new project setup, iPad support addition, layout issues, orientation handling, multitasking implementation.
---

# Universal App Requirements

## Purpose

This skill enables Claude agents to build iOS games that work flawlessly across all iPhone and iPad screen sizes. It covers size class handling, asset scaling, iPad-specific input methods, Split View/Slide Over support, launch screens, orientation handling, and safe area management. Games following this skill provide native-quality experiences on every device and avoid the common rejection reasons related to iPad compatibility.

## Domain Boundaries

- **This skill handles**: Size class responsive layouts, @1x/@2x/@3x asset scaling, iPad pointer/keyboard/hover support, Split View and Slide Over handling, launch screen configuration, orientation management, safe area insets, adaptive game UI patterns
- **This skill does NOT handle**: App Store submission (see `app-store-review` skill), game-specific UI design patterns (see `swiftui-game-ui` skill), performance optimization (see `performance-optimizer` skill)

## Core Specifications

### Size Class Reference

| Device Configuration | Width Class | Height Class |
|---------------------|-------------|--------------|
| iPhone Portrait | Compact | Regular |
| iPhone Landscape | Compact | Compact |
| iPhone Plus/Max Landscape | Regular | Compact |
| iPad Portrait (Full Screen) | Regular | Regular |
| iPad Landscape (Full Screen) | Regular | Regular |
| iPad Split View (1/3) | Compact | Regular |
| iPad Split View (1/2) | Compact | Regular |
| iPad Split View (2/3) | Regular | Regular |
| iPad Slide Over | Compact | Regular |

### Screen Dimensions (Points)

| Device | Portrait (W x H) | Landscape (W x H) | Scale |
|--------|-----------------|-------------------|-------|
| iPhone SE (3rd) | 375 x 667 | 667 x 375 | @2x |
| iPhone 14 | 390 x 844 | 844 x 390 | @3x |
| iPhone 14 Plus | 428 x 926 | 926 x 428 | @3x |
| iPhone 14 Pro | 393 x 852 | 852 x 393 | @3x |
| iPhone 14 Pro Max | 430 x 932 | 932 x 430 | @3x |
| iPhone 15 Pro Max | 430 x 932 | 932 x 430 | @3x |
| iPad (10th gen) | 820 x 1180 | 1180 x 820 | @2x |
| iPad Air (5th) | 820 x 1180 | 1180 x 820 | @2x |
| iPad Pro 11" | 834 x 1194 | 1194 x 834 | @2x |
| iPad Pro 12.9" | 1024 x 1366 | 1366 x 1024 | @2x |

### Safe Area Insets (Typical Values)

| Device/Feature | Top | Bottom | Left | Right |
|---------------|-----|--------|------|-------|
| iPhone (no notch) | 20 | 0 | 0 | 0 |
| iPhone (notch/Dynamic Island) Portrait | 59 | 34 | 0 | 0 |
| iPhone (notch/Dynamic Island) Landscape | 0 | 21 | 59 | 59 |
| iPad (no Home button) | 24 | 20 | 0 | 0 |
| iPad (Home button) | 20 | 0 | 0 | 0 |

### Asset Scale Factors

| Scale | Device Type | Pixel Multiplier |
|-------|-------------|------------------|
| @1x | Legacy (not current) | 1x |
| @2x | All iPads, iPhone SE | 2x |
| @3x | All modern iPhones | 3x |

### Minimum Touch Target

- **Apple HIG Minimum**: 44 x 44 points
- **Recommended for Games**: 48-60 points for frequently used controls
- **Maximum Reasonable**: 80 points (larger wastes screen space)

## Implementation Patterns

### Size Class Responsive Layout

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
            GameHeaderView()
                .frame(height: 60)

            GameBoardView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            GameControlsView()
                .frame(height: 120)
        }
    }

    private var iPhoneLandscapeLayout: some View {
        HStack(spacing: 0) {
            GameControlsView()
                .frame(width: 100)

            GameBoardView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            VStack {
                GameHeaderView()
                Spacer()
            }
            .frame(width: 150)
        }
    }

    private var iPadLayout: some View {
        HStack(spacing: 20) {
            VStack {
                GameHeaderView()
                Spacer()
                GameControlsView()
            }
            .frame(width: 280)

            GameBoardView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            SidebarView()
                .frame(width: 250)
        }
        .padding(20)
    }
}
```

### Adaptive Game Board Scaling

```swift
import SwiftUI

struct ScalableGameBoard: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @State private var boardSize: CGSize = .zero

    // Game logic
    let gridSize = 8 // 8x8 game board

    var body: some View {
        GeometryReader { geometry in
            let availableSize = geometry.size
            let cellSize = calculateCellSize(for: availableSize)

            ZStack {
                // Background
                Color.black.opacity(0.1)

                // Game board centered
                GameGrid(cellSize: cellSize, gridSize: gridSize)
                    .frame(
                        width: cellSize * CGFloat(gridSize),
                        height: cellSize * CGFloat(gridSize)
                    )
            }
            .onAppear {
                boardSize = availableSize
            }
            .onChange(of: geometry.size) { newSize in
                boardSize = newSize
            }
        }
    }

    private func calculateCellSize(for availableSize: CGSize) -> CGFloat {
        let smallerDimension = min(availableSize.width, availableSize.height)

        // Leave padding
        let paddingFactor: CGFloat = horizontalSizeClass == .compact ? 0.9 : 0.85
        let maxBoardSize = smallerDimension * paddingFactor

        // Calculate cell size
        let cellSize = maxBoardSize / CGFloat(gridSize)

        // Enforce minimum touch target
        return max(cellSize, 44)
    }
}

struct GameGrid: View {
    let cellSize: CGFloat
    let gridSize: Int

    var body: some View {
        VStack(spacing: 2) {
            ForEach(0..<gridSize, id: \.self) { row in
                HStack(spacing: 2) {
                    ForEach(0..<gridSize, id: \.self) { col in
                        GameCell(row: row, col: col)
                            .frame(width: cellSize - 2, height: cellSize - 2)
                    }
                }
            }
        }
    }
}

struct GameCell: View {
    let row: Int
    let col: Int

    var body: some View {
        RoundedRectangle(cornerRadius: 4)
            .fill(Color.blue.opacity(0.3))
    }
}
```

### Safe Area Handling

```swift
import SwiftUI

struct SafeAreaAwareGameView: View {
    var body: some View {
        GeometryReader { geometry in
            let safeArea = geometry.safeAreaInsets

            ZStack {
                // Background extends to edges
                GameBackgroundView()
                    .ignoresSafeArea()

                // Game content respects safe areas
                VStack(spacing: 0) {
                    // Top HUD - respects top safe area
                    GameHUD()
                        .padding(.top, safeArea.top)
                        .background(Color.black.opacity(0.5))

                    // Main game area - full bleed is OK
                    GameplayArea()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)

                    // Bottom controls - respects bottom safe area
                    GameControls()
                        .padding(.bottom, safeArea.bottom)
                        .background(Color.black.opacity(0.5))
                }
            }
        }
    }
}

// Alternative: Using safeAreaInset modifier (iOS 15+)
struct ModernSafeAreaGame: View {
    var body: some View {
        GameplayArea()
            .ignoresSafeArea()
            .safeAreaInset(edge: .top) {
                GameHUD()
                    .background(.ultraThinMaterial)
            }
            .safeAreaInset(edge: .bottom) {
                GameControls()
                    .background(.ultraThinMaterial)
            }
    }
}
```

### iPad Pointer Support

```swift
import SwiftUI

struct PointerAwareButton: View {
    let title: String
    let action: () -> Void

    @State private var isHovered = false

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(isHovered ? Color.blue.opacity(0.8) : Color.blue)
                )
                .scaleEffect(isHovered ? 1.05 : 1.0)
                .animation(.easeInOut(duration: 0.15), value: isHovered)
        }
        .buttonStyle(.plain)
        .onHover { hovering in
            isHovered = hovering
        }
        .hoverEffect(.lift) // System hover effect
    }
}

// Custom pointer shape for game elements
struct GamePiece: View {
    @State private var isHovered = false

    var body: some View {
        Circle()
            .fill(Color.red)
            .frame(width: 60, height: 60)
            .scaleEffect(isHovered ? 1.1 : 1.0)
            .onHover { hovering in
                isHovered = hovering
            }
            .contentShape(Circle())
            .pointerStyle(.grabbing) // Custom pointer style
    }
}

// Pointer interaction for drag operations
struct DraggableGamePiece: View {
    @State private var offset: CGSize = .zero
    @State private var isDragging = false

    var body: some View {
        Circle()
            .fill(Color.blue)
            .frame(width: 80, height: 80)
            .offset(offset)
            .gesture(
                DragGesture()
                    .onChanged { value in
                        offset = value.translation
                        isDragging = true
                    }
                    .onEnded { _ in
                        withAnimation {
                            offset = .zero
                        }
                        isDragging = false
                    }
            )
            .hoverEffect(.highlight)
    }
}
```

### iPad Keyboard Support

```swift
import SwiftUI
import GameController

struct KeyboardEnabledGame: View {
    @State private var playerPosition: CGPoint = .zero
    @FocusState private var isFocused: Bool

    var body: some View {
        GameView(playerPosition: $playerPosition)
            .focusable()
            .focused($isFocused)
            .onKeyPress(.leftArrow) {
                movePlayer(dx: -10, dy: 0)
                return .handled
            }
            .onKeyPress(.rightArrow) {
                movePlayer(dx: 10, dy: 0)
                return .handled
            }
            .onKeyPress(.upArrow) {
                movePlayer(dx: 0, dy: -10)
                return .handled
            }
            .onKeyPress(.downArrow) {
                movePlayer(dx: 0, dy: 10)
                return .handled
            }
            .onKeyPress(.space) {
                performAction()
                return .handled
            }
            .onKeyPress(.escape) {
                pauseGame()
                return .handled
            }
            .onAppear {
                isFocused = true
            }
    }

    private func movePlayer(dx: CGFloat, dy: CGFloat) {
        playerPosition.x += dx
        playerPosition.y += dy
    }

    private func performAction() {
        // Jump, shoot, etc.
    }

    private func pauseGame() {
        // Open pause menu
    }
}

// Keyboard shortcuts for menus
struct GameMenuView: View {
    var body: some View {
        VStack {
            Button("New Game") { startNewGame() }
                .keyboardShortcut("n", modifiers: .command)

            Button("Continue") { continueGame() }
                .keyboardShortcut("c", modifiers: .command)

            Button("Settings") { openSettings() }
                .keyboardShortcut(",", modifiers: .command)
        }
    }

    private func startNewGame() {}
    private func continueGame() {}
    private func openSettings() {}
}
```

### Split View and Slide Over Handling

```swift
import SwiftUI

struct MultitaskingAwareGame: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.scenePhase) private var scenePhase
    @State private var isGamePaused = false

    var body: some View {
        ZStack {
            if horizontalSizeClass == .compact {
                // Compact width - simplified UI for Split View
                CompactGameView()
            } else {
                // Full width - complete UI
                FullGameView()
            }

            if isGamePaused {
                PauseOverlay()
            }
        }
        .onChange(of: horizontalSizeClass) { newValue in
            // Handle size class change during gameplay
            if newValue == .compact {
                // Consider pausing or simplifying
                pauseForMultitasking()
            }
        }
        .onChange(of: scenePhase) { newPhase in
            switch newPhase {
            case .active:
                // App is fully visible
                resumeIfAppropriate()
            case .inactive:
                // App visible but not interactive (multitasking switcher)
                pauseGame()
            case .background:
                // App not visible
                pauseAndSaveState()
            @unknown default:
                break
            }
        }
    }

    private func pauseForMultitasking() {
        isGamePaused = true
        // Save game state
    }

    private func pauseGame() {
        isGamePaused = true
    }

    private func resumeIfAppropriate() {
        // Don't auto-resume - let user tap to continue
    }

    private func pauseAndSaveState() {
        isGamePaused = true
        // Persist state to survive termination
    }
}

struct CompactGameView: View {
    var body: some View {
        VStack {
            // Simplified layout for narrow width
            Text("Game paused in Split View")
                .font(.headline)

            Text("Expand to full screen to continue playing")
                .font(.subheadline)
                .foregroundColor(.secondary)

            Button("Return to Menu") {
                // Navigate to menu which works in compact
            }
            .buttonStyle(.bordered)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemBackground))
    }
}
```

### Opting Out of Multitasking (If Necessary)

```swift
// Info.plist configuration to disable multitasking
// Only use if game CANNOT work in Split View

/*
 Add to Info.plist:

 <key>UIRequiresFullScreen</key>
 <true/>

 This will:
 - Disable Split View and Slide Over
 - Disable Slide to Switch gesture
 - App always runs full screen

 IMPORTANT: Apple prefers apps support multitasking.
 Only disable if absolutely necessary for gameplay.
*/

// Alternative: Require specific orientations
/*
 <key>UISupportedInterfaceOrientations~ipad</key>
 <array>
     <string>UIInterfaceOrientationLandscapeLeft</string>
     <string>UIInterfaceOrientationLandscapeRight</string>
 </array>

 Note: Even landscape-only apps should handle Split View
*/
```

### Launch Screen Configuration

```swift
// Option 1: Storyboard Launch Screen (Recommended)
// Create LaunchScreen.storyboard with:
// - Centered game logo (use constraints, not fixed positions)
// - Background color matching game theme
// - No text (may not be localized in time)
// - Keep simple - loads before your code runs

// Option 2: Info.plist Launch Screen (iOS 14+)
/*
 <key>UILaunchScreen</key>
 <dict>
     <key>UIColorName</key>
     <string>LaunchBackgroundColor</string>
     <key>UIImageName</key>
     <string>LaunchLogo</string>
     <key>UIImageRespectsSafeAreaInsets</key>
     <true/>
 </dict>
*/

// Required in Asset Catalog:
// - LaunchBackgroundColor (Color Set)
// - LaunchLogo (Image Set with @1x, @2x, @3x)
```

### Asset Catalog Configuration

```swift
// Asset Catalog structure for universal app:
/*
Assets.xcassets/
├── AppIcon.appiconset/
│   ├── Contents.json
│   ├── icon-20@2x.png      (40x40)
│   ├── icon-20@3x.png      (60x60)
│   ├── icon-29@2x.png      (58x58)
│   ├── icon-29@3x.png      (87x87)
│   ├── icon-40@2x.png      (80x80)
│   ├── icon-40@3x.png      (120x120)
│   ├── icon-60@2x.png      (120x120)
│   ├── icon-60@3x.png      (180x180)
│   ├── icon-76@2x.png      (152x152)   [iPad]
│   ├── icon-83.5@2x.png    (167x167)   [iPad Pro]
│   └── icon-1024.png       (1024x1024) [App Store]
├── GameSprites.spriteatlas/
│   ├── player.imageset/
│   │   ├── Contents.json
│   │   ├── player@1x.png
│   │   ├── player@2x.png
│   │   └── player@3x.png
│   └── enemy.imageset/
│       └── ...
├── UIElements/
│   ├── button-primary.imageset/
│   │   └── (sliced 9-patch images at @1x, @2x, @3x)
│   └── ...
└── Colors/
    ├── AccentColor.colorset/
    └── GameBackground.colorset/
*/

// Loading assets in code:
let playerSprite = UIImage(named: "player") // Auto-selects correct scale
let accentColor = UIColor(named: "AccentColor")

// SpriteKit texture loading:
let texture = SKTexture(imageNamed: "player") // Auto-selects from atlas
```

### Orientation Handling

```swift
import SwiftUI

// App-level orientation support in Info.plist
/*
 iPhone orientations:
 <key>UISupportedInterfaceOrientations</key>
 <array>
     <string>UIInterfaceOrientationPortrait</string>
     <string>UIInterfaceOrientationLandscapeLeft</string>
     <string>UIInterfaceOrientationLandscapeRight</string>
 </array>

 iPad orientations (should support all):
 <key>UISupportedInterfaceOrientations~ipad</key>
 <array>
     <string>UIInterfaceOrientationPortrait</string>
     <string>UIInterfaceOrientationPortraitUpsideDown</string>
     <string>UIInterfaceOrientationLandscapeLeft</string>
     <string>UIInterfaceOrientationLandscapeRight</string>
 </array>
*/

struct OrientationAdaptiveGame: View {
    @Environment(\.verticalSizeClass) private var verticalSizeClass

    var isLandscape: Bool {
        verticalSizeClass == .compact
    }

    var body: some View {
        GeometryReader { geometry in
            let isWide = geometry.size.width > geometry.size.height

            if isWide {
                LandscapeGameLayout()
            } else {
                PortraitGameLayout()
            }
        }
    }
}

// For UIKit/SpriteKit scenes that need to lock orientation:
class GameViewController: UIViewController {

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        // Landscape only for this specific game
        return .landscape
    }

    override var shouldAutorotate: Bool {
        return true
    }

    override var preferredInterfaceOrientationForPresentation: UIInterfaceOrientation {
        return .landscapeRight
    }
}
```

### Device-Specific Adjustments

```swift
import SwiftUI

struct DeviceAdaptiveUI: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    private var isIPad: Bool {
        UIDevice.current.userInterfaceIdiom == .pad
    }

    private var buttonSize: CGFloat {
        if isIPad {
            return 60 // Larger for iPad
        } else {
            return 44 // Standard for iPhone
        }
    }

    private var fontSize: CGFloat {
        if isIPad {
            return 18
        } else {
            return 14
        }
    }

    private var gridColumns: Int {
        switch horizontalSizeClass {
        case .compact:
            return 3
        case .regular:
            return isIPad ? 6 : 4
        default:
            return 4
        }
    }

    var body: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: gridColumns)) {
            ForEach(0..<12) { index in
                GameItemView()
                    .frame(height: buttonSize * 2)
            }
        }
        .font(.system(size: fontSize))
    }
}

// Screen size breakpoints for game layout decisions
struct ScreenSizeHelper {
    static var screenWidth: CGFloat {
        UIScreen.main.bounds.width
    }

    static var screenHeight: CGFloat {
        UIScreen.main.bounds.height
    }

    static var isSmallPhone: Bool {
        // iPhone SE, iPhone 8 size
        screenHeight <= 667
    }

    static var isLargePhone: Bool {
        // iPhone Plus/Max size
        screenHeight >= 896
    }

    static var isIPad: Bool {
        UIDevice.current.userInterfaceIdiom == .pad
    }

    static var isIPadPro12: Bool {
        isIPad && screenHeight >= 1024
    }
}
```

## Decision Trees

### Layout Strategy Selection

```
What type of game layout?
├── Fixed aspect ratio (board games, puzzles)
│   └── Center content, letterbox/pillarbox edges
│   └── Scale uniformly to fit smaller dimension
├── Flexible content (endless runners, RPGs)
│   └── Use size classes for layout changes
│   └── Show more content on larger screens
└── Full-screen immersive (action games)
    └── Extend to edges
    └── Keep controls in safe areas
    └── Consider different layouts for portrait/landscape
```

### Orientation Support Decision

```
Game type?
├── Portrait-only (puzzle, match-3, card games)
│   └── Support portrait + portrait upside-down on iPad
│   └── Consider landscape option for iPad
├── Landscape-only (racing, platformers)
│   └── Support both landscape orientations
│   └── MUST support landscape on iPad
└── Both orientations (most games)
    └── Implement adaptive layouts
    └── Test all orientations on all device types
```

### Split View Support Decision

```
Can game work in compact width?
├── Yes (turn-based, simple UI)
│   └── Implement compact layout
│   └── Support Split View fully
├── Partially (complex but pausable)
│   └── Pause and show "expand to play" in compact
│   └── Resume in regular width
└── No (real-time, requires full screen)
    └── Set UIRequiresFullScreen = true
    └── Document why in App Store notes
    └── May limit approval chances
```

## Quality Checklist

### Universal App Support

- [ ] App works on both iPhone and iPad
- [ ] Size classes handled for all configurations
- [ ] iPad Split View considered (supported or properly disabled)
- [ ] All four iPad orientations supported (or justified limitation)
- [ ] iPhone portrait and landscape tested

### Assets

- [ ] All images provided at @1x, @2x, @3x
- [ ] App icons for all required sizes
- [ ] Launch screen works on all devices
- [ ] No pixelation or stretching visible
- [ ] Asset catalog properly configured

### Safe Areas

- [ ] UI elements respect safe area insets
- [ ] Game content can extend to edges appropriately
- [ ] Notch/Dynamic Island area clear of critical UI
- [ ] Home indicator area clear of interactive elements
- [ ] Tested on devices with and without notch

### Touch Targets

- [ ] All interactive elements minimum 44x44 points
- [ ] Adequate spacing between touch targets
- [ ] Touch areas don't overlap
- [ ] Tested with actual finger interactions

### iPad-Specific

- [ ] Pointer hover effects on interactive elements
- [ ] Keyboard shortcuts for common actions
- [ ] External keyboard navigation works
- [ ] Trackpad gestures supported
- [ ] Pencil input handled (if applicable)

### Orientation & Multitasking

- [ ] Orientation changes handled smoothly
- [ ] Game state preserved across orientation changes
- [ ] Scene phase changes handled (pause on background)
- [ ] Split View transition doesn't crash
- [ ] Slide Over appearance doesn't break layout

## Anti-Patterns

### 1. Hardcoded Screen Dimensions

**What NOT to do**:
```swift
struct GameView: View {
    var body: some View {
        VStack {
            GameBoard()
                .frame(width: 390, height: 600) // WRONG: Hardcoded iPhone 14 size
        }
    }
}
```

**Consequence**: Broken layout on all other devices, App Store rejection

**Correct Approach**:
```swift
struct GameView: View {
    var body: some View {
        GeometryReader { geometry in
            GameBoard()
                .frame(
                    width: min(geometry.size.width * 0.9, 600),
                    height: min(geometry.size.height * 0.7, 800)
                )
                .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
        }
    }
}
```

### 2. Ignoring Safe Areas

**What NOT to do**:
```swift
struct GameHUD: View {
    var body: some View {
        VStack {
            // WRONG: Fixed padding ignores notch
            Text("Score: 1000")
                .padding(.top, 20)
            Spacer()
        }
    }
}
```

**Consequence**: UI hidden behind notch/Dynamic Island

**Correct Approach**:
```swift
struct GameHUD: View {
    var body: some View {
        VStack {
            Text("Score: 1000")
            Spacer()
        }
        .padding(.top) // Respects safe area automatically
        // Or explicitly:
        // .safeAreaInset(edge: .top) { ... }
    }
}
```

### 3. Tiny Touch Targets

**What NOT to do**:
```swift
Button(action: { selectItem() }) {
    Image("small-icon")
        .frame(width: 24, height: 24) // WRONG: Too small
}
```

**Consequence**: Frustrating user experience, accessibility failure

**Correct Approach**:
```swift
Button(action: { selectItem() }) {
    Image("small-icon")
        .frame(width: 24, height: 24)
}
.frame(width: 44, height: 44) // Touch target is proper size
.contentShape(Rectangle()) // Ensure full area is tappable
```

### 4. Missing iPad Keyboard Support

**What NOT to do**:
```swift
// Game only responds to touch, ignoring keyboard
struct GameView: View {
    var body: some View {
        GameBoard()
            .gesture(DragGesture().onChanged { ... })
        // No keyboard handling
    }
}
```

**Consequence**: Poor iPad experience with external keyboard

**Correct Approach**:
```swift
struct GameView: View {
    @FocusState private var isFocused: Bool

    var body: some View {
        GameBoard()
            .gesture(DragGesture().onChanged { ... })
            .focusable()
            .focused($isFocused)
            .onKeyPress(.leftArrow) { moveLeft(); return .handled }
            .onKeyPress(.rightArrow) { moveRight(); return .handled }
            .onAppear { isFocused = true }
    }
}
```

### 5. Crashing on Size Class Change

**What NOT to do**:
```swift
struct GameView: View {
    @Environment(\.horizontalSizeClass) var sizeClass

    var columns: Int {
        sizeClass == .compact ? 3 : 5
    }

    var body: some View {
        // Array created assuming 5 columns, crashes when compact
        LazyVGrid(columns: Array(repeating: GridItem(), count: columns)) {
            ForEach(items) { item in // items.count assumes 5 columns
                ItemView(item: item)
            }
        }
    }
}
```

**Consequence**: Crash when entering Split View

**Correct Approach**:
```swift
struct GameView: View {
    @Environment(\.horizontalSizeClass) var sizeClass
    @State private var items: [Item] = []

    var columns: Int {
        sizeClass == .compact ? 3 : 5
    }

    var body: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: columns)) {
            ForEach(items) { item in
                ItemView(item: item)
            }
        }
        .onChange(of: sizeClass) { _ in
            // Reconfigure if needed
            reconfigureForSizeClass()
        }
    }
}
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `app-store-review` | Universal app is required for App Store approval |
| `swiftui-game-ui` | UI patterns should be built with adaptive layouts |
| `spritekit-patterns` | SpriteKit scenes need to handle screen scaling |
| `performance-optimizer` | Different devices have different performance characteristics |
| `asset-pipeline` | Asset scaling and device-specific variants |
