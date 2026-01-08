---
name: spritekit-patterns
description: Implements best practices for SpriteKit 2D game development on iOS/iPadOS. Use this skill when building games with physics, sprite animations, particle effects, or any 2D rendering needs. Triggers on SpriteKit scene creation, node hierarchy design, texture management, physics optimization, action sequencing, and 60fps performance maintenance. This skill covers the complete SpriteKit architecture from scene setup to production-ready game templates.
---

# SpriteKit Patterns

## Purpose

This skill enables Claude to build production-quality 2D games using Apple's SpriteKit framework. It enforces architecture patterns that maintain 60fps on all supported devices, optimize memory through texture atlases and node pooling, and integrate seamlessly with SwiftUI via SpriteView. The quality bar targets top 10% App Store games with smooth animations, responsive physics, and efficient resource usage.

## Domain Boundaries

- **This skill handles**:
  - SKScene architecture and lifecycle management
  - SKNode hierarchy design and optimization
  - SKPhysicsBody configuration and collision handling
  - SKTexture and SKTextureAtlas management
  - SKAction sequences and custom actions
  - Game loop patterns with delta time
  - Node pooling for frequently spawned objects
  - SpriteView integration with SwiftUI
  - Memory management for sprite-based games
  - 60fps maintenance techniques

- **This skill does NOT handle**:
  - SwiftUI game UI overlays (see: swiftui-game-ui)
  - 120Hz ProMotion configuration (see: performance-optimizer)
  - Asset compression and formats (see: asset-pipeline)
  - Analytics event tracking (see: analytics-integration)
  - 3D rendering with SceneKit or Metal
  - Game Center integration (see: 01-compliance/game-center-integration)

## Core Specifications

### Scene Architecture

| Component | Specification |
|-----------|---------------|
| Scene size | Design at 1x scale (e.g., 375x667 for iPhone SE base) |
| Scale mode | `.aspectFill` for games, `.resizeFill` for UI-heavy |
| Anchor point | (0.5, 0.5) for centered games, (0, 0) for tile-based |
| Node limit | < 500 visible nodes for 60fps on A10 chips |
| Draw calls | < 50 per frame target |

### Physics Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| Physics iterations | 4 (default) | Increase to 8 for precision puzzles |
| Speed | 1.0 | Reduce for slow-motion effects |
| Gravity | (0, -9.8) | Standard Earth gravity |
| Contact bit masks | Powers of 2 | Use UInt32 category masks |

### Texture Atlas Specifications

| Metric | Limit |
|--------|-------|
| Maximum atlas size | 4096x4096 pixels |
| Recommended atlas size | 2048x2048 pixels |
| Sprites per atlas | Organize by usage pattern, not globally |
| Format | ASTC 4x4 for quality, ASTC 8x8 for backgrounds |

### Frame Timing

| Metric | Target |
|--------|--------|
| Frame budget | 16.67ms (60fps) |
| Update loop | < 8ms |
| Physics step | < 4ms |
| Render | < 4ms |

## Implementation Patterns

### Scene Architecture Template

