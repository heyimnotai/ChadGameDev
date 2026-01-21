# Rendering API Reference

## Class Mapping (iOS → Preview)

| iOS Concept | Preview Equivalent |
|-------------|-------------------|
| SKSpriteNode | SpriteNode |
| SKShapeNode | ShapeNode |
| SKLabelNode | LabelNode |
| SKAction | Action |
| SKScene | Scene |
| CGPoint | Vector2 |
| UIColor | Color |
| SKPhysicsBody | PhysicsBody |
| SKEmitterNode | ParticleEmitter |

## Color System

```javascript
// iOS system colors
Color.red, Color.blue, Color.green, Color.yellow,
Color.orange, Color.purple, Color.pink, Color.cyan,
Color.mint, Color.teal, Color.indigo, Color.gray,
Color.white, Color.black, Color.clear

// Custom colors
new Color(r, g, b, a)  // 0-1 range
Color.fromHex('#FF5733')
```

## Game Class Template

```javascript
// REQUIRED: Reset state before new game
if (window.preview && window.preview.resetGameState) {
    window.preview.resetGameState();
}

class MyGame {
    constructor() {
        this.scene = new Scene({
            width: GameRenderer.SCREEN_WIDTH,
            height: GameRenderer.SCREEN_HEIGHT
        });
        this.scene.backgroundColor = Color.black;
        this.setupGame();
    }

    setupGame() { /* Create game objects */ }
    update(deltaTime) { this.scene.update(deltaTime); }
    render(ctx, width, height) { this.scene.render(ctx, width, height); }
    handleTouch(type, x, y) { /* 'began', 'moved', 'ended' */ }
    getScore() { return this.score; }
    restart() { /* Reset game */ }
    cleanup() { /* Clear intervals before switching */ }
}

window.gameInstance = new MyGame();
```

## Actions (Animations)

```javascript
// Movement
Action.moveTo(new Vector2(x, y), duration)
Action.moveBy(new Vector2(dx, dy), duration)

// Transform
Action.scaleTo(scale, duration)
Action.rotateTo(angle, duration)  // radians

// Fade
Action.fadeIn(duration)
Action.fadeOut(duration)

// Composition
Action.sequence([action1, action2])
Action.repeatForever(action)

// Timing
action.timingFunction = Action.easeIn
action.timingFunction = Action.easeOut
action.timingFunction = Action.easeInOut
```

## Best Practices

- Touch targets: minimum 44pt (132px at 3x)
- Don't place UI under Dynamic Island (top 162px) or Home Indicator (bottom 102px)
- Use system colors for iOS consistency
- Match iOS animation curves (ease out for most UI)
