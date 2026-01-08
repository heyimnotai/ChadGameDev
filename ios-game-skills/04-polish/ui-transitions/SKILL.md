---
name: ui-transitions
description: Implement polished UI transitions for iOS games using SwiftUI and UIKit. Use when designing screen navigation, modal presentations, loading states, or any interface state changes. Triggers when implementing menu systems, pause screens, results displays, settings panels, or any UI element choreography requiring smooth animated transitions.
---

# UI Transitions

## Purpose

This skill enables implementation of professional-quality UI transitions that make iOS games feel polished and premium. Proper transitions guide user attention, communicate state changes, and prevent jarring visual discontinuities. An agent with this skill can implement navigation transitions, element choreography, loading states, and custom animations that meet top 10% App Store standards.

## Domain Boundaries

**This skill handles:**
- Screen-to-screen navigation transitions (push, pop, modal, dissolve)
- Element choreography with staggered timing
- Loading state transitions and skeleton screens
- Error state transitions and recovery flows
- SwiftUI transition modifiers and custom transitions
- matchedGeometryEffect for hero animations
- Navigation stack transition customization
- UIKit view controller transitions

**This skill does NOT handle:**
- Gameplay animation timing (see `animation-system`)
- Screen shake and impact effects (see `screen-shake-impact`)
- Particle effects (see `particle-effects`)
- Haptic feedback (see `haptic-optimizer`)
- Sound effects on transitions (see `audio-designer`)

---

## Core Specifications

### Screen Transition Timing

| Transition Type | Duration | Easing | Use Case |
|----------------|----------|--------|----------|
| **Push/Pop** | 200-350ms | ease-in-out | Primary navigation |
| **Modal Present** | 300-400ms | ease-out | Overlays, popups |
| **Modal Dismiss** | 250-350ms | ease-in | Closing overlays |
| **Cross-Dissolve** | 200-300ms | linear | Scene changes |
| **Quick Switch** | 150-200ms | ease-out | Tabs, segments |
| **Slow Reveal** | 400-600ms | ease-in-out | Dramatic reveals |

### Platform-Specific Timing

| Platform | Adjustment | Rationale |
|----------|------------|-----------|
| **iPhone** | Base timing | Reference standard |
| **iPad** | +30% duration | Larger screen, more distance |
| **iPad Split View** | Base timing | Smaller area like phone |

### Element Choreography Stagger Delays

| Element Count | Stagger Delay | Total Sequence Duration |
|---------------|---------------|------------------------|
| 2-3 elements | 50-80ms | 100-240ms |
| 4-6 elements | 40-60ms | 160-360ms |
| 7-10 elements | 30-50ms | 210-500ms |
| 10+ elements | 20-40ms | Cap at 500ms total |

### Loading State Specifications

| State | Trigger Threshold | Animation |
|-------|------------------|-----------|
| **Skeleton** | Show immediately | Shimmer at 1.5-2s period |
| **Spinner** | After 200ms wait | Continuous rotation |
| **Progress Bar** | Known duration/progress | Linear fill |
| **Content Appear** | Data ready | Fade in 200-300ms |

### SwiftUI Built-in Transition Timing

| Transition | Default Duration | Recommended Duration |
|------------|-----------------|---------------------|
| `.opacity` | 350ms | 200-300ms |
| `.scale` | 350ms | 200-300ms |
| `.slide` | 350ms | 250-350ms |
| `.move(edge:)` | 350ms | 200-350ms |
| `.offset` | 350ms | 200-300ms |

---

## Implementation Patterns

### SwiftUI Basic Transitions

```swift
import SwiftUI

struct TransitionExamples: View {
    @State private var showContent = false
    @State private var showModal = false
    @State private var selectedTab = 0

    var body: some View {
        VStack(spacing: 20) {
            // Opacity transition
            if showContent {
                ContentCard()
                    .transition(.opacity)
            }

            // Scale transition (zoom in/out)
            if showContent {
                ContentCard()
                    .transition(.scale(scale: 0.8, anchor: .center))
            }

            // Slide transition (from edge)
            if showContent {
                ContentCard()
                    .transition(.slide)
            }

            // Move from specific edge
            if showContent {
                ContentCard()
                    .transition(.move(edge: .bottom))
            }

            // Combined transitions
            if showContent {
                ContentCard()
                    .transition(
                        .opacity
                        .combined(with: .scale(scale: 0.9))
                        .combined(with: .offset(y: 20))
                    )
            }

            Button("Toggle") {
                withAnimation(.easeInOut(duration: 0.3)) {
                    showContent.toggle()
                }
            }
        }
    }
}
```