```swift
import SpriteKit

final class GameScene: SKScene {

    // MARK: - Layer Nodes (Z-ordered)
    private let backgroundLayer = SKNode()
    private let gameLayer = SKNode()
    private let effectsLayer = SKNode()
    private let hudLayer = SKNode()

    // MARK: - Game State
    private var lastUpdateTime: TimeInterval = 0
    private var deltaTime: TimeInterval = 0

    // MARK: - Node Pools
    private var bulletPool: NodePool<BulletNode>!
    private var enemyPool: NodePool<EnemyNode>!

    // MARK: - Lifecycle

    override func didMove(to view: SKView) {
        setupLayers()
        setupPhysics()
        setupNodePools()
        startGame()
    }

    private func setupLayers() {
        // Z-position ordering
        backgroundLayer.zPosition = 0
        gameLayer.zPosition = 100
        effectsLayer.zPosition = 200
        hudLayer.zPosition = 300

        addChild(backgroundLayer)
        addChild(gameLayer)
        addChild(effectsLayer)
        addChild(hudLayer)
    }

    private func setupPhysics() {
        physicsWorld.gravity = CGVector(dx: 0, dy: -9.8)
        physicsWorld.contactDelegate = self

        // Performance optimization
        view?.ignoresSiblingOrder = true
        view?.showsFPS = false // Disable in production
        view?.showsNodeCount = false
    }

    private func setupNodePools() {
        bulletPool = NodePool(capacity: 50) { BulletNode() }
        enemyPool = NodePool(capacity: 30) { EnemyNode() }
    }

    // MARK: - Update Loop

    override func update(_ currentTime: TimeInterval) {
        // Calculate delta time
        if lastUpdateTime == 0 {
            lastUpdateTime = currentTime
        }
        deltaTime = currentTime - lastUpdateTime
        lastUpdateTime = currentTime

        // Cap delta time to prevent physics explosions after pause
        let cappedDelta = min(deltaTime, 1.0 / 30.0)

        // Update game entities with delta time
        updatePlayer(deltaTime: cappedDelta)
        updateEnemies(deltaTime: cappedDelta)
        updateProjectiles(deltaTime: cappedDelta)
    }

    override func didFinishUpdate() {
        // Post-physics cleanup
        removeOffscreenNodes()
    }

    // MARK: - Entity Updates

    private func updatePlayer(deltaTime: TimeInterval) {
        // Movement with delta time
        let speed: CGFloat = 200 // points per second
        player.position.x += velocity.x * speed * CGFloat(deltaTime)
    }

    private func updateEnemies(deltaTime: TimeInterval) {
        gameLayer.children.compactMap { $0 as? EnemyNode }.forEach {
            $0.update(deltaTime: deltaTime)
        }
    }

    private func updateProjectiles(deltaTime: TimeInterval) {
        gameLayer.children.compactMap { $0 as? BulletNode }.forEach {
            $0.update(deltaTime: deltaTime)
        }
    }

    // MARK: - Node Management

    private func removeOffscreenNodes() {
        let margin: CGFloat = 50
        let bounds = CGRect(
            x: -size.width/2 - margin,
            y: -size.height/2 - margin,
            width: size.width + margin * 2,
            height: size.height + margin * 2
        )

        gameLayer.children.forEach { node in
            if !bounds.contains(node.position) {
                if let bullet = node as? BulletNode {
                    bulletPool.return(bullet)
                } else if let enemy = node as? EnemyNode {
                    enemyPool.return(enemy)
                }
            }
        }
    }
}

// MARK: - Physics Contact Delegate

extension GameScene: SKPhysicsContactDelegate {

    func didBegin(_ contact: SKPhysicsContact) {
        let collision = contact.bodyA.categoryBitMask | contact.bodyB.categoryBitMask

        switch collision {
        case PhysicsCategory.player | PhysicsCategory.enemy:
            handlePlayerEnemyCollision(contact)
        case PhysicsCategory.bullet | PhysicsCategory.enemy:
            handleBulletEnemyCollision(contact)
        default:
            break
        }
    }
}
```

### Physics Category Constants

```swift
struct PhysicsCategory {
    static let none:       UInt32 = 0
    static let player:     UInt32 = 0b1        // 1
    static let enemy:      UInt32 = 0b10       // 2
    static let bullet:     UInt32 = 0b100      // 4
    static let wall:       UInt32 = 0b1000     // 8
    static let collectible: UInt32 = 0b10000   // 16
    static let all:        UInt32 = UInt32.max
}

// Physics body setup
func setupPhysicsBody(for sprite: SKSpriteNode, category: UInt32) {
    sprite.physicsBody = SKPhysicsBody(rectangleOf: sprite.size)
    sprite.physicsBody?.categoryBitMask = category
    sprite.physicsBody?.collisionBitMask = PhysicsCategory.wall
    sprite.physicsBody?.contactTestBitMask = PhysicsCategory.player | PhysicsCategory.enemy
    sprite.physicsBody?.isDynamic = true
    sprite.physicsBody?.affectedByGravity = false
    sprite.physicsBody?.allowsRotation = false
    sprite.physicsBody?.friction = 0
    sprite.physicsBody?.restitution = 0
    sprite.physicsBody?.linearDamping = 0
}
```

