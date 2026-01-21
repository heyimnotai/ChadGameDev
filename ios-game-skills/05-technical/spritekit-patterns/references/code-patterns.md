# SpriteKit Code Patterns

## Scene Architecture Template

```swift
import SpriteKit

final class GameScene: SKScene {
    // Layer Nodes (Z-ordered)
    private let backgroundLayer = SKNode()
    private let gameLayer = SKNode()
    private let effectsLayer = SKNode()
    private let hudLayer = SKNode()

    // Game State
    private var lastUpdateTime: TimeInterval = 0
    private var deltaTime: TimeInterval = 0

    // Node Pools
    private var bulletPool: NodePool<BulletNode>!
    private var enemyPool: NodePool<EnemyNode>!

    override func didMove(to view: SKView) {
        setupLayers()
        setupPhysics()
        setupNodePools()
        startGame()
    }

    private func setupLayers() {
        backgroundLayer.zPosition = 0
        gameLayer.zPosition = 100
        effectsLayer.zPosition = 200
        hudLayer.zPosition = 300
        [backgroundLayer, gameLayer, effectsLayer, hudLayer].forEach { addChild($0) }
    }

    private func setupPhysics() {
        physicsWorld.gravity = CGVector(dx: 0, dy: -9.8)
        physicsWorld.contactDelegate = self
        view?.ignoresSiblingOrder = true
    }

    private func setupNodePools() {
        bulletPool = NodePool(capacity: 50) { BulletNode() }
        enemyPool = NodePool(capacity: 30) { EnemyNode() }
    }

    override func update(_ currentTime: TimeInterval) {
        if lastUpdateTime == 0 { lastUpdateTime = currentTime }
        deltaTime = currentTime - lastUpdateTime
        lastUpdateTime = currentTime
        let cappedDelta = min(deltaTime, 1.0 / 30.0)
        updatePlayer(deltaTime: cappedDelta)
        updateEnemies(deltaTime: cappedDelta)
    }

    override func didFinishUpdate() {
        removeOffscreenNodes()
    }
}

extension GameScene: SKPhysicsContactDelegate {
    func didBegin(_ contact: SKPhysicsContact) {
        let collision = contact.bodyA.categoryBitMask | contact.bodyB.categoryBitMask
        switch collision {
        case PhysicsCategory.player | PhysicsCategory.enemy:
            handlePlayerEnemyCollision(contact)
        case PhysicsCategory.bullet | PhysicsCategory.enemy:
            handleBulletEnemyCollision(contact)
        default: break
        }
    }
}
```

## Physics Category Constants

```swift
struct PhysicsCategory {
    static let none:       UInt32 = 0
    static let player:     UInt32 = 0b1
    static let enemy:      UInt32 = 0b10
    static let bullet:     UInt32 = 0b100
    static let wall:       UInt32 = 0b1000
    static let collectible: UInt32 = 0b10000
    static let all:        UInt32 = UInt32.max
}

func setupPhysicsBody(for sprite: SKSpriteNode, category: UInt32) {
    sprite.physicsBody = SKPhysicsBody(rectangleOf: sprite.size)
    sprite.physicsBody?.categoryBitMask = category
    sprite.physicsBody?.collisionBitMask = PhysicsCategory.wall
    sprite.physicsBody?.contactTestBitMask = PhysicsCategory.player | PhysicsCategory.enemy
    sprite.physicsBody?.isDynamic = true
    sprite.physicsBody?.affectedByGravity = false
    sprite.physicsBody?.allowsRotation = false
}
```

## Node Pool Implementation

```swift
final class NodePool<T: SKNode> {
    private var available: [T] = []
    private var inUse: Set<T> = []
    private let factory: () -> T

    init(capacity: Int, factory: @escaping () -> T) {
        self.factory = factory
        for _ in 0..<capacity {
            let node = factory()
            node.removeFromParent()
            available.append(node)
        }
    }

    func acquire() -> T {
        let node = available.popLast() ?? factory()
        inUse.insert(node)
        node.isHidden = false
        return node
    }

    func `return`(_ node: T) {
        guard inUse.contains(node) else { return }
        inUse.remove(node)
        node.removeAllActions()
        node.removeFromParent()
        node.isHidden = true
        node.position = .zero
        node.physicsBody?.velocity = .zero
        node.physicsBody?.angularVelocity = 0
        available.append(node)
    }
}
```

## Texture Atlas Usage

```swift
final class TextureManager {
    static let shared = TextureManager()
    private var characterAtlas: SKTextureAtlas?

    func preloadGameTextures(completion: @escaping () -> Void) {
        SKTextureAtlas.preloadTextureAtlasesNamed(["Characters", "Environment"]) { error, atlases in
            self.characterAtlas = atlases.first { $0.textureNames.contains("player_idle_1") }
            DispatchQueue.main.async { completion() }
        }
    }

    func animationTextures(baseName: String, count: Int, from atlas: SKTextureAtlas?) -> [SKTexture] {
        (1...count).map { atlas?.textureNamed("\(baseName)_\($0)") ?? SKTexture() }
    }
}
```

## Action Sequencing Patterns

```swift
extension SKNode {
    func animateButtonPress(completion: (() -> Void)? = nil) {
        let scaleDown = SKAction.scale(to: 0.95, duration: 0.05)
        let scaleUp = SKAction.scale(to: 1.0, duration: 0.1)
        scaleDown.timingMode = .easeOut
        scaleUp.timingMode = .easeOut
        run(SKAction.sequence([scaleDown, scaleUp])) { completion?() }
    }

    func animateJump(height: CGFloat, duration: TimeInterval) {
        let originalScale = xScale
        let anticipation = SKAction.group([
            SKAction.scaleX(to: originalScale * 1.2, duration: 0.08),
            SKAction.scaleY(to: originalScale * 0.8, duration: 0.08)
        ])
        let rise = SKAction.moveBy(x: 0, y: height, duration: duration / 2)
        rise.timingMode = .easeOut
        let fall = SKAction.moveBy(x: 0, y: -height, duration: duration / 2)
        fall.timingMode = .easeIn
        let recover = SKAction.scale(to: originalScale, duration: 0.1)
        run(SKAction.sequence([anticipation, rise, fall, recover]))
    }
}
```

## SpriteView SwiftUI Integration

```swift
import SwiftUI
import SpriteKit

struct GameContainerView: View {
    @StateObject private var gameState = GameState()

    var body: some View {
        ZStack {
            SpriteView(scene: makeGameScene(), options: [.ignoresSiblingOrder, .shouldCullNonVisibleNodes])
                .ignoresSafeArea()
            GameUIOverlay(gameState: gameState)
        }
    }

    private func makeGameScene() -> GameScene {
        let scene = GameScene(size: UIScreen.main.bounds.size)
        scene.scaleMode = .aspectFill
        scene.gameState = gameState
        return scene
    }
}

final class GameState: ObservableObject {
    @Published var score: Int = 0
    @Published var lives: Int = 3
    @Published var isPaused: Bool = false
    @Published var isGameOver: Bool = false
}
```
