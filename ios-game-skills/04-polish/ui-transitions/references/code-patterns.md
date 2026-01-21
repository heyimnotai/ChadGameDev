# UI Transitions Code Patterns

## Custom Transition Definitions

```swift
import SwiftUI

extension AnyTransition {
    static var modalPresent: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .bottom).combined(with: .opacity).animation(.easeOut(duration: 0.35)),
            removal: .move(edge: .bottom).combined(with: .opacity).animation(.easeIn(duration: 0.28))
        )
    }

    static var cardFlip: AnyTransition {
        .modifier(active: CardFlipModifier(angle: -90, opacity: 0), identity: CardFlipModifier(angle: 0, opacity: 1))
    }

    static func scaleFromPoint(_ anchor: UnitPoint) -> AnyTransition {
        .scale(scale: 0.1, anchor: anchor).combined(with: .opacity)
    }

    static var blur: AnyTransition {
        .modifier(active: BlurModifier(radius: 20, opacity: 0), identity: BlurModifier(radius: 0, opacity: 1))
    }

    static func push(from edge: Edge) -> AnyTransition {
        .asymmetric(insertion: .move(edge: edge), removal: .move(edge: edge.opposite))
    }

    static var bounceScale: AnyTransition {
        .scale(scale: 0.5).combined(with: .opacity).animation(.spring(response: 0.35, dampingFraction: 0.6))
    }
}

struct CardFlipModifier: ViewModifier {
    let angle: Double, opacity: Double
    func body(content: Content) -> some View {
        content.rotation3DEffect(.degrees(angle), axis: (x: 0, y: 1, z: 0)).opacity(opacity)
    }
}

struct BlurModifier: ViewModifier {
    let radius: CGFloat, opacity: Double
    func body(content: Content) -> some View { content.blur(radius: radius).opacity(opacity) }
}

extension Edge {
    var opposite: Edge {
        switch self { case .top: return .bottom; case .bottom: return .top; case .leading: return .trailing; case .trailing: return .leading }
    }
}
```

## Advanced Stagger Controller

```swift
import SwiftUI
import Combine

final class StaggerAnimationController: ObservableObject {
    @Published private(set) var visibleIndices: Set<Int> = []

    struct Config {
        var staggerDelay: TimeInterval = 0.05
        var itemDuration: TimeInterval = 0.3
        var maxTotalDuration: TimeInterval = 0.5
        var direction: Direction = .forward

        enum Direction { case forward, reverse, center, edges }
    }

    private let config: Config

    init(config: Config = Config()) { self.config = config }

    func animate(itemCount: Int) {
        reset()
        let effectiveStagger = min(config.staggerDelay, config.maxTotalDuration / Double(itemCount))
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

    func reset() { visibleIndices.removeAll() }
    func isVisible(_ index: Int) -> Bool { visibleIndices.contains(index) }

    private func orderedIndices(count: Int) -> [Int] {
        switch config.direction {
        case .forward: return Array(0..<count)
        case .reverse: return Array((0..<count).reversed())
        case .center: return centerOutOrder(count: count)
        case .edges: return edgesInOrder(count: count)
        }
    }

    private func centerOutOrder(count: Int) -> [Int] {
        var result: [Int] = []
        let center = count / 2
        for offset in 0...center {
            if center - offset >= 0 { result.append(center - offset) }
            if center + offset < count && offset > 0 { result.append(center + offset) }
        }
        return result
    }

    private func edgesInOrder(count: Int) -> [Int] {
        var result: [Int] = []
        var left = 0, right = count - 1
        while left <= right {
            result.append(left)
            if left != right { result.append(right) }
            left += 1; right -= 1
        }
        return result
    }
}
```

## Hero Animation with matchedGeometryEffect

```swift
import SwiftUI

struct HeroAnimationView: View {
    @Namespace private var heroNamespace
    @State private var selectedCard: CardItem?

    var body: some View {
        ZStack {
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
            }

            if let card = selectedCard {
                CardDetailView(card: card, namespace: heroNamespace, onClose: {
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                        selectedCard = nil
                    }
                })
            }
        }
    }
}

struct CardThumbnail: View {
    let card: CardItem
    let namespace: Namespace.ID

    var body: some View {
        VStack {
            Image(systemName: card.icon).font(.largeTitle).matchedGeometryEffect(id: "\(card.id)-icon", in: namespace)
            Text(card.title).font(.headline).matchedGeometryEffect(id: "\(card.id)-title", in: namespace)
        }
        .frame(height: 120).frame(maxWidth: .infinity)
        .background(RoundedRectangle(cornerRadius: 16).fill(card.color).matchedGeometryEffect(id: "\(card.id)-bg", in: namespace))
    }
}

struct CardDetailView: View {
    let card: CardItem
    let namespace: Namespace.ID
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            HStack { Spacer(); Button(action: onClose) { Image(systemName: "xmark.circle.fill").font(.title).foregroundColor(.white.opacity(0.7)) } }
            Image(systemName: card.icon).font(.system(size: 80)).matchedGeometryEffect(id: "\(card.id)-icon", in: namespace)
            Text(card.title).font(.largeTitle.bold()).matchedGeometryEffect(id: "\(card.id)-title", in: namespace)
            Spacer()
        }
        .padding().frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(RoundedRectangle(cornerRadius: 24).fill(card.color).matchedGeometryEffect(id: "\(card.id)-bg", in: namespace).ignoresSafeArea())
    }
}
```

## Skeleton Loading View