### Custom Transition Definitions

```swift
import SwiftUI

extension AnyTransition {

    /// Modal presentation - slides up with slight scale
    static var modalPresent: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .bottom)
                .combined(with: .opacity)
                .animation(.easeOut(duration: 0.35)),
            removal: .move(edge: .bottom)
                .combined(with: .opacity)
                .animation(.easeIn(duration: 0.28))
        )
    }

    /// Card flip effect
    static var cardFlip: AnyTransition {
        .modifier(
            active: CardFlipModifier(angle: -90, opacity: 0),
            identity: CardFlipModifier(angle: 0, opacity: 1)
        )
    }

    /// Scale from point (like opening from button)
    static func scaleFromPoint(_ anchor: UnitPoint) -> AnyTransition {
        .scale(scale: 0.1, anchor: anchor)
        .combined(with: .opacity)
    }

    /// Blur transition
    static var blur: AnyTransition {
        .modifier(
            active: BlurModifier(radius: 20, opacity: 0),
            identity: BlurModifier(radius: 0, opacity: 1)
        )
    }

    /// Push replacement (old exits opposite direction)
    static func push(from edge: Edge) -> AnyTransition {
        .asymmetric(
            insertion: .move(edge: edge),
            removal: .move(edge: edge.opposite)
        )
    }

    /// Bounce scale
    static var bounceScale: AnyTransition {
        .scale(scale: 0.5)
        .combined(with: .opacity)
        .animation(.spring(response: 0.35, dampingFraction: 0.6))
    }
}

// Supporting modifiers
struct CardFlipModifier: ViewModifier {
    let angle: Double
    let opacity: Double

    func body(content: Content) -> some View {
        content
            .rotation3DEffect(.degrees(angle), axis: (x: 0, y: 1, z: 0))
            .opacity(opacity)
    }
}

struct BlurModifier: ViewModifier {
    let radius: CGFloat
    let opacity: Double

    func body(content: Content) -> some View {
        content
            .blur(radius: radius)
            .opacity(opacity)
    }
}

extension Edge {
    var opposite: Edge {
        switch self {
        case .top: return .bottom
        case .bottom: return .top
        case .leading: return .trailing
        case .trailing: return .leading
        }
    }
}
```

### Element Choreography with Staggered Animations

```swift
import SwiftUI

struct StaggeredListView: View {
    @State private var items: [MenuItem] = []
    @State private var animatedItems: Set<String> = []

    // Stagger timing configuration
    private let staggerDelay: Double = 0.05  // 50ms between items
    private let itemDuration: Double = 0.3   // 300ms per item
    private let maxTotalDuration: Double = 0.5  // Cap total sequence

    var body: some View {
        VStack(spacing: 12) {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                MenuItemRow(item: item)
                    .opacity(animatedItems.contains(item.id) ? 1 : 0)
                    .offset(y: animatedItems.contains(item.id) ? 0 : 20)
                    .onAppear {
                        animateItem(item, at: index)
                    }
            }
        }
        .onAppear {
            loadItems()
        }
    }

    private func loadItems() {
        // Simulate data loading
        items = MenuItem.samples
    }

    private func animateItem(_ item: MenuItem, at index: Int) {
        // Calculate stagger delay, capped to prevent long sequences
        let effectiveStagger = min(staggerDelay, maxTotalDuration / Double(items.count))
        let delay = Double(index) * effectiveStagger

        withAnimation(
            .easeOut(duration: itemDuration)
            .delay(delay)
        ) {
            animatedItems.insert(item.id)
        }
    }
}

struct MenuItemRow: View {
    let item: MenuItem

    var body: some View {
        HStack {
            Image(systemName: item.icon)
                .font(.title2)
            Text(item.title)
                .font(.headline)
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
    }
}

struct MenuItem: Identifiable {
    let id: String
    let title: String
    let icon: String

    static let samples: [MenuItem] = [
        MenuItem(id: "1", title: "Play", icon: "play.fill"),
        MenuItem(id: "2", title: "Settings", icon: "gear"),
        MenuItem(id: "3", title: "Leaderboard", icon: "trophy"),
        MenuItem(id: "4", title: "Shop", icon: "cart"),
        MenuItem(id: "5", title: "Achievements", icon: "star.fill")
    ]
}
```