### Node Pool Implementation

```swift
final class NodePool<T: SKNode> {
    private var available: [T] = []
    private var inUse: Set<T> = []
    private let factory: () -> T

    init(capacity: Int, factory: @escaping () -> T) {
        self.factory = factory

        // Pre-populate pool
        for _ in 0..<capacity {
            let node = factory()
            node.removeFromParent()
            available.append(node)
        }
    }

    func acquire() -> T {
        let node: T

        if let recycled = available.popLast() {
            node = recycled
        } else {
            node = factory()
        }

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

        // Reset physics state
        node.physicsBody?.velocity = .zero
        node.physicsBody?.angularVelocity = 0

        available.append(node)
    }

    func returnAll() {
        inUse.forEach { `return`($0) }
    }

    var activeCount: Int { inUse.count }
    var availableCount: Int { available.count }
}
```

### Texture Atlas Usage

```swift
final class TextureManager {
    static let shared = TextureManager()

    // Organize atlases by usage pattern
    private var characterAtlas: SKTextureAtlas?
    private var environmentAtlas: SKTextureAtlas?
    private var effectsAtlas: SKTextureAtlas?
    private var uiAtlas: SKTextureAtlas?

    private init() {}

    func preloadGameTextures(completion: @escaping () -> Void) {
        let atlasNames = ["Characters", "Environment", "Effects", "UI"]

        SKTextureAtlas.preloadTextureAtlasesNamed(atlasNames) { error, atlases in
            if let error = error {
                print("Atlas preload error: \(error)")
            }

            // Cache references
            self.characterAtlas = atlases.first { $0.textureNames.contains("player_idle_1") }
            self.environmentAtlas = atlases.first { $0.textureNames.contains("tile_grass") }
            self.effectsAtlas = atlases.first { $0.textureNames.contains("particle_spark") }
            self.uiAtlas = atlases.first { $0.textureNames.contains("button_play") }

            DispatchQueue.main.async {
                completion()
            }
        }
    }

    func texture(named name: String, from atlas: SKTextureAtlas?) -> SKTexture {
        guard let atlas = atlas else {
            return SKTexture(imageNamed: name)
        }
        return atlas.textureNamed(name)
    }

    // Animation frame helper
    func animationTextures(
        baseName: String,
        count: Int,
        from atlas: SKTextureAtlas?
    ) -> [SKTexture] {
        return (1...count).map { index in
            texture(named: "\(baseName)_\(index)", from: atlas)
        }
    }
}

// Usage
let walkTextures = TextureManager.shared.animationTextures(
    baseName: "player_walk",
    count: 8,
    from: characterAtlas
)

let walkAnimation = SKAction.animate(
    with: walkTextures,
    timePerFrame: 0.1,
    resize: false,
    restore: true
)
```

### Action Sequencing Patterns