```swift
import SwiftUI

struct SkeletonView: View {
    @State private var shimmerOffset: CGFloat = -1
    private let shimmerDuration: Double = 1.8

    var body: some View {
        GeometryReader { geometry in
            Rectangle().fill(Color(.systemGray5)).overlay(
                LinearGradient(gradient: Gradient(colors: [.clear, Color.white.opacity(0.4), .clear]), startPoint: .leading, endPoint: .trailing)
                    .frame(width: geometry.size.width * 0.5)
                    .offset(x: shimmerOffset * geometry.size.width)
            ).clipped()
        }
        .onAppear {
            withAnimation(.linear(duration: shimmerDuration).repeatForever(autoreverses: false)) {
                shimmerOffset = 1.5
            }
        }
    }
}

struct SkeletonRow: View {
    var body: some View {
        HStack(spacing: 12) {
            SkeletonView().frame(width: 48, height: 48).clipShape(Circle())
            VStack(alignment: .leading, spacing: 8) {
                SkeletonView().frame(height: 16).frame(maxWidth: 200).clipShape(RoundedRectangle(cornerRadius: 4))
                SkeletonView().frame(height: 12).frame(maxWidth: 120).clipShape(RoundedRectangle(cornerRadius: 4))
            }
            Spacer()
        }.padding().background(Color(.systemBackground)).cornerRadius(12)
    }
}
```

## Modal Presentation with Custom Transition

```swift
import SwiftUI

struct GameModalPresentation: ViewModifier {
    @Binding var isPresented: Bool
    let content: () -> AnyView

    func body(content: Content) -> some View {
        ZStack {
            content
            if isPresented {
                Color.black.opacity(0.5).ignoresSafeArea().transition(.opacity)
                    .onTapGesture { withAnimation(.easeIn(duration: 0.25)) { isPresented = false } }
                self.content().transition(.modalPresent)
            }
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.85), value: isPresented)
    }
}

extension View {
    func gameModal<ModalContent: View>(isPresented: Binding<Bool>, @ViewBuilder content: @escaping () -> ModalContent) -> some View {
        modifier(GameModalPresentation(isPresented: isPresented, content: { AnyView(content()) }))
    }
}
```

## Tab Transition Animation

```swift
import SwiftUI

struct AnimatedTabView: View {
    @State private var selectedTab = 0
    @State private var previousTab = 0
    private let tabCount = 4

    var body: some View {
        ZStack {
            ForEach(0..<tabCount, id: \.self) { index in
                if index == selectedTab {
                    tabContent(for: index).transition(slideTransition(from: previousTab, to: selectedTab))
                }
            }
        }
        .animation(.easeInOut(duration: 0.25), value: selectedTab)
        .safeAreaInset(edge: .bottom) {
            HStack {
                ForEach(0..<tabCount, id: \.self) { index in
                    TabButton(icon: tabIcon(for: index), isSelected: selectedTab == index, action: {
                        previousTab = selectedTab
                        selectedTab = index
                    })
                }
            }.padding().background(.ultraThinMaterial)
        }
    }

    private func slideTransition(from: Int, to: Int) -> AnyTransition {
        let edge: Edge = from < to ? .trailing : .leading
        return .asymmetric(insertion: .move(edge: edge), removal: .move(edge: edge.opposite))
    }
}

struct TabButton: View {
    let icon: String, isSelected: Bool, action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: icon).font(.title2)
                .foregroundColor(isSelected ? .blue : .gray)
                .scaleEffect(isSelected ? 1.1 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isSelected)
        }.frame(maxWidth: .infinity)
    }
}
```

## UIKit View Controller Transition

```swift
import UIKit

final class SlideTransitionAnimator: NSObject, UIViewControllerAnimatedTransitioning {
    enum Direction { case present, dismiss }
    private let direction: Direction
    private let duration: TimeInterval

    init(direction: Direction, duration: TimeInterval = 0.35) {
        self.direction = direction
        self.duration = duration
    }

    func transitionDuration(using context: UIViewControllerContextTransitioning?) -> TimeInterval { duration }

    func animateTransition(using context: UIViewControllerContextTransitioning) {
        guard let fromVC = context.viewController(forKey: .from),
              let toVC = context.viewController(forKey: .to) else { context.completeTransition(false); return }

        let container = context.containerView

        if direction == .present {
            container.addSubview(toVC.view)
            toVC.view.frame = container.bounds.offsetBy(dx: container.bounds.width, dy: 0)
            UIView.animate(withDuration: duration, delay: 0, usingSpringWithDamping: 0.85, initialSpringVelocity: 0, options: .curveEaseOut) {
                toVC.view.frame = container.bounds
                fromVC.view.frame = container.bounds.offsetBy(dx: -container.bounds.width * 0.3, dy: 0)
            } completion: { _ in context.completeTransition(!context.transitionWasCancelled) }
        } else {
            container.insertSubview(toVC.view, belowSubview: fromVC.view)
            toVC.view.frame = container.bounds.offsetBy(dx: -container.bounds.width * 0.3, dy: 0)
            UIView.animate(withDuration: duration, delay: 0, usingSpringWithDamping: 0.85, initialSpringVelocity: 0, options: .curveEaseIn) {
                fromVC.view.frame = container.bounds.offsetBy(dx: container.bounds.width, dy: 0)
                toVC.view.frame = container.bounds
            } completion: { _ in context.completeTransition(!context.transitionWasCancelled) }
        }
    }
}
```
