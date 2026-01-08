---
description: Generate HTML5 game preview and open in browser for visual feedback
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_screenshot
---

# Preview Command

Generate and display an HTML5 game preview for rapid visual iteration.

## Usage

```
/preview [game-name]
```

## What This Command Does

1. **Check** for existing game code in `preview/game.js`
2. **Generate** or update game code if needed
3. **Open** `preview/index.html` in browser via Playwright
4. **Capture** initial screenshot
5. **Report** what's displayed

## Steps to Execute

### Step 1: Verify Preview System

Ensure these files exist:
- `preview/index.html` - iPhone frame template
- `preview/game-renderer.js` - Rendering utilities

### Step 2: Check/Create Game Code

Look for `preview/game.js`. If it doesn't exist or needs updating based on user request, generate game code using the game-preview skill patterns:

```javascript
// Template structure
class GameName {
    constructor() {
        this.scene = new Scene({
            width: GameRenderer.SCREEN_WIDTH,
            height: GameRenderer.SCREEN_HEIGHT
        });
        this.setupGame();
    }
    // ... implement required methods
}
window.gameInstance = new GameName();
```

### Step 3: Open in Browser

Use Playwright to navigate:
```
mcp__playwright__browser_navigate
url: file://${PWD}/preview/index.html
```

### Step 4: Capture Screenshot

Wait 1 second for render, then capture:
```
mcp__playwright__browser_screenshot
```

### Step 5: Analyze and Report

Describe what's visible:
- Game objects and their positions
- UI elements (score, buttons)
- Any visual issues observed

## Example Output

```markdown
## Preview Generated

**Game**: Tap the Circle
**File**: preview/game.js

### Screenshot Analysis
- Blue circle rendered at center (589, 1000)
- Score label shows "0" at top (below safe area)
- Background is dark (#1a1a2e)
- Touch feedback indicator visible

### Status
✅ Renders correctly
✅ Within safe areas
⚠️ Circle could be more prominent

### Next Steps
- Tap to test interaction
- Check score updates
- Adjust circle size if needed
```

## Notes

- The preview approximates iOS rendering in browser
- Touch coordinates are automatically transformed
- Use debug overlay (toggle in controls) for FPS/state info
- Screenshots are saved with timestamps when using the UI button