```swift
extension SKNode {

    // Button press feedback (100-150ms)
    func animateButtonPress(completion: (() -> Void)? = nil) {
        let scaleDown = SKAction.scale(to: 0.95, duration: 0.05)
        let scaleUp = SKAction.scale(to: 1.0, duration: 0.1)
        scaleDown.timingMode = .easeOut
        scaleUp.timingMode = .easeOut

        let sequence = SKAction.sequence([scaleDown, scaleUp])
        run(sequence) {
            completion?()
        }
    }

    // Item collection animation
    func animateCollection(
        to target: CGPoint,
        completion: @escaping () -> Void
    ) {
        // Scale up with ease-out (50ms)
        let scaleUp = SKAction.scale(to: 1.3, duration: 0.05)
        scaleUp.timingMode = .easeOut

        // Move to UI counter (200ms)
        let move = SKAction.move(to: target, duration: 0.2)
        move.timingMode = .easeInEaseOut

        // Fade and scale down
        let fadeScale = SKAction.group([
            SKAction.fadeOut(withDuration: 0.1),
            SKAction.scale(to: 0.5, duration: 0.1)
        ])

        let sequence = SKAction.sequence([
            scaleUp,
            move,
            fadeScale,
            SKAction.removeFromParent()
        ])

        run(sequence, completion: completion)
    }

    // Squash and stretch for jump
    func animateJump(height: CGFloat, duration: TimeInterval) {
        let originalScale = xScale

        // Anticipation squash (50-100ms)
        let anticipation = SKAction.group([
            SKAction.scaleX(to: originalScale * 1.2, duration: 0.08),
            SKAction.scaleY(to: originalScale * 0.8, duration: 0.08)
        ])

        // Jump stretch
        let jumpStretch = SKAction.group([
            SKAction.scaleX(to: originalScale * 0.8, duration: 0.05),
            SKAction.scaleY(to: originalScale * 1.2, duration: 0.05)
        ])

        // Rise
        let rise = SKAction.moveBy(x: 0, y: height, duration: duration / 2)
        rise.timingMode = .easeOut

        // Fall
        let fall = SKAction.moveBy(x: 0, y: -height, duration: duration / 2)
        fall.timingMode = .easeIn

        // Land squash (50ms)
        let landSquash = SKAction.group([
            SKAction.scaleX(to: originalScale * 1.3, duration: 0.05),
            SKAction.scaleY(to: originalScale * 0.7, duration: 0.05)
        ])

        // Recover (100ms)
        let recover = SKAction.group([
            SKAction.scaleX(to: originalScale, duration: 0.1),
            SKAction.scaleY(to: originalScale, duration: 0.1)
        ])

        let sequence = SKAction.sequence([
            anticipation,
            jumpStretch,
            rise,
            SKAction.group([fall, SKAction.scaleY(to: originalScale * 0.9, duration: duration / 2)]),
            landSquash,
            recover
        ])

        run(sequence)
    }
}
```

### SpriteView SwiftUI Integration

```swift
import SwiftUI
import SpriteKit

struct GameContainerView: View {
    @StateObject private var gameState = GameState()

    var body: some View {
        ZStack {
            // SpriteKit game layer
            SpriteView(
                scene: makeGameScene(),
                options: [.ignoresSiblingOrder, .shouldCullNonVisibleNodes]
            )
            .ignoresSafeArea()

            // SwiftUI UI overlay
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

// Game state observable for UI updates
final class GameState: ObservableObject {
    @Published var score: Int = 0
    @Published var lives: Int = 3
    @Published var isPaused: Bool = false
    @Published var isGameOver: Bool = false

    func reset() {
        score = 0
        lives = 3
        isPaused = false
        isGameOver = false
    }
}

// Scene communicates with SwiftUI via game state
final class GameScene: SKScene {
    weak var gameState: GameState?

    func playerScored(points: Int) {
        DispatchQueue.main.async {
            self.gameState?.score += points
        }
    }

    func playerDied() {
        DispatchQueue.main.async {
            guard let state = self.gameState else { return }
            state.lives -= 1
            if state.lives <= 0 {
                state.isGameOver = true
            }
        }
    }
}
```

### Complete Game Template