### Advanced Stagger Controller

```swift
import SwiftUI
import Combine

final class StaggerAnimationController: ObservableObject {

    @Published private(set) var visibleIndices: Set<Int> = []

    private var cancellables = Set<AnyCancellable>()

    /// Configuration
    struct Config {
        var staggerDelay: TimeInterval = 0.05
        var itemDuration: TimeInterval = 0.3
        var maxTotalDuration: TimeInterval = 0.5
        var direction: Direction = .forward

        enum Direction {
            case forward   // 0, 1, 2, 3...
            case reverse   // 3, 2, 1, 0...
            case center    // middle first, then outward
            case edges     // edges first, then inward
        }
    }

    private let config: Config

    init(config: Config = Config()) {
        self.config = config
    }

    func animate(itemCount: Int) {
        reset()

        let effectiveStagger = min(
            config.staggerDelay,
            config.maxTotalDuration / Double(itemCount)
        )

        let indices = orderedIndices(count: itemCount)

        for (order, index) in indices.enumerated() {
            let delay = Double(order) * effectiveStagger

            DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
                withAnimation(.easeOut(duration: self?.config.itemDuration ?? 0.3)) {
                    self?.visibleIndices.insert(index)
                }
            }
        }
    }

    func reset() {
        visibleIndices.removeAll()
    }

    func isVisible(_ index: Int) -> Bool {
        visibleIndices.contains(index)
    }

    private func orderedIndices(count: Int) -> [Int] {
        switch config.direction {
        case .forward:
            return Array(0..<count)
        case .reverse:
            return Array((0..<count).reversed())
        case .center:
            return centerOutOrder(count: count)
        case .edges:
            return edgesInOrder(count: count)
        }
    }

    private func centerOutOrder(count: Int) -> [Int] {
        var result: [Int] = []
        let center = count / 2

        for offset in 0...center {
            if center - offset >= 0 {
                result.append(center - offset)
            }
            if center + offset < count && offset > 0 {
                result.append(center + offset)
            }
        }

        return result
    }

    private func edgesInOrder(count: Int) -> [Int] {
        var result: [Int] = []
        var left = 0
        var right = count - 1

        while left <= right {
            result.append(left)
            if left != right {
                result.append(right)
            }
            left += 1
            right -= 1
        }

        return result
    }
}
```

### Hero Animation with matchedGeometryEffect

```swift
import SwiftUI

struct HeroAnimationView: View {
    @Namespace private var heroNamespace
    @State private var selectedCard: CardItem?

    let cards = CardItem.samples

    var body: some View {
        ZStack {
            // Grid of cards
            if selectedCard == nil {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))], spacing: 16) {
                    ForEach(cards) { card in
                        CardThumbnail(card: card, namespace: heroNamespace)
                            .onTapGesture {
                                withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                                    selectedCard = card
                                }
                            }
                    }
                }
                .padding()
            }

            // Expanded card detail
            if let card = selectedCard {
                CardDetailView(
                    card: card,
                    namespace: heroNamespace,
                    onClose: {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            selectedCard = nil
                        }
                    }
                )
            }
        }
    }
}

struct CardThumbnail: View {
    let card: CardItem
    let namespace: Namespace.ID

    var body: some View {
        VStack {
            Image(systemName: card.icon)
                .font(.largeTitle)
                .matchedGeometryEffect(id: "\(card.id)-icon", in: namespace)

            Text(card.title)
                .font(.headline)
                .matchedGeometryEffect(id: "\(card.id)-title", in: namespace)
        }
        .frame(height: 120)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(card.color)
                .matchedGeometryEffect(id: "\(card.id)-bg", in: namespace)
        )
    }
}

struct CardDetailView: View {
    let card: CardItem
    let namespace: Namespace.ID
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            HStack {
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title)
                        .foregroundColor(.white.opacity(0.7))
                }
            }

            Image(systemName: card.icon)
                .font(.system(size: 80))
                .matchedGeometryEffect(id: "\(card.id)-icon", in: namespace)

            Text(card.title)
                .font(.largeTitle.bold())
                .matchedGeometryEffect(id: "\(card.id)-title", in: namespace)

            Text(card.description)
                .font(.body)
                .multilineTextAlignment(.center)
                .padding()

            Spacer()
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(card.color)
                .matchedGeometryEffect(id: "\(card.id)-bg", in: namespace)
                .ignoresSafeArea()
        )
    }
}

struct CardItem: Identifiable {
    let id: String
    let title: String
    let icon: String
    let color: Color
    let description: String

    static let samples: [CardItem] = [
        CardItem(id: "1", title: "Adventure", icon: "map.fill", color: .blue, description: "Explore vast worlds"),
        CardItem(id: "2", title: "Combat", icon: "bolt.fill", color: .red, description: "Master the art of battle"),
        CardItem(id: "3", title: "Puzzles", icon: "puzzlepiece.fill", color: .purple, description: "Challenge your mind")
    ]
}
```

