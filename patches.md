# Ralph Patches - Game Development Knowledge Base

> **Purpose**: When Ralph encounters a problem and solves it, the problem-solution pair is recorded here. Future iterations consult this file FIRST, using proven solutions instead of guessing. This file grows smarter over time.

---

## How To Use This File

### During Ralph Loop
1. **Before fixing**: Search this file for matching problem patterns
2. **If match found**: Apply the documented solution
3. **If no match**: Debug, solve, then document the new patch
4. **After solving**: Add entry with problem pattern + solution

### Patch Entry Format
```markdown
## PATCH-XXX: [Short Title]
**Problem Pattern:** [What the issue looks like - symptoms]
**Root Cause:** [Why it happens - the actual bug]
**Solution:** [How to fix it - specific steps/code]
**Affected Skills:** [Which skills should eventually incorporate this]
**Date Added:** [YYYY-MM-DD]
**Iterations to Solve:** [How many iterations it took]
```

---

## Index by Symptom

Quick lookup table - find your symptom, get the patch number.

| Symptom | Patch |
|---------|-------|
| Blank/white screen | PATCH-001 |
| Particles not visible | PATCH-002 |
| Touch not responding | PATCH-003 |
| Safe area violation (top) | PATCH-004 |
| Safe area violation (bottom) | PATCH-005 |
| Animation not playing | PATCH-006 |
| Score not updating | PATCH-007 |
| Game state stuck | PATCH-008 |
| 60 FPS drops | PATCH-009 |
| Sound not playing | PATCH-010 |

---

## Index by Skill

Which patches relate to which skills.

| Skill | Related Patches |
|-------|-----------------|
| game-preview | PATCH-001, PATCH-003 |
| particle-effects | PATCH-002 |
| spritekit-patterns | PATCH-003, PATCH-006 |
| animation-system | PATCH-006 |
| performance-optimizer | PATCH-009 |
| audio-designer | PATCH-010 |

---

## Patches

### PATCH-001: Blank Canvas on Initial Render
**Problem Pattern:** Screenshot shows white/blank canvas after page load. No game elements visible.
**Root Cause:** Game scene not initialized before first render frame. The `setup()` method must be called, and there must be a delay before screenshot capture.
**Solution:**
```javascript
// In game.js - ensure setup is called
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.setup();  // REQUIRED - must be explicit
  game.start();
});

// In visual testing - add delay before screenshot
await page.goto(previewUrl);
await page.waitForTimeout(1000);  // Wait for render
await page.screenshot({ path: 'initial.png' });
```
**Affected Skills:** game-preview, visual-testing
**Date Added:** 2025-01-07
**Iterations to Solve:** 1

---

### PATCH-002: Particles Not Visible
**Problem Pattern:** ParticleEmitter created and added to scene, but no particles appear on screen.
**Root Cause:** ParticleEmitter requires explicit `start()` call after being added to scene. Constructor alone doesn't begin emission.
**Solution:**
```javascript
// WRONG - particles won't appear
const emitter = new ParticleEmitter({
  particleCount: 20,
  color: Color.yellow
});
scene.addChild(emitter);

// CORRECT - must call start()
const emitter = new ParticleEmitter({
  particleCount: 20,
  color: Color.yellow
});
scene.addChild(emitter);
emitter.start();  // REQUIRED
```
**Affected Skills:** particle-effects, juice-orchestrator
**Date Added:** 2025-01-07
**Iterations to Solve:** 2

---

### PATCH-003: Touch Events Not Registering
**Problem Pattern:** Tapping on game elements produces no response. Touch coordinates may be logged but game doesn't react.
**Root Cause:** Event listener attached to wrong element (container div instead of canvas), or coordinate transformation not applied for Retina scaling.
**Solution:**
```javascript
// Attach to canvas, not container
const canvas = document.getElementById('game-canvas');
canvas.addEventListener('click', (e) => {
  // Transform coordinates for Retina (3x scale)
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  game.handleTap(x, y);
});
```
**Affected Skills:** spritekit-patterns, game-preview
**Date Added:** 2025-01-07
**Iterations to Solve:** 1

---

### PATCH-004: Safe Area Violation (Top)
**Problem Pattern:** UI elements (score, pause button, labels) overlap with Dynamic Island or status bar area.
**Root Cause:** Not accounting for safe area insets. Top safe area on iPhone with Dynamic Island is 162px (at 3x scale = 54pt).
**Solution:**
```javascript
// Use constants from GameRenderer
const SAFE_AREA_TOP = 162;  // pixels at 3x scale

// Position elements below safe area
const scoreLabel = new LabelNode({
  text: 'Score: 0',
  position: { x: CANVAS_WIDTH / 2, y: SAFE_AREA_TOP + 50 }
});
```
**Affected Skills:** swiftui-game-ui, spritekit-patterns
**Date Added:** 2025-01-07
**Iterations to Solve:** 1

---

### PATCH-005: Safe Area Violation (Bottom)
**Problem Pattern:** UI elements overlap with Home Indicator area at bottom of screen.
**Root Cause:** Not accounting for bottom safe area. Home Indicator area is 102px (at 3x scale = 34pt).
**Solution:**
```javascript
// Use constants from GameRenderer
const SAFE_AREA_BOTTOM = 102;  // pixels at 3x scale
const CANVAS_HEIGHT = 2556;

// Position elements above safe area
const playButton = new SpriteNode({
  position: {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - SAFE_AREA_BOTTOM - 100
  }
});
```
**Affected Skills:** swiftui-game-ui, spritekit-patterns
**Date Added:** 2025-01-07
**Iterations to Solve:** 1