```swift
import SpriteKit
import GameplayKit

// MARK: - Game Configuration

struct GameConfig {
    static let playerSpeed: CGFloat = 200
    static let bulletSpeed: CGFloat = 400
    static let enemySpeed: CGFloat = 100
    static let spawnInterval: TimeInterval = 2.0
    static let maxEnemies: Int = 10
}

// MARK: - Player Node

final class PlayerNode: SKSpriteNode {

    private var isInvulnerable = false

    init() {
        let texture = SKTexture(imageNamed: "player")
        super.init(texture: texture, color: .clear, size: texture.size())

        setupPhysics()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func setupPhysics() {
        physicsBody = SKPhysicsBody(rectangleOf: size)
        physicsBody?.categoryBitMask = PhysicsCategory.player
        physicsBody?.collisionBitMask = PhysicsCategory.wall
        physicsBody?.contactTestBitMask = PhysicsCategory.enemy | PhysicsCategory.collectible
        physicsBody?.isDynamic = true
        physicsBody?.affectedByGravity = false
        physicsBody?.allowsRotation = false
    }

    func move(direction: CGVector, deltaTime: TimeInterval) {
        let movement = CGVector(
            dx: direction.dx * GameConfig.playerSpeed * CGFloat(deltaTime),
            dy: direction.dy * GameConfig.playerSpeed * CGFloat(deltaTime)
        )
        position.x += movement.dx
        position.y += movement.dy
    }

    func takeDamage() {
        guard !isInvulnerable else { return }

        isInvulnerable = true

        // Flash effect
        let flash = SKAction.sequence([
            SKAction.fadeAlpha(to: 0.3, duration: 0.1),
            SKAction.fadeAlpha(to: 1.0, duration: 0.1)
        ])
        let flashSequence = SKAction.repeat(flash, count: 5)

        run(flashSequence) {
            self.isInvulnerable = false
        }
    }
}

// MARK: - Enemy Node

final class EnemyNode: SKSpriteNode {

    var health: Int = 1

    override init(texture: SKTexture?, color: UIColor, size: CGSize) {
        super.init(texture: texture, color: color, size: size)
    }

    convenience init() {
        let texture = SKTexture(imageNamed: "enemy")
        self.init(texture: texture, color: .clear, size: texture.size())
        setupPhysics()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func setupPhysics() {
        physicsBody = SKPhysicsBody(rectangleOf: size)
        physicsBody?.categoryBitMask = PhysicsCategory.enemy
        physicsBody?.collisionBitMask = PhysicsCategory.wall | PhysicsCategory.enemy
        physicsBody?.contactTestBitMask = PhysicsCategory.player | PhysicsCategory.bullet
        physicsBody?.isDynamic = true
        physicsBody?.affectedByGravity = false
    }

    func update(deltaTime: TimeInterval) {
        // Override in subclasses for AI behavior
    }

    func reset() {
        health = 1
        removeAllActions()
        alpha = 1.0
        setScale(1.0)
    }

    func die(completion: @escaping () -> Void) {
        physicsBody = nil

        let deathAnimation = SKAction.group([
            SKAction.fadeOut(withDuration: 0.2),
            SKAction.scale(to: 1.5, duration: 0.2)
        ])

        run(deathAnimation, completion: completion)
    }
}

// MARK: - Bullet Node

final class BulletNode: SKSpriteNode {

    var velocity: CGVector = .zero

    convenience init() {
        self.init(color: .yellow, size: CGSize(width: 8, height: 8))
        setupPhysics()
    }

    override init(texture: SKTexture?, color: UIColor, size: CGSize) {
        super.init(texture: texture, color: color, size: size)
    }

    required init?(coder: NSCoder) { fatalError() }

    private func setupPhysics() {
        physicsBody = SKPhysicsBody(rectangleOf: size)
        physicsBody?.categoryBitMask = PhysicsCategory.bullet
        physicsBody?.collisionBitMask = PhysicsCategory.none
        physicsBody?.contactTestBitMask = PhysicsCategory.enemy
        physicsBody?.isDynamic = true
        physicsBody?.affectedByGravity = false
    }

    func update(deltaTime: TimeInterval) {
        position.x += velocity.dx * CGFloat(deltaTime)
        position.y += velocity.dy * CGFloat(deltaTime)
    }

    func reset() {
        velocity = .zero
        removeAllActions()
    }

    func fire(from origin: CGPoint, direction: CGVector) {
        position = origin
        velocity = CGVector(
            dx: direction.dx * GameConfig.bulletSpeed,
            dy: direction.dy * GameConfig.bulletSpeed
        )
    }
}

// MARK: - Complete Game Scene

final class CompleteGameScene: SKScene {

    // Layers
    private let backgroundLayer = SKNode()
    private let gameLayer = SKNode()
    private let effectsLayer = SKNode()

    // Game objects
    private var player: PlayerNode!
    private var bulletPool: NodePool<BulletNode>!
    private var enemyPool: NodePool<EnemyNode>!

    // State
    private var lastUpdateTime: TimeInterval = 0
    private var lastSpawnTime: TimeInterval = 0
    private var inputDirection: CGVector = .zero

    // Communication with SwiftUI
    weak var gameState: GameState?

    // MARK: - Setup

    override func didMove(to view: SKView) {
        backgroundColor = .darkGray

        setupLayers()
        setupPhysics()
        setupPlayer()
        setupPools()
        setupBoundary()
    }

    private func setupLayers() {
        backgroundLayer.zPosition = 0
        gameLayer.zPosition = 100
        effectsLayer.zPosition = 200

        addChild(backgroundLayer)
        addChild(gameLayer)
        addChild(effectsLayer)
    }

    private func setupPhysics() {
        physicsWorld.gravity = .zero
        physicsWorld.contactDelegate = self
        view?.ignoresSiblingOrder = true
    }

    private func setupPlayer() {
        player = PlayerNode()
        player.position = CGPoint(x: size.width / 2, y: size.height / 4)
        gameLayer.addChild(player)
    }

    private func setupPools() {
        bulletPool = NodePool(capacity: 50) { BulletNode() }
        enemyPool = NodePool(capacity: 30) { EnemyNode() }
    }

    private func setupBoundary() {
        let boundary = SKPhysicsBody(edgeLoopFrom: frame)
        boundary.categoryBitMask = PhysicsCategory.wall
        physicsBody = boundary
    }

    // MARK: - Update Loop

    override func update(_ currentTime: TimeInterval) {
        guard gameState?.isGameOver == false,
              gameState?.isPaused == false else { return }

        // Delta time calculation
        if lastUpdateTime == 0 {
            lastUpdateTime = currentTime
        }
        let deltaTime = min(currentTime - lastUpdateTime, 1.0 / 30.0)
        lastUpdateTime = currentTime

        // Update game objects
        player.move(direction: inputDirection, deltaTime: deltaTime)
        updateBullets(deltaTime: deltaTime)
        updateEnemies(deltaTime: deltaTime)

        // Spawn enemies
        if currentTime - lastSpawnTime > GameConfig.spawnInterval {
            spawnEnemy()
            lastSpawnTime = currentTime
        }
    }

    private func updateBullets(deltaTime: TimeInterval) {
        gameLayer.children.compactMap { $0 as? BulletNode }.forEach {
            $0.update(deltaTime: deltaTime)

            // Return offscreen bullets to pool
            if !frame.insetBy(dx: -50, dy: -50).contains($0.position) {
                bulletPool.return($0)
            }
        }
    }

    private func updateEnemies(deltaTime: TimeInterval) {
        gameLayer.children.compactMap { $0 as? EnemyNode }.forEach {
            $0.update(deltaTime: deltaTime)

            // Simple AI: move toward player
            let direction = CGVector(
                dx: player.position.x - $0.position.x,
                dy: player.position.y - $0.position.y
            )
            let length = sqrt(direction.dx * direction.dx + direction.dy * direction.dy)
            if length > 0 {
                let normalized = CGVector(dx: direction.dx / length, dy: direction.dy / length)
                $0.position.x += normalized.dx * GameConfig.enemySpeed * CGFloat(deltaTime)
                $0.position.y += normalized.dy * GameConfig.enemySpeed * CGFloat(deltaTime)
            }
        }
    }

    // MARK: - Spawning

    private func spawnEnemy() {
        let activeEnemies = gameLayer.children.filter { $0 is EnemyNode }.count
        guard activeEnemies < GameConfig.maxEnemies else { return }

        let enemy = enemyPool.acquire()
        enemy.reset()

        // Spawn at random edge
        let edge = Int.random(in: 0...3)
        switch edge {
        case 0: // Top
            enemy.position = CGPoint(x: CGFloat.random(in: 0...size.width), y: size.height + 20)
        case 1: // Right
            enemy.position = CGPoint(x: size.width + 20, y: CGFloat.random(in: 0...size.height))
        case 2: // Bottom
            enemy.position = CGPoint(x: CGFloat.random(in: 0...size.width), y: -20)
        default: // Left
            enemy.position = CGPoint(x: -20, y: CGFloat.random(in: 0...size.height))
        }

        gameLayer.addChild(enemy)
    }

    private func fireBullet() {
        let bullet = bulletPool.acquire()
        bullet.reset()
        bullet.fire(from: player.position, direction: CGVector(dx: 0, dy: 1))
        gameLayer.addChild(bullet)
    }

    // MARK: - Input Handling

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        fireBullet()
    }

    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        let location = touch.location(in: self)
        let previous = touch.previousLocation(in: self)

        let delta = CGVector(dx: location.x - previous.x, dy: location.y - previous.y)
        inputDirection = delta
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        inputDirection = .zero
    }

    // MARK: - Effects

    private func spawnExplosion(at position: CGPoint) {
        guard let particles = SKEmitterNode(fileNamed: "Explosion") else { return }
        particles.position = position
        particles.zPosition = effectsLayer.zPosition
        effectsLayer.addChild(particles)

        let wait = SKAction.wait(forDuration: 1.0)
        let remove = SKAction.removeFromParent()
        particles.run(SKAction.sequence([wait, remove]))
    }
}

// MARK: - Physics Contact

extension CompleteGameScene: SKPhysicsContactDelegate {

    func didBegin(_ contact: SKPhysicsContact) {
        let collision = contact.bodyA.categoryBitMask | contact.bodyB.categoryBitMask

        switch collision {
        case PhysicsCategory.player | PhysicsCategory.enemy:
            handlePlayerEnemyCollision(contact)

        case PhysicsCategory.bullet | PhysicsCategory.enemy:
            handleBulletEnemyCollision(contact)

        default:
            break
        }
    }

    private func handlePlayerEnemyCollision(_ contact: SKPhysicsContact) {
        player.takeDamage()
        gameState?.lives -= 1

        if let state = gameState, state.lives <= 0 {
            state.isGameOver = true
        }
    }

    private func handleBulletEnemyCollision(_ contact: SKPhysicsContact) {
        let bullet = contact.bodyA.categoryBitMask == PhysicsCategory.bullet
            ? contact.bodyA.node as? BulletNode
            : contact.bodyB.node as? BulletNode

        let enemy = contact.bodyA.categoryBitMask == PhysicsCategory.enemy
            ? contact.bodyA.node as? EnemyNode
            : contact.bodyB.node as? EnemyNode

        if let bullet = bullet {
            bulletPool.return(bullet)
        }

        if let enemy = enemy {
            enemy.health -= 1
            if enemy.health <= 0 {
                let position = enemy.position
                enemy.die { [weak self] in
                    self?.enemyPool.return(enemy)
                }
                spawnExplosion(at: position)
                gameState?.score += 100
            }
        }
    }
}
```

