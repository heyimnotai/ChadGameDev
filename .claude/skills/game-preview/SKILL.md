---
name: game-preview
description: Generate HTML5 game previews from SpriteKit/SwiftUI concepts for rapid visual iteration
triggers:
  - preview game
  - generate preview
  - show me the game
  - visualize
---

# Game Preview Skill

Generate browser-based game previews that approximate native iOS SpriteKit/SwiftUI rendering for rapid visual feedback during development.

## Overview

This skill translates iOS game concepts into HTML5 Canvas code that runs in the preview template. The preview renders in a realistic iPhone frame with:
- Dynamic Island
- Status bar (time, signal, battery)
- Home indicator
- Touch interaction support
- Debug overlay (FPS, game state, score)

## Rendering Primitives

### Available Classes (game-renderer.js)

| iOS Concept | Preview Equivalent |
|-------------|-------------------|
| SKSpriteNode | SpriteNode |
| SKShapeNode | ShapeNode |
| SKLabelNode | LabelNode |
| SKAction | Action |
| SKScene | Scene |
| CGPoint | Vector2 |
| UIColor/Color | Color |
| SKPhysicsBody | PhysicsBody |
| SKEmitterNode | ParticleEmitter |

### Color System

Use iOS system colors:
```javascript
Color.red, Color.blue, Color.green, Color.yellow,
Color.orange, Color.purple, Color.pink, Color.cyan,
Color.mint, Color.teal, Color.indigo, Color.gray,
Color.white, Color.black, Color.clear
```

Or create custom:
```javascript
new Color(r, g, b, a)  // 0-1 range
Color.fromHex('#FF5733')
```

## Creating a Preview

### Step 1: Write Game Code

Create `preview/game.js` with your game logic:

```javascript
class MyGame {
    constructor() {
        this.scene = new Scene({
            width: GameRenderer.SCREEN_WIDTH,
            height: GameRenderer.SCREEN_HEIGHT
        });
        this.scene.backgroundColor = Color.black;
        this.score = 0;
        this.setupGame();
    }

    setupGame() {
        // Create game objects using SpriteNode, ShapeNode, LabelNode
    }

    update(deltaTime) {
        this.scene.update(deltaTime);
        // Game logic here
    }

    render(ctx, width, height) {
        this.scene.render(ctx, width, height);
    }

    handleTouch(type, x, y) {
        // type: 'began', 'moved', 'ended'
    }

    getScore() { return this.score; }
    getObjectCount() { return this.scene.children.length; }
    restart() { /* Reset game state */ }
    reset() { /* Full reset */ }
}

window.gameInstance = new MyGame();
```

### Step 2: Include in Preview

Add script tag to index.html before closing body:
```html
<script src="game.js"></script>
```

### Step 3: View Preview

Open `preview/index.html` in browser or use Playwright.

## Screen Coordinates

- Canvas resolution: 1179 x 2556 (3x Retina)
- Logical resolution: 393 x 852
- Safe area top: 162px (below Dynamic Island)
- Safe area bottom: 102px (above Home Indicator)

## Actions (Animations)

```javascript
// Move
Action.moveTo(new Vector2(x, y), duration)
Action.moveBy(new Vector2(dx, dy), duration)

// Scale
Action.scaleTo(scale, duration)

// Fade
Action.fadeIn(duration)
Action.fadeOut(duration)

// Rotate
Action.rotateTo(angle, duration)  // radians
Action.rotateBy(delta, duration)

// Sequence
Action.sequence([action1, action2, ...])

// Repeat
Action.repeatForever(action)

// Timing functions
action.timingFunction = Action.easeIn
action.timingFunction = Action.easeOut
action.timingFunction = Action.easeInOut
```

## Best Practices

1. **Match iOS patterns**: Use the same class structure you'd use in SpriteKit
2. **Test touch targets**: Ensure tappable areas are at least 44pt (132px at 3x)
3. **Check safe areas**: Don't place critical UI under Dynamic Island or Home Indicator
4. **Use debug overlay**: Toggle it on to monitor FPS and game state
5. **Take screenshots**: Use the screenshot button or `preview.canvas.toDataURL()`

## Output Format

When generating a preview, output:
1. The complete game.js file
2. Any required asset references
3. Instructions to view (typically `open preview/index.html`)