### Loading State Transitions

```swift
import SwiftUI

struct LoadingStateView<Content: View, Placeholder: View>: View {

    enum LoadingState<T> {
        case idle
        case loading
        case loaded(T)
        case error(Error)
    }

    let state: LoadingState<Any>
    let content: () -> Content
    let placeholder: () -> Placeholder

    // Timing configuration
    private let spinnerDelay: TimeInterval = 0.2
    private let contentTransitionDuration: TimeInterval = 0.25

    var body: some View {
        ZStack {
            switch state {
            case .idle:
                EmptyView()

            case .loading:
                placeholder()
                    .transition(.opacity)

            case .loaded:
                content()
                    .transition(.opacity.animation(.easeIn(duration: contentTransitionDuration)))

            case .error(let error):
                ErrorView(error: error)
                    .transition(.opacity.combined(with: .scale(scale: 0.95)))
            }
        }
        .animation(.easeInOut(duration: 0.3), value: stateKey)
    }

    private var stateKey: String {
        switch state {
        case .idle: return "idle"
        case .loading: return "loading"
        case .loaded: return "loaded"
        case .error: return "error"
        }
    }
}

struct ErrorView: View {
    let error: Error
    var onRetry: (() -> Void)?

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 48))
                .foregroundColor(.red)

            Text("Something went wrong")
                .font(.headline)

            Text(error.localizedDescription)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)

            if let onRetry = onRetry {
                Button("Try Again", action: onRetry)
                    .buttonStyle(.borderedProminent)
            }
        }
        .padding()
    }
}
```

### Skeleton Loading View

```swift
import SwiftUI

struct SkeletonView: View {
    @State private var shimmerOffset: CGFloat = -1

    // Shimmer timing: 1.5-2 second period
    private let shimmerDuration: Double = 1.8

    var body: some View {
        GeometryReader { geometry in
            Rectangle()
                .fill(Color(.systemGray5))
                .overlay(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            .clear,
                            Color.white.opacity(0.4),
                            .clear
                        ]),
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                    .frame(width: geometry.size.width * 0.5)
                    .offset(x: shimmerOffset * geometry.size.width)
                )
                .clipped()
        }
        .onAppear {
            withAnimation(
                .linear(duration: shimmerDuration)
                .repeatForever(autoreverses: false)
            ) {
                shimmerOffset = 1.5
            }
        }
    }
}

struct SkeletonListView: View {
    let rowCount: Int

    var body: some View {
        VStack(spacing: 12) {
            ForEach(0..<rowCount, id: \.self) { _ in
                SkeletonRow()
            }
        }
        .padding()
    }
}

struct SkeletonRow: View {
    var body: some View {
        HStack(spacing: 12) {
            // Avatar placeholder
            SkeletonView()
                .frame(width: 48, height: 48)
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: 8) {
                // Title placeholder
                SkeletonView()
                    .frame(height: 16)
                    .frame(maxWidth: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 4))

                // Subtitle placeholder
                SkeletonView()
                    .frame(height: 12)
                    .frame(maxWidth: 120)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
            }

            Spacer()
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
    }
}
```

### Navigation Transition Customization (iOS 16+)