## Decision Trees

### When to Use Node Pooling

```
Is the node spawned frequently (>1 per second)?
├─ YES → Use node pooling
│   └─ Pre-allocate: expectedMaxSimultaneous * 1.5
└─ NO → Is the node expensive to create?
    ├─ YES → Use node pooling with smaller pool
    └─ NO → Create nodes on demand
```

### Scene Scale Mode Selection

```
What type of game?
├─ Action/Arcade (fixed play area)
│   └─ Use .aspectFill (crop edges, maintain ratio)
├─ UI-heavy (menus, cards)
│   └─ Use .resizeFill (stretch to fit)
├─ Tile-based/Strategy
│   └─ Use .aspectFit (letterbox, see all content)
└─ Full-screen casual
    └─ Use .aspectFill with safe area awareness
```

### Physics Body Selection

```
What shape is the sprite?
├─ Rectangular
│   └─ SKPhysicsBody(rectangleOf:) - fastest
├─ Circular
│   └─ SKPhysicsBody(circleOfRadius:) - fast
├─ Complex with simple outline
│   └─ SKPhysicsBody(polygonFrom:) - moderate
├─ Complex requiring precision
│   └─ SKPhysicsBody(texture:size:) - slowest, use sparingly
└─ Static boundary
    └─ SKPhysicsBody(edgeLoopFrom:) - no simulation cost
```