---

### PATCH-006: Animation Not Playing
**Problem Pattern:** Action created and applied to node, but no visible animation occurs.
**Root Cause:** Action not added to scene's update loop, or node not added to scene before action applied.
**Solution:**
```javascript
// WRONG ORDER - action applied before node in scene
const sprite = new SpriteNode({ ... });
sprite.runAction(Action.fadeIn(0.5));
scene.addChild(sprite);  // Too late!

// CORRECT ORDER - add to scene first
const sprite = new SpriteNode({ ... });
scene.addChild(sprite);
sprite.runAction(Action.fadeIn(0.5));  // Now it works

// Also ensure scene update loop processes actions
update(deltaTime) {
  this.children.forEach(child => {
    child.updateActions(deltaTime);  // REQUIRED
  });
}
```
**Affected Skills:** animation-system, spritekit-patterns
**Date Added:** 2025-01-07
**Iterations to Solve:** 2

---

### PATCH-007: Score Not Updating
**Problem Pattern:** Player collects items or completes actions, but score display shows initial value.
**Root Cause:** Score variable updated but label text not refreshed, or label reference lost.
**Solution:**
```javascript
// Keep reference to label
this.scoreLabel = new LabelNode({ text: 'Score: 0' });
scene.addChild(this.scoreLabel);

// Update label text when score changes
addScore(points) {
  this.score += points;
  this.scoreLabel.text = `Score: ${this.score}`;  // Must update text property
}
```
**Affected Skills:** spritekit-patterns, swiftui-game-ui
**Date Added:** 2025-01-07
**Iterations to Solve:** 1

---

### PATCH-008: Game State Stuck
**Problem Pattern:** Game doesn't transition between states (menu → playing → game over). Buttons may not respond or state change doesn't trigger.
**Root Cause:** State machine not properly implemented, or state transition methods not called.
**Solution:**
```javascript
// Proper state machine pattern
const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

class Game {
  constructor() {
    this.state = GameState.MENU;
  }

  setState(newState) {
    const oldState = this.state;
    this.state = newState;
    this.onStateChange(oldState, newState);  // Trigger transition
  }

  onStateChange(from, to) {
    // Clean up old state
    if (from === GameState.PLAYING) {
      this.stopGameLoop();
    }
    // Setup new state
    if (to === GameState.PLAYING) {
      this.startGameLoop();
    }
  }
}
```
**Affected Skills:** core-loop-architect, spritekit-patterns
**Date Added:** 2025-01-07
**Iterations to Solve:** 2

---

### PATCH-009: 60 FPS Drops
**Problem Pattern:** Game runs below 60 FPS, visible stuttering or lag during gameplay.
**Root Cause:** Too many objects, unoptimized render loop, or garbage collection pressure.
**Solution:**
```javascript
// Object pooling for frequently created objects
class ObjectPool {
  constructor(factory, initialSize = 20) {
    this.pool = [];
    this.factory = factory;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  get() {
    return this.pool.pop() || this.factory();
  }

  release(obj) {
    obj.reset();
    this.pool.push(obj);
  }
}

// Use pool for particles, coins, etc.
const coinPool = new ObjectPool(() => new Coin());

// Spawn from pool instead of new
const coin = coinPool.get();
scene.addChild(coin);

// Return to pool instead of destroy
scene.removeChild(coin);
coinPool.release(coin);
```
**Affected Skills:** performance-optimizer, spritekit-patterns
**Date Added:** 2025-01-07
**Iterations to Solve:** 3

---

### PATCH-010: Sound Not Playing
**Problem Pattern:** Audio configured but no sound heard during gameplay.
**Root Cause:** Audio context suspended (browser autoplay policy), or audio files not preloaded.
**Solution:**
```javascript
// Resume audio context on first user interaction
document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}, { once: true });

// Preload audio files
const sounds = {};
async function preloadSounds() {
  const files = ['tap.mp3', 'collect.mp3', 'gameover.mp3'];
  for (const file of files) {
    const response = await fetch(`sounds/${file}`);
    const buffer = await response.arrayBuffer();
    sounds[file] = await audioContext.decodeAudioData(buffer);
  }
}

// Play sound
function playSound(name) {
  const source = audioContext.createBufferSource();
  source.buffer = sounds[name];
  source.connect(audioContext.destination);
  source.start();
}
```
**Affected Skills:** audio-designer, juice-orchestrator
**Date Added:** 2025-01-07
**Iterations to Solve:** 2

---

## Statistics

| Metric | Value |
|--------|-------|
| Total Patches | 10 |
| Average Iterations to Solve | 1.6 |
| Most Common Category | Rendering/Display |
| Skills Most Referenced | spritekit-patterns (6), game-preview (2) |

---

## Adding New Patches

When Ralph solves a new problem:

1. **Find next PATCH number**: Look at last entry, increment
2. **Document the pattern**: What did the issue look like in screenshots?
3. **Identify root cause**: Why did this happen?
4. **Write clear solution**: Include code that can be copy-pasted
5. **Link to skills**: Which skills should eventually learn this?
6. **Update indices**: Add to symptom and skill tables
7. **Update statistics**: Increment counts

---

## Patch Graduation

When a patch is used successfully 5+ times:
1. Consider incorporating into the relevant skill
2. Add to skill's "Common Gotchas" section
3. Mark patch as "Graduated to [skill-name]"
4. Keep in patches.md for reference but mark as graduated