```swift
import SwiftUI

@available(iOS 16.0, *)
struct CustomNavigationView: View {

    var body: some View {
        NavigationStack {
            MenuScreen()
                .navigationDestination(for: GameRoute.self) { route in
                    destinationView(for: route)
                }
        }
    }

    @ViewBuilder
    private func destinationView(for route: GameRoute) -> some View {
        switch route {
        case .play:
            GameplayView()
                .navigationTransition(.zoom(sourceID: "play", in: heroNamespace))
        case .settings:
            SettingsView()
        case .leaderboard:
            LeaderboardView()
        }
    }

    @Namespace private var heroNamespace
}

enum GameRoute: Hashable {
    case play
    case settings
    case leaderboard
}

struct MenuScreen: View {
    var body: some View {
        VStack(spacing: 20) {
            NavigationLink(value: GameRoute.play) {
                MenuButton(title: "Play", icon: "play.fill")
            }

            NavigationLink(value: GameRoute.settings) {
                MenuButton(title: "Settings", icon: "gear")
            }

            NavigationLink(value: GameRoute.leaderboard) {
                MenuButton(title: "Leaderboard", icon: "trophy")
            }
        }
        .navigationTitle("Game Menu")
    }
}

struct MenuButton: View {
    let title: String
    let icon: String

    var body: some View {
        HStack {
            Image(systemName: icon)
            Text(title)
            Spacer()
            Image(systemName: "chevron.right")
        }
        .font(.headline)
        .padding()
        .background(Color.blue)
        .foregroundColor(.white)
        .cornerRadius(12)
        .padding(.horizontal)
    }
}
```

### Modal Presentation with Custom Transition

```swift
import SwiftUI

struct GameModalPresentation: ViewModifier {
    @Binding var isPresented: Bool
    let content: () -> AnyView

    func body(content: Content) -> some View {
        ZStack {
            content

            if isPresented {
                // Dimming background
                Color.black.opacity(0.5)
                    .ignoresSafeArea()
                    .transition(.opacity)
                    .onTapGesture {
                        withAnimation(.easeIn(duration: 0.25)) {
                            isPresented = false
                        }
                    }

                // Modal content
                self.content()
                    .transition(.modalPresent)
            }
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.85), value: isPresented)
    }
}

extension View {
    func gameModal<ModalContent: View>(
        isPresented: Binding<Bool>,
        @ViewBuilder content: @escaping () -> ModalContent
    ) -> some View {
        modifier(GameModalPresentation(
            isPresented: isPresented,
            content: { AnyView(content()) }
        ))
    }
}

// Usage example
struct GameScreenWithModal: View {
    @State private var showPauseMenu = false

    var body: some View {
        GameplayView()
            .gameModal(isPresented: $showPauseMenu) {
                PauseMenuView(onResume: {
                    showPauseMenu = false
                })
            }
    }
}
```

### Tab Transition Animation

```swift
import SwiftUI

struct AnimatedTabView: View {
    @State private var selectedTab = 0
    @State private var previousTab = 0

    private let tabCount = 4

    var body: some View {
        ZStack {
            // Tab content with slide transition
            ForEach(0..<tabCount, id: \.self) { index in
                if index == selectedTab {
                    tabContent(for: index)
                        .transition(slideTransition(from: previousTab, to: selectedTab))
                }
            }
        }
        .animation(.easeInOut(duration: 0.25), value: selectedTab)
        .safeAreaInset(edge: .bottom) {
            // Custom tab bar
            HStack {
                ForEach(0..<tabCount, id: \.self) { index in
                    TabButton(
                        icon: tabIcon(for: index),
                        isSelected: selectedTab == index,
                        action: {
                            previousTab = selectedTab
                            selectedTab = index
                        }
                    )
                }
            }
            .padding()
            .background(.ultraThinMaterial)
        }
    }

    @ViewBuilder
    private func tabContent(for index: Int) -> some View {
        switch index {
        case 0: HomeView()
        case 1: ShopView()
        case 2: ProfileView()
        case 3: SettingsView()
        default: EmptyView()
        }
    }

    private func tabIcon(for index: Int) -> String {
        switch index {
        case 0: return "house.fill"
        case 1: return "cart.fill"
        case 2: return "person.fill"
        case 3: return "gear"
        default: return "circle"
        }
    }

    private func slideTransition(from: Int, to: Int) -> AnyTransition {
        let edge: Edge = from < to ? .trailing : .leading
        return .asymmetric(
            insertion: .move(edge: edge),
            removal: .move(edge: edge.opposite)
        )
    }
}

struct TabButton: View {
    let icon: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(isSelected ? .blue : .gray)
                .scaleEffect(isSelected ? 1.1 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isSelected)
        }
        .frame(maxWidth: .infinity)
    }
}
```