## Quality Checklist

### Scene Setup
- [ ] `ignoresSiblingOrder = true` set on SKView
- [ ] Layers organized by z-position (background, game, effects, UI)
- [ ] Physics world configured with appropriate gravity
- [ ] Contact delegate set for collision handling

### Performance
- [ ] Delta time calculated and capped (max 1/30 second)
- [ ] Node count < 500 visible nodes
- [ ] Node pooling implemented for frequently spawned objects
- [ ] Offscreen nodes removed or recycled
- [ ] Texture atlases organized by usage pattern

### Physics
- [ ] Category bit masks use powers of 2
- [ ] Contact test masks set only for needed collisions
- [ ] Collision masks configured to prevent unwanted interactions
- [ ] Dynamic bodies disabled for static objects

### Memory
- [ ] Texture atlases preloaded before gameplay
- [ ] Particle emitters have finite lifetimes
- [ ] Actions removed from recycled nodes
- [ ] Strong reference cycles avoided (weak self in closures)

### Integration
- [ ] SpriteView configured with performance options
- [ ] Game state communicated via observable object
- [ ] Pause/resume handled when app backgrounds

## Anti-Patterns

### DO NOT: Enumerate nodes in update loop

```swift
// WRONG - O(n) search every frame
override func update(_ currentTime: TimeInterval) {
    enumerateChildNodes(withName: "enemy") { node, _ in
        // Process enemy
    }
}

// CORRECT - Keep direct references
private var enemies: [EnemyNode] = []

override func update(_ currentTime: TimeInterval) {
    enemies.forEach { $0.update(deltaTime: deltaTime) }
}
```

### DO NOT: Create textures in update loop

```swift
// WRONG - Creates new texture object every frame
override func update(_ currentTime: TimeInterval) {
    let texture = SKTexture(imageNamed: "player")
    player.texture = texture
}

// CORRECT - Cache textures
private let playerTexture = SKTexture(imageNamed: "player")
private let playerTextures: [SKTexture] = []

override func didMove(to view: SKView) {
    playerTextures = (1...8).map { SKTexture(imageNamed: "player_walk_\($0)") }
}
```

### DO NOT: Use physics for non-physics movement

```swift
// WRONG - Physics overhead for simple movement
func movePlayer(to target: CGPoint) {
    let direction = CGVector(dx: target.x - player.position.x, dy: target.y - player.position.y)
    player.physicsBody?.velocity = direction
}

// CORRECT - Direct position manipulation
func movePlayer(to target: CGPoint, deltaTime: TimeInterval) {
    let direction = CGVector(dx: target.x - player.position.x, dy: target.y - player.position.y)
    let length = sqrt(direction.dx * direction.dx + direction.dy * direction.dy)
    if length > 0 {
        let speed: CGFloat = 200
        player.position.x += (direction.dx / length) * speed * CGFloat(deltaTime)
        player.position.y += (direction.dy / length) * speed * CGFloat(deltaTime)
    }
}
```

### DO NOT: Use global texture atlas

```swift
// WRONG - One massive atlas
// Assets.xcassets/GameAtlas.spriteatlas (containing all 500 sprites)

// CORRECT - Organized by usage
// Assets.xcassets/Characters.spriteatlas (player, enemies)
// Assets.xcassets/Environment.spriteatlas (tiles, backgrounds)
// Assets.xcassets/Effects.spriteatlas (particles, explosions)
// Assets.xcassets/UI.spriteatlas (buttons, icons)
```

### DO NOT: Ignore sibling order when performance matters

```swift
// WRONG - Default sorting (expensive)
let scene = GameScene(size: view.bounds.size)
view.presentScene(scene)

// CORRECT - Disable sorting, use zPosition
view.ignoresSiblingOrder = true
// Then set zPosition explicitly on all nodes
node.zPosition = 100
```

## Adjacent Skills

- **swiftui-game-ui**: Overlay menus, HUDs, and UI components on SpriteKit games
- **performance-optimizer**: Monitor frame rates, thermal state, and optimize for 120Hz
- **asset-pipeline**: Prepare textures with proper ASTC compression for SpriteKit
- **analytics-integration**: Track gameplay events and progression through SpriteKit scenes
- **01-compliance/game-center-integration**: Add achievements and leaderboards to SpriteKit games