### UIKit View Controller Transition

```swift
import UIKit

final class SlideTransitionAnimator: NSObject, UIViewControllerAnimatedTransitioning {

    enum Direction {
        case present
        case dismiss
    }

    private let direction: Direction
    private let duration: TimeInterval

    init(direction: Direction, duration: TimeInterval = 0.35) {
        self.direction = direction
        self.duration = duration
    }

    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return duration
    }

    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        guard let fromVC = transitionContext.viewController(forKey: .from),
              let toVC = transitionContext.viewController(forKey: .to) else {
            transitionContext.completeTransition(false)
            return
        }

        let container = transitionContext.containerView

        switch direction {
        case .present:
            animatePresentation(from: fromVC, to: toVC, in: container, context: transitionContext)
        case .dismiss:
            animateDismissal(from: fromVC, to: toVC, in: container, context: transitionContext)
        }
    }

    private func animatePresentation(
        from: UIViewController,
        to: UIViewController,
        in container: UIView,
        context: UIViewControllerContextTransitioning
    ) {
        container.addSubview(to.view)

        // Start position (off-screen right)
        to.view.frame = container.bounds.offsetBy(dx: container.bounds.width, dy: 0)

        UIView.animate(
            withDuration: duration,
            delay: 0,
            usingSpringWithDamping: 0.85,
            initialSpringVelocity: 0,
            options: .curveEaseOut
        ) {
            to.view.frame = container.bounds
            from.view.frame = container.bounds.offsetBy(dx: -container.bounds.width * 0.3, dy: 0)
        } completion: { _ in
            context.completeTransition(!context.transitionWasCancelled)
        }
    }

    private func animateDismissal(
        from: UIViewController,
        to: UIViewController,
        in container: UIView,
        context: UIViewControllerContextTransitioning
    ) {
        container.insertSubview(to.view, belowSubview: from.view)
        to.view.frame = container.bounds.offsetBy(dx: -container.bounds.width * 0.3, dy: 0)

        UIView.animate(
            withDuration: duration,
            delay: 0,
            usingSpringWithDamping: 0.85,
            initialSpringVelocity: 0,
            options: .curveEaseIn
        ) {
            from.view.frame = container.bounds.offsetBy(dx: container.bounds.width, dy: 0)
            to.view.frame = container.bounds
        } completion: { _ in
            context.completeTransition(!context.transitionWasCancelled)
        }
    }
}

// Navigation Controller Delegate for custom transitions
final class GameNavigationDelegate: NSObject, UINavigationControllerDelegate {

    func navigationController(
        _ navigationController: UINavigationController,
        animationControllerFor operation: UINavigationController.Operation,
        from fromVC: UIViewController,
        to toVC: UIViewController
    ) -> UIViewControllerAnimatedTransitioning? {

        switch operation {
        case .push:
            return SlideTransitionAnimator(direction: .present)
        case .pop:
            return SlideTransitionAnimator(direction: .dismiss)
        default:
            return nil
        }
    }
}
```

---

## Decision Trees

### Choosing Transition Type

```
What type of navigation is happening?
├── Forward navigation (drilling into content)?
│   └── Use push/slide from right (250-350ms)
├── Backward navigation (returning)?
│   └── Use pop/slide to right (200-300ms)
├── Opening an overlay (modal, popup)?
│   └── Use modal present from bottom (300-400ms)
├── Closing an overlay?
│   └── Use modal dismiss to bottom (250-350ms)
├── Switching between equal siblings (tabs)?
│   └── Use quick switch with direction (150-200ms)
├── Showing/hiding content in place?
│   └── Use opacity + scale (200-300ms)
└── Dramatic reveal (reward, unlock)?
    └── Use slow reveal with effects (400-600ms)
```

### Stagger Animation Parameters

```
How many elements need to animate?
├── 2-3 elements: 50-80ms stagger, total ~200ms
├── 4-6 elements: 40-60ms stagger, total ~300ms
├── 7-10 elements: 30-50ms stagger, total ~400ms
└── 10+ elements: 20-40ms stagger, cap at 500ms total

What direction should elements animate?
├── List from data source: forward (0, 1, 2...)
├── Dismissing list: reverse (last to first)
├── Expanding menu: center-out (middle first)
└── Collecting items: edges-in (edges first)
```

### Loading State Selection

```
How long will loading take?
├── Unknown/variable:
│   ├── <200ms expected: Show nothing, then content
│   ├── 200ms-2s expected: Show skeleton immediately
│   └── >2s expected: Show skeleton + spinner after 1s
├── Known progress:
│   └── Show progress bar with percentage
└── Determinate steps:
    └── Show step indicator with labels
```

### Hero Animation Candidates

```
Is this element a good hero animation candidate?
├── Does element appear in both source and destination?
│   ├── Yes: Good candidate
│   └── No: Use standard transition
├── Is element visually prominent (>50pt)?
│   ├── Yes: Good candidate
│   └── No: May be too subtle to notice
├── Does transition feel natural?
│   ├── Yes: Proceed
│   └── No: Consider if shape change is too dramatic
└── Are there multiple hero elements?
    ├── 1-2: Good
    └── 3+: Consider reducing for clarity
```

---

## Quality Checklist

Before completing UI transition implementation, verify:

- [ ] Screen transitions use appropriate duration (200-400ms range)
- [ ] iPad transitions are 30% longer than iPhone
- [ ] Push transitions slide from right, pop from left
- [ ] Modal present animates from bottom with dimming background
- [ ] Modal dismiss is faster than present (250ms vs 300ms)
- [ ] Element choreography uses staggered timing (40-80ms per element)
- [ ] Total stagger sequence capped at 500ms
- [ ] Loading states show skeleton immediately for unknown duration
- [ ] Skeleton shimmer animation cycles every 1.5-2 seconds
- [ ] Content appearance uses fade-in (200-300ms)
- [ ] Error states include recovery action (retry button)
- [ ] matchedGeometryEffect used for hero animations between screens
- [ ] Hero animations use matching IDs in source and destination
- [ ] Tab switches use directional slide based on tab position
- [ ] All animations use appropriate easing (ease-in-out for navigation)
- [ ] Spring animations have damping 0.7-0.85 for natural feel
- [ ] No jarring cuts or instant state changes
- [ ] Reduced motion accessibility setting respected
- [ ] Transitions tested on actual devices (not just simulator)
- [ ] Performance profiled (transitions under 16ms per frame)

---

## Anti-Patterns

**Don't**: Use same duration for all transitions
**Why**: Different contexts need different pacing; quick tabs need speed, reveals need drama
**Instead**: Match duration to context (150ms tabs, 300ms modals, 500ms reveals)

**Don't**: Animate everything simultaneously
**Why**: Creates visual noise; nothing feels important
**Instead**: Use staggered choreography with clear sequence

**Don't**: Use linear easing for navigation
**Why**: Feels mechanical and robotic
**Instead**: Use ease-in-out for navigation, ease-out for appearing content

**Don't**: Make transitions too long (>500ms for standard navigation)
**Why**: Feels sluggish; users will repeatedly tap
**Instead**: Keep standard navigation under 350ms

**Don't**: Skip loading states for async operations
**Why**: UI appears frozen; users think app crashed
**Instead**: Show skeleton or spinner after 200ms delay

**Don't**: Use matchedGeometryEffect without matching IDs
**Why**: Elements disappear and reappear instead of morphing
**Instead**: Ensure same ID string used in both source and destination views

**Don't**: Ignore reduced motion preferences
**Why**: Causes discomfort for motion-sensitive users; potential rejection
**Instead**: Check UIAccessibility.isReduceMotionEnabled, use opacity-only transitions

**Don't**: Apply spring animations with low damping (<0.5)
**Why**: Excessive bouncing looks unprofessional
**Instead**: Use damping 0.7-0.85 for subtle, professional springs

**Don't**: Nest multiple animated containers
**Why**: Causes animation conflicts and unexpected behavior
**Instead**: Single animation context at appropriate level

---

## Adjacent Skills

- `animation-system` - Core animation timing and easing for gameplay elements
- `audio-designer` - Sound effects to accompany transitions (whoosh, click)
- `haptic-optimizer` - Subtle haptics on transition completion
- `juice-orchestrator` - Coordinates transitions with other feedback systems
- `swiftui-game-ui` - SwiftUI patterns for game interface implementation
